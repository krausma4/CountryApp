/**
 * Created by Marc on 07.05.2017.
 */
"use strict";

function InternationalOrganizations(slots) {
  
  this.acronym = "";
  this.name = "";
  this.members = {};
  
  if (arguments.length > 0) {
    this.setName( slots.name );
    this.setAcronym( slots.acronym );
    
    if (slots.members) {
      this.setMember( slots.members );
    }
    
    
  }
  
  
}


InternationalOrganizations.instances = {};


/***************Check Name****************************/
InternationalOrganizations.checkName = function (name) {
  var constraintViolation;
  if (!name) {
    constraintViolation = new MandatoryValueConstraintViolation
    
    ( "a name is required" );
    
  }
  
  else if (typeof(name) !== "string" || name.trim() === "") {
    
    constraintViolation = new RangeConstraintViolation(
        "The name must be a non-empty string!" );
    
  }
  
  else {
    
    constraintViolation = new NoConstraintViolation();
    
  }
  
  return constraintViolation;
  
};


/***************Set Name**************************************/
InternationalOrganizations.prototype.setName = function (name) {
  var validationResult = InternationalOrganizations.checkName( name );
  
  if (validationResult instanceof NoConstraintViolation) {
    this.name = name;
  }
  else {
    throw validationResult;
  }
  
  
};


/***************Check Acronym**************************************/
InternationalOrganizations.checkAcronym = function (acronym) {
  var constraintViolation;
  if (!acronym) {
    
    constraintViolation = new NoConstraintViolation();
    
  }
  
  else if (typeof(acronym) !== "string" || acronym.trim() === "") {
    
    constraintViolation = new RangeConstraintViolation(
        "The name must be a non-empty string!" );
    
  }
  
  else {
    
    constraintViolation = new NoConstraintViolation();
    
  }
  
  return constraintViolation;
  
};
/***************Check Acronym as ID********************************/
InternationalOrganizations.checkAcronymAsId = function (acronym) {
  var constraintViolation = InternationalOrganizations.checkAcronym( acronym );
  
  if (constraintViolation instanceof NoConstraintViolation) {
    
    if (!acronym) {
      
      constraintViolation = new MandatoryValueConstraintViolation
      
      ( "a name is required" );
      
    }
    
    else if (InternationalOrganizations.instances[acronym]) {
      
      constraintViolation = new UniquenessConstraintViolation(
          "There is already an organization record with this acronym!" );
      
    }
    
    else {
      
      constraintViolation = new NoConstraintViolation();
      
    }
    
  }
  
  return constraintViolation;
  
  
};
/***************Check Acronym as ID Ref****************************/
InternationalOrganizations.checkAcronymAsIdRef = function (acronym) {
  
  var constraintViolation = InternationalOrganizations.checkName( acronym );
  
  if ((constraintViolation instanceof NoConstraintViolation)
      && acronym !== undefined) {
    
    if (!InternationalOrganizations.instances[acronym]) {
      
      constraintViolation = new ReferentialIntegrityConstraintViolation
      
      ( "There is no city record with this name!" );
      
    }
    
  }
  
  return constraintViolation;
};
/***************Set Acronym**************************************/
InternationalOrganizations.prototype.setAcronym = function (acronym) {
  var validationResult = InternationalOrganizations.checkAcronymAsId( acronym );
  
  if (validationResult instanceof NoConstraintViolation) {
    this.acronym = acronym;
    
  }
  else {
    throw validationResult;
  }
  
  
};
/***************Check Member**************************************/
InternationalOrganizations.checkMember = function (cityIdRef) {
  var constraintViolation = null;
  if (!cityIdRef) {
    
    constraintViolation = new NoConstraintViolation();
  } else {
    // invoke foreign key constraint check
    constraintViolation =
        City.checkNameAsIdRef( cityIdRef );
  }
  return constraintViolation;
};


