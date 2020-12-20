'use strict';

// +------+-------+---------------------------------+
// | Item | Price | Special offers                  |
// +------+-------+---------------------------------+
// | A    | 50    | 3A for 130, 5A for 200          |
// | B    | 30    | 2B for 45                       |
// | C    | 20    |                                 |
// | D    | 15    |                                 |
// | E    | 40    | 2E get one B free               |
// | F    | 10    | 2F get one F free               |
// | G    | 20    |                                 |
// | H    | 10    | 5H for 45, 10H for 80           |
// | I    | 35    |                                 |
// | J    | 60    |                                 |
// | K    | 70    | 2K for 120                      |
// | L    | 90    |                                 |
// | M    | 15    |                                 |
// | N    | 40    | 3N get one M free               |
// | O    | 10    |                                 |
// | P    | 50    | 5P for 200                      |
// | Q    | 30    | 3Q for 80                       |
// | R    | 50    | 3R get one Q free               |
// | S    | 20    | buy any 3 of (S,T,X,Y,Z) for 45 |
// | T    | 20    | buy any 3 of (S,T,X,Y,Z) for 45 |
// | U    | 40    | 3U get one U free               |
// | V    | 50    | 2V for 90, 3V for 130           |
// | W    | 20    |                                 |
// | X    | 17    | buy any 3 of (S,T,X,Y,Z) for 45 |
//  Y    | 20    | buy any 3 of (S,T,X,Y,Z) for 45 |
//  Z    | 21    | buy any 3 of (S,T,X,Y,Z) for 45 |

const products = {
  A: 50,
  B: 30,
  C: 20,
  D: 15,
  E: 40,
  F: 10,
  G: 20,
  H: 10,
  I: 35,
  J: 60,
  K: 70,
  L: 90,
  M: 15,
  N: 40,
  O: 10,
  P: 50,
  Q: 30,
  R: 50,
  S: 20,
  T: 20,
  U: 40,
  V: 50,
  W: 20,
  X: 17,
  Y: 20,
  Z: 21,
};

const combinations = [
  { products: ['S','T','X','Y','Z'], size: 3, price: 45 }

]

const transform = {
  A: bucket => {
    const higherDiscount = Math.floor(bucket.length / 5) * 50;
    const remainder = bucket.length % 5;
    const lowerDiscount = Math.floor(remainder / 3) * 20;
    return higherDiscount + lowerDiscount;
  },
  B: bucket => Math.floor(bucket.length / 2) * 15,
  H: bucket => {
    const higherDiscount = Math.floor(bucket.length / 10) * 20;
    const remainder = bucket.length % 10;
    const lowerDiscount = Math.floor(remainder / 5) * 5;
    return higherDiscount + lowerDiscount;
  },
  K: bucket => Math.floor(bucket.length / 2) * 10,
  P: bucket => Math.floor(bucket.length / 5) * 50,
  Q: bucket => Math.floor(bucket.length / 3) * 10,
  V: bucket => {
    const higherDiscount = Math.floor(bucket.length / 3) * 20;
    const remainder = bucket.length % 3;
    const lowerDiscount = Math.floor(remainder / 2) * 10;
    return higherDiscount + lowerDiscount;
  }
};

function getDiscount(sku, items, allItems) {
  const transformer = transform[sku];
  return transformer == null ? 0 : transformer(items, allItems);
}

function removeFreebies(skus) {
  // sorry reusing this for speed
  const buckets = skus.reduce((agg, current) => ({
    ...agg,
    [current]: [...(agg[current] || []), current]
  }), {});

  // 2E get one B free
  const eCount = (buckets.E || []).length;
  const freeBs = Math.floor(eCount / 2);
  const currentBs =  (buckets.B || []).length;
  const newBs = currentBs - freeBs;
  const bResult = newBs <= 0 ? [] : 'B'.repeat(newBs).split('');

  // 2F get one F free
  const fCount = (buckets.F || []).length;
  const freeFs = Math.floor(fCount / 3);
  const freeFsAbs = freeFs < 0 ? 0 : freeFs;
  const totalFs = fCount - freeFsAbs;
  const fResult = 'F'.repeat(totalFs).split('');

  // 3N get one M free
  const nCount = (buckets.N || []).length;
  const freeMs = Math.floor(nCount / 3);
  const currentMs =  (buckets.M || []).length;
  const newMs = currentMs - freeMs;
  const mResult = newMs <= 0 ? [] : 'M'.repeat(newMs).split('');

  // 3R get one Q free
  const rCount = (buckets.R || []).length;
  const freeQs = Math.floor(rCount / 3);
  const currentQs =  (buckets.Q || []).length;
  const newQs = currentQs - freeQs;
  const qResult = newQs <= 0 ? [] : 'Q'.repeat(newQs).split('');

  // 3U get one U free
  const uCount = (buckets.U || []).length;
  const freeUs = Math.floor(uCount / 4);
  const freeUsAbs = freeUs < 0 ? 0 : freeUs;
  const totalUs = uCount - freeUsAbs;
  const uResult = 'U'.repeat(totalUs).split('');

  return Object.values({
    ...buckets,
    B: bResult,
    F: fResult,
    M: mResult,
    Q: qResult,
    U: uResult,
  }).flat();
}

function calculateCost(skus) {
  return skus.reduce((total, sku) => total + products[sku], 0);
}

function calculateCombinationTotal(skus) {
  const combinationSkus = skus.filter(s => combinations.some(c => c.products.includes(s)));
  const compare = (sku1, sku2) => products[sku2] - products[sku1];
  const costDescending = combinationSkus.slice().sort(compare);

  // enhancement multiple combinations
  const combination = combinations[0];
  const dealItems = Math.floor(costDescending.length / combination.size);
  const dealItemCost = dealItems * combination.price;

  const remainingItems = costDescending.slice(dealItems);
  const remainingItemCost = calculateCost(remainingItems);

  return dealItemCost + remainingItemCost;
}

//noinspection JSUnusedLocalSymbols
module.exports = function (skusText) {
  if (skusText == null || typeof skusText !== 'string') {
    return -1;
  }

  const skus = skusText.split('');
  const validInput = skus.every(s => products[s] != null);
  if (validInput === false) {
    return -1;
  }

  if (Array.isArray(skus) === false || skus.length === 0) {
    return 0;
  }

  const removedFreeItems = removeFreebies(skus);

  const notCombinationSkus = skus.filter(s => combinations.every(c => c.products.includes(s) === false));

  const grossTotal = calculateCost(notCombinationSkus);
  const buckets = removedFreeItems.reduce((agg, current) => ({
    ...agg,
    [current]: [...(agg[current] || []), current]
  }), {});

  const discounts = Object
    .entries(buckets)
    .map(([sku, items]) => getDiscount(sku, items, buckets));

  const withDiscounts = discounts
    .reduce((total, discount) => total - discount, grossTotal);

  const combinationCost = calculateCombinationTotal(skus, combinations);
  return withDiscounts + combinationCost;
};
