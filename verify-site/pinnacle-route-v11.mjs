// Cache only public static output from the generated inventory. Other routes retain their origin behavior.
const ORIGIN='https://pinnacle-verify.saripalli.chatgpt.site';
const PUBLIC='https://www.pinnacleblooms.org/verify';
const PREFIX='/verify';
const RELEASE = "3fb4d77a66085582";
const HTML_PATHS = ["/evidence/assurance-map.html","/evidence/centre-entity-reference.html","/evidence/cite.html","/evidence/claim-ledger.html","/evidence/dataset-reuse-v1.html","/evidence/district-register.html","/evidence/evidence-register.html","/evidence/global-context.html","/evidence/hfr-register.html","/evidence/hyderabad-telangana-andhra-pradesh-contact.html","/evidence/organisation-profile.html","/evidence/paradigm/01-life-in-view.html","/evidence/paradigm/02-shared-starting-point.html","/evidence/paradigm/03-plan-with-a-memory.html","/evidence/paradigm/04-one-shared-direction.html","/evidence/paradigm/05-practice-in-everyday-life.html","/evidence/paradigm/06-feedback-that-shapes-care.html","/evidence/paradigm/07-skills-with-a-purpose.html","/evidence/paradigm/08-review-and-reassess.html","/evidence/paradigm/09-independence-and-belonging.html","/evidence/pinnacle-paradigm-shift.html","/evidence/pinnacleai-regulatory-journey.html","/evidence/privacy.html","/evidence/publications/autism-mothers-handbook-english.html","/evidence/publications/autism-mothers-handbook-telugu.html","/evidence/publications/voice-of-the-unheard.html","/evidence/publications/zenodo-15487405.html","/evidence/publications/zenodo-19482123.html","/evidence/publications/zenodo-19482476.html","/evidence/publications/zenodo-22761782.html","/evidence/publications/zenodo-22761810.html","/evidence/publications/zenodo-22761832.html","/evidence/publications/zenodo-22827813.html","/evidence/recognition-register.html","/evidence/records/appreciations.html","/evidence/records/awards.html","/evidence/records/bis.html","/evidence/records/books.html","/evidence/records/classification.html","/evidence/records/district-register.html","/evidence/records/dossier.html","/evidence/records/dpiit.html","/evidence/records/external-validation.html","/evidence/records/fsc.html","/evidence/records/gst.html","/evidence/records/hfr.html","/evidence/records/iso13485.html","/evidence/records/iso27001.html","/evidence/records/lei.html","/evidence/records/marks-copyright.html","/evidence/records/mca.html","/evidence/records/md3.html","/evidence/records/md5.html","/evidence/records/methodology.html","/evidence/records/operating-metrics.html","/evidence/records/outcome-claim.html","/evidence/records/pan.html","/evidence/records/patents.html","/evidence/records/pinnacleai-story.html","/evidence/records/rpwd-attapur.html","/evidence/records/rpwd-begumpet.html","/evidence/records/rpwd-nellore.html","/evidence/records/rpwd-nizamabad.html","/evidence/records/sae3000.html","/evidence/records/september-handout.html","/evidence/records/sovereign-walkthrough.html","/evidence/records/srs4400.html","/evidence/records/study-portfolio.html","/evidence/records/udyam.html","/evidence/records/whitebook.html","/evidence/research-library.html","/evidence/scale-and-mission.html","/evidence/scale-register.html","/evidence/study-index.html","/guides/abilityscore.html","/guides/everyday-practice.html","/guides/hi/abilityscore.html","/guides/hi/everyday-practice.html","/guides/hi/licences-and-scope.html","/guides/licences-and-scope.html","/guides/te/abilityscore.html","/guides/te/everyday-practice.html","/guides/te/licences-and-scope.html","/index.html"];
const STATIC_FILES = {"/9eccddfeede58a1e7db0a8a2aa8286ab.txt":"e459f273fde67f1e","/THIRD-PARTY-NOTICES.txt":"5be896659505b278","/_assets/app.15ecc20500cf04ac.js":"15ecc20500cf04ac","/_assets/app.d0b6f1ecbbbb2a4f.js":"d0b6f1ecbbbb2a4f","/_assets/app.ef44e8029a4c4ca1.js":"ef44e8029a4c4ca1","/_assets/app.f2557d78d5adcd4e.js":"f2557d78d5adcd4e","/_assets/centre-data.27607d5693266526.js":"27607d5693266526","/_assets/citations.af0d2f3218056d4c.js":"af0d2f3218056d4c","/_assets/evidence-data.00b69726fac9596a.js":"00b69726fac9596a","/_assets/evidence-data.9b8ec400de89bb5a.js":"9b8ec400de89bb5a","/_assets/experience.04adc19045923732.js":"04adc19045923732","/_assets/experience.0c8421e20514e0a0.js":"0c8421e20514e0a0","/_assets/experience.cfd31930b3e71b4c.js":"cfd31930b3e71b4c","/_assets/finale.00db04f258c1a3d9.css":"00db04f258c1a3d9","/_assets/finale.05023cb8dd7490a6.css":"05023cb8dd7490a6","/_assets/finale.18283cbe0750069d.css":"18283cbe0750069d","/_assets/finale.41202403f6cb939f.css":"41202403f6cb939f","/_assets/finale.4ee765eb17944ee2.js":"4ee765eb17944ee2","/_assets/finale.7c522e1db0b26a83.css":"7c522e1db0b26a83","/_assets/finale.90eb7b1f81084e4f.css":"90eb7b1f81084e4f","/_assets/finale.eb88d8798945a7df.js":"eb88d8798945a7df","/_assets/finale.fd69fa284b369738.css":"fd69fa284b369738","/_assets/hfr-register.28cddf4109b868a4.js":"28cddf4109b868a4","/_assets/hfr-register.2b06d3d9ba5f9e55.js":"2b06d3d9ba5f9e55","/_assets/hfr-register.6d7dea268ff5b033.js":"6d7dea268ff5b033","/_assets/paradigm-opening.6c5e00df93364a61.js":"6c5e00df93364a61","/_assets/paradigm-story.63e296ecab669f4c.js":"63e296ecab669f4c","/_assets/reader-extras.1044c63603f7e0c5.js":"1044c63603f7e0c5","/_assets/reader-extras.17eecc7b7f093deb.js":"17eecc7b7f093deb","/_assets/reader-extras.1f968689d7cd330e.js":"1f968689d7cd330e","/_assets/reader-extras.9c5444bd34caead9.js":"9c5444bd34caead9","/_assets/reader-extras.a8a9b9cf48cc7bc5.js":"a8a9b9cf48cc7bc5","/_assets/reader-extras.da9fc8e2f1c3f111.js":"da9fc8e2f1c3f111","/_assets/reader-extras.f173bd0c358116c4.js":"f173bd0c358116c4","/_assets/reader.40452271b3332f86.js":"40452271b3332f86","/_assets/reader.6847028d3e806f76.js":"6847028d3e806f76","/_assets/reader.b04b8d8e45b5a09b.js":"b04b8d8e45b5a09b","/_assets/reader.b0b7d4bf6b1c6eb7.js":"b0b7d4bf6b1c6eb7","/_assets/reader.ea5c3a378ca32ebe.js":"ea5c3a378ca32ebe","/_assets/share.165b17381d658d30.js":"165b17381d658d30","/_assets/share.3936a806e90bd233.js":"3936a806e90bd233","/_assets/share.98d18703a909a044.js":"98d18703a909a044","/_assets/site.04c2398fe00a1568.css":"04c2398fe00a1568","/_assets/site.061074e50cd66969.css":"061074e50cd66969","/_assets/site.08d9c2c283dcaafd.css":"08d9c2c283dcaafd","/_assets/site.0e937e03ab8495e9.css":"0e937e03ab8495e9","/_assets/site.114ffbff42148bc7.css":"114ffbff42148bc7","/_assets/site.183b6aa4a5ad4891.css":"183b6aa4a5ad4891","/_assets/site.1f4052f0f152230c.css":"1f4052f0f152230c","/_assets/site.20d5e4654690d6dd.css":"20d5e4654690d6dd","/_assets/site.2c1f199ae715085a.css":"2c1f199ae715085a","/_assets/site.355eda3362219504.css":"355eda3362219504","/_assets/site.37048f325c3ca38d.css":"37048f325c3ca38d","/_assets/site.382a7118ab5be693.css":"382a7118ab5be693","/_assets/site.398b9f022f22f675.css":"398b9f022f22f675","/_assets/site.3f04e970f2604559.css":"3f04e970f2604559","/_assets/site.3fdc21dd23d709b3.css":"3fdc21dd23d709b3","/_assets/site.497b3377b4fcd2ed.css":"497b3377b4fcd2ed","/_assets/site.4f787eae3f8b36e1.css":"4f787eae3f8b36e1","/_assets/site.50f3507259aeef19.css":"50f3507259aeef19","/_assets/site.568ce1da0d3dc08f.css":"568ce1da0d3dc08f","/_assets/site.584ba2304a10ec2f.css":"584ba2304a10ec2f","/_assets/site.59ae78f388f512ef.css":"59ae78f388f512ef","/_assets/site.6dfa7df75f1dd08c.css":"6dfa7df75f1dd08c","/_assets/site.7dfc7eb6d583f77c.css":"7dfc7eb6d583f77c","/_assets/site.83201482b64cc036.css":"83201482b64cc036","/_assets/site.9563d0d35438284c.css":"9563d0d35438284c","/_assets/site.9a4c4c4fa2aa2363.css":"9a4c4c4fa2aa2363","/_assets/site.9d275bee690cc1f9.css":"9d275bee690cc1f9","/_assets/site.b25f41a401c9712e.css":"b25f41a401c9712e","/_assets/site.c5d37ea3a8e22bf6.css":"c5d37ea3a8e22bf6","/_assets/site.c85810ee528d3ac2.css":"c85810ee528d3ac2","/_assets/site.cd2b4d5224a1606c.css":"cd2b4d5224a1606c","/_assets/site.cf76794fe2ea29f0.css":"cf76794fe2ea29f0","/_assets/site.d0cc0fb620b7713c.css":"d0cc0fb620b7713c","/_assets/site.d195f2ed1b894eda.css":"d195f2ed1b894eda","/_assets/site.d202fe4d252a0901.css":"d202fe4d252a0901","/_assets/site.d246e5107cd77cfd.css":"d246e5107cd77cfd","/_assets/site.d56ea042f7ed6b91.css":"d56ea042f7ed6b91","/_assets/site.d7816c4601087be7.css":"d7816c4601087be7","/_assets/site.e0086641ea259dfb.css":"e0086641ea259dfb","/_assets/site.e3197761c71999ae.css":"e3197761c71999ae","/_assets/site.e67352ad0a214267.css":"e67352ad0a214267","/_assets/site.ee8a13cc3918a80a.css":"ee8a13cc3918a80a","/_assets/site.f2feab0435e74736.css":"f2feab0435e74736","/_assets/site.fde72847262fea60.css":"fde72847262fea60","/_assets/site.fe8144290a1989af.css":"fe8144290a1989af","/app.js":"ef44e8029a4c4ca1","/brand-header.jpg":"ca02e873f06273be","/centre-data.js":"bce6f50db5576803","/citations.css":"dc3efce071c72ea7","/citations.js":"af0d2f3218056d4c","/evidence-data.js":"84b564fcd8bb4979","/evidence-design.css":"29bc3acf2fc9ee16","/evidence/answers.json":"c3b4840c575e8c60","/evidence/assurance-map.html":"d219b0b9a5b68ea3","/evidence/assurance-map.json":"b50bf1eefc1cc765","/evidence/assurance-map.txt":"8ef4786922b8ebe1","/evidence/bis.pdf":"91abd06c40e11018","/evidence/books/autism-mothers-handbook-english.pdf":"ee6da521dfa35987","/evidence/books/autism-mothers-handbook-telugu.pdf":"bd5ba04d7c64b08f","/evidence/books/voice-of-the-unheard.pdf":"cc1500b2356035c2","/evidence/centre-entity-reference.html":"0cbf7a904efe5d67","/evidence/centre-entity-reference.json":"4ef151904dc94364","/evidence/centre-entity-reference.txt":"9c654921c93f2c9a","/evidence/citation-index.json":"d8876507b6261283","/evidence/citations/autism-mothers-handbook-english.bib":"94cfc91edc79fa8a","/evidence/citations/autism-mothers-handbook-english.ris":"cdf7a72d2345c9c2","/evidence/citations/autism-mothers-handbook-english.txt":"b1862adfe948ea35","/evidence/citations/autism-mothers-handbook-telugu.bib":"49044c7d3e6b2854","/evidence/citations/autism-mothers-handbook-telugu.ris":"c897a7ac873cb01c","/evidence/citations/autism-mothers-handbook-telugu.txt":"ae0e8f6e91287684","/evidence/citations/pinnacleai-regulatory-journey.bib":"efb542a995c7466e","/evidence/citations/pinnacleai-regulatory-journey.ris":"e59c5b0259fb5c6e","/evidence/citations/pinnacleai-regulatory-journey.txt":"afd7ee7db151537f","/evidence/citations/record-appreciations.bib":"b555833028021781","/evidence/citations/record-appreciations.ris":"7d9b997c69e183c4","/evidence/citations/record-appreciations.txt":"981276ff4802f378","/evidence/citations/record-awards.bib":"ad3ebdfa736428fb","/evidence/citations/record-awards.ris":"d4340389937a8cac","/evidence/citations/record-awards.txt":"87f94d91288ecf2e","/evidence/citations/record-bis.bib":"2868eb66a67030dd","/evidence/citations/record-bis.ris":"784818aa380c8c8e","/evidence/citations/record-bis.txt":"38efdd49fb34b086","/evidence/citations/record-books.bib":"bb78cf55d0d959aa","/evidence/citations/record-books.ris":"2f7d71467b98a675","/evidence/citations/record-books.txt":"6eae0cd11d52ae32","/evidence/citations/record-classification.bib":"5053987c050c66d3","/evidence/citations/record-classification.ris":"8a7109e1b5891ed1","/evidence/citations/record-classification.txt":"6badc501aa4ada3d","/evidence/citations/record-district-register.bib":"74b373f67286f839","/evidence/citations/record-district-register.ris":"8f9175afdf7db834","/evidence/citations/record-district-register.txt":"76a62beb527c3a15","/evidence/citations/record-dossier.bib":"0fdcbb98a8318fe0","/evidence/citations/record-dossier.ris":"8c839ab0b3d759ae","/evidence/citations/record-dossier.txt":"368b7257a6dafeed","/evidence/citations/record-dpiit.bib":"79a7e154833d4a45","/evidence/citations/record-dpiit.ris":"4230bbd507358539","/evidence/citations/record-dpiit.txt":"ba075f93bd80da36","/evidence/citations/record-external-validation.bib":"63a2bfa53b4bb40e","/evidence/citations/record-external-validation.ris":"b2a40ffa44291cb7","/evidence/citations/record-external-validation.txt":"75a1c082a8d4fc4b","/evidence/citations/record-fsc.bib":"993af927f612c7df","/evidence/citations/record-fsc.ris":"fca461e14c611313","/evidence/citations/record-fsc.txt":"b328ced99fcd24a3","/evidence/citations/record-gst.bib":"de33d694428b0deb","/evidence/citations/record-gst.ris":"da3f9223a4ecb8ce","/evidence/citations/record-gst.txt":"de6b34c3a2a99d9c","/evidence/citations/record-hfr.bib":"02af5ba2f82b9457","/evidence/citations/record-hfr.ris":"dad0ee19b8fd3241","/evidence/citations/record-hfr.txt":"7a27b84721b85109","/evidence/citations/record-iso13485.bib":"fed7e5e211efe8b2","/evidence/citations/record-iso13485.ris":"3058139786b043a5","/evidence/citations/record-iso13485.txt":"031f62d2ceac4054","/evidence/citations/record-iso27001.bib":"12ff6aeb2be437ff","/evidence/citations/record-iso27001.ris":"ad40fef87f24367f","/evidence/citations/record-iso27001.txt":"c6f5c6a72478981c","/evidence/citations/record-lei.bib":"e739ac97c820205a","/evidence/citations/record-lei.ris":"e0e871224999f2a5","/evidence/citations/record-lei.txt":"a008b96ca11a9c4d","/evidence/citations/record-marks-copyright.bib":"b97420b288e83804","/evidence/citations/record-marks-copyright.ris":"abcc3b63009d7bf1","/evidence/citations/record-marks-copyright.txt":"b51e0ae7d811abe8","/evidence/citations/record-mca.bib":"a9dfd3fc0cd85a88","/evidence/citations/record-mca.ris":"ca460895e08a9a07","/evidence/citations/record-mca.txt":"49ca70527eb36c14","/evidence/citations/record-md3.bib":"0052719807cc4550","/evidence/citations/record-md3.ris":"dc817a643eb6b048","/evidence/citations/record-md3.txt":"4eb17a910b4c8826","/evidence/citations/record-md5.bib":"f02eac89517a9225","/evidence/citations/record-md5.ris":"6c0dde11f1f45c16","/evidence/citations/record-md5.txt":"31adecee8c35cd01","/evidence/citations/record-methodology.bib":"a57005511875cc76","/evidence/citations/record-methodology.ris":"b26c64b1e000db9f","/evidence/citations/record-methodology.txt":"586420ef3ecacbc1","/evidence/citations/record-operating-metrics.bib":"590fee4c2bf97725","/evidence/citations/record-operating-metrics.ris":"4ecdb1302856bb55","/evidence/citations/record-operating-metrics.txt":"04e8af9d3c91451f","/evidence/citations/record-outcome-claim.bib":"9bf741121c5f9430","/evidence/citations/record-outcome-claim.ris":"ffd998af574c8f40","/evidence/citations/record-outcome-claim.txt":"0132ea7a7e01dae8","/evidence/citations/record-pan.bib":"f64858436e739d73","/evidence/citations/record-pan.ris":"959dedc516ff45e6","/evidence/citations/record-pan.txt":"c00cde12c4e44fae","/evidence/citations/record-patents.bib":"80ad7ac5dee96afa","/evidence/citations/record-patents.ris":"e5a98109f09a807d","/evidence/citations/record-patents.txt":"2a6ccc53025c3684","/evidence/citations/record-pinnacleai-story.bib":"d3b3b55a0a807e0f","/evidence/citations/record-pinnacleai-story.ris":"0d8a70b24bfb2e33","/evidence/citations/record-pinnacleai-story.txt":"355649285215a776","/evidence/citations/record-rpwd-attapur.bib":"a7d65ef55869cb50","/evidence/citations/record-rpwd-attapur.ris":"7fd21e17e5075358","/evidence/citations/record-rpwd-attapur.txt":"f155ec83cfd2cd71","/evidence/citations/record-rpwd-begumpet.bib":"aa0ec8deee162356","/evidence/citations/record-rpwd-begumpet.ris":"1d2d3b4bf60a73b5","/evidence/citations/record-rpwd-begumpet.txt":"9dbe0212dc84c8cf","/evidence/citations/record-rpwd-nellore.bib":"f38129e9a2e49f6d","/evidence/citations/record-rpwd-nellore.ris":"d6c07d29d5057d33","/evidence/citations/record-rpwd-nellore.txt":"9daf44c73fd82c29","/evidence/citations/record-rpwd-nizamabad.bib":"d8ba7ead7d892a05","/evidence/citations/record-rpwd-nizamabad.ris":"66a3af260069e142","/evidence/citations/record-rpwd-nizamabad.txt":"26b053059f436e49","/evidence/citations/record-sae3000.bib":"909c825e3abf6900","/evidence/citations/record-sae3000.ris":"3a47672c3f6a028b","/evidence/citations/record-sae3000.txt":"887817de6ca582ff","/evidence/citations/record-september-handout.bib":"48ec9b357ed5c0f9","/evidence/citations/record-september-handout.ris":"85ae02b82f7b3708","/evidence/citations/record-september-handout.txt":"5875b90ef3023788","/evidence/citations/record-sovereign-walkthrough.bib":"16293bc8e6017522","/evidence/citations/record-sovereign-walkthrough.ris":"9ea67bbd0e84efdb","/evidence/citations/record-sovereign-walkthrough.txt":"cf56c9a331343590","/evidence/citations/record-srs4400.bib":"c0f3e6e5d70ce4f1","/evidence/citations/record-srs4400.ris":"85beb2c0a6ddc93e","/evidence/citations/record-srs4400.txt":"5e866e476e1b5111","/evidence/citations/record-study-portfolio.bib":"75ef1591e277cba2","/evidence/citations/record-study-portfolio.ris":"ef79f1a18745d4c5","/evidence/citations/record-study-portfolio.txt":"c52047ce2aadaa81","/evidence/citations/record-udyam.bib":"89debebf84361118","/evidence/citations/record-udyam.ris":"bd36f018a79a9d03","/evidence/citations/record-udyam.txt":"b73ae1aa1aa1d4d3","/evidence/citations/record-whitebook.bib":"df6149540c957eee","/evidence/citations/record-whitebook.ris":"b8e835c03b74cdb6","/evidence/citations/record-whitebook.txt":"9add75f1c9d00a2f","/evidence/citations/voice-of-the-unheard.bib":"f37aa2d070583439","/evidence/citations/voice-of-the-unheard.ris":"9514432f4763e038","/evidence/citations/voice-of-the-unheard.txt":"31f8531724a517e3","/evidence/citations/zenodo-15487405.bib":"e31295deddff31dd","/evidence/citations/zenodo-15487405.ris":"954010784c20f52d","/evidence/citations/zenodo-15487405.txt":"bbbb71841bcd234e","/evidence/citations/zenodo-19482123.bib":"aaf49a61510aead0","/evidence/citations/zenodo-19482123.ris":"73f1b7743154fb8b","/evidence/citations/zenodo-19482123.txt":"f3e08cd3462db48e","/evidence/citations/zenodo-19482476.bib":"e40a3df8ccc0d133","/evidence/citations/zenodo-19482476.ris":"11d6292eaac25c8d","/evidence/citations/zenodo-19482476.txt":"01370aeaabfffad5","/evidence/citations/zenodo-22761782.bib":"06b422c7c394b088","/evidence/citations/zenodo-22761782.ris":"aeccaad3962fbb9e","/evidence/citations/zenodo-22761782.txt":"e4dcec3c86ce8a74","/evidence/citations/zenodo-22761810.bib":"7a229e8e266e524e","/evidence/citations/zenodo-22761810.ris":"8b34051395c95471","/evidence/citations/zenodo-22761810.txt":"223c481de50e0883","/evidence/citations/zenodo-22761832.bib":"b6a165e4b2e67be0","/evidence/citations/zenodo-22761832.ris":"9260fa5cc9ce2c75","/evidence/citations/zenodo-22761832.txt":"515268748f55b9e2","/evidence/citations/zenodo-22827813.bib":"7ea3556624864450","/evidence/citations/zenodo-22827813.ris":"d67298c659adb2d5","/evidence/citations/zenodo-22827813.txt":"341d430a0e4a136d","/evidence/cite.html":"7e96e30a06e626f7","/evidence/claim-ledger.csv":"988679635064b26a","/evidence/claim-ledger.html":"8dc8513623051011","/evidence/claim-ledger.json":"f6ae4ddf6ef458b1","/evidence/classification-application.pdf":"1a5e96c3fe7eccb7","/evidence/dataset-reuse-v1.html":"e1d24c7470eeaefe","/evidence/developmental-pathway.json":"885ee337f6cba4d8","/evidence/developmental-pathway.txt":"574951398fd998d7","/evidence/district-excerpts.pdf":"60be903abfbf06b7","/evidence/district-register.html":"4e9330409f56fdd3","/evidence/document-manifest.json":"574322ea9cf0473d","/evidence/dpiit.pdf":"00447971b4ede9c0","/evidence/editorial-policy.json":"cd82fccea38834be","/evidence/evidence-provenance.json":"128d5d3d34f36f8b","/evidence/evidence-register.html":"a897894dbfd4f46d","/evidence/evidence.json":"7bc02f729eca0b17","/evidence/experience-guide.json":"f4e931d5f90c1293","/evidence/experience-guide.txt":"60a4a5fd846440e5","/evidence/fsc-forwarding-letter.pdf":"159e19a4906c15fb","/evidence/fsc.pdf":"84664753b59ec604","/evidence/global-context.html":"ae9b2bfa84b3bdd0","/evidence/global-context.json":"aa0007a3e2f92583","/evidence/global-context.txt":"be92206e5e029dbd","/evidence/hfr-dashboard-checks.json":"56c4799a11686274","/evidence/hfr-register.csv":"3fe04c1e45ab1741","/evidence/hfr-register.html":"41b6ef7d8b269413","/evidence/hfr-register.json":"cdb98a8d37e266e4","/evidence/hyderabad-telangana-andhra-pradesh-contact.html":"a96fe28cb262aa7d","/evidence/hyderabad-telangana-andhra-pradesh-contact.json":"2621055275487e1e","/evidence/hyderabad-telangana-andhra-pradesh-contact.txt":"fe77c421b8eff656","/evidence/icai-udin-verifications-2026-09-19.pdf":"cef973ab3232c8fd","/evidence/international-registration-status.json":"143ea9db3d90ee41","/evidence/iso13485.pdf":"b577fb0227453d32","/evidence/iso27001.pdf":"4e50011495c76c43","/evidence/issuer-checks.json":"ceba49bd4a2936f7","/evidence/mca.pdf":"c167d68862828d1b","/evidence/md5.pdf":"09a063e47b664e87","/evidence/organisation-profile.html":"6e71c987ed1b111e","/evidence/organisation-profile.json":"062f472f12e232e7","/evidence/organisation-profile.txt":"b39a018c505f65ef","/evidence/paradigm-story.json":"3926f2d945713df9","/evidence/paradigm-story.txt":"b2e3bc5288a39d75","/evidence/paradigm/01-life-in-view.html":"61231daf596b2ede","/evidence/paradigm/02-shared-starting-point.html":"b0d69518c901d89d","/evidence/paradigm/03-plan-with-a-memory.html":"25ab7d57f0b0ad3f","/evidence/paradigm/04-one-shared-direction.html":"737db63284e5680c","/evidence/paradigm/05-practice-in-everyday-life.html":"8baf6fe2feb57fee","/evidence/paradigm/06-feedback-that-shapes-care.html":"59209384ec4180b6","/evidence/paradigm/07-skills-with-a-purpose.html":"d3d76f63cbbff4a1","/evidence/paradigm/08-review-and-reassess.html":"2f024774058c8adb","/evidence/paradigm/09-independence-and-belonging.html":"fbef481402f6be07","/evidence/parent-guides.json":"3485332b141c68f2","/evidence/pinnacle-paradigm-shift.html":"c411a5a7465f49e4","/evidence/pinnacle-paradigm-shift.json":"6d0db2597323c4c7","/evidence/pinnacle-paradigm-shift.txt":"56c32de3b595d110","/evidence/pinnacle-public-evidence-pack-2026.pdf":"b8bb727828affba9","/evidence/pinnacleai-regulatory-journey.html":"edfdc36cdea1ed4f","/evidence/pinnacleai-regulatory-journey.json":"22ebd363262756d3","/evidence/pinnacleai-regulatory-journey.txt":"b2aa9b84d923f2ed","/evidence/privacy.html":"92436f4d1b0df8d0","/evidence/publications.json":"a5e96c9e0ab70c24","/evidence/publications/autism-mothers-handbook-english.html":"edd1c2fd24195b73","/evidence/publications/autism-mothers-handbook-telugu.html":"c5f1e5c7aa3207b7","/evidence/publications/voice-of-the-unheard.html":"1c1ff15e3b9e18a7","/evidence/publications/zenodo-15487405.html":"2979af3711e494df","/evidence/publications/zenodo-15487405.pdf":"7511fe153af7da12","/evidence/publications/zenodo-19482123.html":"fa3aab9b55abfe48","/evidence/publications/zenodo-19482123.pdf":"61348d8c1f5159a0","/evidence/publications/zenodo-19482476.html":"26bdb2a78e7f4c96","/evidence/publications/zenodo-19482476.pdf":"3dc3e4fc2ed23001","/evidence/publications/zenodo-22761782.html":"06f8855f95499430","/evidence/publications/zenodo-22761782.pdf":"ca3eb27620e11c05","/evidence/publications/zenodo-22761810.html":"38152d2473f75c90","/evidence/publications/zenodo-22761810.pdf":"134705dc6cf2bfcb","/evidence/publications/zenodo-22761832.html":"e634c21ae5f6313f","/evidence/publications/zenodo-22761832.pdf":"3d732bf504aa8a9b","/evidence/publications/zenodo-22827813.html":"5a9ce5b6217371e9","/evidence/publications/zenodo-22827813.pdf":"2d97944d00fd078c","/evidence/reading-topics.json":"7e6966ae07e937dc","/evidence/recognition-register.html":"b583dfd01b84329d","/evidence/records/appreciations.html":"b4acee7f32c3f180","/evidence/records/awards.html":"b580a60507a2da27","/evidence/records/bis.html":"a105114bfd482053","/evidence/records/books.html":"60024fd0dbc2d4ca","/evidence/records/classification.html":"67405e1289ce4db3","/evidence/records/district-register.html":"23aeeea7c7423d6e","/evidence/records/dossier.html":"cfc26fb79f3cbd3c","/evidence/records/dpiit.html":"741e01dd878c45c2","/evidence/records/external-validation.html":"a82c8c2561c64781","/evidence/records/fsc.html":"64d1131f18206517","/evidence/records/gst.html":"3e800dc61bcc642f","/evidence/records/hfr.html":"96776da04e0898dd","/evidence/records/iso13485.html":"8f4462557c14ca78","/evidence/records/iso27001.html":"554cbea2d473d3f7","/evidence/records/lei.html":"94928faf70125bc8","/evidence/records/marks-copyright.html":"f3134540ef0a2296","/evidence/records/mca.html":"d68aea6bd00f409a","/evidence/records/md3.html":"ac60d3e662cfb2dd","/evidence/records/md5.html":"0dbdf6da38f21ed8","/evidence/records/methodology.html":"56d35c79d5bcd9f2","/evidence/records/operating-metrics.html":"aa87aa14d92d5cd4","/evidence/records/outcome-claim.html":"08dc64e7ae91bc5c","/evidence/records/pan.html":"8536481e40d17a51","/evidence/records/patents.html":"1f69dbff85dddef3","/evidence/records/pinnacleai-story.html":"eb1df98a0ba7ad7b","/evidence/records/rpwd-attapur.html":"193fd0914e6d3abb","/evidence/records/rpwd-begumpet.html":"0e961bd92a143cf5","/evidence/records/rpwd-nellore.html":"4070a2152bca1551","/evidence/records/rpwd-nizamabad.html":"59d07b4070bd1573","/evidence/records/sae3000.html":"0427be74e10107a4","/evidence/records/september-handout.html":"a6b330057eec59b7","/evidence/records/sovereign-walkthrough.html":"5ef6316ce848f20a","/evidence/records/srs4400.html":"15f0c075ba857c8a","/evidence/records/study-portfolio.html":"fd9338417e667d2f","/evidence/records/udyam.html":"ef72e5e7bde048b3","/evidence/records/whitebook.html":"011717dcf9aee85e","/evidence/research-library.bib":"2ff77205ac2a2c59","/evidence/research-library.html":"18b23c9032382326","/evidence/research-library.json":"c84a330b3fde83c3","/evidence/research-library.ris":"ab297b113dbd0ca2","/evidence/research-library.txt":"ed91a301362ffc6e","/evidence/scale-and-mission.html":"0465e851706b864a","/evidence/scale-register.html":"3e0da61504bfa835","/evidence/scale-register.json":"716d14f718b5fb0b","/evidence/scale-register.txt":"1bfdff6e786a9948","/evidence/scale-story-answers.json":"0099ec888353e7d3","/evidence/scale-story-citation.txt":"7815ccdf62ef1cb6","/evidence/scale-story.json":"37e70ddbd1a0c991","/evidence/scale-story.txt":"9b10926c3c811ec4","/evidence/section-index.json":"2963469e47b2edcf","/evidence/share-images.json":"7fd448484b972f05","/evidence/share-index.json":"9af8c45a67fa37e0","/evidence/study-index.html":"226910e0db2b5924","/experience.css":"c677dfe48cf8ce2a","/experience.js":"0c8421e20514e0a0","/favicon.ico":"6e0bfe537574510f","/favicon.png":"959438c2bbb2bd99","/finale-home.css":"f7aa1d0d1238efab","/fonts/anek-bangla-OFL.txt":"de62be758bba267e","/fonts/anek-bangla.woff2":"db5e83e0c21b1f10","/fonts/anek-devanagari-OFL.txt":"de62be758bba267e","/fonts/anek-devanagari.woff2":"0c06d579af07b6ba","/fonts/anek-gujarati-OFL.txt":"de62be758bba267e","/fonts/anek-gujarati.woff2":"e10036a06fe5a75d","/fonts/anek-gurmukhi-OFL.txt":"de62be758bba267e","/fonts/anek-gurmukhi.woff2":"723c4ade7a01c780","/fonts/anek-kannada-OFL.txt":"de62be758bba267e","/fonts/anek-kannada.woff2":"43da33559cb4ee9d","/fonts/anek-latin-OFL.txt":"de62be758bba267e","/fonts/anek-latin.woff2":"0e96e6c2621df1ea","/fonts/anek-malayalam-OFL.txt":"de62be758bba267e","/fonts/anek-malayalam.woff2":"e9d8f899d84af59a","/fonts/anek-odia-OFL.txt":"de62be758bba267e","/fonts/anek-odia.woff2":"a8909e51460e9be4","/fonts/anek-tamil-OFL.txt":"de62be758bba267e","/fonts/anek-tamil.woff2":"f99260016ddf1b7a","/fonts/anek-telugu-OFL.txt":"de62be758bba267e","/fonts/anek-telugu.woff2":"3aef251e0d11458f","/fonts/dm-sans-OFL.txt":"9af36190332437f5","/fonts/dm-sans-latin.woff2":"9fea608a947e6702","/fonts/fonts.css":"4e6dcd3db2a12439","/fonts/manrope-OFL.txt":"58172e0c0fac2cda","/fonts/manrope-latin.woff2":"a30ddcd349703aff","/fonts/noto-sans-devanagari-OFL.txt":"a216f6f8d85c7228","/fonts/noto-sans-devanagari.woff2":"7b31d0cb802984aa","/guides/abilityscore.html":"3ce1ee5584babe67","/guides/abilityscore.txt":"88be93fbb585f6c9","/guides/everyday-practice.html":"335348cf3fea3143","/guides/everyday-practice.txt":"d1b612ee51747400","/guides/hi/abilityscore.html":"07bb26dff0205c60","/guides/hi/abilityscore.txt":"c3e11b06bd859c8a","/guides/hi/everyday-practice.html":"7356f27e1a9c8435","/guides/hi/everyday-practice.txt":"51764595511d4a59","/guides/hi/licences-and-scope.html":"3ce2d8cbb0a7691c","/guides/hi/licences-and-scope.txt":"b0d5a5c966906162","/guides/licences-and-scope.html":"a3c6ebf81407216e","/guides/licences-and-scope.txt":"a8ae6b825ee05c57","/guides/te/abilityscore.html":"aea8d6976e0d9c34","/guides/te/abilityscore.txt":"e2835637c53b58d9","/guides/te/everyday-practice.html":"3676da79c63ebf99","/guides/te/everyday-practice.txt":"e6b3344f61af20b9","/guides/te/licences-and-scope.html":"392ae4fe61fc16d2","/guides/te/licences-and-scope.txt":"4084527f2a9a9c68","/hfr-register.js":"28cddf4109b868a4","/images/care-participation-1000.webp":"3ad3fa98aa5c1e70","/images/care-participation-1536.webp":"6ff9c8eb61b2033d","/images/care-participation-600.webp":"72cb412d5d2d7e5d","/images/connected-records-1000.webp":"57ae8fe1436dc927","/images/connected-records-1536.webp":"9e5390df2df7e9c9","/images/connected-records-600.webp":"3e6cf50053393bcb","/images/family-journey-1000.webp":"4f8bcf8768197634","/images/family-journey-1536.webp":"8a62b24b1ed0c5c4","/images/family-journey-600.webp":"ed0ca998f0f8d62c","/images/paradigm-finale/assessment-1200.webp":"0904c06e796d7e7f","/images/paradigm-finale/assessment-600.webp":"b42acca25a74618f","/images/paradigm-finale/brand-header-1200.webp":"edd4e0a8d3e97c31","/images/paradigm-finale/brand-header-600.webp":"a0baabbd892e3a94","/images/paradigm-finale/car-1200.webp":"801f8ce7b203d254","/images/paradigm-finale/car-600.webp":"57444aaacb5e6312","/images/paradigm-finale/family-1200.webp":"cbfd8caafd472dc8","/images/paradigm-finale/family-600.webp":"9a16ff1abb85a54e","/images/paradigm-finale/family.webp":"4f8bcf8768197634","/images/paradigm-finale/hero-1200.webp":"fef47772ef611942","/images/paradigm-finale/hero-600.webp":"283ab8882ee718d0","/images/paradigm-finale/hero.webp":"cb471bccdabc15f3","/images/paradigm-finale/home-1200.webp":"9e81a0215eeb11e1","/images/paradigm-finale/home-600.webp":"729b6833c40226d7","/images/paradigm-finale/learning-1200.webp":"8fc47c7d57eee1bb","/images/paradigm-finale/learning-600.webp":"1a92c9701a48ea31","/images/paradigm-finale/moon-1200.webp":"6b9a1ad4ef5171b9","/images/paradigm-finale/moon-600.webp":"fe2717aab5daff9c","/images/paradigm-finale/practice-1200.webp":"af68093b56d59448","/images/paradigm-finale/practice-600.webp":"31b1183b9fcae837","/images/paradigm-finale/report-cover-1200.webp":"1fb49176e4d08620","/images/paradigm-finale/report-cover-600.webp":"6f79d20da30258e8","/images/paradigm-finale/review-1200.webp":"a85628bdeaaa6864","/images/paradigm-finale/review-600.webp":"23096472fb835e5a","/images/paradigm-finale/team-1200.webp":"ea0984edbd1aa2d6","/images/paradigm-finale/team-600.webp":"d09f81df7f900f8a","/images/paradigm/01-art.webp":"55beb37fbd7cafcd","/images/paradigm/01-life-in-view-8594b22394ba-540.webp":"d7c939f24bb010de","/images/paradigm/01-life-in-view-8594b22394ba.jpg":"8594b22394ba3603","/images/paradigm/02-art.webp":"b43cf7ed77d1cb65","/images/paradigm/02-shared-starting-point-4f572007f33a-540.webp":"afc3215da7421dbb","/images/paradigm/02-shared-starting-point-4f572007f33a.jpg":"4f572007f33a8a63","/images/paradigm/03-art.webp":"39ecc7ff0d1d37c4","/images/paradigm/03-plan-with-a-memory-3c248c0ec099-540.webp":"20d7f1bfffff326c","/images/paradigm/03-plan-with-a-memory-3c248c0ec099.jpg":"3c248c0ec099ddb2","/images/paradigm/04-art.webp":"f5a4757ea42bbb92","/images/paradigm/04-one-shared-direction-ad93b45bb032-540.webp":"1f5a19b8e7a3065b","/images/paradigm/04-one-shared-direction-ad93b45bb032.jpg":"ad93b45bb032eb29","/images/paradigm/05-art.webp":"687832caf8b8687c","/images/paradigm/05-practice-in-everyday-life-5ea75a25ee85-540.webp":"4747893d99e06c79","/images/paradigm/05-practice-in-everyday-life-5ea75a25ee85.jpg":"5ea75a25ee85dcbd","/images/paradigm/06-art.webp":"222560356057dad3","/images/paradigm/06-feedback-that-shapes-care-f45a208fa317-540.webp":"751e2a8f087336d8","/images/paradigm/06-feedback-that-shapes-care-f45a208fa317.jpg":"f45a208fa3179482","/images/paradigm/07-art.webp":"f3b09dec2af16935","/images/paradigm/07-skills-with-a-purpose-f4fa127eb3ab-540.webp":"8746648f93733a66","/images/paradigm/07-skills-with-a-purpose-f4fa127eb3ab.jpg":"f4fa127eb3ab746e","/images/paradigm/08-art.webp":"4c14327cd81c16c4","/images/paradigm/08-review-and-reassess-776d15839b59-540.webp":"3babf1edee4723ff","/images/paradigm/08-review-and-reassess-776d15839b59.jpg":"776d15839b59dadc","/images/paradigm/09-art.webp":"cb471bccdabc15f3","/images/paradigm/09-independence-and-belonging-ea4c7492286b-540.webp":"8a60d34e63af5b0b","/images/paradigm/09-independence-and-belonging-ea4c7492286b.jpg":"ea4c7492286b1b1d","/images/pinnacle-logo.webp":"194e2763ece3095f","/images/pinnacle-verify-social-20260918.jpg":"b68376ebf51889b3","/images/research/autism-mothers-handbook-english-300.webp":"42f079d78b80ebfe","/images/research/autism-mothers-handbook-english-600.webp":"b5325f1965a25245","/images/research/autism-mothers-handbook-telugu-300.webp":"a5f41790797ad460","/images/research/autism-mothers-handbook-telugu-600.webp":"2f0af08a08affdbc","/images/research/global-research-whitebook-300.webp":"6564cf6d9b147983","/images/research/global-research-whitebook-600.webp":"60abe3d0639c7a4a","/images/research/voice-of-the-unheard-300.webp":"5ff18624d2f440e7","/images/research/voice-of-the-unheard-600.webp":"511933229d2ccd54","/images/research/zenodo-19482123-300.webp":"650f2a8c9a8e3a11","/images/research/zenodo-19482123-600.webp":"6c30c892b098c0b9","/images/research/zenodo-19482476-300.webp":"255c2a762a23a638","/images/research/zenodo-19482476-600.webp":"059b88ca7300299a","/images/research/zenodo-22761810-300.webp":"7f7131abfd07eabb","/images/research/zenodo-22761810-600.webp":"5c1b4614e9917a43","/images/research/zenodo-22827813-300.webp":"274a5584831374d7","/images/research/zenodo-22827813-600.webp":"cf223a262a85461e","/images/social/evidence-assurance-map-43002ad696cc.jpg":"43002ad696cc6458","/images/social/evidence-cite-633759352089.jpg":"633759352089c2d9","/images/social/evidence-district-register-91288a2cb68b.jpg":"91288a2cb68b7c95","/images/social/evidence-evidence-register-d5fa0af9e5df.jpg":"d5fa0af9e5dfdc53","/images/social/evidence-global-context-a3a51312f971.jpg":"a3a51312f971bbbe","/images/social/evidence-hfr-register-45016b0b4625.jpg":"45016b0b4625b759","/images/social/evidence-hfr-register-93ad245052cc.jpg":"93ad245052cc941b","/images/social/evidence-hfr-register-c30367f2b1d1.jpg":"c30367f2b1d1467f","/images/social/evidence-privacy-3cb997a01925.jpg":"3cb997a019259a52","/images/social/evidence-publications-autism-mothers-handbook-english-cfd8cdd7f0e2.jpg":"cfd8cdd7f0e2ad53","/images/social/evidence-publications-autism-mothers-handbook-telugu-82222a40c0d5.jpg":"82222a40c0d52d81","/images/social/evidence-publications-voice-of-the-unheard-a23aeb152769.jpg":"a23aeb1527692f8f","/images/social/evidence-publications-zenodo-15487405-40bb3c295be7.jpg":"40bb3c295be787ef","/images/social/evidence-publications-zenodo-19482123-6fc303c3c92f.jpg":"6fc303c3c92f1add","/images/social/evidence-publications-zenodo-19482476-eb8747447ce8.jpg":"eb8747447ce8bc00","/images/social/evidence-publications-zenodo-22761782-8a6f1f9ffa1b.jpg":"8a6f1f9ffa1bf2cc","/images/social/evidence-publications-zenodo-22761810-aa22ebe7acd9.jpg":"aa22ebe7acd9b455","/images/social/evidence-publications-zenodo-22761832-4a39deca5977.jpg":"4a39deca59775e06","/images/social/evidence-publications-zenodo-22827813-3e97bded25ab.jpg":"3e97bded25abaa3a","/images/social/evidence-recognition-register-5924ede3213d.jpg":"5924ede3213d09df","/images/social/evidence-records-appreciations-4b9d1a3b48f5.jpg":"4b9d1a3b48f55898","/images/social/evidence-records-awards-41ccf7388a75.jpg":"41ccf7388a75dc0f","/images/social/evidence-records-bis-52990479c869.jpg":"52990479c8693cf6","/images/social/evidence-records-books-43f7d5103eb7.jpg":"43f7d5103eb71258","/images/social/evidence-records-classification-73f4daf4af72.jpg":"73f4daf4af722b79","/images/social/evidence-records-district-register-efe5a8934152.jpg":"efe5a8934152f3fc","/images/social/evidence-records-dossier-0cc801cc4db6.jpg":"0cc801cc4db6cde4","/images/social/evidence-records-dpiit-29008b715fb0.jpg":"29008b715fb06e54","/images/social/evidence-records-external-validation-aa8916c9acf9.jpg":"aa8916c9acf93a6e","/images/social/evidence-records-gst-2826278c6b0f.jpg":"2826278c6b0f3bbf","/images/social/evidence-records-hfr-04e8afcffc12.jpg":"04e8afcffc125937","/images/social/evidence-records-hfr-1403c1ceccd7.jpg":"1403c1ceccd731ac","/images/social/evidence-records-hfr-403b0707753d.jpg":"403b0707753dda1a","/images/social/evidence-records-iso13485-7137ce191b40.jpg":"7137ce191b40a035","/images/social/evidence-records-iso27001-7c700ec16839.jpg":"7c700ec168393781","/images/social/evidence-records-lei-18dfc4b1d42e.jpg":"18dfc4b1d42e12c2","/images/social/evidence-records-marks-copyright-497b22debbbe.jpg":"497b22debbbe7468","/images/social/evidence-records-mca-e9d9210e01cb.jpg":"e9d9210e01cb8833","/images/social/evidence-records-md3-bc8a15fafa28.jpg":"bc8a15fafa284b93","/images/social/evidence-records-md5-3c72d288ba38.jpg":"3c72d288ba384eaa","/images/social/evidence-records-methodology-170e0d77f720.jpg":"170e0d77f720d175","/images/social/evidence-records-operating-metrics-9f9a20cd0b56.jpg":"9f9a20cd0b56f938","/images/social/evidence-records-outcome-claim-683420f8b40c.jpg":"683420f8b40c4035","/images/social/evidence-records-pan-b112cc5c59a7.jpg":"b112cc5c59a79833","/images/social/evidence-records-patents-132ca86c75f5.jpg":"132ca86c75f5f376","/images/social/evidence-records-rpwd-attapur-7b95d5fce4af.jpg":"7b95d5fce4afa5b1","/images/social/evidence-records-rpwd-begumpet-a3c7c6b08518.jpg":"a3c7c6b08518fbfe","/images/social/evidence-records-rpwd-nellore-655d0b3c807b.jpg":"655d0b3c807bce18","/images/social/evidence-records-rpwd-nizamabad-f4722562611e.jpg":"f4722562611e8014","/images/social/evidence-records-sae3000-bc36a47c8932.jpg":"bc36a47c89328222","/images/social/evidence-records-september-handout-d4df3f2e3b1b.jpg":"d4df3f2e3b1b93e4","/images/social/evidence-records-sovereign-walkthrough-ea9744beb541.jpg":"ea9744beb541a3d7","/images/social/evidence-records-srs4400-ee08cee6fc51.jpg":"ee08cee6fc51fde8","/images/social/evidence-records-study-portfolio-9e64603c51dd.jpg":"9e64603c51dda240","/images/social/evidence-records-udyam-1646034cad7d.jpg":"1646034cad7d176f","/images/social/evidence-records-whitebook-aa012f24a69a.jpg":"aa012f24a69a6490","/images/social/evidence-research-library-7b0cec026659.jpg":"7b0cec026659695d","/images/social/evidence-scale-register-d853deb81f85.jpg":"d853deb81f85c990","/images/social/evidence-study-index-9b90576c5120.jpg":"9b90576c51207106","/images/social/guide-abilityscore-en-5f492c595991.jpg":"5f492c5959913535","/images/social/guide-abilityscore-hi-f56bd9dbaa8d.jpg":"f56bd9dbaa8da412","/images/social/guide-abilityscore-te-fedf58a210e3.jpg":"fedf58a210e3d951","/images/social/guide-everyday-practice-en-20cb84cad85a.jpg":"20cb84cad85a464f","/images/social/guide-everyday-practice-hi-8f1738a3a3ac.jpg":"8f1738a3a3ace866","/images/social/guide-everyday-practice-te-9113bec15759.jpg":"9113bec15759fcb3","/images/social/guide-licences-and-scope-en-1b56bffd4678.jpg":"1b56bffd46784e49","/images/social/guide-licences-and-scope-hi-f230b61f734b.jpg":"f230b61f734b289a","/images/social/guide-licences-and-scope-te-e3e1e91c3713.jpg":"e3e1e91c3713d661","/images/social/paradigm-01-life-in-view-4caf60bc5b73.jpg":"4caf60bc5b73503e","/images/social/paradigm-02-shared-starting-point-48b34404a690.jpg":"48b34404a69070c0","/images/social/paradigm-03-plan-with-a-memory-faee89dc174c.jpg":"faee89dc174cf464","/images/social/paradigm-04-one-shared-direction-e4898ced441d.jpg":"e4898ced441d4ebe","/images/social/paradigm-05-practice-in-everyday-life-a925d102b428.jpg":"a925d102b428889d","/images/social/paradigm-06-feedback-that-shapes-care-abc81b7972ad.jpg":"abc81b7972ad41d0","/images/social/paradigm-07-skills-with-a-purpose-7de9be179a53.jpg":"7de9be179a535c11","/images/social/paradigm-08-review-and-reassess-d673b94f1a9e.jpg":"d673b94f1a9e0865","/images/social/paradigm-09-independence-and-belonging-57181e480b61.jpg":"57181e480b619bdc","/images/social/pinnacle-claim-ledger-4c31a3a70353.jpg":"4c31a3a703530c36","/images/social/pinnacle-organisation-profile-3ed09e2eaa0a.jpg":"3ed09e2eaa0a5997","/images/social/pinnacle-paradigm-shift-35e01d67f5ac.jpg":"35e01d67f5ac4f30","/images/social/pinnacle-paradigm-shift-8fa722610839.jpg":"8fa7226108392768","/images/social/pinnacle-scale-and-mission-5bec27e7071d.jpg":"5bec27e7071dedee","/images/social/pinnacle-verify-9aee0bd3ad0f.jpg":"9aee0bd3ad0f1caa","/images/social/pinnacle-verify-e142acf48dd4.jpg":"e142acf48dd43af1","/images/social/pinnacleai-regulatory-journey-4c9fcb6aea5f.jpg":"4c9fcb6aea5fb1e7","/images/social/record-fsc-bec0d678cfe5.jpg":"bec0d678cfe57bcc","/images/social/record-pinnacleai-story-c1d8183d33bc.jpg":"c1d8183d33bca23e","/images/sources/bis-page-2-650.webp":"c71dd8b68c8dfa4c","/images/sources/fsc-forwarding-letter-page-1-650.png":"f1f934bd7fd34537","/images/sources/fsc-page-1-650.png":"66850a3fa903206a","/images/sources/md5-page-1-650.webp":"97e2390cd97daa69","/impact.css":"1d0f18f8b3072f04","/index.html":"6a4b47b4f28553f3","/llms-full.txt":"1188129e545d1a68","/llms.txt":"5891d7d7990f9cb1","/mobile.css":"8eb05ad8105466df","/multilingual.css":"634f67dbcbb2b84a","/narrative.css":"9f4076696656a370","/paradigm-opening.js":"6c5e00df93364a61","/paradigm-story-pages.css":"2b1fa9a1cf33ffb8","/paradigm-story.css":"7f4291050c90c0a8","/paradigm-story.js":"63e296ecab669f4c","/paradigm.css":"4c51dd144f25d74a","/parent-guides.css":"ccda646b52e3f8aa","/pathway-accent.svg":"f61d5e338f46f471","/presentation.css":"952b5bdf2aaa8ba1","/reader-extras.js":"9c5444bd34caead9","/reader.css":"86e58dc6d0c4a5c4","/reader.js":"b0b7d4bf6b1c6eb7","/robots.txt":"a6c9c201c329a564","/semantic.css":"9ebeb9db84533f8b","/share.css":"c23631d7e0c258bd","/share.js":"98d18703a909a044","/site.webmanifest":"62883482df1dfa19","/sitemap.xml":"f6226bd44b2bf6d1","/styles.css":"bd22fd8d7d30c2ed","/topics.css":"cbc89ad2ed5cd650","/upgrade.css":"b545623d9a0cf07b","/world.css":"b528e23ea7cb8096"};
const MIME={'.woff2':'font/woff2','.bib':'text/plain; charset=utf-8','.ris':'text/plain; charset=utf-8','.html':'text/html; charset=utf-8','.png':'image/png','.ico':'image/x-icon','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8','.pdf':'application/pdf'};
const FAVICON_LINKS='<link rel="icon" type="image/png" sizes="50x50" href="https://www.pinnacleblooms.org/verify/favicon.png"><link rel="icon" sizes="50x50" href="https://www.pinnacleblooms.org/verify/favicon.ico"><link rel="apple-touch-icon" sizes="50x50" href="https://www.pinnacleblooms.org/verify/favicon.png">';
export function correctRootEntityMetadata(value){
 if(Array.isArray(value))return value.map(correctRootEntityMetadata);
 if(!value||typeof value!=='object')return value;
 const out=Object.fromEntries(Object.entries(value).map(([k,v])=>[k,correctRootEntityMetadata(v)]));
 const placeholder=v=>v?.name==='National Autism Coalition'&&v?.url==='https://www.example.org/autism-india';
 const unsupported=v=>v?.credentialCategory==='Patent Holder - Autism AbilityScore System (India + 160 WIPO Nations)';
 for(const [key,predicate] of [['memberOf',placeholder],['hasCredential',unsupported]]){
  if(Array.isArray(out[key]))out[key]=out[key].filter(x=>!predicate(x));
  else if(predicate(out[key]))delete out[key];
 }
 return out;
}
class RootEntityCorrection{
 constructor(){this.value='';}
 element(){this.value='';}
 text(chunk){this.value+=chunk.text;if(!chunk.lastInTextNode){chunk.remove();return;}let value=this.value;try{value=JSON.stringify(correctRootEntityMetadata(JSON.parse(value))).replace(/</g,'\\u003c');}catch{}chunk.replace(value,{html:true});this.value='';}
}
async function readTextLimited(response,limit=8*1024*1024){const reader=response.body?.getReader();if(!reader)return '';let total=0,text='';const decoder=new TextDecoder();try{for(;;){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>limit){await reader.cancel();throw Error('Text response exceeds limit');}text+=decoder.decode(value,{stream:true});}return text+decoder.decode();}finally{reader.releaseLock();}}
function cleanHeaders(source,textual=false){const h=new Headers(source);for(const k of ['set-cookie','age','expires','etag','last-modified','cf-cache-status','oai-sites-authorization','server-timing'])h.delete(k);if(textual){h.delete('content-length');h.delete('content-encoding');}return h;}
function publicBody(body){return body.replaceAll(ORIGIN,PUBLIC).replaceAll('href="/','href="/verify/').replaceAll('src="/','src="/verify/').replaceAll('action="/','action="/verify/').replaceAll('url(/','url(/verify/').replaceAll('/verify/verify/','/verify/').replace(/\bsrcset="([^"]*)"/g,(_,values)=>'srcset="'+values.split(',').map(v=>v.replace(/^(\s*)\/(?!\/|verify(?:\/|$))/,'$1/verify/')).join(',')+'"');}
function canonicalPath(path){if([PREFIX,PREFIX+'/index',PREFIX+'/index.html'].includes(path))return PREFIX+'/';const tail=path.slice(PREFIX.length);if(HTML_PATHS.includes(tail+'.html'))return PREFIX+tail+'.html';return path;}
function deliver(response,request,cacheState,file){const h=new Headers(response.headers);if(file.startsWith('/fonts/')&&file.endsWith('.woff2'))h.set('access-control-allow-origin','*');h.set('x-pinnacle-cache',cacheState);h.set('x-pinnacle-release',RELEASE);h.delete('cf-cache-status');h.delete('age');h.delete('cache-tag');const immutable=/^\/_assets\/[^/]+\.[a-f0-9]{16}\.(css|js)$/.test(file);const text=/\.html$|\.(json|xml|txt|csv|ris|bib|webmanifest)$/.test(file);h.set('cache-control',response.status===200?(immutable?'public, max-age=31536000, immutable':text?'public, max-age=60, must-revalidate':'public, max-age=3600'):'no-store');if(response.status===200&&request.headers.get('if-none-match')===h.get('etag')){h.delete('content-length');return new Response(null,{status:304,headers:h});}return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers:h});}
// Contextual evidence links for eight existing pages; public GET HTML only.
export const CONTEXTUAL_EVIDENCE_RULES=[
  {
    "id": "LINK-01",
    "path": "/abilityscore",
    "insertion": {
      "selector": "section#the-day-the-score-spoke",
      "method": "before"
    },
    "panel": {
      "title": "Current AbilityScore® guide",
      "description": "The current documented framework maps 17 child-development domains, 79 abilities and 349 skills. Explore the framework version, family observations and child-specific goals.",
      "contextNote": "This overview includes earlier six-domain, 344-skill descriptions. Keep findings tied to the framework version studied. A patent application or PCT filing is not a granted patent; use the linked source records for the documented stage.",
      "primaryLabel": "Understanding AbilityScore®",
      "primaryUrl": "https://www.pinnacleblooms.org/verify/guides/abilityscore.html",
      "supportingTargets": [
        "https://www.pinnacleblooms.org/verify/evidence/records/methodology.html",
        "https://www.pinnacleblooms.org/verify/evidence/records/sovereign-walkthrough.html",
        "https://www.pinnacleblooms.org/verify/evidence/research-library.html"
      ]
    }
  },
  {
    "id": "LINK-02",
    "path": "/ask/what-is-abilityscore-and-how-does-it-help-my-child",
    "insertion": {
      "selector": "article.atom > header.atom-head",
      "method": "after"
    },
    "panel": {
      "title": "Understand your child’s AbilityScore®",
      "description": "See how family observations, clinician-led assessment and the next plan connect in the parent guide.",
      "contextNote": "Family observations support professional assessment and planning. They do not replace qualified clinical interpretation or confer professional credentials. The current documented framework describes 17 domains, 79 abilities and 349 skills.",
      "primaryLabel": "Understanding AbilityScore®",
      "primaryUrl": "https://www.pinnacleblooms.org/verify/guides/abilityscore.html",
      "supportingTargets": [
        "https://www.pinnacleblooms.org/verify/evidence/records/md5.html",
        "https://www.pinnacleblooms.org/verify/#how-pinnacleai-works"
      ]
    }
  },
  {
    "id": "LINK-03",
    "path": "/ask/how-does-pinnacle-blooms-network-work-in-clinical-practice",
    "insertion": {
      "selector": "article.atom > header.atom-head",
      "method": "after"
    },
    "panel": {
      "title": "Follow the connected developmental journey",
      "description": "See how professional support, everyday practice, feedback and reassessment connect to your child’s goals.",
      "contextNote": "Growing independence and participation are goals; individual outcomes vary. Daily activities and reassessment timing follow the child’s agreed plan with human review.",
      "primaryLabel": "the everyday-practice and progress guide",
      "primaryUrl": "https://www.pinnacleblooms.org/verify/guides/everyday-practice.html",
      "supportingTargets": [
        "https://www.pinnacleblooms.org/verify/#how-pinnacleai-works",
        "https://www.pinnacleblooms.org/verify/evidence/developmental-pathway.txt"
      ]
    }
  },
  {
    "id": "LINK-04",
    "path": "/ask/how-is-a-child-s-progress-measured-in-parent-mediated-therapy",
    "insertion": {
      "selector": "article.atom > header.atom-head",
      "method": "after"
    },
    "panel": {
      "title": "Make everyday progress easier to discuss",
      "description": "Use the parent guide to discuss practical goals, home observations and the next progress review with your care team.",
      "contextNote": "A record of sessions or observations is different from a child’s improvement. Discuss what changed in daily life, which supports helped and what needs review.",
      "primaryLabel": "the everyday-practice and progress guide",
      "primaryUrl": "https://www.pinnacleblooms.org/verify/guides/everyday-practice.html",
      "supportingTargets": [
        "https://www.pinnacleblooms.org/verify/#report-explorer",
        "https://www.pinnacleblooms.org/verify/#how-pinnacleai-works"
      ]
    }
  },
  {
    "id": "LINK-05",
    "path": "/ask/how-is-autonomy-measured-and-progress-tracked-within-a-therapy-plan",
    "insertion": {
      "selector": "article.atom > header.atom-head",
      "method": "after"
    },
    "panel": {
      "title": "Connect therapy goals with everyday independence",
      "description": "Follow skills, support needs and participation across home, school and everyday settings.",
      "contextNote": "Scores and observed daily functioning serve different purposes. Growing independence is an individual goal, with appropriate support and accommodations maintained.",
      "primaryLabel": "the everyday-practice and progress guide",
      "primaryUrl": "https://www.pinnacleblooms.org/verify/guides/everyday-practice.html",
      "supportingTargets": [
        "https://www.pinnacleblooms.org/verify/#care",
        "https://www.pinnacleblooms.org/verify/#report-explorer"
      ]
    }
  },
  {
    "id": "LINK-06",
    "path": "/ask/what-is-the-clinical-and-regulatory-basis-of-abilityscore",
    "insertion": {
      "selector": "article.atom > header.atom-head",
      "method": "after"
    },
    "panel": {
      "title": "Read the licence and its intended use",
      "description": "Read the issued MD-5, the MD-3 application and the BIS scope with the named device, version and intended users.",
      "contextNote": "The issued MD-5 names PinnacleAI® GPT-OS v1.0.0, Class B non-diagnostic developmental support for ages 0–12. MD-3 is the application. BIS scope does not establish each intervention’s effectiveness or worldwide authorisation. Check individual research and patent-filing records for their documented stage.",
      "primaryLabel": "the PinnacleAI® licences and scope guide",
      "primaryUrl": "https://www.pinnacleblooms.org/verify/guides/licences-and-scope.html",
      "supportingTargets": [
        "https://www.pinnacleblooms.org/verify/evidence/records/md5.html",
        "https://www.pinnacleblooms.org/verify/evidence/records/md3.html",
        "https://www.pinnacleblooms.org/verify/evidence/records/bis.html",
        "https://www.pinnacleblooms.org/verify/evidence/records/patents.html"
      ]
    }
  },
  {
    "id": "LINK-07",
    "path": "/ask/what-data-powers-a-child-developmental-ai-platform",
    "insertion": {
      "selector": "article.atom > header.atom-head",
      "method": "after"
    },
    "panel": {
      "title": "Read the dated scale and assurance records",
      "description": "For the 17 July 2026 cutoff, the SRS 4400 agreed-upon-procedures report signed on 3 September 2026 records 2.7B+ structured events, 31,052,382 services and 792,614 beneficiary/family registrations.",
      "contextNote": "The figures elsewhere on this page use earlier source material. Services include assessments, screenings and parent training; the total is not a count of successful one-to-one therapy sessions. Structured events are not necessarily independent clinical observations or AI-training examples. Read the separate limited-assurance scope and reporting floors in the linked register.",
      "primaryLabel": "dated figures, definitions and source reports",
      "primaryUrl": "https://www.pinnacleblooms.org/verify/evidence/scale-register.html",
      "supportingTargets": [
        "https://www.pinnacleblooms.org/verify/evidence/assurance-map.html",
        "https://www.pinnacleblooms.org/verify/evidence/records/srs4400.html",
        "https://www.pinnacleblooms.org/verify/evidence/records/sae3000.html"
      ]
    }
  },
  {
    "id": "LINK-08",
    "path": "/ask/what-is-the-evidence-base-for-abilityscore",
    "insertion": {
      "selector": "article.atom > header.atom-head",
      "method": "after"
    },
    "panel": {
      "title": "Explore the original research",
      "description": "Read DOI-linked publications, methods, study protocols and source reports with their publication stage and scope.",
      "contextNote": "The external psychometric-validation record is a protocol describing planned research, not completed external validation. Read the listed works by publication stage; a DOI does not establish peer review or efficacy. A PCT filing is not itself a granted patent, and historical scale figures do not prove individual outcomes.",
      "primaryLabel": "the source-linked research library",
      "primaryUrl": "https://www.pinnacleblooms.org/verify/evidence/research-library.html",
      "supportingTargets": [
        "https://www.pinnacleblooms.org/verify/evidence/records/external-validation.html",
        "https://www.pinnacleblooms.org/verify/evidence/publications/zenodo-19482476.html",
        "https://www.pinnacleblooms.org/verify/evidence/publications/zenodo-19482123.html"
      ]
    }
  }
];
// Keep existing application responses intact outside the exact public allowlist.
// This helper performs no network requests, Cache API operations, redirects or origin rewrites.
const CONTEXT_MARKER='pinnacle-evidence-context';
export const HOME_EVIDENCE_RULE={
 id:'HOME-EVIDENCE-20260922',path:'/',
 insertion:{selector:'.cm-pinnacle-services-equipment > .pltr > .cm-container',method:'append'},
 panel:{compact:true,title:'Explore the evidence behind Pinnacle',
  description:'Read the licences, research, dated operating figures and centre records behind Pinnacle Blooms Network and PinnacleAI®.',
  primaryLabel:'Explore Pinnacle Verify',primaryUrl:PUBLIC+'/'}
};
const CONTEXT_BODY_LIMIT=2*1024*1024;
const escapeContext=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hasRobotsExclusion=value=>/\b(?:noindex|none)\b/i.test(value||'');
const prohibitsContextTransform=value=>/(?:^|,)\s*(?:private|no-store|no-transform)(?:\s*(?:=|,|$))/i.test(value||'');

