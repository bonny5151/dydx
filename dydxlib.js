var i = require("./src")
var prefix = i.BECH32_PREFIX
compositeclient = require("./src/clients/composite-client").CompositeClient
 constants = require("./src/clients/constants")
 Network = constants.Network
OrderExecution = constants.OrderExecution
OrderSide = constants.OrderSide
LocalWallet = require("./src/clients/modules/local-wallet").default
var subaccount = require("./src/clients/subaccount")
var SubaccountInfo = subaccount.SubaccountInfo
var utils = require("./src/lib/utils")
var randomInt = utils.randomInt
var ordersParams = require("./examples/human_readable_short_term_orders.json")
IndexerClient = require('./src/clients/indexer-client').IndexerClient
indexerclient = new IndexerClient(Network.mainnet().indexerConfig)
connection = ''
compositeclient.connect(Network.mainnet()).then(i1=>connection=i1)

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

async function cancelorder({account, id, symbol}) {
  return connection.cancelOrder(account, id, 64, symbol,0,1000003)
}

function randomid() { 
  return randomInt(constants.MAX_UINT_32)
}

async function accountinfo(address) {
  return indexerclient.account.getSubaccounts(address)
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

module.exports = {filledorders, openorders, availablefunds, getpositions, cancelorder, placeorder, getpositions, getwallet, getsubaccount, accountinfo, randomid}
