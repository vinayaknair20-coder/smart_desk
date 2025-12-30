// src/pages/LandingPage.jsx - Public Landing Page with KB Search
import { useState } from "react";
import api from "../api/client";

const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%)",
    color: "#f9fafb",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const heroStyle = {
    textAlign: "center",
    padding: "80px 20px 40px",
};

const h1Style = {
    fontSize: "48px",
    fontWeight: 700,
    marginBottom: "16px",
    background: "linear-gradient(135deg, #fff, #93c5fd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
};

const subtitleStyle = {
    fontSize: "20px",
    color: "#d1d5db",
    marginBottom: "40px",
};

const searchSectionStyle = {
    maxWidth: "800px",
    margin: "0 auto 60px",
    padding: "0 20px",
};

const searchBoxStyle = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
};

const inputStyle = {
    flex: 1,
    padding: "16px 20px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "2px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
    backdropFilter: "blur(10px)",
};

const searchBtnStyle = {
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: 600,
    borderRadius: "12px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(34,197,94,0.3)",
};

const resultsStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
};

const articleCardStyle = {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "16px",
    padding: "24px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
};

const ctaSectionStyle = {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(0,0,0,0.2)",
};

const ctaBtnStyle = {
    padding: "16px 40px",
    fontSize: "18px",
    fontWeight: 600,
    borderRadius: "999px",
    background: "linear-gradient(135deg, #fb923c, #f97316)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    margin: "0 12px",
    boxShadow: "0 8px 24px rgba(249,115,22,0.4)",
};

const secondaryBtnStyle = {
    ...ctaBtnStyle,
    background: "transparent",
    border: "2px solid #fff",
    boxShadow: "none",
};

export default function LandingPage({ onNavigate }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchMode, setSearchMode] = useState("");

    const handleSearch = async () => {
        if (!query.trim()) return;

        setSearching(true);
        try {
            const res = await api.get(`/api/knowledge-base/search/?q=${encodeURIComponent(query)}`);
            setResults(res.data.results || []);
            setSearchMode(res.data.mode || "");
        } catch (error) {
            console.error("KB search failed:", error);
            setResults([]);
            setSearchMode("error");
        } finally {
            setSearching(false);
        }
    };

    return (
        <div style={pageStyle}>
            {/* Hero Section */}
            <div style={heroStyle}>
                <h1 style={h1Style}>Smart Service Desk</h1>
                <p style={subtitleStyle}>
                    Get instant answers to your questions before creating a ticket
                </p>
            </div>

            {/* Search Section */}
            <div style={searchSectionStyle}>
                <div style={searchBoxStyle}>
                    <input
                        style={inputStyle}
                        placeholder="Search for help... (e.g., 'how to reset password')"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button style={searchBtnStyle} onClick={handleSearch} disabled={searching}>
                        {searching ? "Searching..." : "🔍 Search"}
                    </button>
                </div>

                {searchMode && (
                    <div style={{ fontSize: "14px", color: "#d1d5db", marginBottom: "16px" }}>
                        {searchMode === "semantic" && "🤖 AI-Powered Results"}
                        {searchMode === "keyword_fallback" && "📝 Keyword Search"}
                        {searchMode === "error" && "❌ Search failed - try again"}
                    </div>
                )}

                {/* Results */}
                {results.length > 0 ? (
                    <div style={resultsStyle}>
                        {results.map((article, idx) => (
                            <div key={article.id} style={articleCardStyle}>
                                <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>
                                    {idx + 1}. {article.title}
                                </div>
                                <div style={{ fontSize: "15px", lineHeight: "1.6", color: "#e5e7eb" }}>
                                    {article.content}
                                </div>
                                {article.tags && (
                                    <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                                        {article.tags.split(",").map((tag, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    background: "rgba(59,130,246,0.3)",
                                                    color: "#93c5fd",
                                                    padding: "4px 12px",
                                                    borderRadius: "999px",
                                                    fontSize: "12px",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : query && !searching ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                        No articles found. Try different keywords or contact our support team.
                    </div>
                ) : null}
            </div>

            {/* CTA Section */}
            <div style={ctaSectionStyle}>
                <h2 style={{ fontSize: "32px", fontWeight: 600, marginBottom: "16px" }}>
                    Still need help?
                </h2>
                <p style={{ fontSize: "18px", color: "#d1d5db", marginBottom: "32px" }}>
                    Create a support ticket and our team will assist you
                </p>
                <div>
                    <button style={ctaBtnStyle} onClick={() => onNavigate("/login")}>
                        Login
                    </button>
                    <button style={secondaryBtnStyle} onClick={() => onNavigate("/register")}>
                        Register
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b7280", fontSize: "14px" }}>
                © 2025 Smart Service Desk. All rights reserved.
            </div>
        </div>
    );
}