/***************Set Member**************************************/
InternationalOrganizations.prototype.setMember = function (members) {
  var keys = [], i = 0;
  this.members = {};
  if (Array.isArray( members )) {  // array of IdRefs
    for (i = 0; i < members.length; i += 1) {
      this.addMember( members[i] );
    }
  } else {  // map of object refs
    keys = Object.keys( members );
    for (i = 0; i < keys.length; i += 1) {
      this.addMember( members[keys[i]] );
    }
  }
  
  
};


/***************Add Member**************************************/
InternationalOrganizations.prototype.addMember = function (member) {
  var constraintViolation = null,
      cityIdRef = 0, cityIdRefStr = "";
  
  if (typeof( member) !== "object") {  // an ID reference or
    cityIdRef = member;
  } else {                       // an object reference
    cityIdRef = member.name;
  }
  constraintViolation = InternationalOrganizations.checkMember( cityIdRef );
  if (cityIdRef &&
      constraintViolation instanceof NoConstraintViolation) {
    // add the new author reference
    cityIdRefStr = cityIdRef;
    this.authors[cityIdRefStr] =
        City.instances[cityIdRefStr];
  } else {
    throw constraintViolation;
  }
  
  
};

/***************Remove Member**************************************/
InternationalOrganizations.prototype.removeMember = function (member) {
  var constraintViolation = null;
  var cityIdRef = "";
  // an author can be given as ID reference or object reference
  if (typeof(member) !== "object") {
    cityIdRef = member;
  }
  else {
    cityIdRef = member.name;
  }
  constraintViolation = InternationalOrganizations.checkMember( cityIdRef );
  if (constraintViolation instanceof NoConstraintViolation) {
    // delete the author reference
    delete this.members[cityIdRef];
  } else {
    throw constraintViolation;
  }
};


InternationalOrganizations.convertRow2Obj = function (OrganizationRow) {
  return new InternationalOrganizations( OrganizationRow );
};


InternationalOrganizations.destroy = function (acronym) {
  if (InternationalOrganizations.instances[acronym]) {
    
    delete InternationalOrganizations.instances[acronym];
    console.log( "InternationalOrganizations " + acronym + " deleted" );
  } else {
    console.log( "There is no InternationalOrganizations with the name " +
        acronym + " in the database!" );
  }
};


InternationalOrganizations.retrieveAll = function () {
  
  var key = "", keys = [], organizationString = "", organizations = {}, i = 0;
  
  try {
    if (localStorage.getItem( "internationalOrganizationz" )) {
      
      organizationString = localStorage.getItem( "internationalOrganizationz" );
    }
  }
  catch (e) {
    alert( "Error when reading from Local Storage\n" + e );
  }
  
  if (organizationString) {
    
    organizations = JSON.parse( organizationString );
    keys = Object.keys( organizations );
    console.log( keys.length + " organizations are loaded" );
    
    for (i = 0; i < keys.length; i += 1) {
      key = keys[i];
      InternationalOrganizations.instances[key] =
          InternationalOrganizations.convertRow2Obj( organizations[key] );
    }
    
    
  }
  
  
};


InternationalOrganizations.saveAll = function () {
  var organizationString = "", error = false;
  var countOfOrganizations =
      Object.keys( InternationalOrganizations.instances ).length;
  try {
    organizationString = JSON.stringify( InternationalOrganizations.instances );
    localStorage.setItem( "countrys", organizationString );
    
    
  } catch (e) {
    alert( "Error" );
    error = true;
    
  }
  
  if (!error) {
    console.log( countOfOrganizations + " organizations saved" );
  }
  
  
};


InternationalOrganizations.add = function (slots) {
  var organization = null;
  try {
    organization = new InternationalOrganizations( slots );
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message );
    organization = null;
  }
  
  var validationResult = Country.checkName( slots.name );
  if (validationResult instanceof NoConstraintViolation) {
    // add book to the Book.instances collection
    InternationalOrganizations.instances[slots.name] = organization;
    console.log( "Organization " + slots.name + " created!" );
  }
  
  
};


