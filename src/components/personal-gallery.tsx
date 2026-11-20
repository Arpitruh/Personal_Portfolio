import Image from "next/image";
import {visualIdentity} from "@/data/personal";

export function PersonalGallery() {
  const moments=visualIdentity.moments;
  return <section className="inner-section personal-gallery" id="moments" aria-labelledby="moments-heading">
    <div className="section-intro"><div><span className="eyebrow">MOMENTS / A VISUAL JOURNAL</span><h2 id="moments-heading">Little <em>moments.</em></h2><p>A small collection of personal memories and creative observations—only the ones I choose to share.</p></div></div>
    {moments.length>0?
      <div className="personal-gallery-grid">{moments.map((moment,index)=><figure key={moment.src+"-"+index} className={"personal-gallery-card"+(moment.featured?" gallery-featured":"")}>
        <div className="personal-gallery-photo"><Image src={moment.src} alt={moment.alt} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 32vw" /></div>
        <figcaption><span className="eyebrow">{moment.category}</span><h3>{moment.title}</h3>{moment.caption&&<p>{moment.caption}</p>}</figcaption>
      </figure>)}</div>:
      <div className="personal-gallery-empty"><span className="personal-gallery-placeholder" aria-hidden="true">▧</span><div><h3>Photos stay personal until I choose to share them.</h3><p>This gallery is ready for approved uploads. There are no fabricated memories, stock portraits or unapproved photos.</p></div></div>}
  </section>;
}
