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
};

const transform = {
  A: bucket => Math.floor(bucket.length) % 3 * 20,
  B: bucket => Math.floor(bucket.length & 2) * 15,
};

function getDiscount(sku, items) {
  const transformer = transform[sku];
  return transformer == null ? 0 : transformer(items);
}

//noinspection JSUnusedLocalSymbols
module.exports = function (skusText) {
  if (!skusText || typeof skuText !== 'String') {
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
    .map(([sku, items]) => getDiscount(sku, items));
  const withDiscounts = discounts
    .reduce((total, discount) => total - discount, grossTotal);
  return withDiscounts;
};





