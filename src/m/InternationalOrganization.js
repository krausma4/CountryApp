/**
 * Created by Marc on 07.05.2017.
 */
"use strict";

function InternationalOrganizations(slots) {
  
  this.acronym = "";
  this.name = "";
  this.members = {};
  
  if (arguments.length > 0) {
    this.setName(slots.name);
    this.setAcronym(slots.acronym);
    
    if (slots.members ||slots.membersIdRef) {
      this.setMember(slots.members || slots.membersIdRef);
    }
  }
}

InternationalOrganizations.instances = {};

/**
 * Check Name
 **/

InternationalOrganizations.checkName = function (name) {
  var constraintViolation;
  if (!name) {
    constraintViolation = new MandatoryValueConstraintViolation
    ("a name is required");
  }
  else if (typeof(name) !== "string" || name.trim() === "") {
    constraintViolation = new RangeConstraintViolation(
        "The name must be a non-empty string!");
  }
  else {
    constraintViolation = new NoConstraintViolation("Success");
  }
  return constraintViolation;
};

/**
 * Set Name
 **/

InternationalOrganizations.prototype.setName = function (name) {
  var validationResult = InternationalOrganizations.checkName(name);
  
  if (validationResult instanceof NoConstraintViolation) {
    this.name = name;
  }
  else {
    throw validationResult;
  }
};

/**
 * Check Acronym
 **/

InternationalOrganizations.checkAcronym = function (acronym) {
  var constraintViolation;
  if (!acronym) {
    constraintViolation = new NoConstraintViolation();
  }
  
  else if (typeof(acronym) !== "string" || acronym.trim() === "") {
    constraintViolation = new RangeConstraintViolation(
        "The name must be a non-empty string!");
  }
  
  else {
    constraintViolation = new NoConstraintViolation();
  }
  return constraintViolation;
};

/**
 * Check Acronym as ID
 **/

InternationalOrganizations.checkAcronymAsId = function (acronym) {
  var constraintViolation = InternationalOrganizations.checkAcronym(acronym);
  if (constraintViolation instanceof NoConstraintViolation) {
    console.log("acronym ist: "+ acronym);
    if (!acronym ) {
      constraintViolation = new MandatoryValueConstraintViolation
      ("a name is required");
    }
    else if (InternationalOrganizations.instances[acronym]) {
      constraintViolation = new UniquenessConstraintViolation(
          "There is already an organization record with this acronym!");
    }
    
    else {
      constraintViolation = new NoConstraintViolation("gut");
    }
  }
  return constraintViolation;
};

/**
 * Check Acronym as ID Ref
 **/

InternationalOrganizations.checkAcronymAsIdRef = function (acronym) {
  
  var constraintViolation = InternationalOrganizations.checkName(acronym);
  if ((constraintViolation instanceof NoConstraintViolation)
      && acronym !== undefined) {
    if (!InternationalOrganizations.instances[acronym]) {
      constraintViolation = new ReferentialIntegrityConstraintViolation
      ("There is no city record with this name!");
    }
  }
  
  return constraintViolation;
};

/**
 * Set Acronym
 **/

InternationalOrganizations.prototype.setAcronym = function (acronym) {
  var validationResult = InternationalOrganizations.checkAcronymAsId(acronym);
  if (validationResult instanceof NoConstraintViolation) {
    this.acronym = acronym;
  }
  else {
    throw validationResult;
  }
};

/**
 * Check Member
 **/
InternationalOrganizations.checkMember = function (countryIdRef) {
  var constraintViolation = null;
  if (!countryIdRef) {
    constraintViolation = new NoConstraintViolation("Success");
  } else {
    // invoke foreign key constraint check
    constraintViolation =
        Country.checkNameAsIdRef(countryIdRef);
  }
  return constraintViolation;
};

/**
 * Set Member
 **/
InternationalOrganizations.prototype.setMember = function (members) {
  var keys=[], i=0;
  this.members = {};
  if (Array.isArray(members)) {  // array of IdRefs
    for (i = 0; i < members.length; i += 1) {
      this.addMember(members[i]);
    }
  } else {  // map of object refs
    keys = Object.keys(members);
    for (i = 0; i < keys.length; i += 1) {
      this.addMember(members[keys[i]]);
    }
  }
};

/**
 * Add Member
 **/

InternationalOrganizations.prototype.addMember = function (member) {
  var constraintViolation = null,
      countryIdRef = 0, countryIdRefStr = "";
  if (typeof(member) !== "object") {  // an ID reference or
    countryIdRef = member;
  } else {                       // an object reference
    countryIdRef = member.name;
  }
  constraintViolation = InternationalOrganizations.checkMember(countryIdRef);
  if (countryIdRef &&
      constraintViolation instanceof NoConstraintViolation) {
    // add the new author reference
    countryIdRefStr = countryIdRef;
    this.members[countryIdRefStr] =
        Country.instances[countryIdRefStr];
  } else {
    throw constraintViolation;
  }
};

