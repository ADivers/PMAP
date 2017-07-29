var APP = APP || {};

APP = (  function(){

  //Define variables
		var req,
				res,
				recordID,
				tablerow,
				tabledef,
        tabledefLast,
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
        function buildEditButtons(  responseArr  ){
          for(  var i = 0; i < responseArr.length; i+= 1  ){
            edit = document.createElement(  'button'  );
            //Set edit button style and attributes
            edit.innerHTML = '<i class="material-icons">edit</i>';
            edit.className = 'btn-floating tooltipped blue darken-4  modal-trigger';
            edit.style.marginRight = '.5px';
            edit.style.marginTop = '5px';
            edit.style.float = "right";
            edit.setAttribute(  'data-position', 'right');
            edit.setAttribute(  'data-delay', '50'  );
            edit.setAttribute(  'data-tooltip', 'Edit'  );
            edit.setAttribute(  'data-index', i  );
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
        function buildModal(){
          /*
          *NOTE: Use 'this' to refer to the event target inside of the handler function
          */
          $(  '#modal_01'  ).remove();
          labelCache = [];

          //console.log(  this.dataset.index  ); -->OK
          var modalParent = document.querySelector(  '#main-content'  ),
              modal = document.createElement(  'div'  ),
              modalContent = document.createElement(  'div'  ),
              inputWrapper,
              modalFooter = document.createElement(  'div'  ),
              modalEdit = document.createElement(  'button'  ),
              modalClose = document.createElement(  'button'  ),
              editForm = document.createElement(  'form'  ),
              $tableHeaders = $(  '#employees>thead>tr'  ).children(  'th'  ),
              $headerText =	$tableHeaders.contents(),
              currentIdx = parseInt(  this.dataset.index  );

              //Set attributes of modal
              modal.setAttribute(  'id', 'modal_01');
              modal.style.display = 'block';
              modal.setAttribute(  'position', 'relative'  );
              modalContent.setAttribute(  'id', 'modal-content' ) ;
              //**POSITIONING VARS FOR MODAL NOT YET WORKING**//
              // modal.style.zIndex = 200;
              // modal.style.left = 100 + "px";
              // modal.style.top = 100 + "px";
              /***********************************************/
              modalEdit.innerText = 'SAVE';
              modalClose.innerText = 'CANCEL';

              //Set attributes of edit form
              editForm.setAttribute(  'id', 'edit-form'  );
              editForm.setAttribute(  'method', 'POST'  );

              //Set attributes of edit/cancel buttons
              modalEdit.className ='btn waves-effect waves-light edit';
              modalEdit.setAttribute(  'type', 'submit'  );
              modalEdit.innerText = "EDIT";
              modalClose.className ='btn waves-effect waves-light';
              modalClose.innerText = "CANCEL";

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
              modal.appendChild(  modalContent  );
              modal.appendChild(  modalFooter  );

              //Append modal to employees Table
              modalParent.appendChild(  modal  );

        }
//*********************END FUNCTION BUILD MODAL***********************/


  //******************BEGIN MODAL CLOSE FUNCTION*****************************/
  function modalClose(  modalElem  ){
    if(  modalElem.parentNode.removeChild(  modalElem  )  ){
      return true;
    }
  }
  //******************END MODAL CLOSE FUNCTION*****************************/

  //*****************BEGIN MODAL EDIT FUNCTION****************************/
  function modalEdit(){
    var $formInputs = $(  'form>input'  ).serializeArray(),
        valuePairs = [],
        pair,
        $id = $(  'form>input[  name="employee_ID"  ]'  ).val();
        for(  var x = 0; x < $formInputs.length; x+= 1){
          pair = [];
          pair.push(  $formInputs[  x  ][  'name'  ]  );
          pair.push(  $formInputs  )[  x  ][  'value'  ];
          valuePairs.push(  pair  );
        }
  }
  /******************END MODAL EDIT FUNCTION*****************************/

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
              //if(  res  ){  console.log(  res  );  }
              resCache = extendDeep(  res  );
              console.log(  resCache  );

              /***********************BEGIN BUILDING DOM LOGIC HERE*****************************/
              max = res.length;
              var edit = buildEditButtons(  res  );
              buildEmployeeTable(  res  );
              buildSearchLogic();
              //buildModal();

                /***********************END BUILDING DOM LOGIC HERE*****************************/
            } //END COMPLETE FUNC
        });
  }

  /******************END FUNCTION GET EMPLOYEE LIST*********************/

/*******************BEGIN BUILD EMPLOYEE TABLE FUNCTION***************************/
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

/******************BEGIN BUILD SEARCH LOGIC FUNCTION***************************/
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


        function sayHello(){
          return "hello";
        }

/*****************************BEGIN PUBLIC API***********************************/
        return(
          {
            sayHello            :       sayHello,
            getFieldnames       :       getFieldnames,
            buildSearchLogic    :       buildSearchLogic,
            getEmployeeList     :       getEmployeeList
          }
        );
/*****************************END PUBLIC API***********************************/
} )();
