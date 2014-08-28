var express = require('express');
var router = express.Router();
var config = require('../config');
var persistence = require('persistencejs');
var extfs = require('extfs');
var persistenceStore = persistence.StoreConfig.init(persistence, { adaptor: 'mysql' });
var pathToClients = '/data/clients';
var rimraf = require('rimraf');
var	response = '';

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.password
});

connection.connect(function(err) {
  if (err) {
  	response = response + 'Error connecting to MySQL service: ' + err.stack + '\r\n';
    console.error('Error connecting to MySQL service: ' + err.stack);
    return;
  }
});

connection.query('CREATE DATABASE ' + config.database, function(err, rows) {
  if(err){
  	if(err.errno == 1007){
  		response = response + 'Default db already exists \r\n';
  	}
  }else{
       response = response + 'Default database created \r\n';
  }
  
});

connection.end();




var User = require('../models/user');
var fs = require('fs'),
	async = require('async'),
    xmlreader = require('xmlreader');
  var path = require('path'),
	dir = path.normalize(__dirname + '/..');
var data ='';
    fs.readFile(dir + '/data/Contacts.xml','utf8', function(err, d) {
    	data = d;
    	response = response + 'All records from XML file read successfully \r\n';
    	console.log(response);
    });
    


router.get('/parsexml', function(req, res) {
	var xml = data.replace("\ufeff", "");
	res.write(response);
	
	persistenceStore.config(persistence, config.host, 3306, config.database, config.user, config.password);
	var session = persistenceStore.getSession();
	session.schemaSync();
	
			xmlreader.read(xml, function (err, result) {
				if(err) {
					console.log(err); 
					return res.end(err);

				}

				var users = result.Contacts;

				users.Contact.each(function (i, user){
					var userToSave = new User(session);
					if(typeof(user.attributes().Id) !== "undefined"){
							userToSave._Id = user.attributes().Id;
					}
					if(typeof(user.attributes().Code) !== "undefined"){
						userToSave.Code = user.attributes().Code;
					}
					if(typeof(user.attributes().Type) !== "undefined"){
						userToSave.Type = user.attributes().Type;
					}

					
					if(user.attributes().Type === 'Individual'){
						if(user.ResidentOfAustralia.hasOwnProperty('text')){
						userToSave.ResidentOfAustralia = user.ResidentOfAustralia.text() ;
						}
						if(user.Title.hasOwnProperty('text')){
							userToSave.Title = user.Title.text();
						}
						if(user.Surname.hasOwnProperty('text')){
							userToSave.Surname = user.Surname.text();
						}
						if(user.GivenNames.hasOwnProperty('text')){
							userToSave.GivenNames = user.GivenNames.text();
						}
						if(user.DateOfBirth.hasOwnProperty('text')){
						userToSave.DateOfBirth = user.DateOfBirth.text();
						}
						if(user.DateOfDeath.hasOwnProperty('text')){
							userToSave.DateOfDeath = user.DateOfDeath.text();
						}

					}
					else if (user.attributes().Type === 'Company' || user.attributes().Type === 'Partnership' || user.attributes().Type === 'SMSF' || user.attributes().Type === 'Trust'){
						if(user.Name.hasOwnProperty('text')){
							userToSave.Name = user.Name.text();
						}
						if(user.attributes().Type === 'Company' || user.attributes().Type === 'SMSF'){
							if(user.Abn.hasOwnProperty('text')){
								userToSave.Abn = user.Abn.text();
							}
							if(user.attributes().Type === 'SMSF'){
								if(user.Sfn.hasOwnProperty('text')){
									userToSave.Sfn = user.Sfn.text();
								}

							}

						}

					}
					
					if(user.PostalAddress.Line1.hasOwnProperty('text')){
						userToSave.PostalAddress_Line1 = user.PostalAddress.Line1.text();
					}
					if(user.PostalAddress.Line2.hasOwnProperty('text')){
						userToSave.PostalAddress_Line2 = user.PostalAddress.Line2.text();
					}
					if(user.PostalAddress.Line3.hasOwnProperty('text')){
						userToSave.PostalAddress_Line3 = user.PostalAddress.Line3.text();
					}
					if(user.PostalAddress.City.hasOwnProperty('text')){
						userToSave.PostalAddress_City = user.PostalAddress.City.text();
					}
					if(user.PostalAddress.State.hasOwnProperty('text')){
						userToSave.PostalAddress_State = user.PostalAddress.State.text();
					}
					if(user.PostalAddress.Postcode.hasOwnProperty('text')){
						userToSave.PostalAddress_Postcode = user.PostalAddress.Postcode.text();
					}
					if(user.PostalAddress.Country.hasOwnProperty('text')){
						userToSave.PostalAddress_Country = user.PostalAddress.Country.text();
					}
					if(user.attributes().Type === 'Company' || user.attributes().Type === 'Individual'){

						if(user.PhysicalAddress.Line1.hasOwnProperty('text')){
							userToSave.PhysicalAddress_Line1 = user.PhysicalAddress.Line1.text();
						}
						if(user.PhysicalAddress.Line2.hasOwnProperty('text')){
							userToSave.PhysicalAddress_Line2 = user.PhysicalAddress.Line2.text();
						}
						if(user.PhysicalAddress.Line3.hasOwnProperty('text')){
							userToSave.PhysicalAddress_Line3 = user.PhysicalAddress.Line3.text();
						}
						if(user.PhysicalAddress.City.hasOwnProperty('text')){
							userToSave.PhysicalAddress_City = user.PhysicalAddress.City.text();
						}
						if(user.PhysicalAddress.State.hasOwnProperty('text')){
							userToSave.PhysicalAddress_State = user.PhysicalAddress.State.text();
						}
						if(user.PhysicalAddress.Postcode.hasOwnProperty('text')){
							userToSave.PhysicalAddress_Postcode = user.PhysicalAddress.Postcode.text();
						}
						if(user.PhysicalAddress.Country.hasOwnProperty('text')){
							userToSave.PhysicalAddress_Country = user.PhysicalAddress.Country.text();
						}

					}
					
					if(user.Tfn.hasOwnProperty('text')){
						userToSave.Tfn = user.Tfn.text();
					}
					if(user.DaytimePhone.hasOwnProperty('text')){
						userToSave.DaytimePhone = user.DaytimePhone.text();
					}
					if(user.HomePhone.hasOwnProperty('text')){
						userToSave.HomePhone = user.HomePhone.text();
					}
					if(user.MobilePhone.hasOwnProperty('text')){
						userToSave.MobilePhone = user.MobilePhone.text();
					}
					if(user.Fax.hasOwnProperty('text')){
						userToSave.Fax = user.Fax.text();
					}
					if(user.Email.hasOwnProperty('text')){
						userToSave.Email = user.Email.text();
					}
					if(user.BSB.hasOwnProperty('text')){
						userToSave.BSB = user.BSB.text();
					}
					if(user.AccountNumber.hasOwnProperty('text')){
						userToSave.AccountNumber = user.AccountNumber.text();
					}
					if(user.AccountName.hasOwnProperty('text')){
						userToSave.AccountName = user.AccountName.text();
					}

					session.transaction(function(tx) {
						if(req.query.log){
							res.write('User: ' + JSON.stringify(userToSave) + ' added to DB \r\n');
						}
						else{
							res.write('User: ' + userToSave.Code + ' added to DB \r\n');
						}
						


						session.add(userToSave);
						session.flush(tx, function() {
						     
						});

					});
					
				});
				
			    console.log('Done');
			});

		res.end("Done"); 
});

