APP.Staff = (  function(){
  var confObj = {  SP_id:  '1'  },
      staffObjCache = staffObjCache || {};

  /*****************BEGIN CONSTRUCTOR FUNCTION Staff************************/
  function Staff(  confObj  ){
    this[  'SP-ID'  ] = confObj.SP_id;
    this[  'firstName'  ] = confObj.firstName;
    this[  'lastName'  ] = confObj.lastName;
    if(  !this instanceof Staff  ){
      return new Staff(  confObj  );
    }
  }
  /*****************END CONSTRUCTOR FUNCTION Staff************************/

  function getStaffObjCache(){
    return staffObjCache;
  }

  function setStaffObjCache(  obj  ){
    staffObjCache.employee = obj;
  }
  /****************BEGIN PUBLIC API****************************/
  return(
    {
      Staff             :         Staff,
      getStaffObjCache  :         getStaffObjCache,
      setStaffObjCache  :         setStaffObjCache
    }
  )
})();
