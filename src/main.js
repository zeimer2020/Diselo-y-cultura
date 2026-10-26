import {createSimulation} from './simulation.js';
import {createRenderer} from './renderer.js';
import {createSound} from './audio.js';
import {createUI} from './ui.js';
import {bindGestures} from './gestures.js';
const sound=createSound(),sim=createSimulation({onCollision:power=>sound.clink(power)});
let active=false,paused=false,modal=false,last=0,accumulator=0,soundWanted=false,sceneTime=0;
const canvas=document.querySelector('#scene');
const renderer=createRenderer(canvas);
const allowed=()=>active&&!paused&&!modal&&!document.hidden;
async function enableSound(){try{const ok=await sound.enable();if(!ok){soundWanted=false;ui.notice('Tu navegador no admite este sonido. Puedes explorar la obra en silencio.');}if(!soundWanted||!allowed())sound.mute();ui.sound(soundWanted);}catch{soundWanted=false;ui.sound(false);ui.notice('No se pudo activar el audio. Prueba pulsando Sonido otra vez.');}}
function syncSound(){sound.mute(!soundWanted||!allowed());}
function pulse(){if(!allowed())return;sim.pulse();sound.pulse(sim.state.beat-1);}
const ui=createUI({
 enter(){active=true;paused=false;ui.entered(true);ui.paused(false);ui.update(sim.state);syncSound();},
 sound(){soundWanted=!soundWanted;if(soundWanted)void enableSound();else{sound.mute();ui.sound(false);}},
 pause(){if(!active)return;paused=!paused;gestures.clear();accumulator=0;ui.paused(paused);syncSound();},
 restart(){sim.reset();active=true;paused=false;gestures.clear();accumulator=0;ui.entered(true);ui.paused(false);ui.breathing(false);ui.update(sim.state);syncSound();},
 shake(){if(!allowed())return;sim.shake();sound.clink(.65);},
 pulse,
 breathe(){if(!allowed())return;sim.state.breathing=!sim.state.breathing;ui.breathing(sim.state.breathing);},
 modal(value){modal=value;gestures.clear();accumulator=0;syncSound();},
});
const gestures=bindGestures(canvas,renderer,{allowed,hold(value){sim.state.held=value;},stir(value){if(allowed())sim.stir(value);},pulse});
window.addEventListener('resize',renderer.resize);
document.addEventListener('visibilitychange',()=>{last=0;accumulator=0;gestures.clear();syncSound();});
function frame(now){const dt=last?Math.min((now-last)/1000,.1):1/60;last=now;if(!paused&&!modal&&!document.hidden)sceneTime+=dt;if(allowed()){accumulator+=dt;while(accumulator>=1/120){sim.step(1/120);accumulator-=1/120;}ui.update(sim.state);sound.update(sim.state.comfort,sim.state.breathing);}renderer.draw(sim.state,{active,paused,sceneTime});requestAnimationFrame(frame);}
requestAnimationFrame(frame);
