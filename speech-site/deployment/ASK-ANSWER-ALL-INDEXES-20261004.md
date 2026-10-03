# Ask answer release: complete search notification

Completed 4 October 2026, 01:14 IST (3 October, 19:44 UTC).

## Scope and result

- Live public sitemap inventory: **40,170 answer URLs**, **17 navigation URLs**, **478 topic URLs**; **40,665 distinct URLs** total. Seven child sitemaps fetched and parsed successfully.
- **Google:** refreshed Ask sitemap submitted through GSC Wizard; accepted and confirmed at `2026-10-03T19:40:16.541Z`, pending download. This sitemap index includes all seven child maps. No unsupported use of Google's job/livestream Indexing API.
- **Bing:** existing Ask sitemap feed reported Success and a 3 October crawl/submission date. Changed-answer notification sent through IndexNow, which distributes to participating engines.
- **IndexNow:** **40,166 newly accepted URLs**, five requests of 10,000 / 10,000 / 10,000 / 10,000 / 166; **HTTP 200 on every request**, matching public site key verified. Four answers already accepted for this exact content release through GSC Wizard were excluded. Coverage is **40,170 of 40,170 published answers**.
- Bulk notification used `https://api.indexnow.org/indexnow` directly because the GSC Wizard tool accepts at most 100 URLs per call, while the official protocol accepts 10,000. The result is recorded in GSC Wizard annotation `64f30f60-d411-40b3-9641-da5c374b1d46`.
- **OpenAI/Claude:** official publisher/crawler guidance does not document an equivalent public bulk URL indexing endpoint. No direct submission to these services is claimed. Google AI features use Google's crawling/indexing system; no separate submission was invented.

No site code, authentication, databases, routes, common header/footer or deployment changed during this submission task.

## Evidence and repeat protection

- `ask-answer-all-indexnow-20261004.json`: live sitemap counts/hashes, exact 40,166-URL manifest, excluded URLs and manifest hash.
- `ask-answer-all-indexnow-20261004-batch-1.json` through `-batch-5.json`: timestamp, URL slice/hash, key verification and actual endpoint response.
- `ask-answer-all-gscwizard-20261004.json`: Google receipt, Bing feed snapshot, prior accepted URLs and GSC Wizard annotation.
- `../scripts/submit-ask-answer-indexnow.py`: separate prepare/submit actions. Records attempted batches before sending, skips exact already accepted batches, stops on uncertain/rejected responses. This manifest belongs to the v14 content/v15 cache release; do not reuse it as a reason to resubmit unchanged URLs.

## Next meaningful check

After Google has had time to download the refreshed sitemap, inspect its download/error status and a small set of representative answers for a crawl after the release. Use search performance and referral/call measurements separately. Notification acceptance is not proof of recrawl, indexing, ranking, AI citation or leads. No failed batch remains and no user action is required for this submission.

## Protocol references

- [IndexNow documentation](https://www.indexnow.org/documentation) and [sharing FAQ](https://www.indexnow.org/faq)
- [Google: request recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Google Indexing API supported content](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler guidance](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
