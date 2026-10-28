import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from '../src/game.js';
test('automatic bar repeats forever without input',()=>{const g=createGame();for(let i=0;i<10000;i++)g.step(.1);assert.ok(g.state.produced>=142);assert.ok(g.state.autoTime<7);assert.equal(g.level(),0);});
test('tools fill the manual glass without overflowing',()=>{const g=createGame();for(let i=0;i<30;i++)g.use('syrup');assert.ok(g.level()<=.840000001);assert.ok(g.level()>.8);});
test('ice is capped, mixing requires liquid, serving starts a new glass',()=>{const g=createGame();assert.equal(g.use('spoon'),false);for(let i=0;i<10;i++)g.use('ice');assert.equal(g.state.glass.ice.length,4);assert.equal(g.serve(),false);g.use('spirit');g.use('citrus');for(let i=0;i<20;i++)g.use('spoon');assert.equal(g.state.glass.mix,1);assert.equal(g.serve(),true);assert.equal(g.state.crafted,1);assert.equal(g.level(),0);assert.equal(g.state.glass.ice.length,0);});
test('automatic collection has cooldown and never alters handmade drink',()=>{const g=createGame();g.use('citrus');assert.equal(g.collect(),true);assert.equal(g.collect(),false);for(let i=0;i<40;i++)g.step(.1);assert.equal(g.collect(),true);assert.equal(g.state.received,2);assert.equal(g.level(),.13);});
