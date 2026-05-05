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
          "Formation DropDigital — Vendre des produits digitaux sur TikTok en automatique, sans visage, sans audience, sans montage.",
      },
      { property: "og:title", content: "DropDigital — Système Pirate" },
      {
        property: "og:description",
        content:
          "Formation DropDigital — Vendre des produits digitaux sur TikTok en automatique, sans visage, sans audience, sans montage.",
      },
    ],
  }),
  component: DropDigitalPage,
});

type TabKey = "modules" | "groupe" | "coaching" | "resultats" | "profil" | "parametres";

function DropDigitalPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<TabKey>("modules");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("dd-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("dd-theme", theme);
  }, [theme]);

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0e0418", color: "#c4a3f0", fontFamily: "-apple-system, sans-serif" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div className={`dd-root ${theme === "light" ? "dd-light" : ""}`}>
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
          {tab === "profil" && <ProfilTab />}
          {tab === "parametres" && <ParametresTab theme={theme} setTheme={setTheme} />}
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
      <div
        className={`sidebar-item ${tab === "profil" ? "active" : ""}`}
        onClick={() => setTab("profil")}
        style={{ cursor: "pointer" }}
      >
        <span>👤</span> Profil
      </div>
      <div className="sidebar-item">
        <span>📊</span> Progression <span className="si-prog">0%</span>
      </div>
      <div
        className={`sidebar-item ${tab === "parametres" ? "active" : ""}`}
        onClick={() => setTab("parametres")}
        style={{ cursor: "pointer" }}
      >
        <span className="gear-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </span>
        Paramètres
      </div>
      <div className="sidebar-item" onClick={() => { void supabase.auth.signOut().then(() => window.location.assign("/login")); }} style={{ cursor: "pointer" }}>
        <span>🚪</span> Déconnexion
      </div>
    </div>
  );
}

// ============================================================
// MODULE STRUCTURE
// ============================================================

type ModuleItem = {
  num: string;
  title: string;
  pct: number;
  img: string;
  badge?: string;
  badgeColor?: string;
};

// MODULE INTRO MINDSET
const moduleMindset: ModuleItem = {
  num: "🧠 MODULE INTRO",
  title: "La mentalité d'un entrepreneur à +20k/mois",
  pct: 0,
  img: module1,
};

// JOUR 1 — Fondations & Setup
const modulesJour1: ModuleItem[] = [
  { num: "Jour 1 · 1", title: "Préparer son compte TikTok", pct: 0, img: module2, badge: "NEW", badgeColor: "#a855f7" },
  { num: "Jour 1 · 2", title: "L'Offre Irrésistible", pct: 0, img: module3 },
  { num: "Jour 1 · 3", title: "Créer ton produit digital", pct: 0, img: module4 },
];

// JOUR 2 — Construction
const modulesJour2: ModuleItem[] = [
  { num: "Jour 2 · 1", title: "Le Tunnel de vente Pirate", pct: 0, img: module5 },
  { num: "Jour 2 · 2", title: "Stratégie Carrousels PIRATE", pct: 0, img: module6 },
];

// JOUR 3 — Vente & Lancement
const modulesJour3: ModuleItem[] = [
  { num: "Jour 3 · 1", title: "Les Lives TikTok", pct: 0, img: module7 },
  { num: "Jour 3 · 2", title: "Closer en DM avec une méthode interdite", pct: 0, img: module2, badge: "NEW", badgeColor: "#ef4444" },
  { num: "Jour 3 · 3", title: "🧲 LeadMagnet ULTIME", pct: 0, img: module3, badge: "NEW", badgeColor: "#ef4444" },
];

// MODULES BONUS
const modulesBonus: ModuleItem[] = [
  { num: "🎁 BONUS · 1", title: "La puissance de l'emailing", pct: 0, img: module5, badge: "NEW", badgeColor: "#f59e0b" },
  { num: "🎁 BONUS · 2", title: "Comment déclarer", pct: 0, img: module6 },
];

// BONUS ULTIME (2 cartes)
const modulesUltime: ModuleItem[] = [
  { num: "⚡ MODULE SECRET", title: "L'OUTIL d'automatisation TikTok SECRET", pct: 0, img: module7, badge: "EXCLUSIF", badgeColor: "#f59e0b" },
  { num: "🚀 MODULE EXCLUSIF", title: "Logiciel de BOOST d'abonnés ULTIME", pct: 0, img: module1, badge: "EXCLUSIF", badgeColor: "#f59e0b" },
];

