/*
*Filename       :       meetings.js
*Create Date    :       08-01-2017 08:47 EST
*Author         :       jFarrow02
*/

APP.meetings = (  function(  global, app  ){

  var monthMap = {
    January     :     "0",
    February    :     "1",
    March       :     "2",
    April       :     "3",
    May         :     "4",
    June        :     "5",
    July        :     "6",
    August      :     "7",
    September   :     "8",
    October     :     "9",
    November    :     "10",
    December    :     "11"

  }

  function makeDateTimeString(  dateStr, timeStr  ){
    var dateTimeString,
        dateTimeArr = [],
        propNames = Object.getOwnPropertyNames(  monthMap  ),
        newMonth;
        dateTimeString = dateStr.replace(  /,\s/, ' '  );
        dateTimeString = dateTimeString.split(  ' '  );
        dateTimeString = dateTimeString[  2  ] + '.' + dateTimeString[  1  ] + '.' + dateTimeString[  0  ] + '.';
        dateTimeString = dateTimeString + timeStr;

        /**TODO: Refactor to use the dateTimeString ARRAY instead
        (fina a way to use as the 'arguments' attribute to Date.UTC?)
        */
        dateTimeString = dateTimeString.split(  '.'  );
        for(  var i = 0; i < propNames.length; i++  ){
          if(  dateTimeString[  1  ] === propNames[  i  ]  ){
            dateTimeString[  1  ] = monthMap[  propNames[  i  ]  ];
          }
        }
        console.log(  '**************************************');
        console.log(  dateTimeString  );
        // dateTimeString = dateTimeString.replace(  /,/,  ' '  );
        // dateTimeString = dateTimeString.replace(  /,/, ' '  );
        // dateTimeString = dateTimeString.replace(  /,/, ' '  );

        for(  var j = 0; j < dateTimeString.length; j++  ){
          if(  j !== dateTimeString.length -1  ){
            dateTimeArr.push(  dateTimeString[  j  ]  );
            console.log(  "dateTimeArr: " + dateTimeArr  );
          }
          else if(  j === (  dateTimeString.length - 1  )  ){
            console.log(  dateTimeString[  j  ]  );
            console.log(  dateTimeString[  j  ].split(  ':'  )  );
            var hrsMins = dateTimeString[  j  ].split(  ':'  );
            var hrs = hrsMins[  0  ];
            var mins = hrsMins[  1  ];
            dateTimeArr.push(  hrs  );
            dateTimeArr.push(  mins  );
            /*
            *TODO: ADD LOGIC TO REMOVE LEADING ZERO FROM SECONDS IF PRESENT
            */
            // console.log(  hrs  );
            // console.log(  mins  );
            // dateTimeString[  j  ] = hrs;
            // dateTimeString.push(  mins  );
            // console.log(  hrsMins  );
            // dateTimeString[  j  ] = hrsMins[  0  ];
            // console.log(  dateTimeString  );
            // console.log(  "hrsMins: " + hrsMins  );
            // //hrsMins = hrsMins.split(  ','  );
            // console.log(  typeof hrsMins  );
            // console.dir(  hrsMins  );
            //
            // // dateTimeString[  j  ] = parseInt(  hrsMins[  0  ], 10  );
            // dateTimeString.push(  parseInt(  mins )  );
          }
        }
        console.log(  "FINAL dateTimeArr:" + dateTimeArr  );
        // // dateTimeString = Date.UTC
        return dateTimeString;
  }

  function addMeeting(){
    //console.log(  'Web URL: ' + app.getWebUrl()  ); -->OK
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
        utcDateStamp = new Date(  Date.now()  ),
        //location = 'Independence Hall',

        //Begin datetime value conversions
        titleVal = $(  'input[name="meeting-title"]'  ).val(),
        dateStartVal = $startDate.val(),
        timeStartVal = $startTime.val();
        dateEndVal = $endDate.val();
        timeEndVal = $endTime.val();
        dateStartVal = makeDateTimeString(  dateStartVal, timeStartVal  );
        dateEndVal = makeDateTimeString(  dateEndVal, timeEndVal  );
        // dateStartVal = new Date(  dateStartVal  );
        // dateEndVal = new Date(  dateEndVal  );
        // console.log(  dateStartVal  );
        // console.log(  dateEndVal  );
    // $().SPServices(
    //   {
    //     operation         :     'AddMeeting',
    //     webURL            :     webURL,
    //     uid               :     uid,
    //     organizerEmail    :     organizerEmail,
    //     sequence          :     sequence,
    //     utcDateStamp      :     utcDateStamp,
    //     title             :     titleVal,
    //     utcDateStart      :     dateStartVal,
    //     utcDateEnd        :     dateEndVal,
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
