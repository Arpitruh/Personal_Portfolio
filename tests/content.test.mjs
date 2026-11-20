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

test("Project assets are sourced from identified repositories", () => {
  for (const project of projects) {
    if (!project.image) continue;
    const url = new URL(project.image.src);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "raw.githubusercontent.com");
    assert.ok(url.pathname.includes("/main/"));
    assert.ok(project.image.alt.length > 20);
    assert.ok(project.image.caption.length > 8);
  }
});

test("Portfolio includes a broad mix of actual project work", () => {
  assert.ok(projects.length >= 10);
  for (const project of projects) {
    assert.notEqual(project.github, "#");
    assert.ok(project.highlights.length >= 3);
  }
});

test("Portfolio's basic public identity is configured", () => {
  assert.equal(profile.name, "Arpit Yadav");
  assert.equal(new URL(profile.github).hostname, "github.com");
  assert.ok(projects.some((project) => project.featured));
});
