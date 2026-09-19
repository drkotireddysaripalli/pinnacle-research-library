// Cache only public static output from the generated inventory. Other routes retain their origin behavior.
const ORIGIN='https://pinnacle-verify.saripalli.chatgpt.site';
const PUBLIC='https://www.pinnacleblooms.org/verify';
const PREFIX='/verify';
const RELEASE = "54eaeabefe01af0d";
const HTML_PATHS = ["/evidence/assurance-map.html","/evidence/cite.html","/evidence/district-register.html","/evidence/evidence-register.html","/evidence/global-context.html","/evidence/hfr-register.html","/evidence/privacy.html","/evidence/publications/autism-mothers-handbook-english.html","/evidence/publications/autism-mothers-handbook-telugu.html","/evidence/publications/voice-of-the-unheard.html","/evidence/publications/zenodo-15487405.html","/evidence/publications/zenodo-19482123.html","/evidence/publications/zenodo-19482476.html","/evidence/publications/zenodo-22761782.html","/evidence/publications/zenodo-22761810.html","/evidence/publications/zenodo-22761832.html","/evidence/publications/zenodo-22827813.html","/evidence/recognition-register.html","/evidence/records/appreciations.html","/evidence/records/awards.html","/evidence/records/bis.html","/evidence/records/books.html","/evidence/records/classification.html","/evidence/records/district-register.html","/evidence/records/dossier.html","/evidence/records/dpiit.html","/evidence/records/external-validation.html","/evidence/records/gst.html","/evidence/records/hfr.html","/evidence/records/iso13485.html","/evidence/records/iso27001.html","/evidence/records/lei.html","/evidence/records/marks-copyright.html","/evidence/records/mca.html","/evidence/records/md3.html","/evidence/records/md5.html","/evidence/records/methodology.html","/evidence/records/operating-metrics.html","/evidence/records/outcome-claim.html","/evidence/records/pan.html","/evidence/records/patents.html","/evidence/records/rpwd-attapur.html","/evidence/records/rpwd-begumpet.html","/evidence/records/rpwd-nellore.html","/evidence/records/rpwd-nizamabad.html","/evidence/records/sae3000.html","/evidence/records/september-handout.html","/evidence/records/sovereign-walkthrough.html","/evidence/records/srs4400.html","/evidence/records/study-portfolio.html","/evidence/records/udyam.html","/evidence/records/whitebook.html","/evidence/research-library.html","/evidence/scale-and-mission.html","/evidence/scale-register.html","/evidence/study-index.html","/guides/abilityscore.html","/guides/everyday-practice.html","/guides/hi/abilityscore.html","/guides/hi/everyday-practice.html","/guides/hi/licences-and-scope.html","/guides/licences-and-scope.html","/guides/te/abilityscore.html","/guides/te/everyday-practice.html","/guides/te/licences-and-scope.html","/index.html"];
const STATIC_FILES = {"/9eccddfeede58a1e7db0a8a2aa8286ab.txt":"e459f273fde67f1e","/THIRD-PARTY-NOTICES.txt":"5be896659505b278","/_assets/app.15ecc20500cf04ac.js":"15ecc20500cf04ac","/_assets/app.d0b6f1ecbbbb2a4f.js":"d0b6f1ecbbbb2a4f","/_assets/app.ef44e8029a4c4ca1.js":"ef44e8029a4c4ca1","/_assets/app.f2557d78d5adcd4e.js":"f2557d78d5adcd4e","/_assets/centre-data.27607d5693266526.js":"27607d5693266526","/_assets/citations.af0d2f3218056d4c.js":"af0d2f3218056d4c","/_assets/evidence-data.00b69726fac9596a.js":"00b69726fac9596a","/_assets/evidence-data.9b8ec400de89bb5a.js":"9b8ec400de89bb5a","/_assets/experience.04adc19045923732.js":"04adc19045923732","/_assets/experience.0c8421e20514e0a0.js":"0c8421e20514e0a0","/_assets/experience.cfd31930b3e71b4c.js":"cfd31930b3e71b4c","/_assets/hfr-register.28cddf4109b868a4.js":"28cddf4109b868a4","/_assets/hfr-register.2b06d3d9ba5f9e55.js":"2b06d3d9ba5f9e55","/_assets/hfr-register.6d7dea268ff5b033.js":"6d7dea268ff5b033","/_assets/reader-extras.1044c63603f7e0c5.js":"1044c63603f7e0c5","/_assets/reader-extras.17eecc7b7f093deb.js":"17eecc7b7f093deb","/_assets/reader-extras.1f968689d7cd330e.js":"1f968689d7cd330e","/_assets/reader-extras.a8a9b9cf48cc7bc5.js":"a8a9b9cf48cc7bc5","/_assets/reader-extras.da9fc8e2f1c3f111.js":"da9fc8e2f1c3f111","/_assets/reader-extras.f173bd0c358116c4.js":"f173bd0c358116c4","/_assets/reader.40452271b3332f86.js":"40452271b3332f86","/_assets/reader.6847028d3e806f76.js":"6847028d3e806f76","/_assets/reader.b04b8d8e45b5a09b.js":"b04b8d8e45b5a09b","/_assets/reader.b0b7d4bf6b1c6eb7.js":"b0b7d4bf6b1c6eb7","/_assets/reader.ea5c3a378ca32ebe.js":"ea5c3a378ca32ebe","/_assets/share.165b17381d658d30.js":"165b17381d658d30","/_assets/share.3936a806e90bd233.js":"3936a806e90bd233","/_assets/share.98d18703a909a044.js":"98d18703a909a044","/_assets/site.061074e50cd66969.css":"061074e50cd66969","/_assets/site.08d9c2c283dcaafd.css":"08d9c2c283dcaafd","/_assets/site.0e937e03ab8495e9.css":"0e937e03ab8495e9","/_assets/site.183b6aa4a5ad4891.css":"183b6aa4a5ad4891","/_assets/site.1f4052f0f152230c.css":"1f4052f0f152230c","/_assets/site.2c1f199ae715085a.css":"2c1f199ae715085a","/_assets/site.355eda3362219504.css":"355eda3362219504","/_assets/site.37048f325c3ca38d.css":"37048f325c3ca38d","/_assets/site.3f04e970f2604559.css":"3f04e970f2604559","/_assets/site.50f3507259aeef19.css":"50f3507259aeef19","/_assets/site.568ce1da0d3dc08f.css":"568ce1da0d3dc08f","/_assets/site.584ba2304a10ec2f.css":"584ba2304a10ec2f","/_assets/site.59ae78f388f512ef.css":"59ae78f388f512ef","/_assets/site.6dfa7df75f1dd08c.css":"6dfa7df75f1dd08c","/_assets/site.7dfc7eb6d583f77c.css":"7dfc7eb6d583f77c","/_assets/site.83201482b64cc036.css":"83201482b64cc036","/_assets/site.9563d0d35438284c.css":"9563d0d35438284c","/_assets/site.9a4c4c4fa2aa2363.css":"9a4c4c4fa2aa2363","/_assets/site.9d275bee690cc1f9.css":"9d275bee690cc1f9","/_assets/site.b25f41a401c9712e.css":"b25f41a401c9712e","/_assets/site.c5d37ea3a8e22bf6.css":"c5d37ea3a8e22bf6","/_assets/site.cd2b4d5224a1606c.css":"cd2b4d5224a1606c","/_assets/site.d195f2ed1b894eda.css":"d195f2ed1b894eda","/_assets/site.d202fe4d252a0901.css":"d202fe4d252a0901","/_assets/site.d246e5107cd77cfd.css":"d246e5107cd77cfd","/_assets/site.d7816c4601087be7.css":"d7816c4601087be7","/_assets/site.e0086641ea259dfb.css":"e0086641ea259dfb","/_assets/site.e3197761c71999ae.css":"e3197761c71999ae","/_assets/site.e67352ad0a214267.css":"e67352ad0a214267","/_assets/site.ee8a13cc3918a80a.css":"ee8a13cc3918a80a","/_assets/site.fde72847262fea60.css":"fde72847262fea60","/_assets/site.fe8144290a1989af.css":"fe8144290a1989af","/app.js":"ef44e8029a4c4ca1","/brand-header.jpg":"ca02e873f06273be","/centre-data.js":"bce6f50db5576803","/citations.css":"dc3efce071c72ea7","/citations.js":"af0d2f3218056d4c","/evidence-data.js":"0e985954c371025c","/evidence-design.css":"29bc3acf2fc9ee16","/evidence/answers.json":"d324509b657c0696","/evidence/assurance-map.html":"d534c7a84fb52ca1","/evidence/assurance-map.json":"b91cb54b23828ef6","/evidence/assurance-map.txt":"8ef4786922b8ebe1","/evidence/bis.pdf":"91abd06c40e11018","/evidence/books/autism-mothers-handbook-english.pdf":"ee6da521dfa35987","/evidence/books/autism-mothers-handbook-telugu.pdf":"bd5ba04d7c64b08f","/evidence/books/voice-of-the-unheard.pdf":"cc1500b2356035c2","/evidence/citation-index.json":"57e21418ee96d195","/evidence/citations/autism-mothers-handbook-english.bib":"4cf9532d0b13d088","/evidence/citations/autism-mothers-handbook-english.ris":"2fdaba451d899cda","/evidence/citations/autism-mothers-handbook-english.txt":"5e0a33b90fd159f1","/evidence/citations/autism-mothers-handbook-telugu.bib":"0f4b42eaa0d3f0ae","/evidence/citations/autism-mothers-handbook-telugu.ris":"a9614f0d3312f167","/evidence/citations/autism-mothers-handbook-telugu.txt":"ae0e8f6e91287684","/evidence/citations/record-appreciations.bib":"25514c0b2579ca50","/evidence/citations/record-appreciations.ris":"f0587bbabed8797d","/evidence/citations/record-appreciations.txt":"568670dc2db05813","/evidence/citations/record-awards.bib":"c3f532c716551c37","/evidence/citations/record-awards.ris":"51be430b4ed34536","/evidence/citations/record-awards.txt":"e2f72ca91468a74d","/evidence/citations/record-bis.bib":"83ba6dc901da311a","/evidence/citations/record-bis.ris":"ebde2151fd79c41b","/evidence/citations/record-bis.txt":"2e37df9f8674ada4","/evidence/citations/record-books.bib":"3534503eab31475f","/evidence/citations/record-books.ris":"baf5bf96d6449e9a","/evidence/citations/record-books.txt":"b3167f2f6b048d22","/evidence/citations/record-classification.bib":"5628c1df57b1319f","/evidence/citations/record-classification.ris":"5c49a0c2cc5dc4b5","/evidence/citations/record-classification.txt":"b6a78fcd2d7b283d","/evidence/citations/record-district-register.bib":"7d3908d5d26a3151","/evidence/citations/record-district-register.ris":"d0915f628b27c65f","/evidence/citations/record-district-register.txt":"f4305683f209a653","/evidence/citations/record-dossier.bib":"967445e72ce43f26","/evidence/citations/record-dossier.ris":"b22e7cfdc6e7657c","/evidence/citations/record-dossier.txt":"ea2a9a6aec87e30a","/evidence/citations/record-dpiit.bib":"8a9d7a6d4524ed63","/evidence/citations/record-dpiit.ris":"7a291e5c21c1efb8","/evidence/citations/record-dpiit.txt":"2798c3a6ceb62af5","/evidence/citations/record-external-validation.bib":"688f5e7198e922d4","/evidence/citations/record-external-validation.ris":"9027816b68fde6a8","/evidence/citations/record-external-validation.txt":"b01b2c4306ae807d","/evidence/citations/record-gst.bib":"7d69af7a7e7dccfe","/evidence/citations/record-gst.ris":"490862286f264449","/evidence/citations/record-gst.txt":"695acebfce7cec41","/evidence/citations/record-hfr.bib":"b9bb7ee8464415a4","/evidence/citations/record-hfr.ris":"7d0d2398c4ccf564","/evidence/citations/record-hfr.txt":"7a27b84721b85109","/evidence/citations/record-iso13485.bib":"f813844041e0fb49","/evidence/citations/record-iso13485.ris":"419fd961a49f88b6","/evidence/citations/record-iso13485.txt":"545b42864e72436b","/evidence/citations/record-iso27001.bib":"4f573a46db75951d","/evidence/citations/record-iso27001.ris":"3fd83b3004ab7185","/evidence/citations/record-iso27001.txt":"e7b941907482c671","/evidence/citations/record-lei.bib":"bee56d70e3e1bfd6","/evidence/citations/record-lei.ris":"721f6d23b397a509","/evidence/citations/record-lei.txt":"46a280a2dfc3abb7","/evidence/citations/record-marks-copyright.bib":"1994647ac2c053ee","/evidence/citations/record-marks-copyright.ris":"479a7140e561572b","/evidence/citations/record-marks-copyright.txt":"6cb0b9773b7599f9","/evidence/citations/record-mca.bib":"e665c084033035d6","/evidence/citations/record-mca.ris":"45dc4a9b3425dde8","/evidence/citations/record-mca.txt":"2b8d369e2d6f0124","/evidence/citations/record-md3.bib":"72e46c1ae3a4c4c5","/evidence/citations/record-md3.ris":"449f8502a8984209","/evidence/citations/record-md3.txt":"d13a9d314a489e82","/evidence/citations/record-md5.bib":"fe57104bffbd8968","/evidence/citations/record-md5.ris":"a2fd60979bf3e5bd","/evidence/citations/record-md5.txt":"7ea5dd6b2b575750","/evidence/citations/record-methodology.bib":"0700dafea6b0f448","/evidence/citations/record-methodology.ris":"3af0007ed87baf22","/evidence/citations/record-methodology.txt":"6b812b213e905a1a","/evidence/citations/record-operating-metrics.bib":"3f91c1e3bf92d143","/evidence/citations/record-operating-metrics.ris":"a2ff6b20a47b2a17","/evidence/citations/record-operating-metrics.txt":"bd0800d471d0be95","/evidence/citations/record-outcome-claim.bib":"b02ac825efffc4c4","/evidence/citations/record-outcome-claim.ris":"4db7f00ab2b006a2","/evidence/citations/record-outcome-claim.txt":"4afe03d45069d840","/evidence/citations/record-pan.bib":"36d224c1f188f5ad","/evidence/citations/record-pan.ris":"deef31966c75781b","/evidence/citations/record-pan.txt":"c67278b2d1a82546","/evidence/citations/record-patents.bib":"981254c52f853fef","/evidence/citations/record-patents.ris":"5cd59c9c88667811","/evidence/citations/record-patents.txt":"0a6fb30ba89ff94e","/evidence/citations/record-rpwd-attapur.bib":"d443b2a67834852c","/evidence/citations/record-rpwd-attapur.ris":"b4cfdef98656618c","/evidence/citations/record-rpwd-attapur.txt":"4119a64f75496c49","/evidence/citations/record-rpwd-begumpet.bib":"d4eabcf2d322eee2","/evidence/citations/record-rpwd-begumpet.ris":"f9bebd74c6fe52df","/evidence/citations/record-rpwd-begumpet.txt":"ca58db3cafea403e","/evidence/citations/record-rpwd-nellore.bib":"6897ad867ed26a53","/evidence/citations/record-rpwd-nellore.ris":"186214e67825a87c","/evidence/citations/record-rpwd-nellore.txt":"1bf7a8b17e2c8b25","/evidence/citations/record-rpwd-nizamabad.bib":"d4bd5fe5ce579082","/evidence/citations/record-rpwd-nizamabad.ris":"6f8cbda630647d26","/evidence/citations/record-rpwd-nizamabad.txt":"3b4b00f593ea924d","/evidence/citations/record-sae3000.bib":"6827bb06902402f1","/evidence/citations/record-sae3000.ris":"25f0ebc6ae4150a9","/evidence/citations/record-sae3000.txt":"449e0c7c161e155b","/evidence/citations/record-september-handout.bib":"95854ebe57f9eb04","/evidence/citations/record-september-handout.ris":"d2a252334c9970ac","/evidence/citations/record-september-handout.txt":"12ddc2777373860c","/evidence/citations/record-sovereign-walkthrough.bib":"08c424d1e0cff6bd","/evidence/citations/record-sovereign-walkthrough.ris":"da7abd29e92516c1","/evidence/citations/record-sovereign-walkthrough.txt":"1a2fcf07910c6d82","/evidence/citations/record-srs4400.bib":"0f4f83ae34c59522","/evidence/citations/record-srs4400.ris":"be1869fa945367f4","/evidence/citations/record-srs4400.txt":"7b774af71882a8c8","/evidence/citations/record-study-portfolio.bib":"ffbd38a8b9b25601","/evidence/citations/record-study-portfolio.ris":"8fc734993e07d016","/evidence/citations/record-study-portfolio.txt":"858d65ec6fd92548","/evidence/citations/record-udyam.bib":"06bb17e8d02539e9","/evidence/citations/record-udyam.ris":"4951a4c3e975014b","/evidence/citations/record-udyam.txt":"43c3da1a77287a2a","/evidence/citations/record-whitebook.bib":"d393cee63c099336","/evidence/citations/record-whitebook.ris":"4523bcd10dd3776a","/evidence/citations/record-whitebook.txt":"24b75f15e4f9e106","/evidence/citations/voice-of-the-unheard.bib":"03ffbb4a129c8eb0","/evidence/citations/voice-of-the-unheard.ris":"e71adc70465b4e0b","/evidence/citations/voice-of-the-unheard.txt":"c9d332c5f966c670","/evidence/citations/zenodo-15487405.bib":"eed87c07484fc71e","/evidence/citations/zenodo-15487405.ris":"f3274af02e726aaa","/evidence/citations/zenodo-15487405.txt":"bbbb71841bcd234e","/evidence/citations/zenodo-19482123.bib":"be367448af3dec0c","/evidence/citations/zenodo-19482123.ris":"7181837ea832f653","/evidence/citations/zenodo-19482123.txt":"f3e08cd3462db48e","/evidence/citations/zenodo-19482476.bib":"8c06383afc6b267b","/evidence/citations/zenodo-19482476.ris":"cfe77d2104d0e670","/evidence/citations/zenodo-19482476.txt":"01370aeaabfffad5","/evidence/citations/zenodo-22761782.bib":"ea13174b43546e54","/evidence/citations/zenodo-22761782.ris":"5a3972eef131eaea","/evidence/citations/zenodo-22761782.txt":"e4dcec3c86ce8a74","/evidence/citations/zenodo-22761810.bib":"694e18974a7f139d","/evidence/citations/zenodo-22761810.ris":"9d2eca291d1d1260","/evidence/citations/zenodo-22761810.txt":"223c481de50e0883","/evidence/citations/zenodo-22761832.bib":"9feb3277d38313c2","/evidence/citations/zenodo-22761832.ris":"da371c6c1dacbd59","/evidence/citations/zenodo-22761832.txt":"515268748f55b9e2","/evidence/citations/zenodo-22827813.bib":"627d7b49c1bebfe5","/evidence/citations/zenodo-22827813.ris":"17d01141f36e2476","/evidence/citations/zenodo-22827813.txt":"341d430a0e4a136d","/evidence/cite.html":"4854c76042962bc4","/evidence/classification-application.pdf":"1a5e96c3fe7eccb7","/evidence/developmental-pathway.json":"885ee337f6cba4d8","/evidence/developmental-pathway.txt":"574951398fd998d7","/evidence/district-excerpts.pdf":"60be903abfbf06b7","/evidence/district-register.html":"aa7230d426612583","/evidence/document-manifest.json":"50d5b51decb27817","/evidence/dpiit.pdf":"00447971b4ede9c0","/evidence/editorial-policy.json":"cd82fccea38834be","/evidence/evidence-provenance.json":"d7c06edc5c7aa4b4","/evidence/evidence-register.html":"0e4a92dbc95f8bad","/evidence/evidence.json":"f93182003a7715a1","/evidence/experience-guide.json":"f4e931d5f90c1293","/evidence/experience-guide.txt":"60a4a5fd846440e5","/evidence/global-context.html":"9a8e72be101a3851","/evidence/global-context.json":"aa0007a3e2f92583","/evidence/global-context.txt":"be92206e5e029dbd","/evidence/hfr-dashboard-checks.json":"56c4799a11686274","/evidence/hfr-register.csv":"3fe04c1e45ab1741","/evidence/hfr-register.html":"bff3f6cb0453fe3b","/evidence/hfr-register.json":"cdb98a8d37e266e4","/evidence/icai-udin-verifications-2026-09-19.pdf":"cef973ab3232c8fd","/evidence/iso13485.pdf":"b577fb0227453d32","/evidence/iso27001.pdf":"4e50011495c76c43","/evidence/issuer-checks.json":"ceba49bd4a2936f7","/evidence/mca.pdf":"c167d68862828d1b","/evidence/md5.pdf":"09a063e47b664e87","/evidence/parent-guides.json":"ab300163dacd6838","/evidence/privacy.html":"f5af7a9bff3b6f6f","/evidence/publications.json":"629e4e9af50c4ff8","/evidence/publications/autism-mothers-handbook-english.html":"fe3688b1854f18df","/evidence/publications/autism-mothers-handbook-telugu.html":"0ba2888275c8339b","/evidence/publications/voice-of-the-unheard.html":"28bc76f1f8e205b6","/evidence/publications/zenodo-15487405.html":"68f185391a7e3892","/evidence/publications/zenodo-15487405.pdf":"7511fe153af7da12","/evidence/publications/zenodo-19482123.html":"08d9bf6cfacaeeab","/evidence/publications/zenodo-19482123.pdf":"61348d8c1f5159a0","/evidence/publications/zenodo-19482476.html":"aba9cb86955582c9","/evidence/publications/zenodo-19482476.pdf":"3dc3e4fc2ed23001","/evidence/publications/zenodo-22761782.html":"7f9581a28648cb5f","/evidence/publications/zenodo-22761782.pdf":"ca3eb27620e11c05","/evidence/publications/zenodo-22761810.html":"f88675799649b1fd","/evidence/publications/zenodo-22761810.pdf":"134705dc6cf2bfcb","/evidence/publications/zenodo-22761832.html":"bbadb50c42e7d1b7","/evidence/publications/zenodo-22761832.pdf":"3d732bf504aa8a9b","/evidence/publications/zenodo-22827813.html":"7ea8827c8ac98cac","/evidence/publications/zenodo-22827813.pdf":"2d97944d00fd078c","/evidence/reading-topics.json":"7e6966ae07e937dc","/evidence/recognition-register.html":"812d3ec4623171d8","/evidence/records/appreciations.html":"7fefff22defeb304","/evidence/records/awards.html":"b68e96c1d90c83e7","/evidence/records/bis.html":"a597f5b5ecaa78c7","/evidence/records/books.html":"c2a563bec3ac0b1e","/evidence/records/classification.html":"de3e45c9c07be141","/evidence/records/district-register.html":"ac3ca9021ba9f7af","/evidence/records/dossier.html":"6b7cf58da97f3622","/evidence/records/dpiit.html":"1ba0ff74df3e98c6","/evidence/records/external-validation.html":"d32afb0e35843a96","/evidence/records/gst.html":"522bd4a189775bc2","/evidence/records/hfr.html":"8201a9b87b62eb0c","/evidence/records/iso13485.html":"dcd64787d8e19fea","/evidence/records/iso27001.html":"d38e6000cbf32ddc","/evidence/records/lei.html":"642d3b2d75ea36d8","/evidence/records/marks-copyright.html":"046ea7fca7a53f5d","/evidence/records/mca.html":"99cc70211c3d88eb","/evidence/records/md3.html":"705723f58921e6e3","/evidence/records/md5.html":"4e9a513409e229a9","/evidence/records/methodology.html":"6fa50e454164372b","/evidence/records/operating-metrics.html":"58130f9cfafb57a0","/evidence/records/outcome-claim.html":"b709680461847982","/evidence/records/pan.html":"0b8c86ee57d6cac6","/evidence/records/patents.html":"2bfd64255ceb93c7","/evidence/records/rpwd-attapur.html":"ddbfa47d2d658dc1","/evidence/records/rpwd-begumpet.html":"f7b886fccdea6b90","/evidence/records/rpwd-nellore.html":"401e3ad26b63852e","/evidence/records/rpwd-nizamabad.html":"068722227dcd06a7","/evidence/records/sae3000.html":"7a5ff3f835fe16cb","/evidence/records/september-handout.html":"b54bd883ce09a50a","/evidence/records/sovereign-walkthrough.html":"22e7e03222ef97bf","/evidence/records/srs4400.html":"da60619aeb15768f","/evidence/records/study-portfolio.html":"ff82410293cf6726","/evidence/records/udyam.html":"b9b8f9a4c29ac560","/evidence/records/whitebook.html":"fa3b06c259a0e983","/evidence/research-library.bib":"b64e4fd5c0bf28d1","/evidence/research-library.html":"0f0ca6bf2a083ae4","/evidence/research-library.json":"608f1b8c9fa6fc89","/evidence/research-library.ris":"a004a85e213d3d52","/evidence/research-library.txt":"82f8642fd21d5fd7","/evidence/scale-and-mission.html":"880543b00f19e7fd","/evidence/scale-register.html":"92279d8e9a3264ea","/evidence/scale-register.json":"716d14f718b5fb0b","/evidence/scale-register.txt":"1bfdff6e786a9948","/evidence/scale-story-answers.json":"564833c327144780","/evidence/scale-story-citation.txt":"7815ccdf62ef1cb6","/evidence/scale-story.json":"37e70ddbd1a0c991","/evidence/scale-story.txt":"9b10926c3c811ec4","/evidence/section-index.json":"ef7e6e75b526837f","/evidence/share-images.json":"894c51fd945f1ef5","/evidence/share-index.json":"8740c1f4cc0371f3","/evidence/study-index.html":"775361243ca29327","/experience.css":"c677dfe48cf8ce2a","/experience.js":"0c8421e20514e0a0","/favicon.ico":"6e0bfe537574510f","/favicon.png":"959438c2bbb2bd99","/fonts/anek-bangla-OFL.txt":"de62be758bba267e","/fonts/anek-bangla.woff2":"db5e83e0c21b1f10","/fonts/anek-devanagari-OFL.txt":"de62be758bba267e","/fonts/anek-devanagari.woff2":"0c06d579af07b6ba","/fonts/anek-gujarati-OFL.txt":"de62be758bba267e","/fonts/anek-gujarati.woff2":"e10036a06fe5a75d","/fonts/anek-gurmukhi-OFL.txt":"de62be758bba267e","/fonts/anek-gurmukhi.woff2":"723c4ade7a01c780","/fonts/anek-kannada-OFL.txt":"de62be758bba267e","/fonts/anek-kannada.woff2":"43da33559cb4ee9d","/fonts/anek-latin-OFL.txt":"de62be758bba267e","/fonts/anek-latin.woff2":"0e96e6c2621df1ea","/fonts/anek-malayalam-OFL.txt":"de62be758bba267e","/fonts/anek-malayalam.woff2":"e9d8f899d84af59a","/fonts/anek-odia-OFL.txt":"de62be758bba267e","/fonts/anek-odia.woff2":"a8909e51460e9be4","/fonts/anek-tamil-OFL.txt":"de62be758bba267e","/fonts/anek-tamil.woff2":"f99260016ddf1b7a","/fonts/anek-telugu-OFL.txt":"de62be758bba267e","/fonts/anek-telugu.woff2":"3aef251e0d11458f","/fonts/dm-sans-OFL.txt":"9af36190332437f5","/fonts/dm-sans-latin.woff2":"9fea608a947e6702","/fonts/fonts.css":"4e6dcd3db2a12439","/fonts/manrope-OFL.txt":"58172e0c0fac2cda","/fonts/manrope-latin.woff2":"a30ddcd349703aff","/fonts/noto-sans-devanagari-OFL.txt":"a216f6f8d85c7228","/fonts/noto-sans-devanagari.woff2":"7b31d0cb802984aa","/guides/abilityscore.html":"d5ae125da1a66f45","/guides/abilityscore.txt":"29f8483a7d88216c","/guides/everyday-practice.html":"6f5f70d7a42c1045","/guides/everyday-practice.txt":"68b315843c2cf3cb","/guides/hi/abilityscore.html":"6c027e9bc32a6568","/guides/hi/abilityscore.txt":"9781bdc30268043a","/guides/hi/everyday-practice.html":"230555f9946287a8","/guides/hi/everyday-practice.txt":"7c109bb226813717","/guides/hi/licences-and-scope.html":"c28035ec2a71f1f0","/guides/hi/licences-and-scope.txt":"5866e1f636a5f6c7","/guides/licences-and-scope.html":"60b30da936ae3b9d","/guides/licences-and-scope.txt":"1e9942d259c177f2","/guides/te/abilityscore.html":"1ab09e8570d52bce","/guides/te/abilityscore.txt":"71cd8c89472b778e","/guides/te/everyday-practice.html":"0b7494177ac2ee09","/guides/te/everyday-practice.txt":"ae817c5a83797227","/guides/te/licences-and-scope.html":"ce3e4bdea4d8f89e","/guides/te/licences-and-scope.txt":"12e81a22cf34ee63","/hfr-register.js":"28cddf4109b868a4","/images/care-participation-1000.webp":"3ad3fa98aa5c1e70","/images/care-participation-1536.webp":"6ff9c8eb61b2033d","/images/care-participation-600.webp":"72cb412d5d2d7e5d","/images/connected-records-1000.webp":"57ae8fe1436dc927","/images/connected-records-1536.webp":"9e5390df2df7e9c9","/images/connected-records-600.webp":"3e6cf50053393bcb","/images/family-journey-1000.webp":"4f8bcf8768197634","/images/family-journey-1536.webp":"8a62b24b1ed0c5c4","/images/family-journey-600.webp":"ed0ca998f0f8d62c","/images/pinnacle-logo.webp":"194e2763ece3095f","/images/pinnacle-verify-social-20260918.jpg":"b68376ebf51889b3","/images/research/autism-mothers-handbook-english-300.webp":"42f079d78b80ebfe","/images/research/autism-mothers-handbook-english-600.webp":"b5325f1965a25245","/images/research/autism-mothers-handbook-telugu-300.webp":"a5f41790797ad460","/images/research/autism-mothers-handbook-telugu-600.webp":"2f0af08a08affdbc","/images/research/global-research-whitebook-300.webp":"6564cf6d9b147983","/images/research/global-research-whitebook-600.webp":"60abe3d0639c7a4a","/images/research/voice-of-the-unheard-300.webp":"5ff18624d2f440e7","/images/research/voice-of-the-unheard-600.webp":"511933229d2ccd54","/images/research/zenodo-19482123-300.webp":"650f2a8c9a8e3a11","/images/research/zenodo-19482123-600.webp":"6c30c892b098c0b9","/images/research/zenodo-19482476-300.webp":"255c2a762a23a638","/images/research/zenodo-19482476-600.webp":"059b88ca7300299a","/images/research/zenodo-22761810-300.webp":"7f7131abfd07eabb","/images/research/zenodo-22761810-600.webp":"5c1b4614e9917a43","/images/research/zenodo-22827813-300.webp":"274a5584831374d7","/images/research/zenodo-22827813-600.webp":"cf223a262a85461e","/images/social/evidence-assurance-map-43002ad696cc.jpg":"43002ad696cc6458","/images/social/evidence-cite-633759352089.jpg":"633759352089c2d9","/images/social/evidence-district-register-91288a2cb68b.jpg":"91288a2cb68b7c95","/images/social/evidence-evidence-register-d5fa0af9e5df.jpg":"d5fa0af9e5dfdc53","/images/social/evidence-global-context-a3a51312f971.jpg":"a3a51312f971bbbe","/images/social/evidence-hfr-register-45016b0b4625.jpg":"45016b0b4625b759","/images/social/evidence-hfr-register-93ad245052cc.jpg":"93ad245052cc941b","/images/social/evidence-hfr-register-c30367f2b1d1.jpg":"c30367f2b1d1467f","/images/social/evidence-privacy-3cb997a01925.jpg":"3cb997a019259a52","/images/social/evidence-publications-autism-mothers-handbook-english-cfd8cdd7f0e2.jpg":"cfd8cdd7f0e2ad53","/images/social/evidence-publications-autism-mothers-handbook-telugu-82222a40c0d5.jpg":"82222a40c0d52d81","/images/social/evidence-publications-voice-of-the-unheard-a23aeb152769.jpg":"a23aeb1527692f8f","/images/social/evidence-publications-zenodo-15487405-40bb3c295be7.jpg":"40bb3c295be787ef","/images/social/evidence-publications-zenodo-19482123-6fc303c3c92f.jpg":"6fc303c3c92f1add","/images/social/evidence-publications-zenodo-19482476-eb8747447ce8.jpg":"eb8747447ce8bc00","/images/social/evidence-publications-zenodo-22761782-8a6f1f9ffa1b.jpg":"8a6f1f9ffa1bf2cc","/images/social/evidence-publications-zenodo-22761810-aa22ebe7acd9.jpg":"aa22ebe7acd9b455","/images/social/evidence-publications-zenodo-22761832-4a39deca5977.jpg":"4a39deca59775e06","/images/social/evidence-publications-zenodo-22827813-3e97bded25ab.jpg":"3e97bded25abaa3a","/images/social/evidence-recognition-register-5924ede3213d.jpg":"5924ede3213d09df","/images/social/evidence-records-appreciations-4b9d1a3b48f5.jpg":"4b9d1a3b48f55898","/images/social/evidence-records-awards-41ccf7388a75.jpg":"41ccf7388a75dc0f","/images/social/evidence-records-bis-52990479c869.jpg":"52990479c8693cf6","/images/social/evidence-records-books-43f7d5103eb7.jpg":"43f7d5103eb71258","/images/social/evidence-records-classification-73f4daf4af72.jpg":"73f4daf4af722b79","/images/social/evidence-records-district-register-efe5a8934152.jpg":"efe5a8934152f3fc","/images/social/evidence-records-dossier-0cc801cc4db6.jpg":"0cc801cc4db6cde4","/images/social/evidence-records-dpiit-29008b715fb0.jpg":"29008b715fb06e54","/images/social/evidence-records-external-validation-aa8916c9acf9.jpg":"aa8916c9acf93a6e","/images/social/evidence-records-gst-2826278c6b0f.jpg":"2826278c6b0f3bbf","/images/social/evidence-records-hfr-04e8afcffc12.jpg":"04e8afcffc125937","/images/social/evidence-records-hfr-1403c1ceccd7.jpg":"1403c1ceccd731ac","/images/social/evidence-records-hfr-403b0707753d.jpg":"403b0707753dda1a","/images/social/evidence-records-iso13485-7137ce191b40.jpg":"7137ce191b40a035","/images/social/evidence-records-iso27001-7c700ec16839.jpg":"7c700ec168393781","/images/social/evidence-records-lei-18dfc4b1d42e.jpg":"18dfc4b1d42e12c2","/images/social/evidence-records-marks-copyright-497b22debbbe.jpg":"497b22debbbe7468","/images/social/evidence-records-mca-e9d9210e01cb.jpg":"e9d9210e01cb8833","/images/social/evidence-records-md3-bc8a15fafa28.jpg":"bc8a15fafa284b93","/images/social/evidence-records-md5-3c72d288ba38.jpg":"3c72d288ba384eaa","/images/social/evidence-records-methodology-170e0d77f720.jpg":"170e0d77f720d175","/images/social/evidence-records-operating-metrics-9f9a20cd0b56.jpg":"9f9a20cd0b56f938","/images/social/evidence-records-outcome-claim-683420f8b40c.jpg":"683420f8b40c4035","/images/social/evidence-records-pan-b112cc5c59a7.jpg":"b112cc5c59a79833","/images/social/evidence-records-patents-132ca86c75f5.jpg":"132ca86c75f5f376","/images/social/evidence-records-rpwd-attapur-7b95d5fce4af.jpg":"7b95d5fce4afa5b1","/images/social/evidence-records-rpwd-begumpet-a3c7c6b08518.jpg":"a3c7c6b08518fbfe","/images/social/evidence-records-rpwd-nellore-655d0b3c807b.jpg":"655d0b3c807bce18","/images/social/evidence-records-rpwd-nizamabad-f4722562611e.jpg":"f4722562611e8014","/images/social/evidence-records-sae3000-bc36a47c8932.jpg":"bc36a47c89328222","/images/social/evidence-records-september-handout-d4df3f2e3b1b.jpg":"d4df3f2e3b1b93e4","/images/social/evidence-records-sovereign-walkthrough-ea9744beb541.jpg":"ea9744beb541a3d7","/images/social/evidence-records-srs4400-ee08cee6fc51.jpg":"ee08cee6fc51fde8","/images/social/evidence-records-study-portfolio-9e64603c51dd.jpg":"9e64603c51dda240","/images/social/evidence-records-udyam-1646034cad7d.jpg":"1646034cad7d176f","/images/social/evidence-records-whitebook-aa012f24a69a.jpg":"aa012f24a69a6490","/images/social/evidence-research-library-7b0cec026659.jpg":"7b0cec026659695d","/images/social/evidence-scale-register-d853deb81f85.jpg":"d853deb81f85c990","/images/social/evidence-study-index-9b90576c5120.jpg":"9b90576c51207106","/images/social/guide-abilityscore-en-5f492c595991.jpg":"5f492c5959913535","/images/social/guide-abilityscore-hi-f56bd9dbaa8d.jpg":"f56bd9dbaa8da412","/images/social/guide-abilityscore-te-fedf58a210e3.jpg":"fedf58a210e3d951","/images/social/guide-everyday-practice-en-20cb84cad85a.jpg":"20cb84cad85a464f","/images/social/guide-everyday-practice-hi-8f1738a3a3ac.jpg":"8f1738a3a3ace866","/images/social/guide-everyday-practice-te-9113bec15759.jpg":"9113bec15759fcb3","/images/social/guide-licences-and-scope-en-1b56bffd4678.jpg":"1b56bffd46784e49","/images/social/guide-licences-and-scope-hi-f230b61f734b.jpg":"f230b61f734b289a","/images/social/guide-licences-and-scope-te-e3e1e91c3713.jpg":"e3e1e91c3713d661","/images/social/pinnacle-scale-and-mission-5bec27e7071d.jpg":"5bec27e7071dedee","/images/social/pinnacle-verify-e142acf48dd4.jpg":"e142acf48dd43af1","/images/sources/bis-page-2-650.webp":"c71dd8b68c8dfa4c","/images/sources/md5-page-1-650.webp":"97e2390cd97daa69","/impact.css":"1d0f18f8b3072f04","/index.html":"7c17357290f88ddb","/llms-full.txt":"99d710d29d7e3cc3","/llms.txt":"09d5351d45e9c632","/mobile.css":"8eb05ad8105466df","/multilingual.css":"9dc97101bada069f","/narrative.css":"a2adedbbb207db73","/parent-guides.css":"e2e9877ee9ea0bd4","/pathway-accent.svg":"f61d5e338f46f471","/presentation.css":"952b5bdf2aaa8ba1","/reader-extras.js":"da9fc8e2f1c3f111","/reader.css":"86e58dc6d0c4a5c4","/reader.js":"b0b7d4bf6b1c6eb7","/robots.txt":"a6c9c201c329a564","/semantic.css":"9ebeb9db84533f8b","/share.css":"186be29a4c1b38af","/share.js":"98d18703a909a044","/site.webmanifest":"62883482df1dfa19","/sitemap.xml":"ee0b8f6af4aedf4e","/styles.css":"bd22fd8d7d30c2ed","/topics.css":"cbc89ad2ed5cd650","/upgrade.css":"b545623d9a0cf07b","/world.css":"b528e23ea7cb8096"};
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
const CONTEXT_BODY_LIMIT=2*1024*1024;
const escapeContext=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hasRobotsExclusion=value=>/\b(?:noindex|none)\b/i.test(value||'');
const prohibitsContextTransform=value=>/(?:^|,)\s*(?:private|no-store|no-transform)(?:\s*(?:=|,|$))/i.test(value||'');

