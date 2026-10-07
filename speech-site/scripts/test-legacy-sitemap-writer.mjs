import assert from 'node:assert/strict';
import vm from 'node:vm';
import {isolateLegacySitemapWriter} from './prepare-enrolment-receiver.mjs';
const fixture=`class XMLWriter {
 static XML=[]; static Nodes=[]; static State='';
 static BeginNode(n){this.Nodes.push(n);this.XML.push('<'+n+'>');}
 static Node(n,v){this.XML.push('<'+n+'>'+v+'</'+n+'>');}
 static EndNode(){this.XML.push('</'+this.Nodes.pop()+'>');}
 static Close(){while(this.Nodes.length)this.EndNode();this.State='closed';}
 static ToString(){return this.XML.join('');}
}
var xmlWriter=XMLWriter;
function GenarateSiteMap(value){var XMLObj = xmlWriter;XMLObj.BeginNode('urlset');XMLObj.Node('loc',value);XMLObj.Close();return XMLObj;}
__name(GenarateSiteMap,'GenarateSiteMap');
function GenarateVideoSiteMap(value){var XMLObj = xmlWriter;XMLObj.BeginNode('urlset');XMLObj.Node('loc',value);XMLObj.Close();return XMLObj;}
__name(GenarateVideoSiteMap,'GenarateVideoSiteMap');
`;
const context={__name:()=>{}};
const original=vm.runInNewContext(fixture+'GenarateSiteMap("staff").ToString();GenarateVideoSiteMap("bots").ToString()',context);
assert.equal((original.match(/<urlset>/g)||[]).length,2,'Fixture reproduces stale shared state');
const fixed=isolateLegacySitemapWriter(fixture);
const result=vm.runInNewContext(fixed+'const first=GenarateSiteMap("staff");const second=GenarateVideoSiteMap("bots");[first.ToString(),second.ToString(),xmlWriter.XML.length]',{__name:()=>{}});
assert.equal(result[0],'<urlset><loc>staff</loc></urlset>');
assert.equal(result[1],'<urlset><loc>bots</loc></urlset>');
assert.equal(result[2],0,'Global writer remains untouched');
assert.throws(()=>isolateLegacySitemapWriter(fixture.replace('var XMLObj = xmlWriter;','var XMLObj = unknown;')),/boundary changed/);
console.log('Legacy sitemap writer: shared-buffer reproduction and independent responses passed');
