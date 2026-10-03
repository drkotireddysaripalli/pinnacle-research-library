import {marked} from 'marked';
import sanitizeHtml from 'sanitize-html';
export function renderMarkdown(input:string){
 return sanitizeHtml(marked.parse(String(input||''),{async:false,gfm:true}) as string,{
 allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img']),
 allowedAttributes:{a:['href','title','rel'],img:['src','alt','width','height','loading'],th:['scope'],td:['colspan','rowspan']},
 allowedSchemes:['https','http','mailto','tel'],
 transformTags:{a:(tag,attrs)=>({tagName:tag,attribs:{...attrs,rel:'noopener'}}),
 img:(tag,attrs)=>({tagName:tag,attribs:{...attrs,loading:'lazy'}})},
 });
}
