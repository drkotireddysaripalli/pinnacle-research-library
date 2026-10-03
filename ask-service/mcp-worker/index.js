var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/util.js
function envStr(env, key, dflt = "") {
  const v = env ? env[key] : void 0;
  return v === void 0 || v === null || v === "" ? dflt : String(v);
}
__name(envStr, "envStr");
function envInt(env, key, dflt) {
  const n = parseInt(envStr(env, key, ""), 10);
  return Number.isFinite(n) ? n : dflt;
}
__name(envInt, "envInt");
function envBool(env, key, dflt = false) {
  const v = envStr(env, key, "").toLowerCase();
  if (["1", "true", "yes", "on"].includes(v)) return true;
  if (["0", "false", "no", "off"].includes(v)) return false;
  return dflt;
}
__name(envBool, "envBool");
function serverInfo(env) {
  return {
    name: envStr(env, "SERVICE_NAME", "pinnacle-ask"),
    title: "Pinnacle Ask \u2014 Child Development Knowledge (Pinnacle Blooms Network)",
    version: envStr(env, "SERVICE_VERSION", "1.0.0")
  };
}
__name(serverInfo, "serverInfo");
function brandIcons(origin) {
  return [
    { src: `${origin}/emblem.png`, mimeType: "image/png", sizes: ["512x512"] },
    { src: `${origin}/favicon.png`, mimeType: "image/png", sizes: ["64x64"] }
  ];
}
__name(brandIcons, "brandIcons");
function jsonResponse(data, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers }
  });
}
__name(jsonResponse, "jsonResponse");
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  const keys = Object.keys(value).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
}
__name(stableStringify, "stableStringify");
async function sha256Hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(sha256Hex, "sha256Hex");
function clampInt(v, min, max, dflt) {
  if (v === void 0 || v === null || v === "") return dflt;
  const n = Math.trunc(Number(v));
  if (!Number.isFinite(n)) return dflt;
  return Math.min(max, Math.max(min, n));
}
__name(clampInt, "clampInt");
function intOrNull(v, min = 0, max = 1e6) {
  if (v === void 0 || v === null || v === "") return null;
  const n = Math.trunc(Number(v));
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}
__name(intOrNull, "intOrNull");
function strOrNull(v) {
  if (v === void 0 || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}
__name(strOrNull, "strOrNull");
function canonicalUrl(env, pathOrSlug) {
  if (!pathOrSlug) return null;
  const base = envStr(env, "CANONICAL_BASE", "https://pinnacleblooms.org").replace(/\/+$/, "");
  const prefix = envStr(env, "ASK_PREFIX", "/ask").replace(/\/+$/, "");
  const p = String(pathOrSlug).trim();
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("/")) return base + p;
  return `${base}${prefix}/${p.replace(/^\/+/, "")}`;
}
__name(canonicalUrl, "canonicalUrl");
function normalizeSlug(env, id) {
  if (id === void 0 || id === null) return null;
  let s = String(id).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) {
    try {
      s = new URL(s).pathname;
    } catch {
    }
  }
  const prefix = envStr(env, "ASK_PREFIX", "/ask").replace(/\/+$/, "");
  if (prefix && s.startsWith(prefix + "/")) s = s.slice(prefix.length + 1);
  s = s.replace(/^\/+|\/+$/g, "");
  return s.length ? s : null;
}
__name(normalizeSlug, "normalizeSlug");
var BLOCKED_KEY_PATTERNS = [
  /abilityscore/i,
  /ability_score/i,
  /score_band/i,
  /value_score/i,
  /(^|_)wt$/i,
  /weight/i,
  /formula/i,
  /coefficient/i,
  /embedding/i,
  /search_tsv/i,
  /^internal/i,
  /^gen_/i,
  /^gate_/i,
  /^_/
];
function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (BLOCKED_KEY_PATTERNS.some((re) => re.test(k))) continue;
      out[k] = sanitize(v);
    }
    return out;
  }
  return value;
}
__name(sanitize, "sanitize");
function withCanonicals(env, value, depth = 0) {
  if (depth > 6 || value === null || value === void 0) return value;
  if (Array.isArray(value)) return value.map((v) => withCanonicals(env, v, depth + 1));
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = withCanonicals(env, v, depth + 1);
    if (!out.url && (out.full_url || out.canonical_path || out.slug)) {
      const u = canonicalUrl(env, out.full_url || out.canonical_path || out.slug);
      if (u) out.url = u;
    }
    return out;
  }
  return value;
}
__name(withCanonicals, "withCanonicals");

// src/logging.js
var LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
function createLogger(env, base = {}) {
  const min = LEVELS[envStr(env, "LOG_LEVEL", "info").toLowerCase()] ?? LEVELS.info;
  const info = serverInfo(env);
  const emit = /* @__PURE__ */ __name((level, event, fields = {}) => {
    if ((LEVELS[level] ?? LEVELS.info) < min) return;
    const line = JSON.stringify({
      ts: (/* @__PURE__ */ new Date()).toISOString(),
      level,
      service: info.name,
      version: info.version,
      event,
      ...base,
      ...fields
    });
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
  }, "emit");
  return {
    debug: /* @__PURE__ */ __name((event, fields) => emit("debug", event, fields), "debug"),
    info: /* @__PURE__ */ __name((event, fields) => emit("info", event, fields), "info"),
    warn: /* @__PURE__ */ __name((event, fields) => emit("warn", event, fields), "warn"),
    error: /* @__PURE__ */ __name((event, fields) => emit("error", event, fields), "error"),
    child: /* @__PURE__ */ __name((extra) => createLogger(env, { ...base, ...extra }), "child")
  };
}
__name(createLogger, "createLogger");

// src/cache.js
async function cachedRpc({ env, ctx, log, client, fn, args, ttl }) {
  const enabled = envBool(env, "CACHE_ENABLED", true) && typeof caches !== "undefined";
  if (!enabled || !ttl || !(ttl.fresh > 0)) {
    return { data: await client.call(fn, args), cache: "bypass" };
  }
  const cache = caches.default;
  const key = await cacheKey(fn, args);
  const hit = await cache.match(key).catch(() => null);
  if (hit) {
    const storedAt = Number(hit.headers.get("x-stored-at") || 0);
    const ageSec = storedAt ? (Date.now() - storedAt) / 1e3 : Infinity;
    let payload;
    let parsed = false;
    try {
      payload = await hit.json();
      parsed = true;
    } catch {
      parsed = false;
    }
    if (parsed) {
      if (ageSec <= ttl.fresh) {
        log?.debug("cache_hit", { fn, ageSec: Math.round(ageSec) });
        return { data: payload, cache: "hit" };
      }
      if (ageSec <= ttl.fresh + ttl.stale) {
        log?.debug("cache_stale_serve", { fn, ageSec: Math.round(ageSec) });
        ctx?.waitUntil?.(revalidate({ cache, key, client, fn, args, ttl, log }));
        return { data: payload, cache: "stale" };
      }
    }
  }
  const data = await client.call(fn, args);
  ctx?.waitUntil?.(store(cache, key, data, ttl).catch(() => {
  }));
  return { data, cache: hit ? "expired" : "miss" };
}
__name(cachedRpc, "cachedRpc");
async function revalidate({ cache, key, client, fn, args, ttl, log }) {
  try {
    const data = await client.call(fn, args);
    await store(cache, key, data, ttl);
    log?.debug("cache_revalidated", { fn });
  } catch (e) {
    log?.warn("cache_revalidate_failed", { fn, message: e && e.message ? e.message : String(e) });
  }
}
__name(revalidate, "revalidate");
async function store(cache, key, data, ttl) {
  const res = new Response(JSON.stringify(data === void 0 ? null : data), {
    headers: {
      "content-type": "application/json",
      "cache-control": `public, max-age=${ttl.fresh + ttl.stale}`,
      "x-stored-at": String(Date.now())
    }
  });
  await cache.put(key, res);
}
__name(store, "store");
async function cacheKey(fn, args) {
  const hash = await sha256Hex(stableStringify(args || {}));
  return new Request(`https://cache.pinnacle-ask.internal/v20261003/${encodeURIComponent(fn)}/${hash}`, { method: "GET" });
}
__name(cacheKey, "cacheKey");

// src/embed.js
var EMBED_TIMEOUT_MS = 4e3;
async function maybeEmbedQuery(env, log, text) {
  const provider = envStr(env, "QUERY_EMBEDDINGS", "off").toLowerCase();
  if (!provider || provider === "off" || provider === "none" || provider === "false") return null;
  if (provider !== "openai") {
    log?.warn("embed_provider_unsupported", { provider });
    return null;
  }
  const apiKey = envStr(env, "OPENAI_API_KEY");
  if (!apiKey) {
    log?.warn("embed_key_missing", { hint: "wrangler secret put OPENAI_API_KEY" });
    return null;
  }
  const model = envStr(env, "EMBEDDINGS_MODEL", "text-embedding-3-small");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), EMBED_TIMEOUT_MS);
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, input: String(text).slice(0, 2e3) }),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) {
      log?.warn("embed_http_error", { status: res.status });
      return null;
    }
    const data = await res.json();
    const vec = data && data.data && data.data[0] && data.data[0].embedding;
    if (!Array.isArray(vec) || vec.length === 0) return null;
    return `[${vec.join(",")}]`;
  } catch (e) {
    clearTimeout(timer);
    log?.warn("embed_failed", { message: e && e.message ? e.message : String(e) });
    return null;
  }
}
__name(maybeEmbedQuery, "maybeEmbedQuery");

