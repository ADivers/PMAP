/*
*Filename       :   spsQuery.js
*Create Date    :   08/10/2017 16:30 EST
*Author         :   jFarrow02
*Purpose        :   App module for SPServices queries and helper functions
*/

/**
*@module APP
*@main APP
*@class spsQuery
*/
APP.spsQuery = (  function(  app, global  ){

  /**
  *Object map to build CAMLViewFields for SPS query. Maps object keys to
  *SP `Employees` list item properties to return on reviewee select screen.
  *@property selectRevieweeCAMLViewfields
  *@type Object
  *@private
  */
  var selectRevieweeCAMLViewfields = {
    firstName             :         "firstName",
    LastName              :         "lastName",
    employeeID            :         "employeeID",
    mgrSuprFlag           :         "mgrSuprFlag",
    positionTitle         :         "positionTitle"

  },

  /**
  *Object map to build CAMLViewFields for SPS query. Maps object keys to
  *SP `Employees` list item properties to return on employee info screen.
  *@property employeeInfoCAMLViewFields
  *@type Object
  *@private
  */
    employeeInfoCAMLViewFields = {
      firstName         :         "firstName",
      LastName          :         "lastName",
      employeeID        :         "employeeID",
      organization      :         "organization",
      positionTitle     :         "positionTitle",
      positionSeries    :         "positionSeries",
      positionGrade     :         "positionGrade",
      mgrID             :         "mgrID",
      directorID        :         "directorID"
    },

    /**
    *
    *@property writtenNarrativeCAMLViewFields
    *@type Object
    *@private
    */
    writtenNarrativeCAMLViewFields = {
      writNarrID        :       "writNarrID",
      pmapDocID         :       "pmapDocID",
      "required\?"      :       "required?",
      narrativeText     :       "narrativeText"
    },

    /**
    *
    *@property pmapEventCAMLViewFields
    *@type Object
    *@private
    */
    pmapEventCAMLViewFields = {
      //event_id              :         "event_id",
      'ID'                  :         "ID",
      event_type            :         "event_type",
      createDate            :         "createDate",
      dueDateIntervalEnd    :         "dueDateIntervalEnd"
    },
  /**
  *CAML-formatted query options string for SPS call to select reviewees
  *@property CAMLQueryOptions
  *@type String
  *@private
  */
    CAMLQueryOptions = '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',

    /**
    *URL of SP table to query ('Employees') for reviewee selection
    *@property webURL
    *@type String
    *@private
    */
    webURL = app.getWebUrl(),

    /**
    *Table name to query for reviewee selection
    *@property listName
    *@type String
    *@private
    */
    listName = 'Employees',

    /**
    *Query string defining fields to return/field order from SPS query for reviewees.
    *CAML Query structure:
    *  `<Query>`
    *    `<Where>(<GroupBy>)(<OrderBy>)` -->ANY OR ALL
    *      `<Lt>(<And>)(<BeginsWith>)(<Contains>)(<Eq>)(<Gt>)(<Geq>)(<In>)(<Includes>)(<IsNotNull>)(<IsNull>)(<Leq>)(<Neq>)(<NotIncludes>)(<Or>)`
    *        `<FieldRef Name="FieldName"/>`
    *        `<Value Type="Counter">3</Value>`
    *     `</Lt>(</And>)(</BeginsWith>)(</Contains>)(</Eq>)(</Gt>)(</Geq>)(</In>)(</Includes>)(</IsNotNull>)(</IsNull>)(</Leq>)(</Neq>)(</NotIncludes>)(</Or>)`
    *    `</Where>(</GroupBy>)(</OrderBy>)`
    *  `</Query>`
    *NOTE: Any given `And` element can have only two conjuncts; that is, only
    two child elements. If you need to conjoin three or more conditions,
    you must nest the `And` elements
    *@property CAMLQuery
    *@type String
    *@private
    */
    CAMLQuery = '<Query>' +
      '<Where>' +
        '<Or>' +
        '<Eq>' +
          '<FieldRef Name="mgrID"/><Value Type="Text">' + 'MGR-12345' + '</Value>' +
        '</Eq>' +
        '<Eq>' +
          '<FieldRef Name="mgrID"/><Value Type="Text">' + 'MGR-56789' + '</Value>' +
        '</Eq>' +
        '</Or>' +
      '</Where>' +
    '</Query>',

    /**
    *Query string defining fields to return from SPS query for PMAP events.
    *@property CAMLEventsQuery
    *@type String
    *@private
    *
    */
    CAMLEventsQuery = '<Query>\n' +
                        '<Where>\n' +
                          '<Eq>\n' +
                            '<FieldRef Name="pmapCoordinatorID"/><Value Type="Text">' + 'PMAP-COORD-12345' + '</Value>' +
                          '</Eq>\n' +
                        '</Where>\n' +
                        '<OrderBy>\n' +
                          '<FieldRef Name="dueDateIntervalEnd" Ascending="TRUE"/>' +
                        '</OrderBy>\n' +
                      '</Query>',

  /**
  **Object mapping 'ows' fields returned in sps query results to non-ows properties
  *in results object
  *@property eventsQueryMap
  *@type Object
  *@private
  *
  */
    eventsQueryMap =  {
      //ows_event_id            :   {  mappedName   : 'event_id', objectType: 'Text'},
      ows_ID                  :   {  mappedName   : 'ID', objectType: 'Text' },
      ows_event_type          :   {  mappedName   : 'event_type', objectType: 'Text'},
      ows_createDate          :   {  mappedName   : 'createDate', objectType:  'Text'  },
      ows_dueDateIntervalEnd  :   {  mappedName   : 'intervalEndDueDate',  objectType:  'Text'  }
    },

    /**
    *Object defines fields to return in sps query results on PMAP events table
    *@property pmapEventCAMLViewFields
    *@type Object
    *@private
    *
    */
    pmapEventCAMLViewFields = {
        //eventID               :         "eventID",
        //event_id              :         "event_id",
        'ID'                  :         "ID",
        event_type            :         "event_type",
        createDate            :         "createDate",
        dueDateIntervalEnd    :         "dueDateIntervalEnd",
        msgText               :         "msgText",
        msgSendDeadline       :         "msgSendDeadline"

    },

    /**
    *Object defines query parameters for single PMAP event
    *@property singleEventQConfigObject
    *@type Object
    *@private
    */
    singleEventQConfigObject = {

      'ID'              :       null,
      webURL            :       webURL,
      listName          :       null,
      rowLimit          :       1,
      CAMLViewFields    :       pmapEventCAMLViewFields,
      CAMLQueryOptions  :       CAMLQueryOptions,
      CAMLQuery         :       null,
      // "completeFunc"      :       function(  resJSON  ){
      //   console.log(  'Hello from a refactored query!'  );
      // },
      mapping           :       {
                                  //ows_event_id            :         {  mappedName: 'event_id',  objectType:  'Text'  },
                                  ows_ID                  :         {  mappedName: 'ID', objectType: 'Text'  },
                                  ows_event_type          :         {  mappedName: 'event_type', objectType: 'Text' },
                                  ows_createDate          :         {  mappedName: 'createDate', objectType: 'Text' },
                                  ows_dueDateIntervalEnd  :         {  mappedName: 'dueDateIntervalEnd', objectType: 'Text' },
                                  ows_msgText             :         {  mappedName: 'msgText', objectType: 'Text' },
                                  ows_msgSendDeadline     :         {  mappedName: 'msgSendDeadline', objectType: 'Text'}
                                }

    },

    /*********************BEGIN UPDATE Query Configuration Variables***************************/

    /************SPServices Update Syntax*****************
    {
      operation     :         'UpdateListItems',
      webURL        :         webURL,
      listName      :         listName,
      batchCmd      :         batchCmd,
      valuepairs    :         valuePairs,
      ID            :         pmapDocID,
      completefunc  :         function(  xData, Status  ){
        var output = $().SPServices.SPDebugXMLHttpResult(
          {
            node        :   xData.responseXML
          }
        );
    }
    ****************************************************/
    /**
    *Object defines query parameters for update to single PMAP event record
    *@property singleEventUpdateQObj
    *@type Object
    *@private
    */
    singleEventUpdateQObj = {
      operation     :         'UpdateListItems',
      webURL        :         app.getWebUrl(),
      listName      :         false,
      batchCmd      :         false,
      valuepairs    :         false,
      ID            :         false,
      completefunc  :         false
    },

    /**
    *Array containing names of fields to be updated on PMAP event record. This array will
    *be used to create `valuepairs` array when building sps query.
    *@property updateListFieldValsArr
    *@type Array
    *@private
    */
    updateListFieldValsArr = [  'to', 'dueDateIntervalEnd', 'msgSendDeadline',  'msgText', 'createDate', 'pmapCoordinatorID'  ],
    /*********************END UPDATE Query Configuration Variables***************************/
  /**
  *Cache object holding results of SPS query for reviewees
  *@property revieweesCache
  *@type Object
  *@private
  */
  revieweesCache;

  /**
  *@method buildCAMLViewfields
  *@return {String} `fieldnames` String formatted as an XML ViewFields element.
  *`fieldnames` string will be
  *Specifies to SPServices which fields to return from query.
  *Format:`</ViewFields><FieldRef Name="FieldName"/><FieldRef Name="FieldName2"/><ViewFields>`
  *@inner
  */
  function buildCAMLViewfields(  configObj  ){
    var fieldnames = '<ViewFields>';
          for(  var fieldname in configObj  ){
            fieldnames +='<FieldRef Name="' + configObj[  fieldname  ];
            fieldnames += '"/>';
          }
        fieldnames += '</ViewFields>';

        // console.log(  "From buildCAMLViewfields: "  );
        // console.log(  fieldnames  );
        return fieldnames;
  }

  /******************BEGIN FUNCTION makeCAMLString****************************/
  // *Constructs and return CAML string to define fields to create/update on SP list item
  // *@method makeCAMLString
  // *@param {Object} formValsObj Object mapping form input values to SP list static names
  // *@param {Array} listFieldsArr Array containing SP list static names
  // *@return {String} `camlStr`: String representing SP list item fields to create (or update on
  // *update operations)
  // */
  function makeCAMLString(  formValsObj, listFieldsArr, Cmd, id  ){
    /*
    *CONSIDER REFACTORING TO USE formValsObj ONLY; listFieldsArr may be UNNEEDED
    */
    var camlStr = '<Batch OnError="Continue">' +
                  //'<Method ID="1" Cmd="New">';
                  '<Method ID="' + Date.now() + '" Cmd="' + Cmd + '">';
    for(  var i = 0; i < listFieldsArr.length; i++  ){

      //Hard-code the pmapCoordinatorID property for now
      if(  listFieldsArr[  i  ] === 'pmapCoordinatorID'  ){
        camlStr += '<Field Name="' + listFieldsArr[  i  ] + '">PMAP-COORD-12345</Field>';
      }
      else{
        camlStr += '<Field Name="' + listFieldsArr[  i  ];
        camlStr += '">';
        var propName = Object.getOwnPropertyNames(  formValsObj  )[  i  ];
        camlStr += formValsObj[  propName  ];
        camlStr += '</Field>';
      }
    }
    /*
    *IMPORTANT NOTE:
    *MUST MUST MUST set '<Field Name="ID"><id_of_item_to_update</Field>'
    *in the list of properties to update for an SP Update operation
    *to work properly!!! Update will *FAIL* otherwise!!!
    */
    camlStr += '<Field Name="ID">' + id + '</Field>';
    camlStr += '</Method></Batch>';
    console.log(  camlStr  );
    return camlStr;
  }

  /*********************END FUNCTION makeCAMLString***************************/


  /******************BEGIN FUNCTION getReviewees********************/
  /**
  *Builds and sends SPServices query to `Employee` SharePoint list. Returns Employee
  *records for supervisor to allow supervisor to select an employee and initiate
  *a PMAP
  *@method getReviewees
  *@return {none}
  *@inner
  */
  function getReviewees(){
    var CAMLViewFields = buildCAMLViewfields(  selectRevieweeCAMLViewfields  ),
    table = document.getElementById(  'employees'  ),
    tablebody = document.querySelector(  '#employees>tbody'  ),
    editButtonsArr = [];

    $().SPServices(
      {
        operation         :         'GetListItems',
        viewName          :         '',
        webURL            :         webURL,
        listName          :         listName,
        CAMLRowLimit      :         1000,
        CAMLViewFields    :         buildCAMLViewfields(  selectRevieweeCAMLViewfields  ),
        CAMLQueryOptions  :         CAMLQueryOptions,
        CAMLQuery         :         CAMLQuery,
        completefunc      :         function(  xData, Status  ){


          var res = $(  xData.responseXML  ).SPFilterNode( 'z:row'  ).SPXmlToJson(
            {
              mapping : {
                ows_firstName	:	{  mappedName: 'firstName', objectType: 'Text'  },
                ows_lastName	:	{  mappedName: 'lastName', objectType: 'Text'  },
                ows_ID        : {  mappedName:  'SP-ID', objectType: 'Text'  },
                ows_mgrSuprFlag : {  mappedName:  'mgrSuprFlag', objectType : 'Text'  }
                // ows_currentReviewee : {  mappedName: 'currentReviewee', objectType: 'Number'  }
              },
              incluedAllAttrs : true,
              removeOws       : true,
              sparse          : false
            }
          );
          console.log(  "RES: "  );
          revieweesCache = APP.util.extendDeep(  res  );
          app.dom.buildEditButtons(  res, editButtonsArr  );
          //console.log(  editButtonsArr  );
          app.dom.buildEmployeeTable(  res, table, tablebody, editButtonsArr  );
          console.log(  revieweesCache  );
        }
      }
    );
  }

  /******************END FUNCTION getReviewees********************/

  /****************BEGIN FUNCTION getTablerecords*******************/
  function getTablerecords(  configObject  ){
    //Remove duplicate results from admin events table
    //on multiple clicks of `event type` checkboxes
    // console.log(  'Initiated getTablerecords...'  );
      if( $(  '#my-pmap-events'  )  ){
        if(  $(  '#my-pmap-events tbody'  )  ){
          if(  $(  '#my-pmap-events tbody tr'  ).length  > 0  ){
            $(  '#my-pmap-events tbody'  ).empty();
          }
        }
      }

      var CAMLViewFields = buildCAMLViewfields(  pmapEventCAMLViewFields  ),
          queryResults,
          table = document.querySelector(  '#my-pmap-events'  ),
          tablebody = table.querySelector(  'tbody'  ),
          editButtonsArr = [],
          deleteButtonsArr = [];

          //console.log(  'Beginning SPServices query...'  );
          $().SPServices(
            {
              operation         :         'GetListItems',
              viewName          :         '',
              webURL            :         webURL,
              listName          :         configObject.listname,
              CAMLRowLimit      :         1000,
              CAMLViewFields    :         CAMLViewFields,
              CAMLQueryOptions  :         CAMLQueryOptions,
              CAMLQuery         :         configObject.camlQuery,
              completefunc      :         function(  xData, Status  ){
                var res = $(  xData.responseXML  ).SPFilterNode( 'z:row'  ).SPXmlToJson(
                  {
                    mapping         : configObject.objMapping,
                    incluedAllAttrs : true,
                    removeOws       : true,
                    sparse          : false
                  }
                );
                // console.log('Query Parameters:*********************************\n');
                // console.log(  'CAML View Fields: ' + CAMLViewFields  );
                // console.log(  'CAML Query Options: ' + CAMLQueryOptions  );
                // console.log(  'CAML Query:\n ' + configObject.camlQuery  );


                console.log(  "RES: "  );
                console.log(  res  );
                var addButtonConfigObj = {
                  iconText          :     'add',
                  tooltip           :     'Edit this Reminder',
                  linksRequired     :     false,
                  buttonDataId      :     'event_id'
                  },

                    deleteButtonConfigObj = {
                      iconText          :         'delete',
                      tooltip           :         'Delete this Reminder',
                      linksRequired     :         false,
                      buttonDataId      :         'event_id'
                    },

                    queryConfigObj = {
                      event_id  : ""
                    },
                    $lastTd,
                    $newTd,
                    i,
                    max = res.length;

                editButtonsArr = app.dom.createButtons(  res, editButtonsArr, null, addButtonConfigObj, queryConfigObj  );
                deleteButtonsArr = app.dom.createButtons(  res, deleteButtonsArr, null, deleteButtonConfigObj, queryConfigObj  );

                app.dom.buildEmployeeTable(  res, table, tablebody, editButtonsArr  );
                for(  i = 0; i < max; i+= 1  ){
                  if(  parseInt(  deleteButtonsArr[  i  ].dataset.index  )  === i  ){
                    $lastTd = $(  '#my-pmap-events tr>td:last-child'  );
                    $newTd = $(  '<td></td>'  ).html(  deleteButtonsArr[  i  ]  );
                    if(  $lastTd.eq(  i  ).data(  'index'  )  === $newTd.data(  'index'  )  ){
                      $lastTd.eq(  i  ).after(  $newTd  );
                    }
                  }
                }

                /******************BEGIN 'event-type' CHANGE HANDLER LOGIC****************/
                APP.dom.badgeExpiringDeadlines();
              }
            }
          );

  }
  /******************END FUNCTION getTablerecords*******************/


  /****************BEGIN FUNCTION getReviewee*********************/
  /**
  *Constructs and sends SPServices query to SharePoint list for employee record representing
  *employee whose PMAP is under current review by user
  *@method queryCurrentReviewee
  *@param {Object} revieweeObj Object containing URL query string parameters, representing
  *query values to pass to SPServices query
  *@return {none}
  *@inner
  */
  function queryCurrentReviewee(  revieweeObj  ){
    var CAMLViewFields = buildCAMLViewfields(  selectRevieweeCAMLViewfields  ),
        CAMLQuery = '<Query>\n' +
                              '<Where>\n' +
                                '<And>\n' +
                                  '<And>\n' +
                                    '<Eq>\n'  +
                                      '<FieldRef Name="ID"/>\n' +
                                      '<Value Type="Text">' + revieweeObj.id + '</Value>\n' +
                                    '</Eq>\n' +
                                    '<Eq>\n'  +
                                      '<FieldRef Name="lastName"/>\n' +
                                      '<Value Type="Text">' + revieweeObj.lastName + '</Value>\n' +
                                    '</Eq>\n' +
                                  '</And>\n'  +
                                  '<Eq>\n'  +
                                    '<FieldRef Name="firstName"/>\n' +
                                      '<Value Type="Text">' + revieweeObj.firstName + '</Value>\n' +
                                  '</Eq>\n' +
                                '</And>\n'  +
                              '</Where>\n' +
                            '</Query>';
          //revieweeObjCache = {  mgrSuprFlag: false };


                            $().SPServices(
                              {
                                operation         :         'GetListItems',
                                viewName          :         '',
                                webURL            :         webURL,
                                listName          :         listName,
                                CAMLRowLimit      :         1,
                                CAMLViewFields    :         CAMLViewFields,
                                CAMLQueryOptions  :         CAMLQueryOptions,
                                CAMLQuery         :         CAMLQuery,
                                completefunc      :         function(  xData, Status  ){
                                  console.log(  Status  );
                                  var res = $(  xData.responseXML  ).SPFilterNode( 'z:row'  ).SPXmlToJson(
                                    {
                                      mapping : {
                                        ows_firstName	:	{  mappedName: 'firstName',     objectType: 'Text'  },
                                        ows_lastName	:	{  mappedName: 'lastName',      objectType: 'Text'  },
                                        ows_ID        : {  mappedName:  'SP-ID',        objectType: 'Text'  },
                                        ows_mgrSuprFlag    : {  mappedName:  'mgrSuprFlag', objectType: 'Text'  },
                                        ows_positionTitle: {  mappedName: 'positionTitle', objectType: 'Text'}
                                      },
                                      incluedAllAttrs : true,
                                      removeOws       : true,
                                      sparse          : false
                                    }
                                  );

                                  // revieweeObjCache.mgrSuprFlag = res[  0  ].mgrSuprFlag;
                                  // console.log(  '##############################################'  );

                                  console.log(  $().SPServices.SPGetStaticFromDisplay(
                                    {
                                      webURL: webURL,
                                      listName: listName,
                                      columnDisplayNames: ['firstName', 'lastName', 'ID', 'mgrSuprFlag', 'positionTitle']
                                    }
                                  ));

                                  // console.log(  "Response 0: "  );
                                  // console.log(  res[  0  ]  );
                                  // console.log(  revieweeObjCache  );

                                  elem = document.getElementById(  'reviewee-name'  );
                                  elem.innerText = 'Reviewee: ' + res[  0  ][  'firstName'  ] + ' '
                                  + res[  0  ][  'lastName'  ];

                                  //return revieweeObjCache;
                                  // console.log( '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'  );
                                  // console.log(  revieweeObjCache  );
                                  // return revieweeObjCache;
                                }
                              }
                            );
    }

  /*****************END FUNCTION getReviewee*********************/

  /****************BEGIN FUNCTION checkCurrentReviewee**************/
  /**
  *Parses URL query string for current reviewee record id, first name, and last name.
  *Creates object representing current reviewee with id, first name, and last name properties
  *; values correspond to parsed query string properties
  *@method parseCurrentReviewee
  *@return {Object} `currentReviewee` Object representing employee whose PMAP is under current review
  *@inner
  */
  function parseCurrentReviewee(){
    var qString = global.location.search,
        paramsArr = [],
        currentReviewee = {  id: '', firstName: '', lastName: '', mgrSuprFlag: '', pmapDocID: ''  };
    qString = qString.substr(  1, qString.length  );
    qString = qString.split(  '&'  );

    for(  var i = 0; i < qString.length; i+= 1  ){
      param = qString[  i  ].split(  '='  );
      if(  currentReviewee.hasOwnProperty(  param[  0  ]  )  ){
        currentReviewee[  param[  0  ]  ] = param[  1  ]
      }
    }
    // console.log(  "From parse current reviewee---------------------------->CurrentReviewee: " );
    // console.dir(  currentReviewee  );
    // console.log(  "Query string: " + qString  );
    return currentReviewee;

  }

/****************END FUNCTION checkCurrentReviewee**************/

/*******************BEGIN FUNCTION populateEmployeeInfo********************/
/**
*Constructs and sends SPServices query to return employee record. Populates employee information
*in DOM on `pmapEmployeeInfo.html` view.
*@method populateEmployeeInfo
*@param revieweeObj {Object} Object representing parameters of current employee under PMAP review/employee record to return in query
*@inner
*
*/
  function populateEmployeeInfo(  revieweeObj  ){
    var CAMLViewFields = buildCAMLViewfields(  employeeInfoCAMLViewFields  ),
        CAMLQuery = '<Query>\n' +
                          '<Where>\n' +
                            '<And>\n' +
                              '<And>\n' +
                                '<Eq>\n'  +
                                  '<FieldRef Name="ID"/>\n' +
                                  '<Value Type="Text">' + revieweeObj.id + '</Value>\n' +
                                '</Eq>\n' +
                                '<Eq>\n'  +
                                  '<FieldRef Name="lastName"/>\n' +
                                  '<Value Type="Text">' + revieweeObj.lastName + '</Value>\n' +
                                '</Eq>\n' +
                              '</And>\n'  +
                              '<Eq>\n'  +
                                '<FieldRef Name="firstName"/>\n' +
                                  '<Value Type="Text">' + revieweeObj.firstName + '</Value>\n' +
                              '</Eq>\n' +
                            '</And>\n'  +
                          '</Where>\n' +
                        '</Query>';

        $().SPServices(
          {
            operation         :         'GetListItems',
            viewName          :         '',
            webURL            :         webURL,
            listName          :         listName,
            CAMLRowLimit      :         1,
            CAMLViewFields    :         CAMLViewFields,
            CAMLQueryOptions  :         CAMLQueryOptions,
            CAMLQuery         :         CAMLQuery,
            completefunc      :         function(  xData, Status  ){
              console.log(  Status  );
              var res = $(  xData.responseXML  ).SPFilterNode( 'z:row'  ).SPXmlToJson(
                {
                  mapping : {
                              ows_firstName	        :	{  mappedName:    'firstName', objectType: 'Text'  },
                              ows_lastName	        :	{  mappedName:    'lastName', objectType: 'Text'  },
                              ows_ID                : {  mappedName:    'SP-ID', objectType: 'Text'  },
                              ows_organization      : {  mappedName:    'organization', objectType:  'Text'  },
                              ows_positionTitle     : {  mappedName:    'positionTitle', objectType:  'Text'  },
                              ows_positionSeries    : {  mappedName:    'positionSeries', objectType:  'Text'  },
                              ows_positionGrade     : {  mappedName:    'positionGrade', objectType:  'Text'  },
                              ows_mgrID             : {  mappedName:    'mgrID', objectType:  'Text'  },
                              ows_directorID        : {  mappedName:    'directorID', objectType:  'Text'  }
                  },
                  incluedAllAttrs : true,
                  removeOws       : true,
                  sparse          : false
                }
            ),
            infoParagraphs = document.querySelectorAll(  '#projects-collections>.collection-item>.row>div:nth-child(2n)>p'  );
          //console.log(  res  ); -->OK

          //Begin assigning SP (reviewee) record values
          //to DOM elements
          infoParagraphs[  0  ].innerText = res[  0  ][  'firstName'  ] + ' ' + res[  0  ][  'lastName'  ];
          infoParagraphs[  1  ].innerText = res[  0  ][  'organization'  ];
          infoParagraphs[  2  ].innerText = res[  0  ][  'positionSeries'  ];
          infoParagraphs[  3  ].innerText = res[  0  ][  'positionGrade'  ];
          res[  0  ][  'mgrID'  ] === '' ? infoParagraphs[  4  ].innerText = res[  0  ][  'directorID'  ] : infoParagraphs[  4  ].innerText = res[  0  ][  'mgrID'  ];
          }
        });
      }
/*******************END FUNCTION populateEmployeeInfo********************/



/*******************BEGIN FUNCTION getEventsCamlQ************************/
  function getEventsCamlQ(){
    return CAMLEventsQuery;
  }
/******************END FUNCTION getEventsCamlQ***************************/

/******************BEGIN FUNCTION getEventsObjMap***********************/
  function getEventsObjMap(){
    return eventsQueryMap;
  }
/******************END FUNCTION getEventsObjMap*************************/

/*****************BEGIN FUNCTION getsingleEventQConfigObject********************/
  function getSingleEventQConfigObject(){
    /**
    *TODO: 08-23-2017 13:57 EST
    *Refactor to return proper CONFIGURATION OBJECT based on list name
    *coming from `edit` button clicks
    */
    //$(  'input[name="event-type"]'  ).on(  'change', function(  event  ){
      var $val = $(  'input[name="event-type"]:checked'  ).val();
      return singleEventQConfigObject;
}

/********************END FUNCTION singleEventQConfigObject*********************/


/********************BEGIN FUNCTION getSingleEventUpdateQObj*************************/
  function getSingleEventUpdateQObj(){
    return singleEventUpdateQObj;
  }

/********************BEGIN FUNCTION getSingleEventUpdateQObj*************************/


/********************BEGIN FUNCTION getUpdateListFieldValsArr*************************/
  function getUpdateListFieldValsArr(){
    return updateListFieldValsArr;
  }


/********************BEGIN FUNCTION getUpdateListFieldValsArr*************************/

/*******************BEGIN FUNCTION getSPSListItems************************/
  function getSPSListItems(  queryConfigObj, callback  ){
    // var string = "Hello World!!!",
    //     viewFields = buildCAMLViewfields(  queryConfigObj.CAMLViewFields  );
        //Create duplicate reference to queryConfigObj for use inside completefunc
    var obj = app.util.extendDeep(  queryConfigObj  );
    $().SPServices(
        {
          operation         :         'GetListItems',
          viewName          :         '',
          webURL            :         queryConfigObj.webURL,
          listName          :         queryConfigObj.listName,
          CAMLRowLimit      :         queryConfigObj.rowLimit,
          CAMLViewFields    :         buildCAMLViewfields(  queryConfigObj.CAMLViewFields  ),
          CAMLQueryOptions  :         queryConfigObj.CAMLQueryOptions,
          CAMLQuery         :         queryConfigObj.CAMLQuery,
          completefunc      :         function(  xData, Status ){

                                        var res = $(  xData.responseXML  ).SPFilterNode(  'z:row'  ).SPXmlToJson(
                                          {
                                            mapping           : obj.mapping,
                                            includeAlAttrs    : true,
                                            removeOws         : true,
                                            sparse            : false
                                          }
                                        );

                                        /************DEBUG RESULTS******************/
                                        // console.log(  '----------------------------->CAML View Fields from getSPSListItems: '  );
                                        // console.log(  this.CAMLQuery  );
                                        // console.log(  this.CAMLViewFields  );
                                        // var output = $().SPServices.SPDebugXMLHttpResult(
                                        //   {
                                        //     node        :   xData.responseXML
                                        //   }
                                        // );

                                        /***QUERY DEBUGGING HELPER****/
                                        //Output results of SPDebugXMLHttpResult function
                                        //to your HTML doc for visual inspection
                                        // outputDiv = document.createElement(  'div'  );
                                        // outputDiv.innerHTML = output;
                                        //$(  '#query-results'  ).html(  outputDiv  );

                                        /****************************/
                                        if(  Status === 'success'  ){
                                          // console.log(  '--------------------------------------->RES:'  );
                                          // console.log(  res  );
                                          obj.completefunc( res  );

                                        }
                                        else{
                                          console.log(  Status  );
                                          console.log(  xData.responseText  );
                                          // var output = $().SPServices.SPDebugXMLHttpResult(
                                          //   {
                                          //     node        :   xData.responseXML
                                          //   }
                                          // );
                                        }
                                    //obj.completefunc(  res  );
                                    /*************************************************/
        }
      }
    );
  }

  //REFACTOR
  // function getSPSListItems(  queryConfigObj, callback  ){
  //
  //       //Create duplicate reference to queryConfigObj for use inside completefunc
  //   var obj = app.util.extendDeep(  queryConfigObj  );
  //   $().SPServices(
  //       {
  //         operation         :         'GetListItems',
  //         viewName          :         '',
  //         webURL            :         queryConfigObj.webURL,
  //         listName          :         queryConfigObj.listName,
  //         CAMLRowLimit      :         queryConfigObj.rowLimit,
  //         CAMLViewFields    :         buildCAMLViewfields(  queryConfigObj.CAMLViewFields  ),
  //         CAMLQueryOptions  :         queryConfigObj.CAMLQueryOptions,
  //         CAMLQuery         :         queryConfigObj.CAMLQuery,
  //         completefunc      :         function(  xData, Status ){
  //                                       //console.log(  obj  );
  //                                       console.log(  '#######################################################'  );
  //                                       console.log(  xData.responseText  );
  //                                       var res = $(  xData.responseXML  ).SPFilterNode(  'z:row'  ).SPXmlToJson(
  //                                         {
  //                                           mapping           : obj.mapping,
  //                                           includeAlAttrs    : true,
  //                                           removeOws         : true,
  //                                           sparse            : false
  //                                         }
  //                                       );
  //                                       // console.log(  Status  );
  //                                       // console.log(  "*********RES*******"  );
  //                                       // console.dir(  res  );
  //                                       obj.completeFunc(  res  );
  //                                     }
  //     }
  //   );
  // }
/********************END FUNCTION getSPSListItems*************************/



/*******************BEGIN FUNCTION updateSPSRecord***********************/
  function updateSPSRecord(  queryConfigObj  ){
      //Create deep copy of query config object
      var obj = app.util.extendDeep(  queryConfigObj  );
        /************SPServices Update Syntax*****************/

        console.log(  '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$QueryObj Deep copy:'  );
        console.dir(  obj  );

      $().SPServices(
        {
          operation     :         obj.operation,
          webURL        :         obj.webURL,
          listName      :         obj.listName,
          batchCmd      :         obj.batchCmd,
          //Refactored to use 'updates' CAML-formatted update query string
          //valuepairs    :         obj.valuePairs,
          updates       :         obj.updates,
          ID            :         obj[  'ID'  ],
          completefunc  :         function(  xData, Status  ){
            // var output = $().SPServices.SPDebugXMLHttpResult(
            //   {
            //     node        :   xData.responseXML
            //   }
            // );


            if(  Status === 'success'  ){
              obj.completefunc();
            }
            else{
              console.log(  Status  );
              // console.log(  xData.responseText  );
              // /***QUERY DEBUGGING HELPER****/
              // //Output results of SPDebugXMLHttpResult function
              // //to your HTML doc for visual inspection
              // outputDiv = document.createElement(  'div'  );
              // outputDiv.innerHTML = output;
              // $(  '#query-results'  ).html(  outputDiv  );

              /****************************/
            }
        }
      }
    );
  }
/**********************END FUNCTION updateSPSRecord*********************/


/*******************BEGIN FUNCTION deleteSPSRecord***********************/
  // function deleteSPSRecord(  configObj  ){
  //   $().SPServices(
  //     {
  //       operation     :     configObj.operation,
  //       listName      :     configObj.listName,
  //       'ID'          :     configObj[  'ID'  ],
  //       updates       :     configObj.updates,
  //       completefunc  :     function(  xData, Status  ){
  //
  //       }
  //     }
  //   )
  // }




/*******************END FUNCTION deleteSPSRecord*************************/


/*******************BEGIN FUNCTION saveEmployeeNarrative*****************/
  function saveEmployeeNarrative(){
    var $textarea = $(  '#textarea1'),
        narrativeText = $textarea.val();
    //console.log(  narrativeText  ); -->OK
    if( narrativeText !== '' && narrativeText !== null  ){

    }
  }


/*******************END FUNCTION saveEmployeeNarrative*****************/


  /****************BEGIN FUNCTION spsQuery***********************/
  function spsQuery(  queryObj  ){
    /*
      queryObj = {
        operation : 'GetListItems',
        viewName  : '',
        webURL    : <url>,
        listName  : <list name>,
        CAMLRowLimit  : <limit>,
        CAMLViewFields  : <view fields>,
        CAMLQueryOptions  : <options>,
        CAMLQuery         : <query>,
        completefunc  : <function>
    }
    */
  }

  /********************BEGIN FUNCTION debugQueryResults*******************/
  // function debugQueryResults(  xData  ){
  //   var debugDiv = document.createElement(  'div' ),
  //       out = $().SPServices.SpDebugXMLHttpResult(
  //         {
  //           node  : xData.responseXML
  //         }
  //       );
  //       debugDiv.innerHTML = out;
  //       $(  'body'  ).append(  debugDiv  );
  // }


  /********************END FUNCTION debugQueryResults*******************/
  /***************END FUNCTION spsQuery*************************/

    return(
      {
        buildCAMLViewfields            :         buildCAMLViewfields,
        getReviewees                   :         getReviewees,
        queryCurrentReviewee           :         queryCurrentReviewee,
        parseCurrentReviewee           :         parseCurrentReviewee,
        populateEmployeeInfo           :         populateEmployeeInfo,
        saveEmployeeNarrative          :         saveEmployeeNarrative,
        getTablerecords                :         getTablerecords,
        getEventsCamlQ                 :         getEventsCamlQ,
        getEventsObjMap                :         getEventsObjMap,
        getSPSListItems                :         getSPSListItems,
        getSingleEventQConfigObject    :         getSingleEventQConfigObject,
        getSingleEventUpdateQObj       :         getSingleEventUpdateQObj,
        getUpdateListFieldValsArr      :         getUpdateListFieldValsArr,
        updateSPSRecord                :         updateSPSRecord,
        makeCAMLString                 :         makeCAMLString
        // debugQueryResults              :         debugQueryResults

      }
    );
})(  APP, this  );
