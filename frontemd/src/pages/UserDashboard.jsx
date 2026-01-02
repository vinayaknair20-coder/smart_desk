// src/pages/UserDashboard.jsx - SPLIT PANE CHAT VERSION
import { useEffect, useState } from "react";
import api from "../api/client";
import ChatInterface from "../components/ChatInterface";

// ===== Layout + Typography =====
const pageStyle = {
  height: "100vh",
  background: "#f0f4f8",
  color: "#1e293b",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden", // prevent body scroll
};

const topBarStyle = {
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "rgba(255,255,255,0.8)",
  borderBottom: "1px solid #e2e8f0",
  flexShrink: 0,
};

const titleBlockStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const h1Style = {
  fontSize: "20px",
  fontWeight: 600,
  color: "#0f172a",
  margin: 0,
};

const subtitleStyle = {
  fontSize: "12px",
  color: "#64748b",
};

// ===== Buttons =====
const primaryBtnStyle = {
  borderRadius: "999px",
  background: "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #ea580c 100%)",
  color: "#ffffff",
  border: "none",
  padding: "8px 16px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
};

const outlineBtnStyle = {
  borderRadius: "999px",
  background: "#ffffff",
  color: "#374151",
  border: "1px solid #d1d5db",
  padding: "6px 14px",
  fontSize: "12px",
  cursor: "pointer",
};

// ===== Main Content Grid =====
const mainContentStyle = {
  flex: 1,
  display: "flex",
  overflow: "hidden", // contain scrolls
  padding: "16px 24px 24px",
  gap: "16px",
};

const leftPaneStyle = {
  width: "30%",
  minWidth: "300px",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  overflowY: "auto",
  paddingRight: "8px",
};

const rightPaneStyle = {
  flex: 1,
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  overflow: "hidden",
  position: "relative",
  display: "flex",
  flexDirection: "column",
};

// ===== Ticket List Item =====
const ticketItemStyle = (active) => ({
  background: active
    ? "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)"
    : "#ffffff",
  border: active ? "1px solid #3b82f6" : "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "16px",
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const ticketSubjectStyle = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#0f172a",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const ticketMetaStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "11px",
  color: "#64748b",
};

// ===== Create Ticket Form Styles =====
const formContainerStyle = {
  padding: "40px",
  maxWidth: "600px",
  margin: "0 auto",
  width: "100%",
};

const formTitleStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "8px",
  color: "#0f172a",
};

const formSubStyle = {
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "32px",
};

const inputGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 500,
  color: "#475569",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  color: "#0f172a",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box", // Fix width overflow
};

// ===== Status Badges =====
const getStatusBadge = (status) => {
  if (status === 1) return { bg: "#fffbeb", color: "#d97706", text: "Open" };
  if (status === 2) return { bg: "#dcfce7", color: "#16a34a", text: "Closed" };
  return { bg: "#f1f5f9", color: "#64748b", text: "Unknown" };
};


