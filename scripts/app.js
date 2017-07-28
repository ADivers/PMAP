var APP = APP || {};

APP = (  function(){

  //Define variables
		var req,
				res,
				recordID,
				tablerow,
				tabledef,
				table = document.getElementById(  'employees' ),
				tablebody = document.querySelector(  '#employees>tbody'  ),
				mainContent,
				edit,
				editDiv,
				editForm,
				input,
				label,
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
        webURL = "https://teams.deloitte.com/sites/FDAJDD/Sandbox/";

  //BEGIN FUNCTION GET FIELDNAMES
  function getFieldnames(){
    var fieldnames = '<ViewFields>';
					for(  var fieldname in inputFieldnames  ){
						fieldnames +='<FieldRef Name="' + inputFieldnames[  fieldname  ];
						fieldnames += '"/>';
					}
					fieldnames += '</ViewFields>';
					return fieldnames;
				}
  }

  /*****************BEGIN FUNCTION EDIT BUTTONS****************************/
  function buildEditButtons(){
    var edit = document.createElement(  'button'  );
    //Set edit button style and attributes
    edit.innerHTML = '<i class="material-icons">edit</i>';
  	edit.className = 'btn-floating tooltipped blue darken-4  modal-trigger';
  	edit.style.marginRight = '.5px';
  	edit.style.float = "right";
  	edit.setAttribute(  'data-position', 'right');
  	edit.setAttribute(  'data-delay', '50'  );
  	edit.setAttribute(  'data-tooltip', 'Edit'  );
  	edit.setAttribute(  'data-index', i  );

    return edit;
  }
  /*****************END FUNCTION EDIT BUTTONS****************************/


  //*********************BEGIN FUNCTION BUILD MODAL***********************/
  function buildModal(){
    var modal = document.createElement(  'div'  );
        modalContent = document.createElement(  'div'  ),
  			modalFooter = document.createElement(  'div'  ),
  			modalEdit = document.createElement(  'button'  ),
  			modalClose = document.createElement(  'button'  ),
  			editForm = document.createElement(  'form'  ),
  			$tableHeaders = $(  '#employees>thead>tr'  ).children(  'th'  );
  			$headerText =	$tableHeaders.contents();
  			//Set attributes of modal
  			modal.setAttribute(  'id', 'modal_01');
  			modal.style.display = 'block';
  			modal.setAttribute(  'position', 'relative'  );
  			modalContent.setAttribute(  'id', 'modal-content' ) ;
  			//**POSITIONING VARS FOR MODAL NOT YET WORKING**//
  			modal.style.zIndex = 200;
  			modal.style.left = 100 + "px";
  			modal.style.top = 100 + "px";
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
        //Create form inputs
        for(  var indx = 0; indx < $headerText.length; indx++ ){
          var currentIdx = e.target.getAttribute(  'data-index' );

          //Create input fields and labels
          input = document.createElement(  'input'  );
          label = document.createElement(  'label' );

          //Set input field attributes
          input.setAttribute(  'type', 'text'  );
          input.setAttribute(  'id', $headerText[  indx  ][  'data'  ]  );
          for(  var prop in inputFieldnames  ){
            ///input.setAttribute(  prop, inputFieldnames[  prop  ]  );
            if(  input.id === prop  ){
              input.setAttribute(  'name', inputFieldnames[  prop  ]  );
            }
          }
          if(  input.getAttribute(  'id'  ) === "Employee Name"  ){
            input.setAttribute(  'placeholder', res[  currentIdx  ][  'name'  ]  );
          }
          if(  input.getAttribute(  'id') === 'Employee ID'  ){
            input.setAttribute(  'placeholder', res[  currentIdx  ][  'id'  ]  );
          }
          label.setAttribute(  'for', $headerText[  indx  ][  'data'  ]  );
          label.innerText = $headerText[  indx  ][  'data'  ];
          editForm.appendChild(  input  );
          editForm.appendChild(  label  );

        }

        modalContent.appendChild(  editForm  );

        //Append children to modal elements
        modalFooter.appendChild(  modalEdit  );
        modalFooter.appendChild(  modalClose  );
        modal.appendChild(  modalContent  );
        modal.appendChild(  modalFooter  );

        return modal;

  }
  //*********************END FUNCTION BUILD MODAL***********************/

  //********************BEGIN FUNCTION BUILD SEARCH LOGIC***********************/
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
  //********************END FUNCTION BUILD SEARCH LOGIC***********************/

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

  /*****************BEGIN DRAW TOOLTIPS FUNCTION****************************/
  // function drawTooltips(  responseArr  ){
  //   $(  '.tooltipped'  ).tooltip(  {  delay : 50  }  );
  //   for(  var item in responseArr)
  // }
  /*****************END DRAW TOOLTIPS FUNCTION****************************/


  function getEmployeeList(){
    $().SPServices(){
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
            }
      }
    }
  }

  function initModule(){
    getEmployeeList();
  }

/***************************BEGIN PUBLIC API********************************/

return(){
  initModule();
}
/***************************END PUBLIC API********************************/
})();
