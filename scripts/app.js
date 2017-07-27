var APP = APP || {};

APP = (  function(){

  var WEB_URL = "https://teams.deloitte.com/sites/FDAJDD/Sandbox/";

  function getURL(){
    return WEB_URL;
  }

  function getData(  method, file  ){
    var req,
        res,
        data;

        req = new XMLHttpRequest();
        req.open(  method, file  );
        req.onreadystatechange = function(){
          if( req.readyState === 4 && req.status === 200  ){
            res = JSON.parse(  req.responseText  );
            console.log(  res  );
          }
        }
        req.send();
  }


  return(
    {
      getURL    :   getURL,
      getData   :   getData
    }
  )
}  )();
