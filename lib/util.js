/**
 * Created by Marc on 25.04.2017.
 */
var util;
util = {
  /**
   * Verifies if a value represents an integer
   * @param {string} x
   * @return {boolean}
   */
  isNonEmptyString: function (x) {
    return typeof(x) === "string" && x.trim() !== "";
  },
  /**
   * Return the next year value (e.g. if now is
   * 2013 the function will return 2014)
   * @return {number}  the integer representing the next year value
   */
  nextYear: function () {
    var date = new Date();
    return (date.getFullYear() + 1);
  },
  /**
   * Verifies if a value represents an integer or integer string
   * @param {string} x
   * @return {boolean}
   */
  isIntegerOrIntegerString: function (x) {
    return typeof(x) === "number" && x.toString().search( /^-?[0-9]+$/ ) == 0 ||
        typeof(x) === "string" && x.search( /^-?[0-9]+$/ ) == 0;
  },
  /**
   * Creates a typed "data clone" of an object
   * @param {object} obj
   */
  cloneObject: function (obj) {
    var clone = Object.create( Object.getPrototypeOf(obj));
    for (var p in obj) {
      if (obj.hasOwnProperty(p) && typeof obj[p] != "object") {
        clone[p] = obj[p];
      }
    }
    return clone;
  },
  positivInteger: function(x){
    return typeof (x) === "number" && x>0;
    
    
  },
  
  percentage: function(x){
    return typeof (x) === "number" && 0 <= x && x>=100;
    
    
  },
  /**
   * Create option elements from a map of objects
   * and insert them into a selection list element
   *
   * @param {object} objMap  A map of objects
   * @param {object} selEl  A select(ion list) element
   * @param {string} stdIdProp  The standard identifier property
   * @param {string} displayProp [optional]  A property supplying the text
   *                 to be displayed for each object
   */
  fillSelectWithOptions: function (objMap, selEl, stdIdProp, displayProp) {
    var optionEl = null, obj = null, i = 0,
        keys = Object.keys( objMap );
    for (i = 0; i < keys.length; i++) {
      obj = objMap[keys[i]];
      obj.index = i + 1;  // store selection list index
      optionEl = document.createElement( "option" );
      optionEl.value = obj[stdIdProp];
      if (displayProp) {
        // show the values of displayProp in the select list
        optionEl.text = obj[displayProp];
      }
      else {
        // show the values of stdIdProp in the select list
        optionEl.text = obj[stdIdProp];
      }
      selEl.add( optionEl, null );
    }
  },
  createChoiceWidget: function (containerEl, fld, values,
                                choiceWidgetType, choiceItems) {

    var j=0, el=null,
        choiceControls = containerEl.getElementsByTagName("label"),
        //needed to have the number of all childs even after deleting a few
        oldLength = choiceControls.length;
    // remove old content
    for (j=0; j < oldLength; j+=1) {
      containerEl.removeChild( choiceControls[0]);
    }
    if (!containerEl.hasAttribute("data-bind")) {
      containerEl.setAttribute("data-bind", fld);
    }
    if (values.length >= 1) {
      if (choiceWidgetType === "radio") {
        containerEl.setAttribute("data-value", values[0]);
      } else {  // checkboxes
        containerEl.setAttribute("data-value", "["+ values.join() +"]");
      }
    }
    for (j=0; j < choiceItems.length; j+=1) {
      // button values = 1..n
      el = this.createLabeledChoiceControl( choiceWidgetType, fld,
          j+1, choiceItems[j]);
      // check the radio button or checkbox
      if (values.includes(j+1))
      {
        el.firstElementChild.checked = true;
      }
      containerEl.appendChild( el);
      el.firstElementChild.addEventListener("click", function (e) {
        var btnEl = e.target, i=0, values=[];
        if (choiceWidgetType === "radio") {
          if (containerEl.getAttribute("data-value") !== btnEl.value) {
            containerEl.setAttribute("data-value", btnEl.value);
          } else {
            // turn off radio button
            btnEl.checked = false;
            containerEl.setAttribute("data-value", "");
          }
        } else {  // checkbox
          values = JSON.parse( containerEl.getAttribute("data-value")) || [];
          i = values.indexOf( parseInt( btnEl.value));
          if (i > -1) {
            values.splice(i, 1);  // delete from value list
          } else {  // add to value list
            values.push( btnEl.value);
          }
          containerEl.setAttribute("data-value", "["+ values.join() +"]");
        }
      });
    }
    return containerEl;
  },
  /**
   * Create a radio button or checkbox element
   */
  createLabeledChoiceControl: function (t,n,v,lbl) {

    var ccEl = document.createElement("input"),
        lblEl = document.createElement("label");
    ccEl.type = t;
    ccEl.name = n;
    ccEl.value = v;
    lblEl.appendChild( ccEl);
    lblEl.appendChild( document.createTextNode( lbl));
    return lblEl;
  }
}
;