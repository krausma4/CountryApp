/**
 
 * Created by Marc on 13.04.2017.
 
 */

"use strict";



function Country(slots){
  
  this.name = "";
  this.capital = null;
  this.cities = {};
  
  if(arguments.length>0) {
    
    this.setName (slots.name);
    this.setCapital(slots.capital);
    this.setCities(slots.cities);
    
  }
  
  
  
}



Country.instances = {};



Country.checkName = function (t) {
  
  var constraintViolation;
  
  if(!t){
    constraintViolation = new NoConstraintViolation("alles gut");
  }else if(!util.isNonEmptyString(t)){
    
    constraintViolation = new RangeConstraintViolation("name must be a non-empty string");
    
  }else{
    constraintViolation = new NoConstraintViolation("alles gut");
  }
  
  
  return constraintViolation;
  
  
  
};

Country.checkNameAsId = function(name){

  var constraintViolation = Country.checkName(name);
  
  if((constraintViolation instanceof  NoConstraintViolation)){
    if(!name){
      constraintViolation = new MandatoryValueConstraintViolation("a name must be provided");
      
    }else if(Country.instances[name]){
      constraintViolation = new UniquenessConstraintViolation("there is already a country record with this name");
    }else{
      constraintViolation = new NoConstraintViolation("alles gut");
    }
  }
  
  return constraintViolation;



};


Country.checkNameAsIdRef = function (name) {

  var constrainViolation = Country.checkName(name);
  
  if((constrainViolation instanceof NoConstraintViolation) &&
      name !== undefined){
    
    if(!Country.instances[name]){
      constrainViolation = new ReferentialIntegrityConstraintViolation(" there is no Country with this name");
    }
    
    
  }

  return constrainViolation;
};

Country.prototype.setName = function (t) {
  
  var validationResult = Country.checkNameAsId( t);
  
  //noinspection JSLint
  
  if (validationResult instanceof NoConstraintViolation) {
    
    this.name = t;
    
  } else {
    
    throw validationResult;
    
  }
  
};
Country.checkCapital = function (capital) {
  
  var constraintviolation;
  console.log("Capital: "+ capital);
  if(!capital){
    constraintviolation = new MandatoryValueConstraintViolation("a country must have a capital");
  }else {
    constraintviolation = City.checkNameAsIdRef(capital);
  }
  
  return constraintviolation;
  
};

Country.prototype.setCapital = function (capital) {

  var validationResult = Country.checkCapital(capital);
  
  if(validationResult instanceof  NoConstraintViolation){
    this.capital = capital;
  }else{
    throw validationResult;
  }



};



Country.checkCity = function (city) {
  
    var constraintViolation = null;
    if (!city) {
      
      constraintViolation = new NoConstraintViolation("alles gut");
    } else {
      // invoke foreign key constraint check
      constraintViolation =
          City.checkNameAsIdRef( city );
    }
    return constraintViolation;
};


Country.prototype.addCity =function (city) {
  
  var constraintViolation = null,
      cityIdRef = 0, cityIdRefStr = "";
  
  if (typeof( city) !== "object") {  // an ID reference or
    cityIdRef = city;
  } else {                       // an object reference
    cityIdRef = city.name;
  }
  constraintViolation = Country.checkCity( cityIdRef );
  if (cityIdRef &&
      constraintViolation instanceof NoConstraintViolation) {
    // add the new author reference
    cityIdRefStr = cityIdRef;
    this.cities[cityIdRefStr] =
        City.instances[cityIdRefStr];
  } else {
    throw constraintViolation;
  }
  
  
};

Country.prototype.removeCity = function (city) {
  
  var constraintViolation = null;
  var cityIdRef = "";
  // an author can be given as ID reference or object reference
  if (typeof(city) !== "object") {
    cityIdRef = city;
  }
  else {
    cityIdRef = city.name;
  }
  constraintViolation = Country.checkCity( cityIdRef );
  if (constraintViolation instanceof NoConstraintViolation) {
    // delete the author reference
    delete this.cities[cityIdRef];
  } else {
    throw constraintViolation;
  }

};

Country.prototype.setCities = function (city) {
  var keys = [], i = 0;
  this.cities = {};
  if (Array.isArray( city )) {  // array of IdRefs
    for (i = 0; i < city.length; i += 1) {
      this.addCity( city[i] );
    }
  } else {  // map of object refs
    keys = Object.keys( city );
    for (i = 0; i < keys.length; i += 1) {
      this.addCity( city[keys[i]] );
    }
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
    
    console.log("There is no country with the name " +
        
        name + " in the database!");
    
  }
  
};



