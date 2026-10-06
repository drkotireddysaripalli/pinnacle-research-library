// Exact old public destinations matched to the published question registry.
// Do not infer redirects for unknown codes, unmatched topics or private paths.
export const askRouteAliases:Record<string,string>={
 aac:'lens/entity%3Atherapy_modality/aac',
 wppsi4:'wppsi-iv',
 'lens/organ/anus':'how-does-the-anus-affect-a-child-s-development',
 'code/XA0604':'how-does-the-lymphatic-vessels-and-thoracic-duct-affect-a-child-s-development'
};
export function askRouteAlias(path:string,lang='en'){
 // These source/destination pairs were verified for English only.
 return lang==='en'?askRouteAliases[path]||null:null;
}