// src/supabase.js
var RpcError = class extends Error {
  static {
    __name(this, "RpcError");
  }
  constructor(message, { status = 0, code = "", fn = "", retryable = false } = {}) {
    super(message);
    this.name = "RpcError";
    this.status = status;
    this.code = code;
    this.fn = fn;
    this.retryable = retryable;
  }
};
var SupabaseRpc = class {
  static {
    __name(this, "SupabaseRpc");
  }
  constructor(env, log) {
    this.base = envStr(env, "SUPABASE_URL").replace(/\/+$/, "");
    this.key = envStr(env, "SUPABASE_PUBLISHABLE_KEY");
    this.timeoutMs = Math.max(1e3, envInt(env, "RPC_TIMEOUT_MS", 8e3));
    this.retries = Math.max(0, envInt(env, "RPC_RETRIES", 2));
    this.log = log;
  }
  async call(fn, args = {}) {
    if (!this.base || !this.key) {
      throw new RpcError("Supabase configuration missing (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY)", { fn });
    }
    const url = `${this.base}/rest/v1/rpc/${fn}`;
    let lastErr = null;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      if (attempt > 0) await sleep(backoffMs(attempt - 1));
      const started = Date.now();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort("timeout"), this.timeoutMs);
      let res = null;
      try {
        res = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
            apikey: this.key,
            authorization: `Bearer ${this.key}`
          },
          body: JSON.stringify(args),
          signal: controller.signal
        });
      } catch (e) {
        clearTimeout(timer);
        lastErr = new RpcError(
          `Supabase RPC ${fn} network/timeout: ${e && e.message ? e.message : String(e)}`,
          { fn, retryable: true }
        );
        this.log?.warn("rpc_network_error", { fn, attempt, durationMs: Date.now() - started, message: lastErr.message });
        continue;
      }
      clearTimeout(timer);
      const durationMs = Date.now() - started;
      if (res.ok) {
        this.log?.debug("rpc_ok", { fn, status: res.status, durationMs, attempt });
        if (res.status === 204) return null;
        const text = await res.text();
        if (!text) return null;
        try {
          return JSON.parse(text);
        } catch {
          throw new RpcError(`Supabase RPC ${fn} returned a non-JSON payload`, { fn, status: res.status });
        }
      }
      const bodyText = await res.text().catch(() => "");
      const retryable = res.status >= 500 || res.status === 408 || res.status === 429;
      lastErr = new RpcError(`Supabase RPC ${fn} failed (HTTP ${res.status})`, {
        status: res.status,
        fn,
        retryable,
        code: extractCode(bodyText)
      });
      this.log?.warn("rpc_http_error", {
        fn,
        status: res.status,
        durationMs,
        attempt,
        retryable,
        detail: bodyText.slice(0, 240)
      });
      if (!retryable) break;
    }
    throw lastErr || new RpcError(`Supabase RPC ${fn} failed`, { fn });
  }
};
function extractCode(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed && parsed.code || "";
  } catch {
    return "";
  }
}
__name(extractCode, "extractCode");
function backoffMs(priorAttempts) {
  const base = Math.min(2e3, 250 * 2 ** priorAttempts);
  return base + Math.floor(Math.random() * 150);
}
__name(backoffMs, "backoffMs");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
__name(sleep, "sleep");

