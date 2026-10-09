// Offline persistence fixture; production remains existing private MySQL.
import {DatabaseSync} from 'node:sqlite';
import {sqlLeadSlackJournal} from '../../deployment/enrolment-lead-slack.mjs';
export function fixtureSlackJournal(filename=':memory:'){
 const db=new DatabaseSync(filename);
 db.exec("CREATE TABLE IF NOT EXISTS website_lead_slack_deliveries(delivery_key TEXT PRIMARY KEY COLLATE BINARY,payload_digest TEXT NOT NULL,state TEXT NOT NULL,claim_token TEXT NOT NULL,slack_ts TEXT,created_at_ms INTEGER NOT NULL,updated_at_ms INTEGER NOT NULL)");
 const execute=async(sql,params=[])=>{
  const q=db.prepare(sql.replace(/^INSERT IGNORE/i,'INSERT OR IGNORE'));
  return /^SELECT /i.test(sql)?{rows:q.all(...params)}:{rowsAffected:Number(q.run(...params).changes)};
 };
 return {db,journal:sqlLeadSlackJournal(execute),close:()=>db.close()};
}
