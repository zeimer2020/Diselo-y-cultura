export function bindGestures(canvas,renderer,actions){const ac=new AbortController(),o={signal:ac.signal};let pointer=null,startX=0,lastX=0,lastY=0,moved=false;
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0||pointer!==null||!renderer.hit(e.clientX,e.clientY)||!actions.allowed())return;pointer=e.pointerId;startX=lastX=e.clientX;lastY=e.clientY;moved=false;canvas.setPointerCapture(pointer);actions.hold(true);},o);
 canvas.addEventListener('pointermove',e=>{if(e.pointerId!==pointer)return;if(Math.hypot(e.clientX-startX,e.clientY-lastY)>5)moved=true;actions.stir((e.clientX-startX)/Math.max(100,renderer.layout.scale));lastX=e.clientX;},o);
 function release(e){if(e.pointerId!==pointer)return;if(e.type==='pointerup'&&!moved)actions.pulse();pointer=null;actions.hold(false);}
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(ev,release,o);
 function clear(){pointer=null;actions.hold(false);}
 window.addEventListener('blur',clear,o);
 window.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||!actions.allowed()||e.target.closest?.('button,a,input,dialog'))return;if(e.code==='Space'){e.preventDefault();actions.pulse();}if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();actions.stir(e.code==='ArrowLeft'?-.9:.9);}},o);
 return {clear,dispose(){ac.abort();clear();}};
}
