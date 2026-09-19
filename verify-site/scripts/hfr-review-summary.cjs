'use strict';
const data=require('../content/hfr-dashboard-checks.json');
const byId=new Map(data.records.map(r=>[r.id,r]));
const counts=data.counts;
const dateLabel='19 September 2026';
const workflowSummary=counts.Approved+' Approved; '+counts['Query Raised']+' Query Raised; '+counts.Submitted+' Submitted; '+counts.Rejected+' Rejected; '+counts['Query Resolved']+' Query Resolved';
const description=counts.completeIds+' complete HFR identifiers matched in the authenticated NHPR facility-manager account reviewed on '+dateLabel+': '+workflowSummary+'. One masked Draft entry is separate. Other Pinnacle accounts have not been reconciled in this review. These are dated account workflow statuses, not a current operational-status or clinical-quality finding.';
const statusFor=id=>byId.get(id)?.status||null;
module.exports={data,counts,dateLabel,workflowSummary,description,statusFor};
