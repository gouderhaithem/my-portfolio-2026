import PortfolioInit from "@/components/PortfolioInit";

export default function Home() {
  return (
    <>
      {/* Visually hidden H1 for SEO/accessibility */}
      <h1 className="sr-only">
        Gouder Haithem &mdash; Software Engineer in Algeria
      </h1>

      {/* Background layers */}
      <div id="bg" />
      <canvas id="scene" />
      <div id="grain" />

      {/* Custom cursor */}
      <div id="cursor" />
      <div id="cursor-dot" />
      <div className="trail" />
      <div className="trail" />
      <div className="trail" />
      <div className="trail" />
      <div className="trail" />
      <div className="trail" />
      <div className="trail" />
      <div className="trail" />

      {/* Navigation */}
      <nav className="top">
        <a href="#" className="brand">
          G.H. &middot; &apos;26
        </a>
        <ul id="nav-list">
          <li>
            <a href="#about" data-link="">
              About
            </a>
          </li>
          <li>
            <a href="#services" data-link="">
              Services
            </a>
          </li>
          <li>
            <a href="#work" data-link="">
              Work
            </a>
          </li>
          <li>
            <a href="#skills" data-link="">
              Skills
            </a>
          </li>
          <li>
            <a href="#contact" data-link="">
              Contact
            </a>
          </li>
        </ul>
        <div className="right">
          <span className="status">Available &middot; Q3 2026</span>
        </div>
        <button className="burger" id="burger" aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </nav>

      <main>
        {/* HERO */}
        <section id="hero">
          <div className="meta">
            <span>
              N 36.7&deg;&nbsp; E 3.0&deg;&nbsp; &middot;&nbsp; Algiers
            </span>
            <span>Portfolio / vol. iv</span>
          </div>

          <div id="hero-title" className="display" aria-hidden="true">
            <span className="word">
              <span className="ch">G</span>
              <span className="ch">O</span>
              <span className="ch">U</span>
              <span className="ch">D</span>
              <span className="ch">E</span>
              <span className="ch">R</span>
            </span>
            <span className="ch space">&nbsp;</span>
            <span className="word">
              <span className="ch">H</span>
              <span className="ch">A</span>
              <span className="ch">I</span>
              <span className="ch">T</span>
              <span className="ch">H</span>
              <span className="ch">E</span>
              <span className="ch">M</span>
            </span>
          </div>

          <div className="role">
            <b>Software Engineer.</b>&nbsp;&nbsp;Building websites, CRMs, and
            ERP systems that feel inevitable &mdash; considered interfaces on
            top of solid foundations.
          </div>

          <div className="hero-ctas">
            <a href="#contact" data-link="" className="btn-pill primary">
              <span>Start a project</span>
              <span className="arr">&rarr;</span>
            </a>
            <a href="#services" data-link="" className="btn-pill ghost">
              <span>See services</span>
            </a>
          </div>

          <div className="scroll-cue">
            <span>Scroll</span>
            <span className="line" />
          </div>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div className="grid">
            <div className="copy reveal">
              <span className="eyebrow">01 &mdash; About</span>
              <h2 className="display">
                Four years of <span className="italic">considered</span>
                <br />
                software work.
              </h2>
              <p className="lead">
                I&apos;m a <b>software engineer</b> from Algiers building the
                products that companies actually run on &mdash; marketing sites,
                internal CRMs, and full ERP platforms.
              </p>
              <p className="lead">
                Most of my work lives in a terminal. The rest tries very hard to
                look like it doesn&apos;t, which is where this site comes in.
              </p>
              <div className="stats">
                <div className="stat">
                  <div className="n">4+</div>
                  <div className="l">years building</div>
                </div>
                <div className="stat">
                  <div className="n">Web &middot; CRM &middot; ERP</div>
                  <div className="l">focus areas</div>
                </div>
                <div className="stat">
                  <div className="n">Algiers</div>
                  <div className="l">based &middot; remote</div>
                </div>
              </div>
            </div>
            <div className="vis" />
          </div>
        </section>

        {/* SERVICES */}
        <section id="services">
          <div className="head reveal">
            <div>
              <span className="eyebrow">02 &mdash; Services</span>
              <h2 className="display">
                What I <span className="italic">build</span>.
              </h2>
            </div>
            <div className="note">
              Engagements run 4&ndash;12 weeks. Fixed scope, weekly demos,
              source on day one.
            </div>
          </div>

          <div className="cards">
            <div className="service reveal">
              <div className="top">
                <span className="num">S &middot; 01</span>
                <div className="icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <rect x="3" y="4" width="18" height="14" rx="1.5" />
                    <path d="M3 8h18" />
                    <circle cx="6" cy="6" r="0.6" fill="currentColor" />
                    <circle cx="8.5" cy="6" r="0.6" fill="currentColor" />
                    <path d="M9 21h6" />
                    <path d="M12 18v3" />
                  </svg>
                </div>
              </div>
              <h3>
                Websites <span className="it">&amp; web apps</span>
              </h3>
              <p>
                Marketing sites, product surfaces, and dashboards that load fast
                and look considered. Built on a modern stack with motion, type,
                and content that earn their place.
              </p>
              <ul>
                <li>Next.js &middot; Astro &middot; React</li>
                <li>Headless CMS &middot; i18n</li>
                <li>SEO &middot; Core Web Vitals</li>
                <li>Hosting &amp; CI/CD setup</li>
              </ul>
            </div>

            <div className="service reveal">
              <div className="top">
                <span className="num">S &middot; 02</span>
                <div className="icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                    <circle cx="17" cy="7" r="2" />
                    <path d="M21 14c0-2.2-1.8-4-4-4" />
                  </svg>
                </div>
              </div>
              <h3>
                CRM <span className="it">platforms</span>
              </h3>
              <p>
                Custom customer-relationship systems built around your actual
                sales motion &mdash; pipelines, automations, and reporting that
                beat the off-the-shelf compromise.
              </p>
              <ul>
                <li>Lead pipelines &amp; deal stages</li>
                <li>Email &amp; WhatsApp automations</li>
                <li>Role-based access &middot; audit log</li>
                <li>Integrations: Stripe, Slack, Gmail</li>
              </ul>
            </div>

            <div className="service reveal">
              <div className="top">
                <span className="num">S &middot; 03</span>
                <div className="icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <path d="M10 6.5h4" />
                    <path d="M17.5 10v4" />
                    <path d="M10 17.5h4" />
                    <path d="M6.5 10v4" />
                  </svg>
                </div>
              </div>
              <h3>
                ERP <span className="it">systems</span>
              </h3>
              <p>
                End-to-end operations software &mdash; inventory, accounting,
                HR, and manufacturing modules that share one source of truth
                instead of fighting six spreadsheets.
              </p>
              <ul>
                <li>Inventory &middot; Procurement &middot; Sales</li>
                <li>Accounting &middot; Invoicing &middot; Payroll</li>
                <li>Multi-warehouse &middot; Multi-currency</li>
                <li>Reports, KPIs &amp; forecasting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work">
          <div className="head reveal">
            <div>
              <span className="eyebrow">03 &mdash; Selected Work</span>
              <h2 className="display">
                Three things I <span className="italic">stand behind</span>.
              </h2>
            </div>
            <div className="note">
              A fuller dossier on request. Most recent work is under NDA.
            </div>
          </div>

          <div className="projects">
            {/* Project 001 */}
            <a className="project reveal" href="#" data-link="">
              <div className="num">001</div>
              <div className="body">
                <h3>
                  Halcyon <span className="it">&mdash; query engine</span>
                </h3>
                <div className="meta">
                  Distributed analytical engine for a 4 PB warehouse. Pushes
                  predicates into Parquet at the SSD level; rewrites plans
                  across a 64-node cluster.
                  <span className="outcome">
                    12&times; faster &middot; 600+ daily users
                  </span>
                </div>
              </div>
              <div className="preview" aria-hidden="true">
                <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="hx-bar" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#a78cff" />
                      <stop
                        offset="100%"
                        stopColor="#7c5cff"
                        stopOpacity="0.6"
                      />
                    </linearGradient>
                  </defs>
                  <rect width="600" height="400" fill="#0c0c14" />
                  <g stroke="rgba(245,245,247,0.04)">
                    <path d="M0 100 H600 M0 200 H600 M0 300 H600" />
                    <path d="M150 0 V400 M300 0 V400 M450 0 V400" />
                  </g>
                  <g fill="#5a5a68" fontFamily="monospace" fontSize="11">
                    <circle cx="22" cy="22" r="4" fill="#ff5f57" />
                    <circle cx="38" cy="22" r="4" fill="#febc2e" />
                    <circle cx="54" cy="22" r="4" fill="#28c840" />
                    <text x="80" y="26">
                      halcyon &middot; prod &middot; us-east-1
                    </text>
                  </g>
                  <g fontFamily="monospace">
                    <rect
                      x="22"
                      y="56"
                      width="170"
                      height="74"
                      rx="6"
                      fill="rgba(245,245,247,0.04)"
                      stroke="rgba(245,245,247,0.08)"
                    />
                    <text
                      x="34"
                      y="78"
                      fill="#5a5a68"
                      fontSize="10"
                      letterSpacing="2"
                    >
                      QPS
                    </text>
                    <text
                      x="34"
                      y="112"
                      fill="#f5f5f7"
                      fontFamily="serif"
                      fontSize="34"
                    >
                      1,284
                    </text>
                    <rect
                      x="202"
                      y="56"
                      width="170"
                      height="74"
                      rx="6"
                      fill="rgba(245,245,247,0.04)"
                      stroke="rgba(245,245,247,0.08)"
                    />
                    <text
                      x="214"
                      y="78"
                      fill="#5a5a68"
                      fontSize="10"
                      letterSpacing="2"
                    >
                      P99 (ms)
                    </text>
                    <text
                      x="214"
                      y="112"
                      fill="#f5f5f7"
                      fontFamily="serif"
                      fontSize="34"
                    >
                      92
                    </text>
                    <rect
                      x="382"
                      y="56"
                      width="190"
                      height="74"
                      rx="6"
                      fill="rgba(124,92,255,0.10)"
                      stroke="rgba(124,92,255,0.35)"
                    />
                    <text
                      x="394"
                      y="78"
                      fill="#a78cff"
                      fontSize="10"
                      letterSpacing="2"
                    >
                      SCANNED
                    </text>
                    <text
                      x="394"
                      y="112"
                      fill="#f5f5f7"
                      fontFamily="serif"
                      fontSize="34"
                    >
                      4.2 PB
                    </text>
                  </g>
                  <g>
                    <text
                      x="22"
                      y="172"
                      fill="#5a5a68"
                      fontFamily="monospace"
                      fontSize="10"
                      letterSpacing="2"
                    >
                      QUERY P99 &middot; 24H
                    </text>
                    <g transform="translate(22,190)">
                      <g fill="url(#hx-bar)">
                        <rect x="0" y="120" width="18" height="60" rx="2" />
                        <rect x="22" y="100" width="18" height="80" rx="2" />
                        <rect x="44" y="90" width="18" height="90" rx="2" />
                        <rect x="66" y="70" width="18" height="110" rx="2" />
                        <rect x="88" y="50" width="18" height="130" rx="2" />
                        <rect x="110" y="20" width="18" height="160" rx="2" />
                        <rect x="132" y="40" width="18" height="140" rx="2" />
                        <rect x="154" y="55" width="18" height="125" rx="2" />
                        <rect x="176" y="80" width="18" height="100" rx="2" />
                        <rect x="198" y="90" width="18" height="90" rx="2" />
                        <rect x="220" y="60" width="18" height="120" rx="2" />
                        <rect x="242" y="40" width="18" height="140" rx="2" />
                        <rect x="264" y="30" width="18" height="150" rx="2" />
                        <rect x="286" y="50" width="18" height="130" rx="2" />
                        <rect x="308" y="70" width="18" height="110" rx="2" />
                        <rect x="330" y="85" width="18" height="95" rx="2" />
                        <rect x="352" y="95" width="18" height="85" rx="2" />
                        <rect x="374" y="80" width="18" height="100" rx="2" />
                        <rect x="396" y="55" width="18" height="125" rx="2" />
                        <rect x="418" y="35" width="18" height="145" rx="2" />
                        <rect x="440" y="20" width="18" height="160" rx="2" />
                        <rect x="462" y="40" width="18" height="140" rx="2" />
                        <rect x="484" y="65" width="18" height="115" rx="2" />
                        <rect x="506" y="85" width="18" height="95" rx="2" />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <div className="stack">
                <span>Rust</span>
                <span>gRPC</span>
                <span>Postgres</span>
                <span>K8s</span>
              </div>
            </a>

            {/* Project 002 */}
            <a className="project reveal" href="#" data-link="">
              <div className="num">002</div>
              <div className="body">
                <h3>
                  Driftboard <span className="it">&mdash; realtime canvas</span>
                </h3>
                <div className="meta">
                  A multiplayer design surface &mdash; vector, raster, and 3D
                  primitives sharing one Yjs document. WebGL render pipeline
                  that holds 60 fps with 10k objects on a MacBook Air.
                  <span className="outcome">Acquired &middot; 2024</span>
                </div>
              </div>
              <div className="preview" aria-hidden="true">
                <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
                  <rect width="600" height="400" fill="#0c0c14" />
                  <g fill="rgba(245,245,247,0.06)">
                    <defs>
                      <pattern
                        id="dots"
                        x="0"
                        y="0"
                        width="22"
                        height="22"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="11" cy="11" r="0.9" />
                      </pattern>
                    </defs>
                    <rect width="600" height="400" fill="url(#dots)" />
                  </g>
                  <g>
                    <rect
                      x="22"
                      y="20"
                      width="240"
                      height="40"
                      rx="20"
                      fill="rgba(245,245,247,0.05)"
                      stroke="rgba(245,245,247,0.08)"
                    />
                    <g fill="#9a9aa6" fontFamily="monospace" fontSize="11">
                      <circle
                        cx="42"
                        cy="40"
                        r="6"
                        fill="none"
                        stroke="#9a9aa6"
                      />
                      <rect
                        x="62"
                        y="34"
                        width="12"
                        height="12"
                        fill="none"
                        stroke="#9a9aa6"
                      />
                      <path
                        d="M86 46 L98 30 L110 46 Z"
                        fill="none"
                        stroke="#9a9aa6"
                      />
                      <path
                        d="M124 34 q12 -8 24 0 t24 0"
                        fill="none"
                        stroke="#9a9aa6"
                      />
                      <text x="170" y="44">
                        PEN
                      </text>
                      <text x="210" y="44">
                        TXT
                      </text>
                    </g>
                    <rect
                      x="498"
                      y="20"
                      width="80"
                      height="40"
                      rx="20"
                      fill="#7c5cff"
                    />
                    <text
                      x="514"
                      y="45"
                      fill="#fff"
                      fontFamily="monospace"
                      fontSize="11"
                      letterSpacing="2"
                    >
                      SHARE
                    </text>
                  </g>
                  <g>
                    <rect
                      x="80"
                      y="120"
                      width="160"
                      height="100"
                      rx="6"
                      fill="rgba(124,92,255,0.18)"
                      stroke="#7c5cff"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="380"
                      cy="170"
                      r="60"
                      fill="rgba(74,222,128,0.16)"
                      stroke="#4ade80"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M240 280 Q360 220 500 290"
                      fill="none"
                      stroke="#f5f5f7"
                      strokeWidth="2"
                    />
                    <path
                      d="M150 300 L210 250 L270 320 Z"
                      fill="rgba(245,127,32,0.18)"
                      stroke="#f97316"
                      strokeWidth="1.5"
                    />
                    <text
                      x="100"
                      y="160"
                      fontFamily="serif"
                      fontSize="22"
                      fill="#f5f5f7"
                      fontStyle="italic"
                    >
                      Q3 plan
                    </text>
                  </g>
                  <g>
                    <path
                      d="M270 200 L284 214 L278 220 L294 230 L286 236 L280 226 L270 232 Z"
                      fill="#7c5cff"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <rect
                      x="296"
                      y="218"
                      width="58"
                      height="18"
                      rx="9"
                      fill="#7c5cff"
                    />
                    <text
                      x="305"
                      y="231"
                      fill="#fff"
                      fontFamily="monospace"
                      fontSize="10"
                    >
                      Maya
                    </text>
                    <path
                      d="M440 110 L454 124 L448 130 L464 140 L456 146 L450 136 L440 142 Z"
                      fill="#4ade80"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <rect
                      x="466"
                      y="128"
                      width="46"
                      height="18"
                      rx="9"
                      fill="#4ade80"
                    />
                    <text
                      x="475"
                      y="141"
                      fill="#0c0c14"
                      fontFamily="monospace"
                      fontSize="10"
                    >
                      Sam
                    </text>
                  </g>
                  <g
                    fontFamily="monospace"
                    fontSize="10"
                    fill="#5a5a68"
                    letterSpacing="2"
                  >
                    <text x="22" y="380">
                      FRAME &middot; 12 USERS &middot; 60FPS
                    </text>
                  </g>
                </svg>
              </div>
              <div className="stack">
                <span>TypeScript</span>
                <span>WebGL</span>
                <span>Yjs</span>
                <span>Workers</span>
              </div>
            </a>

            {/* Project 003 */}
            <a className="project reveal" href="#" data-link="">
              <div className="num">003</div>
              <div className="body">
                <h3>
                  Loom <span className="it">&mdash; compiler toolkit</span>
                </h3>
                <div className="meta">
                  Pluggable transformer for low-code platforms. AST-level
                  optimizations and a WASM runtime that pre-warms in 8 ms. Open
                  source, used in production by three Series B startups.
                  <span className="outcome">8.2k stars &middot; MIT</span>
                </div>
              </div>
              <div className="preview" aria-hidden="true">
                <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
                  <rect width="600" height="400" fill="#0c0c14" />
                  <line
                    x1="290"
                    y1="0"
                    x2="290"
                    y2="400"
                    stroke="rgba(245,245,247,0.08)"
                  />
                  <g fontFamily="monospace" fontSize="11">
                    <text x="22" y="34" fill="#5a5a68" letterSpacing="2">
                      src/transform.ts
                    </text>
                    <g fill="#5a5a68">
                      <text x="22" y="62">
                        1
                      </text>
                      <text x="22" y="80">
                        2
                      </text>
                      <text x="22" y="98">
                        3
                      </text>
                      <text x="22" y="116">
                        4
                      </text>
                      <text x="22" y="134">
                        5
                      </text>
                      <text x="22" y="152">
                        6
                      </text>
                    </g>
                    <g>
                      <text x="44" y="62" fill="#a78cff">
                        export
                      </text>
                      <text x="92" y="62" fill="#a78cff">
                        {" "}
                        function
                      </text>
                      <text x="158" y="62" fill="#7cd8ff">
                        {" "}
                        compile
                      </text>
                      <text x="44" y="80" fill="#5a5a68">
                        {" "}
                        // lower &rarr; optimize &rarr; emit
                      </text>
                      <text x="44" y="98" fill="#a78cff">
                        {" "}
                        const
                      </text>
                      <text x="86" y="98" fill="#ffc97a">
                        {" "}
                        ast
                      </text>
                      <text x="116" y="98" fill="#f5f5f7">
                        {" "}
                        ={" "}
                      </text>
                      <text x="138" y="98" fill="#7cd8ff">
                        parse
                      </text>
                      <text x="172" y="98" fill="#f5f5f7">
                        (src);
                      </text>
                      <text x="44" y="116" fill="#a78cff">
                        {" "}
                        const
                      </text>
                      <text x="86" y="116" fill="#ffc97a">
                        {" "}
                        ir
                      </text>
                      <text x="106" y="116" fill="#f5f5f7">
                        {" "}
                        ={" "}
                      </text>
                      <text x="128" y="116" fill="#7cd8ff">
                        lower
                      </text>
                      <text x="162" y="116" fill="#f5f5f7">
                        (ast);
                      </text>
                      <text x="44" y="134" fill="#a78cff">
                        {" "}
                        return
                      </text>
                      <text x="92" y="134" fill="#7cd8ff">
                        {" "}
                        emit
                      </text>
                      <text x="124" y="134" fill="#f5f5f7">
                        (optimize(ir));
                      </text>
                      <text x="44" y="152" fill="#f5f5f7">
                        {"}"}
                      </text>
                      <text x="44" y="180" fill="#5a5a68">
                        // pre-warm: 8ms
                      </text>
                      <text x="44" y="198" fill="#5a5a68">
                        // targets: wasm32-wasi
                      </text>
                    </g>
                    <rect x="218" y="124" width="1" height="14" fill="#7c5cff">
                      <animate
                        attributeName="opacity"
                        values="1;0;1"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  </g>
                  <g fontFamily="monospace" fontSize="10">
                    <text x="310" y="34" fill="#5a5a68" letterSpacing="2">
                      AST &middot; post-lower
                    </text>
                    <g stroke="rgba(245,245,247,0.18)" fill="none">
                      <path d="M450 64 L380 110" />
                      <path d="M450 64 L520 110" />
                      <path d="M380 110 L340 170" />
                      <path d="M380 110 L420 170" />
                      <path d="M520 110 L490 170" />
                      <path d="M520 110 L560 170" />
                      <path d="M340 170 L320 240" />
                      <path d="M340 170 L370 240" />
                      <path d="M420 170 L410 240" />
                      <path d="M420 170 L440 240" />
                      <path d="M490 170 L480 240" />
                      <path d="M560 170 L555 240" />
                    </g>
                    <g>
                      <circle cx="450" cy="60" r="14" fill="#7c5cff" />
                      <text x="437" y="64" fill="#fff">
                        Mod
                      </text>
                      <circle
                        cx="380"
                        cy="110"
                        r="11"
                        fill="rgba(124,92,255,0.25)"
                        stroke="#7c5cff"
                      />
                      <text x="370" y="114" fill="#f5f5f7">
                        Fn
                      </text>
                      <circle
                        cx="520"
                        cy="110"
                        r="11"
                        fill="rgba(124,92,255,0.25)"
                        stroke="#7c5cff"
                      />
                      <text x="510" y="114" fill="#f5f5f7">
                        Fn
                      </text>
                      <circle
                        cx="340"
                        cy="170"
                        r="9"
                        fill="rgba(245,245,247,0.08)"
                        stroke="rgba(245,245,247,0.30)"
                      />
                      <text x="333" y="174" fill="#9a9aa6">
                        If
                      </text>
                      <circle
                        cx="420"
                        cy="170"
                        r="9"
                        fill="rgba(245,245,247,0.08)"
                        stroke="rgba(245,245,247,0.30)"
                      />
                      <text x="412" y="174" fill="#9a9aa6">
                        Op
                      </text>
                      <circle
                        cx="490"
                        cy="170"
                        r="9"
                        fill="rgba(245,245,247,0.08)"
                        stroke="rgba(245,245,247,0.30)"
                      />
                      <text x="480" y="174" fill="#9a9aa6">
                        Ret
                      </text>
                      <circle
                        cx="560"
                        cy="170"
                        r="9"
                        fill="rgba(245,245,247,0.08)"
                        stroke="rgba(245,245,247,0.30)"
                      />
                      <text x="551" y="174" fill="#9a9aa6">
                        Lit
                      </text>
                      <circle cx="320" cy="240" r="6" fill="#4ade80" />
                      <circle cx="370" cy="240" r="6" fill="#4ade80" />
                      <circle cx="410" cy="240" r="6" fill="#4ade80" />
                      <circle cx="440" cy="240" r="6" fill="#4ade80" />
                      <circle cx="480" cy="240" r="6" fill="#4ade80" />
                      <circle cx="555" cy="240" r="6" fill="#4ade80" />
                    </g>
                    <g>
                      <rect
                        x="320"
                        y="320"
                        width="240"
                        height="36"
                        rx="6"
                        fill="rgba(74,222,128,0.10)"
                        stroke="rgba(74,222,128,0.35)"
                      />
                      <text
                        x="334"
                        y="343"
                        fill="#4ade80"
                        fontSize="11"
                        letterSpacing="2"
                      >
                        WASM &middot; 142 KB &middot; COLD 8ms
                      </text>
                    </g>
                  </g>
                </svg>
              </div>
              <div className="stack">
                <span>TypeScript</span>
                <span>WASM</span>
                <span>AST</span>
                <span>Bun</span>
              </div>
            </a>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <div className="head reveal">
            <span className="eyebrow">04 &mdash; Toolkit</span>
            <h2 className="display">
              The <span className="italic">constellation</span>.
            </h2>
          </div>
          <div className="grid">
            <div className="copy reveal">
              <p>
                Each node is a tool I reach for without thinking. Connections
                mark the combinations I actually ship in production &mdash; not
                the r&eacute;sum&eacute; kind.
              </p>
              <div className="cats">
                <div data-cat="Languages">
                  <div className="k">Languages</div>
                  <div className="v">
                    TypeScript &middot; C# &middot; Python &middot; PHP &middot;
                    JavaScript
                  </div>
                </div>
                <div data-cat="Backend">
                  <div className="k">Backend</div>
                  <div className="v">
                    Node.js &middot; NestJS &middot; Laravel &middot; Django
                    &middot; .NET
                  </div>
                </div>
                <div data-cat="Infra">
                  <div className="k">Infra</div>
                  <div className="v">
                    Docker &middot; Jenkins &middot; Postgres &middot; Redis
                    &middot; Firebase
                  </div>
                </div>
                <div data-cat="Interface">
                  <div className="k">Interface</div>
                  <div className="v">
                    React &middot; Next.js &middot; Astro &middot; WebRTC
                    &middot; Motion
                  </div>
                </div>
              </div>
            </div>
            <div className="vis reveal">
              <div className="skillviz" id="skillviz" data-style="orbit">
                <svg
                  className="sv-lines"
                  viewBox="0 0 1000 1000"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                />
                <div className="sv-core" id="sv-core">
                  <span className="sv-core-cat">toolkit</span>
                  <span className="sv-core-mark">&#8984;</span>
                  <span className="sv-core-count" id="sv-core-count">
                    19 tools
                  </span>
                </div>
                <div className="sv-nodes" id="sv-nodes" />
                <div className="sv-readout" id="sv-readout" aria-live="polite" />
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <span className="eyebrow reveal" style={{ justifyContent: "center" }}>
            05 &mdash; Contact
          </span>
          <h2 className="lets reveal">
            Let&apos;s <span className="talk">talk.</span>
          </h2>
          <p className="sub reveal">
            I take on a few projects a quarter &mdash; web platforms, CRM, and
            ERP work, occasionally a more ambitious interface. Tell me what
            you&apos;re building.
          </p>

          <form className="contact-form reveal" id="contact-form" noValidate>
            <div className="row">
              <div className="field">
                <label htmlFor="f-name">Your name</label>
                <input
                  id="f-name"
                  name="name"
                  type="text"
                  placeholder="full name"
                  autoComplete="name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="f-email">Email</label>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label htmlFor="f-type-trigger">Project type</label>
                <div className="dd" data-name="type" id="f-type">
                  <button
                    type="button"
                    className="dd-trigger"
                    id="f-type-trigger"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                  >
                    <span className="dd-value" data-placeholder="Pick one">
                      Pick one
                    </span>
                    <span className="dd-caret" aria-hidden="true">
                      <svg viewBox="0 0 12 8" width="12" height="8">
                        <path
                          d="M1 1L6 6L11 1"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          fill="none"
                        />
                      </svg>
                    </span>
                  </button>
                  <ul className="dd-menu" role="listbox">
                    <li data-val="website" role="option">
                      <span className="dd-icon">&#9634;</span>
                      <span>Website / web app</span>
                    </li>
                    <li data-val="crm" role="option">
                      <span className="dd-icon">&#9651;</span>
                      <span>CRM platform</span>
                    </li>
                    <li data-val="erp" role="option">
                      <span className="dd-icon">&#9671;</span>
                      <span>ERP system</span>
                    </li>
                    <li data-val="other" role="option">
                      <span className="dd-icon">&middot;</span>
                      <span>Something else</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="field">
                <label htmlFor="f-budget-trigger">Budget (DA)</label>
                <div className="dd" data-name="budget" id="f-budget">
                  <button
                    type="button"
                    className="dd-trigger"
                    id="f-budget-trigger"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                  >
                    <span className="dd-value" data-placeholder="Optional">
                      Optional
                    </span>
                    <span className="dd-caret" aria-hidden="true">
                      <svg viewBox="0 0 12 8" width="12" height="8">
                        <path
                          d="M1 1L6 6L11 1"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          fill="none"
                        />
                      </svg>
                    </span>
                  </button>
                  <ul className="dd-menu" role="listbox">
                    <li data-val="<100k" role="option">
                      <span className="dd-icon">&middot;</span>
                      <span>Under 100,000 DA</span>
                    </li>
                    <li data-val="100-500k" role="option">
                      <span className="dd-icon">&middot;&middot;</span>
                      <span>100k &mdash; 500k DA</span>
                    </li>
                    <li data-val="500k-1.5m" role="option">
                      <span className="dd-icon">&middot;&middot;&middot;</span>
                      <span>500k &mdash; 1.5M DA</span>
                    </li>
                    <li data-val="1.5m+" role="option">
                      <span className="dd-icon">
                        &middot;&middot;&middot;&middot;
                      </span>
                      <span>1.5M+ DA</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-msg">Tell me about it</label>
              <textarea
                id="f-msg"
                name="message"
                rows={4}
                placeholder="What are you building, and what's the deadline?"
                required
              />
            </div>
            <div className="form-status" id="f-status" aria-live="polite" />
            <div className="submit-row">
              <span className="form-note">
                Reply within 12h &middot; NDA on request
              </span>
              <button className="send-btn" type="submit">
                <span>Send message</span>
                <span className="arr">&rarr;</span>
              </button>
            </div>
          </form>

          <div className="divider-or reveal">
            <span>Or reach out directly</span>
          </div>

          <div className="cta reveal">
            <a className="mail" href="mailto:gouderhaithem@gmail.com">
              gouderhaithem@gmail.com
            </a>
            <div className="socials">
              <a
                href="https://github.com/gouderhaithem"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub &nearr;
              </a>
              <a
                href="https://dz.linkedin.com/in/gouder-h-689164244"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn &nearr;
              </a>
              <a href="mailto:gouderhaithem@gmail.com">Email &nearr;</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>&copy; 2026 &middot; Gouder Haithem</span>
        <span className="big">Built in a terminal, finished by hand.</span>
        <span>Algiers &middot; Remote</span>
      </footer>

      {/* Tweaks panel */}
      <div id="tweaks">
        <h4>
          <span>Tweaks</span>
          <span className="x" id="tweaks-close">
            &#10005;
          </span>
        </h4>

        <div className="row">
          <label>Accent</label>
          <div className="swatches" id="tk-accent">
            <div
              className="swatch on"
              data-val="#7c5cff"
              style={{ background: "#7c5cff" }}
            />
            <div
              className="swatch"
              data-val="#0071e3"
              style={{ background: "#0071e3" }}
            />
            <div
              className="swatch"
              data-val="#f97316"
              style={{ background: "#f97316" }}
            />
            <div
              className="swatch"
              data-val="#4ade80"
              style={{ background: "#4ade80" }}
            />
          </div>
        </div>

        <div className="row">
          <label>Hero object</label>
          <div className="seg" id="tk-shape">
            <button className="on" data-val="icosahedron">
              Gem
            </button>
            <button data-val="torus">Knot</button>
            <button data-val="dodecahedron">Dodeca</button>
          </div>
        </div>

        <div className="row">
          <label>Grain</label>
          <input
            id="tk-grain"
            type="range"
            min="0"
            max="0.18"
            step="0.01"
            defaultValue="0.06"
          />
        </div>

        <div className="row">
          <label>Particle density</label>
          <input
            id="tk-particles"
            type="range"
            min="800"
            max="6000"
            step="200"
            defaultValue="3200"
          />
        </div>

        <div className="row">
          <label>Motion intensity</label>
          <div className="seg" id="tk-motion">
            <button data-val="0.5">Calm</button>
            <button className="on" data-val="1">
              Default
            </button>
            <button data-val="1.5">Wild</button>
          </div>
        </div>
      </div>

      {/* Loading veil */}
      <div id="veil">
        <div className="v-inner">
          <span>Compiling scene</span>
          <div className="bar" />
        </div>
      </div>

      {/* Client-side Three.js / GSAP / Lenis init */}
      <PortfolioInit />
    </>
  );
}
