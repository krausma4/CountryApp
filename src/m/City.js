function City(slots) {
    // assign default values
    this.name = ""; // string
    // assign properties only if the constructor is invoked with an argument
    if (arguments.length > 0) {
        this.setName(slots.name);
    }
}

City.instances = {};

City.checkName = function(id) {
    // CONSTRAINTS
    // name must be a non-empty string
    if (!id) {
        return new NoConstraintViolation();
    }
    else if (typeof(id) !== "string" || id.trim() === "") {
        return new RangeConstraintViolation(
            "The name must be a non-empty string!");
    }
    else {
        return new NoConstraintViolation();
    }
};
City.checkNameAsId = function(id) {
    // CONSTRAINTS
    // name is mandatory
    // name is unique
    var constraintViolation = City.checkName(id);
    if ((constraintViolation instanceof NoConstraintViolation)) {
        if (!id) {
            constraintViolation = new MandatoryValueConstraintViolation(
                "Providing a name is mandatory!");
        }
        else if (City.instances[id]) {
            constraintViolation = new UniquenessConstraintViolation(
                "There is already a city record with this name!");
        }
        else {
            constraintViolation = new NoConstraintViolation();
        }
    }
    return constraintViolation;
};
City.checkNameAsIdRef = function(id) {
    var constraintViolation = City.checkName(id);
    if ((constraintViolation instanceof NoConstraintViolation) &&
        id !== undefined) {
        if (!City.instances[id]) {
            constraintViolation = new ReferentialIntegrityConstraintViolation(
                'There is no city record with this name!');
        }
    }
    return constraintViolation;
};
City.prototype.setName = function(id) {
    var validationResult = City.checkNameAsId(id);
    if (validationResult instanceof NoConstraintViolation) {
        this.name = id;
    }
    else {
        throw validationResult;
    }
};

City.prototype.toString = function () {
    return "City{ Name:" + this.name + " } created";
};

City.add = function(slots) {
    var city = null;
    try {
        city = new City(slots);
    }
    catch(e) {
        console.log(e.constructor.name +": "+ e.message);
        city = null;
    }
    if (city) {
        City.instances[slots.name] = city;
        console.log(city.toString() + " created.");
    }
};

City.retrieveAll = function() {
    var key ="", keys=[], i=0, citiesString="", cities={};

    try {
        if (localStorage["countries"]) {
            citiesString = localStorage["cities"];
        }
    }
    catch(e) {
        alert("Error when reading from Local Storage\n" + e);
    }
    if (citiesString) {
        cities = JSON.parse(citiesString);
        keys = Object.keys(cities);
        console.log(keys.length + " cities loaded.");
        for (i=0; i<keys.length; i++) {
            key = keys[i];
            City.instances[key] = City.convertRec2Obj(cities[key]);
        }
    }
};

City.convertRec2Obj = function(cityRow) {
    var city={};
    try {
        city = new City(cityRow);
    } catch (e) {
        console.log(
            e.constructor.name + " while deserializing a city row: "
            + e.message);
    }
    return city;
};

City.destroy = function(name) {
    if (City.instances[name]) {
        console.log(City.instances[name].toString() + " deleted.");
        delete City.instances[name];
    }
    else {
        console.log("There is no city with the name "
            + name + " in the database.");
    }
};

City.saveAll = function() {
    var citiesString="", error=false, nmrOfCities
        = Object.keys(City.instances).length;
    try {
        citiesString = JSON.stringify(City.instances);
        localStorage["cities"] = citiesString;
    }
    catch(e) {
        alert("Error when writing to Local Storage\n" + e);
        error = true;
    }
    if (!error) { console.log(nmrOfCities + " cities saved."); }
};

City.createTestData = function() {
    if (confirm("Test data will override existing data. Continue?")) {
        City.instances["Berlin"] = new City({
            name: "Germany"
        });
        City.instances["Hamburg"] = new City({
            name: "Russia"
        });
        City.instances["Frankfurt"] = new City({
            name: "France"
        });
        City.instances["Lyon"] = new City({
            name: "Lyon"
        });
        City.instances["Marseille"] = new City({
            name: "Marseille"
        });
        City.instances["Paris"] = new City({
            name: "Paris"
        });
        City.instances["Moscow"] = new City({
            name: "Moscow"
        });
        City.instances["Novosibirsk"] = new City({
            name: "Novosibirsk"
        });
        City.saveAll();
    }
};

City.clearData = function() {
    if (confirm("This deletes all existing data. Continue?")) {
        localStorage["cities"] = "{}";
    }
};