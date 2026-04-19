import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import "../styles/dropdigital.css";
import logo from "@/assets/logo.png";
import module1 from "@/assets/module-1.png";
import module2 from "@/assets/module-2.png";
import module3 from "@/assets/module-3.png";
import module4 from "@/assets/module-4.png";
import module5 from "@/assets/module-5.png";
import module6 from "@/assets/module-6.png";
import module7 from "@/assets/module-7.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DropDigital — Système Pirate" },
      {
        name: "description",
        content:
          "Formation DropDigital — Vendre des produits digitaux sur TikTok, sans visage, sans audience, sans budget pub.",
      },
      { property: "og:title", content: "DropDigital — Système Pirate" },
      {
        property: "og:description",
        content:
          "Formation DropDigital — Vendre des produits digitaux sur TikTok, sans visage, sans audience, sans budget pub.",
      },
    ],
  }),
  component: DropDigitalPage,
});

type TabKey = "modules" | "groupe" | "coaching" | "resultats";

function DropDigitalPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<TabKey>("modules");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0e0418", color: "#c4a3f0", fontFamily: "-apple-system, sans-serif" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div className="dd-root">
      <div className="topbar">
        <div className="logo-wrap">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          <div className="logo-icon" aria-hidden="true">
            <img src={logo} alt="DropDigital" />
          </div>
          <div className="logo-text">
            Drop<span>Digital</span>
          </div>
        </div>
        <div className="price-pill">
          <span className="live-dot" />
          <span>Offre Live uniquement</span>
          <span className="old-price">697€</span>
          <span className="new-price">97€</span>
          <span className="badge-red">-600€</span>
        </div>
        <div style={{ fontSize: 13, color: "#7c5c9a" }}>Bonjour, Pirate 🏴‍☠️</div>
      </div>

      <div className="layout">
        <Sidebar tab={tab} setTab={setTab} open={sidebarOpen} />

        <div className="main">
          <div className="tabs-bar">
            <TabBtn current={tab} value="modules" setTab={setTab}>📚 Modules</TabBtn>
            <TabBtn current={tab} value="groupe" setTab={setTab}>🏴 Groupe Privé</TabBtn>
            <TabBtn current={tab} value="coaching" setTab={setTab}>🎯 Coaching</TabBtn>
            <TabBtn current={tab} value="resultats" setTab={setTab}>🏆 Résultats Élèves</TabBtn>
          </div>

          {tab === "modules" && <ModulesTab />}
          {tab === "groupe" && <GroupeTab />}
          {tab === "coaching" && <CoachingTab />}
          {tab === "resultats" && <ResultatsTab />}
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  current,
  value,
  setTab,
  children,
}: {
  current: TabKey;
  value: TabKey;
  setTab: (t: TabKey) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`tab-btn ${current === value ? "active" : ""}`}
      onClick={() => setTab(value)}
    >
      {children}
    </button>
  );
}

function Sidebar({ tab, setTab, open }: { tab: TabKey; setTab: (t: TabKey) => void; open: boolean }) {
  const item = (key: TabKey, icon: string, label: string, prog?: string) => (
    <div
      className={`sidebar-item ${tab === key ? "active" : ""}`}
      onClick={() => setTab(key)}
    >
      <span>{icon}</span> {label}
      {prog && <span className="si-prog">{prog}</span>}
    </div>
  );
  return (
    <div className={`sidebar ${open ? "" : "closed"}`}>
      <div className="sidebar-title">Ma Formation</div>
      {item("modules", "📚", "Modules", "6")}
      {item("groupe", "🏴", "Groupe Privé")}
      {item("coaching", "🎯", "Coaching")}
      {item("resultats", "🏆", "Résultats Élèves")}
      <div className="sidebar-divider" />
      <div className="sidebar-title">Compte</div>
      <div className="sidebar-item">
        <span>📊</span> Progression <span className="si-prog">48%</span>
      </div>
      <div className="sidebar-item">
        <span>⚙</span> Paramètres
      </div>
      <div className="sidebar-item" onClick={() => { void supabase.auth.signOut().then(() => window.location.assign("/login")); }} style={{ cursor: "pointer" }}>
        <span>🚪</span> Déconnexion
      </div>
    </div>
  );
}

