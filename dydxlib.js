var compositeclient = require("./build/src/clients/composite-client").CompositeClient
var constants = require("./build/src/clients/constants")
var Network = constants.Network
var OrderExecution = constants.OrderExecution
var OrderSide = constants.OrderSide
var LocalWallet = require("./build/src/clients/modules/local-wallet").default
var subaccount = require("./build/src/clients/subaccount")
var SubaccountInfo = subaccount.SubaccountInfo
var utils = require("./build/src/lib/utils")
var randomInt = utils.randomInt
var ordersParams = require("./build/examples/human_readable_short_term_orders.json")
var IndexerClient = require('./build/src/clients/indexer-client').IndexerClient
var indexerclient = '';
// new IndexerClient(Network.mainnet().indexerConfig)
var connection = ''
var connections={connection, indexerclient}
resetconnections()
async function resetconnections() {
   compositeclient.connect(Network.mainnet()).then(i1=>{connection=i1; connections.connection=i1;})
   indexerclient = new IndexerClient(Network.mainnet().indexerConfig)
   connections.indexerclient=indexerclient
}
async function getwallet(mnemonic) {
 return LocalWallet.fromMnemonic(mnemonic,'dydx')
}

async function getclient() {
 var network = Network.mainnet()
 return compositeclient.connect(network)
}

function getsubaccount(wallet, account=0)
{
   return new SubaccountInfo(wallet, account)
}
//o = require("@dydxprotocol/v4-proto/src/codegen/dydxprotocol/clob/order")
//ordersParams = require("./examples/human_readable_orders.json")

function filterorder(o) {

}

async function placeorder({ client, account, symbol, type, side, price, amount, id})
{
    var con = client || connection
    symbol=symbol.toUpperCase()
    if(symbol.indexOf("-")==-1) { symbol = symbol.substr(0,3) + '-' + symbol.substr(3);}
    type = type.toUpperCase()
    type = type[0] == 'L' ? 'LIMIT' : 'MARKET'
   side = side.toUpperCase()
   side = side[0] == 'B'  ? "BUY" : 'SELL'
   id = id ? id : randomid(); //randomInt(constants.MAX_UINT_32)
  if(type == 'LIMIT') {
   return con.placeOrder(account, symbol, type, side, price, amount, id,'GTT', 1000002, 'DEFAULT', false, false)
 } else if(type == 'MARKET') {
   return con.placeOrder(account, symbol, type, side, price, amount, id)
 }
}

async function getblockheight() {
    return dydxlib.connections.connection.validatorClient.get.latestBlockHeight();

}

async function placeshorttermorder({account, id, symbol, side, price, amount}) {
   
   side = side[0].toUpperCase() == 'B'  ? "BUY" : 'SELL'
   var bl = await getblockheight()
  return connection.placeShortTermOrder(account, symbol, side, price, amount, id, bl + 21, 0, false)

}



async function cancelshorttermorder({account, id, symbol, blockheight=21}) {
  var bl=await getblockheight()
  
  return connection.cancelOrder(account, id, 0, symbol,bl+blockheight ,0)
}

async function cancelorder({account, id, symbol}) {
  return connection.cancelOrder(account, id, 64, symbol,0,1000003)
}

function randomid() { 
  return randomInt(constants.MAX_UINT_32)
}

async function accountinfo(address) {
  return indexerclient.account.getSubaccounts(address)
}

async function orderbook(symbol) {
  return indexerclient.markets.getPerpetualMarketOrderbook(symbol)
}
async function market(symbol) {
 return  indexerclient.markets.getPerpetualMarkets(symbol)
}
async function trades(symbol,l='10') {
 return indexerclient.markets.getPerpetualMarketTrades(symbol, Number.MAX_SAFE_INTEGER,l)
}
async function getpositions(address) {
  return indexerclient.account.getSubaccountPerpetualPositions(address,0)

}
async function availablefunds(address) {
   return indexerclient.account.getSubaccountAssetPositions(address,0)

}
async function openorders(address) {
 var r = await indexerclient.account.getSubaccountOrders(address,0)
 var r2 = r.filter(i=>i.status == 'OPEN')
 return r2
}
async function filledorders(address) {
 return indexerclient.account.getSubaccountFills(address,0)
}

module.exports = {placeshorttermorder, cancelshorttermorder, getblockheight, filledorders, openorders, availablefunds, getpositions, cancelorder, placeorder, getpositions, getwallet, getsubaccount, accountinfo, randomid, resetconnections, market, trades, orderbook, connections}
