/**
 * Created by Marc on 27.04.2017.
 */
"use strict";
pl.c.deleteCountry = {
  initialize: function () {
    pl.c.deleteCountry.loadData();
    pl.v.deleteCountry.setupUserInterface();
  },
  /**
   * Load session data
   */
  loadData: function () {
    Country.retrieveAll();
  }
};