const modules = [
  { num: "Module 1", title: "Présentation du système PIRATE", pct: 100, img: module1 },
  { num: "Module 2", title: "L'Offre Irrésistible", pct: 82, img: module2 },
  { num: "Module 3", title: "Créer ton produit digital", pct: 37, img: module3 },
  { num: "Module 4", title: "Le Tunnel de vente Pirate", pct: 61, img: module4 },
  { num: "Module 5", title: "Stratégie Carrousels PIRATE", pct: 15, img: module5 },
  { num: "Module 6", title: "Les Lives TikTok", pct: 0, img: module7 },
  { num: "Module 7 — 🔒 SECRET", title: "L'OUTIL d'automatisation TikTok SECRET", pct: 0, img: module6 },
];

function ModulesTab() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      else if (e.key === "ArrowRight") setLightboxIdx((i) => (i === null ? i : (i + 1) % modules.length));
      else if (e.key === "ArrowLeft") setLightboxIdx((i) => (i === null ? i : (i - 1 + modules.length) % modules.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIdx]);

  const current = lightboxIdx !== null ? modules[lightboxIdx] : null;

  return (
    <div className="tab-content active">
      <div className="section-header">
        <h1>🏴 Système Pirate — Ma Formation</h1>
        <p>Vendre des produits digitaux sur TikTok · Sans visage · Sans audience · Sans budget pub</p>
      </div>
      <div className="progress-global">
        <span className="pg-label">Progression globale</span>
        <div className="pg-bar-wrap">
          <div className="pg-bar" />
        </div>
        <span className="pg-pct">48%</span>
      </div>
      <div className="modules-grid">
        {modules.map((m, idx) => (
          <div className="module-card" key={m.num}>
            <div
              className="module-thumb"
              onClick={() => setLightboxIdx(idx)}
              style={{ cursor: "zoom-in" }}
            >
              <img
                src={m.img}
                alt={m.title}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="play-btn" />
            </div>
            <div className="module-info">
              <div className="module-num">{m.num}</div>
              <div className="module-title">{m.title}</div>
              <div className="prog-wrap">
                <div className="prog-bar-bg">
                  <div className="prog-bar-fill" style={{ width: `${m.pct}%` }} />
                </div>
                <span className="prog-pct">{m.pct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cta-section">
        <div className="cta-text">
          <h2>🏴 Offre Live — Disparaît à la fin du live</h2>
          <p>Accès à la formation complète + tous les bonus · Garanti ou remboursé</p>
        </div>
        <div className="cta-prices">
          <span className="old">697€</span>
          <span className="new">97€</span>
          <span className="badge">-600€ CE LIVE UNIQUEMENT</span>
        </div>
        <button className="cta-btn">Réserver mon accès →</button>
      </div>

      {current && lightboxIdx !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIdx(null)}>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((i) => (i === null ? i : (i - 1 + modules.length) % modules.length));
            }}
            aria-label="Précédent"
          >
            ‹
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={current.img} alt={current.title} className="lightbox-img" />
            <div className="lightbox-caption">
              <div className="lightbox-num">{current.num}</div>
              <div className="lightbox-title">{current.title}</div>
            </div>
            <button className="lightbox-watch" onClick={(e) => e.stopPropagation()}>
              <span className="lightbox-watch-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Regarder
            </button>
          </div>
          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((i) => (i === null ? i : (i + 1) % modules.length));
            }}
            aria-label="Suivant"
          >
            ›
          </button>
          <button
            className="lightbox-close"
            onClick={() => setLightboxIdx(null)}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

const members = [
  { i: "TM", n: "Thomas M.", c: "#7c3aed", on: true },
  { i: "SL", n: "Sarah L.", c: "#0891b2", on: true },
  { i: "JR", n: "Jules R.", c: "#be185d", on: true },
  { i: "AM", n: "Amina B.", c: "#b45309", on: false },
];

const posts = [
  {
    i: "TM",
    c: "#7c3aed",
    n: "Thomas M.",
    t: "il y a 12 min",
      body:
      "Première vente ce matin grâce au carrousel pirate ! 47€ en dormant 🔥 La méthode fonctionne vraiment, j'ai posté hier soir et ce matin la notif était là.",
    r: [],
  },
  {
    i: "SL",
    c: "#0891b2",
    n: "Sarah L.",
    t: "il y a 1h",
    body:
      "Question : vous trouvez vos visuels où ? J'utilise Canva ou je génère tout avec l'outil de la formation à la place ?",
    r: ["🔥 1"],
  },
  {
    i: "ME",
    c: "#be185d",
    n: "Mohamed E.",
    t: "il y a 3h",
    body:
      "1 200€ ce mois-ci avec un outil qui génère de faux abonnés tiktok. Je suis entré dans la formation il y a 6 semaines. Continuez les pirates, ça marche 🏴",
    r: ["🔥 3"],
  },
];

function GroupeTab() {
  return (
    <div className="tab-content active">
      <div className="section-header">
        <h1>🏴 Groupe Privé Pirates</h1>
        <p>Partage, entraide et motivation entre membres de la communauté</p>
      </div>
      <div className="group-hero">
        <h2>Rejoins le Discord Officiel DropDigital</h2>
        <p>+37 pirates actifs · Entraide quotidienne · Partage de résultats · Accès direct au formateur</p>
        <button className="discord-btn">🎮 Rejoindre le Discord</button>
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#6b4fa0",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 14,
        }}
      >
        Membres en ligne
      </div>
      <div className="members-grid">
        {members.map((m) => (
          <div className="member-card" key={m.n}>
            <div className="member-avatar" style={{ background: m.c }}>
              {m.i}
            </div>
            <div className="member-name">{m.n}</div>
            <div className="member-status" style={!m.on ? { color: "#6b4fa0" } : undefined}>
              {m.on ? (
                <>
                  <span className="online-dot" />
                  En ligne
                </>
              ) : (
                "Hors ligne"
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#6b4fa0",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 14,
        }}
      >
        Derniers posts
      </div>
      {posts.map((p, idx) => (
        <div className="feed-card" key={idx}>
          <div className="feed-header">
            <div className="feed-avatar" style={{ background: p.c }}>
              {p.i}
            </div>
            <div>
              <div className="feed-meta">{p.n}</div>
              <div className="feed-time">{p.t}</div>
            </div>
          </div>
          <div className="feed-body">{p.body}</div>
          <div className="feed-reactions">
            {p.r.map((r) => (
              <span className="reaction" key={r}>
                {r}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const coachings = [
  {
    tag: "🔴 LIVE À 21H",
    tagClass: "tag-live",
    title: "Q&A Post-Formation — Tes questions en direct",
    date: "Aujourd'hui · 19h00 → 20h30",
    btn: "Rejoindre le live →",
    btnClass: "btn-purple",
    featured: true,
  },
  {
    tag: "📅 PROCHAIN",
    tagClass: "tag-next",
    title: "Audit de ta page de vente en direct",
    date: "Mardi 22 Avril · 18h00",
    btn: "S'inscrire gratuitement",
    btnClass: "btn-outline",
  },
  {
    tag: "📼 REPLAY",
    tagClass: "tag-replay",
    title: "Coaching #3 — Trouver sa niche gagnante",
    date: "14 Avril 2026 · 1h42",
    btn: "Regarder le replay",
    btnClass: "btn-outline",
  },
  {
    tag: "📼 REPLAY",
    tagClass: "tag-replay",
    title: "Coaching #2 — Créer son tunnel en 1h",
    date: "7 Avril 2026 · 2h05",
    btn: "Regarder le replay",
    btnClass: "btn-outline",
  },
];

const slots = [
  { d: "Lundi 21 Avril", t: "10h00", taken: false },
  { d: "Lundi 21 Avril", t: "14h00", taken: true },
  { d: "Mardi 22 Avril", t: "11h00", taken: false },
  { d: "Mardi 22 Avril", t: "16h00", taken: true },
  { d: "Jeudi 24 Avril", t: "10h00", taken: false },
  { d: "Vendredi 25 Avril", t: "15h00", taken: false },
];

function CoachingTab() {
  return (
    <div className="tab-content active">
      <div className="section-header">
        <h1>🎯 Coaching Personnalisé</h1>
        <p>Accès direct au formateur · Sessions live & replays · Réservation de créneaux privés</p>
      </div>
      <div className="coaching-grid">
        {coachings.map((c) => (
          <div className={`coaching-card ${c.featured ? "featured" : ""}`} key={c.title}>
            <span className={`coaching-tag ${c.tagClass}`}>{c.tag}</span>
            <div className="coaching-title">{c.title}</div>
            <div className="coaching-date">{c.date}</div>
            <button className={`coaching-btn ${c.btnClass}`}>{c.btn}</button>
          </div>
        ))}
      </div>
      <div className="booking-section">
        <h3>📞 Réserver un appel stratégique privé (30 min)</h3>
        <div style={{ fontSize: 13, color: "#9a7dbd", marginBottom: 16 }}>
          Places limitées · Formateur disponible sur ces créneaux
        </div>
        <div className="slots-grid">
          {slots.map((s, i) => (
            <div className={`slot ${s.taken ? "taken" : ""}`} key={i}>
              <div className="slot-day">{s.d}</div>
              <div className="slot-time">{s.t}</div>
              <div className="slot-avail" style={s.taken ? { color: "#ef4444" } : undefined}>
                {s.taken ? "Complet" : "Disponible"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const stats = [
  { n: "37", l: "Pirates formés" },
  { n: "21", l: "Premières ventes" },
  { n: "12k€", l: "Générés ce mois" },
  { n: "4.9⭐", l: "Note moyenne" },
];

const results = [
  {
    i: "CR",
    c: "#7c3aed",
    name: "Camille R.",
    sub: "Ebook bien-être · Lyon",
    amount: "3 200€ / mois",
    desc: "Partie de zéro, aucune audience. Ses carrousels TikTok tournent en continu. Résultat atteint en 8 semaines.",
  },
  {
    i: "MB",
    c: "#0891b2",
    name: "Maxime B.",
    sub: "Formation finance · Paris",
    amount: "7 800€ / mois",
    desc: "Mini-formation budgeting vendue 47€. Il poste 3 carrousels par semaine, sans montrer son visage.",
  },
  {
    i: "NK",
    c: "#be185d",
    name: "Noémie K.",
    sub: "Ebook recettes · Bordeaux",
    amount: "1 450€ / mois",
    desc: "Première vente en 4 jours. Ebook à 19€ vendu en automatique grâce au tunnel pirate.",
  },
  {
    i: "YD",
    c: "#b45309",
    name: "Yacine D.",
    sub: "Formation productivité · Lille",
    amount: "12 300€ / mois",
    desc: "A utilisé l'outil d'automatisation TikTok SECRET. Ses vidéos tournent H24 sans intervention.",
  },
  {
    i: "LP",
    c: "#065f46",
    name: "Laura P.",
    sub: "Coaching mindset · Nice",
    amount: "5 600€ / mois",
    desc: "Lancée sans budget pub. Tunnel de vente créé en 1 weekend, premières ventes dès le lundi.",
  },
  {
    i: "AR",
    c: "#4c1d95",
    name: "Antoine R.",
    sub: "Outil SaaS · Marseille",
    amount: "28 000€ / mois",
    desc: "A créé un outil digital vendu 97€/mois en récurrent. Le Système Pirate lui a permis de scaler sans pub.",
  },
];

function ResultatsTab() {
  return (
    <div className="tab-content active">
      <div className="section-header">
        <h1>🏆 Résultats de nos Pirates</h1>
        <p>Des vraies personnes, de vrais résultats · Sans montrer leur visage</p>
      </div>
      <div className="results-stats">
        {stats.map((s) => (
          <div className="stat-card" key={s.l}>
            <div className="stat-num">{s.n}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="results-grid">
        {results.map((r) => (
          <div className="result-card" key={r.name}>
            <div className="result-header">
              <div className="result-avatar" style={{ background: r.c }}>
                {r.i}
              </div>
              <div>
                <div className="result-name">{r.name}</div>
                <div className="result-sub">{r.sub}</div>
              </div>
            </div>
            <div className="result-body">
              <div className="result-amount">{r.amount}</div>
              <div className="result-desc">{r.desc}</div>
              <span className="result-badge">✓ Vérifié</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
