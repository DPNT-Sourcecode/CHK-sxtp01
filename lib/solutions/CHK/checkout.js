'use strict';

// +------+-------+----------------+
// | Item | Price | Special offers |
// +------+-------+----------------+
// | A    | 50    | 3A for 130     |
// | B    | 30    | 2B for 45      |
// | C    | 20    |                |
// | D    | 15    |                |

const products = {
  A: 50,
  B: 30,
  C: 20,
  D: 15,
  E: 40,
};

const transform = {
  A: bucket => {
    const higherDiscount = Math.floor(bucket.length / 5) * 50;
    const remainder = bucket.length % 5;
    const lowerDiscount = Math.floor(remainder / 3) * 20;
    return higherDiscount + lowerDiscount;
  },
  B: (bucket, allBuckets) => {
    const eCount = (allBuckets.E || []).length;
    console.log('eCount', eCount);
    const freeBs = Math.floor(eCount / 2);
    console.log('freeBs', freeBs);
    const remainingBs = (bucket.length - freeBs);
    console.log('remainingBs', remainingBs);
    if (remainingBs <= 0) {
      return 0;
    }

    return Math.floor(remainingBs / 2) * 15
  }
};

function getDiscount(sku, items, allItems) {
  const transformer = transform[sku];
  return transformer == null ? 0 : transformer(items, allItems);
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

  const grossTotal = skus.reduce((total, sku) => total + products[sku], 0);
  const buckets = skus.reduce((agg, current) => ({
    ...agg,
    [current]: [...(agg[current] || []), current]
  }), {});

  const discounts = Object
    .entries(buckets)
    .map(([sku, items]) => getDiscount(sku, items, buckets));
  const withDiscounts = discounts
    .reduce((total, discount) => total - discount, grossTotal);
  return withDiscounts;
};


