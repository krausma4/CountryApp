/**
 * Created by Marc on 09.05.2017.
 */


pl.c.cities.manage = {
  
  initialize: function () {
    
    City.retrieveAll();
    
    pl.v.cities.manage.setupUserInterface();
    
  }
  
};