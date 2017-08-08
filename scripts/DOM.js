/*
*Filename       :       DOM.js
*Create Date    :       08-03-2017 11:19 EST
*Author         :       jFarrow02
*Purpose        :       App module for DOM creation/manipulation functions
*
*/

/**
@module APP
@class dom
*/
APP.dom = (  function(  window  ){

  /**
  *@method buildOverlay
  *@param {String} parent Reference to DOM element
  *to which overlay will be appended
  *@param {String} child Reference to DOM element to append
  *to overlay (if any)
  */
  function buildOverlay(  parent, child  ){
    var overlay = document.createElement(  'div'  );

    //Set position attribute of parent element to 'relative' for positioning of overlay
    parent.style.position = 'relative';

    //Set positiion and attributes of overlay
    overlay.setAttribute(  'id', "overlay"  );
    overlay.style.position = 'absolute';
    overlay.style.backgroundColor = 'rgba(51, 51, 51, 0.6)';
    overlay.style.width = window.innerWidth + 'px';
    overlay.style.height = window.innerHeight + 'px';
    overlay.style.top = window.pageYOffset + 'px';
    overlay.style.left = window.pageXOffset + 'px';
    overlay.style.zIndex = '200';

    window.addEventListener(  'resize', function(){
      if(  overlay  ){
        overlay.style.width = window.innerWidth + 'px';
        overlay.style.height = window.innerHeight + 'px';
        overlay.style.top = window.pageYOffset + 'px';
        overlay.style.left = window.pageXOffset + 'px ';
      }
    }, false);

    window.addEventListener(  'scroll', function(){
      if(  overlay  ){
        overlay.style.width = window.innerWidth + 'px';
        overlay.style.height = window.innerHeight + 'px';
        overlay.style.top = window.pageYOffset + 'px';
        overlay.style.left = window.pageXOffset + 'px ';
      }
    }, false  );

    //Append overlay to parent
    parent.appendChild(  overlay  );
    if(  child  ){
      overlay.appendChild(  child  );
    }
  }

  //Return public API

  return(
    {
      buildOverlay          :         buildOverlay
    }
  )
}  )(  this  );
