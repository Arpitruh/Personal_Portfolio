import {query,published} from "./portfolio-db";
import type {GalleryMoment} from "@/data/personal";
export const categories=["Travel Diaries","Through My Lens","Creative Corner","Memory Vault"] as const;
export type LibraryEntry=GalleryMoment&{id:string;visible:boolean};
export async function publicLibrary(fallback:GalleryMoment[]){
 const entries=await published<LibraryEntry[]>("library",[]);
 return [...fallback,...entries.filter(x=>x.visible).map(({src,alt,title,category,featured,caption})=>({src,alt,title,category,featured,caption}))];
}
export async function libraryDraft(){
 const rows=await query<{content:string}>("SELECT COALESCE(draft,published,'[]'::jsonb)::text AS content FROM portfolio_content WHERE section='library'");
 return JSON.parse(rows[0]?.content??"[]") as LibraryEntry[];
}
