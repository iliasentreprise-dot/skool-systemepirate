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
        <span>📊</span> Progression <span className="si-prog">0%</span>
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
  { num: "Module 1", title: "Présentation du système PIRATE", pct: 0, img: module1 },
  { num: "Module 2", title: "L'Offre Irrésistible", pct: 0, img: module2 },
  { num: "Module 3", title: "Créer ton produit digital", pct: 0, img: module3 },
  { num: "Module 4", title: "Le Tunnel de vente Pirate", pct: 0, img: module4 },
  { num: "Module 5", title: "Stratégie Carrousels PIRATE", pct: 0, img: module5 },
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
        <p>Vendre des produits digitaux sur TikTok en automatique · Sans visage · Sans audience · Sans montage</p>
      </div>
      <div className="progress-global">
        <span className="pg-label">Progression globale</span>
        <div className="pg-bar-wrap">
          <div className="pg-bar" style={{ width: "0%" }} />
        </div>
        <span className="pg-pct">0%</span>
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

  // Load profile (for presence + author display)
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

      // cleanup attached via active flag below
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

  // Load posts + realtime
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

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#6b4fa0",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 14,
          marginTop: 28,
        }}
      >
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

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#6b4fa0",
          textTransform: "uppercase",
          letterSpacing: 1,
          margin: "20px 0 14px",
        }}
      >
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
            position: "fixed",
            inset: 0,
            background: "rgba(5, 1, 14, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "zoom-out",
            padding: 24,
          }}
        >
          <img
            src={lightbox}
            alt=""
            style={{
              maxWidth: "92vw",
              maxHeight: "92vh",
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
              {c.image_url && <img src={c.image_url} alt="" className="comment-image" loading="lazy" />}
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