Country.retrieveAll = function(){
  
  
  
  var key ="", keys= [], countryString="",countries ={}, i=0;
  
  
  
  try {
    
    if (localStorage.getItem("countries")) {
      
      countryString = localStorage.getItem("countries");
      
    }
    
  }
  
  catch(e){
    
    alert("Error when reading from Local Storage\n" + e);
    
  }
  
  
  
  if(countryString){
    
    
    
    countries = JSON.parse(countryString);
    
    keys = Object.keys(countries);
    
    console.log(keys.length + " countries are loaded");
    
    
    
    for(i=0;i<keys.length;i+= 1){
      
      key = keys[i];
      
      Country.instances[key] = Country.convertRow2Obj(countries[key]);
      
    }
    
  }
  
};



//delete all Countrys from localstorage

Country.clearData= function (){
  
  
  
  if (window.confirm("Do you really want to delete all country data?")) {
    
    Country.instances = {};
    
    localStorage.setItem("countries", "{}");
    
  }
  
};



Country.saveAll = function(){
  
  var countryString = "", error=false;
  
  var countOfCountries = Object.keys(Country.instances).length;
  
  try {
    
    countryString = JSON.stringify(Country.instances);
    
    localStorage.setItem("countries",countryString);
    
    
    
  } catch(e) {
    
    alert("Error");
    
    error =true;
    
  }
  
  
  
  if(!error){
    
    console.log(countOfCountries+ " countries saved");
    
  }
  
};



//  Create a new country row

Country.add = function (slots) {
  
  var country = null;
  
  try {
    
    country = new Country(slots);
    
  }catch(e){
    
    console.log(e.constructor.name+ ": "+ e.message);
    
    country= null;
    
  }
  
  
  
  var validationResult = Country.checkName(slots.name);
  
  if(validationResult instanceof NoConstraintViolation){
    
    // add book to the Book.instances collection
    
    Country.instances[slots.name] = new Country(slots);
    
    console.log("Country " + slots.name + " created!");
    
  }
  
};



Country.update = function(slots){
  
  
  
  var country = Country.instances[slots.name],
      
      noConstraintViolated =true,
      
      updatedProperties= [],
      
      objectBeforeUpdate = util.cloneObject(country);
  
  
  
  try{
    
    if(country.name && country.name !== slots.name){
      
      country.setName(slots.name);
      
      updatedProperties.push("name");
      
    }
  
    if(country.capital && country.capital !== slots.capital){
    
      country.setCapital(slots.capital);
    
      updatedProperties.push("capital");
    
    }
  
  
  
    if ("citiesIdRefToAdd" in slots) {
      updatedProperties.push("cities(added)");
      var i;
      for (i=0; i < slots.citiesIdRefToAdd.length; i++) {
        country.addCity( slots.citiesIdRefToAdd[i]);
      }
    }
    if ("citiesIdRefToRemove" in slots) {
      updatedProperties.push("cities(removed)");
      var i;
      for (i=0; i < slots.citiesIdRefToRemove.length; i++) {
        country.removeCity( slots.citiesIdRefToRemove[i]);
      }
    
    }
    
    
    console.log("Country " + slots.name + " modified!");
    
  } catch(e){
    
    console.log( e.constructor.name +": "+ e.message);
    
    noConstraintViolated = false;
    
    // restore object to its state before updating
    
    Country.instances[slots.name] = objectBeforeUpdate;
    
  }
  
  
  
  if (noConstraintViolated) {
    
    if (updatedProperties.length > 0) {
      
      console.log("Properties " + updatedProperties.toString() +
          
          " modified for country " + slots.name);
      
    } else {
      
      console.log("No property value changed for country " + slots.name + " !");
      
    }
    
  }
  
};


Country.generateTestData = function () {

try{
  
  Country.instances["Deutschland"] = new Country({
    name: "Deutschland",
    capital: "Berlin",
    cities: {name: "Berlin"}
  });
 Country.instances["Polen"] = new Country({
    name: "Polen",
   capital: "Warschau",
   cities: {name: "Berlin"}
  });
  Country.instances["Russland"] = new Country({
    name: "Russland",
    capital: "Moskau",
    cities: {name: "Berlin"}
  });
  
 Country.saveAll();
 
}catch (e){
  console.log("ERROR");
  console.log(e.constructor.name + ": "+e.message);
}


};

