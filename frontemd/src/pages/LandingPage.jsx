// src/pages/LandingPage.jsx - RESTORED + CHATBOT POPUP
import { useState, useEffect } from "react";
import api from "../api/client";
import ChatbotModal from "../components/ChatbotModal";

// ===== Typography & Layout =====
const pageStyle = {
    minHeight: "100vh",
    background: "#f0f4f8",
    color: "#1e293b",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
};

const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    position: "sticky",
    top: 0,
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
    zIndex: 50,
};

const logoStyle = {
    fontSize: "20px",
    fontWeight: 700,
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

const heroSectionStyle = {
    padding: "60px 40px 40px",
    textAlign: "center",
    background: "radial-gradient(circle at center, rgba(37,99,235,0.1) 0%, rgba(240,244,248,0) 70%)",
};

const h1Style = {
    fontSize: "42px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    background: "linear-gradient(to right, #0f172a, #334155)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "16px",
};

const subtitleStyle = {
    fontSize: "18px",
    color: "#64748b",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
};

// ===== Main Content Grid =====
const mainGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    padding: "40px",
    flex: 1,
};

const sectionCardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    border: "1px solid rgba(226, 232, 240, 1)",
    borderRadius: "24px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
};

const sectionTitleStyle = {
    fontSize: "20px",
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
};

// ===== FAQ Items =====
const faqItemStyle = (isOpen) => ({
    background: isOpen ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.5)",
    border: isOpen ? "1px solid #3b82f6" : "1px solid #cbd5e1",
    borderRadius: "12px",
    marginBottom: "12px",
    overflow: "hidden",
    transition: "all 0.3s ease",
});

const faqHeaderStyle = {
    padding: "16px 20px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: 500,
    color: "#1e293b",
};

const faqBodyStyle = {
    padding: "0 20px 16px",
    color: "#475569",
    fontSize: "13px",
    lineHeight: "1.6",
};

// ===== KB Search =====
const searchInputStyle = {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "16px 20px",
    color: "#0f172a",
    fontSize: "15px",
    outline: "none",
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
    fontFamily: "inherit",
};

const resultCardStyle = {
    background: "rgba(255, 255, 255, 0.8)",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "12px",
    transition: "all 0.2s",
};

// ===== Bottom Action & Chat Fab =====
const bottomBarStyle = {
    position: "sticky",
    bottom: 0,
    background: "rgba(255, 255, 255, 0.9)",
    borderTop: "1px solid #e2e8f0",
    padding: "24px",
    textAlign: "center",
    backdropFilter: "blur(20px)",
};

const ctaButtonStyle = {
    background: "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
    color: "white",
    padding: "14px 28px",
    borderRadius: "999px",
    fontSize: "15px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(234, 88, 12, 0.3)",
};

const fabStyle = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    color: "white",
    border: "none",
    fontSize: "30px",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.5)",
    zIndex: 900,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
};

