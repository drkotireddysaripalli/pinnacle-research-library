import fs from 'node:fs/promises';import path from 'node:path';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';
export const publisherGit=process.platform==='win32'?'C:/Users/Siri Palace/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe':'git';
export async function cloudflareToken(explicit,env=process.env){
 if(explicit)return explicit;if(env.CLOUDFLARE_API_TOKEN)return env.CLOUDFLARE_API_TOKEN;
 assert(process.platform==='win32'&&env.APPDATA,'Unattended Cloudflare API token required; no desktop credential fallback on cloud');
 const text=await fs.readFile(path.join(env.APPDATA,'xdg.config/.wrangler/config/default.toml'),'utf8');const token=text.match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];assert(token,'Local Cloudflare session unavailable');return token;
}
export function githubHeaders(env=process.env){
 const common={'User-Agent':'Pinnacle-source-publisher','Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'};
 if(env.GITHUB_TOKEN)return{...common,authorization:'Bearer '+env.GITHUB_TOKEN};
 assert(process.platform==='win32','Unattended repository token required; no credential-manager fallback on cloud');
 const raw=execFileSync(publisherGit,['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',windowsHide:true,env:{...env,GCM_INTERACTIVE:'Never',GIT_TERMINAL_PROMPT:'0'}});
 const c=Object.fromEntries(raw.trim().split('\n').map(l=>{const i=l.indexOf('=');return[l.slice(0,i),l.slice(i+1)]}));assert(c.username&&c.password,'Existing Git credential unavailable');return{...common,authorization:'Basic '+Buffer.from(c.username+':'+c.password).toString('base64')};
}