// src/tools.js
var NON_DIAGNOSTIC = "Educational developmental information from Pinnacle Blooms Network\xAE (PinnacleAI GPT-OS; generic name: Developmental Support Software \u2014 Non-Diagnostic; CDSCO Class B SaMD). This is not a medical diagnosis, prescription, or treatment plan. For concerns about a specific child, consult a qualified professional or contact care@pinnacleblooms.org.";
var SOURCE = "pinnacleblooms.org/ask";
var TTL = {
  search: { fresh: 900, stale: 7200 },
  answer: { fresh: 3600, stale: 86400 },
  browse: { fresh: 21600, stale: 86400 },
  list: { fresh: 3600, stale: 21600 }
};
var ToolInputError = class extends Error {
  static {
    __name(this, "ToolInputError");
  }
  constructor(message) {
    super(message);
    this.name = "ToolInputError";
  }
};
var TOOLS = {
  // -- ChatGPT-native pair ---------------------------------------------------
  search: {
    description: "Search the Pinnacle Ask child-development knowledge corpus (pinnacleblooms.org/ask) \u2014 real parent questions with clinically grounded, non-diagnostic answers covering speech, motor, social, cognitive, sensory, feeding and behavioural development from birth to 18 years. Returns ranked results with ids; pass a result id to `fetch` for the full answer. Optionally filter by child age in months and/or developmental domain.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Natural-language question or topic, e.g. 'my 2 year old is not talking'." },
        age_months: { type: "integer", description: "Optional child age in months (0\u2013216) to bias results.", minimum: 0, maximum: 216 },
        domain: { type: "string", description: "Optional developmental domain filter, e.g. 'speech', 'motor', 'social'." },
        limit: { type: "integer", description: "Max results (1\u201325, default 10).", minimum: 1, maximum: 25 }
      },
      required: ["query"],
      additionalProperties: false
    },
    async run({ env, ctx, log, client, args }) {
      const query = strOrNull(args.query);
      if (!query) throw new ToolInputError("`query` is required and must be a non-empty string.");
      const limit = clampInt(args.limit, 1, 25, 10);
      const embedding = await maybeEmbedQuery(env, log, query);
      const { data } = await cachedRpc({
        env,
        ctx,
        log,
        client,
        fn: "ask_find",
        args: {
          p_q: query,
          p_k: limit,
          p_embedding: embedding,
          // null → lexical path inside the locked RPC
          p_age_months: intOrNull(args.age_months, 0, 216),
          p_domain: strOrNull(args.domain)
        },
        ttl: embedding ? null : TTL.search
        // embedded queries bypass cache (vector varies)
      });
      const items = extractItems(data);
      const results = items.map((raw) => {
        const it = sanitize(raw) || {};
        const id = it.slug || it.id || null;
        return {
          id,
          title: it.title || it.h1 || it.question || id,
          url: canonicalUrl(env, it.full_url || it.canonical_path || id),
          snippet: it.summary || it.snippet || it.meta_description || null,
          age_band: it.age_band || it.age_band_key || null,
          domain: it.primary_domain || it.domain || null
        };
      }).filter((r) => r.id);
      return {
        results,
        query,
        total: results.length,
        source: SOURCE,
        note: NON_DIAGNOSTIC,
        // Spliced into MCP resource_link content blocks by executeTool —
        // gives clients stable ask:// handles for follow-up reads.
        resource_links: results.slice(0, 5).map((r) => ({
          type: "resource_link",
          uri: `ask://answer/${r.id}`,
          name: r.title || r.id,
          ...r.snippet ? { description: String(r.snippet).slice(0, 200) } : {},
          mimeType: "text/markdown"
        }))
      };
    }
  },
  fetch: {
    description: "Fetch the full published answer for a Pinnacle Ask result. `id` accepts a slug from `search`, an /ask path, or a full pinnacleblooms.org/ask URL. Returns the complete answer document (markdown), Everyday Therapy\u2122 tip, what-to-watch guidance, FAQs, and the canonical URL to cite.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Result id \u2014 slug, /ask path, or full URL." }
      },
      required: ["id"],
      additionalProperties: false
    },
    async run({ env, ctx, log, client, args }) {
      const slug = normalizeSlug(env, args.id);
      if (!slug) throw new ToolInputError("`id` is required \u2014 pass a slug returned by `search`.");
      const { data } = await cachedRpc({
        env,
        ctx,
        log,
        client,
        fn: "ask_answer",
        args: { p_slug: slug },
        ttl: TTL.answer
      });
      const doc = sanitize(unwrap(data));
      if (!doc || typeof doc !== "object" || Object.keys(doc).length === 0) {
        return {
          isErrorPayload: true,
          message: `No published answer found for id '${slug}'. Use \`search\` to find valid ids.`
        };
      }
      const url = canonicalUrl(env, doc.full_url || doc.canonical_path || doc.slug || slug);
      const text = composeAnswerText(doc);
      return {
        id: doc.slug || slug,
        title: doc.h1 || doc.title || doc.question || slug,
        text,
        url,
        metadata: {
          lang: doc.lang || "en",
          persona: doc.persona || null,
          route: doc.route || null,
          primary_domain: doc.primary_domain || null,
          last_reviewed_at: doc.last_reviewed_at || null,
          authority_links: doc.authority_links || null,
          breadcrumb: doc.breadcrumb || null,
          related: doc.related || doc.also_asked || null,
          disclaimer: NON_DIAGNOSTIC
        }
      };
    }
  },
  // -- Specialist tools --------------------------------------------------------
  milestones: {
    description: "Developmental milestones from the Pinnacle Ask corpus, optionally filtered by child age in months and developmental domain. Use to answer 'what should my child be doing at N months' style questions. Non-diagnostic.",
    inputSchema: {
      type: "object",
      properties: {
        age_months: { type: "integer", description: "Child age in months (0\u2013216). Strongly recommended.", minimum: 0, maximum: 216 },
        domain: { type: "string", description: "Optional domain filter, e.g. 'speech', 'motor', 'social'." },
        limit: { type: "integer", description: "Max items (1\u201325, default 12).", minimum: 1, maximum: 25 }
      },
      additionalProperties: false
    },
    run: /* @__PURE__ */ __name((c) => genericRpc(c, "ask_milestones", {
      p_age_months: intOrNull(c.args.age_months, 0, 216),
      p_domain: strOrNull(c.args.domain),
      p_k: clampInt(c.args.limit, 1, 25, 12)
    }, TTL.list, "milestones"), "run")
  },
  red_flags: {
    description: "Early warning signs ('what to watch') for a developmental topic, domain, and/or age in months \u2014 framed as guidance to seek professional evaluation, never as a diagnosis. Use when a caregiver asks whether a behaviour is concerning.",
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Optional topic, e.g. 'speech delay', 'autism'." },
        domain: { type: "string", description: "Optional domain filter." },
        age_months: { type: "integer", description: "Optional child age in months (0\u2013216).", minimum: 0, maximum: 216 },
        limit: { type: "integer", description: "Max items (1\u201325, default 12).", minimum: 1, maximum: 25 }
      },
      additionalProperties: false
    },
    run: /* @__PURE__ */ __name((c) => genericRpc(c, "ask_red_flags", {
      p_topic: strOrNull(c.args.topic),
      p_domain: strOrNull(c.args.domain),
      p_age_months: intOrNull(c.args.age_months, 0, 216),
      p_k: clampInt(c.args.limit, 1, 25, 12)
    }, TTL.list, "red_flags"), "run")
  },
  lookup_code: {
    description: "Look up Pinnacle Ask content by clinical/standards code \u2014 WHO ICF (e.g. 'b167'), ICD-11, ICHI, or SNOMED. Returns corpus entries crosswalked to that code. Useful for clinicians, researchers, and policy teams.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Standards code, e.g. 'b167' (ICF), '6A02' (ICD-11)." },
        limit: { type: "integer", description: "Max items (1\u201325, default 8).", minimum: 1, maximum: 25 }
      },
      required: ["code"],
      additionalProperties: false
    },
    run: /* @__PURE__ */ __name((c) => {
      const code = strOrNull(c.args.code);
      if (!code) throw new ToolInputError("`code` is required, e.g. 'b167'.");
      return genericRpc(c, "ask_by_code", {
        p_code: code,
        p_k: clampInt(c.args.limit, 1, 25, 8)
      }, TTL.list, "lookup_code");
    }, "run")
  },
  compare: {
    description: "Compare two developmental topics, conditions, or skills side by side (e.g. 'speech delay' vs 'autism'; 'speech therapy' vs 'occupational therapy'). Returns corpus-grounded points of similarity and difference. Non-diagnostic.",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "string", description: "First topic." },
        b: { type: "string", description: "Second topic." },
        limit: { type: "integer", description: "Max items per side (1\u201325, default 6).", minimum: 1, maximum: 25 }
      },
      required: ["a", "b"],
      additionalProperties: false
    },
    run: /* @__PURE__ */ __name((c) => {
      const a = strOrNull(c.args.a);
      const b = strOrNull(c.args.b);
      if (!a || !b) throw new ToolInputError("Both `a` and `b` are required.");
      return genericRpc(c, "ask_compare", {
        p_a: a,
        p_b: b,
        p_k: clampInt(c.args.limit, 1, 25, 6)
      }, TTL.list, "compare");
    }, "run")
  },
  pathway: {
    description: "Trace how a developmental topic or skill progresses across age stages \u2014 a staged pathway view (e.g. how 'speech' develops from babbling to sentences). Returns corpus entries grouped per stage.",
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Topic or skill, e.g. 'speech', 'walking', 'social play'." },
        per_stage: { type: "integer", description: "Items per stage (1\u201310, default 5).", minimum: 1, maximum: 10 }
      },
      required: ["topic"],
      additionalProperties: false
    },
    run: /* @__PURE__ */ __name((c) => {
      const topic = strOrNull(c.args.topic);
      if (!topic) throw new ToolInputError("`topic` is required.");
      return genericRpc(c, "ask_pathway", {
        p_topic: topic,
        p_k_per: clampInt(c.args.per_stage, 1, 10, 5)
      }, TTL.list, "pathway");
    }, "run")
  },
  topic: {
    description: "Curated hub of Pinnacle Ask content for one value of a taxonomy: kind \u2208 persona | route | domain | condition | age-band, plus the value (e.g. kind='condition', value='autism'). Use `browse` first to discover valid values.",
    inputSchema: {
      type: "object",
      properties: {
        kind: { type: "string", description: "Taxonomy kind: persona, route, domain, condition, or age-band.", enum: ["persona", "route", "domain", "condition", "age-band"] },
        value: { type: "string", description: "Value within the kind, e.g. 'speech' for domain." },
        limit: { type: "integer", description: "Max items (1\u201325, default 10).", minimum: 1, maximum: 25 }
      },
      required: ["kind", "value"],
      additionalProperties: false
    },
    run: /* @__PURE__ */ __name((c) => {
      const kind = strOrNull(c.args.kind);
      const value = strOrNull(c.args.value);
      if (!kind || !value) throw new ToolInputError("`kind` and `value` are both required. Use `browse` to discover valid values.");
      return genericRpc(c, "ask_topic", {
        p_kind: kind.toLowerCase(),
        p_value: value,
        p_k: clampInt(c.args.limit, 1, 25, 10)
      }, TTL.list, "topic");
    }, "run")
  },
  browse: {
    description: "List the available values for one taxonomy kind across the corpus: persona, route, domain, condition, or age-band. Use this to discover what can be passed to `topic`.",
    inputSchema: {
      type: "object",
      properties: {
        kind: { type: "string", description: "Taxonomy kind to enumerate.", enum: ["persona", "route", "domain", "condition", "age-band"] }
      },
      required: ["kind"],
      additionalProperties: false
    },
    run: /* @__PURE__ */ __name((c) => {
      const kind = strOrNull(c.args.kind);
      if (!kind) throw new ToolInputError("`kind` is required: persona, route, domain, condition, or age-band.");
      return genericRpc(c, "ask_browse", { p_kind: kind.toLowerCase() }, TTL.browse, "browse");
    }, "run")
  },
  related: {
    description: "Questions and answers related to a given Pinnacle Ask entry \u2014 the interlinked query graph around one id. `id` accepts a slug, /ask path, or full URL.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Anchor entry \u2014 slug, /ask path, or full URL." },
        limit: { type: "integer", description: "Max items (1\u201325, default 8).", minimum: 1, maximum: 25 }
      },
      required: ["id"],
      additionalProperties: false
    },
    run: /* @__PURE__ */ __name((c) => {
      const slug = normalizeSlug(c.env, c.args.id);
      if (!slug) throw new ToolInputError("`id` is required \u2014 pass a slug returned by `search`.");
      return genericRpc(c, "ask_related", {
        p_slug: slug,
        p_k: clampInt(c.args.limit, 1, 25, 8)
      }, TTL.list, "related");
    }, "run")
  },
  home: {
    description: "Overview of the Pinnacle Ask knowledge layer: featured content, corpus statistics, and entry points. Takes no arguments. Good first call to orient before searching.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: /* @__PURE__ */ __name((c) => genericRpc(c, "ask_home", {}, TTL.browse, "home"), "run")
  }
};
async function genericRpc({ env, ctx, log, client }, fn, rpcArgs, ttl, toolName) {
  const { data } = await cachedRpc({ env, ctx, log, client, fn, args: rpcArgs, ttl });
  return {
    tool: toolName,
    data: withCanonicals(env, sanitize(unwrap(data))),
    disclaimer: NON_DIAGNOSTIC,
    source: SOURCE
  };
}
__name(genericRpc, "genericRpc");
function unwrap(data) {
  if (Array.isArray(data) && data.length === 1 && data[0] && typeof data[0] === "object") return data[0];
  return data;
}
__name(unwrap, "unwrap");
function extractItems(data) {
  const d = unwrap(data);
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") {
    for (const k of ["results", "items", "hits", "rows", "data"]) {
      if (Array.isArray(d[k])) return d[k];
    }
  }
  return [];
}
__name(extractItems, "extractItems");
function composeAnswerText(doc) {
  const parts = [];
  const heading = doc.h1 || doc.title || doc.question;
  if (heading) parts.push(`# ${heading}`);
  if (doc.question && doc.question !== heading) parts.push(`**Question:** ${doc.question}`);
  if (doc.summary) parts.push(String(doc.summary));
  if (doc.answer_md) parts.push(String(doc.answer_md));
  if (doc.everyday_tip) parts.push(`**Everyday Therapy\u2122 tip:** ${doc.everyday_tip}`);
  if (doc.what_to_watch) parts.push(`**What to watch:** ${doc.what_to_watch}`);
  const faq = Array.isArray(doc.faq) ? doc.faq : [];
  if (faq.length) {
    const lines = ["## Frequently asked"];
    for (const f of faq) {
      if (!f) continue;
      const q = f.q || f.question;
      const a = f.a || f.answer;
      if (q) lines.push(`**Q: ${q}**`);
      if (a) lines.push(`A: ${a}`);
    }
    parts.push(lines.join("\n\n"));
  }
  parts.push("---\n" + NON_DIAGNOSTIC);
  return parts.join("\n\n");
}
__name(composeAnswerText, "composeAnswerText");
var SEARCH_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: ["string", "null"] },
          url: { type: ["string", "null"] },
          snippet: { type: ["string", "null"] },
          age_band: { type: ["string", "null"] },
          domain: { type: ["string", "null"] }
        },
        required: ["id"],
        additionalProperties: false
      }
    },
    query: { type: "string" },
    total: { type: "integer" },
    source: { type: "string" },
    note: { type: "string" }
  },
  required: ["results", "query", "total", "source", "note"],
  additionalProperties: false
};
var FETCH_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: ["string", "null"] },
    text: { type: "string" },
    url: { type: ["string", "null"] },
    metadata: { type: "object", additionalProperties: true }
  },
  required: ["id", "text"],
  additionalProperties: false
};
var GENERIC_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    tool: { type: "string" },
    data: { description: "Sanitised jsonb projection from the locked ask_* RPC layer." },
    disclaimer: { type: "string" },
    source: { type: "string" }
  },
  required: ["tool", "disclaimer", "source"],
  additionalProperties: false
};
var OUTPUT_SCHEMAS = { search: SEARCH_OUTPUT_SCHEMA, fetch: FETCH_OUTPUT_SCHEMA };
function toolDefinitions(origin) {
  return Object.entries(TOOLS).map(([name, t]) => ({
    name,
    description: t.description,
    inputSchema: t.inputSchema,
    outputSchema: OUTPUT_SCHEMAS[name] || GENERIC_OUTPUT_SCHEMA,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    },
    ...origin ? { icons: brandIcons(origin) } : {}
  }));
}
__name(toolDefinitions, "toolDefinitions");
async function executeTool({ env, ctx, log, client, name, args }) {
  const tool = TOOLS[name];
  if (!tool) {
    return {
      jsonRpcError: {
        code: -32602,
        message: `Unknown tool '${name}'. Available: ${Object.keys(TOOLS).join(", ")}.`
      }
    };
  }
  const started = Date.now();
  try {
    const payload = await tool.run({ env, ctx, log, client, args: args || {} });
    const durationMs = Date.now() - started;
    if (payload && payload.isErrorPayload) {
      log?.info("tool_soft_error", { tool: name, durationMs });
      return toolResult({ error: "not_found", message: payload.message }, true);
    }
    log?.info("tool_ok", { tool: name, durationMs });
    return toolResult(payload, false);
  } catch (e) {
    const durationMs = Date.now() - started;
    if (e instanceof ToolInputError) {
      log?.info("tool_input_error", { tool: name, durationMs, message: e.message });
      return toolResult({ error: "invalid_input", message: e.message }, true);
    }
    if (e instanceof RpcError) {
      log?.error("tool_upstream_error", { tool: name, durationMs, status: e.status, fn: e.fn });
      return toolResult({
        error: "upstream_error",
        message: `Knowledge layer temporarily unavailable (${e.fn || "rpc"}${e.status ? `, HTTP ${e.status}` : ""}). ${e.retryable ? "Retry shortly." : "Check arguments and try again."}`
      }, true);
    }
    log?.error("tool_unexpected_error", { tool: name, durationMs, message: e && e.message ? e.message : String(e) });
    return toolResult({ error: "internal_error", message: "Unexpected error executing tool." }, true);
  }
}
__name(executeTool, "executeTool");
function toolResult(payload, isError) {
  if (isError) {
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      isError: true
    };
  }
  let links = [];
  if (payload && Array.isArray(payload.resource_links)) {
    links = payload.resource_links;
    delete payload.resource_links;
  }
  return {
    content: [{ type: "text", text: JSON.stringify(payload) }, ...links],
    structuredContent: payload,
    isError: false
  };
}
__name(toolResult, "toolResult");

