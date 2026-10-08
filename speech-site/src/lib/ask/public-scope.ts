// Correct one observed recurring boilerplate at the public reading boundary.
// The stored records, URLs, links and all other wording remain available.
const exclusive=/(?:a clinical )?AbilityScore(?:®)? and any diagnosis are formed only at a Pinnacle(?: Blooms Network)? centre(?: under clinician care)?\.?/gi;
const fields=new Set(['summary','answer_md','meta_description','description','what_to_watch','everyday_tip','a','text']);
export function repairPublicScope(value:any):any {
 if(Array.isArray(value))return value.map(repairPublicScope);
 if(!value||typeof value!=='object')return value;
 return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,typeof item==='string'&&fields.has(key)?item.replace(exclusive,'Developmental measurement supports care planning; diagnosis requires an appropriately qualified healthcare professional.'):typeof item==='object'?repairPublicScope(item):item]));
}
