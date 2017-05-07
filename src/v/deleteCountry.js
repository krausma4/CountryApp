/**
 * Created by Marc on 19.04.2017.
 */
"use strict";

pl.v.deleteCountry = {
    setupUserInterface: function () {
        var deleteButton = document.forms["Country"].commit;
        var selectEl = document.forms["Country"].selectCountry;
        var key="", keys=[], country=null, optionEl=null, i=0;
        // load all country objects
      
        keys = Object.keys( Country.instances);
        // populate the selection list with countrys
        for (i=0; i < keys.length; i+=1) {
            key = keys[i];
            country = Country.instances[key];
            optionEl = document.createElement("option");
            optionEl.text = country.name;
            optionEl.value = country.name;
            selectEl.add( optionEl, null);
        }
        // Set an event handler for the submit/delete button
        deleteButton.addEventListener("click",
            pl.v.deleteCountry.handleDeleteButtonClickEvent);
        // Set a handler for the event when the browser window/tab is closed
        window.addEventListener("beforeunload", Country.saveAll);
    },
    // Event handler for deleting a country
    handleDeleteButtonClickEvent: function () {
        var selectEl = document.forms["Country"].selectCountry;
        var name = selectEl.value;
        if (name) {
            Country.destroy( name);
            // remove deleted country from select options
            selectEl.remove( selectEl.selectedIndex);
        }
    }
};