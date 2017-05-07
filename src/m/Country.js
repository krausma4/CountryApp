/**
    * Created by Marc on 13.04.2017.
    */
"use strict";


//noinspection JSLint
var  CountryCodeEL = new Enumeration
({"EN":"English","DE":"German","FR":"French","ES":"Spanish"});
//noinspection JSLint
var ReligionsEL = new Enumeration
    (["Catholic","Protestant","Orthodox","Hindu","Muslim","Jewish"]);



function Country(slots){
  this.name = "";
  this.code = 0;
  this.population = 0;
  this.lifeExpectancy = 0;
  this.militaryExpenditure = 0;
  this.religions = [];
  if(arguments.length>0) {
    this.setName (slots.name);
    this.setPopulation (slots.population);
    this.setLifeExpectancy  (slots.lifeExpectancy);
    this.setCode( slots.code);
    if(slots.militaryExpenditure ){
      this.setMilitaryExpenditure(slots.militaryExpenditure);//optional
  
    }
    if (!(slots.religions === null))
    {
      console.log(" religionen sind vorhanden");
      this.setReligions( slots.religions);
    }
    
  }

}




Country.instances = {};

Country.checkName = function (t) {
  var constraintViolation;
  
  if (t !== undefined) {
    //noinspection JSLint
    if (util.isNonEmptyString( t )) {
      if (!Country.instances[t]) {
        if(t.length<3 || t.length>50){
          //noinspection JSLint
          constraintViolation =
              new CardinalityConstraintViolation
              ("the must have at least 3 and at most 50 characters");
          return constraintViolation;
        }else{
          //noinspection JSLint
          constraintViolation = new NoConstraintViolation("alles gut");
          return constraintViolation;
        }
        
      } else{
        //noinspection JSLint
        constraintViolation = new UniquenessConstraintViolation(
            "There is already a country with this name!" );
        return constraintViolation;
      }
    } else {
      //noinspection JSLint
      constraintViolation= new RangeConstraintViolation( "The name must be a non-empty string!" );
      return constraintViolation;
    }
  } else {
    //noinspection JSLint
    return new MandatoryValueConstraintViolation( "A name must be provided!" );
  }

};
Country.prototype.setName = function (t) {
  var validationResult = Country.checkName( t);
  //noinspection JSLint
  if (validationResult instanceof NoConstraintViolation) {
    this.name = t;
  } else {
    throw validationResult;
  }
};

function testUniqeness(t){
  
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
    
    for(i=0;i<keys.length;i+= 1){
      key = keys[i];
      
      console.log(countrys[key].code );
      if(countrys[key].code === t){
        //noinspection JSLint
        
       
        return false;
      }
    }
    
    
  }
  return true;
}

Country.checkCode = function (t) {
  var constraintViolation;
  console.log("Code ist: "+t);
  
  
  
  //if(testUniqeness(t)){
  
  
  
  
    if (t !== undefined) {
      //noinspection JSLint
    
      if( isNaN(t) ){
        //noinspection JSLint
      
        constraintViolation = new MandatoryValueConstraintViolation( "A code must be provided!" );
        return constraintViolation;
      }
      console.log("Komme trotzdem bis hier hin");
      if (Number.isInteger( t) || t < CountryCodeEL.MAX || t >= 1) {
      
      
      
      
        //noinspection JSLint
        constraintViolation = new NoConstraintViolation("alles gut");
        return constraintViolation;
      }else{
        //noinspection JSLint
        constraintViolation = new MandatoryValueConstraintViolation(
            "You must have a country code!" );
        return constraintViolation;
      }
    
    } else{
      //noinspection JSLint
      constraintViolation = new RangeConstraintViolation(
          "invalid code" );
      return constraintViolation;
    
    }
  
  
  
    
  };

