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
    var clone = Object.create( Object.getPrototypeOf( obj ) );
    for (var p in obj) {
      if (obj.hasOwnProperty( p ) && typeof obj[p] != "object") {
        clone[p] = obj[p];
      }
    }
    return clone;
  },
  positivInteger: function (x) {
    return typeof (x) === "number" && x > 0;
    
    
  },
  
  percentage: function (x) {
    return typeof (x) === "number" && 0 <= x && x >= 100;
    
    
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
  fillSelectWithOptions: function (selectEl, selectionRange, keyProp, optPar) {
    var optionEl = null, keys=[], obj=null, displayProp="", i=0;
    // delete old contents
    selectEl.innerHTML = "";
    // create "no selection yet" entry
    if (!selectEl.multiple) {
      selectEl.add( util.createOption(""," --- "));
    }
    // create option elements from object property values
    keys = Object.keys( selectionRange);
    for (i=0; i < keys.length; i++) {
      console.log("KEY: "+ keys[i]);
      obj = selectionRange[keys[i]];
      if (!selectEl.multiple) obj.index = i+1;  // store selection list index
      if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
      else displayProp = keyProp;
      optionEl = util.createOption( obj[keyProp], obj[displayProp]);
      // if invoked with a selection argument, flag the selected options
      if (selectEl.multiple && optPar && optPar.selection &&
          optPar.selection[keyProp]) {
        // flag the option element with this value as selected
        optionEl.selected = true;
      }
      selectEl.add( optionEl);
    }
},
  createElement: function( elemName, id, classValues, txt) {
    var el = document.createElement( elemName);
    if (id) el.id = id;
    if (classValues) el.className = classValues;
    if (txt) el.textContent = txt;
    return el;
  },
  createDiv: function( id, classValues, txt) {
    return util.createElement( "div", id, classValues, txt);
  },
  createSpan: function( id, classValues, txt) {
    return util.createElement( "span", id, classValues, txt);
  },
  createPushButton: function( id, classValues, txt) {
    var pB = util.createElement( "button", id, classValues, txt);
    pB.type = "button";
    return pB;
  },
  fillAssociationList: function (listEl, selection, keyProp, displayProp) {
    var keys=[], obj=null;
    // delete old contents
    listEl.innerHTML = "";
    // create list items from object property values
    keys = Object.keys( selection);
    for (var j=0; j < keys.length; j++) {
      obj = selection[keys[j]];
      util.addObjectToAssociationList( listEl, obj[keyProp], obj[displayProp]);
    }
  },
  createMultiSelectionWidget: function (widgetContainerEl, selection, selectionRange, keyProp, displayProp) {
    var assocListEl = document.createElement("ul"),  // shows associated objects
        selectEl = document.createElement("select"),
        el=null;
    // delete old contents
    widgetContainerEl.innerHTML = "";
    // create association list items from property values of associated objects
    if (!displayProp) displayProp = keyProp;
    util.fillAssociationList( assocListEl, selection, keyProp, displayProp);
    // event handler for removing an associated item from the association list
    assocListEl.addEventListener( 'click', function (e) {
      var listItemEl=null;
      if (e.target.tagName === "BUTTON") {  // delete button
        listItemEl = e.target.parentNode;
        if (listItemEl.classList.contains("removed")) {
          // undoing a previous removal
          listItemEl.classList.remove("removed");
          // change button text
          e.target.textContent = "remove";
        } else if (listItemEl.classList.contains("added")) {
          // removing an added item means moving it back to the selection range
          listItemEl.parentNode.removeChild( listItemEl);
          optionEl = util.createOption( listItemEl.getAttribute("data-value"),
              listItemEl.firstElementChild.textContent);
          selectEl.add( optionEl);
        } else {
          // removing an ordinary item
          listItemEl.classList.add("removed");
          // change button text
          e.target.textContent = "undo";
        }
      }
    });
    widgetContainerEl.appendChild( assocListEl);
    el = util.createDiv();
    el.appendChild( selectEl);
    el.appendChild( util.createPushButton("","","add"));
    // event handler for adding an item from the selection list to the association list
    selectEl.parentNode.addEventListener( 'click', function (e) {
      var assocListEl = e.currentTarget.parentNode.firstElementChild,
          selectEl = e.currentTarget.firstElementChild;
      if (e.target.tagName === "BUTTON") {  // add button
        if (selectEl.value) {
          util.addObjectToAssociationList( assocListEl, selectEl.value,
              selectEl.options[selectEl.selectedIndex].textContent, "added");
          selectEl.remove( selectEl.selectedIndex);
          selectEl.selectedIndex = 0;
        }
      }
    });
    widgetContainerEl.appendChild( el);
    // create select options from selectionRange minus selection
    util.fillAssocListWidgetSelectWithOptions( selectEl, selectionRange, keyProp,
        {"displayProp": displayProp, "selection": selection});
  },
  addObjectToAssociationList: function (listEl, stdId, humanReadableId, classValue) {
    var listItemEl=null, el=null;
    listItemEl = document.createElement("li");
    listItemEl.setAttribute("data-value", stdId);
    el = util.createSpan();
    el.textContent = humanReadableId;
    listItemEl.appendChild( el);
    el = util.createPushButton("","","remove");
    listItemEl.appendChild( el);
    if (classValue) listItemEl.classList.add( classValue);
    listEl.appendChild( listItemEl);
  },
  createOption: function( val, txt, classValues) {
    var el = document.createElement("option");
    el.value = val;
    el.text = txt;
    if (classValues) el.className = classValues;
    return el;
  },
  createChoiceWidget: function (containerEl, fld, values,
                                choiceWidgetType, choiceItems) {
    
    var j = 0, el = null,
        choiceControls = containerEl.getElementsByTagName( "label" ),
        //needed to have the number of all childs even after deleting a few
        oldLength = choiceControls.length;
    // remove old content
    for (j = 0; j < oldLength; j += 1) {
      containerEl.removeChild( choiceControls[0] );
    }
    if (!containerEl.hasAttribute( "data-bind" )) {
      containerEl.setAttribute( "data-bind", fld );
    }
    if (values.length >= 1) {
      if (choiceWidgetType === "radio") {
        containerEl.setAttribute( "data-value", values[0] );
      } else {  // checkboxes
        containerEl.setAttribute( "data-value", "[" + values.join() + "]" );
      }
    }
    for (j = 0; j < choiceItems.length; j += 1) {
      // button values = 1..n
      el = this.createLabeledChoiceControl( choiceWidgetType, fld,
          j + 1, choiceItems[j] );
      // check the radio button or checkbox
      if (values.includes( j + 1 )) {
        el.firstElementChild.checked = true;
      }
      containerEl.appendChild( el );
      el.firstElementChild.addEventListener( "click", function (e) {
        var btnEl = e.target, i = 0, values = [];
        if (choiceWidgetType === "radio") {
          if (containerEl.getAttribute( "data-value" ) !== btnEl.value) {
            containerEl.setAttribute( "data-value", btnEl.value );
          } else {
            // turn off radio button
            btnEl.checked = false;
            containerEl.setAttribute( "data-value", "" );
          }
        } else {  // checkbox
          values = JSON.parse( containerEl.getAttribute( "data-value" ) ) || [];
          i = values.indexOf( parseInt( btnEl.value ) );
          if (i > -1) {
            values.splice( i, 1 );  // delete from value list
          } else {  // add to value list
            values.push( btnEl.value );
          }
          containerEl.setAttribute( "data-value", "[" + values.join() + "]" );
        }
      } );
    }
    return containerEl;
  },
  /**
   * Create a radio button or checkbox element
   */
  createLabeledChoiceControl: function (t, n, v, lbl) {
    
    var ccEl = document.createElement( "input" ),
        lblEl = document.createElement( "label" );
    ccEl.type = t;
    ccEl.name = n;
    ccEl.value = v;
    lblEl.appendChild( ccEl );
    lblEl.appendChild( document.createTextNode( lbl ) );
    return lblEl;
  },
  
  
  createListFromMap: function (aa, displayProp) {
    var listEl = document.createElement( "ul" );
    util.fillListFromMap( listEl, aa, displayProp );
    return listEl;
  },
  fillAssocListWidgetSelectWithOptions: function (selectEl, selectionRange, keyProp, optPar) {
    var keys=[], obj=null, displayProp="", i=0;
    // delete old contents
    selectEl.innerHTML = "";
    // create "no selection yet" entry
    selectEl.add( util.createOption(""," --- "));
    // create option elements from object property values
    keys = Object.keys( selectionRange);
    for (i=0; i < keys.length; i++) {
      // if invoked with a selection argument, only add options for objects
      // that are not yet selected
      if (!optPar || !optPar.selection || !optPar.selection[keys[i]]) {
        obj = selectionRange[keys[i]];
        if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
        else displayProp = keyProp;
        selectEl.add( util.createOption( obj[keyProp], obj[displayProp]));
      }
    }
  },
  /**
   * Fill a list element with items from an associative array of objects
   *
   * @param {object} listEl  A list element
   * @param {object} aa  An associative array of objects
   * @param {string} displayProp  The object property to be displayed in the list
   */
  fillListFromMap: function (listEl, aa, displayProp) {
    var keys = [], listItemEl = null;
    // delete old contents
    listEl.innerHTML = "";
    // create list items from object property values
    keys = Object.keys( aa );
    for (var j = 0; j < keys.length; j++) {
      listItemEl = document.createElement( "li" );
      listItemEl.textContent = aa[keys[j]][displayProp];
      listEl.appendChild( listItemEl );
    }
  }
}
;