export default function LandingPage({ onNavigate }) {
    // Dynamic FAQs fetched from backend
    const [faqs, setFaqs] = useState([]);
    const [openFaq, setOpenFaq] = useState(null);
    const [kbQuery, setKbQuery] = useState("");
    const [kbResults, setKbResults] = useState([]);
    const [kbLoading, setKbLoading] = useState(false);

    const [showChatbot, setShowChatbot] = useState(false);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const res = await api.get("/api/faqs/");
            setFaqs(res.data);
        } catch (err) {
            console.error("Failed to fetch FAQs:", err);
        }
    };

    // Debounced search & suggestions
    useEffect(() => {
        if (kbQuery.length > 1) {
            const timer = setTimeout(() => {
                fetchSuggestions();
            }, 300);

            // Also trigger result search after slightly longer delay
            const searchTimer = setTimeout(() => {
                if (kbQuery.length > 2) handleSearch();
            }, 500);

            return () => {
                clearTimeout(timer);
                clearTimeout(searchTimer);
            };
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
            setKbResults([]);
        }
    }, [kbQuery]);

    const fetchSuggestions = async () => {
        try {
            const res = await api.get(`/api/knowledge-base/suggest/?q=${encodeURIComponent(kbQuery)}`);
            setSuggestions(res.data);
            setShowSuggestions(res.data.length > 0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (query = kbQuery) => {
        setKbLoading(true);
        setShowSuggestions(false);
        try {
            const res = await api.get(`/api/knowledge-base/search/?q=${encodeURIComponent(query)}`);
            setKbResults(res.data.results || []);
        } catch (err) {
            console.error(err);
        } finally {
            setKbLoading(false);
        }
    };

    const handleSelectSuggestion = (title) => {
        setKbQuery(title);
        handleSearch(title);
        setShowSuggestions(false);
    };

    const handleContactSupport = () => {
        // If not using chat, manual direct to ticket form
        if (localStorage.getItem("access")) {
            onNavigate("user-dashboard");
        } else {
            onNavigate("login");
        }
    };

    return (
        <div style={pageStyle}>
            <nav style={navStyle}>
                <div style={logoStyle}>
                    <span>🤖</span> Smart Service Desk
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        onClick={() => onNavigate("login")}
                        style={{ ...ctaButtonStyle, background: "transparent", border: "1px solid #475569", boxShadow: "none", color: "#0f172a" }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => onNavigate("register")}
                        style={{ ...ctaButtonStyle, background: "#0f172a", border: "1px solid #0f172a", boxShadow: "none" }}
                    >
                        Sign Up
                    </button>
                </div>
            </nav>

            <div style={heroSectionStyle}>
                <h1 style={h1Style}>How can we help you today?</h1>
                <p style={subtitleStyle}>Search our knowledge base, browse FAQs, or chat with our AI assistant.</p>
            </div>

            <div style={mainGridStyle}>
                {/* Left: FAQs */}
                <div style={sectionCardStyle}>
                    <div style={sectionTitleStyle}>❓ Common Questions</div>
                    <div>
                        {faqs.length === 0 ? (
                            <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>
                                No frequently asked questions yet.
                            </div>
                        ) : (
                            faqs.map((faq, idx) => (
                                <div
                                    key={faq.id}
                                    style={faqItemStyle(openFaq === idx)}
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                >
                                    <div style={faqHeaderStyle}>
                                        {faq.question}
                                        <span>{openFaq === idx ? "−" : "+"}</span>
                                    </div>
                                    {openFaq === idx && (
                                        <div style={faqBodyStyle}>
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: KB Search (RAG) */}
                <div style={sectionCardStyle}>
                    <div style={sectionTitleStyle}>📚 Knowledge Base Search</div>
                    <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                        Powered by GenAI Retrieval Augmented Generation
                    </p>

                    <div style={{ position: "relative" }}>
                        <input
                            style={searchInputStyle}
                            placeholder="e.g., How to configure Outlook signature..."
                            value={kbQuery}
                            onChange={(e) => setKbQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            onFocus={() => kbQuery.length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
                        />
                        {showSuggestions && (
                            <div style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                background: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "12px",
                                marginTop: "-15px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                zIndex: 100,
                                overflow: "hidden"
                            }}>
                                {suggestions.map(s => (
                                    <div
                                        key={s.id}
                                        onClick={() => handleSelectSuggestion(s.title)}
                                        style={{
                                            padding: "12px 20px",
                                            fontSize: "14px",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #f1f5f9",
                                            transition: "background 0.2s"
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = "#f8fafc"}
                                        onMouseLeave={(e) => e.target.style.background = "transparent"}
                                    >
                                        🔍 {s.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", minHeight: "300px" }}>
                        {kbLoading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                Searching...
                            </div>
                        ) : kbResults.length > 0 ? (
                            kbResults.map((res, idx) => (
                                <div key={idx} style={resultCardStyle}>
                                    <div style={{ fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>
                                        {res.title}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                                        {res.content.substring(0, 120)}...
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                                {kbQuery.length > 0 ? "No results found." : "Results will appear here."}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Contact Agent */}
            <div style={bottomBarStyle}>
                <div style={{ marginBottom: "12px", color: "#94a3b8", fontSize: "14px" }}>
                    Need personalized help?
                </div>
                <button
                    style={ctaButtonStyle}
                    onClick={handleContactSupport}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                    Create Support Ticket
                </button>
            </div>

            {/* Chatbot Floating Action Button */}
            {!showChatbot && (
                <button
                    style={fabStyle}
                    onClick={() => setShowChatbot(true)}
                    title="Chat with AI"
                >
                    💬
                </button>
            )}

            {/* Chatbot Modal */}
            {showChatbot && (
                <ChatbotModal
                    onClose={() => setShowChatbot(false)}
                    onNavigate={onNavigate}
                />
            )}
        </div>
    );
}
