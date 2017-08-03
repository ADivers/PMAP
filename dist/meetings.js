/*
*Filename       :       meetings.js
*Create Date    :       08-01-2017 08:47 EST
*Author         :       jFarrow02
*/

APP.meetings = (  function(  global, app  ){

  var monthMap = {
    Jan    :     "01",
    Feb    :     "02",
    Mar    :     "03",
    Apr    :     "04",
    May    :     "05",
    Jun    :     "06",
    Jul    :     "07",
    Aug    :     "08",
    Sep    :     "09",
    Oct    :     "10",
    Nov    :     "11",
    Dec    :     "12"

  },

    fullMonthMap = {
      January     :     "01",
      February    :     "02",
      March       :     "03",
      April       :     "04",
      May         :     "05",
      June        :     "06",
      July        :     "07",
      August      :     "08",
      September   :     "09",
      October     :     "10",
      November    :     "11",
      December    :     "12"
    },

    meetingFieldVals = [  'Title', 'Created', 'Author', 'Location',
                          'EventDate', 'EndDate'],

    listName = 'TEST_CAL01',
    webURL = 'https://teams.deloitte.com/sites/FDAJDD/Sandbox';

  function makeCAMLString(  formValsObj, listFieldsArr  ){
    var camlStr = '<Batch OnError="Continue">' +
                  '<Method ID="1" Cmd="New">';
    for(  var i = 0; i < listFieldsArr.length; i++  ){
      camlStr += '<Field Name="' + meetingFieldVals[  i  ];
      camlStr += '">';
      var propName = Object.getOwnPropertyNames(  formValsObj  )[  i  ];
      camlStr += formValsObj[  propName  ];
      camlStr += '</Field>'
    }
    camlStr += '</Method></Batch>';
    return camlStr;
  }

  function makeNewMeeting(){
    //Define/initialize function-level variables
    var $form = $(  '#create-meeting'  ),
        createDate = new Date(  Date.now()  ),
        $startDate = $(  'input[name="start-date"]', $form  ).val(),
        $startTime = $(  'input[name="start-time"]', $form  ).val(),
        $endDate = $(  'input[name="end-date"]', $form  ).val(),
        $endTime = $(  'input[name="end-time"]', $form  ).val(),
        $location = $(  'input[name="meeting-location"]', $form  ).val(),
        $title = $(  'input[name="meeting-title"]', $form  ).val(),
        startDTS,
        endDTS,
        formValsArr = [],
        formValsObj,
        CAMLstr;
        $startDate = $startDate + ' ' + $startTime;
        $endDate = $endDate + ' ' + $endTime;

        //Initialize variables to create date-time strings
        startDTS = makeDateTimeString(  $startDate, $startTime  );
        startDTS = new Date(  startDTS  );
        endDTS = makeDateTimeString(  $endDate, $endTime  );
        endDTS = new Date(  endDTS  );

        //GET STATIC COLUMN NAMES FROM SP LIST
        // var staticNames = $().SPServices.SPGetStaticFromDisplay(
        //   {
        //     webURL  :   webURL,
        //     listName:   listName,
        //     columnDisplayNames: ['Title', 'End Time', 'Start Time', 'Location', 'Description', 'Created By', 'Created'  ]
        //   }
        // );
        //
        // console.log(  "STATIC COLUMN NAMES: " );
        // console.dir(  staticNames  );

        //Collect form field values as properties of an object
        formValsObj = {
          Title             :         $title,
          Created           :         $().SPServices.SPConvertDateToISO(  { dateToConvert: createDate  }  ),
          Author            :         'Marcus M. Garvey',
          'Location'        :         $location,
          EventDate         :          $().SPServices.SPConvertDateToISO(  { dateToConvert: startDTS  }  ),
          EndDate           :         $().SPServices.SPConvertDateToISO(  {  dateToConvert:  endDTS  }  )
        };

        for(  var val in formValsObj  ){
          if(  formValsObj.hasOwnProperty(  val  )  ){
            formValsArr.push(  formValsObj[  val  ]  );
          }
        }

        //Initialize CAML formatted string for SP list query
        CAMLstr = makeCAMLString(  formValsObj, meetingFieldVals  );

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

              //Create new Meeting list item on SP calendar list
              $().SPServices(
                {
                  operation: 'UpdateListItems',
                  webURL  : webURL,
                  listName: 'TEST_CAL01',
                  updates: CAMLstr,
                  completefunc  : function(  xData, Status  ){
                    console.log(  xData.responseText  );
                    $(  xData.responseXML  ).find(  'Fields  > Field'  ).each(  function(){
                      var $node = $(  this  );
                      console.log(  'Type: ' + $node.attr(  'Type'  )  + ' StaticName: ' + $node.attr(  'StaticName'  )  );
                      //document.querySelectorAll(  '#create-meeting[input]'  )
                    }  );
                    console.log(  Status  );
                    if(  Status === 'success'  ){
                        global.location.reload(  true  );
                    }
                  }
                }
              );

  }

  function makeDateTimeString(  dateStr, timeStr  ){
    var dateTimeString,
        yr,
        mth,
        day,
        hrMin,
        //dateTimeArr = [],
        propNames = Object.getOwnPropertyNames(  monthMap  ),
        fullPropNames = Object.getOwnPropertyNames(  fullMonthMap  );
        dateTimeString = dateStr.replace(  /,\s/, ' '  );
        dateTimeString = dateTimeString.split(  ' '  );
        dateTimeString = dateTimeString[  2  ] + '.' + dateTimeString[  1  ] + '.' + dateTimeString[  0  ] + '.';
        dateTimeString = dateTimeString + timeStr;
        dateTimeString = dateTimeString.split(  '.'  );
        for(  var i = 0; i < 13; i++  ){
          if(  dateTimeString[  1  ] === propNames[  i  ]  ){
            dateTimeString[  1  ] = monthMap[  propNames[  i  ]  ];
          }
          if( dateTimeString[  1  ]  === fullPropNames[  i  ] ){
            dateTimeString[  1  ] = fullMonthMap[  fullPropNames[  i  ]  ];
          }
        }
        if(  dateTimeString[  2  ].length === 1  ){
          dateTimeString[  2  ] = '0' + dateTimeString[  2  ];
        }

        yr = dateTimeString[  0  ];
        mth = dateTimeString[  1  ];
        day = dateTimeString[  2  ];
        hrMin = dateTimeString[  3  ];
        dateTimeString = yr + '-' + mth + '-' + day + 'T' + hrMin;
        return dateTimeString;
  }

  function initMeeting(){
    console.log(  "Meeting initiated."  );
    var submitButton = document.querySelector(  '#submit'  );
    submitButton.addEventListener(  'click', makeNewMeeting, false  );
  }
  /*******************RETURN PUBLIC API*********************/
  return(
    {
      initMeeting        :       initMeeting
    }
  )

}  )(  this, APP  );
