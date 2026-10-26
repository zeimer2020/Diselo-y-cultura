import {clamp} from './config.js';
export function createSimulation({random=Math.random,onCollision=()=>{}}={}) {
 const state={time:0,melt:0,agitation:0,comfort:0,pulse:0,tilt:0,tiltVelocity:0,targetTilt:0,breathing:false,held:false,beat:0,ice:[],bubbles:[],collisions:0};
 function reset(){Object.assign(state,{time:0,melt:0,agitation:0,comfort:0,pulse:0,tilt:0,tiltVelocity:0,targetTilt:0,breathing:false,held:false,beat:0,collisions:0});
 state.ice=Array.from({length:4},(_,i)=>({x:(i%2-.5)*.58,y:-.43+Math.floor(i/2)*.54,vx:0,vy:0,angle:random()*2,spin:0,size:.27,cooldown:0}));
 state.bubbles=Array.from({length:55},()=>({x:(random()-.5)*1.35,y:random()*1.65-.8,r:.005+random()*.011,speed:.08+random()*.2})); }
 function stir(value){const v=clamp(value,-1,1);state.targetTilt=v*.27;state.agitation=clamp(state.agitation+Math.abs(v)*.025,0,1);}
 function pulse(){state.pulse=1;state.beat++;state.agitation=clamp(state.agitation+.1,0,1); for(let i=0;i<state.ice.length;i++){state.ice[i].vy-=.35;state.ice[i].vx+=(i%2?1:-1)*.24;}}
 function shake(){state.agitation=1;state.pulse=1;state.tiltVelocity=1.25;for(let i=0;i<state.ice.length;i++){const b=state.ice[i];b.vx=(i%2?1:-1)*(.8+random()*.5);b.vy=(i<2?1:-1)*(.75+random()*.4);b.spin=(i%2?1:-1)*(3+random()*2);}}
 function step(delta){if(!Number.isFinite(delta)||delta<=0)return;const dt=Math.min(delta,1/30);state.time+=dt;
 state.agitation*=Math.exp(-dt*(state.breathing?2: .6));state.pulse*=Math.exp(-dt*3.5);
 if(!state.held)state.targetTilt*=Math.exp(-dt*3);
 state.tiltVelocity+=(state.targetTilt-state.tilt)*dt*32;state.tiltVelocity*=Math.exp(-dt*7);state.tilt+=state.tiltVelocity*dt;
 state.melt=clamp(state.melt+dt*(1/100+state.agitation*.005+(state.held?.001:0)),0,1);
 const comfortTarget=clamp(state.melt*.9+(state.breathing?.2:.06)-state.agitation*.12,0,1);
 state.comfort+=(comfortTarget-state.comfort)*(1-Math.exp(-dt*.55));
 const size=.27*(1-state.melt*.84);
 for(const b of state.ice){b.size=size;b.cooldown=Math.max(0,b.cooldown-dt);b.vx+=(-Math.sin(state.tilt)*4+state.tiltVelocity*1.4)*dt;b.vy+=(-.14-(b.y+.34)*1.6)*dt;b.vx*=Math.exp(-dt*1.5);b.vy*=Math.exp(-dt*1.3);b.x+=b.vx*dt;b.y+=b.vy*dt;b.angle+=b.spin*dt;b.spin*=Math.exp(-dt*1.4);
 const limit=.69-size;let impact=0;
 if(Math.abs(b.x)>limit){impact=Math.abs(b.vx);b.x=clamp(b.x,-limit,limit);b.vx*=-.55;b.spin=b.vx*2;}
 if(b.y>.77-size){impact=Math.max(impact,Math.abs(b.vy));b.y=.77-size;b.vy*=-.4;}
 if(b.y<-.73+size){impact=Math.max(impact,Math.abs(b.vy));b.y=-.73+size;b.vy*=-.4;}
 if(impact>.12&&b.cooldown===0){b.cooldown=.18;state.collisions++;onCollision(clamp(impact,0,1));}}
 for(let i=0;i<state.ice.length;i++)for(let j=i+1;j<state.ice.length;j++){const a=state.ice[i],b=state.ice[j],dx=b.x-a.x,dy=b.y-a.y;const d=Math.hypot(dx,dy),min=(a.size+b.size)*.88;if(d<min){const nx=d>1e-6?dx/d:1,ny=d>1e-6?dy/d:0,push=(min-d)*.5;a.x-=nx*push;a.y-=ny*push;b.x+=nx*push;b.y+=ny*push;const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rel<0){a.vx+=rel*nx*.6;b.vx-=rel*nx*.6;a.vy+=rel*ny*.6;b.vy-=rel*ny*.6;if(-rel>.14&&a.cooldown===0){a.cooldown=b.cooldown=.2;state.collisions++;onCollision(clamp(-rel,0,1));}}}}
 for(const b of state.ice){b.x=clamp(b.x,-.69+size,.69-size);b.y=clamp(b.y,-.73+size,.77-size);}
 for(const b of state.bubbles){b.y-=dt*(b.speed+state.agitation*.18);b.x+=Math.sin(state.time*2+b.y*8)*dt*.012;if(b.y<-.76){b.y=.77;b.x=(random()-.5)*1.27;}}
 }
 reset();return {state,reset,step,stir,pulse,shake};
}
