/**
 * Created by Marc on 08.05.2017.
 */
"use strict";

pl.v.internationalOrganizations.manage ={
  
  
  setupUserInterface: function (){
    window.addEventListener("beforeunload",pl.v.internationalOrganizations.exit);
    pl.v.internationalOrganizations.manage.refreshUI();
    
    
  },
  
  exit: function (){
    InternationalOrganizations.saveAll();
  },
  
  refreshUI: function(){
    document.getElementById("Organization-M").style.display = "block";
    document.getElementById("Organization-R").style.display = "none";
    document.getElementById("Organization-C").style.display = "none";
    document.getElementById("Organization-U").style.display = "none";
    document.getElementById("Organization-D").style.display = "none";
  
    
  }
  
};



pl.v.internationalOrganizations.list = {
  setupUserInterface: function () {
    
    var tableBodyEl = document.querySelector(
        "section#Organization-R>table>tbody");
    var i=0, row=null, organization=null, listEl=null,
        keys = Object.keys( InternationalOrganizations.instances);
    tableBodyEl.innerHTML = "";  // drop old contents
    
    for (i=0; i < keys.length; i++) {
      organization = InternationalOrganizations.instances[keys[i]];
      row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = organization.name;
      row.insertCell(-1).textContent = organization.acronym;
     
      // create list of authors
      listEl = util.createListFromMap(organization.members, "name");
      row.insertCell(-1).appendChild(listEl);
    }
    document.getElementById("Organization-M").style.display = "none";
    document.getElementById("Organization-R").style.display = "block";
  }
};


/**********************************************
 * Use case Create Organization
 **********************************************/
pl.v.internationalOrganizations.create = {
  /**
   * initialize the books.create form
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#Organization-C > form"),
        membersSelectEl = formEl.selectMembers,
        nameSelectEl = formEl.name,
        acronymSelect = formEl.acronym,
        submitButton = formEl.commit;
       // add event listeners for responsive validation
        formEl.name.addEventListener("input", function () {
        formEl.name.setCustomValidity(
          InternationalOrganizations.checkName( formEl.name.value).message);
    });
    formEl.acronym.addEventListener("input", function () {
      formEl.acronym.setCustomValidity(
          InternationalOrganizations.checkAcronymAsId( formEl.acronym.value).message);
    });
    formEl.selectMembers.addEventListener("change",function () {
      
     // formEl.selectMembers.setCustomValidity(InternationalOrganizations.checkMember(formEl.selectMembers));
      
    });
    /* MISSING CODE: add event listeners for responsive validation
     on new user input with Book.checkTitle and Book.checkYear
     */
    
    
    // set up the authors selection list (or association list widget)
    util.fillSelectWithOptions( membersSelectEl, Country.instances, "name",
        {displayProp:"name"});
    // set up the publisher selection list
   
    submitButton.addEventListener("click", this.handleSubmitButtonClickEvent);
    // define event handler for neutralizing the submit event
    formEl.addEventListener( 'submit', function (e) {
      e.preventDefault();
      formEl.reset();
    });
    // replace the Book-M form with the createBook form
    document.getElementById("Organization-M").style.display = "none";
    document.getElementById("Organization-C").style.display = "block";
    formEl.reset();
  },
  
  
  handleSubmitButtonClickEvent: function () {
    var i=0, formEl = document.querySelector("section#Organization-C > form"),
        selectedMembersOptions = formEl.selectMembers.selectedOptions;
    var slots = {
      name: formEl.name.value,
      acronym: formEl.acronym.value,
      membersIdRef: []
    };
    
 
    // check all input fields and show error messages
    formEl.name.setCustomValidity( InternationalOrganizations.checkName( slots.name).message);
    formEl.acronym.setCustomValidity( InternationalOrganizations.checkAcronymAsId( slots.acronym).message);
    /*MISSING CODE: do the same with Book.checkTitle and Book.checkYear */
    // save the input data only if all of the form fields are valid
    if (formEl.checkValidity()) {
      // construct the list of author ID references from the association list
      console.log("anzahl ausgewählter länder: "+selectedMembersOptions.length);
      for (i=0; i < selectedMembersOptions.length; i++) {
        
        console.log("member hinzufügen: "+ selectedMembersOptions[i].value);
        slots.membersIdRef.push( selectedMembersOptions[i].value);
      }
      // alternative code using array.map
      /*
       slots.authorsIdRef = selectedAuthorsOptions.map( function (optionEl) {
       return optionEl.value;
       });
       */
      InternationalOrganizations.add( slots);
      InternationalOrganizations.saveAll();
    }
  }
};


