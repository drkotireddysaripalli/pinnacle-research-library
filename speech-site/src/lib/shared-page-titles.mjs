import {askTitleIdentityCollisions} from './ask-title-identity-collisions-20261013.mjs';
// Keep the subject and its distinguishing ending, rather than trimming away
// age, setting or record identity. Body headings and source records are intact.
export function compactSubject(value, limit) {
  const text=String(value||'').replace(/\s+/gu,' ').trim();
  if(text.length<=limit)return text;
  const words=text.split(' ');
  if(words.length<3){
    const segments=[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text)].map(x=>x.segment);
    let result='';for(const part of segments){if((result+part+'…').length>limit)break;result+=part;}return result+'…';
  }
  let start=words[0],end=words.at(-1),left=1,right=words.length-2;
  while(left<=right){
    const front=start+' '+words[left],back=words[right]+' '+end;
    if((front+' … '+end).length<=limit){start=front;left++;}
    else if((start+' … '+back).length<=limit){end=back;right--;}
    else break;
  }
  if((start+' … '+end).length>limit)return compactSubject(text.slice(0,limit-1),limit-1)+'…';
  return start+' … '+end;
}
export function brandedTitle(subject,brand,{identity='',limit=70}={}){
 const suffix=(identity?' · '+identity:'')+' | '+brand;
 return compactSubject(subject,Math.max(8,limit-suffix.length))+suffix;
}
export function askAnswerTitle(answer){
 const curated=String(answer.meta_title||'').trim();
 // Reviewed editorial titles already contain a deliberate Ask signature.
 if(/\|\s*Ask Pinnacle$/i.test(curated)&&curated.length<=70)return curated;
 const subject=String(answer.h1||answer.title||curated).replace(/\s+/gu,' ').trim();
 // This phrasing removes only grammatical framing; the complete score domain
 // and the original numeric range stay visible. Never invent an interpretation.
 const range=subject.match(/^Interpreting (?:an? )?(.+?AbilityScore) in the (\d+\s*[-–]\s*\d+) (?:band|range)[.?]?$/iu);
 if(range)return `${range[1]} ${range[2]}: Interpretation | Ask Pinnacle`;
 const compact=brandedTitle(subject,'Ask Pinnacle');
 // A length target cannot identify which middle words distinguish a question.
 // Retain the full source for proven identity collisions, numeric bands and
 // explicit locality/language qualifiers. Reuse unchanged safe titles elsewhere.
 // Longer editorial titles remain reviewable rather than being falsely unique.
 const qualifiers=subject.match(/\d+\s*[-–]\s*\d+|\b(?:not|never|without|Hyderabad|Telangana|Andhra Pradesh|Guntur|Vijayawada|Visakhapatnam|Tirupati|Warangal|Chennai|Bengaluru|Hindi|Telugu|Tamil|Kannada|Malayalam|Marathi|Bengali|Gujarati|Punjabi|Odia|Urdu|(?:language|cognitive|physical|social|communication|emotional|adaptive|sensory|motor) development|(?:speech(?: and language)?|occupational|ABA|autism|behaviour|behavior|parent-mediated) therapy|developmental (?:coordination|language) disorder)\b/giu)||[];
 const missingQualifier=qualifiers.some(x=>!compact.toLocaleLowerCase('en').includes(x.toLocaleLowerCase('en')));
 return askTitleIdentityCollisions.has(compact)||missingQualifier?subject+' | Ask Pinnacle':compact;
}
