/*
 * @Descripttion : EsSwap计算逻辑，前端显示永远都是显示带buy的字段,买价的时候往上取值，卖价向下取值，后端计算永远都是带sell的字段,
 * @version      : 1.0.0
 * @Author       : 0xBalance
 * @Date         : 2022-11-30 12:42:04
 * @LastEditors  : 0xBalance
 * @LastEditTime : 2023-03-06 12:56:21
 */
// 等差数列求和
function liner (n, delta) {
  return n * (n - 1) * delta / 2
}
// 买池(线性)
function BuyPoolLiner (startprice, delta, tfee, pfee, n = 1, action = 'read') {
  const spotPrice = action === 'read' ? startprice : startprice
  const poolBuyPrice = (startprice * n - liner(n, delta)) * (1 - tfee)
  const poolBuyPriceFee = (startprice * n - liner(n, delta)) * tfee
  const userSellPrice = (startprice * n - liner(n, delta)) * (1 - tfee - pfee)
  const userSellPriceFee = (startprice * n - liner(n, delta)) * (tfee + pfee)
  return {
    delta: delta,
    spotPrice: spotPrice,
    userSellPrice: userSellPrice,
    poolBuyPrice: poolBuyPrice,
    poolBuyPriceFee: poolBuyPriceFee,
    userSellPriceFee: userSellPriceFee
  }
}
// 获取买池当前价格(线性)
function getBuyPoolLinerPrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  return {
    userSellPrice: BuyPoolLiner(spotPrice, delta, tfee, pfee, n, action).userSellPrice
  }
}
// 获取买池买n个后的当前价格(线性)
function getBuyPoolLinerNextPrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  const curren = BuyPoolLiner(spotPrice, delta, tfee, pfee, n + 1, action)
  const last = BuyPoolLiner(spotPrice, delta, tfee, pfee, n, action)
  return {
    userSellPrice: curren.userSellPrice - last.userSellPrice
  }
}
// 创建卖池(线性)
function SellPoolLiner (startprice, delta, tfee, pfee, n = 1, action = 'read') {
  const spotPrice = action === 'read' ? startprice : startprice / (1 + tfee + pfee) - delta
  const newSpotPrice = spotPrice + delta
  const poolSellPrice = (n * newSpotPrice + liner(n, delta)) * (1 + tfee)
  const poolSellPriceFee = (n * newSpotPrice + liner(n, delta)) * tfee
  const userBuyPrice = (n * newSpotPrice + liner(n, delta)) * (1 + tfee + pfee)
  const userBuyPriceFee = (n * newSpotPrice + liner(n, delta)) * (tfee + pfee)
  return {
    delta: delta,
    spotPrice: spotPrice,
    userBuyPrice: userBuyPrice,
    userBuyPriceFee: userBuyPriceFee,
    poolSellPrice: poolSellPrice,
    poolSellPriceFee: poolSellPriceFee
  }
}
// 获取卖池当前价格(线性)
function getSellPoolLinerPrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  return {
    userBuyPrice: SellPoolLiner(spotPrice, delta, tfee, pfee, n, action).userBuyPrice
  }
}
// 获取卖池n个后的当前价格(线性)
function getSellPoolLinerNextPrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  const curren = SellPoolLiner(spotPrice, delta, tfee, pfee, n + 1, action)
  const last = SellPoolLiner(spotPrice, delta, tfee, pfee, n, action)
  return {
    userBuyPrice: curren.userBuyPrice - last.userBuyPrice
  }
}
// 双边池(线性)
function TradePoolLiner (startprice, delta, tfee, pfee, n = 1, action = 'read') {
  const spotPrice = action === 'read' ? startprice : startprice / (1 + tfee + pfee) - delta
  const newspotPrice = spotPrice + delta
  const poolBuylPrice = (n * spotPrice - liner(n, delta)) * (1 - tfee)
  const userSellPrice = (n * spotPrice - liner(n, delta)) * (1 - pfee - tfee)
  const poolSellPrice = (n * newspotPrice + liner(n, delta)) * (1 + tfee)
  const userBuyPrice = (n * newspotPrice + liner(n, delta)) * (1 + pfee + tfee)
  const poolBuylPriceFee = (n * spotPrice - liner(n, delta)) * tfee
  const userSellPriceFee = (n * spotPrice - liner(n, delta)) * (tfee + pfee)
  const poolSellPriceFee = (n * newspotPrice + liner(n, delta)) * tfee
  const userBuyPriceFee = (n * newspotPrice + liner(n, delta)) * (tfee + pfee)
  return {
    delta: delta,
    spotPrice: spotPrice,
    poolBuylPrice: poolBuylPrice,
    userSellPrice: userSellPrice,
    poolSellPrice: poolSellPrice,
    userBuyPrice: userBuyPrice,
    poolBuylPriceFee: poolBuylPriceFee,
    userSellPriceFee: userSellPriceFee,
    poolSellPriceFee: poolSellPriceFee,
    userBuyPriceFee: userBuyPriceFee
  }
}
// 获取双边池当前价格(线性)
function getTradePoolLinerPrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  const curren = TradePoolLiner(spotPrice, delta, tfee, pfee, n, action)
  return {
    userSellPrice: curren.userSellPrice,
    userBuyPrice: curren.userBuyPrice
  }
}
// 获取双边池n个后的当前价格(线性)
function getTradePoolLinerNextPrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  const curren = TradePoolLiner(spotPrice, delta, tfee, pfee, n + 1, action)
  const last = TradePoolLiner(spotPrice, delta, tfee, pfee, n, action)
  return {
    userSellPrice: curren.userSellPrice - last.userSellPrice,
    userBuyPrice: curren.userBuyPrice - last.userBuyPrice
  }
}
// 买池(指数)
function BuyPoolExpone (startprice, delta, tfee, pfee, n = 1, action = 'read') {
  const spotPrice = action === 'read' ? startprice : startprice
  const q = action === 'read' ? delta : 1 / ((100 - delta) / 100)
  const poolBuyPrice = spotPrice * (1 / q ** n - 1) / (1 / q - 1) * (1 - tfee)
  const poolBuyPriceFee = spotPrice * (1 / q ** n - 1) / (1 / q - 1) * tfee
  const userSellPrice = spotPrice * (1 / q ** n - 1) / (1 / q - 1) * (1 - tfee - pfee)
  const userSellPriceFee = spotPrice * (1 / q ** n - 1) / (1 / q - 1) * (tfee + pfee)
  return {
    delta: q,
    spotPrice: spotPrice,
    userSellPrice: userSellPrice,
    poolBuyPrice: poolBuyPrice,
    userSellPriceFee: userSellPriceFee,
    poolBuyPriceFee: poolBuyPriceFee
  }
}
// 获取买池当前价格(指数)
function getBuyPoolExponePrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  return {
    userSellPrice: BuyPoolExpone(spotPrice, delta, tfee, pfee, n, action).userSellPrice
  }
}
// 获取买池n个后的价格(指数)
function getBuyPoolExponeNextPrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  const curren = BuyPoolExpone(spotPrice, delta, tfee, pfee, n + 1, action)
  const last = BuyPoolExpone(spotPrice, delta, tfee, pfee, n, action)
  return {
    userSellPrice: curren.userSellPrice - last.userSellPrice
  }
}
// 卖池(指数)
function SellPoolExpone (startprice, delta, tfee, pfee, n = 1, action = 'read') {
  const q = action === 'read' ? delta : 1 * ((100 + delta) / 100)
  const spotPrice = action === 'read' ? startprice : startprice / (1 + pfee + tfee) / q
  const newspotPrice = spotPrice * q
  const poolSellPrice = newspotPrice * (q ** n - 1) / (q - 1) * (1 + tfee)
  const poolSellPriceFee = newspotPrice * (q ** n - 1) / (q - 1) * tfee
  const userBuyPrice = newspotPrice * (q ** n - 1) / (q - 1) * (1 + tfee + pfee)
  const userBuyPriceFee = newspotPrice * (q ** n - 1) / (q - 1) * (tfee + pfee)
  return {
    delta: q,
    spotPrice: spotPrice,
    poolSellPrice: poolSellPrice,
    userBuyPrice: userBuyPrice,
    poolSellPriceFee: poolSellPriceFee,
    userBuyPriceFee: userBuyPriceFee
  }
}
// 获取卖池当前价格(指数)
function getSellPoolExponePrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  return {
    userBuyPrice: SellPoolExpone(spotPrice, delta, tfee, pfee, n, action).userBuyPrice
  }
}
// 获取卖池n个后的价格(指数)
function getSellPoolExponeNextPrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  const curren = SellPoolExpone(spotPrice, delta, tfee, pfee, n + 1, action)
  const last = SellPoolExpone(spotPrice, delta, tfee, pfee, n, action)
  return {
    userBuyPrice: curren.userBuyPrice - last.userBuyPrice
  }
}
// 双边池(指数)
function TradePoolExpone (startprice, delta, tfee, pfee, n = 1, action = 'read') {
  const q = action === 'read' ? delta : 1 * ((100 + delta) / 100)
  const spotPrice = action === 'read' ? startprice : startprice / (1 + tfee + pfee) / q
  const newSpotPrice = spotPrice * q
  let poolBuylPrice, userSellPrice, poolSellPrice, userBuyPrice, poolBuylPriceFee, userSellPriceFee, poolSellPriceFee, userBuyPriceFee
  switch (q) {
    case 1:
      poolBuylPrice = (spotPrice * n) * (1 - tfee)
      poolBuylPriceFee = (spotPrice * n) * tfee
      userSellPrice = (spotPrice * n) * (1 - tfee - pfee)
      userSellPriceFee = (spotPrice * n) * (tfee + pfee)
      poolSellPrice = (newSpotPrice * n) * (1 + tfee)
      poolSellPriceFee = (newSpotPrice * n) * tfee
      userBuyPrice = (newSpotPrice * n) * (1 + tfee + pfee)
      userBuyPriceFee = (newSpotPrice * n) * (tfee + pfee)
      break
    default:
      poolBuylPrice = (spotPrice * ((1 / q) ** n - 1) / (1 / q - 1)) * (1 - tfee)
      poolBuylPriceFee = (spotPrice * ((1 / q) ** n - 1) / (1 / q - 1)) * tfee
      userSellPrice = (spotPrice * ((1 / q) ** n - 1) / (1 / q - 1)) * (1 - tfee - pfee)
      userSellPriceFee = (spotPrice * ((1 / q) ** n - 1) / (1 / q - 1)) * (tfee + pfee)
      poolSellPrice = (newSpotPrice * (q ** n - 1) / (q - 1)) * (1 + tfee)
      poolSellPriceFee = (newSpotPrice * (q ** n - 1) / (q - 1)) * tfee
      userBuyPrice = (newSpotPrice * (q ** n - 1) / (q - 1)) * (1 + tfee + pfee)
      userBuyPriceFee = (newSpotPrice * (q ** n - 1) / (q - 1)) * (tfee + pfee)
      break
  }
  return {
    delta: q,
    spotPrice: spotPrice,
    poolBuylPrice: poolBuylPrice,
    userSellPrice: userSellPrice,
    poolSellPrice: poolSellPrice,
    userBuyPrice: userBuyPrice,
    poolBuylPriceFee: poolBuylPriceFee,
    userSellPriceFee: userSellPriceFee,
    poolSellPriceFee: poolSellPriceFee,
    userBuyPriceFee: userBuyPriceFee
  }
}
// 获取双边池当前价格(指数)
function getTradePoolExponePrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  const curren = TradePoolExpone(spotPrice, delta, tfee, pfee, n, action)
  return {
    userSellPrice: curren.userSellPrice,
    userBuyPrice: curren.userBuyPrice
  }
}
// 获取卖双边池n个后的价格(指数)
function getTradePoolExponeNextPrice (spotPrice, delta, tfee, pfee, n = 1, action = 'read') {
  const curren = TradePoolExpone(spotPrice, delta, tfee, pfee, n + 1, action)
  const last = TradePoolExpone(spotPrice, delta, tfee, pfee, n, action)
  return {
    userSellPrice: curren.userSellPrice - last.userSellPrice,
    userBuyPrice: curren.userBuyPrice - last.userBuyPrice
  }
}

