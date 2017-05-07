/**
 * Created by Marc on 27.04.2017.
 */
"use strict"
;
pl.c.createCountry = {
  initialize: function () {
    pl.c.createCountry.loadData();
    pl.v.createCountry.setupUserInterface();
  },
  /**
   *  Load session data
   */
  loadData: function () {
    Country.retrieveAll();
  }
};