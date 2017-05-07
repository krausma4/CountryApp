/**
    * Created by Marc on 13.04.2017.
    */
"use strict";

function Country(slots){
  
  if(arguments.length>0) {
    this.setName (slots.name);
    this.setPopulation  (slots.population);
    this.setLifeExpectancy  (slots.lifeExpectancy);
  
  }

}

Country.instances = {};

Country.checkName = function (t) {
  if (t === undefined) {
    var man = MandatoryValueConstraintViolation("","");
    
    return new MandatoryValueConstraintViolation("A title must be provided!");
  } else if (!util.isNonEmptyString(t)) {
    return new RangeConstraintViolation("The title must be a non-empty string!");
  } else {
    return new NoConstraintViolation();
  }
};
Country.prototype.setName = function (t) {
  var validationResult = Book.checkTitle( t);
  if (validationResult instanceof NoConstraintViolation) {
    this.title = t;
  } else {
    throw validationResult;
  }
};



Country.convertRow2Obj = function (countryRow){
    return new Country(countryRow);
};


Country.destroy = function (name) {
    if (Country.instances[name]) {

        delete Country.instances[name];
        console.log("Country " + name + " deleted");
    } else {
        console.log("There is no country with ISBN " +
                    name + " in the database!");
    }
};

Country.retrieveAll = function(){

    var key ="", keys= [], countryString="",countrys ={}, i=0;

    try {
        if (localStorage.getItem("countrys")) {

        countryString = localStorage.getItem("countrys");
        }
    }
    catch(e){
        alert("Error when reading from Local Storage\n" + e);
        }

        if(countryString){

        countrys = JSON.parse(countryString);
        keys = Object.keys(countrys);
        console.log(keys.length + " countrys are loaded");

            for(i=0;i<keys.length;i++){
                key = keys[i];
                Country.instances[key] = Country.convertRow2Obj(countrys[key]);
            }


    }


};


//delete all Countrys from localstorage
Country.clearData= function (){

    if (confirm("Do you really want to delete all country data?")) {
        Country.instances = {};
        localStorage.setItem("countrys", "{}");
    }


};


Country.saveAll = function(){
  var countryString = "", error=false;
  var countOfCountrys = Object.keys(Country.instances).length;
  try {
    countryString = JSON.stringify(Country.instances);
    localStorage.setItem("countrys",countryString);


  }catch(e){
    alert("Error");
    error =true;

  }

  if(!error){
      console.log(countOfCountrys+ " countrys saved");
  }



};

//  Create a new country row
Country.add = function (slots) {

    // add book to the Book.instances collection
    Country.instances[slots.name] = new Country(slots);
    console.log("Country " + slots.name + " created!");
};

Country.update = function(slots){
        var country = Country.instances[slots.name];
        var population = parseInt(slots.population);
        var lifeExpectancy = parseInt(slots.lifeExpectancy);

        country.name= slots.name;
        country.population = population;
        country.lifeExpectancy = lifeExpectancy;
        console.log("Das Land "+ slots.name + " wurde geändert.");
        Country.saveAll();
};

Country.generateTestData = function (){
    Country.instances["Deutschland"] =
        new Country ({name: "Deutschland",population:80000,lifeExpectancy:90});

    Country.saveAll();

};

