

APP.CritElem = (  function(  app, global  ){
  /**
  *@module APP
  *@main APP
  *@class critElem
  */

var webURL = app.getWebUrl(),

/*****************BEGIN GENERIC CRIT ELEMS QUERY VALUES***************************/
genericCritElemsViewFieldsConfigObj = {
                                          'ID'            :     'ID',
                                          Title           :     'Title',
                                          perfElemID      :     'perfElemID',
                                          perfElemType    :     'perfElemType',
                                          perfElemDesc    :     'perfElemDesc',
                                          measurement     :     'measurement'
                                        },

// genericCritElemsQuery = '<Query>\n' +
//                           '<Where>\n' +
//                             '<'
//                           '</Where>\n' +
//                         '</Query>\n',

genericCritElemsQueryConfigObj = {
      operation           :     'GetListItems',
      viewName            :     '',
      webURL              :     webURL,
      listName            :     'CritElemsGeneric',
      CAMLRowLimit        :     1000,
      CAMLViewFields      :     genericCritElemsViewFieldsConfigObj,
      CAMLQueryOptions    :     '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',
                                    //CAMLQuery           :     '',
      mapping             :     {
                                  ows_Title     :     {  mappedName   :   'title', objectType         :  'Text'  },
                                  ows_perfElemID:     {  mappedName   :   'perfElemID', objectType    :  'Text'  },
                                  ows_perfElemType:   {  mappedName   :   'perfElemType', objectType  :  'Text'  },
                                  ows_perfElemDesc:   {  mappedName   :   'perfElemDesc', objectType  :  'Text'  },
                                  ows_measurement:    {  mappedName   :   'measurement', objectType   :  'Text'  },
                                  ows_ID:             {  mappedName  :   'ID', objectType             :  'Text'  }
                                },

    completefunc          :    function(  res  ){
                                                  var index,
                                                      max,
                                                      option,
                                                      createNewOption,
                                                      $titleSelect = $(  '#elem-title'  );

                                                  //Sanity check
                                                  console.log(  '----------------------------------->From completefunc: genericCritElemsQueryConfigObj'  );
                                                  console.log(  res  );
                                                  for(  var i = 0; i < res.length; i+= 1  ){
                                                    option = $(  '<option></option>'  ).text(  res[  i  ][  'title'  ]  ).val(  res[  i  ][  'title'  ]  )
                                                              .attr(  'data-perfElemDesc', res[  i  ][  'perfElemDesc'  ]  ).attr(  'data-measurement', res[  i  ][  'measurement'  ]  )
                                                              .attr(  'data-elemID', res[  i  ][  'ID']  );

                                                  //Append options to '<select>' tag
                                                  $(  '#elem-title'  ).append(  option  );

                                                  //Make 'Create New' option to append to end of dynamically-generated '<option>' tags
                                                  if(  i + 1 === res.length  ){
                                                    createNewOption = $(  '<option>Create New</option>'  ).val(  'Create New'  );
                                                    $(  '#elem-title>option'  ).eq(  res.length - 1  ).after(  createNewOption  );

                                                  }


                                                  //Initialize Material '<select>' tag
                                                  $('select').material_select();

                                                  }
                                                  var firstDesc = $(  '#elem-title>option:first-of-type'  ).attr(  'data-perfElemDesc'  ),
                                                      firstMeasure = $(  '#elem-title>option:first-of-type'  ).attr(  'data-measurement'  );

                                                      console.log(  'First Description: ' + firstDesc  );

                                                  $(  '#elem-desc'  ).text( firstDesc  );
                                                  $(  '#elem-measure01'  ).text(  firstMeasure  );
                                         }
    };

    function getGenericCritElemsQueryConfigObj(){
      return genericCritElemsQueryConfigObj;
    }
/*******************END GENERIC CRIT ELEMS QUERY VALUES***************************/


/******************BEGIN TEMPLATE CRIT ELEMS QUERY VALUES************************/
  var critElemDescTemplateViewFields = {
                                          perfElemDescID      :     'perfElemDescID',
                                          Title               :     'Title',
                                          elemType            :     'elemType',
                                          description         :     'description',
                                          'ID'                :     'ID'
                                        },
      critElemDescTemplateQueryConfObj = {
                                          operation                 :         'GetListItems',
                                          viewName                  :         '',
                                          webURL                    :         webURL,
                                          listName                  :         'PerfElemDescriptions',
                                          CAMLRowLimit              :         1000,
                                          CAMLViewFields            :         critElemDescTemplateViewFields,
                                          CAMLQueryOptions          :         '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',
                                          CAMLQuery                 :         false,
                                          mapping                   :         {
                                                                                ows_perfElemDescID        :     {  mappedName:  'perfElemDescID', objectType:  'Text'  },
                                                                                ows_Title                 :     {  mappedName:  'Title', objectType: 'Text'  },
                                                                                ows_elemType              :     {  mappedName:  'elemType', objectType: 'Text'  },
                                                                                ows_description           :     {  mappedName:  'description', objectType: 'Text'  },
                                                                                ows_ID                    :     {  mappedName:  'ID', objectType: 'Text'  }
                                                                              },
                                          completefunc              :    function(  res  ){
                                                  var index,
                                                      max,
                                                      option,
                                                      createNewOption,
                                                      titleSelect = $(  '#elem-title'  );


                                                  for(  var i = 0; i < res.length; i+= 1  ){
                                                    option = $(  '<option></option>'  ).text(  res[  i  ][  'Title'  ]  ).val(  res[  i  ][  'Title'  ]  )
                                                              .attr(  'data-perfElemDesc', res[  i  ][  'description'  ]  )
                                                              .attr(  'data-elemID', res[  i  ][  'ID']  );

                                                  //Append options to '<select>' tag
                                                  $(  '#elem-title'  ).append(  option  );

                                                  //Initialize Material '<select>' tag
                                                  $('select').material_select();

                                                  }
                                          }
                                        };


      function getTemplatePerfElems(  queryConfigObj  ){
      app.spsQuery.getSPSListItems(  queryConfigObj  );
    }
/********************END TEMPLATE CRIT ELEMS QUERY VALUES***********************/



/**************BEGIN REVIEWEE WITH JOB DETAILS QUERY VALUES*********************/

  /**
  *Configuration object for constructing `CAMLViewFields` property to be passed
  *to sps query for job details of PMAP reviewee. When passed to `spsQuery.buildCAMLViewfields`
  *method, will return a String formatted as:
  *`<ViewFields>
     <FieldRef Name="ID" />
     <FieldRef Name="Title" />
   </ViewFields>`
  *@property revieweeJobDetailsCAMLViewFieldsConfigObj
  *@type Object
  *@private
  */
  var revieweeJobDetailsCAMLViewFieldsConfigObj = {
                                                positionID            :     "positionID",
                                                positionDesc          :     "positionDesc",
                                                occSeries             :     "occSeries",
                                                gsLevel               :     "gsLevel"
                                              },


/**
*Configuration object for constructing `CAMLViewFields` property to be passed
*to sps query for position ID of PMAP reviewee. When passed to `spsQuery.buildCAMLViewfields`
*method, will return a String formatted as:
*`<ViewFields>
   <FieldRef Name="ID" />
   <FieldRef Name="Title" />
 </ViewFields>`
*@property revieweePositionIDViewFieldsObj
*@type Object
*@private
*/
  revieweePositionIDViewFieldsObj = {
                                      positionID  :   "positionID"
                                    },

/**
*Configuration object for constructing sps query to `Employees` table for the
*current reviewee's position ID
*@property revieweePositionQueryConfigObj
*@type Object
*@private
*/
  revieweePositionQueryConfigObj = {
                                    operation                 :         'GetListItems',
                                    viewName                  :         '',
                                    webURL                    :         webURL,
                                    listName                  :         'Employees',
                                    CAMLRowLimit              :         1,
                                    CAMLViewFields            :         revieweePositionIDViewFieldsObj,
                                    CAMLQueryOptions          :         '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',
                                    CAMLQuery                 :         false,
                                    mapping                   :         {
                                                                          ows_positionID        :     {  mappedName:  'positionID', objectType:  'Text'  }
                                                                        },
                                    completefunc              :         function(  res  ){
                                                                        console.log(  'BEGINNING COMPLETE FUNCTION FROM REVIEWEE JOB POSITION---->res:' );
                                                                        console.log(  res  ); //{positionID: 'x'} OK

                                                                          $(  '#reviewee-name'  ).attr(  'data-position-id', res[  0  ][  'positionID'  ]  ); //OK
                                                                          var positionIDObj = { employeePositionID  : res[  0  ][  'positionID'  ]  },

                                                                              genericQueryObj = getGenericCritElemsQueryConfigObj(),
                                                                      		//Obtain employee position ID and add to query object

                                                                      		  positionID = positionIDObj.employeePositionID;


                                                                            getRevieweeJobDetails(  positionIDObj  );

                                                                      		/************Query for mapped elements (positionID ---> elementID)**********/

                                                                          //If position === one of the 'templates'
                                                                      		if(  positionID === '1'  || positionID === '2' || positionID === '3' || positionID === '4'  ){


                                                                          //Construct query for performance elements mapped to 'template' position ID
                                                                      			var critElemsPerfCAMLQuery = '<Query>\n'  +
                                                                      		                                '<Where>\n' +
                                                                      		                                  '<Eq>\n'  +
                                                                      		                                    '<FieldRef Name="positionID"/>\n'	+
                                                                      		                                    //'<Value Type="Text">' + positionID + '</Value>\n' +
                                                                                                              '<Value Type="Text">' + positionID + '</Value>\n' +
                                                                      		                                  '</Eq>\n' +
                                                                      		                                '</Where>\n' +
                                                                      		                              '</Query>',
                                                                                //Get SPS query object defined in module for performance elements
                                                                      					critElemsPerfQueryObj = APP.CritElem.getCritElemsPerfQueryConfigObj();

                                                                            //Attach CAML query string created above as property of SPS query object
                                                                      			critElemsPerfQueryObj.CAMLQuery = critElemsPerfCAMLQuery;
                                                                      			// console.log(  '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$----->critElemsPerfQueryObj:'  );
                                                                      			// console.log(  critElemsPerfQueryObj  );  //-->OK


                                                                            APP.spsQuery.getSPSListItems(  critElemsPerfQueryObj  );  //--OK
                                                                    /************END Query for mapped elements (positionID ---> elementID)**********/


                                                                            //Set 'data-position-id' attr of #reviewee-name element to set up query for perf elem details
                                                                            $(  '#reviewee-name'  ).attr(  'data-position-id', positionID  );

                                                                      		} //end 'if'
                                                                      		else{ //Position !== to one of 'templates'
                                                                      			APP.spsQuery.getSPSListItems(  genericQueryObj  );
                                                                      		}
                                                                        }

                                   },

  revieweeJobDetailsQueryOptions = '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',

  // revieweeJobDetailsCAMLQuery = '<Query>\n' +
  //                                 '<Where>\n' +
  //                                   '<Eq>\n' +
  //                                     '<FieldRef Name="positionID"/>\n' +
  //                                     '<Value Type="Text">' +
  //                                   '</Eq>\n' +
  //                                 '</Where>\n' +
  //                               '</Query>\n';

  /**
  *Configuration object for constructing sps query to `Employees` table for the
  *job details of the current reviewee's position
  *@property revieweeJobDetailsQueryConfigObj
  *@type Object
  *@private
  */
  revieweeJobDetailsQueryConfigObj = {
                              //employeePositionID        :         false,
                              operation                 :         'GetListItems',
                              viewName                  :         '',
                              webURL                    :         webURL,
                              listName                  :         'CritElemUniquePositions02',
                              CAMLRowLimit              :         1000,
                              CAMLViewFields            :         revieweeJobDetailsCAMLViewFieldsConfigObj,
                              CAMLQueryOptions          :         revieweeJobDetailsQueryOptions,
                              CAMLQuery                 :         false,
                              mapping                   :         {
                                                                    ows_positionID        :     {  mappedName:  'positionID', objectType:  'Text'  },
                                                                    ows_positionDesc      :     {  mappedName:  'positionDesc', objectType:  'Text'  },
                                                                    ows_occSeries         :     {  mappedName:  'occSeries', objectType:  'Text'  },
                                                                    ows_gsLevel           :     {  mappedName:  'gsLevel', objectType:  'Text'  }
                                                                  },
                              completefunc      :         function( res  ){
                                                          //function body here

                                                          $(  '[name="pos-desc"]'  ).attr(  'value', res[  0  ][  'positionDesc'  ]  );
                                                          $(  '[name="occ-series"]').attr(  'value', res[  0  ][  'occSeries'  ]  );
                                                          $(  '[name="gs-level"]'  ).attr(  'value', res[  0  ][  'gsLevel'  ]  );
                                                          }

                                                          //Query for element details here
                            };

/**************END REVIEWEE WITH JOB DETAILS QUERY VALUES*********************/

/**
*Returns revieweePositionQueryConfigObj for query construction outside of closure created
*by `CritElem` module
*@method getRevieweePositionQueryConfigObj
*@return {Object} revieweePositionQueryConfigObj
*/
  function getRevieweePositionQueryConfigObj(){
    return revieweePositionQueryConfigObj;
    /*
    *
    {
      operation                 :         'GetListItems',
      viewName                  :         '',
      webURL                    :         webURL,
      listName                  :         'Employees',
      CAMLRowLimit              :         1,
      CAMLViewFields            :         revieweePositionIDViewFieldsObj,
      CAMLQueryOptions          :         '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',
      CAMLQuery                 :         false,
      mapping                   :         {
                                            ows_positionID        :     {  mappedName:  'positionID', objectType:  'Text'  }
                                          },
      completefunc      :         function( ){
                                  //function body here

      }
    */
  }

  /**
  *Constructs and sends sps query to `Employees` table for `positionID` attribute
  *of current reviewee
  *@method getRevieweePosition
  *@return {none}
  *@param {Object} queryConfigObj Configuration object defining parameters of query for
  *position ID to `Employees` table. Object has the following structure:
  *  {
      operation : {String} Defines SPS operation to perform (e.g. 'GetListItems')
      viewName  : {String}
      webURL    : {String} URL of SP site containing target list to query
      listName  : {String} List to query
      CAMLRowLimit: {Number} Maximum number of rows to return in query
      CAMLViewFields: {Object} Key-value pairs of fields to be returned in query.
                      NOTE: This object will be converted to a CAML-formatted string in
                      the spsQuery.GetListItems/spsQuery.UpdateListItems methods.
      CAMLQueryOptions: {String}
      mapping: {Object} Maps `ows` fields returned in
  }
  */
  function getRevieweePosition(  queryConfigObj  ){
    app.spsQuery.getSPSListItems(  queryConfigObj  );
  }


  /**
  *Returns revieweePositionQueryConfigObj for query construction outside of closure created
  *by `CritElem` module
  *@method getRevieweeJobDetailsConfigObj
  *@return {Object} revieweeJobDetailsQueryConfigObj
  */
  function getRevieweeJobDetailsConfObj(){
    return revieweeJobDetailsQueryConfigObj;
  }


  /**
  *Constructs and sends sps query to `CritElemUniquePositions` table for job details attributes
  *of current reviewee
  *@method getRevieweePosition
  *@return {none}
  *@param {Object} queryConfigObj Configuration object defining parameters of query for
  *job details to `CritElemUniquePositions` table. Object has the following structure:
  *  {
      operation : {String} Defines SPS operation to perform (e.g. 'GetListItems')
      viewName  : {String}
      webURL    : {String} URL of SP site containing target list to query
      listName  : {String} List to query
      CAMLRowLimit: {Number} Maximum number of rows to return in query
      CAMLViewFields: {Object} Key-value pairs of fields to be returned in query.
                      NOTE: This object will be converted to a CAML-formatted string in
                      the spsQuery.GetListItems/spsQuery.UpdateListItems methods.
      CAMLQueryOptions: {String}
      mapping: {Object} Maps `ows` fields returned in
  }
  */
  function getRevieweeJobDetails(  queryConfigObj  ){
    revieweeJobDetailsQueryConfigObj.employeePositionID = queryConfigObj.employeePositionID;
    revieweeJobDetailsQueryConfigObj.CAMLQuery = '<Query>\n' +
                                                  '<Where>\n' +
                                                    '<Eq>\n' +
                                                      '<FieldRef Name="positionID"/>\n' +
                                                      '<Value Type="Text">' + revieweeJobDetailsQueryConfigObj.employeePositionID + '</Value>\n' +
                                                    '</Eq>\n' +
                                                  '</Where>\n' +
                                                '</Query>\n';
    console.log(  "----------------------------------->From getRevieweeJobDetails: "  );
    console.log(  revieweeJobDetailsQueryConfigObj  );
    //Query list 'CritElemUniquePositions02' if position ID === 1 or 2 or 3 or 4,
    //list 'CritElemUniquePositions' otherwise

    if(  revieweeJobDetailsQueryConfigObj.employeePositionID  === '1' || revieweeJobDetailsQueryConfigObj.employeePositionID === '2'  ||
    revieweeJobDetailsQueryConfigObj.employeePositionID === '3'  || revieweeJobDetailsQueryConfigObj.employeePositionID === '4'  ){
      app.spsQuery.getSPSListItems(  revieweeJobDetailsQueryConfigObj  );
    }
    else{
      revieweeJobDetailsQueryConfigObj.listName = 'CritElemUniquePositions';
      app.spsQuery.getSPSListItems(  revieweeJobDetailsQueryConfigObj  );
    }
  }

/**************BEGIN ADMIN CRITICAL ELEMENTS QUERY VALUES**********************/
  var critElemsCAMLViewFieldsConfigObj = {
                                adminElemID     :   'adminElemID',
                                mgrSuprFlag     :   'mgrSuprFlag',
                                reqs            :   'reqs'
                              },

    critElemsQueryOptions = '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',
    critElemQueryConfigObj =  {
                                operation         :         'GetListItems',
                                viewName          :         '',
                                webURL            :         webURL,
                                listName          :         'CritElemsAdmin',
                                CAMLRowLimit      :         1000,
                                CAMLViewFields    :         critElemsCAMLViewFieldsConfigObj,
                                CAMLQueryOptions  :         critElemsQueryOptions,
                                CAMLQuery         :         false,
                                mapping           :         {
                                                              ows_adminElemID     :     {  mappedName:  'adminElemID', objectType:  'Text'  },
                                                              ows_mgrSuprFlag     :     {  mappedName:  'mgrSuprFlag', objectType:  'Text'  },
                                                              ows_reqs            :     {  mappedName:  'reqs', objectType:  'Text'  }
                                                            },
                                completefunc      :         function( ){
                                                            //function body here
                                                            }
                              };


/**************END ADMIN CRITICAL ELEMENTS QUERY VALUES**********************/
  /**
  *Creates and sends sps query for all Administrative Critical Elements for Managers/Supervisors
  *or employees based on managerial status of current reviewee.
  *@method getCritElemsAdmin
  *@return {none}
  *@inner
  *@param {Object} currentReviewee Object representing employee under current PMAP
  *review. `mgrSuprFlag` property of current reviewee object will be used to build
  *CAML query string for sps query.
  */
  function getCritElemsAdmin(  currentReviewee  ){

  var critElemsCAMLQuery = '<Query>\n' +
                              '<Where>\n' +
                                  '<Eq>\n'  +
                                    '<FieldRef Name="mgrSuprFlag"/>\n' +
                                    '<Value Type="Text">' + currentReviewee.mgrSuprFlag + '</Value>\n' +
                                  '</Eq>\n' +
                              '</Where>\n' +
                            '</Query>';

    critElemQueryConfigObj.CAMLQuery = critElemsCAMLQuery;

    app.spsQuery.getSPSListItems(  critElemQueryConfigObj );
  }


/**************BEGIN PERFORMANCE CRITICAL ELEMENTS QUERY VALUES**********************/
var critElemsPerfCAMLViewFieldsObj = {
                                      positionID        :   'positionID',
                                      perfElemDescID    :   'perfElemDescID'
                                   },

    critElemsPerfQueryConfigObj = {
                                    operation         :         'GetListItems',
                                    viewName          :         '',
                                    webURL            :         webURL,
                                    listName          :         'PositionToElems',
                                    CAMLRowLimit      :         1000,
                                    CAMLViewFields    :         false,
                                    CAMLQueryOptions  :         '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',
                                    CAMLQuery         :         false,
                                    mapping           :         {
                                                                  ows_positionID          :     {  mappedName:  'positionID', objectType:  'Text'  },
                                                                  ows_perfElemDescID      :     {  mappedName:  'positionDescID', objectType:  'Text'  }
                                                                },
                                    completefunc      :         function( res  ){
                                                                // console.log(  '******************>From critElemsPerfQueryConfigObj:'  );
                                                                // console.log(  res  );
                                                                //function body here
                                                                var elemDescIDCache = [],
                                                                    elemID;
                                                                for(  var i = 0; i < res.length; i++  ){
                                                                  elemID = res[  i  ][  'positionDescID'  ];
                                                                  //console.log(  elemID  );  -->OK
                                                                  elemDescIDCache.push(  elemID  );
                                                                }
                                                                //console.log(  '$$$$$$$$$$$$$$$$$$$$$$$$--->elemDescIDCache:');
                                                                elemDescIDCache.push(  'Create New'  );
                                                                //console.log(  elemDescIDCache  );

                                                                for(  var j = 0; j < elemDescIDCache.length; j+= 1  ){

                                                                  if(  elemDescIDCache[  j  ] !== 'Create New' ){
                                                                    var queryObj = APP.util.extendDeep(  critElemDescTemplateQueryConfObj  );
                                                                    queryObj.CAMLQuery = '<Query>\n'  +
                                                                                          '<Where>\n' +
                                                                                            '<Eq>\n'  +
                                                                                              '<FieldRef Name="perfElemDescID"/>\n' +
                                                                                              '<Value Type="Text">' + elemDescIDCache[  j  ] + '</Value>\n' +
                                                                                            '</Eq>\n' +
                                                                                          '</Where>\n' +
                                                                                          '</Query>\n';

                                                                    //console.log(  queryObj  );  //-->0K

                                                                    getTemplatePerfElems(  queryObj  );
                                                                  }

                                                                  else{
                                                                    var opt = $(  '<option></option>').val(  elemDescIDCache[  j  ]  ).text(  elemDescIDCache[  j  ]  );
                                                                    $(  '#elem-title'  ).append(  opt  );
                                                                  }
                                                                }
                                                              }
    };


    function getCritElemsPerfQueryConfigObj(){
      return critElemsPerfQueryConfigObj;
    }

/****************END PERFORMANCE CRITICAL ELEMENTS QUERY VALUES**********************/
  function getCritElemsPerformance(  queryConfigObj  ){

  }


  /***************BEGIN PERFORMANCE CRIT ELEMS DETAILS QUERY VALUES*****************/
  var perfElemCritDetailsViewFieldsObj ={
                                          perfElemDescID      :     'perfElemDescID',
                                          Title               :     'Title',
                                          elemType            :     'elemType'
  }

  /***************BEGIN PERFORMANCE CRIT ELEMS DETAILS QUERY VALUES*****************/

  /***************BEGIN UNIQUE POSITIONS QUERY CONFIG VALUES*******************/
  var uniquePosCAMLViewFieldsObj =  {
                                      positionID          :     'positionID',
                                      positionDesc        :     'positionDesc',
                                      occupationSeries    :     'occupationSeries',
                                      gsLevel             :     'gsLevel'
                                    },
      uniquePosQueryOptions = critElemsQueryOptions,

      /*
        {
          operation : {String} Defines SPS operation to perform (e.g. 'GetListItems')
          viewName  : {String}
          webURL    : {String} URL of SP site containing target list to query
          listName  : {String} List to query
          CAMLRowLimit: {Number} Maximum number of rows to return in query
          CAMLViewFields: {Object} Key-value pairs of fields to be returned in query.
                          NOTE: This object will be converted to a CAML-formatted string in
                          the spsQuery.GetListItems/spsQuery.UpdateListItems methods.
          CAMLQueryOptions: {String}
          mapping: {Object} Maps `ows` fields returned in
      }
      */
      uniquePosQueryConfigObj =  {
                                  operation         :         'GetListItems',
                                  viewName          :         '',
                                  webURL            :         webURL,
                                  listName          :         'CritElemUniquePositions',
                                  CAMLRowLimit      :         1000,
                                  CAMLViewFields    :         uniquePosCAMLViewFieldsObj,
                                  CAMLQueryOptions  :         uniquePosQueryOptions,
                                  //CAMLQuery         :         false,  -->Not necessary when returning ALL items in list
                                  mapping           :         {
                                                                ows_positionID        :     {  mappedName:  'positionID', objectType:  'Text'  },
                                                                ows_positionDesc      :     {  mappedName:  'positionDesc', objectType:  'Text'  },
                                                                ows_occupationSeries  :     {  mappedName:  'occupationSeries', objectType:  'Text'  },
                                                                ows_gsLevel           :     {  mappedName:  'gsLevel', objectType:  'Text'  }
                                                              },
                                  completefunc      :         function( ){
                                                              //function body here
                                                              }
                                };



  /*****************END UNIQUE POSITIONS QUERY CONFIG VALUES*******************/
  function getUniquePosQueryConfigObj(){
    return uniquePosQueryConfigObj;
  }

  /**
  *Creates and sends sps query for position descritpion, occupation series, and gs level
  *of current PMAP reviewee by reviewee's position ID.
  *@method getUniquePositions
  *@return {none}
  *@param {Object} queryConfigObj Configuration object defining sps query parameters
  *for unique positions query to sps. Object has the following form:
  {
    operation : {String} Defines SPS operation to perform (e.g. 'GetListItems')
    viewName  : {String}
    webURL    : {String} URL of SP site containing target list to query
    listName  : {String} List to query
    CAMLRowLimit: {Number} Maximum number of rows to return in query
    CAMLViewFields: {Object} Key-value pairs of fields to be returned in query.
                    NOTE: This object will be converted to a CAML-formatted string in
                    the spsQuery.GetListItems/spsQuery.UpdateListItems methods.
    CAMLQueryOptions: {String}
    mapping: {Object} Maps `ows` fields returned in
}
  */
  function getUniquePositions(  queryConfigObj  ){
    app.spsQuery.getSPSListItems(  queryConfigObj  );
  }

  /***************BEGIN SAVE CUSTOM ELEMENT VALUES**********************/
      // {
      //   operation     :         obj.operation,
      //   webURL        :         obj.webURL,
      //   listName      :         obj.listName,
      //   batchCmd      :         obj.batchCmd,
      //   //Refactored to use 'updates' CAML-formatted update query string
      //   //valuepairs    :         obj.valuePairs,
      //   updates       :         obj.updates,
      //   ID            :         obj[  'ID'  ],
      //   completefunc  :         function(  xData, Status  ){}
      // }
    var max = 1000000,
        min = 100000,
        id = Math.floor(  Math.random() * (max - min)) + min;


    var saveCustomElemsQueryObj = { //Begin saveCustomElemsQueryObj definition

                                    /**************BEGIN CREATE NEW CUSTOM CRITICAL ELEMENT**********/
                                    operation     :     'UpdateListItems',
                                    webURL        :     webURL,
                                    listName      :     'CustomElemsBank',
                                    batchCmd      :     'New',
                                    //async         :     false,
                                    updates       :     '<Batch OnError="Continue">\n' +
                                                        '<Method ID="' + id + '" Cmd="New">\n',

                                    completefunc  :     function( ){  //Begin saveCustomElemsQueryObj completefunc  //Executes on SAVE click in pmapCritElems.html
                                      console.log(  'From saveCustomElemsQueryObj: Record created successfully.'  );

                                        /****************BEGIN QUERY NEW ELEMENT ID (SAVE TO PMAP DOC)**************/
                                        //Parse pmapDocID from URL of current page
                                        var currentURL = window.location,
                                        search = currentURL.search,
                                        params = search.split(  '&'  ),
                                        docParam = params[  4  ].split(  '=' ),
                                        docID = docParam[  1  ],
                                        customElemID,
                                        customElemViewFields,
                                        customElemQueryObj;
                                        console.log(  docID  );

                                        if(  this.vals  ){  //Begin 'if' statement checking for this.vals
                                          console.log(  "Vals: " );
                                          console.log(  this.vals  ); //-->OK

                                          //Create customElemQueryObj values TO GET NEWLY CREATED CRIT ELEM ID
                                          customElemViewFields = {  'ID' : 'ID'  };
                                          customElemQueryObj = {  //Begin customElemQueryObj definition
                                          operation         :         'GetListItems',
                                          viewName          :         '',
                                          webURL            :         webURL,
                                          listName          :         'CustomElemsBank',
                                          CAMLRowLimit      :         1000,
                                          CAMLViewFields    :         customElemViewFields,
                                          CAMLQueryOptions  :         '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',
                                          CAMLQuery         :         '<Query>\n' +
                                                                          '<Where>\n' +
                                                                              '<And>\n' +
                                                                                '<Eq>\n' +
                                                                                  '<FieldRef Name="elemCreatorID"/>\n' +
                                                                                  '<Value Type="Text">' + 'MGR-12345' + '</Value>\n' +
                                                                                '</Eq>\n' +
                                                                                '<Eq>\n' +
                                                                                  '<FieldRef Name="elemTitle"/>\n' +
                                                                                  '<Value Type="Text">' + this.vals[  1  ][  'value'  ] + '</Value>\n' +
                                                                                '</Eq>\n' +
                                                                              '</And>\n' +
                                                                          '</Where>\n' +
                                                                        '</Query>',  //-->Not necessary when returning ALL items in list
                                            mapping           :         { ows_ID        :     {  mappedName:  'ID', objectType:  'Text'  }  },
                                            completefunc      :         function(  res  ){  //Begin customElemQueryObj completefunc

                                                                          //Get the newly created Critical Element's ID, and save to PMAP doc
                                                                          customElemCopy = app.util.extendDeep(  res  );
                                                                          console.log(  "#########----->From customElemQueryObj complete function: "  );
                                                                          console.log(  customElemQueryObj.CAMLQuery  );
                                                                          console.log(  res  ); //Queries newly created Critical Element's ID --->OK
                                                                          console.log(  '###################-------------->customElemCopy:'  );
                                                                          console.log(  customElemCopy  );



                                                                          /**********BEGIN GET PMAP DOCUMENT*******/
                                                                          var pmapDocQueryObj = {  //Begin pmapDocQueryObj definition
                                                                            operation         :         'GetListItems',
                                                                            viewName          :         '',
                                                                            webURL            :         webURL,
                                                                            listName          :         'PMAPDocs',
                                                                            CAMLRowLimit      :         1,
                                                                            CAMLViewFields    :         {  'ID'  :  'ID', perfCritElemsList  :  'perfCritElemsList'  },
                                                                            CAMLQueryOptions  :         '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',
                                                                            CAMLQuery         :         '<Query>\n' +
                                                                                                          '<Where>\n' +
                                                                                                                '<Eq>\n' +
                                                                                                                  '<FieldRef Name="pmapDocID"/>\n' +
                                                                                                                  '<Value Type="Text">' + docID + '</Value>\n' +
                                                                                                                '</Eq>\n' +
                                                                                                          '</Where>\n' +
                                                                                                        '</Query>',  //-->Not necessary when returning ALL items in list
                                                                            mapping           :         { ows_ID        :     {  mappedName:  'ID', objectType:  'Text'  },
                                                                                                          ows_perfCritElemsList   :   {  mappedName:  'perfCritElemsList', objectType: 'Text' }
                                                                                                        },
                                                                            completefunc      :         function(  res  ){  //Begin pmapDocQueryObj completefunc
                                                                                                          /***SAVE CRIT ELEM ID TO PMAP DOC UNDER REVIEW***/
                                                                                                          console.log(  "#########----->From pmapDocQueryObj complete function: "  );
                                                                                                          console.log(  res  );

                                                                                                          var id_02 = Math.floor(  Math.random() * (max - min)) + min,
                                                                                                              thisDocID = res[  0  ][  'ID'  ];
                                                                                                              //thisCritElemsList,
                                                                                                              resCopy = app.util.extendDeep(  res[  0  ]  );
                                                                                                              console.log(  '------------------------------>***resCopy');
                                                                                                              console.log(  resCopy  );
                                                                                                              //Get Critical Elements id list from custom element, and TRANSFORM TO ARRAY.
                                                                                                              //Append new element ID to end of list
                                                                                                              //Transform back into string and save to list
                                                                                                            if(  resCopy[   'perfCritElemsList'  ] !== ''  ){
                                                                                                              console.log(  '---------------------------->resCopy.perfCritElemsList:1'  );
                                                                                                              console.log(  resCopy[   'perfCritElemsList'  ]  );
                                                                                                              resCopy[  'perfCritElemsList'  ] = (resCopy[  'perfCritElemsList'  ]).split(  ','  );
                                                                                                              console.log(  '---------------------------->resCopy.perfCritElemsList:2'  );
                                                                                                              var resLength = resCopy[  'perfCritElemsList'  ].length;
                                                                                                              if(  resCopy[  'perfCritElemsList'  ][  resLength - 1   ] === ''  ){
                                                                                                                resCopy[  'perfCritElemsList'  ].pop();
                                                                                                              }
                                                                                                              console.log(  resCopy[   'perfCritElemsList'  ]  );
                                                                                                              resCopy[  'perfCritElemsList'  ].push(  customElemCopy[  0  ][  'ID'  ]  );
                                                                                                              resCopy[  'perfCritElemsList'  ] = resCopy[  'perfCritElemsList'  ].toString();
                                                                                                              console.log(  '---------------------------->resCopy.perfCritElemsList:3'  );
                                                                                                              console.log(  resCopy[   'perfCritElemsList'  ]  );
                                                                                                              // var thisCritElemsList = resCopy[  'perfCritElemsList  '];
                                                                                                              // console.log(  '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@thisCritElemsList:');
                                                                                                              // console.log(  thisCritElemsList  );
                                                                                                              // thisCritElemsList = thisCritElemsList.split(  ','  );
                                                                                                              // thisCritElemsList.push(  thisDocID  );
                                                                                                              // thisCritElemsList = thisCritElemsList.toString();

                                                                                                            }
                                                                                                            else{
                                                                                                              console.log(  '----------------------------->CUSTOM ELEMENTS EMPTY;')
                                                                                                              resCopy[   'perfCritElemsList'  ] = customElemCopy[  0  ][  'ID'  ] + ',';
                                                                                                            }



                                                                                                          var pmapDocUpdateQueryObj = { //Begin pmapDocUpdateQueryObj definition
                                                                                                                                        operation     :     'UpdateListItems',
                                                                                                                                        webURL        :     webURL,
                                                                                                                                        listName      :     'PMAPDocs',
                                                                                                                                        batchCmd      :     'Update',
                                                                                                                                        updates       :     '<Batch OnError="Continue">\n' +
                                                                                                                                                              '<Method ID="1" Cmd="Update">\n' +
                                                                                                                                                                '<Field Name="ID">' + thisDocID  + '</Field>\n' +
                                                                                                                                                                '<Field Name="perfCritElemsList">' + resCopy[   'perfCritElemsList'  ]  + '</Field>\n' +
                                                                                                                                                              '</Method>\n' +
                                                                                                                                                            '</Batch>',
                                                                                                                                        'ID'          :     id_02,
                                                                                                                                        completefunc  :     function(  xData, Status  ){
                                                                                                                                          console.log(  '#########----->From pmapDocUpdateQueryObj complete function: '  );
                                                                                                                                          // console.log(  Status  );
                                                                                                                                          // console.log(  xData.responseText  );
                                                                                                                                      } //End pmapDocUpdateQueryObj complete function
                                                                                                                                    }; //End pmapDocUpdateQueryObj definition

                                                                                                        console.log(  '########-------------->pmapDocUpdateQueryObj: '  );
                                                                                                        console.log(  pmapDocUpdateQueryObj  );
                                                                                                        app.spsQuery.updateSPSRecord(  pmapDocUpdateQueryObj  );
                                                                                                        resCopy = false;

                                                                                                        }  //End pmapDocQueryObj completefunc


                                                                        }; //End pmapDocQueryObj definition
                                                                        console.log(  pmapDocQueryObj  );
                                                                        app.spsQuery.getSPSListItems(  pmapDocQueryObj  );
                                                                        /*************END GET PMAP DOCUMENT***********/

                                        } //End customElemQueryObj completefunc

                                      }; //End customElemQueryObj definition

                                      this.vals = false;
    } //End 'if' statement checking for this.vals

    console.log(  customElemQueryObj  );
    app.spsQuery.getSPSListItems(  customElemQueryObj  );

  } //End saveCustomElemsQueryObj completefunc  /****************END SAVE NEWLY-CREATED CRIT ELEM ID TO PMAP DOC**************/


  /**************END CREATE NEW CUSTOM CRITICAL ELEMENT**********/
}; //End saveCustomElemsQueryObj definition


    function getSaveCustomElemsQueryObj(){
      return saveCustomElemsQueryObj;
    }

    function saveNewCustomElem(  queryConfigObj  ){
      APP.spsQuery.updateSPSRecord(  queryConfigObj  );
    }
  /*****************END SAVE CUSTOM ELEMENT VALUES**********************/

  /*********************RETURN PUBLIC API*************************/
  return(
    {
      getRevieweePosition                   :     getRevieweePosition,
      getCritElemsAdmin                     :     getCritElemsAdmin,
      getCritElemsPerformance               :     getCritElemsPerformance,
      getUniquePosQueryConfigObj            :     getUniquePosQueryConfigObj,
      getUniquePositions                    :     getUniquePositions,
      getRevieweeJobDetailsConfObj          :     getRevieweeJobDetailsConfObj,
      getRevieweeJobDetails                 :     getRevieweeJobDetails,
      getRevieweePositionQueryConfigObj     :     getRevieweePositionQueryConfigObj,
      getGenericCritElemsQueryConfigObj     :     getGenericCritElemsQueryConfigObj,
      getCritElemsPerfQueryConfigObj        :     getCritElemsPerfQueryConfigObj,
      getSaveCustomElemsQueryObj            :     getSaveCustomElemsQueryObj,
      saveNewCustomElem                     :     saveNewCustomElem


    }
  );
}  )(  APP, this  );
