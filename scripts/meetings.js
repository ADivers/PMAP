/*
*Filename       :       meetings.js
*Create Date    :       08-01-2017 08:47 EST
*Author         :       jFarrow02
*/

APP.meetings = (  function(  global, app  ){

  function makeDateTimeString(  dateStr, timeStr  ){
    var dateTimeString,
        dateTimeArr = [];
        dateTimeString = dateStr.replace(  /,\s/, ' '  );
        dateTimeString = dateTimeString.split(  ' '  );
        dateTimeString = dateTimeString[  2  ] + ' ' + dateTimeString[  1  ] + ' ' + dateTimeString[  0  ];
        dateTimeString = dateTimeString + ' ' + timeStr;
        //console.log(  dateTimeString  );  -->OK
        return dateTimeString;
  }

  function addMeeting(){
    var $form = $(  '#create-meeting'  ),
        $startDate = $(  'input[name="start-date"]', $form  ),
        $startTime = $(  'input[name="start-time"]', $form  ),
        $endDate = $(  'input[name="end-date"]', $form  ),
        $endTime = $(  'input[name="end-time"]', $form  ),
        $location = $(  'input[name="meeting-location"]', $form  ),
        organizerEmail = 'bFranklin@1776.org',
        uid = '{313EB79D-4574-494F-BB53-EC31068A3FAB}',
        sequence = 1,
        utcDateStamp = new Date(  Date.now()  ),
        title = 'Test Meeting with J.Q. Adams',
        location = 'Independence Hall',
        dateStartVal = $startDate.val(),
        timeStartVal = $startTime.val();
        dateEndVal = $endDate.val();
        timeEndVal = $endTime.val();
        dateStartVal = makeDateTimeString(  dateStartVal, timeStartVal  );
        dateEndVal = makeDateTimeString(  dateEndVal, timeEndVal  );

        // console.log(  dateStartVal  );
        // console.log(  timeStartVal  );
        // var dateString = dateStartVal.replace(  ', ', ' '  );
        // dateString = dateString.split( ' ' );
        // dateString = dateString[  2  ] + ' ' + dateString[  1  ] + ' ' + dateString[  0  ];
        // console.log(  dateString  );
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
