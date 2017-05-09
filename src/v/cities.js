/**
 * Created by Ole on 08.05.2017.
 */
"use strict";

/**
 * City menu
 **/

pl.v.cities.manage = {
    setupUserInterface: function () {
        window.addEventListener("beforeunload", pl.v.cities.manage.exit);
        pl.v.cities.manage.refreshUI();
    },
    exit: function () {
        City.saveAll();
    },
    refreshUI: function () {
        document.getElementById("cityMenu").style.display = "block";
        document.getElementById("cityRead").style.display = "none";
        document.getElementById("cityCreate").style.display = "none";
        document.getElementById("cityDelete").style.display = "none";
    }
};

/**
 * Retrieve and List Cities
 **/
pl.v.cities.list = {
    setupUserInterface : function(){
        var tableBodyEl = document.querySelector(
                            "section#cityRead>table>tbody");
        var keys = [],key="", row={ }, i =0;
        var city;
        keys = Object.keys(City.instances);
        tableBodyEl.innerHTML = "";  // initial reset
        for(i=0;i<keys.length;i+=1){
            city = City.instances[keys[i]];
            row = tableBodyEl.insertRow(-1);
            row.insertCell(-1).textContent = city.name;
        }
        document.getElementById("cityMenu").style.display = "none";
        document.getElementById("cityRead").style.display = "block";
    }
};

/**
 * Create City
 **/

pl.v.cities.create = {
    setupUserInterface: function () {
        var formEl = document.querySelector("section#cityCreate > form");
        var saveButton = formEl.commit;

        // add event listeners for responsive validation
        formEl.name.addEventListener("input", function () {
            formEl.name.setCustomValidity(
                City.checkName(formEl.name.value).message);
            });

        saveButton.addEventListener("click",
            pl.v.cities.create.handleSaveButtonClickEvent);

        // neutralize the submit event
        formEl.addEventListener( "submit", function (e) {
            e.preventDefault();
            formEl.reset();
        });
        document.getElementById("cityMenu").style.display = "none";
        document.getElementById("cityCreate").style.display = "block";
        formEl.reset();
    },

    // save user input data
    handleSaveButtonClickEvent: function () {
        var formEl = document.querySelector("section#cityCreate > form");
        var slots;
        slots = { name: formEl.name.value };

        // set error messages in case of constraint violations
        formEl.name.setCustomValidity(City.checkName(slots.name).message);

        // save the input data only if all of the form fields are valid
        if (formEl.checkValidity()){
            City.add(slots);
        } else {
            console.log("es gibt noch fehler");
        }
    }
};

/**
 * Delete City
 **/

pl.v.cities.delete = {
    setupUserInterface: function () {
        var formEl = document.querySelector("section#cityDelete > form");
        var deleteButton = formEl.commit;
        var selectEl = formEl.selectCity;
        // set up the city selection list
        util.fillSelectWithOptions(selectEl, City.instances, "name", {displayProp:"name"});
        // Set an event handler for the submit/delete button
        deleteButton.addEventListener("click",
            pl.v.cities.delete.handleDeleteButtonClickEvent);
        document.getElementById("cityMenu").style.display = "none";
        document.getElementById("cityDelete").style.display = "block";
        formEl.reset();
    },
    // Event handler for deleting a country
    handleDeleteButtonClickEvent: function () {
        var formEl = document.querySelector("section#cityDelete > form");
        var selectEl = formEl.selectCity;
        var name = selectEl.value;
        if (name) {
            City.destroy(name);
            // remove deleted city from select options
            selectEl.remove(selectEl.selectedIndex);
            formEl.reset();
        }
    }
};