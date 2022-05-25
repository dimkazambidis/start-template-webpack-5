/**
 * Element.closest() polyfill
*/
if ( !Element.prototype.closest ) {
    if ( !Element.prototype.matches ) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    Element.prototype.closest = function (s) {
        let el = this;
        let ancestor = this;

    if ( !document.documentElement.contains(el) ) return null;
        do {
            if ( ancestor.matches(s) ) return ancestor;
                ancestor = ancestor.parentElement;
        } while ( ancestor !== null ) {
            return null;
        }
    }
}

let activeExamples = [];

const settings = {
    src: '',
    position: 'center',
    content: '',
    closeTemplate: 'Close',
    beforeShow( popup ) {},
    afterShow( popup ) {},
    beforeHide( popup ) {},
    afterHide( popup ) {}
}

export default function Popup( options = {} ) {
    let selfPopup = this;

    this.activePopup = [];
    this.selector = '[data-popup]';
    this.options = options;
    this.options.__proto__ = settings;

    this.init = function( selector = this.selector, options = {} ) {
        options.__proto__ = this.options;

        let popupCreate = this.popupCreate;
        
        let activators = document.querySelectorAll( selector );
        for ( let i = 0; i < activators.length; i++ ) {
            let activator = activators[i];

            let dataSrc = activator.getAttribute( 'data-popup-src' );
            let src = ( dataSrc ) ? dataSrc : options.src;

            let dataPos = activator.getAttribute( 'data-popup-pos' );
            let pos = ( dataPos ) ? dataPos : options.position;

            let content;
            let contentHasElement;
            let popupId = i;
            
            if ( src ) {
                content = document.querySelector( src );
                if ( content ) {
                    content.style.display = 'none';
                }
                contentHasElement = src;
            } else {
                content = options.content;
                contentHasElement = '';
            }

            // Click Activator
            activator.addEventListener( 'click', function(e) {
                e.preventDefault();

                let popup = popupCreate(
                    content,
                    contentHasElement,
                    popupId,
                    pos,
                    options
                );
                popupIn( popup );
            });
        }
    }
    this.show = function( options = {} ) {
        options.__proto__ = this.options;

        let popupCreate = this.popupCreate;

        let content = ( options.src ) ? document.querySelector( options.src ) : options.content;
        let position = ( options.position ) ? options.position : 'center';
        let contentHasElement = ( options.src ) ? options.src : '';
        let popup = popupCreate( content, contentHasElement, 'single', position, options );

        popupIn( popup );
    }
    this.hide = function() {
        let countActivePopup = selfPopup.activePopup.length;
        if ( countActivePopup > 0 ) {
            popupOut( selfPopup.activePopup[ countActivePopup - 1 ] );
        }
    }
    this.hideAll = function() {
        for ( let i = 0; i < activeExamples.length; i++ ) {
            activeExamples[i].hide();
            //console.log( activeExamples[i].activePopup );
            // let actPopupList = activeExamples[i].activePopup;
            // for ( let i = 0; i < actPopupList.length; i++ ) {
            //     let actPopup = actPopupList[i];
            //     popupOut( actPopup );
            // }
        }
    }
    this.popupCreate = function( content, contentHasElement, popupID, position, options ) {
        let popup = document.createElement( 'div' );
        let darker = document.createElement( 'div' );
        let wrapper = document.createElement( 'div' );
        let container = document.createElement( 'div' );
        let contentContainer = document.createElement( 'div' );
        
        popup.classList.add( 'scom-popup', position );
        popup.setAttribute('data-popup-for', contentHasElement);
        popup.setAttribute('id', popupID);
        popup.setAttribute( 'data-popup-index', indexPopup() );
        darker.classList.add( 'scom-popup-darker' );
        wrapper.classList.add( 'scom-popup-wrapper' );
        container.classList.add( 'scom-popup-container' );
        contentContainer.classList.add( 'scom-popup-main' );

        popup.append( darker, wrapper );
        wrapper.append( container );
        container.append( contentContainer );

        // if ( options.closeTemplate ) {
        //     let close = document.createElement( 'a' );
        //     close.classList.add( 'scom-popup-close' );
        //     close.setAttribute( 'href', '#' );
        //     close.innerHTML = options.closeTemplate; // Tpl of close button
        //     contentContainer.append( close );
        // }

        if ( contentHasElement ) {
            let placeholder = document.createElement( 'div' );
            placeholder.classList.add( 'scom-popup-placeholder' );
            placeholder.setAttribute( 'from-id', popupID );
            content.before( placeholder );
            content.style.display = '';
        }
        contentContainer.append( content );

        let closers = popup.querySelectorAll( '[data-popup-close]' );
        for ( let i = 0; i < closers.length; i++ ) {
            let closer = closers[i];

            closer.addEventListener( 'click', function(e) {
                e.preventDefault();

                popupOut( popup );
            });
        }
        popup.addEventListener( 'click', function(e) {
            let pathParents = e.path || (e.composedPath && e.composedPath());
            let pos = pathParents.indexOf( content );
            if ( pos === -1 ) {
                popupOut( popup )
            }
        });

        return popup
    }

    function popupIn( popup ) {
        let popupsVisible = document.querySelectorAll('.scom-popup.visible');
        let popupsVisibleCount = popupsVisible.length;

        document.body.appendChild( popup );
        selfPopup.options.beforeShow( popup );
    
        // Fixed Body and hide scrollbar (fix content offset)
        // let srollBar = window.innerWidth - document.body.clientWidth;
        // let header = document.getElementById( 'site-header' );

        //if ( !document.body.classList.contains( 'popup-on' ) ) {
            // document.body.classList.add( 'popup-on' );
            // document.body.style.paddingRight = srollBar + 'px';
            // popup.style.paddingRight = srollBar + 'px';
            // header.style.paddingRight = srollBar + 'px';
        //}
        activeExamples.push(selfPopup);
        setTimeout(() => {
            // Fixed Body and hide scrollbar (fix content offset)
            let srollBar = window.innerWidth - document.body.clientWidth;
            // let header = document.getElementById( 'site-header' );

            popup.classList.add( 'visible' );
            selfPopup.activePopup.push( popup );
            selfPopup.options.afterShow( popup );

            if ( popupsVisibleCount < 1 ) {
                document.documentElement.classList.add( 'no-scroll' );
                document.body.classList.add( 'popup-on' );
                document.body.style.paddingRight = srollBar + 'px';
                popup.style.paddingRight = srollBar + 'px';
                // header.style.paddingRight = srollBar + 'px';

                /////////////// Fix Scroll Body For Safari In
                // if ( !document.body.hasAttribute('data-body-scroll') ) {
                //     let scrollPos = window.pageYOffset || document.documentElement.scrollTop;

                //     document.body.setAttribute('data-body-scroll', scrollPos);
                //     document.body.style.position = 'fixed';
                //     document.body.style.top = '-' + scrollPos + 'px';
                //     document.body.style.width = '100%';
                // }
            }
        }, 50 );
    }
    
    function popupOut( popup ) {
        selfPopup.options.beforeHide( popup );
        
        // let header = document.getElementById( 'site-header' );
        let hasElement = Boolean( popup.getAttribute('data-popup-for') );
        // let popupsVisible = document.querySelectorAll('.scom-popup.visible');
        // let popupsVisibleCount = popupsVisible.length;
        let content = popup.querySelector('.scom-popup-main').childNodes[0];
        let placeholder;
    
        popup.classList.remove( 'visible' );

        // Remove event 'click' for closers * Start
        let closers = popup.querySelectorAll( '[data-popup-close]' );
        for ( let i = 0; i < closers.length; i++ ) {
            let closer = closers[i];
            let newCloser = closer.cloneNode( true );

            closer.after( newCloser );
            closer.remove();
        }
        // Remove event 'click' for closers * End
        selfPopup.activePopup.pop();
        activeExamples.pop();

        // if ( popupsVisibleCount < 2 ) {
        //     document.body.classList.remove('popup-on');
        //     document.body.style.paddingRight = '';
        //     header.style.paddingRight = '';
        // }

        // let popupsVisible = document.querySelectorAll('.scom-popup.visible');
        // let popupsVisibleCount = popupsVisible.length;
        
        // console.log( popupsVisibleCount );
        // if ( popupsVisibleCount < 2 ) {
        //     document.body.classList.remove('popup-on');
        //     document.body.style.paddingRight = '';
        //     header.style.paddingRight = '';
        // }
        
        setTimeout( function() {
            let popupsVisible = document.querySelectorAll('.scom-popup.visible');
            let popupsVisibleCount = popupsVisible.length;

            if ( popupsVisibleCount < 1 ) {
                document.documentElement.classList.remove( 'no-scroll' );
                document.body.classList.remove('popup-on');
                document.body.style.paddingRight = '';
                
                // window.scroll(0, scrollPosition);
                // header.style.paddingRight = '';

                ///////////////// Fix Scroll Body For Safari Out
                // if ( document.body.hasAttribute('data-body-scroll') ) {
                //     let scrollPos = document.body.getAttribute('data-body-scroll');

                //     document.body.removeAttribute('data-body-scroll');

                //     document.body.style.position = '';
                //     document.body.style.top = '';
                //     document.body.style.width = '';

                //     window.scroll(0, scrollPos);
                // }
            }
            
            // If content is element, return to place
            if ( hasElement ) {
                placeholder = document.querySelector(`[from-id="${ popup.getAttribute('id') }"]`);
                placeholder.after( content );
                content.style.display = 'none'
                placeholder.remove();
            }

            popup.remove();
            selfPopup.options.afterHide( popup );
        }, 450 );
    }

    function indexPopup() {
        let popupsVisible = document.querySelectorAll('.scom-popup.visible');
        let popupsVisibleCount = popupsVisible.length;
        
        return popupsVisibleCount;
    }
}

document.addEventListener('keydown', function(e) {
    if ( e.code === 'Escape' && activeExamples.length > 0 ) {
        let index = activeExamples.length - 1;
        activeExamples[index].hide();
    }
});