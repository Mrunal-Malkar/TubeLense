import DodoPayments from 'dodopayments';

const client = new DodoPayments({
  bearerToken: import.meta.env['VITE_DODO_PRICE_API_KEY'], // This is the default and can be omitted
});

const listLocalizedPricesResponse = await client.products.localizedPrices.list(
 import.meta.env['VITE_PRODUCT_ID']
);

console.log(listLocalizedPricesResponse.items);

export {client,listLocalizedPricesResponse};