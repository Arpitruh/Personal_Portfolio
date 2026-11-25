import Image from "next/image";
import { PixelAvatar } from "@/components/pixel-landscape";
import {publicAppearance} from "@/lib/asset-content";

export type PortraitVariant = "home" | "about" | "life";
export async function PersonalPortrait({variant}: {variant:PortraitVariant}) {
  const {portrait,illustration}=await publicAppearance();
  const primary=variant==="about"?portrait||illustration:illustration||portrait;
  const secondary=variant==="life"&&portrait&&illustration&&portrait.src!==illustration.src?
    (primary===portrait?illustration:portrait):null;
  return <div className={"personal-portrait personal-portrait-"+variant}>
    <div className="personal-portrait-stage">
      {primary?<Image src={primary.src} unoptimized={primary.src.startsWith("/api/media/")} alt={primary.alt} fill sizes={variant==="home"?"(max-width: 700px) 180px, 270px":"(max-width: 750px) 95vw, 470px"} className="personal-portrait-image" priority={variant==="home"}/>:
        <div className="personal-portrait-placeholder"><PixelAvatar large/><span aria-hidden="true" className="personal-sparkle">✦</span></div>}
      <span className="personal-portrait-stamp">PLAYER 01 / ARPIT</span>
    </div>
    {secondary && <div className="personal-portrait-inset"><Image src={secondary.src} unoptimized={secondary.src.startsWith("/api/media/")} alt={secondary.alt} fill sizes="170px" className="personal-portrait-image"/></div>}
    {primary?.caption && variant!=="home" && <p className="personal-portrait-caption">{primary.caption}</p>}
  </div>;
}
