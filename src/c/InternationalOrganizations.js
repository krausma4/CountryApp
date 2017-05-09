/**
 * Created by Marc on 08.05.2017.
 */

pl.c.internationalOrganizations.manage = {
  initialize: function () {
    InternationalOrganizations.retrieveAll();
    City.retrieveAll();
    
    Country.retrieveAll();
    pl.v.internationalOrganizations.manage.setupUserInterface();
  }
};