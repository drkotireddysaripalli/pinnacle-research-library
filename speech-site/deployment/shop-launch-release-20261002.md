# Pinnacle bookshop — live release, 2 October 2026

Live: https://www.pinnacleblooms.org/shop

- Four single ebooks, six pairs and the four-book collection: ₹799 / ₹1,399 / ₹2,499.
- Shared rich cart across /shop, /books and all 33 product pages: covers, samples, exact contents, download guidance, authors, phone/email support, scoped MD-5/BIS source links, duplicate-book warning.
- 11 PDF variants available; 22 printed variants remain out of stock.
- Shopify Basic active; public store at https://pinnacleblooms.myshopify.com. All 11 products Active and published; 20 file assignments observed.
- Checkout wordmark at 220px and teal #087D83 button saved. Shopify Basic supports native branding; rich evidence belongs in the preceding cart.
- Full Razorpay gateway observed Active, including UPI, cards, netbanking and wallets. The failing duplicate Cards Onsite provider was deactivated; its settings now show Activate.
- Earlier ₹799 card-only attempt failed: BAD_REQUEST_ERROR, business, payment_initiation, input_validation_failed; dashboard category Invalid amount / fee. This does not establish a bank/card rejection.
- Razorpay dashboard also displayed incomplete KYC resubmission. Current completion is not confirmed.
- A successful captured payment and download email remain unverified. No successful-payment or Merchant approval claim is made.

Source tree is identical between local commit 573bd87 and connected GitHub commit 2487f49dc124d04348df483f2b27c270f97befd1. CLI push lacked credentials; the existing authorized GitHub connector published the same tree. CI 36998721356 passed. Worker 03b72433-fee0-4374-9f7f-21febc56ab77 deployed at 100%; 182 prior routes and four bindings preserved, two /shop routes added.

Validation: 92 Astro files with zero type errors; 117 unit checks; 12 responsive browser checks, then three focused checks after the collection-navigation fix; exact-source CI with Chromium/Firefox/WebKit; public live-cart browser check passed. Screenshots inspected at phone/tablet/desktop. These are automated/browser checks, not real customer feedback or a payment test.
