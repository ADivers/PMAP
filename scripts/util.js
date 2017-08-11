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
APP.util = (  function(){
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

  return(
    {
      extendDeep        :         extendDeep
    }
  )
}  )();
