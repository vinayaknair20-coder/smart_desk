// src/pages/AgentDashboard.jsx - SPLIT PANE AGENT CONSOLE
import { useEffect, useState } from "react";
import api from "../api/client";
import ChatInterface from "../components/ChatInterface";

// ===== Layout & Typography =====
const pageStyle = {
  height: "100vh",
  background: "#f0f4f8",
  color: "#1e293b",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
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
const outlineBtnStyle = {
  borderRadius: "999px",
  background: "#ffffff",
  color: "#374151",
  border: "1px solid #d1d5db",
  padding: "6px 14px",
  fontSize: "12px",
  cursor: "pointer",
};

const primaryBtnStyle = {
  borderRadius: "8px",
  background: "#3b82f6",
  color: "#ffffff",
  border: "none",
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
};

const updateBtnStyle = {
  padding: "6px 12px",
  borderRadius: "8px",
  background: "#f1f5f9",
  border: "1px solid #cbd5e1",
  color: "#334155",
  fontSize: "12px",
  cursor: "pointer",
};

// ===== Layout Grid =====
const mainContentStyle = {
  flex: 1,
  display: "flex",
  overflow: "hidden",
  padding: "16px 24px 24px",
  gap: "16px",
};

const leftPaneStyle = {
  width: "30%",
  minWidth: "320px",
  maxWidth: "450px",
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
  display: "flex",
  flexDirection: "column",
};

// ===== Queue Filters =====
const filterRowStyle = {
  display: "flex",
  gap: "8px",
  marginBottom: "12px",
  flexWrap: "wrap",
};

const searchInputStyle = {
  flex: 1,
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  padding: "8px 12px",
  color: "#0f172a",
  fontSize: "12px",
  outline: "none",
};

const selectStyle = {
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  padding: "8px",
  color: "#0f172a",
  fontSize: "12px",
  outline: "none",
};

// ===== Ticket Item =====
const ticketItemStyle = (active) => ({
  background: active ? "#eff6ff" : "rgba(255, 255, 255, 0.6)",
  borderLeft: active ? "4px solid #3b82f6" : "4px solid transparent",
  borderRadius: "8px",
  padding: "12px 16px",
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  borderBottom: "1px solid #e2e8f0", // Separator
});

const ticketHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const ticketIdStyle = {
  fontSize: "11px",
  color: "#64748b",
  fontWeight: 600,
};

const timeStyle = {
  fontSize: "10px",
  color: "#64748b",
};

const subjectStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: "2px",
};