export function contextualEvidenceRule(request,rules=CONTEXTUAL_EVIDENCE_RULES){
 const url=new URL(request.url);
 if(request.method!=='GET'||!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(url.hostname))return null;
 if(request.headers.has('authorization')||request.headers.has('range')||/\bno-transform\b/i.test(request.headers.get('cache-control')||''))return null;
 // A single trailing slash is the only tolerated path variant. Prefix matches never receive content.
 const pathname=url.pathname!=='/'&&url.pathname.endsWith('/')?url.pathname.slice(0,-1):url.pathname;
 return rules.find(rule=>rule.path===pathname)||null;
}

export function canTransformContextResponse(response){
 const h=response.headers;
 return response.status===200&&/^text\/html(?:\s*;|$)/i.test(h.get('content-type')||'')
  &&!/(?:charset\s*=\s*["']?)(?!utf-8(?:["';\s]|$)|utf8(?:["';\s]|$))/i.test(h.get('content-type')||'')
  &&!prohibitsContextTransform(h.get('cache-control'))&&!h.has('set-cookie')
  &&!hasRobotsExclusion(h.get('x-robots-tag'));
}

export function contextualEvidencePanel(rule){
 const p=rule.panel;
 if(p.compact)return '<aside id="'+CONTEXT_MARKER+'" aria-labelledby="pinnacle-evidence-context-title" style="clear:both;box-sizing:border-box;width:100%;max-width:832px;margin:1.5rem auto;padding:1.25rem;border:1px solid #b8dad5;border-radius:12px;background:#fff;color:#143347;text-align:center;line-height:1.6">'
  +'<h2 id="pinnacle-evidence-context-title" style="margin:0 0 .6rem;font-size:1.35rem;line-height:1.3;color:#143347">'+escapeContext(p.title)+'</h2>'
  +'<p style="margin:0 auto .8rem;max-width:65ch;font-size:1rem">'+escapeContext(p.description)+'</p>'
  +'<a href="'+escapeContext(p.primaryUrl)+'" style="display:inline-block;box-sizing:border-box;max-width:100%;padding:.6rem 1rem;border:1px solid #087f8c;border-radius:6px;color:#056678;font-size:1rem;font-weight:700;text-decoration:underline;text-underline-offset:.15em">'+escapeContext(p.primaryLabel)+'</a></aside>';
 const note=p.contextNote?'<p style="margin:.75rem 0 0">'+escapeContext(p.contextNote)+'</p>':'';
 // Inline styles are presentation only: content and its ordinary link remain readable if a future CSP blocks them.
 return '<aside id="'+CONTEXT_MARKER+'" class="pinnacle-evidence-context" aria-labelledby="pinnacle-evidence-context-title" style="margin:1.25rem 0;padding:1.15rem;border:1px solid #b8dad5;border-inline-start:4px solid #087f8c;border-radius:12px;background:#fff;color:#143347;font:inherit;line-height:1.6">'
  +'<p style="margin:0 0 .35rem;font-size:.8em;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#087f8c">Parent guide &amp; source records</p>'
  +'<h2 id="pinnacle-evidence-context-title" style="margin:0 0 .55rem;font-size:1.2em;color:#143347">'+escapeContext(p.title)+'</h2>'
  +'<p style="margin:0">'+escapeContext(p.description)+'</p>'
  +note+'<p style="margin:.8rem 0 0"><a href="'+escapeContext(p.primaryUrl)+'" style="color:#056678;font-weight:700;text-decoration:underline;text-underline-offset:.15em">'+escapeContext(p.primaryLabel)+'</a></p>'
  +'<p style="margin:.65rem 0 0;font-size:.82em;color:#405d6b">Evidence context added <time datetime="2026-09-19">19 September 2026</time>. The original article’s publication and review dates remain unchanged.</p></aside>';
}

