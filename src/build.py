import json
D={k:json.load(open('data/d6_%s.json'%k)) for k in ['MUC','FRA','LHR']}
for k in D:D[k].pop('key',None)
parts=[open('tpl_head.html').read(),open('js_a.js').read(),'const DATA='+json.dumps(D,separators=(',',':'))+';\n',open('js_ap.js').read(),open('js_main2.js').read(),open('js_taxi.js').read(),open('js_ops.js').read(),open('js_ui2.js').read(),open('js_feat.js').read(),open('js_v10.js').read(),open('js_v11.js').read(),open('js_v12.js').read(),open('js_v13.js').read(),open('js_mp.js').read(),open('js_lobby.js').read(),open('js_v14.js').read(),open('js_v15.js').read(),open('js_v16.js').read(),open('js_v17.js').read(),open('js_v18.js').read(),open('js_v19.js').read(),open('js_ctr.js').read(),open('js_v21.js').read(),open('js_v22.js').read(),open('js_v23.js').read(),'\nbuildMenu();\n</script>\n']
open('../index.html','w').write(''.join(parts))
print(sum(len(p) for p in parts))
