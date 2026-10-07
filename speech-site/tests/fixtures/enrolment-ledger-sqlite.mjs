// Labelled offline fixture. SQLite verifies real persistence/unique-key CAS;
// production remains the receiver's existing MySQL database and needs staging QA.
import {DatabaseSync} from 'node:sqlite';
import {sqlReceiptLedger} from '../../deployment/enrolment-receipt.mjs';
export function fixtureLedger(filename=':memory:'){
 const db=new DatabaseSync(filename);
 db.exec(`CREATE TABLE IF NOT EXISTS website_enrolment_receipts (
 request_key TEXT PRIMARY KEY COLLATE BINARY,payload_digest TEXT NOT NULL,state TEXT NOT NULL,
 receipt_id TEXT UNIQUE NOT NULL,claim_token TEXT NOT NULL,source_json TEXT NOT NULL,
 lead_reference TEXT,created_at_ms INTEGER NOT NULL,updated_at_ms INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS qa_handoffs (request_key TEXT NOT NULL,reference TEXT NOT NULL);`);
 const execute=async(sql,params=[])=>{
  const statement=db.prepare(sql.replace(/^INSERT IGNORE/i,'INSERT OR IGNORE'));
  return /^SELECT /i.test(sql)?{rows:statement.all(...params)}:{rowsAffected:Number(statement.run(...params).changes)};
 };
 return {db,execute,ledger:sqlReceiptLedger(execute),close:()=>db.close()};
}
