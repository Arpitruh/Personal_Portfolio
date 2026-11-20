import test from "node:test";
import assert from "node:assert/strict";
import { answerPortfolioQuestion } from "../src/data/portfolio-assistant.ts";
import { architectureOverview } from "../src/data/architecture.ts";
import { skillFamilies, projectSkillConnections } from "../src/data/skill-connections.ts";
import { questForPath, safeQuests, questDefinitions } from "../src/data/quests.ts";
import { projects } from "../src/data/portfolio.ts";
test("guide answers from the published portfolio, not an external service",()=>{
 const answer=answerPortfolioQuestion("Tell me about CacheLoom");
 assert.match(answer.text,/CacheLoom/);
 assert.ok(answer.links.some(x=>x.href==="/projects/cacheloom"));
 assert.ok(answerPortfolioQuestion("What is his experience?").links.some(x=>x.href==="/about#experience"));
 assert.ok(answerPortfolioQuestion("how do i hire Arpit").links.some(x=>x.href==="/contact"));
 assert.ok(answerPortfolioQuestion("unknown random subject").text.includes("cannot verify"));
});
test("skills and architecture only use documented project data",()=>{
 assert.equal(skillFamilies.length,4);
 assert.ok(projectSkillConnections("Next.js").includes("leadloop-crm"));
 for(const project of projects) {
  const diagram=architectureOverview(project);
  assert.equal(diagram.length,3);
  assert.ok(diagram.every(node=>node.step&&node.detail));
 }
});
test("achievements discard invalid local state and track only named pages",()=>{
 assert.equal(questForPath("/projects/cacheloom"),"case-study");
 assert.equal(questForPath("/room"),"room");
 assert.equal(questForPath("/nonsense"),null);
 assert.deepEqual(safeQuests(["room","room","invalid","recruiter"]),["room","recruiter"]);
 assert.equal(new Set(questDefinitions.map(x=>x.id)).size,questDefinitions.length);
});
