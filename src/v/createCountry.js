/**
 * Created by Marc on 19.04.2017.
 */
"use strict";
pl.v.createCountry = {
    setupUserInterface: function () {
      var formEl = document.forms["Country"];
        var saveButton = document.forms["Country"].commit;
        var codeFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='code']"),
            religionsFieldsetEl = formEl.querySelector(
                "fieldset[data-bind='religions']");
  
      util.createChoiceWidget( codeFieldsetEl, "code", [],
          "radio", CountryCodeEL.labels);
  
  
      util.createChoiceWidget( religionsFieldsetEl, "religions", [],
          "checkbox", ReligionsEL.labels);
      
      
     
      // add event listeners for responsive validation
      formEl.name.addEventListener("input", function () {
        formEl.name.setCustomValidity(
            Country.checkName(formEl.name.value).message);
      });
  
      codeFieldsetEl.addEventListener("click", function ()
          {
            formEl.code[0].setCustomValidity(
                
                (!codeFieldsetEl.getAttribute("data-value")) ?
                    "A Country Code must be selected":"");
          }
      );
      
      
      
      formEl.population.addEventListener("input", function () {
        formEl.population.setCustomValidity(
            Country.checkPopulation( formEl.population.value).message);
      });
      
      formEl.lifeExpectancy.addEventListener("input", function () {
        formEl.lifeExpectancy.setCustomValidity(
            Country.checkLifeExpectancy( formEl.lifeExpectancy.value).message);
      });
      
      formEl.militaryExpenditure.addEventListener("input", function () {
        formEl.militaryExpenditure.setCustomValidity(
            Country.checkMilitaryExpenditure
                    ( formEl.militaryExpenditure.value).message);
      });
      
      saveButton.addEventListener("click",
          pl.v.createCountry.handleSaveButtonClickEvent);
  
      // neutralize the submit event
      formEl.addEventListener( "submit", function (e) {
        e.preventDefault();
        formEl.reset();
      });
      
        // set a handler for the event when the browser window/tab is closed
        window.addEventListener("beforeunload", Country.saveAll);
    },
    // save user input data
   
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms["Country"],
        codeFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='code']"),
        relgionsFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='religions']");
    var slots;
    slots = {
      name: formEl.name.value,
      code: parseInt(codeFieldsetEl.getAttribute("data-value")),
      population: formEl.population.value,
      lifeExpectancy: formEl.lifeExpectancy.value,
      militaryExpenditure: formEl.militaryExpenditure.value,
      religions: JSON.parse( relgionsFieldsetEl.getAttribute("data-value"))
    };
    
   
    // set error messages in case of constraint violations
    formEl.population.setCustomValidity
    ( Country.checkPopulation( slots.population).message);
    formEl.name.setCustomValidity( Country.checkName( slots.name).message);
   
    
    
    
    formEl.code[1].setCustomValidity(
        Country.checkCode( slots.code).message);
    formEl.lifeExpectancy.setCustomValidity
    ( Country.checkLifeExpectancy( slots.lifeExpectancy).message);
    if (formEl.militaryExpenditure.value) {
      slots.militaryExpenditure = formEl.militaryExpenditure.value;
      formEl.militaryExpenditure.setCustomValidity
      ( Country.checkMilitaryExpenditure( slots.militaryExpenditure).message);
    }
  
    if (formEl.religions.value)
    {
      formEl.religions[1].setCustomValidity(
          Country.checkReligions( slots.religions).message);
    }
    // save the input data only if all of the form fields are valid
    if (formEl.checkValidity()){
        Country.add( slots);
    }else{
      console.log("es gibt noch fehler");
    }
  }
  
 
};