/**
*Main application module for PMAP (Performance Management Appraisal Process)
*automation/modernization application.
*@module APP
*@main APP
*/

/**
*@class APP
*
*/
var APP = APP || {};

APP = (  function(){

  //Define variables

	/**
	*Array of JSON-formatted objects representing output of query results for all records
	*in SharePoint list of employees
	*@property res
	*@type Array
	*@private
	*/
	/**
	*Reference to HTML DOM element `<tr>` representing row in employee results table
	*@property tablerow
	*@type Object
	*@private
	*/
	/**
	*Reference to HTML DOM element `<td>` representing cell in employee results table
	*@property tabledef
	*@type Object
	*@private
	*/
	/**
	*Reference to HTML DOM element `<table>` for table containing results of SP query for all
	*employees
	*@property table
	*@type Object
	*@private
	*/
	/**
	*Reference to HTML DOM element `<tablebody>`
	*@property tablebody
	*@type Object
	*@private
	*/
	/**
	*Object map of input field names for employee update form to SharePoint
	*list's static column names
	*@property inputFieldnames
	*@type Object
	*@private
	*/
	/**
	*URL of SharePoint list to query for all employees list
	*@property webURL
	*@type String
	*@private
	*/
	/**
	*Array to hold edit button objects ( html `<button>` objects for editing
	*employee list item)
	*@property editButtonsArr
	*@type Array
	*@private
	*/
	/**
	*Cache to hold results of call to SharePoint list for all employee records
	*@property resCache
	*@type Array
	*@private
	*/
		var res,
				tablerow,
				tabledef,
				table,
				tablebody,
				mainContent,
				edit,
				editDiv,
				editForm,
				input,
				label,
        labelCache,
				$tableHeaders,
				$headerText,
				inputFieldnames = {
					'Employee Name'	:	'employee_name',
					'Employee ID'		:	'employee_ID',
					'Admin ID'			:	'admin_ID',
					'Director ID'		:	'director_ID',
					'Manager ID'		:	'manager_ID',
					'Team Lead ID'	:	'teamlead_ID'
				},
        webURL = "https://teams.deloitte.com/sites/FDAJDD/Sandbox/",
        editButtonsArr = [],
				idArr,
        resCache;


        /*****************BEGIN FUNCTION GET FIELDNAMES*************************/
        /*
        *Purpose        :
        Action          :
        Arguments       :
        Returns         :       fieldnames; String. XML-formatted string of field names
                                pulled from SP list Employee_List01
        Throws          :
        */

				/**
				*@method getFieldnames
				*@return {String} `fieldnames` String formatted as an XML ViewFields element.
				*`fieldnames` string will be 
				*Specifies to SPServices which fields to return from query.
				*Format:`</ViewFields><FieldRef Name="FieldName"/><FieldRef Name="FieldName2"/><ViewFields>`
				*@inner
				*/
        function getFieldnames(){
          var fieldnames = '<ViewFields>';
      					for(  var fieldname in inputFieldnames  ){
      						fieldnames +='<FieldRef Name="' + inputFieldnames[  fieldname  ];
      						fieldnames += '"/>';
      					}
      				fieldnames += '</ViewFields>';
      				return fieldnames;
        }
        /*****************END FUNCTION EDIT FIELDNAMES**************************/

        /*****************BEGIN FUNCTION EDIT BUTTONS****************************/
				/**
				*Creates button elements to edit List Items returned from SPServices `GetListItems`
				*call.
				*@method buildEditButons
				*@return {Object} `edit`: HTML `button` element
				*@inner
				*/
				function buildEditButtons(  responseArr  ){
          for(  var i = 0; i < responseArr.length; i+= 1  ){
            edit = document.createElement(  'button'  );

            //Set edit button style and attributes
						//$(  '.tooltipped'  ).tooltip(    {delay: 50  }  );

            edit.innerHTML = '<i class="material-icons">edit</i>';
            edit.className = 'btn-floating tooltipped blue darken-4  modal-trigger';
            edit.style.marginRight = '.5px';
            edit.style.marginTop = '5px';
            edit.style.float = "right";
            edit.setAttribute(  'data-position', 'right');
            edit.setAttribute(  'data-delay', '50'  );
            edit.setAttribute(  'data-tooltip', 'Edit'  );
            edit.setAttribute(  'data-index', i  );
						edit.setAttribute(  'data-record-id', idArr[  i  ]  );
						//edit.setAttribute(  'data-record-id',  tableRows[  i  ].getAttribute(  'data-record-id'  )  );
						$(  edit  ).tooltip(  {  delay: 50  }  );
            edit.addEventListener(  'click', buildModal, false  );
            editButtonsArr.push(  edit  );
          }

          return edit;
        }
        /*****************END FUNCTION EDIT BUTTONS****************************/


        /***************BEGIN FUNCTION BUILD MODAL****************************/
        /*
        *Purpose:
        Action:
        Arguments:   eventTarget; String. Reference to 'edit' button that is the
                    target of the 'click' event triggering display of modal (i.e.
                    record update form)
        Returns:
        Throws:
        */

				/**
				*Builds semi-opaque modal and appends List Item edit form inside modal
				*on edit button click
				*@method buildModal
				*@inner
				*/
        function buildModal(){
          /*
          *NOTE: Use 'this' to refer to the event target inside of the handler function
          */
          $(  '#modal_01'  ).remove();
          labelCache = [];

          //console.log(  this.dataset.index  ); -->OK
          var modalParent = document.querySelector(  'body'  ),
              modal = document.createElement(  'div'  ),
							modalWidth = 40,
							modalOpacity = 1,
              modalContent = document.createElement(  'div'  ),
              inputWrapper,
              modalFooter = document.createElement(  'div'  ),
              modalEdit = document.createElement(  'button'  ),
              modalClose = document.createElement(  'button'  ),
							overlay = document.createElement(  'div'  ),
              editForm = document.createElement(  'form'  ),
              $tableHeaders = $(  '#employees>thead>tr'  ).children(  'th'  ),
              $headerText =	$tableHeaders.contents(),
              currentIdx = parseInt(  this.dataset.index  ),
							currentRecordId = parseInt(  this.dataset.recordId  );

							//Set position of modalParent for modal and overlay positioning purposes
							modalParent.style.position = 'relative';

              //Set attributes of modal
              modal.setAttribute(  'id', 'modal_01');
              modal.style.display = 'block';
              modal.style.position = 'absolute';
							modal.style.top = '5%';
							modal.style.left =  '30%';
							modal.style.zIndex = '300';
							modal.style.width = modalWidth + '%';
							modal.style.opacity = modalOpacity.toString();
							modal.style.backgroundColor = '#ffffff';
              modalContent.setAttribute(  'id', 'modal-content' ) ;

              /***********************************************/


              //Set attributes of edit form
              editForm.setAttribute(  'id', 'edit-form'  );
              editForm.setAttribute(  'method', 'POST'  );
							editForm.setAttribute(  'data-record-id', currentRecordId  );

              //Set attributes of edit/cancel buttons
              modalEdit.className ='btn waves-effect waves-light edit';
              modalEdit.setAttribute(  'type', 'button'  );
							modalEdit.innerText = 'SAVE';
              modalClose.className ='btn waves-effect waves-light';
              modalClose.innerText = "CANCEL";

							//Add event listeners to edit/cancel buttons
							modalClose.addEventListener(  'click', function(  e  ){
								modal.parentNode.removeChild(  modal  );
								overlay.parentNode.removeChild(  overlay  );
							}, false  );

							modalEdit.addEventListener(  'click', updateEmployee, false  );

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

              //Create labels
              Object.getOwnPropertyNames(  inputFieldnames  ).forEach(
                function(  val, idx, array  ){
                  label = document.createElement(  'label'  );
                  label.innerText = val;
                  label.setAttribute(  'for', inputFieldnames[  val  ]  );
                  labelCache.push(  label  );
                }
              );

              //Create form inputs
              for(  var prop in inputFieldnames  ){
                if(  inputFieldnames.hasOwnProperty(  prop  )  ){
                  //Create input fields
                  input = document.createElement(  'input'  );
                  input.setAttribute(  'type', 'text'  );
                  input.setAttribute(  'id', inputFieldnames[  prop  ]  );
                  input.setAttribute(  'name', inputFieldnames[  prop  ]  );

                  var drawLabels = function(){
                    try{
                      for(  var j = 0; j < labelCache.length; j+= 1){
                        if(  labelCache[  j  ].getAttribute(  'for'  ) === input.getAttribute(  'id'  )  ){
                          console.log(  labelCache[  j  ]  );
                          console.log(  input  );
                          editForm.appendChild(   labelCache[  j  ]  );
                        }
                      }
                    }catch(  err ){
                      console.log(  err.message  );
                    }
                  };

                  //Create placeholders
                  switch(  input.getAttribute(  'id'  )  ){
                    case 'employee_name':
                    input.setAttribute(  'placeholder', resCache[  currentIdx  ][  'employee_name'  ]  );
                    drawLabels();
                    break;

                    case 'employee_ID':
                    input.setAttribute(  'placeholder', resCache[  currentIdx  ][  'employee_ID'  ]  );
										input.setAttribute(  'readonly', 'readonly'  );
										input.setAttribute(  'disabled', 'disabled'  );
                    drawLabels();
                    break;

                    case 'admin_ID':
                    input.setAttribute(  'placeholder', resCache[  currentIdx  ][  'admin_ID'  ]  );
                    drawLabels();
                    break;

                    case 'director_ID':
                    input.setAttribute(  'placeholder', resCache[  currentIdx  ][  'director_ID'  ]  );
                    drawLabels();
                    break;

                    case 'manager_ID':
                    input.setAttribute(  'placeholder', resCache[  currentIdx  ][  'manager_ID'  ]  );
                    drawLabels();
                    break;

                    case 'teamlead_ID':
                    input.setAttribute(  'placeholder', resCache[  currentIdx  ][  'teamlead_ID'  ]  );
                    drawLabels();
                    break;

                    default:
                    console.log(  'Fell out to default case.'  );
                    break;
                  }

                //Append input field to form
                editForm.appendChild(  input  );
                }
              }


              //Append children to modal elements
              modalFooter.appendChild(  modalEdit  );
              modalFooter.appendChild(  modalClose  );
              modalContent.appendChild(  editForm  );
							modalContent.appendChild(  modalFooter  );
              modal.appendChild(  modalContent  );

              //Append overlay and modal to employees Table
							modalParent.appendChild(  overlay  );
							//centerModal(  modal  );
              overlay.appendChild(  modal  );

        }
//*********************END FUNCTION BUILD MODAL***********************/


  //******************BEGIN MODAL CLOSE FUNCTION*****************************/
	/**
	*Closes modal and removes from DOM
	*@method closeModal
	*@inner
	*/
	function closeModal(){
		window.removeEventListener(  'resize', window, false  );
		window.removeEventListener(  'scroll', window, false  );
		modal.parentNode.removeChild( modal  );
    if(  modal.parentNode.removeChild(  modal )
				&& modal.parentNode.parentNode.removeChild(  modal.parentNode  )  ){
      return true;
    }
  }
  //******************END MODAL CLOSE FUNCTION*****************************/


  /*****************BEGIN FUNCTION GET EMPLOYEE LIST*********************/
  /*
  *Purpose          :
  Action            :
  Arguments         :         String 'fieldnames'; XML-formatted string returned from
                              'getFieldnames' function.
  Returns           :         String 'res'; JSON-formatted string representing Employee_List01
                              records from SP
  Throws            :
  */

	/**
	*
	*@method getEmployeeList
	*@param {String} fieldnames CAML-formatted string of fields to return from `GetlistItems`
	*SPServices query
	*@inner
	*/
  function getEmployeeList(  fieldnames  ){
    var idx,
        max;
        $().SPServices(
          {
              operation: "GetListItems",
              viewName: '',
              webURL: "https://teams.deloitte.com/sites/FDAJDD/Sandbox/",
              listName: "Employee_List01",
              CAMLViewFields: fieldnames,
              CAMLRowLimit: 5,
              CAMLQueryOptions: '<QueryOptions><IncludeMandatoryColumns>TRUE</IncludeMandatoryColumns></QueryOptions>',
              CAMLQuery: '<Query><OrderBy><FieldRef Name="employee_name" Ascending="TRUE"></FieldRef></OrderBy></Query>',
              completefunc: function(  xData, Status  ){
                  console.log( "STATUS: " + Status  );
                  var res = $(  xData.responseXML  ).SPFilterNode( 'z:row'  ).SPXmlToJson(
              								{
              									mapping : {
              										ows_employee_name	:	{  mappedName: 'employee_name', objectType: 'Text'  },
              										ows_employee_ID	:	{  mappedName: 'employee_ID', objectType: 'Text'  },
              										ows_admin_ID	:	{  mappedName: 'admin_ID', objectType: 'Text'  },
              										ows_director_ID	:	{  mappedName: 'director_ID', objectType: 'Text'  },
              										ows_manager_ID	:	{  mappedName: 'manager_ID', objectType: 'Text'  },
              										ows_teamlead_ID	:	{  mappedName: 'teamlead_ID', objectType: 'Text'  }
              									},
              									includeAllAttrs: false,
              									removeOws: true,
              									sparse: false
              								}
							);

              resCache = extendDeep(  res  );
              console.log(  resCache  );

							//BEGIN BUILDING ARRAY OF RECORD IDs HERE
							//THESE WILL POPULATE THE 'data-record-id' attributes
							//of the 'edit' FLYOUT BUTTONS
							idArr = [];
							$(  xData.responseXML  ).SPFilterNode(  'z:row'  ).each(  function(){
										console.log(  $(  this  ).attr(  'ows_ID'  )  );
										idArr.push(  $(  this  ).attr(  'ows_ID'  )  );
							});

              /***********************BEGIN BUILDING DOM LOGIC HERE*****************************/
              max = res.length;
              var edit = buildEditButtons(  res  );

              buildEmployeeTable(  res  );
              buildSearchLogic();

                /***********************END BUILDING DOM LOGIC HERE*****************************/
            } //END COMPLETE FUNC
        });
  }

  /******************END FUNCTION GET EMPLOYEE LIST*********************/

/****************************BEGIN FUNCTION UPDATE EMPLOYEE*********************/
	/**
	*Updates Employee List Item and refreshes page on success
	*@method updateEmployee
	*@inner
	*/
	function updateEmployee(){
		var $formInputs = $(  'form>input'  ).serializeArray(),
				 valuePairs = [],
				 pair,
				 //SET FORM 'data-record-id' ATTRIBUTE TO EQUAL 'data-record-id'
				 //ATTRIBUTE OF CLICKED 'edit' FLYOUT BUTTON
				 id = $(  '#edit-form'  ).data(  'recordId'  );
				for( var x = 0; x < $formInputs.length; x+= 1){
						 pair = [];
						 pair.push(  $formInputs[  x  ][  'name'  ]  );
						 pair.push(  $formInputs[  x  ][  'value']  );
						 valuePairs.push(  pair  );
				}

				$().SPServices(
													{
														webURL			:		webURL,
														operation		:		'UpdateListItems',
														listName		:		'Employee_List01',
														batchCmd		:		'Update',
														valuepairs	:		valuePairs,
														ID					:		id,
														completefunc:		function(  xData, Status  ){
															console.log(  "Update Status: " + Status  );
															if(  Status === 'success'  ){
																document.location.reload();
															}
														}
													}
												);

	}
/****************************END FUNCTION UPDATE EMPLOYEE*********************/

/*******************BEGIN BUILD EMPLOYEE TABLE FUNCTION***************************/
/**
*Builds HTML table from returned results of `GetListItems` call to SP, and
*appends table to DOM.
*@method buildEmployeeTable
*@param {Array} res Array of Employee List Items returned as JSON strings from
*SPServices `GetListItems` call
*@inner
*/
function buildEmployeeTable(  res  ){
  var prop,
      index,
      table = document.getElementById(  'employees' ),
      tablebody = document.querySelector(  '#employees>tbody'  );
      // console.log( '*********************************');
      //console.log(  editButtonsArr  );

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
      lastTdElem.insertAdjacentElement(  'afterend', editButtonsArr[  index  ] );
    }

    /*****END EDIT BUTTON APPENDING LOGIC HERE*****/

  }

  table.className = 'bordered highlight';
}
/*******************END BUILD EMPLOYEE TABLE FUNCTION****************************/

