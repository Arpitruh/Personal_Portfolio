import test from "node:test";
import assert from "node:assert/strict";
import { gameLevels, validateGameSave } from "../src/data/game-levels.ts";
import { projects } from "../src/data/portfolio.ts";

test("Every game world has valid checkpoint and portal coordinates", () => {
  assert.equal(gameLevels.length,3);
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
