import lifeSource from "../../content/life.json" with { type: "json" };
import socialsSource from "../../content/socials.json" with { type: "json" };
import resumeSource from "../../content/resume.json" with { type: "json" };
import visualSource from "../../content/visuals.json" with { type: "json" };

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

/** Public media must be a local, owner-uploaded file in the approved image directory. */
export function safePersonalImage(value:unknown):string {
  if(typeof value!=="string")return "";
  return /^\/uploads\/images\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.(?:jpg|jpeg|png|webp)$/i.test(value) ? value : "";
}
export interface VisualAsset { src:string; alt:string; caption?:string }
export interface GalleryMoment extends VisualAsset { title:string; category:string; featured:boolean }
function validAsset(src:unknown,alt:unknown,caption:unknown): VisualAsset|null {
  const path=safePersonalImage(src);
  if(!path||typeof alt!=="string"||!alt.trim())return null;
  return {src:path,alt:alt.trim(),caption:typeof caption==="string"?caption:""};
}
export const visualIdentity:{
  portrait:VisualAsset|null;
  illustration:VisualAsset|null;
  moments:GalleryMoment[];
} = {
  portrait:validAsset(visualSource.portrait.src,visualSource.portrait.alt,visualSource.portrait.caption),
  illustration:validAsset(visualSource.illustration.src,visualSource.illustration.alt,visualSource.illustration.caption),
  moments:visualSource.moments.flatMap(entry=>{
    if(!entry.visible) return [];
    const asset=validAsset(entry.src,entry.alt,entry.caption);
    if(!asset||typeof entry.title!=="string"||!entry.title.trim())return [];
    return [{...asset,title:entry.title.trim(),category:entry.category||"Personal",featured:!!entry.featured}];
  })
};
