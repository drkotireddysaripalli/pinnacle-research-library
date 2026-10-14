import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {gh} from './release-managed-sitemaps.mjs';import {publisherGit} from './publisher-platform.mjs';
export async function enqueueCloudSource(cloud,{id,now=new Date(),request=gh,source}={}){
 assert.equal(cloud.repository,'drkotireddysaripalli/pinnacle-research-library');assert.equal(cloud.workflow,'public-sitemap-upkeep.yml');assert.equal(cloud.ref,'main');
 source??=execFileSync(publisherGit,['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim();assert(/^[a-f0-9]{40}$/.test(source));
 id??='local-'+createHash('sha256').update(source+'\n'+now.toISOString()).digest('hex').slice(0,32);assert(/^[a-z0-9-]{8,80}$/.test(id));
 await request('/actions/workflows/public-sitemap-upkeep.yml/dispatches','POST',{ref:'main',inputs:{dispatch_id:id,scheduled_time:now.toISOString()}});
 return{status:'queued-cloud-not-published',dispatchId:id,scheduledTime:now.toISOString(),repository:cloud.repository,workflow:cloud.workflow,localPublication:false};
}
