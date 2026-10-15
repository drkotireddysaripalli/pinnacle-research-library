// Existing public libraries supplied by the owner; portal migrations remain
// separate. Fix emitted links without taking over their reserved main-site URLs.
export const publicResourceHubs=Object.freeze({
 '/materials':'https://materials.pinnacleblooms.org/',
 '/interventions':'https://interventions.pinnacleblooms.org/'
});
export function publicResourceHubTarget(value){
 if(typeof value!=='string'||!(/^(?:https?:\/\/(?:www\.)?pinnacleblooms\.org(?:[/?#]|$)|\/(?!\/))/.test(value)))return value;
 let u;try{u=new URL(value.replace(/&(?:amp|#0*38|#x0*26);/gi,'&'),'https://www.pinnacleblooms.org');}catch{return value;}
 if(!['pinnacleblooms.org','www.pinnacleblooms.org'].includes(u.hostname)||u.port||u.username||u.password)return value;
 const hub=publicResourceHubs[u.pathname.replace(/\/$/,'')];if(!hub)return value;
 const target=new URL(hub);target.search=u.search;target.hash=u.hash;return target.href;
}
