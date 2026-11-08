import json,numpy as np,cv2
R1=lambda v:round(float(v),1)
def fill(d,RES=1.5,GAP=42):
    apr=d['ap'];tp=d['tp'];bld=d['bd']+d.get('tm',[])
    pts=np.array([v for q in apr for v in np.array(q).reshape(-1,2)]+[v for t in tp for v in (t[:2],t[2:])])
    x0,y0=pts.min(0)-200;x1,y1=pts.max(0)+200;W,H=int((x1-x0)/RES)+1,int((y1-y0)/RES)+1
    pix=lambda a:np.c_[(a[:,0]-x0)/RES,(y1-a[:,1])/RES].round().astype(np.int32)
    A=np.zeros((H,W),np.uint8);T=np.zeros((H,W),np.uint8);B=np.zeros((H,W),np.uint8);R=np.zeros((H,W),np.uint8)
    for q in apr:cv2.fillPoly(A,[pix(np.array(q).reshape(-1,2))],1)
    for t in tp:cv2.line(T,tuple(pix(np.array([t[:2]]))[0]),tuple(pix(np.array([t[2:]]))[0]),1,max(1,int(23/RES)))
    for q in bld:cv2.fillPoly(B,[pix(np.array(q).reshape(-1,2))],1)
    for r in d['rw']:cv2.line(R,tuple(pix(np.array([r['a']]))[0]),tuple(pix(np.array([r['b']]))[0]),1,int(150/RES))
    pav=((A|T)>0).astype(np.uint8)
    dA=cv2.distanceTransform((1-A).astype(np.uint8),cv2.DIST_L2,5)*RES
    dT=cv2.distanceTransform((1-T).astype(np.uint8),cv2.DIST_L2,5)*RES
    dAB=cv2.distanceTransform((1-((A|B)>0)).astype(np.uint8),cv2.DIST_L2,5)*RES
    new=(((dA+dT)<=GAP)&(pav==0)&(B==0)&(R==0)).astype(np.uint8)
    # also narrow slots between two apron/building pieces
    k=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(int(26/RES)|1,int(26/RES)|1))
    cl=cv2.morphologyEx(((A|B)>0).astype(np.uint8),cv2.MORPH_CLOSE,k)
    new|=(cl&(1-pav)&(1-B)&(1-R)).astype(np.uint8)
    new=cv2.morphologyEx(new,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    grow=cv2.dilate(new,np.ones((3,3),np.uint8))&(((new|pav)>0).astype(np.uint8))
    cs,_=cv2.findContours(grow,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);out=[]
    for c in cs:
        if cv2.contourArea(c)*RES*RES<60:continue
        c=cv2.approxPolyDP(c,0.8,True)[:,0,:]
        if len(c)<3:continue
        out.append([R1(v) for q in c for v in (x0+q[0]*RES,y1-q[1]*RES)])
    print(len(out),'polys',int(new.sum()*RES*RES),'m2')
    return out
for ap in ['MUC','FRA','LHR']:
    d=json.load(open(f'd6_{ap}.pre_gap.json'));d['ap']=d['ap']+fill(d);json.dump(d,open(f'd6_{ap}.json','w'))
