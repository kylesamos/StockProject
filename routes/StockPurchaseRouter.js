const express = require('express');
const app = express();
const request = require('request');
const StockPurchaseRouter = express.Router();
const Purchase = require('../models/StockPurchase.model');


StockPurchaseRouter.route('/').get(function (req, res) {
  res.render('index');
});

StockPurchaseRouter.route('/post').post(function (req, res) {
	var uri = 'http://localhost:3000/purchases/purchasestock/' + req.body.ticker + '&' + req.body.amount;
	
	request.get(uri, (err, response, body) => {
		console.log(err, response.status, 'this is an error2');
		
			var purchase = JSON.parse(body);
			console.log(body)
			if (purchase.error)
				res.render('purchasefailure', {
				error: purchase.error
			});
			res.render('purchasesummary', {
				purchase: purchase
			});
	});
});

StockPurchaseRouter.route('/purchaseStock/:ticker&:amount').get(function (req, res) {
	
	var requestURL = 'https://api.iextrading.com/1.0/stock/' + req.params.ticker + '/price';

	request.get(requestURL, { json: true }, (err, response, body) => {
	  if (err) { return console.log(err); }
	  
		var shares = Math.floor(req.params.amount/body);
		const purchase = new Purchase({
			ticker: req.params.ticker, 
			valueAtPurchase: body,
			shares: shares
		});

		if (shares == 0)
			return res.status(400).send("You don't have enough money to buy a share");
		
		purchase.save()
		   .then(purchase => {
				return res.send(purchase);
		   })
		   .catch(err => {
			res.status(400).send({ error: "The Purchase was unable to be completed" });
		   });
	});
	
});

StockPurchaseRouter.route('/getPurchases').get(function (req, res) {
	
	Purchase.find({}, function(err, purchases) {
		return res.send(purchases);
	}).catch(err => {
	   res.status(400).send("The Purchases were unable to be retrieved");
	   });;
	
});

StockPurchaseRouter.route('/getPurchaseById/:id').get(function (req, res) {
	
	Purchase.findById(req.params.id, function (err, purchase) {
		return res.send(purchase);
	}).catch(err => {
		   res.status(400).send("The Purchase was unable to be retrieved");
		   });;
	
});

StockPurchaseRouter.route('/getPurchasesByTicker/:ticker').get(function (req, res) {
	
	Purchase.find({ticker: req.params.ticker}, function(err, purchases) {
		return res.send(purchases);
	}).catch(err => {
	   res.status(400).send("The Purchases were unable to be retrieved");
	   });;
	
});

module.exports = StockPurchaseRouter;