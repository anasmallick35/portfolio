import { PROFILE as P } from "@/data/profile";

export default function Sheet01Title() {
  return (
    <section id="s01" className="sheet">
      <span className="stamp">
        <i /> ISSUED FOR REVIEW &nbsp;·&nbsp; BENGALURU &nbsp;·&nbsp; 2026
      </span>
      <h1>MD ANAS</h1>
      <p className="lede">
        Software engineer. I build large product interfaces that stay fast under real traffic, and I
        build the AI coding-agent infrastructure — skills, MCP servers, subagents, fleets of parallel
        containers — that makes shipping them faster. These sheets document both.
      </p>
      <div className="tb">
        <div><div className="k">ROLE</div><div className="v">{P.role}</div></div>
        <div><div className="k">CURRENT COMPANY</div><div className="v">{P.company}</div></div>
        <div><div className="k">FROM</div><div className="v">{P.from} <em>· {P.tenure}</em></div></div>
        <div><div className="k">BASED IN</div><div className="v">{P.location}</div></div>
        <div><div className="k">FOCUS</div><div className="v">{P.focus} <em>· {P.focusNote}</em></div></div>
        <div>
          <div className="k">EMAIL <em>↗</em></div>
          <div className="v"><a href={`mailto:${P.email}`}>{P.email}</a></div>
        </div>
        <div><div className="k">PHONE</div><div className="v"><a href={P.phoneHref}>{P.phone}</a></div></div>
        <div>
          <div className="k">GITHUB <em>↗</em></div>
          <div className="v"><a href={P.githubUrl} target="_blank" rel="noopener noreferrer">{P.github}</a></div>
        </div>
        <div>
          <div className="k">LINKEDIN <em>↗</em></div>
          <div className="v"><a href={P.linkedinUrl} target="_blank" rel="noopener noreferrer">{P.linkedin}</a></div>
        </div>
        <div><div className="k">SHEETS</div><div className="v">{P.sheets}</div></div>
      </div>
    </section>
  );
}