// src/prompts.js
var PromptInputError = class extends Error {
  static {
    __name(this, "PromptInputError");
  }
  constructor(message) {
    super(message);
    this.name = "PromptInputError";
  }
};
var FRAMING = `Ground every statement in tool results from this server (Pinnacle Ask). Never diagnose, never rule a condition in or out, never prescribe treatment. Speak warmly and plainly to a caregiver. Where the content signals possible concern, advise an evaluation by a qualified professional (developmental paediatrician, speech-language pathologist, or occupational therapist) and mention that Pinnacle Blooms Network can be reached at care@pinnacleblooms.org. Cite the canonical pinnacleblooms.org/ask URLs returned by the tools for every claim. Disclaimer to honour throughout: ${NON_DIAGNOSTIC}`;
var PROMPTS = {
  parent_concern_triage: {
    title: "Triage a caregiver concern",
    description: "Structured, non-diagnostic triage of a parent/caregiver concern about a child's development: search the corpus, read the best answer, check age-appropriate milestones and what-to-watch signs, then synthesise with escalation guidance and canonical citations.",
    arguments: [
      { name: "concern", description: "The caregiver's concern in their own words, e.g. 'my 2 year old is not talking'.", required: true },
      { name: "age_months", description: "Child age in months (0\u2013216), if known.", required: false }
    ],
    build({ concern, age_months }) {
      const c = strOrNull(concern);
      if (!c) throw new PromptInputError("`concern` is required.");
      const age = intOrNull(age_months, 0, 216);
      const ageLine = age !== null ? `The child is ${age} months old.` : "Ask the caregiver for the child's age in months if it matters to the answer.";
      return [
        `A caregiver says: "${c}". ${ageLine}`,
        "Work through the Pinnacle Ask tools in this order:",
        `1. \`search\` the concern${age !== null ? ` with age_months=${age}` : ""} and review the top results.`,
        "2. `fetch` the most relevant result id for the full published answer.",
        `3. Call \`milestones\`${age !== null ? ` with age_months=${age}` : ""} for what is typical at this age, and \`red_flags\`${age !== null ? ` with age_months=${age}` : ""} for what genuinely warrants professional evaluation.`,
        "4. Synthesise: what is typical, what to gently watch, one Everyday Therapy\u2122-style action the caregiver can take today, and when to seek an evaluation.",
        FRAMING
      ].join("\n\n");
    }
  },
  milestone_review: {
    title: "Milestone review by age",
    description: "Review developmental milestones for a given age in months (optionally one domain), contrasted with early signs that merit professional attention. Non-diagnostic.",
    arguments: [
      { name: "age_months", description: "Child age in months (0\u2013216).", required: true },
      { name: "domain", description: "Optional domain focus, e.g. 'speech', 'motor', 'social'.", required: false }
    ],
    build({ age_months, domain }) {
      const age = intOrNull(age_months, 0, 216);
      if (age === null) throw new PromptInputError("`age_months` is required (0\u2013216).");
      const d = strOrNull(domain);
      return [
        `Prepare a milestone review for a ${age}-month-old child${d ? ` focused on the ${d} domain` : ""}.`,
        `1. Call \`milestones\` with age_months=${age}${d ? ` and domain="${d}"` : ""}.`,
        `2. Call \`red_flags\` with age_months=${age}${d ? ` and domain="${d}"` : ""}.`,
        "3. Present: what most children do around this age, the normal range of variation, signs worth a professional conversation, and one supportive everyday activity.",
        FRAMING
      ].join("\n\n");
    }
  },
  compare_concerns: {
    title: "Compare two developmental topics",
    description: "Side-by-side, corpus-grounded comparison of two developmental topics or conditions (e.g. speech delay vs autism spectrum) without diagnosing either.",
    arguments: [
      { name: "a", description: "First topic, e.g. 'speech delay'.", required: true },
      { name: "b", description: "Second topic, e.g. 'autism spectrum'.", required: true }
    ],
    build({ a, b }) {
      const ta = strOrNull(a);
      const tb = strOrNull(b);
      if (!ta || !tb) throw new PromptInputError("Both `a` and `b` are required.");
      return [
        `Compare "${ta}" and "${tb}" for a caregiver who is unsure which applies to their child.`,
        `1. Call \`compare\` with a="${ta}", b="${tb}".`,
        `2. \`search\` and \`fetch\` one strong corpus answer for each topic for depth.`,
        "3. Present similarities, distinguishing features, why only a qualified professional can tell them apart in a specific child, and what an evaluation looks like.",
        FRAMING
      ].join("\n\n");
    }
  },
  pathway_plan: {
    title: "Skill pathway across ages",
    description: "Trace how a developmental skill progresses across age stages using the corpus pathway view, with supportive everyday actions per stage.",
    arguments: [
      { name: "topic", description: "Skill or topic, e.g. 'speech', 'walking', 'social play'.", required: true }
    ],
    build({ topic }) {
      const t = strOrNull(topic);
      if (!t) throw new PromptInputError("`topic` is required.");
      return [
        `Map how "${t}" typically develops from infancy onward.`,
        `1. Call \`pathway\` with topic="${t}".`,
        "2. For the stage most relevant to the conversation, `fetch` one full answer for depth.",
        "3. Present a stage-by-stage narrative: what emerges when, the wide normal range, and one everyday way caregivers can support each stage.",
        FRAMING
      ].join("\n\n");
    }
  },
  cite_pinnacle: {
    title: "Answer with canonical citations",
    description: "Answer a child-development question strictly from the Pinnacle Ask corpus, citing canonical pinnacleblooms.org/ask URLs for every claim.",
    arguments: [
      { name: "question", description: "The question to answer from the corpus.", required: true }
    ],
    build({ question }) {
      const q = strOrNull(question);
      if (!q) throw new PromptInputError("`question` is required.");
      return [
        `Answer this question using only the Pinnacle Ask corpus: "${q}"`,
        "1. `search` the question; `fetch` the one or two most relevant ids.",
        "2. Answer concisely from the fetched content only \u2014 if the corpus does not cover it, say so plainly rather than improvising.",
        "3. End with a 'Sources' list of the canonical pinnacleblooms.org/ask URLs used.",
        FRAMING
      ].join("\n\n");
    }
  }
};
function promptDefinitions(origin) {
  return Object.entries(PROMPTS).map(([name, p]) => ({
    name,
    title: p.title,
    description: p.description,
    arguments: p.arguments,
    ...origin ? { icons: brandIcons(origin) } : {}
  }));
}
__name(promptDefinitions, "promptDefinitions");
function getPrompt({ name, args }) {
  const prompt = PROMPTS[name];
  if (!prompt) {
    return { jsonRpcError: { code: -32602, message: `Unknown prompt '${name}'. Available: ${Object.keys(PROMPTS).join(", ")}.` } };
  }
  try {
    const text = prompt.build(args || {});
    return {
      description: p_desc(prompt, args),
      messages: [{ role: "user", content: { type: "text", text } }]
    };
  } catch (e) {
    if (e instanceof PromptInputError) {
      return { jsonRpcError: { code: -32602, message: e.message } };
    }
    throw e;
  }
}
__name(getPrompt, "getPrompt");
function p_desc(prompt, args) {
  const keys = args && typeof args === "object" ? Object.keys(args).filter((k) => args[k] !== void 0 && args[k] !== null && args[k] !== "") : [];
  return keys.length ? `${prompt.title} (${keys.map((k) => `${k}=${String(args[k]).slice(0, 60)}`).join(", ")})` : prompt.title;
}
__name(p_desc, "p_desc");

