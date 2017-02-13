var express = require('express');
var bodyParser = require('body-parser')
var app =express();
var request = require('request');
var http = require('http');
var base64 = require('base-64');
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

function chilkatExample(csv) {
    var crypt = new chilkat.Crypt2();
    var zip = new chilkat.Zip();
    

    var success;
     //  Any string unlocks the component for the 1st 30-days.
    success = zip.UnlockComponent("Anything for 30-day trial");
    if (success !== true) {
        console.log(zip.LastErrorText);
        return;
    }


    success = zip.NewZip("test2.zip");
    if (success !== true) {
        console.log(zip.LastErrorText);
        return;
    }

    zip.SetPassword("secret");
    zip.PasswordProtect = true;

    
    var entry = zip.AppendString2("HelloWorld2.csv",csv,"utf-8");

    success = zip.WriteToMemory();
    var zip64 = crypt.Encode(success,base64);
    if (success !== true) {
        console.log(zip.LastErrorText);
        return;
    }
    var success2 =sendDocToSF(zip64);
    return success2;
}

function sendDocToSF(zip64){


	// Set the headers
	var headers = {
	    'Authorization': 'Bearer 00D4E000000CqGg!AQoAQHMq.exoKn4gnF5ZOEV_kGo3x0lKVDBrxm3g83LutMDPlT0WU9tMmBdtDUGFnDo05pIb3T3971iZtti2btXsSTxq5rPJ ',
	    'Content-Type': 'application/json'
	}

	// Configure the request
	var options = {
	    url: 'https://cs83.salesforce.com/services/data/v39.0/sobjects/Document/',
	    method: 'POST',
	    headers: headers,
	    json:{  "Description" : "hkmgjhgjhgs7777",
	    		"Keywords" : "marketing,sales,update",
	    		"folderId" : "00l4E000000EKXa",
	    		"Name" : "TEST",
	    		"Type" : "zip",
	    		"body":zip64}
	}

	// Start the request
	request(options, function (error, response, body) {
	    if (!error && response.statusCode == 201) {
	        // Print out the response body
	       console.log(body);
	       return body;
	    }else {console.log(error);}
	})
}


app.post('/createZip',function(req, res){
    var body = req.body;
    res.set('Content-Type', 'application/json');
	var body2=chilkatExample(body);
	res.send(`You sent: ${body2} to Express`);
	
});

app.get('/', function(req, res){
	sendDocToSF();
});

// app.use(express.static(__dirname + '/public' ));

//app.get('*', (req,res) => res.sendFile(path.join(__dirname+'/public/' + config.indexPage)))

app.listen(port, function(){
	console.log("Server is listening on port "+port);
});
