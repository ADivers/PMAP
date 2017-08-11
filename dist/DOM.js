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
APP.dom = (  function(  window, app  ){

  /*******************BEGIN BUILD EMPLOYEE TABLE FUNCTION***************************/
  /**
  *Builds HTML table from returned results of `GetListItems` call to SP, and
  *appends table to DOM.
  *@method buildEmployeeTable
  *@param {Array} res Array of Employee List Items returned as JSON strings from
  *SPServices `GetListItems` call
  *@inner
  */
  function buildEmployeeTable(  res, table, tablebody, editButtonsArr  ){
    var prop,
        index;

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
      edit = document.createElement(  'button'  );

      //Set edit button style and attributes
      //$(  '.tooltipped'  ).tooltip(    {delay: 50  }  );

      edit.innerHTML = '<i class="material-icons">add</i>';
      edit.className = 'btn-floating tooltipped blue darken-4  modal-trigger';
      edit.style.marginRight = '.5px';
      edit.style.marginTop = '5px';
      //edit.style.float = "right";
      edit.setAttribute(  'data-position', 'right');
      edit.setAttribute(  'data-delay', '50'  );
      edit.setAttribute(  'data-tooltip', 'Start/Edit a PMAP'  );
      edit.setAttribute(  'data-index', i  );
      edit.setAttribute(  'data-record-id', responseArr[  i  ][  'SP-ID'  ]  );
      //edit.setAttribute(  'data-record-id',  tableRows[  i  ].getAttribute(  'data-record-id'  )  );
      $(  edit  ).tooltip(  {  delay: 50  }  );
      // edit.addEventListener(  'click', app.util.initPMAPReview(  function(){
      //   window.location = './pmapIntroduction.html';
      // }), false  );
      edit.addEventListener(  'click', app.util.initPMAPReview, false  );
      console.log(  edit  );
      editButtonsArr.push(  edit  );
    }

    return edit;
  }
  /*****************END FUNCTION EDIT BUTTONS****************************/

  /****************BEGIN FUNCTION buildOverlay**************************/
  /**
  *@method buildOverlay
  *@param {String} parent Reference to DOM element
  *to which overlay will be appended
  *@param {String} child Reference to DOM element to append
  *to overlay (if any)
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

  //Return public API

  return(
    {
      buildOverlay          :         buildOverlay,
      buildEmployeeTable    :         buildEmployeeTable,
      buildEditButtons       :        buildEditButtons
    }
  )
}  )(  this, APP  );