// ===== Workshop / Right Pane =====
const workshopHeaderStyle = {
  padding: "12px 20px",
  background: "#ffffff",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const controlGroupStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

// ===== Badges =====
const getPriorityBadge = (p) => {
  if (p === 1) return { color: "#ef4444", text: "High" };
  if (p === 2) return { color: "#f97316", text: "Med" };
  return { color: "#22c55e", text: "Low" };
};

export default function AgentDashboard({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [cannedResponses, setCannedResponses] = useState([]);

  // Selection
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDetail, setTicketDetail] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [queueFilter, setQueueFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  // KB State
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [kbResults, setKbResults] = useState([]);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbSearch, setKbSearch] = useState("");
  const [rightPaneMode, setRightPaneMode] = useState("tickets"); // "tickets" or "knowledge"

  // Workshop Controls
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editQueue, setEditQueue] = useState("");

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
    } catch (err) { console.error(err); }
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

  const fetchCanned = async () => {
    try {
      const res = await api.get("/api/canned-responses/");
      setCannedResponses(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchTicketDetail = async (id) => {
    try {
      const res = await api.get(`/api/tickets/${id}/`);
      setTicketDetail(res.data);
      setEditPriority(res.data.priority_id);
      setEditStatus(res.data.status);
      setEditQueue(res.data.queue);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchTickets();
    fetchCanned();
    fetchKnowledgeBase();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = tickets;

    if (queueFilter !== "all") {
      result = result.filter(t => t.queue === Number(queueFilter));
    }

    if (statusFilter !== "all") {
      result = result.filter(t => t.status === Number(statusFilter));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.subject.toLowerCase().includes(q) ||
        t.id.toString().includes(q)
      );
    }



    // Sorting
    result.sort((a, b) => {
      if (sortOption === "newest") return new Date(b.creation_time) - new Date(a.creation_time);
      if (sortOption === "oldest") return new Date(a.creation_time) - new Date(b.creation_time);
      if (sortOption === "priority_high") return a.priority_id - b.priority_id; // 1=High
      if (sortOption === "priority_low") return b.priority_id - a.priority_id;
      return 0;
    });

    setFilteredTickets(result);
  }, [tickets, search, queueFilter, statusFilter, sortOption]);

  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetail(selectedTicketId);
    } else {
      setTicketDetail(null);
    }
  }, [selectedTicketId]);

  const handleUpdateTicket = async () => {
    if (!selectedTicketId) return;
    try {
      await api.patch(`/api/tickets/${selectedTicketId}/`, {
        status: Number(editStatus),
        priority_id: Number(editPriority),
        queue: Number(editQueue)
      });
      fetchTickets();
      fetchTicketDetail(selectedTicketId);
      // Optional: Show notification
    } catch (err) {
      alert("Update failed");
    }
  };

  const statusOptions = [
    { value: 1, label: "Open" },
    { value: 2, label: "Closed" }
  ];

  const priorityOptions = [
    { value: 1, label: "High" },
    { value: 2, label: "Medium" },
    { value: 3, label: "Low" }
  ];

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <div style={titleBlockStyle}>
          <h1 style={h1Style}>Agent Workspace</h1>
          <span style={subtitleStyle}>Manage queues and resolve tickets</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            style={{ ...outlineBtnStyle, background: rightPaneMode === "knowledge" ? "#eff6ff" : "#fff", borderColor: rightPaneMode === "knowledge" ? "#3b82f6" : "#d1d5db" }}
            onClick={() => setRightPaneMode(rightPaneMode === "knowledge" ? "tickets" : "knowledge")}
          >
            📚 Knowledge Base
          </button>
          <div style={{ fontSize: "13px", color: "#94a3b8" }}>
            {filteredTickets.length} tickets found
          </div>
          <button style={outlineBtnStyle} onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div style={mainContentStyle}>
        {/* Left Pane: Queue */}
        <div style={leftPaneStyle}>
          <div style={filterRowStyle}>
            <input
              style={searchInputStyle}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              style={{ ...selectStyle, width: "100px" }}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priority_high">High Prio</option>
              <option value="priority_low">Low Prio</option>
            </select>
          </div>
          <div style={filterRowStyle}>
            <select style={{ ...selectStyle, flex: 1 }} value={queueFilter} onChange={e => setQueueFilter(e.target.value)}>
              <option value="all">All Queues</option>
              <option value="1">HR</option>
              <option value="2">IT</option>
              <option value="3">Facilities</option>
              <option value="4">Other</option>
            </select>
            <select style={{ ...selectStyle, flex: 1 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="1">Open</option>
              <option value="2">Closed</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredTickets.map(t => {
              const priority = getPriorityBadge(t.priority_id);
              return (
                <div
                  key={t.id}
                  style={ticketItemStyle(selectedTicketId === t.id && rightPaneMode === "tickets")}
                  onClick={() => {
                    setSelectedTicketId(t.id);
                    setRightPaneMode("tickets");
                  }}
                >
                  <div style={ticketHeaderStyle}>
                    <span style={ticketIdStyle}>#{t.id}</span>
                    <span style={timeStyle}>{new Date(t.creation_time).toLocaleDateString()}</span>
                  </div>
                  <div style={subjectStyle}>{t.subject}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "11px" }}>
                    <span style={{ color: "#64748b" }}>By: {t.created_user_name || "User"}</span>
                    <span style={{ color: priority.color, fontWeight: 500 }}>{priority.text} Priority</span>
                    <span style={{ color: t.status === 1 ? "#facc15" : "#4ade80" }}>
                      {t.status === 1 ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Workshop or KB */}
        <div style={rightPaneStyle}>
          {rightPaneMode === "knowledge" ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ padding: "20px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e293b", marginBottom: "12px" }}>Agent Knowledge Hub</h2>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    style={{ ...searchInputStyle, background: "#fff" }}
                    placeholder="Search articles..."
                    value={kbSearch}
                    onChange={(e) => setKbSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleKbSearch()}
                  />
                  <button onClick={handleKbSearch} style={primaryBtnStyle}>Search</button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                {kbLoading ? (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>Searching...</div>
                ) : kbResults.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>No matching articles.</div>
                ) : (
                  kbResults.map(kb => (
                    <div key={kb.id} style={{ marginBottom: "20px", padding: "16px", border: "1px solid #f1f5f9", borderRadius: "12px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginBottom: "6px" }}>{kb.title}</h3>
                      <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{kb.content}</p>
                      {kb.tags && (
                        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
                          {kb.tags.split(",").map(tag => (
                            <span key={tag} style={{ fontSize: "9px", background: "#f1f5f9", padding: "1px 6px", borderRadius: "4px", color: "#64748b" }}>{tag.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : ticketDetail ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Controls Header */}
              <div style={workshopHeaderStyle}>
                <div style={controlGroupStyle}>
                  <select
                    style={selectStyle}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>

                  <select
                    style={selectStyle}
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                  >
                    {priorityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>

                  <select
                    style={selectStyle}
                    value={editQueue}
                    onChange={(e) => setEditQueue(e.target.value)}
                  >
                    <option value="1">HR</option>
                    <option value="2">IT</option>
                    <option value="3">Facilities</option>
                    <option value="4">Other</option>
                  </select>

                  <button
                    style={updateBtnStyle}
                    onClick={handleUpdateTicket}
                    disabled={
                      editStatus === ticketDetail.status &&
                      editPriority === ticketDetail.priority_id &&
                      editQueue === ticketDetail.queue
                    }
                  >
                    Update
                  </button>
                </div>

                <button
                  style={{ ...primaryBtnStyle, background: "#22c55e" }}
                  onClick={async () => {
                    setEditStatus(2); // Set to Closed
                    try {
                      await api.patch(`/api/tickets/${selectedTicketId}/`, { status: 2 });
                      fetchTickets();
                      fetchTicketDetail(selectedTicketId);
                    } catch (e) { alert("Action failed"); }
                  }}
                  disabled={ticketDetail.status === 2}
                >
                  Mark Resolved
                </button>
              </div>

              {/* Chat Interface */}
              <div style={{ flex: 1, overflow: "hidden" }}>
                <ChatInterface
                  ticket={ticketDetail}
                  currentUser={currentUser}
                  cannedResponses={cannedResponses}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b" }}>
              <div style={{ fontSize: "50px", marginBottom: "16px" }}>👋</div>
              <h3>Welcome, Agent</h3>
              <p>Select a ticket from the queue or search Knowledge Base.</p>
              <button
                style={{ ...outlineBtnStyle, marginTop: "16px" }}
                onClick={() => setRightPaneMode("knowledge")}
              >
                Open Knowledge Base
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
