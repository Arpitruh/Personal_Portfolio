import test from "node:test";
import assert from "node:assert/strict";
import { projects } from "../src/data/portfolio.ts";
import { safeSlugs, parseSharedComparison, compareUrl, discoverProjects, MAX_COMPARE } from "../src/data/project-discovery.ts";

test("shared comparisons safely ignore duplicates and unknown slugs", () => {
  assert.deepEqual(safeSlugs(["cacheloom","cacheloom","unknown","leadloop-crm"]), ["cacheloom","leadloop-crm"]);
  assert.deepEqual(parseSharedComparison("?compare=cacheloom,invalid,leadloop-crm,auth-service,gemini-clone"), ["cacheloom","leadloop-crm","auth-service"]);
  assert.equal(parseSharedComparison("?compare=").length,0);
  assert.equal(parseSharedComparison("?other=x").length,0);
  assert.equal(MAX_COMPARE,3);
  const url=compareUrl("https://example.com",["cacheloom","leadloop-crm"]);
  assert.deepEqual(parseSharedComparison(new URL(url).search), ["cacheloom","leadloop-crm"]);
});

test("discovery filters stacks, saved projects and stable ordering", () => {
  const base={ search:"", category:"All", savedOnly:false, saved:[], sort:"featured" };
  assert.equal(discoverProjects(projects,base).length,projects.length);
  const found=discoverProjects(projects,{...base,search:"cacheloom"});
  assert.ok(found.some(p=>p.slug==="cacheloom"));
  assert.ok(found.every(p=>[p.title,p.summary,p.category,p.kicker,...p.stack].join(" ").toLowerCase().includes("cacheloom")));
  const favorites=discoverProjects(projects,{...base,savedOnly:true,saved:["cacheloom","leadloop-crm"]});
  assert.deepEqual(new Set(favorites.map(p=>p.slug)),new Set(["cacheloom","leadloop-crm"]));
  const alpha=discoverProjects(projects,{...base,sort:"alphabetical"});
  assert.deepEqual(alpha.map(p=>p.title),alpha.map(p=>p.title).sort((a,b)=>a.localeCompare(b)));
  assert.equal(discoverProjects(projects,{...base,category:"AI"}).every(p=>p.category==="AI"),true);
});