export function contextualEvidenceRule(request,rules=CONTEXTUAL_EVIDENCE_RULES){
 const url=new URL(request.url);
 if(request.method!=='GET'||!['www.pinnacleblooms.org','pinnacleblooms.org'].includes(url.hostname))return null;
 if(request.headers.has('authorization')||request.headers.has('range')||/\bno-transform\b/i.test(request.headers.get('cache-control')||''))return null;
 // A single trailing slash is the only tolerated path variant. Prefix matches never receive content.
 const pathname=url.pathname.endsWith('/')?url.pathname.slice(0,-1):url.pathname;
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
   let source;try{source=env.ASSETS?await env.ASSETS.fetch(new Request('https://assets.local'+file,{method:request.method,headers:range?{Range:range}:{}})):await fetch(upstream,{method:request.method,headers,redirect:'manual'});}catch{return new Response('The verification page is temporarily unavailable. Please try again.',{status:503,headers:{'cache-control':'no-store','retry-after':'10'}});}
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
  if(incoming.hostname==='www.pinnacleblooms.org'&&(incoming.pathname==='/abilityscore'||incoming.pathname==='/abilityscore/'))return transformContextualEvidence(request,await fetch(request));
  if(incoming.hostname!=='www.pinnacleblooms.org')return fetch(request);
  if(incoming.pathname==='/'){
   const response=await fetch(request);if(!['GET','HEAD'].includes(request.method)||response.status!==200||!response.headers.get('content-type')?.includes('text/html'))return response;
   const h=new Headers(response.headers);for(const k of ['content-length','content-encoding','etag','last-modified','age','expires'])h.delete(k);
   if(!h.get('cache-control')?.match(/private|no-store/i)&&!h.has('set-cookie'))h.set('cache-control','public, max-age=60');
   if(request.method==='HEAD')return new Response(null,{status:200,headers:h});
   return new HTMLRewriter()
    .on('head',{element(element){element.append(FAVICON_LINKS+'<meta name="ahrefs-site-verification" content="bc583a48d3e574453dd16c6719ff9b935dc158da08e5473efa5446368de630bb">',{html:true});}})
    .on('script[type="application/ld+json"]',new RootEntityCorrection())
    .on('.cm-f-footer-privacylinks > ul',{element(element){element.append('<li><a href="https://www.pinnacleblooms.org/verify/">Licences, research &amp; evidence</a></li>',{html:true});}})
    .transform(new Response(response.body,{status:200,headers:h}));
  }
  if(incoming.pathname==='/robots.txt'){
   const response=await fetch(new Request(request,{method:'GET'}));if(response.status!==200)return response;let body=await readTextLimited(response,65536);if(!body.includes(PUBLIC+'/sitemap.xml'))body=body.trimEnd()+'\n\n# Pinnacle verification evidence\nSitemap: '+PUBLIC+'/sitemap.xml\n';const h=cleanHeaders(response.headers,true);h.set('content-type','text/plain; charset=utf-8');h.set('cache-control','public, max-age=300');return new Response(request.method==='HEAD'?null:body,{status:200,headers:h});
  }
  if(incoming.pathname==='/llms.txt')return Response.redirect(PUBLIC+'/llms.txt',308);
  return fetch(request);
 }
};
