"""One work order and its readable view. Never infer completion from a file name."""
import argparse
import datetime as dt
import html
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
STATES = {'verified', 'in_progress', 'ready', 'waiting_for_source', 'waiting_for_approval', 'waiting_for_release', 'waiting_for_publication', 'not_started'}


def render(data):
    esc = lambda x: html.escape(str(x), quote=True)
    rows = []
    for task in data['tasks']:
        rows.append('<tr><td><strong>'+esc(task['id'])+'</strong><br>'+esc(task['task'])+'</td><td>'+esc(task['status'])+'</td><td>'+esc(task['validation'])+'</td><td>'+esc(task['owner'])+'<br><strong>Next:</strong> '+esc(task['next_action'])+'<br><strong>Dependency:</strong> '+esc(', '.join(task['depends_on']) or 'None')+'</td><td>'+esc('; '.join(task['evidence']) or 'No completion receipt yet')+'</td></tr>')
    return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pinnacle sitemap work order</title><style>body{font:15px/1.6 system-ui;margin:0;background:#f3f6f8;color:#173047}main{max-width:1500px;margin:auto;padding:25px}h1{font-size:30px}header{background:white;padding:24px;border-radius:12px;margin-bottom:20px}.scroll{overflow:auto}table{border-collapse:collapse;background:white;width:100%}th,td{text-align:left;vertical-align:top;border:1px solid #d8e3e9;padding:14px;min-width:160px}th{background:#e8f1f5}td:nth-child(3){min-width:300px}td:last-child{overflow-wrap:anywhere}a{color:#075f90}</style><main><header><h1>Pinnacle sitemap ecosystem — one accountable work order</h1><p><strong>Objective:</strong> '+esc(data['objective'])+'</p><p><strong>Accountable owner:</strong> '+esc(data['accountable_owner'])+'<br><strong>Updated:</strong> '+esc(data['updated_at'])+'</p><p>'+esc(data['completion_boundary'])+'</p></header><div class="scroll"><table><thead><tr><th>Task</th><th>State</th><th>Validation / completion criterion</th><th>Owner and next action</th><th>Evidence</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table></div><p>'+esc(data['execution_rules'])+'</p></main></html>'


def check(data):
    ids = {t['id'] for t in data['tasks']}
    if len(ids) != len(data['tasks']): raise ValueError('Duplicate task ID')
    for t in data['tasks']:
        if t['status'] not in STATES: raise ValueError('Unknown state '+t['status'])
        if not all(t[k] for k in ('task','validation','owner','next_action')): raise ValueError('Incomplete work item')
        if not all(d in ids for d in t['depends_on']): raise ValueError('Unresolved dependency')
        if t['status']=='verified' and not t['evidence']: raise ValueError('Verified item needs evidence')
    visited, active = set(), set()
    def visit(key):
        if key in active: raise ValueError('Dependency cycle')
        if key in visited: return
        active.add(key)
        for d in next(t for t in data['tasks'] if t['id']==key)['depends_on']: visit(d)
        active.remove(key); visited.add(key)
    for key in ids: visit(key)
    return {'tasks':len(ids), 'verified':sum(t['status']=='verified' for t in data['tasks']), 'open':sum(t['status']!='verified' for t in data['tasks'])}


def main():
    p=argparse.ArgumentParser();p.add_argument('--order',type=Path,default=HERE/'work-order.json');p.add_argument('--html',type=Path)
    a=p.parse_args();data=json.loads(a.order.read_text());receipt=check(data)
    if a.html: a.html.parent.mkdir(parents=True,exist_ok=True);a.html.write_text(render(data))
    print(json.dumps(receipt))


if __name__=='__main__': main()
