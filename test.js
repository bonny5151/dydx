

d = require("./dydxlib.js")
wallet =await  d.getwallet( require("../../../config/config.json").dydx)
account = d.getsubaccount(wallet)
var orderid = d.randomid()
aa = await d.placeorder({account, symbol: "ETH-USD", amount: .03, price: 2900, type: 'l', side: "b", id: orderid})
a = await d.openorders(account.address)
aa = await d.cancelorder({account,id: orderid, symbol: 'ETH-USD'})
aa = await d.placeorder({account, symbol: "ETH-USD", amount: .001, price: 3300, type: 'm', side: "b", id: 8796544})
aa = await d.placeorder({account, symbol: "ETH-USD", amount: .001, price: 2900, type: 'm', side: "s", id: 8796544})
