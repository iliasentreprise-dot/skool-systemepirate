import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import "../styles/player.css";

export const Route = createFileRoute("/module/$moduleId")({
  component: ModulePage,
});

type Module = {
  id: string;
  title: string;
  description: string;
  section: string;
  position: number;
  thumbnail_url: string | null;
  badge: string | null;
  badge_color: string | null;
};

type Chapter = {
  id: string;
  module_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_seconds: number;
  position: number;
};

function isDirectVideo(url: string) {
  return /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url);
}

function toEmbedUrl(url: string): string {
  if (!url.trim()) return "";
  if (isDirectVideo(url)) return url;
  if (url.includes("/embed/") || url.includes("player.vimeo.com")) return url;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

function ModulePage() {
  const { moduleId } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [module, setModule] = useState<Module | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [validating, setValidating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  // Upload state (admin only — "bientôt disponible" drop zone)
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showTitleForm, setShowTitleForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add chapter from sidebar (admin only)
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterVideoUrl, setNewChapterVideoUrl] = useState("");
  const [addingChapter, setAddingChapter] = useState(false);
  const [addingChapterUploading, setAddingChapterUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || !moduleId) return;
    setDataLoading(true);
    (async () => {
      const [{ data: mod }, { data: chapList }, { data: roleData }] =
        await Promise.all([
          supabase.from("modules").select("*").eq("id", moduleId).maybeSingle(),
          supabase
            .from("chapters")
            .select("*")
            .eq("module_id", moduleId)
            .order("position"),
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            .eq("role", "admin")
            .maybeSingle(),
        ]);

      if (!mod) {
        navigate({ to: "/" });
        return;
      }
      setModule(mod as Module);
      setIsAdmin(!!roleData);

      const chaps = (chapList as Chapter[]) || [];
      setChapters(chaps);

      if (chaps.length > 0) {
        setSelectedId(chaps[0].id);
        const ids = chaps.map((c) => c.id);
        const { data: progress } = await supabase
          .from("user_chapter_progress")
          .select("chapter_id")
          .eq("user_id", user.id)
          .in("chapter_id", ids);
        setCompleted(new Set((progress || []).map((p) => p.chapter_id)));
      }

      setDataLoading(false);
    })();
  }, [user, moduleId]);

  const reloadChapters = async () => {
    const { data } = await supabase
      .from("chapters")
      .select("*")
      .eq("module_id", moduleId)
      .order("position");
    const chaps = (data as Chapter[]) || [];
    setChapters(chaps);
    if (chaps.length > 0 && !selectedId) setSelectedId(chaps[0].id);
  };

  const validateChapter = async () => {
    if (!user || !selectedId || completed.has(selectedId) || validating) return;
    setValidating(true);
    await supabase
      .from("user_chapter_progress")
      .insert({ user_id: user.id, chapter_id: selectedId });
    setCompleted((prev) => new Set([...prev, selectedId]));
    setValidating(false);
  };

  const prepareFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    setPendingFile(file);
    setNewTitle(
      file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]/g, " ")
        .trim(),
    );
    setShowTitleForm(true);
  };

  const uploadAndCreate = async () => {
    if (!pendingFile || !newTitle.trim()) return;
    setUploading(true);
    setShowTitleForm(false);

    const ext = pendingFile.name.split(".").pop() || "mp4";
    const path = `${moduleId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("course-videos")
      .upload(path, pendingFile, { upsert: false });

    if (!error) {
      const { data: urlData } = supabase.storage
        .from("course-videos")
        .getPublicUrl(path);
      await supabase.from("chapters").insert({
        module_id: moduleId,
        title: newTitle.trim(),
        description: "",
        video_url: urlData.publicUrl,
        position: chapters.length,
        duration_seconds: 0,
      });
      await reloadChapters();
    }

    setUploading(false);
    setPendingFile(null);
    setNewTitle("");
  };

  const selected = chapters.find((c) => c.id === selectedId);
  const currentIdx = chapters.findIndex((c) => c.id === selectedId);
  const prevChapter = currentIdx > 0 ? chapters[currentIdx - 1] : null;
  const nextChapter =
    currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null;
  const isDone = selectedId ? completed.has(selectedId) : false;
  const progressPct = chapters.length
    ? Math.round((completed.size / chapters.length) * 100)
    : 0;

  if (loading || !user || dataLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0418",
          color: "#c4a3f0",
          fontFamily: "-apple-system, sans-serif",
        }}
      >
        Chargement…
      </div>
    );
  }

  const hasChapters = chapters.length > 0;
  const videoUrl = selected ? toEmbedUrl(selected.video_url) : "";
  const direct = videoUrl ? isDirectVideo(videoUrl) : false;

  return (
    <div className="player-root">
      {/* Topbar */}
      <div className="player-topbar">
        <Link to="/" className="player-back">
          ← Formation
        </Link>
        {module && (
          <div className="player-module-name">{module.title}</div>
        )}
        {hasChapters && (
          <button
            className="player-sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            ☰ Chapitres
          </button>
        )}
      </div>

      <div className="player-layout">
        {/* ── Main area ── */}
        <div className="player-main">
          {hasChapters ? (
            <>
              {/* Video */}
              <div className="player-video-wrap">
                {videoUrl ? (
                  direct ? (
                    <video
                      key={videoUrl}
                      src={videoUrl}
                      controls
                      className="player-iframe"
                    />
                  ) : (
                    <iframe
                      src={videoUrl}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="player-iframe"
                      title={selected?.title}
                    />
                  )
                ) : (
                  <div className="player-no-video">
                    <span>📹</span>
                    <p>Vidéo bientôt disponible</p>
                  </div>
                )}
              </div>

              {/* Info + actions */}
              <div className="player-info">
                <h1 className="player-title">{selected?.title}</h1>
                {selected?.description && (
                  <p className="player-desc">{selected.description}</p>
                )}
                <div className="player-actions">
                  <button
                    className={`player-validate${isDone ? " done" : ""}`}
                    onClick={validateChapter}
                    disabled={validating || isDone}
                  >
                    {isDone
                      ? "✓ Chapitre validé"
                      : validating
                        ? "Validation…"
                        : "✓ Valider ce chapitre"}
                  </button>
                  <div className="player-nav">
                    {prevChapter && (
                      <button
                        className="player-nav-btn"
                        onClick={() => setSelectedId(prevChapter.id)}
                      >
                        ← Précédent
                      </button>
                    )}
                    {nextChapter && (
                      <button
                        className="player-nav-btn primary"
                        onClick={() => setSelectedId(nextChapter.id)}
                      >
                        Suivant →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ── "Bientôt disponible" ── */
            <div className="module-soon">
              <div className="module-soon-illustration" aria-hidden="true">
                <div className="ms-ring ms-ring-1" />
                <div className="ms-ring ms-ring-2" />
                <div className="ms-rocket">🚀</div>
                <div className="ms-star ms-s1">✦</div>
                <div className="ms-star ms-s2">✧</div>
                <div className="ms-star ms-s3">✦</div>
                <div className="ms-star ms-s4">✧</div>
              </div>

              <h2 className="ms-title">Ce module arrive bientôt !</h2>
              <p className="ms-desc">
                {module?.description ||
                  "Le contenu de ce module est en cours de préparation. Reviens très vite !"}
              </p>

              {/* Admin upload zone */}
              {isAdmin && (
                <div className="ms-upload-area">
                  {showTitleForm ? (
                    <div className="ms-title-form">
                      <div className="ms-file-label">📎 {pendingFile?.name}</div>
                      <input
                        className="ms-title-input"
                        placeholder="Titre du chapitre"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void uploadAndCreate();
                          if (e.key === "Escape") {
                            setShowTitleForm(false);
                            setPendingFile(null);
                          }
                        }}
                        autoFocus
                      />
                      <div className="ms-title-actions">
                        <button
                          className="ms-confirm"
                          onClick={() => void uploadAndCreate()}
                          disabled={!newTitle.trim()}
                        >
                          Créer le chapitre
                        </button>
                        <button
                          className="ms-cancel"
                          onClick={() => {
                            setShowTitleForm(false);
                            setPendingFile(null);
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : uploading ? (
                    <div className="ms-uploading">
                      <div className="ms-spinner" />
                      Envoi en cours…
                    </div>
                  ) : (
                    <div
                      className={`ms-dropzone${dragging ? " dragging" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        const f = e.dataTransfer.files[0];
                        if (f) prepareFile(f);
                      }}
                    >
                      <div className="ms-dz-icon">🎬</div>
                      <div className="ms-dz-label">
                        Glissez une vidéo pour créer le premier chapitre
                      </div>
                      <div className="ms-dz-sub">MP4 · WebM · MOV</div>
                      <label className="ms-dz-browse">
                        Parcourir les fichiers
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          hidden
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) prepareFile(f);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        {hasChapters && (
          <div
            className={`player-sidebar${sidebarOpen ? " open" : " closed"}`}
          >
            {/* Sidebar header with + button for admin */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 10px" }}>
              <div className="player-sidebar-title" style={{ padding: 0 }}>Chapitres</div>
              {isAdmin && (
                <button
                  onClick={() => setShowAddChapter((v) => !v)}
                  title="Ajouter un chapitre"
                  style={{
                    width: 28, height: 28,
                    background: "rgba(168,85,247,0.15)",
                    border: "1px solid rgba(168,85,247,0.3)",
                    borderRadius: 8, color: "#c4a3f0",
                    fontSize: 18, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {showAddChapter ? "−" : "+"}
                </button>
              )}
            </div>

            {/* New chapter form (admin) */}
            {isAdmin && showAddChapter && (
              <div style={{ margin: "0 8px 12px", background: "rgba(15,5,30,0.8)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  placeholder="Titre du chapitre *"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") { setShowAddChapter(false); setNewChapterTitle(""); setNewChapterVideoUrl(""); }
                  }}
                  autoFocus
                  style={{ background: "rgba(10,3,20,0.8)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 7, padding: "8px 10px", color: "#e2d4f8", fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" }}
                />

                {/* Video upload */}
                {!newChapterVideoUrl ? (
                  addingChapterUploading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981", fontSize: 12, padding: "8px 0" }}>
                      <div style={{ width: 14, height: 14, border: "2px solid rgba(16,185,129,0.2)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                      Envoi en cours…
                    </div>
                  ) : (
                    <label style={{ border: "2px dashed rgba(168,85,247,0.25)", borderRadius: 8, padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", background: "rgba(124,58,237,0.03)" }}>
                      <span style={{ fontSize: 20 }}>🎬</span>
                      <span style={{ fontSize: 11, color: "#c4a3f0", fontWeight: 600 }}>Glisser une vidéo ou cliquer</span>
                      <span style={{ fontSize: 10, color: "#6b4fa0" }}>MP4 · WebM · MOV</span>
                      <input
                        type="file"
                        accept="video/*"
                        hidden
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setAddingChapterUploading(true);
                          const ext = file.name.split(".").pop() || "mp4";
                          const path = `${moduleId}/${Date.now()}.${ext}`;
                          const { error } = await supabase.storage.from("course-videos").upload(path, file, { upsert: false });
                          if (!error) {
                            const { data } = supabase.storage.from("course-videos").getPublicUrl(path);
                            setNewChapterVideoUrl(data.publicUrl);
                          }
                          setAddingChapterUploading(false);
                        }}
                      />
                    </label>
                  )
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 8, padding: "8px 10px" }}>
                    <span style={{ fontSize: 16 }}>✅</span>
                    <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600, flex: 1 }}>Vidéo prête</span>
                    <button type="button" onClick={() => setNewChapterVideoUrl("")} style={{ background: "none", border: "none", color: "#6b4fa0", fontSize: 11, cursor: "pointer", padding: 0 }}>Changer</button>
                  </div>
                )}

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={async () => {
                      if (!newChapterTitle.trim() || addingChapter) return;
                      setAddingChapter(true);
                      const { error } = await supabase.from("chapters").insert({
                        module_id: moduleId,
                        title: newChapterTitle.trim(),
                        description: "",
                        video_url: newChapterVideoUrl,
                        position: chapters.length,
                        duration_seconds: 0,
                      });
                      if (!error) {
                        await reloadChapters();
                        setNewChapterTitle("");
                        setNewChapterVideoUrl("");
                        setShowAddChapter(false);
                      }
                      setAddingChapter(false);
                    }}
                    disabled={!newChapterTitle.trim() || addingChapter}
                    style={{ flex: 1, padding: "7px 0", background: newChapterTitle.trim() ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "rgba(124,58,237,0.3)", border: "none", borderRadius: 7, color: "#fff", fontSize: 12, fontWeight: 700, cursor: newChapterTitle.trim() ? "pointer" : "default", opacity: newChapterTitle.trim() ? 1 : 0.5 }}
                  >
                    {addingChapter ? "…" : "Créer le chapitre"}
                  </button>
                  <button
                    onClick={() => { setShowAddChapter(false); setNewChapterTitle(""); setNewChapterVideoUrl(""); }}
                    style={{ padding: "7px 10px", background: "none", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 7, color: "#9a7dbd", fontSize: 12, cursor: "pointer" }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="player-chapters-list">
              {chapters.map((c, idx) => (
                <div key={c.id} style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: 2 }}>
                  <button
                    className={[
                      "player-chapter-item",
                      c.id === selectedId ? "active" : "",
                      completed.has(c.id) ? "done" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setSelectedId(c.id)}
                    style={{ flex: 1, paddingRight: isAdmin ? 36 : undefined }}
                  >
                    <span className="chapter-num">{idx + 1}</span>
                    <span className="chapter-title">{c.title}</span>
                    {completed.has(c.id) && <span className="chapter-check">✓</span>}
                  </button>

                  {isAdmin && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!confirm(`Supprimer "${c.title}" ?`)) return;
                        const { error } = await supabase.from("chapters").delete().eq("id", c.id);
                        if (!error) {
                          await reloadChapters();
                          if (selectedId === c.id) {
                            const remaining = chapters.filter((ch) => ch.id !== c.id);
                            setSelectedId(remaining[0]?.id ?? null);
                          }
                        }
                      }}
                      title="Supprimer ce chapitre"
                      style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 6, color: "#f87171", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 2 }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="player-sidebar-progress">
              <div className="pg-label">
                {completed.size} / {chapters.length} chapitres — {progressPct}%
              </div>
              <div className="pg-bar-wrap">
                <div className="pg-bar" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
