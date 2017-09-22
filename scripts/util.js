/*
*Filename         :         util.js
*Create Date      :         08/10/2017  20:16EST
*Author           :         jFarrow02
*Purpose          :         Utility functions
*/

/**
*@module APP
*@main APP
*@class util
*/
APP.util = (  function(  app  ){
  /******************BEGIN FUNCTION EXTEND DEEP***************************/
  	/**
  	*Creates a deep copy of an object/array
  	*@method extendDeep
  	*@param {Object|Array} parent Object/array to be copied
  	*@param {Object|Array} child Object/array to receive the copied properties
    *@return {Object} `child` Child object with copies of parent properties
  	*@inner
  	*/
  	function extendDeep(  parent, child  ){
      var i,
      toStr = Object.prototype.toString,
      astr = '[object Array]';

      child = child || {};

      for( i in parent  ){
        if(  parent.hasOwnProperty(  i  )  ){
          if(  typeof parent[  i  ] === 'object'  ){
            child[  i  ] = (  toStr.call(  parent[  i  ]  ) === astr  )  ? [] : {};
            extendDeep(  parent[  i  ], child[  i  ]  );
          }else{
            child[  i  ] = parent[  i  ];
          }
        }
      }
      return child;
    }
  /*******************END FUNCTION EXTEND DEEP***************************/

  /******************BEGIN EVENT HANDLERS********************************/
  function initPMAPReview( event, callback, revieweeObj){
    // console.log(  'Clicked!' + event.target  );  -->OK
    revieweeObj[  'SP-ID'  ] = event.target.dataset.recordId;
    app.Staff.setStaffObjCache(  revieweeObj  );
    console.log(  'FROM INSIDE initPMAPReview: '  );
    console.dir(  app.Staff.getStaffObjCache()  );  //-->OK
    if(  app.Staff.getStaffObjCache().employee !== null && app.Staff.getStaffObjCache().employee !== 'undefined'  ){
      callback();
    }
    // console.log( "Passed reviewee object: "  );
    // console.dir(  revieweeObj  );  -->OK

  }

  //Returns anonymous function with event obj passed as param
  //returned function calls the initPMAPReview function,
  //passing event object [passed originally to anonymous function]
  //AND parameter(s) passed to original [handleEditClick] function
  function handleEditClick(  cb  ){
    return function(  e  ){
    var reviewee = new app.Staff.Staff(  {  'SP-ID' : e.target.dataset.recordID  }  );
      initPMAPReview(  e, cb, reviewee  );
    };
  }
  /**************************END EVENT HANDLERS********************************/

  /******************BEGIN URL CREATE/PARSE FUNCTIONS**************************/

  /*******************BEGIN FUNCTION getCurrentURL******************************/
  /**
  *Returns URL of current document
  *@method getCurrentURL
  *@return {String} String object representing URL of current document (as `window.location.href`
  *property)
  *@inner
  */
  function getCurrentURL(){
    return window.location.href;
  }
  /******************END FUNCTION getCurrentURL********************************/

  /******************BEGIN FUNCTION appendToURL***************************/
  function appendToURL(  url, qString  ){
    return url + '&' + qString;
  }
  /******************END FUNCTION appendToURL***************************/

  /******************BEGIN FUNCTION nextURL*****************************/
  /**
  *Builds URL of next document to be loaded and redirects to new URL
  *@method nextURL
  *@param {Object} currentRevieweeObj Object representing the employee record
  *under current PMAP reviewee
  *@param {String} href String representing URL of destination document, with query
  *paramaters representing current reviewee and document ID
  *@return {none}
  *@inner
  */
  function nextURL(  currentRevieweeObj, href  ){
    if(  currentRevieweeObj  ){
      href += '?id=' + currentRevieweeObj.id;
      href += '&firstName=' + currentRevieweeObj.firstName;
      href += '&lastName=' + currentRevieweeObj.lastName;
      href += '&mgrSuprFlag=' + currentRevieweeObj.mgrSuprFlag;
      href += '&pmapDocID=' + currentRevieweeObj.pmapDocID;

      //Load next page
      window.location.assign(  href  );
    }
    else{
      window.location.assign(  './index3.html'  );
    }
  }
  /*******************END FUNCTION nextURL*****************************/

  /*******************BEGIN FUNCTION attachNextURLs*****************************/
  // function attachNextURLs(  qString  ){
  //   var $anchors = $(  'a'  ).has(  'div[id="colap"]'  ).add(  '#continue'  ),
  //       currentReviewee = APP.spsQuery.parseCurrentReviewee();
  //       //href = qString ? this.getAttribute(  'href'  ) + qString : this.getAttribute(  'href'  );
  //       //app.spsQuery.queryCurrentReviewee(  currentReviewee  );
  //   $anchors.each(  function(  index, thisElem  ){
  //
  //     var href = qString ?  qString : this.getAttribute(  'href'  );
  //     //app.dom.attachRevieweeURL(anchor, revieweeObj, hrefAttr)
  //     app.dom.attachRevieweeURL(  this, currentReviewee, href  );
  //   }  );
  // }
    function attachNextURLs(  revieweeObj  ){
      var $anchors = $(  'a'  ).has(  'div[id="colap"]'  ).add(  '#continue'  ).add(  '#save'  );

      if( revieweeObj  ){
        var params = $.param(  revieweeObj  );
        $anchors.each(  function(  index, thisElem  ){
          var currHref = thisElem.getAttribute(  'href'  );
          thisElem.setAttribute(  'href', currHref + '?' + params  );
        }  );
      }
    }
  /**********************END FUNCTION attachNextURLs****************************/

  /******************BEGIN FUNCTION redirectOnNullParams***********************/
  function redirectOnNullReviewee(  currentReviewee  ){
    var url = getCurrentURL(),
        index = './index.html';
    console.log(  'From redirectONNullReviewee: '  );
    console.log(  currentReviewee  );
    if(  currentReviewee.firstName === '' && currentReviewee.lastName === ''
        && currentReviewee.id === ''  ){
      //   if()
      // }
      window.location.assign(  index  );
    }
  }
  /*********************END FUNCTION redirectOnNullParams***********************/
/*********************END URL CREATE/PARSE FUNCTIONS****************************/


  return(
    {
      extendDeep                :         extendDeep,
      initPMAPReview            :         initPMAPReview,
      handleEditClick           :         handleEditClick,
      getCurrentURL             :         getCurrentURL,
      appendToURL               :         appendToURL,
      nextURL                   :         nextURL,
      attachNextURLs            :         attachNextURLs,
      redirectOnNullReviewee    :         redirectOnNullReviewee
    }
  )
}  )(  APP  );