// All modules flat for lightbox navigation
const allModules: ModuleItem[] = [
  moduleMindset,
  ...modulesJour1,
  ...modulesJour2,
  ...modulesJour3,
  ...modulesBonus,
  ...modulesUltime,
];

// ============================================================
// MODULES TAB
// ============================================================

function ModulesTab() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      else if (e.key === "ArrowRight") setLightboxIdx((i) => (i === null ? i : (i + 1) % allModules.length));
      else if (e.key === "ArrowLeft") setLightboxIdx((i) => (i === null ? i : (i - 1 + allModules.length) % allModules.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIdx]);

  const current = lightboxIdx !== null ? allModules[lightboxIdx] : null;

  // Helper to get flat index for a module
  const flatIdx = (m: ModuleItem) => allModules.findIndex((x) => x === m);

  const renderCard = (m: ModuleItem, idx: number) => (
    <div className="module-card" key={m.num + m.title}>
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
        {m.badge && (
          <span style={{
            position: "absolute", top: 8, right: 8,
            background: m.badgeColor || "#a855f7",
            color: "#fff", fontSize: 10, fontWeight: 800,
            padding: "3px 8px", borderRadius: 4, letterSpacing: 0.5,
          }}>{m.badge}</span>
        )}
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
  );

  return (
    <div className="tab-content active">
      <div className="section-header">
        <h1>🏴 Système Pirate — Ma Formation</h1>
        <p>Vendre des produits digitaux sur TikTok en automatique · Sans visage · Sans audience · Sans montage</p>
      </div>

      <div className="progress-global">
        <span className="pg-label">Progression globale</span>
        <div className="pg-bar-wrap">
          <div className="pg-bar" style={{ width: "0%" }} />
        </div>
        <span className="pg-pct">0%</span>
      </div>

      {/* ===== MODULE INTRO MINDSET ===== */}
      <div className="day-section mindset-section">
        <div className="day-header mindset-header">
          <div className="day-badge mindset-badge">🧠 COMMENCER ICI</div>
          <div className="day-title">La mentalité d'un entrepreneur à +20k/mois</div>
          <div className="day-sub">Présentation du système PIRATE · Mindset · Motivation</div>
        </div>
        <div className="modules-grid modules-grid-1">
          {renderCard(moduleMindset, flatIdx(moduleMindset))}
        </div>
      </div>

      {/* ===== JOUR 1 ===== */}
      <div className="day-section">
        <div className="day-header">
          <div className="day-badge" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>JOUR 1</div>
          <div className="day-title">Fondations & Setup</div>
          <div className="day-sub">Prépare ton compte · Crée ton offre · Lance ton produit</div>
          <div className="day-progress-bar">
            <div className="day-progress-fill" style={{ width: "0%" }} />
          </div>
        </div>
        <div className="modules-grid">
          {modulesJour1.map((m) => renderCard(m, flatIdx(m)))}
        </div>
      </div>

      {/* ===== JOUR 2 ===== */}
      <div className="day-section">
        <div className="day-header">
          <div className="day-badge" style={{ background: "linear-gradient(135deg,#0891b2,#06b6d4)" }}>JOUR 2</div>
          <div className="day-title">Construction</div>
          <div className="day-sub">Tunnel de vente · Stratégie Carrousels · Automatisation</div>
          <div className="day-progress-bar">
            <div className="day-progress-fill" style={{ width: "0%", background: "linear-gradient(90deg,#0891b2,#06b6d4)" }} />
          </div>
        </div>
        <div className="modules-grid">
          {modulesJour2.map((m) => renderCard(m, flatIdx(m)))}
        </div>
      </div>

      {/* ===== JOUR 3 ===== */}
      <div className="day-section">
        <div className="day-header">
          <div className="day-badge" style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>JOUR 3</div>
          <div className="day-title">Vente & Lancement</div>
          <div className="day-sub">Lives TikTok · Closer en DM · LeadMagnet · Retargeting</div>
          <div className="day-progress-bar">
            <div className="day-progress-fill" style={{ width: "0%", background: "linear-gradient(90deg,#059669,#10b981)" }} />
          </div>
        </div>
        <div className="modules-grid">
          {modulesJour3.map((m) => renderCard(m, flatIdx(m)))}
        </div>
      </div>

      {/* ===== MODULES BONUS ===== */}
      <div className="day-section">
        <div className="day-header">
          <div className="day-badge" style={{ background: "linear-gradient(135deg,#d97706,#f59e0b)" }}>🎁 MODULES BONUS</div>
          <div className="day-title">Bonus</div>
          <div className="day-sub">Optimisation · Emailing · Déclaration</div>
        </div>
        <div className="modules-grid">
          {modulesBonus.map((m) => renderCard(m, flatIdx(m)))}
        </div>
      </div>

      {/* ===== BONUS ULTIME ===== */}
      <div className="bonus-ultime-section">
        <div className="bonus-ultime-header">
          <div className="bonus-ultime-crown">👑</div>
          <div className="bonus-ultime-title">BONUS ULTIME</div>
          <div className="bonus-ultime-sub">Accès exclusif aux outils secrets qui font tourner le système en automatique</div>
          <div className="bonus-ultime-shine" aria-hidden="true" />
        </div>
        <div className="modules-grid bonus-ultime-grid">
          {modulesUltime.map((m, i) => (
            <div className="module-card bonus-ultime-card" key={m.num + m.title}>
              <div
                className="module-thumb"
                onClick={() => setLightboxIdx(flatIdx(m))}
                style={{ cursor: "zoom-in", position: "relative" }}
              >
                <img
                  src={m.img}
                  alt={m.title}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4)" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 32 }}>🔒</span>
                  <span style={{ fontSize: 12, color: "#fbbf24", fontWeight: 800, letterSpacing: 1 }}>ACCÈS RÉSERVÉ</span>
                </div>
              </div>
              <div className="module-info" style={{ background: "linear-gradient(180deg,rgba(251,191,36,0.08),transparent)" }}>
                <div className="module-num" style={{ color: "#fbbf24" }}>{m.num}</div>
                <div className="module-title" style={{ color: "#fff" }}>{m.title}</div>
                <div className="prog-wrap">
                  <div className="prog-bar-bg">
                    <div className="prog-bar-fill" style={{ width: "0%", background: "linear-gradient(90deg,#d97706,#fbbf24)" }} />
                  </div>
                  <span className="prog-pct" style={{ color: "#fbbf24" }}>🔒</span>
                </div>
              </div>
              {/* Gold shimmer border */}
              <div className="bonus-ultime-card-glow" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== CTA ===== */}
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

      {/* LIGHTBOX */}
      {current && lightboxIdx !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIdx(null)}>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((i) => (i === null ? i : (i - 1 + allModules.length) % allModules.length));
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
              setLightboxIdx((i) => (i === null ? i : (i + 1) % allModules.length));
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

// ============================================================
// GROUPE TAB (unchanged)
// ============================================================

type OnlineMember = {
  user_id: string;
  username: string;
  initials: string;
  color: string;
};

type PostRow = {
  id: string;
  user_id: string;
  body: string;
  image_url: string | null;
  created_at: string;
  author?: { username: string | null; full_name: string | null } | null;
};

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  image_url: string | null;
  created_at: string;
  author?: { username: string | null; full_name: string | null } | null;
};

const AVATAR_COLORS = ["#7c3aed", "#0891b2", "#be185d", "#b45309", "#065f46", "#4c1d95", "#0e7490", "#9d174d"];

function colorFromId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function displayName(profile?: { username: string | null; full_name: string | null } | null, fallback = "Pirate") {
  return profile?.full_name?.trim() || profile?.username?.trim() || fallback;
}

function timeAgo(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

function GroupeTab() {
  const { user } = useAuth();
  const [online, setOnline] = useState<OnlineMember[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [comments, setComments] = useState<Record<string, CommentRow[]>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [postBody, setPostBody] = useState("");
  const [postFile, setPostFile] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      const name = displayName(prof, user.email?.split("@")[0] || "Pirate");

      const channel = supabase.channel("groupe-presence", {
        config: { presence: { key: user.id } },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState<{ user_id: string; username: string }>();
          const map = new Map<string, OnlineMember>();
          for (const key of Object.keys(state)) {
            const meta = state[key][0];
            if (!meta) continue;
            map.set(meta.user_id, {
              user_id: meta.user_id,
              username: meta.username,
              initials: initialsFromName(meta.username),
              color: colorFromId(meta.user_id),
            });
          }
          setOnline(Array.from(map.values()));
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({ user_id: user.id, username: name });
          }
        });

      (window as unknown as { __ddPresenceChannel?: ReturnType<typeof supabase.channel> }).__ddPresenceChannel = channel;
    })();

    return () => {
      active = false;
      const w = window as unknown as { __ddPresenceChannel?: ReturnType<typeof supabase.channel> };
      if (w.__ddPresenceChannel) {
        void supabase.removeChannel(w.__ddPresenceChannel);
        w.__ddPresenceChannel = undefined;
      }
    };
  }, [user]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("id, user_id, body, image_url, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!data) return;
    const ids = Array.from(new Set(data.map((p) => p.user_id)));
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
    const map = new Map((profs || []).map((p) => [p.id, p] as const));
    setPosts(data.map((p) => ({ ...p, author: map.get(p.user_id) || null })));
  };

  useEffect(() => {
    void loadPosts();
    const ch = supabase
      .channel("posts-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        void loadPosts();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, (payload) => {
        const row = (payload.new || payload.old) as CommentRow | undefined;
        if (row?.post_id) void loadComments(row.post_id);
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, []);

  const loadComments = async (postId: string) => {
    const { data } = await supabase
      .from("comments")
      .select("id, post_id, user_id, body, image_url, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (!data) return;
    const ids = Array.from(new Set(data.map((c) => c.user_id)));
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
    const map = new Map((profs || []).map((p) => [p.id, p] as const));
    setComments((prev) => ({
      ...prev,
      [postId]: data.map((c) => ({ ...c, author: map.get(c.user_id) || null })),
    }));
  };

  const toggleComments = (postId: string) => {
    setOpenComments((prev) => {
      const next = { ...prev, [postId]: !prev[postId] };
      if (next[postId] && !comments[postId]) void loadComments(postId);
      return next;
    });
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage.from("post-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (upErr) {
      setError(upErr.message);
      return null;
    }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const submitPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || posting) return;
    const body = postBody.trim();
    if (!body) return;
    setPosting(true);
    setError(null);
    let image_url: string | null = null;
    if (postFile) {
      if (postFile.size > 5 * 1024 * 1024) {
        setError("Image trop lourde (max 5 Mo).");
        setPosting(false);
        return;
      }
      image_url = await uploadImage(postFile);
      if (image_url === null && postFile) {
        setPosting(false);
        return;
      }
    }
    const { error: insErr } = await supabase
      .from("posts")
      .insert({ user_id: user.id, body: body.slice(0, 2000), image_url });
    if (insErr) setError(insErr.message);
    else {
      setPostBody("");
      setPostFile(null);
    }
    setPosting(false);
  };

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
      <div style={{ fontSize: 13, fontWeight: 700, color: "#6b4fa0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
        Membres en ligne ({Math.max(online.length, user ? 1 : 0)})
      </div>
      <div className="members-grid">
        {online.length === 0 && user && (
          <div className="member-card">
            <div className="member-avatar" style={{ background: colorFromId(user.id) }}>
              {initialsFromName(user.email?.split("@")[0] || "Pirate")}
            </div>
            <div className="member-name">Toi</div>
            <div className="member-status">
              <span className="online-dot" />
              En ligne
            </div>
          </div>
        )}
        {online.map((m) => (
          <div className="member-card" key={m.user_id}>
            <div className="member-avatar" style={{ background: m.color }}>
              {m.initials}
            </div>
            <div className="member-name">{m.user_id === user?.id ? "Toi" : m.username}</div>
            <div className="member-status">
              <span className="online-dot" />
              En ligne
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: "#6b4fa0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, marginTop: 28 }}>
        Publier un post
      </div>
      <form className="composer" onSubmit={submitPost}>
        <textarea
          className="composer-input"
          placeholder="Partage ton résultat, ta question, ta victoire…"
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
          maxLength={2000}
          rows={3}
          required
        />
        <div className="composer-actions">
          <label className="composer-file">
            📷 {postFile ? postFile.name.slice(0, 24) : "Ajouter une image"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPostFile(e.target.files?.[0] ?? null)
              }
            />
          </label>
          {postFile && (
            <button type="button" className="composer-clear" onClick={() => setPostFile(null)}>
              ✕
            </button>
          )}
          <button type="submit" className="composer-submit" disabled={posting || !postBody.trim()}>
            {posting ? "Publication…" : "Publier"}
          </button>
        </div>
        {error && <div className="composer-error">{error}</div>}
      </form>

      <div style={{ fontSize: 13, fontWeight: 700, color: "#6b4fa0", textTransform: "uppercase", letterSpacing: 1, margin: "20px 0 14px" }}>
        Derniers posts
      </div>
      {posts.length === 0 && (
        <div style={{ color: "#7c5c9a", fontSize: 14, padding: "20px 0" }}>
          Aucun post pour le moment. Sois le premier à publier !
        </div>
      )}
      {posts.map((p) => {
        const name = displayName(p.author, "Pirate");
        return (
          <div className="feed-card" key={p.id}>
            <div className="feed-header">
              <div className="feed-avatar" style={{ background: colorFromId(p.user_id) }}>
                {initialsFromName(name)}
              </div>
              <div>
                <div className="feed-meta">{name}</div>
                <div className="feed-time">{timeAgo(p.created_at)}</div>
              </div>
            </div>
            <div className="feed-body">{p.body}</div>
            {p.image_url && (
              <img
                src={p.image_url}
                alt=""
                className="feed-image"
                loading="lazy"
                onClick={() => setLightbox(p.image_url!)}
                style={{ cursor: "zoom-in" }}
              />
            )}
            <div className="feed-reactions">
              <button className="reaction reaction-btn" onClick={() => toggleComments(p.id)}>
                💬 {comments[p.id]?.length ?? 0} commentaire{(comments[p.id]?.length ?? 0) > 1 ? "s" : ""}
              </button>
            </div>
            {openComments[p.id] && (
              <CommentSection
                postId={p.id}
                items={comments[p.id] || []}
                onPosted={() => loadComments(p.id)}
                uploadImage={uploadImage}
                onImageClick={(url) => setLightbox(url)}
              />
            )}
          </div>
        );
      })}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(5, 1, 14, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, cursor: "zoom-out", padding: 24,
          }}
        >
          <img
            src={lightbox}
            alt=""
            style={{
              maxWidth: "92vw", maxHeight: "92vh",
              borderRadius: 12,
              boxShadow: "0 20px 60px -10px rgba(168,85,247,0.5)",
              border: "1px solid rgba(168,85,247,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
}

function CommentSection({
  postId,
  items,
  onPosted,
  uploadImage,
  onImageClick,
}: {
  postId: string;
  items: CommentRow[];
  onPosted: () => void;
  uploadImage: (f: File) => Promise<string | null>;
  onImageClick: (url: string) => void;
}) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;
    const text = body.trim();
    if (!text) return;
    setLoading(true);
    setErr(null);
    let image_url: string | null = null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErr("Image trop lourde (max 5 Mo).");
        setLoading(false);
        return;
      }
      image_url = await uploadImage(file);
      if (!image_url) {
        setLoading(false);
        return;
      }
    }
    const { error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: user.id, body: text.slice(0, 1000), image_url });
    if (error) setErr(error.message);
    else {
      setBody("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onPosted();
    }
    setLoading(false);
  };

  return (
    <div className="comments">
      {items.map((c) => {
        const name = displayName(c.author, "Pirate");
        return (
          <div className="comment" key={c.id}>
            <div className="comment-avatar" style={{ background: colorFromId(c.user_id) }}>
              {initialsFromName(name)}
            </div>
            <div className="comment-body">
              <div className="comment-head">
                <span className="comment-name">{name}</span>
                <span className="comment-time">{timeAgo(c.created_at)}</span>
              </div>
              <div className="comment-text">{c.body}</div>
              {c.image_url && (
                <img
                  src={c.image_url}
                  alt=""
                  className="comment-image"
                  loading="lazy"
                  onClick={() => onImageClick(c.image_url!)}
                />
              )}
            </div>
          </div>
        );
      })}
      <form className="comment-form" onSubmit={submit}>
        <input
          className="comment-input"
          placeholder="Écris un commentaire…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
        />
        <label className="comment-file" title="Joindre une image">
          📷
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button type="submit" className="comment-submit" disabled={loading || !body.trim()}>
          {loading ? "…" : "Envoyer"}
        </button>
      </form>
      {file && <div className="comment-file-name">📎 {file.name}</div>}
      {err && <div className="composer-error">{err}</div>}
    </div>
  );
}

// ============================================================
// COACHING TAB (unchanged)
// ============================================================

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
        <h3>🚀 Passer au niveau supérieur</h3>
        <div style={{ fontSize: 14, color: "#d8c4f5", lineHeight: 1.6 }}>
          Si tu as atteint les 3000€/mois avec les produits digitaux automatisés, réserve un appel pour recevoir un accompagnement one on one pour scaler tes boutiques à 30k€ par mois.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RESULTATS TAB (unchanged)
// ============================================================

const stats = [
  { n: "37", l: "Pirates formés" },
  { n: "21", l: "Premières ventes" },
  { n: "12k€", l: "Générés ce mois" },
  { n: "4.9⭐", l: "Note moyenne" },
];

const results = [
  {
    i: "CR", c: "#7c3aed", name: "Camille R.", sub: "Ebook bien-être · Lyon",
    amount: "3 200€ / mois", desc: "Partie de zéro, aucune audience. Ses carrousels TikTok tournent en continu. Résultat atteint en 8 semaines.",
  },
  {
    i: "MB", c: "#0891b2", name: "Maxime B.", sub: "Formation finance · Paris",
    amount: "7 800€ / mois", desc: "Mini-formation budgeting vendue 47€. Il poste 3 carrousels par semaine, sans montrer son visage.",
  },
  {
    i: "NK", c: "#be185d", name: "Noémie K.", sub: "Ebook recettes · Bordeaux",
    amount: "1 450€ / mois", desc: "Première vente en 4 jours. Ebook à 19€ vendu en automatique grâce au tunnel pirate.",
  },
  {
    i: "YD", c: "#b45309", name: "Yacine D.", sub: "Formation productivité · Lille",
    amount: "12 300€ / mois", desc: "A utilisé l'outil d'automatisation TikTok SECRET. Ses vidéos tournent H24 sans intervention.",
  },
  {
    i: "LP", c: "#065f46", name: "Laura P.", sub: "Coaching mindset · Nice",
    amount: "5 600€ / mois", desc: "Lancée sans budget pub. Tunnel de vente créé en 1 weekend, premières ventes dès le lundi.",
  },
  {
    i: "AR", c: "#4c1d95", name: "Antoine R.", sub: "Outil SaaS · Marseille",
    amount: "28 000€ / mois", desc: "A créé un outil digital vendu 97€/mois en récurrent. Le Système Pirate lui a permis de scaler sans pub.",
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
              <div className="result-avatar" style={{ background: r.c }}>{r.i}</div>
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

// ============================================================
// PROFIL TAB (unchanged)
// ============================================================

type ProfileData = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  show_progression: boolean;
  username_changed: boolean;
};

function ProfilTab() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [showProg, setShowProg] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio, show_progression, username_changed")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setProfile(data as ProfileData);
        setBio(data.bio || "");
        setShowProg(data.show_progression ?? true);
      }
      setLoading(false);
    })();
  }, [user]);

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 3 * 1024 * 1024) { setErr("Image trop lourde (max 3 Mo)."); return; }
    setUploading(true); setErr(null);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { setErr(upErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = data.publicUrl;
    const { error: updErr } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
    if (updErr) setErr(updErr.message);
    else {
      setProfile((p) => (p ? { ...p, avatar_url: url } : p));
      setMsg("Photo de profil mise à jour ✓");
      setTimeout(() => setMsg(null), 2500);
    }
    setUploading(false);
  };

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSaving(true); setErr(null); setMsg(null);
    const { error } = await supabase
      .from("profiles")
      .update({ bio: bio.slice(0, 500), show_progression: showProg })
      .eq("id", user.id);
    if (error) setErr(error.message);
    else { setMsg("Profil sauvegardé ✓"); setTimeout(() => setMsg(null), 2500); }
    setSaving(false);
  };

  if (loading) {
    return <div className="tab-content active"><div style={{ color: "#9a7dbd" }}>Chargement…</div></div>;
  }

  const name = displayName(profile, user?.email?.split("@")[0] || "Pirate");

  return (
    <div className="tab-content active">
      <div className="section-header">
        <h1>👤 Mon Profil</h1>
        <p>Gère ta photo, ta bio et la visibilité de ta progression</p>
      </div>
      <div className="profile-card">
        <div className="profile-avatar-wrap">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-fallback" style={{ background: colorFromId(user!.id) }}>
              {initialsFromName(name)}
            </div>
          )}
          <label className="profile-avatar-edit">
            {uploading ? "…" : "📷 Changer"}
            <input type="file" accept="image/*" hidden onChange={onAvatarChange} disabled={uploading} />
          </label>
        </div>
        <div className="profile-info">
          <div className="profile-name">{name}</div>
          <div className="profile-email">{user?.email}</div>
        </div>
      </div>
      <form className="profile-form" onSubmit={saveProfile}>
        <label className="profile-label">
          Bio
          <textarea
            className="profile-textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Parle un peu de toi, ton business, tes objectifs…"
          />
          <span className="profile-counter">{bio.length}/500</span>
        </label>
        <label className="profile-toggle">
          <span>
            <strong>Afficher ma progression</strong>
            <span className="profile-hint">Si activé, les autres pirates peuvent voir ta progression dans la formation</span>
          </span>
          <input type="checkbox" checked={showProg} onChange={(e) => setShowProg(e.target.checked)} />
        </label>
        {showProg && (
          <div className="profile-progression">
            <div className="pg-label">Ma progression globale</div>
            <div className="pg-bar-wrap" style={{ marginTop: 8 }}>
              <div className="pg-bar" style={{ width: "0%" }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#9a7dbd" }}>0% — Continue, pirate ! 🏴‍☠️</div>
          </div>
        )}
        <div className="profile-actions">
          <button type="submit" className="profile-save" disabled={saving}>
            {saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
          {msg && <span className="profile-msg">{msg}</span>}
          {err && <span className="profile-err">{err}</span>}
        </div>
      </form>
    </div>
  );
}

