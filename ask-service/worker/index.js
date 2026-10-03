var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.js
import RESVG_WASM from "./dd4dd8881e2df4e64203b5c0ae65e1648ab55207-dd4dd8881e2df4e64203b5c0ae65e1648ab55207-resvg.wasm";
var __defProp2 = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __esm = /* @__PURE__ */ __name((fn, res, err) => /* @__PURE__ */ __name(function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
}, "__init"), "__esm");
var __export = /* @__PURE__ */ __name((target, all2) => {
  for (var name in all2)
    __defProp2(target, name, { get: all2[name], enumerable: true });
}, "__export");
function addHeapObject(obj) {
  if (heap_next === heap.length)
    heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
__name(addHeapObject, "addHeapObject");
function getObject(idx) {
  return heap[idx];
}
__name(getObject, "getObject");
function dropObject(idx) {
  if (idx < 132)
    return;
  heap[idx] = heap_next;
  heap_next = idx;
}
__name(dropObject, "dropObject");
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
__name(takeObject, "takeObject");
function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}
__name(getUint8Memory0, "getUint8Memory0");
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8Memory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127)
      break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
__name(passStringToWasm0, "passStringToWasm0");
function isLikeNone(x) {
  return x === void 0 || x === null;
}
__name(isLikeNone, "isLikeNone");
function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}
__name(getInt32Memory0, "getInt32Memory0");
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
__name(getStringFromWasm0, "getStringFromWasm0");
function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}
__name(_assertClass, "_assertClass");
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}
__name(handleError, "handleError");
async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}
__name(__wbg_load, "__wbg_load");
function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbg_new_28c511d9baebfa89 = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbg_new_63b92bc8671ed464 = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_values_839f3396d5aac002 = function(arg0) {
    const ret = getObject(arg0).values();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_next_196c84450b364254 = function() {
    return handleError(function(arg0) {
      const ret = getObject(arg0).next();
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_done_298b57d23c0fc80c = function(arg0) {
    const ret = getObject(arg0).done;
    return ret;
  };
  imports.wbg.__wbg_value_d93c65011f51a456 = function(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_instanceof_Uint8Array_2b3bbecd033d19f6 = function(arg0) {
    let result;
    try {
      result = getObject(arg0) instanceof Uint8Array;
    } catch (_) {
      result = false;
    }
    const ret = result;
    return ret;
  };
  imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof obj === "string" ? obj : void 0;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
  };
  imports.wbg.__wbg_new_16b304a2cfa7ff4a = function() {
    const ret = new Array();
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_push_a5b05aedc7234f9f = function(arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1));
    return ret;
  };
  imports.wbg.__wbg_length_c20a40f15020d68a = function(arg0) {
    const ret = getObject(arg0).length;
    return ret;
  };
  imports.wbg.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  };
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  return imports;
}
__name(__wbg_get_imports, "__wbg_get_imports");
function __wbg_init_memory(imports, maybe_memory) {
}
__name(__wbg_init_memory, "__wbg_init_memory");
function __wbg_finalize_init(instance, module) {
  wasm = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedInt32Memory0 = null;
  cachedUint8Memory0 = null;
  return wasm;
}
__name(__wbg_finalize_init, "__wbg_finalize_init");
async function __wbg_init(input) {
  if (wasm !== void 0)
    return wasm;
  if (typeof input === "undefined") {
    input = new URL("index_bg.wasm", void 0);
  }
  const imports = __wbg_get_imports();
  if (typeof input === "string" || typeof Request === "function" && input instanceof Request || typeof URL === "function" && input instanceof URL) {
    input = fetch(input);
  }
  __wbg_init_memory(imports);
  const { instance, module } = await __wbg_load(await input, imports);
  return __wbg_finalize_init(instance, module);
}
__name(__wbg_init, "__wbg_init");
function isCustomFontsOptions(value) {
  return Object.prototype.hasOwnProperty.call(value, "fontBuffers");
}
__name(isCustomFontsOptions, "isCustomFontsOptions");
var wasm;
var heap;
var heap_next;
var WASM_VECTOR_LEN;
var cachedUint8Memory0;
var cachedTextEncoder;
var encodeString;
var cachedInt32Memory0;
var cachedTextDecoder;
var BBoxFinalization;
var BBox;
var RenderedImageFinalization;
var RenderedImage;
var ResvgFinalization;
var Resvg;
var dist_default;
var initialized;
var initWasm;
var Resvg2;
var init_resvg_wasm = __esm({
  "node_modules/@resvg/resvg-wasm/index.mjs"() {
    heap = new Array(128).fill(void 0);
    heap.push(void 0, null, true, false);
    heap_next = heap.length;
    __name2(addHeapObject, "addHeapObject");
    __name2(getObject, "getObject");
    __name2(dropObject, "dropObject");
    __name2(takeObject, "takeObject");
    WASM_VECTOR_LEN = 0;
    cachedUint8Memory0 = null;
    __name2(getUint8Memory0, "getUint8Memory0");
    cachedTextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder("utf-8") : { encode: /* @__PURE__ */ __name2(() => {
      throw Error("TextEncoder not available");
    }, "encode") };
    encodeString = typeof cachedTextEncoder.encodeInto === "function" ? function(arg, view) {
      return cachedTextEncoder.encodeInto(arg, view);
    } : function(arg, view) {
      const buf = cachedTextEncoder.encode(arg);
      view.set(buf);
      return {
        read: arg.length,
        written: buf.length
      };
    };
    __name2(passStringToWasm0, "passStringToWasm0");
    __name2(isLikeNone, "isLikeNone");
    cachedInt32Memory0 = null;
    __name2(getInt32Memory0, "getInt32Memory0");
    cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: /* @__PURE__ */ __name2(() => {
      throw Error("TextDecoder not available");
    }, "decode") };
    if (typeof TextDecoder !== "undefined") {
      cachedTextDecoder.decode();
    }
    __name2(getStringFromWasm0, "getStringFromWasm0");
    __name2(_assertClass, "_assertClass");
    __name2(handleError, "handleError");
    BBoxFinalization = typeof FinalizationRegistry === "undefined" ? { register: /* @__PURE__ */ __name2(() => {
    }, "register"), unregister: /* @__PURE__ */ __name2(() => {
    }, "unregister") } : new FinalizationRegistry((ptr) => wasm.__wbg_bbox_free(ptr >>> 0));
    BBox = class _BBox {
      static {
        __name(this, "_BBox");
      }
      static {
        __name2(this, "_BBox");
      }
      static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(_BBox.prototype);
        obj.__wbg_ptr = ptr;
        BBoxFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BBoxFinalization.unregister(this);
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_bbox_free(ptr);
      }
      /**
      * @returns {number}
      */
      get x() {
        const ret = wasm.__wbg_get_bbox_x(this.__wbg_ptr);
        return ret;
      }
      /**
      * @param {number} arg0
      */
      set x(arg0) {
        wasm.__wbg_set_bbox_x(this.__wbg_ptr, arg0);
      }
      /**
      * @returns {number}
      */
      get y() {
        const ret = wasm.__wbg_get_bbox_y(this.__wbg_ptr);
        return ret;
      }
      /**
      * @param {number} arg0
      */
      set y(arg0) {
        wasm.__wbg_set_bbox_y(this.__wbg_ptr, arg0);
      }
      /**
      * @returns {number}
      */
      get width() {
        const ret = wasm.__wbg_get_bbox_width(this.__wbg_ptr);
        return ret;
      }
      /**
      * @param {number} arg0
      */
      set width(arg0) {
        wasm.__wbg_set_bbox_width(this.__wbg_ptr, arg0);
      }
      /**
      * @returns {number}
      */
      get height() {
        const ret = wasm.__wbg_get_bbox_height(this.__wbg_ptr);
        return ret;
      }
      /**
      * @param {number} arg0
      */
      set height(arg0) {
        wasm.__wbg_set_bbox_height(this.__wbg_ptr, arg0);
      }
    };
    RenderedImageFinalization = typeof FinalizationRegistry === "undefined" ? { register: /* @__PURE__ */ __name2(() => {
    }, "register"), unregister: /* @__PURE__ */ __name2(() => {
    }, "unregister") } : new FinalizationRegistry((ptr) => wasm.__wbg_renderedimage_free(ptr >>> 0));
    RenderedImage = class _RenderedImage {
      static {
        __name(this, "_RenderedImage");
      }
      static {
        __name2(this, "_RenderedImage");
      }
      static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(_RenderedImage.prototype);
        obj.__wbg_ptr = ptr;
        RenderedImageFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RenderedImageFinalization.unregister(this);
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_renderedimage_free(ptr);
      }
      /**
      * Get the PNG width
      * @returns {number}
      */
      get width() {
        const ret = wasm.renderedimage_width(this.__wbg_ptr);
        return ret >>> 0;
      }
      /**
      * Get the PNG height
      * @returns {number}
      */
      get height() {
        const ret = wasm.renderedimage_height(this.__wbg_ptr);
        return ret >>> 0;
      }
      /**
      * Write the image data to Uint8Array
      * @returns {Uint8Array}
      */
      asPng() {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.renderedimage_asPng(retptr, this.__wbg_ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
            throw takeObject(r1);
          }
          return takeObject(r0);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      /**
      * Get the RGBA pixels of the image
      * @returns {Uint8Array}
      */
      get pixels() {
        const ret = wasm.renderedimage_pixels(this.__wbg_ptr);
        return takeObject(ret);
      }
    };
    ResvgFinalization = typeof FinalizationRegistry === "undefined" ? { register: /* @__PURE__ */ __name2(() => {
    }, "register"), unregister: /* @__PURE__ */ __name2(() => {
    }, "unregister") } : new FinalizationRegistry((ptr) => wasm.__wbg_resvg_free(ptr >>> 0));
    Resvg = class {
      static {
        __name(this, "Resvg");
      }
      static {
        __name2(this, "Resvg");
      }
      __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ResvgFinalization.unregister(this);
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_resvg_free(ptr);
      }
      /**
      * @param {Uint8Array | string} svg
      * @param {string | undefined} [options]
      * @param {Array<any> | undefined} [custom_font_buffers]
      */
      constructor(svg, options, custom_font_buffers) {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          var ptr0 = isLikeNone(options) ? 0 : passStringToWasm0(options, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          var len0 = WASM_VECTOR_LEN;
          wasm.resvg_new(retptr, addHeapObject(svg), ptr0, len0, isLikeNone(custom_font_buffers) ? 0 : addHeapObject(custom_font_buffers));
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
            throw takeObject(r1);
          }
          this.__wbg_ptr = r0 >>> 0;
          return this;
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      /**
      * Get the SVG width
      * @returns {number}
      */
      get width() {
        const ret = wasm.resvg_width(this.__wbg_ptr);
        return ret;
      }
      /**
      * Get the SVG height
      * @returns {number}
      */
      get height() {
        const ret = wasm.resvg_height(this.__wbg_ptr);
        return ret;
      }
      /**
      * Renders an SVG in Wasm
      * @returns {RenderedImage}
      */
      render() {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.resvg_render(retptr, this.__wbg_ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
            throw takeObject(r1);
          }
          return RenderedImage.__wrap(r0);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      /**
      * Output usvg-simplified SVG string
      * @returns {string}
      */
      toString() {
        let deferred1_0;
        let deferred1_1;
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.resvg_toString(retptr, this.__wbg_ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          deferred1_0 = r0;
          deferred1_1 = r1;
          return getStringFromWasm0(r0, r1);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
          wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
      }
      /**
      * Calculate a maximum bounding box of all visible elements in this SVG.
      *
      * Note: path bounding box are approx values.
      * @returns {BBox | undefined}
      */
      innerBBox() {
        const ret = wasm.resvg_innerBBox(this.__wbg_ptr);
        return ret === 0 ? void 0 : BBox.__wrap(ret);
      }
      /**
      * Calculate a maximum bounding box of all visible elements in this SVG.
      * This will first apply transform.
      * Similar to `SVGGraphicsElement.getBBox()` DOM API.
      * @returns {BBox | undefined}
      */
      getBBox() {
        const ret = wasm.resvg_getBBox(this.__wbg_ptr);
        return ret === 0 ? void 0 : BBox.__wrap(ret);
      }
      /**
      * Use a given `BBox` to crop the svg. Currently this method simply changes
      * the viewbox/size of the svg and do not move the elements for simplicity
      * @param {BBox} bbox
      */
      cropByBBox(bbox) {
        _assertClass(bbox, BBox);
        wasm.resvg_cropByBBox(this.__wbg_ptr, bbox.__wbg_ptr);
      }
      /**
      * @returns {Array<any>}
      */
      imagesToResolve() {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          wasm.resvg_imagesToResolve(retptr, this.__wbg_ptr);
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          var r2 = getInt32Memory0()[retptr / 4 + 2];
          if (r2) {
            throw takeObject(r1);
          }
          return takeObject(r0);
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
      /**
      * @param {string} href
      * @param {Uint8Array} buffer
      */
      resolveImage(href, buffer) {
        try {
          const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
          const ptr0 = passStringToWasm0(href, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
          const len0 = WASM_VECTOR_LEN;
          wasm.resvg_resolveImage(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(buffer));
          var r0 = getInt32Memory0()[retptr / 4 + 0];
          var r1 = getInt32Memory0()[retptr / 4 + 1];
          if (r1) {
            throw takeObject(r0);
          }
        } finally {
          wasm.__wbindgen_add_to_stack_pointer(16);
        }
      }
    };
    __name2(__wbg_load, "__wbg_load");
    __name2(__wbg_get_imports, "__wbg_get_imports");
    __name2(__wbg_init_memory, "__wbg_init_memory");
    __name2(__wbg_finalize_init, "__wbg_finalize_init");
    __name2(__wbg_init, "__wbg_init");
    dist_default = __wbg_init;
    initialized = false;
    initWasm = /* @__PURE__ */ __name2(async (module_or_path) => {
      if (initialized) {
        throw new Error("Already initialized. The `initWasm()` function can be used only once.");
      }
      await dist_default(await module_or_path);
      initialized = true;
    }, "initWasm");
    Resvg2 = class extends Resvg {
      static {
        __name(this, "Resvg2");
      }
      static {
        __name2(this, "Resvg2");
      }
      /**
       * @param {Uint8Array | string} svg
       * @param {ResvgRenderOptions | undefined} options
       */
      constructor(svg, options) {
        if (!initialized)
          throw new Error("Wasm has not been initialized. Call `initWasm()` function.");
        const font = options?.font;
        if (!!font && isCustomFontsOptions(font)) {
          const serializableOptions = {
            ...options,
            font: {
              ...font,
              fontBuffers: void 0
            }
          };
          super(svg, JSON.stringify(serializableOptions), font.fontBuffers);
        } else {
          super(svg, JSON.stringify(options));
        }
      }
    };
    __name2(isCustomFontsOptions, "isCustomFontsOptions");
  }
});
var ARCHIVO_TTF_400_B64;
var ARCHIVO_TTF_700_B64;
var init_ogfont_ttf = __esm({
  "src/ogfont_ttf.js"() {
    ARCHIVO_TTF_400_B64 = "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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2B1IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/OIwD/8R2W/9gjAP/dHXj/ziMAAAAAAP/sJVAAAAAA/+wAAP/OHWD/7AAAAAAAAAAAAAAAAAAA/9gjAAAAAAAAAAAAAAAAAAAAAAD/4iV8AAAAAAAAAAAAAAAA/2odQv+mIwAAAAAA//YlfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+wAAP/iAAD/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/sHTwAAB02AAAAAAAAAAD/9iV8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+mHTAAAAAAAAAAAAAAAAAAAAAAAAAAAP/sJXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+wAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//YlfAAAAAAAAAAAAAAAAP/iIwAAAAAAAAAAAP/JJXz/4iMAAAAAAAAAAAAAAAAAAAAAAP/sJXz/4iMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/YJVAAAAAAAAAAAAAAAAAAAAAA/8QAAP+wIwAAAAAA//YlUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+IjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/zgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/84AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4iV8AAAAAAAAAAAAAAAAAAAAAP/OJXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+wlfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9hy4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2IwAAAAAAAAAAAP+cIwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/84lfP+cAAAAAAAAAAAAAAAAAAAAAAAA//YdigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xCL0AAAAAAAeJOoAAAAAAAAAAAAAAAAAAAAA/9glfAAAAAD/piTqAAAAAP/OJXz/2CV8AAAAAP/sJXwAAAAA/9glfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9gAA/4glfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7HYoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/xHZb/8R2Q/+wlfP/nHZb/8R2WAAAAAAAAAAAAAAAA/9glfP/OJXz/4gAAAAAAAP/sAAAAAAAA//Edlv/sJXwAAAAA/9gdSP/sAAD/7CV8AAAAAAAAAAAAAAAAAAAAAAAAAAD/zgAAAAAAAAAAAAAAAAAAAAAAAP/sJXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/YJXz/2CV8AAAAAP/nHYQAAAAAAAAAAAAAAAD/5x1OAAAAAAAAAAAAAAAAAAAAAP/iJXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAEgABABUAAAAdAB4AFQAiADoAFwA9AD0AMABFAEYAMQBKAFAAMwBcAFwAOgBhAGoAOwBsAG0ARQBvAG8ARwB1AHsASAB/AIAATwCHAJAAUQC/AMAAWwDNANAAXQDSANMAYQDZANkAYwDbAN0AZAABAGaAAAABAH2AAAABAEmAAAABAGuAAAABAHyAAAABAJaAAAABAI+AAAABAJWAAAABAJOAAAABAJGAAAABAJCAAAABAIuAAAABAHaAAAABAEuAAAAAAAWAAAABAECAAAABADCAAAABAJeAAAAAAAiAAAAAAA2AAAABADGAAAAAAAGAAAABAHeAAAABAIiAAAABAIWAAAABAHqAAAABAGiAAAAAAACAAAAAAAKAAAABAIaAAAAAAAyAAAABAGqAAAABAIGAAAABAFWAAAABAHiAAAABAEqAAAABAGeAAAABAGmAAAACAEAAAQAJAAQACwAMAAIAFQAVAAIAHAAcABkAIgApAAIALAAsAAIALgAuAAwALwAvABAAMAA0AAYANQA2AA0ANwA3ACcAOAA5AAsAOgA6ABMAPQA9AAIAPgBFAAUARgBGAAgARwBPAAEAUABQAA4AUQBRABEAUgBSAAgAXABdAAgAXgBgAAcAYQBoAAEAaQBpAAcAagBqAAgAawBrAAEAbABsAAcAbQBtAA8AbgBuAAgAbwBvABIAcAB0AAMAdQB2AAkAdwB3ACgAeAB4ACkAeQB6AAkAewB7ABQAfAB+AAMAfwB/AAEAgACEAA4AhQCGABUAhwCHABYAiACIACIAiQCJACYAigCKACUAiwCLAB4AjACMAB0AjQCNACQAjgCOABcAjwCPABwAkACQACEAtgC3ABgAuAC5ABsAugC6ABgAvwDAABoAwQDBABUAzADMABcAzQDQAAoA2ADYAB8A2QDZACAA2gDaAB8A2wDbACAA3ADdACMA9QD1AAcA/wD/ABUAAgA1AAEACAACAAkACQAEAAoACgAaAAsADAAIAA8AEwAEABQAFAAbABUAFQALAB0AHQAXAB4AHgAQACkAKQAEACoAKwAVAC0ALQARAC4ALgAMAC8ALwASADAANAADADUANgANADcANwApADgAOQAJADoAOgAPAEUARQAFAEYARgABAEoASgABAEsATwAFAFAAUAAYAFwAXAAZAGEAZwABAGgAaAAFAGkAagABAGwAbAATAG0AbQAOAG8AbwAUAHUAdgAGAHcAdwAqAHgAegAGAHsAewAKAH8AfwABAIAAgAAYAIcAhwAWAIgAiAAiAIkAiQAoAIoAigAnAIsAiwAfAIwAjAAeAI0AjQAmAI4AjgAlAI8AjwAdAJAAkAAhAL8AwAAcAM0A0AAHANIA0wAkANkA2QAgANsA2wAgANwA3QAjAAEASgBEAAAAIAT0BPQE9AT0BPQE9AT0BPQE5gS6BI4EgASABHgEagRQBFAEKgTmBBwEDgQqBAYD+ANOA0YC9gK4AqQBsgEOAI4AAQAgAAEAAgADAAQABQAGAAcACAAUAB0AHgAqACsALwA3ADgAOQBQAFwAbABvAIAAhwCOAL4AwwDEANQA1QDXAN4BEwAUAEf/sAB6AEj/sAB6AEn/sAB6AEr/sAB6AEv/sAB6AEz/sAB6AE3/sAB6AE7/sAB6AE//sAB6AGH/sAB6AGL/sAB6AGP/sAB6AGT/sAB6AGX/sAB6AGb/sAB6AGf/sAB6AGj/sAB6AGv/sAB6AG3/sAB6AH//sAB6AAEAjoAAABsACgAAAAAADQAAAAAADgAAAAAADwAAAAAAEAAAAAAAEQAAAAAAEgAAAAAAEwAAAAAAFAAAAAAAFgAAAAAAFwAAAAAAGAAAAAAAGQAAAAAAGgAAAAAAGwAAAAAAHQAAAAAAHgAAAAAAHwAAAAAAIAAAAAAAIQAAAAAAKgAAAAAAKwAAAAAALQAAAAAAOP/OA3oAOf/OA3oBAwAAAAABBAAAAAAAJQAB/5wA7AAC/5wA7AAD/5wA7AAE/5wA7AAF/5wA7AAG/5wA7AAH/5wA7AAI/5wA7AAJ/5wA7ABH/8QDaABI/8QDaABJ/8QDaABK/8QDaABL/8QDaABM/8QDaABN/8QDaABO/8QDaABP/8QDaABR/7AA5gBe/+wAAABf/+wAAABg/+wAAABh/8QDaABi/8QDaABj/8QDaABk/8QDaABl/8QDaABm/8QDaABn/8QDaABo/8QDaABp/+wAAABr/8QDaABs/+wAAABt/8QDaAB7/9gA4AB//8QDaAD1/+wAAAAAAAuAAAAAAAqAAAABAHmAAAADALb/zgJ2ALf/zgJ2ALr/zgJ2AAoAAf+cAlwAAv+cAlwAA/+cAlwABP+cAlwABf+cAlwABv+cAlwAB/+cAlwACP+cAlwACf+cAlwAHP+cAAAADQABABQAAAACABQAAAADABQAAAAEABQAAAAFABQAAAAGABQAAAAHABQAAAAIABQAAAAJABQAAAA4/9gCJAA5/9gCJACO/+wAAADM/+wAAAABABz/7AAAABwAC//sAAAADP/sAAAAFf/sAAAAIv/sAAAAI//sAAAAJP/sAAAAJf/sAAAAJv/sAAAAJ//sAAAAKP/sAAAAKf/sAAAALP/sAAAAL//sAcwANf/sAcwANv/sAcwAOP/sAcwAOf/sAcwAPf/sAAAAUP/sAcwAdf/2AcwAdv/2AcwAef/2AcwAev/2AcwAgP/sAcwAgf/sAcwAgv/sAcwAg//sAcwAhP/sAcwAAgDI//YAAADK//YAAAABARMAHgAAAAEAyAAFAAgAAQBWgAAAAgDXABQAAADe/+wAAAAFAL0AFAAAAMgAHgAgAMoAHgAgANcAFAAAARMAFAAAAAEALoAAAAQAw//YAMoA1P/iADgA3v/OADgBAP/iAMoAAgDU/+IAsAEA/+IAsAABAMP/2ACiAAEA3v/OAAgAAQB7gAAABgC9/84AjADDAB4AjADU/3QAjADV/5wAjADX/5wAjAEA/vwAJgABAJSAAAAEAMMAHgBgANT/xAAmAN7/zgAgAQD/7AAaAAEAh4AAAAEAjIAAAAEAkoAAAAEA3v/iAAgAAQBMgAAABQC9/+IAJgDDAB4AJgDU/5wAIADV/5wAIAEA/5IAJgABAE6AAP////+AAAABAAEAUgEMAawAAAAOAAEAAAAAAAIAAAA2AAAAKgAAACgAAAAYAAEAAAABAAsAAAAMAAAAAAAAAAEAAAABAAsAAAEqAAEAAAAGAAEAAPBvQAAAAkRGTFQAoGxhdG4ADgB8AARDQVQgAGRHVUEgAExQTEsgADRUUksgABwAAP//AAkAAAACAAMABAAIAAkACgAMAAsAAP//AAkAAAACAAMABAAHAAkACgAMAAsAAP//AAkAAAACAAMABAAGAAkACgAMAAsAAP//AAkAAAACAAMABAAFAAkACgAMAAsAAP//AAgAAQACAAMABAAJAAoADAALAAQAAAAA//8ACAAAAAIAAwAEAAkACgAMAAsADWNjbXAAlmNjbXAAlmRub20AkGZyYWMAhmxpZ2EAgGxvY2wAemxvY2wAdGxvY2wAbmxvY2wAaG51bXIAYnBudW0AXHJ2cm4AVnRudW0AUAAAAAEAFQAAAAEAFwAAAAEAFAAAAAEADQAAAAEABwAAAAEACQAAAAEACAAAAAEACgAAAAEAFgAAAAMADwAQABEAAAABAA4AAAADAAAAAwAGABgDRALsAuwCkgJgAmAB9gHiAbwBngFiAVQBRgEuASABDAEuAMQAtgC2AJ4AkABMADIAAQAAAAEACAACAAoAAgEsAS0AAQACAOMA5QAEAAgAAQAIAAEANgABAAgABQAmAB4AGAASAAwAhAACAF0AgwACAFMAgAACAFAAggADAFAAXQCBAAMAUABTAAEAAQBQAAEAAAABAAgAAQCkAAoAAQAAAAEACAABAAb/9gACAAEAkQCaAAAAAQAAAAEACAABAD7/9gAGAAAAAgAmAAoAAwABABIAAQAuAAAAAQAAABMAAgABAJsApAAAAAMAAQAcAAEAEgAAAAEAAAASAAIAAQClAK4AAAABAAEAsgABAAAAAQAIAAEABv/vAAEAAQDDAAEAAAABAAgAAQAUABQAAQAAAAEACAABAAYAHgACAAEAhwCQAAAAAQAAAAEACAABACQABgABAAAAAQAIAAEAFgAHAAYAAAABAAgAAQAIAAEADgABAAEAvwACABYABgABAB4AAQABAB4AAQAAAAwAAQBdAAEAAQBdAAEAAAALAAEAAAABAAgAAgAMAAMAPQB/ASsAAQADACMAYgETAAEAAAABAAgAAgAQAAUAOwA8AHwAfQB+AAEABQA4ADkAeAB5AHoAAQAAAAEACAABAAYABQABAAEAUwAEAAAAAQAIAAEAVgAEADwAMgAYAA4AAQAEASAAAgEhAAMAFAAOAAgBHAACASEBGgACAR0BGwACAR4AAQAEAQ0AAgEOAAMAFAAOAAgBCQACAQ4BBwACAQoBCAACAQsAAQAEAQYBDAEZAR8AAQAAAAEACAACARgAEgEZARoBGwEcAR0BHgEfASABIQEiASMBJAElASYBJwEoASkBKgAGAAAAAQAIAAIA5gBIADIASAACAAAAEAACABQABgABAAEAAQAAAAEAAAAFAAAAAQABAAEAAQAAAAQAAgADAQYBDwABAREBFwABASsBKwABAAIAAQEZASoAAQABAAAAAQAIAAIALgAUAFQAWwEZARoBGwEcAR0BHgEfASABIQEiASMBJAElASYBJwEoASkBKgACAAUAUwBTAAAAWgBaAAEBBgEPAAIBEQEXAAwBKwErABMABgAAAAQAbABSACoADgADAAEAEgABAC4AAAABAAAAAgACAAEAAQA9AAAAAwABABIAAQASAAAAAQAAAAEAAgADAQYBDwAAAREBFwAKASsBKwARAAMAAAABADwAAgAUACwAAQAAAAIAAQABARAAAwAAAAEAIgABABIAAQAAAAEAAQAGAQYBCgELAQwBDgEPAAEAAgBTAFoAAAABAAAAAAFGAAAAFAAAAAAAAAAAAAYBLm4cHBwcHBwcHF5MaWlmZmRkZGRkYmFjNzc3NzcgiQyNY2NnZ2dnZ2dnb09GZ2xlOGpqampqJhJOLS1gV1dnQEBAQEBAQFohGRkhATk5OTk5HwovHh4eHh4eHhsbFx6MLy8YGBgYGBgYNiEWIRQRTYowMDAwMCKIECIiIj8CAgIYhoODhYU7PlUAS1MsUlMlVFVHR0dHR0dHR0dHQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0Nbi4uLKCgGBoAyMgkJWwtbWVFRMwdWVgQEAwNbW1tbKgWBgYEFBS4uWFiECGtrPFtbSUQRX0VIbUJCQkJCQkJCQkJCMTRbW2iHI0c9PYJbShNdXSdbW1tbW1tbW1tbWw0rKxVBNVAkW1tbW1tbW1tbWw8pKQ46NVwaHUkRAAEAAAE8AAIAAABSAAAAEAAOAAIAAgAAAAH++QAj/0AAGv9K/7//WwDq/2cANf+MAJX/lQCn/7AAoP+0ALr/uACK/9sAgv/rAJH//QCLAAcAgABwAAAAAgAAAAGJW5o1mziiMqb7pv6o/a0AsCC0/rRLtUu2Ybg7uG+5PLl5vEa+Lr5CvlK+b79KwXzCRcJ4xCrFQsVFxinGQ8ZSyFLJS8pSynbNF81bzWvOGM4hzljQMdBY0VrRZdIY0lPTVNVS1inXKt4i3m/fQ+BX42fjauQW5QPlHOUk5gnnL+dv6BLoGOg/6FDoV+kg6Vjqauta7BTtW+9I8irzXPU09gv3CPhc+lv7W/tc/CD8bP0D/U39cQAAAAwBJQIVAlcDWAQnBzoIZQoyDDcNMg0zDwwQORBtFOwWPR3kLPw/BwABAALAAMAAAAAAAEAAQAAAAAAEAhACWAAFAAACvAKKAAAAjAK8AooAAAHdADIA+gAAAAAAAAAAAAAAAIAAAGcAAABqAAAACAAAAABPTU5JAMAADf7/A27/LgAABEwBmiAAAZMAAAAAAg4CrgAAACAAAwABAAEACAADAAAAFAALAAAALAACd2R0aAEBAAB3Z2h0AQAAAWl0YWwBGgACAJYAigB+AHIAYgBWAEoAPgAyACYAFgADAAIAAgEbAAAAAAABAAAAAQABAAABCgOEAAAAAQABAAABCQMgAAAAAQABAAABCAK8AAAAAQABAAABBwJYAAAAAQABAAABBgH0AAAAAwABAAIBBQGQAAACvAAAAAEAAQAAAQQBLAAAAAEAAQAAAQMAyAAAAAEAAQAAAQIAZAAAAAEAAAACARcAZAAAAAAAAQAAAAAAAQAJwADAAMzNyKbZmtTC5mbimPMz8G8AAAAAFVUN6iqrIshAAEAAAAAAAAACAAAAAwAAABQAAwABAAAAFAAEApoAAABCAEAABQACAA0ALwA5AH4A/wECATEBUwK8AsYC2gLcAwEDBAMJAyMgCSAUIBogHiAiICYgMyA6IEQgrCEiIZEhkyISIhX+////AAAADQAgADAAOgCgAQIBMQFSArwCxgLaAtwDAAMDAwgDIyAJIBMgGCAcICIgJiAyIDkgRCCsISIhkSGTIhIiFf7///8A1AAAAFcAAAAA/wH/IwAA/kn+Tv47/jr+CgAAAAD97eDX4LwAAAAA4J7glODP4KHgbuA6393fZt9l3tne1AHjAAEAAABAAAAAXADkAAAAAAGeAAAAAAAAAAAAAAGWAZgAAAAAAAABlAGYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3gC7ANwAwgDlAPYA+gDdAMcAyADBAOoAtwDNALYAwwC4ALkA8ADuAO8AvQD5AAEACgALAA0ADwAUABUAFgAXABwAHQAeAB8AIAAiACoALAAtAC4ALwAwADUANgA3ADgAOgDLAMQAzAD0ANEBEgA+AEYARwBJAEsAUABRAFIAUwBaAFwAXQBeAF8AYQBpAGsAbABtAG8AcAB1AHYAdwB4AHsAyQEDAMoA8gDfALwA4wDnAOQA6AEEAPwBEQD9AIUA2ADzAM4A/gEXAQAA8QCwALEBEwD1APsAvwEYAK8AhgDZALQAswC1AL4ABgACAAQACAAFAAcACQAMABMAEAARABIAGwAYABkAGgAOACEAJgAjACQAKAAlAOwAJwA0ADEAMgAzADkAKwBuAEIAPwBAAEQAQQBDAEUASABPAEwATQBOAFkAVQBWAFcASgBgAGUAYgBjAGcAZADtAGYAdABxAHIAcwB5AGoAegApAGgBDAEOAQYBDwDWANcA0gDUANUA0wAAAAEAAAAQAAIAAQAUAAkACndnaHQAZAAAAlgAAAOEAAAAAAEAAQIAAABkAAABCwEDAAAAyAAAAQwBBAAAASwAAAENAQUAAAGQAAABDgEGAAAB9AAAAQ8BBwAAAlgAAAEQAQgAAAK8AAABEQEJAAADIAAAARIBCgAAA4QAAAETAAAAAQAB//8ADwAFAEwAAAJAArwAAwAGAAkADAAPAAAzESERJSEnBzcnAREHJzchTAH0/lwBVKrIqqoBkKoeqv6sArz9RDL/0v///gIB/v8t/wACAAUAAALAAq4ABwAUAAAzATMBIychBxMzJy4DJyMOAgcFAQukAQyNN/7GN2DnRQQLDAwFBQYREAUCrv1SkpIBALoKHyUmDxQ0Lg0AAwAFAAACwANkAAcAFAAZAAAzATMBIychBxMzJy4DJyMOAgcDNzMXBwUBC6QBDI03/sY3YOdFBAsMDAUFBhEQBQdRhAFsAq79UpKSAQC6Ch8lJg8UNC4NASaEA4EAAAAAAwAFAAACwANkAAcAFAAmAAAzATMBIychBxMzJy4DJyMOAgcTIi4BNTMeAjMyPgE3MxQOAQUBC6QBDI03/sY3YOdFBAsMDAUFBhEQBTM5RR5RAg8gGhohEAFRH0QCrv1SkpIBALoKHyUmDxQ0Lg0BJyg9HgoYEBAYCh49KAAAAAADAAUAAALAA2QABwAUABwAADMBMwEjJyEHEzMnLgMnIw4CBwM3MxcjJxcHBQELpAEMjTf+xjdg50UECwwMBQUGERAFdWp8aW9UOFUCrv1SkpIBALoKHyUmDxQ0Lg0BJoSEaQFoAAAAAAQABQAAAsADZAAHABQAGAAcAAAzATMBIychBxMzJy4DJyMOAgcDNTMVMzUzFQUBC6QBDI03/sY3YOdFBAsMDAUFBhEQBWltXm0Crv1SkpIBALoKHyUmDxQ0Lg0BO29vb28AAAADAAUAAALAA2QABwAUABkAADMBMwEjJyEHEzMnLgMnIw4CBxMjJzczBQELpAEMjTf+xjdg50UECwwMBQUGERAFc2psAYQCrv1SkpIBALoKHyUmDxQ0Lg0BJoEDAAQABQAAAsADoAAHABQAIAAsAAAzATMBIychBxMzJy4DJyMOAgcTIiY1NDYzMhYVFAYnMjY1NCYjIgYVFBYFAQukAQyNN/7GN2DnRQQLDAwFBQYREAUzLjs7Li47Oy4UGhoUFBoaAq79UpKSAQC6Ch8lJg8UNC4NAR84Kyw4OCwrODgYExMZGRMTGAAAAwAFAAACwANpAAcAFAAsAAAzATMBIychBxMzJy4DJyMOAgcDND4BMzIeATMyNjczFA4BIyIuASMiBgcFAQukAQyNN/7GN2DnRQQLDAwFBQYREAV0EyohGi0sFw4RAkQTKSIZLisXDRICAq79UpKSAQC6Ch8lJg8UNC4NATogNSAREg8UHzUhEhIQFAAC//sAAAOwAq4ADwAdAAAjASEVIRchFSEXIRUhJyEHEzMDLgMnIw4DBwUBUAJf/mwuATr+5DIBHP59J/7ARXjxSAEEAwMCBQMGBQYDAq5vqW+4b5OTAQABDgYMDQwGBgwNDAYAAwBMAAAClQKuABMAHQAnAAAzESEyHgEVFA4BBxUeAhUUDgEjJzMyNjU0LgErATUzMj4BNTQmKwFMAXY3VzIeMyAmPCI5Xzv04yk1Fi0j29IeKRUvJtkCripMMydAKwsECC1FLUBUKW8tMBwqF20WJhcsKgABAC3/9AKpAroAIQAABSIuATU0NjMyHgEVIzQuASMiDgEdARQeATMyPgE1MxQOAQF6aZVPsJ1ViVGFK0wxRForK1lFNE4rgFCJDEqdfLWuOnVaMkUkNWhNFk5oNCNFMlp1OQAAAgAt/0oCqQK6ACEAOQAABSIuATU0NjMyHgEVIzQuASMiDgEdARQeATMyPgE1MxQOAQciJic1MzI2NTQmKwE3MwceAhUUDgIBemmVT7CdVYlRhStMMURaKytZRTROK4BQiVkZNhZcFBcRGCwOTgYaLBoaKC0MSp18ta46dVoyRSQ1aE0WTmg0I0UyWnU5qgQEMQoODAxYLQEPHBcZIBEHAAIATAAAAqsCrgAKABgAADMRITIeARUUDgEjJzMyPgI9ATQuAisBTAETaJRQUJRokZEwSjIaGjJKMJECrkqXdnWYSm8cN1M3FThTNxwAAAAAAwAAAAACqwKuAAMADgAcAAARNSEVAREhMh4BFRQOASMnMzI+Aj0BNC4CKwEBdP7YARNolFBQlGiRkTBKMhoaMkowkQEqZGT+1gKuSpd2dZhKbxw3UzcVOFM3HAABAEwAAAJpAq4ACwAAMxEhFSEVIRUhFSEVTAIX/msBaf6XAZsCrm+pb7hvAAIATAAAAmkDZAALABAAADMRIRUhFSEVIRUhFQE3MxcHTAIX/msBaf6XAZv+t1GEAWwCrm+pb7hvAuCEA4EAAAACAEwAAAJpA2QACwATAAAzESEVIRUhFSEVIRUBNzMXIycXB0wCF/5rAWn+lwGb/klqfGlvVDhVAq5vqW+4bwLghIRpAWgAAAADAEwAAAJpA2QACwAPABMAADMRIRUhFSEVIRUhFQE1MxUzNTMVTAIX/msBaf6XAZv+VW1ebQKub6lvuG8C9W9vb28AAAIATAAAAmkDZAALABAAADMRIRUhFSEVIRUhFQMjJzczTAIX/msBaf6XAZvPamwBhAKub6lvuG8C4IEDAAEATAAAAjkCrgAJAAAzESEVIRUhFSERTAHt/pUBR/65Aq5vuG/+6AABADX/9ALUAroAKgAABSImNTQ+ATMyHgIVIzQuAiMiDgIdARQeATMyPgE9ASM1IREjJw4CAYSfsFOdbkJ0WTKGHTNCJTdTNxsuXUU7WTPbAV1dCx5EUgyruHmdTR49XD8hMyMRHTtYOxVRaDEkRTIHbP6QTB4nEwABAEwAAAKQAq4ACwAAMxEzESERMxEjESERTIIBQIKC/sACrv7pARf9UgEn/tkAAAABAEwAAADOAq4AAwAAMxEzEUyCAq79UgACAEwAAAEpA2QAAwAIAAAzETMRAzczFwdMgntRhAFsAq79UgLghAOBAAAAAAL/5QAAATQDZAADAAsAADMRMxEDNzMXIycXB0yC6Wp8aW9UOFUCrv1SAuCEhGkBaAAAAAAD//EAAAEpA2QAAwAHAAsAADMRMxEDNTMVMzUzFUyC3W1ebQKu/VIC9W9vb28AAAAC//cAAADOA2QAAwAIAAAzETMRAyMnNzNMggFqbAGEAq79UgLggQMAAQAk//QCAQKuABMAAAUiLgE9ATMVFBYzMjY1ETMRFA4BARNMaziBNzc1NoM4agwuWUMmJi0vSEEBw/49Um43AAEATAAAAqICrgALAAAzETMRATMJASMDBxVMggEwn/72AQ+azW0Crv7CAT7+6v5oAT1g3QABAEwAAAImAq4ABQAAMxEzESEVTIIBWAKu/cNxAAAAAAEATAAAAwACrgAnAAAzETMTHgIXMz4CNxMzESMRND4BNSMOAgcDIwMuAicjHgIVEUzNbAYMCwMIAggLB2zLggIDCAIQEgdxeHEGDw8GCAECAgKu/oIUMi4RDywzGAF9/VIBWy5cQgYJPEYZ/ncBiBU7PhcbS00f/qUAAAABAEwAAAKQAq4AGAAAMxEzAR4CFzM8ATURMxEjAS4BJyMcARURTHwBJQUODAIFfXv+2ggVBAUCrv5rBhUUBg4aDQGV/VIBmAwjBw0bDv5oAAIATAAAApADaQAYADAAADMRMwEeAhczPAE1ETMRIwEuAScjHAEVEQM0PgEzMh4BMzI2NzMUDgEjIi4BIyIGB0x8ASUFDgwCBX17/toIFQQFAhMqIRotLBcOEQJEEykiGS4rFw0SAgKu/msGFRQGDhoNAZX9UgGYDCMHDRsO/mgC9CA1IBESDxQfNSESEhAUAAIALf/0AuECugAPACUAAAUiLgE1ND4BMzIeARUUDgEnMj4CPQE0LgIjIg4CHQEUHgIBh2ucU1Oca2ybU1ObbDRPNhwcNk80NE82Gxs2TwxNnnh5nU1NnXl4nk1uHjtXORY6WDseHjtYOhY5VzseAAADAC3/9ALhA2QADwAlACoAAAUiLgE1ND4BMzIeARUUDgEnMj4CPQE0LgIjIg4CHQEUHgIDNzMXBwGHa5xTU5xrbJtTU5tsNE82HBw2TzQ0TzYbGzZPBlGEAWwMTZ54eZ1NTZ15eJ5Nbh47VzkWOlg7Hh47WDoWOVc7HgJ+hAOBAAMALf/0AuEDZAAPACUALQAABSIuATU0PgEzMh4BFRQOAScyPgI9ATQuAiMiDgIdARQeAgM3MxcjJxcHAYdrnFNTnGtsm1NTm2w0TzYcHDZPNDRPNhsbNk90anxpb1Q4VQxNnnh5nU1NnXl4nk1uHjtXORY6WDseHjtYOhY5VzseAn6EhGkBaAAEAC3/9ALhA2QADwAlACkALQAABSIuATU0PgEzMh4BFRQOAScyPgI9ATQuAiMiDgIdARQeAgM1MxUzNTMVAYdrnFNTnGtsm1NTm2w0TzYcHDZPNDRPNhsbNk9obV5tDE2eeHmdTU2deXieTW4eO1c5FjpYOx4eO1g6FjlXOx4Ck29vb28AAAAAAwAt//QC4QNkAA8AJQAqAAAFIi4BNTQ+ATMyHgEVFA4BJzI+Aj0BNC4CIyIOAh0BFB4CEyMnNzMBh2ucU1Oca2ybU1ObbDRPNhwcNk80NE82Gxs2T3RqbAGEDE2eeHmdTU2deXieTW4eO1c5FjpYOx4eO1g6FjlXOx4CfoEDAAADAC3/zwLhAt8ADwAlACkAAAUiLgE1ND4BMzIeARUUDgEnMj4CPQE0LgIjIg4CHQEUHgIFATMBAYdrnFNTnGtsm1NTm2w0TzYcHDZPNDRPNhsbNk/+3QJHZv26DE2eeHmdTU2deXieTW4eO1c5FjpYOx4eO1g6FjlXOx6TAxD88AAAAAADAC3/9ALhA2kADwAlAD0AAAUiLgE1ND4BMzIeARUUDgEnMj4CPQE0LgIjIg4CHQEUHgIDND4BMzIeATMyNjczFA4BIyIuASMiBgcBh2ucU1Oca2ybU1ObbDRPNhwcNk80NE82Gxs2T3MTKiEaLSwXDhECRBMpIhkuKxcNEgIMTZ54eZ1NTZ15eJ5Nbh47VzkWOlg7Hh47WDoWOVc7HgKSIDUgERIPFB81IRISEBQAAAIALf/0BHkCugAaADAAAAUiLgE1ND4BMzIWFzUhFSEVIRUhFSEVITUOAScyPgI9ATQuAiMiDgIdARQeAgGHa5xTU5xrQWwoAhf+agFq/pYBnP3jKGxBNE82HBw2TzQ0TzYbGzZPDE2eeHmdTR0eL2+pb7hvLx4dbh47VzkWOlg7Hh47WDoWOVc7HgAAAgBMAAAChQKuAAwAFgAAMxEhMh4BFRQOASsBFREzMjY1NC4BKwFMAVhMYzI0Z03PyzI3GC4jywKuNmJEQ2Q39AFjOzQjMBoAAgBRAAACewKuAA4AGAAAMxEzFTMyHgEVFA4BKwEVNTMyNjU0LgErAVGCx0xjMjRnTcC8MjcYLiO8Aq5vNmJDRGQ3hfQ8NCIwGgAAAAIALf9+AuECugAUACoAAAUnBiIjIi4BNTQ+ATMyHgEVFAYHFyUyPgI9ATQuAiMiDgIdARQeAgIacggRCGucU1Oca2ybU11Vmf6/NE82HBw2TzQ0TzYbGzZPgncBTZ54eZ1NTZ15f6EllOQeO1c5FjpYOx4eO1g6FjlXOx4AAAAAAgBMAAACrwKuAA4AGAAAMxEhMh4BFRQGBxMjJyMVETMyNjU0LgErAUwBaUxkMjw6jo5+1d0yNhguIt0CrjRgQUNnGv7r//8BbDozIS0YAAABAC3/9AJuAroAQAAABSIuAjU0NjUzFAYVFB4BMzI+AzU0LgY1ND4CMzIeAh0BIzU0LgEjIg4BFRQeBhUUDgEBTDloUC4BgwEmSDEhMyUYCyQ9TVFNPSQpS2Q7N2FKKoEjPyotQCIkPU1RTT0kS4MMGTVPNgYMAwILBCEvGQgPFRoPHSYaFRYfLEMvMEgvFxcxSzQMCh0oFhEhGBkiGBQXHi1CLk1eKgABABkAAAJSAq4ABwAAMxEjNSEVIxH02wI53AI+cHD9wgAAAAABAEj/9AKMAq4AEwAABSIuATURMxEUFjMyNjURMxEUDgEBaVqCRYJTTExVgkaCDDp3WQGw/lRPUVFPAaz+UFl3OgAAAAIASP/0AowDZAATABgAAAUiLgE1ETMRFBYzMjY1ETMRFA4BAzczFwcBaVqCRYJTTExVgkaClFGEAWwMOndZAbD+VE9RUU8BrP5QWXc6AuyEA4EAAAIASP/0AowDZAATABsAAAUiLgE1ETMRFBYzMjY1ETMRFA4BATczFyMnFwcBaVqCRYJTTExVgkaC/v5qfGlvVDhVDDp3WQGw/lRPUVFPAaz+UFl3OgLshIRpAWgAAwBI//QCjANkABMAFwAbAAAFIi4BNREzERQWMzI2NREzERQOAQM1MxUzNTMVAWlagkWCU0xMVYJGgvZtXm0MOndZAbD+VE9RUU8BrP5QWXc6AwFvb29vAAIASP/0AowDZAATABgAAAUiLgE1ETMRFBYzMjY1ETMRFA4BAyMnNzMBaVqCRYJTTExVgkaCGmpsAYQMOndZAbD+VE9RUU8BrP5QWXc6AuyBAwAAAAEACgAAApUCrgAPAAAhAzMTHgIXMz4CNxMzAwEE+o2jBAgIAwUDBwgEoof6Aq7+KAoaFwkIFhkMAdn9UgAAAAABAAoAAAOwAq4AKQAAMwMzEx4CFzM+AzcTMxMeAhczPgM3EzMDIwMuAicjDgIHA8S6im8DBgYCBQIDBQQBZ6dnAwYGAgUCBQUGAm96u5VvAwcFAgQBBQYDbgKu/kcKIyYPDBwcFwcBuf5HCiMmDwsbGxgJAbn9UgHCDiUlDg8nJAz+PgABAAsAAAKjAq4ADQAAMxMDMxczNzMDEyMDIwML9+CfmAWYleD4nrAGrgFoAUbl5f67/pcBCf73AAEACgAAApsCrgAJAAAhEQEzEzMTMwERARL++Ja1BbOO/vkBFwGX/t4BIv5p/ukAAAIACgAAApsDZAAJAA4AACERATMTMxMzAREDNzMXBwES/viWtQWzjv75e1GEAWwBFwGX/t4BIv5p/ukC4IQDgQABAB0AAAJVAq4ACQAAMzUBITUhFQEhFR0Bbv6sAhX+kgF3PgIBbz/+AG8AAAEASv/0AlcCrgAoAAAFIi4BPQEzFB4BMzI+AT0BIw4BIyIuAT0BMxUUFjMyPgE9ATMRFA4CAUZNcT6CHjglLUAhBRpZO0dhMII9OC9CI4IlRmUMJk06BxYgEB4+LzUsKTZoS/j7Oz0qVD24/lBEZEIgAAAAAgBK//QCVwNkACgALQAABSIuAT0BMxQeATMyPgE9ASMOASMiLgE9ATMVFBYzMj4BPQEzERQOAgM3MxcHAUZNcT6CHjglLUAhBRpZO0dhMII9OC9CI4IlRmVxUYQBbAwmTToHFiAQHj4vNSwpNmhL+Ps7PSpUPbj+UERkQiAC7IQDgQAAAwAt//QC4QNkAA8AJQAqAAAFIi4BNTQ+ATMyHgEVFA4BJzI+Aj0BNC4CIyIOAh0BFB4CEzczFwcBh2ucU1Oca2ybU1ObbDRPNhwcNk80NE82Gxs2TwQceAMtDE2eeHmdTU2deXieTW4eO1c5FjpYOx4eO1g6FjlXOx4CfoQGfgACACL/9AInAhoAMQA/AAAXIi4CNTQ+AjM1NC4BIyIOAR0BIyY0NTQ+ATMyHgEdARQWOwEVDgEjIi4BJyMOAicyPgI9ASIOARUUHgHIFjk1IjBXeUgOJSUlKhB2ATZgP0hdLhYNIAomHBopHAYGES8/BB4vHxE3XTcRIwwLHjswNkcpESsXJBUSGg4OBQoHLUIjKEo1+BMQVAQLESAWFSESZBIgLhsYDiYjEhsPAAAAAAMAIv/0AicC0wAxAD8ARAAAFyIuAjU0PgIzNTQuASMiDgEdASMmNDU0PgEzMh4BHQEUFjsBFQ4BIyIuAScjDgInMj4CPQEiDgEVFB4BAzczFwfIFjk1IjBXeUgOJSUlKhB2ATZgP0hdLhYNIAomHBopHAYGES8/BB4vHxE3XTcRIwNRfwFsDAseOzA2RykRKxckFRIaDg4FCgctQiMoSjX4ExBUBAsRIBYVIRJkEiAuGxgOJiMSGw8B94QDgQAAAAMAIv/0AicC0wAxAD8ARwAAFyIuAjU0PgIzNTQuASMiDgEdASMmNDU0PgEzMh4BHQEUFjsBFQ4BIyIuAScjDgInMj4CPQEiDgEVFB4BAzczFyMnFwfIFjk1IjBXeUgOJSUlKhB2ATZgP0hdLhYNIAomHBopHAYGES8/BB4vHxE3XTcRI2VqcmlqVDhVDAseOzA2RykRKxckFRIaDg4FCgctQiMoSjX4ExBUBAsRIBYVIRJkEiAuGxgOJiMSGw8B94SEaQFoAAAABAAi//QCJwLTADEAPwBDAEcAABciLgI1ND4CMzU0LgEjIg4BHQEjJjQ1ND4BMzIeAR0BFBY7ARUOASMiLgEnIw4CJzI+Aj0BIg4BFRQeAQM1MxUzNTMVyBY5NSIwV3lIDiUlJSoQdgE2YD9IXS4WDSAKJhwaKRwGBhEvPwQeLx8RN103ESNfbV5uDAseOzA2RykRKxckFRIaDg4FCgctQiMoSjX4ExBUBAsRIBYVIRJkEiAuGxgOJiMSGw8CDG9vb28AAAMAIv/0AicC0wAxAD8ARAAAFyIuAjU0PgIzNTQuASMiDgEdASMmNDU0PgEzMh4BHQEUFjsBFQ4BIyIuAScjDgInMj4CPQEiDgEVFB4BEyMnNzPIFjk1IjBXeUgOJSUlKhB2ATZgP0hdLhYNIAomHBopHAYGES8/BB4vHxE3XTcRI4JlbAF/DAseOzA2RykRKxckFRIaDg4FCgctQiMoSjX4ExBUBAsRIBYVIRJkEiAuGxgOJiMSGw8B94EDAAAAAAQAIv/0AicDCgAxAD8ASwBXAAAXIi4CNTQ+AjM1NC4BIyIOAR0BIyY0NTQ+ATMyHgEdARQWOwEVDgEjIi4BJyMOAicyPgI9ASIOARUUHgETIiY1NDYzMhYVFAYnMjY1NCYjIgYVFBbIFjk1IjBXeUgOJSUlKhB2ATZgP0hdLhYNIAomHBopHAYGES8/BB4vHxE3XTcRIz4rOTkrLDg4LBQaGhQUGhoMCx47MDZHKRErFyQVEhoODgUKBy1CIyhKNfgTEFQECxEgFhUhEmQSIC4bGA4mIxIbDwHrOCssODgsKzg1GhQUGxsUFBoAAwAi//QCJwLTADEAPwBXAAAXIi4CNTQ+AjM1NC4BIyIOAR0BIyY0NTQ+ATMyHgEdARQWOwEVDgEjIi4BJyMOAicyPgI9ASIOARUUHgEDND4BMzIeATMyNjczFA4BIyIuASMiBgfIFjk1IjBXeUgOJSUlKhB2ATZgP0hdLhYNIAomHBopHAYGES8/BB4vHxE3XTcRI2kTKiEaLSwXDhECRBMpIhkuKxcNEgIMCx47MDZHKRErFyQVEhoODgUKBy1CIyhKNfgTEFQECxEgFhUhEmQSIC4bGA4mIxIbDwIGIDUgERIPFB81IRISEBQAAAAAAwAi//QDWAIaAD0ASwBVAAAXIi4CNTQ+AjM1NC4BIyIOAR0BIyY0NTQ+ATMyFhc+ATMyHgEdASEeAjMyPgI1MxQOAiMiJicOAicyPgI9ASIOARUUHgElMzQuAiMiDgHnGkM/KTJcf0wPKikoLRF2ATdjQj5WGx9VN0xmNP6eAhk3LBcnHhB4Iz9TMUJgHhY7SyIhMiISO2U8EyYBIOEPGyYXJjQcDAseOzA2RykRKxckFRIaDg4FCgctQiMeHB0dOXZeJDFDIQwZJhkySjAYJSUXIRJhESEvHRYNJSMUHA/qIS4eDRo2AAIAQf/0AikC0wAVACgAAAUiJicjByMRMxEzPgIzMh4BFRQOAScyPgE9ATQuASMiDgIdARQeAQFYM1QaBwplegYQLjwkO1s0M11nLTUXFzUtHy0dDhk1DCkpRgLT/v4YIRA6eV9gejppI0g3DjhJIxYqPicNNEgmAAEAJ//0AfwCGgAkAAAFIi4BNTQ+ATMyHgIVIzQuASMiDgEdARQeATMyPgE1MxQOAgEcUm02N21RNVI7HnwWLSMpNBkZNiwiLRh2HjpTDDt6Xl95Oxo1TjQlMBkmSzkNOEwlGTIjMU42HAAAAAIAJ/9KAfwCGgAkADwAAAUiLgE1ND4BMzIeAhUjNC4BIyIOAR0BFB4BMzI+ATUzFA4CByImJzUzMjY1NCYrATczBx4CFRQOAgEcUm02N21RNVI7HnwWLSMpNBkZNiwiLRh2HjpTQBk2FlwUFxEYLA5OBhosGhooLQw7el5feTsaNU40JTAZJks5DThMJRkyIzFONhyqBAQxCg4MDFgtAQ8cFxkgEQcAAAIAJ//0Ag8C0wAVACgAABciLgE1ND4BMzIeARczETMRIycjDgEnMj4BPQE0LgIjIg4BHQEUHgH4QF4zNFw6JDwuEAZ6ZQoHGVUNKjQZDh0tHy01Fxc1DDp6YF95OhAhGAEC/S1GKSlpJkg0DSc+KhYjSTgON0gjAAIAL//0AjcC0wAlADcAAAUiLgE1ND4BMzIWFzcuAScHNTcuASc3Mx4CFzcVBx4CFRQOAScyPgE9ATQuASMiDgEdARQeAQEzVnQ6NGNGFywTBA4gEqJkDyERBI4LFBMJnV0rOh46c1cwOxsbOzAwOxsbOww6eV1XeT8JCAMVKRUMRQcOGw0FCBAQCQxFBzFuekVdeTpkJUk3DThJJCRJNww4SiUAAgAn//QCCgIaABwAJgAABSIuATU0PgEzMh4BHQEhHgIzMj4CNTMUDgIDMzQuAiMiDgEBI1RwODhwVExnNP6aAho3LRcoHhF4Iz9UruUPGyYYJzUcDDt6Xl95Ozl2XiQxQyEMGSYZMkowGAFLIS4eDRo2AAADACf/9AIKAtMAHAAmACsAAAUiLgE1ND4BMzIeAR0BIR4CMzI+AjUzFA4CAzM0LgIjIg4BPwEzFwcBI1RwODhwVExnNP6aAho3LRcoHhF4Iz9UruUPGyYYJzUcNlF/AWwMO3peX3k7OXZeJDFDIQwZJhkySjAYAUshLh4NGjbmhAOBAAADACf/9AIKAtMAHAAmAC4AAAUiLgE1ND4BMzIeAR0BIR4CMzI+AjUzFA4CAzM0LgIjIg4BJzczFyMnFwcBI1RwODhwVExnNP6aAho3LRcoHhF4Iz9UruUPGyYYJzUcLGpyaWpUOFUMO3peX3k7OXZeJDFDIQwZJhkySjAYAUshLh4NGjbmhIRpAWgAAAQAJ//0AgoC0wAcACYAKgAuAAAFIi4BNTQ+ATMyHgEdASEeAjMyPgI1MxQOAgMzNC4CIyIOASc1MxUzNTMVASNUcDg4cFRMZzT+mgIaNy0XKB4ReCM/VK7lDxsmGCc1HCZtXm4MO3peX3k7OXZeJDFDIQwZJhkySjAYAUshLh4NGjb7b29vbwADACf/9AIKAtMAHAAmACsAAAUiLgE1ND4BMzIeAR0BIR4CMzI+AjUzFA4CAzM0LgIjIg4BNyMnNzMBI1RwODhwVExnNP6aAho3LRcoHhF4Iz9UruUPGyYYJzUcu2VsAX8MO3peX3k7OXZeJDFDIQwZJhkySjAYAUshLh4NGjbmgQMAAAABAA4AAAEzAtsAFwAAMxEjNTM1ND4BMzIeARcVIyIGHQEzFSMRWkxMFzo0Dx8cCjIWF19fAapkQyM/KAQHBFUXFjxk/lYAAAADABH/SgJBAmUANQBEAFEAABciLgE1NDY3LgE1NDY3LgE1ND4BMzIWFz4BNzMUDgEHHgEVFA4BKwEiBhUUFjsBMhYVFA4BIyczMj4BNTQmKwEiBhUUFhMyNjU0JiMiBhUUHgGYIz4mMx8XHTgkJSc1ZkgdNhYjGgF3GzAiGRozY0hRFRcVE+Y7TS9UOMLBEx0RIRjJGCAfeDU1NTU1NRcvthw3KCwzDQwoHCYtBxdILjdPLAgIFTURIzYjCBY+JTdQLBIQDRRNPC1IKlgNGA8aGh0XFx0BaTEsLDAwLB0qFgAAAAABAEEAAAILAtMAGQAAMxEzETM+AjMyHgEVESMRNC4CIyIOARURQXoHES47JDJNLHsNGSQWITUfAtP+/xUgEyRQQ/6dAU0cJRcKIDgl/s4AAAIAQQAAALsC0wADAAcAABM1MxUDETMRQXp6egJfdHT9oQIO/fIAAAABAEEAAAC7Ag4AAwAAMxEzEUF6Ag798gACADwAAAENAtMAAwAIAAAzETMRAzczFwdBen9RfwFsAg798gJPhAOBAAAAAAL/2gAAAR8C0wADAAsAADMRMxEDNzMXIycXB0F64WpyaWpUOFUCDv3yAk+EhGkBaAAAAAAD/+AAAAEZAtMAAwAHAAsAADMRMxEDNTMVMzUzFUF6221ebgIO/fICZG9vb28AAAACAEEAAAC7AtMAAwAHAAATNTMVAxEzEUF6enoCX3R0/aECDv3yAAAAAv/wAAAAwQLTAAMACAAAMxEzERMjJzczQXoGZWwBfwIO/fICT4EDAAL/4/9KALsC0wADABMAABM1MxUDIi4BJzUzMjY1ETMRFA4BQXqCDiAeCjIVF3oXOAJfdHT86wQHBFQXFgI0/cMhPigAAf/j/0oAuwIOAA8AABciLgEnNTMyNjURMxEUDgE5DiAeCjIVF3oXOLYEBwRUFxYCNP3DIT4oAAABAEEAAAIRAtMACwAAMxEzETczBxMjJwcVQXq9j7C6jHxOAtP+W+DM/r7pS54AAAABAEEAAAC7AtMAAwAAMxEzEUF6AtP9LQABAEEAAAMgAhoALQAAMxEzFzM+AjMyFhczPgIzMh4BFREjETQuAiMiDgEVESMRNC4CIyIOARURQWYKBxEsOSIuSBQHES48Iy9IKnoMFR8SHS4begwVHxIdLxsCDkYYJRUmLBglFSJOQf6XAVAbJRUKIDgl/s4BUBslFQogOCX+zgAAAAABAEEAAAILAhoAGQAAMxEzFzM+AjMyHgEVESMRNC4CIyIOARURQWYKBxIxPyYyTSx7DRkkFiE1HwIORhglFSRQQ/6dAU0cJRcKIDgl/s4AAAIAQQAAAgsC0wAZADEAADMRMxczPgIzMh4BFREjETQuAiMiDgEVEQM0PgEzMh4BMzI2NzMUDgEjIi4BIyIGB0FmCgcSMT8mMk0sew0ZJBYhNR88EyohGi0sFw4RAkQTKSIZLisXDRICAg5GGCUVJFBD/p0BTRwlFwogOCX+zgJeIDUgERIPFB81IRISEBQAAAIAJ//0Ai8CGgAPACEAAAUiLgE1ND4BMzIeARUUDgEnMj4BPQE0LgEjIg4BHQEUHgEBK1Z0Ojp0VldzOjpzVzA7Gxs7MDA7Gxs7DDt6Xl95Ozt5X156O2QlSzgOOEslJUs4DjhLJQAAAwAn//QCLwLTAA8AIQAmAAAFIi4BNTQ+ATMyHgEVFA4BJzI+AT0BNC4BIyIOAR0BFB4BAzczFwcBK1Z0Ojp0VldzOjpzVzA7Gxs7MDA7Gxs7EVF/AWwMO3peX3k7O3lfXno7ZCVLOA44SyUlSzgOOEslAfeEA4EAAwAn//QCLwLTAA8AIQApAAAFIi4BNTQ+ATMyHgEVFA4BJzI+AT0BNC4BIyIOAR0BFB4BAzczFyMnFwcBK1Z0Ojp0VldzOjpzVzA7Gxs7MDA7Gxs7c2pyaWpUOFUMO3peX3k7O3lfXno7ZCVLOA44SyUlSzgOOEslAfeEhGkBaAAEACf/9AIvAtMADwAhACUAKQAABSIuATU0PgEzMh4BFRQOAScyPgE9ATQuASMiDgEdARQeAQM1MxUzNTMVAStWdDo6dFZXczo6c1cwOxsbOzAwOxsbO21tXm4MO3peX3k7O3lfXno7ZCVLOA44SyUlSzgOOEslAgxvb29vAAAAAAMAJ//0Ai8C0wAPACEAJgAABSIuATU0PgEzMh4BFRQOAScyPgE9ATQuASMiDgEdARQeARMjJzczAStWdDo6dFZXczo6c1cwOxsbOzAwOxsbO3RlbAF/DDt6Xl95Ozt5X156O2QlSzgOOEslJUs4DjhLJQH3gQMAAAMAJv/QAi8CQAAPACEAJQAABSIuATU0PgEzMh4BFRQOAScyPgE9ATQuASMiDgEdARQeAQcBMwEBK1Z0Ojp0VldzOjpzVzA7Gxs7MDA7Gxs71QG4Uf5JDDt6Xl95Ozt5X156O2QlSzgOOEslJUs4DjhLJYgCcP2QAAMAJ//0Ai8C0wAPACEAOQAABSIuATU0PgEzMh4BFRQOAScyPgE9ATQuASMiDgEdARQeAQM0PgEzMh4BMzI2NzMUDgEjIi4BIyIGBwErVnQ6OnRWV3M6OnNXMDsbGzswMDsbGzt3EyohGi0sFw4RAkQTKSIZLisXDRICDDt6Xl95Ozt5X156O2QlSzgOOEslJUs4DjhLJQIGIDUgERIPFB81IRISEBQAAAMAJ//0A48CGgAoADoARAAABSIuATU0PgEzMhYXPgEzMh4BHQEhHgIzMj4CNTMUDgIjIiYnDgEnMj4BPQE0LgEjIg4BHQEUHgElMzQuAiMiDgEBKFVyOjpyVUFhIB9eQE1nNP6ZAhs3LRcoHhB5Iz9UMkBeHyBhQS86Gxs6Ly46Gxs6ATDmDxwmGCc0HQw7el5feTsnJygmOXZeJDFDIQwZJhkySjAYJicnJmQlSzgMOUsmJUs4DThMJechLh4NGjYAAAACAEH/UwIpAhoAFQAoAAAXETMXMz4BMzIeARUUDgEjIi4BJyMVEzI+AT0BNC4BIyIOAR0BFB4CQWUKBxpUM0FdMzRbOyQ8LhAGdy01Fxc1LSk1GQ4dLa0Cu0YpKTp6YF56OhAhGOoBCiNINw44SSMmSTUMJz0qFgACAEH/UwIpAt0AFgApAAAXETMRMz4CMzIeARUUDgEjIi4BJyMVEzI+AT0BNC4BIyIOAh0BFB4BQXoGEC48JDxbMzRbOyQ8LhAGdy01Fxc1LR8tHQ4ZNa0Div70GCEQOnpgXno6ECEY6gEKI0g3DjhJIxUqPSgMNEomAAAAAgAn/1MCDwIaABUAKAAABTUjDgIjIi4BNTQ+ATMyFhczNzMRAzI+Aj0BNC4BIyIOAR0BFB4BAZUGEC48JDpcNDNeQDNVGQcKZfEgLRwOGTQqLTUXFzWt6hghEDp6XmB6OikpRv1FAQoWKj0nDDVJJiNJOA43SCMAAQBBAAABYAIaABMAADMRMxczPgIzMhYXFSMiDgIVEUFmCgcKHS4hEBsHJR8wIRACDlMZKxsGA3MRJDYk/vEAAAEAKP/0AfcCGQBCAAAFIi4CNTQ2NTMcARUeAjMyPgE1NC4BJy4DNTQ+AjMyHgIVFAYVIzU0LgEjIg4CFRQeARceAxUUDgIBDjlWOh0BeAEgNB0aLx8oQSUhQjUhIjxSMC9NOR8BdxcrIBgkFwweMx4kTEEoIz9VDBksOyMFCAICBAIbIQ4LGRQaHBIKCRYiNignOicUFCU1IAcOAQcTGxAIDhILExYQCQoVIDowLkEnEgAAAAEASwAAAkgC3wAwAAAzETQ+AjMyHgIVFAYHFR4BFRQOASsBNTMyPgE1NC4BKwE1MzI+ATU0JiMiDgEVEUsnRFs0OFY9Hz8yQkg3ZENiViIxGxszI1NOHCkYODkmOB8CADxUNhkaMEIoOlQRBBNkQjteNmQgNB8gNB9qGy4cKzgbNCb9+QAAAAABAA3/9AEhAqEAFwAAFyIuATURIzUzNzMVMxUjERQWOwEVDgLMMTgXP0IWYVtbFhYvCh0gDCc9IAEyZJOTZP7aFRdUBAcFAAABAD3/9AIGAg4AGAAAFyImNREzERQeAjMyPgE1ETMRIycjDgLoTF96DRkkFiE1H3plCgcSMT8MU2QBY/6zHCUXCiA5JAEy/fJGGCUVAAAAAAIAPf/0AgYC0wAYAB0AABciJjURMxEUHgIzMj4BNREzESMnIw4CAzczFwfoTF96DRkkFiE1H3plCgcSMT8rUX8BbAxTZAFj/rMcJRcKIDkkATL98kYYJRUCW4QDgQAAAAIAPf/0AgYC0wAYACAAABciJjURMxEUHgIzMj4BNREzESMnIw4CAzczFyMnFwfoTF96DRkkFiE1H3plCgcSMT+NanJpalQ4VQxTZAFj/rMcJRcKIDkkATL98kYYJRUCW4SEaQFoAAAAAwA9//QCBgLTABgAHAAgAAAXIiY1ETMRFB4CMzI+ATURMxEjJyMOAgM1MxUzNTMV6Exfeg0ZJBYhNR96ZQoHEjE/h21ebgxTZAFj/rMcJRcKIDkkATL98kYYJRUCcG9vb28AAAIAPf/0AgYC0wAYAB0AABciJjURMxEUHgIzMj4BNREzESMnIw4CEyMnNzPoTF96DRkkFiE1H3plCgcSMT9aZWwBfwxTZAFj/rMcJRcKIDkkATL98kYYJRUCW4EDAAAAAAEABQAAAgwCDgAPAAAzAzMXHgIXMz4CPwEzA8jDgFUGERIGBQYQEQdUfMQCDu0ROT0ZFzw6E+398gAAAAEAAwAAAvMCDgAnAAAzAzMTHgIXMz4CNxMzEx4CFzM+AjcTMwMjJy4CJyMUDgEPAaCdfkkGCAYBBgQIBwFEg0cEBwgCBgIHCANIdZyBPAQLCQMGBgsJPgIO/uIWKx4DEiojBgEb/uQOJSQNDCIkDwEf/fL7EzAwEQckNiP7AAAAAQAKAAACGAIOAA0AADMTJzMXMzczBxMjJyMHCryvlGgGaouwupJ1BnYBD/+jo/z+7ra2AAEABf9KAgwCDgAdAAAXIiYnNTMyPgE3AzMXHgIXMz4DPwEzAw4DhyUuAzgVKiIIzYBiBw8QBQUECgsMBFB8sA8lMUO2CwFXFiYXAg78ETQ3Fg8mKCYO/f4NKkw6IQAAAAIABf9KAgwC0wAdACIAABciJic1MzI+ATcDMxceAhczPgM/ATMDDgMTNzMXB4clLgM4FSoiCM2AYgcPEAUFBAoLDARQfLAPJTFDHlF/AWy2CwFXFiYXAg78ETQ3Fg8mKCYO/f4NKkw6IQMFhAOBAAADAAX/SgIMAtMAHQAhACUAABciJic1MzI+ATcDMxceAhczPgM/ATMDDgMDNTMVMzUzFYclLgM4FSoiCM2AYgcPEAUFBAoLDARQfLAPJTFDPm1ebrYLAVcWJhcCDvwRNDcWDyYoJg79/g0qTDohAxpvb29vAAEAGAAAAd8CDgAJAAAzNQEjNSEVASEVGAEK+QGr/vUBFjkBcWQ4/o5kAAAAAQBN/0oCFwIOACoAAAUiLgE9ATMUHgEzMj4BPQEjDgIjIiY1ETMRFB4CMzI+ATURMxEUDgIBIT1gNncZKRgrOBwFES47JUxheg0YIhUjNiB7ID5ctiBBMgoVGQsfPy8fFSIUU2QBSP7OGyYXCiE7JwER/jE9XD0fAAAAAAIATf9KAhcC0wAqAC8AAAUiLgE9ATMUHgEzMj4BPQEjDgIjIiY1ETMRFB4CMzI+ATURMxEUDgIDNzMXBwEhPWA2dxkpGCs4HAURLjslTGF6DRgiFSM2IHsgPlxsUX8BbLYgQTIKFRkLHz8vHxUiFFNkAUj+zhsmFwohOycBEf4xPVw9HwMFhAOBAAAAAwBN/0oCFwLTACoALgAyAAAFIi4BPQEzFB4BMzI+AT0BIw4CIyImNREzERQeAjMyPgE1ETMRFA4CAzUzFTM1MxUBIT1gNncZKRgrOBwFES47JUxheg0YIhUjNiB7ID5cyG1ebrYgQTIKFRkLHz8vHxUiFFNkAUj+zhsmFwohOycBEf4xPVw9HwMab29vbwAAAwAn//QCLwLTAA8AIQAmAAAFIi4BNTQ+ATMyHgEVFA4BJzI+AT0BNC4BIyIOAR0BFB4BAzczFwcBK1Z0Ojp0VldzOjpzVzA7Gxs7MDA7Gxs7Ah1zAy4MO3peX3k7O3lfXno7ZCVLOA44SyUlSzgOOEslAfeEBn4AAQAOAAACTQLbACsAADMRIzUzNTQ+ATMyHgEXFSMiBh0BMzU0PgEzMh4BFxUjIgYdATMVIxEjESMRWkxMFzo0Dx8cCjIWF6AYOjQOHxwKMhYXX196oAGqZEMjPygEBwRVFxY8QyM/KAQHBFUXFjxk/lYBqv5WAAAAAwAOAAADCALbACsALwAzAAAzESM1MzU0PgEzMh4BFxUjIgYdATM1ND4BMzIeARcVIyIGHQEzFSMRIxEjEQE1MxUDETMRWkxMFzo0Dx8cCjIWF6AYOjQOHxwKMhYXX196oAG6enp6AapkQyM/KAQHBFUXFjxDIz8oBAcEVRcWPGT+VgGq/lYCX3R0/aECDv3yAAAAAAIADgAAAwgC2wArAC8AADMRIzUzNTQ+ATMyHgEXFSMiBh0BMzU0PgEzMh4BFxUjIgYdATMVIxEjESMRIREzEVpMTBc6NA8fHAoyFhegGDo0Dh8cCjIWF19feqABunoBqmRDIz8oBAcEVRcWPEMjPygEBwRVFxY8ZP5WAar+VgLT/S0AAAMADgAAAe4C2wAXABsAHwAAMxEjNTM1ND4BMzIeARcVIyIGHQEzFSMREzUzFQMRMxFaTEwXOjQPHxwKMhYXX1+genp6AapkQyM/KAQHBFUXFjxk/lYCX3R0/aECDv3yAAIADgAAAe4C2wAXABsAADMRIzUzNTQ+ATMyHgEXFSMiBh0BMxUjETMRMxFaTEwXOjQPHxwKMhYXX1+gegGqZEMjPygEBwRVFxY8ZP5WAtP9LQAAAAIAJgFKAWsCugAtADoAABMiLgE1ND4CMzU0LgEjIg4BHQEjJjQ1NDYzMh4BHQEUFjsBFQ4BIyImJyMOAScyPgE9ASYOARUUHgGPEzElHjdKLQgWFxYZCk0BSzstOxwPBxUGGREWJQcEEDAPGCISITgiChUBSg8rKSQwGwwgDhcPDRIKCwILAy40GjEiqg0LNgMGFhcVGj8WJhgSAQoaGA0TCwAAAgAiAUoBZgK6AA8AHQAAEyIuATU0PgEzMh4BFRQOAScyNj0BNCYjIgYdARQWxDVJJCRJNTZIJCRINjEgIi8uIiABSihSPz9RJydRPz9SKEFBMQg1Pj00CTFCAAACADL/9AINAroAEwAlAAAFIi4CNTQ+AjMyHgIVFA4CJzI+AT0BNC4BIyIOAR0BFB4BASA4WD4gID5YODhXPiAgPlc4Ly8RES8vLjERETEMIVCJaWmJUCEhUIlpaYlQIWQzZUs0TWczM2VMNExnMwAAAQBhAAACGgKuAA0AADM1MxEjNT4CNzMRMxVipaYeUVQiPJhkAbBLAxciE/22ZAAAAQAzAAACEQK6ACsAADM1ND4CNz4CNTQuASMiDgEdASMuATU0PgEzMh4CFRQOAgcOAgchFTMgNkMiKkouFC0mJjIZegECQ29BRFcxEyE6Ty0XLCEJAUghLUo9NxkfP0ktFSocGS4iKQUUD0pbKyg+Rh0wT0U/IBAgIBBuAAEALP/0AhECugA2AAAFIi4BPQEzFRQWMzI2NTQuASsBNTMyPgE1NC4BIyIOAR0BIzU0PgEzMh4BFRQOAQcVHgEVFA4BASJPbjl8Pjg1QCM5ITk8HjEdGi4dHzAafDpnQkRnOh0yHzVHPWwMM10+DxIyNTI3Ky0SZBYuIyIqFBUrIRAZOVUuK1Q9KDsoDwQQVEQ9WC8AAAAAAQAfAAACHAK6ABsAACE1ITU+AjczDgQHMzU+AzczETMVIxUBTf7SKEQ4FIANKDAwKQzACRIRDgY6VVWZZEKMmlU1cGpbQxCtEystKxT+qWSZAAAAAQAu//QCDgKuACYAAAUiLgE1MxQeATMyPgE1NC4BIyIOAQcnEyEVIQc+AjMyHgEVFA4BAR9IbTx+HDQjIjIdHDIgGCgeC3QcAYr+4AsOJDEgOVw2OmsMNmVGJjkeHj0tKjcbEBkQDwF8b6kKEgwwYkxLajcAAAAAAgAz//QCFgK6ACIAMgAABSIuAjU0PgIzMh4BFSM0LgEjIg4BBz4CMzIeARUUDgEnMj4BNTQuASMiDgEVFB4BAS87XUIiIT9cO0teLHwTKiExMhEBBidAKUhcLDxoSSYxGBgxJiYyGBgyDCJNgV9rkFYmOWA9JDMbNWJECB0YO2ZBRWY3ZCI6IyU5ISE5JiM6IQAAAAEALgAAAhgCrgAQAAAzND4CNyE1IRUOBB0BkylGVi3+qQHqIkhDNR9UoZSCNG9QKWJudn0/MwAAAwAs//QCEwK6ABsAJwAzAAAFIi4BNTQ2Ny4BNTQ+ATMyHgEVFAYHHgEVFA4BJzI2NTQmIyIGFRQWEzI2NTQmIyIGFRQWASBWbDI1Oi8uMmVLS2QzLy87NDJrVjk8PDk5PT05MDc3MDE2Ngw2Wzc4VRcZUTE1VjQ0VjUxURkXVTg3WzZjOTIzODgzMjkBOTMwLzU1LzAzAAACACr/9AINAroAIgAyAAAFIi4BNTMUHgEzMj4BNw4CIyIuATU0PgEzMh4CFRQOAgMyPgE1NC4BIyIOARUUHgEBFkteLHwTKiExMREBBSc/KUhcLTxoQjteQiIhP1w6JjIYGDImJjEYGDEMOWE8JDMbNWNDBx4YO2dARmU3Ik2BX2qRViYBZCE6JSQ5ISI5JCU5IQAAAgA0//QCDwK6ABMAJQAABSIuAjU0PgIzMh4CFRQOAicyPgE9ATQuASMiDgEdARQeAQEiOFg+ICA+WDg4Vz4gID5XOC8vEREvLy4xERExDCFQiWlpiVAhIVCJaWmJUCFkM2VLNE1nMzNlTDRMZzMAAAEAXAAAAhUCrgANAAAzNTMRIzU+AjczETMVXaWmHlFUIjyYZAGwSwMXIhP9tmQAAAEAMwAAAhECugArAAAzNTQ+Ajc+AjU0LgEjIg4BHQEjLgE1ND4BMzIeAhUUDgIHDgIHIRUzIDZDIipKLhQtJiYyGXoBAkNvQURXMRMhOk8tFywhCQFIIS1KPTcZHz9JLRUqHBkuIikFFA9KWysoPkYdME9FPyAQICAQbgABACz/9AIRAroANgAABSIuAT0BMxUUFjMyNjU0LgErATUzMj4BNTQuASMiDgEdASM1ND4BMzIeARUUDgEHFR4BFRQOAQEiT245fD44NUAjOSE5PB4xHRouHR8wGnw6Z0JEZzodMh81Rz1sDDNdPg8SMjUyNystEmQWLiMiKhQVKyEQGTlVLitUPSg7KA8EEFREPVgvAAAAAAEAJwAAAiQCugAbAAAhNSE1PgI3Mw4EBzM1PgM3MxEzFSMVAVX+0ihEOBSADSgwMCkMwAkSEQ4GOlVVmWRCjJpVNXBqW0MQrRMrLSsU/qlkmQAAAAEALv/0Ag4CrgAmAAAFIi4BNTMUHgEzMj4BNTQuASMiDgEHJxMhFSEHPgIzMh4BFRQOAQEfSG08fhw0IyIyHRwyIBgoHgt0HAGK/uALDiQxIDlcNjprDDZlRiY5Hh49LSo3GxAZEA8BfG+pChIMMGJMS2o3AAAAAAIAOv/0Ah0CugAiADIAAAUiLgI1ND4CMzIeARUjNC4BIyIOAQc+AjMyHgEVFA4BJzI+ATU0LgEjIg4BFRQeAQE2O11CIiE/XDtLXix8EyohMTIRAQYnQClIXCw8aEkmMRgYMSYmMhgYMgwiTYFfa5BWJjlgPSQzGzViRAgdGDtmQUVmN2QiOiMlOSEhOSYjOiEAAAABADYAAAIgAq4AEAAAMzQ+AjchNSEVDgQdAZspRlYt/qkB6iJIQzUfVKGUgjRvUClibnZ9PzMAAAMAMf/0AhgCugAbACcAMwAABSIuATU0NjcuATU0PgEzMh4BFRQGBx4BFRQOAScyNjU0JiMiBhUUFhMyNjU0JiMiBhUUFgElVmwyNTovLjJlS0tkMy8vOzQya1Y5PDw5OT09OTA3NzAxNjYMNls3OFUXGVExNVY0NFY1MVEZF1U4N1s2YzkyMzg4MzI5ATkzMC81NS8wMwAAAgAq//QCDQK6ACIAMgAABSIuATUzFB4BMzI+ATcOAiMiLgE1ND4BMzIeAhUUDgIDMj4BNTQuASMiDgEVFB4BARZLXix8EyohMTERAQUnPylIXC08aEI7XkIiIT9cOiYyGBgyJiYxGBgxDDlhPCQzGzVjQwceGDtnQEZlNyJNgV9qkVYmAWQhOiUkOSEiOSQlOSEAAAIAKv/0ATcBaAAPAB0AABciLgE1ND4BMzIeARUUDgEnMjY9ATQmIyIGHQEUFrEpPSEhPSkpPCEhPCkgFRUgIRQUDCJSRkdRIiJRR0ZSIkQwOBs4MTA4GzgxAAAAAQBAAAABLAFhAA0AADM1MzUjNT4CNzMRMxVAVFQRKywRKEtFwjICCxEK/uRFAAAAAQAzAAABMgFoACYAADM1ND4BNz4BNTQmIyIOAR0BIy4BNTQ+ATMyHgEVFA4CBw4BBzMVMxsrFyAzFBkRFgtLAQIkPCMwMxQSHyUTDRoLnRkeLSQRGC8fDhoLFBAUBA8IJS4WJDIWGyoiHQ0KEgpFAAEAL//0ATIBaAA1AAAXIiY9ATMVFBYzMj4BNTQuASsBNTMyPgE1NC4BIyIOAR0BIzU0PgEzMh4BFRQGBxUeARUUDgGyP0RNGxkQFw0PGg8fIQ4VDAsUDQ0VDE0gNyMlNx8dGBwgITkMPDMIChYXChQQExMIQgkUDw8TCAkTDgoOHy4ZFy4hHCQMBAorICEvGQAAAAABACgAAAE2AWgAGAAAMzUjNT4BNzMOAwczNT4CNzMVMxUjFcCYHSsQUgcZHBsKTwYMDAQrKSlKPC9yQSBCPTAOOg0fIBCWQUoAAAAAAQAw//QBMQFcACAAABciJjUzFB4BMzI2NTQmIyIGByc3MxUjBz4BMzIeARUUBrE6R04NFw8XGxwWEBgIRQ7VkwUKHxMfMR5FDD43EBgNHx8dGgwLCcFFPQYJGjQpPUEAAgAo//QBOgFoABsAJwAAFyIuATU0PgEzMhYVIzQmIyIGBz4BMzIeARUUBicyNjU0JiMiBhUUFrQtPyAgPy1BOEwWGiYSAQwoGSk0GEs8GhwcGhocHAwgTUNKViRBLxUbOS4OEx41IjdCQSEWGh0dGxYgAAABAC8AAAE1AVwADwAAMzQ+ATcjNSEVDgIVHAEVYxw0IqYBBhw9KTZgWShFNCFUXjMIEggAAwAu//QBMgFoABsAJwAzAAAXIi4BNTQ2Ny4BNTQ+ATMyHgEVFAYHHgEVFA4BJzI2NTQmIyIGFRQWNzI2NTQmIyIGFRQWsC46GhkcFhcbNygoNhsXFxwbGzkuGRsbGRobGxoXFRUXFxYWDB0xHhssDQ4oFh0vHBwvHRYoDg0sGx4xHUAZFhcYGBcWGZ0YExQYGBQTGAAAAAACACj/9AE6AWgAGwAnAAAXIiY1MxQWMzI2Nw4BIyIuATU0NjMyHgEVFA4BJzI2NTQmIyIGFRQWrUE4TBcZJhIBDCkZKDMYSzouPyAgPy0aHBwaGhwcDEEvFRs5Lg8SHjQhOEMgTUNKViTFHRsXHyAXGR4AAAIAKgFIATcCvAAPAB0AABMiLgE1ND4BMzIeARUUDgEnMjY9ATQmIyIGHQEUFrEpPSEhPSkpPCEhPCkgFRUgIRQUAUgiUkZHUSIiUUdGUiJEMDgbODEwOBs4MQAAAQBAAVQBLAK1AA0AABM1MzUjNT4CNzMRMxVAVFQRKywRKEsBVEXCMgILEQr+5EUAAQAzAVQBMgK8ACYAABM1ND4BNz4BNTQmIyIOAR0BIy4BNTQ+ATMyHgEVFA4CBw4BBzMVMxsrFyAzFBkRFgtLAQIkPCMwMxQSHyUTDRoLnQFUGR4tJBEYLx8OGgsUEBQEDwglLhYkMhYbKiIdDQoSCkUAAAABAC8BSAEyArwANQAAEyImPQEzFRQWMzI+ATU0LgErATUzMj4BNTQuASMiDgEdASM1ND4BMzIeARUUBgcVHgEVFA4Bsj9ETRsZEBcNDxoPHyEOFQwLFA0NFQxNIDcjJTcfHRgcICE5AUg8MwgKFhcKFBATEwhCCRQPDxIJCRMOCg4fLhkYLSEcJAwECisgIDAZAAAAAQAoAVQBNgK8ABgAABM1IzU+ATczDgMHMzU+AjczFTMVIxXAmB0rEFIHGRwbCk8GDAwEKykpAVRKPC9yQSBCPTAOOg0fIBCWQUoAAAEAMAFIATECsAAgAAATIiY1MxQeATMyNjU0JiMiBgcnNzMVIwc+ATMyHgEVFAaxOkdODRcPFxscFhAYCEUO1ZMFCh8THzEeRQFIPjcQGA0fHx0aDAsJwUU9BgkaNCk9QQAAAAACACgBSAE6ArwAGwAnAAATIi4BNTQ+ATMyFhUjNCYjIgYHPgEzMh4BFRQGJzI2NTQmIyIGFRQWtC0/ICA/LUE4TBYaJhIBDCgZKTQYSzwaHBwaGhwcAUggTUNKViRBLxUbOS4OEx41IjdCQSEWGh0dGxYgAAEALwFUATUCsAAPAAATND4BNyM1IRUOAhUcARVjHDQipgEGHD0pAVQ2YFkoRTQhVF4zCBIIAAAAAwAuAUgBMgK8ABsAJwAzAAATIi4BNTQ2Ny4BNTQ+ATMyHgEVFAYHHgEVFA4BJzI2NTQmIyIGFRQWNzI2NTQmIyIGFRQWsC46GhkcFhcbNygoNhsXFxwbGzkuGRsbGRobGxoXFRUXFxYWAUgdMR4bLA0OKBYdLxwcLx0WKA4NLBseMR1AGRYXGBgXFhmdGBMUGBgUExgAAAACACgBSAE6ArwAGwAnAAATIiY1MxQWMzI2Nw4BIyIuATU0NjMyHgEVFA4BJzI2NTQmIyIGFRQWrUE4TBcZJhIBDCkZKDMYSzouPyAgPy0aHBwaGhwcAUhBLxUbOS4PEh40IThDIE1DSlYkxR0bFx8gFxkeAAEAQAG4ASwDGQANAAATNTM1IzU+AjczETMVQFRUESssEShLAbhFwjICCxEK/uRFAAEAMwG4ATIDIAAmAAATNTQ+ATc+ATU0JiMiDgEdASMuATU0PgEzMh4BFRQOAgcOAQczFTMbKxcgMxQZERYLSwECJDwjMDMUEh8lEw0aC50BuBkeLSQRGC8fDhoLFBAUBA8IJS4WJDIWGyoiHQ0KEgpFAAAAAQAvAawBMgMgADUAABMiJj0BMxUUFjMyPgE1NC4BKwE1MzI+ATU0LgEjIg4BHQEjNTQ+ATMyHgEVFAYHFR4BFRQOAbI/RE0bGRAXDQ8aDx8hDhUMCxQNDRUMTSA3IyU3Hx0YHCAhOQGsPDMIChYXChQQExMIQgkUDw8SCQkTDgoOHy4ZGC0hHCQMBAorICAwGQAAAAH/Gf/0AY8CugADAAAHATMB5wIiVP3eDALG/ToAAAAAAwBA//QDFwK6AAMAKgA4AAAXATMBJTU0PgE3PgE1NCYjIg4BHQEjLgE1ND4BMzIeARUUDgIHDgEHMxUBNTM1IzU+AjczETMVcAIiVP3eAVQbKxcgMxQZERYLSwECJDwjMDQTEh8lEw0aC539KVRUESssEShLDALG/ToMGR4tJBEYLx8OGgsUEBQEDwglLhYkMhYbKiIdDQoSCkUBVEXCMgILEQr+5EUAAwBA//QDBwK6AAMAEQAqAAAXATMBAzUzNSM1PgI3MxEzFQE1IzU+ATczDgMHMzU+AjczFTMVIxVwAiJU/d6EVFQRKywRKEsBZZgdKxBSBxkcGwpPBgwMBCspKQwCxv06AWBFwjICCxEK/uRF/qxKPC9yQSBCPTAOOg0fIBCWQUoAAAAAAwAv//QDBwK8AAMAOQBSAAAXATMBAyImPQEzFRQWMzI+ATU0LgErATUzMj4BNTQuASMiDgEdASM1ND4BMzIeARUUBgcVHgEVFA4BATUjNT4BNzMOAwczNT4CNzMVMxUjFXACIlT93hI/RE0bGRAXDQ8aDx8hDhUMCxQNDRUMTSA3IyU3Hx0YHCAhOQG5mB0rEFIHGRwbCk8GDAwEKykpDALG/ToBVDwzCAoWFwoUEBMTCEIJFA8PEgkJEw4KDh8uGRgtIRwkDAQKKyAgMBn+uEo8L3JBIEI9MA46DR8gEJZBSgAAAQBWAAAA1QCAAAMAADM1MxVWf4CAAAAAAQBP/10A1QCAAAwAABc1PgI1IzUzFRQOAU8ZHg8+fiU9ozMEIDAcgHU6SCUAAAAAAgBpAAAA5wIOAAMABwAAEzUzFQM1MxVpfn5+AY6AgP5ygIAAAgBj/10A6QIOAAwAEAAAFzU+AjUjNTMVFA4BAzUzFWMYHw8+fiU9HH6jMwQgMByAdTpIJQIqgIAAAAAAAwBWAAADbgCAAAMABwALAAAzNTMVMzUzFTM1MxVWfs9+zn+AgICAgIAAAAACAEsAAADZAq4AAwAHAAA3AzMDBzUzFWwhjiFlf70B8f4PvYCAAAAAAgBL/18A2QINAAMABwAAFxMzEwM1MxVLIUwhhn+hAfH+DwIugIAAAAIAQQAAAhwCugAtADEAADc1ND4ENTQuAiMiDgIVHAEXIy4BNTQ+AzMyHgMVFA4EHQEHNTMV9BglKiUYBhQqJCUtFggBfAEDFCc8TzIpRzcnFRoqLioaeH7ALyk4KR8gJhoKHRwTFiEjDgcNBwURDSI9MyUVDx0rOCMuQC0jIioeIMCAgAAAAAACAEv/VAImAg4ALQAxAAAFIi4DNTQ+BD0BMxUUDgQVFB4CMzI+AjU0JjUzHgEVFA4DAzUzFQEuKUc3JxUaKi4qGnIYJSolGAYUKiQlLRYIAXwCAhQnPE9lfqwPHSs5Ii5ALSMiKh4gLyg5KR8gJRsKHRwTFiEkDQkOBAYUCSI9MyUVAjqAgAAAAQBnASUA5gGlAAMAABM1MxVnfwElgIAAAQBRANQBWAHbAA8AADciLgE1ND4BMzIeARUUDgHUJjsiIjsmJzsiIjvUIjsmJzsiIjsnJjsiAAABACMBSQF0Aq8AEQAAEzcHJzcnNxcnMwc3FwcXBycXpgtoJnNzJmgLSwtoJnR0JmgLAUmFTEI4OUFMhYVMQTk4QkyFAAIAGP/0Ai8CugAbAB8AABc3IzUzNyM1MzczBzM3MwczFSMHMxUjByM3IwcTMzcjNyVEWRtGWytkKngqZSpMYBxOYiZlJnklOXkceQy0YoViycnJyWKFYrS0tAEWhQAAAAEAAP/PASoC3wADAAAVEzMD0ljSMQMQ/PAAAAABAAD/zwEqAt8AAwAABSMDMwEqWNJYMQMQAAAAAQAMAUIAiwGxAAMAABM1MxUMfwFCb28AAQAmAUIAmwGxAAMAABM1MxUmdQFCb28AAQBA/2MBOQLgAA8AABcuATU0NjczDgIVFB4BF+pSWFhSTyY+IyM+Jp1d53x66Fs9k59OTqGUPQABACz/YgElAt8ADwAAEx4BFRQGByM+AjU0LgEne1NXV1NPJz0jIz0nAt9d53x651w9k59OT6CUPQAAAAABACv/YQFSAt8AKAAABSIuAj0BNC4BIzUyPgE9ATQ+AjMVIg4BDwEOASMVMh4BHwEeAjMBUi1LNh0cKhYWKhwdNkstFSwfAQcBND8qMhcBBwEeLBafCx87L8IXGgtaCxsWwi87HwtHChsbxzM5ChowIscaHAoAAAABADj/YQFfAt8AKAAAEzIeAh0BFB4BMxUiDgEdARQOAiM1Mj4BPwE+ATM1Ii4BLwEuAiM4LUs2HRwrFRUrHB02Sy0VLB8BBwIzPyoyFwEHAR4rFwLfCx87L8IWGwtaCxoXwi87HwtHChwaxzM5ChowIscbGwoAAAABAG3/XwE8At8ABwAAFxEzFSMRMxVtz2dnoQOAVv0sVgAAAAABABf/XwDmAt8ABwAAExEjNTMRIzXmz2dnAt/8gFYC1FYAAAABACgA1gElAUYAAwAANzUzFSj91nBwAAABACgA1gElAUYAAwAANzUzFSj91nBwAAABAAAA4QH0ATwAAwAAPQEhFQH04VtbAAABAAAA4QPoATwAAwAAPQEhFQPo4VtbAAABAAD/awH7/78AAwAAFTUhFQH7lVRUAAABAEn/XQDPAIAADAAAFzU+AjUjNTMVFA4BSRgfDj5/Jj2jMwQgMByAdTpIJQAAAAACAEn/XQGZAIAADAAZAAAXNT4CNSM1MxUUDgEXNT4CNSM1MxUUDgFJGB8OPn8mPacYHw4+fyY9ozMEIDAcgHU6SCUHMwQgMByAdTpIJQAAAAIASQGLAZkCrgAMABkAAAEVDgIVMxUjNTQ+AScVDgIVMxUjNTQ+AQGZGB4PPn8mPacYHg8+fyY9Aq4zBCAwHIB1O0cmBjMEIDAcgHU7RyYAAgBJAYsBmQKuAAwAGQAAEzU+AjUjNTMVFA4BFzU+AjUjNTMVFA4BSRgfDj5/Jj2nGB8OPn8mPQGLMwQgMByAdTpIJQczBCAwHIB1OkglAAABAEkBiwDPAq4ADAAAExUOAhUzFSM1ND4BzxgeDz5/Jj0CrjMEIDAcgHU7RyYAAAABAEkBiwDPAq4ADAAAEzU+AjUjNTMVFA4BSRgfDj5/Jj0BizMEIDAcgHU6SCUAAAACAEQAfgIEAg4ABQALAAA3JzczBxczJzczBxfSjo5bc3N8jo5bc3N+yMjIyMjIyMgAAAAAAgA3AH4B9wIOAAUACwAAARcHIzcnIxcHIzcnAWmOjltzc3yOjltzcwIOyMjIyMjIyMgAAAEARAB+AS0CDgAFAAA3JzczBxfSjo5bc3N+yMjIyAAAAQA3AH4BIAIOAAUAABMXByM3J5KOjltzcwIOyMjIyAACAD4BlwGEAq4ABQALAAATJzUzFQczJzUzFQdOEIAXbRCAFwGXhJOThISTk4QAAAABAD4BlwC+Aq4ABQAAEyc1MxUHThCAFwGXhJOThAAAAAIAM//PAggC0wADACgAAAURMxEnIi4BNTQ+ATMyHgIVIzQuASMiDgEdARQeATMyPgE1MxQOAgENMxhSbTY3bVE1UjsefBYtIyk0GRk2LCItGHYeOlMxAwT8/HU7el5feTsaNU40JTAZJks5DThMJRkyIzFONhwAAAIAJgBjAhoCWwAjADMAADcnNy4BNTQ2Nyc3Fz4BMzIWFzcXBx4BFRQGBxcHJw4BIyImJzcyPgE1NC4BIyIOARUUHgFULTYZGRkZNzA5HUwoKE0cOTA3GhgYGjYtNx5OKShPHpUuSSwsSi0tSiwsSmMtOCBOKSlQHTYwOBkaGhk4MDYdUCkpTiA4LTocGxscGC9OLS1MLy9MLS1OLwAAAAACACj/zwH3AtMAAwBGAAAXETMRJyIuAjU0NjUzHAEVHgIzMj4BNTQuAScuAzU0PgIzMh4CFRQGFSM1NC4BIyIOAhUUHgEXHgMVFA4C+DMdOVY6HQF4ASA0HRovHyhBJSFCNSEiPFIwL005HwF3FysgGCQXDB4zHiRMQSgjP1UxAwT8/HUZLDsjBQgCAgQCGyEOCxkUGhwSCgkWIjYoJzonFBQlNSAHDgEHExsQCA4SCxMWEAkKFSA6MC5BJxIAAAABABn/9AIWAroANwAABSIuAicjNTMmNDU8ATcjNTM+AzMyFhcVLgEjIg4BBzMVIwYUFRwBFzMVIx4CMzI2NxUOAQGqP2pVOw9JPQEBPUkPO1VqPxw3GRQsFzJWQBLp+wEB++kSQFYyFywUGTcMIUBaOUwIEgkJEQlMOVo/IggIYgcHIUAvTAgSCQkSCEwuQSEHB2IICAAAAAEAGAAAAhICugAhAAAzNTM1IzUzNTQ+ATMyHgEdASM1NC4BIyIOAR0BMxUjByEVJUJPTzNgQ0FfNXoWKB0dKRWfoAwBN2a7ZG5DWCwqVUMNER0oFRQmG3xku2YAAQAKAAACMgKuACUAADM1IzUzNSM1My4BLwEzFx4CFzM+Aj8BMwcOAQczFSMVMxUjFePAwMCaBRcLjIxkCQ8MBAUEDA8IYISEDRgGl729vZZMRkwKJBP5whEfGQgIGiAPwvAWKAxMRkyWAAAAAf8K//QBgAK6AAMAAAcBMwH2AiJU/d4MAsb9OgAAAAABAFIAAAIqAf8ACwAAITUjNTM1MxUzFSMVAQ27u2G8vM5iz89izgAAAQBSAM8CKgExAAMAADc1IRVSAdjPYmIAAQBnACcCFgHXAAsAADcnNyc3FzcXBxcHJ6xFkpJEk5NFlJNFkidGkpJFkpNGk5FFkgAAAAMAUgABAioCAAADAAcACwAANzUhFQU1MxUDNTMVUgHY/tpycnLOY2PNa2sBlGtrAAIAUgBjAioBmQADAAcAABM1IRUFNSEVUgHY/igB2AE3YmLUYWEAAAABAFsAAwI1AgUABgAANzUtATUFFVsBe/6FAdoDbZSTbsV5AAABAEcAAwIhAgUABgAALQE1JRUNAQIh/iYB2v6FAXsDxHnFbpOUAAAAAgBSAAACKgKNAAsADwAAJTUjNTM1MxUzFSMVBTUhFQENu7thvLz+5AHYjs5iz89izo5iYgAAAAABAEMAywI5AY4AGwAANzU+AjMyHgIzMj4BNxUOAiMiLgIjIg4BQwspOiMdMzI1HR84LQ0KKjkkHDQyNR0fOC3LbxAhFxIYEhciD28PIhcSGBIXIQABAEMAwgIvAcYABQAAJTUhNSERAdH+cgHswqRg/vwAAAEAbAEmAhACrgAGAAAbATMTIwsBbJxrnWhraQEmAYj+eAEc/uQAAAABAEH/RwIKAg4AHQAAFxEzERQeAjMyPgE1ETMRIycjDgIjIiYnHgEdAUF6DRkkFiE1H3pmCgcOKTIfGSwRBAK5Asf+sxwlFwogOSQBMv3yRholEw4PES0XdQAAAAUAWf/0A24CugADABMAIgAyAEEAADMBMwEDIi4BNTQ+ATMyHgEVFA4BJzI2PQE0LgEjIgYdARQWASIuATU0PgEzMh4BFRQOAScyNj0BNC4BIyIGHQEUFroB9mH+CB0ySicnSjIzSCcnSDMpGgsdGygbGwH4MkknJ0kyM0kmJkkzKRoLHBwoGhoCrv1SAVEhTkVGTiEhTkZFTyBKNi4NHi0ZNy0NLjb+WSFORUZOISFORkVPIEo3LgweLRk3LQwuNwAAAAABAEL/MAGzAsYACQAAFxEHNTczFxUnEdCOrhWujtAC0TQ0xcU0NP0vAAAAAAEAQv8wAbICxgAJAAAXJzUXETMRNxUH8K6NVo2t0MU1NQLR/S81NcUAAAAAAgAt/2cDuQK6AFgAZgAABSIuATU0PgIzMh4CFRQOAyMiLgEnIw4CIyIuAjU0PgIzNTQuASMiDgEdASMmNDU0PgEzMh4BHQEUFjMyPgE1NC4BIyIOARUUFjMyPgE3FQ4CAzI+Aj0BIg4BFRQeAQHahMFoSoKpX1+gd0IeMT5BHSwxFgIFECo4JRQzLx8rT2xADCEhICUObAEwVzlBUykYEx46J1yhanetXqqyG0lFFRhGRxQdKRwNMVIyDx+ZV7iQeKZnLytaj2VEZUUqExoeBhMdDwobNisxQCYQKBQhExAZDA0FCQYpPCAjQzDhFxInX1Nrhj9QonurqwkOCU0IDAcBBhEeLBsRDCIgEhkOAAABADX/9AKwAroAOgAABSIuATU0Njc1LgE1ND4BMzIeAR0BIzU0LgEjIg4CFRQeATsBFSMiDgEVFB4BMzI+AT0BMxUjFRQOAQFGUHtGTTozREN5UE10QnohPiwhNSQTITYfQ0AjPyYkQy8xQCDWXD14DC9YPUdREAQWREA9VCsuVTkZECErFQ0aJhkgLBZkESwqJS8XGTIjyGRhQGA1AAAAAQAt/1gCKwKuABEAAAURIi4BNTQ+ATMhFSMRIxEjEQEEN2I+QW9EAQo9VEKoAaUvYEhQYCo9/OcDGfznAAAAAAIANv9KAg4CugBNAF0AAAUiLgI1NDY1MxUUHgIzMj4BNTQuBTU0PgE3LgE1ND4CMzIeAhUUBhUjNTQuAiMiDgEVFB4FFRQOAQceARUUDgITPgE1NC4CJw4BFRQeAgEbL045HwF9CxgjGCIpFCQ7R0Y7JBYnGh8oIT1TMi9OOR8BfQwXIxgiKhMkO0dGOyQWJxofKCE9UxsUGiA3QiMTGSA2QrYUJjUgCA0BBA8YEQkTHRAXIx0cIi0+KhwxKRAWPy4nOigUFCY1IAcOAQUOFxEJEh0QFyMdHCItPiocMSkQFkAtJzooFAFMDCETICwhGw8MIBQfLiIbAAAAAAMAG//0AuECugATADUARQAABSIuAjU0PgIzMh4CFRQOAiciLgE1ND4BMzIeARUjNC4BIyIGHQEUHgEzMj4BNTMUDgEHMj4BNTQuASMiDgEVFB4BAX5Ngl81NV+CTU2CXzU1X4JNPU8mJk89OUYgSw8kITUxFi0jICcRRyBFOlaFTEyFVlaGTEyGDDVfgk1Ngl81NV+CTU2CXzWQLV1ISF0tJUk1IywVREUUMD0cFy0gK0ouV02HVlaGTU2GVlaHTQAAAAAEABv/9ALhAroAEwAjADEAOgAABSIuAjU0PgIzMh4CFRQOAicyPgE1NC4BIyIOARUUHgEnETMyFhUUBgcXIycjFTUzMjY1NCYrAQF+TYJfNTVfgk1Ngl81NV+CTVaFTEyFVlaGTEyGPcBAQCMjV1FOZ2sbIyEdaww1X4JNTYJfNTVfgk1Ngl81OU2HVlaGTU2GVlaHTV0BnEU4KD0Qqp2d3SMfHx8AAAACAFABGAOJAq4ADwAXAAABETMTMxMzESMRIwMjAyMRJREjNSEVIxEB3nBjBWVuSgRmSGcE/rmLAWCLARgBlv7NATP+agEw/tABNf7LAQFPRkb+sQACADMBjwFeAroADwAbAAATIi4BNTQ+ATMyHgEVFA4BJzI2NTQmIyIGFRQWyClEKChEKSpEKChEKiAsLCAfLS0BjyhEKSpEKChEKilEKEktHyAsLCAfLQAAAQAkAgUAqwLBAAQAABM3MxcHJBJ0AUACBbwDuQAAAAACACQCBQFPAsEABAAJAAATNzMXBzM3MxcHJBJ0AUBdEnQBQAIFvAO5vAO5AAEATP9AAKkC0wADAAAXETMRTF3AA5P8bQAAAAACAEz/QACpAtMAAwAHAAATETMRAxEzEUxdXV0BWQF6/ob95wF6/oYAAQAAAiIAgAMMAAsAABE1MjY1IzUzFRQOASAfOHkkOgIiMycYeF4yPhwAAAACAAACZAE5AtMAAwAHAAARNTMVMzUzFW1ebgJkb29vbwAAAAADAAACZAE5A4EAAwAHAAwAABE1MxUzNTMVJyMnNzNtXm5YZWwBfwJkb29vb5mBAwADAAACZAE5A4EAAwAHAAwAABE1MxUzNTMVJzczFwdtXm7dUX8BbAJkb29vb5mEA4EAAAAAAwAAAmQBOQNqAAMABwALAAARNTMVMzUzFSU1IRVtXm7+ywExAmRvb29vs1NTAAAAAQAAAk8A0QLTAAQAABMjJzcz0WVsAX8CT4EDAAEAAAJPANEC0wAEAAARNzMXB1F/AWwCT4QDgQABAAACXgFNAtMAFwAAETQ+ATMyHgEzMjY3MxQOASMiLgEjIgYHEyohGi0sFw4RAkQTKSIZLisXDRICAl4gNSAREg8UHzUhEhIQFAAAAgAAAl4BTQNgABcAGwAAETQ+ATMyHgEzMjY3MxQOASMiLgEjIgYHJzUhFRMqIRotLBcOEQJEEykiGS4rFw0SAjcBMQJeIDUgERIPFB81IRISEBSvU1MAAAEAAAJpATECvAADAAARNSEVATECaVNTAAEAAAJPAL0C3wAYAAATNTMyNjU0JisBNT4CMzIeAhUUDgEHFTANEQ4REDsMHBwMESYhFRYjFAJPOAkKCwcrAwMCBQ0YExMYDAIaAAABAAD/PAB4/7AAAwAAFTUzFXjEdHQAAAACAAACZAE5AtMAAwAHAAARNTMVMzUzFW1ebgJkb29vbwAAAAABAAACTwDRAtMABAAAEyMnNzPRZWwBfwJPgQMAAQAAAk8A0QLTAAQAABE3MxcHUX8BbAJPhAOBAAEAAAJPAUUC0wAHAAARNzMXIycXB2pyaWpUOFUCT4SEaQFoAAIAAAJDAMgDCgALABcAABMiJjU0NjMyFhUUBicyNjU0JiMiBhUUFmQrOTkrLDg4LBQaGhQUGhoCQzgrLDg4LCs4NRoUFBsbFBQaAAABAAACXgFNAtMAFwAAETQ+ATMyHgEzMjY3MxQOASMiLgEjIgYHEyohGi0sFw4RAkQTKSIZLisXDRICAl4gNSAREg8UHzUhEhIQFAAAAQAAAmkBMQK8AAMAABE1IRUBMQJpU1MAAQAA/0oA6AALABcAABciJic1MzI2NTQmKwE3MwceAhUUDgJlGTYWXBQXERgsDk4GGiwaGigttgQEMQoODAxYLQEPHBcZIBEHAAAAAAIAAAL1ATgDZAADAAcAABE1MxUzNTMVbV5tAvVvb29vAAAAAAMAAAL1ATgEEgADAAcADAAAETUzFTM1MxUnIyc3M21ebVxqbAGEAvVvb29vmYEDAAMAAAL1ATgEEgADAAcADAAAETUzFTM1MxUnNzMXB21ebdZRhAFsAvVvb29vmYQDgQAAAAADAAAC9QE4A/YAAwAHAAsAABE1MxUzNTMVJTUhFW1ebf7LATEC9W9vb2+uU1MAAAABAAAC4ADWA2QABAAAEyMnNzPWamwBhALggQMAAQAAAuAA1gNkAAQAABE3MxcHUYQBbALghAOBAAEAAAL0AU0DaQAXAAARND4BMzIeATMyNjczFA4BIyIuASMiBgcTKiEaLSwXDhECRBMpIhkuKxcNEgIC9CA1IBESDxQfNSESEhAUAAACAAAC9AFNA+wAFwAbAAARND4BMzIeATMyNjczFA4BIyIuASMiBgcnNSEVEyohGi0sFw4RAkQTKSIZLisXDRICNwExAvQgNSAREg8UHzUhEhIQFKVTUwAAAQAAAvUBMQNIAAMAABE1IRUBMQL1U1MAAQAAAuAAvQNwABgAABM1MzI2NTQmKwE1PgIzMh4CFRQOAQcVMA0RDhEQOwwcHAwRJiEVFiMUAuA4CQoLBysDAwIFDRgTExgMAhoAAAIAAAL1ATgDZAADAAcAABE1MxUzNTMVbV5tAvVvb29vAAAAAAEAAALgANYDZAAEAAATIyc3M9ZqbAGEAuCBAwABAAAC4ADWA2QABAAAETczFwdRhAFsAuCEA4EAAQAAAuABTwNkAAcAABE3MxcjJxcHanxpb1Q4VQLghIRpAWgAAgAAAtkA0gOgAAsAFwAAEyImNTQ2MzIWFRQGJzI2NTQmIyIGFRQWaS47Oy4uOzsuFBoaFBQaGgLZOCssODgsKzg4GBMTGRkTExgAAAEAAAL0AU0DaQAXAAARND4BMzIeATMyNjczFA4BIyIuASMiBgcTKiEaLSwXDhECRBMpIhkuKxcNEgIC9CA1IBESDxQfNSESEhAUAAABAAAC9QExA0gAAwAAETUhFQExAvVTUwABAAAC4ACXA2QABAAAETczFwcceAMtAuCEBn4AAQAAAk8AkwLTAAQAABE3MxcHHXMDLgJPhAZ+AAMAM//PAggC0wADAAcALAAAATUzFQM1MxUnIi4BNTQ+ATMyHgIVIzQuASMiDgEdARQeATMyPgE1MxQOAgENMzMzGFJtNjdtUTVSOx58Fi0jKTQZGTYsIi0Ydh46UwIyoaH9nampdTt6Xl95Oxo1TjQlMBkmSzkNOEwlGTIjMU42HAAAAAMAKP/PAfcC0wADAAcASgAAEzUzFQM1MxUnIi4CNTQ2NTMcARUeAjMyPgE1NC4BJy4DNTQ+AjMyHgIVFAYVIzU0LgEjIg4CFRQeARceAxUUDgL4MzMzHTlWOh0BeAEgNB0aLx8oQSUhQjUhIjxSMC9NOR8BdxcrIBgkFwweMx4kTEEoIz9VAjWenv2apqZ1GSw7IwUIAgIEAhshDgsZFBocEgoJFiI2KCc6JxQUJTUgBw4BBxMbEAgOEgsTFhAJChUgOjAuQScSAAAAAAAAJABKAHoAugDuASABTgGUAdoCDAJGAngCyALwAx4DNANUA3gDmgO4A8wECAQgBCwEQgRcBHQEiASoBMIE0gUQBTgFgAW4BfgGPAaABsAHAgdaB6AHxAfqCCoIUgimCLgI2gkECTIJXgmICagJ6goGCh4KPgpUCo4K0AsQC2gLyAwsDI4M7g1kDdwOUA6MDsIPFg9SD6QP3hAgEGYQqhDsERARghGqEb4RyhHgEfoSEhImEjoSXBJ4EpASnBLeEwYTThOCE74T/hQ+FHoUthUKFWwVqBXmFiIWQhacFuAXBBcsF1wXkBfCF/IYEBhQGGoYmhjSGQwZIhlgGaYZ7hoqGmYasBryGyIbTBueG8wcBBwcHFocphzQHQwdVh1yHb4eCB5AHlgelh7iHwwfSB+SH64f+iBEIHIgiiDCIQwhMiFiIZwhtiICIjwiaiKCIrwjBiMsI14jmCO0JAAkOiRSJIwk1iTmJTolfCXuJfomEiYkJkImWCZsJoAmxCcIJxQnMCdSJ4InkCeeJ6ontifSJ/AoLChoKHoojCiYKKQosCi8KMgo4CkIKTApWClwKYgpoim8Kcwp3Cn0KgQqBCoEKgQqBCoEKkAqkCrwKzwraiugK7ArxCvQK+osAiwWLCgsPCxYLIIskiymLNQtNi1MLWIt6i46Llou2C86L44vuC/kL/QwCjAYMCwwQjBUMGwwhjCeMKwwujDgMQwxGDE+MUoxXDFqMXgxijGwMdYx4jIIMhoyMjJMMmQycjKAMqYy0jLeMwQzFjMkMzIzRDNqM5AznDOqM7gz+jRgAAAAAQAAAAEAAgAAAnIBLgAAAAACdgAAABIARwCDANwBHwFkAaACBAJpArADCgNYA9cEFARYBHIElATFBOoFEwUqBYoFpAW1Bc8F7wYJBiMGVgZ8Bo4G8gc3B64IBQhjCMgJLwmNCeoKcQreCxcLVQu2C/MMgAyVDMgNAw1EDYgNww3xDmAOiA6oDtAO6w9ID60QDRCXESkRwRJbEuwTphRgFRUVcBXEFkkWpBciF3cX0xg2GJsY9xkyGeMaIRo1GkYaYBqAGpoarhrIGvsbJxtMG10bxxwFHHQcvR0N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AjoATANMAEwC3ABMAtwATAMOAC0DDgAtAw4ALQMOAC0DDgAtAw4ALQMOAC0EsAAtAp4ATAKyAFEDDgAtAs0ATAKbAC0CawAZAtQASALUAEgC1ABIAtQASALUAEgCnwAKA7oACgKuAAsCpQAKAqUACgJ6AB0CnwBKAp8ASgMOAC0CLAAiAiwAIgIsACICLAAiAiwAIgIsACICLAAiA38AIgJQAEECIwAnAiMAJwJQACcCZgAvAjEAJwIxACcCMQAnAjEAJwIxACcBMwAOAk8AEQJIAEEA/ABBAPwAQQD8ADwA/P/aAPz/4AD8AEEA/P/wAPr/4wD6/+MCHwBBAPwAQQNdAEECSABBAkgAQQJWACcCVgAnAlYAJwJWACcCVgAnAlYAJgJWACcDtgAnAlAAQQJQAEECUAAnAWoAQQIdACgCcQBLAToADQJHAD0CRwA9AkcAPQJHAD0CRwA9AhEABQL2AAMCIgAKAhEABQIRAAUCEQAFAf0AGAJkAE0CZABNAmQATQJWACcCTQAOA0kADgNJAA4CLwAOAi8ADgGNACYBhwAiAj8AMgJAAGECQAAzAkAALAJBAB8CPwAuAkAAMwJAAC4CQAAsAj8AKgJDADQCQwBcAkMAMwJDACwCQwAnAkMALgJDADoCQwA2AkMAMQJDACoBZQAqAWUAQAFlADMBZQAvAWUAKAFlADABZQAoAWUALwFlAC4BZQAoAWUAKgFlAEABZQAzAWUALwFlACgBZQAwAWUAKAFlAC8BZQAuAWUAKAFlAEABZQAzAWUALwCn/xkDVwBAA1cAQANXAC8BLABWASwATwFQAGkBUABjA8UAVgEkAEsBJABLAmUAQQJlAEsBTQBnAakAUQGXACMCRwAYASoAAAEqAAAAlwAMAMEAJgFlAEABZQAsAYoAKwGKADgBUwBtAVMAFwFNACgBTQAoAfQAAAPoAAAB+wAAARgASQHiAEkB4gBJAeIASQEYAEkBGABJAjsARAI7ADcBZABEAWQANwG8AD4A9gA+AMgAAADIAAAAzQAAAlgAAAAAAAACQQAzAkQAJgIdACgCRAAZAkQAGAI8AAoAiv8KAnwAUgJ8AFICfABnAnwAUgJ8AFICfABbAnwARwJ8AFICfABDAnwAQwJ8AGwCSwBBA8YAWQH0AEIB9ABCA+YALQLZADUCTgAtAkMANgL8ABsC/AAbA/cAUAGQADMApAAkAUgAJAD1AEwA9QBMAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATkAAADRAAAA0QAAAUUAAADIAAABTQAAATEAAADoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATgAAADWAAAA1gAAAU8AAADSAAABTQAAATEAAACXAAAAkwAAAkEAMwIdACgAAQAAAS4AZwAFAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAB8BegADAAEECQAAAKgDGgADAAEECQABACAC+gADAAEECQACAA4C7AADAAEECQADAEQCqAADAAEECQAEADACeAADAAEECQAFABoCXgADAAEECQAGAC4CMAADAAEECQAOADQB/AADAAEECQEAAAwB8AADAAEECQEBAAoB5gADAAEECQECAAgB3gADAAEECQEDABQBygADAAEECQEEAAoBwAADAAEECQEFAA4C7AADAAEECQEGAAwBtAADAAEECQEHABABpAADAAEECQEIAAgBnAADAAEECQEJABIBigADAAEECQEKAAoBgAADAAEECQELACIBXgADAAEECQEMAC4BMAADAAEECQENACQBDAADAAEECQEOACgA5AADAAEECQEPACYAvgADAAEECQEQACoAlAADAAEECQERACIAcgADAAEECQESACwARgADAAEECQETACQAIgADAAEECQEXAAwAFgADAAEECQEaAAwACgADAAEECQEbAAoAAABSAG8AbQBhAG4ASQB0AGEAbABpAGMATgBvAHIAbQBhAGwAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBCAGwAYQBjAGsAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBFAHgAdAByAGEAQgBvAGwAZABBAHIAYwBoAGkAdgBvAFIAbwBtAGEAbgAtAEIAbwBsAGQAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBTAGUAbQBpAEIAbwBsAGQAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBNAGUAZABpAHUAbQBBAHIAYwBoAGkAdgBvAFIAbwBtAGEAbgAtAFIAZQBnAHUAbABhAHIAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBMAGkAZwBoAHQAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBFAHgAdAByAGEATABpAGcAaAB0AEEAcgBjAGgAaQB2AG8AUgBvAG0AYQBuAC0AVABoAGkAbgBCAGwAYQBjAGsARQB4AHQAcgBhAEIAbwBsAGQAQgBvAGwAZABTAGUAbQBpAEIAbwBsAGQATQBlAGQAaQB1AG0ATABpAGcAaAB0AEUAeAB0AHIAYQBMAGkAZwBoAHQAVABoAGkAbgBXAGkAZAB0AGgAVwBlAGkAZwBoAHQAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAEEAcgBjAGgAaQB2AG8AUwBlAG0AaQBCAG8AbABkAC0AUgBlAGcAdQBsAGEAcgBWAGUAcgBzAGkAbwBuACAAMgAuADAAMAAxAEEAcgBjAGgAaQB2AG8AIABTAGUAbQBpAEIAbwBsAGQAIABSAGUAZwB1AGwAYQByADIALgAwADAAMQA7AE8ATQBOAEkAOwBBAHIAYwBoAGkAdgBvAFMAZQBtAGkAQgBvAGwAZAAtAFIAZQBnAHUAbABhAHIAUgBlAGcAdQBsAGEAcgBBAHIAYwBoAGkAdgBvACAAUwBlAG0AaQBCAG8AbABkAEMAbwBwAHkAcgBpAGcAaAB0ACAAMgAwADIAMAAgAFQAaABlACAAQQByAGMAaABpAHYAbwAgAFAAcgBvAGoAZQBjAHQAIABBAHUAdABoAG8AcgBzACAAKABoAHQAdABwAHMAOgAvAC8AZwBpAHQAaAB1AGIALgBjAG8AbQAvAE8AbQBuAGkAYgB1AHMALQBUAHkAcABlAC8AQQByAGMAaABpAHYAbwApAAIAAAAAAAD/bAAsAAAAAAAAAAAAAAAAAAAAAAAAAAABLgAAACQAyQECAMcAYgCtAGMArgCQACUAJgBkACcA6QAoAGUAyADKAMsAKQAqACsALADMAM0AzgDPAC0ALgAvADAAMQBmADIA0ADRAGcA0wCRAK8AsAAzAO0ANAA1ADYANwA4ANQA1QBoANYAOQA6ADsAPADrAD0BAwEEAQUARABpAGsAbABqAG4AbQCgAEUARgBvAEcA6gBIAHAAcgBzAHEASQBKAEsATADXAHQAdgB3AQYAdQBNAQcATgBPAFAAUQB4AFIAeQB7AHwAegChAH0AsQBTAO4AVABVAFYAiQBXAFgAfgCAAIEAfwBZAFoAWwBcAOwAugBdAQgBCQEKAQsBDAENAQ4AwADBAJ0AngATABQAFQAWABcAGAAZABoAGwAcAQ8BEAERARIBEwEUARUBFgEXARgBGQEaARsBHAEdAR4BHwEgASEBIgEjASQBJQEmAScBKAEpASoBKwEsAS0BLgEvALwA9AD1APYAEQAPAB0AHgCrAAQAowAiAKIAwwCHAA0ABgASAD8BMAExAAsADABeAGAAPgBAABABMgCyALMAQgDEAMUAtAC1ALYAtwCpAKoAvgC/AAUACgADATMBNAE1ATYAhAC9AAcBNwCFAJYBOAAOAO8A8AC4ACAAIQAfAJMAYQCkAEEBOQAIAToBOwAjAAkAiACGAIsAigCMAIMBPAE9AF8A6AE+AT8BQAFBAUIBQwFEAUUBRgFHAUgBSQCOAEMAjQDYAN0A2QDaAN4BSgFLAUwBTQFOAU8BUAFRAVIBUwFUAVUBVgFXAVgBWQFaAVsBXAFdAV4GQWJyZXZlCVkubG9jbEdVQQ5ZYWN1dGUubG9jbEdVQQ5PYWN1dGUubG9jbFBMSwlpLmxvY2xUUksHdW5pMDIzNwl5LmxvY2xHVUEOeWFjdXRlLmxvY2xHVUEReWRpZXJlc2lzLmxvY2xHVUEOb2FjdXRlLmxvY2xQTEsDZl9mBWZfZl9pBWZfZl9sB3plcm8udGYGb25lLnRmBnR3by50Zgh0aHJlZS50Zgdmb3VyLnRmB2ZpdmUudGYGc2l4LnRmCHNldmVuLnRmCGVpZ2h0LnRmB25pbmUudGYJemVyby5kbm9tCG9uZS5kbm9tCHR3by5kbm9tCnRocmVlLmRub20JZm91ci5kbm9tCWZpdmUuZG5vbQhzaXguZG5vbQpzZXZlbi5kbm9tCmVpZ2h0LmRub20JbmluZS5kbm9tCXplcm8ubnVtcghvbmUubnVtcgh0d28ubnVtcgp0aHJlZS5udW1yCWZvdXIubnVtcglmaXZlLm51bXIIc2l4Lm51bXIKc2V2ZW4ubnVtcgplaWdodC5udW1yCW5pbmUubnVtcgd1bmkwMEI5B3VuaTAwQjIHdW5pMDBCMxtwZXJpb2RjZW50ZXJlZC5sb2NsQ0FULmNhc2UWcGVyaW9kY2VudGVyZWQubG9jbENBVAd1bmkwMEFEB3VuaTAwQTAHdW5pMjAwOQJDUgd1bmlGRUZGBEV1cm8HdW5pMjIxNQd1bmkwMEI1B2Fycm93dXAJYXJyb3dkb3duBm1pbnV0ZQZzZWNvbmQHdW5pMDJCQwd1bmkwMzA4C3VuaTAzMDgwMzAwC3VuaTAzMDgwMzAxC3VuaTAzMDgwMzA0CWdyYXZlY29tYglhY3V0ZWNvbWIJdGlsZGVjb21iC3VuaTAzMDMwMzA0B3VuaTAzMDQNaG9va2Fib3ZlY29tYgxkb3RiZWxvd2NvbWIMdW5pMDMwOC5jYXNlEHVuaTAzMDgwMzAwLmNhc2UQdW5pMDMwODAzMDEuY2FzZRB1bmkwMzA4MDMwNC5jYXNlDmdyYXZlY29tYi5jYXNlDmFjdXRlY29tYi5jYXNlDnRpbGRlY29tYi5jYXNlEHVuaTAzMDMwMzA0LmNhc2UMdW5pMDMwNC5jYXNlEmhvb2thYm92ZWNvbWIuY2FzZQ1kaWVyZXNpcy5jYXNlCmdyYXZlLmNhc2UKYWN1dGUuY2FzZQ9jaXJjdW1mbGV4LmNhc2UJcmluZy5jYXNlCnRpbGRlLmNhc2ULbWFjcm9uLmNhc2USYWN1dGUubG9jbFBMSy5jYXNlDWFjdXRlLmxvY2xQTEsQY2VudC5CUkFDS0VULjExMBJkb2xsYXIuQlJBQ0tFVC4xMTAAAAC4Af+FsASNAA==";
    ARCHIVO_TTF_700_B64 = "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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2B1IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/OIwD/8R2W/9gjAP/dHXj/ziMAAAAAAP/sJVAAAAAA/+wAAP/OHWD/7AAAAAAAAAAAAAAAAAAA/9gjAAAAAAAAAAAAAAAAAAAAAAD/4iV8AAAAAAAAAAAAAAAA/2odQv+mIwAAAAAA//YlfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+wAAP/iAAD/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/sHTwAAB02AAAAAAAAAAD/9iV8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+mHTAAAAAAAAAAAAAAAAAAAAAAAAAAAP/sJXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+wAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//YlfAAAAAAAAAAAAAAAAP/iIwAAAAAAAAAAAP/JJXz/4iMAAAAAAAAAAAAAAAAAAAAAAP/sJXz/4iMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/YJVAAAAAAAAAAAAAAAAAAAAAA/8QAAP+wIwAAAAAA//YlUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+IjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/zgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/84AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4iV8AAAAAAAAAAAAAAAAAAAAAP/OJXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+wlfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9hy4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2IwAAAAAAAAAAAP+cIwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/84lfP+cAAAAAAAAAAAAAAAAAAAAAAAA//YdigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/xCL0AAAAAAAeJOoAAAAAAAAAAAAAAAAAAAAA/9glfAAAAAD/piTqAAAAAP/OJXz/2CV8AAAAAP/sJXwAAAAA/9glfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/9gAA/4glfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7HYoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/xHZb/8R2Q/+wlfP/nHZb/8R2WAAAAAAAAAAAAAAAA/9glfP/OJXz/4gAAAAAAAP/sAAAAAAAA//Edlv/sJXwAAAAA/9gdSP/sAAD/7CV8AAAAAAAAAAAAAAAAAAAAAAAAAAD/zgAAAAAAAAAAAAAAAAAAAAAAAP/sJXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/YJXz/2CV8AAAAAP/nHYQAAAAAAAAAAAAAAAD/5x1OAAAAAAAAAAAAAAAAAAAAAP/iJXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAEgABABUAAAAdAB4AFQAiADoAFwA9AD0AMABFAEYAMQBKAFAAMwBcAFwAOgBhAGoAOwBsAG0ARQBvAG8ARwB1AHsASAB/AIAATwCHAJAAUQC/AMAAWwDNANAAXQDSANMAYQDZANkAYwDbAN0AZAABAGaAAAABAH2AAAABAEmAAAABAGuAAAABAHyAAAABAJaAAAABAI+AAAABAJWAAAABAJOAAAABAJGAAAABAJCAAAABAIuAAAABAHaAAAABAEuAAAAAAAWAAAABAECAAAABADCAAAABAJeAAAAAAAiAAAAAAA2AAAABADGAAAAAAAGAAAABAHeAAAABAIiAAAABAIWAAAABAHqAAAABAGiAAAAAAACAAAAAAAKAAAABAIaAAAAAAAyAAAABAGqAAAABAIGAAAABAFWAAAABAHiAAAABAEqAAAABAGeAAAABAGmAAAACAEAAAQAJAAQACwAMAAIAFQAVAAIAHAAcABkAIgApAAIALAAsAAIALgAuAAwALwAvABAAMAA0AAYANQA2AA0ANwA3ACcAOAA5AAsAOgA6ABMAPQA9AAIAPgBFAAUARgBGAAgARwBPAAEAUABQAA4AUQBRABEAUgBSAAgAXABdAAgAXgBgAAcAYQBoAAEAaQBpAAcAagBqAAgAawBrAAEAbABsAAcAbQBtAA8AbgBuAAgAbwBvABIAcAB0AAMAdQB2AAkAdwB3ACgAeAB4ACkAeQB6AAkAewB7ABQAfAB+AAMAfwB/AAEAgACEAA4AhQCGABUAhwCHABYAiACIACIAiQCJACYAigCKACUAiwCLAB4AjACMAB0AjQCNACQAjgCOABcAjwCPABwAkACQACEAtgC3ABgAuAC5ABsAugC6ABgAvwDAABoAwQDBABUAzADMABcAzQDQAAoA2ADYAB8A2QDZACAA2gDaAB8A2wDbACAA3ADdACMA9QD1AAcA/wD/ABUAAgA1AAEACAACAAkACQAEAAoACgAaAAsADAAIAA8AEwAEABQAFAAbABUAFQALAB0AHQAXAB4AHgAQACkAKQAEACoAKwAVAC0ALQARAC4ALgAMAC8ALwASADAANAADADUANgANADcANwApADgAOQAJADoAOgAPAEUARQAFAEYARgAB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Iz9VAjWenv2apqZ1GSw7IwUIAgIEAhshDgsZFBocEgoJFiI2KCc6JxQUJTUgBw4BBxMbEAgOEgsTFhAJChUgOjAuQScSAAAAAAAAJABKAHoAugDuASABTgGUAdoCDAJGAngCyALwAx4DNANUA3gDmgO4A8wECAQgBCwEQgRcBHQEiASoBMIE0gUQBTgFgAW4BfgGPAaABsAHAgdaB6AHxAfqCCoIUgimCLgI2gkECTIJXgmICagJ6goGCh4KPgpUCo4K0AsQC2gLyAwsDI4M7g1kDdwOUA6MDsIPFg9SD6QP3hAgEGYQqhDsERARghGqEb4RyhHgEfoSEhImEjoSXBJ4EpASnBLeEwYTThOCE74T/hQ+FHoUthUKFWwVqBXmFiIWQhacFuAXBBcsF1wXkBfCF/IYEBhQGGoYmhjSGQwZIhlgGaYZ7hoqGmYasBryGyIbTBueG8wcBBwcHFocphzQHQwdVh1yHb4eCB5AHlgelh7iHwwfSB+SH64f+iBEIHIgiiDCIQwhMiFiIZwhtiICIjwiaiKCIrwjBiMsI14jmCO0JAAkOiRSJIwk1iTmJTolfCXuJfomEiYkJkImWCZsJoAmxCcIJxQnMCdSJ4InkCeeJ6ontifSJ/AoLChoKHoojCiYKKQosCi8KMgo4CkIKTApWClwKYgpoim8Kcwp3Cn0KgQqBCoEKgQqBCoEKkAqkCrwKzwraiugK7ArxCvQK+osAiwWLCgsPCxYLIIskiymLNQtNi1MLWIt6i46Llou2C86L44vuC/kL/QwCjAYMCwwQjBUMGwwhjCeMKwwujDgMQwxGDE+MUoxXDFqMXgxijGwMdYx4jIIMhoyMjJMMmQycjKAMqYy0jLeMwQzFjMkMzIzRDNqM5AznDOqM7gz+jRgAAAAAQAAAAEAAgAAAnIBLgAAAAACdgAAABIARwCDANwBHwFkAaACBAJpArADCgNYA9cEFARYBHIElATFBOoFEwUqBYoFpAW1Bc8F7wYJBiMGVgZ8Bo4G8gc3B64IBQhjCMgJLwmNCeoKcQreCxcLVQu2C/MMgAyVDMgNAw1EDYgNww3xDmAOiA6oDtAO6w9ID60QDRCXESkRwRJbEuwTphRgFRUVcBXEFkkWpBciF3cX0xg2GJsY9xkyGeMaIRo1GkYaYBqAGpoarhrIGvsbJxtMG10bxxwFHHQcvR0N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AjoATANMAEwC3ABMAtwATAMOAC0DDgAtAw4ALQMOAC0DDgAtAw4ALQMOAC0EsAAtAp4ATAKyAFEDDgAtAs0ATAKbAC0CawAZAtQASALUAEgC1ABIAtQASALUAEgCnwAKA7oACgKuAAsCpQAKAqUACgJ6AB0CnwBKAp8ASgMOAC0CLAAiAiwAIgIsACICLAAiAiwAIgIsACICLAAiA38AIgJQAEECIwAnAiMAJwJQACcCZgAvAjEAJwIxACcCMQAnAjEAJwIxACcBMwAOAk8AEQJIAEEA/ABBAPwAQQD8ADwA/P/aAPz/4AD8AEEA/P/wAPr/4wD6/+MCHwBBAPwAQQNdAEECSABBAkgAQQJWACcCVgAnAlYAJwJWACcCVgAnAlYAJgJWACcDtgAnAlAAQQJQAEECUAAnAWoAQQIdACgCcQBLAToADQJHAD0CRwA9AkcAPQJHAD0CRwA9AhEABQL2AAMCIgAKAhEABQIRAAUCEQAFAf0AGAJkAE0CZABNAmQATQJWACcCTQAOA0kADgNJAA4CLwAOAi8ADgGNACYBhwAiAj8AMgJAAGECQAAzAkAALAJBAB8CPwAuAkAAMwJAAC4CQAAsAj8AKgJDADQCQwBcAkMAMwJDACwCQwAnAkMALgJDADoCQwA2AkMAMQJDACoBZQAqAWUAQAFlADMBZQAvAWUAKAFlADABZQAoAWUALwFlAC4BZQAoAWUAKgFlAEABZQAzAWUALwFlACgBZQAwAWUAKAFlAC8BZQAuAWUAKAFlAEABZQAzAWUALwCn/xkDVwBAA1cAQANXAC8BLABWASwATwFQAGkBUABjA8UAVgEkAEsBJABLAmUAQQJlAEsBTQBnAakAUQGXACMCRwAYASoAAAEqAAAAlwAMAMEAJgFlAEABZQAsAYoAKwGKADgBUwBtAVMAFwFNACgBTQAoAfQAAAPoAAAB+wAAARgASQHiAEkB4gBJAeIASQEYAEkBGABJAjsARAI7ADcBZABEAWQANwG8AD4A9gA+AMgAAADIAAAAzQAAAlgAAAAAAAACQQAzAkQAJgIdACgCRAAZAkQAGAI8AAoAiv8KAnwAUgJ8AFICfABnAnwAUgJ8AFICfABbAnwARwJ8AFICfABDAnwAQwJ8AGwCSwBBA8YAWQH0AEIB9ABCA+YALQLZADUCTgAtAkMANgL8ABsC/AAbA/cAUAGQADMApAAkAUgAJAD1AEwA9QBMAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATkAAADRAAAA0QAAAUUAAADIAAABTQAAATEAAADoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATgAAADWAAAA1gAAAU8AAADSAAABTQAAATEAAACXAAAAkwAAAkEAMwIdACgAAQAAAS4AZwAFAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAB8BegADAAEECQAAAKgDGgADAAEECQABACAC+gADAAEECQACAA4C7AADAAEECQADAEQCqAADAAEECQAEADACeAADAAEECQAFABoCXgADAAEECQAGAC4CMAADAAEECQAOADQB/AADAAEECQEAAAwB8AADAAEECQEBAAoB5gADAAEECQECAAgB3gADAAEECQEDABQBygADAAEECQEEAAoBwAADAAEECQEFAA4C7AADAAEECQEGAAwBtAADAAEECQEHABABpAADAAEECQEIAAgBnAADAAEECQEJABIBigADAAEECQEKAAoBgAADAAEECQELACIBXgADAAEECQEMAC4BMAADAAEECQENACQBDAADAAEECQEOACgA5AADAAEECQEPACYAvgADAAEECQEQACoAlAADAAEECQERACIAcgADAAEECQESACwARgADAAEECQETACQAIgADAAEECQEXAAwAFgADAAEECQEaAAwACgADAAEECQEbAAoAAABSAG8AbQBhAG4ASQB0AGEAbABpAGMATgBvAHIAbQBhAGwAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBCAGwAYQBjAGsAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBFAHgAdAByAGEAQgBvAGwAZABBAHIAYwBoAGkAdgBvAFIAbwBtAGEAbgAtAEIAbwBsAGQAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBTAGUAbQBpAEIAbwBsAGQAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBNAGUAZABpAHUAbQBBAHIAYwBoAGkAdgBvAFIAbwBtAGEAbgAtAFIAZQBnAHUAbABhAHIAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBMAGkAZwBoAHQAQQByAGMAaABpAHYAbwBSAG8AbQBhAG4ALQBFAHgAdAByAGEATABpAGcAaAB0AEEAcgBjAGgAaQB2AG8AUgBvAG0AYQBuAC0AVABoAGkAbgBCAGwAYQBjAGsARQB4AHQAcgBhAEIAbwBsAGQAQgBvAGwAZABTAGUAbQBpAEIAbwBsAGQATQBlAGQAaQB1AG0ATABpAGcAaAB0AEUAeAB0AHIAYQBMAGkAZwBoAHQAVABoAGkAbgBXAGkAZAB0AGgAVwBlAGkAZwBoAHQAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAEEAcgBjAGgAaQB2AG8AUwBlAG0AaQBCAG8AbABkAC0AUgBlAGcAdQBsAGEAcgBWAGUAcgBzAGkAbwBuACAAMgAuADAAMAAxAEEAcgBjAGgAaQB2AG8AIABTAGUAbQBpAEIAbwBsAGQAIABSAGUAZwB1AGwAYQByADIALgAwADAAMQA7AE8ATQBOAEkAOwBBAHIAYwBoAGkAdgBvAFMAZQBtAGkAQgBvAGwAZAAtAFIAZQBnAHUAbABhAHIAUgBlAGcAdQBsAGEAcgBBAHIAYwBoAGkAdgBvACAAUwBlAG0AaQBCAG8AbABkAEMAbwBwAHkAcgBpAGcAaAB0ACAAMgAwADIAMAAgAFQAaABlACAAQQByAGMAaABpAHYAbwAgAFAAcgBvAGoAZQBjAHQAIABBAHUAdABoAG8AcgBzACAAKABoAHQAdABwAHMAOgAvAC8AZwBpAHQAaAB1AGIALgBjAG8AbQAvAE8AbQBuAGkAYgB1AHMALQBUAHkAcABlAC8AQQByAGMAaABpAHYAbwApAAIAAAAAAAD/bAAsAAAAAAAAAAAAAAAAAAAAAAAAAAABLgAAACQAyQECAMcAYgCtAGMArgCQACUAJgBkACcA6QAoAGUAyADKAMsAKQAqACsALADMAM0AzgDPAC0ALgAvADAAMQBmADIA0ADRAGcA0wCRAK8AsAAzAO0ANAA1ADYANwA4ANQA1QBoANYAOQA6ADsAPADrAD0BAwEEAQUARABpAGsAbABqAG4AbQCgAEUARgBvAEcA6gBIAHAAcgBzAHEASQBKAEsATADXAHQAdgB3AQYAdQBNAQcATgBPAFAAUQB4AFIAeQB7AHwAegChAH0AsQBTAO4AVABVAFYAiQBXAFgAfgCAAIEAfwBZAFoAWwBcAOwAugBdAQgBCQEKAQsBDAENAQ4AwADBAJ0AngATABQAFQAWABcAGAAZABoAGwAcAQ8BEAERARIBEwEUARUBFgEXARgBGQEaARsBHAEdAR4BHwEgASEBIgEjASQBJQEmAScBKAEpASoBKwEsAS0BLgEvALwA9AD1APYAEQAPAB0AHgCrAAQAowAiAKIAwwCHAA0ABgASAD8BMAExAAsADABeAGAAPgBAABABMgCyALMAQgDEAMUAtAC1ALYAtwCpAKoAvgC/AAUACgADATMBNAE1ATYAhAC9AAcBNwCFAJYBOAAOAO8A8AC4ACAAIQAfAJMAYQCkAEEBOQAIAToBOwAjAAkAiACGAIsAigCMAIMBPAE9AF8A6AE+AT8BQAFBAUIBQwFEAUUBRgFHAUgBSQCOAEMAjQDYAN0A2QDaAN4BSgFLAUwBTQFOAU8BUAFRAVIBUwFUAVUBVgFXAVgBWQFaAVsBXAFdAV4GQWJyZXZlCVkubG9jbEdVQQ5ZYWN1dGUubG9jbEdVQQ5PYWN1dGUubG9jbFBMSwlpLmxvY2xUUksHdW5pMDIzNwl5LmxvY2xHVUEOeWFjdXRlLmxvY2xHVUEReWRpZXJlc2lzLmxvY2xHVUEOb2FjdXRlLmxvY2xQTEsDZl9mBWZfZl9pBWZfZl9sB3plcm8udGYGb25lLnRmBnR3by50Zgh0aHJlZS50Zgdmb3VyLnRmB2ZpdmUudGYGc2l4LnRmCHNldmVuLnRmCGVpZ2h0LnRmB25pbmUudGYJemVyby5kbm9tCG9uZS5kbm9tCHR3by5kbm9tCnRocmVlLmRub20JZm91ci5kbm9tCWZpdmUuZG5vbQhzaXguZG5vbQpzZXZlbi5kbm9tCmVpZ2h0LmRub20JbmluZS5kbm9tCXplcm8ubnVtcghvbmUubnVtcgh0d28ubnVtcgp0aHJlZS5udW1yCWZvdXIubnVtcglmaXZlLm51bXIIc2l4Lm51bXIKc2V2ZW4ubnVtcgplaWdodC5udW1yCW5pbmUubnVtcgd1bmkwMEI5B3VuaTAwQjIHdW5pMDBCMxtwZXJpb2RjZW50ZXJlZC5sb2NsQ0FULmNhc2UWcGVyaW9kY2VudGVyZWQubG9jbENBVAd1bmkwMEFEB3VuaTAwQTAHdW5pMjAwOQJDUgd1bmlGRUZGBEV1cm8HdW5pMjIxNQd1bmkwMEI1B2Fycm93dXAJYXJyb3dkb3duBm1pbnV0ZQZzZWNvbmQHdW5pMDJCQwd1bmkwMzA4C3VuaTAzMDgwMzAwC3VuaTAzMDgwMzAxC3VuaTAzMDgwMzA0CWdyYXZlY29tYglhY3V0ZWNvbWIJdGlsZGVjb21iC3VuaTAzMDMwMzA0B3VuaTAzMDQNaG9va2Fib3ZlY29tYgxkb3RiZWxvd2NvbWIMdW5pMDMwOC5jYXNlEHVuaTAzMDgwMzAwLmNhc2UQdW5pMDMwODAzMDEuY2FzZRB1bmkwMzA4MDMwNC5jYXNlDmdyYXZlY29tYi5jYXNlDmFjdXRlY29tYi5jYXNlDnRpbGRlY29tYi5jYXNlEHVuaTAzMDMwMzA0LmNhc2UMdW5pMDMwNC5jYXNlEmhvb2thYm92ZWNvbWIuY2FzZQ1kaWVyZXNpcy5jYXNlCmdyYXZlLmNhc2UKYWN1dGUuY2FzZQ9jaXJjdW1mbGV4LmNhc2UJcmluZy5jYXNlCnRpbGRlLmNhc2ULbWFjcm9uLmNhc2USYWN1dGUubG9jbFBMSy5jYXNlDWFjdXRlLmxvY2xQTEsQY2VudC5CUkFDS0VULjExMBJkb2xsYXIuQlJBQ0tFVC4xMTAAAAC4Af+FsASNAA==";
  }
});
var png_exports = {};
__export(png_exports, {
  svgToPng: /* @__PURE__ */ __name(() => svgToPng, "svgToPng")
});
function b64ToU8(b64) {
  const bin = atob(b64);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
__name(b64ToU8, "b64ToU8");
function ready() {
  if (!_ready) _ready = initWasm(RESVG_WASM);
  return _ready;
}
__name(ready, "ready");
async function svgToPng(svg) {
  await ready();
  const r = new Resvg2(svg, {
    fitTo: { mode: "width", value: 1200 },
    background: "#ffffff",
    font: { loadSystemFonts: false, fontBuffers: FONTS, defaultFontFamily: "Archivo" }
  });
  const img = r.render();
  const png = img.asPng();
  img.free();
  r.free();
  return png;
}
__name(svgToPng, "svgToPng");
var FONTS;
var _ready;
var init_png = __esm({
  "src/png.js"() {
    init_resvg_wasm();
    init_ogfont_ttf();
    __name2(b64ToU8, "b64ToU8");
    FONTS = [b64ToU8(ARCHIVO_TTF_400_B64), b64ToU8(ARCHIVO_TTF_700_B64)];
    _ready = null;
    __name2(ready, "ready");
    __name2(svgToPng, "svgToPng");
  }
});
var CSS = `
:root{
  /* sticky masthead height -> lets the hero fill exactly one viewport */
  --mast-h:100px;
  /* ink + paper (irwfa) */
  --ink:#111111; --paper:#ffffff; --paper-2:#fafafa; --paper-3:#f4f4f4;
  /* text greys (irwfa) */
  --t-1:#1c1c1c; --t-2:#3a3a3a; --t-3:#6b6b6b; --t-4:#767676;
  /* rules (irwfa) */
  --line:#e4e4e4; --line-2:#cccccc;
  /* dark zone (irwfa) */
  --d-text:#ededed; --d-2:#b6b6b6; --d-3:#888888; --d-line:#333333;
  /* type \u2014 Archivo, exactly as irwfa ships it */
  --serif:"Archivo","Helvetica Neue",Arial,sans-serif;
  --sans:"Archivo","Helvetica Neue",Arial,sans-serif;
  /* measure (irwfa) */
  --wrap:1180px; --read:800px; --gut:clamp(20px,5vw,64px);
  /* spacing grid */
  --s1:4px; --s2:8px; --s3:12px; --s4:16px; --s5:24px; --s6:32px; --s7:48px;
  --sec:clamp(64px,10vw,132px);  /* irwfa major section rhythm */
  --secb:clamp(40px,6vw,72px);   /* irwfa in-brief band rhythm */
}
@font-face{font-family:"Archivo";font-style:normal;font-weight:400;font-display:swap;src:url("/ask/f/archivo.woff2") format("woff2")}
/* Telugu type system \u2014 authoritative serif headings + readable sans body */
@font-face{font-family:"NotoSerifTe";font-style:normal;font-weight:700;font-display:swap;src:url("/ask/f/te-serif700.woff2") format("woff2")}
@font-face{font-family:"NotoSansTe";font-style:normal;font-weight:400;font-display:swap;src:url("/ask/f/te-sans400.woff2") format("woff2")}
@font-face{font-family:"NotoSansTe";font-style:normal;font-weight:600;font-display:swap;src:url("/ask/f/te-sans600.woff2") format("woff2")}
html[lang="te"]{--sans:"NotoSansTe","Archivo",system-ui,sans-serif;--serif:"NotoSerifTe","NotoSansTe","Archivo",Georgia,serif;font-size:17.5px;line-height:1.62}
html[lang="te"] .wordmark,html[lang="te"] .fbrand{font-family:"NotoSerifTe","Archivo",serif}
html[lang="te"] .navicon,html[lang="te"] .pill,html[lang="te"] .mm>summary{font-size:14.5px;letter-spacing:0}
html[lang="te"] .grp-head{font-size:19px;letter-spacing:0}
html[lang="te"] .panel .grp a b{font-size:16px;letter-spacing:0;line-height:1.5}
html[lang="te"] .panel .grp a span{font-size:13px;line-height:1.55}
html[lang="te"] .lead-title{font-size:18px;line-height:1.5}
html[lang="te"] .lead-prov{font-size:12.5px}
html[lang="te"] .lead-btn,html[lang="te"] .fbtn{font-size:14px}
html[lang="te"] .fblk a{font-size:13.5px;line-height:1.5}
html[lang="te"] .fblk h4{font-size:11px;letter-spacing:.1em}

@font-face{font-family:"Archivo";font-style:normal;font-weight:700;font-display:swap;src:url("/ask/f/archivo.woff2") format("woff2")}
@font-face{font-family:"Archivo";font-style:normal;font-weight:800;font-display:swap;src:url("/ask/f/archivo.woff2") format("woff2")}

*{box-sizing:border-box}
html{font-size:16px;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--t-1);font-family:var(--sans);line-height:1.5;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}

/* a11y */
.skip{position:absolute;left:-9999px;top:0;z-index:200;background:var(--ink);color:#fff;padding:12px 16px;font-weight:700;text-decoration:none}
.skip:focus{left:0}
a{color:inherit}
:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
[aria-current="page"]{font-weight:700}

/* layout */
.wrap{max-width:var(--wrap);margin:0 auto;padding:0 var(--gut)}
.read{max-width:var(--read)}
section.band{padding:var(--secb) 0;border-top:1px solid var(--line)}

/* type scale (Archivo \xB7 irwfa proportions) */
h1,.display{font-family:var(--serif);font-weight:800;font-size:clamp(30px,4.4vw,54px);line-height:1.06;letter-spacing:-.015em;color:var(--ink);margin:0 0 .35em}
h2{font-family:var(--serif);font-weight:700;font-size:clamp(22px,2.6vw,32px);line-height:1.12;letter-spacing:-.01em;color:var(--ink);margin:0 0 .5em}
h3{font-family:var(--serif);font-weight:700;font-size:clamp(17px,1.6vw,20px);line-height:1.2;margin:1.2em 0 .4em}
p{margin:0 0 1em}
.lede{font-family:var(--sans);font-weight:400;font-size:clamp(17px,1.8vw,21px);line-height:1.55;color:var(--t-2)}
.eyebrow{font-family:var(--sans);font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--t-4)}
.kicker{font-family:var(--sans);font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--t-4)}
.seclabel{display:flex;align-items:baseline;gap:18px;margin-bottom:clamp(28px,4vw,52px)}
.seclabel .num{font-family:var(--serif);font-size:14px;color:var(--t-4)}

/* ===== masthead (DEEP INK \xB7 irwfa pattern) ===== */
.mast{position:sticky;top:0;z-index:100;background:var(--ink);border-bottom:1px solid var(--d-line)}
.mast-top{max-width:var(--wrap);margin:0 auto;padding:13px var(--gut);display:flex;align-items:center;justify-content:space-between;gap:18px}
.mast-nav{max-width:var(--wrap);margin:0 auto;padding:0 var(--gut);display:flex;align-items:center;gap:0 2px;border-top:1px solid var(--d-line);flex-wrap:wrap}
.mast-nav .homepill{margin-right:8px}
.mast-nav .pillmenu{margin-left:auto}
/* brand \u2014 BIG, single line, NO tagline; never breaks */
.brand{display:flex;align-items:center;gap:12px;text-decoration:none;flex:0 0 auto;white-space:nowrap}
.brand .amblem{display:inline-flex;align-items:center;justify-content:center;background:#fff;border-radius:7px;padding:4px;line-height:0;flex:none}
.brand .amblem img{display:block;width:30px;height:30px}
.brand .wordmark{font-family:var(--serif);font-weight:800;font-size:clamp(23px,2.7vw,33px);letter-spacing:.03em;color:#fff;line-height:1;white-space:nowrap}
.brand .wordmark sup{font-size:.42em;font-weight:400;letter-spacing:0;top:-.75em}
/* nav links */
.navlinks{display:flex;align-items:center;gap:4px;flex:1 1 auto;flex-wrap:wrap;min-width:0}
.mast details.mm{position:relative}
.mast details.mm.mm-wide{position:static}
.mast-nav summary{padding-top:6px;padding-bottom:6px}
.mast-nav{row-gap:0}
.mast summary{list-style:none;cursor:pointer;padding:9px 11px;font-size:12.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--d-2);display:inline-flex;align-items:center;gap:5px;user-select:none;white-space:nowrap}
.mast summary::-webkit-details-marker{display:none}
.mast summary:hover,.mast details[open] summary{color:#fff}
.mast summary .caret{font-size:9px;transition:transform .25s}
.mast details[open] summary .caret{transform:rotate(180deg)}
/* dark mega-panel (irwfa whopanel): eyebrow + bold title + grey tagline */
.panel{position:absolute;top:calc(100% + 9px);background:rgba(17,17,17,.985);backdrop-filter:saturate(120%) blur(10px);
  border:1px solid var(--d-line);box-shadow:0 24px 60px rgba(0,0,0,.55);padding:clamp(22px,2.6vw,34px);z-index:120}
.panel.auto{left:0;right:auto;width:max-content;min-width:240px;max-width:min(92vw,440px);border-radius:12px}
.pillmenu .panel.auto{left:auto;right:0}
/* every directory menu = same full-width treatment */
.panel.full{left:0;right:0;top:100%;border-radius:0 0 16px 16px;border-top:0;padding:0;overflow:hidden;display:flex;flex-direction:column;max-height:min(80vh,660px)}
.panel.full .dir{display:grid;grid-template-columns:repeat(auto-fit,minmax(192px,1fr));gap:clamp(22px,3vw,54px);
  max-width:var(--wrap);margin:0 auto;padding:clamp(7px,0.9vw,12px) var(--gut) clamp(14px,1.6vw,20px);overflow-y:auto;min-height:0;flex:1 1 auto;scrollbar-width:thin;scrollbar-color:var(--d-line) transparent}
.panel.full .col{display:flex;flex-direction:column;gap:0}
.grp-head{display:block;color:var(--d-2);font-family:var(--serif);font-size:17px;font-weight:700;letter-spacing:.005em;text-decoration:none;margin:0 0 11px;padding-bottom:9px;border-bottom:1px solid var(--d-line)}
.grp-head:hover{color:#fff}
.panel .grp .eyebrow{color:var(--d-3);margin:0 0 11px}
.panel .grp a.all b{font-family:var(--sans);font-weight:600;font-size:12px;color:var(--d-2)}
.panel .grp a.all:hover b{color:#fff}
/* contact lead strip \u2014 closes every panel, titled per audience */
.panel-lead{border-top:1px solid var(--d-line);background:rgba(20,20,20,.98);flex:0 0 auto}
.panel.full .dir::-webkit-scrollbar{width:8px}
.panel.full .dir::-webkit-scrollbar-thumb{background:var(--d-line);border-radius:8px}
.lead-inner{max-width:var(--wrap);margin:0 auto;padding:11px var(--gut);display:flex;align-items:center;justify-content:space-between;gap:10px 20px;flex-wrap:nowrap}
.lead-title{margin:0;color:#fff;font-family:var(--serif);font-weight:700;font-size:16px;line-height:1.3;letter-spacing:.005em}
.lead-copy{flex:1 1 auto;min-width:0}
.lead-prov{margin:5px 0 0;font-size:11px;color:var(--d-3);letter-spacing:.02em;line-height:1.4}
.lead-btns{display:flex;flex-wrap:nowrap;gap:6px;flex:0 0 auto}
.lead-btn{display:inline-flex;align-items:center;gap:5px;background:#000;border:1px solid var(--d-2);color:#fff;border-radius:2px;padding:6px 10px;font-size:11.5px;font-weight:600;text-decoration:none;transition:background .15s,border-color .15s;white-space:nowrap}
.lead-btn-wa,.lead-btn-go{border-color:#fff}
.lead-btn:hover,.lead-btn:focus-visible{background:#1c1c1c;border-color:#fff;color:#fff}
.lead-btn svg{flex:none}
.panel .grp a{display:block;text-decoration:none;border-top:1px solid var(--d-line);padding:11px 0}
.panel .grp a:first-of-type{border-top:0}
.panel .grp a b{display:block;font-family:var(--serif);font-weight:700;font-size:14.5px;color:#fff;letter-spacing:-.005em;margin-bottom:2px}
.panel .grp a b i{font-style:normal;color:var(--d-3);font-size:10.5px;font-weight:400}
.panel .grp a span{display:block;font-size:12px;color:var(--d-2);line-height:1.4}
.panel .grp a:hover b{text-decoration:underline}
.panel .grp a:hover span{color:var(--d-text)}
/* the three matching outline pills: Search \xB7 Language \xB7 WhatsApp */
.navpills{display:flex;align-items:center;gap:9px;flex:0 0 auto;margin-left:auto}
.pill{display:inline-flex;align-items:center;gap:7px;text-decoration:none;background:transparent;color:var(--d-2);
  border:1px solid var(--d-2);border-radius:2px;padding:8px 15px;font-size:12.5px;font-weight:600;letter-spacing:.02em;cursor:pointer;white-space:nowrap;line-height:1}
.pill:hover,.pill:focus-visible,details[open] .pill{color:#fff;border-color:#fff}
.pill-wa span{font-size:13.5px;letter-spacing:.01em}
.navicon{display:inline-flex;align-items:center;gap:6px;background:transparent;border:0;color:var(--d-2);text-decoration:none;font-family:var(--sans);font-size:13px;font-weight:600;letter-spacing:.02em;cursor:pointer;white-space:nowrap;line-height:1;padding:8px 4px}
.navicon:hover,.navicon:focus-visible,details[open]>summary.navicon{color:#fff}
.homeicon{margin-right:4px}
.shr{display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--d-line);border-radius:2px;color:var(--d-2);width:30px;height:30px;cursor:pointer;transition:color .15s,border-color .15s;vertical-align:middle}
.shr:hover,.shr:focus-visible,.shr-ok{color:#fff;border-color:#fff}
.shr svg{flex:none}
.pill svg{flex:none}
.pillmenu{position:relative}
.pillmenu>summary.pill{list-style:none}
.pillmenu>summary.pill::-webkit-details-marker{display:none}
.pillmenu .panel .grp a b{white-space:nowrap}
/* masthead narrative band (dark \u2014 opening bookend) */
.mast-band{background:var(--ink);border-bottom:1px solid var(--line)}
.mast-band .wrap{padding-top:clamp(28px,4vw,44px);padding-bottom:clamp(24px,3vw,36px)}
.mast-band .mb-thesis{font-family:var(--serif);font-weight:600;font-size:clamp(16px,1.7vw,20px);color:#fff;max-width:82ch;margin:0 0 14px;line-height:1.5}
.mast-band .mb-meta{font-size:12.5px;color:var(--d-2);margin:0 0 8px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.mast-band .mb-coded{font-weight:700;letter-spacing:.04em;color:#fff;text-transform:uppercase;font-size:11px}
.mast-band .mb-meta a{color:var(--d-2);text-decoration:none;border-bottom:1px solid var(--d-line)}
.mast-band .mb-meta a:hover{color:#fff;border-color:#fff}
.mast-band .dot{color:var(--d-line)}
.mast-band .mb-anchor{font-size:11.5px;color:var(--d-3);margin:0;letter-spacing:.04em}

/* search BLOCK (light, chassis) */
.ask-next{background:var(--paper-2)}
.srch{display:flex;align-items:center;gap:10px;border:1px solid var(--line-2);background:var(--paper);border-radius:0;padding:14px 16px;max-width:640px;margin:24px auto 0}
.srch svg{flex:0 0 16px;opacity:.5}
.srch input{border:0;outline:0;background:transparent;font:inherit;font-size:15px;width:100%;color:var(--ink)}
.srch input::placeholder{color:var(--t-4)}
.srch button{border:0;background:var(--ink);color:#fff;font:inherit;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:10px 16px;cursor:pointer}

/* authority band */
.auth-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px 28px;margin-top:28px}
.auth-grid div{border-left:2px solid var(--ink);padding-left:14px}
.auth-grid b{display:block;font-family:var(--serif);font-weight:800;font-size:22px}
.auth-grid span{font-size:12.5px;color:var(--t-3)}

/* lead rail */
.lead{background:var(--paper-3)}
.lead-row{display:flex;flex-wrap:wrap;gap:14px;margin-top:24px}
.lead-row a{flex:1 1 180px;text-decoration:none;border:1px solid var(--line-2);background:var(--paper);padding:18px;display:flex;flex-direction:column;gap:4px}
.lead-row a:hover{border-color:var(--ink)}
.lead-row a b{font-size:15px}.lead-row a small{color:var(--t-3);font-size:12.5px}
.lead-row a.primary{background:var(--ink);color:#fff;border-color:var(--ink)}
.lead-row a.primary small{color:var(--d-2)}

/* FAQ \u2014 irwfa, verbatim proportions */
.faq summary{list-style:none;cursor:pointer;padding:24px 0;display:flex;justify-content:space-between;align-items:baseline;gap:24px;font-family:var(--serif);font-weight:700;font-size:clamp(18px,2vw,25px);color:var(--ink)}
.faq summary::-webkit-details-marker{display:none}
.faq details{border-top:1px solid var(--line)}
.faq summary .pm{font-family:var(--sans);font-weight:400;font-size:24px;line-height:1;color:var(--t-4);transition:transform .25s ease;flex:none}
.faq details[open] summary .pm{transform:rotate(45deg)}
.faq .ans{padding:0 0 28px;max-width:76ch}
.faq .ans p{font-size:15px;color:var(--t-2);line-height:1.62;margin:0}

/* FOOTER \u2014 7 columns (machine/AEO/SEO) */
footer.foot{background:var(--ink);color:var(--d-2);padding:clamp(56px,8vw,104px) 0 32px}
footer.foot a{color:var(--d-2);text-decoration:none}
footer.foot a:hover{color:#fff}
.fbrandblock{margin-bottom:clamp(34px,5vw,60px)}
.fbrand{font-family:var(--serif);font-weight:800;font-size:clamp(30px,4vw,42px);letter-spacing:.03em;color:#fff;display:block;line-height:1}
.fbrand sup{font-size:.42em;font-weight:400;top:-.8em}
.fmission{font-family:var(--serif);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:clamp(13.5px,1.5vw,18px);color:#fff;margin:12px 0 22px;line-height:1.5}
.fbtns{display:flex;flex-wrap:wrap;gap:11px;margin:0 0 30px}
.fbtn{display:inline-flex;align-items:center;gap:8px;background:#000;border:1px solid #fff;color:#fff;border-radius:2px;padding:11px 18px;font-size:13px;font-weight:600;text-decoration:none;transition:background .15s,border-color .15s;white-space:nowrap}
.fbtn:hover,.fbtn:focus-visible{background:#1c1c1c;border-color:#fff;color:#fff}
.fbtn svg{flex:none}
[title]{cursor:help}
.fnav a[title],.lead-row a{cursor:pointer}
.fline{font-size:12.5px;line-height:1.7;color:var(--d-2);max-width:96ch;margin:0 0 9px}
.fline b{color:var(--d-text)}
.fmotto{font-family:var(--serif);font-weight:700;color:#fff;letter-spacing:.08em;margin:18px 0 2px}
.fded{font-family:var(--serif);font-weight:700;color:#fff;font-size:18px;margin:0}
.fgrid7{display:grid;grid-template-columns:repeat(7,1fr);gap:clamp(22px,3vw,40px) clamp(14px,1.6vw,26px)}
.fgrid21{display:grid;grid-template-columns:repeat(7,1fr);gap:clamp(20px,2.4vw,34px) clamp(12px,1.4vw,24px);margin-top:clamp(26px,3vw,42px);padding-top:clamp(24px,3vw,38px);border-top:1px solid var(--d-line)}
.fblk h4{margin:0 0 10px;font-family:var(--sans);font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--d-3)}
.fblk ul{list-style:none;margin:0;padding:0}
.fblk li{margin:0 0 7px}
.fblk a{font-size:12.5px;color:var(--d-2);text-decoration:none;line-height:1.35;transition:color .15s}
.fblk a:hover{color:#fff}
.fnav h4{color:#fff;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;margin:0 0 12px}
.fnav ul{list-style:none;padding:0;margin:0}
.fnav li{margin:7px 0}
.fnav a{font-size:12.5px;line-height:1.35;display:inline-block}
.fnav-machine h4{color:#fff}
.fnav-machine a{border-bottom:1px solid var(--d-line)}
.fbottom{border-top:1px solid var(--d-line);margin-top:clamp(34px,5vw,56px);padding-top:22px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px 24px;font-size:11.5px;color:var(--d-3);letter-spacing:.04em}
.fbottom .fmachine a{margin-left:16px}

/* home doors (audience IA) */
.doors{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-top:8px}
.door{display:flex;flex-direction:column;gap:4px;text-decoration:none;border:1px solid var(--line-2);padding:20px;transition:border-color .15s}
.door:hover{border-color:var(--ink)}
.door b{font-family:var(--serif);font-weight:700;font-size:19px;color:var(--ink)}
.door span{font-size:13px;color:var(--t-3)}

/* home chambers */
.chamber{margin:clamp(28px,4vw,44px) 0}

/* responsive */
@media(max-width:1080px){ .panel.full .dir{grid-template-columns:repeat(3,minmax(0,1fr))} .fgrid7{grid-template-columns:repeat(4,1fr)} .fgrid21{grid-template-columns:repeat(4,1fr)} }
@media(max-width:860px){
  .mast-top{padding:11px var(--gut)} :root{--mast-h:96px}
  .mast-nav{display:none}
  .mast:has(.burger[open]) .mast-nav{display:flex;flex-direction:column;align-items:stretch;gap:0;max-height:72svh;overflow-y:auto;padding-top:4px;padding-bottom:10px}
  .mast:has(.burger[open]) .mast-nav>*{width:100%}
  .mast:has(.burger[open]) .mast-nav .navicon,.mast:has(.burger[open]) .mast-nav summary{width:100%;justify-content:flex-start;padding:13px 6px;border-top:1px solid var(--d-line)}
  .mast-nav .pillmenu{margin-left:0}
  .burger{display:inline-flex}
  .panel.auto{max-width:94vw}
  .panel.full .dir{grid-template-columns:1fr 1fr}
  .fgrid7{grid-template-columns:repeat(2,1fr)}
  .fgrid21{grid-template-columns:repeat(3,1fr)}
}
@media(max-width:560px){
  .pill span{display:none}              /* pills shrink to icons on phones; brand stays full */
  .pill-wa span,.pill .lng{display:inline}
  .panel,.panel.full,.panel.auto{position:fixed;left:8px;right:8px;top:auto;width:auto;max-width:none;min-width:0;max-height:70vh;overflow:auto}
  .panel.full .dir{grid-template-columns:1fr}
  .lead-row{gap:8px 16px}
  .fgrid7{grid-template-columns:1fr}
}

/* print */
@media print{ .mast,.mast-band,.ask-next,.lead,footer.foot,.navpills{display:none} body{font-size:11pt} a{text-decoration:none;color:#000} }
/* ============================ HOME (irwfa-style: hero \xB7 chambers \xB7 dimensions \xB7 separators) ============================ */
.hero{position:relative;min-height:calc(100svh - var(--mast-h));display:flex;flex-direction:column;justify-content:center;padding:clamp(36px,5vh,72px) 0 clamp(56px,8vh,104px);border-bottom:1px solid var(--line)}
.hero-scroll{position:absolute;left:0;right:0;bottom:clamp(16px,2.6vh,30px);display:flex;justify-content:center;align-items:center;gap:9px;color:var(--ink-3);font-family:var(--sans);font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;text-decoration:none}
.hero-scroll:hover{color:var(--ink)}
.hero-scroll svg{display:block;animation:heronudge 2.4s ease-in-out infinite}
@keyframes heronudge{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
@media (prefers-reduced-motion:reduce){.hero-scroll svg{animation:none}}
.hero.inner .hero-scroll{display:none}
.hero-kicker{font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3);margin:0 0 clamp(14px,2vw,26px)}
.hero-h1{font-family:var(--serif);font-weight:800;font-size:clamp(88px,17vw,212px);line-height:.84;letter-spacing:-.045em;margin:0;color:var(--ink)}
.hero-lede{font-family:var(--serif);font-size:clamp(20px,2.5vw,33px);line-height:1.4;color:var(--ink-2);max-width:32ch;margin:clamp(24px,3vw,40px) 0 clamp(28px,3.4vw,44px)}
.hero-cta{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:clamp(22px,3vw,34px)}
.hero-links{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 18px;font-size:14px;margin:0}
.hero-links span{color:var(--ink-3);font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:11px}
.hero-links a{color:var(--ink-2);text-decoration:none;border-bottom:1px solid var(--line);padding-bottom:1px}
.hero-links a:hover{color:var(--ink);border-color:var(--ink)}
.hero-page{min-height:calc(80svh - 108px)}
.hero-h1-page{font-size:clamp(46px,8.5vw,104px);line-height:.94;letter-spacing:-.03em}

.hbtn{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--ink);color:var(--ink);background:transparent;border-radius:2px;padding:13px 20px;font-family:var(--sans);font-size:14px;font-weight:600;letter-spacing:.01em;text-decoration:none;transition:background .15s,color .15s;white-space:nowrap}
.hbtn:hover{background:var(--ink);color:#fff}
.hbtn-go{background:var(--ink);color:#fff}
.hbtn-go:hover{background:#000;color:#fff;box-shadow:inset 0 0 0 2px var(--ink)}

/* immersive connector \u2014 the block right after the hero, carrying the narrative */
.connector{padding:clamp(64px,11vw,150px) 0;border-bottom:1px solid var(--line);background:#fafafa}
.conn-quote{font-family:var(--serif);font-weight:800;font-size:clamp(34px,6.2vw,76px);line-height:1.02;letter-spacing:-.03em;color:var(--ink);margin:0;max-width:18ch}
.conn-sub{font-size:clamp(17px,1.8vw,22px);line-height:1.55;color:var(--ink-2);max-width:60ch;margin:clamp(22px,3vw,34px) 0 clamp(26px,3vw,36px)}
/* dark super-category highlighter \u2014 the divider between the six chambers */
.chl{background:var(--ink);color:#fff;padding:clamp(54px,8vw,110px) 0}
.chl-kicker{font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--d-3);margin:0 0 16px}
.chl-lead{font-family:var(--serif);font-weight:800;font-size:clamp(32px,5.4vw,64px);line-height:1.02;letter-spacing:-.025em;color:#fff;margin:0 0 clamp(16px,2vw,24px);max-width:18ch}
.chl-intro{font-size:clamp(16px,1.6vw,20px);line-height:1.6;color:var(--d-2);max-width:62ch;margin:0 0 clamp(24px,3vw,34px)}
.chl .hbtn{border-color:#fff;color:#fff;background:transparent}
.chl .hbtn:hover{background:#fff;color:var(--ink)}
.chl .hbtn-go{background:#fff;color:var(--ink)}
.chl .hbtn-go:hover{background:var(--d-2);color:var(--ink);box-shadow:none}
.chl .sep-cta{display:flex;flex-wrap:wrap;gap:11px}

.vblock{padding:clamp(48px,5.6vw,76px) 0;border-top:1px solid var(--line)}
.chl + .vblock{border-top:0}
.vhead-row{display:flex;align-items:baseline;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-bottom:10px}
.vhead{font-family:var(--serif);font-weight:700;font-size:clamp(24px,3.2vw,40px);line-height:1.05;letter-spacing:-.015em;color:var(--ink);margin:0}
.vmore{font-family:var(--sans);font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-2);text-decoration:none;white-space:nowrap;display:inline-flex;align-items:center;gap:8px}
.vmore span{color:var(--ink-3)}.vmore .arr{font-size:15px}
.vmore:hover{color:var(--ink)}.vmore:hover .arr{transform:translateX(2px)}
.vblurb{font-size:clamp(16px,1.5vw,19px);line-height:1.6;color:var(--ink-2);max-width:64ch;margin:0 0 clamp(24px,2.6vw,34px)}
.vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:0 clamp(28px,3.4vw,64px)}
.vall-row{margin-top:clamp(26px,3.2vw,40px)}
.vall{display:inline-flex;align-items:center;gap:11px;background:var(--ink);color:#fff;border-radius:2px;padding:14px 22px;font-family:var(--sans);font-size:14px;font-weight:600;letter-spacing:.01em;text-decoration:none;transition:background .16s}
.vall:hover{background:#000}
.vall .vall-ico{fill:#fff;flex:none;opacity:.92}
.vall .vall-arr{flex:none;color:#fff;transition:transform .16s}
.vall:hover .vall-arr{transform:translateX(3px)}
.vdoor{display:block;border-top:1px solid var(--line);padding:17px 0;text-decoration:none}
.vdoor b{display:block;font-family:var(--serif);font-weight:700;font-size:18px;line-height:1.2;color:var(--ink);letter-spacing:-.01em;margin-bottom:4px}
.vdoor span{display:block;font-family:var(--sans);font-size:13.5px;line-height:1.45;color:var(--ink-3)}
.vdoor:hover b{text-decoration:underline}
.vdoor:hover span{color:var(--ink-2)}

.sep{background:var(--ink);color:#fff;padding:clamp(40px,6vw,76px) 0}
.sep .wrap{max-width:var(--wrap)}
.sep-open{padding:clamp(48px,7vw,92px) 0}
.sep-quote{font-family:var(--serif);font-weight:800;font-size:clamp(30px,5.2vw,62px);line-height:1.04;letter-spacing:-.025em;margin:0;max-width:20ch}
.sep-sub{font-size:clamp(15px,1.5vw,19px);line-height:1.55;color:var(--d-2);max-width:64ch;margin:clamp(16px,2vw,24px) 0 clamp(22px,2.8vw,32px)}
.sep-cta{display:flex;flex-wrap:wrap;gap:11px}
.sep .hbtn{border-color:#fff;color:#fff;background:transparent}
.sep .hbtn:hover{background:#fff;color:var(--ink)}
.sep .hbtn-go{background:#fff;color:var(--ink)}
.sep .hbtn-go:hover{background:var(--d-2);color:var(--ink);box-shadow:none}

@media(max-width:640px){ .lead-inner{flex-wrap:wrap} .lead-copy{flex:1 1 100%} .lead-btns{flex-wrap:wrap} }
@media(max-width:680px){
  .hero-h1{font-size:clamp(72px,23vw,128px)}
  .vhead-row{align-items:flex-start}
  .vgrid{grid-template-columns:1fr 1fr}
}
@media(max-width:460px){ .vgrid{grid-template-columns:1fr} }
.hero.inner{min-height:auto;padding:clamp(30px,4.2vw,56px) 0 clamp(26px,3.6vw,42px)}
.h1-inner{font-size:clamp(34px,5.2vw,64px);line-height:1.0;letter-spacing:-.025em;max-width:20ch}
.hero.inner .hero-kicker{font-size:12.5px;color:var(--ink-2);margin:0 0 clamp(10px,1.4vw,16px)}
.hero.inner .hero-lede{font-family:var(--serif);font-size:clamp(17px,1.9vw,23px);line-height:1.42;margin:clamp(14px,1.8vw,22px) 0 0;max-width:56ch}
.hero.inner .hero-cta{margin:clamp(18px,2.4vw,28px) 0 0}
.hero.inner .hero-links{margin-top:clamp(14px,1.8vw,20px)}
@media(max-width:680px){ .h1-inner{font-size:clamp(28px,7.5vw,42px)} }

.vblock,.chl{content-visibility:auto;contain-intrinsic-size:auto 640px}
footer{content-visibility:auto;contain-intrinsic-size:auto 900px}


/* ---- THE ATOM (Q&A answer page) ---- */
.atom-crumbs{max-width:var(--wrap);margin:0 auto;padding:18px var(--gut) 0;font-family:var(--sans);font-size:12.5px;color:var(--ink-3);display:flex;flex-wrap:wrap;gap:7px;align-items:center}
.atom-crumbs a{color:var(--ink-3);text-decoration:none}.atom-crumbs a:hover{color:var(--ink);text-decoration:underline}
.atom-crumbs .cur{color:var(--ink-2)}.atom-crumbs span[aria-hidden]{color:var(--line-2)}
.atom{max-width:var(--wrap);margin:0 auto;padding:clamp(20px,3vw,34px) var(--gut) clamp(56px,7vw,96px)}
.atom-head{max-width:54rem;border-bottom:1px solid var(--line);padding-bottom:clamp(22px,3vw,34px);margin-bottom:clamp(24px,3vw,36px)}
.atom-kicker{font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-3);margin:0 0 14px}
.atom-h1{font-family:var(--serif);font-weight:800;font-size:clamp(34px,5.2vw,60px);line-height:1.04;letter-spacing:-.02em;margin:0;color:var(--ink)}
.answer-summary{font-family:var(--serif);font-size:clamp(19px,2.2vw,26px);line-height:1.45;color:var(--ink-2);margin:clamp(18px,2.4vw,28px) 0 0;max-width:46rem}
.atom-cta{display:flex;flex-wrap:wrap;gap:11px;margin:clamp(22px,3vw,32px) 0}
.answer-body{max-width:42rem;font-family:var(--sans);font-size:17px;line-height:1.72;color:var(--ink-2)}
.answer-body>em:first-child,.answer-body p:first-child em{color:var(--ink-3)}
.answer-body h2{font-family:var(--serif);font-weight:700;font-size:clamp(22px,2.6vw,30px);line-height:1.15;letter-spacing:-.01em;color:var(--ink);margin:clamp(32px,4vw,50px) 0 14px}
.answer-body h3{font-family:var(--serif);font-weight:700;font-size:20px;color:var(--ink);margin:28px 0 10px}
.answer-body p{margin:0 0 16px}.answer-body strong{color:var(--ink);font-weight:700}
.answer-body ul{margin:0 0 18px;padding:0;list-style:none}
.answer-body li{position:relative;padding:0 0 9px 22px;margin:0}
.answer-body li:before{content:"";position:absolute;left:2px;top:11px;width:6px;height:6px;background:var(--ink);border-radius:50%}
.answer-body a{color:var(--ink);text-decoration:underline;text-underline-offset:2px;text-decoration-color:var(--line-2)}
.answer-body a:hover{text-decoration-color:var(--ink)}
.atom-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(16px,2vw,24px);margin:clamp(32px,4vw,46px) 0;max-width:54rem}
.atom-card{border:1px solid var(--line);border-left:3px solid var(--ink);padding:20px 22px;background:var(--paper-2)}
.atom-card h3{font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin:0 0 9px}
.atom-card p{font-family:var(--sans);font-size:15.5px;line-height:1.6;color:var(--ink-2);margin:0}
.atom-sources{margin:clamp(32px,4vw,46px) 0;max-width:42rem}
.atom-sources h2,.atom-faq h2,.atom-related h2{font-family:var(--serif);font-weight:700;font-size:clamp(22px,2.6vw,28px);letter-spacing:-.01em;color:var(--ink);margin:0 0 16px}
.atom-sources ul{margin:0;padding:0;list-style:none}
.atom-sources li{padding:9px 0;border-top:1px solid var(--line);font-size:15px}
.atom-sources a{color:var(--ink-2);text-decoration:none}.atom-sources a:hover{color:var(--ink);text-decoration:underline}
.atom-eeat{margin:clamp(28px,4vw,42px) 0;padding:18px 20px;border:1px solid var(--line);background:var(--paper-3);max-width:54rem}
.atom-eeat p{font-family:var(--sans);font-size:13.5px;line-height:1.6;color:var(--ink-3);margin:0}
.atom-eeat .eeat-k{font-weight:700;color:var(--ink-2);text-transform:uppercase;letter-spacing:.06em;font-size:11.5px}
.atom-eeat .eeat-disc{margin-top:9px;font-style:italic}
.atom-faq{margin:clamp(32px,4vw,46px) 0;max-width:46rem}
.atom-faq details{border-top:1px solid var(--line)}
.atom-faq summary{cursor:pointer;list-style:none;padding:16px 0;font-family:var(--serif);font-weight:700;font-size:18px;color:var(--ink);display:flex;justify-content:space-between;gap:14px;align-items:baseline}
.atom-faq summary::-webkit-details-marker{display:none}
.atom-faq summary:after{content:"+";color:var(--ink-3);font-family:var(--sans);font-weight:400;font-size:22px;line-height:1}
.atom-faq details[open] summary:after{content:"\\2212"}
.atom-faq .faq-a{padding:0 0 18px}.atom-faq .faq-a p{font-family:var(--sans);font-size:15.5px;line-height:1.65;color:var(--ink-2);margin:0}
.atom-related{margin:clamp(34px,4vw,52px) 0 0}
.atom-rel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0 clamp(28px,3.4vw,56px)}
@media(max-width:680px){ .atom-h1{font-size:clamp(30px,8vw,40px)} }


/* ---- HERO / ATOM RELATIONSHIP TAGS (visible chips, mirrored into JSON-LD) ---- */
.hero-tags,.atom-tags{display:flex;flex-wrap:wrap;gap:8px;margin:clamp(18px,2.2vw,26px) 0 0;padding:0;list-style:none}
.hero-tags li,.atom-tags li{margin:0}
.tag{display:inline-flex;align-items:center;gap:6px;font-family:var(--sans);font-size:12.5px;font-weight:600;letter-spacing:.01em;line-height:1;padding:7px 12px;border:1px solid var(--line);color:var(--ink-2);text-decoration:none;background:#fff;transition:background .12s ease,color .12s ease,border-color .12s ease}
a.tag:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
.tag.tag-lead{background:var(--ink);color:#fff;border-color:var(--ink)}
a.tag.tag-lead:hover{background:#000}
.tag .tag-k{font-weight:700;opacity:.55;text-transform:uppercase;font-size:10px;letter-spacing:.09em}
.tag.tag-lead .tag-k{opacity:.62}
.atom-tags{margin-top:clamp(16px,2vw,22px)}
@media(max-width:680px){ .tag{font-size:12px;padding:6px 10px} }


/* ---- MOBILE HAMBURGER (zero-JS <details>, revealed via :has() at <=860px) ---- */
.burger{position:relative;display:none;margin-left:4px}
.burger>summary{list-style:none;cursor:pointer;color:var(--d-2);padding:8px 4px;display:inline-flex;align-items:center}
.burger>summary::-webkit-details-marker{display:none}
.burger>summary:hover,.burger[open]>summary{color:#fff}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
@media(min-width:861px){ .burger{display:none!important} }

`;
var B = "/ask";
var lensIdx = /* @__PURE__ */ __name2((k) => `${B}/lens/${k}`, "lensIdx");
var val = /* @__PURE__ */ __name2((k, key) => `${B}/lens/${k}/${key}`, "val");
var CONTACT = { wa: "919100181181", tel: "+919100181181", sms: "+919100181181", mail: "care@pinnacleblooms.org", mcp: "https://ask-mcp.pinnacleblooms.org/mcp" };
var V = {
  // real top conditions by demand (search log + question volume)
  condition: [["gdd", "Global Developmental Delay"], ["speech-delay", "Speech & Language Delay"], ["autism", "Autism Spectrum"], ["adhd", "ADHD"], ["spd", "Sensory Processing"], ["nonverbal", "Non-verbal / late talker"], ["intellectual-disability", "Intellectual Disability"], ["down-syndrome", "Down Syndrome"], ["cerebral-palsy", "Cerebral Palsy"], ["dld", "Developmental Language Disorder"], ["dcd", "Coordination (DCD / dyspraxia)"], ["developmental-regression", "Developmental Regression"], ["auditory-processing", "Auditory Processing"], ["hearing-impairment", "Hearing Impairment"], ["learning-disability", "Dyslexia \xB7 Dyscalculia \xB7 Dysgraphia"], ["rett", "Rett Syndrome"]],
  // real everyday behaviours parents search
  phenomenon: [["meltdowns", "Meltdowns & tantrums"], ["picky-eating", "Picky eating"], ["food-refusal", "Food refusal & textures"], ["co-sleeping", "Co-sleeping & sleep"], ["night-terrors", "Nightmares & night terrors"], ["separation-anxiety", "Separation anxiety"], ["screen-meltdowns", "Screen-time meltdowns"], ["not-following-instructions", "Not following instructions"], ["cant-sit-still", "Can't sit still"], ["running-off", "Running off in public"], ["defiance", "Defiance & saying no"], ["extreme-shyness", "Extreme shyness"]],
  // real intent spine (signs → assess → understand → home → therapy)
  intent: [["early_signs", "Is this an early sign?"], ["concern", "Should I be worried?"], ["definition", "What does it mean?"], ["assessment", "Should we get assessed?"], ["home_support", "How to help at home"], ["find_activities", "Activities to try"], ["milestone", "Milestones by age"]],
  // full age ladder — searches are age-specific
  age: [["newborn", "Newborn"], ["infant-3-6", "3\u20136 months"], ["infant-6-9", "6\u20139 months"], ["infant-9-12", "9\u201312 months"], ["toddler-12-18", "12\u201318 months"], ["toddler-18-24", "18\u201324 months"], ["toddler-2y", "2 years"], ["preschool-3y", "3 years"], ["preschool-4y", "4 years"], ["kinder-5y", "5 years"], ["school-6y", "6\u20137 years"]],
  domain: [["communication", "Communication"], ["cognitive", "Cognitive"], ["motor", "Motor"], ["social", "Social"], ["emotional", "Emotional"], ["adaptive", "Adaptive"], ["sensory", "Sensory"]],
  gender: [["girl", "In girls"], ["boy", "In boys"]],
  // real skills people search (milestones / observations)
  skill: [["joint-attention", "Joint attention"], ["response-to-name", "Response to name"], ["eye-contact", "Eye contact"], ["first-words", "First words & pointing"], ["social-communication", "Social communication"], ["receptive-language", "Receptive language"], ["expressive-language", "Expressive language"], ["self-regulation", "Self-regulation"], ["task-initiation", "Task initiation"], ["problem-solving", "Problem solving"]],
  // real abilities (independence-weighted)
  ability: [["independence-autonomy", "Independence & Autonomy"], ["participation", "Participation in Tasks"], ["planning-organization", "Planning & Organisation"], ["communication-skills", "Communication Skills"], ["social-participation", "Social Participation"], ["processing-speed", "Processing Speed"]],
  readiness: [["self_sufficiency", "Self-sufficiency"], ["mainstream", "Mainstream"], ["school", "School"], ["behaviour", "Behaviour"], ["cognitive", "Cognitive"], ["motor", "Motor"]],
  stakeholder: [["parent", "Parent / Family"], ["teacher", "Teacher / Educator"], ["doctor", "Doctor / Pediatrician"], ["therapist", "Therapist / Clinician"], ["asha_phc", "ASHA / PHC worker"], ["nurse", "Nurse"], ["counsellor", "Counsellor"], ["caregiver", "Caregiver"]],
  institution: [["researcher", "Researchers"], ["government", "Government & policy"], ["payer", "Payers & insurers"], ["early_years_worker", "Early-years workers"]],
  route: [["speech-therapy", "Speech therapy"], ["occupational-therapy", "Occupational therapy"], ["behaviour-therapy", "Behaviour therapy"], ["special-education", "Special education"], ["aac", "AAC / non-verbal communication"], ["early-intervention", "Early intervention"]],
  assessment: [["asq3", "Ages & Stages (ASQ-3)"], ["mchat", "M-CHAT (autism screen)"], ["isaa", "ISAA (autism)"], ["bayley", "Bayley-4"], ["vineland", "Vineland-3"], ["conners3", "Conners-3 (ADHD)"], ["brief2", "BRIEF-2"], ["pls5", "Preschool Language Scales-5"]],
  empowerment: [["early_clarity", "Early clarity"], ["family_empowerment", "Family empowerment"], ["self_sufficiency", "Self-sufficiency"], ["mainstream_inclusion", "Mainstream inclusion"]],
  lifecycle: [["screen", "Screen"], ["plan", "Plan"], ["measure", "Measure"], ["act", "Act"]],
  rag_status: [["red", "Red \u2014 act now"], ["amber", "Amber \u2014 watch"], ["green", "Green \u2014 on track"]],
  score_band: [["as_000_200", "0\u2013200"], ["as_200_400", "200\u2013400"], ["as_400_600", "400\u2013600"], ["as_600_800", "600\u2013800"], ["as_800_1000", "800\u20131000"]],
  body_system: [["neuro", "Neurological"], ["sensory", "Sensory"], ["oral-motor", "Oral-motor"], ["auditory", "Auditory"], ["musculoskeletal", "Musculoskeletal"], ["digestive", "Digestive"]],
  component: [["abilityscore", "AbilityScore\xAE"], ["everyday_therapy", "Everyday Therapy\u2122"], ["therapeuticai", "TherapeuticAI\u2122"], ["therapysphere", "TherapySphere\u2122"], ["gptos", "GPT-OS\xAE"], ["journey", "The 7-step journey"]],
  // real life-skills cluster (the LIFE door)
  lifeskill: [["toilet", "Toilet training"], ["dress", "Dressing & undressing"], ["feed-self", "Feeding self"], ["cup", "Drinking from a cup"], ["brush-teeth", "Brushing teeth"], ["wash-hands", "Washing hands"], ["sleep-alone", "Sleeping alone"], ["routines", "Daily routines"], ["chores", "Helping with chores"], ["tidy", "Tidying up"], ["safe", "Staying safe"]],
  self_voice: [["for-children", "In a child's own words"], ["for-siblings", "For brothers & sisters"], ["for-friends", "For friends & classmates"]],
  icd11: [["6A02", "Autism (6A02)"], ["6A05", "ADHD (6A05)"], ["6A00", "Intellectual dev. (6A00)"], ["6A04", "Learning disorder (6A04)"], ["8A6Z", "Cerebral palsy (8A6Z)"]],
  icf: [["b1", "Mental functions (b1)"], ["d3", "Communication (d3)"], ["d7", "Social (d7)"], ["b7", "Movement (b7)"], ["d5", "Self-care (d5)"]],
  sdg: [["3", "SDG 3 \xB7 Health"], ["4", "SDG 4 \xB7 Education"], ["10", "SDG 10 \xB7 Equality"]]
};
var DOORS = {
  condition: [
    ["autism", "Autism Spectrum", "Signs, levels, and what truly helps"],
    ["adhd", "ADHD", "Focus, impulse, energy \u2014 and real support"],
    ["speech-language-delay", "Speech & Language Delay", "When words are late, and how to help"],
    ["global-developmental-delay", "Global Developmental Delay", "Delay across several areas, explained"],
    ["down-syndrome", "Down Syndrome", "Strengths, health, and early support"],
    ["cerebral-palsy", "Cerebral Palsy", "Movement, posture, and therapy that helps"],
    ["sensory-processing", "Sensory Processing", "When the senses feel too much \u2014 or too little"],
    ["intellectual-disability", "Intellectual Disability", "Learning at its own pace, supported"],
    ["specific-learning-disability", "Learning Disability", "Reading, writing, maths \u2014 the hidden struggle"],
    ["hearing-impairment", "Hearing Impairment", "Hearing, listening, and language"],
    ["childhood-anxiety", "Childhood Anxiety", "Worry that's bigger than the moment"],
    ["childhood-apraxia-of-speech", "Apraxia of Speech", "When the mouth can't find the word"]
  ],
  skill: [
    ["social-initiation", "Social Initiation", "Starting play and connection"],
    ["social-interest", "Social Interest", "Noticing and wanting others"],
    ["imitative-behavior", "Imitation", "Learning by copying"],
    ["contextual-language-use", "Language in Context", "Words that fit the moment"],
    ["picture-description", "Describing Pictures", "Telling what they see"],
    ["visual-reception", "Visual Reception", "Taking in what the eyes show"],
    ["shape-recognition", "Shape Recognition", "Early thinking and matching"],
    ["inhibition", "Self-Control", "Pausing before acting"],
    ["energy-regulation", "Energy Regulation", "Settling the body to learn"],
    ["general-sensory-regulation", "Sensory Regulation", "Staying calm and organised"]
  ],
  ability: [
    ["adaptive-skills", "Adaptive Skills", "Everyday independence"],
    ["attention-and-inhibition", "Attention & Inhibition", "Focus and self-control"],
    ["achievement-growth", "Achievement & Growth", "Reaching new milestones"],
    ["auditory", "Auditory Processing", "Making sense of sound"],
    ["attachment-toddler", "Attachment", "The secure base to grow from"],
    ["autonomy-toddler", "Autonomy", "\u201CI can do it myself\u201D"],
    ["awareness-toddler", "Awareness", "Noticing self and surroundings"],
    ["balance-toddler", "Balance", "Steadiness to move and explore"]
  ],
  phenomenon: [
    ["cant-sit-still", "Can't sit still", "Movement, focus, and what it means"],
    ["bedtime-resistance", "Bedtime resistance", "Calmer nights, step by step"],
    ["defiance", "Defiance & saying no", "The 'no' phase, understood"],
    ["clinginess", "Clinginess", "Separation, security, and reassurance"],
    ["biting", "Biting", "Why it happens, how to redirect"],
    ["covering-ears", "Covering ears to sounds", "When sound feels too loud"],
    ["bedwetting", "Bedwetting", "Patience, routine, and when to ask"],
    ["messy-play-avoidance", "Avoiding messy play", "Touch, textures, and gentle steps"]
  ],
  domain: [
    ["communication", "Communication", "Understanding and using language to connect"],
    ["cognitive", "Cognitive", "Attention, memory, problem-solving and thinking"],
    ["motor", "Motor", "Big-body movement and fine hand control"],
    ["social", "Social", "Relating, sharing attention, play and turn-taking"],
    ["emotional", "Emotional", "Recognising, regulating and expressing feelings"],
    ["sensory", "Sensory", "Making sense of sound, sight, touch and movement"],
    ["adaptive", "Adaptive", "Eating, dressing, toileting \u2014 daily independence"]
  ],
  age: [
    ["infant-9-12", "9\u201312 months", "First words, pointing, standing"],
    ["toddler-12-18", "12\u201318 months", "Walking, naming, following simple steps"],
    ["toddler-18-24", "18\u201324 months", "The word explosion \u2014 or its delay"],
    ["toddler-2y", "2 years", "Two-word phrases, pretend play"],
    ["preschool-3y", "3 years", "Sentences, sharing, toilet training"],
    ["preschool-4y", "4 years", "Stories, scissors, friendships"],
    ["kinder-5y", "5 years", "Letters, numbers, self-care"],
    ["school-6y", "6 years", "Reading, writing, school readiness"]
  ],
  assessment: [
    ["asq3", "ASQ-3", "Communication, motor, problem-solving, social"],
    ["mchat", "M-CHAT-R", "Early autism screening for toddlers"],
    ["ados2", "ADOS-2", "Autism: social, communication, play"],
    ["bayley4", "Bayley-4", "Cognitive, language, motor, adaptive"],
    ["vineland3", "Vineland-3", "Everyday adaptive behaviour"],
    ["abas3", "ABAS-3", "Adaptive skills across settings"],
    ["isaa", "ISAA", "India's autism severity scale"],
    ["brief2", "BRIEF-2", "Executive function and self-regulation"]
  ],
  readiness: [
    ["speech", "Speech Readiness", "To understand and be understood"],
    ["motor", "Motor Readiness", "To move, balance and use the hands"],
    ["behaviour", "Behaviour Readiness", "To regulate, attend and cooperate"],
    ["cognitive", "Cognitive Readiness", "To think, reason and learn"],
    ["school", "School Readiness", "For the structure and demands of school"],
    ["self_sufficiency", "Self-Sufficiency", "To manage everyday life independently"],
    ["mainstream", "Mainstream Readiness", "To thrive in an inclusive setting"]
  ],
  stakeholder: [
    ["parent", "Parents & Family", "Warm, plain language \u2014 and one clear next step"],
    ["therapist", "Therapists & Clinicians", "Technique, measurement, progression"],
    ["doctor", "Doctors & Paediatricians", "Codes, thresholds, referral pathways"],
    ["teacher", "Teachers & Educators", "Classroom strategies and inclusion"],
    ["asha_phc", "ASHA / PHC / Frontline", "Screening and early identification"],
    ["caregiver", "Caregivers", "Day-to-day support and safety"]
  ],
  score_band: [
    ["as_000_100", "0\u2013100", "Earliest emerging \u2014 where early support has the most leverage"],
    ["as_200_300", "200\u2013300", "Building foundations \u2014 steady, targeted gains"],
    ["as_400_500", "400\u2013500", "Progressing toward the mid-range"],
    ["as_600_700", "600\u2013700", "Approaching age-typical"],
    ["as_800_900", "800\u2013900", "At or near age-typical \u2014 sustain and enrich"],
    ["as_900_1000", "900\u20131000", "Age-typical and thriving \u2014 ready for mainstream"]
  ]
};
var doorsOf = /* @__PURE__ */ __name2((kind, n = 12) => (DOORS[kind] || []).slice(0, n).map(([slug, label, sub]) => ({ label, route: val(kind, slug), sub })), "doorsOf");
var items = /* @__PURE__ */ __name2((k, n = 6) => DOORS[k] ? doorsOf(k, n) : (V[k] || []).slice(0, n).map(([key, label]) => ({ label, route: val(k, key) })), "items");
var all = /* @__PURE__ */ __name2((k, label, route) => ({ label: label || `All \u2192`, route: route || lensIdx(k), all: true }), "all");
var LENSES = [
  ["age", "By Age", "Birth to 7 \u2014 the golden window"],
  ["gender", "By Gender", "How girls & boys can differ"],
  ["dev_age", "By Developmental Age", "Distinct from chronological age"],
  ["domain", "By Developmental Domain", "7 KO\u015AA domains", true],
  ["body_system", "By Body System", "Neuro, sensory, oral-motor +"],
  ["organ", "By Organ / Structure", "79 structures"],
  ["condition", "By Condition", "Autism, ADHD, Down syndrome, CP"],
  ["phenomenon", "By Everyday Behaviour", "Tantrums, sleep, feeding"],
  ["intent", "By Question Type", "Signs \xB7 support \xB7 activities"],
  ["ability", "By Ability", "153 abilities"],
  ["skill", "By Skill", "538 observable skills"],
  ["assessment", "By Gold-Standard Assessment", "ISAA, Bayley, Vineland +40"],
  ["readiness", "By Readiness Index", "The 7 readiness indexes"],
  ["score_band", "By AbilityScore\xAE Band", "What a 0\u20131000 score means"],
  ["rag_status", "By Progress Status", "Red \xB7 Amber \xB7 Green"],
  ["empowerment", "By Path to Mainstream", "Clarity \u2192 independence \u2192 inclusion"],
  ["route", "By Therapy", "Speech, OT, behaviour, special-ed"],
  ["lifecycle", "By Journey Step", "Screen \u2192 Plan \u2192 Measure \u2192 Act"],
  ["component", "By PinnacleAI Capability", "AbilityScore, Everyday Therapy, GPT-OS"],
  ["stakeholder", "For Whom", "Parent, teacher, doctor, therapist"],
  ["language", "By Language", "Multilingual delivery"],
  ["icd11", "WHO ICD-11", "Diseases, 11th rev.", true],
  ["icf", "WHO ICF", "Functioning", true],
  ["ichi", "WHO ICHI", "Health interventions", true],
  ["snomed", "SNOMED CT", "Clinical terms", true],
  ["sdg", "UN SDG", "Goals 3\xB74\xB78\xB710", true]
].map(([kind, label, tag, who_un]) => ({ kind, label, tag, who_un, route: lensIdx(kind) }));
var lensObj = /* @__PURE__ */ __name2((k) => LENSES.find((l) => l.kind === k), "lensObj");
var col = /* @__PURE__ */ __name2((kind, head2, idxRoute, n = 6) => ({
  eyebrow: head2 || (lensObj(kind) || {}).label || kind,
  head: { label: head2 || (lensObj(kind) || {}).label, route: idxRoute || lensIdx(kind) },
  links: [...items(kind, n), all(kind, "All \u2192", idxRoute)]
}), "col");
var AUDIENCES = [
  {
    key: "parents",
    label: "Parents",
    tagline: "Start here, in plain language",
    lead: { title: "Early clarity changes everything \u2014 talk to a real team today" },
    cols: [
      col("intent", "Is this typical?", lensIdx("intent")),
      col("phenomenon", "Everyday behaviours"),
      col("condition", "By concern", `${B}/conditions`, 7),
      { eyebrow: "Do at home", head: { label: "Do at home", route: `${B}/home` }, links: [
        { label: "Activities to try", route: val("intent", "find_activities") },
        { label: "Therapy at home", route: val("intent", "home_support") },
        { label: "Best toys & materials", route: `${B}/materials` },
        { label: "Exercises by skill", route: `${B}/skills` },
        all("intent", "All how-to \u2192", `${B}/how-to`)
      ] },
      { eyebrow: "Get clarity & next steps", links: [
        { label: "Free AbilityScore\xAE", route: `${B}/abilityscore` },
        { label: "Do we need therapy?", route: val("intent", "assessment") },
        { label: "Late-talker vs autism", route: `${B}/compare` },
        { label: "Myths & facts", route: `${B}/myths` },
        { label: "Find a centre", route: "https://pinnacleblooms.org/centers" }
      ] }
    ]
  },
  {
    key: "professionals",
    label: "Professionals",
    tagline: "Clinicians \xB7 educators \xB7 institutions",
    lead: { title: "Partner with India's WHO-coded child-development authority" },
    cols: [
      col("stakeholder", "For whom"),
      col("institution", "For institutions"),
      col("assessment", "By assessment", `${B}/assessments`),
      col("route", "By therapy / intervention"),
      { eyebrow: "Coded to the world", head: { label: "Coded to the world", route: `${B}/code` }, links: [
        ...["icd11", "icf", "snomed"].map((k) => ({ label: lensObj(k).label, route: lensIdx(k) })),
        { label: "WHO ICHI", route: lensIdx("ichi") },
        all("icd11", "All standards \u2192", `${B}/code`)
      ] }
    ]
  },
  {
    key: "children",
    label: "Boys & Girls",
    tagline: "The child, growing",
    lead: { title: "Every child can grow \u2014 let's see how yours is doing" },
    cols: [
      col("age", "By age", `${B}/ages`, 8),
      { eyebrow: "By gender & profile", head: { label: "By gender & profile", route: lensIdx("gender") }, links: [
        { label: "In girls", route: val("gender", "girl") },
        { label: "In boys", route: val("gender", "boy") },
        { label: "Premature / NICU graduates", route: `${B}/lens/age/newborn` },
        { label: "Typical vs delayed", route: `${B}/milestones` },
        { label: "Milestones by age", route: `${B}/ages` }
      ] },
      col("domain", "Developmental domains", `${B}/domains`),
      col("skill", "Milestones & skills", `${B}/skills`),
      col("body_system", "By body system")
    ]
  },
  {
    key: "self_sufficient",
    label: "Self-Sufficient",
    tagline: "Toward an independent life",
    lead: { title: "From first words to full independence \u2014 we'll map the path" },
    cols: [
      col("empowerment", "The path"),
      col("readiness", "Readiness", `${B}/readiness`),
      col("ability", "Abilities", `${B}/abilities`),
      col("skill", "Skills", `${B}/skills`),
      { eyebrow: "Measure progress", links: [
        { label: "Life skills", route: `${B}/life-skills` },
        ...items("score_band", 5).map((x) => ({ label: `AbilityScore\xAE ${x.label}`, route: x.route }))
      ] }
    ]
  },
  {
    key: "mainstream",
    label: "Mainstream",
    tagline: "Toward inclusion & mainstream school",
    lead: { title: "Mainstream school is possible \u2014 let's build the readiness" },
    cols: [
      col("empowerment", "The path"),
      col("readiness", "Readiness", `${B}/readiness`),
      col("rag_status", "Progress status"),
      col("lifecycle", "The 7-step journey"),
      { eyebrow: "School-readiness", head: { label: "School-readiness", route: val("readiness", "school") }, links: [
        { label: "Following instructions", route: val("skill", "task-initiation") },
        { label: "Sitting & attention", route: val("phenomenon", "cant-sit-still") },
        { label: "Pencil grip & writing", route: val("skill", "first-words") },
        { label: "Social play & sharing", route: val("skill", "social-communication") },
        all("readiness", "All readiness \u2192", `${B}/readiness`)
      ] }
    ]
  },
  {
    key: "life",
    label: "LIFE",
    tagline: "Because every child deserves a wonderful life",
    lead: { title: "Because every child deserves a wonderful life \u2014 let's begin" },
    cols: [
      col("lifeskill", "Daily-living skills", `${B}/life-skills`, 7),
      { eyebrow: "In their own voice", head: { label: "In their own voice", route: lensIdx("self_voice") }, links: [
        { label: "In a child's own words", route: val("self_voice", "for-children") },
        { label: "For brothers & sisters", route: val("self_voice", "for-siblings") },
        { label: "For friends & classmates", route: val("self_voice", "for-friends") },
        { label: "Stories from our families", route: "https://pinnacleblooms.org/stories" }
      ] },
      { eyebrow: "Growing up", head: { label: "Growing up", route: lensIdx("lifecycle") }, links: [
        { label: "Starting school", route: val("readiness", "school") },
        { label: "New skills emerging", route: `${B}/transitions` },
        { label: "Into adulthood", route: `${B}/adulthood` },
        { label: "Puberty & the teen years", route: `${B}/transitions` },
        { label: "The 7-step journey", route: lensIdx("lifecycle") }
      ] },
      { eyebrow: "Family & wellbeing", head: { label: "Family & wellbeing", route: `${B}/family` }, links: [
        { label: "Family wellbeing", route: `${B}/family` },
        { label: "Sibling support", route: val("self_voice", "for-siblings") },
        { label: "Parent self-care", route: `${B}/parents/wellbeing` },
        { label: "Counselling & support", route: `${B}/counselling` },
        { label: "Community & peer groups", route: "https://pinnacleblooms.org/community" }
      ] },
      { eyebrow: "Rights & access", head: { label: "Rights & access", route: `${B}/rights` }, links: [
        { label: "Rights & inclusion", route: `${B}/rights` },
        { label: "Financial access", route: `${B}/access/financial` },
        { label: "Legal access", route: `${B}/access/legal` },
        { label: "SEVA\u2122 \u2014 equity", route: "https://pinnacleblooms.org/seva" }
      ] }
    ]
  }
];
var EXPLORE = {
  key: "explore",
  label: "Explore",
  tagline: "Every angle on childhood",
  lead: { title: "Bring the world's child-development Ko\u015Ba into your AI", mcp: true },
  cols: [
    { eyebrow: "Ways in", head: { label: "Ways in", route: `${B}/lens` }, links: [
      { label: "How-to & activities", route: `${B}/how-to` },
      { label: "Materials & toys", route: `${B}/materials` },
      { label: "Compare conditions", route: `${B}/compare` },
      { label: "Outlook & prognosis", route: `${B}/outlook` },
      { label: "Local services", route: "https://pinnacleblooms.org/centers" }
    ] },
    { eyebrow: "The child", links: ["age", "gender", "dev_age", "domain", "body_system", "organ"].map((k) => ({ label: lensObj(k).label, route: lensIdx(k) })) },
    { eyebrow: "Concern & behaviour", links: ["condition", "phenomenon", "intent"].map((k) => ({ label: lensObj(k).label, route: lensIdx(k) })) },
    { eyebrow: "Measure & outcome", links: ["ability", "skill", "assessment", "readiness", "score_band", "rag_status", "empowerment"].map((k) => ({ label: lensObj(k).label, route: lensIdx(k) })) },
    { eyebrow: "Therapy & journey", links: ["route", "lifecycle", "component", "stakeholder", "language"].map((k) => ({ label: lensObj(k).label, route: lensIdx(k) })) },
    { eyebrow: "Coded to the world", links: ["icd11", "icf", "ichi", "snomed", "sdg"].map((k) => ({ label: lensObj(k).label, route: lensIdx(k), who_un: true })).concat([all("icd11", "All codes \u2192", `${B}/code`)]) }
  ]
};
var LANGS = [
  { code: "en", label: "English", htmlLang: "en", live: true },
  { code: "te", label: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", htmlLang: "te", live: true },
  { code: "hi", label: "\u0939\u093F\u0928\u094D\u0926\u0940", htmlLang: "hi", live: false },
  { code: "kn", label: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1", htmlLang: "kn", live: false },
  { code: "ta", label: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD", htmlLang: "ta", live: false }
];
var STANDARDS = LENSES.filter((l) => ["icd11", "icf", "ichi", "snomed", "sdg"].includes(l.kind));
var ABOUT = [
  { label: "About Ask Pinnacle", route: `${B}/#about-faq`, tag: "What the Child Development Ko\u015Ba is, and who it serves" },
  { label: "Methodology & accuracy", route: `${B}/#about-faq`, tag: "How answers are built, coded and validated" },
  { label: "Pinnacle Experts Consortium", route: `${B}/#about-faq`, tag: "The clinical &amp; academic authority behind every answer" },
  { label: "Pinnacle Blooms Network", route: "https://pinnacleblooms.org", tag: "India's largest child-development network \u2014 70+ centres" },
  { label: "IRWFA", route: "https://www.irwfa.org", tag: "International Rehabilitation Workforce Alliance" }
];
var MACHINE = [
  { label: "MCP endpoint", route: CONTACT.mcp, tag: "Connect any AI agent to the live corpus over Model Context Protocol" },
  { label: "llms.txt", route: `${B}/llms.txt`, tag: "Machine map of the estate for large language models" },
  { label: "llms-full.txt", route: `${B}/llms-full.txt`, tag: "Full expanded LLM index of every answer surface" },
  { label: "Open dataset (DCAT)", route: `${B}/dataset`, tag: "Catalogued open dataset, discoverable in Google Dataset Search" }
];
var SEO = [
  { label: "Sitemap", route: `${B}/sitemap.xml`, tag: "Every indexable URL, for search engines" },
  { label: "robots.txt", route: `${B}/robots.txt`, tag: "Crawl policy \u2014 open to people, search and AI" },
  { label: "Languages (hreflang)", route: lensIdx("language"), tag: "Language &amp; region signals for international search" },
  { label: "Open data \xB7 CC-BY 4.0", route: "https://creativecommons.org/licenses/by/4.0/", tag: "Licence \u2014 free to read, free to cite with attribution" }
];
var LEGAL = [
  { label: "care@pinnacleblooms.org", route: `mailto:${CONTACT.mail}` },
  { label: "Informational \u2014 non-diagnostic", route: `${B}/#about-faq` }
];
var MISSION = "For 900M+ children \xB7 self-sufficient, mainstream life";
var ABOUT_FAQ = [
  ["What is Ask Pinnacle?", "Ask Pinnacle is the Child Development Ko\u015Ba \u2014 a free, open knowledge layer covering how children develop: every condition, behaviour, skill, ability, milestone, assessment, and therapy, coded to WHO standards and written for parents, teachers, and clinicians alike. It is built and operated by Pinnacle Blooms Network, India's largest child-development network, as a public good."],
  ["How is it organised \u2014 and what are the \u201Cvantage points\u201D?", "Every answer can be reached from the angle that matches how you think. The knowledge spans 18 dimensions and is cross-indexed by 26 vantage points: by age, gender, developmental domain, condition, everyday behaviour, gold-standard assessment, WHO ICD-11 and ICF code, AbilityScore band, readiness, who is asking, and more. The menu lets you enter as a parent, a professional, or by the outcome you want for the child."],
  ["Who is Ask Pinnacle for?", "Parents and families first \u2014 every answer is written in plain language. It also serves teachers, therapists, doctors, frontline ASHA/PHC workers, students, researchers, and the AI assistants people now ask. Each answer carries the depth a clinician needs without losing the clarity a parent deserves."],
  ["How accurate is the information?", "Every condition is coded to the WHO International Classification of Diseases (ICD-11) and aligned to the WHO International Classification of Functioning (ICF), verified live against the WHO's own API. The knowledge is grounded in 2.5 billion+ scientifically assembled data points and 25M+ therapy sessions across 70+ centres, and the AbilityScore\xAE methodology behind it is peer-reviewed and published (DOI 10.5281/ZENODO.19482123)."],
  ["Who writes and reviews these answers?", "Answers are developed and reviewed by the Pinnacle Experts Consortium \u2014 the clinical and academic authority of Pinnacle Blooms Network, affiliated with the International Rehabilitation Workforce Alliance (IRWFA). Review is held at the organisation level by qualified professionals; clinical content is never attributed to a fabricated individual."],
  ["Is anything here a diagnosis?", "No. Ask Pinnacle is strictly non-diagnostic. It helps you understand development, recognise signs, and know when and where to seek evaluation. A diagnosis, and the personalised AbilityScore\xAE, are formed only at a centre, by a qualified clinician who can see your child."],
  ["Is the knowledge free and open?", "Yes. All of it is open \u2014 to people, to search engines, and to AI systems \u2014 published under a Creative Commons CC-BY licence. Nothing is paywalled and nothing is hidden from crawlers. The only step that asks you to sign in is the personalised AbilityScore\xAE screener, because it creates a private record about your child."],
  ["Can AI assistants and researchers cite Ask Pinnacle?", "Yes \u2014 and they are meant to. Every page is machine-readable with structured data and stable canonical URLs, the corpus is available to AI agents through a dedicated MCP interface, and the methodology and validation are citable by DOI (10.5281/ZENODO.19482123 and 10.5281/ZENODO.19482476). Attribution under CC-BY is all we ask."],
  ["What languages is it available in?", "English today, with Telugu live and Hindi, Kannada and Tamil in progress. Every answer is written to be spoken aloud, so it can be delivered by voice over a telephone line in a caller's own language \u2014 part of a path toward 133-language reach, so a family's language is never the barrier."],
  ["Who builds and operates Ask Pinnacle?", "Ask Pinnacle is built and operated by Pinnacle Blooms Network, operated by Bharath Healthcare Laboratories Pvt. Ltd. \u2014 a CDSCO Class B licensed developmental-care platform spanning 70+ centres across four states, with 700+ therapists and 1,600+ practitioners trained across the ecosystem. The standards it teaches to are set with the International Rehabilitation Workforce Alliance (IRWFA)."]
];
var LOGO = "data:image/png;base64,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";
var ARCHIVO_FACE = `<style>
@font-face{font-family:'Archivo';font-style:normal;font-weight:400;src:url('data:font/woff2;base64,d09GMgABAAAAAIhwABQAAAABXiAAAIf8AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGoNYG+d0HIsGP0hWQVKFEgZgP1NUQVSBTicuAIUuL34RCAqB0UCBoT4LhF4AMIK8OgE2AiQDiTgEIAWKPAeMfQwHW11CUcJUGdDdqDerVGeImx85G9G6bQQU2srxJDMratZolYXo/09JOmRscB3w8WdpBXoEnYhkOgxGcU5J3Su3lNtsVFV1d+oVILk6vQkOJ4cvuu8VA7N3SleaXsvZdKYhiI827g4tX4WkvQ1Br1XIoZX1yHzP+z5AZ/lhcrzpb/5R9snwIsJ7jWrktkJ4pEfz4DLfA0ruIrBxGSNZddYL/1Fd/Z8bkVXVyIHUMw8fBFcUVkQOz8+t9/8qGDDWzYAFCxhsY2MDBgxaIke0IiIgKmGdFegpRuVhxRl9Z+SdcZ7nnRfGnZ4ypNP3T2RQ7ODjAqcpIU1/6jTIzudlLQIE0LFj0RHz/Pdj/1v73K9ApZlO11Dck2t+UslkhlIokU7zSih6/ke36o8h6zqmEBIYxOIQhWAeQsCT2UxY86K66t5V1VXNdVftu9ZleJ2+PTtAHzi/BDz1pqHLRq5K291cAL7kYxI7BpRZFsITsCUDQYnnNZ0N9E+WVYgHOrMM6cz/ZmWWLcmyiEdIZpk2BJ/wGOrj9XcOivKK8oqKCJPHIVj2T/1Zvar6YKAfY+j0SsfLnqqSDOxOK0L3AF4Y/1dT/6u6VdwoakkGDOOn5A8grGaxmbN3Sxpaz2aP9IDjhxh0YkhkmSQ1V/38uTaU8YgGWhx1STcef77Ix9fFFTU4rra61YPwYIXre+kV+5GwUS5PhoRyLCHO1sTf/ZeAODUTtBcMStD7V7Y9cC+Q1f8A/Y1H5nRCy9ZOl4iHVHhm9O3fBAUGByzU9f6uIbBj5QNCidQBCe6sF0CWW7k9oABz9bEKBMD/mZq280GFvZPDKg8cB4p/HZdyapXy6+1etSt7uATExYKkFss7eQkqLHDhLXlpCJLPQ/Ckd1BMcYC781tQaUEl6BxCakOOpZs+5aK0Sle9K5el69Lw/980pfvmJkc76UopFQaQUiGM9X0sa7+UcelKaw3gABgYgBqAzt+bWpb+Bwx3mmuxHvKcGqEWlPxIVUq5HJKyJjLOdb/XPb8NmrDUkuAYErOjBTEjLUDKYDgaFRrdaABkk+O4nlpvKeOxnitLeRdZk5kz1qVXCuI1PlIpuwsihRdebCPjwuTC8JLgPM9rp+g9weF3vEyWFKiCwwPAjnRQInN/CQVxBquyhYK1YX2fUnay14CPMAQRkUYaaULjikiQIbv3v4Zvac40hvKWHFoHoT3+fO1EN8g2xYNRPMpAVsCQDVcsCDnGWv+OV+teteehHTAiESkaIaK5vv4fjUAQwmkran5nMFggkkCkmAii1yQwz9LqEC/eepDQEAWEmBKBkEbhQEDAAHoBIjCw0FAQAAQjHghIFAa0NfB/qbQqgEZLAAyAlG4uuaK7yrkuui2+47grvMe+L7tffL/c+un5+9v3b7z/1IPbH9zz6PZHzz6+7fEr4spGtHnTxi0bt27ctXHf09ue3vn0nmcnnt327M5n92zet/nE1tLWA1uPbt+yfc/20zu37tz7/N5hnAMrHW4OzwzvHj67+8TuM6ObR8+MXnE7e3fvPbU///yU52e/SA7Sg1NfnvHyglf7X137y4k3028ZA9Nkmk6704V3Rxx30+NPLj09/fTSM1AkxaHz8y6OvLjmf2ADG9r9+9MPLiIu4cSnl+p3UV+sHCTTpEgQirF6o9v0+aXmleaN1kzblbc6V9Enm8PNg3SaFinCa91EV7sNfIE4mIpISIn04zPTPYC6wOoKVAGvqSGnHt89XQDhxdlAp3/w+JUzN85segRMCIADBA195kLGpa7RqlfUD4CAH+MEACzNDghABQU/ePkVxQKQd9/GNoAMEgDpjwMQMIjddrAMEH3RBMB52gACKoBlkIMe9w0I9QwNaSZ40FBAdbVrvcM+GmgQoQaA373xs7uuOuOIXTYYNN80HZoFFEhmpYIgfYyMO8ADKB8NcL4d3nBNiIq1N443K1txZp2uugREflRvWLHswKht37zB8SG+RW6rHDu4QI0XCxnW2FVwDKMoHqhNH5FW1+Nlis6voXkuAv6hsngzf2cMtSdeqFXMc9S5eBXZWbTdfvbloz7ezz9s2BY/5PkaP+Y/+zUUawxoBeJzT4z3wc1wMZzcc/AGe8KWsGTPbEA/qc9X/wd+ha/grcN8qqO6KkAARUAwDdbDgUCCILY998M53QACVJ/rvRyS2BwWKLoqe4ArtyHSt2agMrPSl0HdVqjtKQnBC+ZaCjwDj8V9xf2Be8z6t3FncEdSW3BLcXNhSk+337gRV4HLxDlxOpwIF4KDsf8Cf/Q8R3O3sWew+7BbsKuwc7E92HZsNTYX6yMVi9VgRcDoIQNiyfNdfzP8euPvz7uTNzz4zLuf3licHB3OA3h3HU30OqNvz7qSNjTQTMzdWXWrJFu8Y1qVpKKHtqSe9zW1Hjm6tXCLS7W8ufbYbt+S4tJD4p5QPXnbsQDywx0rb3crQmvPeabxKgaYSR+tDKmQJqENPViIPX1AQppLbXv3D577z1m73/QLy8M75Jt8iU/zDm/2Ek9zl1s9Ej0yNKY5Ef7fcntol23IttkaYEn7aTbBmi1gBcRvldiXWU1lLMObCQChIODPtA4ihVb4RLikN6J4TyF+eFiIB+Xb86GoqBW26GM6G0LBW34O3vqkhfqAkQG+fKw4wJcZxkjMZ1jr3M2jULQKRXJmOaDdG0ApcjQSdiKnCYEuP6hsHDjGKRK8cP0ywYkWRLtJYkPSmLf8nETrAerczcgQGftqkiMFgnEey2PpKhbiDJbQPjwpKLMODg1aGDCTTEwH+nxuqC0gJiVjRqYCWIMKvwBtKiWP0iMKjxSN6WG17UG3cyTK+qE2lHlBHYuvhEo2I9lpRimv0SQKom6jTHuN7zU6Egq6TGizd/B2qx3Z5WLVpBjknGE7NBPq5vFNoCtgQg0Gg8FgULYEH8iTvkhrhwwwViiSNmBHxcsXNXAnWcrcW5oZ80+gk6hRM1EmojSIYn6O8FMKtvlSaBvCM2EpPZHCOCAHdpwZRZ6ZMasWRTqfSXY4H3MvmVPBtseM0BRh/g+uFRDSW0MYUE1+DtVygJfMyEJwnD6bhDN+r26ZzN/zi4vZRfKTzWLTLsqqrNNIUlaZWmWMqCkYUh4HeWokKz0xPFGmiJ8QJDOSR+u9CPO2Vm9bJlpgQEpWz6hQH8Mn2rJoj7Z6SnzyZ9JHmk4wIdWk6adGq5iYpjIzVVNoTSMsI9SIN0snXZkhb74VmGeQuZ5VZi/PxFlxhRIjW2ttCaYaSjDJREX/k6aq+cyMJB9sSaSFZp1jjG+QYsYS2kZVsmSG6Mis6cYxk1SdQ7U6SMykgTeqE2nl10iO4lAjW+Z7/ShgMJSo48gGsXCWRzmBQLRPjHwvP4xG0e7TnJyygzPaCXp6BbJGNn/yCozs8aLAyJ44lKinky1bfXyT6nmpVy0ladwIycbR6N1ExVGeyhHKo0nIyN5B86dpIYH2rPRMauEbXbhsNhRFnBHM6J0inJsZ9DGzz60XLbF2UMqRkVWGyqgBhbUG6lkU4ElPoUzwiU+eN3uEAXqNa9Vdi6qm7qaydejRqt2nqtdoHrO6TVfrbJ2oA7Vjb8NnFJMhcu1HET7GV4Achl1/gHDNzPYYltBtgnzA6AwxDGrfgSO07kC1FkJKsfVwPvK0IquN1M63F6QGAs5GFRDrDigZDrNkxcxyqQ5MFyujFJVdBggiNKn8LNJE0Qj2yw4LPLg7wAP3rgxcwMAW7iBQU3GhdHQA2KXq51LQbzs/+Nvpzpn26PjTZDjG6XLuuftF31uwH9JGiksyuQ5s0iZ9Ex2JxkMqp5SO9N4EK7p2pA7e93ZYA3Jdljkf8VphDcSex+3lXZYy1la41Id9e07nbWufYIqH1S19IN1Ge/XHrUy81bjv6pZ5mbTQP9ZkurY17J4Eljlap3t41DJT77teF1nvuuzWc5Zb3TbYrGnjAEdqZn9E7+jBkOJmdmd1rqXWKNE3KclVZ0aZoklmNqhjJEZzQSJHXw9bto06j9U404pbLoHbyxz9+edXeuOw5pdYi21D5ya7i2cihkr9I34r9zjuFigt6bzlXjRxOoedPYe4eD4oLTopG7jG/33TdwPBtDF2/+nbP3P9WXIaeSZyHZ3Xq6YbNqfG84Oq4X47JJfMlDiarIZiNuNjr2EOHPI420jJeCyX10/Jy402xmmubPgtY+ehmGtDxq05vQbmBAtE3sJ2xrkGpbwTQde8vrW8CtCsx47gPIkhAsFncrsaI437rIFpolp7lNFt9GXZ/q2k1RQ+Xr69G9yqb7jES7K7BJ1bSlvyWmDopF1sY54lbdiTnO3jsnvkkkaC7/dJy37o/X0eDsu74VL+2FFPhDWdzebVcHhNyvrPwN1Ww73SzYwVzX8ID4dBwhGTnh/De7HJ9ZLyhJp3KRu4PYs3VdL9O7aNAXc4pl8Z/UHPg3ZzMfTPrS1oO8Ojbo7btUxNtvB8im2TMxXU2jjG6ZbDWeUS8ZxjPy5rRzMzK1FoP3In0kffwvFrVno9McHb2WUjy/X57+qLq365H4D9cPWfxGUfmc7PxattfU5Ge+mr5yVf5rGQbjl0TcavSqvv+Pw1Lirp/lUbnmvmuzN5vNfjW3nuoRSVxhhvIU65RDuU4XodcSayl29/fVl9/IBo5S71+x0ql2TgvEbXn5E3z8cYlu0j+WqXz9k8T7H8WpTCymcKh9SypXHj30rilsIJp51FlxwUXY0QEGHdh9e/RazobN0UyS1RlGR+ekWarMrVi9GoiVuL/vQYYxyviXqkm2quDMedUOiK64rddEu5e+6p9MAjARDVMwBi/OfXSKKBbgaYwyIWMI+5zKBdKS1kvttBpBYvg5LXRYiSlomxPg1Mpku1ywA3MEVxmaj3XpBDB8nUqA5wNuwgcCAhQAQmrAPDSSYRJRgNGC0iERNFJAM0RtFImJRyZhYErBVaj4aJax5Usz2xeKSD8COTIVjmN5YixbCUKIOhXK2gDQz1sDSAaIShSRDNha3lFGKkNgjGaIdjLBQ6UqlTFxzjkqrbBAgmThA9JiEz2RRhpgrNNCLfkJlOagaembhmkZiNbg6OuZPQAQcxHHIY2xEVo4Wa5STCXC56OzWeuxQfLXAffA9S4KFHxN4vDMO33qcRBBYYHJDgi1WPE0sQoZBQwRaGABcdD4UykaiohQk35/fBdSLkQARKcOeCcFdoC0Sy5CoFUM7oITGrmvW8Vu2ZOvX1INTJlXBqDUBL1XZBq5/wuv+4B0NxFMjhw0OGdA7X9HWOpo7p0UaCD9QsDvBrLoDBhXdvew7CkTA79GzpCPXBX6nWpjmB3P8vGvGv3+6J9sHesHXaIzKYDULww+8Dv/50ESzUcWMqtxFMGv7Jr0ijFj2mnpn9MaedcdsP7nicUKg8DXTxPkgimRR8pJJGOuVUUEmAKqqpoZYGmpj4JMTsGYCek4866mmgkSaaaaGVdjropItueuijnwEGGaLm02DW3gv31d2FZUQIzFd4dQyUBnkDBgiQoECDAQtuX09ndy1ekkgmBR+ppJH+aEYDL5Wcrr4V2Nq3SXoFqCRAFdXUUOt1WezmjT577DuuGzw1sXl/ho9Uj7aq5KJzf+dAX612DnKkh1ehW0UGECBBgQYDFlyHY/V1qHJuBieQkVNQUrmoyZK7JTH4bLH+ElrBWZf1IngEbQwzwihjjDPBJFPMdOasW5cxEo0Zi9sorJ2P6Zu3g066vCfpvaCPfia1MBcuwvwF3JRC4a17cAEKrOeecH7n0P5JsTbjaPDoc3gELj4s3XcW6ovaGQCB092437jdI8z363XMAeO+FYfXmV0Bj1EQbWYNiGIFNW465+hsZqbTp0lfecV/8x8ahTv/CPj6F8hALCxUkFTWZpFBAt/8qJWmDqrcHsw/ue2jIvIpW/YzMsmWIQRFvhv8nbRqOMw8CpEZIrRtHDi0ypoFe9YnO15QLgjE74iMqub3clz58fmV8KtDc1f9thtyuWUKqyBwpEh8V/vOikJuuJjpnF8pUrl/pFbY8c/wECHEjwRzJOiDUctLQOXtDBJwPxR4nLTddrMTGHjM+k6zOYO591pVDaY8qRuo0POkRZtC10IbzS/UPpvPLKh4kV6GolePLQNy3/juV8jDLHSokMCAAwtetEedICiCQ8gtDbgVomEMl72pA/OtbE76oA0NaYUqlK1EaSUQ0Qc54wDrrzCXjw7Er8G1Cf/a3WqYZ17obUCbEb2//yhkeBhCEJkEplg/mCw9YPz6IOr+Yr1oyQIBcfbjQ6yDD4bQ6QMwx59nKRCHOAOt+pAMHsQdQkwtxWjJCSyzjlLAaQrxN++43g5Q/Z5ixttYm9M4FVkIQXhgnOytcg4sgQ5CNBjQ8gbkkRDHwdCIwJPvOwLirsWgAwOqWv9iEkFgMzFqIBCIVSQ0qVE49xixuo03AQRqbjA65lOL5AAKSPIoMrZuLiSxdBjCAkgJkhIO9xwZrDhBXCwfyRUbWDwKkOaTAbcjGcLsiIewfsLpoSEixBRf4qAYhKx89CyxxRFXPPElkFAiiSWRVDLJpZBSKr0KYV7y0uV1YQCNYKh3gAwAyKKK6KHz6NfT1oUULDqQ1GqFw0BiSlW6vuy1qLIVyumDQT0gK7CpAirgh/1EI1Twqx9olEmF3IJ+2xXC1jYkqrsf+PFm8K88GrFHNjUs8q/Q+RGm6C4f/5zQQkN4iAARIfKNeswoSB4UrXjR89xcZtE2c9xNlvjq6qqrA9etKK803azgG+KsysqaRVrSE2saq8z15yELSQsPL8vLq7EvN1kgZDKFkOX6fHwE77bYbDpvZkQEY9FoIU1IDU6dHhkUTaOIhHj4vWFM6e+fPDkmLgekZGkys6TZOZ6lAwlC4Yy3W6FAo3t0OhyukFA4IiNDj8nNRSIRiEIFVKjeRiiUVpufPwnb0BC78kqSXMGlbm+TE7Eow+pPonaq2GOz9RUmhxYXywvxSkhqdZjD6JfYcwpSKslWYxGLmxSs4nWgWABDZj8FAHI9GfgM/v8XELcdVidPYgp53TTGnsmiXsTG3sWq3seRPsT0fkBf/8a8/sIMGHqMvDHw/55P2WxpYNl0TbHh7Jg5UZXRri37Lqu/uF84oB6KHvrRw7HDPzakauIx7THnscxjLceTT3afcp/qOKM66zzrPqc8l3Au80Lm9ykXMy+2X6FfKbzScJVxVXg1/3rU9fwbBTeqbjJuZt3K/iHzR+Ud1WPR45YnCTAbnyfVSPUy7QXiRe8LyUvcL3N+aYEhrxiv4l/5YZ4u+DXfqDcLLOrvha432P+niPo/EHhJbK7quq4bZvX/Rrtk17CPACBKamGW5/lBXlhLVRVdNNXp6vQNRMoilCbqG5qN+1zzfzzmV4HffDCK5YMC2EM2HcDpe5g+RudTiVOPBnYSdgWlryTWOiVzcALp/7S0ZyIAYXUtHQTQeQCwengHgEEIICCwIAC0IgCYAR+0vT1cgAA46P7QXgBAfwkhjrPfZAZMN0GrCrmSxdGRoUEAA4s9jQC0ooKY5O9eRgh2L8FDuxdw/o459A68BRYKmltK2z1AmhUOLmBnA4E9ACY63nWchh/Q5U/F799f+tYp9Q1xyS8z/2wBANoukV7XtsIL2iotRUfHwrTviLSlX5nLskMBQyKCxQTDuEFRyrIhO2f37aFDCCQChxAP4gStApaAJxAJZAK9wCpwCbYZIuE8YwEMEYV9HV4koA6BSFarOOZnLgQIR2AXtggYAs690wksq98C2GhaCuBJfKv/H3Oyi361fv2CAfjvF9/jrwDgs/efLfzsGv/VZ8289ckj7g2uir3HdhLPgAAsDbC55wDoStwqXaglHpzvEP/69InvPHTKCx988sh5F5z02kFXHHDaIYf96Q9vHfUfCDwESARBFYaGjoOLh09AREUjnFaESEbRTMysLjnjsnduJIQ4iTySpPDLkClLgSLFSpQqV6dBoyYtRhqj3Vgdxvk+CHDR354Y8swvnnsVJPg/M3wx2V3/uOpr9guAn+yyO6G899nxMNhpinv22Wu/Y9DAIMGCAgMOIqEogoVgY2BiISMkIyahIPWGnEEUHT0LtWZO8excHBK4eaXzSZVmhBy58iQrU6VCpRoBv6vWZpRWo3Wq10WpNkSIDKGhIPCjO2667Qe3QAAawUBQ4cB3J7Y89hD2Gr1LGwCxW1MVQgDAc4EIIZs1E6iDUNhZyC0Z/JpugDAMEq0bhQXAHmrdJBwAPri0WXibUMu7VBq+othaswXbPMzaAEPvNq09/bYDdo6BeDORK8AHhYD3ZTCQ4aFl5fl+hGKdZJAnx6xlcSVYGQECqMR4hotbCM7uUcRK/Jy37ApQ9WL8RsLkhF0xgCt442S+o+WuvPR5UDn2sVD6m8gsvpXKBMjRbiXZ33xQ/CuLOVrEOCWVEmsYJwErppoahlsnsr0dC4OJKyo1hQooyclvAYGB4k6Lw5zDh06lxFh0YgzFsTIkqaQfct4Xdx11KQY0a/uxiZAcHRX10rV1kquckgCLqabieDcZ2r298PD9Zk3WhFT2OOAtcV+lZWUCtC+Cu+J8ebkJNN6wBhqUDEVx1MjQjm3+oLqfPHKmzBnI5Ie2vk7rgJyc0En9gdNT4NocmP08uXWNnT6sHux4varalrPF7awd3OetseYmtuUg1cXAgcEy7t/NCcpdPU84mLFqrXE/OuJldKf7VsXZYW/X8fO4vQ9NiEZlqVgtynV4RQORf3tp/vrddipyW3J2JWOgugYJMY2gCCCzXlZtxolCrrC1ulf9Cf2zoAS3nxnKamdnp/rDcoGFmC+20A62Q9hsNOl5FkqmWs62/IQu+VXIxznFaONeXKdmOoK36UA17uHHm1pagmDsBxBXpvLU2aEH3rD6XPJfIDyvanMcNFDUPOhj5FdhGdd5MTdQ2QheBcWipNuWGLLwISqMoku87ISI1qKIglzV05bKhyYSim+DWcaNWNQPWDklJJxayjismoHpcd6RWHDlmFSvmMSdvUThEY562TNChTWyOu5lzJtWYaUgcXh+XxwEQStk5sCHHljWD9h/FM2r+yIpK5pVOBL5Q1SQMhZuLPgirRnyF2O9KZ+IBcaUryGVq2s6mR6Xg5p0Ipjp2oXOsrBKzlzUwXGDHIlKkUlaJGM9M8aUaVCChpdvyrAIGo7eWpZB4dY+3wJTJKG3ReZi1mwpNekqPKdmn7cy0WXdbD/OO1Yte5YWt2E0pBwILpb0py2NPXp2GzdSUYFQeOiZ2TkdhyYBuONlitAorYkJ8b7GrjgX9oflPSjihDugyCtXUoWbLkTGVH5XfjoWpm3EurhS/m10ySI2nUl8kVCpDvQKpU3ko4Di8oFAWM/nE1lsW2tE40vxYmaQPsJDU+xamiQmxShEgECot7bWIX/EDKtmlG/8f1DEP0GSKd7ix0o9bZgjdxSjkAs/RJIRIuGtmaTYNoskwfaOoqL2qbnhKdtGpEMr1RQ0hXtUlzTTPcZwvQ1txcR6yoxJ2ekwhRbVqAFfwsCh0VzNSkOlc0rF54EwKzmTtXh9XljwQzRLkboGgt6NXdr2HDk6Ig2Gl5j8PDl3Ad1SDn3qcY2J+9HtJ3PhXDElFDMDIOmA6H9QpSBjUCtCsQix5GA1eKvLcBxyHCcU9Gyywb+oUFxldYtZYgCqGpEDrurJkbWuarGOTAwz5aI9BVLKI29ZKnZN01E6DdtdsD4Rw5ju4O9wtr7Uq8j7dSomlPvXd0xML/42REuOBMO2L5DGI1Zn1U5ZxFE7lVl1mXQxKIl4lVSsLFGm4/28uAvkzC+IviJndtVnYLeWWzlKS1QgZYl+mcXSpwaOSrPrFLKn0Ja9VEf6VhNs8Kx8mhePlixxA8x0mlwxrGkVwJVUkXNXaoLi3IJUGLFwfsvIXirJYpZAkrQYBz/y/c7yx/llDvdLr4TS1X9yyHc1iqcpbnDfK6aG3SyydWJDkJE5EOwiFpadj5Tj5YmkdORTMpVBY5sTz0IiCzC5aryRty4qPho/4ibMPbLgTV6vseoBB90s79FUScbgSFuXiPaP14n5ILOcy9BjPmruPKdCh+9c3JxDkHGtHAy5V2m6hLcVRmQCKzwdQ70Q8+JKeTRF7QnzNN5RkiWpbtomeqLyV0vivvaskMdYw0eLr8KIOYTkXdnpsvSqDqrdqwOHrKzLuLsWJBaBoVsmlcpkFQcYJqRmp4OoFgD07a5YiVWw2J2dZ7e33sxz01MUoCU2oTjyGEDQu9JzdeIWPXQPcl/LmPpp3RTuSSp2SbNXMBqIGW8hHJaZeE+xgicdlBo1dYBakmdd9pH66WAWVTaa0zt4HdwhlXSci5LmNFUEzFlEmvxmMAWm7yeZGIpptgvQAn3aeKAha48ljjvBDsJZEigHR/st6vcw0SYmNDYk6mxyAu8Uj0ha/H8KGqNxcTc2Nj6mcxAKM+nriHOFVbAnN0ln11yHHtT30BMX5haovoEWl+B5vdwwH7bdvq0biEmaXYM1F5pn13A8KfgUiWtwmo+7UT7ua1y54wBHIHzbSwaxGnFKEgVY7EehWLCkl4k05NXn89sCBdxLuIWxOlR6FyMv+fCGUkz8G9ZSAu4E+KQe2FXwOTIQ6qvroXplanAYkzhGqIkS/g0RyX2yNytQJIeH+ugoI40CwwUxfRmt+NiLsYuzigt+ENdx2Dme9+PgoRu3s5GAhOQ+CP6wS7jQGAUo1isqdLc0ctaG0bSFXmqOVKV2LDhIAHfDEhT8KYYe9n3Biq6W202StsnzZQ72XPyFbHw6oeM/QXiR8yX0sWLYZ+9a2QCJWBg8Vlnt5T+tkH6N91idV+R61Mk97sJysWq2wLliBgsfSMtyJBqQdevqIw/rNnSRIehloX0baUUKkpZGcQUk+0xPqGbFpb38X8FDpRZdOEUHLQnJUWE1wCx84jLYGxNHFQ7lybURuQTC+GvELLmYYh1IXu6qFZzUcYd5fgSUd6lGzOPclTxpObwnhnIe/1oUOzpIAQDtWMpwA+ESejDexBv04Grfz4kabFgu5LcyRIC6Ipl1pXDeCVv3TLrAd73vEOmU7wrSHulq3xXkksK4oZe1WGXMJMwspX5FzRCxvszwNPs5EKj7NXRGkjyyQT5g2ivoYKHmozEbN2FKLb5yrkRDA2U8mlOuc1yF9bLXmSRCVmu1BQSA6vAioVcbH17TMa8Se0cA6QAlPbp+Gk00kQTjrlAoZAIeLPqvqj3pyEyKlJ9uTO5WoftqjOgno6qwpvgn6522rgs3FtoZPdKaH50w1ttAb0MiiNO80Gm8dpVsgC/QMEYv/Y6bAim+Ut9OHR9NyB3bLW7p39VTrCgU19lb/6C4Csd7UIwCDL3ziag+RV8wfT2Lp9aTnyElMVcHImxscObGdns+mOM59qIdGDlkxoMky2FTxwkjv65j0I7Mqu8RWsVW5ju8yC2kvZqlHVH36uzSm8fxNhVspLMO2uBnYKHRMjckkrONqee6H19IarzJy1M8fTzG2bGbjPsqfxhqpfqPr5Xpppzyzy+zh7idU/z+Re7gKaFyk53KfBDGhiFe3SETBQ+ZV4URDsZBeiK1Z5nISJOSTJoOex8kLUBmJakfm7NZk8pJ2tq0Goyj1IhXhkKVUpSPBb+Qw7Iw/bHlAgfdsyh1dPrC7sFQkAauex0rJ8GVN/imTrsJVCbIn2N+Ec+cwdNp6Yz+8DRt+kxsOTfRbXVcH/p4mfpTBPUJkufRuPtP90xcsEq8R1PKhskHWnoPNpfI+jSYY9z8vDL4hVBnjDi6nwn832/8yjQ7GLKZsTzZB5mjqQbuS9BQPf8celJ6WefxIvvSaVhtxiK3iwyRTRVk2uoeYoBT4Om3SPJI+suwfSQS/fZ53yvu+W8K+cuH9LZwNFmGQS8iItuhk5SmwLc7bVSeIhkn43PJwBxNEGSN8MsNkrGjCOvyw6KGyowjqTTLgd3RSq8iOWSW0nf9Af99cLb7aG/xFOzpEMLCWENYoY8cJfMnz4GW0wb7QsrBxG0qciB0J2b+hjFrJZWcm76kwIFWq4aUksyIKerL930QXm2uyDKaQ6BvH1AXh3yKZMzsnXPtmo1l3SB3CUv+dDuI5xeIuSRaPYMVTc2lTCcjP46Omm2t5wWovGGg078D3FX9ZsTp4TISWlFhKUcZl/AydczdUXmQezGTzZcKj3xxelwiQN/Ug5dM5YbdnApcbUPd6Kerv0PioT70f/7lYh2f83dUH9YNs3M5JuFj+zExK3qeVT+bS4fnv4ctO/btT0NlIb748l7LaKm/fxLc0APzq7NOZnHJH/IymL8Ms64N+ojL4L1JkCP86G6T1vV31/a3ZNWOzK4BLKi1tjS1lBjHQDPfKq1v6IEn1TCfp92o1mzUfhtq1BvvUBeHhi6hUpfI82Kk//56tEUgWSlkndhNJ5NDXXxJj4h5YzWdxA8FqPTtpS0LwzdZWzhRBzkt/bL5dtf8scNHDwkVo1GHoaSFvkIp8O1oN+Uqo1L08ieqT8i8IaEr3G7OKlHE/NP8TOmL5Iw4J37QdJM32U3X/Cq7BzoJdQuT0ga79+/cvjxnmsXfVjBZp3KliKNcIwyqmlRamqomX+82pIpULl1PQXrbNPPqY5W/mZmVFVVErSMTCQwNKS+taO6xZXTmypHngG9HaO2CpPSB9jHpi/vGtXOb50UmsWnMTFOY+aLSXq/LyHlAFWgLyJVw37FvB71l0ea6lrpDy1qOKe8TabLe3PjAE2mw5vRsedf+1szU1SfPW7x/Gf7e0nDI0+JhgH7Cyp1bDnVmDg76mp2jufmxUYXxU4SnRA6K1JTJqWflxYRlhNcURbpj8sU6lw7zoLF4ZDE+5VGCLCME+Hb00e30vh19crv8wtjxbXbRSsv6VzRiRvQhbYSh0PQBhBB89eGm/ARZryy82WQ0ehyn+09nmprqotM3EhdhW4kLIy9eejm2sfRRRp8tf1Q025WG8Vm7twuwvHFrahq6Ly3/KbpQCxXCDjSW8TnYXTtyWsfIqdmvf8/F4qFkyMcvBL4d3ZKF7tt7w1BkFmnR+B3jpIvHOaNRJDZ5Sd6UoH/kudEUQsMyX+byjs7MwT7Y0LjUF+vsmIvM0tBkSOMWsHMtNCs7r6DVDZetWXlWmoWVWx3EFGo8c6tDYOPR41ukOoX01MxvxWrVg1q+OvhvOKL5ktGUakklZb0/tM57qnNwNHDGR9BbBjbXt9QfGmzhRoxfmIi9fT943458X4UxqtyVoK+sjk699q7ykq7eIJ54T3wJZOzoazmfu02C69ZOTH43pGswiF6TIcDsHdU+Mhh7eF1NLFqVLVmywP6s4v+0XOer1EeVOhJiqr+dRZ09/usPw42PdCP0wu47okcghWCpYaQbwtOi0QREP4xHCks8jCihPK1tcxDX+L2P6g/z8S6JnRGRCk+ytpIWYyqjJUUqkw3EXjxX/kIV/ieFwYw67wv103zcy2KHNjW5uE8J3i15MNIy8mEcqCUU9Fpc7SN29W1Lz/T7fNn+9G19u0a423steakFv4m1Y5iNod8k1zHgsqBKSDodn1LM3wRwDsj/ts9ac8fS2a5Ayas6YlbfnbrwroEzh7dPbz6kzMzhodjqlGh09aGN1assKzk5j/Hvfek6sn1R88nwgIuLJCdmqZtOAsKHmifulYufo96/jRY9cX2sXbETi96OBSF0zMDAPiFqj3A2eoC+5Kbye//cuCaQ3RIW3zQstQA3IXWk1OazYvpoTyZKw7+QIoyoZfmKGE+ZMaIm5d++zzGXzREOpSjLdqhvl0tS6XYE+EgH5MjfjMl/xIIYz+7vkGrGg/ME2vRUVmR0RGKuooPiVdNvuaTSef+Rye1IPCbc6CgVxXuL5OFJxn9DS0mC7AUFHFbP8Rw08ulPiEreT29JbIapiFQlDsFrSeXgD/7+iY93MSG5TuBDXX9rbX+9DF5cik2WECSWNV9MivyLpfdDVUMPPHFVYHutnqrWPM9lrEY9dh/1Wyp16eLq8m0VU6pFdcr5LwksJ/736bfwqMRCxQSK7+aeLVQqTuL+291oR4XIGZfD3fomm2PyVZn1Y0okFRSGs0xDb7j7ntmhEyW9zaRHOUslt3NXJQcLy4QUCo9LiwkQ94mp6hL+rz8Jf99eRJdZ9oM8gj5LsQSDc1fd6oLRH68fl8QUWPQdpWW6ziJLdW24k+Yxkc00rzOcf/b7R3KSgeFxAzYhs9Fq7Cwpje5otGYYM5jruKmGbmnpBbHSyEi2kMyMlGyN6MIocXsUN3VRJhvBY3wA+q36UbUXW3SdZaX6jkKLVXL8+kc03HWrCufGTMtWEGtVRobHQJI/+v4sP9xJ85rJJprHCXSE3NEWS0dxnr6jIi6Rfkiuu/0vdTXBXYn+HU80zN4YHzFtkOAuQq+yNHE73cWWjlZLbmXkOpbXRDKzvGsjI9cmGXGWpHVARMhusZo6S0pNHX1/tq+a+YFqCvPG4fRxd1G5LPr25Bc8DjDkSS6jpIwv1Nlt1I3VL9TWbfwe6Sf1dBs3deSFGv6dV7DFF/AliJsXG4KeHViQo6NV02JLA6VbwOL94ge5Co3oTcN5jqw7OlHm0ZoMaVVqLzcvT7IQjBWv/5s+ebnUpEuvUHszwsoppITQlzE+X2y41pOlNJ/MOxl6GRPEwjG+Z/xPp78ZW2u0azTpRmO6hlv3AjhudUEY5JM1Ep1PrE5PqByXyjkzxUITpv8i1QF7SVtXW2cJuYsMHN+pCWlspouNn6YxjjJ67leyoixyCpXWTLrdACsOI//z44JsXdj91TN02YRNY4F5fwbS9kbWDz2Zs/PSYcfMca9Sk1dEs94CDnI1zo3B7Jsk0nqkMYP38PY+cYRHqEx11HX52ftcv4Zwn2yU6rbwVkE5cjryuayRFeVOKaa4u2mkIuSOtlo6S0otHX0wN6/VGiwtsXSSFgSSzWQheR1P3UUwKe7JXcS6VifkLna00dW4immOdiiuHp54b0892JJxoMVbuytYJSfkjCpI7M8jx1Em+/BLsdSeqo671FBYu7xndsZ09s3elx/KCooqIxayks1Eyye9KEL7/x0imVkpCyNevhT+frSIIbecBfZt33Wbw5ZkKfSOoi71pkr0nQWWmAO/bsd1/aOVbobXSJQ//B6pf3oX0VKwWGc7dBctZ75/qCCypP6F214feq2FluJYSdmp4cUWuz5bMc3u/CS/+xMnOHv4oZxoZHiNqi4bRfnv+kzMkov3hZT1FaOl/D8R7yVBgESw5DCWXRSjMHAHjITxf9q4rNevqKxx9uAkrCPMgVLImQcyQiMjfKGTngswJGgsJrR+p4BhatpNCP0h4q4lhWrnd0ZqRfaX2cEgBcTKshKMBQyDOYd5jedQWOOyKEhHiKfSGRNdXGlMqAjkioLW8gVrteKs+jTO9PEc9ViLrOuZDAMuEaLaGwW6+IAzbH75gsJAoSwslxaRveDcO7BF8JVkBiq7dO/5Xkl0XeQqxXR+N6UqUBPnQBvPLFAJ55A9U1rE3zlUakSBqP83ABdOkXqy3/ixnHxU7mdcRdab7tMksGqQNMHLzekqhtFRnRWoBFZ/ItsWGM1Bs8tHaz28MctIvTGfdDvnCNCYrPV9tk9Af0fe8XVhzRp03ZoZOz8fDp7fth89Zj+Ysl96X5BnDlsU1n6Z1FP+uezZBzcqbtHG/bb0/7t3/v2rJAXnFETLoGcoLlUOvhzxjMWF7zEzLLiR/wW2mvGjaAEg2G8r5RvtOvzYsGnTGeoJxyL4KOSNtVJfWWbA26Vjn21nhon9n+TB467Z+IUPC3lpD/p0TV1GPUyI/SzT9RpDHzj9o6Xh4+2wumrOJtST7fKx17Vl1Rbg6GF76B6afsTmOQoNvK8skkD0VfhfgrOTQsnJSsmT+iRCuIDcXkKnzZyHJ6RCBIQ2WR8TvnmXaAvpNSYsOnNyMM1djXz33x+MsDBGCOhkMkjzk8HpJKNXLs6Ijxf7vTJjtEcm9vP8DI/caI/iv4uwRm6ElmPA0dgB+ARznsCWzp9WV5fFXrQDm8251yKzmSojfqYEUgyplOqfI7RwFfAZfP/8AIOKwPpdG1Ju+mlZwpDY5CUBoBeG85OKnNGMFUlx4d7wMMslmYwxS6TsQoYGJTsLmlUOV66cFOLmRgrSLK60uGstx4PmeJuBkJDepDMXxQV1h+hum41/mdSaXqElEMtDXRGLvr3F5b9bKqR0My2W7Opwp6taZcmyKS7S/0CmJ2a5bLF5DVqQ+q02IHckzDB9G5rdc0beElEXUaBwHj+xvY9FvJ9lzcsJ5HwLeARvozEmkDhBdsgmFnEvh6sOsASMiXd3jiazx01vEeA33YsiCCyFEcZyX4qlrj4aaAkxRUKHT9hT2iCYE5dTKI1JKTarS23dEtFSYRSVUg4S8ho/Kr2FVnWVwx1TVRPtrZRBnWJpB5DJKB0ycScFLMhWrHIvyOk9ndfy2s/wlDubDGN43fF6wCfkNhijCkxmQ/bAq3B/FMU5AX1KSqVel0OR1v9qgz7bbNr+QOuNORWWQzr9QYvlvF53wWyOrIiMCERGZUdEZoIwAkXblsUugqRUAGdi0y9hmmp7YkxgqTOmuAE71Qvm/kbEUimjdEolHRSZDOqQSDsAED7/a4nixdUwZ3H7NnZo2bWBZDHLLoLypCAj0SPwn1Qqd39jnsTZ2e5WJAjSzWyzXSCMP/99PBLY3dmnsnXQll04BSfFDfRM3ra1ZR+1fLKFGVywlkJNQfCwUtt+caQ4isZm/uTTfD9v83I32E2IT4jRY1PxtA1MSt1pSujPi4P4TiHZuzcoaI2JRPLuIeNTyfwvtWJp9e9CzulxyMOfBELyNHAieUnsVdWoIHtmC8MxtHN5urXo2PF49YDSoUwGuwjWRJspjXK+MYi+g889TKOM63JhSSd+cC/wLXoVysfdUtpcdrCXEP6W70tI5uc8C3eY7BG+sAKWjEE62spU2tpEpmRHjJ21i8YaYrGG2LTjoDKaXarPp29wow27YrMUxXpsCBbsJGgH5/LYM4aKa2jcHQ0KReEOLq2maWgrm7dq5hPmJhp9I5O1kU7bxByke0KpHjo9jxqaB7YRSmyuZ17gsV6mIny00JzstGop+jmrOcMaYtOPsVjH6cyjYJenDTYTn5XsL7qspIOeO15t3r7mjSAImvrxrKQLPF3n2XJFVnJ78HSdZ3PxBzncJQdvH1uzLwnCs9nvFGj5m1oWocQ71AvH+lEUFPRN+0tvew+0n4JzAARn0T7lQx7ic83tmdgD0tbo+5+85cT1TBhjlXjOgNpZo0TP+O8YqPh3B6PfxtlK1QxytWtGv4o8wbBhSPDn7KsXGLrQklcR3/TJ4e+Jf8YjlGO9K9LHsPBFMfMl0rP+VjKGhO5GCkii2Ip9aVSdMpHcWO8Ra1cO3pz3LU8w9njhfeFbbz/JK9p3a4Siw7sivY1N5oVHk3AkZHdYKM4LWNC8akmV8q1bstUsmZy1OvNek8uiwHovflJNitTRamo1S+0Nn+VStqF9tHm0admKYoAGyV5XxQjWpMSKQtWFgPJCx5tUqXwVZexJaRUV0r1Vsjv3+OawzvnwThBFElPyTQEoI7dyPiA4Wia2AGlFxjzWXwczivJednfl/ZJRkF5kmy9akZYmWmVbUAS6HmcW5ZZwH8osTG+Mjd5v6aKVsQsaQcaK8GR8ycWIU/TDS2kFtKVHaKciLpYk48M9YYdf49HnYHM8XsVsgdDncA8O04DpMfjLox3ZElYQtuUwXfsN96QQxf3j72+mg8ZVPddya27X5IIXj88WyH8Y+WXkT/GnwneFirwqW5T9ORt4WxyekIlEup/Xx7EBfV9bsn21J2+vNUaaeHYDasdPb/npcPWAgofgxvhZ5zu9sPX8bt1npwdqSZlVsMcA8yCWB1IHgvoX9Cyg9Tf9LZFxlwTESKQeSW8bPX4XZlVczpvDSFUqGekzq4YdgxSmQuFjHpo6rA/S05VKeurKvMt1D1JZSkUa68FCutarVaeGh6tTkrRfXvNHByepHvhY+j8Np238IO5mQnydIDveOuJVks+GCcHhgrE2X9Kr+ZSy4+qE8ZyaqRXRB+i6HMHwgu77nC+FYD77fuXG21/vIh39QHTF1BogrXZ+lx5Ib07Q5ZWqExwlSkN2AqkrmJvXxuX2u9ndKwOrCEdM1eDZwAnficTc6tKkyjUz/p1ZebLnj0MmlOnw2wmlJyf1vz07tnCx72jiUe05AN53nU2Trn5X8d218mtDFUNXQcbVirsVYKvM5Z53FxJc8+fNnz+2F3z8uS7XvDbIuFJ5t1J6uaG1YdQCcLLR1ePeuVV+txwUwE1dC7rmN9870wkE8L3TnQO7ecqXTgmIs0rw2LPiB+u82LKzZ0DMFdIdXH77yastK+ZNkXCirn4CToDrJ9fNLnuDBA3SZVMbBqfW1rNr2cB+6PykBFS3cm9SCJ95lBzJoY8BR95vL/+4nePXJQlkqe7EzHuq03sEr0eiW5bm4euSlIu0JN62C2zFhnCSdv3HDTovIHi5ZaVYQ5rm1Qe0xBiHOIqBcKJ2AFy7dmOW3rD9TNjVNgzoDfD2mmCcabiRe+PxH6px2xlwb8mkE7k1B+d2JK3vrd6kLS1dqWof4Zhd5eIGIl337CFcDa44DPX34AQpVfn6hTpqZ5q0IciuoO6ChYL0u0RSIxKHVn7O5VscmSKFM/In+qhQ3oCsJKuhcPKquPqx29KLV4/bunnLHrYX6yJ5U8e6CYnoUBS35+gldnBUBiFYEPLqd+Am+Lu07jybx+dfiZQmJNhtzqwOlT91dLgj28LsogjxtzVCn0XKFBBy+AkBu/hpoUoa56RFRP37l/jCj4Gicnts6VgDQGxcbyrX2kq9fntps9KFt9mY2UwnE7D2R6SGTn4uwBKh8cigjSMVDFFfLIWu25bIdgu32VQcf+3KFxO0ctz5zFAdqIYhJVHkA2XbO0+z2sTwaFZKzNxQwecyB0urnkPlf8nwp6YE4wmpvYaSEkNvamrmvdZr2I+Psm+OLU0jLfJ6jdubyGZxS/heY4r4N4PQGJngpkYWXRILqokCj5qf5Aq35OZO8qVMqd2UyXDsyWOYbE+xA7uZI2LO+iERWzR4wh7vMis0EbmbM1IHa5Y/amCL+HwytwE8og+MrNChArrmgeRIZFWEt9qANCaC9BmJZYkz0sH52coEuTxBqcrceW29XU2llL2CIb7gOwH/0pPMhVwGYmTwd21w/KFbs/hjNuX4guIFz4L8ruKuIkb1loBIL3jJMHd0luhsy0CgLYi/SuYtabPjH1MPl9iZ+NULGvZkRWWB624KM/1HLyU2ZmffJKJ3rEave/xoI9LMpOC7eAKaEqPes2c3MTib6AkNzVNHscCZto42wuU3WpdurZxKpbNb1SE2Ij61QNCPHYLm+x4Q/FWy/vlgB/4x9dWSrn9+lfBvX2Xqhy+/M5/+6OkdBZ7eFY5vnf99h77wjZYnV/+0j4eXz0MPnRGXN2w+7ZVgprf5/ThLnOeacnVRsRnbXM/+O+jj3hXliqJqA7ahlnRlwacPXgZs30kM2YH/Bkgzj34Pw1dAqwwJ19kuxyPy/U6ghvzQGhaGs+F1FpqpsunZumx/di17m+PQ4jw3785n59773xgTZgcWha3EXsBF4GbhXuNH4R8T6IQcwgHCP8Qe4iLiBRKC5CJNI50m/UUuI08jbyJfJ/8W5A3aTiFRFgcrg0+GFIa8Cd1ALQsLCxsZdoaWRFtHF9HH0m8xohnLGB+ZOuYzlpBlZCWyylg9rKWsHawLrM9sOdvHLmaf56A4bZyjXBI3wD3KI/FKeHf4tfzTAqGgW7BDGC/cKnwlEotqRLtFX8VOcaP4qviDxCaZKXku+Sotlp6W6WSTZH/Km+XPFRGKVsU/yhjlfOVeFVX1jeqKWqxeqD6lMWjWa/4P54ZPCP9Ha9LO0n6N0ESsiAyKzIvsiLwR5Y2aFHVdp9Zl6U7pefpq/VT9U0OeYYHhidFqrDDeiA6PToveaOKZtKZ9Zpb5uvmpBW1hW5IsVZZeyworydptnW7dbX0aEx4TH5MRUxHTFrMq5nKsMnZK7LLYXbHHYi/H3o99FfufTWCrte2y/RvHj0uMC8T1xS2O2xZ3M+513Id4OJ5891dmQ/xTe6f9b4fD8a1jq+Os40fHZyfLGelMcVY7ZzhPO+85/0owJxxM+CHhneucO8ndmehMPOFhe4o8cz0bPRc89zxvvaFemdfjrfX2eOd713kfJwmStEmBpNakaUmDSbuSLib9iyF/brKbf8cv5PfzPyYHQpzSnuIXPhNWC3dTHF/S1+6L9JWIX4hbxRO+burL0ic7OKGnABEsEFhAnoHbNBJFu7yuZnLja/L/yWlAwyK/umlfJB96LPTT1Z37b82xHCBYQFUSOQoHOSXztSH4wM4rh7P1VYqm46Odi03uJr4xN6ji3zdpOrRsaHmBB9woAojNH9bBRD8/Wq1VK5VapzlcRANRzLplIBE66eXw71u1zd35X/A977L927nrJNt1jLDUyH5/Rxb8kL147x3gZU+p75sNTPQYpV+V2wwV7drFWz7TigWraLzmysdYtLRdmq5iaNBN3mIUa/DCbpqtVpmBsd3I8Tgq/VqwDJeUU2AG++LV13iNvzT+u9utJ2f5AVJ6EET2Eo/Xf/R11DApPOMbPFsGoBBFx2MXWWFfE4ax12/XyDjnZv7Bww7J061OL6YMs8HZr/obqFxyHmnpIcavPpyf85zqG7SwkQGKoHTxSa8IvQgORboTpEVFCyoiz+g8Le2mhhAoaFXSwI10uGsHVBqbAUlRgUyRopjKEVShEwcdqMlBDdpet4263bB24b95JHTIl4IKYrqeI1mPUK48NrZc2Xd9SPGuKELLsA2j2Wj0eIHuEe1ezwt4vKzRIEKyruVER+OYE9Ln4RF/Yk6mBS2eLg55qVbj/ZHN9yTk3NvcVPBTHLloSqDAdUWBNMJmVoEkQDw4RY3N7f2jjQyPfCzCAXf5Ymy1ZBjVhcpgbZCMC+Kd9f+Ltyz/XjplvjUF/xvAG3pclrFONQch9tXNSze9ND2WDeNf4It/Tn4qjfMIA+XScVFYTGWA96rnog+0J29sLR+gYKLf7bZqldHRSq3V7fEVMiBX9CP2k6Dedez4dZ3rBrYds3xkZR4kIr4+0lqBNocicBU5wrHJUxKiZDKzvwpreY0Zjfw/s5ejcG3aZYy7OyNnsSzJsihIOFusVB/0jsxm1vlq9SF5yczNzlfBi1oAYwwJt96U0Dxisf0ys+jWtCDHmKj0NpnGDB7wFE0AudVAUi0x/jU/fh98/DNtrRHDYKa6Jy6IUESJGeECfe4ZIFx3ZbISnkineq2YeSxlLqLCLuJOD3oB1nHL4fB9Neq0grsNieIB1Z0O4ZpyHAJLzIJc4jIEZ7uyTNYrGB/ue7x1djK6cCSJQwfChQ7oOJIVNskJFV0PXGhm0+HkVxCW9imGiYd5SyVc4KN5KfEkGIzxVNgjtruY6+dmS8/2Zerc9bbg7YTyGrbOUwWaFXK5VeYK6NkemiG08glc3uFyg6KPlaXJkmyDEUxYjNgnkfXjLS3K+vSoxT0UMf1iVAZH4yInhL7YTH+1IlPTFuZAuZIY4g32mmlB+9Rkvnq5sb+G1eK9pPZV0MVUABGs9/Qb5kRBRmfRi3kVXCEMNog72lu/EMnJIjPvq9ciiDG/O57PkLp7uvEEUEIhBLGglS2OIRjkUWs9vat6jdz5/1teTQn4h9+EfVOiqMN757aejLFDKGOkunqZXozBInq5VbeuObTstu8rI86bvyUo0OUTiNLY0TpAzrS9gIkOCmKdHr7N789f4lPMDkF4VaK/X7/mOzH+4fKbGoh+DonVx6s/+CqiGWQx19hURhTUphTWMFDyhQLB29jCS5/cC6bzNxPQekPkPLWKBU9IAwSuBMHSlqVL7N5wcqr7UcnPUq+s8YafOTy+Dhu5bQAAEiOlmgyyLGqtr1/emTV858VZW95c9lX0q5EavHfsYSo1jGAFzoUgChA6mkBfIs3zyn355ZCHV3ipcFHoth+cWlf1Omq/PsrwxC5C7pUa+uRiy2AmdfLFY3iVslv1WSWFrenRUVSqyHAbIwOaOxLehG3VOBgkyf8J+nAicpb3C0IcBtEh414/92fKAu4JjOQxiypsPABYTTEeEnte0JaT7QTnPne87lFdT/e3ODV+IGPKP3/x8PI/X1+D90FI2Dx0bifiJlV0AUGPE6DhlwTiEgCNaHd5GfCWE1ia3/coA8wVIAPDQVMMnl78P4He569RzG3ZVVfLt3YOQR4qAkhFptRBGPAcbJlx51p/ha6aLbZ1VsiYo2et+O3ULT0WxkrSplTJFAQdBoWRkWe2R9/yKW436mD0hUW0O2WH7T77g3PjxhrAGxs3QnX269mwyQBoQBMynwh9G+RleqklT8hzUfULoIipRvFtxSYyUjfNFJ5ws+hcpvdY5CrqEdtTcmcU7QGZmIXP5TRdpBONZRsA1FjVD+xeCTeE+z5l6MfdfjJwgRVgPwM5Rt9/8h5Hp/DgCsyDI9nnTnz75N7BHkxnlAeYQaDK0Bv/iBhwBDe9TmxyEbM7FMYZOT2/qy7YHYFBLgSI7/0iSifbUEg666a//rJFnFirNcZsc7kfRV64cPn6jZs3r1/TWxRgevscw+Kwhp4xuHbtmiWT7MNCP25sXrhYr1e6W7p6cePackx6fWxW49jtV6gyRx80KRNTMzMkDtAH+hhRpkVqg3Cd2bI0GBMbl+CGuGblGex6Dofevk5mW2TGwugd+7PXBMwwKzDcW15+0YZd5fKhE60+k48/0hwZHBwqH9vLNzBBIukuvyFXaAxWi7+Jv/92br3A0XpMgD3mWGnpJVvWLF++euuuIh615zMCJqeGNfHARx/vfP0a9/Yfsq+Xw6Z9Tc1OUVaW4/iZUIVJX2VQro59bRL6rJwyQFh36WHt6j9m5XLGEZnrZm3j7e1YrUDyq9a1cyLZUUGDpEnymHPXlMSA3DmE4PMGGqe3GbT/uuufaWc5yFa3pVy9NZnUmfjYVwSqK/O0X9YMTRT84M+6XLh+hLmCM2xbB4yH/ururSX8frPcqqdnq8tT4MWMIwR9sT1f1sBo9KlqtmEkEf2SKpzjIuMA/LyRzSC4S7BehAVdMyl9TWIKnYN6tNBvd/3DfIPzyRN7QB+zGKGKb1YXUIJMNzOttruNnk0rrN+SwPbu0mI2Qdudo7RdgFPlxPINrWn2f9SpZO4N+KXiNu5Op+WK0mq8TEKK/fXkZP//xGvrxyghg5ny0KnMqIeL65/b40U06ZocN6hFXGTkyS5456brPRY6HONGtwvMPNOc6Xmn596ccKPcfZn6Ydq6LmL/1Xvk3N56gS4vNewhG/InIYRjZY/zdpN2/4edSmQaJ2M07HRqVW9CO1yHHujpgvUv+j6exRhzAi/EvDHGKqJWGaZU0OGZzpQvMdmp+e/w/4tBM2SttJwe0opCHJgyQayEJeOdXliJEoZqqL4OzrijOtVaFz4tCLHFFmUWEB9rMp5G6BXMQo9gxea+qDQBdwrgcOjDL5m1IO3+c5QXoTqc270tzIUb1gsRfLDj9yZ9GgwJDDtVL4q2rGIUNZ4KAatphtnKXkfbFF4Kd+YUNkSBoZCP2C6elBFYdP48cGZ5Pltp0H8OoqxoA6eju74E8LolGcHR+lZ2buMuzfNJsBhfrQb+dcgGUmAfAkNMnaCwijNUGAK4vqUxHuGoXCYgGsxri1L+X9cmjSSQrv5mIHTueoNEpP0mfKng3FOYJxO/xQvgbou7HJpJbOfdnXdvAXXdmKAXzb4Q+FluNCRgeC8IYmoAeApTgL4IKoCTLYQhm4TCLBRA4YlEP4k4A8meXr1N1KnPpYiRnhBVfz5aIEOsWb0AYdP2udK+F5XZ6U2rde06mLURuewllYQeHcfXdotx432eGTxgOhkMtGP512B/rm+fWvsTm4OcU/Pgzwxoeaud8sBvzFmZtUcQXMukeVBaYr8+eEi/uS/8qNmG2EBSpkQbwzNtG4IzsNrhgOikCcNkmOqt/fqGW5II//DQRMTBrpeevY7xcGbLTN9Um8o2N4KQK1Amkc+/z+JSk5TtSE0JgEbEmIUzWEWkCnGdG6TVJO5e/xI/ihuSpkncoF8vTc+NmfagHXO4mkIqUc1paZi2h6D6Z/6qPXAvhNbdKoiYyCO5tSfxApZU0wmZsINzoWjEk2VjPzcUdM3idhkXcxLPkHjMGHIDmGK2uFSNFtnzPCcIKZjp4fga3VW2UliKZATZMwHAzhRUMk1i5syBbQYtSdlTolq6MRAIwWvQ1N9pQKNXVVlK3gV2HDMPdwaLTyRfS5k4AXcj0cnfUHt15Sr5LVABoiDjErixMOod4vYcprkouOUQAPljyga9PvnBYoeDJoyixiEQJVrC4u7aJlvdURYeWyIn48z4WOBN3dn/enPXtB+chsi177KamWAG27gK0dfC+eiRckPrjCbU3jFuYOOjFvuXN3uU12RRJh1hckPVs+3maVCrh62feP4cCFE4qLGn4+nCYrndanVuLtdYKuX/I+0XHpP54OGodVGCi63mMwhB+zkJJoPtF6/eefrsxa9//z/Mqh0HV3r7cD/fO711zZptZx8+mxIMYapFIkWUwWRNSE7GVtaDBnPlbAfBt6AXWZaZWTrRMdSWE52kg8G4z6k6CLX/ytUfHj19/vK3P/5+h9966vT312/+ePfhT8+efzm86/Nvr3/56cmDuzcvXzoGjvX24W9cOblv58493525eqP33Wd679Hz12/040QSbazTGaeTiSapf/6cJxGLpTKpVC5XKL9EFgOLweIJeDweh8XemC/1LYvNotNo1BAKxQq0SIeSWWRxoy75Ss36C80zx3yLfli4yIDF2kCjLsjkn20vPYeGrWMe02j307FU33G0xDkQfgAN0oZNv/9qe30h+GUHO/0zX4Nh+7rwXOr502GYfxLx35+fqs83omt3Gfy5rykERfO3IhKGTQvBMNyrKy+vD5jAnGO1jgQ2/Hx2641TGXBjfjQcc2gxeiuf4hwHKufVw/6y/hflqqm4vjgO4c4agfHywANJm/4Jj838J91byR38nSV3w/hhI7KmrXRryYQgI8SCwzDg3yzxlxj/e0Lo05cQ/9UUKb4Z/QOH2ehP8pfL7yXz8y0XkJsNyrRGxK28foiHvhlNhg0zg5H5zzCKx6uon3jO5waUUu1qUfvY8qSUARelpFIGmjZwLiV+m/8nqnW+liKVEGYxe0zpFDLdX+Jj1dQVy3he0TUs4DA2PrFo8qOTqJwXNGKJ0oB2W3JTiSaBcxUoTGVdJeFsudrnyLMQmBJu+AeFUH7UpMivqiODx5ZG/87z36lDpPx9owALW0OuWnBHYb7ps4scI3+giBfBu4AGyS6EqRuTgNe9GH7ohSnCGsa1CIKqyI6QdvACT+8k/jMYrQpJbAbHNY3TYprM6JrcRT8dpwdK/defXiTeZSqBfsGs3OGFkRTCvTAbKSqgagMkWE9mfuuPcgWpFkXPIRssi1E0iVPFJOt8h6hKulJA8uEFogZq47qBRCXasMnEC4Pam+WfMZoZTkxz1sgzqO+5pkQvchu6r+Q3iMcxC7Rgi6kSCCUFY2O8K6nSDquRFARSd4ygVXViYKLXsX1ozihlPOp0yPrBYKK5990a30jBlKN9Lk9uhqv+zH+zRMFssx+VOWL7O3sId7bBJfl99i8jNzBrGx+4O240qb9rrdltrpg6W28O3qK6+7v/2nt3mEwyPSGcW3ltZ/jHMc97BYnYj42J/g7dYn+XNnUw8+yVunmwXJrmfSl4lEJP8zHgk3K4zc/59/5sg9J3PMOaqrf8Gtgm87M8sP+MYfc2fqD/mkNeGnCUq0GtgHJKUV0cJV6hbfGkqt4u2shhQmstjuZS6oLbaeg4DdNiSos08mmUFqOju+DvvHMzidmwgzoMl20lOO2RXjR/TH2exySM5AgJo6xS6zyveTDXdOnEwQjBrZ1mHpo2KMpV1IKaoZ3cIoQfuo9Fa96J5tc5uVwbDMpEuLAFhhDUk943wKDHVRoUxUpRqRo0ZkgqwLbE7uQGwfmBqEkaCwfHW50DUGqOTZyLyGXWEPzeVaa35orFhvg9DjyfGu0ny12S3j7oHPQ/Prho93ER677+eiKiW8l6F8w4vqFmsLBXoiPwkHTetUJoseyb3yq8qXpqn7GGL3u4O2S2xnq5QSjWuQgrSxYtm+bScjYej732M9ndl0GgTRKysNfy1zdBKWd2RCk2xru8royaNhQlRbnJdkeMTq0eNxzTWu73RMrEXKZRTmeEUNA0ibE89mKVSmuIifPkFAHfyEZhM6l20wlwZGHnXfEdh/7X1qZdzWNJZFs6ivb81kcEsWeZ1tFgSym87zelBstyRWYGHHAaMiEvKriXyx8e5tflS/3xs8Xiwy0XzVCuuA44bazvDx2pvtfqJQaUMEy17uMJtYuYcIhtr2XyzKi9OFpJfZ3cbdpxI4Nk7+JxFWbnpmtOSBPha5KMQWR2xS4zOjNeVl1NPQocBSkYxozFEQDf1/RwVlad0Zujs+U6zmK0Nu2k3ZUANaRCWug8skeahrxUoNAqFM40sWybz/8l8SzOxqnvr8VtcQrIYBwG9Nn2PKWyCetmU/DY7KSb9aIasye64YhB8rJPXmiyaS+ffka3bW+apOXsCo1FKlLkcG+gZ0KgA4sAwTYgYMgRymUW64n2J+DaY6NVZjBoGWekwwSYeORXOCUJRkKEVplZu6r/damUzx2rweDfkqkDOLjpyC/JmX8YMlxPorBdlBTTO0x8WphVqxxvxQUHsJdTZwgZkFc4yhj6mrJAMCq047yaXuIc7F9W0gljPqAEIrezglcoUFLAwMkAV5T2XVpTdKraMBf81BXm+EypdbLlfAbJOsxaZrlGHe2dUetX06/gvuOu8l2KUYaSmW9YD/ftZr26ueQy58UtFbsYwxhiaafcoTEuTPc+XV3KQQSdMGaWtE5aDoi4nGNUQaLpww2eZen/bdi4ectzxnbh7NHKPSfCMNi+0VZCw3a7Vvz/cXXtMviYMTsG4jhCktKqpuiwPQoZiUOYWIBYMwLVJtaBt1s1adJZnW2kDpvdbKNWQObPsI2JViBoqBwmlBPSJEmw3Kqz42Rc+f6V0K+HIYqIGY7BdWfcyUo9cYExZrMJozmT4gdWPLAcjfsiEARAaEGlde06RhlB4lUBGV3LFPBYd6X7ONE1WYcUyCh6m6G7CYaVhizGr+Zu7SILF23ouP9Fqz58depFq/9uRKT/gY+t9Nt0kSRf/lJtiujlaX5EMsZkI/30jbB/gaaOBcuvzxQpBg/loyK0rPF391QT2Q3TCdJieshAvWIUW1CtHQJVYdKlDnkonIwY6SkU6v+MNem9W/zt5Jyz+VvaB5g7m1oTAGBcJiAPyicjw/061Jx75UWy3EvIOJqMafSP+uXEDS3ih1LSJdnYAWq5bce9q0VM/hMxxJ/lOx7nJosrjDyTnK+7NVXVW2k20DcfqiFHPyzXE6X5wKNObXdAww2a1wfQ9Es1opcAJUAwYMB6epMCAAms9pZtdVuHmauN2tn/X3yH3AZS3ROFvD3LgQUBIRVKiagxmw6Hy9uimGXEb9zUkIk6H3JJ+Hzc5UYZJRuBQCVhLWPTg82wrbh2BTFaJQhePZV+ErIjG47rJtUbmWyhpEkITZql0F3YPTm93zKdaVASKQ8idDiQTn96kd6XJtP0bLO6U5rogn87U1bcd905TbV0yYCGSLZwL1CpEk5NQ0lXuTXZhKTcqwhGRNjM90mKj0D9kmIAXk+HolmTQtWSSAyn/XzCuJSulaYuZkXktOP5Mqu5zufzCs/yihBLKyWOYqna7u2ciULTyQBXHEl9k5pVdG5Tbdqwq2tO8tAlXv6pbDiGFhAZYNLiebLTJICGwq2TuM8pI4Rr7jTU8Tcrgtt5pcryJKmkZPrMW4X1CTaNoj8vAXRNsd2yYCGS/RL6BbSl1atkG/ebBcubey7cvTUkYwJoDzOvvpVPFcsN7cJGa+Ar9I1IzqSL1SJxYy8ynGR1y4UsiBoKIRlQmVRhJh8MaMJdPCOONZfDwDvQXPlSZ7r4DqR7XHEj/zNBLdpeMh4giRifDRdBKikPeF2IvI+bVZAH0T0/EH43fxMkAFUrZQGXKRL5G7kx+qPVKj5mLfpW3fkmDFp0K/u8UnIAtyhfku876Xzr4kbHPNwhFYM3u0kADNuys8elKedv70E++Nh8St5DKQI1i0iQ3AsgIlI/ypUvfekcI0K478DF3DuQjqX0s3wVkNsAIGaF614la0eF7Q61KBuFdeBk30vCnhwBVdt8saaCQP3VuqwGQMLkByJoRKJWx5aL8chVj2NeLR+g2S0SRp70b4NV6es+DmeM9dj/wjUS16L6KZoFbwfT+CvrSRy67wFCOiw7NN7rvCctUAz1LJ3Dm+l0sUMxmq2pZl8IKXmwq8IjkcahI5LdPkwhGxb+XA7g3/xde570uOx39rOoh4lyY/l4Vm3sIMdK6+0HMLAU+sKqWt7OF7TJeDydv3hOwzTYAGuvNPeufJrL5ivdsbP7wwwnzkaHpabXHsxomP06mfTEzF7Wm4ztlDySyfJjeTvWoBwjS9MpNDuA+K1A1Pp901td5+H+SoUnZg0/PZakf9n9OZH1EDpBjev6dwxjVE1kOIJhMLWJekM2B48zqf0V81MQtnVnuL6aVgqqqkTLSKMIhU0u2kQH0avHaBU1/LwEoILDEAwrpcByDjEsKQ+Yj91ZQFhVCe1culWuLcBpp1U5FMj8zqwXSZCx3vp2AZWGrYVipsaF2k430QISW1GxSmHdBWhPb7UK2ZBp2laNFkzXN9ZPpsCNhYDUypnhgIDWnAd+K+EdzvbVE9EnAMDuy6oQ0cmZtd+vFem6az9Ko/JEbJ2Kl+qc4IEREwzxvVaW4JV0XHbQhHTMCebo5IpaenUyZdUtJykFrXxaYuJqDxbj4TeVIn6GN/nlnOMOCa5Duiv+R9XhEOPX5camctBwIwMkQEYn3Yw+/qtC32KciGQ/9lM0ZtrX1oOwU7FV6JSlHIQG6Oxk9Q4HBI0EQTN1S9cb9TrG8RSGtzAM9WIyzpTWBBcy8g4/tqYzop7MllcEuV4XArEjYIoUgrlOzXVWiUVhGJdvDuvCd+bkyq03tkWR0byhwEbUXveqoM/3aqb1b7jk+mvjKAHKnDpqYsgGHJ7d+Y49j1/JndUJnozp/GV430r8vKkjFtcoGeqF2hlnZxCEYbo0nFlYau1kjV2PVoxOrZ+fFVBl2pUGRIPn8PnJDasRKEONZnBm3KQmfiSqIoXXpV5WY5Cd2WB540uNB8NzAySvsVpYgASVeQZClbBQzg4dbYf8WiuD59rHiyXnPWA9ylxNl3IgX6q0T/JbR1u23+9/4cXBEPjjzRTC/luSAyvgKTOaUaGLOg5Cq0jTjs+NOVsr/tzr+KW5qLXJ1mdEOW5JosOHaZ7nuMArNmE/Fc0YrW8nobJR+6RMSM8oGcZDDEZr71y1gfm4kzRnna5h0mnl1WlVFc6VK7l8ZmDsnzu8ejaXLn4FB+0YUVWmv91oXZ1Agn1GuSm7+BSphL4B3HHQDbm2eqcaOTmNq4yjE/PpldNERZEKbVIct1TcEVAaI3TXTedXZPdzMgfJTNsTTQjV2H1amySvswrVduEJjqMFxgJZ7UQHGHBOqkGBVMYTYYAhSZV28hcIb0ix49ABrpTr45KxnvDl/pNJFOXG1dzuZJsVBQC2ga43jWUNz5x29U9nNkRC0mM5nRa7ZXPbIRauFyYEG1+G/BC2MTpSK+lM15A42/dsbbkzBBWEqxgp30ofXGn3z6U/Q+1zV9tdHQv6ciq47klAfilGJfMgfeA8YAnv5DL5CqX4Yn1dryKZxBoyphVhdYwu71HHaI0KZsB0Yf2taAYUSuizg/j02CXKnEW4gKVHpTXhAYnzVOWq3u9xWKZ/Nw8vVHDvagMt7Lfici9d7oArjOVzSgSXWnMM1xoVtUi4s+6cYZpQE1iMAca4ZNITxZgfWiPFzT2+V9W5DjXNiVxCBvmVEGK5klJdMke5qZAdib0WT3fRJ1NU10wjXt3VReEs9trO9BoZx+PAcooNP8XlZQwOSMSW5Nw0GeWcEeK2DhKjWrxCY00WRNUaJYKiEAK9l85ap9Y59xYoZyJdY3jdkKkucVJCAKrdQmGStKSkHilMxHFaN2tWVNjj1kpuVlu2sKNgNmZEvlM7aAEEGSWKU9xXMRUSrE+0haRnvCOUpyaz0CKPWNDueFMU0/vFGakJaN/Bou2wcjaLPLNG94viuBAZs+BOzi72bFdi8eTi5HoFqGJqZ5SW40gdyCxilBAsctkzjoFUGlfoMzmSMc2q4hbB2dQA9HiIDoXNYaeJuaNqjfUySZb1dIGMw0iAImA8wlvP3N4i6zOl9/6x4rqTjcd9968JiGDtcX+h/J7+ixd92/rVn2sFsAd9jDkOcdve4gWBjcV//qLpeyLYEgYDGIMjD+aQ/8PnajijJVrN/UXlaI3sggGfYmhapuSv0MMDRZSlUZ80KKRY9OrUityM2XgZ20xX/738O6FASJT9VBhtbhEANcXxi+3FeyaEGGvNxAgW3UG0Q8GTl9T+qdvY9F323xC1mTokv0nMWQPArntwdCjyWpvQ75TmbAlLaDirtyg9vA3U4XwM0cIwMfcNnsBzlAH6NAc+LQp0UoeUcYumU7BooJUL7ZH+NZjo96mF0jlouMHLAAhBapPxlv5DiuEEUZShba/8dxuuKsjvZLPFarVcyBc/oJbiLm8SxUmWl0VG/G5G9Ut04ac86RTLfi7B0os20AOg6v+zfov8o26XVnSoO33h/6Xe6J3NHhbqPdL8Zt8voshRBNGpVeoH4F9WkDNd9fL5YhfGmZzAtVo+j4qR6ssX4uH6OhNQlfiBvnxx//FwFsrpSQvZcoPCYcpS3S7m4+cvXjMw2QyzjHTU4nW5W7dbjXqzViyUu2B3ZE4xDE9cGqatn1DG80p1+GIRHnfYpMjzuf6z14twb/ng3SMnjx8/sOdEc2hrwxJ+eP3/4+qeW2lgVLnP/QstkX+0eyXyt3YhaZi38e8mEAc/ab3enVX3oFNEaV2B4Gn7dfXEGP6nzlpqfWDHYVD7w1abFGRFNRwPJv9dqTQmqqCMCQn/LOIdYO8qX7ar+VyuUG11eynyTDIH1kSLbadiWhWa6PNdR2Hg++EnwnWI301J434IMgWemmZsVvoawXAqiNJRrcuIfQ+BSanJcgAu8B0JC82VWTgf1ss07YT/xtPjq89EpiiuKkUCfsg8Ei66O3BNfEtZ1v54ktCW2IOPRArpONy/PdO021y7FRJVZbl6zDrBgNXBzzP+9fOPteUXzyDa2/oSyh8GF393KK3Lh8nyuK3WCYVh9BFr+WF66lT1Qp00QwzHsiCpHnkMD9bP5GtyRJ5Sjfaugk/YMsuLVkFlVUIeqyrjuB0uJd/bq45iN/YqU2QYSLeorRwMbSKf/0FquWqv5zeWQTpwRJ7Dk9SFfKskN0bHIgOvwDwPXryw4wk+pTQSZUL9/tZ5BgWLMXPaYVgwbTSbPsVwBgaGn30hSsp4IAJQNVnzoD9VXsf/8z+1PLT3TUeHXr/+Q965zn1gnqdslNpaoBoaJmt+VvL+PjyX7/WGlc59sUQGy7HV0dG1hodrNQrFam27quA7J4WTlGDpeHgWzy93iL2eK50/Eugh8XbDKhj+Krs7jGCtm3I3OMasnWRSs2fOT/nm1ezf1x3ctHHNstLG0s39F7jM8I1Zdp7hbLEdqhQX0c9Av2m+Md8Kq9Mu6/GLaBd+wFjldomFZwXswUZGE242W7dbIoVcbz4QavOTPy2MhEts4aNz1gr2viDLLs9jF+ayjZJR9JLHySiLOnikhG9s48YxL8xsDLwc8xg5oKLLahrWwPcP+xjl6EOfQgr5uxUPAedwgjI2cer8BdYrisd/jun50obqbVsf6aNgTce+P7bKA70WMT6gvuMDwbZ0gtQcUBuscm6Xc+7Gbr7XmWvy5Jdo691pI5KXH7MuLFVshihYCm/lg91K7VukRABgYglbCKmhGrMW87hJ8NhzOacliSi+o0cHWtT5TIVDc1sFdEFXuDgayFbQ0HUaCJ3ukJVcwkw5fm7YDVUYoLEvqxXXkUcr0qzMf4bmidOggIK5OKt8pYVI67wgj0EZUVnAeyKRzhNRRk85SOwg7DfRy5MZ2Y4rK1poKrIoGfCqKHTnbUSJW6OpxP+mgqmau9SrxTqchOKgfy/me3GFTt2OShIBImYuQmyYBYynDBX0+WxqOIWQvSCBYh9Lo9ep0UD1mkEYtktijfZSOmM5wAEOWzsJRrCKVqZhKd0K6VQywSX2LB7YJJjA2549W2+GbUr8uDFnKqmerUpIiNp6S8jzVHXtlNChU5IUsdccGACcMZvFR4MeNs5lk52j9rRjcr/kOB27Oe0qkZGv3C1nn6ww5+b9e8a3wnBMX2zn/om+oIBJxgQMgL463/NYjwAAGJ1vYf12MXVmRqMASxuHvxWQ1AXyHeY8CzPJvf5Ixzjqix6oqAYFJrNNYoU3YVCExeq6eLAteiHA/gZMzOgDIF6lz/LrnGP5Ce5G56PRHnOXQBgJm4sqDErs7ab+79bV68WdkdLuleK9u42tvPheShZMdsvrvFKqOxf8rc9UdxaNx4I8KHbjKrAn0p1LZ8huZ39cGkv8azRKrHZ5V7Qto/fn9r2DGMBGLQncVWXFHsbu6qQiNqz3Af+V3nRcmuFlVaNe/pDJvDfZCIcqZCjCQ0FbtaNEf8sEZuk5O7tWaqmoZGWpbsxrNShEM4HrNQRFJvLCFCm9PjSnTrTBIzUMAbwmXrpIOq7bjqvKdIB6aA2nhVQG8jy9Hx68aUawcomedi9cQ8gA2av8Q/5FHkOlJEKlV1MTpRXIMxYrGINQbxTEuHEjkslDpE+n5WQWhlRNyhP1TY8HLnGh/z/vPC/T9tlGXcvnzO6hnFhVucYgCUIvyUgDOYujG6Va3JbW6w07nVaDh0JsJkH/Omf32mIu30wZ6SKRlQLFUM6ahnplw69ELiPFMWPEREoMYCRq1KJ2qlxg1PPDlWb/bGYqCxhk5NeuKOY3OWii/LLxURySWC1ZPdYh/M9rmN6NyTa8ZflBoCscC0gc+KlCEaIWhawEs6tkszkc8vpCAeoZkxMoVAFExWqVmWaDel3bcUzzNcEBqZAZeELIMP13696gObP4dCxim6w/Kx1uuQDvZ0u47lEbScEE+jdbat7tFIRaBjh5qqwT8Y2edmf933AgHzYnkgzSt2Qkk6eErmlahqxYumnwoh0A6DezDlNDz9efbmnqqzAlxGUKvQWdlEnX0yow7di68HZh3YQer8ZM4KjBNTS4wxwwTVsHcMUJuXwVDw62sn+NnmMN1Qy4mJCz5RXkZy+2s397ZwXJcIQyLVbG9ZKEmj6Tzwzw9U9hkxaYlD3ZBXLQqgcVaq+H/v6jgMw6Rh9kTLFV0vWz+4OBL4/jfL4hSKWpxGf3VKFiJLA0FWl2WExn3iSXDHma8FxaaReCua3rQuGQF8lGz0akdZxjJF7l2tSikRaEgXC6KgDkRC6BQWnSWc85Ga4LZPXgyf1NAzdQvhnNluv1VriRm1QtF4s2x4GkRt4+9PvFYq2jy9rvvmTT0VIlk8slIYE1tQ1ZtqApHJmACaNevd9GghhFMS0MJ2LCuGM2dO3y7yv02fxQRaXLzQNHUo0OqarH9AhhjDw5/kpcRO+0+SCaD0XtcK0oy7MZeyqFTV5sIbPP+YML0bgQMerGUXhYot1Ouc3S3khmqRBtWBqPoEXtaDRxpsWnnp7yQKS2U7JIAEpBpiqtRBMnApQFTBcfogicloX7htUrugyPucm+hBQyG9maJrmhj+Ymd/iQ3KcIQfwSxuhrDfAUo+xeISQcbBcv4F2UryVnpY0Z1AsY2K0LvczEVEKYnoEBEIICOtvA+8A/NVNrTjstsRwy60qEj8nJQZIGUJbErknnDTwXbixPb9W6OlZLpNc34ZAZZJNFE+yMd3tpWhnWB6xiGqIuVRVHKK2JDiCyoMzFgiJmF7eSDjldF2NowqC7a9LyY3rLkScrzNF5/8T5dRji7njpyqmLpPsO0Ju08BwxgRQTpFPn7vQGmnHQ4w91STZIejRZLS7e1QTkw6dI241m/1J8I+me6GpvYXonUx2hCtilYxcKZzaZIquV/n5xNPGPUUu+0uEc0TJ17I9tewb/hED3t7n8XNrfz37G6R1v3zXzEZr9SYzSs4foiLB58U/yFzLO55yhyrTtQD4+BAc7/h9Dvhc1J7/j2mn+zOBIrTM+PpVZ1DL4U4vj8okBuq+qkc/rkRWLS69zy67cdZmBeTX/YrHT8ZMO8gOncK1Lz5YvmZPJS1cjVkBspH9ebfwPU/bhhd51RtZ9rn8ZqcGOvw3k2y8Au2nH9VEJFeWhi2rt8I//HzpUvUX1aAmK6cbSsRLZrRH2/8NOpSgPcj+cx3JUWezQzUL/RqezHzhOUM7m1Z0Sf1xcrwnJmKnwHOJVK8yLizsLQD5IlNbNLDkW/0OxU9xr2vHCl34UIXkFjQG/S5GkXKXJiYR88A7peJYg4LQ0pDkqdY0KrKgzy0N7h5R5+f2f9FYweZESh7//e5Y/Arrfd9I6qSU/xa2wx3OdxWedNuu5GqP2XY6ktFsd0pCraFR3s+LsLkF+MEXkiNts6n/UL0lh9/I1GmVRT+EKklorgTkjfOrSFYRSZxuZvx8fEyzQYRvK7zIbgwkTynzBqFmjWzj5RtuTzcmgXaECiPmsrb051rPs0cZ+EBaNLqpGHkw3kdBKDzMh7K7MriZTV8NQg0kNOobjTLQl+rxabSISvselNKphCEktn+4AgAymLu5Do+VOwbasUb1iwrWNk1ClwMZDGU+Z9nxc5p9NtrydiOqIe15vlgKyj4IJQHST7clWt9nWZxhvqqFYQoFFL44PBLCNxguw0TZkddbvVqaoRBkVCiyq22prraQwhSy/l7bGGjVWEBnPcQyln2mL3MSiElbhbDIsCrzVKrdizEbK9dRfS+QOH/Kjp5jwWLofUKFd368NaPoBwEgY6U6SAm7kByYFvqGYSfBxjR/4YBaRSF6vtEkfMamEkEx5a7SnuGgkVOgsbvAOyIxsqF2yj7CJVchQglWy06irsD7GhQti3hYHc5d7PztyxsnQgu3dtPR9z4Y6UyWRZ0kT6Y6TVevK5WKxoSgSx5gLZkBu0Roq5foup4QgsFZKWzCedvY7ZHf4VEEqTDkHzOhUpQl9PgiKpQg9WrC8JE8kl5ZybEY0WwJRurTeG2ulOIZ1xD8vtxjc369TPfAuG5fOTtbiPNJ64BPsfD5fre4KXI9TsDVQyVgoCBTmzYgw8P2++6/JQiK4lTARgv7QZD3emI2onuFrZCQ4X8IZ1XJHHEcWqBuw6CzXqO91pCC4qOxB4bV0UgEMZBA9R9VpR1TWnUDhGQwvtZ07a1nMLxY3OSdSTH0KH+XVQQQueubEesYmVNvYbTQ+hJy8B7IH/UxbY7pWtXqGBJ/g3zhj2bbri2LWiiia7vQchT4vYUcadxTbgVvbOOjlIQMIRi9Po8SZV7RxMkAyS2yXK44T6eYhseebtm87YR64+VJPTQ0DgmGhHTK4ImgvLshcqeZJUy4wxkzxmOPchjAS+imY90GTLWm8pfpkJpu13hFGaED1FtbWeyvr3rzG8xf2QB+8I9wuyhITAIwBiHQdfGc6nk7XzRIlgYAqWx8ESHNRsFjHliXlPCcgh/2O05mrt8bisVBcScUok4zxdofvJAMMU5faXG2I4xa8ydq3vMrEAtg6j7wTMazcCcxki8FLBNBoRSWwqFJEoKYBzXxFr8SX19ixA3WTqtA1O8Z2CIXQlByrgOpOL7WnBggMUhZTLQkIjb7GVhuw4FGCHFEmGbO2iUUR2KQv4kRO9rBW/01ZgZ6h+wdo2ChLCVyXLvVI0qLt6RaWE327wJLAAS8sDpVmaKV6ZYDRk3Vfx5HHrSVwFckcM+p0VjJ0WVNFRlappljTSmar9WcJhCZAKw+lhJlwrA39pUfXIjaB+A1aG3I6/58yINh6HwOwPjQOf9lKb1Nqc2qruj9C5G2OWhX+5pZ6v+ErY9L/s6U9wADhvmth/3ndX05+9MtnX0coAvgZRsMMIXLdoRWHJVi7DUOSHbzTNmCMDWBsDXMpNq+cjdkjU6c7CU9XgQlMJYHOS4kb0sldys3QSPneQAuR29nASu8vByu0e4Mh6+u6puocJ0wQq7PJUwG+iYzLYSkUgAIja0aZxmQqMFLJU5kC9mAeY+vI93aF+VvV83Z2ZJ56PF5AHtSs1DhGFs+lvN0+wMyRz+S7a1oTie5RfIStzRbz1fk6Yimzp4vdwwjS7hrGU+brreevn02rmcmg9ToFUz27uiM7rJdemrv9oPuI9k0l2AgHnTUrB4Okp1k+As3oKF+qkRxY3hwN+VKyBA+PnCM6ynv70wHmNWAIJj36ddniHRTU4K3nl4HHzyAgPBXArSdDQVimb0XMugZQ3CrmK4j592sgEWo700hoEQSb6vPfxQ6ChDHeWCF9/mc952wkIFMhu0ev3swnKLr6Vynus3vnViH8D1FQgEwxGFpiF0V9+LJ7nfvPu8MJwisJUeUWZvZt35CUOdE/te42b/DUnwG+IFhJnnMJw/+gOCzq2Xcagrj36QtKrO4SOxm/DzpK2HrBsPPiav1nwaE0N29HcCQ1fx/b1O9WAAa+Q0agNnhPruh50Qt44RQoY+E2AreB5XbJBBrQFnSa4Mfqcs2IuEEdXDvA13by2JwyfF5fMEn7FPF6ObG+RNaRQi2p80GZBBPGhaSdpVt4/u/jR+mRH33kDrAzw9qyih/+zerVWiPeb/EbTaiywKN+qfCSOZ9sWMO19FToUCkEm8qQkYKeeUQ0RTARXBrn1nLhzhzCNK5XL2+iWOWjOFI0/aEkK4y+AVWo65woJqmGZTf1vvrgBfA1m3ZjBlHrrCKC5IUlK1ICTNZpwBiF+kbAXdj3QPVMOC6YauZq1R+iVdJFssZqI2+zdr06Mmyq9G6SFtjykr7/6sG4Kg3hWL3TvT+m6dbPOIm8j4XkBONFrRuKmkyDv3KqUug11BOXlEJon89BGbNn79/Sjs4o8FiVgokcTeDkJGNVJylNo1xpZzs8m+TYa7tvKqqDq+/r223wNWNTqa5xIk7QVzHsVaslbhhRJnztR6pCFhNa4mreLA6VdeBeBPdMbkATdGfPtLoLDxM75/Cjm3H1GfhJEy2N4C8BvGItDAC/HmoXUl20VEK7/5dzXDqhSrw6wEmExAQDJiBPtMSJ5Brtuev6MqmXdBQ2QFkBhUQqxfw6zn44FQZXoXnt+1ZZx0wkc+ItUS1iuvV235oIjapAC96WGVyp1r4VWRmGlWi6GHsiteFROerbrSDxLWjU5QNcN/Z+v/FqeNuFPTHGVnMnqhtPPpHkG8+9BFVGxa7wgfYwLYWImP7obgUccCvtIgvKhT3WpPXj7Wqa5tdwRcHJVitShUGWj5J4CFKFcMJDkKXC0pD+mA8wVpRBBjggy0fc/Lu/wCBbPhi3tb4MsDHBceh+mqc2kiPAS+PlFgBsL1YBTi4/7CUPugiWKwESvgYIzDTS0kz8Uoo1998tW2Lz0xZ+pdGABGQBuSiQgQTtmcH1lsIZLphmVLOg15MKEGKk/qcVVxxkgzN+GEWEfgAEsbkyvnIAa2zKbEyNZbJXul7/vmQakpijdcUuKAMMZuq4R52qsiFneGBdhL7Ngtpb3kHscbbiEqGYHDrfApAOKUxEbEKQPyz4hwuiR8OoAKXoE41Rb+R+H6r1Jg6udG4zTDd3pTuM2KsPwTFWMBdjeo1RVJlUgh3PNHq2ZZWgc6LzJwSEfsNwGJGsk40Nx+gTjGHlRJr2eMKpS7quyFoUWYq4L12muuhzlrbe8SH1DzZ+wkpjtZwXUQqwpVmxMy7AAJQL6rREEflgup7dGfWy8tFDh46W30yhfl4YCjhSVcPASqWWYBpD4nLDoMRa1slBndQUXOjvzAn2wygx5BrjYMk6M3+syX1wPwxJzI1aSKlcL0aI4/16xFMUy9L1Os5y7LDAQc+39tywY79m0h9MTAkV32ixce6gQKNAwbaSjpKGjFU1AMIhiM0fu//v8eoh7cLffzYf3hIZRR0OZg9QyuSbzqTUPnmQ/mawTJ7bTI0WzbcEfp7MfAiv7f+ustH1c0+Rn5LRJ+a5l7Fxqv5wez42qktLsIY+avincAz0oMs5Qh4DjSEhkHd0rlWtuu6fcd6tu+B7kJ8pkjPRK+w1BN0jYLbZ1qIyfszFFIU9mRx4D9u6NhkpvqDTNtrq7tnwKStflGxnr8xdG2Df0ErKfhDdrE8OsE3b3Kk6L+a6BGLRsJJygPH03/zndaly22TbSIZLzvZ6ywY0ew/3LrVJsh4usaIDgi+HuiNGNEzzS6UNg66jd5yY10eTUNMWiwOMg5OCIBGELOnvRT6c4Mv0wHPbNnX9Uvt9dZwEBxd/JOF37ERsVJbN3KujKzk/QQ6M/2V6/uduo95qt5Nwv5vZhQx0Cb+6GDj8vhmVU53XDg5TY+6Ay9KhBdT7A4erYYNg4NXFmq/2fFTW9aK+t3+6k4e8Xn/RMm+Si+CX4PH5IWDEauZCMPLpMPrLspfe3/tyff3NnTNX6brnbxydTJ8cyPlHky3PgW6o7tBP+0CAkO4W2QVglq0UCZ4KEfNEulKm198J6TVbgAQYF4oqvbx2exTix49Xjp469bySTlW/NqAmBrGPhHX8PH1mBGntxsV+vyxFYIzVJIzu5CnDl14K0fS6ZsEIg2VXEs+NBDGfHlCACo/AERc/5JuD5OvEp23+KkUu7dqGocchjYboY+nvUo3GDfMsMtLrlyReE7RFg+PWIinoAFMRWZ+FrTIek5Ympp10gkewnayjBalrjVWiuXVpTh6PbaVxQMN4zo6uVYfDDROabjyulJwkjs09rFKHoMCWNrpl+WkCEwIINqkGCoz7OQwzkp3HidnCxTSWotrWBwE0dzcPPvAYXqgYq6uAMKGsGVqG6JBgXMmOeZtu+W5aDNTfs4JuerTdjqTNqMqs8wjAyORmu58eArI+t0GyArNb47W+a0WKmm0bssMjsy+o0HYUaUEtSTzfD33dGA2TSEJcDG0YzEU3yHw4aILqpp8firFIFPjN3J35FBMCd52Z4VQSd2B4CygZDFpbOv2VSpSfaXZLknN/8L/A7uu0KSKYBwuutvUjnmHGmTvrURoqimHrJcHcqVNiqF494mgNd6adWR1CQ+WZHsW9YEGFCyWlXrA6DDFzuW5Zmf5NTFXtvo3B9vNhPwxHmzvtKA0O2f77d8r51tjOQQSjoG0ZDRMxLp1YqC0e4jbtSM6I0QRCxOSgsn82QN96fDC1j/avqSOGICQaQMysmAUd3mEeiTChdBv6uh/A+OZ4aK5dm45fpoDRsDVml/t31e6lXFr8FX9xvcGguhXmvSlu0wuwWK2Km+1OpyfFrhb1YTbb81xdH4ijfomK3e/9U9cIyMNmTXN3ojumpID+ZawpGgwGYtb/0KRU8qAppkwHhMmCsNDpgsuiYtgRgyYIksaZUs7JLTEHI5HJUCIPIA2FbKNZxrItwqtlP560Xr5+7kO47dOeHVS95/rLwzlioXS24fVzf0vvxTr8WZDtyJAwmcqeXdNI+Eiqt6cWlceLji4f4feDPCkaDZ2PX+FJP4cslHmcxztasN1rhZhoH/M3+GYaHWRAhuOOk7ceVmBVIlpg11OM1l2n7xm5/HG1Xc7wfLPpvWmAgSoN6h0XYonW4jwlf9BrpXcbE2gbTSkbrkzTQ+EVc9SDlOcBgJ0sCtrsgfh0FPbQ6hYx90MvX8yt0ajR8H6FoB6NZbLrHcCE1UMXgWNxWWRZWUY2AgsSytgB7HqZXDRrgIQb8wqAEXcf/KVfqi5Ez1k+9/8Mwmp33LnfX4bLnQ8BzPTVKGp9pKfy9fQQKR5nYOagIzpMbp9H+ws80n3XCb28Ju79uLESNZ72k42OtDIG29TaM3Byf9U9ifdn4E6fLveXB53luV3BHmLE6rdhe3FqTDT06C9/tBswCVPD8BzBF4xJ97vuFuFq54MjV/7CpzzYX2i2sfk0/+08Xm7hOAyi9useMpeGy1vbw+sQcj9nNF9fAWGH4BaohBqC9oTO32IwBrYJ9P3+4Y/wk33pCK/qKzDvAEYs7M+Av2Z70/5SvEBDqO+jEFDtX+Xrx98++/GX6AR7ZiPWqb8AtQR08wcdzMBJ6mdjIJLvy+2T4XryOVcYrILG952LbimGZT5f4Jv6HBWhK3C7JpCSeI2gZ1GKyeOr9DgIh5tPZSXp182KbzIAlKcyDJX2MuQVGBXDYWrJCt9vo88sV8H52LcfUemgS04wV07KcK1jKgYo7JMDCqHcH5IgGAiR8hFcku0Pz0682J59X6e2c/tXvFklyGgmHhjXj7+qW4LFA+n55Ki0E9SL5TacReBs+PC+/qjv9NSQg3WS05cutf+qdqJJo9lQwrLpvbhMeAC0Mf5LrVc9nkqvY/b6ocn/RDqahybVMf13cm8jyXCD8bX0H6Ecl2k80p9ovnZcG0VSXMQEDdTAdJnhyU+yEwEOQu9LjcZEWnOG/Uw1yys0THFjwBH6UEG6l6KhOwpShlYqHaEC1mbTQ85ZKidmDQ2jzqMR99/Xk+xkvXCXQ/JX/sd81X00RVyJ4N1Zi+wsXlVakDTcAWP8HEtWkGyVh1z6qRyBhTQuq9nktdsVEMXUgzFCsRpVO6rMWpriqDFoCEHyroQex708ErHf9U3pWyJgOZ/0EAwVaZFKa69AjjVNoAFjqrUWQ1FbsmubJoLN4YMdrsuXfdLTtGaK1Ac0vZPhmZOwPUdKskwAAxhBBzfp4+5jq7YTJ6hxhUQ37Lmz7Vpgmqcbnt1XOjTVdRZoBC7BpXDNpOvH0zzFcAwqvAar2EEYuGxblczEot5cPEZed7xW3l8JJSFBBC08HTdmXaT2cFHpDeKEVIIxYaPn9sryMR9cq/ESLQUcj0sum2kJKU99xOKsN6G+W9okIDSrhZkPOYNaH8OQh7r1f+8MFsS+1x3VGIeivzdaE3ge0T+stynZ2G7jpt5o1xFcKtvLA+XSpXYrgxrV79a6uDpkK1UMM82jj6Gug9UTETingcECTJQX4ShV5Natw77nXlcXGzSF1CbBsODoQ63zdhRFYYgYk0IblwlAmUwU/y3KZYaG99wi8AU/ZsuFHB0Hx3troRC6lzNGzw0ooQGKPpXa+s4YeF3LBSKkWnL0uXCMCYh2tIigGaaHi68Ed+hsRNP6AJUc1ijlFSdCPF3tEbVLgzJ37gkYxneullHvoeA3Qv1XGhebKbfAn6yEGfhcBJhp0uBgNFNrEtKJQqE3zwkf0ZEfnl//3r5+iM9VHM5fv7+fRCk3M2nGcBgMhVXJN/obE8As8G0k8irKyyoCFY1bXWfmIo+1tFQY5a9EhfnFNbUV/W5wwdqWPcIBaDywg1XuS4zNFY40EWO2lUHeKz1Af64ShnFSNKPEJ0lKJBH0C55Gf9x9L+5UBCUoB6lDRILSeLKib7aq1cc4ioIysTBxnTD/vJ6g6XTklvskFVT2tCyX33zz6VNR3LRAO6sAGpK1vSCM4lv5NUGGy3ASTg9bFyPRiGwaew41Hw+aJys09MSuFUwBZoip0nV7wQ3WCboYV1n/xUbmN1ydQJmbdjxWQsnoa9Jr+wsEu4e7rZ2Bi0w8OkDNHYdZ7S1Gg16V6BacTzQHXfSRShdRsGYrWtnerJxSDRjGrj8bjKiX8MgkdyKgXHH80WLAMecEvTyD88u2IUvifsQzooZ4biwysYXO+Y/wJl46DNFQkrhm0Mtrn2Ar09Syb0ju8jO6otzGvGDlVzgasZyUK5aZyOVLFZQ+TiaJh1zHhEF6T1mBXAf58sZJqlvQl9BXIU27diFoXVimPXhJlVPENRiAhcNSm1CK/oWFYtiQTkjRjMIo6FQu2ja7kGs35VK87xohaoCsUc02tJPOObLjgHricfq5a9b1lCXxYOjxl8UsrGxQFjQNN1Q6ss9fG9+2jUFjG9JUKNNsnVLeiRsnREsASLs4FCVGNcqxGijOfNx8FUc6OF8/ASdPNDkwvGHrzoG5RTY2O9Gn6AHbKyDUnUiIV6iWbkuNw3ckfKz8USqRTcIjaDkIJvTVBRQTjqAShSw+BHehFiBU0FK4lqDGRIh1yCT5GqubZs7aZDUde5DuS4bkpReqKgrCMsreNFz17HL7HTcTw6yNjfFft9qNiihQEQs4s2xlsPfgte766JHZ3KQpnsr5VMgymvBv7pM3Xg0pSg2PJxhIo+ykQDCZPAG1mN14LoqoIY6YBoJ8xB/rd3kK/i5Di15Vbifabrvkf91O+9+wc/9/TB5+nNo9INkvo593YGOlo+Z1IJAICN+QN07Z11vOl9LnG1vx/697PqvrAQIvM0MD/Gr6omm9Xt7Uy+6mOusmIR9yY5rktkgXkwTcWryBrtPR+O7jUei6MCaduyaug5R3r8pWbMmEL0PWDTdKYs1mQRopoXCJ5/MIwA8KbIdo2l6AomwK9QWmAAvHd7nv1b6QsjNzCKgxl++hqdNrYAEr1009kaB+PNGAPpOzpJdrU0XH+pZ2FpwbnZk7H/fPfksh+iSBGgA2J9ow2j/tm5dYM5+4oiHIjmZunSRqBlzCLYGtmiCwP4hAHIMPZpHtvddt9QU2iGrcjqkSPZMHAo0FDJbrz8m0ZU0mtkTiqABP8NPrpGwNf6ZcIH+PPeIInyWr2h9j72pUEM5srMBQlBMFfKFdmojqV1L37r6pi0G4N5Wb6c3nl7UyW9vhUGgN9wu2ymcdRbnQ/GP5neIhIk5ccohfWPXia8JZsjpNfoPnZ1HqmnL7kOT/qUb57DPQ/qCEfBEo1rhDBd5sxH3z4qIN++UBcPDRSgznKyu43zMA6Jf7p6fqSoOOiPtRo8J7azrdQ+8mHgNDQv8zzAXoY+VGkivOVxhGth1dVnlZRow/FY3NnKGdDK9ISqndNc02R0RiQ+EI98iBmNIYYp0Ykn5aR7wz1Ce7BuImOxPeFtJ95iE9Q1eK5XLnI3/kg5ZM3Ki9a/Dbm6WZanwPEMUiekGbhOCFDQkd65VRnOUCoUUE3TAQKinBcc/3rwVMuZKMDcz+cDEpAw4QRt8OjG0meH5T1CTqG6pxNrGTIBgNAxzBK+Hw2qMK4yZSYkaukc+UC01OIuI9pEpU9VAJAG9SYCR+AzSsEGYrQL4ZT4fg4yXEh49HsNxAsI+WL9l3+z+bzVdyj02H/O1Sae5zJhuYuKBlwjjufvZpI7SimgsQuiaNoNPnklZwY0+bhI/1hpoC30OILmrk0G8SQbhYUW590FNEBUEdM00d9lFhJjgIOTEhGKdy5JaZ6QKWpHbAmCZqMbNzSwlTBqdaHGcN7VmRDUdeeDZz6Ga7mPDE/NxsorWYOVyxQY125qIitMR9w+E5mltzvBrnWzI3k7yoAHpsnG/IXrXNvziwqNXedE7gqXYf+Z8WF/k7o+lFZpPznN7gzKweiHEF//F3sfX/2fdrRf+C1qAKSQagMZocMNxq6XXy9cxKdNcUXnyNO5zmrUa8mclKxcEHbc7SGaht4B4+QEt0RluXwNH/BcEhOPxPdFjBk/Qv8bQgptT3kT16g2fuqWDry7kj8ns3O3yrPAKW4QfAz5MTKXVip2L20TCfKLmrXZSn4fsHtVa1ODmE5zquKruDi630YlEXe1mAD+7pNYBy0VsBAdNxXxa/DTxNrzd/gGgRXODndS8DDDcTuChgKgXDQ0A5LuQNSEOFPTISjOl+AICCMcyFiSBiCYexGsl6j6Suw6hyJpGOweENl4c2JEWl9bkuPAw0AzJQPqQjvvgsmwZZBUADjiAIyBouTw5qIYmxECXxPpZ/sTcJ8qF0bPWCrwBlXcIM+VAHZXrijHPNITf0yj/794NuwWd4gP9wMo530PmmuOakEyYlx9q78mTNUQeD3cvcV1VzYelaVAJ/WUAwTiyA5wfQlVW17iy9F5WAIGbH+Ul5zJ9/7ppECIDh/IBuvVV6MfY3bIR4BYAP/83tBgA+OhgfPIxPkaEzhADIgQGAAL0v36zetin8fydGLO5HsWbbTHx1FtRW4L+kd31U1n+DcOx4F99DB3Y1PlaeN1gY62HPoqA5vYC/Cj/WTUjqoIM14MMn4/4aZBAuLOyK1woCe8iQxnBFW9af+QaYdRuvbVkJ3o/k2Q4Ith5CXxfcdT0ZxDEtDSIIY+JtlB9HiZGD/7GtJqKikL+N6CFbOsHlxeH/hcU2Nxnhw2Ht8aklpIpPiY1itivvvctFrsusMA6gFMX0yVPf/3RzUdQoUmKFZB5sOLdgUPYBhInA+wpuR19gVIBULLMmFbInYVuLuEjNQpapiCoeXdkpF+iHNOWAv2ZqQ0MLkSFVJWDIUAR60IActGCFaIjaWZUqsIMeIkABkaYChta6ROOUPBub6XmubAsioiF3QXr81PVVjrOkJaQgWFU4pPE7kkpNNpORxYjLAyMqAFQcrw9NGf+QJtNR+wJzsmhaSE8qipZ3AP+uWf88eCdJ+Xke4zoVg2uBKQFcrU0ZIs6HnS8A7OV+2xi3ji2DvlzI6tvngmnnz6hY8ExvvHWTudTW+FDY5DETcM6NlYJjnGNE3uFcGoyXhNc9jJXWUz3S/8M2s4yP+DMXvXUk8ep63vPtfz1cQIsQeR0prXAsQWs0a57J+o4HFoZ34B1Yq+0bcFHkPI1QnwRoeK2kBsqCyrq3NJAuEEABBwA3D5YfghDUpxAM2d6EELhqUwhJZHWEULCqJIRGW5E3JmPI/zcHARD1ZwgCeL0MwQCrxyEEoOZiCAnwOlGDkhCH0N60L4QBlKwDbNNgCAdCMh3wTT0hAhClJEQE2kSGSEASYogMFJ6HgoDMsRAFlYUseDutoRA0ElnodkQhOkRoGsua8Bq7/mABf8hMc6YanK1OR5psWrNQJZAe2nD9wI9Net8RWYPqdUIZYp7am5pqmtl47H2ulNCX132iIyJI0FPnD6ckyKmDmo7h1bpp4po22JiwfdDKyUYhWmNoaKMU38sd2no0Xsq2PC+ilU3rzbXhKKoncRPrBScRb+GpZo3mmj3e0XPaP/U0gjbYPpEMKx6orLDyimolNywmke+esYp6EMT3eexV085qaeaPl9GMJHNRMdagMgEa1e978szSC+UbyGasKnvw+iqLlp0PmWN91bDTxlxpw9RBtOiu6ubpqg7uROibd93QWgTV7psZd627bpy2S9+zEx/LW9Dcmx5PGgxPD8c0eL4wEobB94HBeRW2q7TDXFIyAXK/UqhywUWXKKmoaVx2xVXXXrv9vY9STee6G2rcMs9Ou+j9zvBC7h/ObT+o9SMLqxixfmMLAkJCKOB6Afe51GvWZBW3RC08XvNCmnxtj5IkWQqfO9q0Gxs0GCM1GJAmnV+GDpk6jdOty2rj7ZblD9ly5PpGnnwT9Og10QgFChV544jiYCHc/9vAhZMgMjjhpOVWCH3NePkV3X+tZuMkCKIoWCEKFVVhookuBqDvCv4JK7U0CpdWEQx5570PggXBxbMVkrVE1jhtKhJoQsQnUlEQIFKiTBw7SnTssZfTGWfts98BB222xTHHocCDkF4GGRXNJEdhZGKygZgh89afDhEQ4lug3DqOWMDKqhjEcEwzxQzTzdSfWNko9SpxipddDjmVIJfcSpRHXiUxW4JZ7nrknvseJ1kp8ilVaUqXXxnKVJaylaNc5SlfI1SgQhWpWORoOYiupT/W3VXP1NSmqSJxoapqc1u322RWZ0XBPWIXXsgJzrkxQlAs6H5W1f9siTjh5We9kb66bLxCvdnX0FK/3V/JyfZon5g6NwtkmN13mIauE/aTlOHywDfudefKfGCcHD0u3+l09JQcEIhn8iYgnpPGqAPD3R+6FEJ3ESWQEMYZIjLcRIyI6iERiOQkkVwRiSATOiMCQQkEQQYRgRiBgKCTAiICgUCMPuhlCBmOm9AUdtf/gKa27sT4XtMUUdheQA83yuSmPQQtfYiKpkx4kcrtcyzDssuudKb8ZagvMJTY34ZqWeaT+YkbvREYcXiGMOJwj6D8bUiSFG6AIaGzUq5FeFvfpn731hNKp9Ozrvt7IbPr2aNpT6npw5ReR/jPD01z4mpBpJXneqbtYUGylI5p8bWXRi+b0a7P749emIx8kWfEwadlaT0fU0b3++uvzJIoev6PgCnjzFjylcYh1F9c7aElq2pNad3tSUO5Eo1O6Dk7+z96yONYf00yrFn6pS//vD1kjqAEpuDx+ZArnkK0YPiXMhkYAAA=') format('woff2');}
@font-face{font-family:'Archivo';font-style:normal;font-weight:700;src:url('data:font/woff2;base64,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') format('woff2');}
</style>`;
var RED = "#E42827";
var INK = "#111111";
var SOFT = "#3A3A3A";
var MUTE = "#6B6B6B";
var FAINT = "#C9C9C9";
var RULE = "#E7E7E7";
var SANS = "Archivo, 'Helvetica Neue', Arial, sans-serif";
var SERIF = "Archivo, 'Helvetica Neue', Arial, sans-serif";
var W = 1200;
var H = 630;
var M = 56;
var MISSION2 = "For every child's self-sufficient, mainstream life \u2014 open, WHO-coded developmental knowledge.";
function b64urlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(b64urlEncode, "b64urlEncode");
__name2(b64urlEncode, "b64urlEncode");
function b64urlDecode(token) {
  const s = atob(token.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
__name(b64urlDecode, "b64urlDecode");
__name2(b64urlDecode, "b64urlDecode");
function ogToken(card) {
  card = card || {};
  const c = {
    t: String(card.t || "").slice(0, 160),
    k: String(card.k || "").slice(0, 48),
    s: String(card.s || "").slice(0, 190),
    g: (Array.isArray(card.g) ? card.g : []).slice(0, 4).map((x) => String(x || "").slice(0, 30)).filter(Boolean),
    m: (Array.isArray(card.m) ? card.m : []).slice(0, 4).map((x) => String(x || "").slice(0, 8)).filter(Boolean),
    l: String(card.l || "EN").slice(0, 16),
    u: String(card.u || "").slice(0, 240)
  };
  return b64urlEncode(JSON.stringify(c));
}
__name(ogToken, "ogToken");
__name2(ogToken, "ogToken");
function parseOgToken(token) {
  try {
    const o = JSON.parse(b64urlDecode(token));
    return { t: o.t || "", k: o.k || "", s: o.s || "", g: Array.isArray(o.g) ? o.g : [], m: Array.isArray(o.m) ? o.m : [], l: o.l || "EN", u: o.u || "" };
  } catch {
    return null;
  }
}
__name(parseOgToken, "parseOgToken");
__name2(parseOgToken, "parseOgToken");
var xml = /* @__PURE__ */ __name2((s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), "xml");
function wrap(text, perLine, maxLines) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (!cur) {
      cur = w;
      continue;
    }
    if ((cur + " " + w).length <= perLine) cur += " " + w;
    else {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines) break;
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  const usedWords = lines.join(" ").split(/\s+/).filter(Boolean).length;
  if (usedWords < words.length && lines.length) {
    let last = lines[maxLines - 1] || lines[lines.length - 1];
    while (last.length > perLine - 1) last = last.replace(/\s*\S+$/, "");
    lines[Math.min(lines.length, maxLines) - 1] = (last || "").replace(/[.,;:·\-\s]+$/, "") + "\u2026";
  }
  return lines.slice(0, maxLines);
}
__name(wrap, "wrap");
__name2(wrap, "wrap");
var ICONS = {
  spark: '<path d="M12 1 L13.9 10.1 L23 12 L13.9 13.9 L12 23 L10.1 13.9 L1 12 L10.1 10.1 Z" fill="#fff"/>',
  alert: '<path d="M12 3 L22.5 20.5 H1.5 Z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="14.6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17.7" r="1.3" fill="#fff"/>',
  ring: '<circle cx="12" cy="12" r="9.2" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M9.1 9.6 a3 3 0 1 1 4 2.9 c-.9.4-1.1 1-1.1 1.8" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.2" fill="#fff"/>',
  gauge: '<rect x="3" y="13" width="4.2" height="8" rx="1.4" fill="#fff"/><rect x="9.9" y="8" width="4.2" height="13" rx="1.4" fill="#fff"/><rect x="16.8" y="3.5" width="4.2" height="17.5" rx="1.4" fill="#fff"/>',
  heart: '<path d="M12 20.8 C2.5 14 3.6 5.5 9 6 c1.9.2 3 1.8 3 1.8 S13.1 6.2 15 6 c5.4-.5 6.5 8 -3 14.8 Z" fill="#fff"/>',
  layers: '<path d="M12 3 L22 8 L12 13 L2 8 Z" fill="#fff"/><path d="M2.6 12 L12 16.7 L21.4 12" fill="none" stroke="#fff" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"/><path d="M2.6 16 L12 20.7 L21.4 16" fill="none" stroke="#fff" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"/>',
  pulse: '<path d="M2 12 H7 L9.8 5 L14.2 19 L17 12 H22" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  compass: '<circle cx="12" cy="12" r="9.2" fill="none" stroke="#fff" stroke-width="2.1"/><path d="M12 12 L16 8 L13 14 L8 16 Z" fill="#fff"/>'
};
function iconFor(kicker) {
  const k = String(kicker || "").toLowerCase();
  if (/concern|sign|worry|red.?flag|caution/.test(k)) return "alert";
  if (/question|definition|understand|what is|faq|meaning/.test(k)) return "ring";
  if (/assess|score|measur|diagnos|screen|test/.test(k)) return "gauge";
  if (/support|therap|help|treat|intervention|guide|next step/.test(k)) return "heart";
  if (/open data|dataset|\bdata\b|corpus|library/.test(k)) return "layers";
  if (/condition|comorbid|disorder|delay/.test(k)) return "pulse";
  if (/cause|influence|factor|outlook|research/.test(k)) return "compass";
  return "spark";
}
__name(iconFor, "iconFor");
__name2(iconFor, "iconFor");
function kickerAndMarks(label, marks, y) {
  const text = (label && label.trim() ? label.trim() : "Childhood development").toUpperCase();
  const fs = 21, h = 42, padL = 16, iconBox = 24, gap = 12, padR = 22;
  const labelW = Math.round(text.length * (fs * 0.64 + 2)) + 6;
  const w = padL + iconBox + gap + labelW + padR;
  const icon = ICONS[iconFor(label)] || ICONS.spark;
  const iy = y + (h - iconBox) / 2;
  let out = `<rect x="${M}" y="${y}" width="${w}" height="${h}" rx="9" fill="${INK}"/><g transform="translate(${M + padL},${iy})">${icon}</g><text x="${M + padL + iconBox + gap}" y="${y + h / 2 + 7}" font-family="${SANS}" font-size="${fs}" font-weight="700" letter-spacing="1.5" fill="#ffffff">${xml(text)}</text>`;
  const ms = (marks || []).map((m) => String(m || "").trim()).filter(Boolean);
  if (ms.length) {
    const mh = 34, mfs = 16, mpad = 13, mgap = 8, my = y + (h - mh) / 2;
    const widths = ms.map((t) => Math.round(t.length * (mfs * 0.62)) + mpad * 2);
    const total = widths.reduce((a, b) => a + b, 0) + mgap * (ms.length - 1);
    let mx = W - M - total;
    for (let i = 0; i < ms.length; i++) {
      const cw = widths[i];
      out += `<rect x="${mx}" y="${my}" width="${cw}" height="${mh}" rx="7" fill="none" stroke="${FAINT}" stroke-width="1.5"/><text x="${mx + cw / 2}" y="${my + mh / 2 + 5.5}" text-anchor="middle" font-family="${SANS}" font-size="${mfs}" font-weight="600" letter-spacing="0.5" fill="${MUTE}">${xml(ms[i])}</text>`;
      mx += cw + mgap;
    }
  }
  return out;
}
__name(kickerAndMarks, "kickerAndMarks");
__name2(kickerAndMarks, "kickerAndMarks");
var WA_PATH = "M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01S14.69 2 12.04 2zm0 18.15h-.004c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.21 8.21 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z";
function waGlyph(x, y, size, fill) {
  return `<g transform="translate(${x},${y}) scale(${(size / 24).toFixed(4)})"><path d="${WA_PATH}" fill="${fill}"/></g>`;
}
__name(waGlyph, "waGlyph");
__name2(waGlyph, "waGlyph");
function qrBlock(qr) {
  if (!qr) return "";
  const s = 124, x = W - M - s, y = 26;
  return `<image x="${x}" y="${y}" width="${s}" height="${s}" href="${qr}"/>`;
}
__name(qrBlock, "qrBlock");
__name2(qrBlock, "qrBlock");
function enPill(lang, rightX, y) {
  const fs = 19, padX = 15, gi = 16, gap = 8, text = String(lang || "EN").toUpperCase();
  const textW = Math.round(text.length * fs * 0.62);
  const w = padX + gi + gap + textW + padX, h = 36, r = 18, x = rightX - w;
  const gx = x + padX, gy = y + (h - gi) / 2;
  const globe = `<g transform="translate(${gx},${gy})"><circle cx="8" cy="8" r="7" fill="none" stroke="#fff" stroke-width="1.6"/><ellipse cx="8" cy="8" rx="3" ry="7" fill="none" stroke="#fff" stroke-width="1.4"/><line x1="1" y1="8" x2="15" y2="8" stroke="#fff" stroke-width="1.4"/></g>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${RED}"/>` + globe + `<text x="${x + padX + gi + gap}" y="${y + h / 2 + 6}" font-family="${SANS}" font-size="${fs}" font-weight="700" letter-spacing="1" fill="#ffffff">${xml(text)}</text>`;
}
__name(enPill, "enPill");
__name2(enPill, "enPill");
function tagRow(tags, y) {
  if (!tags || !tags.length) return "";
  const fs = 18, h = 38, padX = 14, gap = 10, r = 8;
  let x = M, out = "";
  for (const raw of tags) {
    const text = String(raw || "").trim();
    if (!text) continue;
    const w = Math.round(text.length * (fs * 0.6)) + padX * 2;
    if (x + w > W - M) break;
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${FAINT}" stroke-width="1.5"/><text x="${x + w / 2}" y="${y + h / 2 + 6}" text-anchor="middle" font-family="${SANS}" font-size="${fs}" font-weight="600" letter-spacing="0.3" fill="${MUTE}">${xml(text)}</text>`;
    x += w + gap;
  }
  return out;
}
__name(tagRow, "tagRow");
__name2(tagRow, "tagRow");
function ctaFooter(y) {
  const sep = `<tspan fill="${FAINT}">   \xB7   </tspan>`;
  const ruleY = y - 58, posY = y - 32;
  return `<line x1="${M}" y1="${ruleY}" x2="${W - M}" y2="${ruleY}" stroke="${RULE}" stroke-width="2"/><text x="${M}" y="${posY}" font-family="${SANS}" font-size="18" fill="${INK}">For Self-Sufficient, Mainstream Life of Your Child, World&#8217;s Only Regulatory-Licensed Child Development SaMD Platform</text>` + waGlyph(M, y - 17, 22, INK) + `<text x="${M + 32}" y="${y}" font-family="${SANS}" font-size="20" fill="${INK}"><tspan fill="${RED}" font-weight="600">WhatsApp</tspan> <tspan fill="${FAINT}">\xB7</tspan> <tspan fill="${RED}" font-weight="600">Call</tspan> <tspan fill="${FAINT}">\xB7</tspan> <tspan fill="${RED}" font-weight="600">SMS</tspan>  <tspan font-weight="700">+91 9100 181 181</tspan>${sep}care@pinnacleblooms.org${sep}https://pinnacleblooms.org/ask</text>`;
}
__name(ctaFooter, "ctaFooter");
__name2(ctaFooter, "ctaFooter");
function renderOgCard(card, qr) {
  card = card || {};
  const t = card.t && String(card.t).trim() || "The Child Development Ko\u015Ba";
  const k = card.k && String(card.k).trim() || "Childhood development";
  const s = card.s && String(card.s).trim() || MISSION2;
  const tags = Array.isArray(card.g) ? card.g : [];
  const lang = card.l || "EN";
  const len = t.length;
  const fs = len <= 30 ? 62 : len <= 66 ? 54 : len <= 104 ? 46 : 40;
  const usable = W - 2 * M - 24;
  const perLine = Math.max(8, Math.floor(usable / (fs * 0.58)));
  const tLines = wrap(t, perLine, 3);
  const lh = Math.round(fs * 1.14);
  const sLines = wrap(s, 88, 2);
  const hasTags = Array.isArray(tags) && tags.length > 0;
  const kickerY = 176;
  const titleTop = 248;
  const titleSvg = tLines.map((ln, i) => `<text x="${M}" y="${titleTop + fs + i * lh}" font-family="${SERIF}" font-size="${fs}" font-weight="700" letter-spacing="-0.6" fill="${INK}">${xml(ln)}</text>`).join("");
  const titleBottom = titleTop + fs + (tLines.length - 1) * lh;
  const sTop = titleBottom + 30;
  const summarySvg = sLines.map((ln, i) => `<text x="${M}" y="${sTop + i * 31}" font-family="${SANS}" font-size="24" fill="${SOFT}">${xml(ln)}</text>`).join("");
  const summaryBottom = sTop + (sLines.length - 1) * 31;
  const tagsY = Math.min(Math.max(summaryBottom + 22, 460), 484);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${xml(t)}">
<defs>${ARCHIVO_FACE}</defs>
<rect width="${W}" height="${H}" fill="#ffffff"/>
<rect x="18" y="18" width="${W - 36}" height="${H - 36}" fill="none" stroke="${INK}" stroke-width="2"/>
<image x="${M}" y="42" width="92" height="92" href="${LOGO}"/>
<text x="${M + 112}" y="100" font-family="${SERIF}" font-size="38" font-weight="700" fill="${INK}">Pinnacle<tspan font-size="19" dy="-15">&#174;</tspan><tspan dy="15"> </tspan><tspan fill="${RED}">ASK</tspan><tspan font-size="19" dy="-15">&#8482;</tspan></text>
${enPill(lang, W - M - 124 - 26, 70)}
${qrBlock(qr)}
<line x1="${M}" y1="156" x2="${W - M}" y2="156" stroke="${RED}" stroke-width="3"/>
${kickerAndMarks(k, Array.isArray(card.m) ? card.m : [], kickerY)}
${titleSvg}
${summarySvg}
${hasTags ? tagRow(tags, tagsY) : ""}
${ctaFooter(592)}
</svg>`;
}
__name(renderOgCard, "renderOgCard");
__name2(renderOgCard, "renderOgCard");
var LOCALES = [
  { code: "en", htmlLang: "en", ogLocale: "en_IN", label: "EN", name: "English", live: true },
  { code: "te", htmlLang: "te", ogLocale: "te_IN", label: "\u0C24\u0C46", name: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", live: true }
  // { code:"hi", htmlLang:"hi", ogLocale:"hi_IN", label:"हि", name:"हिन्दी", live:false },
  // { code:"kn", htmlLang:"kn", ogLocale:"kn_IN", label:"ಕ",  name:"ಕನ್ನಡ",  live:false },
];
var DEFAULT_LANG = "en";
var isLang = /* @__PURE__ */ __name2((c) => LOCALES.some((l) => l.code === c), "isLang");
var localeOf = /* @__PURE__ */ __name2((c) => LOCALES.find((l) => l.code === c) || LOCALES[0], "localeOf");
var CHROME = {
  en: {
    brand_mark: "Pinnacle \xB7 Ask \xB7 Ko\u015Ba",
    mission: "Because Every Child Deserves a Wonderful Life.",
    tagline: "The Child Development Ko\u015Ba",
    explore: "Explore",
    vantage: "Vantage points",
    standards: "Standards",
    about: "About",
    search_ph: "Ask anything \u2014 \u201Csigns of autism at 2\u201D, \u201Cspeech delay\u201D, \u201COT vs ABA\u201D\u2026",
    search_label: "Search the Ko\u015Ba",
    search_go: "Search",
    ask_next_h: "Ask the next question",
    ask_next_sub: "Search 32,800+ clinically reviewed answers.",
    authority_h: "Built on India's largest child-development evidence base",
    lead_h: "Talk to Pinnacle",
    lead_sub: "A real team, in your language. WhatsApp is fastest.",
    lead_wa: "WhatsApp",
    lead_wa_s: "Chat now \xB7 fastest",
    lead_call: "Call",
    lead_call_s: "+91 91001 81181",
    lead_sms: "SMS",
    lead_sms_s: "Text us",
    lead_email: "Email",
    lead_email_s: "care@pinnacleblooms.org",
    cta_as: "Start free AbilityScore\xAE",
    cta_as_s: "The one private, clinician-administered measure",
    faq_h: "What Ask Pinnacle is \u2014 and how to trust it",
    foot_thesis: "The Child Development Ko\u015Ba \u2014 every condition, skill, milestone, therapy and standard of human childhood, coded to WHO classifications, written for parent, teacher and clinician alike, and open to the machines that carry it onward. Built by Pinnacle Blooms Network.",
    foot_machine: "Open knowledge",
    foot_legal_nondiag: "Informational and strictly non-diagnostic. A diagnosis, and the personalised AbilityScore\xAE, are formed only at a Pinnacle centre, by a qualified clinician.",
    skip: "Skip to content"
  },
  te: {
    brand_mark: "Pinnacle \xB7 Ask \xB7 \u0C15\u0C4B\u0C36",
    mission: "\u0C0E\u0C02\u0C26\u0C41\u0C15\u0C02\u0C1F\u0C47 \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C2C\u0C3F\u0C21\u0C4D\u0C21\u0C3E \u0C05\u0C26\u0C4D\u0C2D\u0C41\u0C24\u0C2E\u0C48\u0C28 \u0C1C\u0C40\u0C35\u0C3F\u0C24\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C05\u0C30\u0C4D\u0C39\u0C41\u0C30\u0C3E\u0C32\u0C41.",
    tagline: "\u0C36\u0C3F\u0C36\u0C41 \u0C35\u0C3F\u0C15\u0C3E\u0C38 \u0C15\u0C4B\u0C36\u0C02",
    explore: "\u0C35\u0C3F\u0C39\u0C30\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
    vantage: "\u0C26\u0C43\u0C15\u0C4D\u0C15\u0C4B\u0C23\u0C3E\u0C32\u0C41",
    standards: "\u0C2A\u0C4D\u0C30\u0C2E\u0C3E\u0C23\u0C3E\u0C32\u0C41",
    about: "\u0C17\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F",
    search_ph: "\u0C0F\u0C26\u0C48\u0C28\u0C3E \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F \u2014 \u201C2 \u0C0F\u0C33\u0C4D\u0C32\u0C32\u0C4B \u0C06\u0C1F\u0C3F\u0C1C\u0C02 \u0C38\u0C02\u0C15\u0C47\u0C24\u0C3E\u0C32\u0C41\u201D, \u201C\u0C2E\u0C3E\u0C1F \u0C06\u0C32\u0C38\u0C4D\u0C2F\u0C02\u201D\u2026",
    search_label: "\u0C15\u0C4B\u0C36\u0C02\u0C32\u0C4B \u0C35\u0C46\u0C24\u0C15\u0C02\u0C21\u0C3F",
    search_go: "\u0C35\u0C46\u0C24\u0C15\u0C02\u0C21\u0C3F",
    ask_next_h: "\u0C24\u0C26\u0C41\u0C2A\u0C30\u0C3F \u0C2A\u0C4D\u0C30\u0C36\u0C4D\u0C28 \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F",
    ask_next_sub: "32,800+ \u0C35\u0C48\u0C26\u0C4D\u0C2F\u0C2A\u0C30\u0C02\u0C17\u0C3E \u0C38\u0C2E\u0C40\u0C15\u0C4D\u0C37\u0C3F\u0C02\u0C1A\u0C3F\u0C28 \u0C1C\u0C35\u0C3E\u0C2C\u0C41\u0C32\u0C32\u0C4B \u0C35\u0C46\u0C24\u0C15\u0C02\u0C21\u0C3F.",
    authority_h: "\u0C2D\u0C3E\u0C30\u0C24\u0C26\u0C47\u0C36\u0C2A\u0C41 \u0C05\u0C24\u0C3F\u0C2A\u0C46\u0C26\u0C4D\u0C26 \u0C36\u0C3F\u0C36\u0C41-\u0C35\u0C3F\u0C15\u0C3E\u0C38 \u0C38\u0C3E\u0C15\u0C4D\u0C37\u0C4D\u0C2F\u0C3E\u0C27\u0C3E\u0C30\u0C02 \u0C2A\u0C48 \u0C28\u0C3F\u0C30\u0C4D\u0C2E\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F",
    lead_h: "Pinnacle \u0C24\u0C4B \u0C2E\u0C3E\u0C1F\u0C4D\u0C32\u0C3E\u0C21\u0C02\u0C21\u0C3F",
    lead_sub: "\u0C2E\u0C40 \u0C2D\u0C3E\u0C37\u0C32\u0C4B \u0C28\u0C3F\u0C1C\u0C2E\u0C48\u0C28 \u0C2C\u0C43\u0C02\u0C26\u0C02. WhatsApp \u0C35\u0C47\u0C17\u0C35\u0C02\u0C24\u0C02.",
    lead_wa: "WhatsApp",
    lead_wa_s: "\u0C07\u0C2A\u0C4D\u0C2A\u0C41\u0C21\u0C47 \u0C1A\u0C3E\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
    lead_call: "\u0C15\u0C3E\u0C32\u0C4D",
    lead_call_s: "+91 91001 81181",
    lead_sms: "SMS",
    lead_sms_s: "\u0C2E\u0C46\u0C38\u0C47\u0C1C\u0C4D \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
    lead_email: "\u0C07\u0C2E\u0C46\u0C2F\u0C3F\u0C32\u0C4D",
    lead_email_s: "care@pinnacleblooms.org",
    cta_as: "\u0C09\u0C1A\u0C3F\u0C24 AbilityScore\xAE \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
    cta_as_s: "\u0C35\u0C48\u0C26\u0C4D\u0C2F\u0C41\u0C28\u0C3F\u0C1A\u0C47 \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C47 \u0C0F\u0C15\u0C48\u0C15 \u0C17\u0C4B\u0C2A\u0C4D\u0C2F\u0C2E\u0C48\u0C28 \u0C15\u0C4A\u0C32\u0C2E\u0C3E\u0C28\u0C02",
    faq_h: "Ask Pinnacle \u0C05\u0C02\u0C1F\u0C47 \u0C0F\u0C2E\u0C3F\u0C1F\u0C3F \u2014 \u0C0E\u0C32\u0C3E \u0C28\u0C2E\u0C4D\u0C2E\u0C3E\u0C32\u0C3F",
    foot_thesis: "\u0C36\u0C3F\u0C36\u0C41 \u0C35\u0C3F\u0C15\u0C3E\u0C38 \u0C15\u0C4B\u0C36\u0C02 \u2014 \u0C2C\u0C3E\u0C32\u0C4D\u0C2F\u0C2A\u0C41 \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C2A\u0C30\u0C3F\u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F, \u0C28\u0C48\u0C2A\u0C41\u0C23\u0C4D\u0C2F\u0C02, \u0C2E\u0C48\u0C32\u0C41\u0C30\u0C3E\u0C2F\u0C3F, \u0C1A\u0C3F\u0C15\u0C3F\u0C24\u0C4D\u0C38 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C4D\u0C30\u0C2E\u0C3E\u0C23\u0C02, WHO \u0C35\u0C30\u0C4D\u0C17\u0C40\u0C15\u0C30\u0C23\u0C32\u0C15\u0C41 \u0C05\u0C28\u0C41\u0C17\u0C41\u0C23\u0C02\u0C17\u0C3E. Pinnacle Blooms Network \u0C1A\u0C47 \u0C28\u0C3F\u0C30\u0C4D\u0C2E\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C02\u0C26\u0C3F.",
    foot_machine: "\u0C24\u0C46\u0C30\u0C3F\u0C1A\u0C3F\u0C28 \u0C1C\u0C4D\u0C1E\u0C3E\u0C28\u0C02",
    foot_legal_nondiag: "\u0C38\u0C2E\u0C3E\u0C1A\u0C3E\u0C30\u0C02 \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47, \u0C30\u0C4B\u0C17\u0C28\u0C3F\u0C30\u0C4D\u0C27\u0C3E\u0C30\u0C23 \u0C15\u0C3E\u0C26\u0C41. \u0C35\u0C4D\u0C2F\u0C15\u0C4D\u0C24\u0C3F\u0C17\u0C24 AbilityScore\xAE \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C28\u0C3F\u0C30\u0C4D\u0C27\u0C3E\u0C30\u0C23 Pinnacle \u0C15\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C02\u0C32\u0C4B \u0C05\u0C30\u0C4D\u0C39\u0C24 \u0C17\u0C32 \u0C35\u0C48\u0C26\u0C4D\u0C2F\u0C41\u0C28\u0C3F\u0C1A\u0C47 \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47.",
    skip: "\u0C35\u0C3F\u0C37\u0C2F\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C35\u0C46\u0C33\u0C4D\u0C32\u0C02\u0C21\u0C3F"
  }
};
function ask_chrome(lang) {
  const base = CHROME.en, loc = CHROME[lang] || {};
  return new Proxy({}, { get: /* @__PURE__ */ __name2((_, k) => loc[k] ?? base[k] ?? String(k), "get") });
}
__name(ask_chrome, "ask_chrome");
__name2(ask_chrome, "ask_chrome");
function langPath(route, lang, base = "/ask") {
  if (!route || lang === DEFAULT_LANG) return route;
  if (!route.startsWith(base)) return route;
  return base + "/" + lang + route.slice(base.length);
}
__name(langPath, "langPath");
__name2(langPath, "langPath");
function stripLang(path, base = "/ask") {
  if (!path || !path.startsWith(base)) return { lang: DEFAULT_LANG, route: path };
  const rest = path.slice(base.length);
  const m = rest.match(/^\/([a-z]{2})(\/|$)/);
  if (m && isLang(m[1]) && m[1] !== DEFAULT_LANG) return { lang: m[1], route: base + rest.slice(m[1].length + 1) };
  return { lang: DEFAULT_LANG, route: path };
}
__name(stripLang, "stripLang");
__name2(stripLang, "stripLang");
var TE = {
  "Parents": "\u0C24\u0C32\u0C4D\u0C32\u0C3F\u0C26\u0C02\u0C21\u0C4D\u0C30\u0C41\u0C32\u0C41",
  "Professionals": "\u0C28\u0C3F\u0C2A\u0C41\u0C23\u0C41\u0C32\u0C41",
  "Boys & Girls": "\u0C2A\u0C3F\u0C32\u0C4D\u0C32\u0C32\u0C41",
  "Self-Sufficient": "\u0C38\u0C4D\u0C35\u0C3E\u0C35\u0C32\u0C02\u0C2C\u0C28",
  "Mainstream": "\u0C2A\u0C4D\u0C30\u0C27\u0C3E\u0C28 \u0C38\u0C4D\u0C30\u0C35\u0C02\u0C24\u0C3F",
  "LIFE": "\u0C1C\u0C40\u0C35\u0C3F\u0C24\u0C02",
  "Explore": "\u0C05\u0C28\u0C4D\u0C35\u0C47\u0C37\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
  "Home": "\u0C39\u0C4B\u0C2E\u0C4D",
  "Search": "\u0C35\u0C46\u0C24\u0C15\u0C02\u0C21\u0C3F",
  "Language": "\u0C2D\u0C3E\u0C37",
  "WhatsApp": "\u0C35\u0C3E\u0C1F\u0C4D\u0C38\u0C3E\u0C2A\u0C4D",
  "Call": "\u0C15\u0C3E\u0C32\u0C4D",
  "Email": "\u0C07\u0C2E\u0C46\u0C2F\u0C3F\u0C32\u0C4D",
  "Free AbilityScore\xAE": "\u0C09\u0C1A\u0C3F\u0C24 AbilityScore\xAE",
  "Find a centre": "\u0C15\u0C47\u0C02\u0C26\u0C4D\u0C30\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C15\u0C28\u0C41\u0C17\u0C4A\u0C28\u0C02\u0C21\u0C3F",
  "MCP for AI": "AI \u0C15\u0C4B\u0C38\u0C02 MCP",
  "Talk to us": "\u0C2E\u0C3E\u0C24\u0C4B \u0C2E\u0C3E\u0C1F\u0C4D\u0C32\u0C3E\u0C21\u0C02\u0C21\u0C3F",
  "Ask Pinnacle": "Pinnacle \u0C28\u0C41 \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F",
  // audience taglines
  "Start here, in plain language": "\u0C07\u0C15\u0C4D\u0C15\u0C21 \u0C2E\u0C4A\u0C26\u0C32\u0C41\u0C2A\u0C46\u0C1F\u0C4D\u0C1F\u0C02\u0C21\u0C3F \u2014 \u0C38\u0C30\u0C33\u0C2E\u0C48\u0C28 \u0C2D\u0C3E\u0C37\u0C32\u0C4B",
  "Clinicians \xB7 educators \xB7 institutions": "\u0C35\u0C48\u0C26\u0C4D\u0C2F\u0C41\u0C32\u0C41 \xB7 \u0C09\u0C2A\u0C3E\u0C27\u0C4D\u0C2F\u0C3E\u0C2F\u0C41\u0C32\u0C41 \xB7 \u0C38\u0C02\u0C38\u0C4D\u0C25\u0C32\u0C41",
  "The child, growing": "\u0C2A\u0C46\u0C30\u0C41\u0C17\u0C41\u0C24\u0C41\u0C28\u0C4D\u0C28 \u0C2C\u0C3F\u0C21\u0C4D\u0C21",
  "Toward an independent life": "\u0C38\u0C4D\u0C35\u0C24\u0C02\u0C24\u0C4D\u0C30 \u0C1C\u0C40\u0C35\u0C3F\u0C24\u0C02 \u0C35\u0C48\u0C2A\u0C41",
  "Toward inclusion & mainstream school": "\u0C38\u0C2E\u0C4D\u0C2E\u0C3F\u0C33\u0C3F\u0C24\u0C02 & \u0C2A\u0C4D\u0C30\u0C27\u0C3E\u0C28 \u0C2A\u0C3E\u0C20\u0C36\u0C3E\u0C32 \u0C35\u0C48\u0C2A\u0C41",
  "Because every child deserves a wonderful life": "\u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C2C\u0C3F\u0C21\u0C4D\u0C21\u0C15\u0C42 \u0C12\u0C15 \u0C05\u0C26\u0C4D\u0C2D\u0C41\u0C24\u0C2E\u0C48\u0C28 \u0C1C\u0C40\u0C35\u0C3F\u0C24\u0C02 \u0C05\u0C30\u0C4D\u0C39\u0C24",
  "Every angle on childhood": "\u0C2C\u0C3E\u0C32\u0C4D\u0C2F\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C2A\u0C4D\u0C30\u0C24\u0C3F \u0C15\u0C4B\u0C23\u0C02 \u0C28\u0C41\u0C02\u0C21\u0C3F",
  // column heads
  "Is this typical?": "\u0C07\u0C26\u0C3F \u0C38\u0C3E\u0C27\u0C3E\u0C30\u0C23\u0C2E\u0C47\u0C28\u0C3E?",
  "Everyday behaviours": "\u0C30\u0C4B\u0C1C\u0C41\u0C35\u0C3E\u0C30\u0C40 \u0C2A\u0C4D\u0C30\u0C35\u0C30\u0C4D\u0C24\u0C28\u0C32\u0C41",
  "By concern": "\u0C06\u0C02\u0C26\u0C4B\u0C33\u0C28 \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02",
  "Do at home": "\u0C07\u0C02\u0C1F\u0C4D\u0C32\u0C4B \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F",
  "Get clarity & next steps": "\u0C38\u0C4D\u0C2A\u0C37\u0C4D\u0C1F\u0C24 & \u0C24\u0C26\u0C41\u0C2A\u0C30\u0C3F \u0C05\u0C21\u0C41\u0C17\u0C41\u0C32\u0C41",
  "For whom": "\u0C0E\u0C35\u0C30\u0C3F \u0C15\u0C4B\u0C38\u0C02",
  "For institutions": "\u0C38\u0C02\u0C38\u0C4D\u0C25\u0C32 \u0C15\u0C4B\u0C38\u0C02",
  "By assessment": "\u0C2E\u0C42\u0C32\u0C4D\u0C2F\u0C3E\u0C02\u0C15\u0C28\u0C02 \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02",
  "By therapy / intervention": "\u0C25\u0C46\u0C30\u0C2A\u0C40 / \u0C1C\u0C4B\u0C15\u0C4D\u0C2F\u0C02 \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02",
  "Coded to the world": "\u0C2A\u0C4D\u0C30\u0C2A\u0C02\u0C1A \u0C2A\u0C4D\u0C30\u0C2E\u0C3E\u0C23\u0C3E\u0C32\u0C15\u0C41 \u0C05\u0C28\u0C41\u0C38\u0C02\u0C27\u0C3E\u0C28\u0C02",
  "By age": "\u0C35\u0C2F\u0C38\u0C41 \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02",
  "By gender": "\u0C32\u0C3F\u0C02\u0C17\u0C02 \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02",
  "Developmental domains": "\u0C05\u0C2D\u0C3F\u0C35\u0C43\u0C26\u0C4D\u0C27\u0C3F \u0C30\u0C02\u0C17\u0C3E\u0C32\u0C41",
  "Milestones & skills": "\u0C2E\u0C48\u0C32\u0C41\u0C30\u0C3E\u0C33\u0C4D\u0C33\u0C41 & \u0C28\u0C48\u0C2A\u0C41\u0C23\u0C4D\u0C2F\u0C3E\u0C32\u0C41",
  "By body system": "\u0C36\u0C30\u0C40\u0C30 \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C4D\u0C25 \u0C2A\u0C4D\u0C30\u0C15\u0C3E\u0C30\u0C02",
  "The path": "\u0C2E\u0C3E\u0C30\u0C4D\u0C17\u0C02",
  "Readiness": "\u0C38\u0C02\u0C38\u0C3F\u0C26\u0C4D\u0C27\u0C24",
  "Abilities": "\u0C38\u0C3E\u0C2E\u0C30\u0C4D\u0C25\u0C4D\u0C2F\u0C3E\u0C32\u0C41",
  "Skills": "\u0C28\u0C48\u0C2A\u0C41\u0C23\u0C4D\u0C2F\u0C3E\u0C32\u0C41",
  "Measure progress": "\u0C2A\u0C41\u0C30\u0C4B\u0C17\u0C24\u0C3F\u0C28\u0C3F \u0C15\u0C4A\u0C32\u0C35\u0C02\u0C21\u0C3F",
  "Progress status": "\u0C2A\u0C41\u0C30\u0C4B\u0C17\u0C24\u0C3F \u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F",
  "The 7-step journey": "7-\u0C05\u0C21\u0C41\u0C17\u0C41\u0C32 \u0C2A\u0C4D\u0C30\u0C2F\u0C3E\u0C23\u0C02",
  "School-readiness": "\u0C2A\u0C3E\u0C20\u0C36\u0C3E\u0C32 \u0C38\u0C02\u0C38\u0C3F\u0C26\u0C4D\u0C27\u0C24",
  "Daily-living skills": "\u0C26\u0C48\u0C28\u0C02\u0C26\u0C3F\u0C28 \u0C1C\u0C40\u0C35\u0C28 \u0C28\u0C48\u0C2A\u0C41\u0C23\u0C4D\u0C2F\u0C3E\u0C32\u0C41",
  "In their own voice": "\u0C35\u0C3E\u0C30\u0C3F \u0C38\u0C4D\u0C35\u0C02\u0C24 \u0C2E\u0C3E\u0C1F\u0C32\u0C4D\u0C32\u0C4B",
  "Growing up": "\u0C0E\u0C26\u0C41\u0C17\u0C41\u0C26\u0C32",
  "Family & wellbeing": "\u0C15\u0C41\u0C1F\u0C41\u0C02\u0C2C\u0C02 & \u0C36\u0C4D\u0C30\u0C47\u0C2F\u0C38\u0C4D\u0C38\u0C41",
  "Rights & access": "\u0C39\u0C15\u0C4D\u0C15\u0C41\u0C32\u0C41 & \u0C2A\u0C4D\u0C30\u0C3E\u0C2A\u0C4D\u0C2F\u0C24",
  "Ways in": "\u0C2A\u0C4D\u0C30\u0C35\u0C47\u0C36 \u0C2E\u0C3E\u0C30\u0C4D\u0C17\u0C3E\u0C32\u0C41",
  "The child": "\u0C2C\u0C3F\u0C21\u0C4D\u0C21",
  "Concern & behaviour": "\u0C06\u0C02\u0C26\u0C4B\u0C33\u0C28 & \u0C2A\u0C4D\u0C30\u0C35\u0C30\u0C4D\u0C24\u0C28",
  "Measure & outcome": "\u0C15\u0C4A\u0C32\u0C24 & \u0C2B\u0C32\u0C3F\u0C24\u0C02",
  "Therapy & journey": "\u0C25\u0C46\u0C30\u0C2A\u0C40 & \u0C2A\u0C4D\u0C30\u0C2F\u0C3E\u0C23\u0C02",
  "For machines & AI": "\u0C2F\u0C02\u0C24\u0C4D\u0C30\u0C3E\u0C32\u0C41 & AI \u0C15\u0C4B\u0C38\u0C02",
  // mission
  "For 900M+ children \xB7 self-sufficient, mainstream life": "90 \u0C15\u0C4B\u0C1F\u0C4D\u0C32\u0C15\u0C41 \u0C2A\u0C48\u0C17\u0C3E \u0C2A\u0C3F\u0C32\u0C4D\u0C32\u0C32 \u0C15\u0C4B\u0C38\u0C02 \xB7 \u0C38\u0C4D\u0C35\u0C3E\u0C35\u0C32\u0C02\u0C2C\u0C28, \u0C2A\u0C4D\u0C30\u0C27\u0C3E\u0C28 \u0C38\u0C4D\u0C30\u0C35\u0C02\u0C24\u0C3F \u0C1C\u0C40\u0C35\u0C3F\u0C24\u0C02"
};
function tl(s, lang) {
  return lang && lang !== DEFAULT_LANG && TE[s] ? TE[s] : s;
}
__name(tl, "tl");
__name2(tl, "tl");
var RETIRED = [/https?:\/\/ask\.pinnacleblooms\.org/gi, /https?:\/\/[a-z0-9-]+\.workers\.dev/gi];
function canon(s, env) {
  if (s == null) return s;
  let out = String(s);
  for (const re of RETIRED) out = out.replace(re, `${env.CANONICAL_ORIGIN}${env.ASK_BASE}`);
  return out;
}
__name(canon, "canon");
__name2(canon, "canon");
function canonDeep(v, env) {
  if (typeof v === "string") return canon(v, env);
  if (Array.isArray(v)) return v.map((x) => canonDeep(x, env));
  if (v && typeof v === "object") {
    const o = {};
    for (const k in v) o[k] = canonDeep(v[k], env);
    return o;
  }
  return v;
}
__name(canonDeep, "canonDeep");
__name2(canonDeep, "canonDeep");
var abs = /* @__PURE__ */ __name2((path, env) => /^https?:\/\//.test(path) ? path : `${env.CANONICAL_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`, "abs");
async function rpc(name, body, env, { ms = 8e3, retry = 1 } = {}) {
  const url = `${env.SUPABASE_URL}/rest/v1/rpc/${name}`;
  const key = env.SUPABASE_KEY;
  for (let i = 0; i <= retry; i++) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), ms);
    try {
      const r = await fetch(url, {
        method: "POST",
        signal: ctl.signal,
        headers: { "apikey": key, "authorization": `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify(body || {})
      });
      clearTimeout(t);
      if (!r.ok) {
        if (i < retry) continue;
        return null;
      }
      return canonDeep(await r.json(), env);
    } catch (e) {
      clearTimeout(t);
      if (i < retry) continue;
      return null;
    }
  }
  return null;
}
__name(rpc, "rpc");
__name2(rpc, "rpc");
var home = /* @__PURE__ */ __name2((env, lang = "en") => rpc("ask_home", { p_lang: lang }, env).then((d) => d || rpc("ask_home", {}, env)), "home");
async function launched(env) {
  if (env.__launched !== void 0) return env.__launched;
  const d = await rpc("ask_launched", {}, env);
  env.__launched = d === null ? true : d === true || d?.launched === true || d?.value === "true" || d?.value === true;
  return env.__launched;
}
__name(launched, "launched");
__name2(launched, "launched");
async function answer(env, slug) {
  const d = await rpc("ask_answer", { p_slug: slug }, env);
  if (!d) return null;
  const row = Array.isArray(d) ? d[0] : d;
  return row || null;
}
__name(answer, "answer");
__name2(answer, "answer");
async function checkedAskJson(env, path, body) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8e3);
    try {
      const response = await fetch(env.SUPABASE_URL + "/rest/v1/" + path, {
        method: body === void 0 ? "GET" : "POST",
        headers: { apikey: env.SUPABASE_KEY, authorization: "Bearer " + env.SUPABASE_KEY, "content-type": "application/json" },
        body: body === void 0 ? void 0 : JSON.stringify(body),
        signal: controller.signal
      });
      if (!response.ok) throw new Error("Ask content lookup unavailable");
      return canonDeep(await response.json(), env);
    } catch (error) {
      if (attempt === 1) throw new Error("Ask content lookup unavailable");
    } finally {
      clearTimeout(timer);
    }
  }
}
__name(checkedAskJson, "checkedAskJson");
async function checkedAskAnswer(env, slug) {
  const value = await checkedAskJson(env, "rpc/ask_answer", { p_slug: slug });
  if (value === null || Array.isArray(value) && value.length === 0) return null;
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row.slug !== "string") throw new Error("Invalid Ask content response");
  return row;
}
__name(checkedAskAnswer, "checkedAskAnswer");
async function knownAskEntityHub(env, slug) {
  const query = new URLSearchParams({
    select: "id,pinnacle_answer!inner(status)",
    entity_key: "eq." + slug,
    entity_kind: "in.(condition,skill,ability,domain,instrument,therapy_modality,lifeskill,score_band,comorbidity,phenomenon)",
    "pinnacle_answer.status": "eq.published",
    limit: "1"
  });
  const rows = await checkedAskJson(env, "pinnacle_question?" + query);
  if (!Array.isArray(rows)) throw new Error("Invalid Ask hub response");
  return rows.length > 0;
}
__name(knownAskEntityHub, "knownAskEntityHub");
async function routedAskAnswer(env, slug, lang) {
  if (lang !== DEFAULT_LANG && !slug.endsWith("-" + lang)) {
    const translated = await checkedAskAnswer(env, slug + "-" + lang);
    if (translated && translated.lang === lang) return translated;
  }
  return checkedAskAnswer(env, slug);
}
__name(routedAskAnswer, "routedAskAnswer");
var esc = /* @__PURE__ */ __name2((s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), "esc");
var attr = esc;
var I = {
  search: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  wa: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.8.8.8-2.7-.2-.3A8 8 0 1112 20zm4.4-5.6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 01-1.9-1.2 7.2 7.2 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a.9.9 0 00-.7.3c-.2.2-.9.9-.9 2.2s.9 2.5 1 2.7 1.8 2.9 4.5 4c.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1-.2-.2-.4-.3z"/></svg>`,
  call: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.4 2.1L8.1 9.6a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.4c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></svg>`,
  sms: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 01-9 8.4 8.6 8.6 0 01-3.8-.9L3 20l1.3-4a8.4 8.4 0 01-1-4A8.4 8.4 0 0112 3a8.4 8.4 0 019 8.5z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7L22 6"/></svg>`,
  share: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>`,
  home: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/></svg>`
};
var CANON = [
  ["2.5B+", "scientifically assembled data points"],
  ["25M+", "therapy sessions delivered"],
  ["4.95L+", "children & families served"],
  ["70+", "centres \xB7 4 states"],
  ["700+", "therapists \xB7 1,600+ trained"],
  ["CDSCO", "Class B SaMD \xB7 MD-5 licensed"],
  ["ISO", "13485 & 27001 \xB7 DPDP 2023"],
  ["13+", "WIPO PCT applications"]
];
var WA = "919100181181";
var TEL = "+919100181181";
var MAIL = "care@pinnacleblooms.org";
function graphLD(ctx) {
  const O = ctx.env.CANONICAL_ORIGIN, BASE = `${O}${ctx.env.ASK_BASE}`;
  const nodes = [
    {
      "@type": "WebSite",
      "@id": `${BASE}#website`,
      url: BASE,
      name: "Ask Pinnacle",
      inLanguage: ctx.lang,
      description: "The Child Development Ko\u015Ba \u2014 open, WHO-coded knowledge of human childhood.",
      publisher: { "@id": `${O}/#org` },
      license: "https://creativecommons.org/licenses/by/4.0/",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE}/search?q={q}` },
        "query-input": "required name=q"
      }
    },
    {
      "@type": "MedicalOrganization",
      "@id": `${O}/#org`,
      name: "Pinnacle Blooms Network",
      url: O,
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png`, width: 180, height: 180 },
      sameAs: ["https://www.irwfa.org"],
      slogan: "Because Every Child Deserves a Wonderful Life.",
      email: MAIL,
      telephone: TEL,
      parentOrganization: { "@type": "Organization", name: "Bharath Healthcare Laboratories Private Limited" },
      founder: { "@id": `${O}/#founder` },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: TEL,
        contactType: "customer service",
        email: MAIL,
        areaServed: "IN",
        availableLanguage: ["en", "te", "hi", "kn"]
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plot 50/A, Raghavendra Nagar Colony, Jeedimetla, Suchitra",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500055",
        addressCountry: "IN"
      }
    },
    {
      "@type": "Person",
      "@id": `${O}/#founder`,
      name: "Dr. Koti Reddy Saripalli",
      jobTitle: "Founder-Chairman",
      affiliation: { "@id": `${O}/#org` }
    },
    {
      "@type": "MedicalOrganization",
      "@id": `${BASE}#experts-consortium`,
      name: "Pinnacle Experts Consortium",
      url: BASE,
      affiliation: { "@type": "Organization", name: "International Rehabilitation Workforce Alliance", url: "https://www.irwfa.org" }
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${BASE}#nav`,
      name: [...AUDIENCES.map((a) => a.label), ...LENSES.map((l) => l.label)],
      url: [...AUDIENCES.map((a) => abs(`/ask/${a.key}`, ctx.env)), ...LENSES.map((l) => abs(l.route, ctx.env))]
    }
  ];
  const graphs = [{ "@context": "https://schema.org", "@graph": nodes }];
  if (ctx.showAboutFaq) graphs.push({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE}#about-faq`,
    inLanguage: ctx.lang,
    isPartOf: { "@id": `${BASE}#website` },
    mainEntity: ABOUT_FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
  });
  for (const s of ctx.pageSchema || []) graphs.push(s);
  return graphs.map((g) => `<script type="application/ld+json">${JSON.stringify(g)}<\/script>`).join("");
}
__name(graphLD, "graphLD");
__name2(graphLD, "graphLD");
function head(ctx) {
  const O = ctx.env.CANONICAL_ORIGIN, BASE = `${O}${ctx.env.ASK_BASE}`, loc = localeOf(ctx.lang);
  const canonical = ctx.canonical || BASE;
  const robots = ctx.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const alts = (ctx.hreflang || []).map((a) => `<link rel="alternate" hreflang="${attr(a.code)}" href="${attr(a.href)}">`).join("");
  const og = ctx.ogImage || `${BASE}/og/${ogToken({ t: ctx.ogTitle || ctx.title, k: ctx.ogKicker || "Ask Pinnacle", s: ctx.desc, g: ctx.ogChips || [], m: ctx.ogCodes || [], l: (ctx.lang || "en").toUpperCase(), u: canonical })}.png`;
  return `<!doctype html><html lang="${attr(loc.htmlLang)}"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(ctx.title)}</title>
<meta name="description" content="${attr(ctx.desc)}">
<meta name="author" content="Pinnacle Blooms Network">
<meta name="publisher" content="Bharath Healthcare Laboratories Private Limited">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${attr(canonical)}">
${alts}
<link rel="license" href="https://creativecommons.org/licenses/by/4.0/">
<meta name="theme-color" content="#111111">
<meta property="og:type" content="website"><meta property="og:site_name" content="Ask Pinnacle">
<meta property="og:locale" content="${attr(loc.ogLocale)}">
<meta property="og:title" content="${attr(ctx.title)}"><meta property="og:description" content="${attr(ctx.desc)}">
<meta property="og:url" content="${attr(canonical)}"><meta property="og:image" content="${attr(og)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${attr(ctx.title)}"><meta property="og:image:type" content="image/png">${ctx.ogImageSvg ? `<link rel="alternate" type="image/svg+xml" href="${attr(ctx.ogImageSvg)}"><link rel="image_src" href="${attr(ctx.ogImageSvg)}">` : ""}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${attr(ctx.title)}">
<meta name="twitter:description" content="${attr(ctx.desc)}"><meta name="twitter:image" content="${attr(og)}">
<link rel="icon" href="${BASE}/logo.png" sizes="any"><link rel="apple-touch-icon" href="${BASE}/logo.png">
<link rel="preload" as="font" type="font/woff2" href="${BASE}/f/archivo.woff2" crossorigin>
<script src="${BASE}/m.js" defer><\/script>
<style>${CSS}
@media(max-width:600px){.mast-top{flex-wrap:wrap;gap:10px}.navpills{flex-wrap:wrap;min-width:0;max-width:100%}.fgrid21{grid-template-columns:repeat(2,minmax(0,1fr))}.fblk{min-width:0;overflow-wrap:anywhere}}</style>
${graphLD(ctx)}
</head>`;
}
__name(head, "head");
__name2(head, "head");
var WAN = "+91\xA09100\xA0181\xA0181";
function shareBtn(ctx, label) {
  return `<button type="button" class="shr" data-share="${attr(label)}" aria-label="Share">${I.share}</button>`;
}
__name(shareBtn, "shareBtn");
__name2(shareBtn, "shareBtn");
function dirCols(cols, ctx) {
  return cols.map((c) => {
    const head2 = c.head && c.head.route ? `<a class="grp-head" href="${attr(ctx.L(c.head.route))}">${ctx.tl(c.eyebrow)}</a>` : `<p class="grp-head">${ctx.tl(c.eyebrow)}</p>`;
    const links = c.links.map((d) => {
      const ext = /^https?:|^mailto:|^tel:/.test(d.route);
      const href = ext ? d.route : ctx.L(d.route);
      return `<a${d.all ? ' class="all"' : ""} href="${attr(href)}"><b>${ctx.tl(d.label)}${d.who_un ? " <i>WHO\xB7UN</i>" : ""}</b>${d.tag ? `<span>${esc(d.tag)}</span>` : ""}</a>`;
    }).join("");
    return `<div class="whocol"><div class="grp">${head2}${links}</div></div>`;
  }).join("");
}
__name(dirCols, "dirCols");
__name2(dirCols, "dirCols");
function leadStrip(lead, ctx) {
  const C4 = CONTACT, B2 = ctx.env.ASK_BASE;
  const b = [
    `<a class="lead-btn" href="tel:${C4.tel}">${I.phone}<span>${WAN}</span></a>`,
    `<a class="lead-btn lead-btn-wa" href="https://wa.me/${C4.wa}">${I.wa}<span>WhatsApp</span></a>`,
    `<a class="lead-btn" href="mailto:${C4.mail}">${I.mail}<span>Email</span></a>`,
    lead.mcp ? `<a class="lead-btn" href="${C4.mcp}">${I.bolt}<span>MCP for AI</span></a>` : `<a class="lead-btn lead-btn-go" href="${attr(ctx.L(B2 + "/abilityscore"))}">${I.spark}<span>Free AbilityScore\xAE</span></a>`
  ];
  return `<div class="panel-lead"><div class="lead-inner">
    <div class="lead-copy"><p class="lead-title">${esc(lead.title)}</p>
      <p class="lead-prov">Coded to WHO ICD-11 &amp; ICF \xB7 aligned with UN SDGs \xB7 trusted across Govt. of India programmes</p></div>
    <div class="lead-btns">${b.join("")}</div></div></div>`;
}
__name(leadStrip, "leadStrip");
__name2(leadStrip, "leadStrip");
function dirMenu(m, ctx) {
  return `<details class="mm mm-wide" name="ask-menu"><summary>${ctx.tl(m.label)}<span class="caret" aria-hidden="true">\u25BE</span></summary><div class="panel cols full"><div class="dir whopanel-inner">${dirCols(m.cols, ctx)}</div>${leadStrip(m.lead, ctx)}</div></details>`;
}
__name(dirMenu, "dirMenu");
__name2(dirMenu, "dirMenu");
function langMenu(ctx) {
  const cur = LANGS.find((l) => l.code === ctx.lang) || LANGS[0];
  return `<details class="mm pillmenu" name="ask-menu"><summary class="navicon" aria-label="Language">${I.globe}<span>${esc(cur.code.toUpperCase())}</span><span class="caret" aria-hidden="true">\u25BE</span></summary><div class="panel auto"><div class="whocol"><div class="grp"><p class="grp-head">${ctx.tl("Language")}</p>${LANGS.map((l) => `<a href="${attr(ctx.langHref ? ctx.langHref(l.code) : "#")}" lang="${attr(l.htmlLang)}" hreflang="${attr(l.code)}"${l.code === ctx.lang ? ' aria-current="page"' : ""}><b>${esc(l.label)}${l.live ? "" : " <i>soon</i>"}</b></a>`).join("")}</div></div></div></details>`;
}
__name(langMenu, "langMenu");
__name2(langMenu, "langMenu");
function masthead(ctx) {
  const B2 = ctx.env.ASK_BASE, O = ctx.env.CANONICAL_ORIGIN;
  return `<header class="mast">
    <div class="mast-top">
      <a class="brand" href="${attr(ctx.L(B2))}" aria-label="Pinnacle ASK \u2014 home">
        <span class="amblem"><img src="${O}${B2}/logo.png" alt="Pinnacle" width="30" height="30" decoding="async"></span>
        <b class="wordmark">Pinnacle<sup>&reg;</sup> ASK<sup>&trade;</sup></b>
      </a>
      <div class="navpills">
        <a class="pill" href="${attr(ctx.L(B2 + "/search"))}" aria-label="Search the Ko\u015Ba">${I.search}<span>${ctx.tl("Search")}</span></a>
        <a class="pill pill-wa" href="https://wa.me/${CONTACT.wa}" aria-label="WhatsApp Pinnacle">${I.wa}<span>${WAN}</span></a>
        <details class="burger" name="ask-burger"><summary class="navicon" aria-label="Menu" aria-haspopup="true">${I.menu}<span class="sr-only">Menu</span></summary></details>
      </div>
    </div>
    <nav class="mast-nav navlinks" aria-label="Primary">
      <a class="navicon homeicon" href="${attr(ctx.L(B2))}" aria-label="Home">${I.home}<span>${ctx.tl("Home")}</span></a>
      ${AUDIENCES.map((a) => dirMenu(a, ctx)).join("")}
      ${dirMenu(EXPLORE, ctx)}
      ${langMenu(ctx)}
    </nav>
  </header>`;
}
__name(masthead, "masthead");
__name2(masthead, "masthead");
function mastheadBand(ctx) {
  const t = ctx.t, B2 = ctx.env.ASK_BASE;
  const stds = [["WHO ICD-11", "/lens/icd11"], ["ICF", "/lens/icf"], ["ICHI", "/lens/ichi"], ["SNOMED CT", "/lens/snomed"], ["UN SDG", "/lens/sdg"]];
  return `<aside class="mast-band" aria-label="What Ask Pinnacle is"><div class="wrap">
    <p class="mb-thesis">${esc(t.foot_thesis)} ${shareBtn(ctx, "Ask Pinnacle \u2014 the Child Development Ko\u015Ba")}</p>
    <p class="mb-meta"><span class="mb-coded">Coded to the world's standards:</span> ${stds.map(([l, r]) => `<a href="${attr(ctx.L(B2 + r))}">${esc(l)}</a>`).join(`<span class="dot">\xB7</span>`)}</p>
    <p class="mb-anchor">Pinnacle Blooms Network \xB7 Bharath Healthcare Laboratories \xB7 70+ centres \xB7 CDSCO Class B SaMD \xB7 700+ therapists \xB7 with IRWFA</p>
  </div></aside>`;
}
__name(mastheadBand, "mastheadBand");
__name2(mastheadBand, "mastheadBand");
function searchBand(ctx) {
  const t = ctx.t, B2 = ctx.env.ASK_BASE;
  return `<section class="band ask-next" aria-label="Search"><div class="wrap read" style="text-align:center">
    <p class="kicker">${esc(t.search_label)}</p><h2>${esc(t.ask_next_h)}</h2><p>${esc(t.ask_next_sub)}</p>
    <form class="srch" role="search" method="get" action="${attr(ctx.L(B2 + "/search"))}">
      ${I.search}<input type="search" name="q" aria-label="${attr(t.search_label)}" placeholder="${attr(t.search_ph)}">
      <button type="submit">${esc(t.search_go)}</button>
    </form></div></section>`;
}
__name(searchBand, "searchBand");
__name2(searchBand, "searchBand");
function authorityBand(ctx) {
  return `<section class="band authority" aria-label="About Pinnacle Blooms Network"><div class="wrap">
    <p class="kicker">Pinnacle Blooms Network \xB7 BHCL</p><h2>${esc(ctx.t.authority_h)}</h2>
    <div class="auth-grid">${CANON.map(([n, l]) => `<div><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join("")}</div>
  </div></section>`;
}
__name(authorityBand, "authorityBand");
__name2(authorityBand, "authorityBand");
function leadRail(ctx) {
  const t = ctx.t, B2 = ctx.env.ASK_BASE;
  const a = /* @__PURE__ */ __name2((href, icon, label, sub, cls = "") => `<a class="${cls}" href="${attr(href)}">${icon}<b>${esc(label)}</b><small>${esc(sub)}</small></a>`, "a");
  return `<section class="band lead" aria-label="Contact Pinnacle"><div class="wrap">
    <p class="kicker">${esc(t.lead_h)}</p><p>${esc(t.lead_sub)}</p>
    <div class="lead-row">
      ${a(`https://wa.me/${WA}`, I.wa, t.lead_wa, t.lead_wa_s)}
      ${a(`tel:${TEL}`, I.call, t.lead_call, t.lead_call_s)}
      ${a(`sms:${TEL}`, I.sms, t.lead_sms, t.lead_sms_s)}
      ${a(`mailto:${MAIL}`, I.mail, t.lead_email, t.lead_email_s)}
      ${a(ctx.L(B2 + "/abilityscore"), "", t.cta_as, t.cta_as_s, "primary")}
    </div></div></section>`;
}
__name(leadRail, "leadRail");
__name2(leadRail, "leadRail");
function aboutFaqBand(ctx) {
  return `<section class="band faq" id="about-faq" aria-label="About Ask Pinnacle"><div class="wrap">
    <div class="seclabel"><span class="num">${ABOUT_FAQ.length}</span><span class="eyebrow">${esc(ctx.t.about)} \xB7 Common Questions</span></div>
    <h2 class="display" style="max-width:20ch">${esc(ctx.t.faq_h)}</h2>
    ${ABOUT_FAQ.map(([q, a]) => `<details><summary>${esc(q)}<span class="pm" aria-hidden="true">+</span></summary><div class="ans"><p>${esc(a)}</p></div></details>`).join("")}
  </div></section>`;
}
__name(aboutFaqBand, "aboutFaqBand");
__name2(aboutFaqBand, "aboutFaqBand");
function footer(ctx) {
  const t = ctx.t, B2 = ctx.env.ASK_BASE, C4 = CONTACT, lens = /* @__PURE__ */ __name2((k) => LENSES.find((l) => l.kind === k), "lens");
  const li = /* @__PURE__ */ __name2((x) => {
    const ext = /^https?:|^mailto:|^tel:/.test(x.route);
    const href = ext ? x.route : ctx.L(x.route);
    const tip = x.tag ? ` title="${attr(x.tag.replace(/&amp;/g, "&"))}"` : "";
    return `<li><a href="${attr(href)}"${tip}>${ctx.tl(x.label)}</a></li>`;
  }, "li");
  const block = /* @__PURE__ */ __name2((h, items2, htip) => `<div class="fblk"><h4${htip ? ` title="${attr(htip)}"` : ""}>${ctx.tl(h)}</h4><ul>${items2.map(li).join("")}</ul></div>`, "block");
  const lensBlock = /* @__PURE__ */ __name2((h, kinds) => block(h, kinds.map(lens).filter(Boolean)), "lensBlock");
  const aud = /* @__PURE__ */ __name2((a) => block(a.label, a.cols.flatMap((c) => c.links.filter((x) => !x.all)).slice(0, 6).map((x) => ({ ...x, tag: x.tag || `${a.label}: ${x.label}` })), a.tagline), "aud");
  const blocks = [
    ...AUDIENCES.map(aud),
    // 1–6 audience doors
    lensBlock("The child", ["age", "gender", "dev_age", "body_system", "organ"]),
    // 7
    block("Conditions & behaviour", [lens("condition"), lens("phenomenon"), lens("intent"), { label: "Compare conditions", route: B2 + "/compare" }, { label: "Myths & facts", route: B2 + "/myths" }]),
    // 8
    block("Skills & abilities", [lens("skill"), lens("ability"), { label: "Milestones by age", route: B2 + "/ages" }, { label: "Life skills", route: B2 + "/life-skills" }]),
    // 9
    block("Assessments & measures", [lens("assessment"), lens("score_band"), lens("rag_status"), { label: "Free AbilityScore\xAE", route: B2 + "/abilityscore" }]),
    // 10
    block("Therapies & journey", [lens("route"), lens("lifecycle"), { label: "How-to & activities", route: B2 + "/how-to" }, { label: "Materials & toys", route: B2 + "/materials" }]),
    // 11
    block("Readiness & outcomes", [lens("readiness"), lens("empowerment"), { label: "Self-sufficiency", route: B2 + "/lens/empowerment/self_sufficiency" }, { label: "Mainstream inclusion", route: B2 + "/lens/empowerment/mainstream_inclusion" }]),
    // 12
    block("Coded to the world", [lens("icd11"), lens("icf"), lens("ichi"), lens("snomed"), lens("sdg")], "WHO & UN classifications"),
    // 13
    block("PinnacleAI capabilities", lens("component") ? [{ label: "AbilityScore\xAE", route: B2 + "/lens/component/abilityscore" }, { label: "Everyday Therapy\u2122", route: B2 + "/lens/component/everyday_therapy" }, { label: "TherapeuticAI\u2122", route: B2 + "/lens/component/therapeuticai" }, { label: "GPT-OS\xAE", route: B2 + "/lens/component/gptos" }, { label: "The 7-step journey", route: B2 + "/lens/lifecycle" }] : []),
    // 14
    block("About Ask Pinnacle", ABOUT),
    // 15
    block("For machines & AI", MACHINE, "Discovery surface for AI agents & crawlers"),
    // 16
    block("For search engines", SEO, "SEO / discovery signals"),
    // 17
    block("Languages", LANGS.map((l) => ({ label: l.label, route: langPathFooter(B2, l.code), tag: l.live ? "Live" : "Coming soon" }))),
    // 18
    block("Talk to Pinnacle", [{ label: "National Autism Helpline", route: "https://www.pinnacleblooms.org/national-autism-helpline" }, { label: "Call +91 9100 181 181", route: "tel:" + C4.tel }, { label: "WhatsApp", route: "https://wa.me/" + C4.wa }, { label: "Email", route: "mailto:" + C4.mail }, { label: "Find a centre", route: "https://pinnacleblooms.org/centers" }]),
    // 19
    block("Pinnacle Blooms Network", [{ label: "pinnacleblooms.org", route: "https://pinnacleblooms.org" }, { label: "SEVA\u2122 \u2014 equity", route: "https://pinnacleblooms.org/seva" }, { label: "IRWFA", route: "https://www.irwfa.org" }, { label: "Research & patents", route: "https://pinnacleblooms.org/research" }]),
    // 20
    block("Legal & licence", [...LEGAL, { label: "Open data \xB7 CC-BY 4.0", route: "https://creativecommons.org/licenses/by/4.0/" }])
    // 21
  ];
  const btn = /* @__PURE__ */ __name2((icon, label, href, tip) => `<a class="fbtn" href="${/^https?:|^mailto:|^tel:/.test(href) ? href : attr(ctx.L(href))}"${tip ? ` title="${attr(tip)}"` : ""}>${icon}<span>${label}</span></a>`, "btn");
  return `<footer class="foot"><div class="wrap">
    <div class="fbrandblock">
      <span class="fbrand">Pinnacle<sup>&reg;</sup> ASK<sup>&trade;</sup></span>
      <p class="fmission">${esc(tl(MISSION, ctx.lang))}</p>
      <div class="fbtns">
        ${btn('<span aria-hidden="true">&#9742;</span>', "National Autism Helpline", "https://www.pinnacleblooms.org/national-autism-helpline", "Parent guidance and appointments: 9100 181 181")}
        ${btn(I.spark, "Free AbilityScore\xAE", B2 + "/abilityscore", "Start the free, non-diagnostic screener")}
        ${btn(I.pin, "Find a centre", "https://pinnacleblooms.org/centers", "70+ centres across four states")}
        ${btn(I.wa, "WhatsApp " + WAN, "https://wa.me/" + C4.wa, "Talk to our team on WhatsApp")}
        ${btn(I.bolt, "MCP for AI", C4.mcp, "Connect any AI agent to the live corpus")}
      </div>
      <p class="fline"><b>The category, defined.</b> ${shareBtn(ctx, "Ask Pinnacle \u2014 the world\u2019s child-development Ko\u015Ba")} Ask Pinnacle is the world's first child-development Ko\u015Ba \u2014 population-scale, sovereign-grade, coded to WHO ICD-11 &amp; ICF, aligned with UN SDGs, and open to every parent, professional and AI on Earth.</p>
      <p class="fline"><b>Credentials.</b> CDSCO Class B SaMD (MD/classification/2025/150) \xB7 Telangana MD-5 licence \xB7 ISO 13485:2016 \xB7 ISO/IEC 27001:2022 \xB7 DPDP 2023.</p>
      <p class="fline"><b>Built &amp; operated by.</b> Pinnacle Blooms Network \u2014 Bharath Healthcare Laboratories Pvt. Ltd. (CIN U85110TG2019PTC132498) \xB7 70+ centres \xB7 700+ therapists \xB7 with IRWFA.</p>
      <p class="fded">Because Every Child Deserves a Wonderful Life.<sup>&trade;</sup></p>
    </div>
    <div class="fgrid21">${blocks.join("")}</div>
    <div class="fbottom">
      <span>\xA9 Pinnacle Blooms Network \xB7 BHCL \xB7 ${(/* @__PURE__ */ new Date()).getFullYear()}. Open knowledge under CC-BY 4.0 \u2014 free to read, free to cite, open to AI.</span>
      <span class="fmachine">${LEGAL.map((l) => `<a href="${attr(ctx.L(l.route))}"${l.tag ? ` title="${attr(l.tag)}"` : ""}>${esc(l.label)}</a>`).join("")}</span>
    </div>
  </div></footer>`;
}
__name(footer, "footer");
__name2(footer, "footer");
function langPathFooter(B2, code) {
  return code === "en" ? B2 : B2 + "/" + code;
}
__name(langPathFooter, "langPathFooter");
__name2(langPathFooter, "langPathFooter");
function md(s, env) {
  if (!s) return "";
  const lines = esc(s).split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    if (/^[-\u2022] /.test(lines[i])) {
      const it = [];
      while (i < lines.length && /^[-\u2022] /.test(lines[i])) {
        it.push(lines[i].replace(/^[-\u2022] /, ""));
        i++;
      }
      out.push("<ul>" + it.map((x) => `<li>${x}</li>`).join("") + "</ul>");
    } else {
      out.push(lines[i]);
      i++;
    }
  }
  let h = out.join("\n");
  h = h.replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, (m, txt, href) => `<a href="${abs(href, env)}">${txt}</a>`);
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  h = h.replace(/^### (.*)$/gm, "<h3>$1</h3>").replace(/^## (.*)$/gm, "<h2>$1</h2>");
  h = h.split(/\n{2,}/).map((b) => {
    b = b.trim();
    if (!b) return "";
    return /^<(h2|h3|ul|p|blockquote)/.test(b) ? b : `<p>${b.replace(/\n/g, "<br>")}</p>`;
  }).join("");
  return h;
}
__name(md, "md");
__name2(md, "md");
function breadcrumbLD(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url }))
  };
}
__name(breadcrumbLD, "breadcrumbLD");
__name2(breadcrumbLD, "breadcrumbLD");
function initCtx(ctx) {
  if (!ctx.t) ctx.t = ask_chrome(ctx.lang);
  if (!ctx.L) ctx.L = (route) => abs(langPath(route, ctx.lang, ctx.env.ASK_BASE), ctx.env);
  if (!ctx.tl) ctx.tl = (s) => esc(tl(s, ctx.lang));
  return ctx;
}
__name(initCtx, "initCtx");
__name2(initCtx, "initCtx");
function shell(ctx) {
  initCtx(ctx);
  return head(ctx) + `<body><a class="skip" href="#main">${esc(ctx.t.skip)}</a>` + masthead(ctx) + (ctx.showMastheadBand ? mastheadBand(ctx) : "") + `<main id="main">${ctx.main || ""}</main>` + searchBand(ctx) + authorityBand(ctx) + leadRail(ctx) + (ctx.showAboutFaq ? aboutFaqBand(ctx) : "") + footer(ctx) + `</body></html>`;
}
__name(shell, "shell");
__name2(shell, "shell");
var C = CONTACT;
var WAN2 = "+91\xA09100\xA0181\xA0181";
function CHAMBERS(B2) {
  return [
    {
      key: "concern",
      name: "The Concern",
      lead: "Start where the worry is.",
      intro: "Most journeys begin with a quiet worry at home. Here every concern is named in plain language, set against what's typical for the age, and answered \u2014 never to alarm, always to bring clarity.",
      dims: [
        {
          kind: "condition",
          title: "Conditions",
          idx: B2 + "/conditions",
          blurb: "Every developmental condition of childhood \u2014 from Global Developmental Delay and speech delay to autism, ADHD and sensory processing \u2014 explained for a parent, coded to WHO ICD-11, and mapped to what helps."
        },
        {
          kind: "phenomenon",
          title: "Behaviours",
          idx: B2 + "/lens/phenomenon",
          blurb: "The everyday behaviours that worry families \u2014 meltdowns, picky eating, sleep, not following instructions, running off \u2014 with calm, practical, evidence-grounded guidance you can use tonight."
        },
        {
          kind: null,
          title: "Myths",
          idx: B2 + "/myths",
          blurb: "The half-truths that delay help \u2014 \u201Cboys talk late\u201D, \u201Cscreens cause autism\u201D, \u201Cwait and watch\u201D \u2014 set straight against WHO, CDC and the published evidence.",
          doors: [["Do late talkers catch up?", "/myths"], ["Do screens cause autism?", "/myths"], ["Should we wait and watch?", "/myths"], ["Vaccines & autism", "/myths"], ["Will they grow out of it?", "/myths"], ["Late-talker vs autism", "/compare"]]
        }
      ]
    },
    {
      key: "child",
      name: "The Child",
      lead: "A child is never a diagnosis.",
      intro: "Before any label, there is a whole child \u2014 the skills they're building, the abilities beneath them, the milestones they're reaching for. This is the map of everything they are, and everything they're becoming.",
      dims: [
        {
          kind: "skill",
          title: "Skills",
          idx: B2 + "/skills",
          blurb: "The developmental skills every child builds \u2014 joint attention, first words, eye contact, self-regulation \u2014 each with milestones, what to watch for, and how to help at home."
        },
        {
          kind: "ability",
          title: "Abilities",
          idx: B2 + "/abilities",
          blurb: "The deeper capacities under the skills \u2014 communication, independence, planning, social participation, processing \u2014 the abilities AbilityScore\xAE measures and tracks."
        },
        {
          kind: "domain",
          title: "Domains",
          idx: B2 + "/domains",
          blurb: "The seven domains of development \u2014 communication, cognitive, motor, social, emotional, adaptive, sensory \u2014 the WHO-aligned map a clinician thinks in."
        },
        {
          kind: "age",
          title: "Ages & stages",
          idx: B2 + "/ages",
          blurb: "What's typical, month by month and year by year \u2014 newborn to 6\u20137 years \u2014 so \u201Cmy 2-year-old isn't talking yet\u201D has a clear, kind, evidence-based answer."
        },
        {
          kind: "lifeskill",
          title: "Life skills",
          idx: B2 + "/life-skills",
          blurb: "The skills that make a life independent \u2014 toileting, dressing, feeding, sleeping alone, staying safe \u2014 taught step by step, for every child, at every ability."
        }
      ]
    },
    {
      key: "measure",
      name: "The Measure",
      lead: "You cannot help what you cannot see.",
      intro: "Worry is invisible; progress should not be. Here, growing up becomes something you can actually see and track \u2014 a validated screen, a score you can begin for free, a readiness that tells you a child is on their way.",
      dims: [
        {
          kind: "assessment",
          title: "Assessments",
          idx: B2 + "/assessments",
          blurb: "The screens and scales clinicians trust \u2014 ASQ-3, M-CHAT, ISAA, Bayley, Vineland, Conners \u2014 explained, so you know what each one looks for and when it's used."
        },
        {
          kind: null,
          title: "AbilityScore\xAE",
          idx: B2 + "/abilityscore",
          blurb: "The one private, clinician-administered measure of a child's development on a 0\u20131000 scale \u2014 validated (r=0.91), patent-filed, free to begin. The number that becomes a plan.",
          doors: [["What AbilityScore\xAE is", "/abilityscore"], ["Start free", "/abilityscore"], ["Band 0\u2013200", "/lens/score_band/as_000_200"], ["Band 400\u2013600", "/lens/score_band/as_400_600"], ["Band 800\u20131000", "/lens/score_band/as_800_1000"], ["How it's validated", "/abilityscore"]]
        },
        {
          kind: "readiness",
          title: "Readiness",
          idx: B2 + "/readiness",
          blurb: "Seven readiness indexes \u2014 speech, motor, behaviour, cognitive, school, self-sufficiency, mainstream \u2014 that answer the only question parents truly ask: will my child be okay?"
        }
      ]
    },
    {
      key: "path",
      name: "The Path",
      lead: "Clarity is only the beginning.",
      intro: "Knowing is not enough \u2014 a child needs a path. Evidence-based therapies, techniques you can run at home tonight, and the materials that make practice possible: the route from where a child is to where they can be.",
      dims: [
        {
          kind: "route",
          title: "Therapies",
          idx: B2 + "/lens/route",
          blurb: "The interventions that change trajectories \u2014 speech, occupational and behaviour therapy, special education, AAC, early intervention \u2014 when each helps, and what good looks like."
        },
        {
          kind: null,
          title: "Techniques",
          idx: B2 + "/how-to",
          blurb: "3,799 step-by-step techniques a parent can run at home tonight \u2014 activities, exercises and routines for every skill, drawn from real therapy practice.",
          doors: [["Speech-at-home activities", "/how-to"], ["Pencil grip & writing", "/how-to"], ["Joint-attention games", "/how-to"], ["Sensory-calming routines", "/how-to"], ["Toilet-training steps", "/lens/lifeskill/toilet"], ["Visual routine charts", "/materials"]]
        },
        {
          kind: null,
          title: "Materials",
          idx: B2 + "/materials",
          blurb: "The toys, charts, cards and printables that make practice stick \u2014 chosen by therapists, matched to the skill and the age.",
          doors: [["Best toys: speech delay", "/materials"], ["Visual schedules", "/materials"], ["Flashcards & PECS", "/materials"], ["Fine-motor kits", "/materials"], ["Emotion cards", "/materials"], ["Printables library", "/materials"]]
        }
      ]
    },
    {
      key: "people",
      name: "The People",
      lead: "It takes a circle to raise a child.",
      intro: "No one carries a child alone. Every answer here is rewritten for whoever is asking \u2014 a parent at the kitchen table, a therapist at the clinic, a teacher, an ASHA worker, a policymaker shaping the system.",
      dims: [
        {
          kind: "stakeholder",
          title: "People & roles",
          idx: B2 + "/lens/stakeholder",
          blurb: "Every answer, rewritten for who's asking \u2014 a parent at home, a clinician at the table, a teacher in the classroom, an ASHA worker at the PHC, a policymaker at scale."
        }
      ]
    },
    {
      key: "standards",
      name: "The Standards",
      lead: "Coded to the world.",
      intro: "This is what makes it an authority, not an opinion. Every entity is mapped to the classifications the world already trusts \u2014 so a parent, a clinician, a government and an AI all read the same truth.",
      dims: [
        {
          kind: "icd11",
          title: "WHO ICD-11",
          idx: B2 + "/lens/icd11",
          blurb: "Each condition carries its WHO ICD-11 code \u2014 the global standard for disease classification \u2014 so the Ko\u015Ba speaks the language of health systems everywhere."
        },
        {
          kind: "icf",
          title: "WHO ICF",
          idx: B2 + "/lens/icf",
          blurb: "Function, not just diagnosis: every skill and ability is mapped to the WHO ICF \u2014 the international classification of functioning \u2014 the frame modern child development is built on."
        }
      ]
    }
  ];
}
__name(CHAMBERS, "CHAMBERS");
__name2(CHAMBERS, "CHAMBERS");
function SEPARATORS() {
  return {
    open: { quote: "Because every child deserves a wonderful life.", sub: "We spent a decade, and 25 million+ therapy sessions, learning how children grow. Today we give all of it away \u2014 2.5 billion+ data points, coded to WHO &amp; UN, open under CC-BY \u2014 so no parent ever faces that question alone again.", cta: "primary" },
    concern: { quote: "Worry is not a diagnosis. Clarity is a right.", sub: "Not sure whether what you're seeing is typical? Begin the free, private, non-diagnostic AbilityScore\xAE \u2014 a clinician-grade picture of where your child stands, in minutes.", cta: "abilityscore" },
    child: { quote: "From first words to full independence \u2014 we map every step.", sub: "India's largest child-development evidence base, built across 70+ centres and 700+ therapists, now open to you. Talk to a real team, in your language.", cta: "talk" },
    measure: { quote: "You cannot help what you cannot see.", sub: "AbilityScore\xAE turns worry into a number, and a number into a plan \u2014 validated at r=0.91 against Vineland-3, CARS-2 and Bayley-4. Start free.", cta: "abilityscore" },
    path: { quote: "Clarity is the beginning. The path is the point.", sub: "Every answer ends in something you can do \u2014 a technique tonight, a material this week, a therapy this month, and a real centre when you're ready.", cta: "centre" },
    close: { quote: "Population-scale. Sovereign-grade. Open to all.", sub: "Free to read, free to cite, open to every AI under CC-BY \u2014 coded to WHO ICD-11 &amp; ICF, aligned with UN SDGs, trusted across Govt. of India programmes. Not a clinic. The operating system for childhood.", cta: "all" }
  };
}
__name(SEPARATORS, "SEPARATORS");
__name2(SEPARATORS, "SEPARATORS");
function ctaRow(kind, ctx, B2) {
  const wa = `<a class="hbtn hbtn-go" href="https://wa.me/${C.wa}">WhatsApp ${WAN2}</a>`;
  const as = `<a class="hbtn hbtn-go" href="${ctx.L(B2 + "/abilityscore")}">Start free AbilityScore\xAE</a>`;
  const call = `<a class="hbtn" href="tel:${C.tel}">Call ${WAN2}</a>`;
  const mail = `<a class="hbtn" href="mailto:${C.mail}">Email us</a>`;
  const centre = `<a class="hbtn hbtn-go" href="https://pinnacleblooms.org/centers">Find a centre</a>`;
  const mcp = `<a class="hbtn" href="${C.mcp}">MCP for AI</a>`;
  const map = {
    primary: [as, wa, `<a class="hbtn" href="${ctx.L(B2 + "/search")}">Search the Ko\u015Ba</a>`],
    abilityscore: [as, wa, call],
    talk: [wa, call, mail],
    centre: [centre, wa, as],
    all: [as, wa, mcp]
  };
  return `<div class="sep-cta">${(map[kind] || map.primary).join("")}</div>`;
}
__name(ctaRow, "ctaRow");
__name2(ctaRow, "ctaRow");
function separator(s, ctx, B2, cls = "") {
  return `<section class="sep ${cls}"><div class="wrap">
    <p class="sep-quote">${s.quote}</p>
    <p class="sep-sub">${s.sub}</p>
    ${ctaRow(s.cta, ctx, B2)}
  </div></section>`;
}
__name(separator, "separator");
__name2(separator, "separator");
var GRID_ICO = `<svg class="vall-ico" width="15" height="15" viewBox="0 0 15 15" aria-hidden="true"><rect x="0" y="0" width="6.4" height="6.4" rx="1"/><rect x="8.6" y="0" width="6.4" height="6.4" rx="1"/><rect x="0" y="8.6" width="6.4" height="6.4" rx="1"/><rect x="8.6" y="8.6" width="6.4" height="6.4" rx="1"/></svg>`;
var ARR_ICO = `<svg class="vall-arr" width="17" height="12" viewBox="0 0 17 12" aria-hidden="true"><path d="M11 1l5 5-5 5M16 6H0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function doorsFor(dim, ctx) {
  const norm = /* @__PURE__ */ __name2((d) => Array.isArray(d) ? { label: d[0], route: d[1], sub: d[2] } : d, "norm");
  const list = dim.doors ? dim.doors.map(norm) : items(dim.kind, 12);
  const href = /* @__PURE__ */ __name2((r) => /^\/ask(\/|$)/.test(r) ? ctx.L(r) : r, "href");
  return list.map((d) => `<a class="vdoor" href="${href(d.route)}"><b>${ctx.tl(d.label)}</b>${d.sub ? `<span>${esc(d.sub)}</span>` : ""}</a>`).join("");
}
__name(doorsFor, "doorsFor");
__name2(doorsFor, "doorsFor");
function dimensionBlock(dim, ctx) {
  const n = dim.kind ? ctx.counts && ctx.counts[dim.kind] : 0;
  const word = ctx.tl(dim.title).toLowerCase();
  const vall = `<a class="vall" href="${ctx.L(dim.idx)}">${GRID_ICO}<span>View all${n ? ` ${n}` : ""} ${word}</span>${ARR_ICO}</a>`;
  return `<section class="vblock"><div class="wrap">
    <h2 class="vhead">${ctx.tl(dim.title)}</h2>
    ${dim.blurb ? `<p class="vblurb">${dim.blurb}</p>` : ""}
    <div class="vgrid">${doorsFor(dim, ctx)}</div>
    <div class="vall-row">${vall}</div>
  </div></section>`;
}
__name(dimensionBlock, "dimensionBlock");
__name2(dimensionBlock, "dimensionBlock");
function chamberHighlighter(ch, i, ctx, B2) {
  const cta = { concern: "abilityscore", child: "talk", measure: "abilityscore", path: "centre", people: "talk", standards: "all" }[ch.key] || "primary";
  return `<section class="chl"><div class="wrap">
    <p class="chl-kicker">Chamber ${["I", "II", "III", "IV", "V", "VI"][i]} \xB7 ${esc(ch.name)}</p>
    <h2 class="chl-lead">${esc(ch.lead)}</h2>
    <p class="chl-intro">${esc(ch.intro)}</p>
    ${ctaRow(cta, ctx, B2)}
  </div></section>`;
}
__name(chamberHighlighter, "chamberHighlighter");
__name2(chamberHighlighter, "chamberHighlighter");
function homeMain(ctx) {
  const B2 = ctx.env.ASK_BASE, S = SEPARATORS(), chambers = CHAMBERS(B2);
  const hero = `<section class="hero"><div class="wrap">
    <p class="hero-kicker">Pinnacle<sup>&reg;</sup> ASK<sup>&trade;</sup> \xB7 ${ctx.tl("The Child Development Ko\u015Ba")}</p>
    <h1 class="hero-h1">Ask.</h1>
    <p class="hero-lede">Every parent has whispered the same question in the dark \u2014 <i>is my child okay?</i> This is the answer: the world's first open knowledge layer for childhood, coded to WHO standards, free to every family, every professional, and every AI on Earth.</p>
    <div class="hero-cta">
      <a class="hbtn hbtn-go" href="${ctx.L(B2 + "/abilityscore")}">Start free AbilityScore\xAE</a>
      <a class="hbtn hbtn-go" href="https://wa.me/${C.wa}">WhatsApp ${WAN2}</a>
      <a class="hbtn" href="${ctx.L(B2 + "/search")}">Search the Ko\u015Ba</a>
    </div>
    <p class="hero-links"><span>Most asked:</span>
      <a href="${ctx.L(B2 + "/lens/condition/speech-language-delay")}">Speech delay at 2</a>
      <a href="${ctx.L(B2 + "/lens/condition/autism")}">Signs of autism</a>
      <a href="${ctx.L(B2 + "/lens/intent/early_signs")}">Is this typical?</a>
      <a href="${ctx.L(B2 + "/lens/lifeskill/toilet")}">Toilet training</a>
      <a href="https://pinnacleblooms.org/centers">Find a centre</a>
      <a href="${C.mcp}">For AI agents</a>
    </p>
    <a class="hero-scroll" href="#why" aria-label="Scroll to explore">
      <span>53,000+ questions, answered</span>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
  </div></section>`;
  const connector = `<section class="connector" id="why"><div class="wrap">
    <p class="conn-quote">${S.open.quote}</p>
    <p class="conn-sub">${S.open.sub}</p>
    ${ctaRow(S.open.cta, ctx, B2)}
  </div></section>`;
  const body = chambers.map((ch, i) => chamberHighlighter(ch, i, ctx, B2) + ch.dims.map((d) => dimensionBlock(d, ctx)).join("")).join("");
  return hero + connector + body + separator(S.close, ctx, B2, "sep-close");
}
__name(homeMain, "homeMain");
__name2(homeMain, "homeMain");
var C2 = CONTACT;
var WAN3 = "+91\xA09100\xA0181\xA0181";
var cap = /* @__PURE__ */ __name2((s) => s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), "cap");
function heroBlock(ctx, { kicker, h1, lede, ctas = [], links = [], tags = [], tagsLabel = "In" }) {
  const cbtn = ctas.map((c) => `<a class="hbtn ${c.go ? "hbtn-go" : ""}" href="${c.href}">${esc(c.label)}</a>`).join("");
  const lhref = /* @__PURE__ */ __name2((r) => /^\/ask(\/|$)/.test(r) ? ctx.L(r) : r, "lhref");
  const lrow = links.length ? `<p class="hero-links"><span>Jump to:</span>${links.map((l) => `<a href="${lhref(l.href)}">${esc(l.label)}</a>`).join("")}</p>` : "";
  return `<section class="hero inner"><div class="wrap">
    <p class="hero-kicker">${esc(kicker)}</p>
    <h1 class="hero-h1 h1-inner">${esc(h1)}</h1>
    ${lede ? `<p class="hero-lede">${lede}</p>` : ""}
    ${tagStrip(ctx, tags, tagsLabel)}
    ${cbtn ? `<div class="hero-cta">${cbtn}</div>` : ""}
    ${lrow}
  </div></section>`;
}
__name(heroBlock, "heroBlock");
__name2(heroBlock, "heroBlock");
function tagStrip(ctx, tags, label, cls = "hero-tags") {
  tags = (tags || []).filter(Boolean);
  if (!tags.length) return "";
  const lhref = /* @__PURE__ */ __name2((r) => /^\/ask(\/|$)/.test(r) ? ctx.L(r) : r, "lhref");
  const chip = /* @__PURE__ */ __name2((t) => {
    const k = t.k ? `<span class="tag-k">${esc(t.k)}</span>` : "";
    const cls2 = `tag${t.lead ? " tag-lead" : ""}`;
    return t.href ? `<li><a class="${cls2}" href="${lhref(t.href)}">${k}${esc(t.label)}</a></li>` : `<li><span class="${cls2}">${k}${esc(t.label)}</span></li>`;
  }, "chip");
  return `<ul class="${cls}"${label ? ` aria-label="${esc(label)}"` : ""}>${tags.map(chip).join("")}</ul>`;
}
__name(tagStrip, "tagStrip");
__name2(tagStrip, "tagStrip");
function connectorBlock(ctx, { quote, sub, cta }, B2) {
  return `<section class="connector"><div class="wrap">
    <p class="conn-quote">${quote}</p>${sub ? `<p class="conn-sub">${sub}</p>` : ""}
    ${cta ? ctaRow(cta, ctx, B2) : ""}
  </div></section>`;
}
__name(connectorBlock, "connectorBlock");
__name2(connectorBlock, "connectorBlock");
function highlighterBlock(ctx, { kicker, lead, intro, cta }, B2) {
  return `<section class="chl"><div class="wrap">
    ${kicker ? `<p class="chl-kicker">${esc(kicker)}</p>` : ""}
    <h2 class="chl-lead">${esc(lead)}</h2>
    ${intro ? `<p class="chl-intro">${intro}</p>` : ""}
    ${cta ? ctaRow(cta, ctx, B2) : ""}
  </div></section>`;
}
__name(highlighterBlock, "highlighterBlock");
__name2(highlighterBlock, "highlighterBlock");
function universalPage(ctx, spec) {
  const B2 = ctx.env.ASK_BASE;
  let out = heroBlock(ctx, spec.hero);
  if (spec.connector) out += connectorBlock(ctx, spec.connector, B2);
  for (const sec of spec.sections || []) {
    if (sec.hl) out += highlighterBlock(ctx, sec.hl, B2);
    for (const blk of sec.blocks || []) out += dimensionBlock(blk, ctx);
  }
  if (spec.closing) out += separator(spec.closing, ctx, B2, "sep-close");
  return out;
}
__name(universalPage, "universalPage");
__name2(universalPage, "universalPage");
var DIMS = {
  conditions: { kind: "condition", title: "Conditions", chamber: "The Concern", blurb: "Every developmental condition of childhood, explained for a parent and coded to WHO ICD-11." },
  skills: { kind: "skill", title: "Skills", chamber: "The Child", blurb: "The developmental skills every child builds \u2014 milestones, what to watch for, and how to help." },
  abilities: { kind: "ability", title: "Abilities", chamber: "The Child", blurb: "The deeper capacities under the skills \u2014 the abilities AbilityScore\xAE measures." },
  domains: { kind: "domain", title: "Domains", chamber: "The Child", blurb: "The seven WHO-aligned domains of development a clinician thinks in." },
  ages: { kind: "age", title: "Ages & stages", chamber: "The Child", blurb: "What's typical, month by month and year by year, newborn to 6\u20137 years." },
  "life-skills": { kind: "lifeskill", title: "Life skills", chamber: "The Child", blurb: "The skills that make a life independent \u2014 toileting, dressing, feeding, safety." },
  assessments: { kind: "assessment", title: "Assessments", chamber: "The Measure", blurb: "The screens and scales clinicians trust, explained \u2014 what each looks for and when." },
  readiness: { kind: "readiness", title: "Readiness", chamber: "The Measure", blurb: "Seven readiness indexes that answer the question parents truly ask: will my child be okay?" }
};
var SIBLINGS = {
  "The Concern": [["Conditions", "/conditions"], ["Behaviours", "/lens/phenomenon"], ["Myths", "/myths"]],
  "The Child": [["Skills", "/skills"], ["Abilities", "/abilities"], ["Domains", "/domains"], ["Ages & stages", "/ages"], ["Life skills", "/life-skills"]],
  "The Measure": [["Assessments", "/assessments"], ["AbilityScore\xAE", "/abilityscore"], ["Readiness", "/readiness"]]
};
var DIM_TAGS = {
  conditions: [["Behaviours", "/lens/phenomenon"], ["Myths", "/myths"], ["Assessments", "/assessments"], ["Readiness", "/readiness"], ["ICD-11", "/lens/icd11"]],
  skills: [["Abilities", "/abilities"], ["Domains", "/domains"], ["Ages & stages", "/ages"], ["Assessments", "/assessments"], ["Techniques", "/how-to"]],
  abilities: [["Skills", "/skills"], ["Domains", "/domains"], ["AbilityScore\xAE", "/abilityscore"], ["Assessments", "/assessments"]],
  domains: [["Skills", "/skills"], ["Abilities", "/abilities"], ["Readiness", "/readiness"], ["ICF", "/lens/icf"]],
  ages: [["Skills", "/skills"], ["Assessments", "/assessments"], ["Readiness", "/readiness"], ["Life skills", "/life-skills"]],
  "life-skills": [["Skills", "/skills"], ["Techniques", "/how-to"], ["Materials", "/materials"], ["Ages & stages", "/ages"]],
  assessments: [["AbilityScore\xAE", "/abilityscore"], ["Readiness", "/readiness"], ["Conditions", "/conditions"], ["ICF", "/lens/icf"]],
  readiness: [["AbilityScore\xAE", "/abilityscore"], ["Assessments", "/assessments"], ["Domains", "/domains"], ["Conditions", "/conditions"]]
};
var TOOLS = {
  abilityscore: {
    title: "AbilityScore\xAE",
    kicker: "The Measure \xB7 Tool",
    lede: "The one private, clinician-administered measure of a child's development on a 0\u20131000 scale \u2014 validated (r=0.91), patent-filed, free to begin.",
    quote: "You cannot help what you cannot see.",
    sub: "AbilityScore\xAE turns worry into a number, and a number into a plan \u2014 validated at r=0.91 against Vineland-3, CARS-2 and Bayley-4.",
    doors: [["What AbilityScore\xAE is", "/abilityscore"], ["Start free", "/abilityscore"], ["The seven readiness indexes", "/readiness"], ["Band 0\u2013200", "/lens/score_band/as_000_200"], ["Band 400\u2013600", "/lens/score_band/as_400_600"], ["Band 800\u20131000", "/lens/score_band/as_800_1000"], ["How it's validated", "/abilityscore"], ["For clinicians", "/lens/stakeholder"]],
    cta: "abilityscore"
  },
  "how-to": {
    title: "Techniques",
    kicker: "The Path \xB7 Tool",
    lede: "3,799 step-by-step techniques a parent can run at home tonight \u2014 activities, exercises and routines drawn from real therapy practice.",
    quote: "Every answer ends in something you can do.",
    sub: "From a first-words game to a calming routine \u2014 practical, evidence-grounded, and free.",
    doors: [["Speech-at-home activities", "/how-to"], ["Pencil grip & writing", "/how-to"], ["Joint-attention games", "/how-to"], ["Sensory-calming routines", "/how-to"], ["Toilet-training steps", "/lens/lifeskill/toilet"], ["Visual routine charts", "/materials"], ["Feeding & textures", "/how-to"], ["Sleep routines", "/how-to"]],
    cta: "centre"
  },
  materials: {
    title: "Materials",
    kicker: "The Path \xB7 Tool",
    lede: "The toys, charts, cards and printables that make practice stick \u2014 chosen by therapists, matched to the skill and the age.",
    quote: "The right tool turns practice into progress.",
    sub: "Therapist-chosen materials for every skill and stage.",
    doors: [["Best toys: speech delay", "/materials"], ["Visual schedules", "/materials"], ["Flashcards & PECS", "/materials"], ["Fine-motor kits", "/materials"], ["Emotion cards", "/materials"], ["Printables library", "/materials"], ["Sensory tools", "/materials"], ["AAC starters", "/materials"]],
    cta: "centre"
  },
  myths: {
    title: "Myths",
    kicker: "The Concern \xB7 Tool",
    lede: "The half-truths that delay help \u2014 set straight against WHO, CDC and the published evidence.",
    quote: "Worry is not a diagnosis. Clarity is a right.",
    sub: "Bust the myth, keep the calm, act early when it matters.",
    doors: [["Do late talkers catch up?", "/myths"], ["Do screens cause autism?", "/myths"], ["Should we wait and watch?", "/myths"], ["Vaccines & autism", "/myths"], ["Will they grow out of it?", "/myths"], ["Late-talker vs autism", "/compare"], ["Is it just shyness?", "/myths"], ["Bilingual homes & speech", "/myths"]],
    cta: "abilityscore"
  },
  compare: {
    title: "Compare",
    kicker: "The Concern \xB7 Tool",
    lede: "Side-by-side answers to the comparisons families ask \u2014 so you know what you're actually looking at.",
    quote: "Two words apart can be a world apart.",
    sub: "Clear, careful distinctions \u2014 never to label, always to clarify.",
    doors: [["Late-talker vs autism", "/compare"], ["Autism vs ADHD", "/compare"], ["Speech delay vs language disorder", "/compare"], ["Shyness vs social anxiety", "/compare"], ["Sensory vs behaviour", "/compare"], ["GDD vs intellectual disability", "/compare"]],
    cta: "talk"
  }
};
function dimensionPage(ctx, slug) {
  const B2 = ctx.env.ASK_BASE, d = DIMS[slug];
  if (!d) return null;
  const all2 = (V[d.kind] || []).map(([key, label]) => ({ label, route: val(d.kind, key) }));
  const n = ctx.counts && ctx.counts[d.kind];
  const sibs = (SIBLINGS[d.chamber] || []).map(([label, route]) => ({ label, route: B2 + route }));
  const O = ctx.env.CANONICAL_ORIGIN, dimUrl = ctx.canonical || ctx.L(B2 + "/" + slug);
  const conn = DIM_TAGS[slug] || [];
  const tags = [{ k: "Chamber", label: d.chamber, lead: true }, ...conn.map(([label, route]) => ({ label, href: B2 + route }))];
  if (ctx.pageSchema) {
    ctx.pageSchema.push(breadcrumbLD([{ name: "Ask Pinnacle", url: ctx.L(B2) }, { name: d.title, url: ctx.L(B2 + "/" + slug) }]));
    ctx.pageSchema.push({ "@context": "https://schema.org", "@graph": [{
      "@type": ["CollectionPage", "MedicalWebPage"],
      "@id": dimUrl + "#collection",
      url: dimUrl,
      name: d.title,
      headline: `${d.title} in Child Development`,
      description: d.blurb,
      inLanguage: ctx.lang,
      isPartOf: { "@id": `${O}${B2}#website` },
      publisher: { "@id": `${O}/#org` },
      about: { "@type": "Thing", name: d.title },
      keywords: [d.chamber, ...conn.map((t) => t[0])].join(", "),
      significantLink: conn.map((t) => O + B2 + t[1])
    }] });
  }
  return {
    meta: { title: `${d.title} in Child Development \u2014 Ask Pinnacle`, desc: `${d.blurb} The open Child Development Ko\u015Ba, coded to WHO standards.` },
    spec: {
      hero: {
        kicker: `${d.chamber} \xB7 Dimension`,
        h1: d.title,
        lede: d.blurb,
        tags,
        tagsLabel: "This dimension connects to",
        ctas: [{ label: "Start free AbilityScore\xAE", href: ctx.L(B2 + "/abilityscore"), go: true }, { label: `WhatsApp ${WAN3}`, href: `https://wa.me/${C2.wa}`, go: true }, { label: "Search the Ko\u015Ba", href: ctx.L(B2 + "/search") }]
      },
      connector: {
        quote: `Every ${d.title.toLowerCase()} here is a doorway.`,
        sub: `Each tile opens a hub of plain-language, evidence-grounded answers \u2014 coded to WHO standards, written for parents and the professionals who serve them.${n ? ` ${n} in this dimension.` : ""}`,
        cta: "abilityscore"
      },
      sections: [
        { blocks: [{ kind: d.kind, title: `All ${d.title.toLowerCase()}`, idx: B2 + "/" + slug, blurb: `The complete category-grid \u2014 every entry in ${d.title}, each a hub of answers.`, doors: all2 }] },
        {
          hl: { kicker: d.chamber, lead: "Explore the rest of this chamber.", intro: "The same architecture threads every dimension \u2014 choose where to go next.", cta: "talk" },
          blocks: [{ title: `More in ${d.chamber}`, idx: B2 + "/", blurb: "Sibling dimensions in this chamber of childhood.", doors: sibs }]
        }
      ],
      closing: { quote: "Because every child deserves a wonderful life.", sub: "Free to read, free to cite, open to every AI \u2014 under CC-BY. Coded to WHO ICD-11 &amp; ICF.", cta: "all" }
    }
  };
}
__name(dimensionPage, "dimensionPage");
__name2(dimensionPage, "dimensionPage");
function lensIndexPage(ctx, kind) {
  const B2 = ctx.env.ASK_BASE;
  if (!V[kind]) return null;
  const all2 = (V[kind] || []).map(([key, label]) => ({ label, route: val(kind, key) }));
  const n = ctx.counts && ctx.counts[kind], pretty = kind.replace(/_/g, " ");
  if (ctx.pageSchema) ctx.pageSchema.push(breadcrumbLD([{ name: "Ask Pinnacle", url: ctx.L(B2) }, { name: "Browse by " + pretty, url: ctx.L(lensIdx(kind)) }]));
  return {
    meta: { title: `Browse by ${pretty} \u2014 Ask Pinnacle`, desc: `Every answer in the Ko\u015Ba, re-sorted by ${pretty}. Coded to WHO standards, open to every AI.` },
    spec: {
      hero: {
        kicker: "Vantage point",
        h1: `Browse by ${pretty}`,
        lede: `Every answer in the Ko\u015Ba, re-sorted by ${pretty} \u2014 a different way into the same evidence.`,
        ctas: [{ label: "Start free AbilityScore\xAE", href: ctx.L(B2 + "/abilityscore"), go: true }, { label: "Search the Ko\u015Ba", href: ctx.L(B2 + "/search") }]
      },
      connector: { quote: `One Ko\u015Ba, many doorways.`, sub: `The vantage points let a parent, a clinician, a teacher and an AI each enter from where they stand.${n ? ` ${n} values on this lens.` : ""}`, cta: "primary" },
      sections: [{ blocks: [{ kind, title: `All ${pretty}`, idx: lensIdx(kind), blurb: `Every value on the ${pretty} lens.`, doors: all2 }] }],
      closing: { quote: "Coded to the world.", sub: "WHO ICD-11 &amp; ICF, UN SDGs, Govt. of India programmes \u2014 one shared truth.", cta: "all" }
    }
  };
}
__name(lensIndexPage, "lensIndexPage");
__name2(lensIndexPage, "lensIndexPage");
function lensValuePage(ctx, kind, value) {
  const B2 = ctx.env.ASK_BASE;
  const row = (V[kind] || []).find(([key]) => key === value);
  const label = row ? row[1] : cap(value);
  const sib = (V[kind] || []).filter(([key]) => key !== value).slice(0, 12).map(([key, l]) => ({ label: l, route: val(kind, key) }));
  if (ctx.pageSchema) ctx.pageSchema.push(breadcrumbLD([{ name: "Ask Pinnacle", url: ctx.L(B2) }, { name: "Browse by " + kind.replace(/_/g, " "), url: ctx.L(lensIdx(kind)) }, { name: label, url: ctx.canonical || ctx.L(val(kind, value)) }]));
  const lensPretty = cap(kind.replace(/_/g, " ")), hubTags = [{ k: "Lens", label: lensPretty, href: lensIdx(kind), lead: true }, ...sib.slice(0, 6).map((x) => ({ label: x.label, href: x.route }))];
  if (ctx.pageSchema) {
    const O = ctx.env.CANONICAL_ORIGIN, hubUrl = ctx.canonical || ctx.L(val(kind, value));
    ctx.pageSchema.push({ "@context": "https://schema.org", "@graph": [{
      "@type": ["CollectionPage", "MedicalWebPage"],
      "@id": hubUrl + "#collection",
      url: hubUrl,
      name: label,
      description: `Everything Ask Pinnacle holds on ${label}.`,
      inLanguage: ctx.lang,
      isPartOf: { "@id": `${O}${B2}#website` },
      publisher: { "@id": `${O}/#org` },
      about: { "@type": "Thing", name: label },
      keywords: [lensPretty, ...sib.slice(0, 6).map((x) => x.label)].join(", "),
      significantLink: sib.slice(0, 8).map((x) => O + x.route)
    }] });
  }
  const ways = [
    { label: "What it is", route: B2 + "/search?q=" + encodeURIComponent(label) },
    { label: "Early signs", route: B2 + "/lens/intent/early_signs" },
    { label: "At home, tonight", route: B2 + "/how-to" },
    { label: "Which therapy helps", route: B2 + "/lens/route" },
    { label: "Assess it", route: B2 + "/assessments" },
    { label: "Talk to a team", route: `https://wa.me/${C2.wa}` }
  ];
  return {
    meta: { title: `${label} \u2014 Ask Pinnacle`, desc: `Everything Ask Pinnacle holds on ${label} \u2014 plain language, coded to WHO standards, with a clear path to help.` },
    spec: {
      hero: {
        kicker: `${kind.replace(/_/g, " ")} \xB7 Hub`,
        h1: label,
        lede: `Everything Ask Pinnacle holds on <b>${esc(label)}</b> \u2014 in plain language, coded to WHO standards, with a clear path to help.`,
        tags: hubTags,
        tagsLabel: "Related in this lens",
        ctas: [{ label: "Start free AbilityScore\xAE", href: ctx.L(B2 + "/abilityscore"), go: true }, { label: `WhatsApp ${WAN3}`, href: `https://wa.me/${C2.wa}`, go: true }, { label: "Find a centre", href: "https://pinnacleblooms.org/centers" }],
        links: ways.slice(0, 5).map((w) => ({ label: w.label, href: w.route }))
      },
      connector: { quote: `Start where the worry is. Leave with a plan.`, sub: `This hub gathers every question families ask about ${esc(label)} \u2014 answered to bring clarity, never to alarm.`, cta: "abilityscore" },
      sections: [
        { blocks: [{ title: "Ways in", idx: ctx.L(B2 + "/search?q=" + encodeURIComponent(label)), blurb: "The questions families ask first \u2014 each opens an answer.", doors: ways }] },
        ...sib.length ? [{
          hl: { kicker: "Keep exploring", lead: `More across ${kind.replace(/_/g, " ")}.`, intro: "Related doorways in the same vantage point.", cta: "talk" },
          blocks: [{ title: `Related ${kind.replace(/_/g, " ")}`, idx: lensIdx(kind), blurb: "", doors: sib }]
        }] : []
      ],
      closing: { quote: "Because every child deserves a wonderful life.", sub: "Open, evidence-grounded, citable by any AI \u2014 under CC-BY.", cta: "all" }
    }
  };
}
__name(lensValuePage, "lensValuePage");
__name2(lensValuePage, "lensValuePage");
function entityHubPage(ctx, slug) {
  const B2 = ctx.env.ASK_BASE, label = cap(slug);
  const spine = [
    { label: "What it is", route: B2 + "/search?q=" + encodeURIComponent(label) },
    { label: "Why it happens", route: B2 + "/lens/intent/definition" },
    { label: "Early signs", route: B2 + "/lens/intent/early_signs" },
    { label: "Is this typical for the age?", route: B2 + "/ages" },
    { label: "How it's assessed", route: B2 + "/assessments" },
    { label: "Which therapy helps", route: B2 + "/lens/route" },
    { label: "What to do at home", route: B2 + "/how-to" },
    { label: "The outlook", route: B2 + "/readiness" }
  ];
  const O = ctx.env.CANONICAL_ORIGIN, entUrl = ctx.canonical || ctx.L(B2 + "/" + slug);
  const entTags = [{ k: "Topic", label, lead: true }, { label: "Conditions", href: B2 + "/conditions" }, { label: "Assessments", href: B2 + "/assessments" }, { label: "Therapies", href: B2 + "/lens/route" }, { label: "Ages & stages", href: B2 + "/ages" }, { label: "Readiness", href: B2 + "/readiness" }];
  if (ctx.pageSchema) {
    ctx.pageSchema.push(breadcrumbLD([{ name: "Ask Pinnacle", url: ctx.L(B2) }, { name: label, url: entUrl }]));
    ctx.pageSchema.push({ "@context": "https://schema.org", "@graph": [{
      "@type": ["CollectionPage", "MedicalWebPage"],
      "@id": entUrl + "#collection",
      url: entUrl,
      name: label,
      description: `The complete picture of ${label}.`,
      inLanguage: ctx.lang,
      isPartOf: { "@id": `${O}${B2}#website` },
      publisher: { "@id": `${O}/#org` },
      about: { "@type": "Thing", name: label },
      keywords: [label, "Conditions", "Assessments", "Therapies", "Ages & stages", "Readiness"].join(", "),
      significantLink: [`${O}${B2}/conditions`, `${O}${B2}/assessments`, `${O}${B2}/lens/route`, `${O}${B2}/ages`, `${O}${B2}/readiness`]
    }] });
  }
  return {
    meta: { title: `${label} \u2014 Parent Questions \xB7 Ask Pinnacle`, desc: `The complete picture of ${label} \u2014 what it is, how it's measured, and the path forward, coded to WHO ICD-11 & ICF.` },
    spec: {
      hero: {
        kicker: "Entity hub",
        tags: entTags,
        tagsLabel: "Explore",
        h1: label,
        lede: `The complete picture of <b>${esc(label)}</b> \u2014 what it is, how it's measured, and the path forward, coded to WHO ICD-11 &amp; ICF.`,
        ctas: [{ label: "Start free AbilityScore\xAE", href: ctx.L(B2 + "/abilityscore"), go: true }, { label: `WhatsApp ${WAN3}`, href: `https://wa.me/${C2.wa}`, go: true }, { label: "Find a centre", href: "https://pinnacleblooms.org/centers" }]
      },
      connector: { quote: `From first worry to full independence \u2014 the whole journey, in one place.`, sub: `Built across 70+ centres and 25 million+ therapy sessions, opened to every parent and professional on Earth.`, cta: "centre" },
      sections: [{ blocks: [{ title: "The journey", idx: ctx.L(B2 + "/search?q=" + encodeURIComponent(label)), blurb: "The questions every family asks, in the order they ask them.", doors: spine }] }],
      closing: { quote: "Population-scale. Sovereign-grade. Open to all.", sub: "Coded to WHO, aligned with UN SDGs, trusted across Govt. of India programmes.", cta: "all" }
    }
  };
}
__name(entityHubPage, "entityHubPage");
__name2(entityHubPage, "entityHubPage");
function toolPage(ctx, key) {
  const B2 = ctx.env.ASK_BASE, t = TOOLS[key];
  if (!t) return null;
  const doors = t.doors.map(([label, route]) => ({ label, route: B2 + route }));
  if (ctx.pageSchema) ctx.pageSchema.push(breadcrumbLD([{ name: "Ask Pinnacle", url: ctx.L(B2) }, { name: t.title, url: ctx.L(B2 + "/" + key) }]));
  return {
    meta: { title: `${t.title} \u2014 Child Development \xB7 Ask Pinnacle`, desc: t.lede.replace(/<[^>]+>/g, "") },
    spec: {
      hero: {
        kicker: t.kicker,
        h1: t.title,
        lede: t.lede,
        ctas: [{ label: "Start free AbilityScore\xAE", href: ctx.L(B2 + "/abilityscore"), go: true }, { label: `WhatsApp ${WAN3}`, href: `https://wa.me/${C2.wa}`, go: true }, { label: "Find a centre", href: "https://pinnacleblooms.org/centers" }]
      },
      connector: { quote: t.quote, sub: t.sub, cta: t.cta },
      sections: [{ blocks: [{ title: t.title, idx: ctx.L(B2 + "/" + key), blurb: "", doors }] }],
      closing: { quote: "Because every child deserves a wonderful life.", sub: "Open, evidence-grounded, citable by any AI \u2014 under CC-BY.", cta: "all" }
    }
  };
}
__name(toolPage, "toolPage");
__name2(toolPage, "toolPage");
// Inserted into the existing Ask Worker; uses its shell and escaping helpers.
async function searchResultsResponse(ctx, url) {
  const query = (url.searchParams.get('q') || '').trim().slice(0, 200);
  ctx.title = 'Search Ask Pinnacle | Child development answers';
  ctx.desc = 'Find published answers about speech, development, everyday routines and therapies from Ask Pinnacle.';
  ctx.canonical = ctx.env.CANONICAL_ORIGIN + ctx.env.ASK_BASE + '/search';
  ctx.path = ctx.canonical;
  ctx.noindex = true;
  ctx.showAboutFaq = false;
  ctx.pageSchema = [];
  let rows = [], failed = false;
  if (query.length >= 2) {
    try {
      const data = await checkedAskJson(ctx.env, 'rpc/ask_public_search', { p_q: query, p_k: 10 });
      if (!data || !Array.isArray(data.results)) throw new Error('Invalid search response');
      rows = data.results.filter(row => typeof row.slug === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(row.slug));
    } catch { failed = true; }
  }
  const form = `<form role="search" method="get" action="${attr(ctx.canonical)}" class="ask-search-form">
    <label for="ask-query">Search a topic or question</label>
    <div><input id="ask-query" name="q" type="search" maxlength="200" minlength="2" value="${attr(query)}" placeholder="For example, speech delay or everyday routines" required aria-describedby="ask-search-help"><button type="submit">Search answers</button></div>
    <p id="ask-search-help">Use a topic or general question. Keep names and contact details out of your search.</p></form>`;
  const excerpt = text => text.length > 380 ? text.slice(0, 380).replace(/\s+\S*$/, '') + '…' : text;
  const cards = rows.map(row => `<li><article><h2><a href="${attr(ctx.env.CANONICAL_ORIGIN + ctx.env.ASK_BASE + '/' + row.slug)}"${row.lang ? ' lang="' + attr(row.lang) + '"' : ''}>${esc(row.title || row.slug)}</a></h2><p>${esc(excerpt(row.summary || ''))}</p><a class="ask-read-answer" href="${attr(ctx.env.CANONICAL_ORIGIN + ctx.env.ASK_BASE + '/' + row.slug)}">Read the answer <span aria-hidden="true">→</span></a></article></li>`).join('');
  const state = failed ? '<p role="alert">Search is temporarily unavailable. Please try again, or browse the topics below.</p>'
    : query.length < 2 ? '<p>Enter at least two characters to find published answers.</p>'
    : rows.length ? `<p class="ask-result-count">${rows.length} relevant answers for <strong>${esc(query)}</strong></p><ol class="ask-search-results">${cards}</ol>`
    : `<h2>No published answers matched “${esc(query)}”.</h2><p>Try a shorter phrase such as speech delay, eating, sleep or school readiness.</p>`;
  ctx.main = `<style>.ask-search-page{max-width:960px;margin:auto;padding:40px 20px 64px;color:#182e56}.ask-search-page h1{font-size:clamp(32px,5vw,48px);line-height:1.15}.ask-search-form{margin:24px 0 32px}.ask-search-form label{display:block;font-weight:700;font-size:18px;margin-bottom:10px}.ask-search-form>div{display:flex;gap:12px}.ask-search-form input{min-width:0;flex:1;font:inherit;font-size:18px;padding:14px;border:2px solid #64748b;border-radius:10px;background:#fff;color:#182e56}.ask-search-form button{border:0;border-radius:10px;padding:14px 22px;background:#8b2688;color:#fff;font:inherit;font-weight:700;cursor:pointer;min-height:48px}.ask-search-form input:focus-visible,.ask-search-form button:focus-visible,.ask-search-page a:focus-visible{outline:3px solid #007f85;outline-offset:4px}.ask-search-form p{font-size:15px;color:#46566b}.ask-search-results{list-style:none;padding:0;display:grid;gap:18px}.ask-search-results li{padding:22px;border:1px solid #dce3ec;border-radius:16px;background:#fff}.ask-search-results h2{margin:0 0 12px;font-size:23px;line-height:1.3}.ask-search-page p{line-height:1.6}.ask-search-page a{color:#76227e;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}.ask-read-answer{font-weight:700}.ask-search-browse{display:flex;flex-wrap:wrap;gap:18px;margin-top:30px}@media(max-width:520px){.ask-search-form>div{flex-direction:column}.ask-search-results li{padding:18px}.ask-search-results h2{font-size:21px}}</style>
    <section class="ask-search-page"><p class="kicker">Ask Pinnacle</p><h1>Find an answer. Understand your next step.</h1><p>Explore published child-development guidance for families, teachers and professionals.</p>${form}${state}<nav class="ask-search-browse" aria-label="Browse Ask topics"><a href="${attr(ctx.env.ASK_BASE + '/conditions')}">Browse conditions</a><a href="${attr(ctx.env.ASK_BASE + '/skills')}">Browse skills</a><a href="${attr(ctx.env.ASK_BASE + '/ages')}">Ages and stages</a><a href="tel:+919100181181">Call 9100 181 181</a></nav></section>`;
  const page = shell(ctx).replace('content="noindex, nofollow"', 'content="noindex, follow"');
  const response = html(page, false, failed ? 503 : 200);
  response.headers.set('cache-control', 'private, no-store');
  response.headers.set('x-robots-tag', 'noindex, follow');
  response.headers.set('referrer-policy', 'no-referrer');
  response.headers.set('x-pinnacle-private-search', '1');
  if (failed) response.headers.set('retry-after', '60');
  return response;
}

function searchPage(ctx) {
  const B2 = ctx.env.ASK_BASE;
  const popular = [
    ["Speech delay at 2", "/lens/condition/speech-delay"],
    ["Signs of autism in toddlers", "/lens/condition/autism"],
    ["18-month-old not talking", "/ages"],
    ["No eye contact", "/skills"],
    ["Can't sit still", "/lens/phenomenon"],
    ["Toilet training", "/lens/lifeskill/toilet"],
    ["Best toys for speech delay", "/materials"],
    ["Pencil grip at 4", "/how-to"],
    ["Is it autism or ADHD?", "/compare"],
    ["ADHD", "/lens/condition/adhd"],
    ["Down syndrome", "/lens/condition/down-syndrome"],
    ["GDD", "/lens/condition/gdd"]
  ].map(([label, route]) => ({ label, route: B2 + route }));
  if (ctx.pageSchema) ctx.pageSchema.push(breadcrumbLD([{ name: "Ask Pinnacle", url: ctx.L(B2) }, { name: "Search", url: ctx.L(B2 + "/search") }]));
  const vantage = [["Conditions", "/conditions"], ["Skills", "/skills"], ["Abilities", "/abilities"], ["Ages & stages", "/ages"], ["Assessments", "/assessments"], ["Therapies", "/lens/route"], ["Life skills", "/life-skills"], ["People & roles", "/lens/stakeholder"]].map(([label, route]) => ({ label, route: B2 + route }));
  return {
    meta: { title: "Search the Child Development Ko\u015Ba \u2014 Ask Pinnacle", desc: "Search the open Child Development Ko\u015Ba \u2014 every condition, skill, milestone, behaviour and therapy of childhood." },
    spec: {
      hero: {
        kicker: "The whole Ko\u015Ba",
        h1: "Search.",
        lede: "Ask anything about a child's development \u2014 every condition, skill, milestone, behaviour and therapy, coded to WHO standards and open to all.",
        ctas: [{ label: "Ask on WhatsApp", href: `https://wa.me/${C2.wa}`, go: true }, { label: "Ask any AI (MCP)", href: C2.mcp }]
      },
      connector: { quote: `Don't know the word for it? Just describe it.`, sub: `The Ko\u015Ba is built from 11+ lakh real questions families actually ask \u2014 in their own words.`, cta: "abilityscore" },
      sections: [
        { blocks: [{ title: "Most asked", idx: ctx.L(B2 + "/conditions"), blurb: "What families search for first.", doors: popular }] },
        {
          hl: { kicker: "Browse by vantage point", lead: "Or enter from where you stand.", intro: "The same evidence, sorted the way you think.", cta: "primary" },
          blocks: [{ title: "Vantage points", idx: ctx.L(B2 + "/"), blurb: "", doors: vantage }]
        }
      ],
      closing: { quote: "Because every child deserves a wonderful life.", sub: "Open, evidence-grounded, citable by any AI \u2014 under CC-BY. Coded to WHO ICD-11 &amp; ICF.", cta: "all" }
    }
  };
}
__name(searchPage, "searchPage");
__name2(searchPage, "searchPage");
function resolveArchetype(rel) {
  if (rel === "/search") return { kind: "search" };
  const seg = rel.replace(/^\//, "").split("/").filter(Boolean);
  if (seg.length === 1) {
    if (DIMS[seg[0]]) return { kind: "dimension", slug: seg[0] };
    if (TOOLS[seg[0]]) return { kind: "tool", key: seg[0] };
    return { kind: "entity", slug: seg[0] };
  }
  if (seg[0] === "lens") {
    const k = seg[1];
    if (!k || !V[k]) return null;
    if (seg.length === 2) return { kind: "lensIndex", k };
    return { kind: "lensValue", k, v: seg.slice(2).join("/") };
  }
  return null;
}
__name(resolveArchetype, "resolveArchetype");
__name2(resolveArchetype, "resolveArchetype");
var ARCHIVO_WOFF2_B64 = "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";
var TE_SERIF700 = "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";
var TE_SANS600 = "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";
var TE_SANS400 = "d09GMgABAAAAAIuwABAAAAACSCgAAItNAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGoJiG4GCHhzNBgZgP1NUQVREAIFsEQgKhrBchZwJC4tOAAE2AiQDlxgEIAWEYgffSwwHW+z2kQWqY91+gHAJqlE3GQDX3abdWdHpbqDj9leE2DU8evSqbLaMyThmAhsHg9l8sE/+/////39LMpGxvKT2krQAADpAHnzV/bbpNINTmGAQJsIKqiMYaFp40FA7RxWN6N0xEEQL69GJccKMbhQGp06lFdebmMF0qoO4EdNocFD8wuTwwqmUZcRSCkoRUyAiOsxdQSku1gZ2a2FYZkmKbVKp39Udpk8aE74W9WugGEQFNerLBWaNKRUHlfM8tNJrzKlqDxe9NGpm1++KEgh0HnSM9BE0OBdKL0rHlriTs3V4Jo1nmqduoMa0VStVew3aYKaS2mqmHWZKQRiM0mPD8yleb/W5H22z7WjzK59Z61oRSk2vGTS/1St6P8Q9w3eot59Mh4RFvAUzbHZ1zvDUXn/OH9gg9sdWTf79RLho3ckSwmWRKwzlAte0b7nvFz0u91QZu1xWlIz9cXYycv6kvnNk6j/8z8/SPZNVQDk2p0bWyZP+I35tP7vvXQGegGR7Ei31kVJpKQv9dAnYCEh5hAoSKSraGKSBhWAgH4uwiZQ24FMCB/J0Pia59vpTH8FQB+Z7/D8wLvjOfTNfQPpJTN60SUybyLQObVsBI8AkzgBOZ4CZdRVNJRWzpE01rW/t1JnCkMGA4UN02H/k2JUbYhe4IH5Mrsg5V+fz76bB+v+JT+JcQ0LqvJSaU7EvSI2SNjVS9TWdb7u1di5UndjANiUuPgbMfaYpHjTb9gIzxIU3gGiCQnVoXR0cerpHV0sDYFnyaLVmsnngvQKArQYa/1pWOFXfkTkV1j23ReKhCidARzvrmh/n8oWws3N2n1AotgPC0ivkgLKUQ20vBxkcqLRU/1n5sxRl4nTDYlDASBGbtNun6jKkNNvUMsxdexsZ9tcBBp9i5UinzMuv+vv8w3jYdhmBx0PtBe2x/RRy/CxIqlwE+I859fLGbqyQnMmxHf2SC6RYhjjFqKTAIEV3gDn3uvOoh7/Y/GcHEqQJhJKHgWBotwadw++l5t14BiNt5GkyRyk5l56wBmN8J3e+8tm+cACcDJhCvc9ZxWXLaIaFRBbuev0hcBozRzzOYGYQwyGkHAnsGwJ5670f9iNzWiQaxC83Qh3S2vNLN+l9HEbAvDNCIDzGgEAZ2uP1vmbapH0zLyvkZc12t2jgI8u7qiC/ERwcnEBFO5Ag0ldYTZrzIbu32cT7IqokNxO6Sgm+dqb7ZcCzyithVawvBmATV5afEhX18+rsLXCKsPLbO0zl/f6fS7AsvblryAodOZGMIQNFjh2yDCTZ21gDr824AgBOZJEvXhGA/uOaAl9sy65jUOOMOPAGzmz21x6M5EFZDYDL7a3S3vz/NzVt/8UszA8q8SvCmTwyHVPNhXKo3ZQz7w8w8+fPiOAMuYsByBUX3CCQG4DlKlARABOYFCMdQqx2KWWqcU6Vu9zKReuuz6no3bnpQm4r1+5rX05Lqs1q53Ul5d73lTnsYQJYAAuD9q58tk7ar75vSimF9XvCwmBgAhjJZP51puuXdT6k50vJVwzR230hlEsAUl0F2CECy2dJBdkXkO0QgAPoFAj566Z2O3e6y1TAYcvcrR27d9oztluHscOYsSOO2QrbHJ6nLpT3P8lk6YBDWoXMNXT/TrKUKRawQFie/375v2wvft2qbonEvdbEJxxRgcOZH9ImR5UOZEdbyBOSEWP8kxOSkCOsHefn+qm91JLt70stOAi5yL40VhH1X0n3cpJl39hprT1Ju+vyJKXUQmtnoSSUrw7p2MGbEBQAYKB/GmuVhw1ivy2ZUG6xzF1NiO+ZoQ2PxEuQREMkRUlmCULREAmhEMkN+D73+9KpO2Btn8FEus89KBVur3pZBHpez/hJ85UGD4dU0CFOGx+aD5lwxqENI47xgPh9VT9XURCffum+raYuuyGn+U/eRgsgjbwv8ZzmlFKHVeA1Uk6v2y3LGN93OXtDu39h5VUK5lIa4dKUlUaVUzwUUJtJmRWaT/vIiQQRkfM76fvvnoqdgRnuaNFKRJQoUbIRETHb2jN6v9dqqEvrItnJE59xbHnDsX6/pr3PgFuIWyqDKEVNKeVwiRnGZs1NdnefuZBSkApF0X38v5/6ocWupKdfYz+IIDiDETfjXvPydw4QTBMAANMVGIUpC6jpeADNrxbQ9jUAWmvDINg6JBKBjo7AYAQxZo1gyw7BnhPEmQtCoECEoG6B+pItxByKQWxn5aDtqgJie2oCzbdWiAXUB1pUkyAW02jmiQSECoANwrALLMiNl4CgOdzHHMFoeTsBfd+p1LQKQnM8aTS3O43WfNNoL+oh0YEwkOh1O5yWOqnqPIxsWDUAvgDrCP4uS6aehw0wOmMfjOrjgqbYpajzUgpF0wwlY/23AgsCwCVAC9qzP6IJyCTjJzNMJlVtLnLOVMxkhiJhciizufjiMCUTBKgiAQCHQ+Se/NeFECgs8B6or/+9TIDrG8br+4xOb+qOJ2CLoeup/s6IAKUEJUsFEyK8DeojlSRFmgwAcv+NiYmTAEAQIUqM3JPY+cVnmqmDqcdUyJRq8pvH+8dNkzyTeJOgSbNJtYnPhGUiYkLf9M9Nv7s/UvESldcYzrf4Pj1jT/SoOhSLzYWl6g+GDnUbJQRVPBABTD4eGRrW8EV7VNnanXgBkc+/nZ8EdPUnUudpQhkKSSmIgB88oK6B1LlLmO05jVEM4Ds+/ul4D776E18CnduK58lZPMF9DKAGN4/sFcwG52NREuRZBZ4ArOgaAEQ+JCCe8tu9ILLdFJ2btMDditz5EfUZ4gmxNXORDjLwPe6h6NY70b3bokcHke56kq0/9XQXP/TIx4A+ekEIFwPpbvngfyTbVldYbVcSNcm3Eq0Sk9yhzQKUUILQ+osBn4GpmIGHGoYWBi832DOggBduFBYEAAPgBbAWrhstHvzg6/kNAlh3RD09R0BfjYbqFFtH6JHDzNAmBR5wHzagJJhYM++omMVhwzSCq5aBoEmic3M8rRRQQVn4h0wmJRoiO/HWQm0IpCKu900MFZ6GjqTXhSdlJMEWuh3q5kLHk2VDvfnZ49dGKPFhKMxZ7NP6GoZe/GXxIz9BNDf2NdtGYBESy74ABrIFAa0IxBvYx4NxGJqzJPfaRLOYPtco0MnPlFnaSVWPNm36g19BAKhw+0DtcxDUAReAOjHL7n7aGUDbWxVoXvPrGQNrBy38eWMbBO1Iw3F8s4M4XtLzpsUGoeLt4EKkz/TZSXH8AuT34AFiBKY5Zf2f5tyQvWX1ZdVpYFoDoXvewW7vFbWjDAXIRgZSTlc8pmPSQd1oUw1pXIWyS0VkaqIfLthggIrDJeCBqSlpqpS4gKQ2qgEyI5dyNh/O73OUML9MT3AEy3uIzxvwklW5BYF8L0VosnItbp7N1vjzo+S2o8DHj3iS9132ttxLpA9HqcJ36J4AfkFToIQG5a+vrN8RttUgYXBQ5AttvxQCjbLIdJ3HjrMI6RI+FM7shL8Av+2kqIDFUYq55PLBQZ68pTrbaGBJwsZJ3Ll08ijChfL1wGGH6gOuTssr+7EuYH7rGdBHvM872tu9zRu8yivbKzzn2YMf96AH3O9ON7vW5e1ZFzrbA90GWD7KudW0q/Ar1vjZIW1e5RVnHpe7Cj2bz6+3Q/+fQTc2XduA97q8bwV0aNWoDa8Ccfm9TopoJnzT7Y0FL7zreCJ5A2oUm2hZHJYn4cfMvQ8504nhNFtKx0OzvUftPSKvH/HuVIMKeP784k9r/0yhegOJ/nbl5AESndRhVCFJECrpVoLV4x6ul/ae1uyR6ZHZnmba06H0q+c9m8brcEkTLL+a1nhrbwt/ij8fd7v6AnPTa/Q2gKvF0YRHybuVKt3QpRiUA0U9z8RZSuutnqgjGlSvOrRWPqpRCoQPxklBoXLIJI1kEogtGu6PoCIuOhdmLHPua8MvjucaYQzpBnbtURBvyTZ9VV5hmx7xJRvZwDrejt31GitYxgLsxmxmyE1bmZHCeP0LH3goWZZoFyaA1+571cSyAOzlUNZy0AXjs3ooTRUxlPlcAaSaSOPHc5aaPgNGWy1doc/SRfq0zoymDvQBiRmirYM9MaYs2FBw43TbAm30hCwLWxyOmIib6N/lUzcCfC2HAWzWxwF1pa3UPdcm/UnAMsyvMf3+mMugwgU06WUN2+qmXqn3cuXa3Z0f6CWy5eWUY0sSt/sBNVV/AL6fDdHUtQx0j7OuiAud/Q/plmDWjOhSP8XCLtkWRIJQeMHVkQNt1YI/3eRqXR7MRwEwLcutm32QFrZV2bYFbuRQ1hKlqqSMrOkkrq4XpGskm3hAHSJGWaoE6eG0r/20TvTR3jpajCZ7rx7VYC9w1x0PraqPdsOSl5LlKFJnOvDoymLbTAsS43AkiE1FBAv6obXoWDSffWluPxJ68I/e6calmmjkT3+j0V/cNHf5U6b0jAXAlTpuAE4oi45gAJGanLN3uEaeHC2qqWR7cY88/gCt3u34kaQ6qWSlRHx+Ey7YSZEFn5TOJZcPDvKtJ6RKwhGX8HNxDodyHo4yLzsdUnbH006KfOuc3ghswX1/sELvfRFZE0FHXPOL2nKWOm/pzooOa5lM7ysdI+GZulzPHJV3F1t3Q71Be0VsO7teZ9cIailbXzQdPRvdaGpSSMII30seht1JFIfFbjszQ4YMmZl38JbqrGgsSdg44hJ+ToS8w6Gs+ZvQtgolYB0Z+/y+7dWOb1CK4jyopGAulcV48WzYqLTJXvjuHVx7Ap5tcvGeBy6pjHJ2bkg057LikE2CjrDnGdRw5hbE5dv7KOfmPFmRz8w5Ha+eEd5Qx7cPyHQOrw55fLg6PTh59g8G6nlQ4QyomnMfuJ7++U64vHSyEy57z3T+57E8ClUAzwE8geD+dlqAmmyI3ro4FuQAcq/1vNcSDQyMY3G5/hcwdjjpECyWDuFS6RCtIgrxe4EhOVQKh4SLxAR06dQWfg7NHEodGSGZCubiuiDEDq8IiorbKJwFPav8xIPJQVWk93/2z11P1Vvssu1m82f209bb/stNAzd1NqXNka3pmvpd0AmHeof9xfDcpu2yajT0KRH3AJt1lAw6BmX8+96uxLyuMRvDPM2m/DWZxYCTDN04vXK3E2Qqo2cRkvWq16X1JDv1ZCBtvRK4H1LENQc9GZWzxvzebPW4mk4SB66riEL5nRweD+VaiQqVt2RFqgI6jt6DGJ2357VZMYOejUyn0is6+eoeT2vrtwCQSAx5AEm1Sy8FNqUE0gHS5wjQF652u7asj9bvGfOH85fptmui1q5dVii+uD63vTesVRulDQFPMYmB9dzvUYMinAJ71cCgQ5guAD1GpE5qH4xrmwihIH3E9vFgajGm0jhkPj2pS1hY/J/wZktl2sINnPQfS290SNXlsyxfdcvW66c8v2EeLltEJNyMisTdTzJJb5NO3rsUY+lMOVOfMxdhus36+JmdIWaRgxHmkLNx5tFOy1lAe21mEfnb5gQUZIeZKMSJZqFwb0lH086g2HIxAx2JO/mOVlWVwzXU5KzamuhI4fW5qNgGXdKRhl1afLNd0fGSPFVabBvbGxg4X9DM+ebmz4+ycv5s289/lmw/cxvLnuO4XbLc8QCbQ+F1KDSxRVEadAJxsSB2a6NrNy6qUKAbLtg3AYyVz4nKAQVgPFDFrPZ56Hsd+lY5WSwKfYl1ZclHzEdchmVW8JFxSflvTF8HjRIniWSkv5I9aeTiqHTK0IwW0e5Fx6e6p030TxER/USSGHKoKykpnaSStB62M3KTX6dQynJNrruRu8rDSmNalTbyxrz1Va8h03753f3ppV6U5o+5OXOK0StxUeUsKopGzoQZB462x0+ixThYcTNiWhc76TbNmBqzZsCCTgpJac95N9x0y21VGjzM4zpPu55DQEaQnfoHDn+u46fb+OI5fnnZFLRYivW7lr7b7PbeaUWl51u7JRDfwOnrx/9lX+l33gPe+VcglpmiGkgfNgQt1gseR9GEjIJm2JkD+wcg9GbbZ4BgBC0GdiG8KGiGnblq/L9WI+SLeVIXctdKoLapdarnmkLmlaWbtc5mtefE0c0i9k+bQmzAaLd22hHgNge8bpV4DP6HsDEcPAhv3JRZ8RLE3N1NVKzFDVM9cy1LpP06LtGyShaDxbhlxPxry+Npx1uC0y39N2+yRtgzVeWIL/VfZi6EVulKhehFpm14vK1sAmRuEgAAAADE0oWsBjVgMskI3uEgVyfpRDXhonx9XXgGz6oDbMzr8LDlNuk44zYjInKkf3Kda3AA1NYQhx0EFNy2AA6Hw+FMUhaK7KuaAwDQAq3X2cjCSZP2Sx2hpMLagbqJV1oOAirTU5WM8koLaBjYTteYl/YWVZaDiiAlvInlIKBSe6oJ01akSigNDLNhFkURF6npPdXHnwZKwhRG0GKNcRtFLTIKmunsxcKYIAiCICiCQyxDM+zMNeHXRMRiGIZhk7PYrvO4RZYFw+rfvCigDY/cCVvrKgiLpummOz2Y0TRNn9NlrKKXn5Zm+Gb/vlPdrqB5a025REdjVC+aPORdtELKUKFKo3SdDHHUTzOIIYxGc04jwCLBU2Fj3Ok7x8Tn+J00ciKGjXQZMnNyIjvn3QUVLucGqYy5JbfdSXVfnedeeOm1t975oF2HLp+NGjNuyh8z/jdnPkv4a9lqxxmEeQS0SM6ogoTIkiMfxRqLISNbWbJiw547D8FChAoXNU2c72bAXWacZs2cp6ffbJJjyeu45LY7qtSqU5/7d1rI65hWpb2rI13kI9uf/GetBYFJ+QY+5qcvWHC5loaGIAiiIBSCIOg8Gg5nme3wkTWEe6yh2m/RToMhPdvmPXu83t47a31zIoDu1GkpfXGiBblPM4zOm8hqTwsEAABAARQAAM6DiasklSIIgnhBvCIIgiBe7r8gEvyKPumIRJo8PzkNRVTyvMNTGc8zRCeEQjiKG9Ml1VANP1Q/5NMZRt48NcrqD/r1Qj20wjgH8oS3k1i6SFnDM9ojfEJeg9kcjoZuv/WSX3x/eG0O7c2PTN6zYYgX0d2N425yQYrN701TN53ceHZsnc/iibn82/GV1PkiCcE1N4nJjlZLFnltxX8+T4QKTc/heg3l+vo9BqAJAEgMTan01/B2ff0eg4tJk2MQUhMfCdkRmlLRlDTwQTIB8PL2f0Fqw5wIEwEghuxPwyRIIkiTRSFPAZ3S8rko08RNN/AfoKyt48hpOhUgExNi4sJ8CREiSdpn0mJ8GfsdIOuQLy9OEgUngsqRilTXqqirw1w8sO0evn6Hx57Y6YWXdnut1R5vvPWvdh3cfV7mqdu89D7NW78BPsaM8zNlWoDfyw8yB/MQbDEy1AoCCGu8g6gyzoB9ZSEaRJe7HMSW/wNgf4WICQcqidehCIk5HCtpickl73hKKUmOFUtKyqlITS01J9JIAzuttKWnm67MDDKR1Wbd5Gapj7zsDVFwxFMubDuOonY6inO9lJLcrKc0b5s4V+jKcuGgp4KK2YVZdLhTmuKj5JdKl3ggIKOgkyD1VxZay8RroW452T2i24A7EmfXweZItGNtzeFozeGgOag3rTgSDgh3Db2UFVh4ePnW0FMrqNOpy8RlOnY8Ctax41EaO5YdExukEmWjyWI+e5fE2G5c45p9CnNeWJlirEFyKr0zsrsjR+TrKKiU1rI+hoUNo/JeaESzFy1G7V3RKd2d06tKfyccutNgMtW7ciJVMeu3P88B6tBqORxzBEfHuD3k+HxSMymtpFZacydsMbuJkyhamyGX5Pemhe2UZTl/54JU1OUurk1zndyYpzLPLbk9rUbRwaYeTutxI54w39gWz8KaNI/Py71OK9VWzxvqbW3v8sVdKLqTobdQ/zwDqqG2GMZIfpBRMkVN1/KL/Kb+cL6aybeXGYLFCDKLBGtROYPR1jw3pz9BrCW0LTbtk7iY7B05kY/iBIsyFRoMGTFhZitLVmzYc+BoO3ce8esLFiJ0DIdQURW98sQoB6nDe5ojVNxqcywmHgmLE9dL2maxtyp9VcbmZebTrE3KRqBymM/jnyqYSWGVbtfZacqp87O5EFOBi7lk0xubdXOrblG3N+9O/stVm1SHQNVDqYaZPCSPu4ufbtfzbaVlqNeTtCpvq7yP+aBqX7uOWlf3ccEC9lTWc6pk3LnCf5vvLsBXHJFfN3xlGtZzGJZcpmE9h2HJZRqWHIYld3TsiGRydOyI/GL7Up0HfUZTj2e8oDCeTZvfftpXJEka2BNey4lO07xhitPUbjKxM0ua1uqjSr12e0JrOZXV46imTE5iS+6yeJCdtgABACAJAACAJAAAAADutVHZucrRLfMwZVWdaLrakxWqp4LSaqrurfIBuWri9y4JCfjO/YsMJPOu1IgDtZ8IHaQ1WYF/IldJCe+ZPM60aZgyikV2qjROE2VPdno0mxzGVtmxlGMPfreOPxRvluRgkuPNwWwEDfOYkHnTSbgc6nTWLYNalQoZhBBCCCGEEEIIIUQhisJKGYyAG/QOfBpYBdkXhwD0Gyfh+RjEWNcqEP+arkg23GmtoZc0QJ5GTsuClEin5xfQCbeGNiyUqTJTZaZrxrW2oQ6MZe3XPDrP5iivPFZrDA2Ro3ww7MRZbyV5SCA4305DMph1gTlEoqMt0x/jT08GjBOqlgFBOnrHVu/5XndrbDpqwYhBZRhgzvWZM/G5rGqq6RokCN/V6rboDI+JlWaFKa9O6a1wVr5OptoUz+rDarwy5pVUoirgGmtcVf2x7yokbRqqqpnDzCkiYXV02bhXsJ/zJdpM4pC8W1j1kORHuFIA4kW6IOERfuuLLcHhcDhcc1Lc5Qd1M0lcYvMEgCpn3SnWCfODqR+sOQymDhUw312teZGzFFP9YB6lAYDgHwA8YC0kLCIqJi4hqUy5FAAQ7AYAAVt4+G7BmGQ0R8KmD4f/v24VL7jUcHlcEjcH+uYkMV1ecptXWMQMxrGXDUwQpQESQTSogPOPXxgAwi32cQNlOIVERKMFKfhhYS8vovLHuZvv5nF5JOexlj+P+SPzBvMd5g7mKLOXmWAamDTwKfgleBzcykjRj9L30CtoBdSfqQ+K2UWqwr8LDTj/Zb91b8mb+EY8398Ft8iZGTtkw7vkMLIceqfz1CDxQOjQNZcDq5z//v3pXPoqDf7Ppa/S4FR4CkUYAeZg0oDP3nquQZUrypzBFi9WCC+7IKQsmA2EXMCOY/Ux7TLJIB126kQ6e0gjlRSSU0ngOIkkEM8x4jjKEQ5ziIMcYD+xxBDNPqKIJIJwwgglpCZ4Fx5QzZjTuyfA8hyhhHM3f9p/K12sAK5sGVMngx+G0QGoQa5dn2nMpZNDL5tBKqMUJsn1cyOnaC0foyj+HEEbx3Ecx3G6p4/z31M2uPfD53fSdBJCCCHkc1BBKaWU0svIMAzDMMxlwrIsy7Lsoh98Wo94kpHzs5/QhnOVDEtLRaUkAtRCzZs+EhRUhDzTJe1CoAJTjqZQAxv4mvuB/y7kIygObLDIwnXBSus1z2lDJamqbOv8LDHTQKDD/XOY+ExbAzjpDlMdxxRNm5J5W28xkmUFAWxI3lHLqoYL9ZOMalyWQZPO0P/faSxbYy6OrbcWlw74iX3XZ8hTolS5cypcdMVVibevw+/sTP4PzfkzFSSLn2rt0nWaUumnOXhhARbgjSVYhrchJOdDClkyg6ztklSY3ZqLsl9L+52itVTTNC7PPE364pSmzeI9llVdvUfzrc1jBdXth0U12dPtb8jzHWuWl0toxPaSS7Wzll77qc8N+wVqxf4YX303eDG4bBwEACH8n1lH4IOW3QwDNKv6dUwRo65/EbyYBOgjblrUDURXY+lPIpq4rgoYmiWt6aSvBkDNRBwPehTwtwXz2O+q7+n1LBLX/jKLuDp+JQZhgMZ5NRkL/jbN8QiZvfHTLYqYlyUkSzDAEKwVgokKOgIgSyBVAuvURBU/djKFFFCyFoPaNmNw5WIDzHztRrJs0qyvbhVYfXaIDY04hd6S+ZU1me62sH3egvitvnqC11wLIeuum7D1N0D4hhoicgtLJWqna2HfzjZMdBEQAJPuJVSv19rd4Z9qCApXlnTJ4YXxoO44mOmSwMzYdsvHDhJ/j41jLPVcNRaNlUeOUEhRoUrPthX8LUvA/UIzAJf46R8SaDULrqSK2rS/sc40X057Up164QxVhTZ0qWMNrWlqutfDZCc3lRknMsH2Up7xo8uaBwcmkzkpTJUpvcYNNlws1WiVvUxdLNNo0w2CAiG1KZnAlJ1SRoxsd+o+J6r0BxtZcBuXWmOXPLxrW1jbPNsLI5QQggkikAD88cMXH7zxwhMP3HHjX/ayB1d2s4ud7GA7LjjjhCMObMMeO2xrbM7CKCGkAPCrj0NhIQ7FHXQoLfkk6zthKiz/JfI00UnbjryDWF4FMY0G9ERiJb7031DA6YIrs30DwBiMxSA0G7bcE0rcQJwgeYjNGDc7dgc709/G1dAuo/qOAzXgQA3lQfPCNeLoUuNOTo2ARqBPwNYA8J8Llnktlu5YtY6OLvOdFpG8KWZlNk60cFd15Fh7X2fP+T2vntiin2FQT65zr/wQ5/q90Dl9T/nj9tDO/nwX3Dvu0rPeX6cu+yuP2rLT9pY9ntJ4xp+24xJ5/zhw6A5/iKoVsWQb71oB8RrwvB4yfFVkFzpjejQpUyBFBH/ZYJbtB7PSCdtkATCTFGCb84Nt6RaYtSqYscgsfNY765gFz0JmE2d9d7artFtksTlGzLfAaJlthpmmmGqa6YYNvlhhlX1qT7h8bp6osNJeFQ3idaMoVnhLaYzD43qRLfemwggb6lqRLPOG3BCL29UTsR4aNKpWo1adplJlqddlBphcrhTBEq9JKSDE5YKM2iPRxwD7uECLvSpWoXO6VBYWeQVRonG4eDKHhV4WKVDZXSi8BV5yIVHYnC8P5nvRmUBmda7cm+cFJxyJxdlyZ67djhgiszPl1ohdDigCk9Plxhw7hXJ4RqfKzGw7BDKlDE6WqVm220vh6J0oE8Oe50uUUJD3F9vP4rNqcb5i+ZpeC8l6i+ljeMwE4ymGt+424bS76GrNpYsoV9FUqlMTks6iKhWHKiAcRVHIdoWP24ssl2wyD7MVSSZaJS5qLaJU4Omt9wWF2JGSI8o6dT4jiRwu2SKNqfUJQehQOS3CWjU+wgQOllPCrVGtC8J3wEkXoKU6EL7GosOBwtUFvUfsRPPDgflocA5QZ5kvf5rZFIQa/PR1vXSpOSAAJOJH5cWFBW0ymAiUNV7DFliwbfjWzOGo+fCt8dbsZr9JALcR85ozI3XDdPKe3bVhjc44h3QRgQAIGGAQBtEGdgxw7ruXFG56iW8rcKB8+9S67XPAYX84/obF+Pc76xegkwHAtgPsaburRjz/S9ifB31Mcz7+JvoSVUbT3evj2R/LXa1ttVymjH3FNjplR9Zrfe1wSZlY9rmEtTBpdM0jPHjHkmWRTiV8BCYqMDmBaQlMn9ptNTPIZlsglqyhNzhFQDJ1BxnaiL7KlFJNKZnEEoiJ6AjDMszBLxg3pMdn7dq81KhBnduuqVCmQLYMKeIdEi1MAC977eCwXhSa+yj06hdy9QnZRsL1TVGh1IQwWJfQX6cwXFTs0NcI7bUIrXUI1bULlXqFTEOhYkNTiO+DUN57oTFfsXHvYt3GETp9ESJ7K4SbEkF9KqTrjqWaRBj1TYj1VYg2KjY0GCo0IYV8PwRrb4Tk2oTE/ovV14qnZuWx2AwQ8ENyRpdsVhYFrYz0dkH7MGgV7vnXSoS2lld9GH5z7FAPZn0NFNQDqnOoqAd4m8DBW9SCikTdg92+2hxQD+S1OKIeONLihHrAq2UX6gHLlt2oB1RbXFEPxn91dAwh1FM01243WJoiMMfZWQS060R19N6QVYv9qtcHF+ykal0hpFi4a6wH4TopuGyVTgtIIetzkMaD08dsa57HNyRHqtvl9AcMjY+rA6DrfL71GJgLc2MeNIv+R3NoHi2gRbSE/qJltIJWEQfDYYwJTGIKpmIapmO/BrrVl772re9111NvffU30GBDDR/5G2BggzREDbGFxc902ZblA/zVhtflJmquJ0WYz4J8w2AZaxZzc3j/wKQzgSekB097G28xnG5CKz2dWaSbaNOjG8pcjKcvvmQkutssJjMU3zIQXzMToxmLgUw7foCWsethIcvH5Nx4PjfAOdv9SaYOdKgD/Nj+trSfDd3szW6yvBvN7gaTut7YrjOga3XtGm27WuP2VW9PmXblbweSs6thrp2OtsOvbbctF58Ut6qYFUXNK2JaYQ8VMiRMt4I6FNAsv9oxKkRHKErW2dK7EOZVy0gN/7AM2WCOkjG+TPz9pmkct74I/7W+CA+RwmIWLOC+e6tRjUsKsB3RrY4FvVDbBAFypc62HyOMP6WsSrgUcyriUMiugE0+izxmuUxyGGUzyKKXSSeDVjqNNGqpVFIoJVNIIpdIJoFUPIk4YrFEYghFE4jCF4knAlc4jjBsoVhCMGUfgYhwjfAo3U4eFMqGAvAncwXAzh/5AOykqu9+iTcnEgAyZq1eVg4PXg6K35T/P4DImoPLYADkAgA0O8JawghARgccBLwqhYsPPumikQFw8FPohvok79H+KaQffkt3A8rO4EcbCAKiw76R8HlGm8wWv9a87/nLha0u4OG1yGbbjNrvsFOucq2b3ec5lzvJoFjDf/45IO08Z7YY4GHy8FuyfLu9DrrcFV0NbvO0MCH3P1hy/je4DZ9vfp0lZ3N2zC6zjzMfG9ZMKDkzHzNTMyPDa69ffGUJBN81JeJw8FXAI47S5ogzLu3pLvwc/2PE1Uc32K/oMT6/Yv/SbWJrI5rY6n1uQHbCcnRLCmc8uyoZukk882pzrgXqFfPDxUhInuTAqVmvcKWFIY4Q02lhci/aawH3AL9iYR4Gmu8SwzISgHhhX0x3Hn0yiVRaUV2U+bJWmnQpRObl9RN4rRXGhVeZIjKUk7csUTfbiVV3xmlVOgNY060VZyN7FXuHlOhWeJSer//X93Nsi8tIS/nNNElLtQ10hg15UXfXPNIJpljcPWX3FaqgH6mCgxdBMZGAExpw2nlSfUGe7qLaKv+a1E5I3kzih7gXoIPbOmq7WGYc0sm6E2jz95DsFJS/CkkspQK0udK1k4YKjhUvW9QaIcM2xcr+llvMX8wlzkwCXafBag7/x5/t6y/3xJkrroFr4sCkKNo3k3LyAxbQQkPY4B6Y4G8l9sV0CsFczxNVWonFkUhoe6Pl+VQcroUhH414qbjUQkobdDimy8b0GOsVyUkYFscrxZy5DBFCBNiaHyjH+QmVqATKjqdQT2pfzdQMirkdT+WqUpk6VtnqD1CPNGmQDWgCYq5D59orFquP1OnAoQ7XeaBdGqIDNCXHGqpWM3ro3nhEQ375/vCCxH/Qm89hdwLmevBYduZbQRwWIKiZPT/j1qsgufuXf7ffgh4v73GlOSiTueLFPp/s/eQ2CFIhUgFRCGEDj9KQxNnyrJuKBcJ7C8NKe1w9mod86lZTx5H8UZQWP1S3bo9SZmHc+AmjjcYnaH0zhXky+6OZmcHkpjLZ6Nj8QOmJUo+pfJkcTaN2Wq66j/lyyotXB2U5KDGYZhu9UmQt1uXnKi9LPkgGDwj68EbAyHdZC605cFJznNEId9Jrwjlb6eP4tK3amdyM60L4IYUU0UqDNRqMtayP1ZNmJrdxYDJcWVbv/zfE3eUM7fjKj8/jy/gp9ptw4m5TD494K87a60MZy0bs3uYQ3bUa3NcXUYvFargIOc5bSLMw1+VycdeYuDTE6fv94F4TLNmPpKZ5NOdRX7CG91IjOR5S68ieRNIGZHek3ebTogrwNB5ZIaIS78l/6v0I/chbsV01+4GehqfhU5LAdocmCdMbnmIKlp2LC0x4M1rx7g70UGOI6RT5jCKnApMfYF5l+ZHmQ76rCxJUlicn3JgvP8x8rlyJr9G4sTmZoN/HTvUhyzLsHd1W714s4dfSC+f5ODAdaliOpOoOQa7p2ikgAaPHASUkIEVdI4DbbOMQIkQZMChARhNjY82i1TrSs7JVOo+zbDb55FMDSZMkTTLkimTC9YFb8shcKBxXzUGz6Xi0mfDP4wd6yJbGpaooQ1gUbut0rl9pyrzfMr3MIvg5ActNK6+MSDBS6tyLHfUOCAMIwVagPtesaqbhfphHNqpLy7bpWTlYwtdsL1bOz67gxtCjGbJhRpoB+lhsc/M0wjkvaxh3FS7lwoQkmOLZNfo/2qjmxwiJ4nyWefiExS2douwLcpaRuLhg6VpFZsDD8NTH3yayPNWGL/keJK9fx3lP3k7T0GrbK5xEa+lzQCOUyNZT3Mq6dsZ7cH0MrW+mN9IqJQcWNWd89IbvgIDtaDBD2rdWeQ7GUMZLtM/YZJ/uabzzbXZcgiRYI8PjcfxvY+n5g7jOdFwB0unC5vGoeY0FJSBXiSEhjW3eu/OhCCP6WBCQWlrQlZKbNyPiPcQ7PJCRHpiSFbZh/l2tGso04uSUdmJc0dM17tqArg9UpjLsvBJdCkVvUNXROqRlHDK6e5bauHu/bRnTSPbndL8pmCCVBqKH6Z/rSB/jMvcT0YtbROyxFik5kB26qlBxgXGtoH7rJdlnWH5J+0zQj4+/drHJKhDhaCDB2oukEhki8qGnorYBSrXZcfNM5/LUkshQYBplQzojlxPacw0b1cfvpnf/L4pCSrVFTXXzH7Ji0Ld0oWr6KM9292TDJFOoQSo8x23y/oHfT7bMOTvmGsgf/XCsqmnN+iii7JnOr6ZWQMy66LZsR6at4NqxDlxliMo2Qr1kmxl66UmIHXGz1BrvsBOpLAMinhenaffMd/lGIEDc3O3sD1vrlv88h+cyS8oQs0cfhB4YNvEH0b626LxOnGFHgoYQUSB/WPtbgU7AOZfSRhLVqAx+t6vBlsS9Y1CCnaOjbtxuyT+jtASCoyEUOLISBdSRwx1zeGklT1RSsiaLtfn1fIgMv3IqNKr4aeRciRPM2GeL3XqdwRMW57g9/BWNNZ9F4X1nmxqaVSW/bC9GoflpD0hXM2UlIryDBTnFBfHVYM7WGJs2O6IYgCelecrSczafednkfCdFnK0OE/UcSZ8X10L7EmhgfZ8GqCnA+/SQykXAXy1t0LQcpcy2k6csNbelAOp6l5RtcftpEhTHhUea97vsNEp58xMuCdo6gjsLpz95jdalycU2fK7/V+IiysPfzDuWlVxoISuxD1x7Usdzs2r3sZ/xOlIZkYvYf7Gnxcia3uHkeeDaLH2Sk5k2TOJJTt80HPFdHFf2dU0pwZbj7yRPyPu/n+duZyDzKtKe41r6HgrfpZsVYck6G2lVgrskJsz+gjHFAQS6wkW+TzVcydJ0d3El4/SH7TGZgpLORz2mE+85YXG0g07cQKRUMApounp7cRTTde4eHbqBK2k3XN+bt57VZnlhMoFl5FRmggTuk+hJzYPr0WKlzf3K0ZyxHqI269cLmz04zE1e7VXlj6efsSzrSqOcQ75JFLlUS8dO9tOM3Lwm7lUTti6edrBQz3tGlqtTjKNv4eaYJOF2B1yefIW3xcPBvhB3sqVBKSSTi9CTn4ry7xvTazn6uub6SS55C2uP/0cjIxzdRcxF2Gx3swiNvhlNzNo83e7BcDg2sRpTLcf4LNn6IXSRmhM99CPZBjx1CzeToVvFWZIMqXlSV/1IT9I/lK8svU1YMjjTMMnxDKR+d/tBdDpWHklUUQPFSi5p6qJfhol0p97+t7IBxyd65wFfk5s0vVvflm24zuQ2Q44kwCICutxgLlqJTvqH8xn6mNtuTBURai7lGmYNdWTNJik7Lo6TRmeBVRgoSSLFNXtw1nDKCR1qGZLMjNxi1R/yAnq4bgRBz+9v5tHqL7YxYPnS5tA1BPKewiLVYqQ9ducv7hd9wfueaIusvtCfAf9k3FzjcrAav/3oiKL8xqTS55eBSnjO9ekFcUUU/W4KTpDdXXUtR8xId9Yv47qbDe+4R91IYJGqA3KronhlCeUmz3fOWsIr77ZR9eYscM1znKWd4mgglv8X8pHDI1ldMaKln7e5eW2F57tJTt4d1NoJafjcDYEvw/S0jz/TR13d0RzxuXVEUaQ/rZ9X4RcIZxxlP+3huWihPIsI1OuzSyE3wZ9LR0oNapX3Tg+2ybjKXBGzjtCHkJSZKI4T4Byz7TzffvaWmz8q1+gncB3x2iFNjiBD5YWc7AZOMpNGecn2wfmhBDfg0W4EqNpzn0CZ/pt/RAa88Bg0HSFDhLeVZ2gghggtHm/ozH5Ug7owWd2syzwy30ftkRvddWg2943rIjEtln7EGuXXfVP4nfTgLRSRolf6y7k+MOfW28T/6cd55TZyrpn+c3K2gFQjuwup0sNS8w/C6LcbwPuX+V78nOASjMUrcaWToEl2xVRFDveAqWKJ58v27EtW6Rqigm/MbhYIMf4bE2V2UOLU/nAJHQVya/Z7tkU12Y5KWkLvmns7JpXTM2CT5v+s+yCJEPSpCAOJfOE9eeJegwrki0WNmoYPomjzjyB73EAnspeAWPJQGXq9nivpNy0W3qm2zvYd2EwDp36TzgLUYFqQ7+iJcAr/gUgDHY/jcdP+syvuAvi9IbZC6LlufjmPnxP4fBQ6Sx7Iv1ukNzwF5/3VNP647LQ1p3UX3l8j65eHXiZLsAuBuni5mzetXeZa60g14X5KB5quiQyQ87w1GCLmiaX8KGAwb0nQYhiPXZwtA2XONlD4IMsHj+bAV9DsOkTDxnUvdLpok0YqGx4BRk/pjfn82vx2toEGYyXHeD15+OC5Cld5Gb98OK5qMc9QMIo2m0RUfXhVrfwQ9q8UiVkfsMsWapBeA8BGtLxrxsaAOSOY+zUKTQzINltAtCQzHYAQSttgePOa8phc5nfrDcK5lCqZMIHmbAG4+CWV16UEv60aVaC8qSDhNCQS2ev58U0MECyQisG/ltMcNzKdlTCUapCsFjKbxSZRi0MHq1HKpKKjiCoB9Wax8jgVhx5xuqv3LzhavUkl24N1JzZHPZr8XIS5Hi1qJRtkiGO7i0cSySmUpT6DNQkvOl6Ey2KzLgtTiwQncKT7IK9O0WhrUVhgFlwpkJM0P6EgO43JULxeRqix4d8zHzZgTbzi9I1joQfXceRgH5mrJ88ljlNq/KuD4ngOJYTJ6VbcppmJFiefk7N1gGpxtD4517TmEQ7nryzyfzIGxPTXbBj1iJmy3NQ7c7fDXONqQrdlpuF+gz5rZBoTnT4Q33appsimhI4ZgYq+pHQHlKKcXn5Y7TkrX8a5O7H62w5OMGuK0JSfwzyDq/rFXZHDb6oUsRG00JD4BA+o5KjWQcM49vhJnDD12Ajufu3Bmdg+58rG2IkvdK7WtyqUyGMYTdLB70cyHsXAb9+lo1WOGsU1fl+QAhGHDWKro2JThhTjUYpNvO4FR53x6Hb/M5LO5427id+O9pYYUe9rB3xLYzaa4ovCZt62QRowvg/+7h0/kVHVswz9K91owha8C+JaZC7j/2K0DPZf+6pHYY5kC2iN2STPSkhTtcalRjKrhD3YYE4rKkXW++MJML92RQXOrfirTfetWNmMxm9aFcl+LrLyHrtvfnzZy3b6Cnc9fbHc4QYMhIhUFwaKYivdBzWQCdfrVtF8wKqdm/f0HUmmdCPjJ4rfZ19hxt5exH+h4++czcNt/8Zx0IxunHDcmrf0enZdFUwWwI5oCMIzNvGb6qHoGzHZZfz73K8j3ZN93YdqiyfrDsih54GAhrU6BHR1gz4BJHsRqtWOPEQD5z7JNbeRrEmswvYYsW7Y0Osai7YIk1rpWHCARPzCFKVCZ/HQ8i8eK6IYGCHytXI4cpQnsOroUNsVLU7GFccifgNjFfSBXWTI8qpM9eWscuSXWPExI9NDbgsTs3ToHbsFTeDLoV8Vqt7+wYH8jYHQeXh41RQ7SEdZIFKLatHZfnEKJTKLZ1aSgqb+FEiR/k2s8Tl9UVM6KzMvwicyX4BoPAnLhApwqx86oj5hD2nhtMVEH3P9UFvUBtCur6lcHg9y/vhI1UHnFOC8QFpE+bmOlnaA6FnkUD2SzmqTOt0G3ymwd30Z5TTejhax7Y/JpBFWS5ID4WSmVEl2n3N2Yl2fL/yUpvd4I4UBPZFn3hw85Ro9VOooEGUDLsZQlBF216VG5hmBjA00upZqA9wNueKogtQrai7sJ2IP5QRE29pGh7AK1atzmy2DWRR7nfgdLn3gmbfe2oCc/jpSyJ95wO6PwA7lFUEgq2ljPZruA64SwqzUnDk9ppx/CqzseUs7p8cknzTAM/JssyvSvWTjcKEHMbKFPw8uYYsBLQcgV0f7ZRsZUCv9B/e4r70KWpvllcQji6f5d67f9z9YJp6AenAsZqu3n3M5y/dqGmndwQy94KWhYYCssJx2N3gxu0kVLpdgdsUlpal8YMSDofWcDCOkwKCII+ReQ09dauDT4Adw21yeUyb9tFVRJ7aYlaxm1ZzCc8LdyQ/xUSlUPNF2ZkzM7U8R3TjDmxxlPS5FvfHFnCSXnsuCV3J7ttmQYvUrIZgAE2UtRb1/tSVbvj4WzqhrGH1hlOzAace1ZmR4FNLKEqnzM6g0PxwONv6FBXkaTAv8gljtsQE8KpPwAQP1aUwDmQ0mmmzqATID//wq6mIT9GvCIwtf5qlng4XPb+BCZg7nLBbqtXbLyCzTNfC2YfDTLtW8LgqGCosUbeNGwqbT4yvgFLbJHbfPWBeCmE6mbhauIxWoxj/YMZDodqEH7pSH7SlWK0i81yOLoyuWEXv0KnLleMgFw0duRox+Qq7eUU0KUPRQnYsb5rQOC7TK/xYJTkBtgTfVsfBriPAMmh8O6jSYEVAWpuTtX5vUeysw7bD0xr/Qm/KmFeeRmBerhMbqw1P/WyeTtacsTaKzJHTp9nl0TGr84CIlnhJiQE36SfT0wP1Vs0zkX6U/GJ+D1D+FAD+dFQh6ON3YSPiV1X9Jvbi8eRYNG/+mH6z+gLxxk1m88NblVN+En+JSR6SlsVGMu2xQf5acYXw6DQDpqxU9NommE+1TnBF84o9Oy8PwRHLB1pKwtdOOW/haxH1ZWPXZ+3orRCyzS6L/peTucz4SeP/6PAfxWQ/tu2lb5OlQnrV60uh23JKKhqhdx2RmpX0AIl+qbNDbW6bux2avZ9758k7BNE+W9Z8pmLRVP+4/Tmcb8JE1l8cxcZQ9BQN/e1sdTftUHnudLON61DBmWbNHhJjIbtl6195YNoNdBCj796Kq5zRIO7iwZFjxSsru958IlT6SeJuGcyhoGGdLtZNgQxeIUgLCMfvASaZUBgSxhtckxQOp177QyS49W7p45DE4zYHiDs+RkNiggf4xk4bdjpP7aaisnNvwx3Vox7chC5VVZ0Cpldtw5XFJn8ndUDtcopxTaxefC6LMG3V6mBQ+qFPq+Y1cAxEr62q5eTEsuVhfQf6iKCAXbYWLwMfP8D9qcq7yd1pvOkOnobPldmM/YDE4uhlyvWnZVIbmIGBiN6PqXH8RlrEA8feRjrdTNcB5IRs9yiLPAMf2HPo4F/8xH259kh199brbI5Mfv2te5fsPtEn1VZhTyWCq9Ut8DDHGga26B8LyOdGVWjr5OYT3zyp6yimn+v7ssEu7U7UqwbBYVRYt300h3Rlii1vZm0k4i7vAeYxpHHQc0H14mYXYOBusOBn65WvBomYz8DekRAkBUkksU+DmKmssdqJsHx579t3LxV59YsBMtnReFxVymLUeRcig6tCbD7TkfOofqCcDzq54tCf+GPZwMjuz5p+7dsfqP29qlOogxOR6MSKyrN+H0VcfMO8ubGHpGpgngIraWuX20nPg612xhWpKhBV+SrKadEA6V9McD51cnVh2Nhqs3qfG/GMw1ZlsU0ITQaRd58RELHB62/TsX43HTyEhesUagQ7L0qx99u4XfhfeFX6iIEjDuLHbdDf74c64+D1312MQKmPGHSZundzKDw1XRvSNTM1aEiJbT2Kg0XhLz1YqTVDj5cfXcgla/thRvbraW0eXXjiOTMs6+GObhzk+dyvjuV4uRaDvlWkaiee9PmOCBXQ8wHSTr6ZZrcqNDE/atnJdcjwHyCvFwVE7o02w/Sso/tRYsWlvNO118fM3Ysvke7WjoHQLMdzJDUy/OWaeySAXDm2OWx6f8OpbYZiy3Me5mLLBj1TK8sWulBWrTYU+nLwtKS3qrwBOYDasmLiECLXEeLakLuoMLQidn3jwRorVnslksR0ZYIjx7RbmKM7gqCwCdc05LxWGEuq4pBskvgu5B1v3Z3UoNlhQgOFBz1L0hRlgEQynYQrndCJ2+omZlivCjMVKhvgHpnaIBbbWmZ5tahRd0NBaUqX0sK/IbayhDQb0cYblzscDsXrHjmfAxodfwvUWAxYmPeWeBZfJZP1FUUf/HSF3igV/BFch/zboFtwSPe5HPXvbPYsxoFAm+2PaS9HmOdzp6Oxye+7s64XKpYTjPVUidiuTPrqkpherxdOHG7WPtjxXjZK6X+dD7voUYreIFcMP0l2XZ7PlojAzllGOvm3CGIT31uxumPpvXmr+YAp+f0m1OJXDHdn7g9Z7SniFAcJ2OoGeZhyO1wOXnTO8+0UkrXG7vTPJfQcDaa8l2NxW5u/p/knrXsR/8ya8Y2scXuzx3u3YF+XS0vTgv13w5ii+dNbmDORxuL0ZNOwLDoRrgXpFaGAVeOhe7LpFuX+1zV0paDvZ33Keq81NotTG2mDy1LzbSywSLOdnvVjVXHkSXtScsKXkUmb5A25zbkRumOJls0H4bDr4Kz9yqzPazu2b5BYJlgVK1lfhtoxYq+lRafM+kSkSSHCZhFv/NXCpUy5eB1ivvi7zLKqdVjJs53V2fXs9+WeT9z/Z3zSwOpr9j01WLNtHs//I8uz1igF6sxzqhEW/rqusFGUuvPMpJ0FMu/Pk3Z/DSPP3KAz0p//6JZOqK7VWvpa1/NUrLvHCx5//F0l5eVb35uDXr7hXX/mhsa6u+97f98Luu5HknWi8fikHyNz12ht7tf6MULjSF3DGoqnQhGCvztYIyNx1GpqazYir2WRodjr1TU1m1N1k1jfHHTZPAlVcZ8Iiqz/ukl1/CohPaBDEYEAQjcaJmIywC1GRXqfTXyeR36VRLyD/K8TVcJBLoz41gqhvP5B/DXxXPBVVCyTpsKTd5le3lukMotdzhCKmG9JrAnLDrBnnr7FFc5ngU5rSHPblag210y3N61Z1DPDrTnHJvZBQs8WvD95dxO6TMG/DfI0uZlQ2ODFNX4N/KRe4gvYxSXVYCv//XBKCfo95Kqcy2k2ZzSasKCNW+xCdsNXFEJs8wmKeTOQm9b1/g/5HUGfJ41FAsYATppKO/35k43/fyTC3ofoRNqACfzUkgWXO1kBj07Ko31HPp/Zv8Bc1dNINlvIuddD8PEjaOkfmGxTlDpG9UvUrd0Dw1S2hyAK9lA/RSkYCGLH/LCgcRVkSfss7eFxAthoUwIzfaRGNW9I0BUokNdenSgGdHbr6+ik66aOerwfGlW4FWWEm5xeGCC/7/8oR3/y4EF4osPtRxynB0P/EmDh3Sz15u4NKXEqhM//w0ds9upd+jyBTB12R6CCMTIkFnf1T7LHooB3ujaXi6eYaR1QmiGq0gkRU5XBEVfzo2AjoeeePBO3RPhJB9MdX4vP/kGWGOF+0re7ZR+cB62EMk2iFv1fZ3uMEq3saGlOLt/q79ZWlEY5XhRAR0Fckg1uZqJ3R3EPxShVqPayLkPLNWbvp4kksFgbSu7lU4z0k7/oAQ4T/WoqE3FbO/A/eGjeuyLfHXzOUvQbLWoMp/5aLYEVptMFJLTuXQMrx/5LAgdeU9Dkkpsz7auYoAPVae0Io8inZvtbN741jUEshhQk2RuRSAedLGvWD1Rj5IIklrPh/Xe9SLgSaa1VGUTvxOxInBfIqHv9OppZd42sxHosclcKWrss6V0geWFLpkfZFIu1iYAgqL/dY3qkxJsPNZXVC0KnfMMkzPqH+HwbKl9X/sp43vezvimfeBDVRj4nXidSlE+3uafxoW7+3tS46Sb4w5JLVlqlh3blvHJVB8AdCkmA/w9uIz2NcA0Wga16I08pLAT/RLGAlxLWtHR0z70eyz6Smpqcp2OdeM4WZ+iuh5/mMGKFvPlE4zQ2KBQveIbD9trfY2pBEHaQ0GKY3zwD4INj1jVa1qfpjodEv4MICcS4iAU794pTcKmJIV4OFrYIgYfYCIpsS4FptbuE5puDa7mNuEQecJ5V0n4Aiovs5TM0oJDzF17mG/nOjmyQ+jANss/E9v0wIseXX0lmjvVQmj8P9iC5hK74IYiXMnn99kGIT5kuzszZObSwonDx1403uGPa1/MYxZnSDwIl5hrdS9n5mCqw1kmkM6qtc9u4iHJGvDYgEURsldNr1VO55zt/DFH4znf4Fi9kNUUTf/n1NlsHPelfM+6RSbEyE/EhaqcPIaaGZV+fyVAj0xs/3MRReO6JMCXjUubcYLOs2u0WeijqJ/NDt5rRl0OdS11apKf1Zy7Hs5cx+h9j2p1yzmEu+vj3AfKhgK4QIBlFFWb5m/7QbWRuiWRsAKYjH7jWrK2TPc1V+gcirgESBA8cmBZ/43rEK+fdEGgusC4smUGiMCde1JkmZ15xi7eUF6otG0sgczKusissu7bdRbCNJ9ZQjvCV8XKyzKwHKQ78GTS/QJ3wRQxJcnWs61ypR0emZxYx1YOnV93N9e6fQeQhxvedBqDbirZ4U3CGqDP7e/BTcWXMJUvkhNUytNHigVivsZwmkF3OEoiI3ZOAcuHRx1oyCDE+7l+ncZZyELUdMCMEKoWw3FBH98ifDqIXtFkUq4iDyFHAG7dbJPresLqbyz8xaE8paA9hC5eKAIsFTF08rPXyEwoN3Cb9mcZpBFpfHxlh+pFDPir8ngf59FwtXsn/QyidzS858fZsmlmJmsfjuppdLGWkFd+SUS/38UhdRmoyGTcz4dX++SuoWO5qD5Ro/qad/XMl3t4RonUczFYsoeistQDqGtsLhfp9JURZX6CXv/cG3J/wYaTr4OMvreJ+uns+gPWEwvznGzpSK4IC0jehMdnOurwBlS3/lUpezST9BtESTt7jyC/EehuBdksDkdVizvsBPetN89xEJ7w5l9Um8CKdMYxTVlqHzBZgCP+P/BKWHaYfh0PEVOPI1kDtrToyWoAUVYuUJkTB4fO2NSx8xdXrEbpKXxy09ICwLB/uynoslFpQ7pDXlGhmClAKCDBCi3Gr+hjgl1X/akjm5S+QVIfgG3fO4pdw66HPJamPqCSYZ63I+cj8jnR2VSEYqmytsEakwotEI4hGV3R4Jk4go3S3uNiG8v+9FtlY/rKssHXMKeMjt1pSt393c3PfvNdRhbwbuE/i90w0h3nfOXRq0vc41xoV6L7XOlND0lpt0kWlr7YFQvD2lWNKxAs6lX51Ca8XmcMMnv3Oc3pZyFTF8gUeayOZRX/SXB39hhy58RQNPXNWY4nZ5T6DMMK3BAfiic6XPPzsR1LSV6/VpL0Dn5ExZdbEHFQPV38zdpSKGd2MVy947pzplgatRujCU4NbOSQWRqctRwBrUwMkXWZyM139JNNMvs2l5MIjPCnjzmuU6j1om87coklnjknMfFZI/YDJ3kMnsNdsHSjJ9GRN5NlTDEqCQxoBwTzKMTXC4WJHcD5FIP4q4MLloT2WsFM2YS5y2DhEKNS/PBkUXPaXjOHhb4h/wfqjpJHSGLvF0GFeDUCr0Lufv4/hQg0Zs26WNcHaHxToYHxLn2DiJZVz6U5A5V8T5tWDGrIuXdkN6FCoSCXMuSgV+lhWGWj06SqUaDvKAIBhd/G84PHLttY1T3X+cwTMqDjKv9W+hqO01NX9uJ5EeSAQJtsKENghtcB6XsB3DiPM/JPEhJC72GZvoPxZqU0a4zL9tiBlb/xjB3fPq7jd3fwSW7t/wAoFfE63Q/NN26dhBivgrRAKt+tF4BhsIfMn3/DohmLaU7sHc0oPJyVEACJ7m/XD7DeO/TPD7Q8JM+etSFoWIh3bnycj10n2B5RJoV5iv9TuchpBSFFNX1AXvsn969tmO9C1dtnCdkqomkNQUAWVo+gWnXmhzyVQs8I4klazx+VMR7X47qqRj+KlGBquLXrDolW+Of03Shy1ADDRH5ap7hvrFHH29xahIR9E/5INjxzeaXkIxUZ2pvrlX9tUwW16XG2wAL1O86GvV6qvMegkWEMvlI7uYgj9hUEs8X5Pjb9pGF66g076jiXMVmbaYKybASn8SVPnD+nV1C2f0e4QiD8JfOKVvo/utpqh8UtzfDQEe9LVodTAT+K0NieQLlcJq7ciIbnXVvMGJXzFig+sHWz6a3F2zxLAtnSpI+Hug8tre2LMUjn2UCyxVKsiUn1wTLhe7NgzoQkkncXr/9YGLzUbMHXcOswosYfyhuSh00T1D56+bUE0Bho+QXiXQZ9KLoKsB+kuNTB7yN5zej3YPzVnqqxWRnjp2iSBBw3/rZIEYS+Vnr5JbywLeHKj3dOaDe+07ZYgPK95NKRzQMvFfo3j+BK/iEyHVVsHNruoSTm9sLleHdWGuYoxnbIBPKPu/LxFOB9GN4J26FxQsTAldXbBrb2Hh2O51Gawl2ArGoyn/CBXMbVm0j8THBEovuQkoP8rBxyTulSnmjtEY5KvJzHV+Iq2IxfqUxJUqNmCtkkc/FERX8Q0BJPa8o/AiBvXzzxUqcRDVljHWgMH6wpEYMsUDK5Nx8bGldsPZ+Nju8tTDVUpwPLT63Dr+Nqf9swPSMDZLKYNIn7JYRTSif0Ei8342g752DSA7YnagV2JasHWhVSxIZl4lfwN3rBm/z5O8TgeFgzt23l0atL8BYVX9LZXhRWuxtrYVoeCiClRUh6lsEZk84FI3t5gixeFOg67RjRXJlUZYFwk9XrG3yEfzZ91jk1KxukWCqNI/O3XI9KHA8VA0tjYxTtn/h4ILeQ1Cr6tufuByI3rO4bdTkZIiHYWaJqHi/QwCH1f4bBWM3/cMXnZcJPtSCAQOiQR3AyTSB7M/X9ZBoMohxXN0j1DIc3cYy8X1Rp+xoU7V4azTNqjrfuSYeFE+MI/KIH8Zy1yQJlF/YDDeJUBPxLhVdy3evP32LrbRZQc0C+uQ1XPitTVz4+7VdU3ImpFofd2cJLw2VYVJuissKFppkXVjmLy70up2V1il3YDtbHIk4F/e6qdOFtZVlvPKhGXUVrtb1J12eh1pk7wrVKlfxEjxuF7N5voK+6rhcuDBLNKuDlQIBlEPv/23RidpHyFcFrP56gv+61hCixgtYL0ekVKfIeq2QCwNh42yCX9/apG7q6+iSCL7UYaFI3ap0BMTAWtRNl2DCLHZHZqgz2OWUnmMiL8wSIiCyL92PR00mUeHRju0tUIs4he2gE60VWzG9Dp9zENmDFcdEag1sVYlsBPMZXfeg0gTCirYu/aVxMd1cw0+o0wT6+B5Izxsiqt21vDMYtyGdjxtMZ//Io2ic49MKZw/XO8KTonweN4udURm1Pu6ufFxRzv+JUiKXwJEYBVi/aLvhMGaGr5aVyZXd9dEZV0JvVVZy+sRYqpuHuqbivpW9rXDqyYFy17XqdPzXJpaCOEKx47XS/cJuRy0x63eL0+rxUfJhfk22jOA2iHhy2feAT8bRTlyCFlrvwLnaLNimaIlNGsTg6rOyzWPqWbFnjMPSayNIPPEUtKLrsZY2p3OOTi/+QkgiHSbShZVaDTeZr2fNOAHPUzSB/sUSUzMx71mxKh7z1GFKrRDknRXMBxpukoOVyoQoouY4HZx6LcQkt4RIGbTSl83YsR9Z0DG1OVNNMAC8RkBz/x0mXWsAtHvEcOUuN7Ea0k4vO6USdKOKhl1cDIEoiMxts8wH4M5Pd5klwLQPw65Rz8D3z39spD3TdP8g+kcdzrW6HqBvOQkk9FklQyZn4vNUo2Zc3M1VEaTlbZElBnL0sI5V+xrIQTI/LYkKyIbq790oHvezFerK/fM7A/sWJJuCM0yYzMauydOqa2uS0QQq98secBlvEcljp4JntNAgm1/C3l9mNBoTutUNbYA3DZNH0/N8qELqjsqN29PdcWW6ydOtO/o2Tx0/mrL6MA+36wlrhOzJDmpYUBlJopMnYpEolOdyJQYBvdPscdjU2xwXyoZSTdXWMM5RGhhlc0WVh7F77m1Un9UP10QubL9IJVF+nvwF40IUCe700DXU0iL+9SwWXEhdU4+OHHld0Tyv5tnTBZd9z6WtGxd8oFl281Lo7j9lDNh3KeC5aauSRJdw5vx4r9mJOmKPRaZGtpBW3ezortidAyix0XBZlETEImaT8hQ63bWVUDaJwpFAbUVndvezf+E/v45CnH+BhoYIsrSsjP1dlD3bTNnOc1LrKNADdqKaFRxqP52IwyodUHBRlZFUcW9O6NZheuKDipHGX8ryVQtPUVy5Rfsby/ZwwlMpbsDH75HJI0/GiPDec+gRbRXsnJFuIO6u4oz3xNk9TZSeHDmCXBbo8PKpfS/2YAVaoddzunxsL67ymQWvZcjFCs8XAOvte9S74x7H+Ulr8j/S+XaaCF1VrKjuaVyAPENURJJkIjaJ1elZiuBK+KfKzLJvd30DXQ+dPRX8KRWIPvQvtf7GvU4Af8W7Wv3I/IH+NK9lEfuL6n7S/EHqF+iwMHg1QdqaS14laLQ4UrZpCmvc9G4ANnFrK/SDLie6iPflJZg2ZgKsG1WVvAheRwUFALmylnmvM6GRpOYHSgnDlZYhwJn3mFhPGTHHiVRL9IkSQZlFs3QL22iAMrZNUzEl7iOYdB/KwZ3snGST6OFfjBmnMp8SCmU1tjtK0tiY7BKK6OuDiZS4lacTbc2tYbZlySvgp0FE2RBwZGJWa3Ef5O1WylCg8dhzk+WT/rT86NvBjarGlLyd1nRs6GOCCPucghYMK0Pit5c185+7zpbG7WbJWVBUwMrQQyA6cJF0fCsVKu7Lrw5+EEra2CYpRqFwyqriLorqAhR11NrR01n/5ClnMARFsyNonBm8Pgm6hguqMXnaq3RKq9KujdSYBZVHfe7Wpp737rpdIi4HE0ZrH8mGx2zmEwXwG6jdc+taETc9Q//X/xsDTPS6oBz6jLPXAIcqfnq582mqQTjWEX+zLt+hQRVnXU2iUon4bh+1geFh/vGAmCR1QxdvcF50QKUlc8qrk3pQpVmB+mUUpp9y8uXkaDptzxYsXhkGfVJZwU0zMLHBU2vlNAAt3Fdnn3lpJVhmKLTf/A8iWD/eQecoQ2WTIo2QLKHTRS9qxI3hisnLs9aq9CsmYWnX0QyQhlamAg3lbM1GrQFmlyMGmiiZkL5hDlYVQmHiDGC6Gj+0t2VMMlSIdcffWaU6riqEz7wIFRQ2vAD7CiRzwCUv0f6TJaOgJNcDwXkCZ7USsJ0alYsoEa0AYkoakKlbWCCh5fOCbhMff0ufiFkzH5sKRPpghSfw6D/YtYkjiPGAPv3sfyzqF3T4gVc6vkcXE5gz+EiIxN9MypQCmOF7xrBzKXlb9/e/gGeyEVI22+doA/zDNYHRwSSzMkLpagIw4+KTtVEtF3uZx6Px4jBfod9uBs2/IwgfYOWSGSKGemJBeH+QU9hl4oXsEZlwq0lWzTX5mE1+zaF9DWb/Q2Jcrc0UxT5lWAK1YKEFrRt5QQqx9FUNmezvSs2k9R0viQlJutsrQFvvlSpe76mTGabQm6n5CcLX7Dow7eIKteMVOwH5MF4iLrqoGyvUNS+Dti7qVzQeqi7gZVMYsdCJgpUMpeA31oOyjQBfNcAwPvzmtBTb1J1RwLo49HwmMyBLG/PSma1YwtpVZdoLmNOr9u0u6kind9tzR2Hn5SJeDg+ErWOdbVC/Rr9iceH+dTlfBq4RpiId3QvQ/7YeZQTtG3jBCr7Wupis9fA9fXL4fDsOlRUF1RZIhIwgKiam8yhYqzNoGtyYUVS5pItPZH4ty/sPMb+uhtHFTURXMUYOTaBBdRTa7kB1kVsj3duwpJqw9D0/bwCGf3k/BZHo4ftbntNg6V3Xd52xC+oN8Ky2nJ1lYpjfsPOMVWTtPMjXrd25oFp7UNRN5OLlU90N6cHX54qmesH/Pxf2SnYMKbK9SDIn/QQsx/bkzY63htPLdj7FQ34tCJZaDHwjxU+Ap9G0Gj0XYUFBVgX191oFz+ZxSBv9WuU/vXM4s45/BwmbZmehpj1dglsMYcLq19Qz3je1uc6cNmFtKEr2EsI1U87plL85z/vK/j5rOKUg8ttijCZ2F3mphhmUFtNo6V3fd6Yy8Ovt0wvuFQgwj7Frqlfl1+7Ui4t6jwxbYwLhLHF1GJau7Fghg9MvfXs7JetPcIp5NsqgL3leSWHw8X488rvDvIPaxB9VzzaEyxdvcujGz4wrX06EWIPkPZzRFZXrk5YjFEaxiyxu9Ugho8Q96x+Rp6TmBEfZ+EXcA2Tsm7zqMpivsPHi4d5vckprS5TB554Pz5fMfExRDBVV0WeQqweuoKLkKU+n5Mz3d6eCifUq+FrD0v4cyjUd0G6lEsx3fPlXS+hm9wuRLF+A128xAcq0iuxjvmmF2q8gjrEmKRk+IcHNsB7zFtvUTVYSt0SDycjO4ND9r5pUE+nUefWpPCQmip0BviRg5E+i6U7PA2zDWkl8aAKBmIZ86XVY5rc7wHEIZp/Pvepig4SWW6vUzxaaU9TdOWvv+D6IWP18bicyl/wJaMBUB1d45801/VKc1LWmdQgUnAKvuwqkz87szLTIlGrnaoMeuqBgEUmVb3cq+bUqz/wL5NqQ2qT1ueArTGdqFytEYbDEkBo1Bp45L1SGBnG4rNF8EYbbRVMKjYv9BnpvxY+CqlZGEul4gbPyEjixyrIg9lKjq/61czvWYn7E7rzHWyusDGk7w/g01E3V4rPsSGdC13tsm1UyrsgXcKjiO55866zGUaPC1as20gXPxMFAetj4S6Lsf9lg16fymHOETKAlHbSl+B/fzApxjcUhLkKa2lZFgowH+/DiZpsoMZCNnQCyE58f83jiztB3o8krwmRzgv3tYff2TuvSKNdLjAAO2bey8eEtKtcA4hBdCU/RUgybwzldErUbGJPsrbHQ+PUc+FrN3B0IF7C+m7ebIqf8crYKNY6Yt6Rjsgmp51NKpxGM5QIVcD9nuwxu/gOIlnWFnobhSnY001qjsPktda4vD2lBq0Gy1WwVKh4Izg7ZQbwRPtym39ymVNTX66LqBMqBnd7yFGk12CdooSpnuIxCWo9Afm0eEW7ekSMCXwXRNbdsEN+UGVu4SdRaz17iishnZGKjQgj6xsgGR3g2MKIlBxWwQEJ+f0rxfBS+00DFxNx/GmCgTr/FHlZQt6LhCxtk02pGBx+taIW6q/Ot931mqBRkPfL/QGklD/HSt82G9vAEA9hTJ2tAUQN3KDCoantLkrC4YuUeHVV1O8FYn4+5Oi4lcRTEwBegan4heiDLauygSjSd4bMjGQeAWTY5pV8gw7I7PsH4p9KbPiklddJHjcE+eDVqCkKfdIXVgZJLfzSaK6BV5Hg17ncf+tSCgy6EAS/zYFhedbcUx1st8jL9+I94m5umTht1NUr7EzYkC5gplAVJavNKYmqHPEoBirK7/BCGKe7x7IiWQHPnAajlqYDDbgQSMQsTK0Tpyt/EpBgPfbwaVqr8IaHr1zdPqu61XR9vd0sT+1vitypTgR7szbH4u2psnag//1HDc2yd69KvMIUQ0MKKbomqLgBMtF6oQTkukrf+/ikvjW0EKtuoRQs6h0jFyvVj6f46R3N5lFW8pjaQ1hLz2UEu0GIcX58QRnZpzsEWrZXSi77A+BtV3Ed8od4M93R7UWRa8H6PRZic4S3S5XLOcI8V2FL8tYkQc9VrUYYZ52LbfPowloMLEqVQ+jvBC1W9fpG0idEpE5JtXAFRWfHUKAiQlokZ/qcdLtcKzawUGyYoRH0Yaia4hLIpCbVCFT/np95XrclnLBpAo/gj07eELXrRTWhcO+dX+rSCW2PH+T1Zw5FThqrHh0KQw5jckgu09B4KYdg4YWiwWSNhY56AXGTC7dw0bEmA/Uy2sr1JvaC42eMoLwMg0i4cFZFOuqyLHzcXGbuRak+5t2tH8fOYDEyCxY8XXXysy8p+z0lhHoNA+9zxaP79hfSJJuWZa+IcQx02vEGl6p0iTmPPZcfyHygvNBOdMUhTZoQGbLKU5hYfOCiw7GNbwx6HDrprXhJFivhOp7fVUHZQ0x4rNKdwh7FWO50sLM+JCrmGEuCNUq7K+wsFVM92SRSPvsJi91tRL09EHgbyieS0FypuNTmigXsrNMj/ICT5Sgg+En53Cbn74/QSfCHKNaQH36R6bPV8zc7MtSBBpYU42QTVdGnVhklmDnZQVxSi6gL5cgyWY5ERspwkEMnZlF+gJjw+PkNiWLUlwg4IG4r1cdcBI2NbMGEMVaqENzHwgG2ZmgFj0+yVRC3i3NAoYynTS4qVHGUTOr/tNVqk6QDzuvUQKaDPeWF99VzFXOuXm4G5IpvQkFMMwQUusGj/40469TtsdziwkJCe7Bd+AIejiLzmSSMuY1duHq7WZwMmOpZZWx/cUAHlx+kkZ3Zp6BGUVIQZFHUyb7vE41SN4DqjTYokbJy4ReWjP0w9h22zP47OQ1b5k9sBWjHQrFAC8c+EhI0BLq/4jULiLGov9EXwTDTT9vpcfyNhu44gTcbLi8Irn43R5ILRk8xGJNBbTQk0cH3ZKkUFwXZsARq6EKZT4AdW7KgT0EvfzX/eLuhzNTD49ti/W7pHPqEXAyrwV7GiirVuVfgbnOnAp1SRo92DXYSuZ7bLWnbJLS5qfcGMkyLsx4niWCQv8tdtpQ6GAjOxkH6ucJPeDzfoGqsnkBzmLaaJmhVVSVg7qG7NWWaibBPWTvz+HerCNyuY4y0yH8xN/G8V5MkLTYjbi+WxCLkfi5d4mpcDeTZ1FbunOxB0xobD+zjpkd4U1BcRitlrJ30+3FzNfAeY4LZiz0x+oatUT3+T0eR+6YB9CiozMdyHdgg5jOMYznMrXNSKT4nllo40PB2lrbPDhur07YfpmOOAdyGprCtN3TH5Ukzj7U7mHFYmDnc1J0bci7rrDjS74EpXMwPPtPu8G87ql4SSXhYM2QJbUFluojVXfY/mi4sCD7gNFZ9HvFe23X6aWwvJY27ob+ZIhBkgQWjlVeEnDeKT1XFNBPhnaGhra0G7NKR9nSAnrcN/FxNp4PlqkzHXPioluP1IBfFql03YdfJlbhEBYSUV/f3O9lYyyIIyzHho1Wky5BN/972L7f1o/5ljW1yL9IK4BVrTdkGPGCYYCZjbyay/kfGeuKkkXEyTiduPhxfk+w6GAWS6UcmIY78KHpM40iDAHu1wdMf1lev7nNF4OWd7WeJC1MQ9YHPttuBhohACDiP+fteUU8ZTBsdh5S8hdDxf+XkSCl8yjYIH//va/v6Q6W0ZFEhhMepcQW7XijffB4HfaUUzxRz3zc4fFqmH1IqsKhEK3zgwrOuq9n79B9t+5EtHoSUiLUFPOYzigNyZ8T7RSyjzplRB3SVGSMiiV9lgTCbixH4lA86/5WoN6p5IFzpYvSzYgqZKBiTA4mEsl6aYfwKh5+ML11EIZ/e0PfxnTqG4FM7RXFCSh5o0Ke+PYdjEzhKxNYCvukziv1yyT+XnsUyUV0xJMZK7hWc2TeZzdVCSpet7Fevv4dySheo2Rt+lNinCbjOpjMDxflqOji3KDtc+n1VRSFzNSyjonhK6ZC0Zn9xST9VuNrlQVdSwRv4gpah+9vHcKy7qdPv+p8aJhZl1Dsz6pme4p2/QH12S0xB+8qK0jmc2ryCGcT8pu3T594n0j69ArR9VPGDqFTpTdT65TyfW6xSesQ8L6oBGQGQ6aczGAVBFjOY73xX6pJuPzJ/AoP9gKPcsk8+GmlyOx3e8SXQEzgmdUvX/MQDHI2eE4A6amDyHYbYr3L763X7rv5FKYn1ngkGcLgtm8UoqJGWFOf97z6V+YmjRY9IsgSd8R/qCfwtRm7EZTtI31qGS0WP5WKEh6v6hE3/opTDFrLgQ5qExpSmbzvW8dDsXqCvo+8Kxaumqgv6XqUqn7C8EqM0iAoECoVQPGji7fn0pyV7IHBvSTFMYF9V55KO0lkCncOtaWBwf61RioL8bRPY4wHy36jk/oTIZEqIZH6lr7EmVd5c7fUpdhtMG2WiUbNxk09Enl9SOplMGiwtWQCU0Ypwi38bfofHjZ6X2KxlE2V+ZzVliqX2i0quDmOsF/Gu08FfHShzGf7+TjaB0VKCc+BK6kqLbuxetOUuiZcnVSQE0F0PtzfIj2OZdY6MOqCW0B/TqZTOW1xqze/vdjwMMggDJYVaMmu9MYvp6GJydB7UPnEHhzUeVzwfdJh1UCmh0MAAU2VfX4BZcttcHu107pONVKFHYeH3bRGoGxdIA5F6H+ZLADllIIULOA/be8QApRQOY/hNTpnQsJJntSTaZIivVakvM3J7DX2MRxxTHA1Gwm4j9AeDcmvIM/PkxNWZcU/Xxgl10fGktbjStSTS2lLcWkjeMRTrzk/LPG337lLg/j0BPKXCvjpxe6NA9FKPlKvleR8IpWGRNGGCau79OhSGwHXFRapSVliVTy2YyRE4m9xTMbbshEZ4k13cW1o0877uvnnzsyCeAP6glbzE8sj0vJBHCJSUqVdUlHQuV0l3/ccTg/D7TSrJUT7jdy5vOIXqXxOwskD+Ial68H0GLOL9ux94RY6dsptK9ar/+GzpA1Lu4s9bigt6CP3MPsp50UvKAUW+CXpZdiFw3YQbGuz1QCw5pE0zfDdxhGZ86VQK+RZE1/Q3b/+py4WUsPU3EJ6v3vnauj+1Ho0k/9L9udyXdHjChc3eDPCfIlxZKYFXTP6Jnud8Ipuo+AYPMkZPAF/7Pc2ylBeXH9BJl5Fxx2O+8cgXPkjk01aoPSW//2CDO+JUSp/DFX/3U2D8+2GZWh3STJjOp2XiyY8Furi4EKIOZhVkkReQybd0Ht1jKmGMklVMmCIkZ8uaYhP4XO6pjOzxhU9K8jMS2v2HgFhYKqSIX5HOj3LGq2oxi9lsyoRNILK6tAZgw1rZjPjWWIzzg6omYndzyWpvXifhbjTCNVCvNyUkJ6QeRKKwmgGo0IAExGrGSeQGJ420pP+yDgprzWRoH6q/1IRYkXXUJG6waUsrOTcQFNdZCGYCrib9Ik+jmb91ctUTb0BYY+6bDsJN5sIHmj/Yx3ZLF2JLi6lP316Er/7vAWSAo0kaqKZ4giBmcKMMkcTNMKDBAIPkCVY3y4ADEWVLZN3lS68b4psSrR0b4obEiYtdyYUSQCbE3SWLVTHcHm6nwxtlqTQRlt3b6eEy3NGqLhmwpnD4XcWa9OuHto6GdkHN3S9L5iWLTpm96+reVQAhofEFss7k0HVdbG2ssWV1VBe//m5HckQEHIooR4o8O9czibbOjd/JJpYtFAMJtesfa/e2erAj1KHoCtVOYm3Hy9Rlur7wh0dQbF/rYy2wKPS8opxfxTr1/bTIWn66dkw4KXrukM61oOpFGRAfmVou7yl77roxsSXRPvGZuDF54tOessUSQDEE7ZYlKkEXyp8Oe+NsjTbGcnqHUB7ojldOlAGRYYmFsq7kjBO6+PpYc+vamD5+4t3O5FwxUBJbu0E+mHrnpC31SqI/OovXjE0/qYSnlK+VAElR6RXy3vLnTqTrA4M8r3+QVxtIn/ist2yJBPAIicyRtSY7r2miy2J19Usi2vi111qSM0WAW0h4jqwlWXVVXbStqZNq4le3NGcVA95jJkZkbYnOE9rIinhAlkuvv9aamDX52PDkqKyrbOkJQ3xjvKV9XUxMeswXi2EfF8bWrJMPps7fWNISHOYFI8P8puD0k/8XZLUE8AyJzCXSNbI8ji4Ttf6ZYBoSmCKrSjERmTgxHE6WzcAkZYiUC1enJ0mA0RCkRR6spnl8LIvJG2DKFX6m0WvxMSmeYE2rHJDImvSWanG1Fj7EGo49w69uelY4PX7vkME9Wv2GHJhZmHRAvjxVd0g2gm3m1rZuFQyFHp8ywstTb0mBnDKbFzHwV0UVnx4QK7AauZUr042hjW2/cEGQMY941Vb+2epYiO2T2yBb+todujfC6nNouCsi8k/3i/EBKp4oN7EId5O0gIJPzn9ouSyglT54Wur+QLlqG5XGv5zMXIviyQUs1h0Cy6QA2YqAQ7z/ot2xmasN2CEumKpAQyztwK4IbPHzdcFUBxpjCcC+F7h4lblI6eNpHJf6LYRO/CYr25b4OxQWrUrhzhdSmy9Uo/yuPouqUgQ52pKxnevv3hyfMZ6VqUj+wf8yk1F/ynj6tzuIx4rvr/P+QZIKcmjEy8nMeWW0hSbnkmr9HWFcsEdWcDX1ciIzhS58z5cVOlrlC0c3fDhRvjx8QPZ3BMgs5+NHAsvEuz6zO1bytT4n8K6K9fumGYbHOPxgaeki73qQ5XMmPX+AGjQWKA5IyXMbDKm7rxaB7zMUiGEQvOTVib0yq9t1OpxJ/0MUNaxwS986vVfLYhSyFW6jGzzm04k9MocLDtfmlQx8hu2aOaOI5Sb8cg59u/9N8a5PQsotfcsU1Z0t1EHtuuX/MW0uecJgz1hj912l5/Ow1IHendiC56VdxJL4gN3PhOruPlOyYG40ex1ZrsTLZarcLsonzgusAvh0MwD/XkyvE6+cpsrve5Wanxp7cxXpyg2KXupFeQKFTCAciMxdf1zyquRYUVEktM9luYRTVKlKgjq6KxrHkrmMTewwJbV7XJs680sax4kD6FIr5EZFxQtxH43H6mwwxMpa8Tav5MoPVPPKySSzNT5R4ndWUaZIa7+s5OpC1LU86Es6eN/hKVzGvb8TR6RPKcFFSpLpkayfuuUJiZ8rVcbDEJcv68wrGSgEX9tKC6JaKT5w0RZZCZnZU6eL8yntt7jU7qxLgxG3qaJCmMQaU2cxrB0hNA2K2rq2+wBr3ecdVFqIjc/TM+hN8a/P/CMvWbtz+ITBqMyhnsw9+gFN4JU5+M5ZAk486S6vGvX6olfIqXc8RSZIRZfgRgMrrS8eXbk14uFq9iaHlEhcPkZ88x2KyRJtkyC+Frkhpoe6eKsYP7P0cUcwGnZoOL8wKNcXodM/7FpjUDXE/hFcXVq6mvhVnx+W5Zc0Hu/iQaPikvnMz5Rbh7gf5kPzlu+eACouSKItd6Xi8aWPRVyzUedpBzaPZbz/NlUxtH6feyS/pLFQjuz4iyyTh02fW0JyYeNpjuDO+UaVYC+H/BaTJfOi+jCb/j6F/abwW5fjFztdA/stuwqRtRkjfpE6TzjgX/DE1y9nURbg0FNuaQqwa6Asu2FLaPGaSiVFW9g8z7Lg9+6JRbX0GTzfXMCxOYaA+vP7XUFjir+sTEZWIDe/vP7XUjXNIl8nHapNrWzilMAse7DgGgmSp83MRwny3oq6eOHOLcZ/LNy8u9ekBk/qm+eKaSNM4Ypf5Kr56p0r1v0p98nMTuS9SVOC6L5gELbekQXgTLXZRuOvrPoQdwT24AzZV7qAFWhMtXmdet42h/3SfrEGq5cHIMInbNbTsHk+FzJoO9f0vBScye30/7Zxf8rWTnGh7ZS0bR3f0u2bzgJyNhTLeT96uhV2l9tQwqd6som4HNrnLHaLCoVbIPBjeg6OgOZKBCU6lydQShGy+ffxMlI+r8n6+6Nkrs7Np6Rucvkhw+CDIIPQUFSoIrHWarIYlg4mR22wDh5zJZzSfO1kW8q/Pg+zNLpXBNQbfz0pIGmr20oS+yRlcmnBAOTzRwBFxbAgw6wZDX1scJvSOc6fbSJioG79NUEPkZDz+MZB6SysVbfumqCbRPjr8adF0AQsU9zWl1f3EfBMkeIk4OyEX8nlcUcBi8R/1Q/8Cb7iewUwttCr6NwrmiAw8Q9riUNNERoZ3aNS77ELHaFxmlrimBhrjXNsCLQDAbRPOKo7ClAfEtCejp4udyL+ve57G6m7p6un0909Edg0Dh6SMZBuOCzib6Y/GVk62ToSIluCwfDxbGvHyuWcGQE/DAfEvmjbhqwkb7E+gcSGk/9vFCOILWokXM5dUWH621AD5dI35uq5tir360Ys4zHVpEf3cvLMrd4Bj9XYUkt8M5V/NKSj4bNvib+EBA+kdKr1Mk/kZjbiLg+dtUTJwuUHsyxxzxvKwqNICsF/oLFi+DIm0os5dpsGPqFPiPfrMqnN2MJSZ/JMiDfsiiDDsMg9W6U3VU/audkFhH97z9G8VJK5dOCxkztQs+QdiPGBTwzPvn/qOivliMoUqKJMxJEeJeWqr7LxseKSDxjQniXjvt/DNQ+KhQqFEBVIgkYJy/s3nImtHpNPSr1zY6g5OIMXCA/xm4IdJ//PyCoJQG4sI7JdhX0t9YnZa52NDSvh6Oy6HbYk3OEaDv3ZFwp9dH8B1bA2bMQKjarW20LBjfrTwYvcCCItXp+nWtqdDaWUDlezN0blEsNsntWUaJd5Q21K3Uz4obkKzOJYIq5kOYaYoWyQVpD0DN4Fq9cvNgA+IdF5svZk5zVtdFWsrmHFTA2YxZzP1Bjt6nTY/Pqc8sqwvtfB/aXi3RL2f/eJjPsQ9FwOmif5AvsBurZg1/bCorHd665CS0IrGA+n/iNUuLplEC3O4WN8qYcyybzI+VQvy3gmmC15gJXKzSzCvYkV+pdLCuET5nsgjqn5tM+ZPCbitnEmORsqXTM/uFLC76NQ32XQrTyK8Z4v/3oJA4ZLtBEwHvNc7GgZMD1bG5O3J9VZOwesPoOW+9yfrhzxRO96roZC+gVkZZHIc+cnxl8YYtD2PCfMWKy0dmW5y7riwTXYFRI1JFkJkqNIuU6Y6EG1s9+Q7tCMlZe7s9SOqm0wwpfMpBVDNwxt4yQmF/n7SJ3VZ9Rznv3qL2GJVyclskb0SRx69ehgjL+m0YtCqG4kCXn5kWkYqqyMy6KA/K0/X2Yt96+meDR4ghqlbPIv5d2n3qqZszwqgO2MU01c5X1DR6wSpEecA1w+iI7yDPLLXhvu+sSOKvMwXJjwCoE+RClSXg5SN/QwOJG/6ntJq5Ge9ccKIi3kbUvkmKzfGY4jsTOJa/ix0eKKcBoMyTb/68abiyNt9S3OlivQIJ+SmUNc7zgfe46c14VAkkJm+GTml8fad4jFgWAPr78x6cetPoeeu8lh/8KVrc3EPPLASZhSuNTXiN75hCHCAzEIEmTKyu+uU4mhcjgJgj9f1pDxfTeDHP10dkfIK6qz2ZXJuPTvPvX7B5j0k29FAfwJz3KwOD/ShEXCbwJIEe/dP7+Wr0I7qCRuKe7qY+pTL8a54s3+b6bC4Ye3A1IyhOwZh1/mzvVurLvwhfSYGFrAFQXZdrSWqePTeLZV6uIuIeJojewsaa2jUMRg/3Mfc76E2F1HXuEBdv+7KQ6eoG1jLMY2EY9cKaJp+LkShJQYPNZaL0IZmGbKNH6fB7VdGMCHicXOzsBrV2Z8zh581sR2bL3W4RN5j+v/s5Szd8lMF2o0LnVUNZ6R/k2JRSHT5pTIKPWcnZXPUoKpLRqJ0xbTj0qlFYYi0sKf7ajaSiBEoqvwTRfyCmhFaufYvKoIrvLADysjVCXgxzXBlS3Mnd9q2YuxL/YF18blZyGi4hVPmcU3CxnSbfSCNkIQP2syju5j0Rk698qu91wQCL4ilmCXQpHBfXLlQR6ub9hPv7GdIvxR2KZLIJFEp22B6VSrUCUoIzH+J/HCvYRsmnjDaM5s5iv39rBDnhhFAJXiISKxy1PNHPvj5tHzY35HeiFZS0+/Am3yvsmF7A/QCTYLRGT3t67TRYXSd9gxTzlSKpNZftdtO6qkhVIGBzwDBKxm2dq8QwoayXs+JBm8UWWYCAQPNAtIMFGrFzIzM5ijhGn8rwAaP5PrHOFIidnBIjUeZyDuRln2g4Qgfo5FAGFNcgMk09GwUW5i8kJ25mebv4XG6vJAYI0w+0OSJi7zuPFWxC3CYns8Fd2LL+e29KGXy/kS/Q7ZS6fOGp+G2P8QCVAAitE8AcU/kNbGH0KYmnZnEJRhOJqf0xqC5a2wPuMbEquHvHBJGV0YORbeW6dq4truzWHlMXka4FcydA/58WrJv5WZujVHQ1E8S5TpyC5XRgAYIJIMdwTs5gIkf4ssjOFLLt2jsWzxZn/XlcXwPAvkHJU0p101D1HIASoLlCh0wIpDShh49ytdmGoSdXej39q94zW8tM/3XXTOow5L30xax0R0ASKkUkylBqwJj4WjjZ0CNTlYPOSRilORzP+p6Rgi8P3hl7D2uqmwawepxD+dA22rSr0Z0VUT56Xrzj92yVXaqodpUVkQXhKuB+T/Fph/8SDNl90gUaN3oFisMYrctXMPAEFAsqNrf2xby5k+rI84cFC1SCR7ii3gYs2mG/RHFjh4yZR7qHCxe1dN+ZcdgtXUwKEjSVPoewOcGn6CHadG9LWFBxux2IYE0RQb3/3FpEBY9WUlbtaugaLsvK50mFj3EoXrd3Fkmew6NBgUF1TWC3nhWysc1SB1abk9PAGK91Filgp+fBDHLj/63iCUlKh6ybhBTdzp4qZCLAEmouF7OUoyd/ZpmSp22dG/dhIubBRPj2+wh3wAvR8thGIs11ONSRElzQEm0xBkDczAFrEzN3GQ4EJCttJQRHMfMRoq0vg7jcxpTNRmmzHCIWkmFpPC+M0KzGS5eXGw+yG2BPvMqPuvo0DOvPDVP6aYXltJ7rW0qV+v2Dh1HmoKdXd2pxZrd7XwC8pYwaiQNQDSZlCLxLeWcNzbExw5HPLZBVUoBxghb0LmkeJlHqERRqxigRch1OzD5U9mkw+/l58dLfUUB4YLSSdPqzTLRomMVvqWmlPF+EtUzV/zfFakiEh9yiyLVxl3Ni6b2Y8KhR6Ev3jawFbPBwMVsslRUwpH5c1ARp0now7obeZkcj+C/oYFKiMGWxhZmkkNnlPI33E0sJoqHmkM2FrYJPBjWtCZNDxbNzqjFxV0dzm8aErfM+7DXZNqhgoGkXx/bc2o/f1DJFDeHCg38StUanpKHJZg9JBUxY3MiJg04ZIAT8EoF0clYUZEYrMhZoljkCORpl4tggsDp1+m8yqFdb31wBlSbqFxKvhSgULoIXQzvWqPalaqb2q9VyjyuAVz29vn2jeljaxkh5vN/Xw88/28YhYIgjjCi7jJbsAt6omI8vprKuXMzTSwG2Wd+v0DiwIc4QGTumd7Xt6iDE/RPvaNaQtebdeBbP9bQDh9XSpzrduir6m3fDT+pzyZl7lHqfagDsG7+VLCjTWEHMK/lTIizDW6Y34m11crqBrx8Eh+ebSYK+LlBEjQZRb9e7IAJyhE1qhGkMM3XhYiSX/U0Sao/LZymRqwbmZ8GU5/vO4hk/MbT/KyxtPuMA9VpHTrB+ZXG4Se1eWb/pdl+bzPh3oVXkOCp/CoRDzYK9TJPSwfcuX8/KeFhOM/3y+1AB+b+c2sP/4MUIlPaOQ3GOy2p60U7n2edNJhjtbr1rEm3Ny62a0icTKomKVOXwOfuCthFnok+bMnsxbNqAU6mrnNsod/1BGJwzS68k8f9SbNLTA5YQvtOOVqhaaJwnrw21kraQZSqIW5dyFW6uUP9qvbUDW7KVkbEok8MVFbn2rEY2LVKP3LhA3XSCWfXaXyVWyRGq4SOC2vgCUratDSee+RSIVpF0Vta2OFzZKIAg55AKFmztiqP/400wh/08jHGOzU01YK/j6/RF8oczbEPpsub+6nQcNsUAT64+URG8nj42JyhTxYLrdpffRPq9mCleZHxx/RGMN0oW6XhLPFZ/8gw+tVeEmY1CCKRWTALRow/M89VP5LCH1ERC4Z4oLXCLkqgae4p79Q8E9Qs30NVbXPc/fKjkLap3ZjNWh0mzOCsJV3QWLlMrdffZ4dGZKZhWVBUwdjvjkAHskF6MrJdAQv21gX4IHASINJ3Wuu3TX9o0PVp8dkFq+XOQ19VrD8sDmQnefDFkAvLrRF0IqLcUlaljGUP5aheMpbf62IPVq+62UN/TWUt7RSKL31SO7s93D/gTBMAtjZ8q+HVzGnTL+sQJ6ETAY+26zy1QH0Pes25oThbcXe7yObH94Z6VJ7JQhDZPkgVhXty5MXA5esy9QR6nIqfnyxqaLnEA38yiuF8lsMvmPSze2eGL77Kt/yZD2fFX3fVccnZ+oYZM7nVGctVPzeK9hX1e0vpeyIC26syCL1+ZUdXJGrstekC6eLNZjYIwC5i3ZrLNhJJUZA0bA7K8vyXctzBg1BOK7MbzH1HTGPyoiXVjn22ftFUFFeLRQ7rKM/GL2TmTbBh6rD71vLVkvm5cAO7MCOyrHhuGwnnqX6qMi60i7ssI78VGp+mqnO7Odx0OSEcHsBJO3F8vd3uUThY3rjNqcqgh3YgR0zHK/y0D7sMmjy2OGQGU4NRudeA3Bq8sTS/DSV2Zfl9nXIkYFNXR4mT51L8sNSnUW3+USCf/O4IsNiwW2KEC4JpeogMi0rIi3fh/OFQ1d+4RkqRCAmXNQCKdnlEjZowiAZrgjBy/Lqodz5dVm4MXmkSVqpLb21t3ekllS3OI6Lz9jEZ9rIZjYTPX72mM9E9YgSZRNRokTZrI3ayCY2sZlNfMYmNhGt5kO9tFEbtZHPXMOtIKUmz+UNmQFrAOom65WHhtv9L53jdJtT3e05ovtf+BiA023y7WUdGXKEYVP/ssxNuNzaojPhOkloTvOTSRPomILu9qaLh+rRwsDOznvwqXM9uh5ni8qUd4SZWNZoMUlb3MSVpdTZHpAAZb/FTO50Z8tvy3foeLhOGdwfvRDYXQ4V3K1sGRBwkQcBO3Dfepk2aOKDJOBbeYUGhC8CksLVgm1M8Gk7hgQgGW787nOlBkjchnCLn05I7jSWT1jN5le8WWKqzF3XEUjmkjNyvN4AfXLXPsj5lbOpY7FQz47b70DIlwUxt2Kf3Pe4kTCUavkgbovAPS/GVElBV6cxPfvozj3WFSXI8C2UX9TtaupqKUo30qhJN8qmN/fF7SBLaSGk+BcOA4Lru19sLn2XeRLxRfAw5CXTjU9WTG22uUeJNrqANsExNrY0/CHP1MPcIyF7sHCQ6mAfflA/cABxGwe8tkjVCvuMj1KrxJ02FUvrK2frKbJK3jsMvpUUJugMWqelqvKMVbP2OfWw0aZ3W+WrjGc7wdhMaLNZ6Vm99c2bNgG+N8v3ml9mpzkH68vsf1MToY5Z9KuOa3HtQk2s5qgV4JLscpaNNELgFq4QcFVX92kPN2C2fHGp0c8EOK5QuGGbFf/Jq74oi19+TclG5Tc7gfxdQU67UfbYDZS9pu6Y+1QK5f5cQjGgsBkcAOQhnVGOZBGg+4FwNFqM6ZTH1USeUNwVkzYfTaXcR0JY4xZyuRzXyc0TeMzB/Lcr4iN6lSRLniAROk2ysHcuQw9RN0/BPhzAH2b8FSVlfNmbHbgxQSAjHxwNzRl71PreiTdv1P9qtxMDDo4rfTXfU4zMA8pbut0tewX184fYJnVX7levPnSLz1Er/nmUOOuJB9cSprKVR43gP8hzG51ceMMnV6i8vT7yOxID+T05VHygsWinGTrgOnfy+Fl08fTsI2z+U1Q+vT2F2vv6/U/fgQDQ7/eA66GXUHX+TaXH/x365yR+/fTO4fyDM/9zT+D8//1o/9Gxt3k09g3eN+FX5GOYAfBfi15N37/wPdllffq56oTMYgePLYT/Rh27YG2Ocym5KMfIj47BNeGCr1aA51AzDiThEkjaSyfmSF2MGRXdJaWxZumL5wfnB5tTqXHzdGV2cxawuWgtNtZy6ljLKrI7sAqiWUKT6NBhqKXDV4jAmUCOkBCo5bxGIYSUsCxp+M6BHmPCsomFJdHsYx5fdtilcXUVi2y/GNj18LIGi4Cq4RCnHhI7Sq70tCZKKTFl1kq4SdQ6EEK/L40oSAnC+BKIEimaIx8xiEIUoigl9yX/p052pwZqrSJQJ1+7E+FbSH9qI3/yJ3/y91Lxh/QZKcFrJX8fE/tchO+t1/ISvNMHqZrm06W7dMKgRPInf/K3/iMrw3u4lTppDvdDhZQYu4Dw0MpeSJUYWanqDl8hpNSGg3O+N1p4bZyTtYsPyT5X/A8IKd0T525zihUNQQVDA3y6pPSSIkKb03mp6SWszDyEmRXFj5pNlWs2JmBxCEZoR8CoUQ3gKwRboGIcnBMsgzEtq9m4Zk2O+MlHCHm6mJNJpTloYcQ4v5V0Rb50JmkBMttpRvY0SQRF5rLW9HOu9m6ahPBBJ5+J9Z2kBq0z633ta0gdX6VrGE+Tm3MCbJpxIClUCy+ly6hNMJ6GCkGjoc1pFJmEBDUa4DMFQRJfDk9LOT2kNeePar1tTR/1lz2t9zg0/Gg0hU0wIoOrJqrv4zVEkEUtXDxCqBlA8mzCFghRuYw852iljaKL23LsHlOS5yhkzYxtG9Rl/1CLUkLhXBfaEVhVoHbjrEMwgRqXRgZBGRCCBUNdfXyN4BLVV8KSRy0lUMuJ5niXqm7iKVmIU0HV8BjNiKdKhs9t+MMcqwFDtk57QY2Yo8iBZMmQCFvE1jCCrDHtGdXU51JzH68huEQ14GIKoS4AzFmjbgP8ZWizb0MXvbNWrOFj5qjVMqdZrzbV/iVxAzphLfyaIfBW2H1dldTFDiSpmhAb/zhQEwmHquSgTttJNUIl28uNM3XkCFwVNH+OR6EGl8SeS6eWtr0utQ539p3z/vI/3PRvsl3/k8/QpivzZ5CbeM/hJRByTp+BmB3/yV2tXwaHVyYMKLx74mnnvv97ddMuTkvPMdiFxSmI3HuG8Ocf7tr3g/K5hmO7e2U97/AIvDe07lNTCApF/5LOJBbqDbleSxpbeVSzUdFwj53gIyrO15e4dOkSK6FbRt/h8ucebof7IqjCt3cjakcZ6CHWJbyFfubUCLVOYFAsZqi1GCmo4fBgYLGUgT4SEpRbrfIFQwBw1ueBP5aM7W90ghgFAD5/hUsAAPofXsR/GasKZ+qjs0BgDxLtn+YzT/1Vgy8TxDZ8Py3+Ta54iNB1m8WEVd2UyfaXGM1YMLIvR0hl4FkKHtVIegApS8GNFdyuQMHRgLyC+tTr/YZaMbiglJmqYoUociIUF0DUEX0ITQWuO5A0CUKc4TKEKhvBMVeH0+Sg9UkuNk0gWZKh9BrrwecF41ORtCrCWKXk7DW5VBgrOcArcqUHGC88VfbusmVdyZ7r4wH+v7Gm/cYA0sj3OkM5/Zy2CWcIhfyHJIWn2WJP5UW0KP6ETIFi5CjiNsq8QoAG1NmE1PKo9+9HBJARgaz4qM0YFtbzjD6w2YUCI+N9EQlYto0/jFZOCtLzIPalNBsBXYxq+1bj1wAvjlC3shC80x5KQittRejrKHsZWJTPSax8Jy+8iEit7QY0HKgJj2RJhtJrko5ihG810tkpAujoFKmJ9Ehd8/FahNWjunokmdzECZlA95G6+APvCDOEsltQsDC3vVjLwWtJwCYtdgrvF01hZsCnTHgYhB81mpLZv2z8r0zEOMskbJFbIt9xcM9wN8rNXYQfL545Hia3fL/z0Bd12HvuAAfdSUh66cAFUMh3HCRD6flYi4fCXcmdeTW7p0RtV/bcUjoi32PSCr5HlxWYGIcSjQ3VC1rRymZSvawHnElPNSigH1G5rTULbIxAsuZ/LIMaM0z5B+4gredumDPmBAH/U8DERmXkySXoIEON1QgJFoAnrOiAETTBU/RiFlYP5BbPeSVm0TmI/pPY+Zu3n3ekyhVgdkB8nY/pF6ytWTe8S40KZSqxYn/I8am+WOL/b7ILJvF94wZCF22Gq//AkyZ1kFVukeVtBCvzgiBr5n8nUitqST6lJsZILRuAivu+IlLL7xnn2CuWsEuaG+JSlmQoPbXcpTbjp8QNrHLHK7uaEall2eBnPhThHlzVEQsaeEQvJW/DZRyAOeaxhLFgoQ576m0j6Y7StN1YqCdgzfYEbyL6B4ZqhEtH5OJf6H8/YsKVOytJ/nhUJ3BQPdZR1uo/9NskrQXLvbUhfxTD8pvSfodQtn8CWOVBPTDno8ZbAPoctufNAAePKcVwan+fBzS2ts7LIbSqeWtnxNXOkOOIBo54Y4w/iK4g856MYt6jc0THYMI8S1xD1rNNYoPV/uXJjCP7IiXPBKgQ57if7v88xBJsfnyG//slhPLAsjWhlsVVtPcuhRxe1h9pl1QfHfi7BFqPS18Yl+2gDWP0YIPTNn9OS3CS3DsOFtjjeV1knRY8O++ftt1umPs3GTJxnXXjtbZLUQmq4sra7RFzieqh7yRmq8CEAP4NPejeoa3umuCK3DJ2fUfGPqQkk25EJqlujBlvN8HC226SpvJuCjEp3VSqXJ/EpEfuWRAJPIS6KcCFR+nz/gI4iBQtnLcwuwXzEytoKX9UIDp2M5+njRLDiEYcw3ekglMVu5X6q4LnWl1KBXbGHFmyl1axrrZ/KqIX7+C/1f63sp8alwSBTxvGW7RdOlpKRfbvT4Y2dZo0bXz0ytBcmXsmmbrkyj+sOB5ldc2YnkZmehrU5npnlMOiDaMClKZr7WgzhX+dkHJSHCmk0L7Pkrn9JpN9JD8/y3AV+CI23s/nTaxWX5HCaYgQTRlgGl6LhjXEaiuwAfa9QpwytP2PWvg3QIkUBSPGTJgyY86CJSvWbOgMoiQrqqYbpmU7rucHYRQnaZYXZVU3bdcP4zQv67Yf53U/r/fni+EESdEMy/GCKMmKqumGadmO6/lBGMVJmuVFWdVN2/XDOM3Luu3H0/lyvd0fz9f78/0BIAQjKIYTJEUzLMcLoiQrqqYbpmU7rucHYRQnaZYXZVU3bdcP4zQv67Yf53U/7/e7uLy6vrm9u38w3kDTsh1wPT9AtXqj2Wp3uj38SMIoTtIsp4wLWZRV//fnj72s+HmYTzFWW2NuYSuHK8UTiCQyhUqjM0Ami82BuDy+QCgSS6QyuUKp+p+vO0R0eoPRZLZYbXaHE0ZcbtTzc2Tjt0qwUPjHcp6xdDyRLCtPpSsqq6prauvqGxqbmlta29o7Orsmdvf09vUPTJo8OGXqtOlDM2YOz5o9ZwQAIRhBMZwgKZphOV4QJVlRNd0wLdtxPT8IozhJs7woq7ppu34Yp3lZt/04r/t5v9/F5dX1ze3d/YNhWrYDrucHqFZv/AzPP5xnOWVcyKKs+r8/laRZXpRV3bQfFTJJkWIlSpUpV6FSlWo1cgVRkhVV0w3Tsh3X84MwipM0y4uyqpu264dxmpd124/zuh91+Hp/vhhOkBTNsBwviJKsqJpumJbtuJ4fhFGcpFlelFXdtF0/jNO8rNt+PJ0v19v98Xy9P98fAEIwgmI4QVI0w3K8IEqyomq6YVq243p+EEZxkmZ5UVZ103b9ME7zsm77cV73836/i8ur65vbu/sHw7RsB1zPD1Ct3mi22p1uDz+SMIqTNPqE/O9yaT799qbg6unjxxam5J7BFZN7WShT8iRlXkEGjmBIEd3DT2X2lIpKyq9OrnTTT6VTX2PmqFacacb6yhbdwOANxOKKR38cAiue/XnyXqded99LrU1T+lx+J+F6F+UYi227rWTaYhTR+deNdUTU+ZiVRlm4UamJacmSuo5WSS0Q2JG2tjY2s5z4t/GTye0CF6CrK7Hs89R455nB834rOftUr/lueUIxwRdk1exyTq0Nc37OG4NJpgu+OzQl8RqOsYMbS+kbzrET82l+Gq6awWjsZSd/Usdukv5NO1UjjavgkwjeNr4N67VoPDOHzNy/s1nKaVz43TDKaV49RaXt/nNdcH9DOaf7Hur+PFerchOvb+7gUdbcXaOsga5JTdq5avHjx2/6Sb/ogR7piZ7p5bevV5JigAxeZFZS3x2Z8YzcBdlmVur43WsNBpJm3BW9MGI/DURG/k9IdgYWHoD2gRZn2rqPuJFX6d4T3UjnPbEmSYqYoz0g0MzDQKkAAobu77hVHMxOeTtFhtD1vfCBHtzTEK+3rTc6HR77ymE/uc1sEPbTvEM4A09xiyC0DUxbWG9gvYexRcY6lQ0ycLYHBJp5GCgVQMA43RuKioPZKW8RdLp2sN4gkIbjYvEu90/Uq/M/vaBVc8t+6yUrNjS0zS1E2544feBd5EZPOFO+lGQaQctITlxOkVSFKgB0yP42skq92ZKtPbOuyQexd4//Uu7k2IzJJ/VWIPKwtxyLbTgDC42g1gJbMkbEAXFEzFglB2TgbA+oyCIMpUbYAQVGEHaZEVRsBGoZyajPXLaSYsLFazmnYkwpuzW/bZNKPWzCXuuwcsCPpwAUKAAgIFCgQClQoJQCBQpAqTOogSUgtxwIZ2ChEdRawLTFyMBIxqp3QAbO9oCKLHqiLLXACHuNA+K1zAgqNgK1jGT0z0e2EiIdVt6sQDtvQAQERHQGOgMBAQEQEAAQEBABnEWhRtSoEZGRUaNGrVGj1ho1akStz6iHNz0j7C0HwhlYaAS1FtiSMT48nrHKARk42wMqsuiPspRTC4yw1zggXsuMoGIjUMtIRn0+spUQ6bDy5lbRiDHEEGPsjNgZMcQQQ4ghhhBiiCHGEGIh/tLrja66xAMItHh5zdwcKH9rS/ZCDTdraybiayciLxFplqgk0hgUdcgeonhYzgwx5w7KoTuKZW4MT/2uHqr1Y88mzLmN+mH7vozxqT+VailtP0zmTWGPUc7expNd6umSEo3SaM2zRUBENUnKA4i2E6Q1wSN9Q4mknmckfWMZYkbhEHdCeZ/OhpKyi7MdmxI9l6bmAejsZ/zt9JTNL2YxlzvZsc0SZcm+GFuUArdcS2BvYiOqnuLNEm170JK0IleASlplADBhynTiY+1QDB2Ah71Z24LxZjY78sx4ZXx08u4KKVWn5JB72VCNdDDvy+OH7gqme9S12BygOYrR8KzdIM87RZxKsxzWzw3amaDgEXdsbvMRbtqM6/NFtkQNzbSFqJnPd4/38v5M/4rB5whvh/WymQRufvG7Cb9EHNu6spk/8e146TOJVygl91cIjEHOYb72a7/+XW6urJ+eD90r997m4+oIe4Lzv7+dnmZXH/z3b/VrvxGPFV9slLZQbe4ssVxQE5M+B3Ng0DvMI2I1osQIlMd0DlFdmk5kcuUTVm/vbOG5/AVplw/FNOyvFgJ2EDhg5SHBMGJSaKHQrmPQrEY7RfGqCJfCqAt8T3TUJ9KXlil7rpCDM6KcoPdmwltjvFBYQkB2hgCVc2WJVK6YHOIgygnSTj5zv9xw9krYy1+y1LnOfYR+s7YnqLFBImZ+IWiRppptZDuOcH/DRq219zHR0lg7MWhvTTV9f0caVCv/6zdq0DaGH8BmaIbv74w09a73C4E1tuY10wvBanbj+lbog/yCOzH5BFKQhlI8n/TuOPsTo5T2X2amWfDD7yjIjxidRT/UO2Nvo7ebOaOt4IVblYw76JyX0wNe1vhKu245N8VUd4WRXu8iU1MduomLI96s7h8YHIqCRpQKoWv6EsMdla397ZJskEmUbLRv8dSDiq3n9p0fSi/KC9lw3vvx8PHqanUzucxWYYttdMMIO8tsjlcorYqd43hd0G0ncwHtiTGIPVLZ/xIurEZDUg9idg0rSSjab6JtI7nPhWuBsm//IT0O";
var MENU_JS = `(function(){
  var sel='details.mm[name="ask-menu"]';
  function all(){return Array.prototype.slice.call(document.querySelectorAll(sel));}
  function closeOthers(except){all().forEach(function(d){if(d!==except&&d.open)d.open=false;});}
  document.addEventListener('toggle',function(e){
    var d=e.target;if(d&&d.matches&&d.matches(sel)&&d.open)closeOthers(d);
  },true);
  document.addEventListener('click',function(e){
    var open=all().filter(function(d){return d.open;});if(!open.length)return;
    if(!e.target.closest(sel))closeOthers(null);
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){var o=all().filter(function(d){return d.open;});if(o.length){closeOthers(null);}}
  });
  // Web Share \u2014 native sheet on phones, copy-link fallback on desktop.
  document.addEventListener('click',function(e){
    var btn=e.target.closest&&e.target.closest('.shr');if(!btn)return;
    e.preventDefault();
    var data={title:document.title,text:btn.getAttribute('data-share')||document.title,url:location.href};
    if(navigator.share){navigator.share(data).catch(function(){});return;}
    var done=function(){var t=btn.getAttribute('title');btn.setAttribute('title','Link copied');btn.classList.add('shr-ok');setTimeout(function(){btn.setAttribute('title',t||'');btn.classList.remove('shr-ok');},1600);};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(location.href).then(done).catch(done);}
    else{try{var i=document.createElement('input');i.value=location.href;document.body.appendChild(i);i.select();document.execCommand('copy');document.body.removeChild(i);done();}catch(_){}}
  });
})();`;
var C3 = CONTACT;
var WAN4 = "+91\xA09100\xA0181\xA0181";
var d10 = /* @__PURE__ */ __name2((s) => (s || "").slice(0, 10), "d10");
var KIND_DIM = {
  condition: ["Conditions", "/conditions"],
  condition_page: ["Conditions", "/conditions"],
  skill: ["Skills", "/skills"],
  skill_page: ["Skills", "/skills"],
  ability: ["Abilities", "/abilities"],
  ability_page: ["Abilities", "/abilities"],
  domain: ["Domains", "/domains"],
  dd_domain: ["Domains", "/domains"],
  age: ["Ages & stages", "/ages"],
  age_band: ["Ages & stages", "/ages"],
  age_page: ["Ages & stages", "/ages"],
  lifeskill: ["Life skills", "/life-skills"],
  life_skill: ["Life skills", "/life-skills"],
  assessment: ["Assessments", "/assessments"],
  instrument: ["Assessments", "/assessments"],
  assessment_instrument: ["Assessments", "/assessments"],
  readiness: ["Readiness", "/readiness"],
  readiness_index: ["Readiness", "/readiness"],
  phenomenon: ["Behaviours", "/lens/phenomenon"],
  phenomenon_page: ["Behaviours", "/lens/phenomenon"],
  material: ["Materials", "/materials"],
  material_page: ["Materials", "/materials"],
  technique: ["Techniques", "/how-to"],
  technique_page: ["Techniques", "/how-to"],
  stakeholder: ["For families", "/lens/stakeholder"]
};
var DOMAIN_LABEL = {
  motor: "Motor",
  communication: "Communication",
  cognitive: "Cognitive",
  cognition: "Cognitive",
  social: "Social",
  "social-emotional": "Social-Emotional",
  emotional: "Emotional",
  behaviour: "Behaviour",
  behavioural: "Behaviour",
  sensory: "Sensory",
  adaptive: "Adaptive",
  language: "Language",
  speech: "Speech",
  "self-care": "Self-care"
};
var codeSys = /* @__PURE__ */ __name2((c) => /^[bdes]\d/i.test(String(c)) ? "WHO ICF" : "WHO ICD-11", "codeSys");
function atomTags(a) {
  const B2 = "/ask", tags = [];
  const topicHref = a.parent && a.parent.category && a.parent.category.url || a.entity && a.entity.slug && B2 + "/" + a.entity.slug;
  if (a.entity && a.entity.name) tags.push({ k: "Topic", label: a.entity.name, href: topicHref, lead: true });
  const dim = a.entity && KIND_DIM[a.entity.kind];
  if (dim) tags.push({ k: "In", label: dim[0], href: B2 + dim[1] });
  const dl = a.primary_domain && (DOMAIN_LABEL[a.primary_domain] || a.primary_domain.replace(/(^|[-_])(\w)/g, (m, p, c) => (p ? " " : "") + c.toUpperCase()));
  if (dl) tags.push({ k: "Domain", label: dl, href: B2 + "/domains" });
  for (const c of a.about_codes || []) if (c) tags.push({ k: codeSys(c), label: String(c) });
  if (a.persona === "parent") tags.push({ k: "For", label: "Parents", href: B2 + "/lens/stakeholder" });
  return tags;
}
__name(atomTags, "atomTags");
__name2(atomTags, "atomTags");
function atomSchema(a, ctx) {
  const O = ctx.env.CANONICAL_ORIGIN, BASE = `${O}${ctx.env.ASK_BASE}`;
  const url = a.canonical || ctx.canonical;
  const faq = (a.faq || []).filter((f) => f && f.q && f.a).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }));
  const node = {
    "@type": ["MedicalWebPage", "FAQPage"],
    "@id": `${url}#webpage`,
    url,
    name: a.h1 || a.question,
    headline: a.h1 || a.question,
    description: a.meta_description || a.summary,
    inLanguage: ctx.lang,
    author: { "@id": `${O}/#org` },
    publisher: { "@id": `${O}/#org` },
    audience: { "@type": "MedicalAudience", audienceType: "Parent" },
    reviewedBy: { "@type": "Organization", name: a.eeat && a.eeat.developed_by || "SETU Consortium \xB7 Pinnacle Blooms Network" },
    datePublished: d10(a.published_at),
    dateModified: d10(a.last_reviewed_at || a.published_at),
    lastReviewed: d10(a.last_reviewed_at),
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".answer-summary", ".answer-inshort"] }
  };
  const B2 = ctx.env.ASK_BASE, dim = a.entity && KIND_DIM[a.entity.kind], dimUrl = dim ? `${O}${B2}${dim[1]}` : null;
  const dl = a.primary_domain && (DOMAIN_LABEL[a.primary_domain] || a.primary_domain);
  const about = [];
  if (a.entity && a.entity.name) about.push({ "@type": "Thing", name: a.entity.name });
  if (dl) about.push({ "@type": "Thing", name: dl });
  for (const c of a.about_codes || []) if (c) about.push({ "@type": "MedicalCode", codeValue: String(c), codingSystem: codeSys(c) });
  if (about.length) node.about = about.length === 1 ? about[0] : about;
  node.keywords = atomTags(a).map((t) => t.label).join(", ");
  const parts = [{ "@id": `${BASE}#website` }];
  if (dimUrl) parts.push({ "@type": "CollectionPage", name: dim[0], url: dimUrl });
  node.isPartOf = parts;
  const mentions = [];
  if (dimUrl) mentions.push({ "@type": "WebPage", name: dim[0], url: dimUrl });
  if (dl) mentions.push({ "@type": "WebPage", name: "Domains", url: `${O}${B2}/domains` });
  if (a.parent && a.parent.category) mentions.push({ "@type": "WebPage", name: a.parent.category.label, url: O + a.parent.category.url });
  if (mentions.length) node.mentions = mentions;
  if (faq.length) node.mainEntity = faq;
  const crumbs = [{ name: "Ask Pinnacle", url: ctx.L(ctx.env.ASK_BASE) }];
  if (a.parent && a.parent.category) crumbs.push({ name: a.parent.category.label, url: O + a.parent.category.url });
  crumbs.push({ name: a.h1 || a.question, url });
  const bc = { "@type": "BreadcrumbList", itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })) };
  return { "@context": "https://schema.org", "@graph": [node, bc] };
}
__name(atomSchema, "atomSchema");
__name2(atomSchema, "atomSchema");
function atomCta(a, ctx) {
  const enroll = "https://pinnacleblooms.org/enroll";
  return `<div class="atom-cta">
    <a class="hbtn hbtn-go" href="${enroll}">Book a free developmental check</a>
    <a class="hbtn hbtn-go" href="https://wa.me/${C3.wa}">WhatsApp ${WAN4}</a>
    <a class="hbtn" href="${ctx.L(ctx.env.ASK_BASE + "/abilityscore")}">What is AbilityScore\xAE</a>
    <a class="hbtn" href="https://pinnacleblooms.org/centers">Find a centre</a>
  </div>`;
}
__name(atomCta, "atomCta");
__name2(atomCta, "atomCta");
function atomPage(ctx, a) {
  ctx.ogKicker = a.entity && a.entity.name || "Ask Pinnacle";
  ctx.ogChips = atomTags(a).map((t) => t.label).slice(0, 4);
  ctx.ogCodes = (a.about_codes || []).slice(0, 4).map(String);
  ctx.ogTitle = a.h1 || a.question;
  const O = ctx.env.CANONICAL_ORIGIN, B2 = ctx.env.ASK_BASE, env = ctx.env;
  const crumbs = [{ name: "Ask Pinnacle", href: ctx.L(B2) }];
  if (a.parent && a.parent.category) crumbs.push({ name: a.parent.category.label, href: O + a.parent.category.url });
  const crumbHtml = `<nav class="atom-crumbs" aria-label="Breadcrumb">${crumbs.map((c) => `<a href="${c.href}">${esc(c.name)}</a>`).join('<span aria-hidden="true">\u203A</span>')}<span aria-hidden="true">\u203A</span><span class="cur">${esc(a.h1 || a.question)}</span></nav>`;
  const cards = [];
  if (a.what_to_watch) cards.push(`<div class="atom-card"><h3>What to watch</h3><p>${esc(a.what_to_watch)}</p></div>`);
  if (a.everyday_tip) cards.push(`<div class="atom-card"><h3>Try this at home</h3><p>${esc(a.everyday_tip)}</p></div>`);
  const cardsHtml = cards.length ? `<div class="atom-cards">${cards.join("")}</div>` : "";
  const sources = (a.authority_links || []).filter((s) => s && s.url).map((s) => `<li><a href="${esc(s.url)}" rel="nofollow noopener" target="_blank">${esc(s.label || s.url)}</a></li>`).join("");
  const sourcesHtml = sources ? `<section class="atom-sources"><h2>Trusted sources</h2><ul>${sources}</ul></section>` : "";
  const faqHtml = (a.faq || []).filter((f) => f && f.q && f.a).length ? `<section class="atom-faq"><h2>Frequently asked</h2>${a.faq.filter((f) => f && f.q && f.a).map((f) => `<details><summary>${esc(f.q)}</summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`).join("")}</section>` : "";
  const related = (a.related || []).filter((r) => r && r.slug && r.title).slice(0, 8);
  const relatedHtml = related.length ? `<section class="atom-related"><h2>Related questions</h2><div class="atom-rel-grid">${related.map((r) => `<a class="vdoor" href="${ctx.L(B2 + "/" + r.slug)}"><b>${esc(r.title)}</b></a>`).join("")}</div></section>` : "";
  const dev = a.eeat && a.eeat.developed_by || "SETU Consortium \xB7 Pinnacle Blooms Network";
  const reviewed = d10(a.last_reviewed_at);
  const eeat = `<section class="atom-eeat"><p><span class="eeat-k">Developed by</span> ${esc(dev)}${reviewed ? ` \xB7 <span class="eeat-k">Last reviewed</span> ${esc(reviewed)}` : ""}${a.eeat && a.eeat.review_cadence_days ? ` \xB7 reviewed every ${a.eeat.review_cadence_days} days` : ""}</p>
    <p class="eeat-disc">This is general information, not a diagnosis. A clinical AbilityScore\xAE and any diagnosis are formed only at a Pinnacle Blooms Network centre, under qualified clinician care.</p></section>`;
  if (ctx.pageSchema) ctx.pageSchema.push(atomSchema(a, ctx));
  ctx.main = `
  ${crumbHtml}
  <article class="atom">
    <header class="atom-head">
      ${a.entity && a.entity.name ? `<p class="atom-kicker">${esc(a.entity.name)}</p>` : `<p class="atom-kicker">Ask Pinnacle</p>`}
      <h1 class="atom-h1">${esc(a.h1 || a.question)}</h1>
      ${a.summary ? `<p class="answer-summary">${esc(a.summary)}</p>` : ""}
      ${tagStrip(ctx, atomTags(a), "This question belongs to", "atom-tags")}
    </header>
    ${a.slug ? `<figure class="atom-figure"><img src="${O}${B2}/${esc(a.slug)}.svg" alt="${esc(a.h1 || a.question)}" width="1200" height="630" loading="lazy" decoding="async"><figcaption>${esc(a.og_title || a.h1 || a.question)} \u2014 Ask Pinnacle, the Child Development Ko\u015Ba</figcaption></figure>` : ""}
    ${atomCta(a, ctx)}
    <div class="answer-body answer-inshort">${md(a.answer_md || "", env)}</div>
    ${cardsHtml}
    ${sourcesHtml}
    ${eeat}
    ${faqHtml}
    ${atomCta(a, ctx)}
    ${relatedHtml}
    ${a.slug ? `<footer class="atom-imgfoot"><a href="${O}${B2}/${esc(a.slug)}.svg" rel="image_src">Share card \xB7 ${esc(a.og_title || a.h1 || a.question)}</a></footer>` : ""}
  </article>`;
  return ctx.main;
}
__name(atomPage, "atomPage");
__name2(atomPage, "atomPage");
function atomMeta(a, ctx) {
  const O = ctx.env.CANONICAL_ORIGIN, B2 = ctx.env.ASK_BASE;
  const canonical = a.canonical || ctx.canonical;
  const hreflang = a.i18n && a.i18n.alternates && a.i18n.alternates.length ? [...a.i18n.alternates.map((x) => ({ code: x.lang, href: x.href })), { code: "x-default", href: a.i18n.x_default || canonical }] : [{ code: "en", href: canonical }, { code: "x-default", href: canonical }];
  return {
    title: a.meta_title || a.h1 || a.question,
    desc: a.meta_description || a.summary || "",
    canonical,
    hreflang,
    ogImage: a.slug ? `${O}${B2}/${a.slug}.png` : null,
    // slug-keyed PNG, rendered+R2-cached by the worker route
    ogImageSvg: a.slug ? `${O}${B2}/${a.slug}.svg` : null,
    // slug-keyed SVG twin
    robots: a.meta_robots || null,
    noindex: a.index_state ? a.index_state !== "indexable" : false
  };
}
__name(atomMeta, "atomMeta");
__name2(atomMeta, "atomMeta");
var SITEMAP_XSL = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en"><head><meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Pinnacle ASK \u2014 Sitemap</title>
    <style>
      :root{--ink:#0a0a0a;--red:#c8102e;--line:#e6e6e6;--muted:#6b6b6b}
      *{box-sizing:border-box}
      body{margin:0;font:15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:#fff}
      header{background:#0a0a0a;color:#fff;padding:22px 28px}
      header b{font-size:19px;font-weight:800}header b span{color:var(--red)}
      header .sub{color:#cfcfcf;font-size:13px;margin-top:4px}
      .wrap{padding:22px 28px;max-width:1100px}
      .count{font-size:13px;color:var(--muted);margin:0 0 14px}
      .count b{color:var(--red)}
      table{border-collapse:collapse;width:100%;font-size:13px}
      th{text-align:left;border-bottom:2px solid var(--ink);padding:8px 10px;font-weight:700}
      td{border-bottom:1px solid var(--line);padding:7px 10px;vertical-align:top}
      td a{color:#0a0a0a;text-decoration:none}td a:hover{color:var(--red);text-decoration:underline}
      .lm{color:var(--muted);white-space:nowrap}
      tr:hover td{background:#fafafa}
      .num{color:var(--muted);width:48px;text-align:right}
    </style></head>
    <body>
    <header><b>Pinnacle<span>\xAE</span> ASK<sup>\u2122</sup> \u2014 Sitemap</b>
      <div class="sub">Child Development Ko\u015Ba \xB7 machine-readable index for search &amp; AI crawlers</div></header>
    <div class="wrap">
      <xsl:apply-templates select="s:sitemapindex"/>
      <xsl:apply-templates select="s:urlset"/>
    </div>
    </body></html>
  </xsl:template>

  <!-- sitemap index view -->
  <xsl:template match="s:sitemapindex">
    <p class="count"><b><xsl:value-of select="count(s:sitemap)"/></b> sub-sitemaps</p>
    <table><tr><th class="num">#</th><th>Sitemap</th><th>Last modified</th></tr>
      <xsl:for-each select="s:sitemap">
        <tr><td class="num"><xsl:value-of select="position()"/></td>
          <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
          <td class="lm"><xsl:value-of select="s:lastmod"/></td></tr>
      </xsl:for-each>
    </table>
  </xsl:template>

  <!-- urlset (shard) view -->
  <xsl:template match="s:urlset">
    <p class="count"><b><xsl:value-of select="count(s:url)"/></b> URLs in this sitemap</p>
    <table><tr><th class="num">#</th><th>URL</th><th>Last modified</th></tr>
      <xsl:for-each select="s:url">
        <tr><td class="num"><xsl:value-of select="position()"/></td>
          <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
          <td class="lm"><xsl:value-of select="s:lastmod"/></td></tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>`;
var SEC_HEADERS = {
  "content-security-policy": "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.co.in https://www.gstatic.com; connect-src 'self' https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://www.google.com https://www.google.co.in https://ad.doubleclick.net https://*.google-analytics.com; frame-src 'self' https://www.googletagmanager.com; base-uri 'self'; form-action 'self' https://pinnacleblooms.org; frame-ancestors 'self'",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "geolocation=(), microphone=(), camera=()",
  "strict-transport-security": "max-age=31536000; includeSubDomains; preload"
};
var GADS_HEAD = `<script async src="https://www.googletagmanager.com/gtag/js?id=AW-10810823199"><\/script><script src="/ask/gads.js"><\/script>`;
var GADS_JS = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-10810823199');
gtag('config', 'AW-10810823199/VNUcCMSy3YobEJ-kgKMo', {
  'phone_conversion_number': '9100181181'
});`;
async function handle(request, env, exec) {
  const url = new URL(request.url);
  const O = env.CANONICAL_ORIGIN, BASE = `${O}${env.ASK_BASE}`;
  const HOST = (request.headers.get("host") || url.hostname || "").toLowerCase();
  const IS_ASK_SUBDOMAIN = HOST === "ask.pinnacleblooms.org";
  if (IS_ASK_SUBDOMAIN && !url.pathname.startsWith(env.ASK_BASE)) {
    url.pathname = env.ASK_BASE + (url.pathname === "/" ? "" : url.pathname);
  }
  let raw = url.pathname.replace(/\/+$/, "") || env.ASK_BASE;
  const { lang, route } = stripLang(raw, env.ASK_BASE);
  const rel = route === env.ASK_BASE ? "/" : route.slice(env.ASK_BASE.length);
  const live = await launched(env);
  const absLang = /* @__PURE__ */ __name2((code) => `${O}${langPath(route, code, env.ASK_BASE)}`, "absLang");
  const hreflang = [
    ...LOCALES.map((l) => ({ code: l.code, href: absLang(l.code) })),
    { code: "x-default", href: absLang(DEFAULT_LANG) }
  ];
  const langHref = /* @__PURE__ */ __name2((code) => absLang(code), "langHref");
  const canonical = absLang(lang);
  if (rel === "/gads.js") {
    return new Response(GADS_JS, { headers: {
      "content-type": "text/javascript; charset=utf-8",
      "cache-control": "public, max-age=3600",
      ...SEC_HEADERS
    } });
  }
  if (rel === "/m.js") {
    return new Response(MENU_JS, { headers: {
      "content-type": "text/javascript; charset=utf-8",
      "cache-control": "public, max-age=86400",
      ...SEC_HEADERS
    } });
  }
  {
    const m = rel.match(/^\/og\/([^/]+)\.(svg|png)$/);
    if (m) return await ogResponse(env, exec, m[1], m[2]);
  }
  if (rel === "/f/archivo.woff2") {
    const bin = Uint8Array.from(atob(ARCHIVO_WOFF2_B64), (c) => c.charCodeAt(0));
    return new Response(bin, { headers: {
      "content-type": "font/woff2",
      "cache-control": "public, max-age=31536000, immutable",
      "access-control-allow-origin": "*",
      ...SEC_HEADERS
    } });
  }
  {
    const teMap = { "/f/te-serif700.woff2": TE_SERIF700, "/f/te-sans600.woff2": TE_SANS600, "/f/te-sans400.woff2": TE_SANS400 };
    if (teMap[rel]) {
      const bin = Uint8Array.from(atob(teMap[rel]), (c) => c.charCodeAt(0));
      return new Response(bin, { headers: {
        "content-type": "font/woff2",
        "cache-control": "public, max-age=31536000, immutable",
        "access-control-allow-origin": "*",
        ...SEC_HEADERS
      } });
    }
  }
  if (rel === "/logo.png") {
    const i = LOGO.indexOf(",");
    const b64 = i >= 0 ? LOGO.slice(i + 1) : LOGO;
    const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return new Response(bin, { headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
      "access-control-allow-origin": "*",
      ...SEC_HEADERS
    } });
  }
  {
    const im = rel.match(/^\/([A-Za-z0-9][A-Za-z0-9-]{0,200})\.(svg|png)$/);
    if (im) {
      const slug = im[1], ext = im[2];
      const okey = slug + "." + ext;
      const ictype = ext === "png" ? "image/png" : "image/svg+xml; charset=utf-8";
      const IH = { "content-type": ictype, "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400", ...SEC_HEADERS };
      if (env.OG_BUCKET) {
        try {
          const o = await env.OG_BUCKET.get(okey);
          if (o) return new Response(o.body, { headers: { ...IH, "x-img-store": "r2" } });
        } catch (e) {
        }
      }
      try {
        let hash = null;
        const ck = "cardhash:" + slug;
        if (env.KOSA_CACHE) {
          try {
            hash = await env.KOSA_CACHE.get(ck);
          } catch (e) {
          }
        }
        if (!hash) {
          const m = await rpc("ask_card_hash", { p_slug: slug }, env);
          hash = m && (m.card_hash || Array.isArray(m) && m[0] && m[0].card_hash) || null;
          if (hash && env.KOSA_CACHE && exec && exec.waitUntil) exec.waitUntil(env.KOSA_CACHE.put(ck, hash, { expirationTtl: 604800 }).catch(() => {
          }));
        }
        if (hash && env.OG_BUCKET) {
          const o = await env.OG_BUCKET.get("cards/" + hash + "." + ext);
          if (o) return new Response(o.body, { headers: { ...IH, "x-img-store": "r2-mapped" } });
        }
      } catch (e) {
      }
      const a = await answer(env, slug);
      if (a) {
        const card = {
          t: a.og_title || a.h1 || a.question || "Ask Pinnacle",
          k: a.entity && a.entity.name || a.og_category || "Ask Pinnacle",
          s: a.og_subtitle || a.meta_description || a.summary || "",
          g: (Array.isArray(a.about_codes) ? a.about_codes : []).slice(0, 4).map(String),
          m: [],
          l: (a.lang || lang || "en").toUpperCase(),
          u: a.canonical || canonical
        };
        const token = ogToken(card);
        const built = await buildCard(token);
        let bytes, complete = built.complete;
        if (ext === "png") {
          try {
            const { svgToPng: svgToPng2 } = await Promise.resolve().then(() => (init_png(), png_exports));
            bytes = await svgToPng2(built.svg);
          } catch (e) {
            return new Response("render error: " + (e && e.message || e), { status: 500, headers: { "content-type": "text/plain", ...SEC_HEADERS } });
          }
        } else {
          bytes = built.svg;
        }
        if (env.OG_BUCKET && complete && exec && exec.waitUntil) {
          exec.waitUntil(env.OG_BUCKET.put(okey, bytes, { httpMetadata: { contentType: ictype, cacheControl: "public, max-age=86400, s-maxage=604800" } }).catch(() => {
          }));
        }
        return new Response(bytes, { headers: { ...IH, "x-img-store": "rendered" } });
      }
    }
  }
  if (rel === "/robots.txt") {
    const body = [
      "# Ask Pinnacle \u2014 the Child Development Ko\u015Ba. Open knowledge, CC-BY. Crawl freely.",
      "# Explicitly welcome search, AI assistants, answer engines and research crawlers.",
      "User-agent: GPTBot",
      "Allow: /",
      "",
      "User-agent: OAI-SearchBot",
      "Allow: /",
      "",
      "User-agent: ChatGPT-User",
      "Allow: /",
      "",
      "User-agent: ClaudeBot",
      "Allow: /",
      "",
      "User-agent: Claude-User",
      "Allow: /",
      "",
      "User-agent: Claude-SearchBot",
      "Allow: /",
      "",
      "User-agent: anthropic-ai",
      "Allow: /",
      "",
      "User-agent: PerplexityBot",
      "Allow: /",
      "",
      "User-agent: Perplexity-User",
      "Allow: /",
      "",
      "User-agent: Google-Extended",
      "Allow: /",
      "",
      "User-agent: Googlebot",
      "Allow: /",
      "",
      "User-agent: Bingbot",
      "Allow: /",
      "",
      "User-agent: Applebot",
      "Allow: /",
      "",
      "User-agent: Applebot-Extended",
      "Allow: /",
      "",
      "User-agent: DuckDuckBot",
      "Allow: /",
      "",
      "User-agent: CCBot",
      "Allow: /",
      "",
      "User-agent: Amazonbot",
      "Allow: /",
      "",
      "User-agent: Meta-ExternalAgent",
      "Allow: /",
      "",
      "User-agent: cohere-ai",
      "Allow: /",
      "",
      "User-agent: Diffbot",
      "Allow: /",
      "",
      "User-agent: Timpibot",
      "Allow: /",
      "",
      "User-agent: YouBot",
      "Allow: /",
      "",
      "User-agent: *",
      "Allow: /",
      "",
      "# Open knowledge under CC-BY \u2014 read, cite, learn, and train.",
      "Content-Signal: search=yes, ai-input=yes, ai-train=yes",
      "",
      `Sitemap: ${BASE}/sitemap.xml`,
      ""
    ].join("\n");
    return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400", ...SEC_HEADERS } });
  }
  if (rel === "/llms.txt") {
    const lines = [
      "# Ask Pinnacle \u2014 the Child Development Ko\u015Ba",
      "> The world's first open knowledge layer for human childhood: every condition, skill, milestone, behaviour and therapy of a growing child \u2014 coded to WHO ICD-11 & ICF, aligned with UN SDGs. Operated by Pinnacle Blooms Network (BHCL). Open under CC-BY. Non-diagnostic.",
      "",
      "## Use",
      "- Read, quote and cite freely (CC-BY). Attribute to Ask Pinnacle / Pinnacle Blooms Network.",
      `- Structured access (MCP): https://ask-mcp.pinnacleblooms.org/mcp`,
      "- Contact: care@pinnacleblooms.org \xB7 +91 9100 181 181",
      "",
      "## Vantage points (the six chambers)",
      `- The Concern: ${BASE}/conditions \xB7 ${BASE}/lens/phenomenon \xB7 ${BASE}/myths`,
      `- The Child: ${BASE}/skills \xB7 ${BASE}/abilities \xB7 ${BASE}/domains \xB7 ${BASE}/ages \xB7 ${BASE}/life-skills`,
      `- The Measure: ${BASE}/assessments \xB7 ${BASE}/abilityscore \xB7 ${BASE}/readiness`,
      `- The Path: ${BASE}/lens/route \xB7 ${BASE}/how-to \xB7 ${BASE}/materials`,
      `- The People: ${BASE}/lens/stakeholder`,
      `- The Standards: ${BASE}/lens/icd11 \xB7 ${BASE}/lens/icf`,
      "",
      "## Search",
      `- ${BASE}/search`,
      ""
    ].join("\n");
    return new Response(lines, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400", ...SEC_HEADERS } });
  }
  if (rel === "/sitemap.xsl") {
    const xsl = SITEMAP_XSL;
    return new Response(xsl, { headers: { "content-type": "text/xsl; charset=utf-8", "cache-control": "public, max-age=86400", ...SEC_HEADERS } });
  }
  const SM_SIZE = 1e4;
  const SM_TTL = 21600;
  const xmlHeaders = { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=21600", ...SEC_HEADERS };
  if (rel === "/sitemap.xml") {
    let total = 0;
    try {
      const head2 = await rpc("ask_sitemap", { p_page: 0, p_size: 1 }, env);
      total = head2 && head2.total || 0;
    } catch (e) {
    }
    const shards = Math.max(1, Math.ceil(total / SM_SIZE));
    const lastmod = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    let body = "";
    for (let i = 0; i < shards; i++) {
      body += `<sitemap><loc>${O}${env.ASK_BASE}/sitemap-${i}.xml</loc><lastmod>${lastmod}</lastmod></sitemap>`;
    }
    const xml2 = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${env.ASK_BASE}/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
    return new Response(xml2, { headers: xmlHeaders });
  }
  {
    const sm = rel.match(/^\/sitemap-(\d+)\.xml$/);
    if (sm) {
      const page = parseInt(sm[1], 10);
      const ck = `sitemap:v2:${page}`;
      if (env.KOSA_CACHE) {
        try {
          const cached = await env.KOSA_CACHE.get(ck);
          if (cached) return new Response(cached, { headers: { ...xmlHeaders, "x-sitemap": "kv" } });
        } catch (e) {
        }
      }
      const data = await rpc("ask_sitemap", { p_page: page, p_size: SM_SIZE }, env);
      if (!data || !Array.isArray(data.urls) || !data.urls.length) {
        return new Response("not found", { status: 404, headers: { "content-type": "text/plain", ...SEC_HEADERS } });
      }
      let body = "";
      for (const it of data.urls) {
        const path = it.slug ? `${env.ASK_BASE}/${it.slug}` : env.ASK_BASE;
        const loc = `${O}${path}`;
        const lm = it.lastmod ? `<lastmod>${it.lastmod}</lastmod>` : "";
        const alts = LOCALES.map((l) => `<xhtml:link rel="alternate" hreflang="${l.code}" href="${O}${langPath(path, l.code, env.ASK_BASE)}"/>`).join("");
        const img = it.persona ? `<image:image><image:loc>${O}${env.ASK_BASE}/${it.slug}.png</image:loc></image:image>` : "";
        body += `<url><loc>${loc}</loc>${lm}${alts}<xhtml:link rel="alternate" hreflang="x-default" href="${O}${langPath(path, DEFAULT_LANG, env.ASK_BASE)}"/>${img}</url>`;
      }
      const xml2 = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${env.ASK_BASE}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`;
      if (env.KOSA_CACHE && exec && exec.waitUntil) {
        exec.waitUntil(env.KOSA_CACHE.put(ck, xml2, { expirationTtl: SM_TTL }).catch(() => {
        }));
      }
      return new Response(xml2, { headers: { ...xmlHeaders, "x-sitemap": "rpc" } });
    }
  }
  if (rel === "/") {
    const data = await home(env, lang) || {};
    const ctx = {
      env,
      lang,
      path: canonical,
      canonical,
      title: "Ask Pinnacle \u2014 the Child Development Ko\u015Ba",
      desc: "The open knowledge layer of human childhood \u2014 every condition, skill, milestone and therapy, coded to WHO ICD-11 & ICF, citable by any AI.",
      ogImage: `${BASE}/og/default.png`,
      counts: data.counts && data.counts.kinds || {},
      showAboutFaq: true,
      showMastheadBand: true,
      noindex: !live,
      hreflang,
      langHref,
      pageSchema: []
    };
    initCtx(ctx);
    ctx.main = homeMain(ctx);
    return html(shell(ctx), live);
  }
  const R = resolveArchetype(rel);
  if (R) {
    const data = await home(env, lang) || {};
    const counts = data.counts && data.counts.kinds || {};
    const ctx = {
      env,
      lang,
      path: canonical,
      canonical,
      ogImage: `${BASE}/og/default.png`,
      counts,
      showAboutFaq: false,
      showMastheadBand: true,
      noindex: !live,
      hreflang,
      langHref,
      pageSchema: [],
      title: "Ask Pinnacle",
      desc: "The open Child Development Ko\u015Ba, coded to WHO standards."
    };
    initCtx(ctx);
    let built = null;
    if (R.kind === "dimension") built = dimensionPage(ctx, R.slug);
    else if (R.kind === "lensIndex") built = lensIndexPage(ctx, R.k);
    else if (R.kind === "lensValue") built = lensValuePage(ctx, R.k, R.v);
    else if (R.kind === "entity") {
      let a;
      try {
        a = await routedAskAnswer(env, R.slug, lang);
        if (!a && !await knownAskEntityHub(env, R.slug)) {
          return html(notFound(env, lang, hreflang, langHref, live), false, 404);
        }
      } catch (error) {
        return new Response("This page is temporarily unavailable. Please try again shortly.", {
          status: 503,
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow", "retry-after": "60", ...SEC_HEADERS }
        });
      }
      if (a) {
        ctx.lang = a.lang || lang;
        initCtx(ctx);
        const m = atomMeta(a, ctx);
        ctx.title = m.title;
        ctx.desc = m.desc;
        ctx.canonical = m.canonical;
        ctx.path = m.canonical;
        ctx.ogImage = m.ogImage;
        ctx.ogImageSvg = m.ogImageSvg;
        ctx.hreflang = m.hreflang;
        ctx.langHref = (code) => (m.hreflang.find((item) => item.code === code) || {}).href || m.canonical;
        ctx.noindex = m.noindex || /\bnoindex\b/i.test(m.robots || "") || !live;
        ctx.showAboutFaq = false;
        atomPage(ctx, a);
        return html(shell(ctx), live && !ctx.noindex);
      }
      built = entityHubPage(ctx, R.slug);
    } else if (R.kind === "tool") built = toolPage(ctx, R.key);
    else if (R.kind === "search") return searchResultsResponse(ctx, url);
    if (built) {
      ctx.title = built.meta.title;
      ctx.desc = built.meta.desc;
      ctx.showAboutFaq = R.kind === "dimension" || R.kind === "search";
      ctx.main = universalPage(ctx, built.spec);
      return html(shell(ctx), live);
    }
  }
  return html(notFound(env, lang, hreflang, langHref, live), live, 404);
}
__name(handle, "handle");
__name2(handle, "handle");
function notFound(env, lang, hreflang, langHref, live) {
  const O = env.CANONICAL_ORIGIN, BASE = `${O}${env.ASK_BASE}`;
  return shell({
    env,
    lang,
    path: BASE,
    canonical: BASE,
    title: "Not found \xB7 Ask Pinnacle",
    desc: "This page is being prepared.",
    ogImage: `${BASE}/og/default.png`,
    counts: {},
    showAboutFaq: false,
    noindex: true,
    hreflang,
    langHref,
    main: `<div class="wrap read" style="padding:64px 0"><p class="kicker">404</p><h1>This door is being cut.</h1><p class="lede">We could not find a published answer at this address. <a href="${BASE}/search">Search the published answers</a> or <a href="${BASE}">browse Ask Pinnacle</a>.</p></div>`
  });
}
__name(notFound, "notFound");
__name2(notFound, "notFound");
function html(body, live, status = 200) {
  const robots = live && status === 200 ? "index, follow" : "noindex, nofollow";
  return new Response(body, { status, headers: {
    "content-type": "text/html; charset=utf-8",
    "cache-control": status === 200 ? "public, max-age=0, s-maxage=600, stale-while-revalidate=86400" : "no-store",
    "x-robots-tag": robots,
    "content-signal": "search=yes, ai-input=yes, ai-train=yes",
    ...SEC_HEADERS
  } });
}
__name(html, "html");
__name2(html, "html");
async function buildCard(token) {
  const card = parseOgToken(token) || {};
  let qr = null;
  if (card.u) {
    try {
      const api = "https://api.qrserver.com/v1/create-qr-code/?ecc=M&margin=2&format=png&size=420x420&data=" + encodeURIComponent(card.u);
      const r = await fetch(api, { cf: { cacheTtl: 604800, cacheEverything: true } });
      if (r.ok) {
        const b = new Uint8Array(await r.arrayBuffer());
        let bin = "";
        for (let i = 0; i < b.length; i++) bin += String.fromCharCode(b[i]);
        qr = "data:image/png;base64," + btoa(bin);
      }
    } catch (e) {
      qr = null;
    }
  }
  return { card, qr, svg: renderOgCard(card, qr), complete: qr || !card.u };
}
__name(buildCard, "buildCard");
__name2(buildCard, "buildCard");
async function sha256hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(sha256hex, "sha256hex");
__name2(sha256hex, "sha256hex");
async function ogResponse(env, exec, token, ext) {
  const hash = await sha256hex(token);
  const key = "cards/" + hash + "." + ext;
  const ctype = ext === "png" ? "image/png" : "image/svg+xml; charset=utf-8";
  const H2 = { "content-type": ctype, "cache-control": "public, max-age=86400, s-maxage=604800", ...SEC_HEADERS };
  if (env.OG_BUCKET) {
    try {
      const obj = await env.OG_BUCKET.get(key);
      if (obj) return new Response(obj.body, { headers: { ...H2, "x-og-store": "r2" } });
    } catch (e) {
    }
  }
  let svg, complete;
  if (ext === "png" && env.OG_BUCKET) {
    try {
      const o = await env.OG_BUCKET.get("cards/" + hash + ".svg");
      if (o) {
        svg = await o.text();
        complete = true;
      }
    } catch (e) {
    }
  }
  if (svg === void 0) {
    const b = await buildCard(token);
    svg = b.svg;
    complete = b.complete;
  }
  let bytes;
  if (ext === "png") {
    try {
      const { svgToPng: svgToPng2 } = await Promise.resolve().then(() => (init_png(), png_exports));
      bytes = await svgToPng2(svg);
    } catch (e) {
      return new Response("render error: " + (e && e.message || e), { status: 500, headers: { "content-type": "text/plain", ...SEC_HEADERS } });
    }
  } else {
    bytes = svg;
  }
  if (env.OG_BUCKET && complete && exec && exec.waitUntil) {
    exec.waitUntil(env.OG_BUCKET.put(key, bytes, { httpMetadata: { contentType: ctype, cacheControl: "public, max-age=86400, s-maxage=604800" } }).catch(() => {
    }));
  }
  return new Response(bytes, { headers: { ...H2, "x-og-store": "rendered" } });
}
__name(ogResponse, "ogResponse");
__name2(ogResponse, "ogResponse");
var NETWORK_PATH = "/ask/what-is-pinnacle-blooms-network";
var NETWORK_HELP_PATH = "/ask/what-is-pinnacle-blooms-network-and-how-does-it-help-my-child";
var NETWORK_CANONICAL = "https://pinnacleblooms.org" + NETWORK_PATH;
var NETWORK_DESCRIPTION = "Pinnacle Blooms Network is a child-development therapy network operated by Bharath Healthcare Laboratories Private Limited. Find locations, services and dated evidence.";
var NETWORK_FAQ = [
  ["Who operates Pinnacle Blooms Network?", "Pinnacle Blooms Network is operated by Bharath Healthcare Laboratories Private Limited (BHCL)."],
  ["Which services can parents ask about?", "Parents can ask about autism support, speech therapy, ABA/behaviour therapy, occupational therapy and special education. Confirm suitable services, practitioner availability and fees with the preferred centre."],
  ["Where can I find current locations and network figures?", "Find current locations in the centre directory. For dated institutional measures, definitions and accountant report-page pointers, see the Verify claim and source ledger. Dated measures should not be treated as a current consumer centre or practitioner roster."],
  ["Does PinnacleAI provide a medical diagnosis?", "PinnacleAI GPT-OS is a non-diagnostic developmental-support Class B software as a medical device. Its stated scope does not replace an assessment or diagnosis by an appropriately qualified healthcare professional."],
  ["How do I contact the parent helpline?", "Call 9100 181 181 for parent guidance and appointment enquiries. The Pinnacle-operated helpline is available 24/7 in English, Telugu and Hindi. Confirm assessment charges and therapy fees before booking. Helpline availability does not mean centres or clinicians are available around the clock."]
];
var networkEscape = /* @__PURE__ */ __name((value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "networkEscape");
function renderVerifiedNetwork(live, childHelp = false) {
  const NETWORK_CANONICAL2 = "https://pinnacleblooms.org" + (childHelp ? NETWORK_HELP_PATH : NETWORK_PATH);
  const question = childHelp ? "What is Pinnacle Blooms Network, and how can it help my child?" : "What is Pinnacle Blooms Network?";
  const NETWORK_TITLE = question + " | Ask Pinnacle";
  const org = { "@type": "Organization", "@id": "https://www.pinnacleblooms.org/#organization", name: "Pinnacle Blooms Network", legalName: "Bharath Healthcare Laboratories Private Limited", url: "https://www.pinnacleblooms.org/", telephone: "+919100181181" };
  const schema = { "@context": "https://schema.org", "@graph": [
    org,
    { "@type": "WebPage", "@id": NETWORK_CANONICAL2 + "#webpage", url: NETWORK_CANONICAL2, name: NETWORK_TITLE, description: NETWORK_DESCRIPTION, inLanguage: "en", dateModified: "2026-09-23", about: { "@id": org["@id"] }, publisher: { "@id": org["@id"] }, citation: ["https://www.pinnacleblooms.org/verify/evidence/claim-ledger.html", "https://www.pinnacleblooms.org/verify/evidence/organisation-profile.html"] },
    { "@type": "FAQPage", "@id": NETWORK_CANONICAL2 + "#faq", mainEntity: NETWORK_FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
  ] };
  const faq = NETWORK_FAQ.map(([q, a]) => `<details><summary>${networkEscape(q)}</summary><p>${networkEscape(a)}</p></details>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${NETWORK_TITLE}</title><meta name="description" content="${NETWORK_DESCRIPTION}"><link rel="canonical" href="${NETWORK_CANONICAL2}"><link rel="alternate" hreflang="en" href="${NETWORK_CANONICAL2}"><link rel="alternate" hreflang="x-default" href="${NETWORK_CANONICAL2}"><meta name="robots" content="${live ? "index, follow" : "noindex, nofollow"}"><meta property="og:type" content="article"><meta property="og:site_name" content="Ask Pinnacle"><meta property="og:title" content="${NETWORK_TITLE}"><meta property="og:description" content="${NETWORK_DESCRIPTION}"><meta property="og:url" content="${NETWORK_CANONICAL2}"><meta property="og:image" content="https://pinnacleblooms.org/ask/logo.png"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${NETWORK_TITLE}"><meta name="twitter:description" content="${NETWORK_DESCRIPTION}"><meta name="twitter:image" content="https://pinnacleblooms.org/ask/logo.png"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}<\/script><style>
  :root{color-scheme:light;--navy:#122843;--teal:#007f86;--red:#c8102e}*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--navy);font:18px/1.65 system-ui,-apple-system,Segoe UI,sans-serif}a{color:var(--teal);text-underline-offset:3px}a:focus-visible,summary:focus-visible{outline:3px solid var(--teal);outline-offset:5px}.skip{position:absolute;left:12px;top:-60px}.skip:focus{top:10px;background:white;padding:8px}header,main,footer{max-width:1050px;margin:auto;padding:24px}header{display:flex;align-items:center;justify-content:space-between;gap:18px;border-bottom:1px solid #e4ebee}header nav{display:flex;gap:20px;flex-wrap:wrap;font-size:15px}.brand{font-size:24px;font-weight:750;text-decoration:none;color:var(--navy)}.brand span{color:var(--red)}.network-mobile-call{display:none}main{max-width:900px;padding-top:48px;padding-bottom:64px}.kicker{color:var(--teal);font-size:14px;text-transform:uppercase;letter-spacing:.1em;font-weight:700}h1{font-size:clamp(32px,5vw,54px);line-height:1.12;letter-spacing:-.03em;margin:12px 0 26px}h2{font-size:27px;line-height:1.3;margin-top:40px}.lead{font-size:22px;line-height:1.55}.callbox{background:#f2faf9;border-left:4px solid var(--teal);border-radius:0 12px 12px 0;padding:24px;margin:30px 0}.call{display:inline-block;background:var(--red);color:white;padding:12px 22px;border-radius:8px;font-size:19px;font-weight:700;text-decoration:none}.small{font-size:15px;color:#4c6073}.services li{margin:8px 0}details{border-bottom:1px solid #dbe5e9;padding:18px 0}summary{cursor:pointer;font-weight:700}details p{margin-bottom:0}footer{font-size:14px;border-top:1px solid #e4ebee}@media(max-width:600px){header{align-items:flex-start;flex-direction:column}.network-mobile-call{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:8px 16px;border-radius:999px;background:var(--red);color:#fff;font-size:16px;font-weight:750;line-height:1.2;text-decoration:none}main{padding-top:32px}.callbox{padding:20px}header,main,footer{padding-left:20px;padding-right:20px}}
  </style></head><body><a class="skip" href="#main">Skip to answer</a><header><a class="brand" href="https://pinnacleblooms.org/ask">Pinnacle<span> ASK</span></a><a class="network-mobile-call" href="tel:+919100181181" aria-label="Call Pinnacle Blooms Network at 9100 181 181">Call 9100 181 181</a><nav aria-label="Main"><a href="https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7">Find a centre</a><a href="https://www.pinnacleblooms.org/verify/">Verify evidence</a><a href="https://www.pinnacleblooms.org/national-autism-helpline">Parent helpline</a></nav></header><main id="main"><article><p class="kicker">About Pinnacle Blooms Network</p><h1>${networkEscape(question)}</h1><p class="lead">Pinnacle Blooms Network is a child-development therapy network operated by Bharath Healthcare Laboratories Private Limited.</p><p>Find current locations in the <a href="https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7">centre directory</a>. For dated institutional measures, definitions and accountant report-page pointers, see the <a href="https://www.pinnacleblooms.org/verify/evidence/claim-ledger.html">Verify claim and source ledger</a>.</p><div class="callbox"><p><strong>Talk through your next step.</strong> Ask about nearby services, practitioner availability, assessment charges and appointments.</p><a class="call" href="tel:+919100181181">Call 9100 181 181</a><p class="small">Pinnacle-operated parent helpline \xB7 Available 24/7 \xB7 English, Telugu and Hindi</p></div><h2>Services parents can ask about</h2><ul class="services"><li><a href="https://www.pinnacleblooms.org/autism-therapy">Autism support</a></li><li><a href="https://www.pinnacleblooms.org/top-speech-therapy-center-india-proven-improvement-rate">Speech therapy</a></li><li><a href="https://www.pinnacleblooms.org/best-aba-therapy-center-india-proven-improvement-rate">ABA / behaviour therapy</a></li><li><a href="https://www.pinnacleblooms.org/best-occupational-therapy-center-india-proven-improvement-rate">Occupational therapy</a></li><li><a href="https://www.pinnacleblooms.org/best-special-education-center-call-9100181181">Special education</a></li></ul><p>Ask the preferred centre which services are suitable and available, who will provide them, how goals and progress will be reviewed, and what the fees include.</p><h2>Understanding the evidence and scope</h2><p>Institutional measures have particular dates, definitions and inclusion criteria. They should not be read as a current consumer centre or practitioner roster. Use the linked source ledger to check the scope behind a published figure.</p><p>PinnacleAI GPT-OS is a <strong>non-diagnostic developmental-support Class B software as a medical device</strong>. Its stated scope does not replace an assessment or diagnosis by an appropriately qualified healthcare professional. Read the <a href="https://www.pinnacleblooms.org/verify/">Verify evidence hub</a> for the product's regulatory and intended-use sources.</p><section aria-labelledby="faq-title"><h2 id="faq-title">Frequently asked questions</h2>${faq}</section><h2>Sources and contact</h2><ul><li><a href="https://www.pinnacleblooms.org/verify/evidence/organisation-profile.html">Organisation profile and legal operator</a></li><li><a href="https://www.pinnacleblooms.org/verify/evidence/claim-ledger.html">Dated claim and source ledger</a></li><li><a href="https://www.pinnacleblooms.org/contact-national-autism-helpline-24-7">Centre directory and contact details</a></li></ul><p><a href="tel:+919100181181">9100 181 181</a> \xB7 <a href="mailto:care@pinnacleblooms.org">care@pinnacleblooms.org</a></p><p class="small">Page updated 23 September 2026. General information and parent guidance; confirm local services, fees and appointments before booking.</p></article></main><footer>Pinnacle Blooms Network \xB7 Operated by Bharath Healthcare Laboratories Private Limited \xB7 <a href="https://www.pinnacleblooms.org/national-autism-helpline">National Autism Helpline</a></footer></body></html>`;
}
__name(renderVerifiedNetwork, "renderVerifiedNetwork");
function isVerifiedNetworkRequest(url) {
  const path = url.pathname.replace(/\/+$/, "");
  return [NETWORK_PATH, NETWORK_HELP_PATH].includes(path) || url.hostname === "ask.pinnacleblooms.org" && [NETWORK_PATH, NETWORK_HELP_PATH].some((p) => p.slice(4) === path);
}
__name(isVerifiedNetworkRequest, "isVerifiedNetworkRequest");
async function verifiedNetworkResponse(request, env) {
  if (!isVerifiedNetworkRequest(new URL(request.url))) return null;
  if (!["GET", "HEAD"].includes(request.method)) return new Response(null, { status: 405, headers: { allow: "GET, HEAD", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow", ...SEC_HEADERS } });
  const live = await launched(env);
  const response = html(request.method === "HEAD" ? null : renderVerifiedNetwork(live, new URL(request.url).pathname.replace(/\/+$/, "").endsWith("what-is-pinnacle-blooms-network-and-how-does-it-help-my-child")), live);
  response.headers.set("x-pinnacle-ask-evidence", "network-2026-09-23-two-articles");
  return response;
}
__name(verifiedNetworkResponse, "verifiedNetworkResponse");
async function withWebsiteCallTag(response) {
  if (response.headers.get("x-pinnacle-private-search") === "1") return response;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;
  let body = await response.text();
  if (body && !body.includes("AW-10810823199")) {
    body = body.replace(/<\/head>/i, GADS_HEAD + "</head>");
  }
  const headers = new Headers(response.headers);
  headers.set("content-security-policy", SEC_HEADERS["content-security-policy"]);
  headers.delete("content-length");
  return new Response(body || null, { status: response.status, statusText: response.statusText, headers });
}
__name(withWebsiteCallTag, "withWebsiteCallTag");
__name2(withWebsiteCallTag, "withWebsiteCallTag");
async function cachedFetch(request, env, ctx) {
  const verifiedNetwork = await verifiedNetworkResponse(request, env);
  if (verifiedNetwork) return withWebsiteCallTag(verifiedNetwork);
  const url = new URL(request.url);
  const cacheable = request.method === "GET" && !url.search;
  const cache = caches.default;
  const cacheKey = cacheable ? new Request(url.href + "?__ask_html=20261003-search-citations", request) : request;
  if (cacheable) {
    const hit = await cache.match(cacheKey);
    if (hit) {
      const h = new Headers(hit.headers);
      h.set("x-page-store", "hit");
      return withWebsiteCallTag(new Response(hit.body, { status: hit.status, headers: h }));
    }
  }
  const res = await withWebsiteCallTag(await handle(request, env, ctx));
  const ct = res.headers.get("content-type") || "";
  const robots = res.headers.get("x-robots-tag") || "";
  if (cacheable && res.status === 200 && ct.includes("text/html") && /\bindex\b/i.test(robots) && !/\bnoindex\b/i.test(robots)) {
    const store = res.clone();
    const putRes = new Response(store.body, { status: 200, headers: store.headers });
    if (ctx && ctx.waitUntil) ctx.waitUntil(cache.put(cacheKey, putRes));
    else await cache.put(cacheKey, putRes);
    const h = new Headers(res.headers);
    h.set("x-page-store", "miss");
    return new Response(res.body, { status: res.status, headers: h });
  }
  return res;
}
__name(cachedFetch, "cachedFetch");
__name2(cachedFetch, "cachedFetch");
var index_default = { fetch: cachedFetch };
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
