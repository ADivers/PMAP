var spsSnippets = (  function(){

  //Create private variables
  var webURL = "https://teams.deloitte.com/sites/FDAJDD/Sandbox/",
      listNameArr = [
        "AdminReqsCritElem", "AdminReqsMgrCritElem", "CommunicationsCritElem",
        "Employees", "HRLiaisonCritElem", "PerfPlanDevSignatures", "PMAPCalendar",
        "PMAPDocs", "ProgReviewRatingOfficialSignatures", "Rating", "SpecialProjectsCritElem",
        "SummaryRatings", "TeamworkCollabCriticalElem", "TechCompCritElem", "WrittenNarrative"
      ],
      spUl = document.createElement(  'ul'  );

      spUl.id = "sp_ul";

  //***************BEGIN SP LIST ITEM FUNCTIONS********************/
  function getAllLists(){
    for(  var i = 0; i < listNameArr.length; i++  ){
      var listItem = document.createElement(  'li'  );
      var listName = listNameArr[  i  ];

      $().SPServices(
          {
            operation       :       'GetList',
            webURL          :       webURL,
            listName        :       listNameArr[  i  ],
            completefunc    :       function(  xData, Status  ){
              //console.log(  xData.responseText  );
              console.log(  "**************************************************");
              $(  xData.responseXML  ).find(  'Fields  > Field'  ).each(  function(){
                var $node = $(  this  );
                console.log(  'Type: ' + $node.attr(  'Type'  )  + ' StaticName: ' + $node.attr(  'StaticName'  )  );
              }  );
            }
          }
      );
    }
  }

  return(
    {
      getAllLists       :       getAllLists
    }
  )
  // $().SPServices(
  //     {
  //       operation       :       'GetList',
  //       webURL          :       webURL,
  //       listName        :       'TEST_CAL01',
  //       completefunc    :       function(  xData, Status  ){
  //         console.log(  xData.responseText  );
  //         $(  xData.responseXML  ).find(  'Fields  > Field'  ).each(  function(){
  //           var $node = $(  this  );
  //           console.log(  'Type: ' + $node.attr(  'Type'  )  + ' StaticName: ' + $node.attr(  'StaticName'  )  );
  //         }  );
  //       }
  //     }
  // );
}  )();