router.get('/rename', function(req, res){
	
	var xml = data.replace("\ufeff", "");

	xmlreader.read(xml, function (err, result) {
		if(err) return console.log(err);
		var users = result.Contacts;

		fs.readdir(dir + pathToClients, function (err, drct){
			if(!err){


				drct.forEach(function(folders){

					fs.readdir(dir + pathToClients +'/'+folders, function (err, d){

						if(!err){
							
							d.some(function(folder){
								var fol = folder.substr(0,8);
								users.Contact.each(function (i, user){
									// console.log(user.attributes().Code);
									if(user.attributes().Code == fol){
										var source = dir + pathToClients +'/'+folders+'/'+ folder;
										
										var sourceDirectory = '';
										if(folder.substr(9,1).toLowerCase() == '' || folder.substr(9,1).toLowerCase() == ''){
											sourceDirectory = dir + pathToClients +'/'+fol.substr(0,1).toLowerCase();

										}
										else{
											sourceDirectory = dir + pathToClients +'/'+folder.substr(9,1).toLowerCase();

										}

										var destination = sourceDirectory +'/'+ folder.substr(9) + ' (' + fol + ')';
										

										if(!fs.existsSync(sourceDirectory)){
											fs.mkdirSync(sourceDirectory);
										}
										fs.rename( source, destination , function(err) {
										    if ( err ) console.log('ERROR: ' + err);
										    else{
										    	var ren = '/'+folders+'/'+ folder +' renamed to: ' + destination.substr(sourceDirectory.length-2)
										    	res.write(ren + '\r\n')
										    	console.log(ren);
										    	var cnt = 1 + i;
										    	// console.log(users.Contact.count() + ''+ cnt)
										if(users.Contact.count() == cnt){
											res.end("Done");
										}

										    }
										});
										
										

									}


								});
								
								// return check;
								
							});

						}
						

					});



				});

			}
			

		});
	
	});
	// res.end('Done');

});

