/* Minification failed. Returning unminified contents.
(4789,24-25): run-time error JS1014: Invalid character: `
(4789,30-31): run-time error JS1004: Expected ';': :
(4792,24-25): run-time error JS1014: Invalid character: `
(4792,30-31): run-time error JS1004: Expected ';': :
(4795,24-25): run-time error JS1014: Invalid character: `
(4795,30-31): run-time error JS1004: Expected ';': :
(4799,24-25): run-time error JS1014: Invalid character: `
(4799,30-31): run-time error JS1004: Expected ';': :
(4803,24-25): run-time error JS1014: Invalid character: `
(4803,34-35): run-time error JS1004: Expected ';': :
 */
/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * JQUERY CORE 1.10.2; Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; http://jquery.org/license
 * Includes Sizzle.js; Copyright 2013 jQuery Foundation, Inc. and other contributors; http://opensource.org/licenses/MIT
 *
 * NUGET: END LICENSE TEXT */
/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-1.10.2.min.map
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.2",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=st(),k=st(),E=st(),S=!1,A=function(e,t){return e===t?(S=!0,0):0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=mt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+yt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,n,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function lt(e){return e[b]=!0,e}function ut(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ct(e,t){var n=e.split("|"),r=e.length;while(r--)o.attrHandle[n[r]]=t}function pt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function dt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return lt(function(t){return t=+t,lt(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.defaultView;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.attachEvent&&i!==i.top&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),r.getElementsByTagName=ut(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ut(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=K.test(n.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ut(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=K.test(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ut(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=K.test(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return pt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?pt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:lt,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=mt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?lt(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:lt(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?lt(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:lt(function(e){return function(t){return at(e,t).length>0}}),contains:lt(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:lt(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},o.pseudos.nth=o.pseudos.eq;for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=ft(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=dt(n);function gt(){}gt.prototype=o.filters=o.pseudos,o.setFilters=new gt;function mt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function yt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function vt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function bt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function wt(e,t,n,r,i,o){return r&&!r[b]&&(r=wt(r)),i&&!i[b]&&(i=wt(i,o)),lt(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||Nt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:xt(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=xt(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=xt(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function Tt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=vt(function(e){return e===t},s,!0),p=vt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[vt(bt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return wt(l>1&&bt(f),l>1&&yt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&Tt(e.slice(l,r)),i>r&&Tt(e=e.slice(r)),i>r&&yt(e))}f.push(n)}return bt(f)}function Ct(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=xt(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?lt(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=mt(e)),n=t.length;while(n--)o=Tt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Ct(i,r))}return o};function Nt(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function kt(e,t,n,i){var a,s,u,c,p,f=mt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&yt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}r.sortStable=b.split("").sort(A).join("")===b,r.detectDuplicates=S,p(),r.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(f.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||ct("type|href|height|width",function(e,n,r){return r?t:e.getAttribute(n,"type"===n.toLowerCase()?1:2)}),r.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||ct("value",function(e,n,r){return r||"input"!==e.nodeName.toLowerCase()?t:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||ct(B,function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&i.specified?i.value:e[n]===!0?n.toLowerCase():null}),x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!l||i&&!u||(t=t||[],t=[e,t.slice?t.slice():t],n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)}),n=s=l=u=r=o=null,t
}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,r=0,o=x(this),a=e.match(T)||[];while(t=a[r++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){nn(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);
;
/**
 * BxSlider v4.1.2 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2014, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */

; (function ($) {

    var plugin = {};

    var defaults = {

        // GENERAL
        mode: 'horizontal',
        slideSelector: '',
        infiniteLoop: true,
        hideControlOnEnd: false,
        speed: 500,
        easing: null,
        slideMargin: 0,
        startSlide: 0,
        randomStart: false,
        captions: false,
        ticker: false,
        tickerHover: false,
        adaptiveHeight: false,
        adaptiveHeightSpeed: 500,
        video: false,
        useCSS: true,
        preloadImages: 'visible',
        responsive: true,
        slideZIndex: 50,
        wrapperClass: 'bx-wrapper',

        // TOUCH
        touchEnabled: true,
        swipeThreshold: 50,
        oneToOneTouch: true,
        preventDefaultSwipeX: true,
        preventDefaultSwipeY: false,

        // PAGER
        pager: true,
        pagerType: 'full',
        pagerShortSeparator: ' / ',
        pagerSelector: null,
        buildPager: null,
        pagerCustom: null,

        // CONTROLS
        controls: true,
        nextText: 'Next',
        prevText: 'Prev',
        nextSelector: null,
        prevSelector: null,
        autoControls: false,
        startText: 'Start',
        stopText: 'Stop',
        autoControlsCombine: false,
        autoControlsSelector: null,

        // AUTO
        auto: false,
        pause: 4000,
        autoStart: true,
        autoDirection: 'next',
        autoHover: false,
        autoDelay: 0,
        autoSlideForOnePage: false,

        // CAROUSEL
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 0,
        slideWidth: 0,

        // CALLBACKS
        onSliderLoad: function () { },
        onSlideBefore: function () { },
        onSlideAfter: function () { },
        onSlideNext: function () { },
        onSlidePrev: function () { },
        onSliderResize: function () { }
    }

    $.fn.bxSlider = function (options) {

        if (this.length == 0) return this;

        // support mutltiple elements
        if (this.length > 1) {
            this.each(function () { $(this).bxSlider(options) });
            return this;
        }

        // create a namespace to be used throughout the plugin
        var slider = {};
        // set a reference to our slider element
        var el = this;
        plugin.el = this;

		/**
		 * Makes slideshow responsive
		 */
        // first get the original window dimens (thanks alot IE)
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();



		/**
		 * ===================================================================================
		 * = PRIVATE FUNCTIONS
		 * ===================================================================================
		 */

		/**
		 * Initializes namespace settings to be used throughout plugin
		 */
        var init = function () {
            // merge user-supplied options with the defaults
            slider.settings = $.extend({}, defaults, options);
            // parse slideWidth setting
            slider.settings.slideWidth = parseInt(slider.settings.slideWidth);
            // store the original children
            slider.children = el.children(slider.settings.slideSelector);
            // check if actual number of slides is less than minSlides / maxSlides
            if (slider.children.length < slider.settings.minSlides) slider.settings.minSlides = slider.children.length;
            if (slider.children.length < slider.settings.maxSlides) slider.settings.maxSlides = slider.children.length;
            // if random start, set the startSlide setting to random number
            if (slider.settings.randomStart) slider.settings.startSlide = Math.floor(Math.random() * slider.children.length);
            // store active slide information
            slider.active = { index: slider.settings.startSlide }
            // store if the slider is in carousel mode (displaying / moving multiple slides)
            slider.carousel = slider.settings.minSlides > 1 || slider.settings.maxSlides > 1;
            // if carousel, force preloadImages = 'all'
            if (slider.carousel) slider.settings.preloadImages = 'all';
            // calculate the min / max width thresholds based on min / max number of slides
            // used to setup and update carousel slides dimensions
            slider.minThreshold = (slider.settings.minSlides * slider.settings.slideWidth) + ((slider.settings.minSlides - 1) * slider.settings.slideMargin);
            slider.maxThreshold = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
            // store the current state of the slider (if currently animating, working is true)
            slider.working = false;
            // initialize the controls object
            slider.controls = {};
            // initialize an auto interval
            slider.interval = null;
            // determine which property to use for transitions
            slider.animProp = slider.settings.mode == 'vertical' ? 'top' : 'left';
            // determine if hardware acceleration can be used
            slider.usingCSS = slider.settings.useCSS && slider.settings.mode != 'fade' && (function () {
                // create our test div element
                var div = document.createElement('div');
                // css transition properties
                var props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
                // test for each property
                for (var i in props) {
                    if (div.style[props[i]] !== undefined) {
                        slider.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
                        slider.animProp = '-' + slider.cssPrefix + '-transform';
                        return true;
                    }
                }
                return false;
            }());
            // if vertical mode always make maxSlides and minSlides equal
            if (slider.settings.mode == 'vertical') slider.settings.maxSlides = slider.settings.minSlides;
            // save original style data
            el.data("origStyle", el.attr("style"));
            el.children(slider.settings.slideSelector).each(function () {
                $(this).data("origStyle", $(this).attr("style"));
            });
            // perform all DOM / CSS modifications
            setup();
        }

		/**
		 * Performs all DOM and CSS modifications
		 */
        var setup = function () {
            // wrap el in a wrapper
            el.wrap('<div class="' + slider.settings.wrapperClass + '"><div class="bx-viewport"></div></div>');
            // store a namspace reference to .bx-viewport
            slider.viewport = el.parent();
            // add a loading div to display while images are loading
            slider.loader = $('<div class="bx-loading" />');
            slider.viewport.prepend(slider.loader);
            // set el to a massive width, to hold any needed slides
            // also strip any margin and padding from el
            el.css({
                width: slider.settings.mode == 'horizontal' ? (slider.children.length * 100 + 215) + '%' : 'auto',
                position: 'relative'
            });
            // if using CSS, add the easing property
            if (slider.usingCSS && slider.settings.easing) {
                el.css('-' + slider.cssPrefix + '-transition-timing-function', slider.settings.easing);
                // if not using CSS and no easing value was supplied, use the default JS animation easing (swing)
            } else if (!slider.settings.easing) {
                slider.settings.easing = 'swing';
            }
            var slidesShowing = getNumberSlidesShowing();
            // make modifications to the viewport (.bx-viewport)
            slider.viewport.css({
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            });
            slider.viewport.parent().css({
                maxWidth: getViewportMaxWidth()
            });
            // make modification to the wrapper (.bx-wrapper)
            if (!slider.settings.pager) {
                slider.viewport.parent().css({
                    margin: '0 auto 0px'
                });
            }
            // apply css to all slider children
            slider.children.css({
                'float': slider.settings.mode == 'horizontal' ? 'left' : 'none',
                listStyle: 'none',
                position: 'relative'
            });
            // apply the calculated width after the float is applied to prevent scrollbar interference
            slider.children.css('width', getSlideWidth());
            // if slideMargin is supplied, add the css
            if (slider.settings.mode == 'horizontal' && slider.settings.slideMargin > 0) slider.children.css('marginRight', slider.settings.slideMargin);
            if (slider.settings.mode == 'vertical' && slider.settings.slideMargin > 0) slider.children.css('marginBottom', slider.settings.slideMargin);
            // if "fade" mode, add positioning and z-index CSS
            if (slider.settings.mode == 'fade') {
                slider.children.css({
                    position: 'absolute',
                    zIndex: 0,
                    display: 'none'
                });
                // prepare the z-index on the showing element
                slider.children.eq(slider.settings.startSlide).css({ zIndex: slider.settings.slideZIndex, display: 'block' });
            }
            // create an element to contain all slider controls (pager, start / stop, etc)
            slider.controls.el = $('<div class="bx-controls" />');
            // if captions are requested, add them
            if (slider.settings.captions) appendCaptions();
            // check if startSlide is last slide
            slider.active.last = slider.settings.startSlide == getPagerQty() - 1;
            // if video is true, set up the fitVids plugin
            if (slider.settings.video) el.fitVids();
            // set the default preload selector (visible)
            var preloadSelector = slider.children.eq(slider.settings.startSlide);
            if (slider.settings.preloadImages == "all") preloadSelector = slider.children;
            // only check for control addition if not in "ticker" mode
            if (!slider.settings.ticker) {
                // if pager is requested, add it
                if (slider.settings.pager) appendPager();
                // if controls are requested, add them
                if (slider.settings.controls) appendControls();
                // if auto is true, and auto controls are requested, add them
                if (slider.settings.auto && slider.settings.autoControls) appendControlsAuto();
                // if any control option is requested, add the controls wrapper
                if (slider.settings.controls || slider.settings.autoControls || slider.settings.pager) slider.viewport.after(slider.controls.el);
                // if ticker mode, do not allow a pager
            } else {
                slider.settings.pager = false;
            }
            // preload all images, then perform final DOM / CSS modifications that depend on images being loaded
            loadElements(preloadSelector, start);
        }

        var loadElements = function (selector, callback) {
            var total = selector.find('img, iframe').length;
            if (total == 0) {
                callback();
                return;
            }
            var count = 0;
            selector.find('img, iframe').each(function () {
                $(this).one('load', function () {
                    if (++count == total) callback();
                }).each(function () {
                    if (this.complete) $(this).load();
                });
            });
        }

		/**
		 * Start the slider
		 */
        var start = function () {
            // if infinite loop, prepare additional slides
            if (slider.settings.infiniteLoop && slider.settings.mode != 'fade' && !slider.settings.ticker) {
                var slice = slider.settings.mode == 'vertical' ? slider.settings.minSlides : slider.settings.maxSlides;
                var sliceAppend = slider.children.slice(0, slice).clone().addClass('bx-clone');
                var slicePrepend = slider.children.slice(-slice).clone().addClass('bx-clone');
                el.append(sliceAppend).prepend(slicePrepend);
            }
            // remove the loading DOM element
            slider.loader.remove();
            // set the left / top position of "el"
            setSlidePosition();
            // if "vertical" mode, always use adaptiveHeight to prevent odd behavior
            if (slider.settings.mode == 'vertical') slider.settings.adaptiveHeight = true;
            // set the viewport height
            slider.viewport.height(getViewportHeight());
            // make sure everything is positioned just right (same as a window resize)
            el.redrawSlider();
            // onSliderLoad callback
            slider.settings.onSliderLoad(slider.active.index);
            // slider has been fully initialized
            slider.initialized = true;
            // bind the resize call to the window
            if (slider.settings.responsive) $(window).bind('resize', resizeWindow);
            // if auto is true and has more than 1 page, start the show
            if (slider.settings.auto && slider.settings.autoStart && (getPagerQty() > 1 || slider.settings.autoSlideForOnePage)) initAuto();
            // if ticker is true, start the ticker
            if (slider.settings.ticker) initTicker();
            // if pager is requested, make the appropriate pager link active
            if (slider.settings.pager) updatePagerActive(slider.settings.startSlide);
            // check for any updates to the controls (like hideControlOnEnd updates)
            if (slider.settings.controls) updateDirectionControls();
            // if touchEnabled is true, setup the touch events
            if (slider.settings.touchEnabled && !slider.settings.ticker) initTouch();
        }

		/**
		 * Returns the calculated height of the viewport, used to determine either adaptiveHeight or the maxHeight value
		 */
        var getViewportHeight = function () {
            var height = 0;
            // first determine which children (slides) should be used in our height calculation
            var children = $();
            // if mode is not "vertical" and adaptiveHeight is false, include all children
            if (slider.settings.mode != 'vertical' && !slider.settings.adaptiveHeight) {
                children = slider.children;
            } else {
                // if not carousel, return the single active child
                if (!slider.carousel) {
                    children = slider.children.eq(slider.active.index);
                    // if carousel, return a slice of children
                } else {
                    // get the individual slide index
                    var currentIndex = slider.settings.moveSlides == 1 ? slider.active.index : slider.active.index * getMoveBy();
                    // add the current slide to the children
                    children = slider.children.eq(currentIndex);
                    // cycle through the remaining "showing" slides
                    for (i = 1; i <= slider.settings.maxSlides - 1; i++) {
                        // if looped back to the start
                        if (currentIndex + i >= slider.children.length) {
                            children = children.add(slider.children.eq(i - 1));
                        } else {
                            children = children.add(slider.children.eq(currentIndex + i));
                        }
                    }
                }
            }
            // if "vertical" mode, calculate the sum of the heights of the children
            if (slider.settings.mode == 'vertical') {
                children.each(function (index) {
                    height += $(this).outerHeight();
                });
                // add user-supplied margins
                if (slider.settings.slideMargin > 0) {
                    height += slider.settings.slideMargin * (slider.settings.minSlides - 1);
                }
                // if not "vertical" mode, calculate the max height of the children
            } else {
                height = Math.max.apply(Math, children.map(function () {
                    return $(this).outerHeight(false);
                }).get());
            }

            if (slider.viewport.css('box-sizing') == 'border-box') {
                height += parseFloat(slider.viewport.css('padding-top')) + parseFloat(slider.viewport.css('padding-bottom')) +
                    parseFloat(slider.viewport.css('border-top-width')) + parseFloat(slider.viewport.css('border-bottom-width'));
            } else if (slider.viewport.css('box-sizing') == 'padding-box') {
                height += parseFloat(slider.viewport.css('padding-top')) + parseFloat(slider.viewport.css('padding-bottom'));
            }

            return height;
        }

		/**
		 * Returns the calculated width to be used for the outer wrapper / viewport
		 */
        var getViewportMaxWidth = function () {
            var width = '100%';
            if (slider.settings.slideWidth > 0) {
                if (slider.settings.mode == 'horizontal') {
                    width = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
                } else {
                    width = slider.settings.slideWidth;
                }
            }
            return width;
        }

		/**
		 * Returns the calculated width to be applied to each slide
		 */
        var getSlideWidth = function () {
            // start with any user-supplied slide width
            var newElWidth = slider.settings.slideWidth;
            // get the current viewport width
            var wrapWidth = slider.viewport.width();
            // if slide width was not supplied, or is larger than the viewport use the viewport width
            if (slider.settings.slideWidth == 0 ||
                (slider.settings.slideWidth > wrapWidth && !slider.carousel) ||
                slider.settings.mode == 'vertical') {
                newElWidth = wrapWidth;
                // if carousel, use the thresholds to determine the width
            } else if (slider.settings.maxSlides > 1 && slider.settings.mode == 'horizontal') {
                if (wrapWidth > slider.maxThreshold) {
                    // newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.maxSlides - 1))) / slider.settings.maxSlides;
                } else if (wrapWidth < slider.minThreshold) {
                    newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.minSlides - 1))) / slider.settings.minSlides;
                }
            }
            return newElWidth;
        }

		/**
		 * Returns the number of slides currently visible in the viewport (includes partially visible slides)
		 */
        var getNumberSlidesShowing = function () {
            var slidesShowing = 1;
            if (slider.settings.mode == 'horizontal' && slider.settings.slideWidth > 0) {
                // if viewport is smaller than minThreshold, return minSlides
                if (slider.viewport.width() < slider.minThreshold) {
                    slidesShowing = slider.settings.minSlides;
                    // if viewport is larger than minThreshold, return maxSlides
                } else if (slider.viewport.width() > slider.maxThreshold) {
                    slidesShowing = slider.settings.maxSlides;
                    // if viewport is between min / max thresholds, divide viewport width by first child width
                } else {
                    var childWidth = slider.children.first().width() + slider.settings.slideMargin;
                    slidesShowing = Math.floor((slider.viewport.width() +
                        slider.settings.slideMargin) / childWidth);
                }
                // if "vertical" mode, slides showing will always be minSlides
            } else if (slider.settings.mode == 'vertical') {
                slidesShowing = slider.settings.minSlides;
            }
            return slidesShowing;
        }

		/**
		 * Returns the number of pages (one full viewport of slides is one "page")
		 */
        var getPagerQty = function () {
            var pagerQty = 0;
            // if moveSlides is specified by the user
            if (slider.settings.moveSlides > 0) {
                if (slider.settings.infiniteLoop) {
                    pagerQty = Math.ceil(slider.children.length / getMoveBy());
                } else {
                    // use a while loop to determine pages
                    var breakPoint = 0;
                    var counter = 0
                    // when breakpoint goes above children length, counter is the number of pages
                    while (breakPoint < slider.children.length) {
                        ++pagerQty;
                        breakPoint = counter + getNumberSlidesShowing();
                        counter += slider.settings.moveSlides <= getNumberSlidesShowing() ? slider.settings.moveSlides : getNumberSlidesShowing();
                    }
                }
                // if moveSlides is 0 (auto) divide children length by sides showing, then round up
            } else {
                pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
            }
            return pagerQty;
        }

		/**
		 * Returns the number of indivual slides by which to shift the slider
		 */
        var getMoveBy = function () {
            // if moveSlides was set by the user and moveSlides is less than number of slides showing
            if (slider.settings.moveSlides > 0 && slider.settings.moveSlides <= getNumberSlidesShowing()) {
                return slider.settings.moveSlides;
            }
            // if moveSlides is 0 (auto)
            return getNumberSlidesShowing();
        }

		/**
		 * Sets the slider's (el) left or top position
		 */
        var setSlidePosition = function () {
            // if last slide, not infinite loop, and number of children is larger than specified maxSlides
            if (slider.children.length > slider.settings.maxSlides && slider.active.last && !slider.settings.infiniteLoop) {
                if (slider.settings.mode == 'horizontal') {
                    // get the last child's position
                    var lastChild = slider.children.last();
                    var position = lastChild.position();
                    // set the left position
                    setPositionProperty(-(position.left - (slider.viewport.width() - lastChild.outerWidth())), 'reset', 0);
                } else if (slider.settings.mode == 'vertical') {
                    // get the last showing index's position
                    var lastShowingIndex = slider.children.length - slider.settings.minSlides;
                    var position = slider.children.eq(lastShowingIndex).position();
                    // set the top position
                    setPositionProperty(-position.top, 'reset', 0);
                }
                // if not last slide
            } else {
                // get the position of the first showing slide
                var position = slider.children.eq(slider.active.index * getMoveBy()).position();
                // check for last slide
                if (slider.active.index == getPagerQty() - 1) slider.active.last = true;
                // set the repective position
                if (position != undefined) {
                    if (slider.settings.mode == 'horizontal') setPositionProperty(-position.left, 'reset', 0);
                    else if (slider.settings.mode == 'vertical') setPositionProperty(-position.top, 'reset', 0);
                }
            }
        }

		/**
		 * Sets the el's animating property position (which in turn will sometimes animate el).
		 * If using CSS, sets the transform property. If not using CSS, sets the top / left property.
		 *
		 * @param value (int)
		 *  - the animating property's value
		 *
		 * @param type (string) 'slider', 'reset', 'ticker'
		 *  - the type of instance for which the function is being
		 *
		 * @param duration (int)
		 *  - the amount of time (in ms) the transition should occupy
		 *
		 * @param params (array) optional
		 *  - an optional parameter containing any variables that need to be passed in
		 */
        var setPositionProperty = function (value, type, duration, params) {
            // use CSS transform
            if (slider.usingCSS) {
                // determine the translate3d value
                var propValue = slider.settings.mode == 'vertical' ? 'translate3d(0, ' + value + 'px, 0)' : 'translate3d(' + value + 'px, 0, 0)';
                // add the CSS transition-duration
                el.css('-' + slider.cssPrefix + '-transition-duration', duration / 1000 + 's');
                if (type == 'slide') {
                    // set the property value
                    el.css(slider.animProp, propValue);
                    // bind a callback method - executes when CSS transition completes
                    el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                        // unbind the callback
                        el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                        updateAfterSlideTransition();
                    });
                } else if (type == 'reset') {
                    el.css(slider.animProp, propValue);
                } else if (type == 'ticker') {
                    // make the transition use 'linear'
                    el.css('-' + slider.cssPrefix + '-transition-timing-function', 'linear');
                    el.css(slider.animProp, propValue);
                    // bind a callback method - executes when CSS transition completes
                    el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () {
                        // unbind the callback
                        el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                        // reset the position
                        setPositionProperty(params['resetValue'], 'reset', 0);
                        // start the loop again
                        tickerLoop();
                    });
                }
                // use JS animate
            } else {
                var animateObj = {};
                animateObj[slider.animProp] = value;
                if (type == 'slide') {
                    el.animate(animateObj, duration, slider.settings.easing, function () {
                        updateAfterSlideTransition();
                    });
                } else if (type == 'reset') {
                    el.css(slider.animProp, value)
                } else if (type == 'ticker') {
                    el.animate(animateObj, speed, 'linear', function () {
                        setPositionProperty(params['resetValue'], 'reset', 0);
                        // run the recursive loop after animation
                        tickerLoop();
                    });
                }
            }
        }

		/**
		 * Populates the pager with proper amount of pages
		 */
        var populatePager = function () {
            var pagerHtml = '';
            var pagerQty = getPagerQty();
            // loop through each pager item
            for (var i = 0; i < pagerQty; i++) {
                var linkContent = '';
                // if a buildPager function is supplied, use it to get pager link value, else use index + 1
                if (slider.settings.buildPager && $.isFunction(slider.settings.buildPager)) {
                    linkContent = slider.settings.buildPager(i);
                    slider.pagerEl.addClass('bx-custom-pager');
                } else {
                    linkContent = i + 1;
                    slider.pagerEl.addClass('bx-default-pager');
                }
                // var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i) : i + 1;
                // add the markup to the string
                pagerHtml += '<div class="bx-pager-item"><a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a></div>';
            };
            // populate the pager element with pager links
            slider.pagerEl.html(pagerHtml);
        }

		/**
		 * Appends the pager to the controls element
		 */
        var appendPager = function () {
            if (!slider.settings.pagerCustom) {
                // create the pager DOM element
                slider.pagerEl = $('<div class="bx-pager" />');
                // if a pager selector was supplied, populate it with the pager
                if (slider.settings.pagerSelector) {
                    $(slider.settings.pagerSelector).html(slider.pagerEl);
                    // if no pager selector was supplied, add it after the wrapper
                } else {
                    slider.controls.el.addClass('bx-has-pager').append(slider.pagerEl);
                }
                // populate the pager
                populatePager();
            } else {
                slider.pagerEl = $(slider.settings.pagerCustom);
            }
            // assign the pager click binding
            slider.pagerEl.on('click', 'a', clickPagerBind);
        }

		/**
		 * Appends prev / next controls to the controls element
		 */
        var appendControls = function () {
            slider.controls.next = $('<a class="bx-next" href="">' + slider.settings.nextText + '</a>');
            slider.controls.prev = $('<a class="bx-prev" href="">' + slider.settings.prevText + '</a>');
            // bind click actions to the controls
            slider.controls.next.bind('click', clickNextBind);
            slider.controls.prev.bind('click', clickPrevBind);
            // if nextSlector was supplied, populate it
            if (slider.settings.nextSelector) {
                $(slider.settings.nextSelector).append(slider.controls.next);
            }
            // if prevSlector was supplied, populate it
            if (slider.settings.prevSelector) {
                $(slider.settings.prevSelector).append(slider.controls.prev);
            }
            // if no custom selectors were supplied
            if (!slider.settings.nextSelector && !slider.settings.prevSelector) {
                // add the controls to the DOM
                slider.controls.directionEl = $('<div class="bx-controls-direction" />');
                // add the control elements to the directionEl
                slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
                // slider.viewport.append(slider.controls.directionEl);
                slider.controls.el.addClass('bx-has-controls-direction').append(slider.controls.directionEl);
            }
        }

		/**
		 * Appends start / stop auto controls to the controls element
		 */
        var appendControlsAuto = function () {
            slider.controls.start = $('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + slider.settings.startText + '</a></div>');
            slider.controls.stop = $('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + slider.settings.stopText + '</a></div>');
            // add the controls to the DOM
            slider.controls.autoEl = $('<div class="bx-controls-auto" />');
            // bind click actions to the controls
            slider.controls.autoEl.on('click', '.bx-start', clickStartBind);
            slider.controls.autoEl.on('click', '.bx-stop', clickStopBind);
            // if autoControlsCombine, insert only the "start" control
            if (slider.settings.autoControlsCombine) {
                slider.controls.autoEl.append(slider.controls.start);
                // if autoControlsCombine is false, insert both controls
            } else {
                slider.controls.autoEl.append(slider.controls.start).append(slider.controls.stop);
            }
            // if auto controls selector was supplied, populate it with the controls
            if (slider.settings.autoControlsSelector) {
                $(slider.settings.autoControlsSelector).html(slider.controls.autoEl);
                // if auto controls selector was not supplied, add it after the wrapper
            } else {
                slider.controls.el.addClass('bx-has-controls-auto').append(slider.controls.autoEl);
            }
            // update the auto controls
            updateAutoControls(slider.settings.autoStart ? 'stop' : 'start');
        }

		/**
		 * Appends image captions to the DOM
		 */
        var appendCaptions = function () {
            // cycle through each child
            slider.children.each(function (index) {
                // get the image title attribute
                var title = $(this).find('img:first').attr('title');
                // append the caption
                if (title != undefined && ('' + title).length) {
                    $(this).append('<div class="bx-caption"><span>' + title + '</span></div>');
                }
            });
        }

		/**
		 * Click next binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickNextBind = function (e) {
            // if auto show is running, stop it
            if (slider.settings.auto) el.stopAuto();
            el.goToNextSlide();
            e.preventDefault();
        }

		/**
		 * Click prev binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickPrevBind = function (e) {
            // if auto show is running, stop it
            if (slider.settings.auto) el.stopAuto();
            el.goToPrevSlide();
            e.preventDefault();
        }

		/**
		 * Click start binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickStartBind = function (e) {
            el.startAuto();
            e.preventDefault();
        }

		/**
		 * Click stop binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickStopBind = function (e) {
            el.stopAuto();
            e.preventDefault();
        }

		/**
		 * Click pager binding
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var clickPagerBind = function (e) {
            // if auto show is running, stop it
            if (slider.settings.auto) el.stopAuto();
            var pagerLink = $(e.currentTarget);
            if (pagerLink.attr('data-slide-index') !== undefined) {
                var pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
                // if clicked pager link is not active, continue with the goToSlide call
                if (pagerIndex != slider.active.index) el.goToSlide(pagerIndex);
                e.preventDefault();
            }
        }

		/**
		 * Updates the pager links with an active class
		 *
		 * @param slideIndex (int)
		 *  - index of slide to make active
		 */
        var updatePagerActive = function (slideIndex) {
            // if "short" pager type
            var len = slider.children.length; // nb of children
            if (slider.settings.pagerType == 'short') {
                if (slider.settings.maxSlides > 1) {
                    len = Math.ceil(slider.children.length / slider.settings.maxSlides);
                }
                slider.pagerEl.html((slideIndex + 1) + slider.settings.pagerShortSeparator + len);
                return;
            }
            // remove all pager active classes
            slider.pagerEl.find('a').removeClass('active');
            // apply the active class for all pagers
            slider.pagerEl.each(function (i, el) { $(el).find('a').eq(slideIndex).addClass('active'); });
        }

		/**
		 * Performs needed actions after a slide transition
		 */
        var updateAfterSlideTransition = function () {
            // if infinte loop is true
            if (slider.settings.infiniteLoop) {
                var position = '';
                // first slide
                if (slider.active.index == 0) {
                    // set the new position
                    position = slider.children.eq(0).position();
                    // carousel, last slide
                } else if (slider.active.index == getPagerQty() - 1 && slider.carousel) {
                    position = slider.children.eq((getPagerQty() - 1) * getMoveBy()).position();
                    // last slide
                } else if (slider.active.index == slider.children.length - 1) {
                    position = slider.children.eq(slider.children.length - 1).position();
                }
                if (position) {
                    if (slider.settings.mode == 'horizontal') { setPositionProperty(-position.left, 'reset', 0); }
                    else if (slider.settings.mode == 'vertical') { setPositionProperty(-position.top, 'reset', 0); }
                }
            }
            // declare that the transition is complete
            slider.working = false;
            // onSlideAfter callback
            slider.settings.onSlideAfter(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
        }

		/**
		 * Updates the auto controls state (either active, or combined switch)
		 *
		 * @param state (string) "start", "stop"
		 *  - the new state of the auto show
		 */
        var updateAutoControls = function (state) {
            // if autoControlsCombine is true, replace the current control with the new state
            if (slider.settings.autoControlsCombine) {
                slider.controls.autoEl.html(slider.controls[state]);
                // if autoControlsCombine is false, apply the "active" class to the appropriate control
            } else {
                slider.controls.autoEl.find('a').removeClass('active');
                slider.controls.autoEl.find('a:not(.bx-' + state + ')').addClass('active');
            }
        }

		/**
		 * Updates the direction controls (checks if either should be hidden)
		 */
        var updateDirectionControls = function () {
            if (getPagerQty() == 1) {
                slider.controls.prev.addClass('disabled');
                slider.controls.next.addClass('disabled');
            } else if (!slider.settings.infiniteLoop && slider.settings.hideControlOnEnd) {
                // if first slide
                if (slider.active.index == 0) {
                    slider.controls.prev.addClass('disabled');
                    slider.controls.next.removeClass('disabled');
                    // if last slide
                } else if (slider.active.index == getPagerQty() - 1) {
                    slider.controls.next.addClass('disabled');
                    slider.controls.prev.removeClass('disabled');
                    // if any slide in the middle
                } else {
                    slider.controls.prev.removeClass('disabled');
                    slider.controls.next.removeClass('disabled');
                }
            }
        }

		/**
		 * Initialzes the auto process
		 */
        var initAuto = function () {
            // if autoDelay was supplied, launch the auto show using a setTimeout() call
            if (slider.settings.autoDelay > 0) {
                var timeout = setTimeout(el.startAuto, slider.settings.autoDelay);
                // if autoDelay was not supplied, start the auto show normally
            } else {
                el.startAuto();
            }
            // if autoHover is requested
            if (slider.settings.autoHover) {
                // on el hover
                el.hover(function () {
                    // if the auto show is currently playing (has an active interval)
                    if (slider.interval) {
                        // stop the auto show and pass true agument which will prevent control update
                        el.stopAuto(true);
                        // create a new autoPaused value which will be used by the relative "mouseout" event
                        slider.autoPaused = true;
                    }
                }, function () {
                    // if the autoPaused value was created be the prior "mouseover" event
                    if (slider.autoPaused) {
                        // start the auto show and pass true agument which will prevent control update
                        el.startAuto(true);
                        // reset the autoPaused value
                        slider.autoPaused = null;
                    }
                });
            }
        }

		/**
		 * Initialzes the ticker process
		 */
        var initTicker = function () {
            var startPosition = 0;
            // if autoDirection is "next", append a clone of the entire slider
            if (slider.settings.autoDirection == 'next') {
                el.append(slider.children.clone().addClass('bx-clone'));
                // if autoDirection is "prev", prepend a clone of the entire slider, and set the left position
            } else {
                el.prepend(slider.children.clone().addClass('bx-clone'));
                var position = slider.children.first().position();
                startPosition = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
            }
            setPositionProperty(startPosition, 'reset', 0);
            // do not allow controls in ticker mode
            slider.settings.pager = false;
            slider.settings.controls = false;
            slider.settings.autoControls = false;
            // if autoHover is requested
            if (slider.settings.tickerHover && !slider.usingCSS) {
                // on el hover
                slider.viewport.hover(function () {
                    el.stop();
                }, function () {
                    // calculate the total width of children (used to calculate the speed ratio)
                    var totalDimens = 0;
                    slider.children.each(function (index) {
                        totalDimens += slider.settings.mode == 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
                    });
                    // calculate the speed ratio (used to determine the new speed to finish the paused animation)
                    var ratio = slider.settings.speed / totalDimens;
                    // determine which property to use
                    var property = slider.settings.mode == 'horizontal' ? 'left' : 'top';
                    // calculate the new speed
                    var newSpeed = ratio * (totalDimens - (Math.abs(parseInt(el.css(property)))));
                    tickerLoop(newSpeed);
                });
            }
            // start the ticker loop
            tickerLoop();
        }

		/**
		 * Runs a continuous loop, news ticker-style
		 */
        var tickerLoop = function (resumeSpeed) {
            speed = resumeSpeed ? resumeSpeed : slider.settings.speed;
            var position = { left: 0, top: 0 };
            var reset = { left: 0, top: 0 };
            // if "next" animate left position to last child, then reset left to 0
            if (slider.settings.autoDirection == 'next') {
                position = el.find('.bx-clone').first().position();
                // if "prev" animate left position to 0, then reset left to first non-clone child
            } else {
                reset = slider.children.first().position();
            }
            var animateProperty = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
            var resetValue = slider.settings.mode == 'horizontal' ? -reset.left : -reset.top;
            var params = { resetValue: resetValue };
            setPositionProperty(animateProperty, 'ticker', speed, params);
        }

		/**
		 * Initializes touch events
		 */
        var initTouch = function () {
            // initialize object to contain all touch values
            slider.touch = {
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 }
            }
            slider.viewport.bind('touchstart', onTouchStart);
        }

		/**
		 * Event handler for "touchstart"
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var onTouchStart = function (e) {
            if (slider.working) {
                e.preventDefault();
            } else {
                // record the original position when touch starts
                slider.touch.originalPos = el.position();
                var orig = e.originalEvent;
                // record the starting touch x, y coordinates
                slider.touch.start.x = orig.changedTouches[0].pageX;
                slider.touch.start.y = orig.changedTouches[0].pageY;
                // bind a "touchmove" event to the viewport
                slider.viewport.bind('touchmove', onTouchMove);
                // bind a "touchend" event to the viewport
                slider.viewport.bind('touchend', onTouchEnd);
            }
        }

		/**
		 * Event handler for "touchmove"
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var onTouchMove = function (e) {
            var orig = e.originalEvent;
            // if scrolling on y axis, do not prevent default
            var xMovement = Math.abs(orig.changedTouches[0].pageX - slider.touch.start.x);
            var yMovement = Math.abs(orig.changedTouches[0].pageY - slider.touch.start.y);
            // x axis swipe
            if ((xMovement * 3) > yMovement && slider.settings.preventDefaultSwipeX) {
                e.preventDefault();
                // y axis swipe
            } else if ((yMovement * 3) > xMovement && slider.settings.preventDefaultSwipeY) {
                e.preventDefault();
            }
            if (slider.settings.mode != 'fade' && slider.settings.oneToOneTouch) {
                var value = 0;
                // if horizontal, drag along x axis
                if (slider.settings.mode == 'horizontal') {
                    var change = orig.changedTouches[0].pageX - slider.touch.start.x;
                    value = slider.touch.originalPos.left + change;
                    // if vertical, drag along y axis
                } else {
                    var change = orig.changedTouches[0].pageY - slider.touch.start.y;
                    value = slider.touch.originalPos.top + change;
                }
                setPositionProperty(value, 'reset', 0);
            }
        }

		/**
		 * Event handler for "touchend"
		 *
		 * @param e (event)
		 *  - DOM event object
		 */
        var onTouchEnd = function (e) {
            slider.viewport.unbind('touchmove', onTouchMove);
            var orig = e.originalEvent;
            var value = 0;
            // record end x, y positions
            slider.touch.end.x = orig.changedTouches[0].pageX;
            slider.touch.end.y = orig.changedTouches[0].pageY;
            // if fade mode, check if absolute x distance clears the threshold
            if (slider.settings.mode == 'fade') {
                var distance = Math.abs(slider.touch.start.x - slider.touch.end.x);
                if (distance >= slider.settings.swipeThreshold) {
                    slider.touch.start.x > slider.touch.end.x ? el.goToNextSlide() : el.goToPrevSlide();
                    el.stopAuto();
                }
                // not fade mode
            } else {
                var distance = 0;
                // calculate distance and el's animate property
                if (slider.settings.mode == 'horizontal') {
                    distance = slider.touch.end.x - slider.touch.start.x;
                    value = slider.touch.originalPos.left;
                } else {
                    distance = slider.touch.end.y - slider.touch.start.y;
                    value = slider.touch.originalPos.top;
                }
                // if not infinite loop and first / last slide, do not attempt a slide transition
                if (!slider.settings.infiniteLoop && ((slider.active.index == 0 && distance > 0) || (slider.active.last && distance < 0))) {
                    setPositionProperty(value, 'reset', 200);
                } else {
                    // check if distance clears threshold
                    if (Math.abs(distance) >= slider.settings.swipeThreshold) {
                        distance < 0 ? el.goToNextSlide() : el.goToPrevSlide();
                        el.stopAuto();
                    } else {
                        // el.animate(property, 200);
                        setPositionProperty(value, 'reset', 200);
                    }
                }
            }
            slider.viewport.unbind('touchend', onTouchEnd);
        }

		/**
		 * Window resize event callback
		 */
        var resizeWindow = function (e) {
            // don't do anything if slider isn't initialized.
            if (!slider.initialized) return;
            // get the new window dimens (again, thank you IE)
            var windowWidthNew = $(window).width();
            var windowHeightNew = $(window).height();
            // make sure that it is a true window resize
            // *we must check this because our dinosaur friend IE fires a window resize event when certain DOM elements
            // are resized. Can you just die already?*
            if (windowWidth != windowWidthNew || windowHeight != windowHeightNew) {
                // set the new window dimens
                windowWidth = windowWidthNew;
                windowHeight = windowHeightNew;
                // update all dynamic elements
                el.redrawSlider();
                // Call user resize handler
                slider.settings.onSliderResize.call(el, slider.active.index);
            }
        }

		/**
		 * ===================================================================================
		 * = PUBLIC FUNCTIONS
		 * ===================================================================================
		 */

		/**
		 * Performs slide transition to the specified slide
		 *
		 * @param slideIndex (int)
		 *  - the destination slide's index (zero-based)
		 *
		 * @param direction (string)
		 *  - INTERNAL USE ONLY - the direction of travel ("prev" / "next")
		 */
        el.goToSlide = function (slideIndex, direction) {
            // if plugin is currently in motion, ignore request
            if (slider.working || slider.active.index == slideIndex) return;
            // declare that plugin is in motion
            slider.working = true;
            // store the old index
            slider.oldIndex = slider.active.index;
            // if slideIndex is less than zero, set active index to last child (this happens during infinite loop)
            if (slideIndex < 0) {
                slider.active.index = getPagerQty() - 1;
                // if slideIndex is greater than children length, set active index to 0 (this happens during infinite loop)
            } else if (slideIndex >= getPagerQty()) {
                slider.active.index = 0;
                // set active index to requested slide
            } else {
                slider.active.index = slideIndex;
            }
            // onSlideBefore, onSlideNext, onSlidePrev callbacks
            slider.settings.onSlideBefore(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
            if (direction == 'next') {
                slider.settings.onSlideNext(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
            } else if (direction == 'prev') {
                slider.settings.onSlidePrev(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
            }
            // check if last slide
            slider.active.last = slider.active.index >= getPagerQty() - 1;
            // update the pager with active class
            if (slider.settings.pager) updatePagerActive(slider.active.index);
            // // check for direction control update
            if (slider.settings.controls) updateDirectionControls();
            // if slider is set to mode: "fade"
            if (slider.settings.mode == 'fade') {
                // if adaptiveHeight is true and next height is different from current height, animate to the new height
                if (slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()) {
                    slider.viewport.animate({ height: getViewportHeight() }, slider.settings.adaptiveHeightSpeed);
                }
                // fade out the visible child and reset its z-index value
                slider.children.filter(':visible').fadeOut(slider.settings.speed).css({ zIndex: 0 });
                // fade in the newly requested slide
                slider.children.eq(slider.active.index).css('zIndex', slider.settings.slideZIndex + 1).fadeIn(slider.settings.speed, function () {
                    $(this).css('zIndex', slider.settings.slideZIndex);
                    updateAfterSlideTransition();
                });
                // slider mode is not "fade"
            } else {
                // if adaptiveHeight is true and next height is different from current height, animate to the new height
                if (slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()) {
                    slider.viewport.animate({ height: getViewportHeight() }, slider.settings.adaptiveHeightSpeed);
                }
                var moveBy = 0;
                var position = { left: 0, top: 0 };
                // if carousel and not infinite loop
                if (!slider.settings.infiniteLoop && slider.carousel && slider.active.last) {
                    if (slider.settings.mode == 'horizontal') {
                        // get the last child position
                        var lastChild = slider.children.eq(slider.children.length - 1);
                        position = lastChild.position();
                        // calculate the position of the last slide
                        moveBy = slider.viewport.width() - lastChild.outerWidth();
                    } else {
                        // get last showing index position
                        var lastShowingIndex = slider.children.length - slider.settings.minSlides;
                        position = slider.children.eq(lastShowingIndex).position();
                    }
                    // horizontal carousel, going previous while on first slide (infiniteLoop mode)
                } else if (slider.carousel && slider.active.last && direction == 'prev') {
                    // get the last child position
                    var eq = slider.settings.moveSlides == 1 ? slider.settings.maxSlides - getMoveBy() : ((getPagerQty() - 1) * getMoveBy()) - (slider.children.length - slider.settings.maxSlides);
                    var lastChild = el.children('.bx-clone').eq(eq);
                    position = lastChild.position();
                    // if infinite loop and "Next" is clicked on the last slide
                } else if (direction == 'next' && slider.active.index == 0) {
                    // get the last clone position
                    position = el.find('> .bx-clone').eq(slider.settings.maxSlides).position();
                    slider.active.last = false;
                    // normal non-zero requests
                } else if (slideIndex >= 0) {
                    var requestEl = slideIndex * getMoveBy();
                    position = slider.children.eq(requestEl).position();
                }

				/* If the position doesn't exist
				 * (e.g. if you destroy the slider on a next click),
				 * it doesn't throw an error.
				 */
                if ("undefined" !== typeof (position)) {
                    var value = slider.settings.mode == 'horizontal' ? -(position.left - moveBy) : -position.top;
                    // plugin values to be animated
                    setPositionProperty(value, 'slide', slider.settings.speed);
                }
            }
        }

		/**
		 * Transitions to the next slide in the show
		 */
        el.goToNextSlide = function () {
            // if infiniteLoop is false and last page is showing, disregard call
            if (!slider.settings.infiniteLoop && slider.active.last) return;
            var pagerIndex = parseInt(slider.active.index) + 1;
            el.goToSlide(pagerIndex, 'next');
        }

		/**
		 * Transitions to the prev slide in the show
		 */
        el.goToPrevSlide = function () {
            // if infiniteLoop is false and last page is showing, disregard call
            if (!slider.settings.infiniteLoop && slider.active.index == 0) return;
            var pagerIndex = parseInt(slider.active.index) - 1;
            el.goToSlide(pagerIndex, 'prev');
        }

		/**
		 * Starts the auto show
		 *
		 * @param preventControlUpdate (boolean)
		 *  - if true, auto controls state will not be updated
		 */
        el.startAuto = function (preventControlUpdate) {
            // if an interval already exists, disregard call
            if (slider.interval) return;
            // create an interval
            slider.interval = setInterval(function () {
                slider.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
            }, slider.settings.pause);
            // if auto controls are displayed and preventControlUpdate is not true
            if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('stop');
        }

		/**
		 * Stops the auto show
		 *
		 * @param preventControlUpdate (boolean)
		 *  - if true, auto controls state will not be updated
		 */
        el.stopAuto = function (preventControlUpdate) {
            // if no interval exists, disregard call
            if (!slider.interval) return;
            // clear the interval
            clearInterval(slider.interval);
            slider.interval = null;
            // if auto controls are displayed and preventControlUpdate is not true
            if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('start');
        }

		/**
		 * Returns current slide index (zero-based)
		 */
        el.getCurrentSlide = function () {
            return slider.active.index;
        }

		/**
		 * Returns current slide element
		 */
        el.getCurrentSlideElement = function () {
            return slider.children.eq(slider.active.index);
        }

		/**
		 * Returns number of slides in show
		 */
        el.getSlideCount = function () {
            return slider.children.length;
        }

		/**
		 * Update all dynamic slider elements
		 */
        el.redrawSlider = function () {
            // resize all children in ratio to new screen size
            slider.children.add(el.find('.bx-clone')).width(getSlideWidth());
            // adjust the height
            slider.viewport.css('height', getViewportHeight());
            // update the slide position
            if (!slider.settings.ticker) setSlidePosition();
            // if active.last was true before the screen resize, we want
            // to keep it last no matter what screen size we end on
            if (slider.active.last) slider.active.index = getPagerQty() - 1;
            // if the active index (page) no longer exists due to the resize, simply set the index as last
            if (slider.active.index >= getPagerQty()) slider.active.last = true;
            // if a pager is being displayed and a custom pager is not being used, update it
            if (slider.settings.pager && !slider.settings.pagerCustom) {
                populatePager();
                updatePagerActive(slider.active.index);
            }
        }

		/**
		 * Destroy the current instance of the slider (revert everything back to original state)
		 */
        el.destroySlider = function () {
            // don't do anything if slider has already been destroyed
            if (!slider.initialized) return;
            slider.initialized = false;
            $('.bx-clone', this).remove();
            slider.children.each(function () {
                $(this).data("origStyle") != undefined ? $(this).attr("style", $(this).data("origStyle")) : $(this).removeAttr('style');
            });
            $(this).data("origStyle") != undefined ? this.attr("style", $(this).data("origStyle")) : $(this).removeAttr('style');
            $(this).unwrap().unwrap();
            if (slider.controls.el) slider.controls.el.remove();
            if (slider.controls.next) slider.controls.next.remove();
            if (slider.controls.prev) slider.controls.prev.remove();
            if (slider.pagerEl && slider.settings.controls) slider.pagerEl.remove();
            $('.bx-caption', this).remove();
            if (slider.controls.autoEl) slider.controls.autoEl.remove();
            clearInterval(slider.interval);
            if (slider.settings.responsive) $(window).unbind('resize', resizeWindow);
        }

		/**
		 * Reload the slider (revert all DOM changes, and re-initialize)
		 */
        el.reloadSlider = function (settings) {
            if (settings != undefined) options = settings;
            el.destroySlider();
            init();
        }

        init();

        // returns the current jQuery object
        return this;
    }

})(jQuery);
;



var searchIndexes = [
    {
        Title: "Speech Therapy",
        Description: "Empowering kids, children, people with speech and language problems to speak more clearly",
        Keywords: "services, speech therapy,therapy,advantages of speech therapy,assessment,admission,Speech therapy procedure,enroll,Remediation of a language, articulation, voice or fluency impairment, which can have a lifelong social, academic and vocational impact,Individualized treatment programs provided via direct instruction,Comprehensive speech and language assessments,Assessment reports that will reveal strengths and weaknesses in speech, language, reading, writing and social skills,Consultation with family members and professionals,Speech and language goals incorporated into the curriculum,Development of expressive and receptive language and literacy skills,Assess concerns with coughing or choking while eating,Decrease or eliminate pain while swallowing,Improve feeding and swallowing function,ADHD (Attention Deficit Hyperactivity Disorder),ASD (Autism Spectrum Disorder),Auditory Processing Disorder,Augmentative Communication Devices (Proloquo2Go, LAMP, PECS),Childhood Apraxia of Speech,Down Syndrome,ESDM (Early Start Denver Model) – Early Intervention for children,diagnosed with or suspected of having Autism Spectrum Disorder (ASD),Fluency Therapy for stuttering,Hanen – More Than Words, It Takes Two to Talk and Talk ability,Learning Disabilities,Lidcombe Program – for children who stutter,Neurodevelopmental Delays,PECS (- Picture Exchange Communication System),PROMPT (PROMPTS for Restructuring Oral Muscular Phonetic Targets) – for motor speech disorders,Sequential Oral Sensory (SOS) Approach to Feeding,Social Skills Training including Social Thinking,Speech Sound Disorders,Voice Therapy",
        URL: "/speech-therapy"
    },
    {
        Title: "Autism Therapy",
        Description: "Empowering kids, children, people with autism problems and building a support system.",
        Keywords: "services,autism therapy,therapy,advantages of autism therapy,assessment,admission,autism therapy procedure,enroll,ASD,Autism Spectrum Disorder aka,Redflags,Autism Therapy Services,Augmentative Communication (Proloquo2Go, LAMP, PECS),Cuevas MEDEK Exercise Program,Feeding consultation and therapy,Handwriting Without Tears,Handwriting Without Tears (Hanen Centre),Natural Environment Teaching (NET),Neuro-Developmental Treatment (NDT),Parent Training Courses,PECS (Picture Exchange Communication System),Pivotal Response Therapy (PRT),PROMPT (PROMPTS for Restructuring Oral Muscular Phonetic Targets),Sensory-motor integration,Sequential Oral Sensory (SOS) Approach to Feeding,Social Skills Training including Social Thinking,The Zones of Regulation® for Self-Regulation,Intervention techniques are determined by the Interdisciplinary Autism,team based on the needs of the child and family",
        URL: "/autism-therapy"
    },
    {
        Title: "Occupational Therapy",
        Description: "occupations are engaging with family and friends and managing his or her home.",
        Keywords: "services,occupational therapy,therapy,advantages of occupational therapy,assessment,admission,occupational therapy procedure,ABI (Acquired Brain Injury),ADHD (Attention Deficit Hyperactivity Disorder),ADP (Assistive Devices Program),ASD (Autism Spectrum Disorder),Cerebral Palsy,Developmental Coordination Disorder,Down Syndrome,Dyspraxia (impaired motor planning),Fine Motor Delay,Gross Motor Delay,Handwriting,Learning Disabilities,Neurodevelopmental Delay,Neuro-Developmental Treatment (NDT),Sensory Integration,Sensory Processing Disorder,Sequential Oral Sensory (SOS) Approach to Feeding,The Zones of Regulation® for Self-Regulation,ABI (Acquired Brain Injury),ADP (Assistive Devices Program),Equipment Prescription,Home Safety,Mental Health,Parkinson’s Disease and ALS (Amyotrophic Lateral Sclerosis)",
        URL: "/occupational-therapy"
    },
    {
        Title: "Applied Behavior Analysis (ABA)",
        Description: "ABA therapy applies our understanding of how behavior works to real situations",
        Keywords: "services,Applied Behavior Analysis (ABA) therapy,therapy,advantages of Applied Behavior Analysis (ABA) therapy,assessment,admission,Conduct Functional Behavioral Assessments,Complete skill-based assessments such as the ABLLS-R (Assessment of Basic Language and Learning Skills Revised) and VB-MAPP (Verbal Behavior Milestones Assessment and Placement Program),Build cooperation and learner readiness skills,Teach Augmentative Communication such as PECS, Proloquo2Go and LAMP,Teach adaptive and functional behaviors that replace challenging behaviors,Provide individualized treatment that incorporates the child or youth’s motivation and interests to create a positive therapeutic environment,Increase independence across self-care, communication, play and social interaction skills,ABA can be provided to children with Autism Spectrum Disorder through direct intervention, consultation and parent training,The goal of ABA is to improve the child’s developmental trajectory and overall rate of learning as defined by clinically significant changes in the child’s cognitive, language and adaptive skills on standardized assessments,ABA can be provided in both structured and naturalistic teaching settings to further develop a child’s learner readiness, communication skills, social and play behaviors, pre-academic and independent living skills. ABA therapy can be delivered at our ABA centre, daycare, home or school,Our Therapists rely on years of experience and numerous hours of continuing education to work closely with patients and their families to improve communication, learning, and quality of life",
        URL: "/aba-therapy"
    },
    {
        Title: "Psychological Counseling",
        Description: "Counseling psychology addresses the emotional, social, work, school and physical health concerns of people",
        Keywords: "services,Psychological Counseling therapy,therapy,advantages of Psychological Counseling therapy,assessment,admission,Anger Management,Cognitive Behavioral Therapy (CBT),Suicidal Behavior,Marriage/ Marital Counseling,Career Counseling,Obsessive Compulsive Disorder (OCD) Treatment,Alcohol De-addiction Treatment,Depression Treatment,Online Counseling,Stress Management,Child and Adolescent Problems,Post Traumatic Stress Disorder (PTSD),Grief Counseling,Crisis Management,Early Parenting Issues,Addiction Counseling,Drug Abuse Counseling,Alcohol Abuse Counseling,GAMBLING ADDICTION,Nicotine Cessation,Family Counseling,Internet addiction,Family Problems,Conflict Resolution,Anger Control,Low Confidence,Relationship Problems,Drug Abuse & DeAddiction Therapy,Nicotine/Tobacco (Smoking) De-addiction Treatment,Pre-Marital Counseling,Psychotherapy Adult,De-Addiction,Stress Management Counseling,Mental health,Affective and Emotional Difficulties,Emotional Outbursts,DeAddiction Counseling,Youth Counseling,Adult Counseling,Loss of Interest,Loneliness,Individual therapy,Patient Counseling,Personal development,Professional Development,Parenting Issues & Doubts,Psychosocial rehabilitation,Parent Counseling,Lifestyle Disorders Treatment",
        URL: "/child-psychological-counseling"
    },
    {
        Title: "Special Education",
        Description: "Common special needs include learning disabilities.",
        Keywords: "services,Special Education,advantages of Special Education,assessment,admission,different approaches to teaching,specifically adapted teaching area,a resource room.",
        URL: "/special-education"
    },
    {
        Title: "dance therapy",
        Description: "Many pieces of research and studies have supported the positive effects of dance movement therapy on people with autism",
        Keywords: "services,dance therapy,advantages of dance therapy,assessment,admission,Improved attention and concentration.,It gives them the liberty to be expressive of their emotions, using movements.,It helps them enhance their social interactions and leads to the formation of relationships when placed in dyads or groups.,A therapist can help people to develop vocabulary skills, using the imitation of the repetitive movements the person engages in.,They learn different patterns of movements required for daily activities.,Group sessions are best to develop communications and social skills.,Choreographed sequences can help in enhancing one’s memory and recapitulation skills.,Touch during therapy helps in reducing sensitivity to physical touch and helps build trust.,Improved body image.,It helps in developing body awareness and promotes general well-being.,Different planes of motion during therapy help to stimulate verbal communication skills.,It also helps to strengthen fine motor skills.,It provides a platform to people with ASD to build upon their social skills, which helps them further to understand the emotions and feeling of other people.,They learn to develop empathy.,It helps them to learn adaptation to different situations.",
        URL: "/dance-therapy"
    },
    {
        Title: "music therapy",
        Description: "Empowering kids, children, people with speech and language problems to speak more clearly",
        Keywords: "services,music therapy,advantages of music therapy,assessment,admission,Research in music therapy supports its effectiveness in many areas such as: overall physical rehabilitation and facilitating movement, increasing people's motivation to become engaged in their treatment, providing emotional support for clients and their families, and providing an outlet for expression of feelings.",
        URL: "/music-therapy"
    },
    {
        Title: "yoga therapy",
        Description: "Yoga Therapy is a form of alternative therapy for those on the autism spectrum.",
        Keywords: "services,yoga therapy,advantages of yoga therapy,assessment,admission,yoga therapy asanas,Teachers and parents are finding yoga to be a Sensory Integration Therapy that can have a positive effect on the lives of children on the autism spectrum as well children with special needs.,Teachers who have utilized yoga as a Sensory Integration Therapy have found that it has helped their students on the autism spectrum improve their social skills.,Boyajian (2004) found through yoga her students gained “refined articulation” and “improved eye contact and social skills” (p. 25),Radhardkrishna (2012) found in her students, “changes in non-verbal communication, self esteem, emotional bonding, focus, tolerance to touch, proximity and sharing of attention,” (p,27), And Bahar (2006) saw her students proudly demonstrate their newly learned poses to their classmates.",
        URL: "/yoga-therapy"
    },
    {
        Title: "physio therapy",
        Description: "Empowering kids, children, people with Neurodevelopmental and participate in meaningful daily activities.",
        Keywords: "services,physio therapy,advantages of physio therapy,assessment,admission,Remediation of a functional issue that can have a lifelong social, academic, recreational and vocational impact on a child.,Increased confidence, self-awareness, independence and participation,Individualized treatment programs provided via direct instruction to infants, children, adults and their families,Comprehensive assessments revealing an analysis of strengths, weaknesses and goals to achieve meaningful participation in his or her daily activities,Consultation with daycare, classroom and resource teachers if necessary,Decrease risk of falls in adult or elderly clients,Increased mobility and range of motion in extremities",
        URL: "/physio-therapy"
    }
    ,
    {
        Title: "Assesments",
        Description: "Empowering kids, children, people with Neurodevelopmental and participate in meaningful daily activities.",
        Keywords: "services,physio therapy,advantages of physio therapy,assessment",
        URL: "/assesments"
    }
    ,
    {
        Title: "group teaching",
        Description: "Empowering kids, children, people to reach maximal independence on a variety of tasks.",
        Keywords: "services,group teaching,advantages of group teaching,assessment,essential goal for individuals with autism spectrum disorder (ASD) is to reach maximal independence on a variety of tasks that facilitate vocational engagement and community integration",
        URL: "/group-teaching"
    }

    ,
    {
        Title: "Courses",
        Description: "Courses",
        Keywords: "services,certified courses,advantages of certified courses",
        URL: "/certified-courses"
    },
    {
        Title: "parent training",
        Description: "There is no better therapist, friend, supporter, well wisher to their kids other than parents.",
        Keywords: "services,parent training,advantages of parent training,Increased confidence, self-awareness and participation",
        URL: "/parent-training"
    },
    {
        Title: "teacher training",
        Description: "Empowering the teachers with the needed information about these disorders is the primary goal of Teacher Training.",
        Keywords: "services,teacher training,advantages of teacher training,Increased confidence, self-awareness and participation,Certified - Proven - Empathetic therapists provide therapy with highest caliber.",
        URL: "/teacher-training"
    },
    {
        Title: "School Training",
        Description: "Most of the governments including Government of India made it mandatory for the schools.",
        Keywords: "services,teacher training,advantages of teacher training,Increased confidence, Any teacher whoever undergo through the teacher training with their immersive understanding of neurological conditions can help their school.",
        URL: "/school-training"
    }
    ,
    {
        Title: "Services",
        Description: "empowering kids, children, people with speech and language problems to speak more clearly.",
        Keywords: "services,Autism Therapy,Speech Therapy,Occupational Therapy,Behavioral Therapy,Psychological Counseling,Special Education,Dance Therapy,Music Therapy, Yoga Therapy, Hydro Therapy,Physio Therapy,Assessments,Group Teaching,Certified Courses,Parent Training,Teacher Training,School Training",
        URL: "/services"
    }
    ,
    {
        Title: "Innovation",
        Description: "Neurological Conditions such as Autism, Cognitive Development, Behavioral are chronic in nature. As these conditions are root cause less",
        Keywords: "Benefits,Innovation,Digital therapy record in cloud,specialities,Environment you Would Love,Responsive Management,Live Stream of Therapy,Patented Miracle System,Transparent Therapies,Most Affordable Therapy Price,Goal Based Therapies,Continual Feedback,Certified Therapists,Overall Development,World Class International",
        URL: "/innovation"
    }
    ,
    {
        Title: "About",
        Description: "Our soul purpose of existence is: enriching families with effective skills & intervention strategies for overall development of the children through hand crafted programs by industry experts leading to overall development of the child thus happy families.",
        Keywords: "about, vision,mission,values,bharath healthcare labs, kotii group of ventures,koti group of ventures,kgv",
        URL: "/about"
    }
    ,
    {
        Title: "Media",
        Description: "Our soul purpose of existence is: enriching families with effective skills & intervention strategies for overall development of the children through hand crafted programs by industry experts leading to overall development of the child thus happy families.",
        Keywords: "pbn,india today, pti,etv,dinamalar,business today,med india,sakshi,the week,telenagan today,abn,business standard,maha news,ians",
        URL: "/media-coverage"
    }
    ,
    {
        Title: "Events",
        Description: "Our soul purpose of existence is: enriching families with effective skills & intervention strategies for overall development of the children through hand crafted programs by industry experts leading to overall development of the child thus happy families.",
        Keywords: "pbn,india today, pti,etv,dinamalar,business today,med india,sakshi,the week,telenagan today,abn,business standard,maha news,ians",
        URL: "/events"
    }
    ,
    {
        Title: "News",
        Description: "Our soul purpose of existence is: enriching families with effective skills & intervention strategies for overall development of the children through hand crafted programs by industry experts leading to overall development of the child thus happy families.",
        Keywords: "latest news, latest, latest happenings, news",
        URL: "/news"
    },
    {
        Title: "Careers",
        Description: "Our soul purpose of existence is: enriching families with effective skills & intervention strategies for overall development of the children through hand crafted programs by industry experts leading to overall development of the child thus happy families.",
        Keywords: "careers, job, job opportunities",
        URL: "/careers"
    }
    ,
    {
        Title: "Contact",
        Description: "Our soul purpose of existence is: enriching families with effective skills & intervention strategies for overall development of the children through hand crafted programs by industry experts leading to overall development of the child thus happy families.",
        Keywords: "contact us,reach us",
        URL: "/contact"
    },
    {
        Title: "Login",
        Description: "Our soul purpose of existence is: enriching families with effective skills & intervention strategies for overall development of the children through hand crafted programs by industry experts leading to overall development of the child thus happy families.",
        Keywords: "login,epass",
        URL: "/epass"
    }
    ,
    {
        Title: "Donate",
        Description: "Our soul purpose of existence is: enriching families with effective skills & intervention strategies for overall development of the children through hand crafted programs by industry experts leading to overall development of the child thus happy families.",
        Keywords: "donate,donations",
        URL: "/donate"
    }
];



function loadCSS(href) {
    var cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = href;
    document.head.appendChild(cssLink);
}


function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}
function faqShowMore($this) {


    var container = $this.closest('.faq-show-more');
    if (container.classList.contains('active')) {
        setTimeout(function () { window.scrollTo(0, container.offsetTop); }, 400);

    }
    container.classList.toggle("active");
}

function debounce(func, wait, immediate) {
    var timeout;

    // This is the function that is actually executed when
    // the DOM event is triggered.
    return function executedFunction() {
        // Store the context of this and any
        // parameters passed to executedFunction
        var context = this;
        var args = arguments;

        // The function to be called after 
        // the debounce time has elapsed
        var later = function () {
            // null timeout to indicate the debounce ended
            timeout = null;

            // Call function now if you did not on the leading end
            if (!immediate) func.apply(context, args);
        };

        // Determine if you should call the function
        // on the leading or trail end
        var callNow = immediate && !timeout;

        // This will reset the waiting every function execution.
        // This is the step that prevents the function from
        // being executed because it will never reach the 
        // inside of the previous setTimeout  
        clearTimeout(timeout);

        // Restart the debounce waiting period.
        // setTimeout returns a truthy value (it differs in web vs node)
        timeout = setTimeout(later, wait);

        // Call immediately if you're dong a leading
        // end execution
        if (callNow) func.apply(context, args);
    };
};
function slideToSection(id) {
    $('html, body').animate({
        scrollTop: $("div[data-id='" + id + "']").offset().top
    }, 0);
}
function readMore(id) {



    // $("div[data-id='" + id + "'] .cm-read-text").css('display','inline');
    $("div[data-id='" + id + "'] .cm-read-text").slideDown(5000);
}
function ValidateAssessmentNumber(number) {
    if (!number || number.length < 10) {
        $(".assessment-base-arrowButton").addClass("hide");
        $('.assessment-base-cancel').addClass('hide');
        return;
    }
    $(".assessment-base-arrowButton").removeClass("hide");
}
var currentAssessment = {};
function OpenAssessmentBookOverlay(assessmentId) {

    $(".assessment-book-detailed-overlay").addClass('open');
    $(".assessment-book-detailed-overlay").addClass('active');
    $(".assessment-book-detailed-overlay").removeClass('close');
    currentAssessment.Id = assessmentId;
    currentAssessment.RelevantDataTitle = $(".text-center[data-id='" + assessmentId + "']").html();
    // alert(currentAssessment.RelevantDataTitle);
}
function CloseAssessmentBookOverlay() {
    $(".assessment-book-detailed-overlay").removeClass('open active');
    $(".assessment-book-detailed-overlay").addClass('close');
}
function OpenServicesOverlay(id) {
    $("." + id + ".working-inprogress-overlay-withanimations").addClass('open');
    $("." + id + ".working-inprogress-overlay-withanimations").addClass('active');
    $("." + id + ".working-inprogress-overlay-withanimations").removeClass('close');
}
function CloseservicesOverlay(id) {
    $("." + id + ".working-inprogress-overlay-withanimations").removeClass('open active');
    $("." + id + ".working-inprogress-overlay-withanimations").addClass('close');
}

function HideValidationOverlay() {
    jQuery(".working-inprogress-overlay-withanimations.validation-verify-overlay").removeClass('open');
    jQuery(".working-inprogress-overlay-withanimations.validation-verify-overlay").addClass('close');
    jQuery(".working-inprogress-overlay-withanimations.validation-verify-overlay").removeClass('active');
    jQuery(jQuery('.validation-verify-overlay .status-msg div').attr('id')).focus();
}

function ShowValidationStatusOverlay(statusMessageincludesHTMLTags) {
    jQuery(".working-inprogress-overlay-withanimations.validation-verify-overlay").removeClass('close');
    jQuery(".working-inprogress-overlay-withanimations.validation-verify-overlay").addClass('open');
    jQuery(".working-inprogress-overlay-withanimations.validation-verify-overlay").addClass("active");
    jQuery(".working-inprogress-overlay-withanimations.validation-verify-overlay .status-msg").html(statusMessageincludesHTMLTags);
}
jQuery('.parent-validation .alert-close-overlay-animation').click(function () {

    HideAlertOverlay();
});
function showConfirmBoxWithCancel(message, header, buttonvalue, isItError, callback) {
    try {
        $('.alert-success-confirm-overlay.working-inprogress-overlay-withanimations #alert-success-confirm-overlay-header').html(header);

        var okbuttonName = buttonvalue ? buttonvalue.split("{#}")[0] ? buttonvalue.split("{#}")[0] : "Okay" : "Okay";
        var cancelbuttonName = buttonvalue ? buttonvalue.split("{#}")[1] ? buttonvalue.split("{#}")[1] : "Cancel" : "Cancel";

        $('.alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-value="ok"]').val(okbuttonName);
        $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-value='cancel']").val(cancelbuttonName);

        $('.alert-success-confirm-overlay.working-inprogress-overlay-withanimations .alert-header').html(message);
        $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations").removeClass('close');
        $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations").addClass('open');
        $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-value='cancel']").show();
        $('.alert-success-confirm-overlay').show().addClass('active');
        $('.alert-success-confirm-overlay.working-inprogress-overlay-withanimations').removeClass('error');
        $('.alert-success-confirm-overlay.working-inprogress-overlay-withanimations svg').hide();

        $('.alert-success-confirm-overlay.working-inprogress-overlay-withanimations .SVU-close svg').show();
        if (isItError) {
            $('.alert-success-confirm-overlay.working-inprogress-overlay-withanimations').addClass('error');
        }

        $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-value='ok']").click(function () {
            //alert($(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-dontclose='true']"));
            // if (!$(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-dontclose='true']")) {

            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations").removeClass('open');
            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations").addClass('close');
            $('.alert-success-confirm-overlay').show().removeClass('active');
            //  }
            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-value='ok']").unbind("click");
            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-value='cancel']").unbind("click");


            callback(true);
        });

        $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-value='cancel']").click(function () {
            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations").removeClass('open');
            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations").addClass('close');
            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-value='cancel']").unbind("click");
            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations input[data-value='ok']").unbind("click");
            $('.alert-success-confirm-overlay').show().removeClass('active');
            callback(false);
        });

    } catch (e) {
        console.log(e.message);
    }
}
function HideAlertOverlay() {

    $(".working-inprogress-overlay-withanimations.alert-verify-overlay").removeClass('open');
    $(".working-inprogress-overlay-withanimations.alert-verify-overlay").addClass('close');
    $(".working-inprogress-overlay-withanimations.alert-verify-overlay").removeClass('active');
}