// src/resources.js
var KINDS = ["persona", "route", "domain", "condition", "age-band"];
var TTL2 = {
  answer: { fresh: 3600, stale: 86400 },
  browse: { fresh: 21600, stale: 86400 },
  list: { fresh: 3600, stale: 21600 },
  search: { fresh: 900, stale: 7200 }
};
function resourceList(origin) {
  const icons = origin ? { icons: brandIcons(origin) } : {};
  return [
    {
      uri: "ask://home",
      name: "home",
      title: "Pinnacle Ask \u2014 corpus overview",
      description: "Featured content, corpus statistics, and entry points for the open child-development knowledge layer.",
      mimeType: "application/json",
      ...icons
    },
    ...KINDS.map((kind) => ({
      uri: `ask://browse/${kind}`,
      name: `browse-${kind}`,
      title: `Browse by ${kind}`,
      description: `All ${kind} values in the corpus taxonomy \u2014 valid inputs for the \`topic\` tool and ask://topic/ reads.`,
      mimeType: "application/json",
      ...icons
    }))
  ];
}
__name(resourceList, "resourceList");
function resourceTemplates(origin) {
  const icons = origin ? { icons: brandIcons(origin) } : {};
  return [
    {
      uriTemplate: "ask://answer/{slug}",
      name: "answer",
      title: "Published answer document",
      description: "Full published Pinnacle Ask answer as markdown \u2014 question, answer, Everyday Therapy\u2122 tip, what-to-watch, FAQs, canonical URL. Use `search` to discover slugs.",
      mimeType: "text/markdown",
      ...icons
    },
    {
      uriTemplate: "ask://topic/{kind}/{value}",
      name: "topic",
      title: "Taxonomy hub",
      description: `Curated content hub for one taxonomy value. kind \u2208 ${KINDS.join(" | ")}.`,
      mimeType: "application/json",
      ...icons
    }
  ];
}
__name(resourceTemplates, "resourceTemplates");
async function readResource({ env, ctx, log, client, uri }) {
  const parsed = parseAskUri(uri);
  if (!parsed) {
    return { jsonRpcError: { code: -32002, message: `Resource not found: '${uri}'. Supported: ask://home, ask://browse/{kind}, ask://answer/{slug}, ask://topic/{kind}/{value}.` } };
  }
  if (parsed.type === "home") {
    const { data: data2 } = await cachedRpc({ env, ctx, log, client, fn: "ask_home", args: {}, ttl: TTL2.browse });
    return jsonContents(uri, env, data2);
  }
  if (parsed.type === "browse") {
    if (!KINDS.includes(parsed.kind)) {
      return { jsonRpcError: { code: -32002, message: `Unknown browse kind '${parsed.kind}'. Valid: ${KINDS.join(", ")}.` } };
    }
    const { data: data2 } = await cachedRpc({ env, ctx, log, client, fn: "ask_browse", args: { p_kind: parsed.kind }, ttl: TTL2.browse });
    return jsonContents(uri, env, data2);
  }
  if (parsed.type === "topic") {
    if (!KINDS.includes(parsed.kind)) {
      return { jsonRpcError: { code: -32002, message: `Unknown topic kind '${parsed.kind}'. Valid: ${KINDS.join(", ")}.` } };
    }
    const { data: data2 } = await cachedRpc({
      env,
      ctx,
      log,
      client,
      fn: "ask_topic",
      args: { p_kind: parsed.kind, p_value: parsed.value, p_k: 10 },
      ttl: TTL2.list
    });
    return jsonContents(uri, env, data2);
  }
  const { data } = await cachedRpc({ env, ctx, log, client, fn: "ask_answer", args: { p_slug: parsed.slug }, ttl: TTL2.answer });
  const doc = sanitize(unwrapOne(data));
  if (!doc || typeof doc !== "object" || Object.keys(doc).length === 0) {
    return { jsonRpcError: { code: -32002, message: `No published answer for slug '${parsed.slug}'. Use the \`search\` tool to find valid slugs.` } };
  }
  const text = composeAnswerText(doc) + `

Canonical URL: ${canonicalUrl(env, doc.full_url || doc.canonical_path || doc.slug || parsed.slug)}`;
  return { contents: [{ uri, mimeType: "text/markdown", text }] };
}
__name(readResource, "readResource");
function jsonContents(uri, env, data) {
  const payload = { data: withCanonicals(env, sanitize(unwrapOne(data))), disclaimer: NON_DIAGNOSTIC };
  return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(payload, null, 2) }] };
}
__name(jsonContents, "jsonContents");
function unwrapOne(data) {
  if (Array.isArray(data) && data.length === 1 && data[0] && typeof data[0] === "object") return data[0];
  return data;
}
__name(unwrapOne, "unwrapOne");
function parseAskUri(uri) {
  if (typeof uri !== "string" || !uri.startsWith("ask://")) return null;
  const rest = uri.slice("ask://".length).replace(/\/+$/, "");
  if (rest === "home") return { type: "home" };
  const segs = rest.split("/").map((s) => safeDecode(s)).filter((s) => s.length > 0);
  if (segs[0] === "browse" && segs.length === 2) return { type: "browse", kind: segs[1].toLowerCase() };
  if (segs[0] === "answer" && segs.length === 2) return { type: "answer", slug: segs[1].toLowerCase() };
  if (segs[0] === "topic" && segs.length === 3) return { type: "topic", kind: segs[1].toLowerCase(), value: segs[2] };
  return null;
}
__name(parseAskUri, "parseAskUri");
function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
__name(safeDecode, "safeDecode");
async function completeRef({ env, ctx, log, client, ref, argument }) {
  const argName = argument && typeof argument.name === "string" ? argument.name : "";
  const value = argument && typeof argument.value === "string" ? argument.value : "";
  if (argName === "kind") {
    return completionOf(KINDS.filter((k) => k.startsWith(value.toLowerCase())));
  }
  if (argName === "slug" || argName === "id") {
    if (value.trim().length < 2) return completionOf([]);
    try {
      const { data } = await cachedRpc({
        env,
        ctx,
        log,
        client,
        fn: "ask_find",
        args: { p_q: value, p_k: 10, p_embedding: null, p_age_months: null, p_domain: null },
        ttl: TTL2.search
      });
      const items = Array.isArray(data) ? data : data && typeof data === "object" && Array.isArray(data.results) ? data.results : [];
      const slugs = items.map((it) => it && (it.slug || it.id)).filter((s) => typeof s === "string");
      return completionOf(slugs.slice(0, 10));
    } catch (e) {
      log?.warn("completion_search_failed", { message: e && e.message ? e.message : String(e) });
      return completionOf([]);
    }
  }
  if (argName === "domain" || argName === "value") {
    const kind = argName === "domain" ? "domain" : guessKindFromRef(ref) || "domain";
    try {
      const { data } = await cachedRpc({ env, ctx, log, client, fn: "ask_browse", args: { p_kind: kind }, ttl: TTL2.browse });
      const candidates = collectStrings(sanitize(data), 200).filter((s) => s.length >= 2 && s.length <= 60).filter((s) => s.toLowerCase().startsWith(value.toLowerCase()));
      return completionOf([...new Set(candidates)].slice(0, 25));
    } catch (e) {
      log?.warn("completion_browse_failed", { message: e && e.message ? e.message : String(e) });
      return completionOf([]);
    }
  }
  return completionOf([]);
}
__name(completeRef, "completeRef");
function guessKindFromRef(ref) {
  const uri = ref && typeof ref.uri === "string" ? ref.uri : "";
  const m = /ask:\/\/topic\/([a-z-]+)\//i.exec(uri);
  return m ? m[1].toLowerCase() : null;
}
__name(guessKindFromRef, "guessKindFromRef");
function collectStrings(node, cap, out = [], depth = 0) {
  if (out.length >= cap || depth > 5) return out;
  if (typeof node === "string") {
    out.push(node);
  } else if (Array.isArray(node)) {
    for (const v of node) collectStrings(v, cap, out, depth + 1);
  } else if (node && typeof node === "object") {
    for (const k of ["value", "name", "slug", "kind_value", "label"]) {
      if (typeof node[k] === "string") out.push(node[k]);
    }
    for (const v of Object.values(node)) {
      if (v && typeof v === "object") collectStrings(v, cap, out, depth + 1);
    }
  }
  return out;
}
__name(collectStrings, "collectStrings");
function completionOf(values) {
  return { completion: { values, total: values.length, hasMore: false } };
}
__name(completionOf, "completionOf");

// src/landing.js
function renderLanding(env, origin) {
  const info = serverInfo(env);
  const mcpUrl = `${origin}/mcp`;
  const contentBase = `${envStr(env, "CANONICAL_BASE", "https://pinnacleblooms.org")}${envStr(env, "ASK_PREFIX", "/ask")}`;
  const tools = toolDefinitions();
  const prompts = promptDefinitions();
  const resourceCount = resourceList().length + resourceTemplates().length;
  const vscodeConfig = encodeURIComponent(JSON.stringify({ type: "http", url: mcpUrl }));
  const vscodeHref = `https://insiders.vscode.dev/redirect/mcp/install?name=pinnacle-ask&config=${vscodeConfig}`;
  const cursorConfig = btoa(JSON.stringify({ type: "http", url: mcpUrl }));
  const cursorHref = `cursor://anysphere.cursor-deeplink/mcp/install?name=pinnacle-ask&config=${cursorConfig}`;
  const toolCards = tools.map((t) => `<div class="card"><h4>${esc(t.name)}</h4><p>${esc(firstSentence(t.description))}</p></div>`).join("\n");
  const promptRows = prompts.map((p) => `<li><strong>${esc(p.name)}</strong> \u2014 ${esc(firstSentence(p.description))}</li>`).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(info.title)}</title>
