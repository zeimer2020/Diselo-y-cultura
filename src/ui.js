import {CHAPTERS} from './config.js';
export function createUI(actions){
 const $=id=>document.getElementById(id),abort=new AbortController(),opts={signal:abort.signal};let chapter=-1,noticeTimer;
 $('shake').addEventListener('click',actions.shake,opts);$('enter').addEventListener('click',actions.enter,opts);$('sound').addEventListener('click',actions.sound,opts);$('pause').addEventListener('click',actions.pause,opts);$('restart').addEventListener('click',actions.restart,opts);$('pulse').addEventListener('click',actions.pulse,opts);$('breathe').addEventListener('click',actions.breathe,opts);
 $('about').addEventListener('click',()=>{$('about-dialog').showModal();actions.modal(true);},opts);$('close-about').addEventListener('click',()=>$('about-dialog').close(),opts);$('about-dialog').addEventListener('close',()=>actions.modal(false),opts);
 return {
 entered(active){document.body.classList.toggle('entered',active);$('opening').hidden=active;$('journey').hidden=!active;$('interaction').hidden=!active;$('pause').disabled=!active;},
 sound(on){$('sound').setAttribute('aria-pressed',String(on));$('sound-state').textContent=on?'on':'off';},
 paused(value){$('pause').textContent=value?'Continuar':'Pausar';$('pause').setAttribute('aria-pressed',String(value));},
 breathing(value){$('breathe').setAttribute('aria-pressed',String(value));$('breathe').querySelector('strong').textContent=value?'A tu ritmo':'Respira un momento';},
 update(state){const i=state.melt<.32?0:state.melt<.72?1:2;if(i===chapter)return;chapter=i;const c=CHAPTERS[i];$('chapter-number').textContent=c.number;$('chapter-title').textContent=c.title;$('chapter-line').textContent=c.line;$('flavor').textContent=c.flavor;$('chapter-announcement').textContent=c.title;},
 notice(text){$('notice').textContent=text;$('notice').classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').classList.remove('visible'),5000);},
 dispose(){abort.abort();clearTimeout(noticeTimer);},
 };
}
