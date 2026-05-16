import { productCanCheckoutLite, productRequiresQuote, validateProductForCatalog, sampleCommerceProducts } from "@stax/product-catalog";
test("quote-required products cannot checkout-lite",()=>{const p=sampleCommerceProducts[0]; expect(productRequiresQuote(p)).toBe(true); expect(productCanCheckoutLite(p)).toBe(false);});
test("commodity eligible products can enter checkout-lite",()=>{const p=sampleCommerceProducts[1]; expect(productCanCheckoutLite(p)).toBe(true);});
test("catalog validation flags contradictory quote/checkout",()=>{expect(validateProductForCatalog({...sampleCommerceProducts[0], checkoutEligible:true}).length).toBeGreaterThan(0);});
