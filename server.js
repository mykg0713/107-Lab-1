var http = require("http");
var express = require ("express");

var app = express();

/**
 * CONFIGURATION
 */

 // enable CORS security
 app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



 //read req body as obj
 var bodyParser = require("body-parser");
 app.use(bodyParser.json());

// Mongoose connection
var mongoose = require("mongoose");
mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var db = mongoose.connection;

//DB obj constructor
var ItemDB;


/**
 * 
 * WEB SERVER FUNCTIONALITY
 * 
 * 
 */

app.get("/", function (req, res){
    res.send("<h1 style='color:darkblue;'> Hello from my own Server </h1>");
});

app.get("/contact", function(req, res){
res.send("My contact info is: 123-321-3221,  contact@myk.com");
});

app.get("/about", function(req, res){
    res.send("Mykul Guillory");
});




/**
 * 
 * API FUNCTIONALITY
 * 
 * 
 */

 var items = [];
 var count = 0;

 app.get('/api/products', function(req, res){
     console.log("User wants the catalog");

     ItemDB.find({}, function(error,data){
        if(error){
            console.log("** Error on retrieving item", error);
            res.status(500);
            res.send(error);
        }

        res.status(200);
        res.json(data);

     });

 });

app.get('/api/products/:user', function(req,res){
    var name = req.params.user;
    //res.send(req.params.user);

    ItemDB.find({user: name, price: 99 }, function(error,data));
    if(error){
        console.log("** Error on retrieving item", error);
        res.status(500);
        res.send(error);
    }

    res.status(200);
    res.json(data);

});



 app.post('/api/products', function (req, res){
     console.log("User wants to save item");
    
     //perform validation

     

     // create a DB object
    var itemForMongo = ItemDB(req.body);
    itemForMongo.save(function(error,savedItem){
        if(error){
            console.log("** Error saving item to DB", error);
            res.status(500); // 500:  Internal Server Error
            res.send(error);

        }

        // no error, send the saved item back to client
        res.status(201);
        res.json(savedItem);
    });

   /*  //store and send back the item
     items.push(item);
     res.json(item); */
 });

 // catch error on mongo connection
 db.on('error', function(error){
    console.log("!!! There is an error connecting to mongo DB Server !!!!")
 });

 // catch sucess on mongo connection
 db.on('open', function(){
     console.log("This shit works");

     /** The allowed SchemaTypes are:
      * String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array
      */

     // define a schem for the collection (Table)
     var itemSchema = mongoose.Schema({
         code: String,
         title: String,
         price: Number,
         description: String,
         category: String,
         rating: Number,
         image: String,
         user: String
     });

     // create constructor(s) for the schema(s)
     ItemDB = mongoose.model("itemCH5", itemSchema);
 });

 app.listen(8080, function () {
     console.log("Server running at http://localhost:8080");
 });