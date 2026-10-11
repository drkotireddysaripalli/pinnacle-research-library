// deployment/legacy-social-metadata/media.mjs
var BRAND_IMAGE = "https://www.pinnacleblooms.org/pinnacle-pages-assets/pinnacle-blooms-network-lockup.CUnZranx_Z2nTFgn.webp";
var missing = /* @__PURE__ */ new Set(["/Assets/Materials/20707165343.jpg", "/Images/ProfileImages/12798111602.jpg", "/Images/ProfileImages/20552642664.jpg", "/Images/ProfileImages/20707155230.jpg", "/Images/ProfileImages/20708422583.jpg", "/Images/ProfileImages/20708623831.jpg", "/Images/ProfileImages/20708666496.jpg", "/Images/ProfileImages/20709822519.jpg", "/Images/ProfileImages/20710414688.jpg", "/Images/ProfileImages/3062523339.jpg", "/Images/ProfileImages/3062523460.jpg", "/Images/ProfileImages/3062523628.jpg", "/Images/ProfileImages/3062523633.jpg", "/Images/ProfileImages/3062523640.jpg", "/Images/ProfileImages/3062523874.jpg", "/Images/ProfileImages/3062525279.jpg", "/Images/ProfileImages/3062526597.jpg", "/Images/ProfileImages/3159708782.jpg", "/Images/ProfileImages/3178670904.jpg", "/Images/ProfileImages/3549649944.jpg"]);
missing.add("/Assets/Materials/318.jpg");
for (const p of ["/Assets/AbilityScore_Universal_0-1000_Child%20Development_Metric.jpg", "/Assets/Materials/20707167545.jpg", "/Assets/Materials/962.jpg", "/Assets/OG/495.jpg", "/images/therapysphere-room.jpg"]) missing.add(p);
function isMissingMedia(value) {
  try {
    const u = new URL(value, "https://www.pinnacleblooms.org");
    return ["https://www.pinnacleblooms.org", "https://pinnacleblooms.org"].includes(u.origin) && missing.has(u.pathname);
  } catch {
    return false;
  }
}
var legacyMaterialPage = /^\/(?:ma|m|a)\//i;
var legacyMaterialImage = /^\/Assets\/Materials\/\d+\.jpg$/i;
function repairKnownBrokenMedia(request, response) {
  const pagePath = typeof request === "string" ? new URL(request).pathname : new URL(request.url).pathname;
  const unusable = (value) => isMissingMedia(value) || (() => {
    try {
      return legacyMaterialPage.test(pagePath) && legacyMaterialImage.test(new URL(value, "https://www.pinnacleblooms.org").pathname);
    } catch {
      return false;
    }
  })();
  const headers = new Headers(response.headers);
  for (const key of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(key);
  headers.set("x-pinnacle-known-media", "verified-missing-20261011");
  return new HTMLRewriter().on("img", { element(el) {
    if (!unusable(el.getAttribute("src"))) return;
    if (new URL(el.getAttribute("src"), "https://www.pinnacleblooms.org").pathname === "/Assets/Materials/318.jpg") {
      el.remove();
      return;
    }
    el.setAttribute("src", BRAND_IMAGE);
    el.setAttribute("alt", "Pinnacle Blooms Network logo");
    el.setAttribute("data-pinnacle-brand-fallback", "true");
    el.setAttribute("style", (el.getAttribute("style") || "") + ";object-fit:contain;background:#fff;padding:12px;box-sizing:border-box;");
    for (const name of ["srcset", "data-src", "data-srcset"]) el.removeAttribute(name);
  } }).on("meta", { element(el) {
    if (["og:image", "twitter:image"].includes(el.getAttribute("property") || el.getAttribute("name")) && unusable(el.getAttribute("content"))) el.setAttribute("content", BRAND_IMAGE);
  } }).transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}

// deployment/legacy-social-metadata/staff-records.mjs
var currentStaffPaths = { "3815": "/staff/ALURI-TARUN-KUMAR/3815", "52004": "/staff/Aluri-Durgaprasad/52004", "72543": "/staff/B-Naveen-Harshavardhan/72543", "44859": "/staff/Gadapa-Lakshmi-Swethachandana/44859", "51942": "/staff/Kali-chitti-thalli/51942", "52216": "/staff/Madapothala-Renuka-Jyothi/52216", "60639": "/staff/Mohammed-khariya-bathool/60639", "73253": "/staff/Aastha-Bhargava/73253", "71492": "/staff/abdul-mannan-ahmed-farooqui/71492", "75726": "/staff/Anusha-N-R/75726", "71180": "/staff/Anusha-Peddada/71180", "70092": "/staff/Arika-Srilekha/70092", "40697": "/staff/ARIKACHERLA-MOUNIKA/40697", "75106": "/staff/Arushi-Singh/75106", "20710641772": "/staff/Asalla-Rajkumar/20710641772", "12093182405": "/staff/Asma-jabeen/12093182405", "73094": "/staff/Avusula-Mukthananda/73094", "20709299570": "/staff/Azmeera-Raju/20709299570", "53980": "/staff/B-Rohini/53980", "20708951509": "/staff/Badithimani-Nirmala-Kumari/20708951509", "8936756986": "/staff/Bandaru-Rajitha/8936756986", "71971": "/staff/Barigela-Sahithi/71971", "18890": "/staff/Bassa-Subrahmanyam/18890", "60918": "/staff/Besta-Soumya-Sree/60918", "72140": "/staff/Bhargavi-Airpula/72140", "50078": "/staff/BHASKARA-RAO-MEESALA/50078", "61507": "/staff/Bhukya-srinu/61507", "73883": "/staff/Bitra-Mamatha-mayi/73883", "73286": "/staff/Boddu-subhashini/73286", "34570": "/staff/Bolamala-komali/34570", "70936": "/staff/Boya-Saniya-Sree/70936", "3062540101": "/staff/Burra-Satish-Goud/3062540101", "20708951526": "/staff/Burugu-Prasanthi/20708951526", "74294": "/staff/Chaitanya-Daravemula/74294", "20688775316": "/staff/Charmala-Bhavani/20688775316", "72556": "/staff/Chaya-K/72556", "41356": "/staff/Chille-Venkatalakshmi/41356", "44776": "/staff/CHINNA-KANDUKURI-SHIRISHA/44776", "73336": "/staff/Chintakindi-Ranjith-kumar/73336", "23223": "/staff/chintalapudi-gangaratnam/23223", "71469": "/staff/Chintalapudi-Gowthami/71469", "4065": "/staff/Chodavarapu-Gowthami/4065", "69096": "/staff/Chokkapu-venkatalakshmi/69096", "72542": "/staff/D-Salma-khanam/72542", "20709145666": "/staff/Dammannapeta-Prashanth/20709145666", "13908036187": "/staff/Dandimenu-Aruna/13908036187", "50051": "/staff/Dara-Deepthi/50051", "20709668364": "/staff/Dega-Devendrudu/20709668364", "20709622908": "/staff/Devalraju-Sai-Sujitha/20709622908", "8780": "/staff/Dhanamma/8780", "50091": "/staff/Dharavath-kalpana/50091", "20708275644": "/staff/Didekula-Noor-Babu/20708275644", "73603": "/staff/Disha-Prakash/73603", "11469042414": "/staff/Dorasala-Priyanka-Rani/11469042414", "20689072805": "/staff/Dova-Sulochana/20689072805", "60296": "/staff/Dukka-Preethi/60296", "71051": "/staff/Dulam-Jyothi/71051", "73123": "/staff/Dumpa-Neelima-Jyothi/73123", "73670": "/staff/Eethakota-Bhargavi-Sri/73670", "74124": "/staff/Elvis-Kakindai-Ruangmei/74124", "75444": "/staff/Etikala-Shankar/75444", "72537": "/staff/Fathima-Hamda/72537", "73687": "/staff/G-Rajendra-Prasad/73687", "69667": "/staff/G-karthik/69667", "8720": "/staff/Galinki-Suneetha/8720", "61877": "/staff/GANDHARI-PRADEEPKUMAR/61877", "73884": "/staff/Ganta-Keerthana/73884", "75081": "/staff/Golla-Chinna-Narsimhudu/75081", "57824": "/staff/Gondi-Varshitha/57824", "23569": "/staff/Gorre-Nandini/23569", "8478": "/staff/Gudise-Sharonrose/8478", "4045": "/staff/Guggilla-Manjunath-Reddy/4045", "16228": "/staff/Gujjari-Soumya/16228", "73338": "/staff/GUMMADI-PRADEEP-KUMAR/73338", "67929": "/staff/Gutala-Sushma/67929", "20709669079": "/staff/Harika-More/20709669079", "73677": "/staff/inapanuri-Keerthi/73677", "3062541237": "/staff/Ithagoni-Swapna/3062541237", "65801": "/staff/Jalla-Bhargavi/65801", "9746": "/staff/Jambarapu-Nikhitha/9746", "12851": "/staff/Jampula-Nandu/12851", "3470947366": "/staff/Jangamsetti-Ravi-Teja/3470947366", "52897": "/staff/Jarapati-Vijaya/52897", "60435": "/staff/Jarupula-Kishore-Rati/60435", "20710661132": "/staff/Jhansi-Rani/20710661132", "53630": "/staff/Juluru-Neelima/53630", "72835": "/staff/K-mounika/72835", "73284": "/staff/K-Rajitha/73284", "3062539927": "/staff/Kalakunta-Padma/3062539927", "3062541770": "/staff/Kamandla-Swaroopa-Rani/3062541770", "20710495448": "/staff/Kamidri-Anvesh/20710495448", "74941": "/staff/kamireddy-tejeswari/74941", "73527": "/staff/kandula-saikeerthi/73527", "41354": "/staff/Karipothu-Vincent/41354", "43379": "/staff/katla-Renuka/43379", "20710627047": "/staff/Kavitapu-Surya-Deepak/20710627047", "75700": "/staff/Kavya-Krishna-K/75700", "20708203003": "/staff/Kodiguddu-Swami-Kiran/20708203003", "3062541584": "/staff/Komarala-Sreenivasulu/3062541584", "12907": "/staff/kommuru-sowmya/12907", "20709518319": "/staff/Kondra-Rajkumar/20709518319", "36216": "/staff/Konidela-mehaboobchan/36216", "20709555634": "/staff/Koppoju-Gopi-Suresh/20709555634", "65434": "/staff/Koppula-Rameshwari/65434", "68853": "/staff/kore-yamini-jyothi/68853", "75543": "/staff/kothapalli-kalyani/75543", "57248": "/staff/kumbala-Bhanupriya/57248", "50840": "/staff/Lakshmi-Sai/50840", "67396": "/staff/lavanya-R/67396", "4131": "/staff/Lenka-Kurmi-Naidu/4131", "46026": "/staff/Lotavath-Kalyani-bai/46026", "64428": "/staff/M-S-V-NIKHIL/64428", "20708479097": "/staff/M-Naga-Lakshmi/20708479097", "75647": "/staff/M-Tejaswini/75647", "55940": "/staff/Madda-Ramya/55940", "69115": "/staff/Maddi-Gayatri-Devi/69115", "72377": "/staff/Maddirala-Bala-Lakshmi-Reddy/72377", "24339": "/staff/Madharapu-Tejasri/24339", "68822": "/staff/Maimuna-Fatima/68822", "36831": "/staff/Malapati-Amrutha-Varshini/36831", "3062541028": "/staff/Malleswari/3062541028", "13581053248": "/staff/Mallipudi-Vijay/13581053248", "42082": "/staff/Manikonda-kalyani/42082", "72869": "/staff/MANNEPALLY-VENKATESHWARLU/72869", "75724": "/staff/Mariya-Jos/75724", "74757": "/staff/Medarapalli-sandhyarani/74757", "8286": "/staff/Medi-jayasree/8286", "67124": "/staff/MEDICHELIMELA-NAVEEN-KUMAR/67124", "59778": "/staff/Moghal-Mousumi/59778", "75725": "/staff/Mohammad-shabana/75725", "45748": "/staff/Mohammad-Farzana/45748", "3062540062": "/staff/Mohammed-Abdul-mateen/3062540062", "3062539541": "/staff/Mohammed-Nishat/3062539541", "20710074928": "/staff/Mohammed-Zohaib/20710074928", "20708527474": "/staff/Mohammedh-Sufiyan/20708527474", "4807982554": "/staff/Mohd-Abdul-Minhaj/4807982554", "75390": "/staff/Mohd-Mukram/75390", "20688684970": "/staff/Mora-Sowjanya/20688684970", "20710089086": "/staff/Mounika-Talari/20710089086", "20709222937": "/staff/Mrudula-Deepthi-P/20709222937", "68524": "/staff/Muchukota-Hema/68524", "37802": "/staff/Muddada-Seetharam/37802", "20709556255": "/staff/Mulla-Rasool-Bee/20709556255", "75653": "/staff/muppidi-sneha/75653", "74224": "/staff/Mutyala-Preethi/74224", "73853": "/staff/Myakala-Narsimha-Murthy/73853", "73283": "/staff/N-BHANU-PRASAD/73283", "51991": "/staff/Nagalapuram-Mowlika/51991", "75171": "/staff/Nallagorla-Pavan-Kumar/75171", "14139": "/staff/Nathi-DevRaj/14139", "20708157937": "/staff/Neethu-Dharma-Dev-Singh/20708157937", "72568": "/staff/Nidigallu-James-Rahul/72568", "27915": "/staff/Niroshna-jogi/27915", "62011": "/staff/O-S-Sirisha/62011", "67797": "/staff/OZILI-MUGDHA-VARSHINI/67797", "66638": "/staff/P-Mounika/66638", "73485": "/staff/P-Sanjeev-Reddy/73485", "39523": "/staff/P-Naresh/39523", "74304": "/staff/Palli-Preetham-lincey/74304", "73693": "/staff/Pandi-Indu-Priya/73693", "20710819113": "/staff/Panthangi-Mamatha/20710819113", "3062540776": "/staff/Parakala-Anjaiah/3062540776", "20710374456": "/staff/Parigi-Bhargavi/20710374456", "20708198027": "/staff/Parimala-Nissi/20708198027", "10120045449": "/staff/Parveda-Chandra-Shekar/10120045449", "20710600468": "/staff/Pasula-Srikanth/20710600468", "60578": "/staff/PASUPULETI-SRIKANTH/60578", "17252": "/staff/Patnam-Pranathi/17252", "43678": "/staff/Pattan-Inthiyaz-Khan/43678", "16115": "/staff/Peddakota-Prasad/16115", "12922469928": "/staff/Penumarthi-Surendra/12922469928", "9103": "/staff/Perumalla-Prasanth-Kumar/9103", "20710694795": "/staff/Polamuri-Pallavi/20710694795", "66930": "/staff/Polepalli-Jaswanth-Charan/66930", "20710959033": "/staff/Ponukumati-Sujatha/20710959033", "70938": "/staff/Potluri-Mahalakshmi/70938", "70698": "/staff/prakriti-Sharma/70698", "75722": "/staff/Praveena-k/75722", "20708929115": "/staff/Priyadharshini-R/20708929115", "41101": "/staff/pujitha-sunkari/41101", "31513": "/staff/Pulipati-Gouthami/31513", "20709216602": "/staff/Putta-Blessina-Rani/20709216602", "20688993807": "/staff/Pyla-Venkata-RTamakrishna-Ayappaswami/20688993807", "3062540662": "/staff/Raju-Routhu/3062540662", "20708307981": "/staff/Ramineni-Rohith/20708307981", "26993": "/staff/Rao-Sita-Kamala-Ramadevi-Ruchitha/26993", "50084": "/staff/RAPAKA-KIRAN/50084", "64520": "/staff/Ravali-Muniganti/64520", "71913": "/staff/Ravi-Raj-Mahato/71913", "3220424453": "/staff/Renamala-Subhashini/3220424453", "40453": "/staff/S-Indraneela/40453", "20708962324": "/staff/Sai-Avinash/20708962324", "40797": "/staff/Sake-Nandini/40797", "3062540588": "/staff/Salapu-Mounika/3062540588", "25791": "/staff/Samasthapattla-Rajasekhar/25791", "66964": "/staff/SANAMPUDI-SIVA-REDDY/66964", "20709251309": "/staff/Sanniboina-Mahesh/20709251309", "72523": "/staff/Saripella-Sai-Trisha/72523", "20710717333": "/staff/Sathunuri-Madhuri/20710717333", "20688900373": "/staff/Shaheen-Begum/20688900373", "75040": "/staff/Shaik-Anjum-Parveen/75040", "5100420168": "/staff/Shaik-gouse-Sandani/5100420168", "72531": "/staff/Shaik-minazza-farzeen/72531", "72840": "/staff/Shaik-Mujiba-Begum/72840", "51583": "/staff/Singidi-Madhuri-Divya/51583", "20708592993": "/staff/Siva-Rama-Krishna/20708592993", "20708807999": "/staff/Sonia-honey/20708807999", "20708270363": "/staff/Sowjanya-Gude/20708270363", "4660": "/staff/SOWJANYA-VARA/4660", "20710265297": "/staff/SP-Siddu-Babu/20710265297", "41355": "/staff/sridhar-kagitha/41355", "20710658011": "/staff/Sudheer-Kumar-Velamala/20710658011", "20709738745": "/staff/Surasi-Bharath/20709738745", "59671": "/staff/Swetha-Narayan/59671", "74930": "/staff/syed-nadeem/74930", "48753": "/staff/SYEDA-SARA-SADIA/48753", "67561": "/staff/Tangi-Kumari/67561", "8936745247": "/staff/Thamanan-Prem/8936745247", "72540": "/staff/Trishna-Sudhakaran/72540", "44626": "/staff/Valluri-Rahul/44626", "71070": "/staff/Vasam-Rajendhar/71070", "40059": "/staff/Vasamsetti-Manga-Devi/40059", "75147": "/staff/Vasamsetti-Tarun-Sai-Swaroop/75147", "20709757055": "/staff/Veera-Kishore/20709757055", "75410": "/staff/Velamuri-Suraj-Prakash/75410", "73851": "/staff/Vempati-Manoj-Kumar/73851", "75646": "/staff/vemula-Ankala-Babu/75646", "20709072713": "/staff/Vemula-Apuroop/20709072713", "20709900693": "/staff/Venkata-Ratna-Kiran-Ayinapuri/20709900693", "20708486784": "/staff/Voggu-krishna-veni/20708486784", "38949": "/staff/yapala-shekhar/38949", "74756": "/staff/Yarlagadda-Sharon-hema-Ratnam/74756", "20688709080": "/staff/Yarlagadda-Srividya/20688709080", "51422": "/staff/Yellampalli-krishnasri/51422", "44685": "/staff/Yelle-Gangadharam/44685", "20711176378": "/staff/Yerragudi-Swapna/20711176378", "72833": "/staff/Yerraguntla-Gowthami/72833", "21527": "/staff/Yerram-Reddy-siva-parvathi/21527", "52900": "/staff/Yerramala-Sreekanth/52900", "24554": "/staff/Yesu-Ratnam-Devaguptapu/24554", "20688979750": "/staff/Zareena-Begum/20688979750" };

// deployment/sunshine-recovery-routes.mjs
var recoveryRoutes = {
  // Podimo's published episode contains the shortened auto-link alongside the
  // full Wilbarger destination in its YouTube redirect. Verified 6 October 2026.
  "/ma/wil": "/ma/wilbarger-brush-therapy-tool",
  "/abilities/independence-&-autonomy": "/sunshine/topic/independence-and-autonomy-1646",
  "/abilities/planning-&-organization": "/sunshine/topic/planning-and-organisation-1679",
  "/abilities/play-&-imagination": "/sunshine/topic/play-and-imagination-1685",
  "/abilities/restricted-interests-&-repetitive-behaviors": "/sunshine/topic/restricted-interests-and-repetitive-behaviours-1691",
  "/abs/pinnacle-i-m-fun-miller-function-&-participation-scales": "/sunshine/topic/miller-function-and-participation-scales-1451",
  "/abs/pinnacle-i-nepsy-ii-nepsy-ii:-a-developmental-neuropsychological-assessment": "/sunshine/topic/nepsy-ii-assessment-1453",
  "/ma/autism-therapy/kids-led-desk-lamp": "/sunshine/topic/kids-led-study-desk-lamp-3231",
  "/ma/blog/autism-therapy-materials/party-horn-noisemakers": "/sunshine/topic/party-horn-noisemakers-3255",
  "/ma/blog/foldable-hanging-organizer-autism-therapy": "/sunshine/topic/foldable-hanging-paper-organiser-3189",
  "/ma/blog/led-fishball-therapy-material": "/sunshine/topic/led-fish-ball-1172",
  "/ma/blog/reversible-gift-wrapping-paper-therapy-autism": "/sunshine/topic/gift-wrapping-paper-sheets-3261",
  "/ma/therapeutic-tools/car-seat-cushion-safety-belt": "/sunshine/topic/car-seat-cushions-and-child-travel-safety-3394",
  "/ma/therapies/dyslexia-reading-overlay-strips": "/sunshine/topic/reading-overlay-strips-2942",
  "/ma/therapies/kids-drum-set-musical-toy-autism-therapy": "/sunshine/topic/kids-drum-set-musical-toy-3176",
  "/ma/therapies/mag-pad-autism-therapy": "/sunshine/topic/magnetic-pen-drawing-board-1185",
  "/ma/therapies/swimming-ear-plugs-autism": "/sunshine/topic/swimming-ear-plugs-and-nose-clips-3252",
  "/ma/therapy-material/cross-trainer": "/sunshine/topic/cross-trainer-equipment-1100",
  "/ma/therapy-material/toddler-flip-flops-rainbow-design": "/sunshine/topic/toddler-flip-flops-3080",
  "/ma/therapy-materials/adi-trading-led-lattoo": "/sunshine/topic/led-spinning-top-1023",
  "/ma/therapy-materials/baby-silicone-teething-tubes": "/sunshine/topic/silicone-teething-tubes-3118",
  "/ma/therapy-materials/big-smile": "/sunshine/topic/big-smile-play-material-1047",
  "/ma/therapy-materials/chalk-gripper-therapy": "/sunshine/topic/chalk-gripper-1067",
  "/ma/therapy-materials/cotton-buds": "/sunshine/topic/cotton-buds-as-craft-materials-1093",
  "/ma/therapy-materials/drop-fantasy-puzzle-game": "/sunshine/topic/drop-fantasy-puzzle-game-1111",
  "/ma/therapy-materials/kids-striped-swimsuit": "/sunshine/topic/kids-striped-swimsuit-3009",
  "/ma/therapy-materials/modular-plastic-storage-containers": "/sunshine/topic/modular-storage-containers-3222",
  "/ma/therapy-materials/oral-therapy-mouth-opener-jaw-stretcher": "/sunshine/topic/mouth-openers-and-jaw-stretchers-3131",
  "/ma/therapy-materials/popping-toys": "/sunshine/topic/popping-toy-1242",
  "/ma/therapy-materials/shaped-animal-board-book-dog-autism-therapy": "/sunshine/topic/dog-shaped-animal-board-book-3233",
  "/ma/therapy-materials/straw-set-feeding": "/sunshine/topic/straws-and-feeding-3348",
  "/ma/therapy-materials/wooden-baby-rattle": "/sunshine/topic/wooden-baby-rattle-3036",
  "/ma/therapy-tools/reusable-ice-bag": "/sunshine/topic/reusable-ice-bag-3289",
  "/ma/therapy/building-blocks-used-in-speech-ABA-occupational-special-education-therapy": "/sunshine/topic/building-blocks-1058",
  "/ma/therapy/expanding-multi-pocket-organizer": "/sunshine/topic/expanding-multi-pocket-organiser-3241",
  "/ma/therapy/math-linking-cubes": "/sunshine/topic/math-linking-cubes-3274",
  "/skills/balance-&-hopping": "/sunshine/topic/balance-and-hopping-1838",
  "/skills/cognitive/communication-(pre-literacy)": "/sunshine/topic/communication-and-pre-literacy-1668",
  "/skills/communication-(receptive/expressive)": "/sunshine/topic/receptive-and-expressive-communication-1663",
  "/skills/sorting-&-categorization": "/sunshine/topic/sorting-and-categorisation-1784"
};
var invalidSunshineLinks = /* @__PURE__ */ new Set(["/abilities/https://www.pinnacleblooms.org", "/skills/https://www.pinnacleblooms.org"]);
function recoveryPath(path) {
  try {
    return recoveryRoutes[decodeURIComponent(path).replace(/\/$/, "")] || null;
  } catch {
    return null;
  }
}

// deployment/centre-canonical-paths.mjs
var CENTRE_CANONICAL_PATHS = /* @__PURE__ */ new Set([
  "/centers/best-autism-speech-aba-occupational-therapy-center-anathapuram-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-anna-nagar-chennai-tamilnadu-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-asraonagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-attapur-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-begumpet-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-bhimavaram-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-bn-reddy-nagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-california-usa",
  "/centers/best-autism-speech-aba-occupational-therapy-center-chanda-nagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-dilsukhnagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-eluru-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-gachibowli-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-gajuwaka-vizag-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-gurunanak-road-vijayawada-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-habsiguda-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-hayathnagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-himayatnagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-hydernagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-indiranagar-bengaluru-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-jagadamba-vizag-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-jayanagar-bengaluru-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-jntu-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-jubilee-hills-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-kachiguda-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-kadapa-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-kakinada-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-karimnagar-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-khajaguda-mehdipatnam-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-khammam-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-kondapur-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-kukatpally-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-kurnool-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-labbipet-vijayawada-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-lakshmipuram-guntur-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-lbnagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-madhapur-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-madhurawada-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-mahbubnagar-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-marathalli-bengaluru-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-miryalaguda-ts-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-mvp-vizag-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-nad-vizag-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-nallagandla-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-nandyala-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-nellore-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-nizamabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-ongole-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-paradise-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-pragathi-nagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-rajahmundry-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-santosh-nagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-south-extension-newdelhi-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-srikakulam-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-srnagar-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-suchitra-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-suchitra2-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-tirupati-ap-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-uppal-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-vanasthalipuram-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-vidyanagar-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-vikrampuri-hyderabad-telangana-india",
  "/centers/best-autism-speech-aba-occupational-therapy-center-warangal-ts-india"
]);

// deployment/public-link-target.mjs
var PUBLIC_PAGE_ALIASES = {
  "/contact": "/contact-national-autism-helpline-24-7",
  "/services": "/top-autism-therapy-services-india-proven-improvement-rate",
  "/news": "/autism-speech-aba-news",
  "/occupational-therapy": "/best-occupational-therapy-center-india-proven-improvement-rate",
  "/aba-therapy": "/best-aba-therapy-center-india-proven-improvement-rate",
  "/special-education": "/best-special-education-center-call-9100181181",
  "/centres": "/centers",
  "/locations": "/centers",
  "/pinnacle-ai": "/pinnacleai",
  "/ability-score": "/abilityscore",
  "/t/occupational-therapy": "/best-occupational-therapy-center-india-proven-improvement-rate",
  "/t/aba-therapy": "/best-aba-therapy-center-india-proven-improvement-rate",
  "/speech-therapy": "/top-speech-therapy-center-india-proven-improvement-rate",
  "/enroll": "/enroll-autism-speech-aba-therapies-india"
};
function publicLinkTarget(href) {
  if (typeof href !== "string" || !/^(?:https?:\/\/(?:www\.)?pinnacleblooms\.org(?:[/?#]|$)|\/(?!\/))/.test(href)) return href;
  const decodedHref = href.replace(/&(?:amp|#0*38|#x0*26);/gi, "&");
  let url;
  try {
    url = new URL(decodedHref, "https://www.pinnacleblooms.org");
  } catch {
    return href;
  }
  if (!["pinnacleblooms.org", "www.pinnacleblooms.org"].includes(url.hostname) || url.port || url.username || url.password) return href;
  let decoded;
  try {
    decoded = decodeURIComponent(url.pathname).replace(/\/$/, "");
  } catch {
    return href;
  }
  if (invalidSunshineLinks.has(decoded)) return null;
  const recovered = recoveryPath(url.pathname);
  if (recovered) return "https://www.pinnacleblooms.org" + recovered + url.search + url.hash;
  if (/^\/(?:api|cdn-cgi|Images|Assets|downloads|verify\/documents)(?:\/|$)/i.test(url.pathname) || /^\/ask\/(?:auth|account)(?:\/|$)/i.test(url.pathname) || /\.[a-z0-9]{2,8}$/i.test(url.pathname)) return href;
  let changed = false;
  const centrePath = url.pathname.replace(/\/$/, "").toLowerCase();
  if (CENTRE_CANONICAL_PATHS.has(centrePath) && url.pathname !== centrePath) {
    url.protocol = "https:";
    url.hostname = "www.pinnacleblooms.org";
    url.pathname = centrePath;
    changed = true;
  }
  if (Object.hasOwn(PUBLIC_PAGE_ALIASES, url.pathname.replace(/\/$/, ""))) {
    url.protocol = "https:";
    url.hostname = "www.pinnacleblooms.org";
    url.pathname = PUBLIC_PAGE_ALIASES[url.pathname.replace(/\/$/, "")];
    changed = true;
  }
  if (url.hostname === "www.pinnacleblooms.org" && url.protocol === "http:") {
    url.protocol = "https:";
    changed = true;
  }
  if (/^\/(?:ask|Ask)\/?$/.test(url.pathname)) {
    url.protocol = "https:";
    url.hostname = "pinnacleblooms.org";
    url.pathname = "/ask";
    changed = true;
  }
  if (url.hostname === "www.pinnacleblooms.org") {
    const staff = /^\/staff\/[^/]+\/([1-9]\d*)\/?$/.exec(url.pathname), target = staff && currentStaffPaths[staff[1]];
    if (target && url.pathname !== target) {
      url.pathname = target;
      changed = true;
    }
    if (/^\/physio-therapy\/?$/.test(url.pathname)) {
      url.pathname = "/physiotherapy";
      changed = true;
    }
  }
  if (!changed) return href;
  return href.startsWith("/") && url.hostname === "www.pinnacleblooms.org" ? url.pathname + url.search + url.hash : url.href;
}

// deployment/legacy-social-metadata/organization.mjs
var organization = { "@context": "https://schema.org", "@type": "Organization", "@id": "https://www.pinnacleblooms.org/#organization", "name": "Bharath Healthcare Laboratories Private Limited", "legalName": "Bharath Healthcare Laboratories Private Limited", "url": "https://www.pinnacleblooms.org/", "logo": "https://www.pinnacleblooms.org/verify/images/pinnacle-logo.webp", "brand": { "@type": "Brand", "@id": "https://www.pinnacleblooms.org/verify/#pinnacle-brand", "name": "Pinnacle Blooms Network", "url": "https://www.pinnacleblooms.org/" }, "description": "Pinnacle Blooms Network is a child-development therapy network operated by Bharath Healthcare Laboratories Private Limited. Services include autism support, speech therapy, ABA/behaviour therapy, occupational therapy and special education. Confirm services, practitioner availability and fees with the preferred centre.", "telephone": "+919100181181", "email": "care@pinnacleblooms.org", "contactPoint": { "@type": "ContactPoint", "name": "Pinnacle-operated National Autism Helpline", "contactType": "parent guidance and appointment enquiries", "telephone": "+919100181181", "url": "https://www.pinnacleblooms.org/national-autism-helpline", "availableLanguage": ["en", "te", "hi"] }, "identifier": [{ "@type": "PropertyValue", "propertyID": "CIN", "value": "U74999TG2016PTC113063" }, { "@type": "PropertyValue", "propertyID": "LEI", "value": "894500OJYBVC18BUDN89" }], "sameAs": ["https://www.pinnacleblooms.org/verify/#organization"], "subjectOf": { "@type": "WebPage", "name": "Dated institutional claim and source ledger", "url": "https://www.pinnacleblooms.org/verify/evidence/claim-ledger.html" }, "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.pinnacleblooms.org/" } };
async function repairLegacyIdentity(text) {
  const normalized = text.trim().replaceAll("\r\n", "\n");
  if (!normalized.startsWith("{") || !normalized.includes('"@type": "Organization"')) return text;
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))), (b) => b.toString(16).padStart(2, "0")).join("");
  return ["204ebe91d049448a5f8ef50862790ef97f8a43c99d2756ed07fe4631c5f01bc0", "58b3106343e0bff97e5cd6e3236f948cad70a009fdc8145a723004bf50606afa"].includes(digest) ? JSON.stringify(organization).replace(/</g, "\\u003c") : text;
}

// deployment/legacy-social-metadata/schema.mjs
var SCHEMA_LIMIT = 256 * 1024;
var sidebarBreadcrumbNames = /* @__PURE__ */ new Set(["Paediatric Therapy Techniques", "Paediatric Sensorial / Neurological/ Developmental Conditions", "Paediatric Behaviors / Tantrums", "Paediatric Developmental Milestones", "Paediatric Therapy Materials", "Paediatric Assessments", "Pinnacle AbilityScore Assessments", "Pinnacle AbilityScore Abilities", "Pinnacle AbilityScore Skills"]);
function repairSidebarBreadcrumb(text, requestUrl) {
  try {
    const u = new URL(requestUrl);
    if (u.origin !== "https://www.pinnacleblooms.org" || !/^\/(?:t|c|b|m|ma|a|abs|abilities|skills)\/[^/]+\/?$/.test(u.pathname)) return text;
    const data = JSON.parse(text), items = data.itemListElement;
    if (!["http://schema.org", "https://schema.org"].includes(data["@context"]) || data["@type"] !== "BreadcrumbList" || !Array.isArray(items)) return text;
    if (items.length === 2 && items[0]?.position === 1 && items[0]?.item?.name === "Home" && items[0].item["@id"] === "https://www.pinnacleblooms.org/" && items[1]?.position === 2 && sidebarBreadcrumbNames.has(items[1]?.item?.name) && items[1].item["@id"] === "http://www.pinnacleblooms.org" + u.pathname) return null;
    return text;
  } catch {
    return text;
  }
}
function repairSchemaText(text) {
  const original = text;
  if (text.length > SCHEMA_LIMIT) return text;
  try {
    let read = function() {
      const token = tokens[index++], raw = token[0];
      if (raw === "{" || raw === "[") {
        const node = { kind: raw === "{" ? "object" : "array", properties: /* @__PURE__ */ new Map(), children: [] };
        const close = raw === "{" ? "}" : "]";
        while (tokens[index][0] !== close) {
          if (raw === "{") {
            const key = tokens[index++], name = JSON.parse(key[0]);
            index++;
            const value = read();
            if (node.properties.has(name)) safe = false;
            node.properties.set(name, { key, value });
            node.children.push(value);
          } else node.children.push(read());
          if (tokens[index][0] === ",") index++;
        }
        index++;
        return node;
      }
      return { kind: raw.startsWith('"') ? "string" : "primitive", value: raw.startsWith('"') ? JSON.parse(raw) : raw, token };
    }, visit = function(node) {
      if (node.kind === "object") {
        const props = node.properties, context = props.get("@context");
        if (context && !schemaContext(context.value)) safe = false;
        const type = props.get("@type")?.value;
        if (type?.value === "Organization" && props.get("name")?.value.value === "Pinnace Blooms Network")
          patches.push({ token: props.get("name").value.token, value: '"Pinnacle Blooms Network"' });
        if (["Webpage", "WebPage"].includes(type?.value)) for (const key of ["thumbnailUrl", "dateCreated"]) {
          const empty = props.get(key);
          if (empty?.value.kind === "string" && empty.value.value === "") {
            let start = empty.key.index, end = empty.value.token.index + empty.value.token[0].length;
            const after = text.slice(end).match(/^\s*,/), before = text.slice(0, start).match(/,\s*$/);
            if (after) end += after[0].length;
            else if (before) start -= before[0].length;
            patches.push({ start, end, value: "" });
          }
        }
        const url = props.get("url")?.value;
        if (type?.value === "Person" && url?.kind === "string") {
          const staff = url.value.match(/^https?:\/\/www\.pinnacleblooms\.org\/staff\/[^/?#]+\/\/([1-9]\d*)$/);
          if (staff && currentStaffPaths[staff[1]]) patches.push({ token: url.token, value: JSON.stringify("https://www.pinnacleblooms.org" + currentStaffPaths[staff[1]]) });
        }
        const image = props.get("image");
        if (image?.value.kind === "string" && isMissingMedia(image.value.value)) {
          let start = image.key.index, end = image.value.token.index + image.value.token[0].length;
          const after = text.slice(end).match(/^\s*,/), before = text.slice(0, start).match(/,\s*$/);
          if (after) end += after[0].length;
          else if (before) start -= before[0].length;
          patches.push({ start, end, value: "" });
        }
        if (type?.kind === "string" && type.value === "Webpage") patches.push({ token: type.token, value: '"WebPage"' });
        const old = props.get("xPath");
        if (type?.value === "SpeakableSpecification" && old?.value.kind === "array" && old.value.children.every((child) => child.kind === "string") && !props.has("xpath")) patches.push({ token: old.key, value: '"xpath"' });
        const namedEntity = (key, name, entityType) => {
          const value = props.get(key)?.value;
          if (value?.kind === "string" && value.value === name) patches.push({ token: value.token, value: JSON.stringify({ "@type": entityType, name }) });
        };
        if (type?.value === "Book") {
          namedEntity("author", "Dr. Sreeja Reddy Saripalli", "Person");
          namedEntity("publisher", "notionpress", "Organization");
        }
        if (["Webpage", "WebPage"].includes(type?.value)) namedEntity("publisher", "Pinnacle", "Organization");
      }
      for (const child of node.children || []) visit(child);
    };
    JSON.parse(text);
    const tokens = [...text.matchAll(/"(?:\\[\s\S]|[^"\\])*"|[{}\[\]:,]|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null/g)];
    let index = 0, safe = true;
    const schemaContext = (node) => node?.kind === "string" && /^https?:\/\/schema\.org\/?$/.test(node.value);
    const tree = read(), roots = tree.kind === "array" ? tree.children : [tree];
    if (!roots.every((root) => root.kind === "object" && schemaContext(root.properties.get("@context")?.value))) return text;
    const patches = [];
    visit(tree);
    if (!safe) return text;
    for (const patch of patches.sort((a, b) => (b.start ?? b.token.index) - (a.start ?? a.token.index))) {
      const start = patch.start ?? patch.token.index, end = patch.end ?? start + patch.token[0].length;
      text = text.slice(0, start) + patch.value + text.slice(end);
    }
    JSON.parse(text);
    return text;
  } catch {
    return original;
  }
}
var LegacySchemaScript = class {
  constructor(requestUrl) {
    this.requestUrl = requestUrl;
  }
  element(element) {
    this.pass = (element.getAttribute("type") || "").trim().toLowerCase() !== "application/ld+json";
    this.buffer = "";
    if (!this.pass) {
      const escape3 = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
      this.open = "<script" + [...element.attributes].map(([key, value]) => " " + key + '="' + escape3(value) + '"').join("") + ">";
      this.streaming = false;
      element.removeAndKeepContent();
    }
  }
  async text(chunk) {
    if (this.pass) return;
    if (this.streaming) {
      if (chunk.lastInTextNode) chunk.after("<\/script>", { html: true });
      return;
    }
    this.buffer += chunk.text;
    if (this.buffer.length > SCHEMA_LIMIT) {
      chunk.replace(this.open + this.buffer + (chunk.lastInTextNode ? "<\/script>" : ""), { html: true });
      this.buffer = "";
      this.streaming = true;
    } else if (!chunk.lastInTextNode) chunk.remove();
    else {
      const cleaned = await repairLegacyGraph(this.buffer, this.requestUrl);
      chunk.replace(cleaned === null ? "" : this.open + cleaned + "<\/script>", { html: true });
      this.buffer = "";
    }
  }
};
async function repairPhysiotherapyCollection(text, normalized) {
  const canonical = "https://www.pinnacleblooms.org/physiotherapy", identities = [];
  const template = normalized.replace(/^([ \t]*"(?:id|url)"[ \t]*:[ \t]*)("(?:\\[\s\S]|[^"\\])*")/gm, (_, prefix, token) => {
    identities.push(JSON.parse(token).replace(/&(?:amp;)+/gi, "&"));
    return prefix + JSON.stringify("http://www.pinnacleblooms.org/physiotherapy");
  });
  if (identities.length !== 2 || identities[0] !== identities[1]) return text;
  try {
    const url = new URL(identities[0]);
    if (!["http:", "https:"].includes(url.protocol) || url.hostname !== "www.pinnacleblooms.org" || url.pathname !== "/physiotherapy" || url.port || url.username || url.password || url.hash) return text;
  } catch {
    return text;
  }
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(template))), (b) => b.toString(16).padStart(2, "0")).join("");
  if (digest !== "bf6caa0a32cf9863d60110e924e8f72d3b59c78793311de1a69419790cda9f86") return text;
  const data = JSON.parse(normalized.replace("//begin bracket for multiple entries under image", "").replace("//end bracket for ImageGallery > image(s)", "").replace("//end bracket for mainEntityOfPage", ""));
  data["@context"] = "https://schema.org";
  data["@id"] = canonical;
  data.url = canonical;
  delete data.id;
  return JSON.stringify(data);
}
async function repairPhysiotherapyWebPage(text, requestUrl) {
  const canonical = "https://www.pinnacleblooms.org/physiotherapy";
  const tracking = /* @__PURE__ */ new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "utm_source_platform", "utm_creative_format", "utm_marketing_tactic", "gclid", "dclid", "msclkid", "fbclid", "gbraid", "wbraid"]);
  let request;
  try {
    request = new URL(requestUrl);
  } catch {
    return text;
  }
  if (request.origin !== "https://www.pinnacleblooms.org" || request.pathname.replace(/\/$/, "") !== "/physiotherapy") return text;
  if (![...request.searchParams.keys()].every((key) => tracking.has(key))) return text;
  try {
    JSON.parse(text);
  } catch {
    return text;
  }
  const identities = [];
  const template = text.trim().replaceAll("\r\n", "\n").replace(/("(?:url|@id|id)"\s*:\s*)("(?:\\[\s\S]|[^"\\])*")/g, (_, prefix, token) => {
    identities.push(JSON.parse(token).replace(/&(?:amp;)+/gi, "&"));
    return prefix + JSON.stringify(canonical.replace("https:", "http:"));
  });
  for (const value of identities) {
    let url;
    try {
      url = new URL(value);
    } catch {
      return text;
    }
    if (!["http:", "https:"].includes(url.protocol) || url.hostname !== "www.pinnacleblooms.org" || url.pathname !== "/physiotherapy" || url.port || url.username || url.password || url.hash || url.search && url.search !== request.search) return text;
  }
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(template))), (b) => b.toString(16).padStart(2, "0")).join("");
  const counts = { "a4c150bfb94f1dd5d52a9dfdf8ce60a04bddca94d456f6dc2c7494c20828de45": 1, "f0e1af01086fa25851391c2cbaa1f86441c6f6494d5c0ccb91853cd06468b05b": 2 };
  if (counts[digest] !== identities.length) return text;
  return text.replace(/("(?:url|@id|id)"\s*:\s*)("(?:\\[\s\S]|[^"\\])*")/g, (_, prefix) => prefix + JSON.stringify(canonical));
}
async function repairLegacyGraph(text, requestUrl) {
  if (text.length > SCHEMA_LIMIT) return text;
  text = repairSidebarBreadcrumb(text, requestUrl);
  if (text === null) return null;
  const normalized = text.trim().replaceAll("\r\n", "\n");
  if (requestUrl && new URL(requestUrl).pathname === "/therapeuticai-effectiveness-study" && normalized.includes('"@type": "MedicalStudy"')) {
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))), (b) => b.toString(16).padStart(2, "0")).join("");
    if (digest === "5de8875439e3d8882ca65217746eb6a79851944fd349c7bc0750dd8e09be6821") {
      const repaired = text.replace(/}\s*},\s*"softwareRequirements"/, '},\n    "softwareRequirements"');
      try {
        if (JSON.parse(repaired)["@type"] === "MedicalStudy") text = repaired;
      } catch {
        return text;
      }
    }
  }
  if (requestUrl && new URL(requestUrl).pathname === "/ma/therapy-materials-medicine-ball" && normalized.includes('"@type": "Article"')) {
    const template = normalized.replace(/("date(?:Published|Modified)"\s*:\s*)"[^"\n]*"/g, '$1"[DATE]"');
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(template))), (b) => b.toString(16).padStart(2, "0")).join("");
    if (digest === "dc7bd884c3f231916136ab4871fcca902b46f59c63fd9884ff363250387810bc") {
      const repaired = text.replace(/,\s*"comment"\s*:\s*(?=})/, "");
      try {
        if (JSON.parse(repaired)["@type"] === "Article") text = repaired;
      } catch {
        return text;
      }
    }
  }
  if (requestUrl && /^\/guru\/6385\//i.test(new URL(requestUrl).pathname) && normalized.includes('"@type": "NewsArticle"')) {
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))), (b) => b.toString(16).padStart(2, "0")).join("");
    if (["da6310191ba09480105f13f63e404b78b06a36ce60088249d6afcf9aa86caa0b", "9bcea635b7843134b56010f35bf9932433da81b6ff4a0255e6d9fd887ca9c91d"].includes(digest)) {
      const repaired = text.replace(/(?<!\\)\\%/g, "\\\\%");
      try {
        if (JSON.parse(repaired)["@type"] === "NewsArticle") text = repaired;
      } catch {
        return text;
      }
    }
  }
  if (/"@type"\s*:\s*"JobPosting"/.test(normalized)) {
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))), (b) => b.toString(16).padStart(2, "0")).join("");
    if ([
      "eee6f24856abce7f793489c5335315d223fb8d25b33260dd420a25a91f6b9ebe",
      // Fresh mobile-origin variants: all five expired on 31 December 2022.
      "b209d4edeaa00f092541d2efd99b8ffd5d4afcc51ea067f083ec8aebdc86d421",
      "4d7ba2834d55686b43f3b58f1518a4ad63ff5f2859a5203efe1af55650a87874",
      "c5d87b96f00aa3e546e7b3c8432453e57c9c10b9b760bd94ad7fd8ab044eeb5f",
      "e6912de295d75760e81961c9ff109f6d5eca18c9f7cc639b5e63cc88f30385e8",
      "c781d0860ec52308c3d7f563e674cfc0f25110c37828103fb52171369b164476"
    ].includes(digest)) return null;
  }
  if (normalized.includes('"@type": "SpecialAnnouncement"') || normalized.includes('"@type": "CollectionPage"')) {
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))), (b) => b.toString(16).padStart(2, "0")).join("");
    if (["3b882bc81f30917b7b7971a18ef1717777912bb505f3cfb87aed8dbe2fbbd037", "7181eeec2f921b7ece2f8451f343d6e61d16e806478213dc3ec3b8c675653b02"].includes(digest)) return null;
    if (normalized.includes('"@type": "CollectionPage"')) text = await repairPhysiotherapyCollection(text, normalized);
  }
  return repairPhysiotherapyWebPage(repairSchemaText(await repairLegacyIdentity(repairObservedCollection(text, requestUrl))), requestUrl);
}
function repairObservedCollection(text, requestUrl) {
  if (text.length > SCHEMA_LIMIT || !requestUrl) return text;
  const comments = ["//begin bracket for multiple entries under image", "//end bracket for ImageGallery > image(s)", "//end bracket for mainEntityOfPage"];
  if (!comments.every((c) => text.includes(c))) return text;
  try {
    const u = new URL(requestUrl), clean = comments.reduce((s, c) => s.replace(c, ""), text), data = JSON.parse(clean);
    const tracking = /* @__PURE__ */ new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "utm_source_platform", "utm_creative_format", "utm_marketing_tactic", "gclid", "dclid", "msclkid", "fbclid", "gbraid", "wbraid"]);
    const identity = data.url?.replace(/&(?:amp|#0*38|#x0*26);/gi, "&");
    if (u.origin !== "https://www.pinnacleblooms.org" || data["@context"] !== "http://schema.org" || data["@type"] !== "CollectionPage" || u.hash || u.username || u.password || [...u.searchParams.keys()].some((k) => !tracking.has(k)) || data.id !== data.url || new URL(identity).href !== u.href.replace(/^https:/, "http:") || Object.keys(data).sort().join(",") !== "@context,@type,description,id,mainEntityOfPage,url" || data.mainEntityOfPage?.["@type"] !== "ImageGallery" || !Array.isArray(data.mainEntityOfPage.image) || !data.mainEntityOfPage.image.every((i) => i["@type"] === "ImageObject" && typeof i.url === "string")) return text;
    let result = clean.replace(/("@context"\s*:\s*)"http:\/\/schema.org"/, '$1"https://schema.org"');
    result = result.replace(/([{,]\s*)"id"(?=\s*:)/, '$1"@id"');
    result = result.replace(/("(?:@id|url)"\s*:\s*)("(?:\\[\s\S]|[^"\\])*")/g, (all, prefix, raw) => JSON.parse(raw) === data.url ? prefix + JSON.stringify(u.origin + u.pathname) : all);
    return result;
  } catch {
    return text;
  }
}
function repairKnownLegacySchema(response, requestUrl) {
  const headers = new Headers(response.headers);
  for (const name of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(name);
  headers.set("x-pinnacle-legacy-schema", "schema-entity-types-20261006");
  return new HTMLRewriter().on("script:not([src])", new LegacySchemaScript(requestUrl)).transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}

// deployment/legacy-social-metadata/reading-directory.mjs
var escape = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function fontFaceKey(css) {
  const blocks = css.match(/@font-face\s*\{[^{}]*\}/gi);
  if (!blocks?.length || css.replace(/@font-face\s*\{[^{}]*\}/gi, "").trim()) return null;
  return blocks.map((x) => x.replace(/\s+/g, " ").trim()).sort().join("\n");
}
var RepeatedFontFaces = class {
  constructor() {
    this.seen = /* @__PURE__ */ new Set();
  }
  element(e) {
    this.buffer = "";
    this.streaming = false;
    this.open = "<style" + [...e.attributes].map(([k, v]) => " " + k + '="' + escape(v) + '"').join("") + ">";
    e.removeAndKeepContent();
  }
  text(c) {
    if (this.streaming) {
      if (c.lastInTextNode) c.after("</style>", { html: true });
      return;
    }
    this.buffer += c.text;
    if (this.buffer.length > 32768) {
      c.replace(this.open + this.buffer + (c.lastInTextNode ? "</style>" : ""), { html: true });
      this.streaming = !c.lastInTextNode;
      this.buffer = "";
      return;
    }
    if (!c.lastInTextNode) {
      c.remove();
      return;
    }
    const key = fontFaceKey(this.buffer);
    if (key && this.seen.has(key)) c.remove();
    else {
      if (key) this.seen.add(key);
      c.replace(this.open + this.buffer + "</style>", { html: true });
    }
    this.buffer = "";
  }
};
var directoryStyles = `.sunshine-all-sections{display:block!important;width:100%;border-top:2px solid #169d91;padding:24px 0}.pinnacle-directory-heading{font-size:24px!important;color:#142348!important;margin:0 0 8px}.pinnacle-directory-intro{font-size:16px;color:#34465a;margin:0 0 18px}.pinnacle-topic-directory{display:block!important;width:100%;border:1px solid #dce8ed;border-radius:12px;margin:10px 0;background:#fff;overflow:hidden}.pinnacle-topic-directory>summary{display:list-item!important;cursor:pointer;font-size:18px!important;font-weight:700!important;line-height:1.5!important;color:#142348!important;padding:16px 18px;margin:0!important;list-style-position:inside}.pinnacle-topic-directory>summary:focus-visible{outline:3px solid #9e258f;outline-offset:-4px}.pinnacle-topic-directory[open]>summary{background:#eff9f7}.pinnacle-topic-directory .content-sunshine{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:8px;padding:18px!important;margin:0!important;width:auto!important;float:none!important}.pinnacle-topic-directory .content-sunshine a{display:block!important;color:#633078!important;font-size:16px!important;line-height:1.5!important;padding:8px;border-radius:6px;overflow-wrap:anywhere}.pinnacle-topic-directory .content-sunshine a:hover{background:#f6f0fa}.pinnacle-topic-directory .content-sunshine :is(h3,h4){grid-column:1/-1;margin:8px 0;font-size:18px}.pinnacle-topic-directory .content-sunshine a:focus-visible{outline:2px solid #9e258f}`;
function addReadingDirectory(rewrite) {
  rewrite.on("style:not([src])", new RepeatedFontFaces());
  rewrite.on(".sunshine-all-sections", { element(e) {
    e.setAttribute("data-pinnacle-topic-directory", "20261008");
    e.prepend("<style data-pinnacle-topic-directory>" + directoryStyles + '.simple-marquee-container{position:relative!important;bottom:auto!important;left:auto!important;right:auto!important;margin-top:32px}.pinnacle-topic-directory>summary{scroll-margin-block:100px}</style><h2 class="pinnacle-directory-heading">Explore the Pinnacle knowledge library</h2><p class="pinnacle-directory-intro">Choose a topic to see its guides. Each guide remains available at its existing address.</p>', { html: true });
  } });
  rewrite.on(".sunshine-all-sections > .sunshine-block", { element(e) {
    e.tagName = "details";
    e.setAttribute("class", "pinnacle-topic-directory");
    e.removeAttribute("style");
  } });
  rewrite.on(".sunshine-all-sections .cm-section-main, .sunshine-all-sections .expandable-section", { element(e) {
    e.removeAndKeepContent();
  } });
  rewrite.on(".sunshine-all-sections h2.pinnacle-title", { element(e) {
    e.tagName = "summary";
    e.removeAttribute("class");
    e.removeAttribute("style");
    e.removeAttribute("onclick");
    e.removeAttribute("role");
    e.removeAttribute("tabindex");
  } });
  rewrite.on(".sunshine-all-sections .content-sunshine div", { element(e) {
    e.removeAndKeepContent();
  } });
  return rewrite;
}

// deployment/reading-paint.mjs
var READING_COMPONENTS = 'document.addEventListener("DOMContentLoaded",function(){var original=window.GetHomeArticles;if(typeof original!=="function")return;window.GetHomeArticles=function(id){if(!document.getElementById(id))return;return original.apply(this,arguments);};},{once:true});';
function repairReadingPaint(request, response) {
  const u = new URL(request.url);
  if (request.method !== "GET" || u.origin !== "https://www.pinnacleblooms.org" || !/^\/(?:t|c|ma|b|m|a|abs|abilities|skills)\/[a-z0-9][a-z0-9-]*\/?$/.test(u.pathname) || response.status !== 200 || !response.headers.get("content-type")?.includes("text/html")) return response;
  const resize = (p, w) => "/cdn-cgi/image/width=" + w + ",quality=75,format=auto" + p;
  let hero = false, googleLoader = false;
  const mobile = /Android|iPhone|iPad|Mobile/i.test(request.headers.get("user-agent") || "");
  const rewrite = new HTMLRewriter().on("script[src]", { element(e) {
    let src;
    try {
      src = new URL(e.getAttribute("src"), u.origin);
    } catch {
      return;
    }
    if (src.origin === u.origin && src.pathname === "/bundles/newmirracleportal" && src.search === "?v=42") e.setAttribute("defer", "");
  } }).on(".mirracle-loading", { element(e) {
    const classes = (e.getAttribute("class") || "").split(/\s+/).filter(Boolean);
    if (!classes.includes("active")) e.setAttribute("class", classes.concat("active").join(" "));
  } }).on('link[rel="preload"][as="image"]', { element(e) {
    let image;
    try {
      image = new URL(e.getAttribute("href"), u.origin);
    } catch {
      return;
    }
    if (image.origin === u.origin && ["/media/image/Pinnacle-blooms-Logo.jpg", "/Images/pinnacle-logo9.jpg"].includes(image.pathname)) e.setAttribute("href", resize(image.pathname, 320));
  } }).on("script[src]", { element(e) {
    let src;
    try {
      src = new URL(e.getAttribute("src"), u.origin);
    } catch {
      return;
    }
    if (src.origin !== "https://www.googletagmanager.com" || src.pathname !== "/gtag/js" || [...src.searchParams.keys()].some((k) => k !== "id")) return;
    const id = src.searchParams.get("id");
    if (id === "AW-10810823199") googleLoader = true;
    else if (id === "G-2BYLRLFRDJ" && googleLoader) e.remove();
  } }).on("head", { element(e) {
    e.prepend('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>', { html: true });
    e.onEndTag((t) => t.before("<script data-pinnacle-reading-components>" + READING_COMPONENTS + "<\/script><style data-pinnacle-reading-heading-font>.pinnacle-topic-directory{content-visibility:auto;contain-intrinsic-size:auto 160px}.pinnacle-topic-directory:not([open]) .content-sunshine{display:none!important}h1:not([lang]),h2:not([lang]),h3:not([lang]){font-family:Georgia,serif!important}@media(max-width:600px){body{background-image:url(/cdn-cgi/image/width=480,quality=65,format=auto/images/background.jpg)!important}}</style>", { html: true }));
  } }).on('link[rel="stylesheet"]', { element(e) {
    let url;
    try {
      url = new URL(e.getAttribute("href"), u.origin);
    } catch {
      return;
    }
    if (url.origin === u.origin && url.pathname === "/Content/sunshinedesktop" && url.search === "?v=0.0021") {
      e.before("<style data-pinnacle-reading-css>" + (mobile ? CSS.replaceAll("url(/images/background.jpg)", "url(/cdn-cgi/image/width=480,quality=65,format=auto/images/background.jpg)") : CSS) + "</style>", { html: true });
      e.setAttribute("media", "print");
      e.setAttribute("onload", 'this.media="all";this.onload=null');
      e.after('<noscript><link rel="stylesheet" href="/Content/sunshinedesktop?v=0.0021"></noscript>', { html: true });
    }
  } }).on("img", { element(e) {
    let image;
    try {
      image = new URL(e.getAttribute("src") || "", u.origin);
    } catch {
      return;
    }
    if (image.origin !== u.origin) return;
    const main = /^\/Assets\/Materials\/\d+\.(?:jpg|png)$/i.test(image.pathname) && !hero;
    if (main) {
      hero = true;
      e.setAttribute("src", resize(image.pathname, mobile ? 480 : 960));
      e.setAttribute("srcset", mobile ? resize(image.pathname, 480) + " 480w" : resize(image.pathname, 480) + " 480w, " + resize(image.pathname, 960) + " 960w");
      e.setAttribute("sizes", "(max-width:600px) calc(100vw - 60px), 960px");
      e.setAttribute("loading", "eager");
      e.setAttribute("fetchpriority", "high");
      e.setAttribute("decoding", "async");
      if (image.pathname === "/Assets/Materials/695.jpg") {
        e.setAttribute("width", "480");
        e.setAttribute("height", "480");
        e.setAttribute("style", (e.getAttribute("style") || "") + ";height:auto");
      }
    } else if (["/media/image/Pinnacle-blooms-Logo.jpg", "//Images/pinnacle-logo9.jpg", "/Images/pinnacle-logo9.jpg"].includes(image.pathname)) {
      const resized = resize(image.pathname.replace(/^\/\//, "/"), 320);
      e.setAttribute("src", resized);
      e.setAttribute("srcset", resized + " 320w");
      e.setAttribute("sizes", "320px");
      e.setAttribute("decoding", "async");
    } else if (!e.getAttribute("loading")) {
      e.setAttribute("loading", "lazy");
      e.setAttribute("decoding", "async");
    }
  } });
  const h = new Headers(response.headers);
  for (const k of ["content-length", "content-encoding", "etag", "last-modified"]) h.delete(k);
  h.set("x-pinnacle-reading-paint", "shared-reading-paint-20261011");
  return rewrite.transform(new Response(response.body, { status: response.status, headers: h }));
}
var CSS = '@font-face{font-family:Poppins;font-style:normal;font-weight:400;src:local("Poppins Regular"),local("Poppins-Regular"),url(https://fonts.gstatic.com/s/poppins/v6/pxiEyp8kv8JHgFVrJJnecnFHGPezSQ.woff2) format("woff2");unicode-range:U+100-24F,U+259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF;font-display:swap}@font-face{font-family:Poppins;font-style:normal;font-weight:400;src:local("Poppins Regular"),local("Poppins-Regular"),url(https://fonts.gstatic.com/s/poppins/v6/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2) format("woff2");unicode-range:U+0-FF,U+131,U+152-153,U+2BB-2BC,U+2C6,U+2DA,U+2DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-display:swap}@font-face{font-family:Poppins;font-style:normal;font-weight:600;src:local("Poppins SemiBold"),local("Poppins-SemiBold"),url(https://fonts.gstatic.com/s/poppins/v6/pxiByp8kv8JHgFVrLEj6Z1JlFd2JQEl8qw.woff2) format("woff2");unicode-range:U+100-24F,U+259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF;font-display:swap}@font-face{font-family:Poppins;font-style:normal;font-weight:600;src:local("Poppins SemiBold"),local("Poppins-SemiBold"),url(https://fonts.gstatic.com/s/poppins/v6/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2) format("woff2");unicode-range:U+0-FF,U+131,U+152-153,U+2BB-2BC,U+2C6,U+2DA,U+2DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-display:swap}@font-face{font-family:telugufont;src:url(/fonts/Telugu/Mallanna.ttf);font-display:swap}*{box-sizing:border-box;margin:0;padding:0;text-decoration:none;-webkit-tap-highlight-color:transparent}body,html{width:100%;height:auto;font-family:Sintony,sans-serif,Helvetica,Arial,sans-serif;overflow-x:hidden}body{background:url(/images/background.jpg) center 0px fixed;will-change:background-position}a{color:#8f2879;text-decoration:none}li,ul{margin:0;padding:0;list-style:none}.cm-container{width:100%;max-width:1170px;margin-left:auto;margin-right:auto;padding:0 15px}@media(min-width:768px){.cm-container{width:750px}}@media(min-width:992px){.cm-container{width:970px}}@media(min-width:1200px){.cm-container{width:1170px}}.cm-h-tb-left{float:left;padding:5px 0 0}.cm-h-tb-left img{width:459px;margin-left:-11px;float:left;position:absolute;margin-top:-5px;z-index:9999}nav{width:100%;display:block}.cm-h-tb-right{float:right}.cm-h-bottombar,.cm-h-topbar{width:100%;border-bottom:1px solid rgb(215,210,226);display:inline-block;float:left;background:#fff}.cm-h-tb-r-navbar-top,.cm-h-tb-r-navbar-bottom,.cm-h-bb-nav-bar{list-style:none;display:block;float:right;margin:0}.cm-h-tb-r-navbar-top li,.cm-h-tb-r-navbar-bottom li{float:left;position:relative;left:21px}.cm-h-tb-r-navbar-top li a{text-transform:uppercase;padding:22px 10px 16px;line-height:25px;display:inline-block}.cm-h-tb-r-navbar-top li a{color:#8f2879;font-size:14px;display:inline-block}.cm-h-tb-r-navbar-top li a svg{float:left;width:24px;height:24px}.cm-h-tb-r-navbar-top li a:not(.solid):not(.no-stroke) svg *{stroke:#8f2879;stroke-width:1px}.cm-h-tb-r-navbar-top li a.solid svg *{fill:#8f2879}.cm-h-tb-r-nbt-menu{display:none}.cm-h-tb-r-navbar-top li.cm-h-tb-r-nbt-menu a svg *{stroke-width:2px;stroke:#000}.cm-h-tb-r-navbar-top li a span{float:left;padding-left:5px}.cm-h-tb-r-navbar-bottom li{padding:0 9px}.cm-h-tb-r-navbar-bottom li a{position:relative;color:#411e75;text-transform:uppercase;font-size:12px;padding:20px 2px;display:inline-block;border-bottom:2px solid rgb(255,255,255)}.cm-h-bb-nav-bar{width:100%}.cm-h-bb-nav-bar>li{width:16.5%;float:left;text-align:center;position:relative}.cm-h-bb-nav-bar>li:first-child{text-align:left}.cm-h-bb-nav-bar>li>a{color:#8f2879;text-transform:uppercase;font-size:15px;padding:28px 2px 17px;border-bottom:1px solid transparent;display:inline-block;width:100%;font-weight:700}.cm-h-bb-nav-bar>li>a>span{display:inline-block;position:relative}.cm-h-bb-nav-bar>li>a>span:after{content:"\\3009";font-size:12px;font-weight:bolder;position:absolute;top:0;padding-left:2px;text-shadow:0px 1px;display:inline-block;right:-18px}.cm-h-bb-nav-bar li ul{text-align:left;font-weight:400;display:none;position:absolute;background-color:#f9f9fa;z-index:1010;padding:0 28px;border-width:medium 1px 1px;border-style:none solid solid;border-color:currentcolor rgb(231,231,231) rgb(231,231,231);border-image:none;box-shadow:#0003 0 3px 2px -2px;left:0}.cm-h-bb-nav-bar li.link-0 ul{width:600px}.cm-h-bb-nav-bar li.link-1 ul{width:600px;left:initial;right:0}.cm-h-bb-nav-bar li ul li{width:240px;float:left;border-width:1px medium medium;border-style:solid none none;border-color:rgb(233,229,238) currentcolor currentcolor;border-image:none;margin:0 15px;overflow:hidden;padding:0!important;text-align:left!important}.cm-h-bb-nav-bar li ul li a{padding:0;margin:0;display:block;height:46px;line-height:50px;text-transform:uppercase;color:#411e75}.cm-h-searchbar{margin-top:-70px;transition:margin .8s;will-change:margin-top;background:linear-gradient(to right,#411e75,#8f2879);text-align:center}.cm-h-searchbar form{position:relative;max-width:600px;padding:15px 0;margin:0 auto}.cm-h-searchbar form input{border-radius:25px;padding-left:25px;padding-right:90px;color:#404040;width:100%;height:42px;border:1px solid rgb(204,204,204);outline:none}.cm-h-searchbar form button{background-color:transparent;position:absolute;right:13px;top:24px;border:0px}.cm-h-searchbar form button svg{width:24px;height:24px}.cm-h-searchbar form button svg *{stroke:#8f2879;stroke-width:2px}.cm-h-tb-r-navbar-bottom li.mobile{display:none}@media(max-width:1200px){.cm-h-tb-r-navbar-bottom li{padding:0 8px}.cm-h-tb-left img{max-width:435px;margin-left:-21px}}@media(max-width:768px){.body-content{background:#eee!important}.cm-h-tb-r-navbar-bottom li.mobile{display:inline-block}.cm-h-tb-r-navbar-bottom li a{font-size:14px;border-bottom:0px;color:#fff;border-top:1px solid rgb(161,94,161);width:100%;margin-bottom:5px;padding-top:15px}.cm-h-tb-r-navbar-top li a svg{width:31px;height:31px}.cm-h-tb-r-navbar-bottom li{width:100%;padding:0 15px}.cm-h-tb-left img{max-width:calc(100% - 54px);margin-left:-1px;margin-top:-9px}.cm-donationblock{position:relative;z-index:99}.cm-donationblock:before{content:"";position:absolute;width:100%;height:100%;background:#0006}.cm-donationblock .cm-db-content h2{color:#fff!important}.cm-h-tb-r-nbt-menu{display:block}.cm-mirracle-go-top{border-radius:100%;background:#ee236e;position:fixed;right:108px;transition:.5s ease-in-out;z-index:2147483647;border:2px solid rgb(213,23,96);margin-left:14px;left:0;width:50px!important;height:50px!important;padding:9px!important;bottom:7px!important}.cm-h-tb-r-navbar-bottom{position:absolute;top:-800px;display:block;width:100%;background:#fff;left:0;z-index:999;transition:top .5s ease-out}.cm-h-tb-left{padding:10px 0}.cm-h-bottombar{display:none}.cm-h-tb-r-navbar-top li:not(.cm-h-tb-r-nbt-menu):not(.always-show){display:none}.cm-h-topbar{height:113px}.cm-h-tb-r-navbar-top li a{margin-top:21px}}.body-content{display:inline-block;width:100%;background:#fff;float:left}@media(max-width:768px){.cm-container{padding:0}}.cm-columnblocks{width:100%;display:inline-block;margin:0 -15px;text-align:center}.cm-columnblocks .cm-col{padding:0 15px;margin-bottom:30px;float:left;display:inherit;text-align:left}.cm-columnblocks .cm-col-4{width:25%}.cm-columnblocks .cm-col-3{width:350px;height:auto;vertical-align:top}.cm-columnblocks .cm-col-2{width:50%}.cm-columnblocks .cm-col-66{width:66%}@media(max-width:900px){.cm-columnblocks .cm-col-4{width:50%}.cm-columnblocks .cm-col-4-1{width:100%}}@media(max-width:768px){.cm-columnblocks .cm-col{width:100%}.cm-f-lang-auslam .cm-col-3{width:33.33%}}.cm-footer{display:inline-block;background:linear-gradient(35deg,#411e75,#90278f 70%);width:100%;margin-bottom:20px}.cm-f-container{color:#fff;padding:110px 0 40px;background-repeat:no-repeat;background-position:center bottom}.cm-f-container.lazy{background-image:url(/media/image/00f649c6b13a6a1bb6ad971428d79d0a.gif)}.cm-f-l-block{width:100%;display:inline-block;margin-bottom:20px;padding-top:10px}.cm-f-l-block ul li svg{height:13px;width:13px;position:relative;top:2px}.cm-f-location h2{margin-top:0;text-transform:uppercase;margin-bottom:20px;font-weight:200;font-size:24px}.cm-f-l-block div:first-child{width:30px;float:left;text-align:center}.cm-f-l-block div:first-child svg{width:14px;height:14px}.cm-f-l-block div:last-child{float:left;width:calc(100% - 30px);text-align:left}.cm-f-l-block div:last-child h3,.cm-f-l-block div:last-child h3>a{font-size:14px;color:#fff;font-weight:500;text-transform:uppercase}.cm-f-l-block div:last-child span{color:#a289c8;font-size:.8em;line-height:1.5;display:inline-block;margin-top:4px;padding-left:0!important}.cm-f-l-block div:last-child ul{list-style:none;margin:0;padding:0;width:100%}.cm-f-l-block div:last-child ul li{position:relative;display:block}.cm-f-l-block div:last-child ul li a{padding:2px 0;display:inline-block;font-size:13px;color:#d2acd4;line-height:20.5px}.cm-f-l-block div:first-child svg:not(.fill) *{fill:#fff;stroke-width:1px}.cm-f-l-block div:first-child svg.fill *{fill:#fff}.cm-f-container .cm-f-feedback{height:54px;position:relative}.cm-f-container .cm-f-feedback a{position:absolute;bottom:0;left:0;right:0;display:block;text-align:center;padding:12px 0;background-color:#ffffffb3;color:#411e75;font-weight:700;font-size:13px}.cm-f-container .cm-f-feedback a span{display:block;position:absolute;width:20px;height:20px;overflow:hidden;top:-20px;left:40px}.cm-f-container .cm-f-feedback a span:before{content:"";display:block;position:absolute;width:30px;height:30px;background-color:#ffffffb3;bottom:-10px;left:0;transform:rotate(45deg);transform-origin:0px 0px}.cm-footer p{color:#d2acd4;font-size:13px}.cm-f-lang-auslam a span{display:block;font-size:13px;color:#fff}.cm-f-lang-auslam a img{margin-top:-12px}.cm-f-footer-privacylinks li{float:left;list-style:none;padding:0 10px 0 0;margin:0 10px 0 0;position:relative}.cm-f-footer-privacylinks{display:inline-block;width:100%}.cm-f-footer-privacylinks li:not(:last-child):after{content:" ";position:absolute;width:1px;height:9px;background:#fff;top:7px;right:0;opacity:.2}.cm-f-footer-privacylinks a{opacity:.4;color:#fff;font-size:13px}.working-inprogress-overlay-withanimations{position:fixed;width:630px;height:600px;box-shadow:#0003 0 4px 16px;background:padding-box #0000004d;border:1px solid rgba(0,0,0,.333);outline:0px;left:0;right:0;top:0;margin:auto;visibility:hidden;opacity:0;padding:25px;display:table}.working-inprogress-overlay-withanimations.close{transition:.4s ease-out .22s;z-index:-1}.working-inprogress-overlay-container{width:100%;max-width:800px;height:auto;background:#fff;bottom:0;transform:scale(.75);max-height:800px;margin-left:auto;margin-right:auto;box-shadow:#00000030 0 17px 50px,#0000003d 0 12px 15px;padding:15px}.working-inprogress-overlay-withanimations.close .working-inprogress-overlay-container{transition:transform .2s ease-out}.working-inprogress-overlay-container .alert-header{font-size:20px;font-family:Poppins-Light;text-align:center;font-weight:600;text-transform:capitalize;color:#333;letter-spacing:.4px;margin-top:0}.status-msg div.errormsg,.failcolor{color:red;display:inline-block}.valid-header+.status-msg{padding-top:10px;text-align:left;color:#000!important}.working-inprogress-overlay-container .valid-header{font-size:20px;font-family:Poppins-Light;text-align:left;font-weight:600;text-transform:capitalize;color:#333;letter-spacing:.4px;margin-top:-5px}.btn-whatsapp{text-transform:uppercase;position:relative;font-size:18px;font-weight:600;padding:14px 25px;color:#07bc4c;width:auto;border-radius:3px;background-color:transparent;border:0px solid;font-family:Poppins-Light;letter-spacing:1px}.btn-whatsapp.ltblue{color:#fff;background-color:#2392ec;font-family:Arial;padding:10px 40px}.preloader{position:fixed;display:block;width:100%;height:100%;left:0;top:0;z-index:99999999;opacity:1;transform:scale(1);background:#fff}.preloader .line-scale-pulse-out-rapid{margin-top:0}@-webkit-keyframes line-scale-pulse-out-rapid{0%{transform:scaleY(1)}80%{transform:scaleY(.3)}90%{transform:scaleY(1)}}@keyframes line-scale-pulse-out-rapid{0%{transform:scaleY(1)}80%{transform:scaleY(.3)}90%{transform:scaleY(1)}}.line-scale-pulse-out-rapid>div{background-color:#fff;width:4px;height:35px;border-radius:2px;margin:2px;display:inline-block;animation:.9s cubic-bezier(.11,.49,.38,.78) -.5s infinite normal none running line-scale-pulse-out-rapid}.line-scale-pulse-out-rapid>div:nth-child(2),.line-scale-pulse-out-rapid>div:nth-child(4){animation-delay:-.25s!important}.line-scale-pulse-out-rapid>div:nth-child(1),.line-scale-pulse-out-rapid>div:nth-child(5){animation-delay:0s!important}.preloader .line-scale-pulse-out-rapid div{background:#005eb8}@-webkit-keyframes spinAround{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes spinAround{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.cm-section-main{width:100%;max-width:1170px;margin:0 auto}@media(max-width:768px){.cm-section-main{display:inline-block;margin-bottom:10px}}.cm-donationblock{width:100%;float:left;display:block;background-position:center top;background-size:cover;color:#411e75;margin-bottom:0}.cm-donationblock .cm-db-content{width:100%;background-size:contain;background-repeat:no-repeat;background-position:10% bottom;display:inline-block;float:left}.cm-donationblock .cm-db-content .cm-db-content-right{width:50%;float:right;padding:110px 20px 80px 50px}.cm-donationblock .cm-db-content h2{margin-top:0;text-transform:none;margin-bottom:22px;font-size:28px;color:#411e75;font-weight:700}.cm-donationblock .cm-db-content a.cm-db-donatenow{text-transform:none;transition:opacity .3s;width:auto;border-radius:40px;color:#8f2879;background-color:#fff6;padding:14px 50px 10px 30px;background-image:none;border:1px solid rgb(143,40,121);font-size:16px;font-weight:700;position:relative}.cm-donationblock .cm-db-content a.cm-db-donatenow:after{width:5px;height:5px;display:block;border-right:2px solid;border-top:2px solid;transform:rotate(45deg);content:"";position:absolute;right:20px;top:20px}@media(max-width:1200px){.cm-donationblock .cm-db-content{background-size:auto 280px}}@media(max-width:768px){.cm-donationblock .cm-db-content{background-image:none}.cm-donationblock .cm-db-content .cm-db-content-right{padding:30px 50px 30px 36px;width:100%;z-index:999;position:relative}}.cm-media-partners{width:100%;float:left;padding:41px 0;background:#fff;overflow:hidden;white-space:nowrap}.cm-media-partners a{display:inline-block;vertical-align:middle}.cm-media-partners .usp{width:auto;display:inline-block;text-align:center;margin-right:120px}.cm-media-partners .usp svg{width:100px;height:100px;float:left;display:inline-block}.cm-media-partners .usp svg *{stroke:#000;stroke-width:1px}.cm-media-partners .usp span{display:inline-block;font-size:24px;font-weight:400;text-transform:lowercase;margin-top:20px;margin-left:10px;vertical-align:top;color:#000}.cm-media-partners img{height:70px;margin-right:120px;filter:grayscale(100%);max-width:600px;margin-top:0!important}.cm-media-partners img.lazy{height:70px;width:400px}.cm-mp-scroll-1{display:inline-block;animation:250s linear 0s infinite normal none running marquee;position:relative;z-index:2}.cm-mp-scroll-2{display:inline-block;animation:250s linear 0s infinite normal none running marquee2}.cm-media-partners:hover .cm-mp-scroll-1,.cm-media-partners:hover .cm-mp-scroll-2,.cm-media-partners:not(.viewport) .cm-mp-scroll-2,.cm-media-partners:not(.viewport) .cm-mp-scroll-1{animation-play-state:paused}@keyframes marquee{0%{transform:translate(0)}to{transform:translate(-100%)}}@keyframes marquee2{0%{transform:translate(0)}to{transform:translate(-100%)}}@-webkit-keyframes dot-loading{0%{transform:rotate(0)}40%,60%{transform:rotate(90deg)}to{transform:rotate(180deg)}}@keyframes dot-loading{0%{transform:rotate(0)}40%,60%{transform:rotate(90deg)}to{transform:rotate(180deg)}}.simple-marquee-container{width:100%;background:#fff;float:left;display:inline-block;overflow:hidden;box-sizing:border-box;height:40px;cursor:pointer;z-index:999999999;box-shadow:#333 1px 1px 6px -1px;position:fixed;bottom:0;transition:bottom .9s linear;left:0}.marquee-sibling{background:#e4115e;height:100%;text-align:center;float:left;left:0;z-index:2000;font-family:montserrat;display:inline-block;font-weight:400;position:relative;width:auto;min-width:0px;font-size:14px;padding:0!important;color:#fff!important;line-height:37px!important}.marquee-sibling svg *{stroke:#fff;stroke-width:5px}.marquee{margin-left:25%}@-webkit-keyframes ticker-news{0%{transform:translate3d(-8%,0,0);visibility:visible}to{transform:translate3d(-100%,0,0)}}@keyframes ticker-news{0%{transform:translate3d(-8%,0,0);visibility:visible}to{transform:translate3d(-100%,0,0)}}.simple-marquee-container .marquee ul{visibility:hidden;animation-iteration-count:infinite;animation-timing-function:linear;animation-name:ticker-news;animation-duration:700s;display:inline-block;padding:4px 5px 4px 7.2%;margin:0;height:100%;position:relative;white-space:nowrap}.simple-marquee-container span{vertical-align:top;margin-top:-4px}.simple-marquee-container svg{height:18px;width:13px;margin-top:0;display:none}.simple-marquee-container a{opacity:1;text-shadow:none;font-family:Poppins;color:#000}.mirracle-close{position:absolute;top:2px;right:17px;text-align:center;background:#fff;cursor:pointer;padding:10px}.mirracle-close span{color:#e4115e;display:block;font-size:11px}.mirracle-close svg{width:34px;height:34px}.mirracle-close svg *{stroke:#e4115e}.cm-mirracle-go-top{width:55px;height:55px;border-radius:100%;background:#e4115e;position:fixed;right:108px;bottom:-200px;transition:.5s ease-in-out;z-index:2147483647;padding:12px;border:2px solid rgb(213,23,96)}.cm-mirracle-go-top svg{width:26px;height:26px}.cm-mirracle-go-top svg *{stroke-width:3px;stroke:#e0deff}.mirracle-loading{width:100vw;position:fixed;top:0;height:100vh;left:0;background-color:#fff;padding-top:12%;display:block;z-index:2147483647;text-align:center}.mirracle-loading.active{display:none}.mirracle-loading img{width:400px;margin:0 auto;max-width:90%}.cm-onw{position:absolute;left:-9000px;width:0px;height:0px;display:inline-block;overflow:hidden;z-index:-2147483648;opacity:0}.cm-mini-header-seperator{display:inline-block;width:100%;border-radius:5px;padding:0 5px;margin-bottom:10px;background:#fff}ul.therapies li svg *{stroke-width:2px;stroke:#d2acd4;fill:#d2acd4!important}ul.therapies li a{margin-left:5px}.parent-validation{background-color:#fff;background-image:none;font-weight:600;border-radius:0;margin:0}.alert-verify-overlay .working-inprogress-overlay-container{background-color:#fff;min-height:150px;max-width:630px;height:auto;vertical-align:middle;overflow:auto;width:100%;box-shadow:none;text-align:left;display:inline-block;border-radius:12px;min-width:260px}.parent-validation .btn{cursor:pointer;padding:15px 30px;float:left;text-align:center;background-color:#fff;color:#f52e57;font-weight:600;margin:0;text-transform:capitalize;border-right-width:medium;border-bottom-width:medium;border-left-width:medium;border-right-style:none;border-bottom-style:none;border-left-style:none;border-right-color:currentcolor;border-bottom-color:currentcolor;border-left-color:currentcolor;border-image:none;width:100%;font-family:Poppins;border-top:1px solid rgb(219,219,219)!important;border-radius:0!important}.working-inprogress-overlay-container .alert-header{font-size:14px;font-family:Poppins;text-align:center;font-weight:500;text-transform:inherit;color:#1a1a1a;letter-spacing:.4px;margin-top:0;margin-bottom:18px;display:inline-block;word-break:break-word;padding:10px 32px;width:100%;line-height:18px!important}.right-section-login{text-align:center;font-family:Poppins}.p-l-tv{height:22px;width:22px;overflow:hidden}.cm-menu-tv:not(.live) svg *{fill:#d2acd4!important;stroke:#d2acd4}.p-l-tv img{max-width:100%;width:22px;height:22px}.p-logo{margin-top:-7px;vertical-align:middle}.image-gallery-slide{overflow-x:scroll;left:-32px;position:relative;width:100vw!important}.image-gallery-slide.multiple a img{border-radius:10px;overflow:hidden}.image-gallery-block-design a{display:inline-block;width:100%}.image-gallery-block-design a span{padding-left:13px;width:100%;float:left}.image-gallery-slide.multiple a{width:70vw}.image-gallery-slide.multiple .image-gallery-block-design{width:100%;padding:0;white-space:nowrap!important}.cm-section-main{padding:15px 30px 0;width:100%}.green{color:#1dbf73}.cm-section-main .pinnacle-title{font-size:36px;text-align:left;color:#00b14f;letter-spacing:-1px;margin:11px auto 0;padding:0;line-height:1.5;font-family:Merriweather;font-weight:900;white-space:normal!important}.sunshine .pinnacle-paragraph{text-align:left;font-size:24px;padding-bottom:32px;margin-top:18px;white-space:initial;font-family:Quicksand,sans-serif;color:#000;font-weight:700;line-height:1.5;letter-spacing:.3px}.social-block{padding-bottom:32px;margin-top:-14px}.content-sunshine{border-bottom:2px solid rgb(0,177,79);margin-bottom:38px;float:left;width:100%}.cm-mini-header-seperator{padding:0}.sunshine .bottom-page-sunshine{white-space:normal;font-size:19px;color:#383e43;font-weight:600;line-height:1.6;margin-top:9px;font-family:Quicksand}.cm-section-main h2.pinnacle-title{border-top:2px solid rgb(229,233,240);font-size:30px;color:#00b14f;padding-top:40px!important}.sunshine .bottom-page-sunshine a{color:#000;margin-right:10px;border-bottom:1.7px solid rgb(29,191,115);line-height:2.2;padding-bottom:3px}.social-channels{display:flex;margin-bottom:10px;white-space:initial;margin-top:13px;height:13.5vw;flex-direction:row;justify-content:space-between;align-items:center;max-height:80px;width:100%!important}.social-channels i{text-align:center;margin-right:10px;color:#00b14f;float:left;display:inline-block;font-size:clamp(16px,14vw,68px)}.social-channels span{display:inline-block;width:100%;text-align:center;font-size:14px;font-weight:700}.category-title{text-align:left;font-size:20px;margin-top:20px;font-weight:400;color:#000;font-family:Quicksand,sans-serif!important}.cm-section-main h2.pinnacle-title a{color:#00b14f}.sunshine-block{float:left}.cm-section-main h2.pinnacle-title.black,.sunshine-block.black{border-top:2px solid rgb(0,177,79)}.social-block{padding-bottom:32px;margin-top:-14px;border-bottom:2px solid rgb(29,191,115)}.rating-div{margin-top:15px}.rating-block-div{display:inline-block;float:left;padding:0 0 10px;width:100%;margin-top:5px}.votes{font-size:22px;width:100%;text-align:center;display:inline-block;font-family:Quicksand;font-weight:700;margin-top:-10px;float:left;color:#333}div#fastcomments-widget{display:inline-block;margin-bottom:-60px;width:100%;float:left;position:relative}.expandable-section{display:inline-block;border-radius:10px}.expandable-section .content-sunshine{overflow:hidden;max-height:0px;transition:max-height .3s ease-out;margin:0}.expandable-section.expanded .content-sunshine{max-height:8000px;transition:max-height .3s ease-in}.expandable-section>h2.pinnacle-title{position:relative;border-width:2px 0px 0px;border-style:solid none none;border-color:rgb(0,177,79) currentcolor currentcolor;border-image:none;padding-bottom:40px;padding-right:42px;margin:0}.expandable-section:not(.expanded) h2.pinnacle-title .p-down,.expandable-section.expanded h2.pinnacle-title .p-up{display:none}.expandable-section h2 i{position:absolute;right:10px;top:38%}\n';

// deployment/legacy-social-metadata/performance.mjs
var playScript = `<script data-pinnacle-video-intent>document.addEventListener('click',function(e){var b=e.target.closest('[data-pinnacle-video]');if(!b)return;var f=document.createElement('iframe');f.src=b.dataset.pinnacleVideo;f.title=b.getAttribute('aria-label');f.allow='autoplay; encrypted-media; picture-in-picture';f.allowFullscreen=true;f.style='position:absolute;inset:0;width:100%;height:100%;border:0';b.parentNode.replaceChild(f,b);f.focus();});<\/script>`;
var escape2 = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
var StaffTitle = class {
  element() {
    this.buffer = "";
  }
  text(chunk) {
    this.buffer += chunk.text;
    if (!chunk.lastInTextNode) {
      chunk.remove();
      return;
    }
    const known = ["Best Speech Therapy Center in Hyderabad - Pinnacle Blooms", "Pinnacle Blooms Network Staff - Best Speech Therapy Center in India"];
    chunk.replace(known.includes(this.buffer.trim()) ? "Pinnacle Blooms Network Team and Staff" : this.buffer);
    this.buffer = "";
  }
};
function repairMissingRatingCounter(text) {
  const assignment = `document.getElementById('votesupdate').innerText = (sData.aggregateRating.reviewCount) +"";`;
  if (!text.includes("getsunshinerating?") || !text.includes("jSuites.rating") || text.split(assignment).length !== 3) return text;
  const value = "document.getElementById('ratingvalueupdate').innerText = (sData.aggregateRating.ratingValue) ;";
  return text.replaceAll(assignment, `document.getElementById('votesupdate') && (document.getElementById('votesupdate').innerText = (sData.aggregateRating.reviewCount) +"");`).replaceAll(value, "document.getElementById('ratingvalueupdate') && (document.getElementById('ratingvalueupdate').innerText = (sData.aggregateRating.ratingValue));");
}
var RatingScript = class {
  element(e) {
    this.pass = !!e.getAttribute("src") || !["", "text/javascript", "application/javascript"].includes(e.getAttribute("type") || "");
    this.buffer = "";
    this.streaming = false;
    if (!this.pass) {
      this.open = "<script" + [...e.attributes].map(([k, v]) => " " + k + '="' + escape2(v) + '"').join("") + ">";
      e.removeAndKeepContent();
    }
  }
  text(chunk) {
    if (this.pass) return;
    if (this.streaming) {
      if (chunk.lastInTextNode) chunk.after("<\/script>", { html: true });
      return;
    }
    this.buffer += chunk.text;
    if (this.buffer.length > 32768) {
      chunk.replace(this.open + this.buffer + (chunk.lastInTextNode ? "<\/script>" : ""), { html: true });
      this.streaming = !chunk.lastInTextNode;
      this.buffer = "";
    } else if (!chunk.lastInTextNode) chunk.remove();
    else {
      chunk.replace(this.open + repairMissingRatingCounter(this.buffer) + "<\/script>", { html: true });
      this.buffer = "";
    }
  }
};
function videoButton(src, { eager = false } = {}) {
  let u;
  try {
    u = new URL(src);
  } catch {
    return null;
  }
  if (!["www.youtube.com", "www.youtube-nocookie.com"].includes(u.hostname) || !/^\/embed\/[\w-]{11}$/.test(u.pathname)) return null;
  const id = u.pathname.split("/").pop();
  u.hostname = "www.youtube-nocookie.com";
  u.search = "?autoplay=1&rel=0";
  return '<div class="pinnacle-intent-video" style="position:relative;width:100%;aspect-ratio:16/9;background:#142348;overflow:hidden;border-radius:12px"><button type="button" data-pinnacle-video="' + escape2(u.href) + '" aria-label="Play Pinnacle video" style="display:block;position:absolute;inset:0;width:100%;height:100%;border:0;padding:0;background:#142348;color:white;cursor:pointer"><img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" width="480" height="360" loading="' + (eager ? "eager" : "lazy") + '" ' + (eager ? 'fetchpriority="high" ' : "") + 'decoding="async" style="width:100%;height:100%;object-fit:cover"><span style="position:absolute;inset:0;display:grid;place-content:center"><span style="background:#9e258f;padding:14px 22px;border-radius:50px;font:700 18px sans-serif">&#9654; Play video</span></span></button></div>';
}
function repairKnownLegacyPerformance(response, request) {
  const u = new URL(request.url);
  if (u.origin !== "https://www.pinnacleblooms.org" || !/^\/(?:(?:ma|abilities|b|c|m|t|a|abs|skills)\/[^/]+|staff\/?|mirracles\/\d+\/[^/]+)\/?$/.test(u.pathname)) return response;
  let hero = false, video = false;
  const dimensions = /* @__PURE__ */ new Map([["https://images.pinnacleblooms.org/Ability/Sections/1220.jpg", [1024, 1024]], ["https://www.pinnacleblooms.org/Assets/Materials/20707165309.jpg", [300, 300]], ["https://www.pinnacleblooms.org/Images/pinnacle-about.webp", [415, 250]]]);
  const rewrite = new HTMLRewriter().on("head", { element(e) {
    e.append("<style data-pinnacle-reading-layout>.youtube-container>.pinnacle-intent-video{position:absolute!important;inset:0;width:100%;height:100%;aspect-ratio:auto}@media(max-width:600px){.all-staff-container .bottom-b-scroll>ul>li:nth-child(n+9){content-visibility:auto;contain-intrinsic-block-size:auto 200px}.scroll-container-1>.award-holder.mirracle-holder:nth-child(n+5){content-visibility:auto;contain-intrinsic-block-size:auto 682px}}@media print{.all-staff-container .bottom-b-scroll>ul>li,.scroll-container-1>.award-holder.mirracle-holder{content-visibility:visible!important}}</style>", { html: true });
  } }).on("img", { element(e) {
    if (hero) return;
    let src;
    try {
      src = new URL(e.getAttribute("src") || "", u.origin).href;
    } catch {
      return;
    }
    if (!/^https:\/\/(?:images\.pinnacleblooms\.org\/(?:Ability|Materials)\/Sections\/|www\.pinnacleblooms\.org\/(?:Assets\/Materials\/\d+\.(?:jpg|png)|Images\/pinnacle-about\.webp))/i.test(src)) return;
    hero = true;
    e.setAttribute("loading", "eager");
    e.setAttribute("fetchpriority", "high");
    e.setAttribute("decoding", "async");
    const key = src.split("?")[0], size = dimensions.get(key);
    if (size) {
      e.setAttribute("width", String(size[0]));
      e.setAttribute("height", String(size[1]));
      e.setAttribute("style", (e.getAttribute("style") || "") + ";height:auto");
    }
    if (u.pathname === "/staff") e.setAttribute("alt", "Pinnacle Blooms Network team and child development services");
  } }).on("iframe", { element(e) {
    const button = videoButton(e.getAttribute("src") || "", { eager: !video && u.pathname.startsWith("/mirracles/") });
    if (button) {
      e.replace(button, { html: true });
      video = true;
    }
  } }).on("body", { element(e) {
    e.onEndTag((tag) => {
      if (video) tag.before(playScript, { html: true });
    });
  } });
  rewrite.on("script:not([src])", new RatingScript());
  rewrite.on("a[href]", { element(e) {
    if (["tel:9100181181", "tel:+919100181181"].includes(e.getAttribute("href"))) e.setAttribute("href", "tel:+919100181181");
  } });
  addReadingDirectory(rewrite);
  if (u.pathname.replace(/\/$/, "") === "/staff") {
    let heading = 0;
    rewrite.on("head title", new StaffTitle()).on("h1", { element(e) {
      if (++heading > 1) e.tagName = "h2";
    } });
  }
  const h = new Headers(response.headers);
  for (const k of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) h.delete(k);
  h.set("x-pinnacle-reading-performance", "native-topic-directory-20261008");
  return rewrite.transform(new Response(response.body, { status: response.status, headers: h }));
}

// deployment/url-health-repair.mjs
var ORIGIN = "https://www.pinnacleblooms.org";
var URL_ALIASES = {
  "/groupteaching": "/group-teaching",
  "/parenttraining": "/parent-training",
  "/privacypolicy": "/privacy-policy",
  "/teachertraining": "/teacher-training",
  "/certifiedcourses": "/certified-courses",
  "/abatherapy": "/best-aba-therapy-center-india-proven-improvement-rate",
  "/schooltraining": "/school-training",
  "/ABA / Behavioral Therapy": "/best-aba-therapy-center-india-proven-improvement-rate",
  "/Special Education / Cognitive Therapy": "/best-special-education-center-call-9100181181",
  "/Special Education/Cognitive Behavioral Therapy": "/best-special-education-center-call-9100181181",
  "/allmirracles-sitemap.xml": "/sitemaps/miracles.xml",
  // Shared legacy navigation still emits these redirecting destinations on
  // hundreds of pages. Point both incoming aliases and rendered links at the
  // sole maintained destination so crawlers and parents do not pay a hop.
  "/verify": "/verify/",
  "/innovation": "/pinnacle-ai-innovations-revolutionizing-autism-history",
  "/franchises": "/franchise-autism-therapy-center",
  // Historical centre ribbons used the pre-records evidence location.
  "/verify/evidence/operating-metrics.html": "/verify/evidence/records/operating-metrics.html",
  // Consolidate search-shaped aliases into the maintained service and centre
  // destinations. These aliases must not become thin, competing landing pages.
  "/child-psychologist": "/child-psychological-counseling",
  "/child-psychologist-near-me": "/child-psychological-counseling",
  "/child-counselor-near-me": "/child-psychological-counseling",
  "/speech-therapist-near-me": "/top-speech-therapy-center-india-proven-improvement-rate",
  "/occupational-therapist-near-me": "/best-occupational-therapy-center-india-proven-improvement-rate",
  "/autism-center-near-me": "/centers",
  // Exact live 404s reported by the 10 October Semrush full crawl. Keep the
  // old identities available while consolidating them into maintained pages.
  "/centers/best-autism-speech-aba-occupational-therapy-center-srikakulkam-ap-india": "/centers/best-autism-speech-aba-occupational-therapy-center-srikakulam-ap-india",
  "/b/activities-of-daily-living": "/c/activities-of-daily-living",
  "/autism-therapy-centers/kukatpally": "/centers/best-autism-speech-aba-occupational-therapy-center-kukatpally-hyderabad-telangana-india"
};
var FAQ_LANGUAGES = { english: "en-IN", hindi: "hi", telugu: "te", tamil: "ta", kannada: "kn", malayalam: "ml", bengali: "bn" };
var metadataPaths = /* @__PURE__ */ new Map([
  ["/child-psychological-counseling", /* @__PURE__ */ new Set(["https://mobile.pinnacleblooms.org/child-psychological-counseling", "http://www.pinnacleblooms.org/child-psychological-counseling", "http://mobile.pinnacleblooms.org/child-psychological-counseling"])],
  ["/franchise-autism-therapy-center", /* @__PURE__ */ new Set(["https://mobile.pinnacleblooms.org/franchises", "http://mobile.pinnacleblooms.org/franchises", "https://www.pinnacleblooms.org/franchises", "http://www.pinnacleblooms.org/franchises"])]
]);
function urlHealthAlias(request) {
  const u = new URL(request.url);
  if (!["GET", "HEAD"].includes(request.method) || u.origin !== ORIGIN || request.headers.has("authorization") || request.headers.has("range")) return null;
  let p;
  try {
    p = decodeURIComponent(u.pathname).replace(/\/$/, "");
  } catch {
    return null;
  }
  const target = URL_ALIASES[p];
  if (!target) return null;
  if (u.pathname === target) return null;
  u.pathname = target;
  return new Response(null, { status: 301, headers: { location: u.href, "cache-control": "public, max-age=300", "x-pinnacle-url-repair": "shared-url-health-20261009" } });
}
function healthLinkTarget(value) {
  let u;
  try {
    u = new URL(value, ORIGIN);
  } catch {
    return value;
  }
  if (!["www.pinnacleblooms.org", "pinnacleblooms.org"].includes(u.hostname) || !["http:", "https:"].includes(u.protocol) || u.port || u.username || u.password) return value;
  let p;
  try {
    p = decodeURIComponent(u.pathname).replace(/\/$/, "");
  } catch {
    return value;
  }
  const target = URL_ALIASES[p];
  return target ? ORIGIN + target + u.search + u.hash : value;
}
function repairUrlHealth(request, response) {
  const u = new URL(request.url);
  if (request.method !== "GET" || u.origin !== ORIGIN || request.headers.has("authorization") || request.headers.has("range") || response.status !== 200 || !response.headers.get("content-type")?.includes("text/html") || /no-transform/i.test(response.headers.get("cache-control") || "") || /^\/(?:api|cdn-cgi|ask|account|payment)(?:\/|$)/i.test(u.pathname)) return response;
  const headers = new Headers(response.headers);
  for (const k of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(k);
  headers.set("x-pinnacle-url-repair", "shared-url-health-20261009");
  const old = metadataPaths.get(u.pathname), canonical = ORIGIN + u.pathname;
  const rewrite = new HTMLRewriter().on("a[href]", { element(e) {
    const value = e.getAttribute("href"), target = publicLinkTarget(healthLinkTarget(value));
    if (target === null) e.remove();
    else if (target !== value) e.setAttribute("href", target);
    let link;
    try {
      link = new URL(value, ORIGIN);
    } catch {
      return;
    }
    if (link.origin === ORIGIN) {
      const rel = (e.getAttribute("rel") || "").split(/\s+/).filter(Boolean).filter((token) => token.toLowerCase() !== "nofollow");
      if (rel.length) e.setAttribute("rel", rel.join(" "));
      else e.removeAttribute("rel");
    }
    if (link.origin === ORIGIN && link.pathname === "/assets/abilityscore-summary.pdf") {
      e.setAttribute("href", "/verify/evidence/records/study-portfolio.html");
      e.removeAttribute("download");
      e.removeAttribute("target");
      e.setInnerContent("Read study evidence");
    }
  } });
  const faqLanguage = u.pathname.match(/^\/faq\/([^/]+)(?:\/|$)/i)?.[1]?.toLowerCase();
  if (FAQ_LANGUAGES[faqLanguage]) rewrite.on("html", { element(e) {
    e.setAttribute("lang", FAQ_LANGUAGES[faqLanguage]);
  } });
  if (old) {
    let seen = false;
    const sameIdentity = (value) => {
      try {
        const target = new URL(value, ORIGIN);
        return target.origin === ORIGIN && target.pathname === u.pathname;
      } catch {
        return false;
      }
    };
    rewrite.on('link[rel="canonical"]', { element(e) {
      const href = e.getAttribute("href");
      if (href !== canonical && !old.has(href) && !sameIdentity(href)) return;
      if (seen) e.remove();
      else {
        e.setAttribute("href", canonical);
        seen = true;
      }
    } });
    rewrite.on('meta[property="og:url"]', { element(e) {
      const value = e.getAttribute("content");
      if (old.has(value) || sameIdentity(value)) e.setAttribute("content", canonical);
    } });
    if (u.pathname === "/child-psychological-counseling") {
      let title = false, description = false, heading = false;
      rewrite.on("title", { element(e) {
        if (title) return;
        title = true;
        e.setInnerContent("Child Psychologist & Psychological Counselling | Pinnacle Blooms");
      } });
      rewrite.on('meta[name="description"]', { element(e) {
        if (description) return;
        description = true;
        e.setAttribute("content", "Child psychology and counselling guidance for children and families. Find a Pinnacle centre and call 9100 181 181 to confirm the professional, appointment and fee.");
      } });
      rewrite.on("h1", { element(e) {
        if (heading) return;
        heading = true;
        e.setInnerContent("Child psychology and counselling support for children and families");
        e.after('<section id="child-psychology-next-step" aria-label="Talk with Pinnacle about child psychology and counselling" style="box-sizing:border-box;max-width:980px;margin:18px auto;padding:20px;border:1px solid #d9bfd6;border-radius:16px;background:#fff;color:#18233f;box-shadow:0 10px 28px rgba(24,35,63,.08)"><p style="margin:0 0 14px;font-size:1.05rem;line-height:1.65">Talk through concerns about emotions, behaviour, learning or participation. Pinnacle will help you identify an appropriate centre and confirm the available qualified professional, appointment and fee before you visit.</p><div style="display:flex;flex-wrap:wrap;gap:12px"><a href="tel:+919100181181" data-cta="child-psychology-call" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 18px;border-radius:999px;background:#652579;color:#fff;text-decoration:none;font-weight:800">Call 9100 181 181</a><a href="/enroll-autism-speech-aba-therapies-india?service=psychological-counselling" data-cta="child-psychology-assessment" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 18px;border:2px solid #652579;border-radius:999px;background:#fff;color:#652579;text-decoration:none;font-weight:800">Request an assessment</a><a href="/centers" style="display:inline-flex;align-items:center;min-height:48px;color:#315c80;font-weight:800">Find a Pinnacle centre near you</a></div><p style="margin:14px 0 0;font-size:.92rem;line-height:1.55">Pinnacle does not diagnose from this page. Confirm the suitable service and professional for your child with the receiving team.</p></section>', { html: true });
      } });
    }
  }
  const fonts = /* @__PURE__ */ new Set();
  rewrite.on("style:not([src])", new RepeatedFontFaces());
  rewrite.on('link[rel="stylesheet"]', { element(e) {
    const href = e.getAttribute("href");
    let font;
    try {
      font = new URL(href, u.origin);
    } catch {
      return;
    }
    if (font.hostname !== "fonts.googleapis.com" || !["/css", "/css2"].includes(font.pathname) || font.protocol !== "https:" || font.port || font.username || font.password) return;
    const key = font.href + "|" + (e.getAttribute("media") || "") + "|" + (e.getAttribute("disabled") ?? "enabled");
    if (fonts.has(key)) e.remove();
    else fonts.add(key);
  } });
  if (u.pathname === "/speech-aba-autism-assessments") rewrite.on("main", { element(e) {
    e.append('<section data-pinnacle-assessment-guides><h2>Read about assessment approaches</h2><p>These reference guides explain distinct assessments. The receiving professional confirms which, if any, is appropriate for your child.</p><ul><li><a href="/assessments/speech-and-language-evaluation-assessment">Speech and language evaluation</a></li><li><a href="/assessments/hamilton-depression-rating-scale-ham-d">Hamilton Depression Rating Scale: professional reference</a></li></ul></section>', { html: true });
  } });
  let repaired = repairKnownLegacySchema(repairKnownBrokenMedia(request, rewrite.transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }))), request.url);
  if (!repaired.headers.has("x-pinnacle-reading-performance")) repaired = repairKnownLegacyPerformance(repaired, request);
  return repairReadingPaint(request, repaired);
}
export {
  URL_ALIASES,
  healthLinkTarget,
  repairUrlHealth,
  urlHealthAlias
};
