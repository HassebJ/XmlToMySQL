var persistence = require('persistencejs');


var physicaladdress = persistence.define('physicaladdress', {
  Line1: "TEXT",
  Line2: "TEXT",
  Line3: "TEXT",
  City: "TEXT",
  State: "TEXT",
  Postcode: "INT",
  Country: "TEXT"
});

module.exports = physicaladdress;