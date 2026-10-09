// deployment/legacy-social-metadata/organization.mjs
var organization = { "@context": "https://schema.org", "@type": "Organization", "@id": "https://www.pinnacleblooms.org/#organization", "name": "Bharath Healthcare Laboratories Private Limited", "legalName": "Bharath Healthcare Laboratories Private Limited", "url": "https://www.pinnacleblooms.org/", "logo": "https://www.pinnacleblooms.org/verify/images/pinnacle-logo.webp", "brand": { "@type": "Brand", "@id": "https://www.pinnacleblooms.org/verify/#pinnacle-brand", "name": "Pinnacle Blooms Network", "url": "https://www.pinnacleblooms.org/" }, "description": "Pinnacle Blooms Network is a child-development therapy network operated by Bharath Healthcare Laboratories Private Limited. Services include autism support, speech therapy, ABA/behaviour therapy, occupational therapy and special education. Confirm services, practitioner availability and fees with the preferred centre.", "telephone": "+919100181181", "email": "care@pinnacleblooms.org", "contactPoint": { "@type": "ContactPoint", "name": "Pinnacle-operated National Autism Helpline", "contactType": "parent guidance and appointment enquiries", "telephone": "+919100181181", "url": "https://www.pinnacleblooms.org/national-autism-helpline", "availableLanguage": ["en", "te", "hi"] }, "identifier": [{ "@type": "PropertyValue", "propertyID": "CIN", "value": "U74999TG2016PTC113063" }, { "@type": "PropertyValue", "propertyID": "LEI", "value": "894500OJYBVC18BUDN89" }], "sameAs": ["https://www.pinnacleblooms.org/verify/#organization"], "subjectOf": { "@type": "WebPage", "name": "Dated institutional claim and source ledger", "url": "https://www.pinnacleblooms.org/verify/evidence/claim-ledger.html" }, "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.pinnacleblooms.org/" } };
async function repairLegacyIdentity(text) {
  const normalized = text.trim().replaceAll("\r\n", "\n");
  if (!normalized.startsWith("{") || !normalized.includes('"@type": "Organization"')) return text;
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))), (b) => b.toString(16).padStart(2, "0")).join("");
  return ["204ebe91d049448a5f8ef50862790ef97f8a43c99d2756ed07fe4631c5f01bc0", "58b3106343e0bff97e5cd6e3236f948cad70a009fdc8145a723004bf50606afa"].includes(digest) ? JSON.stringify(organization).replace(/</g, "\\u003c") : text;
}

// deployment/legacy-social-metadata/media.mjs
var missing = /* @__PURE__ */ new Set(["/Assets/Materials/20707165343.jpg", "/Images/ProfileImages/12798111602.jpg", "/Images/ProfileImages/20552642664.jpg", "/Images/ProfileImages/20707155230.jpg", "/Images/ProfileImages/20708422583.jpg", "/Images/ProfileImages/20708623831.jpg", "/Images/ProfileImages/20708666496.jpg", "/Images/ProfileImages/20709822519.jpg", "/Images/ProfileImages/20710414688.jpg", "/Images/ProfileImages/3062523339.jpg", "/Images/ProfileImages/3062523460.jpg", "/Images/ProfileImages/3062523628.jpg", "/Images/ProfileImages/3062523633.jpg", "/Images/ProfileImages/3062523640.jpg", "/Images/ProfileImages/3062523874.jpg", "/Images/ProfileImages/3062525279.jpg", "/Images/ProfileImages/3062526597.jpg", "/Images/ProfileImages/3159708782.jpg", "/Images/ProfileImages/3178670904.jpg", "/Images/ProfileImages/3549649944.jpg"]);
function isMissingMedia(value) {
  try {
    const u = new URL(value, "https://www.pinnacleblooms.org");
    return u.origin === "https://www.pinnacleblooms.org" && missing.has(u.pathname);
  } catch {
    return false;
  }
}