function ShowAlertStatusOverlay(statusMessageincludesHTMLTags, isSuccess) {
    $(".working-inprogress-overlay-withanimations.alert-verify-overlay").removeClass('close');
    $(".working-inprogress-overlay-withanimations.alert-verify-overlay").addClass('open');
    $(".working-inprogress-overlay-withanimations.alert-verify-overlay").addClass("active");
    var result = isSuccess ? 'flagSuccess' : 'flagfail';
    $(".working-inprogress-overlay-withanimations.alert-verify-overlay .alert-header").html("<div class='" + result + "'>" + statusMessageincludesHTMLTags + "</div>");
    $(".working-inprogress-overlay-withanimations.alert-verify-overlay input.hp-login-btn.btn.btn-whatsapp.ltblack").attr('title', statusMessageincludesHTMLTags);
}

function showStatusBar(message, isSuccess, fileUrl) {
    try {


        ShowAlertStatusOverlay(message, isSuccess, fileUrl);
        return;

    } catch (e) {
        // console.log(e.message);
    }
}
var validatedOtp = false;
function VerifyMobileNumber() {

    var mobileNumber = $(".cm-apply-form input[name=apply-form-phone]").val();
    if (!mobileNumber) {
        showStatusBar("Please enter mobile number", false);
        return;
    }
    $(".cm-submit-class .submit-wrapper").addClass('is-saving');
    // console.log("https://www.pinnacleblooms.org/api/sendotp?id=" + mobileNumber);
    //url: "https://www.pinnacleblooms.org/api/sendotp?id=" + mobileNumber,
    jQuery.ajax({
        url: "https://mirracle.pinnacleblooms.org/api/d1sendotp?id=" + mobileNumber + "&tag=91&emailId=",
        type: "POST",

        dataType: "json",
        success: function (data) {
            $(".cm-otp").removeClass('hide');
            $(".SendOtp").removeClass('hide');
            $(".verifyNumber").addClass('hide');
            $(".cm-apply-form input[name=apply-form-OTP]").removeAttr('disabled');
            $(".cm-submit-class .submit-wrapper").removeClass('is-saving');
        },
        error: function (x, y, z) {
            var errorMessage = JSON.parse(x.responseText).Message;
            //showStatusBar(z, false);
            showStatusBar(errorMessage, false);
            $(".cm-submit-class .submit-wrapper").removeClass('is-saving');

        }
    });

}
function ValidateOtp() {

    var mobileNumber = $(".cm-apply-form input[name=apply-form-phone]").val();
    if (!mobileNumber) {
        showStatusBar("Please enter mobile number", false);
        return
    }
    var OTP = $(".cm-apply-form input[name=apply-form-OTP]").val();
    if (!OTP) {
        showStatusBar("Please enter OTP", false);
        return
    }
    $(".cm-submit-class .submit-wrapper").addClass('is-saving');
    //url: "https://www.pinnacleblooms.org/api/validateotp?mobileNumber=" + mobileNumber + "&OTP=" + OTP,
    //url: "/api/UnsecuredAPI/ValidateOtp?mobileNumber=" + mobileNumber + "&otp=" + OTP
    jQuery.ajax({
        url: "https://mirracle.pinnacleblooms.org/api/d1validateotp?mobileNumber=" + mobileNumber + "&OTP=" + OTP + "&email=",
        type: "POST",
        dataType: "json",
        success: function (data) {
            $("input").removeAttr('disabled');
            $("select").removeAttr('disabled');
            $("textarea").removeAttr('disabled');
            validatedOtp = true;
            showStatusBar("Mobile number verified", false);
            $(".SendOtp").addClass("hide");
            $(".cm-otp").addClass('hide');
            $(".cm-apply-form input[name=apply-form-phone]").attr('disabled', 'disabled');
            $(".cm-submit-class .submit-wrapper").removeClass('is-saving');
        },
        error: function (x, y, z) {
            var errorMessage = JSON.parse(x.responseText).Message;
            //showStatusBar(z, false);
            showStatusBar(errorMessage, false);
            $(".cm-submit-class .submit-wrapper").removeClass('is-saving');
        }
    });

}
function ConnectCall(number, Id) {
    $(".loader-call").removeClass("hide");
    $(".loader-call").addClass("active");
    jQuery.ajax({
        url: "/api/UnsecuredAPI/ClickOCall?mobileNumber=" + number + "&userId=" + Id,
        type: "POST",

        dataType: "json",
        success: function (data) {

            $(".loader-call").addClass("hide");
            $(".loader-call").removeClass("active");
        },
        error: function (x, y, z) {
            $(".loader-call").addClass("hide");
            $(".loader-call").removeClass("active");
            showStatusBar(z, false);


        }
    });
}
function GetInvoiceDetails() {
    var invoiceId = $("#pay-form-invoice-id").val();
    if (!invoiceId || invoiceId == " ") {

        showStatusBar("Please enter invoice Id", false);
        return;
    }
    $(".cm-pay-form .submit-wrapper").addClass('is-saving');

    document.getElementById("pay-invoice-form").submit();
}
function DeleteInvoice(invoiceId) {
    if (!invoiceId) {
        showStatusBar("Enter Invoice Id", false);
        return;
    }
    var remarks = $('.delete-form #deleteremarks').val();
    var clearService = $('.delete-form #clearServices').prop('checked') == true ? true : false;
    if (!remarks) {
        showStatusBar("Enter remarks", false);
        return;
    }

    $(".deleteInvoiceSubmit .submit-wrapper").addClass('is-saving');
    var proceed = clearService == true ? true : false;

    var text = clearService == true ? " Are you sure services are clear" : "Are you sure services are not clear";
    var select = clearService == true ? "Yes{#}No" : "Yes{#}No";

    showConfirmBoxWithCancel(text, "", select, false, function (callback) {

        if (callback) {

            jQuery.ajax({
                url: "/api/UnsecuredAPI/DeleteInvoice?invoiceId=" + invoiceId + "&remarks=" + remarks + "&isclear=" + clearService,
                type: "POST",
                dataType: "json",
                success: function (data) {
                    $(".deleteInvoiceSubmit .submit-wrapper").removeClass('is-saving');
                    showStatusBar("Invoice deleted successfully", true);

                    $(form).find("input[type='text']").val("");
                    $(form).find("select").val("");

                },
                error: function (x, y, z) {
                    showStatusBar(z, false);

                }
            });

        }
        else {

            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations").removeClass('open');
            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations").removeClass('active');
            $(".alert-success-confirm-overlay.working-inprogress-overlay-withanimations").addClass('close');
            proceed = false;
            $(".deleteInvoiceSubmit .submit-wrapper").removeClass('is-saving');
            return;
        }


    });





}
function UploadDataFiles(files, croppedFIles, ActionType, MediaType, callback) {

    if ((null == croppedFIles || croppedFIles.length == 0) && (null == files || files.length == 0)) {
        //showStatusBar("There is no data to save",false);
        callback(null);
        return;
    }

    var uplaoddata = new FormData();

    if (files) {
        //  console.log(files);
        for (var i = 0; i < files.length; i++) {
            uplaoddata.append(files[i].name, files[i]);
        }
    }

    if (croppedFIles) {
        //  alert(croppedFIles.length);
        for (var i = 0; i < croppedFIles.length; i++) {
            uplaoddata.append(croppedFIles[i].name, croppedFIles[i].target, croppedFIles[i].name);
        }
    }

    //alert(uplaoddata.length);
    var galleryURLS = "";
    jQuery.ajax({
        url: '/api/unsecuredapi/SaveMultMediaFile',
        beforeSend: function (request) {
            request.setRequestHeader("ActionType", ActionType);
            request.setRequestHeader("MediaType", MediaType);
            request.setRequestHeader("ClientType", "WEB");
            // request.setRequestHeader("AccessToken", decodeURIComponent($("#user-id").val()));
        },
        data: uplaoddata,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', function (e) {

                    if (e.lengthComputable) {
                        var max = e.total;
                        var current = e.loaded;
                        var Percentage = (current * 100) / max;
                        // console.log(Percentage);
                        // console.log(page.toLowerCase());



                        if (Percentage >= 100) {
                            // process completed  
                        }
                    }
                }, false);
            }
            return myXhr;
        },
        cache: false,
        contentType: false,
        async: true,
        processData: false,
        type: 'POST',
        success: function (result) {



            callback(result);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            //HideLoading();
            callback("failed");
            showStatusBar("Sorry, We are unable to upload files to server", false);
        }
    });
}
function ClearSearch() {
    $('.auto-complete-search').html('');
}
function OpenBlockToView(id) {
    var isExpanded = $('#' + id).attr('data-expanded');

    if (isExpanded != 'true') {
        $('#' + id).find('.services-title').removeClass('active');
        $('#' + id).attr('data-expanded', true);
    }
}

