import test from "node:test";
import assert from "node:assert/strict";
import { projects, projectCategories, profile, getProject } from "../src/data/portfolio.ts";

test("Every project has a unique route and real GitHub URL", () => {
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(project.title && project.summary && project.challenge && project.approach);
    assert.equal(new URL(project.github).hostname, "github.com");
    assert.ok(projectCategories.includes(project.category));
    assert.deepEqual(getProject(project.slug), project);
  }
});

test("Portfolio's basic public identity is configured", () => {
  assert.equal(profile.name, "Arpit Yadav");
  assert.equal(new URL(profile.github).hostname, "github.com");
  assert.ok(projects.some((project) => project.featured));
});
