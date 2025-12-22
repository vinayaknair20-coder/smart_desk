// src/pages/UserDashboard.jsx - BULLETPROOF VERSION with api client
import { useEffect, useState } from "react";
import api from "../api/client";

// ===== Layout + Typography =====
const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, #020617 0, #020617 40%, #020617 100%)",
  color: "#e5e7eb",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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

// ===== Buttons =====
const primaryBtnStyle = {
  borderRadius: "999px",
  background:
    "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #ea580c 100%)",
  color: "#ffffff",
  border: "none",
  padding: "9px 18px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(248,113,113,0.2)",
};

const outlineBtnStyle = {
  borderRadius: "999px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.9))",
  color: "#e5e7eb",
  border: "1px solid #4b5563",
  padding: "7px 14px",
  fontSize: "12px",
  cursor: "pointer",
};

// ===== Stats cards =====
const statsRowStyle = {
  display: "flex",
  gap: "16px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const statCardStyle = {
  flex: "0 0 210px",
  borderRadius: "16px",
  background:
    "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(15,23,42,0.85))",
  border: "1px solid rgba(30,64,175,0.55)",
  padding: "12px 14px 14px",
  boxShadow:
    "0 18px 40px rgba(15,23,42,0.9), inset 0 0 0 0.5px rgba(148,163,184,0.15)",
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
  color: "#a5b4fc",
};

// ===== Tickets panel =====
const panelStyle = {
  borderRadius: "18px",
  background:
    "linear-gradient(145deg, rgba(15,23,42,0.97), rgba(15,23,42,0.98))",
  border: "1px solid #111827",
  boxShadow: "0 22px 60px rgba(0,0,0,0.9)",
  padding: "14px 16px 18px",
  marginTop: "6px",
};

const filterRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
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
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
  color: "#9ca3af",
  textAlign: "left",
  padding: "9px 12px",
  borderBottom: "1px solid #111827",
  fontWeight: 500,
};

const tdBase = {
  padding: "9px 12px",
  borderBottom: "1px solid rgba(15,23,42,0.9)",
};

const footerTextStyle = {
  marginTop: "8px",
  fontSize: "11px",
  color: "#6b7280",
};

// ===== Status & priority badges =====
const statusBadgeBase = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  borderRadius: "999px",
  padding: "2px 9px",
  fontSize: "11px",
  fontWeight: 500,
};

function getStatusStyle(status) {
  const base = { ...statusBadgeBase };
  const normalized = (status || "").toLowerCase();

  if (normalized === "open") {
    base.background = "#0f172a";
    base.color = "#facc15";
    base.border = "1px solid #facc15";
  } else if (normalized === "in progress") {
    base.background = "#1d283a";
    base.color = "#93c5fd";
    base.border = "1px solid #3b82f6";
  } else if (normalized === "resolved" || normalized === "closed") {
    base.background = "#052e16";
    base.color = "#bbf7d0";
    base.border = "1px solid #22c55e";
  } else {
    base.background = "#374151";
    base.color = "#e5e7eb";
    base.border = "1px solid #4b5563";
  }
  return base;
}

function getPriorityStyle(priority) {
  const base = { ...statusBadgeBase };
  const normalized = (priority || "").toLowerCase();

  if (normalized === "low") {
    base.background = "#052e16";
    base.color = "#bbf7d0";
    base.border = "1px solid #22c55e";
  } else if (normalized === "medium") {
    base.background = "#0f172a";
    base.color = "#facc15";
    base.border = "1px solid #facc15";
  } else if (normalized === "high") {
    base.background = "#1d283a";
    base.color = "#93c5fd";
    base.border = "1px solid #3b82f6";
  } else if (normalized === "urgent") {
    base.background = "#7f1d1d";
    base.color = "#fecaca";
    base.border = "1px solid #ef4444";
  } else {
    base.background = "#374151";
    base.color = "#e5e7eb";
    base.border = "1px solid #4b5563";
  }
  return base;
}

// ===== Modal styles =====
const modalBackdropStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 40,
};

const modalCardStyle = {
  width: "420px",
  maxWidth: "90vw",
  borderRadius: "18px",
  background:
    "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.98))",
  border: "1px solid #111827",
  boxShadow: "0 22px 80px rgba(0, 0, 0, 0.9)",
  padding: "18px 18px 16px",
};

const modalTitleStyle = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#f9fafb",
  marginBottom: "4px",
};

