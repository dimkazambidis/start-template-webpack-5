// Modules
import $ from 'jquery';
import {media, mediaEvent} from './modules/media.js';
import Popup from './modules/popup.js';

// If jQuery
// $(function() {

// });

// If Native JS
(function() {

    /** Standart Comment ******************************/

    // Examples

    // Init Standart Popup
    let StandartPopup = new Popup({
        content: 'Standart Popup'
    });
    StandartPopup.init();

    // Init Starting Page Popup
    let StartPopup = new Popup({
        src: '#popup-bottom',
        position: 'bottom',
        afterShow() {
            console.log( 'Popup Show' )
        },
        afterHide() {
            console.log( 'Popup Hide' )
        }
    })

    setTimeout( function() {
        StartPopup.show();
    }, 300)
    
    setTimeout( function() {
        StartPopup.hide();
    }, 2300)

    // Usage Example Media for conditions
    // function windowWidth768() {
    //     if ( media.md ) {
    //         console.log( 'min-width 768px' )
    //     } else {
    //         console.log( 'max-width 767px' )
    //     }
    // }
    // windowWidth768()

    // window.addEventListener( 'resize', windowWidth768 )

    // Usage Example Media Alternative
    mediaEvent( 'lg', {
        in: function() {
            console.log( 'min-width 1024px' )
        },
        out: function() {
            console.log( 'max-width 1023px' )
        }
    });

}())
