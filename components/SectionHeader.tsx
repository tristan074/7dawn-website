import { ReactNode } from "react";

export default function SectionHeader({
  idx,
  kicker,
  title,
  lead,
}: {
  idx: string;
  kicker: string;
  title: ReactNode;
  lead: string;
}) {
  return (
    <div className="sec-head">
      <div className="meta">
        <span className="kicker">{kicker}</span>
        <span className="idx">{idx}</span>
      </div>
      <div>
        <h2>{title}</h2>
        <p className="lead">{lead}</p>
      </div>
    </div>
  );
}
