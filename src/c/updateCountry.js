/**
 * Created by Marc on 27.04.2017.
 */
"use strict";
pl.c.updateCountry = {
  initialize: function () {
    pl.c.updateCountry.loadData();
    pl.v.updateCountry.setupUserInterface();
  },
  /**
   *  Load session data
   */
  loadData: function () {
    Country.retrieveAll();
  }
};