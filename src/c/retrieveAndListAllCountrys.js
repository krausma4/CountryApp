/**
 * Created by Marc on 27.04.2017.
 */
"use strict";
pl.c.retrieveAndListAllCountrys = {
  initialize: function () {
    pl.c.retrieveAndListAllCountrys.loadData();
    pl.v.retrieveAndListAllCountrys.setupUserInterface();
  },
  /**
   * Load session data
   */
  loadData: function () {
    Country.retrieveAll();
  }
};