router.get('/delempty', function(req, res){
	fs.readdir(dir + pathToClients, function (err, drct){
			if(!err){
				drct.forEach(function(folders){

					fs.readdir(dir + pathToClients +'/'+folders, function (err, d){

						if(!err){
							
							d.some(function(folder){
								fs.readdir(dir + pathToClients +'/'+folders + '/' + folder, function (err, c){

									if(!err){
										
										c.some(function(fol){
											var delPath = dir + pathToClients +'/'+folders + '/' + folder + '/' + fol;
											fs.lstat(delPath, function(err, stats) {
											    
											    if(stats.size === 0){
											    	rimraf(delPath, function(err){
											    		if(err) console.log(err);
											    		else {
											    			console.log(delPath + " : DELETED");
											    			res.write(delPath + " : DELETED");
											    		}

											    	});
											    	


											    }
											    

											      
											});
											

										});
									}
								

								});

										
									
										
							});

						}
						

					});



				});

			}
			

		});

// res.end("Done");
});

router.get('/createfolder', function(req, res){
	
	var xml = data.replace("\ufeff", "");

	xmlreader.read(xml, function (err, result) {
		if(err) return console.log(err);
		var users = result.Contacts;

		users.Contact.each(function (i, user){
			var name = '';

			if(user.attributes().Type === 'Individual'){
				if(user.Surname.hasOwnProperty('text')){
							name = user.Surname.text();
				}

			}
			else{
				if(user.Name.hasOwnProperty('text')){
							name = user.Name.text();
				}

			}
			var check = false;
			if(name === '' || name === ' '){
				name = user.attributes().Code;
				check = true;
			}

			var folders = '';
			if (name.substr(0,1).toLowerCase() ===' '){
				folders = name.substr(1,1).toLowerCase();
			}
			else{
				folders = name.substr(0,1).toLowerCase();
			}

			if(name.indexOf('/') !== -1 || name.indexOf('\\') !== -1 ){
			  name = name.replace('\\','-');
			  name = name.replace('/','-');

			}

			var source = dir + pathToClients +'/'+folders;

			if(!fs.existsSync(source)){
				fs.mkdirSync(source);
				console.log('CREATED: ' + source);
				res.write('CREATED: ' + source);
			}

			var sourceDirectory = '';

			if (check == true){
				sourceDirectory = dir + pathToClients +'/'+folders + '/' +'(' + user.attributes().Code + ')';

			}
			else{
				sourceDirectory = dir + pathToClients +'/'+folders + '/' + name + ' (' + user.attributes().Code + ')';
			}
			

			if(!fs.existsSync(sourceDirectory)){
				fs.mkdirSync(sourceDirectory);
				console.log('CREATED: ' + sourceDirectory);
				res.write('CREATED: ' + sourceDirectory+'\r\n');
				
			}
			var cnt = 1 + i;
			if(users.Contact.count() == cnt){
				res.end("Done");
			}
										


		});

		
	});

});



module.exports = router;
