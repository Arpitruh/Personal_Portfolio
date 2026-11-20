import lifeSource from "../../content/life.json";
import socialsSource from "../../content/socials.json";
import resumeSource from "../../content/resume.json";

export interface Hobby { title:string; description:string; emoji?:string }
export const life = {
  eyebrow:lifeSource.eyebrow,
  title:lifeSource.title,
  introduction:lifeSource.introduction,
  note:lifeSource.note,
  hobbies:lifeSource.hobbies as Hobby[]
};
export type SocialProfile = {name:string;url:string;kind:string;visible:boolean};
// Never render unapproved/social links or unsafe URL schemes as clickable links.
export const socialProfiles:SocialProfile[] = socialsSource.links.filter(link=>{
  if(!link.visible) return false;
  try {const url=new URL(link.url);return url.protocol==="https:" && Boolean(url.hostname)}
  catch {return false}
});
const pdf=resumeSource.file.trim();
// Only a local Pages CMS media path may enable public PDF download.
export const resume={
  label:resumeSource.label,
  updated:resumeSource.updated,
  note:resumeSource.note,
  file:/^\/uploads\/resumes\/[a-zA-Z0-9_.-]+\.pdf$/i.test(pdf)&&!pdf.includes("..")?pdf:""
};
