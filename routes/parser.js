var express = require('express');
var router = express.Router();
var config = require('../config');
var persistence = require('persistencejs');
var persistenceStore = persistence.StoreConfig.init(persistence, { adaptor: 'mysql' });



var Contact = require('../models/contact');
// var PhysicalAddress = require('../models/physicaladdress');
// var PostalAddress = require('../models/postaladdress');
var fs = require('fs'),
    xmlreader = require('xmlreader');
  var path = require('path'),
	dir = path.normalize(__dirname + '/..');
var data ='';
    fs.readFile(dir + '/data/Contacts.xml','utf8', function(err, d) {
    	data = d;
    	console.log('XML file read successfully');
    });
    


router.get('/parsexml', function(req, res) {
	
	persistenceStore.config(persistence, config.host, 3306, config.database, config.user, config.password);
	var session = persistenceStore.getSession();
	session.schemaSync();
  
  		var xml = data.replace("\ufeff", "");

			xmlreader.read(xml, function (err, result) {
				if(err) return console.log(err);

				var contacts = result.Contacts;

				contacts.Contact.each(function (i, contact){
					var contactToSave = new Contact(session);
					
					if(contact.attributes().Type === 'Individual'){
						if(contact.ResidentOfAustralia.hasOwnProperty('text')){
						contactToSave.ResidentOfAustralia = contact.ResidentOfAustralia.text() ;
						}
						if(contact.Title.hasOwnProperty('text')){
							contactToSave.Title = contact.Title.text();
						}
						if(contact.Surname.hasOwnProperty('text')){
							contactToSave.Surname = contact.Surname.text();
						}
						if(contact.GivenNames.hasOwnProperty('text')){
							contactToSave.GivenNames = contact.GivenNames.text();
						}
						if(contact.DateOfBirth.hasOwnProperty('text')){
						contactToSave.DateOfBirth = contact.DateOfBirth.text();
						}
						if(contact.DateOfDeath.hasOwnProperty('text')){
							contactToSave.DateOfDeath = contact.DateOfDeath.text();
						}

					}
					else if (contact.attributes().Type === 'Company' || contact.attributes().Type === 'Partnership'){
						if(contact.Name.hasOwnProperty('text')){
							contactToSave.Name = contact.Name.text();
						}
						if(contact.attributes().Type === 'Company'){
							if(contact.Abn.hasOwnProperty('text')){
								contactToSave.Abn = contact.Abn.text();
							}

						}

					}
					
					if(contact.PostalAddress.Line1.hasOwnProperty('text')){
						contactToSave.PostalAddress_Line1 = contact.PostalAddress.Line1.text();
					}
					if(contact.PostalAddress.Line2.hasOwnProperty('text')){
						contactToSave.PostalAddress_Line2 = contact.PostalAddress.Line2.text();
					}
					if(contact.PostalAddress.Line3.hasOwnProperty('text')){
						contactToSave.PostalAddress_Line3 = contact.PostalAddress.Line3.text();
					}
					if(contact.PostalAddress.City.hasOwnProperty('text')){
						contactToSave.PostalAddress_City = contact.PostalAddress.City.text();
					}
					if(contact.PostalAddress.State.hasOwnProperty('text')){
						contactToSave.PostalAddress_State = contact.PostalAddress.State.text();
					}
					if(contact.PostalAddress.Postcode.hasOwnProperty('text')){
						contactToSave.PostalAddress_Postcode = contact.PostalAddress.Postcode.text();
					}
					if(contact.PostalAddress.Country.hasOwnProperty('text')){
						contactToSave.PostalAddress_Country = contact.PostalAddress.Country.text();
					}
					if(contact.attributes().Type === 'Company' || contact.attributes().Type === 'Individual'){

						if(contact.PhysicalAddress.Line1.hasOwnProperty('text')){
							contactToSave.PhysicalAddress_Line1 = contact.PhysicalAddress.Line1.text();
						}
						if(contact.PhysicalAddress.Line2.hasOwnProperty('text')){
							contactToSave.PhysicalAddress_Line2 = contact.PhysicalAddress.Line2.text();
						}
						if(contact.PhysicalAddress.Line3.hasOwnProperty('text')){
							contactToSave.PhysicalAddress_Line3 = contact.PhysicalAddress.Line3.text();
						}
						if(contact.PhysicalAddress.City.hasOwnProperty('text')){
							contactToSave.PhysicalAddress_City = contact.PhysicalAddress.City.text();
						}
						if(contact.PhysicalAddress.State.hasOwnProperty('text')){
							contactToSave.PhysicalAddress_State = contact.PhysicalAddress.State.text();
						}
						if(contact.PhysicalAddress.Postcode.hasOwnProperty('text')){
							contactToSave.PhysicalAddress_Postcode = contact.PhysicalAddress.Postcode.text();
						}
						if(contact.PhysicalAddress.Country.hasOwnProperty('text')){
							contactToSave.PhysicalAddress_Country = contact.PhysicalAddress.Country.text();
						}

					}
					
					if(contact.Tfn.hasOwnProperty('text')){
						contactToSave.Tfn = contact.Tfn.text();
					}
					if(contact.DaytimePhone.hasOwnProperty('text')){
						contactToSave.DaytimePhone = contact.DaytimePhone.text();
					}
					if(contact.HomePhone.hasOwnProperty('text')){
						contactToSave.HomePhone = contact.HomePhone.text();
					}
					if(contact.MobilePhone.hasOwnProperty('text')){
						contactToSave.MobilePhone = contact.MobilePhone.text();
					}
					if(contact.Fax.hasOwnProperty('text')){
						contactToSave.Fax = contact.Fax.text();
					}
					if(contact.Email.hasOwnProperty('text')){
						contactToSave.Email = contact.Email.text();
					}
					if(contact.BSB.hasOwnProperty('text')){
						contactToSave.BSB = contact.BSB.text();
					}
					if(contact.AccountNumber.hasOwnProperty('text')){
						contactToSave.AccountNumber = contact.AccountNumber.text();
					}
					if(contact.AccountName.hasOwnProperty('text')){
						contactToSave.AccountName = contact.AccountName.text();
					}
					// contactToSave.PhysicalAddress.add(physicalAddress);
					// contactToSave.PostalAddress.add(postalAddress)
					session.transaction(function(tx) {

						session.add(contactToSave);
						session.flush(tx, function() {
						     
						});

					});
					
				});
				
			    console.log('Done');
			});

		res.end("Done"); 
	// });
});

module.exports = router;
