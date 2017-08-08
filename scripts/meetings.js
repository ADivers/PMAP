/*
*Filename       :       meetings.js
*Create Date    :       08-01-2017 08:47 EST
*Author         :       jFarrow02
*/

/**
*@module APP
*@main APP
*@class meetings
*/
APP.meetings = (  function(  global, app  ){

  /**
  *Object map. Maps form input month abbreviations to 2-digit numerical representations
  *of month (as String; e.g. property `Jan` maps to `01`)
  *@property monthMap
  *@type Object
  *@private
  */
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

  /**
  *Object map. Maps form input month full names to 2-digit numerical representations
  *of month (as String; e.g. property `January` maps to `01`)
  *@property fullMonthMap
  *@type Object
  *@private
  */
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
                          'EventDate', 'EndDate', 'CustomerID'],

    listName = 'TEST_CAL01',
    webURL = 'https://teams.deloitte.com/sites/FDAJDD/Sandbox';

  /**
  *Constructs and return CAML string to define fields to create/update on SP list item
  *@method makeCAMLString
  *@param {Object} formValsObj Object mapping form input values to SP list static names
  *@param {Array} listFieldsArr Array containing SP list static names
  *@return {String} `camlStr`: String representing SP list item fields to create (or update on
  *update operations)
  */
  function makeCAMLString(  formValsObj, listFieldsArr  ){
    /*
    *CONSIDER REFACTORING TO USE formValsObj ONLY; listFieldsArr may be UNNEEDED
    */
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
        CAMLstr,
        successCard,
        cardContent,
        cardAction,
        customID = Math.floor(  Math.random() * (  99999 - 10000  ) + 1  ).toString(),
        $startDate = $startDate + ' ' + $startTime;
        $endDate = $endDate + ' ' + $endTime;

        //Initialize variables to create date-time strings
        startDTS = makeDateTimeString(  $startDate, $startTime  );
        startDTS = new Date(  startDTS  );
        endDTS = makeDateTimeString(  $endDate, $endTime  );
        endDTS = new Date(  endDTS  );

        //GET STATIC COLUMN NAMES FROM SP LIST
        var staticNames = $().SPServices.SPGetStaticFromDisplay(
          {
            webURL  :   webURL,
            listName:   listName,
            columnDisplayNames: ['Title', 'End Time', 'Start Time', 'Location', 'Description', 'Created By', 'Created', 'Custom ID Number'  ]
          }
        );

        console.log(  "STATIC COLUMN NAMES: " );
        console.dir(  staticNames  );

        //Collect form field values as properties of an object
        formValsObj = {
          Title             :         $title,
          Created           :         $().SPServices.SPConvertDateToISO(  { dateToConvert: createDate  }  ),
          Author            :         'Marcus M. Garvey',
          'Location'        :         $location,
          EventDate         :         $().SPServices.SPConvertDateToISO(  { dateToConvert: startDTS  }  ),
          EndDate           :         $().SPServices.SPConvertDateToISO(  {  dateToConvert:  endDTS  }  ),
          CustomerID        :         customID
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

                    //OUTPUT ALL LIST ITEMS
                    $().SPServices(
                      {
                        operation: 'GetListItems',
                        webURL: webURL,
                        viewName: '',
                        listName: 'TEST_CAL01',
                        CAMLViewFields: '<ViewFields><FieldRef Name="Title"/><FieldRef Name="ID"/></ViewFields>',
                        CAMLQuery:  '<Query>' +
                                      '<Where>' +
                                        '<And>' +
                                          '<Eq>' +
                                            '<FieldRef Name="Title"/>' +
                                            '<Value Type="Text">' + formValsObj.Title + '</Value>' +
                                          '</Eq>' +
                                          '<Eq>' +
                                            '<FieldRef Name="CustomerID"/>' +
                                            '<Value Type="Text">' + formValsObj.CustomerID + '</Value>' +
                                          '</Eq>' +
                                        '</And>' +
                                      '</Where>' +
                                    '</Query>',
                        CAMLRowLimit: 20,
                        CAMLQueryOptions: '<QueryOptions><ExpandUserField>True</ExpandUserField></QueryOptions>',
                        completefunc: function(  xData, Status  ){
                          console.log(  '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                          var resp = $(  xData.responseXML  ).SPFilterNode(  'z:row'  ).SPXmlToJson(  {  includeAllAttrs: true  }  );
                          console.log(  resp  );
                        }
                      }
                    );
                    // $(  xData.responseXML  ).find(  'Fields  > Field'  ).each(  function(){
                    //   var $node = $(  this  );
                    //   console.log(  'Type: ' + $node.attr(  'Type'  )  + ' StaticName: ' + $node.attr(  'StaticName'  )  );
                    //   //document.querySelectorAll(  '#create-meeting[input]'  )
                    //
                    // }  );



                    console.log(  Status  );
                    if(  Status === 'success'  ){
                        var parent = document.querySelector(  'body'  ),
                        refresh;
                        app.dom.buildOverlay(  parent  );
                        successCard = document.createElement(  'div'  );
                        cardContent = document.createElement(  'div'  );
                        cardAction = document.createElement(  'div'  ),

                        successCard.className = 'card';
                        cardContent.className = 'card-content';
                        cardAction.className = 'card-action';
                        cardContent.innerHTML = '<span class="card-title">Your Meeting Has Been Created</span>' +
                                                '<p>An email has been sent to your meeting\'s attendees.</p>';
                        cardAction.innerHTML = '<a id="refresh" href="#">OK</a>';
                        successCard.appendChild(  cardContent  );
                        successCard.appendChild(  cardAction  );

                        /*
                        *TODO: 08-03-2017 14:50 pm
                        *Center message card in center of moaal
                        */
                        successCard.style.position = 'absolute';
                        successCard.style.top = '50%';
                        successCard.style.left = '30%';
                        overlay.appendChild(  successCard  );

                        refresh = document.querySelector(  '#refresh'  );
                        refresh.addEventListener(  'click', function(  e  ){
                          e.preventDefault();
                          global.location.reload();
                        }, false  );
                        //global.location.reload(  true  );
                    }
                  }
                }
              );

  }

  /**
  *Creates concatenated and formatted date/time String from date and time formatted
  *input values. Formats properly according to SPServices API expectations.
  *@method makeDateTimeString
  *@param {String} dateStr String from form input field representing meeting start/end date
  * e.g. `Mon, Aug 7 2017`
  *@param {String} timeStr String from form input field representing meeting start/end time
  *e.g. `18:45`
  */
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

  /**
  *Initialize meeting module. Attaches `click` event listener to submit button
  *to create new meeting list item on click.
  *@method initMeeting
  */

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
