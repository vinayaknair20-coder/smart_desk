import { useState, useEffect, useRef } from "react";
import api from "../api/client";

// ===== Typography & Layout =====
const containerStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
};

const headerStyle = {
    padding: "20px 24px",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
};

const titleStyle = {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "8px",
};

const metaRowStyle = {
    display: "flex",
    gap: "12px",
    fontSize: "12px",
    color: "#64748b",
};

const chatAreaStyle = {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    scrollBehavior: "smooth",
};

// ===== Message Bubbles =====
const messageWrapperStyle = (isSelf) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: isSelf ? "flex-end" : "flex-start",
    maxWidth: "85%",
    alignSelf: isSelf ? "flex-end" : "flex-start",
});

const bubbleStyle = (isSelf, isSystem) => {
    if (isSystem) {
        return {
            padding: "8px 16px",
            borderRadius: "12px",
            background: "#e2e8f0",
            color: "#475569",
            fontSize: "13px",
            textAlign: "center",
            alignSelf: "center",
            border: "1px solid #cbd5e1",
        };
    }

    return {
        padding: "12px 16px",
        borderRadius: isSelf ? "16px 16px 0 16px" : "16px 16px 16px 0",
        background: isSelf
            ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            : "#f0f4f8",
        color: isSelf ? "#f8fafc" : "#1e293b",
        fontSize: "14px",
        lineHeight: "1.5",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    };
};

const senderNameStyle = {
    fontSize: "11px",
    color: "#475569",
    marginBottom: "4px",
    paddingLeft: "4px",
};

const timestampStyle = {
    fontSize: "10px",
    color: "rgba(0, 0, 0, 0.5)",
    marginTop: "6px",
    textAlign: "right",
};

// ===== Input Area =====
const inputAreaStyle = {
    padding: "20px",
    background: "#ffffff",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
};

const inputWrapperStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
};

const textareaStyle = {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    background: "#f0f4f8",
    backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    border: "1px solid #cbd5e1",
    color: "#1e293b",
    fontSize: "14px",
    resize: "none",
    minHeight: "44px",
    maxHeight: "120px",
    outline: "none",
    fontFamily: "inherit",
};

const sendBtnStyle = {
    padding: "10px 20px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#ffffff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "14px",
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const cannedSelectStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    background: "#e2e8f0",
    border: "none",
    color: "#475569",
    fontSize: "12px",
    outline: "none",
    cursor: "pointer",
    width: "fit-content",
};

// ===== Utils =====
const STATUS_LABELS = { 1: "Open", 2: "Closed" };
const PRIORITY_LABELS = { 1: "High", 2: "Medium", 3: "Low" };
const QUEUE_LABELS = { 1: "HR", 2: "IT", 3: "Facilities", 4: "Other" };

const badgeStyle = (type, value) => {
    const base = {
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 500,
    };

    if (type === "status") {
        if (value === 1) return { ...base, background: "rgba(234, 179, 8, 0.1)", color: "#facc15", border: "1px solid rgba(234, 179, 8, 0.2)" };
        if (value === 2) return { ...base, background: "rgba(34, 197, 94, 0.1)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.2)" };
    }

    if (type === "priority") {
        if (value === 1) return { ...base, background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)" };
        return { ...base, background: "rgba(59, 130, 246, 0.1)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.2)" };
    }

    return base;
};

