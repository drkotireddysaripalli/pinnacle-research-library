import test from 'node:test';
import assert from 'node:assert/strict';
import {askAnswerTitle,brandedTitle} from '../src/lib/shared-page-titles.mjs';

test('AbilityScore interpretation retains the full domain and each actual range',()=>{
 const titles=['500–600','300–400','700-800'].map(range=>{
  const title=askAnswerTitle({h1:`Interpreting an Emotional AbilityScore in the ${range} band`});
  assert.equal(title,`Emotional AbilityScore ${range}: Interpretation | Ask Pinnacle`);
  return title;
 });
 assert.equal(new Set(titles).size,3);
 assert.notEqual(askAnswerTitle({h1:'What an AbilityScore of 200–300 in Language means'}),askAnswerTitle({h1:'What an AbilityScore of 200–300 in Language Development Means'}));
});

test('question identity survives independently of a length target',()=>{
 for(const subject of [
  'Are boys more likely to have Developmental Coordination Disorder?',
  'Are boys more likely to have Developmental Language Disorder?',
  'Are there any risks or side effects of speech and language therapy?',
  'How can parents find speech therapy in Guntur, Andhra Pradesh, in Telugu?',
  'How can parents find speech therapy in Hyderabad, Telangana, in Hindi?',
  'When should a child not start occupational therapy without an assessment?',
  'నా బిడ్డతో ఇంట్లో రోజువారీ ప్రాక్టీస్ ఎలా చేయాలి?'
 ]){
  assert.equal(askAnswerTitle({h1:subject}),subject+' | Ask Pinnacle');
 }
 const curated='IEP in India: Goals, School Support & Review | Ask Pinnacle';
 assert.equal(askAnswerTitle({h1:'Individualised Education Plan',meta_title:curated}),curated);
 assert.equal(askAnswerTitle({title:'Source title when no H1 exists'}),'Source title when no H1 exists | Ask Pinnacle');
});

test('genuinely identical sources are not given artificial unique suffixes',()=>{
 const source={h1:'How does speech therapy help my child?'};
 assert.equal(askAnswerTitle({...source,id:1,slug:'first'}),askAnswerTitle({...source,id:2,slug:'second'}));
 assert.equal(brandedTitle('A bounded FAQ question','Pinnacle Blooms Network®',{identity:'FAQ',limit:70}),'A bounded FAQ question · FAQ | Pinnacle Blooms Network®');
});
