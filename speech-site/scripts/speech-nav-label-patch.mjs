import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const sha=b=>createHash('sha256').update(b).digest('hex');
export const speechPath='/top-speech-therapy-center-india-proven-improvement-rate';
export function patchSpeechNav(before){
 const old='i=t.pathname==="/autism-therapy"&&p?.origin===S';
 const next='i=["/autism-therapy","'+speechPath+'"].includes(t.pathname)&&p?.origin===S';
 assert.equal(before.split(old).length,2,'Exactly one known compiled navigation condition');
 return before.replace(old,next);
}
export function assertSourceDelta(before,after){
 const old="adultAnchor=u.pathname==='/autism-therapy'&&";
 const next="adultAnchor=['/autism-therapy','"+speechPath+"'].includes(u.pathname)&&";
 assert.equal(before.split(old).length,2);assert.equal(after,before.replace(old,next),'Only the approved source route condition changes');
}
