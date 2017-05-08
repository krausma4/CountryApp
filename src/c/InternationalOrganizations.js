/**
 * Created by Marc on 08.05.2017.
 */
pl.c.internationalOrganizations.manage = {
  initialize: function () {
    City.retrieveAll();
    InternationalOrganizations.retrieveAll();
    Country.retrieveAll();
    pl.v.internationalOrganizations.manage.setupUserInterface();
  }
};