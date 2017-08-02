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
    }



  function makeDateTimeString(  dateStr, timeStr  ){
    var dateTimeString,
        dateTimeArr = [],
        propNames = Object.getOwnPropertyNames(  monthMap  );
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

        console.log(  '************************************************'  );
        console.log(  dateTimeString  );

        for(  var j = 0; j < dateTimeString.length; j++  ){
          // for( var k = 0; k < propNames.length; k++  ){
          //   if( (  dateTimeString[  j  ]  ).substr(  0, 3  ) === propNames[  k  ]  ){
          //     dateTimeString[  j  ] = monthMap[  k  ];
          //   }
          // }
          // for( var month in monthMap  ){
          //   if(  dateTimeString[  j  ].substr(  0, 3  ) === Object.getOwnPropertyNames(  monthMap  )  ){
          //     dateTimeString[  j  ] = monthMap[  month  ];
          //   }
          // }
          if(  j !== dateTimeString.length -1  ){
            dateTimeArr.push(  dateTimeString[  j  ]  );
            //console.log(  "dateTimeArr: " + dateTimeArr  );
          }
          else if(  j === (  dateTimeString.length - 1  )  ){
            //console.log(  dateTimeString[  j  ]  );
            //console.log(  dateTimeString[  j  ].split(  ':'  )  );
            var hrsMins = dateTimeString[  j  ].split(  ':'  );
            var hrs = hrsMins[  0  ];
            var mins = hrsMins[  1  ];
            //mins = parseInt(  mins  );
            dateTimeArr.push(  hrs  );
            dateTimeArr.push(  mins  );
          }
        }
        //Parse dateTimeArr values into INTEGERS for conversion
        //to UTC
        // for(  var k = 0; k < dateTimeString.length; k++  ){
        //   dateTimeArr[  k  ] = parseInt(  dateTimeArr[  k  ]  );
        // }
        //console.dir(  dateTimeArr  );
        return dateTimeArr;
  }

  // function makeDateTimeString( yr, mth, day, hr, min ){
  //   var dateTime = yr + '-' + mth + '-' + day + 'T' + hr + ':' + min + ':' + '00.000';
  //   return dateTime;
  // }

  function addMeeting(){
    //console.log(  'Web URL: ' + app.getWebUrl()  ); -->OK
    /*****Begin variable declarations******/
    var $form = $(  '#create-meeting'  ),
        $startDate = $(  'input[name="start-date"]', $form  ),
        $startTime = $(  'input[name="start-time"]', $form  ),
        $endDate = $(  'input[name="end-date"]', $form  ),
        $endTime = $(  'input[name="end-time"]', $form  ),
        $location = $(  'input[name="meeting-location"]', $form  ),
        $title = $(  'input[name="meeting-title"]', $form  ),
        organizerEmail = 'bFranklin@1776.org',
        uid = '{313EB79D-4574-494F-BB53-EC31068A3FAB}',
        webURL = app.getWebUrl(),
        sequence = 1,
        utcDateStamp,
        yearNow,
        monthNow,
        dayNow,
        hrMinNow,
        titleVal = $(  'input[name="meeting-title"]'  ).val(),
        dateStartVal = $startDate.val(),
        timeStartVal = $startTime.val(),
        dateEndVal = $endDate.val(),
        timeEndVal = $endTime.val(),
        startYear,
        startMonth,
        startDay,
        startHour,
        startMinute,
        endYear,
        endMmonth,
        endDay,
        endHour,
        endMinute,
        utcDateStart,
        utcDateEnd;

        /*****End variable declarations******/

        /****Begin build UTC now date********/
        utcDateStamp = new Date(  Date.now()  );
        utcDateStamp = utcDateStamp.toString();
        //console.log(  utcDateStamp  );
        utcDateStamp = utcDateStamp.split(  ' '  );
        //console.log(  utcDateStamp  );
        yearNow = utcDateStamp[  3  ];
        for(  var month in monthMap  ){
          if(  utcDateStamp[  1  ] === month  ){
            monthNow = monthMap[  month  ];
          }
        }
        //console.log(  monthNow  );
        dayNow = utcDateStamp[  2  ];
        hrMinNow = utcDateStamp[  4  ];
        //utcDateStamp = yearNow + monthNow + dayNow + hrMinNow;
        // console.log(  dayNow  );
        // console.log(  '**************************************');
        // hourNow = utcDateStamp.getHours();
        // console.log(  hourNow  );
        // console.log(  '**************************************');
        // minuteNow = utcDateStamp.getMinutes();
        // console.log(  minuteNow  );
        // //utcDateStamp = parseInt(  Date.UTC(  yearNow, monthNow, dayNow, hourNow, minuteNow  ), 10  );
        console.log(  '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        utcDateStamp = yearNow + '-' + monthNow + '-' + dayNow + 'T' + hrMinNow + '.000';
        console.log(  utcDateStamp  );
        // console.log(  '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        /***End build UTC now date**********/

        /****Begin build UTC start date******/
        dateStartVal = makeDateTimeString(  dateStartVal, timeStartVal  );
        startYear = dateStartVal[  0  ];
        //startMonth = dateStartVal[  1  ];
        startDay = dateStartVal[  2  ];
        startHour = dateStartVal[  3  ];
        startMinute = dateStartVal[  4  ];
        //utcDateStart = Date.UTC(  startYear, startMonth, startDay, startHour, startMinute  );
        utcDateStart = startYear + '-' + startMonth + '-' + startDay + 'T' + startHour +
          ':' + startMinute + ':' + '00.000';
        console.log(  'UTC Date Start: ' + utcDateStart  );
        /****End build UTC start date******/

        /****Begin build UTC end date*****/
        dateEndVal = makeDateTimeString(  dateEndVal, timeEndVal  );
        endYear = dateEndVal[  0  ];
        endMmonth = dateEndVal[  1  ];
        endDay = dateEndVal[  2  ];
        endHour = dateEndVal[  3  ];
        endMinute = dateEndVal[  4  ];
        utcDateEnd = Date.UTC(  endYear, endMmonth, endDay, endHour, endMinute  );
        console.log(  'UTC Date End: ' + utcDateEnd  );
        /****End build UTC end date*****/

    // $().SPServices(
    //   {
    //     operation         :     'AddMeeting',
    //     webURL            :     webURL,
    //     uid               :     uid,
    //     organizerEmail    :     organizerEmail,
    //     sequence          :     sequence,
    //     utcDateStamp      :     utcDateStamp,
    //     title             :     titleVal,
    //     utcDateStart      :     utcDateStart,
    //     utcDateEnd        :     utcDateEnd,
    //     nonGregorian      :     false,
    //     completefunc      :     function(  xData, Status  ){
    //       console.log(  Status  );
    //       console.log(  xData.responseText  );
    //     }
    //   }
    // );
    /*
    *SPServices 'AddMeeting' method parameters:
      organizerEmail        :     Email address ('email_address@domain.ext') of the organizer
      uid                   :     GUID for the calendar
      sequence              :     An integer used to determine the ordering of updates in case they arrive out of sequence.
                                  Updates with a lower-than-current sequence are discarded.
                                  If the sequence is the same as the current sequence, the latest update will be applied.
      utcDateStamp          :     The date and time that the instance of the iCalendar object was created.
      title                 :     The title (subject) of the meeting.
      location              :     The location of the meeting.
      utcDateStart          :     The start date and time for the meeting, expressed in UTC.
      utcDateEnd            :     The end date and time for the meeting, expressed in Coordinated Universal Time (UTC).
      nonGregorian          :     true if the calendar is set to a format other than Gregorian; otherwise, false.
                                  Setting this parameter to true puts the following message in the summary data
                                  of the meeting workspace: "This meeting was created using a calendar and scheduling program
                                  that only supports series updates to the Meeting Workspace.
                                  Changes you make to individual occurrences of meetings in
                                  that program will not appear in the workspace."
    */
  }

  function initMeeting(){
    console.log(  "Meeting initiated."  );
    var submitButton = document.querySelector(  '#submit'  );
    submitButton.addEventListener(  'click', addMeeting, false  );
  }
  /*******************RETURN PUBLIC API*********************/
  return(
    {
      // onSubmit        :       onSubmit
      initMeeting        :       initMeeting
    }
  )

}  )(  this, APP  );
