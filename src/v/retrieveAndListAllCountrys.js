/**
 * Created by Marc on 13.04.2017.
 */

"use strict";
pl.v.retrieveAndListAllCountrys = {
        setupUserInterface : function(){
            var tableBodyEl = document.getElementById("countrys");
            var keys = [],key="", row={ }, i =0;
            var country;
            keys = Object.keys(Country.instances);
  
         
            for(i=0;i<keys.length;i+=1){
                
                key= keys[i];
                row = tableBodyEl.insertRow(-1);
            
              key = keys[i];
              country = Country.instances[key];
              row = tableBodyEl.insertRow(-1);
              row.insertCell(-1).textContent = country.name;
              row.insertCell(-1).textContent =
                  CountryCodeEL.convertEnumIndexes2Names(
                  [Country.instances[key].code]);
              row.insertCell(-1).textContent = country.population;
              row.insertCell(-1).textContent = country.lifeExpectancy;
              row.insertCell(-1).textContent =
                  country.militaryExpenditure || "";
              if (!(Country.instances[key].religions === undefined))
              {
                row.insertCell(-1).textContent =
                    ReligionsEL.convertEnumIndexes2Names(
                    Country.instances[key].religions);
              }
               
            }


        }


};