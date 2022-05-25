let media = {
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false
}

const configMedia = {
  xs: '(min-width: 0)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1366px)'
}

const eventFunc = {
  in: function() {},
  out: function() {}
}

function mediaEvent( val, options = {} ) {
  options.__proto__ = eventFunc;
  let mediaArr = Object.entries( configMedia );
  let mediaIndex = Object.keys( configMedia ).indexOf( val );
  
  if ( window.matchMedia( configMedia[val] ).matches ) {
    options.in();
  } else {
    options.out();
  }
  
  for ( let i = 0; i < mediaArr.length; i++ ) {
    let mediaItem = mediaArr[i];
    let mediaKey = mediaItem[0];
    let breakpoint = window.matchMedia( mediaItem[1] );

    if ( breakpoint.matches ) {
      media[mediaKey] = true;
    }
    
    breakpoint.addEventListener( 'change', function() {
      if ( breakpoint.matches ) {
        if ( i === mediaIndex ) {
          options.in();
        }
        media[mediaKey] = true;
      } else {
        if ( i > 0 ) {
          if ( i === mediaIndex ) {
            options.out();
          }
        }
        media[mediaKey] = false;
      }
    });
  }
}
mediaEvent();

function mediaCheck( func ) {
  let mediaArr = Object.entries( configMedia );

  for ( let i = 0; i < mediaArr.length; i++ ) {
    let mediaItem = mediaArr[i];
    let mediaKey = mediaItem[0];
    let breakpoint = window.matchMedia( mediaItem[1] );
    
    breakpoint.addEventListener( 'change', function() {
      func();
    });
  }
}

export {media, mediaEvent, mediaCheck};

// export default class Media {
//   constructor( config = configMedia ) {
//     this.config = config,
//     this.xs = '111'
//   }

//   init() {
//     console.log('media');
//   }
  
//   // init( config = this.config ) {
//   //   function check() {
//   //     let index;

//   //     for ( let i = 0; i < config.length; i++ ) {
//   //       let breakpoint = window.matchMedia( config[i].breakpoint );
        
//   //       if ( breakpoint.matches ) {
//   //         index = i;
//   //       }

//   //       try {
//   //         breakpoint.addEventListener( 'change', function() {
//   //           if ( breakpoint.matches ) {
//   //             config[i].eventInit();
//   //           } else {
//   //             if ( i > 0 ) {
//   //               config[i - 1].eventInit();
//   //             }
//   //           }
//   //         });
//   //       } catch( err1 ) {
//   //         try {
//   //           breakpoint.addListener( function() {
//   //             if ( breakpoint.matches ) {
//   //               config[i].eventInit();
//   //             } else {
//   //               if ( i > 0 ) {
//   //                 config[i - 1].eventInit();
//   //               }
//   //             }
//   //           });
//   //         } catch( err2 ) {
//   //           console.error( err2 );
//   //         }
//   //       }
//   //     }

//   //     if ( index || index === 0 ) {
//   //       config[index].eventInit();
//   //     }
//   //   }
//   //   check();
//   // }
// }