/******************BEGIN FUNCTION MAKE VALUEPAIRS*******************************/
	function makeValuepairs(  formValsArr, listFieldValsArr  ){
		var valuePairs = [],
				i,
				max = listFieldValsArr.length;

		for(  i = 0; i < max; i+= 1  ){
			var valPair = [];
			valPair.push(  listFieldValsArr[  i  ]  );
			valPair.push(  formValsArr[  i  ]  );
			valuePairs.push(  valPair  );
		}
		return valuePairs;
	}
/******************END FUNCTION MAKE VALUEPAIRS*********************************/

/******************BEGIN BUILD SEARCH LOGIC FUNCTION***************************/
/**
*Creates logic to power search function for 'search' input field
*@method buildSearchLogic
*@inner
*/
function buildSearchLogic(){
  var $rows = $('#employees tbody tr');

  	$('#search').keyup(function() {
      var val = '^(?=.*\\b' + $.trim($(this).val()).split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
  		reg = RegExp(val, 'i'),
  		text;

      $rows.show().filter(function() {
  				text = $(this).text().replace(/\s+/g, ' ');
  				return !reg.test(text);
  		 }).hide();
  	});
}


/******************BEGIN FUNCTION EXTEND DEEP***************************/
	/**
	*Creates a deep copy of an object/array
	*@method extendDeep
	*@param {Object|Array} parent Object/array to be copied
	*@param {Object|Array} child Object/array to receive the copied properties
	*@inner
	*/
	function extendDeep(  parent, child  ){
    var i,
    toStr = Object.prototype.toString,
    astr = '[object Array]';

    child = child || {};

    for( i in parent  ){
      if(  parent.hasOwnProperty(  i  )  ){
        if(  typeof parent[  i  ] === 'object'  ){
          child[  i  ] = (  toStr.call(  parent[  i  ]  ) === astr  )  ? [] : {};
          extendDeep(  parent[  i  ], child[  i  ]  );
        }else{
          child[  i  ] = parent[  i  ];
        }
      }
    }
    return child;
  }
/*******************END FUNCTION EXTEND DEEP***************************/

/*******************BEGIN FUNCTION GET WEB URL**********************************/
	function getWebUrl(){
		return webURL;
	}
/******************END FUNCTION GET WEB URL************************************/
/*****************************BEGIN PUBLIC API***********************************/
        return(
          {
            getFieldnames       :       getFieldnames,
            getEmployeeList     :       getEmployeeList,
						getWebUrl						:				getWebUrl,
						makeValuepairs			:				makeValuepairs
          }
        );
/*****************************END PUBLIC API***********************************/
} )();
