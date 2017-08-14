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
APP.spsQuery = (  function(  app  ){

  /**
  *Object map to build CAMLViewFields for SPS query. Maps object keys to
  *SP `Employees` list item properties to return on reviewee select screen.
  *@property selectRevieweeCAMLViewfields
  *@type Object
  *@private
  */
  var selectRevieweeCAMLViewfields = {
    firstName        :        "firstName",
    LastName         :        "lastName",
    employeeID       :        "employeeID"//,
    // currentReviewee  :        "currentReviewee"
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

        // '<And>' +
        //   '<And>' +
        //     '<Eq>'  +
        //       '<FieldRef Name="firstName"><Value Type="Text">' + 'Maxine' + '</Value>\n' +
        //     '</Eq>' +
        //     '<Eq>'  +
        //       '<FieldRef Name="lastName"><Value Type="Text">' + 'Waters' + '</Value>\n' +
        //     '</Eq>'+
        //   '</And>' +
          // '<Or>' +
          //   '<Eq>' +
          //     '<FieldRef Name="mgrID"/><Value Type="Text">' + 'MGR-12345' + '</Value>' +
          //   '</Eq>' +
          //   '<Eq>' +
          //     '<FieldRef Name="directorID"/><Value Type="Text">' + 'reviewerID' + '</Value>' +
          //   '</Eq>' +
          // '</Or>' +
        // '</And>'  +
      '</Where>' +
    '</Query>',

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
        return fieldnames;
  }

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
                ows_ID        : {  mappedName:  'SP-ID', objectType: 'Text'  }//,
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

  /****************BEGIN FUNCTION getReviewee*********************/
  function getReviewee(  revieweeObj  ){
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

                            console.log(  CAMLQuery);

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
                                        ows_firstName	:	{  mappedName: 'firstName', objectType: 'Text'  },
                                        ows_lastName	:	{  mappedName: 'lastName', objectType: 'Text'  },
                                        ows_ID        : {  mappedName:  'SP-ID', objectType: 'Text'  }//,
                                        // ows_currentReviewee : {  mappedName: 'currentReviewee', objectType: 'Number'  }
                                      },
                                      incluedAllAttrs : true,
                                      removeOws       : true,
                                      sparse          : false
                                    }
                                  );

                                  console.log(  res  );
                                }
                              }
                            );
  }

  // '<And>' +
  //   '<And>' +
  //     '<Eq>'  +
  //       '<FieldRef Name="firstName"><Value Type="Text">' + 'Maxine' + '</Value>\n' +
  //     '</Eq>' +
  //     '<Eq>'  +
  //       '<FieldRef Name="lastName"><Value Type="Text">' + 'Waters' + '</Value>\n' +
  //     '</Eq>'+
  //   '</And>' +

  /*****************END FUNCTION getReviewee*********************/


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

  /***************END FUNCTION spsQuery*************************/

    return(
      {
        buildCAMLViewfields         :         buildCAMLViewfields,
        getReviewees                :         getReviewees,
        getReviewee                :         getReviewee
      }
    )
})(  APP  );
