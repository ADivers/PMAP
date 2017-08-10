APP.spsQuery = (  function(){

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

  /******************BEGIN FUNCTION BUILDCAMLQUERYOPTIONS********************/
  queryLevel3 = {
    And         :         "And",
    BeginsWith  :         "BeginsWith",
    Contains    :         "Contains",
    Eq          :         "Eq",
    Gt          :         "Gt",
    Geq:        :         "Geq",
    In          :         "In",
    Includes    :         "Includes",
    IsNotNull   :         "IsNotNull",
    IsNull      :         "IsNull",
    Lt          :         "Lt",
    Leq         :         "Leq",
    NotIncludes :         "NotIncludes",
    Or          :         "Or"
  }
  /**CAML Query structure:
    <Query>
      <Where>(<GroupBy>)(<OrderBy>) -->ANY OR ALL
        <Lt>(<And>)(<BeginsWith>)(<Contains>)(<Eq>)(<Gt>)(<Geq>)(<In>)(<Includes>)(<IsNotNull>)(<IsNull>)(<Leq>)(<Neq>)(<NotIncludes>)(<Or>)
          <FieldRef Name="FieldName"/>
          <Value Type="Counter">3</Value>
        </Lt>(</And>)(</BeginsWith>)(</Contains>)(</Eq>)(</Gt>)(</Geq>)(</In>)(</Includes>)(</IsNotNull>)(</IsNull>)(</Leq>)(</Neq>)(</NotIncludes>)(</Or>)
      </Where>(</GroupBy>)(</OrderBy>)
    </Query>
  **/
  var queryObj = {
    "Where"     :     "",
    "Or"        :     "",
    "FieldRef"  :     "<FieldRef Name=\"mgrID\"/><Value Type=\"Text\">" + reviewerID + "</Value>",
    "Eq"        :     "",

  },

  /**
  <Query>
    <OrderBy>
      <FieldRef Name="LastName" Ascending="TRUE"></FieldRef>
    </OrderBy>
    <Where>
      <Or>
        <Eq>
          <FieldRef Name=\"mgrID\"/><Value Type=\"Text\">" + reviewerID + "</Value>
        </Eq>
        <Eq>
          <FieldRef Name=\"directorID\"/><Value Type=\"Text\">" + reviewerID + "</Value>
        </Eq>
      </Or>
    </Where>
  </Query>
  **/

  queryLevel2 = {
    "Where"     :     "Where",
    "GroupBy"   :     "GroupBy",
    "OrderBy"   :     "OrderBy"
  },


  function buildCAMLQueryOptions(  ){
    var CAMLQueryString = '<Query>';

    CAMLQueryString += '</Query>';
    return CAMLQueryString;
  }
  /******************END FUNCTION BUILDCAMLQUERYOPTIONS********************/


  /******************BEGIN FUNCTION BUILDCAMLQUERY********************/
  function buildCAMLQuery(  ){

  }
    /******************END FUNCTION BUILDCAMLQUERY********************/
})();
