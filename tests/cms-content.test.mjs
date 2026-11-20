import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { projects, experience, skills } from "../src/data/portfolio.ts";
import { life, socialProfiles, resume } from "../src/data/personal.ts";

test("CMS project collection is compiled exactly without losing records",async()=>{
 const names=(await readdir("content/projects")).filter(x=>x.endsWith(".json"));
 const authored=await Promise.all(names.map(async file=>JSON.parse(await readFile("content/projects/"+file,"utf8"))));
 assert.equal(authored.length,projects.length);
 assert.deepEqual(new Set(authored.map(x=>x.slug)),new Set(projects.map(x=>x.slug)));
 for(const authoredProject of authored)assert.deepEqual(projects.find(p=>p.slug===authoredProject.slug),authoredProject);
});
test("CMS records power experience, skills and personal life without invented hobbies",()=>{
 assert.ok(experience.length>=2);
 assert.ok(skills.some(x=>x.group==="Frontend"));
 assert.ok(life.introduction.trim().length>35);
 assert.deepEqual(life.hobbies,[]);
 assert.ok(socialProfiles.every(x=>x.visible&&new URL(x.url).protocol==="https:"));
 assert.equal(resume.file,"");
});

test("Phase 15 media must be an approved, local and accessible asset",async()=>{
 const {safePersonalImage,visualIdentity}=await import("../src/data/personal.ts");
 assert.equal(safePersonalImage("/uploads/images/my-portrait.webp"),"/uploads/images/my-portrait.webp");
 for(const malicious of ["https://site.example/photo.jpg","/../secrets.png","/uploads/images/../../private.jpg","javascript:alert(1)","/uploads/resumes/cv.pdf"])assert.equal(safePersonalImage(malicious),"");
 assert.equal(visualIdentity.portrait,null);
 assert.equal(visualIdentity.illustration,null);
 assert.deepEqual(visualIdentity.moments,[]);
});