// deployment/legacy-social-metadata/schema.mjs
var SCHEMA_LIMIT = 256 * 1024;
function repairSchemaText(text) {
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
    return text;
  } catch {
    return text;
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
      const escape = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
      this.open = "<script" + [...element.attributes].map(([key, value]) => " " + key + '="' + escape(value) + '"').join("") + ">";
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
  const tracking2 = /* @__PURE__ */ new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "utm_source_platform", "utm_creative_format", "utm_marketing_tactic", "gclid", "dclid", "msclkid", "fbclid", "gbraid", "wbraid"]);
  let request;
  try {
    request = new URL(requestUrl);
  } catch {
    return text;
  }
  if (request.origin !== "https://www.pinnacleblooms.org" || request.pathname.replace(/\/$/, "") !== "/physiotherapy") return text;
  if (![...request.searchParams.keys()].every((key) => tracking2.has(key))) return text;
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
// deployment/legacy-social-metadata/media.mjs
var missing = /* @__PURE__ */ new Set(["/Assets/Materials/20707165343.jpg", "/Images/ProfileImages/12798111602.jpg", "/Images/ProfileImages/20552642664.jpg", "/Images/ProfileImages/20707155230.jpg", "/Images/ProfileImages/20708422583.jpg", "/Images/ProfileImages/20708623831.jpg", "/Images/ProfileImages/20708666496.jpg", "/Images/ProfileImages/20709822519.jpg", "/Images/ProfileImages/20710414688.jpg", "/Images/ProfileImages/3062523339.jpg", "/Images/ProfileImages/3062523460.jpg", "/Images/ProfileImages/3062523628.jpg", "/Images/ProfileImages/3062523633.jpg", "/Images/ProfileImages/3062523640.jpg", "/Images/ProfileImages/3062523874.jpg", "/Images/ProfileImages/3062525279.jpg", "/Images/ProfileImages/3062526597.jpg", "/Images/ProfileImages/3159708782.jpg", "/Images/ProfileImages/3178670904.jpg", "/Images/ProfileImages/3549649944.jpg"]);
missing.add("/Assets/Materials/318.jpg");
for (const p of ["/Assets/AbilityScore_Universal_0-1000_Child%20Development_Metric.jpg", "/Assets/Materials/20707167545.jpg", "/Assets/Materials/962.jpg", "/Assets/OG/495.jpg", "/images/therapysphere-room.jpg"]) missing.add(p);

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
async function repairLegacyGraph(text, requestUrl) {
  text = repairSidebarBreadcrumb(text, requestUrl); if (text === null) return null;
  if (text.length > SCHEMA_LIMIT) return text;
  const normalized = text.trim().replaceAll("\r\n", "\n");
  if (normalized.includes('"@type": "JobPosting"')) {
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))), (b) => b.toString(16).padStart(2, "0")).join("");
    if (digest === "eee6f24856abce7f793489c5335315d223fb8d25b33260dd420a25a91f6b9ebe") return null;
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
    const tracking2 = /* @__PURE__ */ new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "utm_source_platform", "utm_creative_format", "utm_marketing_tactic", "gclid", "dclid", "msclkid", "fbclid", "gbraid", "wbraid"]);
    const identity = data.url?.replace(/&(?:amp|#0*38|#x0*26);/gi, "&");
    if (u.origin !== "https://www.pinnacleblooms.org" || data["@context"] !== "http://schema.org" || data["@type"] !== "CollectionPage" || u.hash || u.username || u.password || [...u.searchParams.keys()].some((k) => !tracking2.has(k)) || data.id !== data.url || new URL(identity).href !== u.href.replace(/^https:/, "http:") || Object.keys(data).sort().join(",") !== "@context,@type,description,id,mainEntityOfPage,url" || data.mainEntityOfPage?.["@type"] !== "ImageGallery" || !Array.isArray(data.mainEntityOfPage.image) || !data.mainEntityOfPage.image.every((i) => i["@type"] === "ImageObject" && typeof i.url === "string")) return text;
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
function repairPublicLinks(response) {
  return new HTMLRewriter().on("a[href]", { element(el) {
    const before = el.getAttribute("href"), after = publicLinkTarget(before);
    if (after === null) el.remove();
    else if (after !== before) el.setAttribute("href", after);
  } }).transform(response);
}

// deployment/legacy-template-coverage.mjs
var LEGACY_TEMPLATE_PATHS = /* @__PURE__ */ new Set([
  "/seva-index",
  "/question-comprehension-study",
  "/therapeuticai-effectiveness-study",
  "/autism-speech-aba-news",
  "/global-research-whitebook",
  "/school-readiness-study",
  "/abilityscore-predictive-study",
  "/music-therapy",
  "/therapysphere-study",
  "/seva-impact-study",
  "/abilityscore-global-study",
  "/parent-training",
  "/research-studies",
  "/parent-led-generalization",
  "/autism-speech-aba-parent-family-resources",
  "/hydro-therapy",
  "/group-teaching",
  "/media-coverage",
  "/therapist-burnout-empathy",
  "/school-training",
  "/multilingual-therapy-outcomes",
  "/contact-national-autism-helpline-24-7",
  "/everyday-therapy-home-study",
  "/events",
  "/accessibility-policy",
  "/acceptable-use-policy",
  "/cancellation-policy",
  "/data-protection-policy",
  "/community-guidelines",
  "/pinnacle-ai-innovations-revolutionizing-autism-history",
  "/shipping-and-delivery-policy",
  "/everyday-therapy-program",
  "/security-policy"
]);
var tracking = /* @__PURE__ */ new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "utm_source_platform", "utm_creative_format", "utm_marketing_tactic", "gclid", "dclid", "msclkid", "fbclid", "gbraid", "wbraid"]);
var decode = (value) => value?.replace(/&(?:amp|#0*38|#x0*26);/gi, "&");
var enc = new TextEncoder();
function residualCentreAlias(request) {
  const u = new URL(request.url), path = u.pathname.replace(/\/$/, "").toLowerCase();
  if (!["GET", "HEAD"].includes(request.method) || u.origin !== "https://www.pinnacleblooms.org" || request.headers.has("authorization") || request.headers.has("range") || !CENTRE_CANONICAL_PATHS.has(path) || u.pathname === path) return null;
  u.pathname = path;
  return new Response(null, { status: 301, headers: { location: u.href, "cache-control": "public,max-age=300", "x-pinnacle-route-repair": "registered-centre-case-20261007" } });
}
function residualTemplateRequest(request) {
  if (!legacyTemplateEligible(request)) return request;
  const h = new Headers(request.headers);
  h.delete("if-none-match");
  h.delete("if-modified-since");
  return new Request(request, { headers: h });
}
var LEGACY_TITLE_REPAIRS = {
  "/seva-index": { before: "SEVA\u2122 Social Equity Index Study | Pinnacle\xAE | Autism Therapy Without Exceptions", after: "SEVA\u2122 Social Equity Index Study | Pinnacle Blooms" },
  "/question-comprehension-study": { before: "Study: Structured Receptive Language Therapy Boosts Question Comprehension | Pinnacle Blooms", after: "Question Comprehension Study | Pinnacle Blooms" },
  "/global-research-whitebook": { before: "Pinnacle Global Research Whitebook | Validated Autism Therapy Framework \u2013 AbilityScore\xAE, SEVA\u2122, TherapeuticAI\xAE, TherapySphere\u2122", after: "Global Research Whitebook | Pinnacle Blooms" },
  "/school-readiness-study": { before: "School Readiness Study \u2013 AbilityScore\xAE & Inclusion Outcomes | Pinnacle Blooms Network", after: "School Readiness & AbilityScore\xAE Study | Pinnacle Blooms" },
  "/abilityscore-predictive-study": { before: "The Compass That Predicts Progress | AbilityScore\xAE Predictive Validity Study", after: "AbilityScore\xAE Predictive Validity Study | Pinnacle Blooms" },
  "/music-therapy": { before: "Best Music Therapy Centers in Hyderabad, Delhi, Vizag, Vija", after: "Music Therapy & Child Development | Pinnacle Blooms" }
};
function legacyTemplateEligible(request) {
  const u = new URL(request.url);
  return request.method === "GET" && u.origin === "https://www.pinnacleblooms.org" && (LEGACY_TEMPLATE_PATHS.has(u.pathname.replace(/\/$/, "")) || /^\/assessments\/[a-z0-9-]+\/?$/.test(u.pathname)) && !request.headers.has("authorization") && !request.headers.has("range") && [...u.searchParams.keys()].every((k) => tracking.has(k));
}
function combine(parts) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let i = 0;
  for (const p of parts) {
    out.set(p, i);
    i += p.length;
  }
  return out;
}
function resume(parts, reader) {
  return new ReadableStream({ async pull(c) {
    if (parts.length) {
      c.enqueue(parts.shift());
      return;
    }
    try {
      const { done, value } = await reader.read();
      if (done) {
        reader.releaseLock();
        c.close();
      } else c.enqueue(value);
    } catch (e) {
      reader.releaseLock();
      c.error(e);
    }
  }, async cancel(reason) {
    try {
      await reader.cancel(reason);
    } finally {
      reader.releaseLock();
    }
  } });
}
async function repairResidualLegacyTemplates(request, response) {
  if (!legacyTemplateEligible(request) || response.status !== 200 || !response.body || !/^text\/html(?:\s*;|$)/i.test(response.headers.get("content-type") || "") || /charset\s*=\s*(?!utf-8(?:\s|;|$))/i.test(response.headers.get("content-type") || "") || response.headers.has("set-cookie") || /noindex/i.test(response.headers.get("x-robots-tag") || "") || /no-store|no-transform/i.test(response.headers.get("cache-control") || "")) return response;
  const reader = response.body.getReader(), parts = [];
  let size = 0, end = 0, bytes;
  while (size < 65536) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    size += value.length;
    bytes = combine(parts);
    const probe = new TextDecoder().decode(bytes.subarray(0, 65536)), m = /<\/head\s*>/i.exec(probe);
    if (m) {
      end = enc.encode(probe.slice(0, m.index + m[0].length)).length;
      break;
    }
  }
  let head = null, target = null, previous = null, observedTitle = "";
  if (end && !(bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191)) try {
    head = new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, end));
    const canonical = [], social = [], robots = [];
    await new HTMLRewriter().on("head > title", { text(c) {
      observedTitle += c.text;
    } }).on("head > link", { element(e) {
      if ((e.getAttribute("rel") || "").toLowerCase().split(/\s+/).includes("canonical")) canonical.push(decode(e.getAttribute("href")));
    } }).on("head > meta", { element(e) {
      if ((e.getAttribute("property") || "").toLowerCase() === "og:url") social.push(decode(e.getAttribute("content")));
      if (["robots", "googlebot", "bingbot"].includes((e.getAttribute("name") || "").toLowerCase())) robots.push(e.getAttribute("content") || "");
    } }).transform(new Response(head)).text();
    if (canonical.length === 1 && social.length === 1 && !robots.some((v) => /noindex|none/i.test(v))) {
      const u = new URL(canonical[0]), req = new URL(request.url);
      if (u.origin === req.origin && u.pathname.replace(/\/$/, "") === req.pathname.replace(/\/$/, "") && !u.hash && !u.username && !u.password && (!u.search || u.search === req.search) && [canonical[0], canonical[0].replace(/^https:/, "http:")].includes(social[0])) {
        u.search = "";
        target = u.href;
        previous = social[0];
      }
    }
  } catch {
  }
  if (!target) return new Response(resume(parts, reader), { status: response.status, statusText: response.statusText, headers: response.headers });
  const title = LEGACY_TITLE_REPAIRS[new URL(request.url).pathname.replace(/\/$/, "")];
  const patched = await new HTMLRewriter().on("head > title", { element(e) {
    if (title && decode(observedTitle) === title.before) e.setInnerContent(title.after);
  } }).on("head > link", { element(e) {
    if ((e.getAttribute("rel") || "").toLowerCase().split(/\s+/).includes("canonical")) e.setAttribute("href", target);
  } }).on("head > meta", { element(e) {
    if ((e.getAttribute("property") || "").toLowerCase() === "og:url" && decode(e.getAttribute("content")) === previous) e.setAttribute("content", target);
  } }).transform(new Response(head)).text();
  const headers = new Headers(response.headers);
  for (const key of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest", "content-digest", "repr-digest", "accept-ranges"]) headers.delete(key);
  headers.set("x-pinnacle-template-coverage", "residual-20261007");
  return repairPublicLinks(repairKnownLegacySchema(new Response(resume([enc.encode(patched), bytes.subarray(end)], reader), { status: response.status, statusText: response.statusText, headers }), request.url));
}
export {
  LEGACY_TEMPLATE_PATHS,
  LEGACY_TITLE_REPAIRS,
  legacyTemplateEligible,
  repairResidualLegacyTemplates,
  residualCentreAlias,
  residualTemplateRequest
};