function changeDisplayView(type) {
    $(".display-selection span").removeClass("active");
    $(".display-selection span[data-id=" + type + "]").addClass("active");
    if (type.toLowerCase() == "grid") {
        $(".assess-set").addClass("gridview");
    }
    else {
        $(".assess-set").removeClass("gridview");
    }
}
function SlideAndHide(type) {
    var isExpanded = $('.assess-group[data-id=' + type + "]").attr('data-expanded');

    if (isExpanded == 'true') {

        $(".all-s-Set[data-id=" + type + "]").addClass("hide");
        $('.assess-group[data-id=' + type + "]").attr('data-expanded', false);
        return;
    }
    $(".all-s-Set[data-id=" + type + "]").removeClass("hide");
    $('.assess-group[data-id=' + type + "]").attr('data-expanded', true);

}
function AutoCompleteSearchResult(val) {
    var result = $.grep(searchIndexes, function (e) {

        return e.Title.toLowerCase().indexOf(val.toLowerCase()) > -1 || e.Description.toLowerCase().indexOf(val.toLowerCase()) > -1 || e.Keywords.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });

    var html = "";
    if (!result) {
        ClearSearch();
        return;
    }
    $.each(result, function (key, val) {
        html += '<li><a href="' + val.URL + '" title="' + val.Title + '"><div class="title">' + val.Title + '</div><div class="description">' + val.Description + '</div><div class="url">' + val.URL + '</div></a></li>';

    });
    $('.auto-complete-search').html(html);

}

