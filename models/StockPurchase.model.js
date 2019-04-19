// StockPurchase.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const StockPurchase = new Schema({
  ticker: {
    type: String
  },
  valueAtPurchase: {
     type: Number
  },
  shares: {
     type: Number
  }
},{
    collection: 'purchases'
});


module.exports = mongoose.model('StockPurchase', StockPurchase);