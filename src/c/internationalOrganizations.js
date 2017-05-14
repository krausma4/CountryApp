/**
 * Created by Marc on 08.05.2017.
 */
"use strict";

pl.c.internationalOrganizations.manage = {
  initialize: function () {
    City.retrieveAll();
    Country.retrieveAll();
    InternationalOrganizations.retrieveAll();
    pl.v.internationalOrganizations.manage.setupUserInterface();
  }
};