export default function ChatInterface({
    ticket,
    currentUser,
    onUpdateTicket,
    cannedResponses = [] // Only passed if user is agent
}) {
    const [comments, setComments] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const isAgent = currentUser.role === 3 || currentUser.role === 1;

    const fetchComments = async () => {
        if (!ticket.thread_id) return;
        try {
            const res = await api.get(`/api/comment-threads/${ticket.thread_id}/`);
            setComments(res.data.comments || []);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    useEffect(() => {
        setComments([]);
        if (ticket) {
            if (ticket.thread_id) {
                fetchComments();
            }
        }
    }, [ticket.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [comments, ticket]);

    const handleSend = async () => {
        if (!replyText.trim()) return;

        setLoading(true);
        try {
            let threadId = ticket.thread_id;

            // Create thread if doesn't exist (rare case for legacy tickets)
            if (!threadId) {
                const threadRes = await api.post("/api/comment-threads/", { ticket: ticket.id });
                threadId = threadRes.data.id;
                // Optionally notify parent to update ticket state
            }

            await api.post("/api/comments/", {
                thread: threadId,
                comment: replyText,
            });

            setReplyText("");
            fetchComments();
        } catch (err) {
            console.error("Failed to send message", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCannedChange = (e) => {
        const selected = cannedResponses.find(c => c.id === Number(e.target.value));
        if (selected) {
            setReplyText(selected.response_text);
        }
    };

    // Merge description as first message for display
    const allMessages = [
        {
            id: "desc",
            comment: ticket.description,
            comment_time: ticket.creation_time,
            user_id: ticket.created_user || 0,
            user_name: ticket.created_user_name || "Customer",
            is_system: false,
            is_description: true
        },
        ...comments
    ];

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <div style={titleStyle}>#{ticket.id} {ticket.subject}</div>
                <div style={metaRowStyle}>
                    <span style={badgeStyle("status", ticket.status)}>
                        {STATUS_LABELS[ticket.status]}
                    </span>
                    <span style={badgeStyle("priority", ticket.priority_id)}>
                        {PRIORITY_LABELS[ticket.priority_id]}
                    </span>
                    <span>{QUEUE_LABELS[ticket.queue]} Queue</span>
                    <span>• {new Date(ticket.creation_time).toLocaleString()}</span>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} style={chatAreaStyle}>
                {allMessages.map((msg, idx) => {
                    // If message user matches current user, it's "Self"
                    // Note: description creation user might differ from current user
                    const isSelf = msg.user === currentUser.id || (msg.is_description && msg.user_id === currentUser.id);
                    const isSystem = msg.is_system;

                    return (
                        <div key={idx} style={messageWrapperStyle(isSelf)}>
                            {!isSelf && !isSystem && (
                                <div style={senderNameStyle}>
                                    {msg.is_description
                                        ? `${msg.user_name} (Original Request)`
                                        : (msg.user_name || `User #${msg.user}`)}
                                </div>
                            )}

                            <div style={bubbleStyle(isSelf, isSystem)}>
                                {msg.comment}
                                <div style={timestampStyle}>
                                    {new Date(msg.comment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            {ticket.status === 1 ? (
                <div style={inputAreaStyle}>
                    {isAgent && cannedResponses.length > 0 && (
                        <select style={cannedSelectStyle} onChange={handleCannedChange} defaultValue="">
                            <option value="" disabled>⚡ Use Canned Response</option>
                            {cannedResponses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    )}

                    <div style={inputWrapperStyle}>
                        <textarea
                            style={textareaStyle}
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button
                            style={{ ...sendBtnStyle, opacity: loading ? 0.7 : 1 }}
                            onClick={handleSend}
                            disabled={loading}
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ padding: "8px", background: "#fefcec", borderBottom: "1px solid #fde047", color: "#854d0e", fontSize: "12px", textAlign: "center" }}>
                    This ticket is closed. <button onClick={async () => {
                        try {
                            // Determine API endpoint based on context (User vs Agent dashboard might pass different props,
                            // but component knows ticket.id)
                            // We'll use the api client directly
                            await api.patch(`/api/tickets/${ticket.id}/`, { status: 1 });
                            if (onUpdateTicket) onUpdateTicket(); // Callback to refresh parent
                            // Force reload of comments/state if needed, but parent refresh is best
                            window.location.reload(); // Simple refresh for now to ensure all state syncs
                        } catch (e) {
                            alert("Failed to re-open ticket");
                        }
                    }}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "999px",
                            background: "#334155",
                            color: "#e2e8f0",
                            border: "1px solid #475569",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600
                        }}
                    >
                        ↺ Re-open Ticket
                    </button>
                </div>
            )}
        </div>
    );
}

