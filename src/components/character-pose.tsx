import Image from "next/image";
import {publicAppearance} from "@/lib/asset-content";

export type CharacterPoseName = "standing"|"sitting"|"coding"|"casual";

/** Displays the selected approved pose, never a guessed or unapproved image. */
export async function CharacterPose({pose,priority=false}: {pose:CharacterPoseName;priority?:boolean}) {
  const asset=(await publicAppearance())[pose];
  if(!asset) return null;
  return <figure className={"character-pose character-pose-"+pose}>
    <div className="character-pose-art">
      <Image src={asset.src} unoptimized={asset.src.startsWith("/api/media/")} alt={asset.alt} fill
        sizes="(max-width: 700px) 85vw, (max-width: 1100px) 38vw, 460px"
        priority={priority} className="character-pose-image" />
    </div>
    {asset.caption && <figcaption className="character-pose-caption">{asset.caption}</figcaption>}
  </figure>;
}
