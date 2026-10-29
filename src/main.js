import {createGame,TOOLS} from './game.js';
import {createRenderer} from './renderer.js';
import {createSound} from './audio.js';
const game=createGame(),renderer=createRenderer(document.querySelector('canvas')),sound=createSound();
const $=id=>document.getElementById(id);const toolElements=[...document.querySelectorAll('.tool')];let previousLock=null;let paused=false,soundOn=false,last=0,drag=null,hoverTime=0,stirDistance=0,lastStatus='';
function update(){
 const total=game.level();
 const message=game.state.toastTime>0?game.state.toast:'';if(lastStatus!==message){$('status').textContent=message;lastStatus=message;}
 const locked=game.state.mode==='automatic';
 if(previousLock!==locked){previousLock=locked;document.body.classList.toggle('automatic-choice',locked);for(const el of toolElements){el.setAttribute('aria-disabled',String(locked));el.tabIndex=locked?-1:0;}$('collect').textContent=locked?'Bebida automática elegida ✓':'Obtener bebida automática ↗';$('empty').title=locked?'Empezar de nuevo':'Vaciar vaso';$('empty').setAttribute('aria-label',$('empty').title);}
 $('collect').disabled=locked||paused;$('serve').disabled=locked||total<.2||paused;
}
function clearDrag(){if(!drag)return;const element=drag.element;const transform=getComputedStyle(element).transform;element.classList.remove('dragging','over-glass');element.removeAttribute('style');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)element.animate([{transform},{transform:'translate(0,0)'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});drag=null;game.state.activeTool=null;document.body.classList.remove('using-tool');hoverTime=0;}
function applyTool(id){if(game.use(id)){sound.clink(.4);update();}}
document.querySelectorAll('.tool').forEach(element=>{
 const id=element.dataset.tool;
 element.addEventListener('pointerdown',e=>{if(paused||game.state.mode==='automatic'||drag||e.button!==0)return;e.preventDefault();const r=element.getBoundingClientRect();drag={element,id,pointer:e.pointerId,x:e.clientX,y:e.clientY,ox:e.clientX,oy:e.clientY,used:false};element.setPointerCapture(e.pointerId);element.classList.add('dragging');element.style.setProperty('--dx','0px');element.style.setProperty('--dy','0px');document.body.classList.add('using-tool');hoverTime=0;stirDistance=0;});
 element.addEventListener('pointermove',e=>{if(!drag||drag.pointer!==e.pointerId)return;const distance=Math.hypot(e.clientX-drag.x,e.clientY-drag.y);drag.x=e.clientX;drag.y=e.clientY;const over=renderer.hit(e.clientX,e.clientY);game.state.activeTool=over?id:null;if(over)game.state.pourPoint={x:e.clientX,y:e.clientY};element.style.setProperty('--dx',(e.clientX-drag.ox)+'px');element.style.setProperty('--dy',(e.clientY-drag.oy)+'px');element.classList.toggle('over-glass',over);
 if(over&&id==='spoon'){stirDistance+=distance;if(stirDistance>24){applyTool(id);stirDistance=0;drag.used=true;}}
 });
 function release(e){if(!drag||drag.pointer!==e.pointerId)return;if(e.type==='pointerup'&&!drag.used&&renderer.hit(e.clientX,e.clientY))applyTool(id);element.classList.remove('over-glass');clearDrag();}
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(ev,release);
 // Keyboard alternative for the same physical tools.
 element.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!paused&&game.state.mode!=='automatic'){e.preventDefault();game.state.pourPoint=null;applyTool(id);}});
});
$('collect').addEventListener('click',()=>{if(!paused){clearDrag();if(game.collect())sound.pulse(0);}update();});
$('serve').addEventListener('click',()=>{if(!paused&&game.serve())sound.pulse(game.state.crafted);update();});
$('empty').addEventListener('click',()=>{if(!paused){clearDrag();game.resetGlass();game.message('');update();}});
$('pause').addEventListener('click',()=>{paused=!paused;clearDrag();$('pause').textContent=paused?'Continuar':'Pausar';$('pause').setAttribute('aria-pressed',String(paused));sound.mute(paused||!soundOn);update();});
$('sound').addEventListener('click',async()=>{try{if(!soundOn){soundOn=await sound.enable();}else soundOn=false;sound.mute(!soundOn||paused);$('sound').textContent=soundOn?'Sonido on':'Sonido off';$('sound').setAttribute('aria-pressed',String(soundOn));}catch{game.message('Puedes jugar en silencio. No se pudo activar el sonido.');}});
document.addEventListener('visibilitychange',()=>{last=0;clearDrag();sound.mute(document.hidden||paused||!soundOn);});window.addEventListener('blur',clearDrag);window.addEventListener('resize',renderer.resize);
function frame(now){const dt=last?Math.min((now-last)/1000,.1):0;last=now;if(!paused&&!document.hidden){game.step(dt);if(drag&&game.state.activeTool){hoverTime+=dt;if(drag.id==='ice'&&!drag.used&&hoverTime>.2){applyTool('ice');drag.used=true;}else if(drag.id!=='ice'&&drag.id!=='spoon'&&hoverTime>.65){applyTool(drag.id);drag.used=true;hoverTime=0;}}else hoverTime=0;}renderer.draw(game.state);update();requestAnimationFrame(frame);}
update();requestAnimationFrame(frame);
