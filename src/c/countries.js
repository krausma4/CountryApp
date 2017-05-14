/**
 * Created by Marc on 09.05.2017.
 */
"use strict";
pl.c.countries.manage = {
  
  initialize: function () {
    
    City.retrieveAll();
    Country.retrieveAll();
    InternationalOrganizations.retrieveAll();
    
    pl.v.countries.manage.setupUserInterface();
    
  }
};