

APP.PMAPDoc = (  function(  app, global  ){

  /**
  *@module APP
  *@main APP
  *@class PMAPDoc
  */
  var webURL = app.getWebUrl();

  /*******************BEGIN FUNCTION createPMAPDoc*************************/
    function createPMAPDoc(  currentRevieweeObj  ){

      var listName = 'PMAPDocs',
          batchCmd = 'New',
          listFieldValsArr = [  'pmapDocID', 'employeeID', 'status',
                                'appraisalPeriodStartDate', 'appraisalPeriodEndDate', 'submissionYear',
                                'createDate'
                              ],
          formFieldsValsArr = [],
          createDate = Date.now(),
          createDateObj = new Date(  createDate  );
          formValsArr = [];
          currentRevieweeObj.pmapDocID = 'PMAP-DOC-' + currentRevieweeObj.firstName + '-' +
          currentRevieweeObj.lastName + '-' + currentRevieweeObj.id + '-DTS-' + createDate;

          var formInputArr = [  currentRevieweeObj.pmapDocID, currentRevieweeObj.id, 'In Progress' ],
              valuePairs,
              href,
              nextURL;

          $formInputs = $(  '#employee-select-form input'  );
          $pInput = $(  '#projects-collections p:odd' ).not(  function(){

            return this.innerText === 'Appraisal Period End:' ? true : false;
          });

          for(  var j = 0; j < $formInputs.length; j++  ){
            formInputArr.push(  $formInputs[  j  ].value  );
          }

          //Create (String) submissionYear value and push onto end of form inputs array
          formInputArr.push(  createDateObj.getFullYear().toString()  );

          //Create ISO Date from PMAP Doc create date and push onto end of form inputs array
          createDate = $().SPServices.SPConvertDateToISO(
            {
              dateToConvert   :   createDateObj,
              dateOffset      :   '-05:00'
            }
          );

          formInputArr.push(  createDate  );

          valuePairs = app.makeValuepairs(  formInputArr,  listFieldValsArr  );
          console.log(  valuePairs  );

      $().SPServices(
        {
          operation     :         'UpdateListItems',
          webURL        :         webURL,
          listName      :         listName,
          batchCmd      :         batchCmd,
          valuepairs    :         valuePairs,
          ID            :         currentRevieweeObj.pmapDocID,
          completefunc  :         function(  xData, Status  ){
            var output = $().SPServices.SPDebugXMLHttpResult(
              {
                node        :   xData.responseXML
              }
            );

            console.log(  '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'  );
            console.log(  currentRevieweeObj  );
          }
        }
      );
    }

  /*******************END FUNCTION createPMAPDoc*************************/


  /****************************RETURN PUBLIC API*******************************/
  return(
    {
      createPMAPDoc       :       createPMAPDoc
    }
  )
}  )(  APP, this  );
