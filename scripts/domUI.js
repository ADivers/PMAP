/**
*Filename     :     dom-ui.js
*Created on   :     08/31/2017 20:23 EST
*Author       :     jFarrow02
*
*/

APP.dom.ui = (function(){

/**
*@module APP
*@main APP
@class domUI
*
*/
  /**************BEGIN PRIVATE VARS*************************/
  var modalConfig = {
                      msg     :     '<h5>Success!</h5><p>Your record was created successfully.</p>'
                    };
  /**************BEGIN PRIVATE VARS*************************/

  /**************END FUNCTION createModal*****************/

  function getConfigObj(){
    return modalConfig;
  }


  function redirectTo(  url  ){
    window.location.assign(  url  );
  }

  /**************BEGIN FUNCTION buildEventQuery***************************/

  function buildEventQuery(  data  ){
    //Create vars to hold references to values from form fields, for use
    //as SPS query parameters
    var inputsArray = [],
        $inputs = $(  '#create-reminder-form'  ).serializeArray(),
        recipients = '';
        inputsArray[  0  ] = recipients,
        createDate = new Date(  Date.now()  );
        createDate = $().SPServices.SPConvertDateToISO(
          {
            dateToConvert   :   createDate,
            dateOffset      :   '-05:00'
          }
        ),
        conf = {},
        $setReminder = $(  '#set-reminder'  );

    //Loop thru array of form input values to build query
    //Begin loop at '1', to avoid capturing list name in value pairs array
    for(  var i = 1; i < $inputs.length; i += 1){
      for(  var prop in $inputs[  i  ]  ){

        if(  prop === 'name'  ){
          if(  $inputs[  i  ][  'name'  ] === 'to'  ){
            console.log( 'i: ' + i + 'formInputs[i].value: ' + $inputs[  i  ][  'value'  ]  );

            inputsArray[  0  ] += $inputs[  i  ][  'value'  ] + '\;'
          }
          else{
            inputsArray.push(  $inputs[  i  ][  'value' ]  );
          }
        }
      }
    }

    //PUSH ADDITIONAL 'createDate' PARAM ONTO END OF 'inputs' FORM INPUTS array
    inputsArray.push(  createDate  );

      //Get array of PMAP event list item fields to be updated
      listFieldValsArr = APP.spsQuery.getUpdateListFieldValsArr();

      //Convert form field inputs representing dates from strings to ISO Date obj format
      var dueDate    = APP.dateFormatter.makeDateString(  inputsArray[  1  ]  );
          remindDate = APP.dateFormatter.makeDateString(  inputsArray[  2  ]  );

      inputsArray[  1  ] = APP.dateFormatter.convertToISO(  dueDate  );
      inputsArray[  2  ] = APP.dateFormatter.convertToISO(  remindDate  );

    //Set 'conf' (query configuration) object properties to pass to submitPMAPEvent()
    conf.listName = data.listName;
    conf.createDate = createDate;
    conf.ID = $(  '#current-event-id'  ).data(  'current'  );

    //Set 'batchCmd' prop on SPS query object to make this function
    //usable for NEW (create) or UPDATE operations
    if(  $setReminder.attr(  'data-batchCmd') === 'New'  ){
      conf.batchCmd = $setReminder.attr(  'data-batchCmd'  );
      conf.ID = $setReminder.attr(  'data-batchCmd'  );
    }else{
      conf.batchCmd = 'Update';
    }

    // console.log(  '******************----->New Event config object:');
    // console.log(  conf  );
    APP.dom.submitPMAPEvent(  inputsArray, listFieldValsArr, conf  );
  }
  /**************END FUNCTION buildEventQuery**************************/

  /*******************BEGIN FUNCTION showDeadlinesMeasurements*****************/
  function showDeadlinesMeasurements(){
    $(  '#elem-title'  ).on(  'change', function(  event  ){
      var $options = $(  'option', this  ),
      $currentVal = $(  this  ).val();
      console.log(  '##################------->$options: '  );
      //console.log(  $options  );
      console.log(  $currentVal  );
      if(  $currentVal !== 'Create New'  ){
        hideElemControls();
      }

      for(  var i = 0; i < $options.length; i+= 1  ){
        console.log(  $options[  i  ]  );
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        console.log(  $options[  i  ].getAttribute(  'data-perfElemDesc'  ) );
        if(  $currentVal === $options[  i  ].getAttribute(  'value'  )  ){
          $(  '#elem-desc'  ).text(  $options[  i  ].getAttribute(  'data-perfElemDesc'  )  );
          $(  '#elem-measure01'  ).text(  $options[  i  ].getAttribute(  'data-measurement')  );
        }
      }

      //Display 'New Critical Element' form controls if 'Create New' option selected
      if(  $currentVal === 'Create New'  ){
         showNewElemControls();
      }
    });
    }
  /**********************END FUNCTION showDeadlinesMeasurements*****************/


/*******************BEGIN FUNCTION showNewElemControls*****************/

  function showNewElemControls(){
    $(  '#clear, .input-field:has([id="new-elem-title"])'  ).show( 500, 'easeInQuad'  );

  }

  function hideElemControls(){
    $(  '#clear, .input-field:has([id="new-elem-title"])').hide(  500, 'easeOutQuad'  );
  }
/*********************END FUNCTION showNewElemControls*****************/

  function buildNewCritElemDiv(  configObj  ){
    var $elemDiv = $(  '<div></div>'  ).addClass(  'my-elem, card, col, s12, m8'  ).html(  '<h4>My Saved Element</h4>'  )
      .css(  {  'position' :  'relative', 'padding-left' :  '15px', 'float' : 'left', 'width' : '100%'  }  ),
    $titleP = $(  '<p></p>'  ).text(  'Title: ' + configObj.elemTitle  ),
    $descP = $(  '<p></p>'  ).text(  'Desc: ' + configObj.description  ),
    $measP = $(  '<p></p>'  ).text(  'Measurements: ' + configObj.measurements  ),
    $editButton = $(  '<button></button>'  ).addClass(  'btn-floating btn-large waves-effect waves-light')
      .css(  {  'color'  :  '#002071', 'float' : 'right'  }  ).attr(  'position', 'absolute').append(  '<i class="material-icons">edit</i>'  ),
    arr = [  $titleP, $descP, $measP ];


    for(  var i = 0; i < arr.length; i+= 1  ){
      //if(  i < arr.length - 1  ){
        $(  arr[  i  ]  ).css(  {  'width' : '90%', 'float' : 'left', 'border' : '2px solid blue' }  );
      //}

      $elemDiv.append(  arr[  i  ]  );

    }

    console.log(  '---------->New Crit Elem<---------------'  );
    console.log(  $elemDiv  );
    $(  '#target'  ).append(  $elemDiv  );
    console.log(  '#---------------#' );
    console.log(  $elemDiv.height()  );


    $elemDiv.append(  $editButton  );
    $editButton.css(  {  'top'  :  - (  $elemDiv.height() / 2 )  + ( $editButton.height() / 2   ), 'left' : -(  $editButton.width() / 2  ) }  );
    console.log(  $editButton.height()  );
  }
  /*******************BEGIN PUBLIC API**************************/
  return(
    {
      getConfigObj                  :         getConfigObj,
      redirectTo                    :         redirectTo,
      buildEventQuery               :         buildEventQuery,
      showDeadlinesMeasurements     :         showDeadlinesMeasurements,
      buildNewCritElemDiv           :         buildNewCritElemDiv
    }
  );

  /**********************END PUBLIC API**************************/
}  )();
