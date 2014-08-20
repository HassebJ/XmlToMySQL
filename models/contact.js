var persistence = require('persistencejs');
// var postaladdress = require('./postaladdress');
// var PhysicalAddress = require('./PhysicalAddress');



var contact = persistence.define('contact', {
  ResidentOfAustralia: "BOOL",
  Name: "TEXT",
  Abn: "TEXT",
  Title: "TEXT",
  Surname: "TEXT",
  GivenNames: "TEXT",
  DateOfBirth: "TEXT",
  DateOfDeath: "TEXT",
  Tfn: "INT",
  DaytimePhone: "TEXT",
  HomePhone: "TEXT",
  MobilePhone: "TEXT",
  Fax: "TEXT",
  Email: "TEXT",
  BSB: "TEXT",
  AccountNumber: "INT",
  AccountName: "TEXT",
  PhysicalAddress_Line1: "TEXT",
  PhysicalAddress_Line2: "TEXT",
  PhysicalAddress_Line3: "TEXT",
  PhysicalAddress_City: "TEXT",
  PhysicalAddress_State: "TEXT",
  PhysicalAddress_Postcode: "TEXT",
  PhysicalAddress_Country: "TEXT",
  PostalAddress_Line1: "TEXT",
  PostalAddress_Line2: "TEXT",
  PostalAddress_Line3: "TEXT",
  PostalAddress_City: "TEXT",
  PostalAddress_State: "TEXT",
  PostalAddress_Postcode: "TEXT",
  PostalAddress_Country: "TEXT"


});




module.exports = contact;