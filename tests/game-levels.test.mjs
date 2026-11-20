import test from "node:test";
import assert from "node:assert/strict";
import { gameLevels, validateGameSave, validateLevelRecord, rankMission, difficultySettings } from "../src/data/game-levels.ts";
import { projects } from "../src/data/portfolio.ts";

test("Every game world has valid checkpoint and portal coordinates", () => {
  assert.equal(gameLevels.length,5);
  assert.equal(new Set(gameLevels.map(l=>l.id)).size,gameLevels.length);
  for(const level of gameLevels) {
    assert.ok(level.width>900);
    assert.ok(level.coins.length>=20);
    assert.ok(level.checkpoints.length>=2);
    for (const p of level.pipes) {
      assert.ok(p.x>0 && p.x<level.width-155);
      assert.ok(projects[p.projectIndex]);
    }
    for (const x of level.checkpoints) assert.ok(x>0&&x<level.width-155);
  }
});
test("Checkpoint persistence restores only validated saves",()=>{
  for(const level of gameLevels) {
    const save={levelId:level.id,checkpointIndex:0,score:300,lives:2,collected:[0],defeated:[0]};
    assert.deepEqual(validateGameSave(save,level),save);
    assert.equal(validateGameSave({...save,checkpointIndex:99},level),null);
    assert.equal(validateGameSave({...save,collected:[9999]},level),null);
    assert.equal(validateGameSave({...save,score:Infinity},level),null);
    assert.equal(validateGameSave({...save,levelId:"another-world"},level),null);
  }
});

test("five game worlds have collectible abilities, secret stars and fair obstacles",()=>{
 for(const level of gameLevels){
  assert.ok(level.hazards.length>=3);
  assert.ok(level.powerups.length>=2);
  assert.ok(level.secretStars.length>=2);
  assert.equal(level.pipes.length,4);
  for(const hazard of level.hazards)assert.ok(hazard.x>120&&hazard.x+hazard.w<level.width-155);
  for(const power of level.powerups)assert.ok(power.x>0&&power.x<level.width-155);
  for(const star of level.secretStars)assert.ok(star.x>0&&star.x<level.width-155);
 }
});
test("level records and mission tiers validate independently of localStorage",()=>{
 assert.equal(validateLevelRecord({score:1200,coins:20,stars:1,seconds:150,difficulty:"normal"})?.score,1200);
 assert.equal(validateLevelRecord({score:-2,coins:20,stars:1,seconds:150,difficulty:"normal"}),null);
 assert.equal(validateLevelRecord({score:100,coins:20,stars:1,seconds:150,difficulty:"cheat"}),null);
 assert.equal(rankMission(20,24,1,2).collector,true);
 assert.equal(rankMission(12,24,0,1).perfect,false);
 assert.equal(rankMission(23,24,2,3).perfect,true);
 assert.equal(difficultySettings("casual").lives,5);
 assert.equal(difficultySettings("expert").lives,2);
});
