export function createSound(){let ctx,master,bed,muted=true,lastClink=-10;const voices=new Set();
 async function enable(){if(!ctx){const AC=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AC)return false;ctx=new AC();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);bed=ctx.createGain();bed.gain.value=.025;bed.connect(master);for(const hz of [55,82.41,110.15]){const o=ctx.createOscillator();o.type='sine';o.frequency.value=hz;o.connect(bed);o.start();}}await ctx.resume();muted=false;master.gain.setTargetAtTime(.48,ctx.currentTime,.3);return true;}
 function mute(value=true){muted=value;if(ctx)master.gain.setTargetAtTime(value?0:.48,ctx.currentTime,.08);}
 function tone(hz,level,duration){if(!ctx||muted||ctx.state!=='running')return;while(voices.size>=12){const oldest=voices.values().next().value;oldest.stop();voices.delete(oldest);}const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=hz;o.connect(g);g.connect(master);const now=ctx.currentTime;g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(level,now+.004);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.start();o.stop(now+duration+.02);voices.add(o);o.onended=()=>{o.disconnect();g.disconnect();voices.delete(o);};}
 function clink(power=.3){if(!ctx||ctx.currentTime-lastClink<.09)return;lastClink=ctx.currentTime;tone(1480+power*320,.035+power*.045,.22);tone(2580,.012,.12);}
 function pulse(index=0){tone([196,220,261.63,293.66,329.63][index%5],.10,.7);tone(65.4,.1,.18);}
 function update(comfort,breathing){if(ctx&&bed)bed.gain.setTargetAtTime(breathing?.012:.025-comfort*.012,ctx.currentTime,.6);}
 async function dispose(){voices.clear();await ctx?.close();}
 return {enable,mute,clink,pulse,update,dispose,get muted(){return muted;}};
}
