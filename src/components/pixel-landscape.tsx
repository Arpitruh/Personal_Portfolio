export function PixelLandscape({ compact = false }: { compact?: boolean }) {
  return <div className={"pixel-landscape" + (compact ? " pixel-landscape-compact" : "")} aria-hidden="true">
    <div className="sky-stars"><i /><i /><i /><i /><i /></div>
    <div className="cloud cloud-one"><span /><span /><span /></div>
    <div className="cloud cloud-two"><span /><span /><span /></div>
    <div className="sun-disc" />
    <div className="hill hill-one" /><div className="hill hill-two" /><div className="hill hill-three" />
    <div className="question-block">?</div><div className="coin coin-one" /><div className="coin coin-two" />
    <div className="pixel-pipe"><i /></div>
    <div className="ground-top" /><div className="ground-soil" />
  </div>;
}

export function PixelAvatar({ large = false }: { large?: boolean }) {
  return <span className={"pixel-avatar" + (large ? " pixel-avatar-large" : "")} role="img" aria-label="Pixel character wearing a teal cap and orange shirt">
    <span className="avatar-hat" /><span className="avatar-hat-brim" /><span className="avatar-face" /><span className="avatar-eyes" /><span className="avatar-shirt" /><span className="avatar-arm avatar-arm-left" /><span className="avatar-arm avatar-arm-right" /><span className="avatar-pants" /><span className="avatar-boot avatar-boot-left" /><span className="avatar-boot avatar-boot-right" />
  </span>;
}