/**
 * Remove Member
 **/

InternationalOrganizations.prototype.removeMember = function (member) {
  var constraintViolation = null;
  var countryIdRef = "";
  // an author can be given as ID reference or object reference
  if (typeof(member) !== "object") {
    countryIdRef = member;
  }
  else {
    countryIdRef = member.name;
  }
  constraintViolation = InternationalOrganizations.checkMember(countryIdRef);
  if (constraintViolation instanceof NoConstraintViolation) {
    // delete the author reference
    delete this.members[countryIdRef];
  } else {
    throw constraintViolation;
  }
};

InternationalOrganizations.convertRow2Obj = function (OrganizationRow) {
  return new InternationalOrganizations(OrganizationRow);
};

InternationalOrganizations.destroy = function (acronym) {
  console.log(" lösche jetzt organisation mit acronym: "+ acronym);
  if (InternationalOrganizations.instances[acronym]) {
    
    delete InternationalOrganizations.instances[acronym];
    console.log("InternationalOrganizations " + acronym + " deleted");
  } else {
    console.log("There is no InternationalOrganizations with the name " +
        acronym + " in the database!");
  }
};

InternationalOrganizations.retrieveAll = function () {
  var key = "", keys = [], organizationString = "", organizations = {}, i = 0;
  try {
    if (localStorage.getItem("internationalOrganizations")) {
      organizationString = localStorage.getItem("internationalOrganizations");
    }
  }
  catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (organizationString) {
    organizations = JSON.parse(organizationString);
    keys = Object.keys(organizations);
    console.log(keys.length + " organizations are loaded");
    
    for (i=0; i<keys.length; i+=1) {
      key = keys[i];
      InternationalOrganizations.instances[key] =
          InternationalOrganizations.convertRow2Obj(organizations[key]);
    }
  }
};


InternationalOrganizations.saveAll = function () {
  var organizationString = "", error = false;
  var countOfOrganizations =
      Object.keys(InternationalOrganizations.instances).length;
  try {
    organizationString = JSON.stringify(InternationalOrganizations.instances);
    localStorage.setItem("internationalOrganizations", organizationString);
  } catch (e) {
    alert("Error when saving to local storage!");
    error = true;
  }
  if (!error) {
    console.log(countOfOrganizations + " organizations saved");
  }
};


InternationalOrganizations.add = function (slots) {
  var organization = null;
  try {
    organization = new InternationalOrganizations(slots);
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
    organization = null;
  }
  var validationResult = InternationalOrganizations.checkName(slots.name);
  if (validationResult instanceof NoConstraintViolation) {
    // add book to the Book.instances collection
    InternationalOrganizations.instances[slots.acronym] = organization;
    console.log("Organization " + slots.name + " created!");
  }
};

InternationalOrganizations.update = function (slots){
  var organization = InternationalOrganizations.instances[slots.acronym],
      noConstraintViolated =true,
      updatedProperties= [],
      objectBeforeUpdate = util.cloneObject(organization);
  
  try{
    if(organization.name && organization.name !== slots.name){
      organization.setName(slots.name);
      updatedProperties.push("name");
    }
    if(organization.acronym !== slots.acronym){
    
      organization.setAcronym(slots.acronym);
      updatedProperties.push("acronym");
    }
    if(slots.members && (organization.members !== slots.members)){
    
      organization.setMember(slots.members);
      updatedProperties.push("members");
    }
    if ("membersIdRefToAdd" in slots) {
      updatedProperties.push("members(added)");
      var i;
      for (i=0; i < slots.membersIdRefToAdd.length; i+=1) {
        organization.addMember(slots.membersIdRefToAdd[i]);
      }
    }
    if ("membersIdRefToRemove" in slots) {
      updatedProperties.push("members(removed)");
      var i;
      for (i=0; i < slots.membersIdRefToRemove.length; i+=1) {
        organization.removeMember(slots.membersIdRefToRemove[i]);
      }
    }
    console.log("Organization " + slots.acronym + " modified!");
  }catch(e){
    console.log(e.constructor.name +": "+ e.message);
    noConstraintViolated = false;
    // restore object to its state before updating
    InternationalOrganizations.instances[slots.acronym] = objectBeforeUpdate;
  }
  
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      console.log("Properties " + updatedProperties.toString() +
          " modified for organization " + slots.acronym);
    } else {
      console.log(
          "No property value changed for organization " + slots.acronym + " !");
    }
  }
};