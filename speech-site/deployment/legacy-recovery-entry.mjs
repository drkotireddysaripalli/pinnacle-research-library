// work/ask-distribution-release-20261003/speech-site/deployment/public-mobile-recovery.mjs
var identities = /* @__PURE__ */ new Map([
  ["/", /^#1 Autism Therapy Centres Network/i],
  ["/contact-national-autism-helpline-24-7", /^Contact Us - Pinnacle Blooms Network/i],
  ["/careers", /^Careers at Pinnacle Blooms Network/i],
  ["/research-studies", /^Pinnacle Research Studies/i],
  ["/child-psychological-counseling", /^Best Child Counselling Centers/i],
  ["/franchise-autism-therapy-center", /^Advantages of pinnacle blooms network franchises/i],
  ["/epass", /^#1 Autism Therapy Centres Network/i],
  ["/TOS", /^Pinnacle Blooms - Terms of usage/i],
  ["/tos", /^Pinnacle Blooms - Terms of usage/i],
  ["/yoga-therapy", /^Best Yoga Therapy Centers In /i],
  ["/physiotherapy", /^Best Physio Therapy In /i],
  ["/hydro-therapy", /^Best Hydro Therapy Centers in /i],
  ["/autism-speech-aba-parent-family-resources", /^Resources - Pinnacle Blooms Network /i],
  ["/autism-speech-aba-news", /^News - Child Development, Rehabilitation centers/i]
]);
var desktop = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
var publicResourcePath = (path) => /^\/(?:t|c|ma|b|m|a|abs|abilities|skills)\/[a-z0-9][a-z0-9-]*\/?$/.test(path);
function knownMobilePublicRequest(request) {
  const u = new URL(request.url);
  return ["GET", "HEAD"].includes(request.method) && u.origin === "https://www.pinnacleblooms.org" && (identities.has(u.pathname) || publicResourcePath(u.pathname)) && /Android|iPhone|iPad|Mobile/i.test(request.headers.get("user-agent") || "") && !["authorization", "range", "if-range", "if-match", "if-none-match", "if-modified-since", "if-unmodified-since"].some((k) => request.headers.has(k)) && !/\bno-transform\b/i.test(request.headers.get("cache-control") || "");
}
async function boundedText(response) {
  const reader = response.body?.getReader();
  if (!reader) return "";
  let bytes = 0;
  const chunks = [];
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 4 * 1024 * 1024) {
        await reader.cancel();
        throw Error("Public HTML exceeds known recovery limit");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const data = new Uint8Array(bytes);
  let offset = 0;
  for (const c of chunks) {
    data.set(c, offset);
    offset += c.length;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(data);
}
function canonicalPath(html) {
  const tag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0];
  const href = tag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
  try {
    const u = new URL(href?.replaceAll("&amp;", "&"));
    return u.origin === "https://www.pinnacleblooms.org" ? u.pathname : null;
  } catch {
    return null;
  }
}
async function fetchPublicOrigin(request, fetcher = fetch) {
  const original = await fetcher(request);
  if (!knownMobilePublicRequest(request) || original.status !== 500 || !original.headers.get("content-type")?.includes("text/html")) return original;
  try {
    if (request.method === "GET") {
      const error = await boundedText(original.clone());
      const path = new URL(request.url).pathname;
      const rootFaqFailure = ["/", "/epass"].includes(path) && [
        "Unexpected character encountered while parsing value: &lt;. Path &#39;&#39;, line 0, position 0.",
        "PinnacleBlooms.MISC.Utility.GetFaqs(String lang, String category)",
        "ASP._Page_Views_Home_Index_V9_Mobile_cshtml.Execute()",
        "Index-V9.Mobile.cshtml:line 11"
      ].every((fragment) => error.includes(fragment));
      const counsellingFaqFailure = path === "/child-psychological-counseling" && error.includes("PinnacleBlooms.MISC.Utility.GetFaqs(String lang, String category)") && error.includes("ASP._Page_Views_Home_PsychologicalCounselling_V9_Mobile_cshtml.Execute()");
      const resourceNullFailure = publicResourcePath(path) && error.includes("System.NullReferenceException") && error.includes("ASP._Page_Views_Shared_SunshineInnerPage_V9_Mobile_cshtml.Execute()");
      const knownJsonFailure = error.includes("Newtonsoft.Json.JsonReaderException") && (error.includes("GetStaffandCentersData") || rootFaqFailure || counsellingFaqFailure);
      if (!/<title>\s*Error\s*<\/title>/i.test(error) || !(resourceNullFailure || knownJsonFailure)) return original;
    }
    const headers = new Headers(request.headers);
    headers.set("user-agent", desktop);
    headers.set("sec-ch-ua-mobile", "?0");
    const retry = await fetcher(new Request(request, { method: "GET", headers }));
    if (retry.status !== 200 || !retry.headers.get("content-type")?.includes("text/html")) return original;
    let html = await boundedText(retry);
    const u = new URL(request.url), title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
    const canonical = canonicalPath(html);
    const expectedTitle = identities.get(u.pathname);
    const titleMatches = expectedTitle ? expectedTitle.test(title) : publicResourcePath(u.pathname) && title.length > 5 && !/^(?:error|not found|page not found)\b/i.test(title) && /<h1\b[^>]*>[^<\s]/i.test(html);
    if (!titleMatches || !(canonical === u.pathname || u.pathname === "/TOS" && canonical === "/tos" || u.pathname === "/franchise-autism-therapy-center" && canonical === "/franchises")) return original;
    html = html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i, `<link rel="canonical" href="${u.origin + canonical}">`);
    const out = new Headers(retry.headers);
    for (const k of ["content-length", "content-encoding", "etag", "last-modified", "age", "expires"]) out.delete(k);
    out.set("cache-control", "private, no-store");
    out.set("x-pinnacle-public-render-recovery", "mobile-origin-20261008");
    out.set("vary", [...new Set((out.get("vary") || "").split(",").map((v) => v.trim()).filter(Boolean).concat("User-Agent"))].join(", "));
    return new Response(request.method === "HEAD" ? null : html, { status: 200, headers: out });
  } catch {
    return original;
  }
}

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/franchise-canonical.mjs
var canonical = "https://www.pinnacleblooms.org/franchise-autism-therapy-center";
var old = /* @__PURE__ */ new Set(["https://www.pinnacleblooms.org/franchises", "http://www.pinnacleblooms.org/franchises", "https://mobile.pinnacleblooms.org/franchises", "http://mobile.pinnacleblooms.org/franchises"]);
function repairFranchiseCanonical(request, response) {
  const u = new URL(request.url);
  if (request.method !== "GET" || u.origin + u.pathname !== canonical || request.headers.has("authorization") || response.status !== 200 || !response.headers.get("content-type")?.includes("text/html")) return response;
  let seen = false;
  const headers = new Headers(response.headers);
  for (const key of ["content-length", "content-encoding", "etag", "last-modified"]) headers.delete(key);
  headers.set("x-pinnacle-canonical-repair", "franchise-20261005");
  return new HTMLRewriter().on('link[rel="canonical"]', { element(el) {
    const href = el.getAttribute("href");
    if (!old.has(href) && href !== canonical) return;
    if (seen) el.remove();
    else {
      el.setAttribute("href", canonical);
      seen = true;
    }
  } }).on('meta[property="og:url"]', { element(el) {
    if (old.has(el.getAttribute("content"))) el.setAttribute("content", canonical);
  } }).transform(new Response(response.body, { status: response.status, headers }));
}

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/staff-records.mjs
var retiredStaffIds = /* @__PURE__ */ new Set([1050, 1470, 1677, 1680, 1684, 1696, 1705, 1713, 1714, 1715, 1716, 1717, 1721, 1728, 1731, 1735, 1737, 1738, 1739, 1741, 1742, 1743, 1752, 1754, 1755, 1759, 1762, 1764, 1773, 1780, 1782, 1785, 1788, 1790, 1792, 1793, 1797, 1800, 1801, 1802, 1804, 1806, 1807, 1810, 1811, 1813, 1815, 1816, 1817, 1819, 1820, 1821, 1822, 1826, 1827, 1828, 1829, 1830, 1831, 1832, 1833, 1834, 1836, 1837, 1838, 1840, 1841, 1842, 1843, 1844, 1845, 1846, 1847, 1848, 1849, 1850, 1851, 1852, 1854, 1855, 1856, 1859, 1860, 1861, 1862, 1863, 1864, 1865, 1866, 1867, 1868, 1869, 1870, 1871, 1872, 1873, 1874, 1875, 1877, 1878, 1879, 1881, 1882, 1883, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1916, 1917, 1918, 1920, 1923, 1924, 1925, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1942, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1968, 1969, 1970, 1972, 1974, 1975, 1976, 1977, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2e3, 2001, 2002, 2003, 2005, 2006, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2040, 2041, 2044, 2045, 2046, 2047, 2048, 2049, 2050, 2051, 2052, 2053, 2054, 2055, 2056, 2057, 2058, 2059, 2060, 2061, 2062, 2063, 2065, 2066, 2067, 2068, 2069, 2070, 2071, 2072, 2074, 2075, 2076, 2077, 2078, 2079, 2080, 2082, 2083, 2084, 2085, 2086, 2087, 2089, 2090, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100, 2101, 2103, 2104, 2105, 2109, 2111, 2112, 2114, 2119, 2122, 2123, 2124, 2125, 2127, 2129, 2131, 2132, 2133, 2136, 2137, 2138, 2139, 2140, 2141, 2142, 2143, 2144, 2145, 2146, 2147, 2148, 2149, 2150, 2151, 2152, 2155, 2156, 2157, 2158, 2159, 2160, 2161, 2162, 2163, 2164, 2165, 2166, 2167, 2168, 2169, 2170, 2171, 2172, 2174, 2176, 2178, 2179, 2182, 2184, 2185, 2186, 2187, 2188, 2189, 2190, 2192, 2193, 2194, 2195, 2196, 2197, 2198, 2200, 2202, 2203, 2204, 2205, 2208, 2209, 2210, 2211, 2214, 2216, 2218, 2219, 2220, 2222, 2223, 2224, 2226, 2230, 2231, 2233, 2235, 2236, 2237, 2238, 2239, 2240, 2241, 2243, 2244, 2245, 2246, 2247, 2248, 2249, 2250, 2252, 2254, 2255, 2256, 2257, 2258, 2259, 2260, 2261, 2262, 2263, 2265, 2266, 2267, 2269, 2270, 2271, 2272, 2274, 2275, 2276, 2277, 2279, 2280, 2281, 2283, 2285, 2287, 2288, 2289, 2290, 2291, 2292, 2293, 2294, 2295, 2296, 2297, 2298, 2299, 2300, 2301, 2304, 2306, 2307, 2308, 2309, 2310, 2311, 2314, 2315, 2316, 2318, 2319, 2320, 2321, 2322, 2323, 2324, 2325, 2326, 2328, 2329, 2331, 2332, 2333, 2334, 2335, 2336, 2338, 2339, 2341, 2343, 2344, 2345, 2346, 2347, 2348, 2349, 2351, 2352, 2353, 2354, 2355, 2356, 2357, 2358, 2359, 2360, 2361, 2362, 2363, 2364, 2365, 2367, 2368, 2369, 2372, 2384, 2526, 2539, 2541, 2626, 2632, 2646, 2683, 2891, 3083, 3085, 3089, 3095, 3244, 3643, 3704, 3909, 4012, 4059, 4060, 4063, 4145, 4204, 4372, 4425, 4426, 4467, 4480, 4504, 4524, 4544, 4551, 4709, 4710, 4711, 4712, 4713, 4714, 4715, 4716, 4717, 4718, 4719, 4720, 4722, 4723, 4724, 4725, 4726, 4727, 4733, 4736, 4740, 4741, 4742, 4746, 4747, 4748, 4749, 4750, 4751, 4752, 4753, 4760, 4761, 4763, 4764, 4766, 4786, 4789, 4790, 4791, 4792, 4799, 4804, 4805, 4806, 4807, 4814, 4815, 4816, 4817, 4818, 4819, 4820, 4821, 4822, 4824, 4825, 4827, 4828, 4830, 4831, 4835, 4836, 4837, 4840, 4845, 4846, 4847, 4849, 4851, 4853, 4854, 4856, 4857, 4858, 4866, 4867, 4868, 4871, 4874, 4875, 4880, 4882, 4883, 4884, 4887, 4888, 4889, 4891, 4893, 4894, 4900, 4901, 4902, 4904, 4905, 4907, 4909, 4910, 4911, 4912, 4914, 4915, 4918, 4920, 4922, 4923, 4924, 4925, 4926, 4929, 4930, 4931, 4932, 4938, 4939, 4942, 4943, 4944, 4946, 4948, 4949, 4950, 4952, 4953, 4955, 4961, 4963, 4964, 4966, 4968, 4971, 4974, 4975, 4976, 4978, 4979, 4980, 4981, 4983, 4984, 4985, 4986, 4987, 4991, 4992, 4993, 4995, 4996, 4998, 5e3, 5001, 5002, 5003, 5007, 5009, 5010, 5011, 5012, 5013, 5014, 5015, 5016, 5018, 5019, 5020, 5021, 5022, 5023, 5025, 5027, 5028, 5029, 5031, 5032, 5033, 5034, 5035, 5038, 5041, 5043, 5044, 5048, 5049, 5053, 5058, 5062, 5064, 5065, 5069, 5073, 5075, 5077, 5078, 5081, 5082, 5085, 5086, 5089, 5090, 5092, 5097, 5099, 5106, 5108, 5112, 5113, 5114, 5118, 5121, 5122, 5123, 5124, 5126, 5127, 5128, 5129, 5132, 5133, 5134, 5136, 5141, 5145, 5146, 5147, 5149, 5150, 5152, 5153, 5154, 5155, 5156, 5157, 5158, 5159, 5163, 5164, 5167, 5168, 5170, 5173, 5177, 5706, 6425, 6714, 8312, 8545, 8695, 8863, 8964, 9168, 9195, 9234, 9463, 9467, 9596, 9607, 9613, 9639, 9650, 9674, 9706, 9776, 9870, 9871, 9879, 9881, 9887, 9906, 9958, 10062, 10063, 10138, 10153, 10315, 10340, 10362, 10363, 10364, 10390, 10409, 10445, 10471, 10472, 10478, 10518, 10533, 10648, 10860, 10864, 10875, 10877, 10903, 10905, 11203, 11206, 11211, 11275, 11295, 11366, 11581, 11607, 11665, 11722, 11786, 11822, 11982, 12066, 12157, 12171, 12257, 12359, 12360, 12381, 12410, 12499, 12512, 12520, 12529, 12850, 12854, 12855, 12861, 12897, 12955, 13007, 13431, 13434, 13668, 13677, 13680, 13684, 13719, 13742, 13745, 13840, 13850, 13853, 13855, 13856, 13859, 13907, 13936, 14034, 14045, 14056, 14405, 14409, 14461, 14671, 14876, 15122, 15135, 15141, 15150, 15395, 15919, 15927, 16051, 16112, 16157, 16238, 16297, 16310, 16682, 17127, 17198, 17503, 18148, 18330, 18348, 18771, 18817, 18821, 18887, 18893, 18895, 18910, 20708, 20858, 20970, 21142, 21149, 21197, 21225, 21234, 21899, 21905, 22538, 22716, 22922, 23042, 23045, 23049, 23050, 23113, 23257, 23365, 23620, 23954, 24065, 24066, 24072, 24078, 24363, 24373, 24473, 24560, 24611, 24622, 24989, 25068, 25092, 25138, 25153, 25206, 25270, 25469, 25559, 25568, 25608, 25627, 25650, 25658, 25663, 25946, 26051, 26067, 26208, 26210, 26224, 26235, 26244, 26265, 26501, 26634, 26647, 26702, 26704, 26774, 26818, 26860, 26907, 26928, 26992, 27277, 27319, 27337, 27419, 27421, 27479, 27852, 28024, 28065, 28075, 28087, 28095, 28105, 28140, 28187, 28199, 28285, 28393, 28520, 28736, 28791, 28801, 29061, 29066, 29068, 29103, 29110, 29118, 29342, 29343, 29345, 29346, 29348, 29349, 29351, 29352, 29353, 29354, 29357, 29397, 29403, 29413, 29467, 29468, 29533, 29771, 29933, 30205, 30372, 30815, 30976, 31035, 31432, 31433, 31435, 31514, 31548, 31577, 31666, 31670, 31867, 31947, 32431, 32497, 32518, 32595, 32634, 32661, 32674, 32889, 32983, 32989, 33079, 33188, 33221, 33302, 33460, 33608, 33626, 33627, 33629, 33667, 33680, 33817, 33822, 33832, 33969, 34040, 34073, 34142, 34162, 34739, 34744, 34755, 34757, 34759, 34760, 34761, 34762, 34764, 34766, 34767, 34768, 34769, 34770, 34771, 34858, 34860, 34983, 35084, 35285, 35296, 35299, 35316, 35373, 35386, 35437, 35439, 35441, 35447, 35468, 35483, 35498, 35576, 35671, 35729, 35730, 35803, 35804, 35806, 35883, 35977, 36154, 36229, 36247, 36517, 36519, 36521, 36522, 36549, 36557, 36577, 36592, 36667, 36787, 36847, 36860, 36923, 36932, 36965, 37330, 37746, 37748, 37785, 37804, 38039, 38081, 38239, 38351, 38415, 38418, 38422, 38506, 38576, 38712, 38776, 38783, 38823, 38873, 38995, 39012, 39044, 39114, 39151, 39434, 39456, 39487, 39502, 39534, 39741, 39846, 39860, 39863, 39885, 39887, 39924, 39953, 40027, 40045, 40217, 40359, 40449, 40454, 40456, 40457, 40522, 40574, 40642, 40695, 40702, 40909, 41053, 41054, 41055, 41080, 41194, 41320, 41321, 41509, 41510, 41546, 41593, 41678, 41687, 41787, 41877, 42008, 42012, 42032, 42083, 42113, 42209, 42215, 42649, 42708, 42737, 42745, 42751, 42807, 43578, 43657, 43659, 43663, 43679, 43756, 43863, 43866, 43952, 44046, 44488, 44534, 44564, 45151, 45503, 45541, 45560, 45590, 45754, 45870, 46110, 46644, 46679, 46680, 46772, 46854, 46855, 46966, 47301, 47303, 47541, 47543, 47544, 47546, 47581, 47848, 47926, 47927, 48494, 48658, 48768, 48775, 48823, 48824, 48826, 48830, 49070, 49403, 49568, 49571, 49573, 50026, 50069, 50082, 50087, 50623, 50730, 50843, 50980, 51005, 51234, 51421, 51423, 51626, 51742, 51993, 52006, 52040, 52211, 52346, 52428, 52429, 52439, 52477, 52486, 52582, 52872, 52901, 52929, 52930, 53203, 53223, 53439, 53632, 53667, 53749, 53874, 53976, 53981, 53982, 53983, 53985, 53987, 53988, 54059, 54284, 54367, 54426, 54463, 54513, 54631, 54995, 55027, 55030, 55035, 55113, 55471, 55535, 55539, 55584, 55784, 55865, 55930, 55931, 56215, 56216, 56365, 56368, 56382, 56703, 56746, 56778, 56997, 57130, 57131, 57135, 57176, 57297, 57324, 57474, 57600, 57640, 57823, 57825, 58015, 58166, 58273, 58296, 58321, 58369, 58371, 58372, 58387, 58404, 58921, 58922, 59094, 59098, 59379, 59488, 59491, 59498, 59525, 59527, 59529, 59551, 59642, 59664, 59802, 59804, 60033, 60035, 60398, 60433, 60491, 60628, 60651, 60709, 60711, 60761, 60822, 60885, 60887, 60888, 61005, 61073, 61081, 61141, 61159, 61273, 61307, 61500, 61505, 61568, 61606, 61608, 61628, 61656, 61729, 61773, 61791, 62006, 62009, 62012, 62013, 62015, 62095, 62151, 62360, 62459, 62492, 62612, 62613, 62661, 63024, 63284, 63287, 63695, 63709, 63832, 63876, 63972, 64035, 64039, 64121, 64162, 64203, 64217, 64218, 64303, 64577, 65036, 65449, 65505, 65689, 65697, 65911, 66102, 66211, 66254, 66430, 66431, 66473, 66637, 66794, 66853, 66962, 66967, 66991, 67047, 67242, 67243, 67252, 67318, 67350, 67525, 67613, 67666, 67670, 67671, 67680, 67871, 68045, 68126, 68149, 68232, 68294, 68501, 68782, 68783, 68872, 69118, 69276, 69588, 69593, 69665, 69669, 69878, 70080, 70926, 70927, 70932, 71049, 71099, 71173, 71287, 71316, 71319, 71392, 71571, 71672, 71969, 72107, 72285, 72725, 73077, 73160, 73167, 73193, 73204, 73311, 73678, 73731, 73753, 73850, 74375, 74878, 74879, 75046, 75218, 75272, 75292]);
var currentStaffPaths = { "3815": "/staff/ALURI-TARUN-KUMAR/3815", "52004": "/staff/Aluri-Durgaprasad/52004", "72543": "/staff/B-Naveen-Harshavardhan/72543", "44859": "/staff/Gadapa-Lakshmi-Swethachandana/44859", "51942": "/staff/Kali-chitti-thalli/51942", "52216": "/staff/Madapothala-Renuka-Jyothi/52216", "60639": "/staff/Mohammed-khariya-bathool/60639", "73253": "/staff/Aastha-Bhargava/73253", "71492": "/staff/abdul-mannan-ahmed-farooqui/71492", "75726": "/staff/Anusha-N-R/75726", "71180": "/staff/Anusha-Peddada/71180", "70092": "/staff/Arika-Srilekha/70092", "40697": "/staff/ARIKACHERLA-MOUNIKA/40697", "75106": "/staff/Arushi-Singh/75106", "20710641772": "/staff/Asalla-Rajkumar/20710641772", "12093182405": "/staff/Asma-jabeen/12093182405", "73094": "/staff/Avusula-Mukthananda/73094", "20709299570": "/staff/Azmeera-Raju/20709299570", "53980": "/staff/B-Rohini/53980", "20708951509": "/staff/Badithimani-Nirmala-Kumari/20708951509", "8936756986": "/staff/Bandaru-Rajitha/8936756986", "71971": "/staff/Barigela-Sahithi/71971", "18890": "/staff/Bassa-Subrahmanyam/18890", "60918": "/staff/Besta-Soumya-Sree/60918", "72140": "/staff/Bhargavi-Airpula/72140", "50078": "/staff/BHASKARA-RAO-MEESALA/50078", "61507": "/staff/Bhukya-srinu/61507", "73883": "/staff/Bitra-Mamatha-mayi/73883", "73286": "/staff/Boddu-subhashini/73286", "34570": "/staff/Bolamala-komali/34570", "70936": "/staff/Boya-Saniya-Sree/70936", "3062540101": "/staff/Burra-Satish-Goud/3062540101", "20708951526": "/staff/Burugu-Prasanthi/20708951526", "74294": "/staff/Chaitanya-Daravemula/74294", "20688775316": "/staff/Charmala-Bhavani/20688775316", "72556": "/staff/Chaya-K/72556", "41356": "/staff/Chille-Venkatalakshmi/41356", "44776": "/staff/CHINNA-KANDUKURI-SHIRISHA/44776", "73336": "/staff/Chintakindi-Ranjith-kumar/73336", "23223": "/staff/chintalapudi-gangaratnam/23223", "71469": "/staff/Chintalapudi-Gowthami/71469", "4065": "/staff/Chodavarapu-Gowthami/4065", "69096": "/staff/Chokkapu-venkatalakshmi/69096", "72542": "/staff/D-Salma-khanam/72542", "20709145666": "/staff/Dammannapeta-Prashanth/20709145666", "13908036187": "/staff/Dandimenu-Aruna/13908036187", "50051": "/staff/Dara-Deepthi/50051", "20709668364": "/staff/Dega-Devendrudu/20709668364", "20709622908": "/staff/Devalraju-Sai-Sujitha/20709622908", "8780": "/staff/Dhanamma/8780", "50091": "/staff/Dharavath-kalpana/50091", "20708275644": "/staff/Didekula-Noor-Babu/20708275644", "73603": "/staff/Disha-Prakash/73603", "11469042414": "/staff/Dorasala-Priyanka-Rani/11469042414", "20689072805": "/staff/Dova-Sulochana/20689072805", "60296": "/staff/Dukka-Preethi/60296", "71051": "/staff/Dulam-Jyothi/71051", "73123": "/staff/Dumpa-Neelima-Jyothi/73123", "73670": "/staff/Eethakota-Bhargavi-Sri/73670", "74124": "/staff/Elvis-Kakindai-Ruangmei/74124", "75444": "/staff/Etikala-Shankar/75444", "72537": "/staff/Fathima-Hamda/72537", "73687": "/staff/G-Rajendra-Prasad/73687", "69667": "/staff/G-karthik/69667", "8720": "/staff/Galinki-Suneetha/8720", "61877": "/staff/GANDHARI-PRADEEPKUMAR/61877", "73884": "/staff/Ganta-Keerthana/73884", "75081": "/staff/Golla-Chinna-Narsimhudu/75081", "57824": "/staff/Gondi-Varshitha/57824", "23569": "/staff/Gorre-Nandini/23569", "8478": "/staff/Gudise-Sharonrose/8478", "4045": "/staff/Guggilla-Manjunath-Reddy/4045", "16228": "/staff/Gujjari-Soumya/16228", "73338": "/staff/GUMMADI-PRADEEP-KUMAR/73338", "67929": "/staff/Gutala-Sushma/67929", "20709669079": "/staff/Harika-More/20709669079", "73677": "/staff/inapanuri-Keerthi/73677", "3062541237": "/staff/Ithagoni-Swapna/3062541237", "65801": "/staff/Jalla-Bhargavi/65801", "9746": "/staff/Jambarapu-Nikhitha/9746", "12851": "/staff/Jampula-Nandu/12851", "3470947366": "/staff/Jangamsetti-Ravi-Teja/3470947366", "52897": "/staff/Jarapati-Vijaya/52897", "60435": "/staff/Jarupula-Kishore-Rati/60435", "20710661132": "/staff/Jhansi-Rani/20710661132", "53630": "/staff/Juluru-Neelima/53630", "72835": "/staff/K-mounika/72835", "73284": "/staff/K-Rajitha/73284", "3062539927": "/staff/Kalakunta-Padma/3062539927", "3062541770": "/staff/Kamandla-Swaroopa-Rani/3062541770", "20710495448": "/staff/Kamidri-Anvesh/20710495448", "74941": "/staff/kamireddy-tejeswari/74941", "73527": "/staff/kandula-saikeerthi/73527", "41354": "/staff/Karipothu-Vincent/41354", "43379": "/staff/katla-Renuka/43379", "20710627047": "/staff/Kavitapu-Surya-Deepak/20710627047", "75700": "/staff/Kavya-Krishna-K/75700", "20708203003": "/staff/Kodiguddu-Swami-Kiran/20708203003", "3062541584": "/staff/Komarala-Sreenivasulu/3062541584", "12907": "/staff/kommuru-sowmya/12907", "20709518319": "/staff/Kondra-Rajkumar/20709518319", "36216": "/staff/Konidela-mehaboobchan/36216", "20709555634": "/staff/Koppoju-Gopi-Suresh/20709555634", "65434": "/staff/Koppula-Rameshwari/65434", "68853": "/staff/kore-yamini-jyothi/68853", "75543": "/staff/kothapalli-kalyani/75543", "57248": "/staff/kumbala-Bhanupriya/57248", "50840": "/staff/Lakshmi-Sai/50840", "67396": "/staff/lavanya-R/67396", "4131": "/staff/Lenka-Kurmi-Naidu/4131", "46026": "/staff/Lotavath-Kalyani-bai/46026", "64428": "/staff/M-S-V-NIKHIL/64428", "20708479097": "/staff/M-Naga-Lakshmi/20708479097", "75647": "/staff/M-Tejaswini/75647", "55940": "/staff/Madda-Ramya/55940", "69115": "/staff/Maddi-Gayatri-Devi/69115", "72377": "/staff/Maddirala-Bala-Lakshmi-Reddy/72377", "24339": "/staff/Madharapu-Tejasri/24339", "68822": "/staff/Maimuna-Fatima/68822", "36831": "/staff/Malapati-Amrutha-Varshini/36831", "3062541028": "/staff/Malleswari/3062541028", "13581053248": "/staff/Mallipudi-Vijay/13581053248", "42082": "/staff/Manikonda-kalyani/42082", "72869": "/staff/MANNEPALLY-VENKATESHWARLU/72869", "75724": "/staff/Mariya-Jos/75724", "74757": "/staff/Medarapalli-sandhyarani/74757", "8286": "/staff/Medi-jayasree/8286", "67124": "/staff/MEDICHELIMELA-NAVEEN-KUMAR/67124", "59778": "/staff/Moghal-Mousumi/59778", "75725": "/staff/Mohammad-shabana/75725", "45748": "/staff/Mohammad-Farzana/45748", "3062540062": "/staff/Mohammed-Abdul-mateen/3062540062", "3062539541": "/staff/Mohammed-Nishat/3062539541", "20710074928": "/staff/Mohammed-Zohaib/20710074928", "20708527474": "/staff/Mohammedh-Sufiyan/20708527474", "4807982554": "/staff/Mohd-Abdul-Minhaj/4807982554", "75390": "/staff/Mohd-Mukram/75390", "20688684970": "/staff/Mora-Sowjanya/20688684970", "20710089086": "/staff/Mounika-Talari/20710089086", "20709222937": "/staff/Mrudula-Deepthi-P/20709222937", "68524": "/staff/Muchukota-Hema/68524", "37802": "/staff/Muddada-Seetharam/37802", "20709556255": "/staff/Mulla-Rasool-Bee/20709556255", "75653": "/staff/muppidi-sneha/75653", "74224": "/staff/Mutyala-Preethi/74224", "73853": "/staff/Myakala-Narsimha-Murthy/73853", "73283": "/staff/N-BHANU-PRASAD/73283", "51991": "/staff/Nagalapuram-Mowlika/51991", "75171": "/staff/Nallagorla-Pavan-Kumar/75171", "14139": "/staff/Nathi-DevRaj/14139", "20708157937": "/staff/Neethu-Dharma-Dev-Singh/20708157937", "72568": "/staff/Nidigallu-James-Rahul/72568", "27915": "/staff/Niroshna-jogi/27915", "62011": "/staff/O-S-Sirisha/62011", "67797": "/staff/OZILI-MUGDHA-VARSHINI/67797", "66638": "/staff/P-Mounika/66638", "73485": "/staff/P-Sanjeev-Reddy/73485", "39523": "/staff/P-Naresh/39523", "74304": "/staff/Palli-Preetham-lincey/74304", "73693": "/staff/Pandi-Indu-Priya/73693", "20710819113": "/staff/Panthangi-Mamatha/20710819113", "3062540776": "/staff/Parakala-Anjaiah/3062540776", "20710374456": "/staff/Parigi-Bhargavi/20710374456", "20708198027": "/staff/Parimala-Nissi/20708198027", "10120045449": "/staff/Parveda-Chandra-Shekar/10120045449", "20710600468": "/staff/Pasula-Srikanth/20710600468", "60578": "/staff/PASUPULETI-SRIKANTH/60578", "17252": "/staff/Patnam-Pranathi/17252", "43678": "/staff/Pattan-Inthiyaz-Khan/43678", "16115": "/staff/Peddakota-Prasad/16115", "12922469928": "/staff/Penumarthi-Surendra/12922469928", "9103": "/staff/Perumalla-Prasanth-Kumar/9103", "20710694795": "/staff/Polamuri-Pallavi/20710694795", "66930": "/staff/Polepalli-Jaswanth-Charan/66930", "20710959033": "/staff/Ponukumati-Sujatha/20710959033", "70938": "/staff/Potluri-Mahalakshmi/70938", "70698": "/staff/prakriti-Sharma/70698", "75722": "/staff/Praveena-k/75722", "20708929115": "/staff/Priyadharshini-R/20708929115", "41101": "/staff/pujitha-sunkari/41101", "31513": "/staff/Pulipati-Gouthami/31513", "20709216602": "/staff/Putta-Blessina-Rani/20709216602", "20688993807": "/staff/Pyla-Venkata-RTamakrishna-Ayappaswami/20688993807", "3062540662": "/staff/Raju-Routhu/3062540662", "20708307981": "/staff/Ramineni-Rohith/20708307981", "26993": "/staff/Rao-Sita-Kamala-Ramadevi-Ruchitha/26993", "50084": "/staff/RAPAKA-KIRAN/50084", "64520": "/staff/Ravali-Muniganti/64520", "71913": "/staff/Ravi-Raj-Mahato/71913", "3220424453": "/staff/Renamala-Subhashini/3220424453", "40453": "/staff/S-Indraneela/40453", "20708962324": "/staff/Sai-Avinash/20708962324", "40797": "/staff/Sake-Nandini/40797", "3062540588": "/staff/Salapu-Mounika/3062540588", "25791": "/staff/Samasthapattla-Rajasekhar/25791", "66964": "/staff/SANAMPUDI-SIVA-REDDY/66964", "20709251309": "/staff/Sanniboina-Mahesh/20709251309", "72523": "/staff/Saripella-Sai-Trisha/72523", "20710717333": "/staff/Sathunuri-Madhuri/20710717333", "20688900373": "/staff/Shaheen-Begum/20688900373", "75040": "/staff/Shaik-Anjum-Parveen/75040", "5100420168": "/staff/Shaik-gouse-Sandani/5100420168", "72531": "/staff/Shaik-minazza-farzeen/72531", "72840": "/staff/Shaik-Mujiba-Begum/72840", "51583": "/staff/Singidi-Madhuri-Divya/51583", "20708592993": "/staff/Siva-Rama-Krishna/20708592993", "20708807999": "/staff/Sonia-honey/20708807999", "20708270363": "/staff/Sowjanya-Gude/20708270363", "4660": "/staff/SOWJANYA-VARA/4660", "20710265297": "/staff/SP-Siddu-Babu/20710265297", "41355": "/staff/sridhar-kagitha/41355", "20710658011": "/staff/Sudheer-Kumar-Velamala/20710658011", "20709738745": "/staff/Surasi-Bharath/20709738745", "59671": "/staff/Swetha-Narayan/59671", "74930": "/staff/syed-nadeem/74930", "48753": "/staff/SYEDA-SARA-SADIA/48753", "67561": "/staff/Tangi-Kumari/67561", "8936745247": "/staff/Thamanan-Prem/8936745247", "72540": "/staff/Trishna-Sudhakaran/72540", "44626": "/staff/Valluri-Rahul/44626", "71070": "/staff/Vasam-Rajendhar/71070", "40059": "/staff/Vasamsetti-Manga-Devi/40059", "75147": "/staff/Vasamsetti-Tarun-Sai-Swaroop/75147", "20709757055": "/staff/Veera-Kishore/20709757055", "75410": "/staff/Velamuri-Suraj-Prakash/75410", "73851": "/staff/Vempati-Manoj-Kumar/73851", "75646": "/staff/vemula-Ankala-Babu/75646", "20709072713": "/staff/Vemula-Apuroop/20709072713", "20709900693": "/staff/Venkata-Ratna-Kiran-Ayinapuri/20709900693", "20708486784": "/staff/Voggu-krishna-veni/20708486784", "38949": "/staff/yapala-shekhar/38949", "74756": "/staff/Yarlagadda-Sharon-hema-Ratnam/74756", "20688709080": "/staff/Yarlagadda-Srividya/20688709080", "51422": "/staff/Yellampalli-krishnasri/51422", "44685": "/staff/Yelle-Gangadharam/44685", "20711176378": "/staff/Yerragudi-Swapna/20711176378", "72833": "/staff/Yerraguntla-Gowthami/72833", "21527": "/staff/Yerram-Reddy-siva-parvathi/21527", "52900": "/staff/Yerramala-Sreekanth/52900", "24554": "/staff/Yesu-Ratnam-Devaguptapu/24554", "20688979750": "/staff/Zareena-Begum/20688979750" };

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/staff-routes.mjs
var origin = "https://www.pinnacleblooms.org";
function staffRoute(request) {
  const url = new URL(request.url);
  if (url.origin !== origin || !["GET", "HEAD"].includes(request.method) || request.headers.has("authorization")) return null;
  const match = url.pathname.match(/^\/staff\/[^/]+\/([1-9][0-9]*)\/?$/);
  if (!match) return null;
  const id = Number(match[1]);
  if (retiredStaffIds.has(id)) return new Response(request.method === "HEAD" ? null : `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Profile no longer available | Pinnacle Blooms Network</title><meta name="robots" content="noindex, follow"><style>body{margin:0;background:white;color:#18305a;font:18px/1.7 system-ui,sans-serif}main{max-width:720px;margin:8vh auto;padding:24px}img{width:250px;max-width:100%;height:auto}h1{font-size:clamp(28px,5vw,40px);line-height:1.3}a{color:#8f2879;text-underline-offset:4px}nav{display:flex;flex-wrap:wrap;gap:20px;margin-top:28px}nav a{padding:12px;border:1px solid #d8c6df;border-radius:8px}</style></head><body><main><a href="/"><img src="/pinnacle-pages-assets/shop-20261002/pbn-logo.webp" alt="Pinnacle Blooms Network"></a><h1>This profile is no longer available.</h1><p>Find a published professional profile or speak with Pinnacle about the right support and centre for your child.</p><nav aria-label="Continue with Pinnacle"><a href="/staff">Browse professional profiles</a><a href="/centers">Find a centre</a><a href="tel:+919100181181">Call 9100 181 181</a></nav></main></body></html>`, { status: 410, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300", "x-robots-tag": "noindex, follow", "x-pinnacle-profile-status": "retired-20261005" } });
  const canonical2 = currentStaffPaths[match[1]];
  if (canonical2 && url.pathname !== canonical2) {
    url.pathname = canonical2;
    return new Response(null, { status: 301, headers: { location: url.href, "cache-control": "public, max-age=300", "x-pinnacle-profile-status": "canonical-20261005" } });
  }
  return null;
}

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/payload.mjs
var DEBUG_SHA256 = "4a0bbd8996a569108cc0176dd270f916d9237a90a639f8dea27d340fff47a9dc";
var DEBUG_BYTES = 195721;
var LIMIT = 256 * 1024;
var PREFIX = /^\s*console\.log\(\[\{&quot;DisplayTitle&quot;/;
var hex = (bytes) => Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
var KnownInvalidDebugScript = class {
  element(element) {
    const type = (element.getAttribute("type") || "").trim().toLowerCase();
    this.pass = !["", "text/javascript", "application/javascript"].includes(type);
    this.buffer = "";
  }
  async text(chunk) {
    if (this.pass) return;
    this.buffer += chunk.text;
    if (this.buffer.length > LIMIT || this.buffer.length > 100 && !PREFIX.test(this.buffer)) {
      chunk.replace(this.buffer, { html: true });
      this.buffer = "";
      this.pass = true;
      return;
    }
    if (!chunk.lastInTextNode) {
      chunk.remove();
      return;
    }
    const bytes = new TextEncoder().encode(this.buffer);
    let known = false;
    if (bytes.length === DEBUG_BYTES && PREFIX.test(this.buffer)) {
      try {
        known = hex(await crypto.subtle.digest("SHA-256", bytes)) === DEBUG_SHA256;
      } catch {
      }
    }
    if (known) chunk.remove();
    else chunk.replace(this.buffer, { html: true });
    this.buffer = "";
  }
};
function reduceKnownLegacyPayload(request, response) {
  const path = new URL(request.url).pathname;
  if (!(path === "/faq" || path.startsWith("/faq/"))) return response;
  const headers = new Headers(response.headers);
  for (const name of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(name);
  headers.set("x-pinnacle-legacy-payload", "fingerprinted-debug-filter-20261004");
  return new HTMLRewriter().on("script:not([src])", new KnownInvalidDebugScript()).transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/discovery.mjs
var SERVICES_PATH = "/top-autism-therapy-services-india-proven-improvement-rate";
var SERVICES_URL = "https://www.pinnacleblooms.org" + SERVICES_PATH;
function physiotherapyRedirect(request) {
  const url = new URL(request.url);
  if (!["GET", "HEAD"].includes(request.method) || url.protocol !== "https:" || url.hostname !== "www.pinnacleblooms.org" || !["/physio-therapy", "/physio-therapy/"].includes(url.pathname) || request.headers.has("authorization") || request.headers.has("range")) return null;
  url.pathname = "/physiotherapy";
  return new Response(null, { status: 301, headers: {
    location: url.href,
    "cache-control": "public, max-age=300",
    "x-pinnacle-discovery": "physiotherapy-alias-20261004"
  } });
}
function repairServiceLinks(request, response) {
  if (new URL(request.url).pathname.replace(/\/$/, "") !== SERVICES_PATH) return response;
  return new HTMLRewriter().on("a[href]", { element(el) {
    const href = el.getAttribute("href");
    if (/^\/physio-therapy\/?(?:[?#]|$)/.test(href || ""))
      el.setAttribute("href", href.replace(/^\/physio-therapy\/?/, "/physiotherapy"));
  } }).transform(response);
}

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/organization.mjs
var organization = { "@context": "https://schema.org", "@type": "Organization", "@id": "https://www.pinnacleblooms.org/#organization", "name": "Bharath Healthcare Laboratories Private Limited", "legalName": "Bharath Healthcare Laboratories Private Limited", "url": "https://www.pinnacleblooms.org/", "logo": "https://www.pinnacleblooms.org/verify/images/pinnacle-logo.webp", "brand": { "@type": "Brand", "@id": "https://www.pinnacleblooms.org/verify/#pinnacle-brand", "name": "Pinnacle Blooms Network", "url": "https://www.pinnacleblooms.org/" }, "description": "Pinnacle Blooms Network is a child-development therapy network operated by Bharath Healthcare Laboratories Private Limited. Services include autism support, speech therapy, ABA/behaviour therapy, occupational therapy and special education. Confirm services, practitioner availability and fees with the preferred centre.", "telephone": "+919100181181", "email": "care@pinnacleblooms.org", "contactPoint": { "@type": "ContactPoint", "name": "Pinnacle-operated National Autism Helpline", "contactType": "parent guidance and appointment enquiries", "telephone": "+919100181181", "url": "https://www.pinnacleblooms.org/national-autism-helpline", "availableLanguage": ["en", "te", "hi"] }, "identifier": [{ "@type": "PropertyValue", "propertyID": "CIN", "value": "U74999TG2016PTC113063" }, { "@type": "PropertyValue", "propertyID": "LEI", "value": "894500OJYBVC18BUDN89" }], "sameAs": ["https://www.pinnacleblooms.org/verify/#organization"], "subjectOf": { "@type": "WebPage", "name": "Dated institutional claim and source ledger", "url": "https://www.pinnacleblooms.org/verify/evidence/claim-ledger.html" }, "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.pinnacleblooms.org/" } };
async function repairLegacyIdentity(text) {
  const normalized = text.trim().replaceAll("\r\n", "\n");
  if (!normalized.startsWith("{") || !normalized.includes('"@type": "Organization"')) return text;
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized))), (b) => b.toString(16).padStart(2, "0")).join("");
  return ["204ebe91d049448a5f8ef50862790ef97f8a43c99d2756ed07fe4631c5f01bc0", "58b3106343e0bff97e5cd6e3236f948cad70a009fdc8145a723004bf50606afa"].includes(digest) ? JSON.stringify(organization).replace(/</g, "\\u003c") : text;
}

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/media.mjs
var BRAND_IMAGE = "https://www.pinnacleblooms.org/pinnacle-pages-assets/pinnacle-blooms-network-lockup.CUnZranx_Z2nTFgn.webp";
var missing = /* @__PURE__ */ new Set(["/Assets/Materials/20707165343.jpg", "/Images/ProfileImages/12798111602.jpg", "/Images/ProfileImages/20552642664.jpg", "/Images/ProfileImages/20707155230.jpg", "/Images/ProfileImages/20708422583.jpg", "/Images/ProfileImages/20708623831.jpg", "/Images/ProfileImages/20708666496.jpg", "/Images/ProfileImages/20709822519.jpg", "/Images/ProfileImages/20710414688.jpg", "/Images/ProfileImages/3062523339.jpg", "/Images/ProfileImages/3062523460.jpg", "/Images/ProfileImages/3062523628.jpg", "/Images/ProfileImages/3062523633.jpg", "/Images/ProfileImages/3062523640.jpg", "/Images/ProfileImages/3062523874.jpg", "/Images/ProfileImages/3062525279.jpg", "/Images/ProfileImages/3062526597.jpg", "/Images/ProfileImages/3159708782.jpg", "/Images/ProfileImages/3178670904.jpg", "/Images/ProfileImages/3549649944.jpg"]);
missing.add("/Assets/Materials/318.jpg");
function isMissingMedia(value) {
  try {
    const u = new URL(value, "https://www.pinnacleblooms.org");
    return u.origin === "https://www.pinnacleblooms.org" && missing.has(u.pathname);
  } catch {
    return false;
  }
}
function repairKnownBrokenMedia(response) {
  const headers = new Headers(response.headers);
  for (const key of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(key);
  headers.set("x-pinnacle-known-media", "verified-missing-20261006");
  return new HTMLRewriter().on("img", { element(el) {
    if (!isMissingMedia(el.getAttribute("src"))) return;
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
    if (["og:image", "twitter:image"].includes(el.getAttribute("property") || el.getAttribute("name")) && isMissingMedia(el.getAttribute("content"))) el.setAttribute("content", BRAND_IMAGE);
  } }).transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/schema.mjs
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
        const old2 = props.get("xPath");
        if (type?.value === "SpeakableSpecification" && old2?.value.kind === "array" && old2.value.children.every((child) => child.kind === "string") && !props.has("xpath")) patches.push({ token: old2.key, value: '"xpath"' });
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
  const canonical2 = "https://www.pinnacleblooms.org/physiotherapy", identities2 = [];
  const template = normalized.replace(/^([ \t]*"(?:id|url)"[ \t]*:[ \t]*)("(?:\\[\s\S]|[^"\\])*")/gm, (_, prefix, token) => {
    identities2.push(JSON.parse(token).replace(/&(?:amp;)+/gi, "&"));
    return prefix + JSON.stringify("http://www.pinnacleblooms.org/physiotherapy");
  });
  if (identities2.length !== 2 || identities2[0] !== identities2[1]) return text;
  try {
    const url = new URL(identities2[0]);
    if (!["http:", "https:"].includes(url.protocol) || url.hostname !== "www.pinnacleblooms.org" || url.pathname !== "/physiotherapy" || url.port || url.username || url.password || url.hash) return text;
  } catch {
    return text;
  }
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(template))), (b) => b.toString(16).padStart(2, "0")).join("");
  if (digest !== "bf6caa0a32cf9863d60110e924e8f72d3b59c78793311de1a69419790cda9f86") return text;
  const data = JSON.parse(normalized.replace("//begin bracket for multiple entries under image", "").replace("//end bracket for ImageGallery > image(s)", "").replace("//end bracket for mainEntityOfPage", ""));
  data["@context"] = "https://schema.org";
  data["@id"] = canonical2;
  data.url = canonical2;
  delete data.id;
  return JSON.stringify(data);
}
async function repairPhysiotherapyWebPage(text, requestUrl) {
  const canonical2 = "https://www.pinnacleblooms.org/physiotherapy";
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
  const identities2 = [];
  const template = text.trim().replaceAll("\r\n", "\n").replace(/("(?:url|@id|id)"\s*:\s*)("(?:\\[\s\S]|[^"\\])*")/g, (_, prefix, token) => {
    identities2.push(JSON.parse(token).replace(/&(?:amp;)+/gi, "&"));
    return prefix + JSON.stringify(canonical2.replace("https:", "http:"));
  });
  for (const value of identities2) {
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
  if (counts[digest] !== identities2.length) return text;
  return text.replace(/("(?:url|@id|id)"\s*:\s*)("(?:\\[\s\S]|[^"\\])*")/g, (_, prefix) => prefix + JSON.stringify(canonical2));
}
async function repairLegacyGraph(text, requestUrl) {
  if (text.length > SCHEMA_LIMIT) return text;
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

// work/ask-distribution-release-20261003/speech-site/deployment/sunshine-recovery-routes.mjs
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
function sunshineRedirect(request) {
  const u = new URL(request.url);
  if (!["GET", "HEAD"].includes(request.method) || u.hostname !== "www.pinnacleblooms.org" || request.headers.has("authorization") || request.headers.has("range")) return null;
  const target = recoveryPath(u.pathname);
  if (!target) return null;
  u.pathname = target;
  return Response.redirect(u.href, 301);
}

// work/ask-distribution-release-20261003/speech-site/deployment/centre-canonical-paths.mjs
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

// work/ask-distribution-release-20261003/speech-site/deployment/public-link-target.mjs
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

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/reading-directory.mjs
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

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/performance.mjs
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

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/priority-content.mjs
var HAND_FLAPPING_PATH = "/c/hand-flapping-therapy";
var HAND_FLAPPING_TITLE = "Hand Flapping in Children: Meaning & Support | Pinnacle Blooms";
var HAND_FLAPPING_HEADING = "Hand flapping in children: what it means and when support helps";
var HAND_FLAPPING_SUMMARY = "Hand flapping can express excitement or help a child regulate sensations and feelings. The movement alone does not diagnose autism or automatically need treatment. Pinnacle Blooms Network helps families discuss support when distress, safety or everyday participation is affected.";
var oldHeading = "Understanding and Managing Hand Flapping in Children | Pinnacle Blooms Network";
var oldSummary = "Hand flapping in children can significantly impact their ability to engage socially and perform daily tasks. Pinnacle Blooms Network provides comprehensive, personalized therapies to help children manage hand flapping and improve their quality of life.";
var guidance = `<section data-pinnacle-priority-content style="padding:24px 0;max-width:72ch;color:#242a2e;font:400 18px/1.65 system-ui,sans-serif"><h2 style="font-size:26px;line-height:1.25">Understand your child before choosing support</h2><p>Notice when the movement happens, what your child enjoys or finds difficult, and whether they are comfortable. Harmless stimming can serve a useful purpose. Support should address the child\u2019s needs rather than require them to hide a safe movement.</p><h2 style="font-size:26px;line-height:1.25">When should a family ask for help?</h2><p>Discuss pain, injury, distress, loss of skills or difficulties with communication, play, learning or everyday activities with an appropriately qualified professional. A sudden change or injury needs medical advice. Hand flapping alone cannot establish a diagnosis.</p><h2 style="font-size:26px;line-height:1.25">Connect the question to everyday life</h2><p>Pinnacle Blooms Network starts with the child\u2019s abilities and the family\u2019s priorities. Explore <a href="https://www.pinnacleblooms.org/occupational-therapy">occupational therapy</a>, <a href="https://pinnacleblooms.org/ask/is-stimming-always-a-bad-sign-that-must-be-stopped">the explanation of stimming</a> and <a href="https://www.pinnacleblooms.org/centers">your nearest Pinnacle centre</a>. Call <a href="tel:+919100181181">9100 181 181</a> to discuss the relevant professional, appointment and fees. The aim is useful participation and growing independence; support depends on the individual child.</p><p style="font-size:16px">Source: <a href="https://www.autism.org.uk/advice-and-guidance/about-autism/repeated-movements-and-behaviour-stimming">National Autistic Society: stimming and repetitive movements</a>. Page updated 8 October 2026. General information, not an individual assessment.</p></section>`;
async function repairPriorityContent(request, response) {
  const u = new URL(request.url);
  if (u.origin !== "https://www.pinnacleblooms.org" || u.pathname.replace(/\/$/, "") !== HAND_FLAPPING_PATH || request.method !== "GET" || request.headers.has("authorization") || request.headers.has("range") || response.status !== 200 || response.headers.has("set-cookie") || /noindex/i.test(response.headers.get("x-robots-tag") || "") || /no-store|no-transform/i.test(response.headers.get("cache-control") || "") || !/^text\/html/i.test(response.headers.get("content-type") || "")) return response;
  const body = await response.text();
  const headings = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const paragraphs = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].filter((m) => m[1].trim() === oldSummary);
  if (body.length > 1024 * 1024 || headings.length !== 1 || headings[0][1].trim() !== oldHeading || paragraphs.length !== 1 || !body.includes('rel="canonical" href="https://www.pinnacleblooms.org' + HAND_FLAPPING_PATH + '"')) return new Response(body, response);
  let changed = body.replace(headings[0][0], headings[0][0].replace(headings[0][1], HAND_FLAPPING_HEADING)).replace(paragraphs[0][0], '<p class="pinnacle-paragraph">' + HAND_FLAPPING_SUMMARY + "</p>" + guidance);
  const headers = new Headers(response.headers);
  for (const name of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(name);
  headers.set("x-pinnacle-priority-content", "20261008-hand-flapping");
  return new HTMLRewriter().on("head > title", { element(el) {
    el.setInnerContent(HAND_FLAPPING_TITLE);
  } }).on("head > meta", { element(el) {
    const name = (el.getAttribute("name") || el.getAttribute("property") || "").toLowerCase();
    if (["description", "og:description", "twitter:description"].includes(name)) el.setAttribute("content", HAND_FLAPPING_SUMMARY);
    if (["og:title", "twitter:title"].includes(name)) el.setAttribute("content", HAND_FLAPPING_TITLE);
  } }).transform(new Response(changed, { status: response.status, statusText: response.statusText, headers }));
}

// work/ask-distribution-release-20261003/speech-site/deployment/legacy-social-metadata/entry.mjs
var RELEASE = "legacy-social-https-20261004";
var HEAD_LIMIT = 64 * 1024;
var ADDITIONAL_LEGACY_PATHS = ["/therapeuticai-effectiveness-study", "/allmirracles", "/yoga-therapy", "/teachertraining", "/teacher-training", "/staff", "/careers", "/dance-therapy", "/certified-courses", "/certifiedcourses", "/courses/466/Afraid", "/courses/466/afraid"];
var ADDITIONAL_LEGACY_ROUTES = ["www.pinnacleblooms.org/t/*", "www.pinnacleblooms.org/mirracles/*", ...ADDITIONAL_LEGACY_PATHS.map((p) => "www.pinnacleblooms.org" + p + "*")];
var encoder = new TextEncoder();
var transformedResponses = /* @__PURE__ */ new WeakSet();
var TRACKING_PARAMETERS = /* @__PURE__ */ new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "utm_source_platform", "utm_creative_format", "utm_marketing_tactic", "gclid", "dclid", "msclkid", "fbclid", "gbraid", "wbraid"]);
var metadataUrl = (value) => value.replace(/&(?:amp|#0*38|#x0*26);/gi, "&");
function isEligible(request) {
  const url = new URL(request.url);
  return request.method === "GET" && url.protocol === "https:" && url.hostname === "www.pinnacleblooms.org" && (url.pathname === "/faq" || url.pathname.startsWith("/faq/") || /^\/(?:t|c|ma|b|m|a|abs|abilities|skills)\/[^/]+\/?$/.test(url.pathname) || /^\/(?:mirracles|guru)\/\d+\/(?:[^/]+\/?)?$/.test(url.pathname) || /^\/staff\/[^/]+\/\d+\/?$/.test(url.pathname) || ADDITIONAL_LEGACY_PATHS.includes(url.pathname.replace(/\/$/, "")) || ["/physiotherapy", "/physiotherapy/", SERVICES_PATH, SERVICES_PATH + "/"].includes(url.pathname)) && !request.headers.has("authorization") && !request.headers.has("range");
}
function concatenate(parts) {
  const bytes = new Uint8Array(parts.reduce((n, part) => n + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return bytes;
}
function resumedBody(parts, reader) {
  return new ReadableStream({
    async pull(controller) {
      if (parts.length) {
        controller.enqueue(parts.shift());
        return;
      }
      try {
        const { done, value } = await reader.read();
        if (done) {
          reader.releaseLock();
          controller.close();
        } else controller.enqueue(value);
      } catch (error) {
        reader.releaseLock();
        controller.error(error);
      }
    },
    async cancel(reason) {
      try {
        await reader.cancel(reason);
      } finally {
        reader.releaseLock();
      }
    }
  });
}
async function repairHead(head, request) {
  const canonical2 = [], social = [], robots = [];
  await new HTMLRewriter().on("head > link", { element(el) {
    if ((el.getAttribute("rel") || "").toLowerCase().split(/\s+/).includes("canonical")) canonical2.push(el.getAttribute("href"));
  } }).on("head > meta", { element(el) {
    if ((el.getAttribute("property") || "").toLowerCase() === "og:url") social.push(el.getAttribute("content"));
    if (["robots", "googlebot"].includes((el.getAttribute("name") || "").toLowerCase())) robots.push(el.getAttribute("content") || "");
  } }).transform(new Response(head)).text();
  if (canonical2.length !== 1 || social.length !== 1 || robots.some((v) => /noindex/i.test(v))) return null;
  const observedTarget = metadataUrl(canonical2[0]), previous = metadataUrl(social[0]);
  let target = observedTarget;
  const requestUrl = new URL(request.url);
  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return null;
  }
  if (parsed.search) {
    if (parsed.search !== requestUrl.search || ![...requestUrl.searchParams.keys()].every((key) => TRACKING_PARAMETERS.has(key))) return null;
    parsed.search = "";
    target = parsed.href;
  }
  if (requestUrl.pathname.replace(/\/$/, "") === SERVICES_PATH && target === "https://books.pinnacleblooms.org" + SERVICES_PATH && previous === observedTarget.replace(/^https:/, "http:")) {
    return new HTMLRewriter().on("head > link", { element(el) {
      if ((el.getAttribute("rel") || "").toLowerCase().split(/\s+/).includes("canonical")) el.setAttribute("href", SERVICES_URL);
    } }).on("head > meta", { element(el) {
      if ((el.getAttribute("property") || "").toLowerCase() === "og:url") el.setAttribute("content", SERVICES_URL);
    } }).transform(new Response(head)).text();
  }
  const samePath = parsed.pathname.replace(/\/$/, "") === requestUrl.pathname.replace(/\/$/, "");
  const sameMirracle = /^\/(?:mirracles|guru)\/\d+\/(?:[^/]+\/?)?$/.test(requestUrl.pathname) && parsed.pathname.replace(/\/$/, "").toLowerCase() === requestUrl.pathname.replace(/\/$/, "").toLowerCase();
  let sameNumericSocial = false;
  if (sameMirracle) {
    try {
      const p = new URL(previous);
      sameNumericSocial = ["http:", "https:"].includes(p.protocol) && p.hostname === parsed.hostname && !p.port && !p.username && !p.password && !p.search && !p.hash && p.pathname.replace(/\/$/, "").toLowerCase() === parsed.pathname.replace(/\/$/, "").toLowerCase();
      if (sameNumericSocial && ![observedTarget, observedTarget.replace(/^https:/, "http:")].includes(previous)) {
        parsed.pathname = parsed.pathname.toLowerCase();
        target = parsed.href;
      }
    } catch {
    }
  }
  const sameRecordedCourse = requestUrl.pathname.replace(/\/$/, "") === "/courses/466/Afraid" && parsed.pathname === "/courses/466/afraid";
  const sameStaff = /^\/staff\/[^/]+\/\d+\/?$/.test(requestUrl.pathname) && parsed.pathname.replace(/\/$/, "") === requestUrl.pathname.replace(/\/$/, "").toLowerCase();
  if (parsed.protocol !== "https:" || parsed.hostname !== "www.pinnacleblooms.org" || parsed.port || parsed.username || parsed.password || parsed.search || parsed.hash || !(samePath || sameMirracle || sameRecordedCourse || sameStaff) || !sameNumericSocial && ![observedTarget, observedTarget.replace(/^https:/, "http:")].includes(previous)) return null;
  if (previous === target && observedTarget === target) return head;
  return new HTMLRewriter().on("head > link", { element(el) {
    if ((el.getAttribute("rel") || "").toLowerCase().split(/\s+/).includes("canonical")) el.setAttribute("href", target);
  } }).on("head > meta", { element(el) {
    if ((el.getAttribute("property") || "").toLowerCase() === "og:url" && metadataUrl(el.getAttribute("content") || "") === previous) el.setAttribute("content", target);
  } }).transform(new Response(head)).text();
}
async function transform(request, response) {
  if (!isEligible(request) || response.status !== 200 || !response.body || !/^text\/html(?:\s*;|$)/i.test(response.headers.get("content-type") || "") || /charset\s*=\s*(?!utf-8(?:\s|;|$))/i.test(response.headers.get("content-type") || "") || response.headers.has("set-cookie") || /noindex/i.test(response.headers.get("x-robots-tag") || "") || /no-store|no-transform/i.test(response.headers.get("cache-control") || "")) return response;
  const reader = response.body.getReader(), parts = [];
  let size = 0, headEnd = 0, combined;
  while (size < HEAD_LIMIT) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    size += value.length;
    combined = concatenate(parts);
    const probe = new TextDecoder().decode(combined.subarray(0, HEAD_LIMIT));
    const close = /<\/head\s*>/i.exec(probe);
    if (close) {
      headEnd = encoder.encode(probe.slice(0, close.index + close[0].length)).length;
      break;
    }
  }
  let replacement = null, originalHead = null;
  const hasBom = combined?.[0] === 239 && combined?.[1] === 187 && combined?.[2] === 191;
  if (headEnd && !hasBom) {
    try {
      const head = new TextDecoder("utf-8", { fatal: true }).decode(combined.subarray(0, headEnd));
      originalHead = head;
      replacement = await repairHead(head, request);
    } catch {
    }
  }
  const headers = new Headers(response.headers);
  let output = parts;
  if (replacement !== null) {
    output = [encoder.encode(replacement), combined.subarray(headEnd)];
    for (const name of ["content-length", "content-encoding", "etag", "last-modified", "content-md5", "digest"]) headers.delete(name);
    if (replacement !== originalHead) headers.set("x-pinnacle-social-metadata", RELEASE);
  }
  const result = new Response(resumedBody(output, reader), { status: response.status, statusText: response.statusText, headers });
  if (replacement !== null) transformedResponses.add(result);
  return result;
}
async function handle(request, fetcher = fetchPublicOrigin) {
  const redirect = sunshineRedirect(request) || staffRoute(request) || physiotherapyRedirect(request);
  if (redirect) return redirect;
  if (request.method === "GET" && new URL(request.url).origin + new URL(request.url).pathname === "https://www.pinnacleblooms.org/franchise-autism-therapy-center" && !request.headers.has("authorization") && !request.headers.has("range")) {
    const headers2 = new Headers(request.headers);
    headers2.delete("if-none-match");
    headers2.delete("if-modified-since");
    return repairFranchiseCanonical(request, await fetcher(new Request(request, { headers: headers2 })));
  }
  if (!isEligible(request)) return fetcher(request);
  const headers = new Headers(request.headers);
  headers.delete("if-none-match");
  headers.delete("if-modified-since");
  const upstream = new Request(request, { headers });
  const response = await transform(request, await fetcher(upstream));
  return transformedResponses.has(response) ? repairPriorityContent(request, repairKnownLegacyPerformance(repairPublicLinks(repairKnownBrokenMedia(repairKnownLegacySchema(repairServiceLinks(request, reduceKnownLegacyPayload(request, response)), request.url))), request)) : response;
}
var entry_default = { fetch: (request) => handle(request) };
export {
  ADDITIONAL_LEGACY_PATHS,
  ADDITIONAL_LEGACY_ROUTES,
  HEAD_LIMIT,
  RELEASE,
  entry_default as default,
  handle,
  isEligible,
  transform
};
