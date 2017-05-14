/**
 * Created by Marc on 09.05.2017.
 */

"use strict";

var pl = {
  m: {},
  v: { internationalOrganizations:{}, cities:{},countries:{}},
  c: { internationalOrganizations:{}, cities:{},countries:{}}
};
pl.c.app = {
    initialize: function() {
    },
    createTestData: function() {
        try {
            City.instances["Berlin"] = new City({name:"Berlin"});
            City.instances["Hamburg"] = new City({name:"Hamburg"});
            City.instances["Frankfurt"] = new City({name:"Frankfurt"});
            City.instances["Paris"] = new City({name:"Paris"});
            City.instances["Moskau"] = new City({name:"Moskau"});
            City.instances["Novosibirsk"] = new City({name:"Novosibirsk"});
            City.instances["London"] = new City({name:"London"});
            City.instances["Madrid"] = new City({name:"Madrid"});
            City.saveAll();

            Country.instances["Deutschland"] = new Country({
                name: "Deutschland",
                capital: "Berlin",
                cities: {name: "Berlin"}});
            Country.instances["Russland"] = new Country({
                name: "Russland",
                capital: "Moskau",
                cities: {name: "Moskau"}});
            Country.instances["Frankreich"] = new Country({
                name: "Frankreich",
                capital: "Paris",
                cities: {name: "Paris"}});
            Country.saveAll();

            InternationalOrganizations.instances["ABC"] =
                new InternationalOrganizations({
                    acronym:"ABC",
                    name:"A-B-C",
                    members: {name: "Deutschland"}});
            InternationalOrganizations.saveAll();
        } catch (e) {
            console.log(e.constructor.name + ": " + e.message);
        }
    },
    clearData: function() {
        try {
            City.instances = {};
            localStorage["cities"] = JSON.stringify({});
            Country.instances = {};
            localStorage["countries"] = JSON.stringify({});
            InternationalOrganizations.instances = {};
            localStorage["internationalOrganizations"] = JSON.stringify({});
            console.log("All data cleared.");
        } catch (e) {
            console.log( e.constructor.name + ": " + e.message);
        }
    }
};