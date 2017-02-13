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
    }else{
    	 console.log("zip "+zip.LastErrorText);
    	  console.log("zip "+ success);
    }
     zip.SetPassword("secret");
    zip.PasswordProtect = true;

    //  Add the string "Hello World!" to the .zip
    entry = zip.AppendString2("helloWorld.csv",csv,"utf-8");

    zipFileInMemory = zip.WriteToMemory();
    if (zipFileInMemory == null ) {
        console.log("zipmem "+zip.LastErrorText);
        return;
    }else{
    	 console.log("zipmem "+zip.LastErrorText);
    	  console.log("zipmem2 "+ zipFileInMemory);
    }
    var zip64 = crypt.Encode(zipFileInMemory,base64);
    if (zip64 == null ) {
        console.log(zip.LastErrorText);
        return;
    }else{
    	 console.log("crypt "+zip.LastErrorText);
    	  console.log("crypt2 "+ zip64);
    }
    console.log(zip64);
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

	//    url: 'https://cs83.salesforce.com/services/data/v39.0/sobjects/Attachment/',
	//     method: 'POST',
	//     headers: headers,
	//     json:{  "Description" : "hkmgjhgjhgs7777",
	//     		"ParentId" : "0064E000003YMcM",
	//     		"Name" : "TEST",
	//     		"ContentType" : ".zip",
	//     		"body":zip64}
	// }

	// Start the request
	request(options, function (error, response, body) {
	    if (!error && response.statusCode == 201) {
	        // Print out the response body
	       console.log("testtt"+body);
	       return body;
	    }else {console.log("errrroooorrrr"+error);}
	})
}


app.post('/createZip',function(req, res){
    var body = req.body;
    res.set('Content-Type', 'text/plain');
	var body2=chilkatExample(body);
	res.send(`You sent:${body2} to Express`);
	
});

app.get('/', function(req, res){
	sendDocToSF();
});

// app.use(express.static(__dirname + '/public' ));

//app.get('*', (req,res) => res.sendFile(path.join(__dirname+'/public/' + config.indexPage)))

app.listen(port, function(){
	console.log("Server is listening on port "+port);
});
