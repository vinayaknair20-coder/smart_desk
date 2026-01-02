// src/components/ChatbotModal.jsx
import { useState, useRef, useEffect } from "react";
import api from "../api/client";

// ===== Modal Styles =====
const modalOverlayStyle = {
    position: "fixed",
    bottom: "100px",
    right: "30px",
    width: "380px",
    height: "500px",
    background: "#0f172a",
    borderRadius: "16px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    border: "1px solid #334155",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
    overflow: "hidden",
    animation: "slideIn 0.3s ease-out",
};

const headerStyle = {
    padding: "16px",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    fontWeight: 600,
};

const closeBtnStyle = {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "20px",
};

const chatAreaStyle = {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    background: "#0f172a",
};

const inputAreaStyle = {
    padding: "16px",
    background: "#1e293b",
    borderTop: "1px solid #334155",
    display: "flex",
    gap: "8px",
};

const inputStyle = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#0f172a",
    border: "1px solid #334155",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
};

const sendBtnStyle = {
    padding: "0 16px",
    borderRadius: "8px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
};

// ===== Messages =====
const messageRowStyle = (isUser) => ({
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
});

const bubbleStyle = (isUser) => ({
    background: isUser ? "#3b82f6" : "#334155",
    padding: "10px 14px",
    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    color: isUser ? "#fff" : "#e2e8f0",
    fontSize: "13px",
    lineHeight: "1.5",
    maxWidth: "85%",
    whiteSpace: "pre-wrap",
});

const actionBtnStyle = {
    marginTop: "8px",
    display: "block",
    width: "100%",
    padding: "8px",
    textAlign: "center",
    borderRadius: "6px",
    background: "#f97316",
    color: "white",
    border: "none",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
};

export default function ChatbotModal({ onClose, onNavigate }) {
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hi! 👋 How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Debounced suggestions
    useEffect(() => {
        if (input.length > 1) {
            const timer = setTimeout(() => {
                fetchSuggestions();
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [input]);

    const fetchSuggestions = async () => {
        try {
            const res = await api.get(`/api/knowledge-base/suggest/?q=${encodeURIComponent(input)}`);
            setSuggestions(res.data);
            setShowSuggestions(res.data.length > 0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectSuggestion = (title) => {
        setInput(title);
        setShowSuggestions(false);
        // Automatically send after selection? 
        // User might want to edit, so let's just populate input.
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setShowSuggestions(false);
        setLoading(true);

        try {
            // Gemini AI Chat Logic
            const res = await api.post("/api/chat/", { message: userMsg.text });
            const data = res.data;

            setMessages(prev => [...prev, {
                role: "ai",
                text: data.response,
                showTicketAction: data.show_ticket_option,
                ticketContext: data.ticket_context || userMsg.text
            }]);

        } catch (err) {
            setMessages(prev => [...prev, { role: "ai", text: "Sorry, I had trouble connecting." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = (context) => {
        // Save draft and navigate
        localStorage.setItem("draft_ticket", JSON.stringify({
            subject: "Request from Chatbot",
            description: context
        }));

        // Check auth
        const token = localStorage.getItem("access");
        if (token) onNavigate("user-dashboard");
        else onNavigate("login");
    };

    return (
        <div style={modalOverlayStyle}>
            <div style={headerStyle}>
                <span>🤖 Service Assistant</span>
                <button style={closeBtnStyle} onClick={onClose}>×</button>
            </div>

            <div style={chatAreaStyle} ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={messageRowStyle(msg.role === "user")}>
                        <div style={{ display: "flex", flexDirection: "column", maxWidth: "85%" }}>
                            <div style={bubbleStyle(msg.role === "user")}>
                                {msg.text}
                            </div>
                            {msg.showTicketAction && (
                                <button
                                    style={actionBtnStyle}
                                    onClick={() => handleCreateTicket(msg.ticketContext)}
                                >
                                    🎫 Create Ticket
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div style={{ color: "#64748b", fontSize: "12px" }}>Thinking...</div>}
            </div>

            <div style={{ ...inputAreaStyle, position: "relative" }}>
                {showSuggestions && (
                    <div style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "16px",
                        right: "16px",
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        boxShadow: "0 -10px 25px rgba(0,0,0,0.3)",
                        zIndex: 1100,
                        overflow: "hidden"
                    }}>
                        {suggestions.map(s => (
                            <div
                                key={s.id}
                                onClick={() => handleSelectSuggestion(s.title)}
                                style={{
                                    padding: "10px 14px",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #334155",
                                    color: "#e2e8f0",
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={(e) => e.target.style.background = "#334155"}
                                onMouseLeave={(e) => e.target.style.background = "transparent"}
                            >
                                🔍 {s.title}
                            </div>
                        ))}
                    </div>
                )}
                <input
                    style={inputStyle}
                    placeholder="Type your question..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    onFocus={() => input.length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
                />
                <button style={sendBtnStyle} onClick={handleSend} disabled={loading}>➤</button>
            </div>
        </div>
    );
}
