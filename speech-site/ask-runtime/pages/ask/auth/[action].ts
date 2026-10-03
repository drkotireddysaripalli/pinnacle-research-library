import type {APIRoute} from 'astro';
import {env} from 'cloudflare:workers';
import {action} from '../../../../src/lib/ask/auth.mjs';
import {watiHook} from '../../../../src/lib/ask/wati-hook.mjs';
export const ALL:APIRoute=async({request,params})=>params.action==='whatsapp-hook'?watiHook(request,env):action(request,env,params.action);
