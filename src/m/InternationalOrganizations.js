/**
 * Created by Marc on 07.05.2017.
 */
"use strict";

function InternationalOrganizations(slots){
  
  this.acronym = "";
  this.name = "";
  this.members = "";
  
  if(arguments.length>0) {
    this.setName(slots.name);
    this.setAcronym(slots.acronym);
    
    if(slots.members){
      this.setMember(slots.members);
    }
    
    
  }
  

  
}


InternationalOrganizations.instances = {};



/***************Check Name****************************/
InternationalOrganizations.checkName = function(name){

};

/***************Set Name**************************************/
InternationalOrganizations.prototype.setName = function (name) {


};


/***************Check Acronym**************************************/
InternationalOrganizations.checkAcronym = function(acronym){


};
/***************Check Acronym as ID********************************/
InternationalOrganizations.checkAcronymAsId = function(acronym){



};
/***************Check Acronym as ID Ref****************************/
InternationalOrganizations.checkAcronymAsIdRef = function(acronym){


};
/***************Set Acronym**************************************/
InternationalOrganizations.prototype.setAcronym = function (acronym) {



};
/***************Check Member**************************************/
InternationalOrganizations.checkMember = function(name){


};

/***************Set Member**************************************/
InternationalOrganizations.prototype.setMember = function (name) {



};



/***************Add Member**************************************/
InternationalOrganizations.prototype.addMember = function(member){



};

/***************Remove Member**************************************/
InternationalOrganizations.prototype.removeMember= function (member){

};






InternationalOrganizations.convertRow2Obj = function (OrganizationRow){
  return new InternationalOrganizations(OrganizationRow);
};


InternationalOrganizations.destroy = function (acronym) {
  if (InternationalOrganizations.instances[acronym]) {
    
    delete InternationalOrganizations.instances[acronym];
    console.log("InternationalOrganizations " + acronym + " deleted");
  } else {
    console.log("There is no InternationalOrganizations with the name " +
        acronym + " in the database!");
  }
};



InternationalOrganizations.retrieveAll = function(){
  
  var key ="", keys= [], organizationString ="",organizations ={}, i=0;
  
  try {
    if (localStorage.getItem("internationalOrganizationz")) {
  
      organizationString = localStorage.getItem("internationalOrganizationz");
    }
  }
  catch(e){
    alert("Error when reading from Local Storage\n" + e);
  }
  
  if(organizationString){
  
    organizations = JSON.parse(organizationString);
    keys = Object.keys(organizations);
    console.log(keys.length + " organizations are loaded");
    
    for(i=0;i<keys.length;i+= 1){
      key = keys[i];
      InternationalOrganizations.instances[key] =
          InternationalOrganizations.convertRow2Obj(organizations[key]);
    }
    
    
  }
  
  
};




InternationalOrganizations.saveAll = function(){
  var organizationString = "", error=false;
  var countOfOrganizations =
      Object.keys(InternationalOrganizations.instances).length;
  try {
    organizationString = JSON.stringify(InternationalOrganizations.instances);
    localStorage.setItem("countrys",organizationString);
    
    
  }catch(e){
    alert("Error");
    error =true;
    
  }
  
  if(!error){
    console.log(countOfOrganizations+ " organizations saved");
  }
  
  
  
};


InternationalOrganizations.add = function (slots) {
  var organization = null;
  try {
    organization = new InternationalOrganizations(slots);
  }catch(e){
    console.log(e.constructor.name+ ": "+ e.message);
    organization= null;
  }
  
  var validationResult = Country.checkName(slots.name);
  if(validationResult instanceof NoConstraintViolation){
    // add book to the Book.instances collection
    InternationalOrganizations.instances[slots.name] = organization;
    console.log("Organization " + slots.name + " created!");
  }
  
  
  
};


