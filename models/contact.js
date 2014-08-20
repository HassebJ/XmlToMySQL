var persistence = require('persistencejs');
var postaladdress = require('./postaladdress');
var physicaladdress = require('./physicaladdress');



var contact = persistence.define('contact', {
  ResidentOfAustralia: "BOOL",
  Name: "TEXT",
  Abn: "TEXT",
  Title: "TEXT",
  Surname: "TEXT",
  GivenNames: "TEXT",
  DateOfBirth: "DATE",
  DateOfDeath: "DATE",
  Tfn: "INT",
  DaytimePhone: "TEXT",
  HomePhone: "TEXT",
  MobilePhone: "TEXT",
  Fax: "TEXT",
  Email: "TEXT",
  BSB: "TEXT",
  AccountNumber: "INT",
  AccountName: "TEXT"

});

contact.hasOne('PostalAddress', postaladdress);
contact.hasOne('PhysicalAddress', physicaladdress);



module.exports = contact;