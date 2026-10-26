import {clamp,lerp} from './config.js';
export function createRenderer(canvas){
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas no disponible');let w=0,h=0,dpr=1,layout;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const mobile=w<760;const size=Math.min(mobile?h*.34:h*.56,mobile?w*.93:520);layout={x:w*(mobile?.5:.68),y:h*(mobile?.58:.46),scale:size/1.9,size};}
 function glow(x,y,r,color){const grad=ctx.createRadialGradient(x,y,0,x,y,r);grad.addColorStop(0,color);grad.addColorStop(1,'transparent');ctx.fillStyle=grad;ctx.fillRect(x-r,y-r,r*2,r*2);}
 function glassPath(){ctx.beginPath();ctx.moveTo(-.84,-.87);ctx.bezierCurveTo(-.84,-.95,.84,-.95,.84,-.87);ctx.lineTo(.67,.82);ctx.bezierCurveTo(.65,1,-.65,1,-.67,.82);ctx.closePath();}
 function draw(state,{active=false,paused=false,sceneTime=0}={}){
 const t=reduced.matches?0:sceneTime,c=state.comfort,a=state.agitation;
 const energy=(active?.75:.55)*(1-c*.24)+a*.3;
 const flash=reduced.matches?0:state.pulse;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#090c19';ctx.fillRect(0,0,w,h);
 glow(w*.75,h*.35,w*.54,`rgba(83,49,128,${.24-c*.07})`);
 glow(w*.97,h*.5,w*.42,`rgba(210,65,141,${.18-c*.04})`);
 glow(w*.45,h*.77,w*.32,`rgba(48,162,168,${.09+c*.09})`);

 // Continuous colored beams: no strobe.
 const colors=['70,209,255','244,67,190','152,97,255','55,239,204'];
 ctx.save();ctx.globalCompositeOperation='screen';
 for(let i=0;i<9;i++){
 const x=w*(.12+i*.105),spread=w*(.065+(i%3)*.025);
 ctx.save();ctx.translate(x,-10);ctx.rotate(Math.sin(t*.48+i*1.7)*.48+(i-4)*.07);
 const g=ctx.createLinearGradient(0,0,0,h*.95);
 g.addColorStop(0,'rgba('+colors[i%4]+','+(.26+energy*.13)+')');g.addColorStop(.5,'rgba('+colors[i%4]+',.07)');g.addColorStop(1,'transparent');
 ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(spread,h);ctx.lineTo(-spread,h);ctx.closePath();ctx.fill();ctx.restore();glow(x,8,28,'rgba('+colors[i%4]+',.32)');
 }
 for(let i=0;i<6;i++){
 ctx.strokeStyle='rgba('+colors[i%4]+',.14)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w*(i%2?.96:.38),h*.2);ctx.lineTo(w*(.5+Math.sin(t*.32+i)*.65),h*.85);ctx.stroke();
 }
 for(let i=0;i<65;i++){
 const px=((i*.618+t*.009)%1)*w,py=h*(.15+((i*.381)%1)*.68);
 ctx.fillStyle='rgba('+colors[i%4]+','+(.07+(.5+.5*Math.sin(t*.85+i*2))*.17)+')';
 ctx.save();ctx.translate(px,py);ctx.rotate(t*.2+i);ctx.fillRect(-2,-1,4+i%3,2);ctx.restore();
 }
 glow(w*.75,h*.45,w*.35,'rgba(188,40,208,'+(.12+flash*.09)+')');ctx.restore();
 // Mirrored ball with independently lit facets.
 const bx=w*.82,by=h*.12,br=Math.min(w*.032,34);
 ctx.strokeStyle='rgba(188,201,227,.35)';ctx.beginPath();ctx.moveTo(bx,0);ctx.lineTo(bx,by-br);ctx.stroke();glow(bx,by,br*2.4,'rgba(142,173,255,.16)');
 ctx.save();ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.clip();ctx.fillStyle='#171c3b';ctx.fillRect(bx-br,by-br,br*2,br*2);
 for(let row=-5;row<=5;row++)for(let col=-5;col<=5;col++){
 ctx.fillStyle='rgba(180,207,255,'+(.16+.6*Math.max(0,Math.sin(col*.75+t*.65+row*.4)))+')';ctx.fillRect(bx+col*br/5,by+row*br/5,br/5-1,br/5-1);
 }ctx.restore();
 // Dancing silhouettes behind the foreground glass.
 for(let i=0;i<23;i++){
 const x=(i*.137%1)*w,phase=t*(1.8+energy*.5)+i*1.7;
 const sway=reduced.matches?0:Math.sin(phase)*(7+energy*11),bounce=reduced.matches?0:Math.cos(phase*2)*3;
 const y=h*.6+Math.sin(i*2.1)*h*.04+bounce;ctx.fillStyle='rgba(27,24,53,'+(.65+Math.sin(i)*.1)+')';
 ctx.beginPath();ctx.ellipse(x+sway,y,12+(i%3)*4,16+(i%3)*3,0,0,Math.PI*2);ctx.fill();
 ctx.beginPath();ctx.ellipse(x+sway*.6,y+62,28+(i%3)*4,54,-sway*.008,0,Math.PI*2);ctx.fill();
 if(i%3===0){ctx.strokeStyle='rgba(35,28,64,.7)';ctx.lineWidth=11;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+sway,y+38);ctx.lineTo(x-32+sway,y+5);ctx.lineTo(x-38+sway*1.7,y-29);ctx.stroke();}
 }
 const shade=ctx.createLinearGradient(0,0,w*.55,0);shade.addColorStop(0,'rgba(7,9,21,.7)');shade.addColorStop(1,'transparent');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
 const {x,y,scale:s}=layout;
 ctx.strokeStyle='rgba(197,185,221,.07)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,s*1.34,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*1.5,-.5,2.8);ctx.stroke();
 // Bar surface and soft contact shadow.
 const barY=y+s*.99;const bg=ctx.createLinearGradient(0,barY,0,h);bg.addColorStop(0,'rgba(101,64,98,.14)');bg.addColorStop(1,'rgba(9,12,25,0)');ctx.fillStyle=bg;ctx.fillRect(0,barY,w,h-barY);
 ctx.save();ctx.lineWidth=1;ctx.strokeStyle='rgba(143,87,211,.14)';
 for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(w*.66,barY);ctx.lineTo(w*.66+i*w*.22,h);ctx.stroke();}
 for(let i=0;i<7;i++){const yy=barY+(h-barY)*(i/7)**1.8;ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(w,yy);ctx.stroke();}ctx.restore();
 glow(x,barY,s*1.4,'rgba(217,61,198,'+(.08+flash*.12)+')');
 ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(x+12,barY+14,s*.94,s*.12,0,0,Math.PI*2);ctx.fill();
 glow(x,barY,s*1.15,`rgba(126,212,209,${.07+c*.035})`);
 ctx.save();ctx.translate(x,y);ctx.rotate(reduced.matches?0:state.tilt*.6);ctx.scale(s,s);
 const glass=ctx.createLinearGradient(-.8,0,.8,0);glass.addColorStop(0,'rgba(131,211,231,.15)');glass.addColorStop(.12,'rgba(220,233,244,.025)');glass.addColorStop(.65,'rgba(175,196,222,.04)');glass.addColorStop(1,'rgba(227,160,206,.19)');glassPath();ctx.fillStyle=glass;ctx.fill();
 ctx.save();glassPath();ctx.clip();
 const top=-.63-state.melt*.035;const liquid=ctx.createLinearGradient(0,top,0,.9);liquid.addColorStop(0,'rgba(255,191,70,.48)');liquid.addColorStop(.28,'rgba(255,106,145,.46)');liquid.addColorStop(.62,'rgba(181,72,225,.43)');liquid.addColorStop(1,'rgba(38,180,222,.54)');ctx.fillStyle=liquid;
 ctx.beginPath();ctx.moveTo(-1,top);for(let xx=-1;xx<=1.02;xx+=.05){const wave=reduced.matches?0:Math.sin(xx*5+t*2.8)*(.012+a*.035+state.pulse*.025);ctx.lineTo(xx,top+wave+xx*state.tilt*.25);}ctx.lineTo(1,1);ctx.lineTo(-1,1);ctx.closePath();ctx.fill();
 // Translucent color currents remain clipped below the liquid surface.
 ctx.save();ctx.clip();ctx.globalCompositeOperation='screen';
 for(let i=0;i<4;i++){
 const mx=Math.sin(t*.65+i*1.8)*(.25+a*.2),my=-.3+i*.29+Math.cos(t*.8+i)*a*.08;
 glow(mx,my,.48+a*.12,['rgba(255,177,42,.26)','rgba(255,58,136,.25)','rgba(171,75,255,.28)','rgba(23,214,230,.3)'][i]);
 }ctx.restore();
 for(const b of state.bubbles){ctx.beginPath();ctx.arc(b.x,b.y,b.r*(1+state.pulse*.3),0,Math.PI*2);ctx.strokeStyle='rgba(202,244,219,.36)';ctx.lineWidth=.0025;ctx.stroke();}
 for(let i=0;i<state.ice.length;i++){const b=state.ice[i];ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle*.25);const q=b.size;
 ctx.shadowColor='rgba(142,239,240,.22)';ctx.shadowBlur=10;const ig=ctx.createLinearGradient(-q,-q,q,q);ig.addColorStop(0,'rgba(230,255,251,.46)');ig.addColorStop(.45,'rgba(113,220,228,.13)');ig.addColorStop(1,'rgba(215,244,255,.32)');ctx.fillStyle=ig;ctx.strokeStyle='rgba(208,248,246,.68)';ctx.lineWidth=.006;ctx.beginPath();ctx.roundRect(-q,-q,q*2,q*2,q*.24);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
 ctx.beginPath();ctx.moveTo(-q*.76,-q*.5);ctx.lineTo(-q*.58,-q*.77);ctx.lineTo(q*.6,-q*.77);ctx.strokeStyle='rgba(255,255,255,.75)';ctx.stroke();ctx.beginPath();ctx.moveTo(-q*.3,-q*.18);ctx.lineTo(q*.16,q*.27);ctx.lineTo(q*.55,q*.1);ctx.strokeStyle='rgba(226,255,251,.19)';ctx.lineWidth=.004;ctx.stroke();ctx.restore();}
 ctx.restore();
 // Thick glass foot and contrasting edge lights.
 ctx.lineWidth=.007;ctx.strokeStyle='rgba(193,233,240,.48)';glassPath();ctx.stroke();ctx.beginPath();ctx.ellipse(0,-.87,.84,.09,0,0,Math.PI*2);ctx.strokeStyle='rgba(218,240,243,.64)';ctx.stroke();ctx.beginPath();ctx.ellipse(0,-.87,.79,.066,0,0,Math.PI*2);ctx.lineWidth=.003;ctx.stroke();
 ctx.beginPath();ctx.moveTo(-.78,-.70);ctx.lineTo(-.63,.71);ctx.strokeStyle='rgba(198,251,255,.56)';ctx.lineWidth=.012;ctx.stroke();ctx.beginPath();ctx.moveTo(.78,-.62);ctx.lineTo(.65,.69);ctx.strokeStyle='rgba(255,199,224,.65)';ctx.lineWidth=.008;ctx.stroke();
 ctx.beginPath();ctx.ellipse(0,.82,.65,.095,0,0,Math.PI);ctx.lineWidth=.034;ctx.strokeStyle='rgba(167,219,232,.26)';ctx.stroke();
 // Condensation stays attached to the vessel.
 for(let i=0;i<28;i++){const cx=Math.sin(i*127.1)*.66,cy=(i*.367%1)*1.45-.65;ctx.beginPath();ctx.ellipse(cx,cy,.007+(i%3)*.002,.012,0,0,Math.PI*2);ctx.fillStyle='rgba(229,251,247,.22)';ctx.fill();}
 // A citrus wheel on the rim: the intense first taste.
 ctx.save();ctx.translate(.65,-.89);ctx.rotate(-.28);ctx.scale(.72,1);ctx.fillStyle='#b7c16b';ctx.strokeStyle='#e0e9a1';ctx.lineWidth=.014;ctx.beginPath();ctx.arc(0,0,.255,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,0,.217,0,Math.PI*2);ctx.fillStyle='#d7db8e';ctx.fill();for(let i=0;i<9;i++){const an=i/9*Math.PI*2;ctx.beginPath();ctx.moveTo(Math.cos(an)*.03,Math.sin(an)*.03);ctx.lineTo(Math.cos(an)*.20,Math.sin(an)*.20);ctx.strokeStyle='rgba(247,245,197,.85)';ctx.lineWidth=.007;ctx.stroke();}ctx.restore();
 ctx.restore();
 }
 function hit(clientX,clientY){return Math.abs(clientX-layout.x)<layout.scale*.95&&Math.abs(clientY-layout.y)<layout.scale*1.05;}
 resize();return {draw,resize,hit,get layout(){return layout;}};
}


