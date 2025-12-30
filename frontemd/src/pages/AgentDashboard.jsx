// src/pages/AgentDashboard.jsx - WITH PROPER COMMENT ATTRIBUTION
import { useEffect, useState } from "react";
import api from "../api/client";

const pageStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #0f172a 0, #020617 40%, #020617 100%)",
  color: "#e5e7eb",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  padding: "24px 40px 32px",
  boxSizing: "border-box",
};

const topBarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "22px",
};

const titleBlockStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const h1Style = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#f9fafb",
};

const subtitleStyle = {
  fontSize: "13px",
  color: "#9ca3af",
};

const outlineBtnStyle = {
  borderRadius: "999px",
  background: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.9))",
  color: "#e5e7eb",
  border: "1px solid #4b5563",
  padding: "7px 14px",
  fontSize: "12px",
  cursor: "pointer",
};

const primaryBtnStyle = {
  borderRadius: "999px",
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  color: "#ffffff",
  border: "none",
  padding: "9px 18px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(59,130,246,0.3)",
};

const successBtnStyle = {
  borderRadius: "999px",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  color: "#ffffff",
  border: "none",
  padding: "7px 14px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
};

const statsRowStyle = {
  display: "flex",
  gap: "16px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const statCardStyle = {
  flex: "0 0 200px",
  borderRadius: "16px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85))",
  border: "1px solid rgba(59,130,246,0.4)",
  padding: "12px 14px 14px",
  boxShadow: "0 18px 40px rgba(15,23,42,0.9), inset 0 0 0 0.5px rgba(148,163,184,0.15)",
};

const statLabelStyle = {
  fontSize: "11px",
  color: "#9ca3af",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const statValueStyle = {
  marginTop: "4px",
  fontSize: "22px",
  fontWeight: 600,
  color: "#e5e7eb",
};

const statSubStyle = {
  marginTop: "2px",
  fontSize: "11px",
  color: "#60a5fa",
};

const panelStyle = {
  borderRadius: "18px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.97), rgba(15,23,42,0.98))",
  border: "1px solid #1e293b",
  boxShadow: "0 22px 60px rgba(0,0,0,0.9)",
  padding: "14px 16px 18px",
  marginTop: "6px",
};

const sectionTitleStyle = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#f9fafb",
  marginBottom: "12px",
};

const filterRowStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const searchInputStyle = {
  flex: "1 1 220px",
  borderRadius: "999px",
  border: "1px solid #374151",
  background: "#020617",
  color: "#e5e7eb",
  padding: "7px 11px",
  fontSize: "12px",
  outline: "none",
};

const selectStyle = {
  borderRadius: "999px",
  border: "1px solid #374151",
  background: "#020617",
  color: "#e5e7eb",
  padding: "7px 10px",
  fontSize: "12px",
  outline: "none",
};

const tableWrapperStyle = {
  marginTop: "8px",
  borderRadius: "14px",
  border: "1px solid rgba(15,23,42,0.9)",
  overflow: "hidden",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: "12px",
};

const thStyle = {
  background: "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
  color: "#9ca3af",
  textAlign: "left",
  padding: "9px 12px",
  borderBottom: "1px solid #1e293b",
  fontWeight: 500,
};

const tdBase = {
  padding: "9px 12px",
  borderBottom: "1px solid rgba(15,23,42,0.9)",
  cursor: "pointer",
};

const statusBadgeBase = {
  display: "inline-block",
  borderRadius: "999px",
  padding: "2px 9px",
  fontSize: "11px",
  fontWeight: 500,
};

const modalBackdropStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.92)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 40,
  overflowY: "auto",
};

const modalCardStyle = {
  width: "700px",
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "18px",
  background: "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.98))",
  border: "1px solid #1e293b",
  boxShadow: "0 22px 80px rgba(0, 0, 0, 0.9)",
  padding: "20px",
  margin: "20px",
};

const modalTitleStyle = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#f9fafb",
  marginBottom: "8px",
};

const fieldLabelStyle = {
  fontSize: "11px",
  fontWeight: 500,
  color: "#d1d5db",
  marginBottom: "3px",
  display: "block",
  marginTop: "10px",
};

const fieldInputStyle = {
  width: "100%",
  borderRadius: "10px",
  border: "1px solid #374151",
  background: "#020617",
  color: "#e5e7eb",
  padding: "7px 10px",
  fontSize: "12px",
  outline: "none",
  boxSizing: "border-box",
};

const textAreaStyle = {
  ...fieldInputStyle,
  minHeight: "80px",
  resize: "vertical",
  fontFamily: "inherit",
};

const modalFooterStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
  marginTop: "14px",
};

const chatBoxStyle = {
  marginTop: "16px",
  padding: "12px",
  background: "rgba(15,23,42,0.6)",
  borderRadius: "12px",
  border: "1px solid #374151",
  maxHeight: "400px",
  overflowY: "auto",
};

const commentStyle = (isAgent) => ({
  padding: "12px 14px",
  marginBottom: "12px",
  borderRadius: "12px",
  background: isAgent
    ? "linear-gradient(135deg, #1e3a8a, #1e40af)"
    : "linear-gradient(135deg, rgba(55,65,81,0.7), rgba(55,65,81,0.5))",
  border: `1px solid ${isAgent ? "#3b82f6" : "#4b5563"}`,
  fontSize: "13px",
  color: "#e5e7eb",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
});

const commentHeaderStyle = {
  fontSize: "11px",
  color: "#d1d5db",
  marginBottom: "6px",
  fontWeight: 600,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const roleBadgeStyle = (role) => ({
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: 600,
  background: role === 3 ? "#3b82f6" : role === 1 ? "#f97316" : "#6b7280",
  color: "#ffffff",
  marginLeft: "6px",
});

const notificationStyle = {
  position: "fixed",
  top: "20px",
  right: "20px",
  padding: "12px 18px",
  borderRadius: "12px",
  fontSize: "13px",
  fontWeight: 500,
  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
  zIndex: 50,
  animation: "slideIn 0.3s ease",
};

const QUEUE_MAP = { 1: "HR", 2: "IT", 3: "Facilities", 4: "Other" };
const PRIORITY_MAP = { 1: "High", 2: "Medium", 3: "Low" };
const STATUS_MAP = { 1: "Open", 2: "Closed" };
const ROLE_MAP = { 1: "Admin", 2: "Customer", 3: "Agent" };

function getStatusBadge(status) {
  const base = { ...statusBadgeBase };
  if (status === 1) {
    base.background = "#0f172a";
    base.color = "#facc15";
    base.border = "1px solid #facc15";
    return { style: base, text: "Open" };
  } else if (status === 2) {
    base.background = "#052e16";
    base.color = "#bbf7d0";
    base.border = "1px solid #22c55e";
    return { style: base, text: "Closed" };
  }
  return { style: base, text: "Unknown" };
}

function getPriorityBadge(priority) {
  const base = { ...statusBadgeBase };
  if (priority === 1) {
    base.background = "#7f1d1d";
    base.color = "#fecaca";
    base.border = "1px solid #ef4444";
    return { style: base, text: "High" };
  } else if (priority === 2) {
    base.background = "#7c2d12";
    base.color = "#fed7aa";
    base.border = "1px solid #f97316";
    return { style: base, text: "Medium" };
  } else if (priority === 3) {
    base.background = "#14532d";
    base.color = "#bbf7d0";
    base.border = "1px solid #22c55e";
    return { style: base, text: "Low" };
  }
  return { style: base, text: "—" };
}

function calculateSLAStatus(createdAt, priorityId, slaSettings) {
  const sla = slaSettings.find(s => s.priority_id === priorityId);
  if (!sla) return { text: "No SLA", color: "#6b7280" };

  const created = new Date(createdAt);
  const now = new Date();
  const elapsedMinutes = (now - created) / 1000 / 60;
  const remaining = sla.sla_time_minutes - elapsedMinutes;

  if (remaining < 0) {
    return { text: `BREACH (${Math.abs(Math.round(remaining))}m over)`, color: "#ef4444" };
  } else if (remaining < 30) {
    return { text: `${Math.round(remaining)}m left`, color: "#f97316" };
  } else {
    return { text: `${Math.round(remaining)}m left`, color: "#22c55e" };
  }
}

export default function AgentDashboard({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [cannedResponses, setCannedResponses] = useState([]);
  const [slaSettings, setSlaSettings] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]); // NEW: Store all users for name lookup
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [search, setSearch] = useState("");
  const [queueFilter, setQueueFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // Changed default to "all"
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [ticketStatus, setTicketStatus] = useState("");
  const [ticketPriority, setTicketPriority] = useState("");
  const [replyText, setReplyText] = useState("");
  const [selectedCanned, setSelectedCanned] = useState("");

  // KB SEARCH STATE
  const [kbSearchQuery, setKbSearchQuery] = useState("");
  const [kbResults, setKbResults] = useState([]);
  const [kbSearching, setKbSearching] = useState(false);

  const userId = Number(localStorage.getItem("user_id")) || 1;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/tickets/");
      setTickets(res.data);
      const assigned = res.data.filter(t => t.assigned_to === userId);
      setMyTickets(assigned);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      showNotification("Failed to load tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCannedResponses = async () => {
    try {
      const res = await api.get("/api/canned-responses/");
      setCannedResponses(res.data);
    } catch (err) {
      console.error("Failed to fetch canned responses:", err);
    }
  };

  const fetchSLASettings = async () => {
    try {
      const res = await api.get("/api/sla-settings/");
      setSlaSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch SLA settings:", err);
    }
  };

  const fetchComments = async (threadId) => {
    if (!threadId) return;
    try {
      const res = await api.get(`/api/comment-threads/${threadId}/`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setComments([]);
    }
  };

  const getUserInfo = (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return { name: `User #${userId}`, role: 2 };
    return { name: user.username, role: user.role };
  };

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setTicketStatus(ticket.status);
    setTicketPriority(ticket.priority_id);
    setReplyText("");
    setSelectedCanned("");
    if (ticket.thread_id) {
      fetchComments(ticket.thread_id);
    } else {
      setComments([]);
    }
    setShowTicketModal(true);
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await api.patch(`/api/tickets/${selectedTicket.id}/`, {
        status: Number(ticketStatus),
        priority_id: Number(ticketPriority),
      });
      showNotification("Ticket updated successfully");
      fetchTickets();
      setShowTicketModal(false);
    } catch (error) {
      console.error("Failed to update ticket:", error);
      showNotification("Failed to update ticket", "error");
    }
  };

  const handleAddComment = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    try {
      let threadId = selectedTicket.thread_id;

      if (!threadId) {
        const threadRes = await api.post("/api/comment-threads/", {
          ticket: selectedTicket.id,
        });
        threadId = threadRes.data.id;
      }

      await api.post("/api/comments/", {
        thread: threadId,
        comment: replyText,
      });

      setReplyText("");
      setSelectedCanned("");
      showNotification("Reply sent");
      fetchComments(threadId);
      fetchTickets();
    } catch (error) {
      console.error("Failed to add comment:", error);
      showNotification("Failed to send reply", "error");
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      await api.patch(`/api/tickets/${ticketId}/`, { status: 2 });
      showNotification("Ticket resolved");
      fetchTickets();
      if (showTicketModal) setShowTicketModal(false);
    } catch (error) {
      showNotification("Failed to resolve ticket", "error");
    }
  };

  const handleUseCanned = (e) => {
    const cannedId = e.target.value;
    setSelectedCanned(cannedId);
    const canned = cannedResponses.find(c => c.id === Number(cannedId));
    if (canned) {
      setReplyText(canned.response_text);
    }
  };

  const handleKBSearch = async () => {
    if (!kbSearchQuery.trim()) {
      setKbResults([]);
      return;
    }

    setKbSearching(true);
    try {
      const res = await api.get(`/api/knowledge-base/search/?q=${encodeURIComponent(kbSearchQuery)}`);
      setKbResults(res.data.results || []);
    } catch (error) {
      console.error("KB search failed:", error);
      setKbResults([]);
    } finally {
      setKbSearching(false);
    }
  };

  const handlePasteKBArticle = (content) => {
    setReplyText(content);
    setKbSearchQuery("");
    setKbResults([]);
  };

  useEffect(() => {
    fetchUsers();
    fetchTickets();
    fetchCannedResponses();
    fetchSLASettings();
  }, []);

  const filteredTickets = myTickets.filter(t => {
    const matchesSearch = (t.subject || "").toLowerCase().includes(search.toLowerCase()) || t.id.toString().includes(search);
    const matchesQueue = queueFilter === "all" || t.queue === Number(queueFilter);
    const matchesStatus = statusFilter === "all" || t.status === Number(statusFilter);
    const matchesPriority = priorityFilter === "all" || t.priority_id === Number(priorityFilter);
    return matchesSearch && matchesQueue && matchesStatus && matchesPriority;
  });

  const totalAssigned = myTickets.length;
  const openAssigned = myTickets.filter(t => t.status === 1).length;
  const closedAssigned = myTickets.filter(t => t.status === 2).length;
  const highPriority = myTickets.filter(t => t.priority_id === 1).length;

  return (
    <div style={pageStyle}>
      {notification && (
        <div style={{
          ...notificationStyle,
          background: notification.type === "success"
            ? "linear-gradient(135deg, #22c55e, #16a34a)"
            : "linear-gradient(135deg, #ef4444, #dc2626)",
        }}>
          {notification.message}
        </div>
      )}

      <div style={topBarStyle}>
        <div style={titleBlockStyle}>
          <h1 style={h1Style}>Agent Console</h1>
          <span style={subtitleStyle}>Manage your assigned tickets</span>
        </div>
        <button style={outlineBtnStyle} onClick={onLogout}>Logout</button>
      </div>

      <div style={statsRowStyle}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Total Assigned</div>
          <div style={statValueStyle}>{totalAssigned}</div>
          <div style={statSubStyle}>Your queue</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Open Tickets</div>
          <div style={statValueStyle}>{openAssigned}</div>
          <div style={statSubStyle}>Need attention</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Resolved</div>
          <div style={statValueStyle}>{closedAssigned}</div>
          <div style={statSubStyle}>Closed tickets</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>High Priority</div>
          <div style={statValueStyle}>{highPriority}</div>
          <div style={statSubStyle}>Urgent items</div>
        </div>
      </div>

      <div style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={sectionTitleStyle}>My Ticket Queue ({filteredTickets.length})</div>
        </div>

        <div style={filterRowStyle}>
          <input
            style={searchInputStyle}
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select style={selectStyle} value={queueFilter} onChange={(e) => setQueueFilter(e.target.value)}>
            <option value="all">All Queues</option>
            <option value="1">HR</option>
            <option value="2">IT</option>
            <option value="3">Facilities</option>
            <option value="4">Other</option>
          </select>
          <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="1">Open</option>
            <option value="2">Closed</option>
          </select>
          <select style={selectStyle} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
        </div>

        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Queue</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>SLA</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td style={{ ...tdBase, padding: "14px 10px", color: "#6b7280", cursor: "default" }} colSpan={7}>
                    No tickets assigned to you
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t, index) => {
                  const statusBadge = getStatusBadge(t.status);
                  const priorityBadge = getPriorityBadge(t.priority_id);
                  const slaStatus = calculateSLAStatus(t.creation_time, t.priority_id, slaSettings);

                  return (
                    <tr key={t.id} style={{ backgroundColor: index % 2 === 0 ? "rgba(15,23,42,0.9)" : "rgba(15,23,42,0.96)" }}>
                      <td style={tdBase} onClick={() => openTicketModal(t)}>#{t.id}</td>
                      <td style={tdBase} onClick={() => openTicketModal(t)}>{t.subject}</td>
                      <td style={tdBase} onClick={() => openTicketModal(t)}>{QUEUE_MAP[t.queue]}</td>
                      <td style={tdBase} onClick={() => openTicketModal(t)}>
                        <span style={priorityBadge.style}>{priorityBadge.text}</span>
                      </td>
                      <td style={tdBase} onClick={() => openTicketModal(t)}>
                        <span style={statusBadge.style}>{statusBadge.text}</span>
                      </td>
                      <td style={{ ...tdBase, color: slaStatus.color }} onClick={() => openTicketModal(t)}>
                        {slaStatus.text}
                      </td>
                      <td style={{ ...tdBase, cursor: "default" }}>
                        <button style={{ ...primaryBtnStyle, padding: "4px 10px", fontSize: "11px" }} onClick={() => openTicketModal(t)}>
                          View
                        </button>
                        {t.status === 1 && (
                          <button
                            style={{ ...successBtnStyle, padding: "4px 10px", fontSize: "11px", marginLeft: "4px" }}
                            onClick={() => handleResolveTicket(t.id)}
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TICKET DETAIL MODAL WITH ENHANCED COMMENTS */}
      {showTicketModal && selectedTicket && (
        <div style={modalBackdropStyle} onClick={() => setShowTicketModal(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={modalTitleStyle}>Ticket #{selectedTicket.id}: {selectedTicket.subject}</div>
              <button style={outlineBtnStyle} onClick={() => setShowTicketModal(false)}>Close</button>
            </div>

            <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
              <strong>Queue:</strong> {QUEUE_MAP[selectedTicket.queue]} |
              <strong style={{ marginLeft: "8px" }}>Created:</strong> {new Date(selectedTicket.creation_time).toLocaleString()}
            </div>

            <div style={{ fontSize: "12px", color: "#e5e7eb", marginBottom: "16px", padding: "10px", background: "rgba(15,23,42,0.5)", borderRadius: "8px" }}>
              <strong>Description:</strong><br />
              {selectedTicket.description || "No description"}
            </div>

            {/* ENHANCED COMMENTS SECTION */}
            <div style={sectionTitleStyle}>Conversation ({comments.length})</div>
            <div style={chatBoxStyle}>
              {comments.length === 0 ? (
                <div style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", padding: "20px" }}>
                  No comments yet. Start the conversation!
                </div>
              ) : (
                comments.map((c, idx) => {
                  const userInfo = getUserInfo(c.user);
                  const isCurrentAgent = c.user === userId;
                  const isAgent = userInfo.role === 3;

                  return (
                    <div key={idx} style={commentStyle(isAgent)}>
                      <div style={commentHeaderStyle}>
                        <div>
                          <strong>{isCurrentAgent ? "You" : userInfo.name}</strong>
                          <span style={roleBadgeStyle(userInfo.role)}>
                            {ROLE_MAP[userInfo.role]}
                          </span>
                        </div>
                        <span style={{ color: "#9ca3af", fontSize: "10px" }}>
                          {new Date(c.comment_time).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ lineHeight: "1.5" }}>{c.comment}</div>
                    </div>
                  );
                })
              )}
            </div>

            {/* REPLY SECTION */}
            <label style={fieldLabelStyle}>Use Canned Response (Optional)</label>
            <select style={fieldInputStyle} value={selectedCanned} onChange={handleUseCanned}>
              <option value="">-- Select Template --</option>
              {cannedResponses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>

            {/* KB SEARCH SECTION */}
            <div style={{ marginTop: "14px", padding: "12px", background: "rgba(15,23,42,0.6)", borderRadius: "10px", border: "1px solid #374151" }}>
              <label style={{ ...fieldLabelStyle, display: "flex", alignItems: "center", gap: "6px" }}>
                🔍 Search Knowledge Base
                <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: 400 }}>(AI-powered)</span>
              </label>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <input
                  style={{ ...fieldInputStyle, flex: 1 }}
                  placeholder="e.g., 'how to reset password'"
                  value={kbSearchQuery}
                  onChange={(e) => setKbSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleKBSearch()}
                />
                <button
                  type="button"
                  style={{ ...primaryBtnStyle, padding: "7px 14px", fontSize: "11px" }}
                  onClick={handleKBSearch}
                  disabled={kbSearching}
                >
                  {kbSearching ? "..." : "Search"}
                </button>
              </div>

              {kbResults.length > 0 && (
                <div style={{ marginTop: "10px", maxHeight: "200px", overflowY: "auto" }}>
                  {kbResults.map((article, idx) => (
                    <div
                      key={article.id}
                      style={{
                        background: "linear-gradient(135deg, rgba(30,58,138,0.4), rgba(30,64,175,0.3))",
                        border: "1px solid #3b82f6",
                        borderRadius: "8px",
                        padding: "10px",
                        marginBottom: "8px",
                        cursor: "pointer"
                      }}
                      onClick={() => handlePasteKBArticle(article.content)}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#93c5fd", marginBottom: "4px" }}>
                        {idx + 1}. {article.title}
                      </div>
                      <div style={{ fontSize: "11px", color: "#d1d5db", lineHeight: "1.4", marginBottom: "6px" }}>
                        {article.content.substring(0, 100)}...
                      </div>
                      <button
                        type="button"
                        style={{ ...successBtnStyle, padding: "4px 10px", fontSize: "10px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePasteKBArticle(article.content);
                        }}
                      >
                        ✓ Paste to Reply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label style={fieldLabelStyle}>Your Reply</label>
            <textarea
              style={textAreaStyle}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response..."
            />
            <button
              style={{ ...primaryBtnStyle, marginTop: "8px", width: "100%" }}
              onClick={handleAddComment}
              disabled={!replyText.trim()}
            >
              Send Reply
            </button>

            {/* UPDATE TICKET SECTION */}
            <form onSubmit={handleUpdateTicket} style={{ marginTop: "20px" }}>
              <div style={sectionTitleStyle}>Update Ticket</div>

              <label style={fieldLabelStyle}>Status</label>
              <select style={fieldInputStyle} value={ticketStatus} onChange={(e) => setTicketStatus(e.target.value)}>
                <option value="1">Open</option>
                <option value="2">Closed</option>
              </select>

              <label style={fieldLabelStyle}>Priority</label>
              <select style={fieldInputStyle} value={ticketPriority} onChange={(e) => setTicketPriority(e.target.value)}>
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="3">Low</option>
              </select>

              <div style={modalFooterStyle}>
                <button type="button" style={outlineBtnStyle} onClick={() => setShowTicketModal(false)}>Cancel</button>
                {selectedTicket.status === 1 && (
                  <button type="button" style={successBtnStyle} onClick={() => handleResolveTicket(selectedTicket.id)}>
                    Mark Resolved
                  </button>
                )}
                <button type="submit" style={primaryBtnStyle}>Update Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
