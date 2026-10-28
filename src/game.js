export const TOOLS = {
 spirit:{name:'Licor',color:'#90cfed',amount:.17},
 citrus:{name:'Limón',color:'#e0e88c',amount:.13},
 syrup:{name:'Granadina',color:'#fc6497',amount:.12},
 soda:{name:'Agua con gas',color:'#68e0d0',amount:.2},
 ice:{name:'Hielo',color:'#c3efff',amount:0},
 spoon:{name:'Cuchara',color:'#dacba9',amount:0},
};
export function createGame(){
 const state={time:0,autoTime:0,produced:0,received:0,crafted:0,delivery:0,glass:{layers:[],ice:[],mix:0,energy:0},drag:null,activeTool:null,toast:'',toastTime:0};
 const level=()=>state.glass.layers.reduce((sum,x)=>sum+x.amount,0);
 function resetGlass(){state.glass={layers:[],ice:[],mix:0,energy:0};}
 function message(text){state.toast=text;state.toastTime=3.5;}
 function use(id){const tool=TOOLS[id];if(!tool)return false;
 if(id==='spoon'){if(level()===0){message('Añade líquido primero.');return false;}state.glass.mix=Math.min(1,state.glass.mix+.13);state.glass.energy=1;return true;}
 if(id==='ice'){if(state.glass.ice.length>=4){message('Ya hay suficiente hielo.');return false;}state.glass.ice.push({x:(state.glass.ice.length%2-.5)*.64,y:-.25+Math.floor(state.glass.ice.length/2)*.55,angle:state.glass.ice.length*.8});state.glass.energy=1;message('');return true;}
 if(level()>=.82){message('Vaso lleno.');return false;}
 state.glass.layers.push({id,color:tool.color,amount:Math.min(tool.amount,.84-level())});state.glass.energy=.65;message('');return true;}
 function collect(){if(state.delivery>0){message('Preparando tu entrega…');return false;}state.delivery=1;state.received++;message('Bebida recibida.');return true;}
 function serve(){if(level()<.2){message('Añade un poco más.');return false;}state.crafted++;message('¡Servida!');resetGlass();return true;}
 function step(dt){if(!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.1);state.time+=dt;state.autoTime+=dt;while(state.autoTime>=7){state.autoTime-=7;state.produced++;}state.delivery=Math.max(0,state.delivery-dt*.35);state.toastTime=Math.max(0,state.toastTime-dt);state.glass.energy*=Math.exp(-dt*2);}
 return {state,level,use,collect,serve,step,resetGlass,message};
}