pl.v.internationalOrganizations.destroy = {
  
  setupUserInterface: function () {
    
    var formEl = document.querySelector("#deleteOrganizationForm");
    
    var deleteButton = formEl.delete;
    
    var selectEl = formEl.selectOrganization;
    
    // set up the organization selection list
    
    util.fillSelectWithOptions(selectEl, InternationalOrganizations.instances, "acronym", {displayProp:"acronym"});
    
    // Set an event handler for the submit/delete button
  
    deleteButton.addEventListener("click", function () {
      var formEl = document.querySelector("section#Organization-D > form");
      console.log("lösche nun: "+ formEl.selectOrganization.value);
      InternationalOrganizations.destroy( formEl.selectOrganization.value);
      // remove deleted book from select options
      formEl.selectOrganization.remove( formEl.selectOrganization.selectedIndex);
      formEl.reset();
    });
    document.getElementById("Organization-M").style.display = "none";
    
    document.getElementById("Organization-D").style.display = "block";
    
    formEl.reset();
    
  },
  
  // Event handler for deleting a country
  
  handleDeleteButtonClickEvent: function () {
  
    
    var formEl = document.querySelector("#deleteOrganizationForm");
  
    var selectEl = formEl.selectOrganization;
    
    var name = selectEl.value;
    console.log("acronym= "+name);
    if (name) {
      
      InternationalOrganizations.destroy(name);
      
      // remove deleted organization from select options
      
      selectEl.remove(selectEl.selectedIndex);
      
    //  formEl.reset();
      
    }
    
  }



};


pl.v.internationalOrganizations.update = {
  /**
   * Initialize the update books UI/form. Notice that the Association List
   * Widget for associated authors is left empty initially.
   * It is only set up on book selection
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#Organization-U > form"),
        organizationSelectEl = formEl.selectOrganization,
        nameSelectEl = formEl.name,
        submitButton = formEl.commit;
    
    // set up the organization selection list
    util.fillSelectWithOptions( organizationSelectEl, InternationalOrganizations.instances,
        "acronym");
    organizationSelectEl.addEventListener("change", this.handleOrganizationSelectChangeEvent);
    /* MISSING CODE: add event listeners for responsive validation
     on new user input with Book.checkTitle and Book.checkYear
     */
    // set up the associated publisher selection list
 
    // define event handler for submitButton click events
    submitButton.addEventListener("click", this.handleSubmitButtonClickEvent);
    // define event handler for neutralizing the submit event and reseting the form
    formEl.addEventListener( 'submit', function (e) {
      var membersSelWidget = document.querySelector(
          "section#Organization-U > form .MultiSelectionWidget");
      e.preventDefault();
      membersSelWidget.innerHTML = "";
      formEl.reset();
    });
    document.getElementById("Organization-M").style.display = "none";
    document.getElementById("Organization-U").style.display = "block";
    formEl.reset();
  },
  /**
   * handle book selection events: when a book is selected,
   * populate the form with the data of the selected book
   */
  handleOrganizationSelectChangeEvent: function () {
    var formEl = document.querySelector( "section#Organization-U > form" ),
        membersSelWidget = formEl.querySelector( ".MultiSelectionWidget" ),
        key = formEl.selectOrganization.value,
        organization = null;
    if (key !== "") {
      organization = InternationalOrganizations.instances[key];
      formEl.name.value = organization.name;
      formEl.acronym.value = organization.acronym;
      // set up the associated authors selection widget
      util.createMultiSelectionWidget( membersSelWidget, organization.members,
          Country.instances, "name", "name" );
      // assign associated publisher to index of select element
    
    }
  },
  /**
   * handle form submission events
   */
  handleSubmitButtonClickEvent: function () {
    var assocMemberListItemEl=null, membersIdRefToRemove=[],
        membersIdRefToAdd=[], i=0,
        formEl = document.querySelector("section#Organization-U > form"),
        membersSelWidget = formEl.querySelector(".MultiSelectionWidget"),
        membersAssocListEl = membersSelWidget.firstElementChild;
    var slots = { name: formEl.name.value,
      acronym: formEl.acronym.value
    };
    // check all input fields and show error messages
    /*MISSING CODE:  Book.checkIsbn, Book.checkTitle and Book.checkYear
     *               have not been defined
     formEl.isbn.setCustomValidity( Book.checkIsbn( slots.isbn).message);
     formEl.title.setCustomValidity( Book.checkTitle( slots.title).message);
     formEl.year.setCustomValidity( Book.checkYear( slots.year).message);
     */
    // commit the update only if all of the form fields values are valid
    if (formEl.checkValidity()) {
      // construct authorsIdRef-ToAdd/ToRemove lists from the association list
      for (i=0; i < membersAssocListEl.children.length; i++) {
        assocMemberListItemEl = membersAssocListEl.children[i];
        if (assocMemberListItemEl.classList.contains("removed")) {
          membersIdRefToRemove.push( assocMemberListItemEl.getAttribute("data-value"));
        }
        if (assocMemberListItemEl.classList.contains("added")) {
          membersIdRefToAdd.push( assocMemberListItemEl.getAttribute("data-value"));
        }
      }
      // if the add/remove list is non-empty create a corresponding slot
      if (membersIdRefToRemove.length > 0) {
        slots.membersIdRefToRemove = membersIdRefToRemove;
      }
      if (membersIdRefToAdd.length > 0) {
        slots.membersIdRefToAdd = membersIdRefToAdd;
      }
      InternationalOrganizations.update( slots);
    }
  }
  



};