export default function UserDashboard({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDetail, setTicketDetail] = useState(null);

  const [viewMode, setViewMode] = useState("chat"); // "chat", "create", or "knowledge"

  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [kbResults, setKbResults] = useState([]);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbSearch, setKbSearch] = useState("");

  // Create Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newQueue, setNewQueue] = useState("1");
  const [newPriority, setNewPriority] = useState("2");
  const [creating, setCreating] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  const currentUser = {
    id: Number(localStorage.getItem("user_id")),
    role: Number(localStorage.getItem("role"))
  };

  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/tickets/");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    }
  };

  const fetchKnowledgeBase = async () => {
    try {
      const res = await api.get("/api/knowledge-base/");
      setKnowledgeBase(res.data);
      setKbResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKbSearch = async (query = kbSearch) => {
    if (!query.trim()) {
      setKbResults(knowledgeBase);
      return;
    }
    setKbLoading(true);
    try {
      const res = await api.get(`/api/knowledge-base/search/?q=${encodeURIComponent(query)}`);
      setKbResults(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setKbLoading(false);
    }
  };

  useEffect(() => {
    if (kbSearch.length > 2) {
      const timer = setTimeout(() => {
        handleKbSearch(kbSearch);
      }, 500);
      return () => clearTimeout(timer);
    } else if (kbSearch.length === 0) {
      setKbResults(knowledgeBase);
    }
  }, [kbSearch]);

  const fetchTicketDetail = async (id) => {
    try {
      const res = await api.get(`/api/tickets/${id}/`);
      setTicketDetail(res.data);
    } catch (err) {
      console.error("Failed to load detail", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchKnowledgeBase();

    // Check for draft ticket from Chatbot
    const draft = localStorage.getItem("draft_ticket");
    if (draft) {
      try {
        const { subject, description } = JSON.parse(draft);
        setNewTitle(subject);
        setNewDesc(description);
        setViewMode("create");
        localStorage.removeItem("draft_ticket"); // Clear after use
      } catch (e) {
        console.error("Failed to parse draft ticket");
      }
    }
  }, []);

  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetail(selectedTicketId);
    } else {
      setTicketDetail(null);
    }
  }, [selectedTicketId]);

  const handleTicketSelect = (id) => {
    setSelectedTicketId(id);
    setViewMode("chat");
  };

  const handleCreateNew = () => {
    setSelectedTicketId(null);
    setViewMode("create");
    setNewTitle("");
    setNewDesc("");
    setKbSearch("");
  };

  const handleOpenKnowledge = () => {
    setSelectedTicketId(null);
    setViewMode("knowledge");
    setKbSearch("");
    setKbResults(knowledgeBase);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setCreating(true);
    try {
      const res = await api.post("/api/tickets/", {
        subject: newTitle,
        description: newDesc
        // queue and priority handled by AI backend
      });

      await fetchTickets();
      // Select the new ticket immediately
      handleTicketSelect(res.data.id);
    } catch (err) {
      alert("Failed to create ticket");
    } finally {
      setCreating(false);
    }
  };

  const getSortedTickets = () => {
    return [...tickets].sort((a, b) => {
      if (sortOption === "newest") return b.id - a.id;
      if (sortOption === "oldest") return a.id - b.id;
      if (sortOption === "status") return a.status - b.status;
      return 0;
    });
  };

  // KB Search visual only for this view (requirements say sidebar)
  // We'll keep it simple for now as requested in requirements: 
  // "Right side pane will have a option to create a new ticket... If user clicks any previous ticket... right side pane should display details"

  return (
    <div style={pageStyle}>
      {/* Top Bar */}
      <div style={topBarStyle}>
        <div style={titleBlockStyle}>
          <h1 style={h1Style}>Help Center</h1>
          <span style={subtitleStyle}>Submit requests and track status</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={outlineBtnStyle} onClick={handleOpenKnowledge}>📚 Knowledge Base</button>
          <button style={outlineBtnStyle} onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>

        {/* Left Pane: Ticket List */}
        <div style={leftPaneStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#64748b", margin: 0 }}>MY TICKETS</h2>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "11px",
                  color: "#64748b",
                  cursor: "pointer",
                  outline: "none",
                  fontWeight: 600
                }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="status">Open First</option>
              </select>
            </div>
            <button
              onClick={handleCreateNew}
              style={{ ...primaryBtnStyle, fontSize: "11px", padding: "4px 10px" }}
            >
              + New Ticket
            </button>
          </div>

          {tickets.length === 0 ? (
            <div style={{ textAlign: "center", color: "#64748b", fontSize: "13px", padding: "20px" }}>
              No tickets yet.
            </div>
          ) : (
            getSortedTickets().map(t => {
              const status = getStatusBadge(t.status);
              return (
                <div
                  key={t.id}
                  style={ticketItemStyle(selectedTicketId === t.id && viewMode === "chat")}
                  onClick={() => handleTicketSelect(t.id)}
                >
                  <div style={ticketSubjectStyle}>{t.subject}</div>
                  <div style={ticketMetaStyle}>
                    <span style={{
                      color: status.color,
                      background: status.bg,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: 600
                    }}>
                      {status.text}
                    </span>
                    <span>#{t.id}</span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t.description}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Pane: Content */}
        <div style={rightPaneStyle}>
          {viewMode === "create" ? (
            <div style={{ overflowY: "auto", height: "100%" }}>
              <div style={formContainerStyle}>
                <h2 style={formTitleStyle}>Create New Request</h2>
                <p style={formSubStyle}>Describe your issue and we'll route it to the right team.</p>

                <form onSubmit={handleSubmitTicket}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Subject</label>
                    <input
                      style={inputStyle}
                      placeholder="Brief summary of the issue"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                      placeholder="Detailed explanation... (Our AI will automatically route this to the right team)"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      style={{ ...outlineBtnStyle, padding: "10px 20px" }}
                      onClick={() => setViewMode("chat")}
                      disabled={tickets.length === 0}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ ...primaryBtnStyle, padding: "10px 24px", fontSize: "13px" }}
                      disabled={creating}
                    >
                      {creating ? "Submitting..." : "Submit Ticket"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : viewMode === "knowledge" ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b", marginBottom: "16px" }}>Knowledge Base</h2>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="Search for answers..."
                    value={kbSearch}
                    onChange={(e) => setKbSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleKbSearch()}
                  />
                  <button onClick={handleKbSearch} style={primaryBtnStyle}>Search</button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                {kbLoading ? (
                  <div style={{ textAlign: "center", color: "#64748b" }}>Searching...</div>
                ) : kbResults.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#64748b" }}>No articles found.</div>
                ) : (
                  kbResults.map(kb => (
                    <div key={kb.id} style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>{kb.title}</h3>
                      <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{kb.content}</p>
                      {kb.tags && (
                        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                          {kb.tags.split(",").map(tag => (
                            <span key={tag} style={{ fontSize: "10px", background: "#f1f5f9", padding: "2px 8px", borderRadius: "99px", color: "#64748b" }}>{tag.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            selectedTicketId && ticketDetail ? (
              <ChatInterface
                ticket={ticketDetail}
                currentUser={currentUser}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎫</div>
                <h3>Select a ticket to view details</h3>
                <p style={{ fontSize: "13px" }}>or create a new one to get started</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button
                    onClick={handleCreateNew}
                    style={primaryBtnStyle}
                  >
                    Create New Ticket
                  </button>
                  <button
                    onClick={handleOpenKnowledge}
                    style={outlineBtnStyle}
                  >
                    Browse Help Articles
                  </button>
                </div>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