Country.prototype.setCode = function (t) {
  var validationResult = Country.checkCode( t);
  //noinspection JSLint
  if (validationResult instanceof NoConstraintViolation) {
    this.code = t;
    
  }
  else if(validationResult instanceof UniquenessConstraintViolation) {
    throw validationResult;
  }
  
};



Country.checkPopulation = function(t){
  var constraintViolation;
  if(t === ""){
    t = undefined;
  }
  
  if (t !== undefined) {
    
    if(typeof t === "string") {
  
      t = parseInt( t );
    } //noinspection JSLint
    if(util.isIntegerOrIntegerString(t)){
      
      if (  t<=0 ){
        //noinspection JSLint
        constraintViolation = new RangeConstraintViolation
        ("population must be a positiv integer");
        return constraintViolation;
      } else {
        //noinspection JSLint
        constraintViolation = new NoConstraintViolation("alles gut");
        return constraintViolation;
      }
    }else{
  
      //noinspection JSLint
      constraintViolation = new RangeConstraintViolation
      ("population must be a number");
      return constraintViolation;
    }
  }
    else{
    //noinspection JSLint
    return new MandatoryValueConstraintViolation
    ( "The population attribute must be provided!" );
  }
  
  
};

Country.prototype.setPopulation = function(t){
  //noinspection JSLint
  var validationResult = Country.checkPopulation(t);
  //noinspection JSLint
  if(validationResult instanceof NoConstraintViolation){
    this.population = parseInt(t);
  }else{
    throw validationResult;
  }


};


Country.checkLifeExpectancy = function(t){
  var constraintViolation;
  if (t === undefined)
  {   //noinspection JSLint
    constraintViolation =new MandatoryValueConstraintViolation(
        "A Life Expectancy must be provided");
    return constraintViolation;
  }
   if (!(typeof(parseFloat(t)) === "number") || (isNaN(parseFloat(t))))
  {   //noinspection JSLint
    constraintViolation =new RangeConstraintViolation(
        "lifeexpectancy muss eine zahl sein");
    return constraintViolation;
  }
  
     if (t <= 0 || t >= 100) {
       //noinspection JSLint
       constraintViolation = new IntervalConstraintViolation(
         "lifeexpectancy muss zwischen 0 und 100 sein!" );
       
       return constraintViolation;
   }
  
  //noinspection JSLint
  constraintViolation =  new NoConstraintViolation("alles gut");
  return constraintViolation;
  
  
};

Country.prototype.setLifeExpectancy = function(t){
  //noinspection JSLint
  var validationResult = Country.checkLifeExpectancy(t);
  //noinspection JSLint
  if(validationResult instanceof NoConstraintViolation){
    this.lifeExpectancy = parseFloat(t);
  }else{
    throw validationResult;
  }
  
  
};

Country.checkReligion = function (r) {
  var constraintViolation;
  if (r !== undefined || r !== "") {
  
    if (Number.isInteger( r ) || r >= 1 || r < ReligionsEL.MAX)
    {
    
      //noinspection JSLint
       constraintViolation = new NoConstraintViolation();
      return constraintViolation;
    
    } else
      {
      //noinspection JSLint
      constraintViolation = new RangeConstraintViolation(
          "Invalid value for religions: " + r );
        return constraintViolation;
  
      }
  
  }
  //noinspection JSLint
  constraintViolation = new NoConstraintViolation();
  return constraintViolation;

  
};

Country.checkReligions = function (religions)
{
  
  var i=0,constraintViolation ;
  if (!Array.isArray( religions) && !(religions === undefined))
  {
    //noinspection JSLint
    return new RangeConstraintViolation(
        "must be an array");
  }
  else
  {
    if (religions !== undefined)
    {
      for (i=0; i< religions.length; i+=1)
      {
        constraintViolation = Country.checkReligion( religions[i]);
        //noinspection JSLint
        if (!(constraintViolation instanceof NoConstraintViolation))
        {
          return constraintViolation;
        }
      }
    }
    //noinspection JSLint
    constraintViolation = new NoConstraintViolation();
    return constraintViolation;
  }
};