export const mathLib = {
  Linear: {
    buy: (startprice, delta, tfee, pfee, gfee, n, action = 'read') => {
      pfee = pfee + gfee
      return {
        priceData: BuyPoolLiner(startprice, delta, tfee, pfee, n, action),
        currentPrice: getBuyPoolLinerPrice(startprice, delta, tfee, pfee),
        nextPrice: getBuyPoolLinerNextPrice(startprice, delta, tfee, pfee, n)
      }
    },
    sell: (startprice, delta, tfee, pfee, gfee, n, action = 'read') => {
      pfee = pfee + gfee
      return {
        priceData: SellPoolLiner(startprice, delta, tfee, pfee, n, action),
        currentPrice: getSellPoolLinerPrice(startprice, delta, tfee, pfee),
        nextPrice: getSellPoolLinerNextPrice(startprice, delta, tfee, pfee, n)
      }
    },
    trade: (startprice, delta, tfee, pfee, gfee, n, action = 'read') => {
      pfee = pfee + gfee
      return {
        priceData: TradePoolLiner(startprice, delta, tfee, pfee, n, action),
        currentPrice: getTradePoolLinerPrice(startprice, delta, tfee, pfee),
        nextPrice: getTradePoolLinerNextPrice(startprice, delta, tfee, pfee, n)
      }
    }
  },
  Exponential: {
    buy: (startprice, delta, tfee, pfee, gfee, n, action = 'read') => {
      pfee = pfee + gfee
      return {
        priceData: BuyPoolExpone(startprice, delta, tfee, pfee, n, action),
        currentPrice: getBuyPoolExponePrice(startprice, delta, tfee, pfee),
        nextPrice: getBuyPoolExponeNextPrice(startprice, delta, tfee, pfee, n)
      }
    },
    sell: (startprice, delta, tfee, pfee, gfee, n, action = 'read') => {
      pfee = pfee + gfee
      return {
        priceData: SellPoolExpone(startprice, delta, tfee, pfee, n, action),
        currentPrice: getSellPoolExponePrice(startprice, delta, tfee, pfee),
        nextPrice: getSellPoolExponeNextPrice(startprice, delta, tfee, pfee, n)
      }
    },
    trade: (startprice, delta, tfee, pfee, gfee, n, action = 'read') => {
      pfee = pfee + gfee
      return {
        priceData: TradePoolExpone(startprice, delta, tfee, pfee, n, action),
        currentPrice: getTradePoolExponePrice(startprice, delta, tfee, pfee),
        nextPrice: getTradePoolExponeNextPrice(startprice, delta, tfee, pfee, n)
      }
    }
  }
}