function SearchPageResult(val) {
    var result = $.grep(searchIndexes, function (e) {

        return e.Title.toLowerCase().indexOf(val.toLowerCase()) > -1 || e.Description.toLowerCase().indexOf(val.toLowerCase()) > -1 || e.Keywords.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
    // alert(val);

    var html = "";
    if (!result || result.length == 0) {
        // alert(result);
        html = "<li class='no-results'>No Result found with the search term " + val + " </li>";
        $('.searchpage-result ul').html(html);
        return;
    }

    $.each(result, function (key, val) {
        html += '<li><a href="' + val.URL + '" title="' + val.Title + '"><div class="title">' + val.Title + '</div><div class="description">' + val.Description + '</div><div class="keywords">' + val.Keywords + '</div><div class="url">' + val.URL + '</div></a></li>';

    });
    $('.searchpage-result ul').html(html);

}

function loadjscssfile(filename, filetype, isItHead) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("data-timestamp", +new Date())
        fileref.setAttribute("src", filename)
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }

    if (typeof fileref != "undefined") {
        if (isItHead) {
            document.getElementsByTagName("head")[0].appendChild(fileref)
        }
        else {
            document.getElementsByTagName("body")[0].appendChild(fileref)
        }
    }
}

var isFaceBookLoaded = false;
var isTwitterLoaded = false;
function loadFacebookTwitterJs() {
    if ($('#facebook-mirracle').is_on_screen() == true) {
        if (!isFaceBookLoaded) {
            isFaceBookLoaded = true;
            loadjscssfile('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2&appId=299597106810075&autoLogAppEvents=1', 'js', false);
        }
        $(".cm-section-right #youtube-video-1").attr("src", "https://www.youtube-nocookie.com/embed/videoseries?list=PL0lwT9W0zVpiXlkKqJmOiUzaP-QLTXtNK&autoplay=1&loop=1");
    }


    if ($('#twitter-mirracle').is_on_screen() == true) {
        if (!isTwitterLoaded) {
            isTwitterLoaded = true;
            loadjscssfile('https://platform.twitter.com/widgets.js', 'js', false);
        }
    }


}

