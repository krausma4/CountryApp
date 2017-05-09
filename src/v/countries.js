<<<<<<< HEAD

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
            row.insertCell(-1).textContent =
                country.capital ? country.capital.name : "";
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
                Country.checkName(formEl.name.value).message);

        // set up the cities selection list (or association list widget)
        util.fillSelectWithOptions(citiesSelectEl, City.instances, "name",
            {displayProp:"name"});

        // set up the capital selection list
        util.fillSelectWithOptions(capitalSelectEl, City.instances, "name",
            {displayProp:"name"});
        });

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
        var slots;
        slots = { name: formEl.name.value };

        // set error messages in case of constraint violations
        formEl.name.setCustomValidity(Country.checkName(slots.name).message);

        // save the input data only if all of the form fields are valid
        if (formEl.checkValidity()){
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
            selectCountryEl = formEl.selectCountry;
        // set up the country selection list
        util.fillSelectWithOptions(selectCountryEl, Country.instances,
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
        // add event listeners for responsive validation
        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Country.checkName( formEl.name.value).message);
        });

        // Set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.countries.update.handleSaveButtonClickEvent);
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
            formEl.reset();
        });
        // Set a handler for the event when the browser window/tab is closed
        window.addEventListener("beforeunload", Country.saveAll);
    },

    fillSelect: function (selectCountryEl) {
        var key = "", keys = [], country = null, optionEl = null, i = 0;

        //populate the selectionList with Countries
        keys = Object.keys(Country.instances);
        for (i = 0; i < keys.length; i += 1) {
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
        var formEl = document.querySelector("section#countryUpdate > form"),
            selectCountryEl = formEl.selectCountry;

        var slots = { name: formEl.name.value };

        // set error messages in case of constraint violations
        formEl.name.setCustomValidity( Country.checkName( slots.name).message);

        if (formEl.checkValidity()) {
            console.log("wir haben folgende Werte: "+slots.name);
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
            formEl.selectEl.remove(formEl.selectEl.selectedIndex);
            formEl.reset();
        }
    }
=======
<<<<<<< HEAD

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

pl.v.countries.menu = {
    setupUserInterface: function () {
        window.addEventListener("beforeunload", pl.v.countries.menu.exit);
        pl.v.countries.menu.refreshUI();
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
                Country.checkName(formEl.name.value).message);

        // set up the cities selection list (or association list widget)
        util.fillSelectWithOptions(citiesSelectEl, City.instances, "name",
            {displayProp:"name"});

        // set up the capital selection list
        util.fillSelectWithOptions(capitalSelectEl, City.instances, "name",
            {displayProp:"name"});
        });

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
        var selCapital = formEl.selectCapital;
        var selectedOptions= formEl.selectCities.selectedOptions;
        var slots;
        slots = {
            name: formEl.name.value ,
           capital: selCapital.options[selCapital.selectedIndex].text,
            cities: []
                
                 };
    
        // set error messages in case of constraint violations
    
        formEl.name.setCustomValidity(Country.checkName(slots.name.value).message);
       
        // save the input data only if all of the form fields are valid
        if (formEl.checkValidity()){
            var i;
           for (i=0; i < selectedOptions.length; i++) {
  
             console.log("member hinzufügen: "+ selectedOptions[i].value);
             slots.cities.push( selectedOptions[i].value);
           }
         
            Country.add(slots);
           Country.saveAll();
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
            selectCountryEl = formEl.selectCountry;
        this.fillSelect(selectCountryEl);

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
        // add event listeners for responsive validation
        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Country.checkName( formEl.name.value).message);
        });

        // Set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.countries.update.handleSaveButtonClickEvent);
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
            formEl.reset();
        });
        // Set a handler for the event when the browser window/tab is closed
        window.addEventListener("beforeunload", Country.saveAll);
    },

    fillSelect: function (selectCountryEl) {
        var key = "", keys = [], country = null, optionEl = null, i = 0;

        //populate the selectionList with Countries
        keys = Object.keys(Country.instances);
        for (i = 0; i < keys.length; i += 1) {
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
        var formEl = document.querySelector("section#countryUpdate > form"),
            selectCountryEl = formEl.selectCountry;

        var slots = { name: formEl.name.value };

        // set error messages in case of constraint violations
        formEl.name.setCustomValidity( Country.checkName( slots.name).message);

        if (formEl.checkValidity()) {
            console.log("wir haben folgende Werte: "+slots.name);
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
            formEl.selectEl.remove(formEl.selectEl.selectedIndex);
            formEl.reset();
        }
    }
=======

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
            row.insertCell(-1).textContent =
                country.capital ? country.capital.name : "";
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
                Country.checkName(formEl.name.value).message);

        // set up the cities selection list (or association list widget)
        util.fillSelectWithOptions(citiesSelectEl, City.instances, "name",
            {displayProp:"name"});

        // set up the capital selection list
        util.fillSelectWithOptions(capitalSelectEl, City.instances, "name",
            {displayProp:"name"});
        });

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
        var slots;
        slots = { name: formEl.name.value };

        // set error messages in case of constraint violations
        formEl.name.setCustomValidity(Country.checkName(slots.name).message);

        // save the input data only if all of the form fields are valid
        if (formEl.checkValidity()){
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
            selectCountryEl = formEl.selectCountry;
        this.fillSelect(selectCountryEl);

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
        // add event listeners for responsive validation
        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                Country.checkName( formEl.name.value).message);
        });

        // Set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.countries.update.handleSaveButtonClickEvent);
        // neutralize the submit event
        formEl.addEventListener("submit", function (e) {
            e.preventDefault();
            formEl.reset();
        });
        // Set a handler for the event when the browser window/tab is closed
        window.addEventListener("beforeunload", Country.saveAll);
    },

    fillSelect: function (selectCountryEl) {
        var key = "", keys = [], country = null, optionEl = null, i = 0;

        //populate the selectionList with Countries
        keys = Object.keys(Country.instances);
        for (i = 0; i < keys.length; i += 1) {
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
        var formEl = document.querySelector("section#countryUpdate > form"),
            selectCountryEl = formEl.selectCountry;

        var slots = { name: formEl.name.value };

        // set error messages in case of constraint violations
        formEl.name.setCustomValidity( Country.checkName( slots.name).message);

        if (formEl.checkValidity()) {
            console.log("wir haben folgende Werte: "+slots.name);
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
            formEl.selectEl.remove(formEl.selectEl.selectedIndex);
            formEl.reset();
        }
    }
>>>>>>> origin/master
>>>>>>> origin/master
};