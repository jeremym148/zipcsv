var express = require('express');
var bodyParser = require('body-parser')
var app =express();
var request = require('request');
var http = require('http');
var base64 = require('base-64');
var promise = require('promise');
var pg = require('pg');
var parseString = require('xml2js').parseString;
var parse = require('xml-parser');
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// var chilkat = require('chilkat_node7_win32'); 

// var os = require('os');
// if (os.platform() == 'win32') {  
//     var chilkat = require('chilkat_node7_win32'); 
// } 
// else if (os.platform() == 'linux') {
//     if (os.arch() == 'arm') {
//         var chilkat = require('chilkat_node6_arm');
//     } else if (os.arch() == 'x86') {
//         var chilkat = require('chilkat_node6_linux32');
//     } else {
        var chilkat = require('chilkat_node6_linux64');
//     }
// } else if (os.platform() == 'darwin') {
//     var chilkat = require('chilkat_node6_macosx');
// }
var test;
var port =process.env.PORT || 8080;

function chilkatExample(csv, callback) {
    var crypt = new chilkat.Crypt2();
    var zip = new chilkat.Zip();
     var glob = new chilkat.Global();
    var success = glob.UnlockBundle("Anything for 30-day trial");
    if (success !== true) {
        console.log(glob.LastErrorText);
        return;
    }
    

 var success = zip.NewZip("test.zip");
    if (success !== true) {
        console.log(zip.LastErrorText);
        return;
    }
     zip.SetPassword("secret");
    zip.PasswordProtect = true;

    //  Add the string "Hello World!" to the .zip
    entry = zip.AppendString2("helloWorld.csv",csv,"utf-8");

    zipFileInMemory = zip.WriteToMemory();
    if (zipFileInMemory == null ) {
        console.log("zipmem "+zip.LastErrorText);
        return;
    }
    var zip64 = crypt.Encode(zipFileInMemory,base64);
    if (zip64 == null ) {
        console.log(zip.LastErrorText);
        return;
    }
    console.log(zip64);
     sendDocToSF(zip64, callback);
}


function sendDocToSF(zip64, callback){
	connectToSF(function(sessionId) {
		// Set the headers
		var headers = {
		    'Authorization': 'Bearer '+sessionId,
		    'Content-Type': 'application/json'
		}

		// Configure the request
		var options = {
		   url: 'https://cs82.salesforce.com/services/data/v39.0/sobjects/Attachment/',
		    method: 'POST',
		    headers: headers,
		    json:{  "Description" : "hkmgjhgjhgs7777",
		    		"ParentId" : "a003E000001f8VA",
		    		"Name" : "TEST.zip",
		    		"ContentType" : ".zip",
		    		"body":zip64}
		}

		// Start the request
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 201) {
		        // Print out the response body
		       console.log(body);
		       callback(body);
		    }else {console.log("eror"+error);}
		})
	});
}

function connectToSF(callback2){
	// Set the headers
	var headers = {
	    'Content-Type': 'text/xml',
	    'SoapAction': 'SoapAction'
	}

	// Configure the request
	var options = {
	   url: 'https://test.salesforce.com/services/Soap/u/36.0',
	    method: 'POST',
	    headers: headers,
	    body:'<?xml version="1.0" encoding="utf-8" ?><env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:env="http://schemas.xmlsoap.org/soap/envelope/"><env:Body><n1:login xmlns:n1="urn:partner.soap.sforce.com"><n1:username>balink@capretraite.fr.dev3</n1:username><n1:password>1q2w3e4r5t</n1:password></n1:login></env:Body></env:Envelope>'
	}	
	// Start the request
	request(options, function (error, response, body) {
		console.log(body);
		console.log(response.statusCode);
	    if (!error && response.statusCode == 200) {
	        // Print out the response body
	       
	        var obj = JSON.stringify(parse(body));
	        var sessionId=obj.declaration.root.children;
	        console.log(sessionId);

	       console.log('tttt');
	       // var sessionId=body.slice(body.search('"sessionId":["')+14,body.search('"],"userId')-body.search('"sessionId":["')-14);
	  //      parseString(body, function (err, result) {
	  //      		// console.log(result);
	  //      		var json=JSON.stringify(result);
	  //      		var array = [];
			//     console.log(json);
			//     for(var key in json){
			// 	    if(!json.hasOwnProperty(key)){
			// 	        continue;
			// 	    }
			// 	    array.push(key, json[key]);
			// 	}console.log(array, array.slice(0, 4));
			//     // var sessionId=json.slice(50,50);
	  //     //  		// var sessionId=json.soapenv_Envelope;
	  //     //  		console.log(sessionId);
	  //     //  		callback2(sessionId);
			// });
	    }else {console.log("eror"+error);}
	})
}



app.post('/createZip',function(req, res){
    var body = req.body;
    res.set('Content-Type', 'text/plain');
	chilkatExample(body, function(body2) {
		res.send(body2.id);
	});
	
});

app.get('/', function(req, res){
	sendDocToSF();
});

// app.use(express.static(__dirname + '/public' ));

//app.get('*', (req,res) => res.sendFile(path.join(__dirname+'/public/' + config.indexPage)))

app.listen(port, function(){
	console.log("Server is listening on port "+port);
});
