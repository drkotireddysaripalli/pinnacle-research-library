import {readingContent} from './therapy-reading-content.mjs';
export const READING_RELEASE='therapy-reading-20261004';
export function readingEntry(path,key){
 for(const [kind,entry]of Object.entries(readingContent)){
  if(path===entry.path&&key.endsWith('.html'))return {...entry,kind,format:'html'};
  if(key===(kind==='speech'?'/pinnacle-pages-data/speech-llms.txt':'/pinnacle-pages-data/occupational-therapy-machine.md'))return {...entry,kind,format:'text'};
 }
 return null;
}
export function addTherapyReading(body,entry){
 if(!entry)return body;
 if(entry.format==='text')return body.includes(entry.bookMarker||entry.markdown.trim())?body:body.trimEnd()+entry.markdown;
 if(body.includes('data-therapy-reading="'+entry.kind+'"'))return body;
 const canonical=body.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/g)||[];
 if(canonical.length!==1||!canonical[0].includes('href="https://www.pinnacleblooms.org'+entry.path+'"'))return body;
 const anchors=[...body.matchAll(new RegExp('<section\\b[^>]*\\bid="'+entry.anchor+'"[^>]*>','g'))];
 if(anchors.length!==1)return body;
 return body.slice(0,anchors[0].index)+entry.html+body.slice(anchors[0].index);
}
