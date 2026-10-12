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
 return brandedTitle(answer.h1||answer.title||curated,'Ask Pinnacle');
}
