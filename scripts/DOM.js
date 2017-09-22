/*
*Filename       :       DOM.js
*Create Date    :       08-03-2017 11:19 EST
*Author         :       jFarrow02
*Purpose        :       App module for DOM creation/manipulation functions
*
*/

/**
*@module APP
*@main APP
*@class dom
*/
APP.dom = (  function(  global, app, self ){

  /*******************BEGIN BUILD EMPLOYEE TABLE FUNCTION***************************/
  /**
  *Builds HTML table from returned results of `GetListItems` call to SP, and
  *appends table to DOM.
  *@method buildEmployeeTable
  *@param {Array} res Array of Employee List Items returned as JSON strings from
  *SPServices `GetListItems` call
  *@return {none}
  *@inner
  */
  function buildEmployeeTable(  res, table, tablebody, editButtonsArr  ){
    var prop,
        index;
    // if(  table  ){
    //   table.parentNode.removeChild(  table  );
    // }

    for( index = 0; index < res.length; index+= 1  ){
      tablerow = document.createElement(  'tr'  );
      for( prop in res[  index  ]  ){

          if(  res[  index  ].hasOwnProperty(  prop  )  ){
            tabledef = document.createElement(  'td'  );
            tabledef.innerText = res[  index  ][  prop  ];
            tablerow.appendChild(  tabledef  );
            tablebody.appendChild(  tablerow  );
        }
      }

      /****BEGIN EDIT BUTTON APPENDING LOGIC HERE*****/
      var $lastTd = $(  'tr>td:last-of-type'  );
      var lastTdElem = $lastTd.get(  index  );
      if(  parseInt(  editButtonsArr[  index ].dataset.index  ) === index  ){
        var newTd = document.createElement(  'td'  );
        newTd.appendChild(  editButtonsArr[  index  ]  );
        // lastTdElem.insertAdjacentElement(  'afterend', editButtonsArr[  index  ] );
        lastTdElem.insertAdjacentElement(  'afterend', newTd  );
      }

      /*****END EDIT BUTTON APPENDING LOGIC HERE*****/

    }

    table.className = 'bordered highlight';
  }
  /*******************END BUILD EMPLOYEE TABLE FUNCTION****************************/


  /*****************BEGIN FUNCTION insertButtonsRow*****************************/

  /***********************END FUNCTION insertButtonsRow*************************/
  /*****************BEGIN FUNCTION EDIT BUTTONS****************************/
  /**
  *Creates button elements to edit List Items returned from SPServices `GetListItems`
  *call.
  *@method buildEditButons
  *@return {Object} `edit`: HTML `button` element
  *@inner
  */
  function buildEditButtons(  responseArr, editButtonsArr  ){
    for(  var i = 0; i < responseArr.length; i+= 1  ){
      var edit = document.createElement(  'button'  ),
          link = document.createElement(  'a'  ),
          icon = document.createElement(  'i'  ),
          $params = './pmapIntroduction.html' + '?' + jQuery.param(  {id: responseArr[i]['SP-ID'], firstName: responseArr[i]['firstName'], lastName: responseArr[i]['lastName'], mgrSuprFlag: responseArr[i]['mgrSuprFlag']}  );
          icon.className = 'material-icons';
          icon.innerText = 'add';
          link.setAttribute(  'href', $params  );
      $(  '.tooltipped'  ).tooltip(    {delay: 50  }  );

      //edit.innerHTML = '<i class="material-icons">add</i>';
      edit.appendChild(  icon  );
      link.appendChild(  edit  );
      edit.className = 'btn-floating tooltipped blue darken-4  modal-trigger';
      edit.style.marginRight = '.5px';
      edit.style.marginTop = '5px';
      //edit.style.float = "right";
      edit.setAttribute(  'data-position', 'right');
      edit.setAttribute(  'data-delay', '50'  );
      edit.setAttribute(  'data-tooltip', 'Start/Edit a PMAP'  );
      edit.setAttribute(  'data-index', i  );
      edit.setAttribute(  'data-record-id', responseArr[  i  ][  'SP-ID'  ]  );
      link.setAttribute(  'data-index', i  );
      //edit.setAttribute(  'data-record-id',  tableRows[  i  ].getAttribute(  'data-record-id'  )  );
      $(  edit  ).tooltip(  {  delay: 50  }  );

      // edit.addEventListener(  'click', function(  e  ){
      //
      // }, false  );
      editButtonsArr.push(  link  );
    }

    return edit;
  }
  /*****************END FUNCTION EDIT BUTTONS****************************/

  /*****************BEGIN FUNCTION createButtons***************************/

  function createButtons(  responseArr, buttonsArr, urlString, configObj, queryObj  ){  //Begin createButtons
    for(  var i = 0; i < responseArr.length; i+= 1  ){  //Begin `for` loop
      var button = document.createElement(  'button'  ),
          //REVISE; don't need links inside admin msg edit buttons
          link = document.createElement(  'a'  ),
          icon = document.createElement(  'i'  ),
          $params = '?';
          for(  var prop in queryObj  ){
            //console.log(  prop  );  OK
            queryObj[  prop  ] = responseArr[  i  ][  prop  ];
            //console.dir(  queryObj  );  OK
            $params += jQuery.param(  queryObj  );
          };

          console.log( $params  );  //`event_id=EVENT-ID-XXX-XXXXXX`

          icon.className = 'material-icons';
          icon.innerText = configObj.iconText;
          //link.setAttribute(  'href', $params  );
          link.setAttribute(  'href', '#reminder-recipients'  );


      //Set button button style and attributes
      $(  '.tooltipped'  ).tooltip(    {delay: 50  }  );
      button.appendChild(  icon  );
      link.appendChild(  button  );
      button.className = 'btn-floating tooltipped blue darken-4  modal-trigger';
      button.style.marginRight = '.5px';
      button.style.marginTop = '5px';
      button.setAttribute(  'data-position', 'right');
      button.setAttribute(  'data-delay', '50'  );
      button.setAttribute(  'data-tooltip', configObj.tooltip  );
      button.setAttribute(  'data-index', i  );
      button.setAttribute(  'data-record-id', responseArr[  i  ][  'ID'  ]  );
      link.setAttribute(  'data-index', i  );
      $(  button  ).tooltip(  {  delay: 50  }  );

      /********Attach event listener/handler to EDIT buttons**********/

      if(  button.dataset.tooltip === 'Edit this Reminder'  ){
        $(  button  ).on(  'click', null,
        {  title: "Edit Details of PMAP Event: "   }, function(  event  ){  //Begin button.on event handler
          console.log(  "EVENT TARGET: "  );
          console.dir(  event.target  );

          //Set current record ID for retrieval from DOM elements
          var $currText = $(  this  ).data(  'record-id'  );
          $(  '#current-event-id'  ).text(  $currText  ).attr(  'data-current', $currText  );
          $(  '#current-event-id'  ).prev(  'h5'  ).text(  'Current event record: ' + $currText  );

        //Test button event
        //console.log(  'Hello from ' + event.target  );  //Button event test OK


        //Define local variables
        var target = event.target,
            $deadlineTxtSrc = $(  target  ).closest(  'td'  ).prev(  'td'  ),
            $listName = $(  'input[name="event-type"]:checked'  ).val(),
            singleEventQObj = APP.spsQuery.getSingleEventQConfigObject();
            // console.log(  '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'  );
            // console.dir(  singleEventQObj  );


        //******BEGIN SET OBJECT PROPERTIES FOR singleEventQObj**********//
        singleEventQObj.pmapCoordinatorID = "PMAP-COORD-12345";
        singleEventQObj[  'ID'  ] = $(  this  ).data(  'record-id'  );
        singleEventQObj.CAMLQuery = '<Query>\n' +
                                        '<Where>\n' +
                                          '<And>\n' +
                                            '<Eq>\n' +
                                              '<FieldRef Name="pmapCoordinatorID"/><Value Type="Text">' + singleEventQObj.pmapCoordinatorID + '</Value>\n' +
                                            '</Eq>\n' +
                                            '<Eq>\n' +
                                              '<FieldRef Name="ID"/><Value Type="Text">' + singleEventQObj[  'ID'  ] + '</Value>\n' +
                                            '</Eq>\n' +
                                          '</And>\n' +
                                        '</Where>\n' +
                                      '</Query>';
          singleEventQObj.listName = $listName;
          singleEventQObj.completefunc = function(  res  ){ //BEGIN singleEventQObj.completeFund definition
            var msg = res[  0  ].msgText,
                dueDate = res[  0  ].dueDateIntervalEnd;


            //Begin building DOM elements from response array values

            //Display hidden form fields on `edit` button click
            $(  '.hide'  ).not(  '#new-deadline'  ).removeClass(  'hide'  ).attr(  'display', 'block'  );
            $(  '#current-deadline'  ).attr(  'placeholder', dueDate  );


            $(  '#reminder-text'  ).text(  msg  );

      }  //END singleEventQObj.completFunc definition
      //******END SET OBJECT PROPERTIES FOR singleEventQObj**********/

      //QUERY SP for object represented by singleEventQObj
      app.spsQuery.getSPSListItems(  singleEventQObj  );


      /********End Attach event listener/handler to buttons**********/
      //Return `false` to preventDefault (i.e. page-refresh  ) and stopPropagation


      return false;
    } );  //END EDIT button.on event handler
  }



  else if(  button.dataset.tooltip === 'Delete this Reminder'  ){   //Begin else-if
    $(  button  ).on(  'click', function(  event  ){  //Begin 'delete' click handler
      console.log(  "It's a delete button!!!"  );
      var id = $(  this  ).data(  'record-id'  ),
          cmd = 'Delete',
          listname = $(  'input[name="event-type"]:checked'  ).val();
          //console.log(  listname  ); OK
      //Add event handler to delete PMAP event to button
        console.log(  event.target  );
        console.log(  $(  this  ).data(  'record-id'  )  );

        //Query configuration object structure
        //     {
        //       operation     :     configObj.operation,
        //       listName      :     configObj.listName,
        //       batchCmd      :     configObj.batchCmd,
        //       'ID'          :     configObj[  'ID'  ],
        //       updates       :     configObj.updates,
        //       completefunc  :     function(  xData, Status  ){
        //
        //       }
        var configObj = {
                          operation     :     'UpdateListItems',
                          webURL        :     app.getWebUrl(),
                          batchCmd      :     cmd,
                          'ID'          :     id,
                          listName      :     listname,
                          updates       :       '<Batch OnError="Continue">' +
                                                '<Method ID="1" Cmd="' + cmd + '">' +
                                                '<Field Name="ID">' + parseInt(  id, 10  ) + '</Field>'+
                                               '</Method>' +
                                               '</Batch>',
                          completefunc  :     function( ){

                              $(  '#success-msg .modal-content>p'  ).text(  'Event Reminder record was deleted successfully.'  );
                              $(  '#success-msg'  ).modal(  'open'  );

                          }
                        };

      //Check config object
      console.log(  'Delete operation config object: '  );
      console.log (  configObj  );

      app.spsQuery.updateSPSRecord(  configObj  );

      //Prevent default behavior
      return false;
    });   //End 'delete' click handler
  }   //End else-if

    buttonsArr.push(  link  );

  } // end `for` loop OK

  return buttonsArr;
} //  END createButtons OK
  /*****************END FUNCTION createButtons***************************/



  /****************BEGIN FUNCTION buildOverlay**************************/
  /**
  *@method buildOverlay
  *@param {String} parent Reference to DOM element
  *to which overlay will be appended
  *@param {String} child Reference to DOM element to append
  *to overlay (if any)
  *@return {none}
  *@inner
  */
  function buildOverlay(  parent, child  ){
    var overlay = document.createElement(  'div'  );

    //Set position attribute of parent element to 'relative' for positioning of overlay
    parent.style.position = 'relative';

    //Set positiion and attributes of overlay
    overlay.setAttribute(  'id', "overlay"  );
    overlay.style.position = 'absolute';
    overlay.style.backgroundColor = 'rgba(51, 51, 51, 0.6)';
    overlay.style.width = window.innerWidth + 'px';
    overlay.style.height = window.innerHeight + 'px';
    overlay.style.top = window.pageYOffset + 'px';
    overlay.style.left = window.pageXOffset + 'px';
    overlay.style.zIndex = '200';

    window.addEventListener(  'resize', function(){
      if(  overlay  ){
        overlay.style.width = window.innerWidth + 'px';
        overlay.style.height = window.innerHeight + 'px';
        overlay.style.top = window.pageYOffset + 'px';
        overlay.style.left = window.pageXOffset + 'px ';
      }
    }, false);

    window.addEventListener(  'scroll', function(){
      if(  overlay  ){
        overlay.style.width = window.innerWidth + 'px';
        overlay.style.height = window.innerHeight + 'px';
        overlay.style.top = window.pageYOffset + 'px';
        overlay.style.left = window.pageXOffset + 'px ';
      }
    }, false  );

    //Append overlay to parent
    parent.appendChild(  overlay  );
    if(  child  ){
      overlay.appendChild(  child  );
    }
  }
  /****************END FUNCTION buildOverlay**************************/

  /*****************BEGIN FUNCTION attachRevieweeURL**************************/
  /**
  *Builds and attaches URL with employee query parameters to passed element
  *@method attachRevieweeURL
  *@param {String} anchor String containing reference to HTML `<a>` element
  *to which `href` attribute will be appended
  *@param {Object} revieweeObj Object representing employee under current PMAP review
  *@param {String} hrefAttr URL of succeeding page. Query parameters for employee object will
  *be appended to this string before appending entire string as `href` attribute to 'anchor'
  *@return {none}
  */
  function attachRevieweeURL(  anchor, revieweeObj, hrefAttr  ){
    var qString = hrefAttr + '?';
    // if(  revieweeObj.id  ){
      qString += 'id=' + revieweeObj.id;
      qString += '&';
      qString += 'firstName=' + revieweeObj.firstName;
      qString += '&';
      qString += 'lastName=' + revieweeObj.lastName;
      console.log(  qString  );
    // }
    anchor.setAttribute(  'href', qString  );
  }

  /*****************END FUNCTION attachRevieweeURL**************************/
  /**
  *Appends concatenated employee first and last names to `elem`
  *@method displayRevieweeName
  *@param {String} elem Reference to HTML DOM element for which `revieweeObj` properties
  *will be appended as inner text
  *@return {none}
  *@inner
  */
  function displayRevieweeName(  elem, revieweeObj  ){
    elem.innerText = revieweeObj.firstName + ' ' + revieweeObj.lastName;
  }

  /******************************************************************************/
  /*
  *TODO: UNNECESSARY; CALLING IN PAGE pmapEmployeeInfo.
  */
  // function attachToButton(  button  ){
  //   button.addEventListener(  'click', app.spsQuery.createPMAPDoc, false  );
  // }
  /*****************************************************************************/

  /********************BEGIN FUNCTION showDeadlines*****************************/
  function showDeadlines(  configObj  ){
    var $eventRadioButtons = $(  'input[name="event-type"]'  );

      $eventRadioButtons.on(
        /*
        *$collection.on(  eventHashObj, [,selector][,data])
        *`data` is any type of data to be passed to the event handler,
        *available as a prop named `data` on the `event` object passed
        *to handler function (`event.data`)
        */

        //eventHashObj
        {
          click     :     function(  event  ){
            $(  '#current-event-id'  ).attr(  'data-current', ''  ).text(  ''  );

            $(  '#current-event-id'  ).prev(  'h5'  ).text(  'Current event record: '  );

            $(  '#current-deadline'  ).attr(  'placeholder', ''  );

            $(  '#reminder-text'  ).text(  ''  );
            //console.log(  "Clicked radio button value: " );
            //console.log(  'Value: ' + event.target.value  );
            event.data.listname = event.target.value;
            $(  '.hide.relative'  ).removeClass(  'hide'  ).attr(  'display', 'block'  );
            app.spsQuery.getTablerecords(  event.data  );
          }
        }
        //`data` argument
        , configObj
    );
  }
  /********************END FUNCTION showDeadlines*****************************/

  /****************BEGIN FUNCTION setHideListener******************************/
  function setHideListener( ){
    $target = $( '.hide'  );
    if(  $target.hasClass(  'hide'  )  ){
      $target.removeClass(  'hide'  ).attr(  'display', 'block'  );
    }
  }
  /*******************END FUNCTION setHideListener******************************/


  /*******************BEGIN FUNCTION submitPMAPEvent****************************/
  function submitPMAPEvent(  $formValsArr, updateFieldsArr, conf  ){
      //Return 'shell' query object to begin building query
      var queryConfigObj = app.spsQuery.getSingleEventUpdateQObj(),

      //Query config obj syntax:
      // singleEventUpdateQObj = {
      //   operation     :         'UpdateListItems',
      //   webURL        :         app.getWebURL(),
      //   listName      :         false,
      //   batchCmd      :         'Update',
      //   valuepairs    :         false,
      //   ID            :         false,
      //   completefunc  :         false
      // }

      //Create CAML-formatted query string for 'update' query to SP
      updateCAMLQString = app.spsQuery.makeCAMLString(  $formValsArr, updateFieldsArr, conf[  'batchCmd'  ], conf[  'ID'  ]  );
      // console.log(  '???????????????????????????????????????'  );
      // console.log(  'Form values array: '  );
      // console.log(  $formValsArr  );
      // console.log(  'Update fields array: '  );
      // console.log(  updateFieldsArr  );
      // console.log(  '???????????????????????????????????????'  );
      // console.log("CAML query string: " + updateCAMLQString  );
      // updateCAMLQString += '<Field Name="pmapCoordinatorID">PMAP-COORD-12345</Field>' ;

      //PUSH CREATE DATE ONTO FORM FIELDS VALUE ARRAY
      //$formValsArr.push(  conf.createDate  );


      //Create array of valuepairs to append to query obj as 'valuepairs' prop
      valPairs = app.makeValuepairs(  $formValsArr, updateFieldsArr  );

      //Begin setting query object properties
        queryConfigObj.valuepairs = valPairs;
        queryConfigObj.updates = updateCAMLQString;
        queryConfigObj.listName = conf.listName;
        queryConfigObj.createDate = conf.createDate;
        //Set 'batchCmd' prop of queryConfigObj === conf.batchCmd
        //to make query usable for UPDATE and NEW list item operations
        queryConfigObj.batchCmd = conf.batchCmd;
      if(  conf[  'ID'  ]  !== 'New'  ){
        queryConfigObj[  'ID'  ] = parseInt(  conf[  'ID'  ]  );
      }
      else{
        queryConfigObj[  'ID'  ] = conf[  'ID'  ];
      }



      queryConfigObj[  'completefunc'  ] = function(){
        console.log(  'Hello from an update function! Here\'s a modal: '  );

        //Create success msg modal
        // var msg = app.dom.ui.getConfigObj();
        // app.dom.ui.createModal(  null, msg  );
        $(  '#success-msg'  ).modal(  'open'  );

        //Commenting out to test modal creation
        //window.location.reload();
      };

      console.log(  '********************Submit PMAP Event: queryConfigObj:'  );
      console.dir(  queryConfigObj  );

      //Call spsQuery.updateSPSRecord(queryObj)
      app.spsQuery.updateSPSRecord(  queryConfigObj  );
  }

  /**********************END FUNCTION submitPMAPEvent****************************/

  /*******************BEGIN FUNCTION disableEditCtrls*************************/
  function disableEditCtrls(){
    //Disable event 'edit' and 'delete' buttons
    $(  'td button'  ).addClass(  'disabled'  );
    $(  '#deadlines>legend'  ).text(  'SET DEADLINE FOR NEW PMAP EVENT:'  );
    // $(  'div'  ).has(  '#current-deadline'  ).next(  'button'  ).attr(  'display', 'none'  )
    // .attr(  'visibility', 'hidden'  );
    $(  'div'  ).has(  'input[id="current-deadline"]'  ).next(  'button'  ).addClass(  'disabled'  );
    $(  'label[for="deadline-picker"]'  ).text( 'New Event Deadline: '  );
  //$(  'div'  ).has(  '#current-deadline'  ).next(  'button'  ).addClass(  'disabled'  );
  }

  /********************END FUNCTION disableEditCtrls***************************/


  /*******************BEGIN FUNCTION uncheckStaffLists**************************/
  function uncheckStaffLists(){
    $(  '#reminder-recipients input[type="checkbox"]'  ).not(  '#all-employees').each(  function(){
    });
  }

  function uncheckAll(){
    //console.dir(  $(  '#all-employees'  )  );
    $(  '#all-employees'  ).prop(  'checked', false  );
    return false;
  }
  /*********************END FUNCTION uncheckStaffLists**************************/

  /********************BEGIN FUNCTION badgeExpiringDeadlines********************/
  function badgeExpiringDeadlines(  ){
    var $deadlines = $(  '#my-pmap-events tbody tr td:nth-child(4n)' ),
        deadlineYr,
        deadlineMth,
        deadlineDay,
        compYr,
        compMth,
        compDay,
        deadline,
        comp,
        diff;


    //console.log(  $deadlines  );
    $deadlines.each(  function(  index, currElem  ){

      //Get event deadline as a Date object
      deadline = currElem.innerText.split(  '-'  );
      deadline[  2  ] = deadline[  2  ].substr(  0, deadline[  2  ].length - 9  );
      deadline = new Date(  deadline[  0  ], deadline[  1  ], deadline[  2  ]  );

      // console.log( '/*/'  );
      deadlineYr = deadline.getUTCFullYear();
      deadlineMth = deadline.getUTCMonth();
      deadlineDay = deadline.getUTCDate();
      deadline = Date.UTC(  deadlineYr, deadlineMth, deadlineDay  );
      //Get now as a date object
      comp =  new Date( Date.now() );
      // console.log(  comp  );

      //Divide totol num MS / num of MS in 1 day
      deadline = deadline / 86400000;
      compYr = comp.getUTCFullYear();

      /**
      *TODO: 08/29/2017 10:27EST: getUTCMonth is returning incorrect month for
      *`compMth` variable ( returns current month - 1 ); INVESTIGATE
      */
      compMth = comp.getUTCMonth() + 1;
      compDay = comp.getUTCDate();
      comp = Date.UTC(  compYr, compMth, compDay  );

      //Divide total MS / num MS in 1 day
      comp = comp / 86400000;

      // console.log(  "now: " + comp  );
      diff = deadline - comp;
      // console.log(  diff  );

      if(  diff <=15 && diff > 0  ){
        $(  currElem  ).css(  {  'background-color' : '#ff6f00', 'color' : '#ffffff', 'font-weight' : 'bold'  }  );
      }
      else if(  diff <= 0  ){
        $(  currElem  ).css(  {  'background-color' : '#b71c1c', 'color' : '#ffffff', 'font-weight' : 'bold'  }  );
      }

    });
  }

  /********************BEGIN FUNCTION badgeExpiringDeadlines********************/

  /*******************BEGIN FUNCTION checkboxSelectionLogic*********************/
  function checkboxSelectionLogic(){
    /*******************CHECKBOX SELECTION LOGIC*************************/
    $(  '#all-employees'  ).on(  'change', function(  event  ){
      $(  '#reminder-recipients input[type="checkbox"]'  ).not(  '#all-employees' ).each(  function(){
        if(  $(  this  ).prop(  'checked'  ) === true  ){
          $(  this  ).prop(  'checked', false  );
        }
      });
      if(
        $('#reminder-recipients input[type="checkbox"]').not(  '#all-employees' ).eq(  0  ).prop(  'checked'  ) === false &&
        $('#reminder-recipients input[type="checkbox"]').not(  '#all-employees' ).eq(  1  ).prop(  'checked'  ) === false &&
        $('#reminder-recipients input[type="checkbox"]').not(  '#all-employees' ).eq(  2  ).prop(  'checked'  ) === false &&
        $(  '#all-employees'  ).prop(  'checked'  ) === false
      ){ $(  '#all-employees'  ).prop(  'checked', true  ); }
      //APP.dom.uncheckStaffLists();
      }  );

    $(  '#reminder-recipients input[type="checkbox"]'  ).not(  '#all-employees').on(  'change', function(  event  ){
      if(  $(  '#all-employees'  ).prop(  'checked'  ) === true  ){
        $(  '#all-employees'  ).prop(  'checked', false  );
      }

      if(  $(  this  ).prop(  'checked'  )  === 'undefined'  ){
        $(  this  ).prop(  'checked', true  );
      }else if(  $(  this  ).prop(  'checked'  )  === 'checked'  ){
        $(  this  ).prop(  'checked', false  );
      }

      if(
        $('#reminder-recipients input[type="checkbox"]').not(  '#all-employees' ).eq(  0  ).prop(  'checked'  ) === false &&
        $('#reminder-recipients input[type="checkbox"]').not(  '#all-employees' ).eq(  1  ).prop(  'checked'  ) === false &&
        $('#reminder-recipients input[type="checkbox"]').not(  '#all-employees' ).eq(  2  ).prop(  'checked'  ) === false &&
        $(  '#all-employees'  ).prop(  'checked'  ) === false
      ){ $(  '#all-employees'  ).prop(  'checked', true  ); }
      //$(  this  ).attr(  'checked', true  );
      //console.log(  $(  this  ).attr(  'name'  ) + ' is: ' + $(  this  ).prop(  'checked'  )  );
      return false;
    } );

    /*******************END CHECKBOX SELECTION LOGIC*************************/
  }

  /******************END FUNCTION checkboxSelectionLogic************************/
  //Return public API

  return(
    {
      buildOverlay          :         buildOverlay,
      buildEmployeeTable    :         buildEmployeeTable,
      buildEditButtons      :         buildEditButtons,
      attachRevieweeURL     :         attachRevieweeURL,
      displayRevieweeName   :         displayRevieweeName,
      // attachToButton        :         attachToButton,
      showDeadlines         :         showDeadlines,
      createButtons         :         createButtons,
      setHideListener       :         setHideListener,
      submitPMAPEvent       :         submitPMAPEvent,
      uncheckStaffLists     :         uncheckStaffLists,
      uncheckAll            :         uncheckAll,
      disableEditCtrls      :         disableEditCtrls,
      badgeExpiringDeadlines:         badgeExpiringDeadlines,
      checkboxSelectionLogic:         checkboxSelectionLogic
    }
  )
}  )(  window, APP, this  );
