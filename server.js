// server.js

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const StockPurchaseRouter = require('./routes/StockPurchaseRouter');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const bodyParser = require('body-parser');


/*const uri = "mongodb+srv://kylesamos:MyInterviewProject@interviewproject-ipm0d.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  //const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("i opened!");
  client.close();
});*/
//const uri = 'mongodb+srv://kylesamos:MyInterviewProject@interviewproject-ipm0d.mongodb.net/test?retryWrites=true';
/*MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   //const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   //client.close();
});

mongoose.Promise = global.Promise;
mongoose.connect(uri,{useNewUrlParser: true}, function(err,db){

	 if (err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
        console.log('Connected to Server successfully!');
    }
});
	*/
	
 mongoose.connect(`mongodb://localhost/StockProject`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
		   console.log(err)
         console.error('Database connection error')
       })
/*var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});*/
	   
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/purchases', StockPurchaseRouter);

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname,'public', 'index.html'));
});

app.get('/purchaseStock/:ticker&:amount', function (req, res) {

	var requestURL = 'https://api.iextrading.com/1.0/stock/' + req.params.ticker + '/price';
	console.log(requestURL);
	request.get(requestURL, { json: true }, (err, response, body) => {
	  if (err) { return console.log(err); }
		console.log(body);
		var shares = Math.floor(req.params.amount/body);
		const purchase = new Purchase({
			ticker: req.params.ticker, 
			valueAtPurchase: body,
			shares: shares
		});

		if (shares == 0)
			res.status(400).send("You don't have enough money to buy a share");
		
		purchase.save()
		   .then(purchase => {
			   console.log(purchase);
			
			   res.render('purchasesummary', {
				purchase: purchase
			  });
		   })
		   .catch(err => {
		   res.status(400).send("The Purchase was unable to be completed");
		   });
	});
	
});

StockPurchaseRouter.route('/getPurchases').get(function (req, res) {
	
	Purchase.find({}, function(err, purchases) {
		return purchases;
        }).catch(err => {
		   res.status(400).send("The Purchases were unable to be retrieved");
		   });;
	
});

StockPurchaseRouter.route('/getPurchaseById/:id').get(function (req, res) {
	
	Purchase.findById(req.params.id, function (err, purchase) {
		return purchase;
		/*res.render('purchasesummary', {
					purchase: purchase
		});*/
	}).catch(err => {
		   res.status(400).send("The Purchase was unable to be retrieved");
		   });;
	
});

StockPurchaseRouter.route('/getPurchasesByTicker/:ticker').get(function (req, res) {
	
	Purchase.find({ticker: req.params.ticker}, function(err, purchases) {
		console.log(purchases);
		return purchases;
        }).catch(err => {
		   res.status(400).send("The Purchases were unable to be retrieved");
		   });;
	
});



app.listen(port, function(){
  console.log('Node js Express js Tutorial');
});