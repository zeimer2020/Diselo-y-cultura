const TAU=Math.PI*2;
export function createRenderer(canvas){
 const ctx=canvas.getContext('2d');let w=0,h=0,regions={};const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);}
 function measure(){for(const id of ['auto-scene','manual-scene']){const r=document.getElementById(id).getBoundingClientRect();regions[id]={x:r.x,y:r.y,w:r.width,h:r.height};}}
 function glow(x,y,r,color){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
 function line(x,y,xx,yy,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();}
 function path(){ctx.beginPath();ctx.moveTo(-.75,-1);ctx.lineTo(-.61,.87);ctx.quadraticCurveTo(0,1.06,.61,.87);ctx.lineTo(.75,-1);ctx.closePath();}
 function glass(x,y,size,{layers=[],ice=[],mix=0,energy=0}={},t=0,small=false){
 ctx.save();ctx.translate(x,y);ctx.scale(size,size);
 glow(0,.92,1.1,'rgba(115,156,219,.09)');
 ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(0,1.03,.92,.15,0,0,TAU);ctx.fill();
 path();const g=ctx.createLinearGradient(-.7,0,.7,0);g.addColorStop(0,'rgba(198,224,255,.17)');g.addColorStop(.3,'rgba(151,192,237,.025)');g.addColorStop(1,'rgba(213,161,235,.17)');ctx.fillStyle=g;ctx.fill();
 ctx.save();path();ctx.clip();let bottom=.86;const amount=layers.reduce((v,l)=>v+l.amount,0);
 for(const l of layers){const top=bottom-l.amount*2;ctx.globalAlpha=.65;ctx.fillStyle=l.color;ctx.fillRect(-.85,top,1.7,bottom-top+.005);bottom=top;}
 ctx.globalAlpha=1;
 if(amount>0){const wave=reduced.matches?0:Math.sin(t*4)*energy*.025;ctx.beginPath();ctx.ellipse(0,bottom,.72,.028+wave,0,0,TAU);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fill();
 if(mix>0){const blend=ctx.createLinearGradient(0,bottom,0,.9);layers.forEach((l,i)=>blend.addColorStop(layers.length===1?0:i/(layers.length-1),l.color));ctx.globalAlpha=mix*.8;ctx.fillStyle=blend;ctx.fillRect(-.85,bottom,1.7,.9-bottom);ctx.globalAlpha=1;}
 if(layers.some(l=>l.id==='soda'))for(let i=0;i<18;i++){const by=.83-((i*.137+t*.12)%1)*amount*2;ctx.beginPath();ctx.arc(Math.sin(i*8)*.52,by,.012,0,TAU);ctx.strokeStyle='rgba(255,255,255,.48)';ctx.lineWidth=.004;ctx.stroke();}}
 for(let i=0;i<ice.length;i++){const b=ice[i];const move=reduced.matches?0:energy;ctx.save();ctx.translate(b.x+Math.sin(t*9+i)*move*.09,(amount>0?Math.min(.6,Math.max(bottom+.2,b.y)):.59-Math.floor(i/2)*.5)+Math.cos(t*7+i)*move*.08);ctx.rotate(b.angle*.24+Math.sin(t*5+i)*move*.3);ctx.fillStyle='rgba(204,242,255,.27)';ctx.strokeStyle='rgba(223,251,255,.8)';ctx.lineWidth=.012;ctx.beginPath();ctx.roundRect(-.24,-.24,.48,.48,.055);ctx.fill();ctx.stroke();line(-.18,-.13,-.12,-.19,'rgba(255,255,255,.9)',.012);line(-.12,-.19,.14,-.19,'rgba(255,255,255,.9)',.012);ctx.restore();}
 ctx.restore();path();ctx.strokeStyle='rgba(210,229,252,.5)';ctx.lineWidth=.009;ctx.stroke();ctx.beginPath();ctx.ellipse(0,-1,.75,.09,0,0,TAU);ctx.stroke();line(-.69,-.77,-.55,.74,'rgba(211,249,255,.7)',.012);line(.69,-.64,.56,.76,'rgba(255,193,226,.6)',.009);
 if(!small){for(let i=0;i<15;i++){ctx.fillStyle='rgba(230,245,255,.23)';ctx.beginPath();ctx.ellipse(Math.sin(i*12)*.55,(i*.27%1)*1.5-.6,.009,.018,0,0,TAU);ctx.fill();}}
 ctx.restore();
 }
 const recipe=[{id:'syrup',color:'#f26e9b',amount:.2},{id:'spirit',color:'#a493ef',amount:.22},{id:'soda',color:'#65d9d6',amount:.25}];
 function draw(state){measure();const t=reduced.matches?0:state.time;ctx.clearRect(0,0,w,h);ctx.fillStyle='#0a0a14';ctx.fillRect(0,0,w,h);
 glow(w*.12,h*.18,w*.5,'rgba(89,48,144,.21)');glow(w*.87,h*.4,w*.5,'rgba(163,47,108,.15)');
 for(let i=0;i<7;i++){ctx.save();ctx.translate(w*(.06+i*.16),0);ctx.rotate(Math.sin(t*.3+i)*.4);const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,i%2?'rgba(233,73,158,.14)':'rgba(73,179,231,.12)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w*.16,h);ctx.lineTo(-w*.08,h);ctx.closePath();ctx.fill();ctx.restore();}
 const a=regions['auto-scene'],m=regions['manual-scene'];if(!a||!m)return;
 // Conveyor and preparation machine are clipped to the automatic bar.
 ctx.save();ctx.beginPath();ctx.rect(a.x,a.y,a.w,a.h);ctx.clip();
 const belt=a.y+a.h*.79,sz=Math.min(a.h*.25,a.w*.19),cx=a.x+a.w*.44,cy=belt-sz*1.07;
 const bg=ctx.createLinearGradient(0,belt,0,belt+45);bg.addColorStop(0,'#3b3547');bg.addColorStop(1,'#15131e');ctx.fillStyle=bg;ctx.fillRect(a.x+10,belt,a.w-20,39);
 line(a.x+10,belt,a.x+a.w-10,belt,'#8a739d',1);
 for(let i=0;i<24;i++){const xx=a.x+((i*34+t*40)%(a.w+34));line(xx,belt+6,xx-18,belt+32,'rgba(196,165,205,.14)');}
 ctx.fillStyle='#1d1927';ctx.strokeStyle='#63506b';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(a.x+a.w*.12,a.y+12,a.w*.47,47,8);ctx.fill();ctx.stroke();
 for(let i=0;i<3;i++){ctx.fillStyle=['#f26e9b','#a493ef','#65d9d6'][i];ctx.fillRect(a.x+a.w*.17+i*a.w*.12,a.y+27,a.w*.07,5);}
 const nozzle=a.y+59;ctx.fillStyle='#908094';ctx.fillRect(cx-7,nozzle,14,17);
 const phase=state.autoTime,shift=phase>4.5?((phase-4.5)/2.5)**2*a.w*.95:0;
 const fill=Math.min(1,Math.max(0,(phase-.65)/2.9));
 glass(cx+shift,cy,sz,{layers:recipe.map(l=>({...l,amount:l.amount*fill})),ice:fill>.65?[{x:-.25,y:-.2,angle:.4},{x:.25,y:.1,angle:1}]:[]},t,true);
 if(phase>.65&&phase<3.55){line(cx,nozzle+17,cx,cy+sz*(.86-fill*1.34),'rgba(168,141,236,.65)',4);glow(cx,cy,sz*.8,'rgba(182,93,228,.12)');}
 ctx.font='10px Arial';ctx.fillStyle='#b2a0be';ctx.textAlign='center';
 ctx.restore();
 const s=Math.min(m.h*.36,m.w*.28),x=m.x+m.w*.5,y=m.y+m.h*.53;
 glow(x,y+s,s*1.8,'rgba(234,136,123,.08)');
 ctx.strokeStyle=state.activeTool?'rgba(235,216,156,.8)':'rgba(211,177,152,.2)';ctx.lineWidth=state.activeTool?2:1;ctx.beginPath();ctx.ellipse(x,y+s*1.08,s*1.1,s*.18,0,0,TAU);ctx.stroke();
 glass(x,y,s,state.glass,t);
 if(state.activeTool&&state.activeTool!=='ice'&&state.activeTool!=='spoon'){line(x,y-s*1.5,x,y+s*.4,'rgba(244,215,159,.65)',4);}
 if(state.delivery>0){const dx=a.x+a.w*.82,dy=a.y+a.h*.37;ctx.save();ctx.globalAlpha=Math.min(1,state.delivery*4);glass(dx,dy,sz*.58,{layers:recipe,ice:[{x:0,y:0,angle:.5}]},t,true);ctx.restore();}
 }
 function hit(x,y){const m=regions['manual-scene'];if(!m)return false;const s=Math.min(m.h*.36,m.w*.28);return Math.abs(x-(m.x+m.w*.5))<s*.95&&Math.abs(y-(m.y+m.h*.53))<s*1.2;}
 resize();return {draw,resize,hit};
}