<meta name="description" content="Pinnacle Ask MCP server \u2014 the open child-development knowledge layer of Pinnacle Blooms Network\xAE. ${tools.length} tools, ${prompts.length} prompts, ${resourceCount} resources. Non-diagnostic.">
<link rel="icon" type="image/png" href="/favicon.png">
<meta property="og:title" content="${esc(info.title)}">
<meta property="og:description" content="Model Context Protocol server for clinically grounded, non-diagnostic child-development knowledge. Connect from Claude, ChatGPT, VS Code, Cursor, or any MCP client.">
<meta property="og:image" content="${origin}/emblem.png">
<meta property="og:type" content="website">
<style>
  :root { --ink:#0a0a0a; --paper:#ffffff; --crimson:#C8102E; --line:#e6e6e6; --muted:#5c5c5c; }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:Inter,-apple-system,"Segoe UI",Roboto,Arial,sans-serif; color:var(--ink); background:var(--paper); line-height:1.55; }
  .wrap { max-width:920px; margin:0 auto; padding:48px 24px 64px; }
  header { display:flex; align-items:center; gap:20px; padding-bottom:24px; border-bottom:3px solid var(--crimson); }
  header img { width:72px; height:72px; }
  header h1 { font-size:1.7rem; letter-spacing:-0.02em; }
  header .sub { color:var(--muted); font-size:0.95rem; }
  .badges { display:flex; flex-wrap:wrap; gap:8px; margin:20px 0 8px; }
  .badge { font-size:0.78rem; border:1px solid var(--ink); padding:3px 10px; letter-spacing:0.02em; }
  .badge.red { background:var(--crimson); border-color:var(--crimson); color:#fff; }
  p.lede { margin:16px 0 0; font-size:1.04rem; max-width:62ch; }
  h2 { margin:44px 0 14px; font-size:1.15rem; text-transform:uppercase; letter-spacing:0.08em; }
  h2::before { content:"\u2014 "; color:var(--crimson); }
  .connect { display:grid; gap:14px; }
  .connect .item { border:1px solid var(--line); padding:14px 16px; }
  .connect .item b { display:block; margin-bottom:4px; }
  code, pre { font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:0.86rem; }
  pre { background:#0a0a0a; color:#f5f5f5; padding:12px 14px; overflow-x:auto; margin-top:6px; }
  .btn { display:inline-block; margin-top:6px; padding:6px 14px; border:1.5px solid var(--ink); color:var(--ink); text-decoration:none; font-size:0.86rem; }
  .btn:hover { background:var(--crimson); border-color:var(--crimson); color:#fff; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:12px; }
  .card { border:1px solid var(--line); padding:12px 14px; }
  .card h4 { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:0.9rem; color:var(--crimson); margin-bottom:4px; }
  .card p { font-size:0.86rem; color:var(--muted); }
  ul.plain { list-style:none; } ul.plain li { padding:6px 0; border-bottom:1px solid var(--line); font-size:0.92rem; }
  .disc { margin-top:48px; padding:16px; border:1px solid var(--line); border-left:4px solid var(--crimson); font-size:0.85rem; color:var(--muted); }
  footer { margin-top:32px; padding-top:16px; border-top:1px solid var(--line); font-size:0.83rem; color:var(--muted); display:flex; flex-wrap:wrap; gap:14px; }
  footer a, a { color:var(--crimson); text-decoration:none; }
  a:hover { text-decoration:underline; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <img src="/emblem.png" alt="Pinnacle Blooms Network emblem" width="72" height="72">
    <div>
      <h1>Pinnacle Ask</h1>
      <div class="sub">Model Context Protocol server \xB7 Pinnacle Blooms Network\xAE \xB7 v${esc(info.version)}</div>
    </div>
  </header>

  <div class="badges">
    <span class="badge red">CDSCO Class B SaMD \xB7 Non-Diagnostic</span>
    <span class="badge">MCP 2025-11-25</span>
    <span class="badge">Streamable HTTP</span>
    <span class="badge">${tools.length} tools</span>
    <span class="badge">${prompts.length} prompts</span>
    <span class="badge">${resourceCount} resources</span>
    <span class="badge">Read-only</span>
  </div>

  <p class="lede">The open child-development knowledge layer of <a href="${esc(contentBase)}">pinnacleblooms.org/ask</a> \u2014
  real parent questions answered with clinically grounded, non-diagnostic content across speech, motor, social,
  cognitive, sensory, feeding and behavioural development, birth to 18 years, with WHO ICF / ICD-11 crosswalks.
  Published under PinnacleAI GPT-OS (generic name: Developmental Support Software \u2014 Non-Diagnostic).</p>

  <h2>Connect</h2>
  <div class="connect">
    <div class="item"><b>Claude.ai / Claude Desktop</b>
      Settings \u2192 Connectors \u2192 <em>Add custom connector</em> \u2192 paste the URL below. No authentication required.
      <pre>${esc(mcpUrl)}</pre>
    </div>
    <div class="item"><b>Claude Code</b>
      <pre>claude mcp add --transport http pinnacle-ask ${esc(mcpUrl)}</pre>
    </div>
    <div class="item"><b>ChatGPT</b>
      Settings \u2192 Connectors \u2192 <em>Create</em> \u2192 paste the URL below. <code>search</code> + <code>fetch</code> are deep-research-native.
      <pre>${esc(mcpUrl)}</pre>
    </div>
    <div class="item"><b>VS Code \xB7 Cursor</b>
      <a class="btn" href="${vscodeHref}">Install in VS Code</a>
      <a class="btn" href="${cursorHref}">Install in Cursor</a>
    </div>
    <div class="item"><b>Any MCP client / cURL</b>
      <pre>curl -X POST ${esc(mcpUrl)} \\
  -H 'content-type: application/json' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search","arguments":{"query":"my 2 year old is not talking"}}}'</pre>
    </div>
  </div>

  <h2>Tools</h2>
  <div class="grid">
${toolCards}
  </div>

  <h2>Prompts</h2>
  <ul class="plain">
${promptRows}
  </ul>

  <h2>Resources</h2>
  <ul class="plain">
    <li><code>ask://home</code> \u2014 corpus overview \xB7 <code>ask://browse/{kind}</code> \u2014 taxonomy indexes</li>
    <li><code>ask://answer/{slug}</code> \u2014 full published answer (markdown) \xB7 <code>ask://topic/{kind}/{value}</code> \u2014 curated hubs</li>
  </ul>

  <h2>Discovery</h2>
  <ul class="plain">
    <li><a href="/.well-known/mcp.json">/.well-known/mcp.json</a> \u2014 MCP manifest</li>
    <li><a href="/.well-known/agent-card.json">/.well-known/agent-card.json</a> \u2014 A2A agent card</li>
    <li><a href="/llms.txt">/llms.txt</a> \xB7 <a href="/robots.txt">/robots.txt</a> \xB7 <a href="/.well-known/security.txt">security.txt</a> \xB7 <a href="/healthz?deep=1">healthz</a></li>
    <li>MCP Registry namespace: <code>org.pinnacleblooms/ask</code></li>
  </ul>

  <div class="disc">${esc(NON_DIAGNOSTIC)}</div>

  <footer>
    <span>\xA9 2026 Bharath Healthcare Laboratories Private Limited \xB7 Pinnacle Blooms Network\xAE</span>
    <a href="mailto:care@pinnacleblooms.org">care@pinnacleblooms.org</a>
    <a href="${esc(contentBase)}">${esc(contentBase.replace("https://", ""))}</a>
  </footer>
</div>
</body>
</html>`;
}
__name(renderLanding, "renderLanding");
function firstSentence(s) {
  const t = String(s || "");
  const i = t.indexOf(". ");
  return i > 0 ? t.slice(0, i + 1) : t.slice(0, 160);
}
__name(firstSentence, "firstSentence");
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
__name(esc, "esc");

// src/mcp.js
var SUPPORTED_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
var LATEST_PROTOCOL_VERSION = SUPPORTED_PROTOCOL_VERSIONS[0];
var SERVER_INSTRUCTIONS = "Pinnacle Ask \u2014 the open child-development knowledge layer of Pinnacle Blooms Network\xAE (pinnacleblooms.org/ask). Start with `search`, then `fetch` a result id for the full answer. Specialist tools: `milestones` (by age/domain), `red_flags` (what to watch), `lookup_code` (ICF/ICD-11/SNOMED crosswalk), `compare`, `pathway` (skill progression by stage), `topic` + `browse` (taxonomy hubs: persona, route, domain, condition, age-band), `related` (query graph), `home` (overview). Curated workflows are available as prompts (parent_concern_triage, milestone_review, compare_concerns, pathway_plan, cite_pinnacle). Resources expose the same corpus as ask:// URIs \u2014 ask://answer/{slug} returns the full markdown document; search results carry matching resource links. All capabilities are read-only. Content is educational and non-diagnostic \u2014 never present it as a medical diagnosis. When citing, always use the canonical pinnacleblooms.org/ask URLs returned by the tools.";
async function handleMcpPost({ request, env, ctx, log, client }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error: body must be valid JSON." } },
      { status: 400, headers: sessionEcho(request) }
    );
  }
  const isBatch = Array.isArray(body);
  const messages = isBatch ? body : [body];
  if (messages.length === 0) {
    return jsonResponse(
      { jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid Request: empty batch." } },
      { status: 400, headers: sessionEcho(request) }
    );
  }
  const responses = [];
  for (const msg of messages) {
    const res = await handleMessage({ msg, request, env, ctx, log, client });
    if (res !== void 0) responses.push(res);
  }
  if (responses.length === 0) {
    return new Response(null, { status: 202, headers: sessionEcho(request) });
  }
  const payload = isBatch ? responses : responses[0];
  return jsonResponse(payload, { headers: sessionEcho(request) });
}
__name(handleMcpPost, "handleMcpPost");
async function handleMessage({ msg, request, env, ctx, log, client }) {
  if (!msg || typeof msg !== "object" || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") {
    const id2 = msg && typeof msg === "object" && "id" in msg ? msg.id : null;
    return rpcError(id2, -32600, "Invalid Request: expected a JSON-RPC 2.0 message with a method.");
  }
  const isNotification = !("id" in msg);
  const { id, method, params } = msg;
  log?.debug("mcp_message", { method, notification: isNotification });
  if (isNotification) {
    return void 0;
  }
  const origin = new URL(request.url).origin;
  switch (method) {
    case "initialize": {
      const requested = params && typeof params.protocolVersion === "string" ? params.protocolVersion : null;
      const negotiated = requested && SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : LATEST_PROTOCOL_VERSION;
      return rpcResult(id, {
        protocolVersion: negotiated,
        capabilities: {
          tools: { listChanged: false },
          prompts: { listChanged: false },
          resources: { subscribe: false, listChanged: false },
          completions: {}
        },
        serverInfo: {
          ...serverInfo(env),
          websiteUrl: "https://pinnacleblooms.org/ask",
          icons: brandIcons(origin)
          // SEP-973, MCP 2025-11-25
        },
        instructions: SERVER_INSTRUCTIONS
      });
    }
    case "ping":
      return rpcResult(id, {});
    case "tools/list":
      return rpcResult(id, { tools: toolDefinitions(origin) });
    case "tools/call": {
      const name = params && typeof params.name === "string" ? params.name : "";
      const args = params && typeof params.arguments === "object" && params.arguments !== null ? params.arguments : {};
      const outcome = await executeTool({ env, ctx, log, client, name, args });
      if (outcome.jsonRpcError) return rpcError(id, outcome.jsonRpcError.code, outcome.jsonRpcError.message);
      return rpcResult(id, outcome);
    }
    case "prompts/list":
      return rpcResult(id, { prompts: promptDefinitions(origin) });
    case "prompts/get": {
      const name = params && typeof params.name === "string" ? params.name : "";
      const args = params && typeof params.arguments === "object" && params.arguments !== null ? params.arguments : {};
      const outcome = getPrompt({ name, args });
      if (outcome.jsonRpcError) return rpcError(id, outcome.jsonRpcError.code, outcome.jsonRpcError.message);
      return rpcResult(id, outcome);
    }
    case "resources/list":
      return rpcResult(id, { resources: resourceList(origin) });
    case "resources/templates/list":
      return rpcResult(id, { resourceTemplates: resourceTemplates(origin) });
    case "resources/read": {
      const uri = params && typeof params.uri === "string" ? params.uri : "";
      try {
        const outcome = await readResource({ env, ctx, log, client, uri });
        if (outcome.jsonRpcError) return rpcError(id, outcome.jsonRpcError.code, outcome.jsonRpcError.message);
        return rpcResult(id, outcome);
      } catch (e) {
        log?.error("resource_read_error", { message: e && e.message ? e.message : String(e) });
        return rpcError(id, -32603, "Knowledge layer temporarily unavailable while reading the resource. Retry shortly.");
      }
    }
    case "completion/complete": {
      const ref = params && typeof params.ref === "object" && params.ref !== null ? params.ref : {};
      const argument = params && typeof params.argument === "object" && params.argument !== null ? params.argument : {};
      const outcome = await completeRef({ env, ctx, log, client, ref, argument });
      return rpcResult(id, outcome);
    }
    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}
__name(handleMessage, "handleMessage");
function rpcResult(id, result) {
  return { jsonrpc: "2.0", id, result };
}
__name(rpcResult, "rpcResult");
function rpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}
__name(rpcError, "rpcError");
function sessionEcho(request) {
  const headers = {};
  const session = request.headers.get("mcp-session-id");
  if (session) headers["mcp-session-id"] = session;
  return headers;
}
__name(sessionEcho, "sessionEcho");
function handleMcpSse({ request, log }) {
  const accept = request.headers.get("accept") || "";
  if (!accept.includes("text/event-stream")) {
    return jsonResponse(
      { error: "method_not_allowed", message: "GET /mcp requires Accept: text/event-stream. POST JSON-RPC messages to this endpoint." },
      { status: 405, headers: { allow: "POST, GET, DELETE, OPTIONS" } }
    );
  }
  const encoder = new TextEncoder();
  let timer = null;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`event: ready
data: {"transport":"streamable-http","endpoint":"/mcp"}

`));
      timer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}

`));
        } catch {
          if (timer) clearInterval(timer);
        }
      }, 25e3);
      log?.debug("sse_open", {});
    },
    cancel() {
      if (timer) clearInterval(timer);
      log?.debug("sse_close", {});
    }
  });
  const headers = {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
    "x-accel-buffering": "no",
    ...sessionEcho(request)
  };
  return new Response(stream, { status: 200, headers });
}
__name(handleMcpSse, "handleMcpSse");