async function readContextBodyBounded(response){
 const reader=response.clone().body?.getReader();if(!reader)return '';
 const decoder=new TextDecoder();let total=0,value='';
 try{for(;;){const item=await reader.read();if(item.done)break;total+=item.value.byteLength;
  // Never await cancellation of one side of a tee: the untouched original remains the fallback.
  if(total>CONTEXT_BODY_LIMIT){void reader.cancel().catch(()=>{});return null;}
  value+=decoder.decode(item.value,{stream:true});
 }return value+decoder.decode();}catch{return null;}finally{reader.releaseLock();}
}

export async function transformContextualEvidence(request,response,Rewriter=globalThis.HTMLRewriter,rules=CONTEXTUAL_EVIDENCE_RULES){
 const rule=contextualEvidenceRule(request,rules);
 if(!rule||!canTransformContextResponse(response)||typeof Rewriter!=='function')return response;
 const declared=Number(response.headers.get('content-length'));
 if(Number.isFinite(declared)&&declared>CONTEXT_BODY_LIMIT)return response;
 const html=await readContextBodyBounded(response);
 if(html===null||/\bid\s*=\s*(["'])pinnacle-evidence-context\1/i.test(html))return response;
 let inserted=false,excluded=false;
 const rewritten=new Rewriter()
  .on('meta[name]',{element(element){if(['robots','googlebot','bingbot'].includes((element.getAttribute('name')||'').toLowerCase())&&hasRobotsExclusion(element.getAttribute('content')))excluded=true;}})
  .on(rule.insertion.selector,{element(element){if(inserted||excluded)return;inserted=true;element[rule.insertion.method](contextualEvidencePanel(rule),{html:true});}})
  .transform(new Response(html,{headers:{'content-type':'text/html; charset=utf-8'}}));
 let result;try{result=await rewritten.text();}catch{return response;}
 if(!inserted||excluded)return response;
 const h=new Headers(response.headers);
 // Only representation-specific headers are invalidated. Preserve status, CSP, cookies, robots,
 // canonical Link headers, Cache-Control, Expires, Vary and all application/security headers.
 for(const name of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest','accept-ranges'])h.delete(name);
 return new Response(result,{status:response.status,statusText:response.statusText,headers:h});
}

export function isContextualAskRoute(request,rules=CONTEXTUAL_EVIDENCE_RULES){
 const url=new URL(request.url);
 return url.hostname==='pinnacleblooms.org'&&rules.some(rule=>rule.path.startsWith('/ask/')&&url.pathname.startsWith(rule.path));
}


export default {
 async fetch(request,env,ctx){
  const incoming=new URL(request.url),isVerify=incoming.pathname===PREFIX||incoming.pathname.startsWith(PREFIX+'/');
  if(isVerify&&['www.pinnacleblooms.org','pinnacleblooms.org'].includes(incoming.hostname)){
   if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD','Cache-Control':'no-store'}});
   const canonical=canonicalPath(incoming.pathname);
   if(incoming.hostname!=='www.pinnacleblooms.org'||incoming.protocol!=='https:'||canonical!==incoming.pathname)return new Response(null,{status:308,headers:{Location:'https://www.pinnacleblooms.org'+canonical+incoming.search,'Cache-Control':'public, max-age=300'}});
   const tail=incoming.pathname.slice(PREFIX.length),file=tail==='/'?'/index.html':tail;
   if(!Object.hasOwn(STATIC_FILES,file))return new Response('This verification page was not found.',{status:404,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}});
   // Tracking queries never vary this static content and are not forwarded to the source.
   const key=new Request(PUBLIC+(file==='/index.html'?'/':file)+'?__pv='+RELEASE,{method:'GET'});
   const ext=file.match(/\.[a-z0-9]+$/)?.[0],type=MIME[ext]||'application/octet-stream';
   const textual=/^text\/|application\/json|xml|manifest\+json/.test(type);
   // Rewritten text has different byte offsets. Weak public ETags cannot satisfy If-Range.
   const proposedRange=request.headers.get('range');
   const range=!textual&&!request.headers.has('if-range')&&/^bytes=\d*-\d*(?:,\s*\d*-\d*)*$/.test(proposedRange||'')?proposedRange:null;
   const cache=typeof caches!=='undefined'?caches.default:null;
   if(cache&&!range){try{const hit=await cache.match(key);if(hit)return deliver(hit,request,'HIT',file);}catch{/* Cache outage falls back to the same public static source. */}}
   const upstream=ORIGIN+(file==='/index.html'?'/':file.replace(/\.html$/,''));
   // Never forward visitor credentials, cookies, routing headers or validators to the source.
   const headers=new Headers({'OAI-Sites-Authorization':'Bearer '+env.SITES_BYPASS_TOKEN,Accept:'*/*'});
   if(range&&/^bytes=\d*-\d*(?:,\s*\d*-\d*)*$/.test(range))headers.set('range',range);
    let source;try{
     // Serve the complete reviewed release through ASSETS; use the authenticated origin only for a missing asset.
     source=env.ASSETS?await env.ASSETS.fetch(new Request('https://assets.local'+file,{method:request.method,headers:range?{Range:range}:{}})):await fetch(upstream,{method:request.method,headers,redirect:'manual'});
     if(source.status===404)source=await fetch(upstream,{method:request.method,headers,redirect:'manual'});
    }catch{return new Response('The verification page is temporarily unavailable. Please try again.',{status:503,headers:{'cache-control':'no-store','retry-after':'10'}});}
   const out=cleanHeaders(source.headers,textual);if(source.status===200)out.set('content-type',type);out.set('x-content-type-options','nosniff');out.set('referrer-policy','strict-origin-when-cross-origin');
   if(out.has('location')){const target=new URL(out.get('location'),upstream);if(target.origin===ORIGIN)out.set('location',target.href.replace(ORIGIN,PUBLIC));}
   const edgeTtl=86400;
   if(source.status===200){out.set('etag','W/"'+RELEASE+'-'+STATIC_FILES[file]+'"');out.set('cache-control','public, max-age='+edgeTtl);out.set('cache-tag','pinnacle-verify');}else out.set('cache-control','no-store');
   let body=source.body;
   if(request.method==='HEAD')body=null;
   else if(source.status===200&&textual){try{body=publicBody(await readTextLimited(source));}catch{return new Response('The verification page is temporarily unavailable.',{status:502,headers:{'cache-control':'no-store'}});}}
   const response=new Response(body,{status:source.status,headers:out});
   if(cache&&request.method==='GET'&&source.status===200&&!range){const write=cache.put(key,response.clone()).catch(()=>{console.warn('pinnacle_verify_cache_write_failed');});if(ctx?.waitUntil)ctx.waitUntil(write);else await write;}
   return deliver(response,request,cache&&source.status===200&&!range?'MISS':'BYPASS',file);
  }
  if(isContextualAskRoute(request)){
   if(!env.PINNACLE_ASK)return new Response('Temporarily unavailable',{status:503,headers:{'cache-control':'no-store','retry-after':'10'}});
   return transformContextualEvidence(request,await env.PINNACLE_ASK.fetch(request));
  }
  if(incoming.hostname==='www.pinnacleblooms.org'&&(incoming.pathname==='/ask'||incoming.pathname.startsWith('/ask/'))&&['GET','HEAD'].includes(request.method))return Response.redirect('https://pinnacleblooms.org'+incoming.pathname+incoming.search,308);
  if(incoming.hostname==='www.pinnacleblooms.org'&&(incoming.pathname==='/abilityscore'||incoming.pathname==='/abilityscore/'))return transformContextualEvidence(request,await fetch(request));
  if(incoming.hostname!=='www.pinnacleblooms.org')return fetch(request);
  if(incoming.pathname==='/'){
   const original=await fetch(request);if(!['GET','HEAD'].includes(request.method)||original.status!==200||!original.headers.get('content-type')?.includes('text/html'))return original;
   const reviewed=await transformReviewedHomeOrganization(request,original);
   const response=await transformContextualEvidence(request,reviewed,globalThis.HTMLRewriter,[HOME_EVIDENCE_RULE]);
   const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','age','expires'])h.delete(k);
   if(!h.get('cache-control')?.match(/private|no-store/i)&&!h.has('set-cookie'))h.set('cache-control','public, max-age=60');
   if(request.method==='HEAD')return new Response(null,{status:200,headers:h});
   return new HTMLRewriter()
    .on('head',{element(element){element.append(FAVICON_LINKS+'<meta name="ahrefs-site-verification" content="bc583a48d3e574453dd16c6719ff9b935dc158da08e5473efa5446368de630bb">',{html:true});}})
    .on('script[type="application/ld+json"]',new RootEntityCorrection())
    .on('.cm-f-footer-privacylinks > ul',{element(element){element.append('<li><a href="https://www.pinnacleblooms.org/verify/">Licences, research &amp; evidence</a></li>',{html:true});if(contextualEvidenceRule(request,[HOME_EVIDENCE_RULE])&&canTransformContextResponse(response))element.append('<li><a href="https://www.pinnacleblooms.org/national-autism-helpline">National Autism Helpline — 9100 181 181</a></li>',{html:true});}})
    .transform(new Response(response.body,{status:200,headers:h}));
  }
  if(incoming.pathname==='/robots.txt'){
   const originHeaders=new Headers(request.headers);originHeaders.delete('content-length');originHeaders.delete('transfer-encoding');const response=await fetch(new Request(request.url,{method:'GET',headers:originHeaders,redirect:request.redirect}));if(response.status!==200)return response;let body=await readTextLimited(response,65536);if(!body.includes(PUBLIC+'/sitemap.xml'))body=body.trimEnd()+'\n\n# Pinnacle verification evidence\nSitemap: '+PUBLIC+'/sitemap.xml\n';for(const sitemap of ['https://www.pinnacleblooms.org/national-autism-helpline/sitemap.xml','https://pinnacleblooms.org/ask/sitemap.xml'])if(!body.split(/\r?\n/).some(line=>line.trim()==='Sitemap: '+sitemap))body=body.trimEnd()+'\nSitemap: '+sitemap+'\n';const h=cleanHeaders(response.headers,true);h.set('content-type','text/plain; charset=utf-8');h.set('cache-control','public, max-age=300');return new Response(request.method==='HEAD'?null:body,{status:200,headers:h});
  }
  if(incoming.pathname==='/llms.txt')return Response.redirect(PUBLIC+'/llms.txt',308);
  return fetch(request);
 }
};


const REVIEWED_HOME_ORGANIZATION={"@context":"https://schema.org","@type":"Organization","@id":"https://www.pinnacleblooms.org/#organization","name":"Bharath Healthcare Laboratories Private Limited","legalName":"Bharath Healthcare Laboratories Private Limited","url":"https://www.pinnacleblooms.org/","logo":"https://www.pinnacleblooms.org/verify/images/pinnacle-logo.webp","brand":{"@type":"Brand","@id":"https://www.pinnacleblooms.org/verify/#pinnacle-brand","name":"Pinnacle Blooms Network","url":"https://www.pinnacleblooms.org/"},"description":"Pinnacle Blooms Network is a child-development therapy network operated by Bharath Healthcare Laboratories Private Limited. Services include autism support, speech therapy, ABA/behaviour therapy, occupational therapy and special education. Confirm services, practitioner availability and fees with the preferred centre.","telephone":"+919100181181","email":"care@pinnacleblooms.org","contactPoint":{"@type":"ContactPoint","name":"Pinnacle-operated National Autism Helpline","contactType":"parent guidance and appointment enquiries","telephone":"+919100181181","url":"https://www.pinnacleblooms.org/national-autism-helpline","availableLanguage":["en","te","hi"]},"identifier":[{"@type":"PropertyValue","propertyID":"CIN","value":"U74999TG2016PTC113063"},{"@type":"PropertyValue","propertyID":"LEI","value":"894500OJYBVC18BUDN89"}],"sameAs":["https://www.pinnacleblooms.org/verify/#organization"],"subjectOf":{"@type":"WebPage","name":"Dated institutional claim and source ledger","url":"https://www.pinnacleblooms.org/verify/evidence/claim-ledger.html"},"mainEntityOfPage":{"@type":"WebPage","@id":"https://www.pinnacleblooms.org/"}};
export function reviewedHomeOrganization(value){
 if(value?.['@type']!=='Organization'||value?.['@id']!=='https://www.pinnacleblooms.org/#organization'||value?.name!=='Pinnacle Autism Therapy'||value?.url!=='https://www.pinnacleblooms.org')return value;
 if(value?.description!=="Pinnacle Autism Therapy is India's largest multi-disciplinary, AI-powered child therapy network delivering 21M+ sessions across 70+ centers. Innovator of AbilityScore®, TherapeuticAI®, and TherapySphere™ environments, Pinnacle is recognized by the Govt. of India and globally awarded for autism, speech, ABA, OT, special education, and parent support therapies."||value?.providesService?.['@type']!=='GovernmentService'||value?.contactPoint?.telephone!=='+91-9100181181')return value;
 return structuredClone(REVIEWED_HOME_ORGANIZATION);
}

const EXPIRED_HOME_ANNOUNCEMENT="\r\n        {\r\n        \"@context\": \"https://schema.org\",\r\n        \"@type\": \"SpecialAnnouncement\",\r\n        \"name\": \"Covid19 aware therapeutic empowerment for little ones, Successful 11,20,000 therapies with 97% proven improvement\",\r\n        \"text\": \"Pinnacle Blooms Network - #1 Autism Therapy Centres Network with all the safety measures and precautions have successfully conducted 4 lakh + therapies by far during this COVID-19 period. We thank all our parents for their belief and confidence, Love, Affection & Support for Pinnacle Blooms Network - #1 Autism Therapy Centres Network.\",\r\n        \"datePosted\": \"2022-01-07T08:00\",\r\n        \"expires\": \"2022-12-31T23:59\",\r\n        //\"quarantineGuidelines\": \"https://example.org/california/shelter-in-place/\",\r\n        //\"diseasePreventionInfo\": \"https://example.org/california/prevention-tips/\",\r\n        \"spatialCoverage\": [\r\n        {\r\n        \"type\": \"Country\",\r\n        \"name\": \"India\"\r\n        }\r\n\r\n        ]\r\n        }\r\n    ";
// Used only before the existing homepage transforms. Unknown/private responses stay intact.
export async function transformReviewedHomeOrganization(request,response){
 const url=new URL(request.url);
 if(request.method!=='GET'||url.origin!=='https://www.pinnacleblooms.org'||url.pathname!=='/'||url.search)return response;
 if(['authorization','cookie','range','if-range','if-match','if-none-match','if-modified-since','if-unmodified-since'].some(name=>request.headers.has(name))||/\bno-transform\b/i.test(request.headers.get('cache-control')||''))return response;
 if(!canTransformContextResponse(response))return response;
 const declared=Number(response.headers.get('content-length'));
 if(Number.isFinite(declared)&&declared>CONTEXT_BODY_LIMIT)return response;
 const html=await readContextBodyBounded(response);
 if(html===null)return response;
 const tags=[...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(m=>m[0]);
 const attr=(tag,name)=>tag.match(new RegExp('\\b'+name+'\\s*=\\s*(["\\\'])([\\s\\S]*?)\\1','i'))?.[2];
 const canonicals=tags.filter(tag=>/^<link\b/i.test(tag)&&attr(tag,'rel')?.toLowerCase()==='canonical');
 if(canonicals.length!==1||attr(canonicals[0],'href')!=='https://www.pinnacleblooms.org/')return response;
 if(tags.some(tag=>/^<meta\b/i.test(tag)&&['robots','googlebot','bingbot'].includes(attr(tag,'name')?.toLowerCase())&&hasRobotsExclusion(attr(tag,'content'))))return response;
 let changed=0, expiredRemoved=0;
 const result=html.replace(/(<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script\s*>)/gi,(whole,open,raw,close)=>{
  if(raw===EXPIRED_HOME_ANNOUNCEMENT){expiredRemoved++;return '';}
  let parsed;try{parsed=JSON.parse(raw);}catch{return whole;}
  const repaired=reviewedHomeOrganization(parsed);
  if(repaired===parsed)return whole;
  changed++;
  return open+JSON.stringify(repaired).replace(/</g,'\\u003c')+close;
 });
 if(changed!==1||expiredRemoved!==1)return response;
 const h=new Headers(response.headers);
 for(const name of ['content-length','content-encoding','etag','last-modified','content-md5','digest','content-digest','repr-digest','accept-ranges'])h.delete(name);
 return new Response(result,{status:response.status,statusText:response.statusText,headers:h});
}
