/**
 * Created by Marc on 09.05.2017.
 */
"use strict";
pl.c.countries.manage = {
  
  initialize: function () {
    
    InternationalOrganizations.retrieveAll();
    
    City.retrieveAll();
    
    Country.retrieveAll();
    
    pl.v.countries.manage.setupUserInterface();
    
  }
  
};