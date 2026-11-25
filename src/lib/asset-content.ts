import {cache} from "react";
import {resume,visualIdentity,characterPack,type VisualAsset} from "@/data/personal";
import {published,query} from "@/lib/portfolio-db";
export const assetSlots=["portrait","illustration","standing","sitting","coding","casual"] as const;
export const appearanceDefaults={portrait:visualIdentity.portrait,illustration:visualIdentity.illustration,...characterPack};
export type Appearance=Record<(typeof assetSlots)[number],VisualAsset|null>;
export type ResumeContent=typeof resume;
export const publicAppearance=cache(async()=>published<Appearance>("appearance",appearanceDefaults));
export const publicResume=cache(async()=>published<ResumeContent>("resume",resume));
export async function assetDraft(section:"appearance"|"resume"){
 const rows=await query<{content:string|null}>("SELECT COALESCE(draft,published)::text AS content FROM portfolio_content WHERE section=$1",[section]);
 return rows[0]?.content?JSON.parse(rows[0].content):section==="resume"?resume:appearanceDefaults;
}