var disqusLoaded = false;
var addThisPluginLoaded = false;
function loadDiscussandaddthisplugin() {
    try {
        if (!disqusLoaded) {
            if ($('#disqus_thread').is_on_screen() == true) {
                disqusLoaded = true;
                loadjscssfile('https://apherald-1.disqus.com/embed.js', 'js', false);
            }
        }

        if (!addThisPluginLoaded) {
            if ($('.addthis_inline_share_toolbox').is_on_screen() == true) {
                addThisPluginLoaded = true;
                loadjscssfile('//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5c8ce14b71cfe9e5', 'js', false);
            }
        }

    } catch (e) {

    }
}
$(document).ready(function () {

    try {

        var faqTitles = document.querySelectorAll('.faq-container .news-title');

        faqTitles.forEach(function (title) {
            title.addEventListener('click', function () {
                var isActive = this.classList.contains('active');
                var content = this.nextElementSibling;

                if (isActive) {
                    content.classList.remove('active');
                    this.classList.remove('active');
                } else {
                    var allContent = document.querySelectorAll('.faq-container .news_text');
                    allContent.forEach(function (item) {
                        if (item !== content) {
                            item.classList.remove('active');
                        }
                    });

                    var allTitles = document.querySelectorAll('.news-title');
                    allTitles.forEach(function (item) {
                        item.classList.remove('active');
                    });

                    var contentHeight = content.scrollHeight + 'px';
                    content.classList.add('active');
                    this.classList.add('active');
                }
            });
        });

    } catch (e) {

    }

    try {
        $('.bottom-menu-container .tabButton').on('click', function () {
            $('html, body').animate({
                scrollTop: ($('.each-tab-section[data-sid=' + $(this).attr('data-id') + ']').first().offset().top)
            }, 500);

            ;
        });


    } catch (e) {

    }

    try {
        // alert("Script Working, Page Ready");
        $(".faq-c-ul li").click(function () {

            var id = $(this).attr('data-id');

            $(".faq-c-ul li").removeClass('active');
            $(this).addClass('active');
            $(".search-content-div").hide();
            $(".search-content-div#" + id).show();



        });
    }
    catch (e) {

    }

    try {

      GetHomeArticles('cm-latestnews', 0);

        if (isNewsRightSideRequired) {
            GetHomeArticles('cm-latestnews', 0);
        }

         //if (!IsMobile) {
   
 //}



    } catch (e) {

    }

    $('.mirracle-loading').addClass('active');

    try {
        if (IsSearchPage) {
            SearchPageResult(searchTerm);
        }
    } catch (e) {

    }

    try {
        loadFacebookTwitterJs();
    } catch (e) {

    }
    $('.cm-apply-section').on('click', 'input,select,textarea', function () {
        if (!validatedOtp) {
            $(".cm-apply-section input").prop('disabled', true);
            $(".cm-apply-section textarea").prop('disabled', true);
            $(".cm-apply-section select").prop('disabled', true);
            showStatusBar("Please verify mobile number before entering these values", false);
        }

    });

    $('.cm-h-tb-r-navbar-top').on('click', '.search-top-bar', function () {
        $('.cm-h-searchbar').toggleClass('active');
        if ($('.cm-h-searchbar').hasClass('active')) {
            $('.cm-h-searchbar input').focus();
        }
        ClearSearch();
    });

    //$('.faq-container .news-title').click(function () {

    //    $('.faq-container div').slideUp();
    //    $('.news-title').removeClass('active');
    //    $(this).addClass('active');
    //    $(this).next().slideDown();
    //    //return false;
    //});


    $('#pinnacle-text-search').keyup(function () {
        var val = $(this).val();
        if (!val) {
            ClearSearch();
            return;
        }
        AutoCompleteSearchResult(val.trim());
    });

    $('.cm-mirracle-go-top').click(function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;

    });

    try {
        if (IsNewsPage) {
            GetNewsArticles('cm-news-page-content');
        }
    } catch (e) {

    }

    try {
        if (IsAssessmentPage) {
            GetAssessmentsArticles('cm-latestassessments');
        }

    } catch (e) {

    }
    //$('.cm-mini-header-seperator .accordian-header').click(function () {


    //    var isExpanded = $(this).parents('.cm-mini-header-seperator').attr('data-expanded');

    //    if (isExpanded == 'true') {
    //        $(this).parents('.cm-mini-header-seperator').attr('data-expanded', false);
    //        $(this).find('.services-title').addClass('active');

    //        return;
    //    }


    //        // $(".bil-accordian-section").attr('data-expanded',false);

    //      $(this).find('.services-title').removeClass('active');
    //        $(this).parents('.cm-mini-header-seperator').attr('data-expanded', true);


    //});

    $('.cm-mini-assessments .accordian-header').click(function () {

        var id = $(this).attr("data-attr");
        console.log(id);
        var isExpanded = $(this).parents('.cm-mini-assessments[data-id=' + id + "]").attr('data-expanded');

        if (isExpanded == 'true') {
            $(this).parents('.cm-mini-assessments[data-id=' + id + "]").attr('data-expanded', false);

            $('.all-s-Set[data-id=' + id + "]").addClass("hide");
            $(this).find('.expand-closed').addClass("hide");
            $(this).find('.expand-open').removeClass("hide");
            return;
        }


        // $(".bil-accordian-section").attr('data-expanded',false);

        $(this).find('.services-title').removeClass('active');
        $(this).parents('.cm-mini-assessments[data-id=' + id + "]").attr('data-expanded', true);
        $('.all-s-Set[data-id=' + id + "]").removeClass("hide");
        $(this).find('.expand-closed').removeClass("hide");
        $(this).find('.expand-open').addClass("hide");
    });
    $(".cm-assess-type input[type=radio]").on('change', function () {
        var value = $(this).val();
        //console.log(value);
        if (value.toLowerCase() == "assisted") {
            $(".cm-ass-facility").removeClass("hide");
        }
        else {
            $(".cm-ass-facility").addClass("hide");
        }
    });


    $('.infoType li').on('click', function () {
        $('.infoType li').removeClass('active');
        $(this).addClass('active');
        $('.tab-info-content').removeClass('active');
        var d = $(this).attr('data-Sid');

        $('.tab-content-staff').find('.tab-info-content[data-id="' + $(this).attr('data-Sid') + '"]').addClass('active');

    });


    $('#contact-form-mobile').on('keyup', function () {

        if (this.value.match(/[^0-9 ]/g)) {
            this.value = this.value.replace(/[^0-9 ]/g, '');
        }
    });
    $('body').on('click', '.cm-h-tb-r-nbt-menu a', function () {
        $('body').toggleClass('menu-active');
    });
    $('#close-modal').on('click', function () {
        $('.ReactModal__Overlay').css('display', 'none');
        $('html, body').removeClass('popUpBackround');
    });
    $('body').on('click', '.cm-h-tb-r-nbt-menu a', function () {

        $('.ReactModal__Overlay').css('display', 'block');
        $('html, body').addClass('popUpBackround');
    });
    $('.media-marquee-list1 #flexslider-93').on('click', 'li a', function () {
        var dataId = $(this).attr('data-id');

        if (!dataId) {

            return;
        }

        if (dataId.indexOf("https") <= -1) {

            window.open(dataId, '_blank');
            return;
        }
        document.getElementById('media-page-detailed-overlay-iframe').src = dataId;
        $("#media-page-detailed-overlay-form-submit").show();
        $('.media-page-detailed-overlay').addClass('open');
        $('.media-page-detailed-overlay').removeClass('close');
        $('.media-page-detailed-overlay').addClass('active');

    });
    $('.share_navigator').click(function () {

        var title = $(this).attr('data-title');
        var url = $(this).attr('data-url');


        if (navigator.share === undefined) {
            console.log('Undefined!');
        }
        else {
            console.log('Sharing!');
            //navigator.share({ title: 'Example Page', text: 'https://example.com' });
            navigator.share({ title: title, url: url });
        }
    });
    $('.cm-media-main-page').on('click', 'li a', function () {
        if (!$(this).parents('li').attr('data-href')) {
            showStatusBar("We have seen some issue in this media page..Please do try later", false);
            console.log("media")
            return;
        }
        var source = $(this).parents('li').attr('data-href');
        if (source.indexOf("https") <= -1) {
            window.open(source, '_blank');
            return;
        }
        var url = $(this).parents('li').attr('data-href');
        $.ajax({
            cache: false,
            url: url,
            method: "POST",
            error: function (xhr, ajaxOptions, thrownError) {
                showStatusBar("We have seen some issue in this media page..Please do try later", false);
            },
            statusCode: {
                404: function () {
                    //alert('not found');
                    showStatusBar("We have seen some issue in this media page..Please do try later", false);

                },
                200: function () {
                    document.getElementById('media-page-detailed-overlay-iframe').src = $(this).parents('li').attr('data-href');
                    $("#media-page-detailed-overlay-form-submit").show();
                    $('.media-page-detailed-overlay').addClass('open');
                    $('.media-page-detailed-overlay').removeClass('close');
                    $('.media-page-detailed-overlay').addClass('active');
                }
            }
        });

    });

    $("#media-page-detailed-overlay-iframe").on("load", function () {
        $("#media-page-detailed-overlay-form-submit").hide();
    });


    $('.working-inprogress-overlay-withanimations').on('click', '.mirracle-close', function () {

        var overaly = $(this).parents('.working-inprogress-overlay-withanimations');
        $(overaly).removeClass('open');
        $(overaly).addClass('close');
        $(overaly).removeClass('active');
    });
    setTimeout(function () {
        try {
            loadjscssfile("https://www.youtube.com/iframe_api", "js", "head");
        } catch (e) {

        }
    }, 500);
    function validateEmail(sEmail) {

        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (filter.test(sEmail)) {
            return true;
        }
        else {
            return false;
        }

    }



    function UploadDataFiles(files, croppedFIles, ActionType, MediaType, callback, callbackPerscentage) {

        if ((null == croppedFIles || croppedFIles.length == 0) && (null == files || files.length == 0)) {
            //showStatusBar("There is no data to save",false);
            callback(null);
            return;
        }

        if (MediaType == "Audio") {
            var types = /(\.|\/)(mp3|mp4)$/i;
            //file is the file, that the user wants to upload
            var sfile = files[0];

            if (types.test(sfile.type) || types.test(sfile.name)) {
                // alert("file is valid");
            }
            else {
                alert("Please Select Valid Audio File");
                callback(null);
                return false;
            }
        }




        var uplaoddata = new FormData();

        if (files) {

            for (var i = 0; i < files.length; i++) {
                uplaoddata.append(files[i].name, files[i]);
            }
        }

        if (croppedFIles) {
            //  alert(croppedFIles.length);
            for (var i = 0; i < croppedFIles.length; i++) {
                uplaoddata.append(croppedFIles[i].name, croppedFIles[i].target, croppedFIles[i].name);
            }
        }

        //alert(uplaoddata.length);
        var galleryURLS = "";
        jQuery.ajax({
            url: '/api/unsecuredapi/SaveMultMediaFile',
            beforeSend: function (request) {
                request.setRequestHeader("ActionType", ActionType);
                request.setRequestHeader("MediaType", MediaType);
                request.setRequestHeader("ClientType", "WEB");
                // request.setRequestHeader("AccessToken", decodeURIComponent($("#user-id").val()));
            },
            data: uplaoddata,
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function (e) {

                        if (e.lengthComputable) {
                            var max = e.total;
                            var current = e.loaded;
                            var Percentage = (current * 100) / max;
                            //console.log(Percentage);
                            // console.log(page.toLowerCase());



                            if (Percentage >= 100) {
                                // process completed  
                            }
                            else {
                                callbackPerscentage(Percentage);
                            }
                        }
                    }, false);
                }
                return myXhr;
            },
            cache: false,
            contentType: false,
            async: true,
            processData: false,
            type: 'POST',
            success: function (result) {



                callback(result);

            },
            error: function (xhr, ajaxOptions, thrownError) {
                //HideLoading();
                callback("failed");
                showStatusBar("Sorry, We are unable to upload files to server", false);
            }
        });
    }
    var ResumeFiles = [];
    var FileName = "";
    $("#apply-form-URL").change(function (evt) {
        var target = evt.target || evt.srcElement || evt.currentTarget;
        // console.log(target);
        if (target.files.length > 0) {

            var files = target.files;

            for (i = 0; i < files.length; i++) {

                try {
                    ResumeFiles.push(files[i]);
                    // console.log(files[i]);
                    var name = files[i].name;

                } catch (e) {
                    //  console.log(e);
                }
            }
        }
        UploadDataFiles(ResumeFiles, [], "Resumes", "", function (data) {


            if (data == "failed") {
                showStatusBar("We are unable to upload your files to server", false);
                return;
            }
            else if (data) {

                //   console.log(data);
                //  console.log(data[0]);
                FileName = data[0].Path;


            }

        });

    });
    var FranschiseFiles = [];
    var FranchiseFileName = "";
    $("#franchise-form-URL").change(function (evt) {
        var target = evt.target || evt.srcElement || evt.currentTarget;
        //  console.log(target);
        if (target.files.length > 0) {

            var files = target.files;

            for (i = 0; i < files.length; i++) {

                try {
                    FranschiseFiles.push(files[i]);
                    //  console.log(files[i]);
                    var name = files[i].name;

                } catch (e) {
                    //   console.log(e);
                }
            }
        }
        UploadDataFiles(FranschiseFiles, [], "Franchise", "", function (data) {


            if (data == "failed") {
                showStatusBar("We are unable to upload your files to server", false);
                return;
            }
            else if (data) {


                FranchiseFileName = data[0].Path;


            }

        });

    });
    function getGridSize() {
        //  console.log(window.innerWidth);
        return (window.innerWidth < 600) ? 2 :
            (window.innerWidth < 900) ? 3 : (window.innerWidth < 1200) ? 4 : (window.innerWidth < 1400) ? 4 : (window.innerWidth < 1600) ? 5 : 6;
    }
    //$('.btn-arrow-right').click(function () {

    //    $('html, body').animate({
    //        scrollTop: $(".cm-container-contact").offset().top
    //    }, 2000);
    //    $('.cm-contact-form input[name=contact-form-name]').focus();
    //});
    //$('.cm-backtoServices').click(function () {
    //    $('html, body').animate({
    //        scrollTop: $(".cm-related-links").offset().top
    //    }, 2000);
    //});

    // var flexslider = { vars: {} };
    //$('#flexslider-93').flexslider({
    //     animation: "slide",
    //     easing: "linear",								// I disable this option because there was a bug with Jquery easing and Joomla 3.2.3
    //     direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    //     slideshowSpeed: 3500, 			// How long each slide will show
    //     animationSpeed: 2000, 			// Slide transition speed
    //     directionNav: true,
    //     controlNav: false,
    //     pauseOnHover: true,
    //     itemWidth: 120,
    //     initDelay: 0,
    //     randomize: false,
    //     smoothHeight: false,
    //     minItems: getGridSize(),
    //     maxItems: getGridSize(),
    //     move: getGridSize(),
    //     touch: false,
    //     keyboardNav: true,
    //     animationLoop: true
    //});


    var bxOptions = {
        mode: "horizontal",
        speed: 2000,
        startSlide: 0,
        infiniteLoop: true,
        easing: "linear",
        tickerHover: true,
        adaptiveHeight: true,
        responsive: true,
        minSlides: getGridSize(),
        maxSlides: getGridSize(),
        moveSlides: getGridSize(),
        slideWidth: 250,
        slideMargin: 30,
        nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" stroke-width="1"><g stroke-width="1" transform="translate(0.5, 0.5)"><polyline fill="none" stroke="#444444" stroke-width="1" stroke-linecap="square" stroke-miterlimit="10" points="9,2 23,16 9,30 " transform="translate(0, 0)" stroke-linejoin="miter"></polyline></g></svg>',
        prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" stroke-width="1"><g stroke-width="1" transform="translate(0.5, 0.5)"><polyline fill="none" stroke="#444444" stroke-width="1" stroke-linecap="square" stroke-miterlimit="10" points="23,30 9,16 23,2 " transform="translate(0, 0)" stroke-linejoin="miter"></polyline></g></svg>'
    };
    var boxOptions = {
        mode: "horizontal",
        speed: 2000,
        startSlide: 0,
        infiniteLoop: true,
        easing: "linear",
        tickerHover: true,
        adaptiveHeight: true,
        responsive: true,
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 1,
        slideWidth: 160,
        slideMargin: 30,
        auto: true,
        autoControls: true,
    };

    // var slider = $('#flexslider-93').bxSlider(bxOptions);
    $('.owl-stages').bxSlider(boxOptions);
    $(window).resize(function () {
        var gridSize = getGridSize();
        // console.log(gridSize);

        bxOptions.minSlides = gridSize;
        bxOptions.maxSlides = gridSize;
        bxOptions.moveSlides = gridSize;
        // slider.reloadSlider(bxOptions);
    });

    !function (t) {
        "use strict";
        var s = {
            duration: 14000,
            timer: null,
            currentIndex: 0,
            container: t('.cm-s-images'),
            init: function () {

                this.rows = t('.cm-s-random-generator .cm-s-content-each', t.container);

                this.total = this.rows.length;

                this.shape = t(".shape svg polygon");
                this.steps = t("animate", this.shape);
                //setTimeout(function(){
                //    this.Timer();
                //    },this.duration);

                this.Timer();
                this.resizeSvg();
                //t('.cm-s-random-generator .cm-s-content-each', t.container).hover(function () {
                //    clearInterval(this.timer);

                //}, function () {
                //    this.Timer();
                //})

            },
            Timer: function () {
                var t = this;
                this.timer = setInterval(function () {
                    t.Slide();

                }, this.duration);
            },
            resizeSvg: function () {
                var e = this.container.height()
                    , s = 70;// parseInt(e("#home-banner-shapes").css("margin-top"), 10) + parseInt(e("#home-banner-shapes").css("margin-bottom"), 10);
                // console.log(e-s);

                // t("#home-banner-shapes").css("height", e - s)
                // t("#home-banner-shapes").css("width", e)
            },
            Slide: function () {

                this.currentIndex++;
                this.currentIndex = this.currentIndex >= this.total ? 0 : this.currentIndex;
                var e = this.steps.eq(this.currentIndex).get(0);
                try {
                    e.beginElement()
                } catch (t) { }
                var imageUrl = this.container.find('.img[data-banner-index=' + this.currentIndex + ']').attr('data-img-src');
                // console.log(imageUrl);
                if (imageUrl) {
                    t(this.container).removeClass('current');//.fadeOut(1000);
                    t('.img', this.container).fadeOut(1000);
                }
                t('.cm-s-random-generator .cm-s-content-each').removeClass('current');//.fadeOut(1000);

                var color = this.container.find('.img[data-banner-index=' + this.currentIndex + ']').attr('data-banner-color');

                if (imageUrl) {
                    this.container.find('.img[data-banner-index=' + this.currentIndex + ']').css('background-image', 'url(' + imageUrl + ')');
                    t('.cm-s-random-generator .shape .cm-circle', this.container).css('background-color', color);
                    this.container.find('.img[data-banner-index=' + this.currentIndex + ']').fadeIn(2000);

                }
                this.container.find('.cm-s-random-generator .cm-s-content-each[data-banner-index=' + this.currentIndex + ']').addClass('current');//.fadeIn(2000);

            }
        }
        t(function () {
            s.init();


        })

    }(jQuery);
    $('.SVU-close-validation,.parent-validation .validation-close-overlay-animation').click(function () {
        HideValidationOverlay();
    });
    var isEnrollSubmitted = false;
    $('.cm-form-section .enroll-form-submit').click(function () {
        if (isEnrollSubmitted) {
            return;
        }
        var form = $(this).parents("form");
        var name = $(form).find('input[name=contact-form-name]').val();
        var email = $(form).find('input[name=contact-form-email]').val();
        var phone = $(form).find('input[name=contact-form-mobile]').val();
        //var subject = $(form).find('input[name=contact-form-subject]').val();
        var title = $(form).find('#contact-form-title option:selected').val();
        var message = $(form).find('textarea[name=contact-form-message]').val();
        //var subject = $(form).find('#contact-for option:selected').val();
        // var whendoYouWant = $(form).find("input[name='contact-form-preference']:checked");
        var services = $(form).find("input[name='contact-services-offered']:checked");
        var facility = $(form).find("input[name='contact-facility-offered']:checked");
        var languages = $(form).find("input[name='contact-language-offered']:checked");
        // var newsLetterSubscription = $(this).find("input[name='contact-form-Newsletter']").prop('checked') == true ? "Yes" : "No";

        $(".validationblock").removeClass('error');
        var validated = true;
        var validatedHtml = "";
        var index = 0;

        if (!name) {
            index++;
            $(form).find('input[name=contact-form-name]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter name</span><br/>";
            validated = false;
        }

        if (!email) {
            index++;
            $(form).find('input[name=contact-form-email]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter email id</span><br/>";
            validated = false;
        }
        if (email && !validateEmail(email)) {
            index++;
            validatedHtml += "" + index + ".<span>Please enter valid email id</span><br/>";
            $(form).find("input[name=contact-form-email]").addClass('error');
        }

        if (!title) {
            index++;
            $(form).find('#contact-form-title').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter title</span><br/>";
            validated = false;
        }
        //if (!subject) {
        // index++
        // $(form).find('#contact-for').parents(".validationblock").addClass("error");
        // validatedHtml += "" + index + ".<span style='color:red'>Please select about</span><br/>";
        //    validated = false;
        //}
        if (!message) {
            index++;
            $(form).find('textarea[name=contact-form-message]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter message</span><br/>";
            validated = false;
        }
        if (!phone) {

            index++;
            $(form).find('input[name=contact-form-mobile]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter mobile number</span><br/>";
            validated = false;
        }
        if (phone && !(/^\d{10}$/.test(phone))) {
            index++;
            validatedHtml += "" + index + ".<span> Please enter valid mobile number</span><br/>";
        }
        if (!services || services.length == 0) {
            index++;
            validated = false;
            validatedHtml += "" + index + ".<span> Please choose atleast one service</span><br/>";
        }
        if (!languages || languages.length == 0) {
            index++;
            validated = false;
            validatedHtml += "" + index + ".<span> Please choose atleast one language</span><br/>";
        }
        //if (!whendoYouWant || whendoYouWant.length == 0) {
        //    index++;
        //    validated = false;
        //    validatedHtml += "" + index + ".<span style='color:red'> Please choose when do you want us to contact</span><br/>";
        //}
        if (!facility || facility.length == 0) {
            index++;
            validatedHtml += "" + index + ".<span> Please select the facility</span><br/>";

        }

        if (validatedHtml) {
            ShowValidationStatusOverlay(validatedHtml);
            return;
        }

        var servicesVals = [];
        var whenToContact = [];
        var langaugesList = [];
        var facilities = [];
        //$.each(whendoYouWant, function () {
        //    whenToContact.push($(this).val());
        //});
        $.each(facility, function () {
            facilities.push($(this).val());
        });
        $.each(services, function () {
            servicesVals.push($(this).val());
        });
        $.each(languages, function () {
            langaugesList.push($(this).val());
        });

        var enrollData = new Object();
        enrollData.FormType = "Enroll";
        enrollData.Name = title + ". " + name;
        enrollData.MobileNumber = phone;
        enrollData.Message = message;
        enrollData.EmailId = email;
        enrollData.Services = servicesVals;
        //  enrollData.WhenDoYouWantToStart = whendouWant;
        // enrollData.WhenDoYouWantUsToContact = whenToContact;
        enrollData.FacilityIds = facilities;
        enrollData.Title = title;
        enrollData.Languages = langaugesList;
        // enrollData.NewsLetterSubscription = newsLetterSubscription;
        /* Enquiry fields are not logged. */
        isEnrollSubmitted = true;
        $(".working-inprogress-overlay-withanimations.validation-contact-overlay").addClass('open active');
        $(".working-inprogress-overlay-withanimations.validation-contact-overlay").removeClass('close');
        jQuery(form).find('.submit-wrapper').addClass('is-saving');
        //https://mirracle.pinnacleblooms.org/
        ///api/gl/swfs
        //var parameters = "FormType=Enroll&Mobile=" + phone + "&Name=" + title + ". " + name + "&Email=" + email + "&Title=" + title + "Message=" + message
        jQuery.ajax({
            url: "https://mirracle.pinnacleblooms.org/api/gl/swfs",
            type: "POST",
            data: JSON.stringify(enrollData),
            dataType: "json",
            success: function (data) {
                jQuery(form).find('.submit-wrapper').removeClass('is-saving');
                jQuery(form).find('.loading-contact-form-submit').hide();
                $(".working-inprogress-overlay-withanimations.validation-contact-overlay").removeClass('open active');
                $(".working-inprogress-overlay-withanimations.validation-contact-overlay").addClass('close');
                $('#franchise-saving-loader').hide();
                onEnrollmentSuccess();
                showStatusBar("Your request was sent. Our team will contact you to confirm the centre and appointment. For help call 9100 181 181.", true);
                isEnrollSubmitted = false;
                jQuery(form).find("input[type='text']").val("");
                jQuery(form).find("input[type='email']").val("");
                jQuery(form).find("textarea").val("");
                jQuery(form).find("select").val("");
                jQuery(form).find("input[type='checkbox']").attr('checked', false);

            },
            error: function (x, y, z) {
                //showStatusBar(x.responseJSON.ErrorMsg, false);
                showStatusBar("Your request is failed ,please try after sometime or call 9100181181 for further support", false);
                isEnrollSubmitted = false;
                jQuery(form).find('.loading-contact-form-submit').hide();



            }
        });


    });



    // After successful API response on enrollment form
    function onEnrollmentSuccess() { /* A transport response is not a booking or revenue event. */ }

    $('.cm-form-section .apply-form-submit').click(function () {
        var form = $(this).parents("form");
        var name = $(form).find('input[name=apply-form-name]').val();
        var email = $(form).find('input[name=apply-form-email]').val();
        var phone = $(form).find('input[name=apply-form-phone]').val();
        var title = $(form).find('#apply-form-title option:selected').val();
        var address = $(form).find('textarea[name=apply-form-address]').val();
        var altmobileNumber = $(form).find('textarea[name=apply-form-alt]').val();
        var experience = $(form).find('input[name=apply-form-exp]').val();
        var qualification = $(form).find('input[name=apply-form-education]').val();
        var location = $(form).find('input[name=apply-form-location]').val();

        $(".validationblock").removeClass('error');
        var validated = true;
        var validatedHtml = "";
        var index = 0;
        if (!name) {
            index++;
            $(form).find('input[name=apply-form-name]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter name</span><br/>";
            validated = false;
        }

        if (!email) {
            index++;
            $(form).find('input[name=apply-form-email]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter email id</span><br/>";
            validated = false;
        }
        if (email && !validateEmail(email)) {
            index++;
            validatedHtml += "" + index + ".<span>Please enter valid email id</span><br/>";
            $(form).find("input[name=apply-form-email]").addClass('error');
        }

        if (!title) {
            index++;
            $(form).find('#apply-form-title').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter title</span><br/>";
            validated = false;
        }
        if (!experience) {
            index++;
            $(form).find('#apply-form-exp').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter experience</span><br/>";
            validated = false;
        }
        if (!qualification) {
            index++;
            $(form).find('#apply-form-education').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter Education Qualification</span><br/>";
            validated = false;
        }
        if (!phone) {

            index++;
            $(form).find('input[name=apply-form-phone]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter mobile number</span><br/>";
            validated = false;
        }
        if (phone && !(/^\d{10}$/.test(phone))) {
            index++;
            validatedHtml += "" + index + ".<span> Please enter valid mobile number</span><br/>";
        }

        if (altmobileNumber && !(/^\d{10}$/.test(altmobileNumber))) {
            index++;
            validatedHtml += "" + index + ".<span> Please enter valid alt mobile number</span><br/>";
        }

        if (validatedHtml || !validated) {
            ShowValidationStatusOverlay(validatedHtml);
            return;
        }

        var enrollData = new Object();
        enrollData.Name = title + ". " + name;
        enrollData.MobileNumber = phone;
        enrollData.Address = address;
        enrollData.Experience = experience;
        enrollData.Qualification = qualification;
        enrollData.EmailId = email;
        enrollData.Location = location;
        enrollData.AltMobileNumber = altmobileNumber;
        enrollData.URL = FileName;
        enrollData.Title = title;
        enrollData.FormType = "careers";
        $(".working-inprogress-overlay-withanimations.validation-apply-overlay").addClass('open active');
        $(".working-inprogress-overlay-withanimations.validation-apply-overlay").removeClass('close');
        jQuery(form).find('.loading-apply-form-submit').show();

        //  console.log(FileName);
        ///* Enquiry fields are not logged. */
        //return;https://mirracle.pinnacleblooms.org
        //url: "/api/gl/swfs",
        jQuery.ajax({
            url: "https://mirracle.pinnacleblooms.org/api/gl/swfs",
            type: "POST",
            data: JSON.stringify(enrollData),
            dataType: "json",
            success: function (data) {
                jQuery(form).find('.loading-apply-form-submit').hide();
                $(".working-inprogress-overlay-withanimations.validation-apply-overlay").removeClass('open active');
                $(".working-inprogress-overlay-withanimations.validation-apply-overlay").addClass('close');
                $('#franchise-saving-loader').hide();
                showStatusBar("Thanks for submitting your request with Pinnacle <br/><br/> Pinnacle care team will call you on your number with in 24 hrs", true);

                jQuery(form).find("input[type='text']").val("");
                jQuery(form).find("input[type='tel']").val("");
                jQuery(form).find("input[type='email']").val("");
                jQuery(form).find("input[type='file']").val("");
                jQuery(form).find("textarea").val("");
                jQuery(form).find("select").val("");

            },
            error: function (x, y, z) {
                //showStatusBar(x.responseJSON.ErrorMsg, false);
                showStatusBar("Please try again later or contact 9100181181 for further support", false);
                jQuery(form).find('.loading-apply-form-submit').hide();
                $(".working-inprogress-overlay-withanimations.validation-apply-overlay").removeClass('open active');
                $(".working-inprogress-overlay-withanimations.validation-apply-overlay").addClass('close');


            }
        });

    });
    $('.cm-form-section .contact-form-submit').click(function () {

        var form = $(this).parents("form");
        var name = $(form).find('input[name=contact-form-name]').val();
        var email = $(form).find('input[name=contact-form-email]').val();
        var phone = $(form).find('input[name=contact-form-mobile]').val();
        //var subject = $(form).find('input[name=contact-form-subject]').val();
        var title = $(form).find('#contact-form-title option:selected').val();
        var message = $(form).find('textarea[name=contact-form-message]').val();
        var facility = $(form).find('#facility-for option:selected').val();
        var subject = $(form).find('#contact-for option:selected').val();
        $(".validationblock").removeClass('error');
        var validated = true;
        var validatedHtml = "";
        var index = 0;

        if (!name) {
            index++;
            $(form).find('input[name=contact-form-name]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter name</span><br/>";
            validated = false;
        }

        if (!email) {
            index++;
            //  showStatusBar("Please enter mobile number");
            $(form).find('input[name=contact-form-email]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter email id</span><br/>";
            validated = false;
        }
        if (email && !validateEmail(email)) {
            index++;
            validatedHtml += "" + index + ".<span>Please enter valid email id</span><br/>";
            $(form).find("input[name=contact-form-email]").addClass('error');
        }

        if (!title) {
            index++;
            $(form).find('#contact-form-title').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter title</span><br/>";
            validated = false;
        }
        if (!subject) {
            index++
            $(form).find('#contact-for').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please select about</span><br/>";
            validated = false;
        }
        if (!message) {
            index++;
            $(form).find('textarea[name=contact-form-message]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter message</span><br/>";
            validated = false;
        }
        if (!phone) {
            index++;
            $(form).find('input[name=contact-form-mobile]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please enter mobile number</span><br/>";
            validated = false;
        }
        if (phone && !(/^\d{10}$/.test(phone))) {
            index++;
            validatedHtml += "" + index + ".<span> Please enter valid mobile number</span><br/>";
        }

        if (!facility) {
            index++;
            $(form).find('#facility-for').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span>Please select facility</span><br/>";
            validated = false;
        }

        if (validatedHtml || !validated) {
            ShowValidationStatusOverlay(validatedHtml);
            return;
        }
        $(".working-inprogress-overlay-withanimations.validation-contact-overlay").addClass('open active');
        $(".working-inprogress-overlay-withanimations.validation-contact-overlay").removeClass('close');
        jQuery(form).find('.loading-contact-form-submit').show();

        var nameT = title + ". " + name;

        var customerObj = new Object();
        customerObj.Name = nameT;
        customerObj.Title = title;
        customerObj.EmailId = email;
        customerObj.Subject = subject;
        customerObj.Message = message;
        customerObj.MobileNumber = phone;
        customerObj.FacilityIds = [facility];
        customerObj.FormType = "contact submit";
        console.log(JSON.stringify(customerObj));
        ///api/gl/swfs
        jQuery.ajax({
            url: "https://mirracle.pinnacleblooms.org/api/gl/swfs",
            type: "POST",
            data: JSON.stringify(customerObj),
            dataType: "json",
            success: function (data) {
                jQuery(form).find('.loading-contact-form-submit').hide();
                $(".working-inprogress-overlay-withanimations.validation-contact-overlay").removeClass('open active');
                $(".working-inprogress-overlay-withanimations.validation-contact-overlay").addClass('close');
                $('#franchise-saving-loader').hide();
                showStatusBar("Thanks for submitting your request with Pinnacle Blooms Network.  <br/><br/> Our care executive from National Care Centre will get in touch within in 24 Hrs. time.", true);

                // $(form).find("input[name='contact-services-offered']").removeAttr('checked');
                //  $(form).find("input[name='when-do-youwant']").removeAttr('checked');
                //  $(form).find("input[name='franchise-form-name']").val("");
                jQuery(form).find("input[type='text']").val("");
                jQuery(form).find("input[type='email']").val("");
                jQuery(form).find("textarea").val("");
                jQuery(form).find("select").val("");
                //  $(form).find("input[name='franchise-form-mobile']").val("");
            },
            error: function (x, y, z) {
                jQuery(form).find('.loading-contact-form-submit').hide();
                //showStatusBar(x.responseJSON.ErrorMsg, false);
                showStatusBar("Your request is failed, try again after sometime or reach out 9100181181 for further support", false);
                //showStatusBar(z, false);
                jQuery(form).find('.loading-contact-form-submit').hide();



            }
        });


    });

    $("#contact-form-assessment").change(function () {
        var id = $(this).val();

        var category = $('#contact-form-assessment option:selected').attr("data-category");;

        $.each($(".cm-assess-type input[type=radio]"), function () {

            if (category.indexOf($(this).val()) == -1) {
                $(this).parent(".template-form-line").addClass('hide');
            }
            else {

                $(this).parent(".template-form-line").removeClass('hide');

            }
        });
    });
    jQuery(".login-base-assessmentInput").keydown(function () {
        var number = $(this).val().trim();
        if (!number || number.length < 10 || isNumber(number)) {
            $(".assessment-number-arrowButton").addClass("hide");

            $('.mobile-base-otp').addClass("hide");
            return;
        }
    });
    jQuery(".login-base-assessmentInput").keyup(function (e) {

        var number = $(this).val().trim();

        var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        ValidateAssessmentNumber(number);
        if (e.keyCode == 13) {
            $('.send-otp-set').trigger('click');
        }

    });
    $(".cat-section h3").click(function () {
        var type = $(this).attr("data-id");
        $(".assessment-ui[data-id=" + type + "]").slideToggle(500);
        $(this).toggleClass("open");
        if ($(this).hasClass("close")) {
            $(this).removeClass("close");
        }
        else {
            $(this).addClass("close");
        }
        setTimeout(function () {
            $(window).scroll();
        }, 500);
    });
    var enrollData = new Object();
    $('.send-otp-set').click(function () {
        var form = $(this).parents("form");
        var name = $(form).find('input[name=contact-assess-name]').val();
        var email = $(form).find('input[name=contact-assess-email]').val();
        var phone = $(form).find('input[name=contact-assess-mobile]').val();
        //var subject = $(form).find('input[name=contact-form-subject]').val();

        var dob = $(form).find('input[name=contact-assess-dob]').val();
        var gender = $(form).find('#contact-assess-gender option:selected').val();
        var assessment = $(form).find('#contact-form-assessment option:selected').val();
        var assessmentName = $(form).find('#contact-form-assessment option:selected').attr("data-name");
        if (!assessmentName && currentAssessment) {
            assessmentName = currentAssessment.RelevantDataTitle;
        }
        if (!assessment && currentAssessment) {
            assessment = currentAssessment.Id;
        }
        var assesstype = $(form).find("input[name='contact-assess-offered']:checked").val();
        var facility = $(form).find("input[name='contact-facility-assess']:checked");
        var country = $(form).find('#contact-assess-Country option:selected').val();

        $(".validationblock").removeClass('error');
        var validated = true;
        var validatedHtml = "";
        var index = 0;
        if (!assessment) {
            index++;
            $(form).find('#contact-form-assessment').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span style='color:red'> Please select the assessment</span><br/>";
            validated = false;
        }
        if (!assesstype) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please select how you want to take this assessment</span><br/>";
            validated = false;
        }
        if (assesstype && assesstype.toLowerCase() == "at center" && (!facility || facility.length == 0)) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please select the facility</span><br/>";

        }
        if (!country) {
            index++;
            $(form).find('#contact-assess-Country').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span style='color:red'>Please select title</span><br/>";
            validated = false;
        }
        if (!name) {
            index++;
            $(form).find('input[name=contact-assess-name]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span style='color:red'>Please enter name</span><br/>";
            validated = false;
        }




        if (!phone) {

            index++;
            $(form).find('input[name=contact-assess-mobile]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span style='color:red'>Please enter mobile number</span><br/>";
            validated = false;
        }
        if (phone && !(/^\d{10}$/.test(phone))) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter valid mobile number</span><br/>";
        }
        if (!dob) {
            index++;
            $(form).find('#contact-assess-dob').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span style='color:red'>Please enter DOB</span><br/>";
            validated = false;
        }
        if (!gender) {
            index++;
            $(form).find('#contact-assess-gender').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span style='color:red'>Please enter Gender</span><br/>";
            validated = false;
        }

        if (!email) {
            index++;
            $(form).find('input[name=contact-assess-email]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span style='color:red'>Please enter email id</span><br/>";
            validated = false;
        }
        if (email && !validateEmail(email)) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'>Please enter valid email id</span><br/>";
            $(form).find("input[name=contact-assess-email]").addClass('error');
        }



        if (validatedHtml) {
            ShowValidationStatusOverlay(validatedHtml);
            return;
        }


        var facilities = [];

        $.each(facility, function () {
            facilities.push($(this).val());
        });



        enrollData.Name = name;
        enrollData.MobileNumber = phone;

        enrollData.EmailId = email;
        enrollData.LeadType = "Assessment";
        enrollData.Gender = gender;
        enrollData.DOB = dob;
        enrollData.FacilityIds = facilities;
        enrollData.ObjId = assessment;
        enrollData.Location = assesstype;
        enrollData.F1 = assessmentName;
        enrollData.Country = country;
        //console.log(enrollData);
        $(".working-inprogress-overlay-withanimations.validation-assess-overlay").addClass('open active');
        $(".working-inprogress-overlay-withanimations.validation-assess-overlay").removeClass('close');
        jQuery(form).find('.loading-contact-form-submit').show();

        jQuery.ajax({
            url: "/api/UnsecuredAPI/SendOTPToAssessmentLead",
            type: "POST",
            data: enrollData,
            dataType: "json",
            success: function (data) {
                jQuery(form).find('.loading-contact-form-submit').hide();
                $(".working-inprogress-overlay-withanimations.validation-assess-overlay").removeClass('open active');
                $(".working-inprogress-overlay-withanimations.validation-assess-overlay").addClass('close');
                $('#franchise-saving-loader').hide();
                $(".cm-fs-otp").removeClass("hide");
                $(".send-otp-set").addClass("hide");
                $(".book-set").removeClass("hide");

                if (country.toLowerCase() == "india") {
                    $(".otp-sentTo").html("OTP will be sent to your mobile number, please do enter valid OTP");
                }
                else {
                    $(".otp-sentTo").html("OTP will be sent to your mail, please do enter valid OTP");
                }
            },
            error: function (x, y, z) {
                // alert("jd");
                $(".working-inprogress-overlay-withanimations.validation-assess-overlay").removeClass('open active');
                $(".working-inprogress-overlay-withanimations.validation-assess-overlay").addClass('close');
                showStatusBar(z, false);
            }
        });
    });
    $('.cm-assess-book').click(function () {

        var form = $(this).parents("form");
        var otp = $(form).find('input[name=contact-assess-otp]').val();


        $(".validationblock").removeClass('error');
        var validated = true;
        var validatedHtml = "";
        var index = 0;




        if (!otp) {

            index++;
            $(form).find('input[name=contact-assess-otp]').parents(".validationblock").addClass("error");
            validatedHtml += "" + index + ".<span style='color:red'>Please enter otp</span><br/>";
            validated = false;
        }
        if (otp && !(/^\d{4}$/.test(otp))) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter valid otp</span><br/>";
        }

        if (validatedHtml) {
            ShowValidationStatusOverlay(validatedHtml);
            return;
        }

        enrollData.F2 = otp;
        $(".working-inprogress-overlay-withanimations.validation-assess-overlay").addClass('open active');
        $(".working-inprogress-overlay-withanimations.validation-assess-overlay").removeClass('close');
        jQuery(form).find('.loading-contact-form-submit').show();
        $('.cm-assess-book .submit-wrapper').addClass('is-saving');
        jQuery.ajax({
            url: "/api/UnsecuredAPI/AssessmentLead",
            type: "POST",
            data: enrollData,
            dataType: "json",
            success: function (data) {
                jQuery(form).find('.loading-contact-form-submit').hide();
                $(".working-inprogress-overlay-withanimations.validation-assess-overlay").removeClass('open active');
                $(".working-inprogress-overlay-withanimations.validation-assess-overlay").addClass('close');
                $('#franchise-saving-loader').hide();

                jQuery(form).find("input[type='text']").val("");
                jQuery(form).find("input[type='email']").val("");
                jQuery(form).find("input[type='tel']").val("");
                jQuery(form).find("input[type='date']").val("");
                jQuery(form).find("input[type='radio']").prop("checked", false);
                jQuery(form).find("textarea").val("");
                jQuery(form).find("select").val("");
                jQuery(form).find("input[type='checkbox']").attr('checked', false);
                if (enrollData.Location.toLowerCase() == "self") {
                    location.href = "/selfassessmenttoIQM?id=" + data.ObjId + "&mobilenumber=" + data.MobileNumber;
                }
                else {
                    showStatusBar("Thanks for submitting your request with Pinnacle <br/><br/> Pinnacle care team will call you on your number with in 24 hrs", true);
                }
                $('.cm-assess-book .submit-wrapper').removeClass('is-saving');
                $(".cm-fs-otp").addClass("hide");
                $(".send-otp-set").removeClass("hide");
                $(".book-set").addClass("hide");
                enrollData = new Object();
                CloseAssessmentBookOverlay();

            },
            error: function (x, y, z) {
                showStatusBar(z, false);
                $('.cm-assess-book .submit-wrapper').removeClass('is-saving');
                $(".working-inprogress-overlay-withanimations.validation-assess-overlay").removeClass('open active');
                $(".working-inprogress-overlay-withanimations.validation-assess-overlay").addClass('close');



            }
        });


    });


    $('.number-only').on('keyup', function () {
        // $('textarea[id$=txtfpconfirmcomments]').change(function (event) {
        //alert(this.value);
        if (this.value.match(/[^0-9 ]/g)) {
            this.value = this.value.replace(/[^0-9 ]/g, '');
        }
    });
    $('.cm-franchise-form .franchise-form-submit').click(function () {
        //if (!ValidateInputsOverlay('#enrollment-form-submit', true))
        //{ return false; }
        //  alert("why");
        var form = $(this).parents('.cm-franchise-form');

        //var services = $(form).find("input[name='contact-services-offered']:checked");
        //var whendoYouWant = $(form).find("input[name='when-do-youwant']:checked");
        var name = $(form).find("input[name='franchise-form-name']").val();
        var district = $(form).find("input[name='franchise-form-District']").val();
        var state = $(form).find("input[name='franchise-form-State']").val();
        var mobile = $(form).find("input[name='franchise-form-mobile']").val();
        var address = $(form).find("textarea[name='franchise-form-address1']").val();
        var pincode = $(form).find("input[name='franchise-form-pincode']").val();
        var dob = $(form).find("input[name='franchise-form-dob']").val();
        var homenumber = $(form).find("input[name='franchise-form-homemobile']").val();
        var cellularPhone = $(form).find("input[name='franchise-form-Cellular']").val();
        var email = $(form).find('input[name=franchise-form-Email]').val();
        var maritalStatus = $(form).find('#Marital-status option:selected').val();
        var numberOfdependants = $(form).find('input[name=franchise-form-Dependants]').val();
        var faxNumber = $(form).find('input[name=franchise-form-fax]').val();
        var pan = $(form).find('input[name=franchise-form-pan]').val();
        var country = $(form).find('input[name=franchise-form-Citizenship]').val();
        var RSAResident = $(form).find('input[name=franchise-form-RSA]').val();
        var preferedLoc = $(form).find('input[name=franchise-form-prefered-location]').val();
        var highestEdu = $(form).find('input[name=franchise-form-highest-eduaction]').val();
        var degreeearned = $(form).find('input[name=franchise-form-Degree-earned]').val();
        var CollegeName = $(form).find('input[name=franchise-form-name-college]').val();
        var InvestmentAmount = $(form).find('input[name=franchise-form-cash-stocks]').val();
        var marketValue = $(form).find('input[name=franchise-form-market-value]').val();
        var estateowned = $(form).find('input[name=franchise-form-estate-owned]').val();
        var pensionfund = $(form).find('input[name=franchise-form-pension-fund]').val();
        var annualIncome = $(form).find('input[name=franchise-form-Current-annual]').val();
        var URL = FranchiseFileName;
        var signature = $(form).find('input[name=franchise-form-SIGNATURE]').val();
        var signDate = $(form).find('input[name=franchise-form-sign-DATE]').val();
        $(form).find("input").removeClass('error');
        $(form).find("select").removeClass('error');
        //  $(form).find("select").removeClass('error');
        //  $(form).find("input[name='enroll-form-mobile']").removeClass('error');

        var validatedHtml = "";
        var index = 0;

        if (!dob) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter date of birth</span><br/>";

            $(form).find("input[name='franchise-form-dob']").parents(".validationblock").addClass('error');
        }
        if (!maritalStatus) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter marital status</span><br/>";

            $(form).find('#Marital-status option:selected').parents(".validationblock").addClass('error');
        }

        if (!name) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter name</span><br/>";

            $(form).find("input[name='franchise-form-name']").parents(".validationblock").addClass('error');
        }
        if (!email) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter email</span><br/>";

            $(form).find("input[name=franchise-form-Email]").parents(".validationblock").addClass('error');
        }

        if (!address) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter address</span><br/>";

            $(form).find("textarea[name='franchise-form-address1']").parents(".validationblock").addClass('error');
        }
        if (!pincode) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter pincode</span><br/>";
            $(form).find("input[name='franchise-form-pincode']").parents(".validationblock").addClass('error');
        }
        if (pincode && (!(/^\d{6}$/.test(pincode)) || pincode.length < 6)) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter valid pincode</span><br/>";
            $(form).find("input[name='franchise-form-pincode']").parents(".validationblock").addClass('error');
        }
        if (!district) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter your District</span><br/>";

            $(form).find("input[name='franchise-form-District']").parents(".validationblock").addClass('error');
        }
        if (!state) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter your State</span><br/>";

            $(form).find("input[name='franchise-form-State']").parents(".validationblock").addClass('error');
        }
        if (!country) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter country</span><br/>";

            $(form).find("input[name='franchise-form-Citizenship']").parents(".validationblock").addClass('error');
        }
        if (!preferedLoc) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter prefered location</span><br/>";

            $(form).find("input[name='franchise-form-prefered-location']").parents(".validationblock").addClass('error');
        }


        if (!mobile) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter mobile number</span><br/>";
            $(form).find("input[name='franchise-form-mobile']").parents(".validationblock").addClass('error');
        }
        if (!pan) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter pan number</span><br/>";
            $(form).find("input[name='franchise-form-pan']").parents(".validationblock").addClass('error');
        }
        if (mobile && (!(/^\d{10}$/.test(mobile)) || mobile.length < 10)) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter valid mobile number</span><br/>";
        }
        if (cellularPhone && (!(/^\d{10}$/.test(cellularPhone)) || cellularPhone.length < 10)) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter valid cellular Phone number</span><br/>";
        }
        if (!highestEdu) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter highest level of  education</span><br/>";
            $(form).find("input[name='franchise-form-highest-eduaction']").parents(".validationblock").addClass('error');
        }
        if (!InvestmentAmount) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter investment amount</span><br/>";
            $(form).find("input[name='franchise-form-cash-stocks']").parents(".validationblock").addClass('error');
        }
        if (!annualIncome) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter annual income</span><br/>";
            $(form).find("input[name='franchise-form-Current-annual']").parents(".validationblock").addClass('error');
        }
        if (!signature) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter signature</span><br/>";
            $(form).find("input[name='franchise-form-SIGNATURE']").parents(".validationblock").addClass('error');
        }
        if (!signDate) {
            index++;
            validatedHtml += "" + index + ".<span style='color:red'> Please enter Date</span><br/>";
            $(form).find("input[name='franchise-form-sign-DATE']").parents(".validationblock").addClass('error');
        }
        if (validatedHtml) {

            ShowValidationStatusOverlay(validatedHtml);
            return;
        }


        //  console.log(whendoYouWant[0]);


        var franchise = new Object();
        franchise.Name = name;
        franchise.MobileNumber = mobile;

        franchise.Pincode = pincode;
        franchise.address = address;
        franchise.Email = email;
        franchise.PreferedLocation = preferedLoc;
        franchise.HomeNumber = homenumber;
        franchise.CellularMobileNum = cellularPhone;
        franchise.FaxNumber = faxNumber;
        franchise.HighestEducation = highestEdu;
        franchise.DegreesEarned = degreeearned;
        franchise.CollegeName = CollegeName;
        franchise.InvestmentAmount = InvestmentAmount;
        franchise.Marketvalue = marketValue;
        franchise.RealEstatevalue = estateowned;
        franchise.PensionFund = pensionfund;
        franchise.AnnualIncome = annualIncome;
        franchise.URL = URL;
        franchise.MaritalStatus = maritalStatus;
        franchise.PanNumber = pan;
        franchise.RSAResident = RSAResident;
        franchise.Country = country;
        franchise.District = district;
        franchise.State = state;
        franchise.Dependants = numberOfdependants;
        franchise.DOB = dob;
        franchise.FormType = "franchiserequest";
        $('#franchise-saving-loader').show();

        //console.log(JSON.stringify(franchise));
        //return;
        jQuery.ajax({
            url: "https://mirracle.pinnacleblooms.org/api/gl/swfs",
            type: "POST",
            data: JSON.stringify(franchise),
            dataType: "json",
            success: function (data) {
                $('#franchise-saving-loader').hide();
                showStatusBar("Thanks for submitting your request with Pinnacle Blooms Network <br/><br/> Pinnacle National Care Center will call you  with in 24 hrs", true);
                $(".franchise-form-overlay").removeClass('open active');
                $(".franchise-form-overlay").addClass('close');
                HideValidationOverlay();
                $(form).find("input[type='text']").val("");
                $(form).find("select").val("");

            },
            error: function (x, y, z) {
                //showStatusBar(z, false);
                showStatusBar("Your request is failed , please try after sometime or call 9100181181 for further support", false);
                $('#franchise-saving-loader').hide();



            }
        })


        // enrollData.MobileNumber = mobile;

    });



    //!function (t, i) {
    //    "use strict";
    //    var s = {
    //        duration: 3e3,
    //        delay: 12e3,
    //        init: function () {
    //            var i = (t(".banner-block-content"),
    //            this);
    //            this.banner = t(".banner-block-content"),
    //            this.rows = t(".field-collection-container .field-collection-view", this.banner),
    //            this.total = this.rows.length,
    //            this.start = randomInt(0, this.total - 1),
    //            this.bootstrap = "col-sm-6 col-sm-offset-6",
    //            this.rows.each(function (s, n) {
    //                var e = t("div.img", t(this));
    //                t(this).wrapInner('<div class="inner"></div>'),
    //                t(this).wrapInner('<div class="' + i.bootstrap + '"></div>'),
    //                e.attr("data-banner-index", s).appendTo(t(".images", i.banner)),
    //                t(this).attr("data-banner-index", s).attr("class", "text").appendTo(t(".texts .container", i.banner))
    //            }),
    //            t(".field-collection-container", this.banner).remove(),
    //            this.imgDivs = t(".images .img", this.banner),
    //            this.txtDivs = t(".texts .text", this.banner),
    //            this.imgDivs.eq(this.start).css("background-image", "url(" + this.imgDivs.eq(this.start).data("img-src") + ")"),
    //            this.imgDivs.eq(this.start).addClass("current").show(),
    //            this.txtDivs.eq(this.start).addClass("current").fadeIn(this.duration),
    //            this.txtDivs.find(".inner").on("mouseenter", function () {
    //                t(".shape", this.banner).addClass("hover")
    //            }).on("mouseleave", function () {
    //                t(".shape", this.banner).removeClass("hover")
    //            }),
    //            this.txtDivs.on("click", function (i) {
    //                i.stopPropagation();
    //                var s = t("a:first", t(this));
    //                s.length && (window.location = s.attr("href"))
    //            }),
    //            this.reIndex()
    //        },
    //        reIndex: function () {
    //            this.imgDivs.not(".current").css("z-index", 8),
    //            this.imgDivs.filter(".current").css("z-index", 9)
    //        },
    //        showImage: function (i) {
    //            var s = this.imgDivs.eq(i)
    //              , n = this.txtDivs.eq(i)
    //              , e = this;
    //            this.reIndex(),
    //            s.hide(),
    //            s.css("background-image", "url(" + s.data("img-src") + ")").waitForImages(function () {
    //                e.imgDivs.removeClass("current"),
    //                e.txtDivs.removeClass("current").fadeOut(e.duration),
    //                s.css("z-index", 10).fadeIn(e.duration).addClass("current"),
    //                n.hide().fadeIn(e.duration).addClass("current"),
    //                t(window).width() > 768 && t("body").trigger("change-shapes"),
    //                e.startTimer()
    //            }, t.noop, !0)
    //        },
    //        startTimer: function () {
    //            var t = this;
    //            setTimeout(function () {
    //                t.rotate(t)
    //            }, t.delay)
    //        },
    //        rotate: function () {
    //            1 != this.total && (this.start++,
    //            this.start >= this.total && (this.start = 0),
    //            this.showImage(this.start))
    //        }
    //    };
    //    t(function () {
    //        var t = s;
    //        t.init(),
    //        setTimeout(function () {
    //            t.rotate()
    //        }, t.delay - t.duration)
    //    })
    //}(jQuery, Drupal);
    //; !function (e) {
    //    "use strict";
    //    var s = {
    //        init: function () {
    //            var t = this
    //              , s = e(".shape svg polygon");
    //            this.steps = e("animate", s),
    //            this.currentShape = 0,
    //            this.steps.eq(0).attr("to", s.attr("points")),
    //            e("body").on("change-shapes", function () {
    //                t.changeShapes()
    //            }),
    //            e(".shape").fadeIn(500, function () {
    //                e(this).addClass("hover-ready")
    //            })
    //        },
    //        resizeSvg: function () {
    //            var t = 456 //e("#block-bean-homepage-banner").height()
    //              , s = 30;// parseInt(e("#home-banner-shapes").css("margin-top"), 10) + parseInt(e("#home-banner-shapes").css("margin-bottom"), 10);
    //            e("#home-banner-shapes").css("height", t - s)
    //        },
    //        changeShapes: function () {
    //            this.currentShape++,
    //            this.currentShape >= this.steps.length && (this.currentShape = 0);
    //            var e = this.steps.eq(this.currentShape).get(0);
    //            try {
    //                e.beginElement()
    //            } catch (t) { }
    //        }
    //    };
    //    e(function () {
    //        s.init(),
    //        (e(window).resize(debounce(25, !1, s.resizeSvg)),
    //        s.resizeSvg()),
    //        setInterval(function () {
    //            s.changeShapes();
    //        }, 14000);

    //    })
    //}(jQuery);
    //;

});
$(window).load(function () {

});