// src/security.js
var PUBLIC_PATHS = /* @__PURE__ */ new Set([
  "/",
  "/healthz",
  "/llms.txt",
  "/robots.txt",
  "/emblem.png",
  "/favicon.png",
  "/favicon.ico",
  "/.well-known/mcp.json",
  "/.well-known/agent-card.json",
  "/.well-known/agent.json",
  "/.well-known/security.txt"
]);
function corsHeaders(env, request) {
  const allowList = parseOrigins(env);
  const origin = request.headers.get("origin");
  const headers = {
    "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, authorization, x-api-key, mcp-session-id, mcp-protocol-version, last-event-id",
    "access-control-expose-headers": "mcp-session-id, x-request-id",
    "access-control-max-age": "86400"
  };
  if (allowList.length === 0) {
    headers["access-control-allow-origin"] = "*";
  } else if (origin && allowList.includes(origin)) {
    headers["access-control-allow-origin"] = origin;
    headers["vary"] = "Origin";
  } else {
    headers["vary"] = "Origin";
  }
  return headers;
}
__name(corsHeaders, "corsHeaders");
function applySecurity(env, request, url) {
  const originCheck = checkOrigin(env, request);
  if (!originCheck.ok) return originCheck;
  const keyCheck = checkApiKey(env, request, url);
  if (!keyCheck.ok) return keyCheck;
  const rateCheck = checkRateLimit(env, request, url);
  if (!rateCheck.ok) return rateCheck;
  return { ok: true };
}
__name(applySecurity, "applySecurity");
function parseOrigins(env) {
  return envStr(env, "ALLOWED_ORIGINS", "").split(",").map((s) => s.trim()).filter(Boolean);
}
__name(parseOrigins, "parseOrigins");
function checkOrigin(env, request) {
  const allowList = parseOrigins(env);
  if (allowList.length === 0) return { ok: true };
  const origin = request.headers.get("origin");
  if (!origin) return { ok: true };
  if (allowList.includes(origin)) return { ok: true };
  return {
    ok: false,
    status: 403,
    body: { error: "origin_forbidden", message: "Origin is not in ALLOWED_ORIGINS." }
  };
}
__name(checkOrigin, "checkOrigin");
function checkApiKey(env, request, url) {
  if (!envBool(env, "REQUIRE_API_KEY", false)) return { ok: true };
  if (PUBLIC_PATHS.has(url.pathname)) return { ok: true };
  const configured = envStr(env, "API_KEYS", "").split(",").map((s) => s.trim()).filter(Boolean);
  if (configured.length === 0) {
    return {
      ok: false,
      status: 503,
      body: {
        error: "auth_misconfigured",
        message: "REQUIRE_API_KEY=true but no API_KEYS secret is set. Run: wrangler secret put API_KEYS"
      }
    };
  }
  let presented = request.headers.get("x-api-key") || "";
  if (!presented) {
    const auth = request.headers.get("authorization") || "";
    if (/^bearer\s+/i.test(auth)) presented = auth.replace(/^bearer\s+/i, "").trim();
  }
  if (presented && configured.includes(presented)) return { ok: true };
  return {
    ok: false,
    status: 401,
    body: { error: "unauthorized", message: "Provide a valid key via x-api-key or Authorization: Bearer." },
    headers: { "www-authenticate": 'Bearer realm="pinnacle-ask-mcp"' }
  };
}
__name(checkApiKey, "checkApiKey");
var rateState = /* @__PURE__ */ new Map();
var MAX_TRACKED_IPS = 5e3;
function checkRateLimit(env, request, url) {
  const rpm = Math.max(0, envInt(env, "RATE_LIMIT_RPM", 0));
  if (rpm === 0) return { ok: true };
  if (PUBLIC_PATHS.has(url.pathname)) return { ok: true };
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  if (rateState.size > MAX_TRACKED_IPS) {
    for (const [k, v] of rateState) {
      if (now - v.windowStart > 6e4) rateState.delete(k);
    }
    if (rateState.size > MAX_TRACKED_IPS) rateState.clear();
  }
  const entry = rateState.get(ip);
  if (!entry || now - entry.windowStart >= 6e4) {
    rateState.set(ip, { windowStart: now, count: 1 });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count <= rpm) return { ok: true };
  const retryAfter = Math.max(1, Math.ceil((entry.windowStart + 6e4 - now) / 1e3));
  return {
    ok: false,
    status: 429,
    body: { error: "rate_limited", message: `Rate limit ${rpm} requests/minute exceeded.` },
    headers: { "retry-after": String(retryAfter) }
  };
}
__name(checkRateLimit, "checkRateLimit");

