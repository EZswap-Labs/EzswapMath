<!--
 * @Descripttion : EsSwap
 * @version      : 1.0.0
 * @Author       : 0xBalance
 * @Date         : 2023-03-06 11:38:38
 * @LastEditors  : 0xBalance
 * @LastEditTime : 2023-03-06 16:31:15
-->
### EZSwapMath
此库为EzSwap计算库，计算价格使用，导出一个mathLib对象，所有得到的钱算出来都需要往下取值，所有需要付出的钱都需要往上取值，为了合约容错，一般推荐保留2-5位小数
```js
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
```

#### 使用方法
```js
mathLib[type][action]
-- type：函数类型，具体指指数型(Exponential)/线性型(Linear)
-- action: 池子类型：具体指买池(buy)/卖池(sell)/双边池(买卖池)(trade)

// 统一参数
每个方法都需要以下参数
startprice, delta, tfee, pfee, gfee, n, action
-- startprice：起始价
-- delta：偏移量，指单个数量nft跟下一个nft价格差值
-- tfee：池子的交易手续费
-- pfee：协议费
-- gfee：项目方自定的协议费，默认为0
-- n：nft数量
-- action：是创建池子(create)还是读取池子(read)
// 统一返回值
- priceData：//价格信息
   {
    delta:  偏移量，指单个数量nft跟下一个nft价格差值,
    spotPrice: 起始价,
    poolSellPrice/poolBuyPrice:n个nft池子卖价/买价,具体看池子类型,
    userBuyPrice/userSellPrice: n个nft用户卖价/买价,具体看池子类型,
    poolSellPriceFee/poolBuyPriceFee: n个nft池子卖价手续费/买价手续费,具体看池子类型,
    userBuyPriceFee/userSellPriceFee: n个nft用户卖价手续费/买价手续费,具体看池子类型,
  }
- currentPrice：
  {
    userSellPrice/userBuyPrice:当前用户卖价/用户卖价手续费,具体看池子类型,
  }
- nextPrice：
  {
    userSellPrice/userBuyPrice:第n个用户卖价/用户卖价手续费,具体看池子类型,
  }
```
#### 例子
```
//读取线性买池
mathLib.Linear.buy(1, 0.1, 0.003, 0.003, 1, 0, 'read')
{
  priceData: {
    delta: 0.1,
    spotPrice: 1,
    userSellPrice: 0.994,   --用户卖nft得到的钱
    poolBuyPrice: 0.997,    --池子买nft需要花费的钱
    poolBuyPriceFee: 0.003,
    userSellPriceFee: 0.006
  },
  currentPrice: { userSellPrice: 0.994 },   --当前价格
  nextPrice: { userSellPrice: 0.8945999999999998 }  --下一个nft的价格
}
//创建线性卖池
mathLib.Linear.sell(1, 0.1, 0.003, 0.003, 2, 0, 'create')
{
  priceData: {
    delta: 0.1,
    spotPrice: 0.8940357852882707,
    userBuyPrice: 2.1006,   --用户买2个需要花费的钱
    userBuyPriceFee: 0.01252842942345925, 
    poolSellPrice: 2.094335785288271,   --池子卖2个得到的钱
    poolSellPriceFee: 0.006264214711729625
  },
  currentPrice: { userBuyPrice: 1.1065999999999998 },
  nextPrice: { userBuyPrice: 1.3078000000000003 }
}
```