/**
 * Created by Marc on 09.05.2017.
 */
"use strict";

pl.c.cities.manage = {
  
  initialize: function () {
    
    City.retrieveAll();
    
    pl.v.cities.manage.setupUserInterface();
    
  }
  
};