// ============================================================
// PARAMETRES TAB (unchanged)
// ============================================================

function ParametresTab({ theme, setTheme }: { theme: "dark" | "light"; setTheme: (t: "dark" | "light") => void }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [username, setUsername] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<string | null>(null);
  const [nameErr, setNameErr] = useState<string | null>(null);

  type Notifs = { live: boolean; posts: boolean; replies: boolean; dm: boolean };
  const [notifs, setNotifs] = useState<Notifs>(() => {
    if (typeof window === "undefined") return { live: true, posts: true, replies: true, dm: true };
    try {
      return JSON.parse(localStorage.getItem("dd-notifs") || '{"live":true,"posts":true,"replies":true,"dm":true}') as Notifs;
    } catch {
      return { live: true, posts: true, replies: true, dm: true };
    }
  });
  useEffect(() => {
    localStorage.setItem("dd-notifs", JSON.stringify(notifs));
  }, [notifs]);

  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio, show_progression, username_changed")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setProfile(data as ProfileData);
        setUsername(data.username || "");
      }
    })();
  }, [user]);

  const saveUsername = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    if (profile.username_changed) {
      setNameErr("Tu as déjà modifié ton pseudo une fois. Contacte l'admin pour le changer.");
      return;
    }
    const next = username.trim();
    if (!next || next === profile.username) return;
    setSavingName(true); setNameErr(null); setNameMsg(null);
    await supabase.from("username_history").insert({
      user_id: user.id, old_username: profile.username, new_username: next,
    });
    const { error } = await supabase
      .from("profiles")
      .update({ username: next, username_changed: true })
      .eq("id", user.id);
    if (error) setNameErr(error.message);
    else {
      setProfile({ ...profile, username: next, username_changed: true });
      setNameMsg("Pseudo modifié ✓ (dernière modification possible)");
    }
    setSavingName(false);
  };

  const changeEmail = async (e: FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);
    if (!newEmail.trim()) return;
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) setEmailMsg("Erreur : " + error.message);
    else setEmailMsg("Email de confirmation envoyé à la nouvelle adresse ✓");
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (newPass.length < 6) { setPassMsg("Mot de passe trop court (min 6 caractères)"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) setPassMsg("Erreur : " + error.message);
    else { setPassMsg("Mot de passe mis à jour ✓"); setNewPass(""); }
  };

  const notifItems: { key: keyof Notifs; label: string; desc: string }[] = [
    { key: "live", label: "Notifications lives", desc: "Quand un live démarre" },
    { key: "posts", label: "Nouveaux posts", desc: "Posts publiés dans le groupe privé" },
    { key: "replies", label: "Réponses commentaires", desc: "Quelqu'un répond à ton commentaire" },
    { key: "dm", label: "Messages privés", desc: "Nouveaux messages directs" },
  ];

  return (
    <div className="tab-content active">
      <div className="section-header">
        <h1>⚙️ Paramètres</h1>
        <p>Gère ton compte, tes notifications et ton expérience</p>
      </div>

      <div className="settings-section">
        <h2 className="settings-h2">👤 1. Compte</h2>
        <p className="settings-sub">Le classique, mais propre.</p>
        <form onSubmit={saveUsername} className="settings-row">
          <label className="settings-label">
            Nom / pseudo {profile?.username_changed && <span className="settings-badge-warn">verrouillé</span>}
            <span className="settings-hint">Modifiable une seule fois.</span>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <input className="settings-input" value={username} onChange={(e) => setUsername(e.target.value)} disabled={profile?.username_changed} maxLength={32} />
              <button className="settings-save" type="submit" disabled={savingName || profile?.username_changed || username.trim() === (profile?.username || "")}>
                {savingName ? "…" : "Modifier"}
              </button>
            </div>
            {nameMsg && <span className="profile-msg">{nameMsg}</span>}
            {nameErr && <span className="profile-err">{nameErr}</span>}
          </label>
        </form>
        <form onSubmit={changeEmail} className="settings-row">
          <label className="settings-label">
            Email
            <span className="settings-hint">Actuel : {user?.email}</span>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <input className="settings-input" type="email" placeholder="nouvel-email@exemple.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              <button className="settings-save" type="submit" disabled={!newEmail.trim()}>Changer</button>
            </div>
            {emailMsg && <span className="profile-msg">{emailMsg}</span>}
          </label>
        </form>
        <form onSubmit={changePassword} className="settings-row">
          <label className="settings-label">
            Mot de passe
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <input className="settings-input" type="password" placeholder="Nouveau mot de passe" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              <button className="settings-save" type="submit" disabled={!newPass}>Modifier</button>
            </div>
            {passMsg && <span className="profile-msg">{passMsg}</span>}
          </label>
        </form>
      </div>

      <div className="settings-section">
        <h2 className="settings-h2">🔔 2. Notifications</h2>
        <p className="settings-sub">Choisis ce que tu veux recevoir.</p>
        {notifItems.map((n) => (
          <label key={n.key} className="profile-toggle">
            <span>
              <strong>{n.label}</strong>
              <span className="profile-hint">{n.desc}</span>
            </span>
            <input type="checkbox" checked={notifs[n.key]} onChange={(e) => setNotifs({ ...notifs, [n.key]: e.target.checked })} />
          </label>
        ))}
      </div>

      <div className="settings-section">
        <h2 className="settings-h2">🎯 3. Expérience utilisateur</h2>
        <p className="settings-sub">Là tu te démarques vraiment.</p>
        <div className="settings-row">
          <div className="settings-label">
            <strong>Mode sombre / clair</strong>
            <span className="settings-hint">Change l'apparence de toute l'application</span>
            <div className="theme-toggle">
              <button type="button" className={`theme-btn ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>🌙 Sombre</button>
              <button type="button" className={`theme-btn ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")}>☀️ Clair</button>
            </div>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-label">
            <strong>Langue</strong>
            <span className="settings-hint">Plus de langues bientôt disponibles</span>
            <select className="settings-input" disabled style={{ marginTop: 6, maxWidth: 240 }}>
              <option>🇫🇷 Français</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
