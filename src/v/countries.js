
/**
 *  Created by Ole on 08.05.2017.
 *
 *  Zur Überprüfung:
 *  - pl.v.countries.create: Validity für Capital und Cities?
 **/

"use strict";

/**
 * Country menu
 **/

pl.v.countries.manage = {
    setupUserInterface: function () {
        window.addEventListener("beforeunload", pl.v.countries.manage.exit);
        pl.v.countries.manage.refreshUI();
    },
    exit: function () {
        Country.saveAll();
    },
    refreshUI: function () {
        document.getElementById("countryMenu").style.display = "block";
        document.getElementById("countryRead").style.display = "none";
        document.getElementById("countryCreate").style.display = "none";
        document.getElementById("countryUpdate").style.display = "none";
        document.getElementById("countryDelete").style.display = "none";
    }
};

/**
 * Retrieve and List Countries
 **/
pl.v.countries.list = {
    setupUserInterface : function(){
        var tableBodyEl = document.querySelector(
            "section#countryRead>table>tbody");
        var keys = [],key="", row={ }, i =0, listEl=null;
        var country;
        keys = Object.keys(Country.instances);
        tableBodyEl.innerHTML = "";  // initial reset
        for(i=0;i<keys.length;i+=1){
            row = tableBodyEl.insertRow(-1);
            country = Country.instances[keys[i]];
            row.insertCell(-1).textContent = country.name;
            row.insertCell(-1).textContent = country.capital;
            // create list of cities
            listEl = util.createListFromMap(country.cities, "name");
            row.insertCell(-1).appendChild(listEl);
        }
        document.getElementById("countryMenu").style.display = "none";
        document.getElementById("countryRead").style.display = "block";
    }
};

/**
 * Create City
 **/

pl.v.countries.create = {
    setupUserInterface: function () {
        var formEl = document.querySelector("section#countryCreate > form"),
            citiesSelectEl = formEl.selectCities,
            capitalSelectEl = formEl.selectCapital,
            saveButton = formEl.commit;

        // add event listeners for responsive validation
        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Country.checkNameAsId(formEl.name.value).message);
        });
            
            formEl.selectCapital.addEventListener("input", function () {
              formEl.selectCapital.setCustomValidity(
                  Country.checkCapital( formEl.selectCapital.value ).message );
            });
        
                // set up the cities selection list (or association list widget)
        util.fillSelectWithOptions(citiesSelectEl, City.instances, "name",
            {displayProp:"name"});

        // set up the capital selection list
        util.fillSelectWithOptions(capitalSelectEl, City.instances, "name",
            {displayProp:"name"});
      

        saveButton.addEventListener("click",
            pl.v.countries.create.handleSaveButtonClickEvent);

        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
            formEl.reset();
        });
        document.getElementById("countryMenu").style.display = "none";
        document.getElementById("countryCreate").style.display = "block";
        formEl.reset();
    },

    // save user input data
    handleSaveButtonClickEvent: function () {
        var formEl = document.querySelector("section#countryCreate > form");
        var i=0;
        var selectCitiesOptions = formEl.selectCities.selectedOptions;
        var slots;
        slots = { name: formEl.name.value,
                    capital: formEl.selectCapital.value,
                    cities: []};

        // set error messages in case of constraint violations
        formEl.name.setCustomValidity(Country.checkNameAsId(slots.name).message);
          formEl.selectCapital.setCustomValidity(Country.checkCapital(slots.capital).message);

        // save the input data only if all of the form fields are valid
        if (formEl.checkValidity()){
            for (i=0; i < selectCitiesOptions.length; i++) {
                slots.cities.push( selectCitiesOptions[i].value);
            }
            Country.add(slots);
        } else {
            console.log("es gibt noch fehler");
        }
    }
};

/**
 * Update City
 **/

