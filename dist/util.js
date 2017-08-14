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
  /******************END EVENT HANDLERS********************************/
  return(
    {
      extendDeep        :         extendDeep,
      initPMAPReview    :         initPMAPReview,
      handleEditClick   :         handleEditClick
    }
  )
}  )(  APP  );
