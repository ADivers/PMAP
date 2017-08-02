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

  function makeNewMeeting(){
    var $form = $(  '#create-meeting'  ),
        createDate = new Date(  Date.now()  ),
        $startDate = $(  'input[name="start-date"]', $form  ).val(),
        $startTime = $(  'input[name="start-time"]', $form  ).val(),
        $endDate = $(  'input[name="end-date"]', $form  ).val(),
        $endTime = $(  'input[name="end-time"]', $form  ).val(),
        $location = $(  'input[name="meeting-location"]', $form  ).val(),
        $title = $(  'input[name="meeting-title"]', $form  ).val(),
        formValsArr = [];
        $startDate = $startDate + ' ' + $startTime;
        $endDate = $endDate + ' ' + $endTime;

        var startDTS = makeDateTimeString(  $startDate, $startTime  );
        //console.log(  typeof startDTS  );
        startDTS = new Date(  startDTS  );
        var endDTS = makeDateTimeString(  $endDate, $endTime  );
        endDTS = new Date(  endDTS  );
        // startDTS = $().SPServices.SPConvertDateToISO(  { dateToConvert  : startDTS }  );
        // endDTS = $().SPServices.SPConvertDateToISO( { dateToConvert  :  endDTS  }  );

        // console.log(  startDTS  );
        // console.log(  '******************************************************');
        // console.log(  endDTS  );
        //Get display names
        var staticNames = $().SPServices.SPGetStaticFromDisplay(
          {
            webURL  :   webURL,
            listName:   listName,
            columnDisplayNames: ['Title', 'End Time', 'Start Time', 'Location', 'Description', 'Created By', 'Created'  ]
          }
        );

        console.log(  "STATIC COLUMN NAMES: " );
        console.dir(  staticNames  );

        var formValsObj = {
          Title             :         'Go ahead and PMAP, m\'kay',
          Created           :         $().SPServices.SPConvertDateToISO(  { dateToConvert: createDate  }  ),
          Author            :         'Marcus M. Garvey',
          'Location'        :         'Lumbergh\s office',
          EventDate         :          $().SPServices.SPConvertDateToISO(  { dateToConvert: startDTS  }  ),
          EndDate           :         $().SPServices.SPConvertDateToISO(  {  dateToConvert:  endDTS  }  )
        };

        for(  var val in formValsObj  ){
          if(  formValsObj.hasOwnProperty(  val  )  ){
            formValsArr.push(  formValsObj[  val  ]  );
          }
        }

        var valPairs = APP.makeValuepairs(  formValsArr,  meetingFieldVals  );
        console.log(  valPairs  );

              $().SPServices(
                  {
                    operation       :       'GetList',
                    webURL          :       webURL,
                    listName        :       'TEST_CAL01',
                    completefunc    :       function(  xData, Status  ){
                      console.log(  xData.responseText  );
                      $(  xData.responseXML  ).find(  'Fields  > Field'  ).each(  function(){
                        var $node = $(  this  );
                        console.log(  'Type: ' + $node.attr(  'Type'  )  + ' StaticName: ' + $node.attr(  'StaticName'  )  );
                      }  );
                    }
                  }
              );

        $().SPServices(
          {
            operation       :       'UpdateListItems',
            batchCmd        :       'New',
            //ID              :       Math.round(  Math.random()  * (  Math.ceil(  10000  )  -  Math.floor(  1  )  )  + 1  ),
            ID  : 1234,
            webURL          :       webURL,
            listName        :       listName,
            valuePairs      :       valPairs,
            completefunc    :       function( xData, Status  ){
              console.log(  'Status: '  + Status  );
              console.log(  xData.responseText  );
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
        // + ':00Z-05:00';
        // dateTimeString = yr + ' ' + mth + ' ' + day + ' ' + hrMin;

        // for(  var j = 0; j < dateTimeString.length; j++  ){
        //   // if(  j !== dateTimeString.length -1  ){
        //     dateTimeArr.push(  dateTimeString[  j  ]  );
        //   //}
          // else if(  j === (  dateTimeString.length - 1  )  ){
          //   var hrsMins = dateTimeString[  j  ].split(  ':'  );
          //   var hrs = hrsMins[  0  ];
          //   var mins = hrsMins[  1  ];
          //   dateTimeArr.push(  hrs  );
          //   dateTimeArr.push(  mins  );
          // }
        //}
        return dateTimeString;
  }

//****************DEPRECATED/OBSOLETE*******************************//
  // function addMeeting(){
  //   /*****Begin variable declarations******/
  //   var $form = $(  '#create-meeting'  ),
  //       $startDate = $(  'input[name="start-date"]', $form  ),
  //       $startTime = $(  'input[name="start-time"]', $form  ),
  //       $endDate = $(  'input[name="end-date"]', $form  ),
  //       $endTime = $(  'input[name="end-time"]', $form  ),
  //       $location = $(  'input[name="meeting-location"]', $form  ),
  //       $title = $(  'input[name="meeting-title"]', $form  ),
  //       organizerEmail = 'bFranklin@1776.org',
  //       uid = '{313EB79D-4574-494F-BB53-EC31068A3FAB}',
  //       webURL = app.getWebUrl(),
  //       sequence = 1,
  //       utcDateStamp,
  //       yearNow,
  //       monthNow,
  //       dayNow,
  //       hrMinNow,
  //       titleVal = $(  'input[name="meeting-title"]'  ).val(),
  //       dateStartVal = $startDate.val(),
  //       timeStartVal = $startTime.val(),
  //       dateEndVal = $endDate.val(),
  //       timeEndVal = $endTime.val(),
  //       location = $location.val(),
  //       startYear,
  //       startMonth,
  //       startDay,
  //       startHrMin,
  //       endYear,
  //       endMmonth,
  //       endDay,
  //       endHrMin,
  //       utcDateStart,
  //       utcDateEnd,
  //
  //
  //       /*****End variable declarations******/
  //
  //       /****Begin build UTC now date********/
  //       utcDateStamp = new Date(  Date.now()  );
  //       utcDateStamp = utcDateStamp.toString();
  //       utcDateStamp = utcDateStamp.split(  ' '  );
  //       yearNow = utcDateStamp[  3  ];
  //       for(  var month in monthMap  ){
  //         if(  utcDateStamp[  1  ] === month  ){
  //           monthNow = monthMap[  month  ];
  //         }
  //       }
  //       dayNow = utcDateStamp[  2  ];
  //       hrMinNow = utcDateStamp[  4  ];
  //       utcDateStamp = yearNow + '-' + monthNow + '-' + dayNow + 'T' + hrMinNow + '.000';
  //       /***End build UTC now date**********/
  //
  //       /****Begin build UTC start date******/
  //       dateStartVal = makeDateTimeString(  dateStartVal, timeStartVal  );
  //       startYear = dateStartVal[  0  ];
  //       startMonth = dateStartVal[  1  ];
  //       startDay = dateStartVal[  2  ];
  //       startHrMin = dateStartVal[  3  ];
  //       utcDateStart = startYear + '-' + startMonth + '-' + startDay + 'T' + startHrMin + ':00.000';
  //       console.log(  'UTC Date Start: ' + utcDateStart  );
  //       /****End build UTC start date******/
  //
  //       /****Begin build UTC end date*****/
  //       dateEndVal = makeDateTimeString(  dateEndVal, timeEndVal  );
  //       endYear = dateEndVal[  0  ];
  //       endMonth = dateEndVal[  1  ];
  //       endDay = dateEndVal[  2  ];
  //       endHrMin = dateEndVal[  3  ];
  //       utcDateEnd = endYear + '-' + endMonth + '-' + endDay + 'T' + endHrMin + ':00.000';
  //       console.log(  'UTC Date End: ' + utcDateEnd  );
  //       /****End build UTC end date*****/
  //

  //   // $().SPServices(
  //   //   {
  //   //     operation         :     'AddMeeting',
  //   //     webURL            :     webURL,
  //   //     uid               :     uid,
  //   //     location          :     location, //ASK BOB WHAT THIS IS
  //   //     organizerEmail    :     organizerEmail,
  //   //     sequence          :     sequence, //ASK BOB WHAT THIS IS
  //   //     utcDateStamp      :     utcDateStamp,
  //   //     title             :     titleVal,
  //   //     utcDateStart      :     utcDateStart,
  //   //     utcDateEnd        :     utcDateEnd,
  //   //     nonGregorian      :     false,
  //   //     completefunc      :     function(  xData, Status  ){
  //   //       console.log(  Status  );
  //   //       console.log(  xData.responseText  );
  //   //     }
  //   //   }
  //   // );
  //   /*
  //   *SPServices 'AddMeeting' method parameters:
  //     organizerEmail        :     Email address ('email_address@domain.ext') of the organizer
  //     uid                   :     GUID for the calendar
  //     sequence              :     An integer used to determine the ordering of updates in case they arrive out of sequence.
  //                                 Updates with a lower-than-current sequence are discarded.
  //                                 If the sequence is the same as the current sequence, the latest update will be applied.
  //     utcDateStamp          :     The date and time that the instance of the iCalendar object was created.
  //     title                 :     The title (subject) of the meeting.
  //     location              :     The location of the meeting.
  //     utcDateStart          :     The start date and time for the meeting, expressed in UTC.
  //     utcDateEnd            :     The end date and time for the meeting, expressed in Coordinated Universal Time (UTC).
  //     nonGregorian          :     true if the calendar is set to a format other than Gregorian; otherwise, false.
  //                                 Setting this parameter to true puts the following message in the summary data
  //                                 of the meeting workspace: "This meeting was created using a calendar and scheduling program
  //                                 that only supports series updates to the Meeting Workspace.
  //                                 Changes you make to individual occurrences of meetings in
  //                                 that program will not appear in the workspace."
  //   */
  // }

  function initMeeting(){
    console.log(  "Meeting initiated."  );
    var submitButton = document.querySelector(  '#submit'  );
    submitButton.addEventListener(  'click', makeNewMeeting, false  );
  }
  /*******************RETURN PUBLIC API*********************/
  return(
    {
      // onSubmit        :       onSubmit
      initMeeting        :       initMeeting
    }
  )

}  )(  this, APP  );
