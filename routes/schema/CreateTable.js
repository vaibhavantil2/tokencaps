/**
 Copyright Church of Crypto, Baron Nashor
 */

let express = require('express');
var DBConnection = require('../../models/DBModel');
const cassandra = require('cassandra-driver');
const cassandraClient = new cassandra.Client({contactPoints: ['127.0.0.1']});

module.exports = {
  // Create Coin List table, used to render top level views
  createCoinListTable: function(req, res) {
    DBConnection.getCassandraClientConnection()
      .then(function () {
        const query = "CREATE KEYSPACE IF NOT EXISTS churchdb WITH replication =" +
          "{'class': 'SimpleStrategy', 'replication_factor': '1' }";
        return cassandraClient.execute(query);
      }).then(function(){
      const deleteQuery = "DROP TABLE IF EXISTS churchdb.coins";
      return cassandraClient.execute(deleteQuery)
    }).then(function(deleteTableResponse){
      const Create_Coin_Table = "CREATE TABLE IF NOT EXISTS churchdb.coins" +
        " (TimeStamp varchar," +
        "id varchar," +
        "name varchar," +
        "symbol varchar," +
        "rank varchar," +
        "price_usd varchar," +
        "price_btc varchar," +
        "daily_volume_usd varchar," +
        "market_cap_usd varchar," +
        "available_supply varchar," +
        "total_supply varchar," +
        "percent_change_1h varchar," +
        "percent_change_24h varchar," +
        "percent_change_7d varchar," +
        "last_updated varchar," +
        "url varchar," +
        "imageurl varchar," +
        "coinname varchar," +
        "fullname varchar," +
        "algorithm varchar," +
        "prooftype varchar," +
        "fullypremined varchar," +
        "totalcoinsupply varchar," +
        "preminedvalue varchar," +
        "totalcoinsfreefloat varchar," +
        "sortorder varchar, " +
        "PRIMARY KEY(symbol))";
      return cassandraClient.execute(Create_Coin_Table);
    })
      .then(function(createTableResponse){
        console.log(cassandraClient.metadata.getTable('churchdb', 'coins'));
        return res.send({data: createTableResponse});
      })
      .catch(function (err) {
        console.error('There was an error', err);
        return cassandraClient.shutdown();
      });
  },

  // Create Coin 24 hour history table, consists of hourly data points.
  createDayHistoryTable: function(req, res, next) {
    const CREATE_DAILY_HISTORY_TABLE = "CREATE TABLE IF NOT EXISTS churchdb.daily_history_data" +
      "(symbol varchar," +
      " time timestamp," +
      "high float," +
      "low float," +
      "open float," +
      "volumefrom float," +
      "volumeto float," +
      "close float, PRIMARY KEY(symbol, time))";
    const DELETE_DAILY_HISTORY_TABLE = "DROP TABLE IF EXISTS churchdb.daily_history_data";

    cassandraClient.connect()
      .then(function () {
        return cassandraClient.execute(DELETE_DAILY_HISTORY_TABLE).then(function () {
          return cassandraClient.execute(CREATE_DAILY_HISTORY_TABLE)
        })
          .then(function (createTableResponse) {
            res.send({data: createTableResponse});
            return cassandraClient.metadata.getTable('churchdb', 'daily_history_data');

          }).catch(function (err) {
            res.send({"error": err});
          });
      });
  },

  // Create Coin 24 hour history table, consists of hourly data points.
  createCoinWeekHistoryTable: function(req, res, next) {
    const CREATE_DAILY_HISTORY_TABLE = "CREATE TABLE IF NOT EXISTS churchdb.coin_week_history_data" +
      "(symbol varchar," +
      " time timestamp," +
      "high float," +
      "low float," +
      "open float," +
      "volumefrom float," +
      "volumeto float," +
      "close float, PRIMARY KEY(symbol, time))";
    const DELETE_DAILY_HISTORY_TABLE = "DROP TABLE IF EXISTS churchdb.coin_history_data";

    cassandraClient.connect()
      .then(function () {
        return cassandraClient.execute(DELETE_DAILY_HISTORY_TABLE).then(function () {
          return cassandraClient.execute(CREATE_DAILY_HISTORY_TABLE)
        })
          .then(function (createTableResponse) {
            res.send({data: createTableResponse});
            return cassandraClient.metadata.getTable('churchdb', 'coin_history_data');

          }).catch(function (err) {
            res.send({"error": err});
          });
      });
  },

  // Create Coin Snapshot table
  createCoinSnapshotTable: function(req, res, next) {
    const CREATE_COIN_SNAPSHOT_TABLE = "CREATE TABLE IF NOT EXISTS churchdb.coin_details" +
      "(type varchar," +
      "market varchar," +
      "open24hour varchar,"+
      "fromsymbol varchar," +
      "tosymbol varchar," +
      "flags varchar," +
      "price varchar," +
      "lastupdate varchar," +
      "lastvolume varchar," +
      "lastvolumeto varchar," +
      "lasttradeid varchar," +
      "volume24hour varchar," +
      "volume24hourto varchar," +
      "openhourto varchar," +
      "high24hour varchar," +
      "low24hour varchar," +
      "PRIMARY KEY(fromsymbol, tosymbol, market))";
    const DELETE_COIN_SNAPSHOT_TABLE = "DROP TABLE IF EXISTS churchdb.coin_details";
    DBConnection.getCassandraClientConnection()
      .then(function () {
        return cassandraClient.execute(DELETE_COIN_SNAPSHOT_TABLE).then(function () {
          return cassandraClient.execute(CREATE_COIN_SNAPSHOT_TABLE)
        })
          .then(function (createTableResponse) {
            res.send({data: createTableResponse});
            return cassandraClient.metadata.getTable('churchdb', 'coin_details');
          }).catch(function (err) {
            res.send({"error": err});
          });
      });
  },

  createCoinSocialDataTable: function(req, res, next) {

  },

  createExchangeTable: function(req, res) {
    const Delete_Exchange_Table = "DROP TABLE IF EXISTS churchdb.exchanges";
    const Create_Exchange_Table = "CREATE TABLE IF NOT EXISTS churchdb.exchanges" +
      " (TimeStamp time," +
      "exch_id varchar," +
      "exch_name varchar," +
      "exch_code varchar," +
      "exch_fee varchar," +
      "exch_trade_enabled varchar," +
      "exch_balance_enabled varchar," +
      "exch_url varchar," +
      "PRIMARY KEY(exch_id))";

    cassandraClient.execute(Delete_Exchange_Table).then(function(deleteTableResponse){

      return cassandraClient.execute(Create_Exchange_Table);
    })
      .then(function(createTableResponse){
        console.log(cassandraClient.metadata.getTable('churchdb', 'exchanges'));
        return res.send({data: createTableResponse});
      })
      .catch(function (err) {
        console.error('There was an error', err);
        return cassandraClient.shutdown();
      });
  }
}