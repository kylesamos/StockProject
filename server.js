// server.js

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const StockPurchaseRouter = require('./routes/StockPurchaseRouter');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

mongoose.connect(`mongodb://localhost/StockProject`)
   .then(() => {
	 console.log('Database connection successful')
   })
   .catch(err => {
	   console.log(err)
	 console.error('Database connection error')
   })


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/purchases', StockPurchaseRouter);

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname,'public', 'index.html'));
});

app.listen(port, function(){
  console.log('Welcome to the Stock Purchasing nodejs app');
});