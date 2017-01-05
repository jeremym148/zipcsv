var express = require('express');
var bodyParser = require('body-parser')
var app =express();
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));
// var chilkat = require('chilkat_node7_win32'); 
var test;
var port =process.env.PORT || 8080;

// function chilkatExample(csv) {

//     var zip = new chilkat.Zip();
    

//     var success;
//      //  Any string unlocks the component for the 1st 30-days.
//     success = zip.UnlockComponent("Anything for 30-day trial");
//     if (success !== true) {
//         console.log(zip.LastErrorText);
//         return;
//     }


//     success = zip.NewZip("test2.zip");
//     if (success !== true) {
//         console.log(zip.LastErrorText);
//         return;
//     }

//     zip.SetPassword("secret");
//     zip.PasswordProtect = true;

//     // var saveExtraPath;
//     // saveExtraPath = false;
//     // success = zip.AppendOneFileOrDir("./index.html",saveExtraPath);
//     // if (success !== true) {
//     //     console.log(zip.LastErrorText);
//     //     return;

//     // }

//     var entry = zip.AppendString2("HelloWorld2.csv",csv,"utf-8");

//     var success = zip.WriteZipAndClose();
//     if (success !== true) {
//         console.log(zip.LastErrorText);
//         return;
//     }
//     test = JSON.stringify(zip);

//     console.log("Zip Created!");

// }


app.post('/createZip',function(req, res){
    var body = req.body;
    res.set('Content-Type', 'text/plain');
	// chilkatExample(req.body);
	res.send(`You sent: ${body} to Express`);
});

app.get('/', function(req, res){
  res.send('id: ' + req.query.id);
});

// app.use(express.static(__dirname + '/public' ));

//app.get('*', (req,res) => res.sendFile(path.join(__dirname+'/public/' + config.indexPage)))

app.listen(port, function(){
	console.log("Server is listening on port "+port);
});