pl.v.countries.update = {
    /**
     * initialize the updateCountry form
     */
    setupUserInterface: function () {
        var formEl = document.querySelector("section#countryUpdate > form"),
            saveButton = formEl.commit,
            selectCountryEl = formEl.selectCountry,
            selectCapital = formEl.selectCapital;
        var citiesSelWidget = document.querySelector(
            "section#countryUpdate > form .MultiSelectionWidget");
        citiesSelWidget.innerHTML = "";
        // set up the country selection list
        util.fillSelectWithOptions(selectCountryEl, Country.instances,
            "name", {displayProp:"name"});
        util.fillSelectWithOptions(selectCapital, City.instances,
            "name", {displayProp:"name"});


        // when a country is selected, populate the form with its data
        selectCountryEl.addEventListener("input", function () {

            var country = null,
                countryKey = selectCountryEl.value;
            if (countryKey) {  // set form fields
                country = Country.instances[countryKey];

                formEl.name.value = country.name;

            } else {
                formEl.reset();
            }
        });

        selectCountryEl.addEventListener("change", this.handleCountrySelectChangeEvent);


        // add event listeners for responsive validation
        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Country.checkNameAsId( formEl.name.value).message);
        });
      formEl.selectCapital.addEventListener("input", function () {
        formEl.selectCapital.setCustomValidity(
            Country.checkCapital( formEl.selectCapital.value ).message );
      });
  
  
      // Set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.countries.update.handleSaveButtonClickEvent);
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            var citiesSelWidget = document.querySelector(
                "section#countryUpdate > form .MultiSelectionWidget");
            e.preventDefault();
            citiesSelWidget.innerHTML = "";
            formEl.reset();
        });
        // Set a handler for the event when the browser window/tab is closed
        window.addEventListener("beforeunload", Country.saveAll);

        document.getElementById("countryMenu").style.display = "none";
        document.getElementById("countryUpdate").style.display = "block";
        formEl.reset();

    },

    handleCountrySelectChangeEvent: function () {
        var formEl = document.querySelector("section#countryUpdate > form"),
            countriesSelWidget = formEl.querySelector(".MultiSelectionWidget"),
            key = formEl.selectCountry.value,
            country=null;
        if (key !== "") {
            country = Country.instances[key];
            formEl.name.value = country.name;
            // set up the associated cities selection widget
            util.createMultiSelectionWidget(countriesSelWidget, country.cities,
                City.instances, "name", "name");
            // assign associated capital to index of select element
            formEl.selectCapital.value = country.capital;
        } else {
            formEl.reset();
            formEl.selectCapital.selectedIndex = 0;
        }
    },
    /**
     * check data and invoke update
     */
    handleSaveButtonClickEvent: function () {
        var formEl = document.querySelector("section#countryUpdate > form"),
            citiesSelWidget = formEl.querySelector(".MultiSelectionWidget"),
            citiesAssocListEl = citiesSelWidget.firstElementChild,
            assocCityListItemEl=null, citiesIdRefToRemove=[],
            citiesIdRefToAdd=[], i=0,
            selectCountryEl = formEl.selectCountry;
        
        var slots = { name: formEl.name.value,
                        capital: formEl.selectCapital.value,
                        cities: {}};

        // set error messages in case of constraint violations
        formEl.name.setCustomValidity( Country.checkName( slots.name).message);

        if (formEl.checkValidity()) {
            console.log("wir haben folgende Werte: "+slots.name);

            for (i=0; i < citiesAssocListEl.children.length; i++) {
                assocCityListItemEl = citiesAssocListEl.children[i];
                if (assocCityListItemEl.classList.contains("removed")) {
                    citiesIdRefToRemove.push( assocCityListItemEl.getAttribute("data-value"));
                }
                if (assocCityListItemEl.classList.contains("added")) {
                    citiesIdRefToAdd.push( assocCityListItemEl.getAttribute("data-value"));
                }
            }
            // if the add/remove list is non-empty create a corresponding slot
            if (citiesIdRefToRemove.length > 0) {
                slots.citiesIdRefToRemove = citiesIdRefToRemove;
            }
            if (citiesIdRefToAdd.length > 0) {
                slots.citiesIdRefToAdd = citiesIdRefToAdd;
            }

            Country.update(slots);
            // update the selection list option
            selectCountryEl.options[selectCountryEl.selectedIndex].text = slots.name;
        }
    }
};

/**
 * Delete City
 **/

pl.v.countries.delete = {
    setupUserInterface: function () {
        var formEl = document.querySelector("section#countryDelete > form");
        var deleteButton = formEl.commit;
        var selectEl = formEl.selectCountry;
        // set up the city selection list
        util.fillSelectWithOptions(selectEl, Country.instances, "name", {displayProp:"name"});
        // Set an event handler for the submit/delete button
        deleteButton.addEventListener("click",
            pl.v.countries.delete.handleDeleteButtonClickEvent);
        document.getElementById("countryMenu").style.display = "none";
        document.getElementById("countryDelete").style.display = "block";
        formEl.reset();
    },
    // Event handler for deleting a country
    handleDeleteButtonClickEvent: function () {
        var formEl = document.querySelector("section#countryDelete > form");
        var selectEl = formEl.selectCountry;
        var name = selectEl.value;
        if (name) {
            Country.destroy(name);
            // remove deleted city from select options
            selectEl.remove(selectEl.selectedIndex);
            formEl.reset();
        }
    }
};