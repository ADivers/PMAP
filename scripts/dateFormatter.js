
APP.dateFormatter = (  function(  app, global  ){
  /**
  *@module APP
  *@main APP
  *@class dateFormatter
  *
  */
  /**
  *Object map. Maps form input month abbreviations to 2-digit numerical representations
  *of month (as String; e.g. property `Jan` maps to `01`)
  *@property monthMap
  *@type Object
  *@private
  */
  var monthMap = {
    Jan    :     "01",
    Feb    :     "02",
    Mar    :     "03",
    Apr    :     "04",
    May    :     "05",
    Jun    :     "06",
    Jul    :     "07",
    Aug    :     "08",
    Sep    :     "09",
    Oct    :     "10",
    Nov    :     "11",
    Dec    :     "12"

  },

  /**
  *Object map. Maps form input month full names to 2-digit numerical representations
  *of month (as String; e.g. property `January` maps to `01`)
  *@property fullMonthMap
  *@type Object
  *@private
  */
    fullMonthMap = {
      January     :     "01",
      February    :     "02",
      March       :     "03",
      April       :     "04",
      May         :     "05",
      June        :     "06",
      July        :     "07",
      August      :     "08",
      September   :     "09",
      October     :     "10",
      November    :     "11",
      December    :     "12"
    };

    // monthNumMap = {
    //   '01'      :     'January',
    // }


  function makeDateString(  dateString  ){
    /*Accepts string formatted as:
    *DD August, YYYY*
    */
    dateString = dateString.split(  ' '  );
    dateString[  1  ] = dateString[  1  ].slice(  0, dateString[  1  ].length - 1  );
    dateString = dateString[  1  ] + ' ' + dateString[  0  ] + ', ' + dateString[  2  ];

    /*Returns string formatted as:
    *August DD, YYYY
    */
    console.log(  '########################################################################'  );
    console.log(  dateString  );
    return dateString;
  }

  function convertToISO(  dateString  ){
    /*Accepts dateString formatted as:
    *'August DD, YYYY'
    */

    var dateObj = new Date(  Date.parse(  dateString  )  ),
        isoDate;

    //console.log(  dateObj  );
    isoDate = $().SPServices.SPConvertDateToISO(
      {
        dateToConvert   :   dateObj,
        dateOffset      :   '-05:00'
      }
    );

    /*Returns SP-MANDATED ISO dateTime string formatted as:
    *'YYYY-MM-DDTHH:MM:MSZ-0500'
    */
    return isoDate;
  }
  /********************************RETURN PUBLIC API****************************************/
  return {
    makeDateString              :         makeDateString,
    convertToISO                :         convertToISO
  }


  /*****************************END RETURN PUBLIC API**************************************/
}  )(  APP, this  );
