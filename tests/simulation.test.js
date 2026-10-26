import test from 'node:test';
import assert from 'node:assert/strict';
import {createSimulation} from '../src/simulation.js';
const make=()=>createSimulation({random:()=>.5});
test('time alone changes the drink; there is no compulsory interaction',()=>{const sim=make();for(let i=0;i<120*105;i++)sim.step(1/120);assert.equal(sim.state.melt,1);assert.ok(sim.state.comfort>.85);assert.ok(sim.state.ice.every(b=>b.size<.05));});
test('agitation accelerates melting and produces physical motion',()=>{const still=make(),moving=make();for(let i=0;i<120*15;i++){moving.stir(Math.sin(i*.035));still.step(1/120);moving.step(1/120);}assert.ok(moving.state.melt>still.state.melt);assert.ok(moving.state.ice.some((b,i)=>Math.abs(b.x-still.state.ice[i].x)>.02));});
test('ice stays finite and within its glass even with repeated impulses',()=>{const sim=make();for(let i=0;i<120*80;i++){if(i%15===0)sim.pulse();sim.stir(Math.sin(i*.4));sim.step(1/120);for(const b of sim.state.ice){assert.ok([b.x,b.y,b.vx,b.vy,b.size,b.angle].every(Number.isFinite));assert.ok(Math.abs(b.x)<=.69-b.size+1e-6);assert.ok(b.y<=.77-b.size+1e-6&&b.y>=-.73+b.size-1e-6);}}});
test('breathing softens agitation and reset restores the first moment',()=>{const a=make(),b=make();a.pulse();b.pulse();b.state.breathing=true;for(let i=0;i<120;i++){a.step(1/120);b.step(1/120);}assert.ok(b.state.agitation<a.state.agitation);b.reset();assert.equal(b.state.time,0);assert.equal(b.state.melt,0);assert.equal(b.state.beat,0);assert.equal(b.state.breathing,false);});
test('invalid time cannot poison the simulation',()=>{const sim=make();for(const dt of [NaN,Infinity,-1,0])sim.step(dt);assert.equal(sim.state.time,0);});
