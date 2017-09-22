function newPMAP(){

  //Get current reviewee object from SP list

  var currentReviewee = getCurrentRevieweeFromSP();
  // currentReviewee = {
  //   fName         : false,
  //   lName         : false,
  //   employeeID    : false,
  //   supervisor?   : null,
  //   positionID    : false
  // };

  //Is current reviewee a Mgr/Supervisor?
  if(  currentReviewee.supervisor? === true  ){
    //Supervisor branch
      //Get Supervisor "Admin" crit elems & display
      var adminCritElems = getSuperCritElems();
      displayAdminCritElemsSelection();

      //Get Supervisor "Performance" crit elems & display

      //Positions 11, 15, 36, 42 have SET Performance
      //Critical elements
      if(  currentReviewee.positionID === "11"  ){
        //get Crit Elems for position 11
      }
      else if(  currentReviewee.positionID === "15"  ){
        //get Crit Elems for position 15
      }
      else if(  currentReviewee.positionID === "36"  ){
        //get crit elems for position 36
      }
      else if(  currentReviewee.positionID === "42" ){
        //get crit elems for position 42
      }
      else{ //Critical elements NOT SET for this position

        /*Reviewer must select Performance crit elems
        **from crit elem bank
        **/

        //Query and return, & then ALL performance elems
        var perfElems = queryAndReturnAllElems();
        displayAllPerfElems();

        /*Selection search logic
          **1. What type of element do you wish to choose:
          **"Technical", "Professional", or "Leadership"?
          **-->FILTER DISPLAYED ELEMENTS VIA CHECKBOX

          **2.What "title" do you want to choose from:
          **"Accounting", "Analysis", "Application Review", etc;
          **-->FILTER DISPLAYED ELEMENTS VIA CHECKBOX
        */
        addElemSearchLogic();
        //Select desired element and attach to PMAP
        attachElemToPMAP();
        //Add another element?
        checkForAddAnotherElement();
        while(  saveAndAddAnother === true  ){
          displayAllPerfElems();
          addElemSearchLogic();
          attachElemToPMAP();
          checkForAddAnotherElement();
        }
      }
  }
  else{ //current reviewee is NOT a Supervisor

    //Non-supervisor Staff branch
    //Get non-supervisor "Admin" elements & display

    var adminCritElems = getNonSuperCritElems();
    displayAdminCritElemsSelection();

    //Positions 11, 15, 36, 42 have SET Performance
    //Critical elements
    if(  currentReviewee.positionID === "11"  ){
      //get Crit Elems for position 11
    }
    else if(  currentReviewee.positionID === "15"  ){
      //get Crit Elems for position 15
    }
    else if(  currentReviewee.positionID === "36"  ){
      //get crit elems for position 36
    }
    else if(  currentReviewee.positionID === "42" ){
      //get crit elems for position 42
    }
    else{ //Critical elements NOT SET for this position

    }
  }

}