const modalSubStyle = {
  fontSize: "12px",
  color: "#9ca3af",
  marginBottom: "12px",
};

const fieldLabelStyle = {
  fontSize: "11px",
  fontWeight: 500,
  color: "#d1d5db",
  marginBottom: "3px",
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
  resize: "vertical",
  minHeight: "70px",
};

const modalFooterStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
  marginTop: "14px",
};

const errorBoxStyle = {
  marginTop: "8px",
  fontSize: "11px",
  color: "#fecaca",
  background: "#7f1d1d",
  borderRadius: "8px",
  padding: "6px 8px",
};

// ===== Priority & Queue options =====
const PRIORITY_OPTIONS = [
  { id: 1, label: "High" },
  { id: 2, label: "Medium" },
  { id: 3, label: "Low" },
];

const QUEUE_OPTIONS = [
  { id: 1, label: "HR" },
  { id: 2, label: "IT" },
  { id: 3, label: "Facilities" },
  { id: 4, label: "Other" },
];

export default function UserDashboard({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // DETAIL MODAL STATE
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [ticketDetail, setTicketDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  // new ticket form
  const [newTitle, setNewTitle] = useState("");
  const [newQueue, setNewQueue] = useState("1");
  const [newPriority, setNewPriority] = useState("2");
  const [newDesc, setNewDesc] = useState("");

  // ===== Tickets list =====
  const fetchTickets = () => {
    api.get("/api/tickets/")
      .then((res) => setTickets(res.data))
      .catch(() => setTickets([]));
  };

  // ===== Ticket detail + comments =====
  const fetchTicketDetail = async (ticketId) => {
    setLoadingDetail(true);
    try {
      const ticketRes = await api.get(`/api/tickets/${ticketId}/`);
      setTicketDetail(ticketRes.data);

      if (ticketRes.data.thread_id) {
        // FIXED: Changed from /api/threads/ to /api/comment-threads/
        const threadRes = await api.get(`/api/comment-threads/${ticketRes.data.thread_id}/`);
        setComments(threadRes.data.comments || []);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Failed to load ticket detail:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ===== Update ticket status (PATCH) =====
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await api.patch(`/api/tickets/${ticketId}/`, { status: newStatus });
      await fetchTickets();
      await fetchTicketDetail(ticketId);
    } catch (error) {
      console.error("Failed to update status:", error.response?.data || error);
    }
  };

  // ===== Post new comment =====
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!ticketDetail?.thread_id) return;

    setPostingComment(true);
    try {
      await api.post("/api/comments/", {
        thread: ticketDetail.thread_id,
        comment: newComment,
      });
      setNewComment("");
      await fetchTicketDetail(selectedTicketId);
    } catch (error) {
      console.error(
        "Failed to post comment:",
        error.response?.status,
        error.response?.data
      );
    } finally {
      setPostingComment(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setShowDetail(true);
    fetchTicketDetail(ticketId);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setSelectedTicketId(null);
    setTicketDetail(null);
    setComments([]);
    setNewComment("");
  };

  const filteredTickets = tickets.filter((t) => {
    const statusLabel = (t.status_label || "").toLowerCase();
    const matchStatus =
      filterStatus === "all" ||
      statusLabel === filterStatus ||
      (filterStatus === "resolved" && statusLabel === "closed");

    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.subject?.toLowerCase().includes(q) ||
      t.id?.toString().includes(q);

    return matchStatus && matchSearch;
  });

  const total = tickets.length;
  const openCount = tickets.filter(
    (t) => (t.status_label || "").toLowerCase() === "open"
  ).length;
  const resolvedCount = tickets.filter(
    (t) => (t.status_label || "").toLowerCase() === "closed"
  ).length;
  const progressCount = tickets.filter(
    (t) => (t.status_label || "").toLowerCase() === "in progress"
  ).length;

  const resetNewTicketForm = () => {
    setNewTitle("");
    setNewQueue("1");
    setNewPriority("2");
    setNewDesc("");
    setCreateError("");
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      setCreateError("Subject and description are required.");
      return;
    }

    setCreating(true);
    setCreateError("");
    try {
      await api.post("/api/tickets/", {
        subject: newTitle,
        description: newDesc,
        queue: Number(newQueue),
        priority_id: Number(newPriority),
      });
      setCreating(false);
      setShowNewModal(false);
      resetNewTicketForm();
      fetchTickets();
    } catch {
      setCreating(false);
      setCreateError("Failed to create ticket. Please try again.");
    }
  };

  return (
    <div style={pageStyle}>
      {/* top bar */}
      <div style={topBarStyle}>
        <div style={titleBlockStyle}>
          <h1 style={h1Style}>Tickets</h1>
          <span style={subtitleStyle}>
            View, filter, and update your tickets.
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button style={outlineBtnStyle} onClick={onLogout}>
            Logout
          </button>
          <button
            style={primaryBtnStyle}
            onClick={() => {
              resetNewTicketForm();
              setShowNewModal(true);
            }}
          >
            + New ticket
          </button>
        </div>
      </div>

      {/* stats */}
      <div style={statsRowStyle}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Total</div>
          <div style={statValueStyle}>{total}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Open</div>
          <div style={statValueStyle}>{openCount}</div>
          <div style={statSubStyle}>Need attention</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>In Progress</div>
          <div style={statValueStyle}>{progressCount}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Resolved</div>
          <div style={statValueStyle}>{resolvedCount}</div>
        </div>
      </div>

      {/* tickets panel */}
      <div style={panelStyle}>
        <div style={filterRowStyle}>
          <input
            style={searchInputStyle}
            placeholder="Search by ID or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={selectStyle}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td
                    style={{
                      ...tdBase,
                      padding: "14px 10px",
                      color: "#6b7280",
                    }}
                    colSpan={5}
                  >
                    No tickets match the current filters.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t, index) => (
                  <tr
                    key={t.id}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "rgba(15,23,42,0.9)"
                          : "rgba(15,23,42,0.96)",
                      cursor: "pointer",
                    }}
                    onClick={() => handleTicketClick(t.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#020617";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 0
                          ? "rgba(15,23,42,0.9)"
                          : "rgba(15,23,42,0.96)";
                    }}
                  >
                    <td style={tdBase}>#{t.id}</td>
                    <td style={tdBase}>{t.subject}</td>
                    <td style={tdBase}>
                      <span style={getStatusStyle(t.status_label)}>
                        {t.status_label || "—"}
                      </span>
                    </td>
                    <td style={tdBase}>
                      <span style={getPriorityStyle(t.priority_label)}>
                        {t.priority_label || "—"}
                      </span>
                    </td>
                    <td style={tdBase}>
                      {t.creation_time
                        ? new Date(t.creation_time).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={footerTextStyle}>
          Showing {filteredTickets.length} of {total} tickets.
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div style={modalBackdropStyle}>
          <div style={modalCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={modalTitleStyle}>New ticket</div>
                <div style={modalSubStyle}>
                  Describe the issue so the team can help you quickly.
                </div>
              </div>
              <button
                style={outlineBtnStyle}
                onClick={() => setShowNewModal(false)}
              >
                Close
              </button>
            </div>

            {createError && <div style={errorBoxStyle}>{createError}</div>}

            <form onSubmit={handleCreateTicket} style={{ marginTop: "12px" }}>
              <div style={{ marginBottom: "10px" }}>
                <div style={fieldLabelStyle}>Subject</div>
                <input
                  style={fieldInputStyle}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Short summary of the issue"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "1 1 140px" }}>
                  <div style={fieldLabelStyle}>Queue</div>
                  <select
                    style={fieldInputStyle}
                    value={newQueue}
                    onChange={(e) => setNewQueue(e.target.value)}
                  >
                    {QUEUE_OPTIONS.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: "1 1 140px" }}>
                  <div style={fieldLabelStyle}>Priority</div>
                  <select
                    style={fieldInputStyle}
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div style={fieldLabelStyle}>Description</div>
                <textarea
                  style={textAreaStyle}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Include steps to reproduce, expected behavior, screenshots, etc."
                />
              </div>

              <div style={modalFooterStyle}>
                <button
                  type="button"
                  style={outlineBtnStyle}
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...primaryBtnStyle,
                    opacity: creating ? 0.7 : 1,
                    cursor: creating ? "wait" : "pointer",
                  }}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAIL MODAL */}
      {showDetail && (
        <div style={modalBackdropStyle}>
          <div
            style={{
              ...modalCardStyle,
              width: "580px",
              maxWidth: "95vw",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div>
                <div style={modalTitleStyle}>
                  Ticket #{ticketDetail?.id || "—"} -{" "}
                  {ticketDetail?.subject || "Loading..."}
                </div>
                <div style={modalSubStyle}>
                  {loadingDetail
                    ? "Loading details..."
                    : `${comments.length} comment${
                        comments.length !== 1 ? "s" : ""
                      }`}
                </div>
              </div>
              <button style={outlineBtnStyle} onClick={closeDetail}>
                Close
              </button>
            </div>

            {loadingDetail ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#9ca3af",
                }}
              >
                Loading ticket details...
              </div>
            ) : ticketDetail ? (
              <>
                {/* Ticket Info */}
                <div
                  style={{
                    background: "rgba(15,23,42,0.5)",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid rgba(59,130,246,0.2)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                          marginRight: "8px",
                        }}
                      >
                        Status:
                      </span>
                      <span style={getStatusStyle(ticketDetail.status_label)}>
                        {ticketDetail.status_label || "—"}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                          marginRight: "8px",
                        }}
                      >
                        Priority:
                      </span>
                      <span
                        style={getPriorityStyle(ticketDetail.priority_label)}
                      >
                        {ticketDetail.priority_label || "—"}
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#9ca3af",
                          marginRight: "8px",
                        }}
                      >
                        Queue:
                      </span>
                      {QUEUE_OPTIONS.find(
                        (q) => q.id === ticketDetail.queue
                      )?.label ||
                        ticketDetail.queue ||
                        "—"}
                    </div>
                  </div>

                  {/* Status action buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "4px",
                    }}
                  >
                    {(ticketDetail.status === 1 ||
                      (ticketDetail.status_label || "")
                        .toLowerCase()
                        .includes("open")) && (
                      <button
                        type="button"
                        style={outlineBtnStyle}
                        onClick={() => updateTicketStatus(ticketDetail.id, 2)}
                      >
                        Mark Resolved
                      </button>
                    )}

                    {(ticketDetail.status === 2 ||
                      (ticketDetail.status_label || "")
                        .toLowerCase()
                        .includes("closed")) && (
                      <button
                        type="button"
                        style={outlineBtnStyle}
                        onClick={() => updateTicketStatus(ticketDetail.id, 1)}
                      >
                        Reopen
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      marginTop: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    Created:{" "}
                    {ticketDetail.creation_time
                      ? new Date(
                          ticketDetail.creation_time
                        ).toLocaleString()
                      : "—"}
                  </div>
                  <div style={{ lineHeight: "1.5" }}>
                    {ticketDetail.description || "No description provided."}
                  </div>
                </div>

                {/* Comments */}
                <div style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#f9fafb",
                      marginBottom: "12px",
                    }}
                  >
                    Comments ({comments.length})
                  </div>
                  {comments.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#9ca3af",
                        fontSize: "13px",
                      }}
                    >
                      No comments yet. Add the first one below!
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          background: "rgba(15,23,42,0.5)",
                          borderRadius: "10px",
                          padding: "12px",
                          marginBottom: "10px",
                          borderLeft: "3px solid #3b82f6",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "6px",
                          }}
                        >
                          <span
                            style={{ fontSize: "11px", color: "#9ca3af" }}
                          >
                            User #{comment.user || "—"}
                          </span>
                          <span
                            style={{ fontSize: "11px", color: "#6b7280" }}
                          >
                            {comment.comment_time
                              ? new Date(
                                  comment.comment_time
                                ).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <div
                          style={{ fontSize: "13px", lineHeight: "1.4" }}
                        >
                          {comment.comment}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handlePostComment}>
                  <div style={{ marginBottom: "12px" }}>
                    <div style={fieldLabelStyle}>Add a comment</div>
                    <textarea
                      style={{
                        ...textAreaStyle,
                        minHeight: "80px",
                        fontSize: "13px",
                      }}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share updates, questions, or additional details..."
                      disabled={postingComment}
                    />
                  </div>
                  <div style={modalFooterStyle}>
                    <button
                      type="button"
                      style={outlineBtnStyle}
                      onClick={closeDetail}
                      disabled={postingComment}
                    >
                      Close Ticket
                    </button>
                    <button
                      type="submit"
                      style={{
                        ...primaryBtnStyle,
                        opacity: postingComment ? 0.7 : 1,
                        cursor: postingComment ? "wait" : "pointer",
                      }}
                      disabled={postingComment || !ticketDetail?.thread_id}
                    >
                      {postingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#9ca3af",
                }}
              >
                Failed to load ticket details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