var isMirracleCHatWidgetLoaded = false;
$(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    try {
        $('.each-tab-section').each(function () {
            var top = $(this).offset().top - 60,
                bottom = top + $(this).outerHeight();
            //  console.log(top);
            //   console.log(scrollTop);
            if (scrollTop >= top && scrollTop <= bottom) {
                // nav.find('a').removeClass('active');
                $('.each-tab-section').removeClass('active');

                $(this).addClass('active');
                $('.bottom-menu-container').find('.tabButton').removeClass('active');
                $('.bottom-menu-container').find('.tabButton[data-id="' + $(this).attr('data-sid') + '"]').addClass('active');
            }
        });
    } catch (e) {
        console.log(e);
    }


    try {
        loadFacebookTwitterJs();
    } catch (e) {

    }

    try {
        loadDiscussandaddthisplugin();
    } catch (e) {

    }

    //if (scrollTop > 10) {
    //    if (!isMirracleCHatWidgetLoaded) {
    //        isMirracleCHatWidgetLoaded = true;
    //        try {
    //            loadjscssfile('https://mirracle.user.com/widget.js', 'js', false);
    //        } catch (e) {

    //        }
    //    }
    //}

    if (scrollTop > 120) {


        try {


            if (IsMobile) {
                GetHomeArticlesForMobile('cm-latestnews-mobile', 0);
            }
            else {

                GetHomeArticles('cm-latestnews', 0);
            }
            //if(IsHomePage)
            //{

            //}



        } catch (e) {

        }
        $('.simple-marquee-container').addClass('active');
    }
    if (scrollTop > 250) {

        $('.cm-mirracle-go-top').addClass('active');
    }
    else {
        $('.cm-mirracle-go-top').removeClass('active');
    }
    // $(window).on("scroll", function() {

    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    //	console.log($('#cm-news-page-content .cm-news-page-content-loading').offset().top);

    try {
        $('.cm-media-partners').removeClass('viewport');
        if ($('.cm-media-partners').is_on_screen()) {
            $('.cm-media-partners').addClass('viewport');
        }
    } catch (e) {

    }


    if ($('#cm-news-page-content .cm-news-page-content-loading').offset()) {
        if ((scrollPosition) > $('#cm-news-page-content .cm-news-page-content-loading').offset().top) {

            GetNewsArticles('cm-news-page-content');
        }
    }

    try {
        jQuery('.lazy-image-href').each(function () {
            jQuerythis = jQuery(this);
            try {
                console.log(jQuerythis.is_on_screen());
                if (jQuerythis.is_on_screen() == true) {
                    jQuerythis.find('.image-shape').fadeOut(0, function () {
                        console.log(jQuerythis.find('.image-shape'));
                        jQuerythis.removeClass('lazy-image-href');
                        //   jQuerythis.attr('href', '');


                        jQuerythis.find('.image-shape').one("load", function () {
                        }).attr("href", jQuerythis.find('.image-shape').attr('data-original')).fadeIn(500);

                    });
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    } catch (e) {

    }

    try {
        jQuery('img.lazy').each(function () {
            jQuerythis = jQuery(this);
            try {
                if (jQuerythis.is_on_screen() == true) {
                    jQuerythis.fadeOut(0, function () {
                        jQuerythis.attr('src', '');

                        jQuerythis.one("load", function () {
                        }).attr("src", jQuerythis.attr('data-original')).fadeIn(500);

                        jQuerythis.removeClass('lazy');
                    });
                }
            }
            catch (err) {
                //  console.log(err);
            }
        });

        //jQuery('.image-shape').each(function () {
        //    jQuerythis = jQuery(this);
        //    try {
        //        if (jQuerythis.is_on_screen() == true) {
        //            jQuerythis.fadeOut(0, function () {
        //                jQuerythis.attr('href', '');


        //                jQuerythis.one("load", function () {
        //                }).attr("href", jQuerythis.attr('data-original')).fadeIn(500);
        //                jQuerythis.removeClass('lazy');
        //            });
        //        }
        //    }
        //    catch (err) {
        //        //  console.log(err);
        //    }
        //});


        jQuery('.cm-media-partners').each(function () {
            jQuerythis = jQuery(this);
            if (jQuerythis.is_on_screen() == true) {
                jQuery('.cm-media-partners img.lazy').each(function () {
                    var $this = jQuery(this);
                    $this.fadeOut(0, function () {
                        $this.attr('src', '');

                        $this.one("load", function () {
                        }).attr("src", $this.attr('data-original')).fadeIn(500);
                        $this.removeClass('lazy');
                    });
                });

            }

        });
        jQuery('.cm-f-container').each(function () {
            jQuerythis = jQuery(this);
            if (jQuerythis.is_on_screen() == true) {
                jQuery('.cm-f-container.lazy').each(function () {
                    var $this = jQuery(this);
                    $this.removeClass('lazy');
                    $this.addClass('loaded');
                });

            }

        });
        jQuery('.cm-donationblock').each(function () {
            jQuerythis = jQuery(this);
            if (jQuerythis.is_on_screen() == true) {
                jQuery('.cm-donationblock.lazy').each(function () {
                    var $this = jQuery(this);
                    $this.removeClass('lazy');
                    $this.addClass('loaded');

                });

            }

        });


    } catch (e) {

    }
    //});
    try {

        var index = 1;
        $('.video-block-displayed').each(function () {
            var jQuerythis = $(this);
            try {
                if (jQuerythis.is_on_screen() == true) {

                    var id = jQuerythis.attr('data-id').replace('-video', '');
                    if (!id) {
                        return;
                    }
                    if (!$("#" + id + "-player").hasClass("playvideo")) {
                        PlayOnWall(id);
                    }

                    return;
                }
                else {
                    var id = jQuerythis.attr('data-id').replace('-video', '');
                    if ($("#" + id + "-player").hasClass("playvideo")) {
                        PauseOnWall(id);
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });
    } catch (e) {
        console.log(e);
    }

});
function FilterAssessments(type) {

    $(".assess-scroll-set span").removeClass("active");
    $(".assess-scroll-set span[data-id=" + type + "]").addClass("active");
    if (type.toLowerCase() == "all") {
        $(".set-assess").removeClass("hide");
        return;
    }
    $(".set-assess").addClass("hide");
    $(".set-assess[data-id=" + type + "]").removeClass("hide");
}
function jsonEscape(str) {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}
function getArticleGridSize() {
    // console.log(window.innerWidth);
    return (window.innerWidth < 600) ? 1 :
        (window.innerWidth < 900) ? 2 : (window.innerWidth < 1200) ? 3 : (window.innerWidth < 1400) ? 4 : (window.innerWidth < 1600) ? 4 : 6;
}
var pageSize = 30;
var isHomeArticlesAlreadyReqed = false;
function GetHomeArticles(id, pageNo) {

    if (isHomeArticlesAlreadyReqed && !newsId) {

        return;
    }

    isHomeArticlesAlreadyReqed = true;
    $('#' + id + ' .cm-latestnews-loader').show();
    var root = $('#pinnacle-boolms-root').val();

    console.log("CALLED NEWS");


    jQuery.ajax({
        // url: '/api/unsecuredapi/GetAllArticles?pageNo=' + pageNo + "&pageSize=" + 100 + "&categories=BlogPost",
        url: 'https://www.pinnacleblooms.org/api/gl/getkvforwebsite?type=gurU&pwd=Success99*',
        cache: true,
        contentType: "application/json",
        async: true,
        processData: false,
        type: 'GET',
        success: function (res) {

            var result = JSON.parse(res);
            //console.log(result);

            var html = "";
            var bottomMarqueeHtml = "";

            if (newsId) {
                result = $.grep(result, function (e) {

                    return e.Id != newsId;
                });
                result = result.slice(1, 10);
            }
            var psRoot = "https://images.pinnacleblooms.org/Assets/PUBLISHIMAGE/Image/";

            result = result.slice(1, 50);
            console.log(result);
            console.log(result.length);

            for (var i = 0; i < result.length; i++) {
                // console.log(result[i]);
                var alttitle = result[i].Title ? result[i].Title.replace('-', ' ').replace('(', ' ').replace(')', ' ') : result[i].Title;
                html += '<li class="cm-ln-ns-article">'
                    + ' <a href="/guru/' + result[i].Id + '" title="' + alttitle + '">'
                    + ' <div class="image"><img src="/media/image/00f649c6b13a6a1bb6ad971428d79d0a.gif" class="lazy" data-original="' + psRoot + result[i].Id + "_THUMB.jpeg" + '" alt="' + alttitle + '" /></div>'
                    + '<div class="content"><div><div style="height:54px;overflow:hidden;display:inline-block;">' + result[i].Title + '</div></div></div>'
                    // + '</div>'
                    + ' </a>'
                    + ' </li>'
                    ;

                bottomMarqueeHtml += '<li  class="ng-scope">' +
                    '<a target="_blank" href="/guru/' + result[i].Id + '" title="' + result[i].Title + '">' +
                    '<span  class="news-icon ng-scope">' +
                    '<svg class="nc-icon glyph" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48"><g> <path fill="#444444" d="M46,38h-5V7c0-3.3-2.7-6-6-6H7C3.7,1,1,3.7,1,7v1c0,0.6,0.4,1,1,1h9v32c0,3.3,2.7,6,6,6h23h1 c3.3,0,6-2.7,6-6v-2C47,38.4,46.6,38,46,38z M3,7c0-2.2,1.8-4,4-4s4,1.8,4,4H3z M20,11h12c0.6,0,1,0.4,1,1s-0.4,1-1,1H20 c-0.6,0-1-0.4-1-1S19.4,11,20,11z M20,19h12c0.6,0,1,0.4,1,1s-0.4,1-1,1H20c-0.6,0-1-0.4-1-1S19.4,19,20,19z M19,28c0-0.6,0.4-1,1-1 h12c0.6,0,1,0.4,1,1s-0.4,1-1,1H20C19.4,29,19,28.6,19,28z M45,41c0,2.2-1.8,4-4,4H21.4c0.9-0.9,1.6-2.2,1.6-4v-1h22V41z"></path> </g></svg>' +
                    '</span>' +

                    '<span class="ng-binding">' + result[i].Title + '</span>' +
                    '</a>' +
                    '</li>';
            }



            $('.simple-marquee-container .marquee-content-items').html(bottomMarqueeHtml);

            $('#' + id + ' ul').html(html);

            try {
                if (isNewsRightSideRequired) {
                    $('.cm-s-vnews-right ul').html(html);
                    $(window).scroll();
                }
            } catch (e) {

            }

            var bxOptions = {
                mode: "horizontal",
                speed: 2000,
                startSlide: 0,
                infiniteLoop: true,
                easing: "linear",
                tickerHover: true,
                adaptiveHeight: true,
                responsive: true,
                minSlides: getArticleGridSize(),
                maxSlides: getArticleGridSize(),
                moveSlides: getArticleGridSize(),
                slideWidth: 320,
                slideMargin: 30,
                onSliderLoad: function () {
                    $(window).trigger('scroll');
                },
                onSlideAfter: function () {
                    $(window).trigger('scroll');
                },
                nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" stroke-width="1"><g stroke-width="1" transform="translate(0.5, 0.5)"><polyline fill="none" stroke="#444444" stroke-width="1" stroke-linecap="square" stroke-miterlimit="10" points="9,2 23,16 9,30 " transform="translate(0, 0)" stroke-linejoin="miter"></polyline></g></svg>',
                prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" stroke-width="1"><g stroke-width="1" transform="translate(0.5, 0.5)"><polyline fill="none" stroke="#444444" stroke-width="1" stroke-linecap="square" stroke-miterlimit="10" points="23,30 9,16 23,2 " transform="translate(0, 0)" stroke-linejoin="miter"></polyline></g></svg>'
            };

            var slider = $('#' + id + ' ul').bxSlider(bxOptions);
            $('#' + id + ' .cm-latestnews-loader').hide();
        }
        ,
        error: function (xhr, ajaxOptions, thrownError) {
            //HideLoading();
            $('#' + id + ' .cm-latestnews-loader').hide();
            // console.log(xhr);
            $('.nominal-roll-app-delete .submit-wrapper').removeClass('is-saving');
            showSuccessConfirmBox(xhr.statusText, "Unable to delete", "Let me try again", true, function (data) {
                if (data) {

                }
            });
        }
    });
}


var isHomeArticlesAlreadyReqedMobile = false;
var displayLength = 6;
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
function GetHomeArticlesForMobile(id, pageNo) {

    if (isHomeArticlesAlreadyReqedMobile) {
        return;
    }
    isHomeArticlesAlreadyReqedMobile = true;
    console.log("jj");
    $('#' + id + ' .cm-latestnews-loader').show();
    var root = $('#pinnacle-boolms-root').val();

    jQuery.ajax({
        url: '/api/unsecuredapi/GetAllArticles?pageNo=' + pageNo + "&pageSize=" + 100 + "&categories=BlogPost",
        cache: true,
        contentType: false,
        async: true,
        processData: false,
        type: 'GET',
        success: function (result) {
            $('#' + id + ' .cm-latestnews-loader').hide();
            var html = "";
            var bottomMarqueeHtml = "";
            if (result.length > displayLength) {
                $('.news-readmore').addClass('active');
            }
            displayLength = result.length > displayLength ? displayLength : result.length;
            for (var i = 0; i < displayLength; i++) {
                var today = new Date(result[i].CDT);
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();
                var date = monthNames[mm] + " " + dd;
                var alttitle = result[i].RDT ? result[i].RDT.replace('-', ' ').replace('(', ' ').replace(')', ' ') : result[i].RDT;
                html += '<li class="cm-ln-ns-article">'
                    + ' <a href="' + result[i].F12 + '" title="' + alttitle + '">'
                    + ' <div class="image"><img src="' + root + (result[i].F1 ? result[i].F1 : "/Images/Pinnacle-blooms-Logo.png") + '" class="lazy" data-original="' + root + (result[i].F1 ? result[i].F1 : "/Images/Pinnacle-blooms-Logo.png") + '" alt="' + alttitle + '" /></div>'
                    + '<div class="content"><div style="" class="cm-action-text">' + result[i].AT + '</div><div  style="margin: 0px;padding-top: 0px;" class="wallpost-title" ><p style="font-size:21px;font-family:Poppins,telugufont;color:#171F24;line-height: 1.2;font-weight: bolder;" class="">' + alttitle + '</p> <div class="wall-article-publisher" style="   ">'
                    + '<span > ' + result[i].CBPN + ' </span> <span class="dot"> ' + date + '</span></div></div></div>'
                    // + '</div>'
                    + ' </a>'
                    + ' </li>'
                    ;

                bottomMarqueeHtml += '<li  class="ng-scope">' +
                    '<a target="_blank" href="' + result[i].F12 + '" title="' + result[i].RDT + '">' +
                    '<span  class="news-icon ng-scope">' +
                    '<svg class="nc-icon glyph" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="48px" height="48px" viewBox="0 0 48 48"><g> <path fill="#444444" d="M46,38h-5V7c0-3.3-2.7-6-6-6H7C3.7,1,1,3.7,1,7v1c0,0.6,0.4,1,1,1h9v32c0,3.3,2.7,6,6,6h23h1 c3.3,0,6-2.7,6-6v-2C47,38.4,46.6,38,46,38z M3,7c0-2.2,1.8-4,4-4s4,1.8,4,4H3z M20,11h12c0.6,0,1,0.4,1,1s-0.4,1-1,1H20 c-0.6,0-1-0.4-1-1S19.4,11,20,11z M20,19h12c0.6,0,1,0.4,1,1s-0.4,1-1,1H20c-0.6,0-1-0.4-1-1S19.4,19,20,19z M19,28c0-0.6,0.4-1,1-1 h12c0.6,0,1,0.4,1,1s-0.4,1-1,1H20C19.4,29,19,28.6,19,28z M45,41c0,2.2-1.8,4-4,4H21.4c0.9-0.9,1.6-2.2,1.6-4v-1h22V41z"></path> </g></svg>' +
                    '</span>' +

                    '<span class="ng-binding">' + result[i].RDT + '</span>' +
                    '</a>' +
                    '</li>';
            }



            $('cm-mini-header-seperator .cm-latestnews-mobile .cm-ln-newsslider-mobile').html(bottomMarqueeHtml);
            $(window).trigger('scroll');
            $('#' + id + ' ul').html(html);


        }
        ,
        error: function (xhr, ajaxOptions, thrownError) {
            //HideLoading();
            $('#' + id + ' .cm-latestnews-loader').hide();
            // console.log(xhr);
            $('.nominal-roll-app-delete .submit-wrapper').removeClass('is-saving');
            showSuccessConfirmBox(xhr.statusText, "Unable to delete", "Let me try again", true, function (data) {
                if (data) {

                }
            });
        }
    });
}


function GetAssessmentsArticles(id, pageNo) {
    pageNo = pageNo || 0;
    //  alert(id);

    // isHomeArticlesAlreadyReqed = true;
    $('#' + id + ' .cm-latestnews-loader').show();
    var root = $('#take-assesments-redirection-url').val();
    var url = $('#take-assesments-redirection-url').val();
    jQuery.ajax({
        url: '/api/unsecuredapi/GetAllArticles?pageNo=' + pageNo + "&pageSize=" + 100 + "&categories=Assessment",
        cache: true,
        contentType: false,
        async: true,
        processData: false,
        type: 'GET',
        success: function (result) {
            //  alert('Result Came');

            var alttitle = result[i].RelevantDataTitle ? result[i].RelevantDataTitle.replace('-', ' ').replace('(', ' ').replace(')', ' ') : result[i].RelevantDataTitle;
            root = result.ImageURL && result.ImageURL.indexOf('http') ? result.ImageURL : 'https://internationalqualitymeasurers.org/';
            var html = "";
            var bottomMarqueeHtml = "";
            for (var i = 0; i < result.length; i++) {
                url = url.replace('{id}', result[i].RelevantDataId);
                html += '<li class="cm-ln-ns-article">'
                    + ' <a href="' + url + '" title="' + alttitle + '">'
                    + ' <div class="image"><img src="/media/image/00f649c6b13a6a1bb6ad971428d79d0a.gif" class="lazy" data-original="' + root + (result[i].ImageURL ? result[i].ImageURL : "/Images/Pinnacle-blooms-Logo.png") + '" alt="' + alttitle + '" /></div>'
                    + '<div class="content htauto"><div>' + result[i].RelevantDataTitle + '</div></div>'
                    // + '</div>'
                    + '<div class="description">' + result[i].RelevantDataDescription + '</div><div class="button"><span>Take this assessment</span></div> </a>'
                    + ' </li>'
                    ;

            }

            //$('.simple-marquee-container .marquee-content-items').html(bottomMarqueeHtml);

            $('#' + id + ' ul').html(html);

            var bxOptions = {
                mode: "horizontal",
                speed: 2000,
                startSlide: 0,
                infiniteLoop: true,
                easing: "linear",
                tickerHover: true,
                adaptiveHeight: true,
                responsive: true,
                minSlides: getArticleGridSize(),
                maxSlides: getArticleGridSize(),
                moveSlides: getArticleGridSize(),
                slideWidth: 320,
                slideMargin: 30,
                onSliderLoad: function () {
                    $(window).trigger('scroll');
                },
                onSlideAfter: function () {
                    $(window).trigger('scroll');
                },
                nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" stroke-width="1"><g stroke-width="1" transform="translate(0.5, 0.5)"><polyline fill="none" stroke="#444444" stroke-width="1" stroke-linecap="square" stroke-miterlimit="10" points="9,2 23,16 9,30 " transform="translate(0, 0)" stroke-linejoin="miter"></polyline></g></svg>',
                prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" stroke-width="1"><g stroke-width="1" transform="translate(0.5, 0.5)"><polyline fill="none" stroke="#444444" stroke-width="1" stroke-linecap="square" stroke-miterlimit="10" points="23,30 9,16 23,2 " transform="translate(0, 0)" stroke-linejoin="miter"></polyline></g></svg>'
            };

            var slider = $('#' + id + ' ul').bxSlider(bxOptions);
            $('#' + id + ' .cm-latestnews-loader').hide();
        }
        ,
        error: function (xhr, ajaxOptions, thrownError) {
            //HideLoading();
            $('#' + id + ' .cm-latestnews-loader').hide();
            // console.log(xhr);
            $('.nominal-roll-app-delete .submit-wrapper').removeClass('is-saving');
            showSuccessConfirmBox(xhr.statusText, "Unable to delete", "Let me try again", true, function (data) {
                if (data) {

                }
            });
        }
    });
}

var monthFullNames = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
var newsPageNo = 0;
var oldDate = null;
function GetNewsArticles(id) {
    $('#' + id + ' .cm-news-page-content-loading .loading-holder').show();

    var root = $('#pinnacle-boolms-root').val();
    if (oldDate && (new Date() - oldDate) <= 10000) {

        return;

    }

    oldDate = new Date();

    jQuery.ajax({
        url: '/api/unsecuredapi/GetAllArticles?pageNo=' + newsPageNo + "&pageSize=" + pageSize + "&categories=BlogPost",
        cache: true,
        contentType: false,
        async: true,
        processData: false,
        type: 'GET',
        success: function (result) {

            var html = "";
            for (var i = 0; i < result.length; i++) {

                var dateArray = result[i].CBPN ? result[i].CDT.split('T')[0].split('-') : null;
                var dateString = "";
                if (dateArray) {
                    dateString = monthFullNames[parseInt(dateArray[1]) - 1] + " " + dateArray[2] + ', ' + dateArray[0];
                }


                html += '<li class="cm-ln-ns-article">'
                    + ' <a href="' + result[i].F12 + '" title="' + result[i].RDT + '">'
                    + ' <div class="image"><img src="' + root + (result[i].F1 ? result[i].F1 : "/Images/Pinnacle-blooms-Logo.png") + '" alt="' + result[i].RelevantDataTitle + '" /></div>'
                    + '<div class="content"> ' + result[i].RDT + ' </div><a/>'

                    + '<div class="date"><span>' + dateString + '</span><span>By <a href="' + result[i].URL + '" title="' + result[i].RDT + '"> Mirracle</a></span></div>'
                    + '<div class="continue-reading"><a href="' + result[i].F12 + '" title="' + result[i].RDT + '">CONTINUE READING</a></div>'
                    + ' '

                    + ' </li>'
                    ;
            }

            newsPageNo++;
            $('#' + id + ' ul').append(html);

            $('#' + id + ' .cm-news-page-content-loading .loading-holder').hide();
        }
        ,
        error: function (xhr, ajaxOptions, thrownError) {
            //HideLoading();
            $('#' + id + ' .cm-latestnews-loader .loading-holder').hide();
            // console.log(xhr);
            $('.nominal-roll-app-delete .submit-wrapper').removeClass('is-saving');
            showSuccessConfirmBox(xhr.statusText, "Unable to delete", "Let me try again", true, function (data) {
                if (data) {

                }
            });
        }
    });
}
function PlayOnWall(id) {

    try {
        var URL = $('#' + id + '-videoplayer').attr('data-url');
        var sid = id + '-player';
        if (!URL) {
            return;
        }
        // console.log(URL);
        if (!$('#' + id + '-videoplayer').hasClass('active')) {
            var html = '';
            // $('#' + id + '-videoplayer').html(html);
            player = null;

            if (((URL.indexOf("youtube") > -1) || (URL.indexOf("youtu.be") > -1)) && URL.indexOf("embed") <= -1) {
                html = '<div id="' + sid + '" style="position:relative;z-index:2" class="player"></div>';
                $('#' + id + '-videoplayer').attr('data-ytype', 'yt');
            }
            $('#' + id + '-videoplayer').html(html);
            $('#' + id + '-videoplayer').addClass('active');

        }
        EnableVideoDisplay(URL, sid);


    } catch (e) {
        console.log("Error in playing video");
        console.log(e);
    }

}
function PauseOnWall(id) {
    try {
        var sid = id + '-player';
        console.log(sid);
        $("#" + sid).removeClass("playvideo");
        if ($('#' + id + '-videoplayer').attr('data-ytype') == 'yt') {
            player = players[sid];
            if (player) {
                player.pauseVideo();
            }
        }
        else {
            var vid = document.getElementById(sid);
            if (vid) {
                vid.pause();
            }
        }
    } catch (e) {

    }
}
var players = [];
var player = new Object();
var done = false;
function EnableVideoDisplay(URL, id, isCOntinue) {
    try {
        if (((URL.indexOf("youtube") > -1) || (URL.indexOf("youtu.be") > -1))) {
            //alert("lp");
            id = id || 'youtube-video-player';
            //console.log(id);
            URL = URL;
            var video_id = URL.split('v=')[1];
            var list_id = URL.split('list=')[1];
            //console.log(video_id);
            if (!video_id) {
                video_id = URL.split('/')[(URL.split('/').length - 1)];
            }
            var ampersandPosition = video_id.indexOf('&');
            if (ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }


            player = players[id];
            $("#" + id).addClass("playvideo");
            // console.log(player);
            if (player) {
                if (!list_id) {
                    // player.loadVideoById(video_id);
                }
                player.playVideo();
            }
            else {
                if (list_id) {
                    player = new YT.Player(id, {
                        width: '100%',
                        // videoId: video_id,
                        playerVars: {
                            "playsinline": "1",
                            "listType": 'playlist',
                            "list": list_id
                        },
                        events: {
                            'onReady': function (event) {
                                console.log("2369");
                                event.target.playVideo();
                                event.target.mute();
                                //  },200);
                            },
                            'onStateChange': function (event) {
                                if (event.data == YT.PlayerState.PLAYING && !done) {

                                    setTimeout(function () {
                                        player.stopVideo();
                                        done = true;
                                    }, 6000);
                                    // done = true;
                                }
                                if (isCOntinue) {
                                    if (event.data === YT.PlayerState.ENDED) {
                                        player.playVideo();
                                    }
                                }
                            }
                        }
                    });
                }
                else {
                    player = new YT.Player(id, {
                        width: '100%',
                        videoId: video_id,
                        events: {
                            'onReady': function (event) {
                                console.log("2369");
                                event.target.playVideo();
                                event.target.mute();
                                //  },200);
                            },
                            'onStateChange': function (event) {
                                if (event.data == YT.PlayerState.PLAYING && !done) {
                                    setTimeout(function () {
                                        player.stopVideo();
                                        done = true;
                                    }, 6000);
                                    // done = true;
                                }
                                if (isCOntinue) {
                                    if (event.data === YT.PlayerState.ENDED) {
                                        player.playVideo();
                                    }
                                }
                            }
                        }
                    });
                }

                players[id] = player;
            }

            URL = video_id;
        }

    } catch (e) {
        console.log("Error:: EnableVideoDisplay()\n" + e);
    }

}
try {
    $.fn.is_on_screen = function () {
        var win = $(window);

        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = this.offset();
        bounds.right = bounds.left + this.outerWidth();
        bounds.bottom = bounds.top + this.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };

}
catch (err) {
}

function shareOnSocialMedia(platform, title, description, url) {
    let shareUrl;

    //document.querySelector('meta[name="description"]').setAttribute("content", "SUNSHINE FROM JS");

    const clickedElement = event.currentTarget;
    //url = location.href;
    //console.log(clickedElement);
    if (clickedElement) {
        try {
            // Find the parent element with a specific class name
            const parentElement = clickedElement.closest('.cm-services-seperator');

            // Find the <p> element inside the parent element
            const pElement = parentElement.querySelector('p');

            // Get the text inside the <p> element
            const pText = pElement.textContent;
            description = pText ? pText.trim() : pText;
        } catch (e) {
            //console.log(e);
        }
    }

    title = title ? title.trim() : title;
    url = url ? url.trim() : url;

    //console.log(description);

    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(description)}`;
            break;
        case 'whatsapp':
            var shareText = encodeURIComponent(title + "\n\n" + description + "\n\n" + url);
            shareUrl = `https://wa.me/?text=${shareText}`;
            break;
        case 'instagram':
            // Instagram doesn't have a native share button, but you can encourage users to copy the link
            shareUrl = `instagram://share?url=${encodeURIComponent(url)}`;
            break;
        default:
            return;
    }

    window.open(shareUrl, '_blank');
};