Country.prototype.setReligions = function(t)
{
  
  var validationResult = Country.checkReligions(t);
  //noinspection JSLint
  if (validationResult instanceof NoConstraintViolation)
  {
    
      this.religions = t;
    
  }
  else
  {
    throw validationResult;
  }
};



Country.checkMilitaryExpenditure = function(t){
  var constraintViolation;
  if(t !== undefined || t !== "") {
  
    if (isNaN( parseFloat( t ) )) {
      //noinspection JSLint
      constraintViolation = new RangeConstraintViolation
      ( "militaryExpenditure attribute must be a number" );
    } else {
    
      var temp = parseFloat( t );
    
      if (temp > 0 && temp < 100) {
        //noinspection JSLint
        constraintViolation = new NoConstraintViolation( "alles gut" );
      
      } else {
        //noinspection JSLint
        constraintViolation = new IntervalConstraintViolation
        ( "military expenditure must be between 0 and 100" );
      
      }
    
    
    }
  
  }else{
    
    
    //noinspection JSLint
    constraintViolation = new NoConstraintViolation( "alles gut" );
    
  }
  
  return constraintViolation;
  
  
};

Country.prototype.setMilitaryExpenditure = function(t){
  
  //noinspection JSLint
  var validationResult = Country.checkMilitaryExpenditure(t);
  //noinspection JSLint
  if(validationResult instanceof NoConstraintViolation){
  
  
    if (t === undefined || t === "")
    {
      delete this.militaryExpenditure;
    }
    else
    {
      this.militaryExpenditure = parseFloat(t);
    }
    
    
  }else{
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
        console.log("There is no country with the name " +
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

            for(i=0;i<keys.length;i+= 1){
                key = keys[i];
                Country.instances[key] = Country.convertRow2Obj(countrys[key]);
            }


    }


};


//delete all Countrys from localstorage
Country.clearData= function (){

    if (window.confirm("Do you really want to delete all country data?")) {
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
    if(country.code !== slots.code){
      
      country.setCode(slots.code);
      updatedProperties.push("code");
    }
    
    if(country.population !== parseInt(slots.name)) {
      country.setPopulation( slots.population );
      updatedProperties.push( "population" );
    }
    if(country.lifeExpectancy !== (slots.lifeExpectancy)) {
      country.setLifeExpectancy( slots.lifeExpectancy );
      updatedProperties.push( "lifeExpectancy" );
    }
    if(country.militaryExpenditure !== (parseFloat(slots.militaryExpenditure)))
    {
      country.setMilitaryExpenditure( slots.militaryExpenditure );
      updatedProperties.push( "militaryExpenditure" );
    } else if (!(slots.militaryExpenditure) &&
        (country.militaryExpenditure !== undefined))
    {
      
      delete country.militaryExpenditure;
      updatedProperties.push("militaryExpenditure");
    }
    if (slots.religions && !slots.religions.isEqualTo( country.religions))
    {
      // slots.religions has a non-empty value that is new
      country.setReligions(slots.religions);
      updatedProperties.push("religions");
    }
  
    console.log("Country " + slots.name + " modified!");
  }catch(e){
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
Country.generateTestData = function ()
{
  "use strict";
  try
  {
    console.log("Country.createTestData executed");
    Country.instances["Germany"] = new Country(
        {
          name: "Germany",
          code: CountryCodeEL.DE,
          population: 80854408,
          lifeExpectancy: 80.57,
          militaryExpenditure: 3,
          religions: [ReligionsEL.PROTESTANT, ReligionsEL.CATHOLIC,
            ReligionsEL.MUSLIM, ReligionsEL.JEWISH]
        });
  
    Country.saveAll();
  }
  catch (e)
  {
    console.log(e.constructor.name + ": " + e.message);
  }
};

