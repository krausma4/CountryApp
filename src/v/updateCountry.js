
"use strict";
pl.v.updateCountry = {
  /**
   * initialize the updateCountry form
   */
  setupUserInterface: function () {
    var formEl = document.forms["Country"],
        saveButton = formEl.commit,
        selectCountryEl = formEl.selectCountry,
    codeFieldSelEl = formEl.querySelector(
        "fieldset[data-bind='code']"
    ),
        religionsFieldSelEl = formEl.querySelector(
            "fieldset[data-bind='religions']");
    this.fillSelect(selectCountryEl);
  
    // when a country is selected, populate the form with its data
    selectCountryEl.addEventListener("input", function () {
      
      var country =null, countryKey = selectCountryEl.value;
      if (countryKey) {  // set form fields
        country = Country.instances[countryKey];
  
        country = Country.instances[countryKey];
        formEl.name.value = country.name;
        formEl.population.value = country.population;
        formEl.lifeExpectancy.value = country.lifeExpectancy;
        util.createChoiceWidget( codeFieldSelEl, "code",
            [country.code], "radio", CountryCodeEL.labels);
        //set up checkboxes for religions
        util.createChoiceWidget( religionsFieldSelEl, "religions",
            country.religions, "checkbox", ReligionsEL.labels);
        if (country.militaryExpenditure !== undefined)
          {
          formEl.militaryExpenditure.value = country.militaryExpenditure;
         }
      } else {
        formEl.reset();
      }
    });
    // add event listeners for responsive validation
    formEl.name.addEventListener("input", function () {
      formEl.name.setCustomValidity(
          Country.checkName( formEl.name.value).message);
    });
  
    codeFieldSelEl.addEventListener("click", function () {
      codeFieldSelEl.setCustomValidity(
          (!codeFieldSelEl.value) ? "A value must be selected!":"" );
    });
    formEl.population.addEventListener("input", function () {
     
      var v = formEl.population.value;
      var ed ;
      if(v ===""){
        ed = undefined;
      }
      formEl.population.setCustomValidity
      (Country.checkPopulation( ed).message);
    });
    formEl.lifeExpectancy.addEventListener("input", function () {
    
      var v = formEl.lifeExpectancy.value;
         var ed ;
      
      
      if(v ===""){
        ed = undefined;
      }
    
      formEl.lifeExpectancy.setCustomValidity
      (Country.checkLifeExpectancy( ed).message);
    });
    
    formEl.militaryExpenditure.addEventListener("input", function () {
      var v = formEl.militaryExpenditure.value,
          ed = v ? parseInt(v) : undefined;
      formEl.militaryExpenditure.setCustomValidity
      ( Country.checkMilitaryExpenditure( ed).message);
    });
  
    formEl.religions.addEventListener("input", function ()
    {
      var v = formEl.religions.value,
          ed = v ? parseInt(v) : undefined;
      formEl.religions[1].setCustomValidity(
          Country.checkReligions(ed).message);
    });
    
    formEl.code.addEventListener("input", function ()
    {
      var v = formEl.code.value,
          ed = v ? parseInt(v) : undefined;
      formEl.code[1].setCustomValidity(
          Country.checkCode(ed).message);
    });
  
  
    // Set an event handler for the submit/save button
    saveButton.addEventListener("click",
        pl.v.updateCountry.handleSaveButtonClickEvent);
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    // Set a handler for the event when the browser window/tab is closed
    window.addEventListener("beforeunload", Country.saveAll);
  },
  
  fillSelect: function (selectCountryEl)
  {

    var key = "",
        keys = [],
        country = null,
        optionEl = null,
        i = 0;
    //populate the selectionList with Countries
    keys = Object.keys(Country.instances);
    for (i = 0; i < keys.length; i += 1)
    {
      key = keys[i];
      country = Country.instances[key];
      optionEl = document.createElement("option");
      optionEl.text = country.name;
      optionEl.value = country.name;
      selectCountryEl.add(optionEl, null);
    }
  },
  
  
  /**
   * check data and invoke update
   */
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms["Country"],
        selectCountryEl = formEl.selectCountry,
        codeFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='code']"),
        religionsFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='religions']");
  
    var slots = { name: formEl.name.value,
      code: parseInt( codeFieldsetEl.getAttribute("data-value")),
      population: formEl.population.value,
      lifeExpectancy: formEl.lifeExpectancy.value,
      militaryExpenditure: formEl.militaryExpenditure.value,
      religions: JSON.parse( religionsFieldsetEl.getAttribute(
          "data-value"))
    };
    
  
  
    
    // set error messages in case of constraint violations
   // formEl.name.setCustomValidity( Country.checkName( slots.name).message);
    formEl.population.setCustomValidity
    ( Country.checkPopulation( slots.population).message);
  
    formEl.code[1].setCustomValidity(Country.checkCode(slots.code).message);
    
    formEl.militaryExpenditure.setCustomValidity
    ( Country.checkMilitaryExpenditure( slots.militaryExpenditure).message);
  
    formEl.religions[0].setCustomValidity(
        Country.checkReligions(slots.religions).message);
    
    if (formEl.checkValidity()) {
      console.log("wir haben folgende Werte: "+slots.population+" "
          +slots.lifeExpectancy);
      Country.update( slots);
      // update the selection list option
      selectCountryEl.options[selectCountryEl.selectedIndex].text = slots.name;
    }
  }
};