// src/wellknown.js
var PUBLISHER = {
  name: "Bharath Healthcare Laboratories Private Limited (BHCL)",
  brand: "Pinnacle Blooms Network\xAE",
  url: "https://pinnacleblooms.org",
  contact: "care@pinnacleblooms.org"
};
var REGISTRY_NAME = "org.pinnacleblooms/ask";
var DESCRIPTION = "Pinnacle Ask \u2014 the open child-development knowledge layer of Pinnacle Blooms Network\xAE (PinnacleAI GPT-OS; generic name: Developmental Support Software \u2014 Non-Diagnostic; CDSCO Class B SaMD). Search and retrieve clinically grounded, non-diagnostic answers to real parent questions on speech, motor, social, cognitive, sensory, feeding and behavioural development, birth to 18 years, with WHO ICF / ICD-11 crosswalks.";
function mcpManifest(env, origin) {
  const info = serverInfo(env);
  return {
    schema_version: SUPPORTED_PROTOCOL_VERSIONS[0],
    name: info.name,
    title: info.title,
    version: info.version,
    description: DESCRIPTION,
    endpoint: `${origin}/mcp`,
    transport: "streamable-http",
    protocol_versions: SUPPORTED_PROTOCOL_VERSIONS,
    registry_name: REGISTRY_NAME,
    website_url: "https://pinnacleblooms.org/ask",
    icons: brandIcons(origin),
    authentication: envBool(env, "REQUIRE_API_KEY", false) ? { type: "api_key", in: "header", name: "x-api-key" } : { type: "none" },
    capabilities: { tools: true, resources: true, prompts: true, completions: true },
    tools: toolDefinitions().map((t) => ({ name: t.name, description: t.description })),
    prompts: promptDefinitions().map((p) => ({ name: p.name, description: p.description })),
    resources: {
      concrete: resourceList().map((r) => r.uri),
      templates: resourceTemplates().map((r) => r.uriTemplate)
    },
    publisher: PUBLISHER,
    canonical_content_base: `${envStr(env, "CANONICAL_BASE", "https://pinnacleblooms.org")}${envStr(env, "ASK_PREFIX", "/ask")}`,
    documentation: `${origin}/`,
    disclaimer: NON_DIAGNOSTIC
  };
}
__name(mcpManifest, "mcpManifest");
function agentCard(env, origin) {
  const info = serverInfo(env);
  return {
    protocolVersion: "0.3.0",
    name: info.name,
    title: info.title,
    description: DESCRIPTION,
    version: info.version,
    url: `${origin}/mcp`,
    iconUrl: `${origin}/emblem.png`,
    documentationUrl: `${origin}/`,
    preferredTransport: "mcp-streamable-http",
    provider: { organization: PUBLISHER.name, url: PUBLISHER.url },
    capabilities: { streaming: true, pushNotifications: false, stateTransitionHistory: false },
    defaultInputModes: ["application/json", "text/plain"],
    defaultOutputModes: ["application/json", "text/plain"],
    skills: toolDefinitions().map((t) => ({
      id: t.name,
      name: t.name,
      description: t.description,
      tags: ["child-development", "pinnacle-blooms", "non-diagnostic", "knowledge", "healthcare"],
      examples: SKILL_EXAMPLES[t.name] || [],
      inputModes: ["application/json"],
      outputModes: ["application/json"]
    })),
    disclaimer: NON_DIAGNOSTIC
  };
}
__name(agentCard, "agentCard");
var SKILL_EXAMPLES = {
  search: ["my 2 year old is not talking", "early signs of autism spectrum"],
  fetch: ["what-are-the-types-or-levels-of-speech-and-language-delay"],
  milestones: ["what should an 18-month-old be doing"],
  red_flags: ["what to watch for in speech at 18 months"],
  lookup_code: ["b167", "6A02"],
  compare: ["speech delay vs autism spectrum"],
  pathway: ["how speech develops from babbling to sentences"],
  topic: ["domain: speech"],
  browse: ["list all conditions covered"],
  related: ["questions related to a given answer"],
  home: ["corpus overview"]
};
function llmsTxt(env, origin) {
  const info = serverInfo(env);
  const contentBase = `${envStr(env, "CANONICAL_BASE", "https://pinnacleblooms.org")}${envStr(env, "ASK_PREFIX", "/ask")}`;
  const tools = toolDefinitions().map((t) => `- ${t.name}: ${t.description.split(". ")[0]}.`).join("\n");
  return `# Pinnacle Ask \u2014 MCP server (v${info.version})

> The open child-development knowledge layer of Pinnacle Blooms Network\xAE (${contentBase}).
> Clinically grounded, non-diagnostic answers to real parent questions \u2014 speech, motor, social,
> cognitive, sensory, feeding and behavioural development, birth to 18 years, with WHO ICF / ICD-11 crosswalks.
> Published under PinnacleAI GPT-OS (generic name: Developmental Support Software \u2014 Non-Diagnostic; CDSCO Class B SaMD).

## Connect

- MCP endpoint (Streamable HTTP): ${origin}/mcp
- Manifest: ${origin}/.well-known/mcp.json
- A2A agent card: ${origin}/.well-known/agent-card.json
- Registry namespace: ${REGISTRY_NAME}
- Canonical content: ${contentBase}

## Tools

${tools}

## Citation policy

Always cite the canonical ${contentBase} URLs returned by the tools. Content is educational and
non-diagnostic \u2014 never present it as a medical diagnosis.

## Contact

Bharath Healthcare Laboratories Private Limited \xB7 care@pinnacleblooms.org
`;
}
__name(llmsTxt, "llmsTxt");
function robotsTxt(origin) {
  return `# Pinnacle Ask MCP \u2014 open to all agents and crawlers (asymmetric-gate doctrine).
User-agent: *
Allow: /

# Machine guides
# ${origin}/llms.txt
# ${origin}/.well-known/mcp.json
`;
}
__name(robotsTxt, "robotsTxt");
function securityTxt(origin) {
  return `Contact: mailto:care@pinnacleblooms.org
Expires: 2027-06-30T00:00:00.000Z
Preferred-Languages: en
Canonical: ${origin}/.well-known/security.txt
Policy: https://pinnacleblooms.org
`;
}
__name(securityTxt, "securityTxt");
function textResponse(body, contentType = "text/plain; charset=utf-8") {
  return new Response(body, {
    status: 200,
    headers: { "content-type": contentType, "cache-control": "public, max-age=3600" }
  });
}
__name(textResponse, "textResponse");
function wellKnownResponse(payload) {
  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  });
}
__name(wellKnownResponse, "wellKnownResponse");

// src/index.js
var index_default = {
  async fetch(request, env, ctx) {
    const requestId = crypto.randomUUID();
    const url = new URL(request.url);
    const log = createLogger(env, { requestId, path: url.pathname, method: request.method });
    const cors = corsHeaders(env, request);
    const started = Date.now();
    let response;
    try {
      response = await route({ request, env, ctx, url, log });
    } catch (e) {
      log.error("unhandled_error", { message: e && e.message ? e.message : String(e) });
      response = jsonResponse(
        { error: "internal_error", message: "Unexpected server error.", requestId },
        { status: 500 }
      );
    }
    const headers = new Headers(response.headers);
    for (const [k, v] of Object.entries(cors)) headers.set(k, v);
    headers.set("x-request-id", requestId);
    log.info("request", { status: response.status, durationMs: Date.now() - started });
    return new Response(response.body, { status: response.status, headers });
  }
};
async function route({ request, env, ctx, url, log }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }
  const gate = applySecurity(env, request, url);
  if (!gate.ok) {
    return jsonResponse(gate.body, { status: gate.status, headers: gate.headers || {} });
  }
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/" && request.method === "GET") {
    const accept = request.headers.get("accept") || "";
    if (accept.includes("text/html")) {
      return new Response(renderLanding(env, url.origin), {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" }
      });
    }
    return handleRoot(env, url);
  }
  if (path === "/healthz" && request.method === "GET") {
    return handleHealthz({ env, url, log });
  }
  if (path === "/llms.txt" && request.method === "GET") {
    return textResponse(llmsTxt(env, url.origin), "text/markdown; charset=utf-8");
  }
  if (path === "/robots.txt" && request.method === "GET") {
    return textResponse(robotsTxt(url.origin));
  }
  if (path === "/.well-known/security.txt" && request.method === "GET") {
    return textResponse(securityTxt(url.origin));
  }
  if ((path === "/emblem.png" || path === "/favicon.png" || path === "/favicon.ico") && request.method === "GET") {
    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      const assetReq = path === "/favicon.ico" ? new Request(`${url.origin}/favicon.png`, request) : request;
      return env.ASSETS.fetch(assetReq);
    }
    return jsonResponse({ error: "not_found", message: "Static assets binding unavailable." }, { status: 404 });
  }
  if (path === "/mcp") {
    const client = new SupabaseRpc(env, log);
    if (request.method === "POST") return handleMcpPost({ request, env, ctx, log, client });
    if (request.method === "GET") return handleMcpSse({ request, log });
    if (request.method === "DELETE") return new Response(null, { status: 204 });
    return jsonResponse(
      { error: "method_not_allowed", message: "Use POST (JSON-RPC), GET (SSE), or DELETE." },
      { status: 405, headers: { allow: "POST, GET, DELETE, OPTIONS" } }
    );
  }
  if (path === "/.well-known/mcp.json" && request.method === "GET") {
    return wellKnownResponse(mcpManifest(env, url.origin));
  }
  if ((path === "/.well-known/agent-card.json" || path === "/.well-known/agent.json") && request.method === "GET") {
    return wellKnownResponse(agentCard(env, url.origin));
  }
  return jsonResponse(
    {
      error: "not_found",
      message: "Unknown path. MCP endpoint: POST /mcp. Discovery: /.well-known/mcp.json"
    },
    { status: 404 }
  );
}
__name(route, "route");
function handleRoot(env, url) {
  const info = serverInfo(env);
  return jsonResponse({
    service: info.name,
    title: info.title,
    version: info.version,
    status: "ok",
    mcp_endpoint: `${url.origin}/mcp`,
    transport: "streamable-http",
    capabilities: ["tools", "prompts", "resources", "completions"],
    tools: toolDefinitions().map((t) => t.name),
    discovery: {
      landing: `${url.origin}/`,
      manifest: `${url.origin}/.well-known/mcp.json`,
      agent_card: `${url.origin}/.well-known/agent-card.json`,
      llms_txt: `${url.origin}/llms.txt`,
      security_txt: `${url.origin}/.well-known/security.txt`,
      registry_name: "org.pinnacleblooms/ask"
    },
    content_base: `${envStr(env, "CANONICAL_BASE", "https://pinnacleblooms.org")}${envStr(env, "ASK_PREFIX", "/ask")}`,
    publisher: "Pinnacle Blooms Network\xAE \u2014 Bharath Healthcare Laboratories Private Limited"
  });
}
__name(handleRoot, "handleRoot");
async function handleHealthz({ env, url, log }) {
  const info = serverInfo(env);
  const body = {
    status: "ok",
    service: info.name,
    version: info.version,
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (url.searchParams.get("deep") === "1") {
    const client = new SupabaseRpc(env, log);
    const started = Date.now();
    try {
      await client.call("ask_home", {});
      body.upstream = { status: "ok", durationMs: Date.now() - started };
    } catch (e) {
      body.status = "degraded";
      body.upstream = {
        status: "error",
        durationMs: Date.now() - started,
        message: e && e.message ? e.message : String(e)
      };
      return jsonResponse(body, { status: 503 });
    }
  }
  return jsonResponse(body);
}
__name(handleHealthz, "handleHealthz");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
