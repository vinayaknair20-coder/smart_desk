import { useEffect, useState } from "react";
import api from "../api/client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const pageStyle = {
  minHeight: "100vh",
  background: "#f0f4f8",
  color: "#1e293b",
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
  color: "#0f172a",
};

const subtitleStyle = {
  fontSize: "13px",
  color: "#64748b",
};

const outlineBtnStyle = {
  borderRadius: "999px",
  background: "#ffffff",
  color: "#374151",
  border: "1px solid #d1d5db",
  padding: "7px 14px",
  fontSize: "12px",
  cursor: "pointer",
};

const primaryBtnStyle = {
  borderRadius: "999px",
  background: "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #ea580c 100%)",
  color: "#ffffff",
  border: "none",
  padding: "9px 18px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(248,113,113,0.2)",
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

const dangerBtnStyle = {
  borderRadius: "999px",
  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  color: "#ffffff",
  border: "none",
  padding: "7px 14px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtnStyle = {
  borderRadius: "6px",
  background: "rgba(15,23,42,0.8)",
  color: "#fecaca",
  border: "1px solid #7f1d1d",
  padding: "4px 8px",
  fontSize: "10px",
  cursor: "pointer",
};

const actionBtnStyle = {
  borderRadius: "6px",
  background: "rgba(15,23,42,0.8)",
  color: "#a5b4fc",
  border: "1px solid #4f46e5",
  padding: "4px 10px",
  fontSize: "10px",
  cursor: "pointer",
  marginRight: "4px",
};

const statsRowStyle = {
  display: "flex",
  gap: "16px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const statCardStyle = {
  flex: "0 0 210px",
  borderRadius: "16px",
  flex: "0 0 210px",
  borderRadius: "16px",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  padding: "12px 14px 14px",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
};

const statLabelStyle = {
  fontSize: "11px",
  color: "#64748b",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const statValueStyle = {
  marginTop: "4px",
  fontSize: "22px",
  fontWeight: 600,
  color: "#0f172a",
};

const statSubStyle = {
  marginTop: "2px",
  fontSize: "11px",
  color: "#6366f1",
};

const panelStyle = {
  borderRadius: "18px",
  borderRadius: "18px",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  padding: "14px 16px 18px",
  marginTop: "6px",
  marginBottom: "20px",
};

const sectionTitleStyle = {
  fontSize: "16px",
  fontWeight: 600,
  fontSize: "16px",
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: "12px",
  marginBottom: "12px",
};

const tableWrapperStyle = {
  marginTop: "8px",
  borderRadius: "14px",
  marginTop: "8px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  overflow: "hidden",
  overflow: "hidden",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  fontSize: "12px",
};

const thStyle = {
  background: "#f8fafc",
  color: "#64748b",
  textAlign: "left",
  padding: "9px 12px",
  borderBottom: "1px solid #e2e8f0",
  fontWeight: 500,
};

const tdBase = {
  padding: "9px 12px",
  padding: "9px 12px",
  borderBottom: "1px solid #e2e8f0",
  cursor: "pointer",
  cursor: "pointer",
};

const selectStyle = {
  borderRadius: "8px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  padding: "5px 8px",
  fontSize: "11px",
  outline: "none",
};

const modalBackdropStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.92)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 40,
};

const modalCardStyle = {
  width: "580px",
  maxWidth: "90vw",
  maxHeight: "85vh",
  overflowY: "auto",
  borderRadius: "18px",
  borderRadius: "18px",
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
  padding: "18px 18px 16px",
};

const modalTitleStyle = {
  fontSize: "18px",
  fontWeight: 600,
  fontSize: "18px",
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: "4px",
  marginBottom: "4px",
};

const fieldLabelStyle = {
  fontSize: "11px",
  fontWeight: 500,
  fontSize: "11px",
  fontWeight: 500,
  color: "#475569",
  marginBottom: "3px",
  marginBottom: "3px",
  display: "block",
  marginTop: "10px",
};

const fieldInputStyle = {
  width: "100%",
  borderRadius: "10px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
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

const tabBarStyle = {
  display: "flex",
  gap: "8px",
  marginBottom: "16px",
  display: "flex",
  gap: "8px",
  marginBottom: "16px",
  borderBottom: "1px solid #cbd5e1",
  paddingBottom: "8px",
  flexWrap: "wrap",
  paddingBottom: "8px",
  flexWrap: "wrap",
};

const tabStyle = (active) => ({
  padding: "8px 16px",
  borderRadius: "8px 8px 0 0",
  background: active ? "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #ea580c 100%)" : "transparent",
  padding: "8px 16px",
  borderRadius: "8px 8px 0 0",
  background: active ? "linear-gradient(135deg, #fb923c 0%, #f97316 40%, #ea580c 100%)" : "transparent",
  color: active ? "#ffffff" : "#64748b",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: active ? 600 : 400,
  transition: "all 0.2s",
});

const searchInputStyle = {
  flex: "1 1 220px",
  borderRadius: "999px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  padding: "7px 11px",
  fontSize: "12px",
  outline: "none",
};

const filterRowStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

const statusBadgeBase = {
  display: "inline-block",
  borderRadius: "999px",
  padding: "2px 9px",
  fontSize: "11px",
  fontWeight: 500,
};

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

const ROLE_OPTIONS = [
  { id: 1, label: "Admin" },
  { id: 2, label: "User" },
  { id: 3, label: "Agent" },
];

const QUEUE_MAP = { 1: "HR", 2: "IT", 3: "Facilities", 4: "Other" };
const PRIORITY_MAP = { 1: "High", 2: "Medium", 3: "Low" };
const STATUS_MAP = { 1: "Open", 2: "Closed" };

function getStatusBadge(status) {
  const base = { ...statusBadgeBase };
  if (status === 1) {
    base.background = "#fffbeb";
    base.color = "#d97706";
    base.border = "1px solid #fcd34d";
    return { style: base, text: "Open" };
  } else if (status === 2) {
    base.background = "#dcfce7";
    base.color = "#15803d";
    base.border = "1px solid #86efac";
    return { style: base, text: "Closed" };
  }
  return { style: base, text: "Unknown" };
}

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  const requestSort = (key) => {
    let direction = 'asc';
    // Toggle: If currently sorting by this key in ASC, switch to DESC.
    // Otherwise (different key OR currently DESC), switch to ASC?
    // Wait, usually: Click -> ASC, Click again -> DESC.
    // My previous logic: If key match & asc -> desc. Else asc.
    // If I want "Latest First" (Desc) to be default for ID:
    // When I click ID (currently Desc), I want Asc.
    // When I click ID (currently Asc), I want Desc.
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Combined Filter & Sort
  const getProcessedTickets = () => {
    if (!tickets) return [];

    let result = [...tickets];

    // 1. Filter by Search (ID or Subject)
    if (ticketSearch.trim()) {
      const q = ticketSearch.toLowerCase();
      result = result.filter(t =>
        (t.subject && t.subject.toLowerCase().includes(q)) ||
        String(t.id).includes(q)
      );
    }

    // 2. Filter by Status
    if (statusFilter !== "all") {
      result = result.filter(t => t.status === Number(statusFilter));
    }

    // 3. Filter by Queue
    if (queueFilter !== "all") {
      result = result.filter(t => t.queue === Number(queueFilter));
    }

    // 4. Sort
    result.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      // Number comparison (ID, Queue, Priority, Status, AssignedTo if number)
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }

      // String comparison
      const strA = String(valA || '').toLowerCase();
      const strB = String(valB || '').toLowerCase();

      if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  };
  const [agents, setAgents] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [cannedResponses, setCannedResponses] = useState([]);
  const [slaSettings, setSlaSettings] = useState([]);
  const [analytics, setAnalytics] = useState({
    sla_compliance: 0,
    fcr_rate: 0,
    agent_workload: [],
    total_tickets: 0,
    open_tickets: 0,
    closed_tickets: 0
  });
  const [loading, setLoading] = useState(false);

  // Modals
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showKBModal, setShowKBModal] = useState(false);
  const [showCannedModal, setShowCannedModal] = useState(false);
  const [showSLAModal, setShowSLAModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedKB, setSelectedKB] = useState(null);
  const [selectedCanned, setSelectedCanned] = useState(null);
  const [selectedSLA, setSelectedSLA] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [creating, setCreating] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");
  const [kbSearch, setKbSearch] = useState("");
  const [cannedSearch, setCannedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [queueFilter, setQueueFilter] = useState("all");
  const [notification, setNotification] = useState(null);

  // User form
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("2");

  // Ticket update form
  const [ticketStatus, setTicketStatus] = useState("");
  const [ticketQueue, setTicketQueue] = useState("");
  const [ticketPriority, setTicketPriority] = useState("");
  const [ticketAssignedTo, setTicketAssignedTo] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // KB form
  const [kbTitle, setKbTitle] = useState("");
  const [kbContent, setKbContent] = useState("");
  const [kbTags, setKbTags] = useState("");

  // Canned Response form
  const [cannedTitle, setCannedTitle] = useState("");
  const [cannedText, setCannedText] = useState("");
  const [cannedTags, setCannedTags] = useState("");

  // SLA form
  const [slaPriority, setSlaPriority] = useState("1");
  const [slaMinutes, setSlaMinutes] = useState("");

  // FAQ State
  const [faqs, setFaqs] = useState([]);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqOrder, setFaqOrder] = useState("0");

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users/");
      setUsers(res.data);
      setAgents(res.data.filter(u => u.role === 3));
    } catch (err) {
      console.error("Failed to fetch users:", err);
      showNotification("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/tickets/");
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      showNotification("Failed to load tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      const res = await api.get("/api/faqs/");
      setFaqs(res.data);
    } catch (err) {
      console.error("Failed to fetch FAQs:", err);
      showNotification("Failed to load FAQs", "error");
    }
  };

  const fetchKnowledgeBase = async () => {
    try {
      const res = await api.get("/api/knowledge-base/");
      setKnowledgeBase(res.data);
    } catch (err) {
      console.error("Failed to fetch KB:", err);
      showNotification("Failed to load knowledge base", "error");
    }
  };

  const fetchCannedResponses = async () => {
    try {
      const res = await api.get("/api/canned-responses/");
      setCannedResponses(res.data);
    } catch (err) {
      console.error("Failed to fetch canned responses:", err);
      showNotification("Failed to load canned responses", "error");
    }
  };

  const fetchSLASettings = async () => {
    try {
      const res = await api.get("/api/sla-settings/");
      setSlaSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch SLA settings:", err);
      showNotification("Failed to load SLA settings", "error");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/tickets/analytics/");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/api/users/${userId}/`, { role: newRole });
      showNotification("User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Failed to update role:", error);
      showNotification("Failed to update role", "error");
    }
  };

  const confirmDelete = (type, id) => {
    setDeleteTarget({ type, id });
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "user") {
        await api.delete(`/api/users/${deleteTarget.id}/`);
        showNotification("User deleted successfully");
        fetchUsers();
      } else if (deleteTarget.type === "ticket") {
        await api.delete(`/api/tickets/${deleteTarget.id}/`);
        showNotification("Ticket deleted successfully");
        fetchTickets();
        fetchAnalytics();
      } else if (deleteTarget.type === "kb") {
        await api.delete(`/api/knowledge-base/${deleteTarget.id}/`);
        showNotification("KB article deleted successfully");
        fetchKnowledgeBase();
      } else if (deleteTarget.type === "canned") {
        await api.delete(`/api/canned-responses/${deleteTarget.id}/`);
        showNotification("Canned response deleted successfully");
        fetchCannedResponses();
      } else if (deleteTarget.type === "sla") {
        await api.delete(`/api/sla-settings/${deleteTarget.id}/`);
        showNotification("SLA setting deleted successfully");
        fetchSLASettings();
      } else if (deleteTarget.type === "faq") {
        await api.delete(`/api/faqs/${deleteTarget.id}/`);
        showNotification("FAQ deleted successfully");
        fetchFAQs();
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      showNotification("Failed to delete", "error");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  // ... (User Create Handler omitted for brevity, keeping existing)

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim() || !newPassword.trim()) {
      showNotification("Please fill all fields", "error");
      return;
    }

    setCreating(true);
    try {
      await api.post("/api/users/", {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: Number(newRole),
      });
      setCreating(false);
      setShowCreateUser(false);
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("2");
      showNotification("User created successfully");
      fetchUsers();
    } catch (err) {
      setCreating(false);
      showNotification("Failed to create user", "error");
    }
  };

  // ... (Ticket Handlers omitted)
  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setTicketStatus(ticket.status);
    setTicketQueue(ticket.queue);
    setTicketPriority(ticket.priority_id);
    setTicketAssignedTo(ticket.assigned_to || "");
    setInternalNote("");
    setShowTicketModal(true);
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await api.patch(`/api/tickets/${selectedTicket.id}/`, {
        status: Number(ticketStatus),
        queue: Number(ticketQueue),
        priority_id: Number(ticketPriority),
        assigned_to: ticketAssignedTo ? Number(ticketAssignedTo) : null,
      });

      setShowTicketModal(false);
      showNotification("Ticket updated successfully");
      fetchTickets();
      fetchAnalytics();
    } catch (error) {
      console.error("Failed to update ticket:", error);
      showNotification("Failed to update ticket", "error");
    }
  };

  const handleBulkResolve = async () => {
    const openTickets = tickets.filter(t => t.status === 1);
    if (openTickets.length === 0) {
      showNotification("No open tickets to resolve", "error");
      return;
    }

    if (!window.confirm(`Resolve all ${openTickets.length} open tickets?`)) return;

    try {
      await Promise.all(
        openTickets.map(t => api.patch(`/api/tickets/${t.id}/`, { status: 2 }))
      );
      showNotification(`${openTickets.length} tickets resolved`);
      fetchTickets();
      fetchAnalytics();
    } catch (error) {
      showNotification("Failed to resolve tickets", "error");
    }
  };

  const handleResolveTicket = async (ticketId) => {
    try {
      await api.patch(`/api/tickets/${ticketId}/`, { status: 2 });
      showNotification("Ticket resolved");
      fetchTickets();
      fetchAnalytics();
      if (showTicketModal) setShowTicketModal(false);
    } catch (error) {
      showNotification("Failed to resolve ticket", "error");
    }
  };

  // ... (KB Handlers omitted)
  const openKBModal = (kb = null) => {
    if (kb) {
      setSelectedKB(kb);
      setKbTitle(kb.title);
      setKbContent(kb.content);
      setKbTags(kb.tags);
    } else {
      setSelectedKB(null);
      setKbTitle("");
      setKbContent("");
      setKbTags("");
    }
    setShowKBModal(true);
  };

  const handleSaveKB = async (e) => {
    e.preventDefault();
    if (!kbTitle.trim() || !kbContent.trim()) {
      showNotification("Title and content are required", "error");
      return;
    }

    setCreating(true);
    try {
      if (selectedKB) {
        await api.patch(`/api/knowledge-base/${selectedKB.id}/`, {
          title: kbTitle,
          content: kbContent,
          tags: kbTags,
        });
        showNotification("KB article updated");
      } else {
        await api.post("/api/knowledge-base/", {
          title: kbTitle,
          content: kbContent,
          tags: kbTags,
        });
        showNotification("KB article created");
      }
      setShowKBModal(false);
      fetchKnowledgeBase();
    } catch (error) {
      showNotification("Failed to save KB article", "error");
    } finally {
      setCreating(false);
    }
  };

  // ... (Canned & SLA Handlers omitted)
  const openCannedModal = (canned = null) => {
    if (canned) {
      setSelectedCanned(canned);
      setCannedTitle(canned.title);
      setCannedText(canned.response_text);
      setCannedTags(canned.search_tags);
    } else {
      setSelectedCanned(null);
      setCannedTitle("");
      setCannedText("");
      setCannedTags("");
    }
    setShowCannedModal(true);
  };

  const handleSaveCanned = async (e) => {
    e.preventDefault();
    if (!cannedTitle.trim() || !cannedText.trim()) {
      showNotification("Title and text are required", "error");
      return;
    }

    setCreating(true);
    try {
      if (selectedCanned) {
        await api.patch(`/api/canned-responses/${selectedCanned.id}/`, {
          title: cannedTitle,
          response_text: cannedText,
          search_tags: cannedTags,
        });
        showNotification("Canned response updated");
      } else {
        await api.post("/api/canned-responses/", {
          title: cannedTitle,
          response_text: cannedText,
          search_tags: cannedTags,
        });
        showNotification("Canned response created");
      }
      setShowCannedModal(false);
      fetchCannedResponses();
    } catch (error) {
      showNotification("Failed to save canned response", "error");
    } finally {
      setCreating(false);
    }
  };

  const openSLAModal = (sla = null) => {
    if (sla) {
      setSelectedSLA(sla);
      setSlaPriority(sla.priority_id.toString());
      setSlaMinutes(sla.sla_time_minutes.toString());
    } else {
      setSelectedSLA(null);
      setSlaPriority("1");
      setSlaMinutes("");
    }
    setShowSLAModal(true);
  };

  const handleSaveSLA = async (e) => {
    e.preventDefault();
    if (!slaMinutes.trim()) {
      showNotification("SLA time is required", "error");
      return;
    }

    setCreating(true);
    try {
      if (selectedSLA) {
        await api.patch(`/api/sla-settings/${selectedSLA.id}/`, {
          sla_time_minutes: Number(slaMinutes),
        });
        showNotification("SLA setting updated");
      } else {
        await api.post("/api/sla-settings/", {
          priority_id: Number(slaPriority),
          sla_time_minutes: Number(slaMinutes),
        });
        showNotification("SLA setting created");
      }
      setShowSLAModal(false);
      fetchSLASettings();
    } catch (error) {
      showNotification("Failed to save SLA setting", "error");
    } finally {
      setCreating(false);
    }
  };

  // FAQ Handlers
  const openFAQModal = (faq = null) => {
    if (faq) {
      setSelectedFAQ(faq);
      setFaqQuestion(faq.question);
      setFaqAnswer(faq.answer);
      setFaqOrder(faq.order.toString());
    } else {
      setSelectedFAQ(null);
      setFaqQuestion("");
      setFaqAnswer("");
      setFaqOrder("0");
    }
    setShowFAQModal(true);
  };

  const handleSaveFAQ = async (e) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      showNotification("Question and answer are required", "error");
      return;
    }

    setCreating(true);
    try {
      if (selectedFAQ) {
        await api.patch(`/api/faqs/${selectedFAQ.id}/`, {
          question: faqQuestion,
          answer: faqAnswer,
          order: Number(faqOrder)
        });
        showNotification("FAQ updated");
      } else {
        await api.post("/api/faqs/", {
          question: faqQuestion,
          answer: faqAnswer,
          order: Number(faqOrder)
        });
        showNotification("FAQ created");
      }
      setShowFAQModal(false);
      fetchFAQs();
    } catch (error) {
      showNotification("Failed to save FAQ", "error");
    } finally {
      setCreating(false);
    }
  };

  const exportData = (type) => {
    let data, csv;
    if (type === "users") {
      data = users;
      csv = "ID,Username,Email,Role\n" + users.map(u => `${u.id},${u.username},${u.email},${ROLE_OPTIONS.find(r => r.id === u.role)?.label}`).join("\n");
    } else if (type === "faqs") {
      data = faqs;
      csv = "ID,Question,Answer,Order\n" + faqs.map(f => `${f.id},"${f.question}","${f.answer}",${f.order}`).join("\n");
    } else {
      data = tickets;
      csv = "ID,Subject,Queue,Priority,Status\n" + tickets.map(t => `${t.id},"${t.subject}",${QUEUE_MAP[t.queue]},${PRIORITY_MAP[t.priority_id]},${STATUS_MAP[t.status]}`).join("\n");
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showNotification(`${type} exported successfully`);
  };

  useEffect(() => {
    fetchUsers();
    fetchTickets();
    fetchKnowledgeBase();
    fetchCannedResponses();
    fetchSLASettings();
    fetchAnalytics();
    fetchFAQs();
  }, []);

  const totalUsers = users.length;
  const agentCount = users.filter((u) => u.role === 3).length;
  const adminCount = users.filter((u) => u.role === 1).length;
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 1).length;
  const closedTickets = tickets.filter((t) => t.status === 2).length;
  const hrTickets = tickets.filter(t => t.queue === 1).length;
  const itTickets = tickets.filter(t => t.queue === 2).length;
  const facilitiesTickets = tickets.filter(t => t.queue === 3).length;

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
  );



  const filteredKB = knowledgeBase.filter(kb =>
    (kb.title || "").toLowerCase().includes(kbSearch.toLowerCase()) ||
    (kb.tags || "").toLowerCase().includes(kbSearch.toLowerCase())
  );

  const filteredCanned = cannedResponses.filter(c =>
    (c.title || "").toLowerCase().includes(cannedSearch.toLowerCase()) ||
    (c.search_tags || "").toLowerCase().includes(cannedSearch.toLowerCase())
  );

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
          <h1 style={h1Style}>Admin Dashboard</h1>
          <span style={subtitleStyle}>System overview and management</span>
        </div>
        <button style={outlineBtnStyle} onClick={onLogout}>Logout</button>
      </div>

      <div style={statsRowStyle}>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Total Users</div>
          <div style={statValueStyle}>{totalUsers}</div>
          <div style={statSubStyle}>{adminCount} admins, {agentCount} agents</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Total Tickets</div>
          <div style={statValueStyle}>{totalTickets}</div>
          <div style={statSubStyle}>{openTickets} open, {closedTickets} closed</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Knowledge Base</div>
          <div style={statValueStyle}>{knowledgeBase.length}</div>
          <div style={statSubStyle}>Articles</div>
        </div>
        <div style={statCardStyle}>
          <div style={statLabelStyle}>Canned Responses</div>
          <div style={statValueStyle}>{cannedResponses.length}</div>
          <div style={statSubStyle}>Templates</div>
        </div>
      </div>

      <div style={tabBarStyle}>
        <button style={tabStyle(activeTab === "overview")} onClick={() => setActiveTab("overview")}>📊 Overview</button>
        <button style={tabStyle(activeTab === "users")} onClick={() => setActiveTab("users")}>👥 Users</button>
        <button style={tabStyle(activeTab === "tickets")} onClick={() => setActiveTab("tickets")}>🎫 Tickets</button>
        <button style={tabStyle(activeTab === "knowledge")} onClick={() => setActiveTab("knowledge")}>📚 Knowledge Base</button>
        <button style={tabStyle(activeTab === "canned")} onClick={() => setActiveTab("canned")}>💬 Canned Responses</button>
        <button style={tabStyle(activeTab === "sla")} onClick={() => setActiveTab("sla")}>⏱️ SLA Settings</button>
        <button style={tabStyle(activeTab === "faqs")} onClick={() => setActiveTab("faqs")}>❓ FAQs</button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div style={panelStyle}>
          <div style={sectionTitleStyle}>System Health & Performance</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "16px" }}>
            {/* SLA Compliance Doughnut */}
            <div style={{ ...statCardStyle, background: '#ffffff', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={statLabelStyle}>SLA Compliance</div>
              <div style={{ width: '100%', height: '180px', margin: '15px 0', position: 'relative' }}>
                <Doughnut
                  data={{
                    labels: ['Met SLA', 'Missed'],
                    datasets: [{
                      data: [analytics.sla_compliance, Math.max(0, 100 - analytics.sla_compliance)],
                      backgroundColor: ['#10b981', '#ef4444'],
                      borderColor: 'transparent',
                      hoverOffset: 4
                    }]
                  }}
                  options={{
                    cutout: '75%',
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ ...statValueStyle, marginTop: 0 }}>{analytics.sla_compliance}%</div>
                </div>
              </div>
            </div>

            {/* Ticket Status Pie */}
            <div style={{ ...statCardStyle, background: '#ffffff', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={statLabelStyle}>Ticket Distribution</div>
              <div style={{ width: '100%', height: '180px', margin: '15px 0' }}>
                <Pie
                  data={{
                    labels: ['Open', 'Closed'],
                    datasets: [{
                      data: [analytics.open_tickets, analytics.closed_tickets],
                      backgroundColor: ['#facc15', '#22c55e'],
                      borderColor: 'transparent',
                      hoverOffset: 4
                    }]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', boxWidth: 10, font: { size: 10 } } } }
                  }}
                />
              </div>
            </div>

            {/* Agent Workload Bar */}
            <div style={{ ...statCardStyle, background: '#ffffff', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={statLabelStyle}>Agent Workload (Active Tickets)</div>
              <div style={{ width: '100%', height: '180px', margin: '15px 0' }}>
                <Bar
                  data={{
                    labels: analytics.agent_workload.map(a => a.username),
                    datasets: [{
                      label: 'Tickets',
                      data: analytics.agent_workload.map(a => a.count),
                      backgroundColor: '#6366f1',
                      borderRadius: 4
                    }]
                  }}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: { grid: { color: 'rgba(0,0,0,0.1)' }, ticks: { color: '#64748b', font: { size: 10 } }, beginAtZero: true },
                      x: { ticks: { color: '#64748b', font: { size: 10 } } }
                    },
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "14px", color: "#0f172a", marginBottom: "12px" }}>Recent Activity</h3>
            <button style={successBtnStyle} onClick={handleBulkResolve}>Resolve All Open</button>
          </div>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('id')}>Ticket ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('created_user_name')}>Requester {sortConfig.key === 'created_user_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('subject')}>Subject {sortConfig.key === 'subject' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('queue')}>Queue {sortConfig.key === 'queue' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getProcessedTickets().slice(0, 10).map((t, index) => {
                  const statusBadge = getStatusBadge(t.status);
                  return (
                    <tr key={t.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      <td style={tdBase} onClick={() => openTicketModal(t)}>#{t.id}</td>
                      <td style={tdBase} onClick={() => openTicketModal(t)}>{t.created_user_name || "User"}</td>
                      <td style={tdBase} onClick={() => openTicketModal(t)}>{t.subject}</td>
                      <td style={tdBase} onClick={() => openTicketModal(t)}>{QUEUE_MAP[t.queue]}</td>
                      <td style={tdBase} onClick={() => openTicketModal(t)}><span style={statusBadge.style}>{statusBadge.text}</span></td>
                      <td style={{ ...tdBase, cursor: "default" }}>
                        <button style={actionBtnStyle} onClick={() => openTicketModal(t)}>View</button>
                        {t.status === 1 && (
                          <button style={{ ...actionBtnStyle, color: "#bbf7d0", border: "1px solid #22c55e" }} onClick={() => handleResolveTicket(t.id)}>Resolve</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {tickets.length === 0 && (
                  <tr><td style={{ ...tdBase, color: "#6b7280", padding: "14px", cursor: "default" }} colSpan={5}>No tickets yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={sectionTitleStyle}>User Management ({filteredUsers.length})</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={outlineBtnStyle} onClick={() => exportData("users")}>Export CSV</button>
              <button style={primaryBtnStyle} onClick={() => setShowCreateUser(true)}>+ Create User</button>
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <input
              style={searchInputStyle}
              placeholder="Search users by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td style={{ ...tdBase, padding: "14px 10px", color: "#6b7280", cursor: "default" }} colSpan={5}>No users found</td></tr>
                ) : (
                  filteredUsers.map((u, index) => (
                    <tr key={u.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      <td style={{ ...tdBase, cursor: "default" }}>{u.id}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>{u.username}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>{u.email || "—"}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>
                        <select style={selectStyle} value={u.role} onChange={(e) => updateUserRole(u.id, Number(e.target.value))}>
                          {ROLE_OPTIONS.map((r) => (<option key={r.id} value={r.id}>{r.label}</option>))}
                        </select>
                      </td>
                      <td style={{ ...tdBase, cursor: "default" }}>
                        <button style={deleteBtnStyle} onClick={() => confirmDelete("user", u.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TICKETS TAB */}
      {activeTab === "tickets" && (
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={sectionTitleStyle}>All Tickets ({getProcessedTickets().length})</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={outlineBtnStyle} onClick={() => exportData("tickets")}>Export CSV</button>
              <button style={successBtnStyle} onClick={handleBulkResolve}>Resolve All Open</button>
            </div>
          </div>

          <div style={filterRowStyle}>
            <input
              style={searchInputStyle}
              placeholder="Search tickets..."
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
            />
          </div>
          <div style={filterRowStyle}>
            <select style={{ ...selectStyle, flex: 1 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="1">Open</option>
              <option value="2">Closed</option>
            </select>
            <select style={{ ...selectStyle, flex: 1 }} value={queueFilter} onChange={e => setQueueFilter(e.target.value)}>
              <option value="all">All Queues</option>
              <option value="1">HR</option>
              <option value="2">IT</option>
              <option value="3">Facilities</option>
              <option value="4">Other</option>
            </select>
          </div>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('created_user_name')}>Requester {sortConfig.key === 'created_user_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('subject')}>Subject {sortConfig.key === 'subject' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('queue')}>Queue {sortConfig.key === 'queue' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('priority_id')}>Priority {sortConfig.key === 'priority_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => requestSort('assigned_to')}>Assigned To {sortConfig.key === 'assigned_to' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getProcessedTickets().length === 0 ? (
                  <tr><td style={{ ...tdBase, padding: "14px 10px", color: "#6b7280", cursor: "default" }} colSpan={7}>No tickets found</td></tr>
                ) : (
                  getProcessedTickets().map((t, index) => {
                    const statusBadge = getStatusBadge(t.status);
                    const assignedAgent = agents.find(a => a.id === t.assigned_to);
                    return (
                      <tr key={t.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                        <td style={tdBase} onClick={() => openTicketModal(t)}>#{t.id}</td>
                        <td style={tdBase} onClick={() => openTicketModal(t)}>{t.created_user_name || "User"}</td>
                        <td style={tdBase} onClick={() => openTicketModal(t)}>{t.subject}</td>
                        <td style={tdBase} onClick={() => openTicketModal(t)}>{QUEUE_MAP[t.queue]}</td>
                        <td style={tdBase} onClick={() => openTicketModal(t)}>{PRIORITY_MAP[t.priority_id]}</td>
                        <td style={tdBase} onClick={() => openTicketModal(t)}><span style={statusBadge.style}>{statusBadge.text}</span></td>
                        <td style={tdBase} onClick={() => openTicketModal(t)}>{assignedAgent?.username || "Unassigned"}</td>
                        <td style={{ ...tdBase, cursor: "default" }}>
                          <button style={actionBtnStyle} onClick={() => openTicketModal(t)}>Edit</button>
                          {t.status === 1 && (
                            <button style={{ ...actionBtnStyle, color: "#bbf7d0", border: "1px solid #22c55e" }} onClick={() => handleResolveTicket(t.id)}>Resolve</button>
                          )}
                          <button style={{ ...deleteBtnStyle, marginLeft: "4px" }} onClick={() => confirmDelete("ticket", t.id)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KNOWLEDGE BASE TAB */}
      {activeTab === "knowledge" && (
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={sectionTitleStyle}>Knowledge Base ({filteredKB.length})</div>
            <button style={primaryBtnStyle} onClick={() => openKBModal()}>+ Create Article</button>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <input
              style={searchInputStyle}
              placeholder="Search by title or tags..."
              value={kbSearch}
              onChange={(e) => setKbSearch(e.target.value)}
            />
          </div>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Tags</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredKB.length === 0 ? (
                  <tr><td style={{ ...tdBase, padding: "14px 10px", color: "#6b7280", cursor: "default" }} colSpan={4}>No articles found</td></tr>
                ) : (
                  filteredKB.map((kb, index) => (
                    <tr key={kb.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      <td style={tdBase} onClick={() => openKBModal(kb)}>{kb.title}</td>
                      <td style={tdBase} onClick={() => openKBModal(kb)}>{kb.tags || "—"}</td>
                      <td style={tdBase} onClick={() => openKBModal(kb)}>{new Date(kb.created_at).toLocaleDateString()}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>
                        <button style={actionBtnStyle} onClick={() => openKBModal(kb)}>Edit</button>
                        <button style={deleteBtnStyle} onClick={() => confirmDelete("kb", kb.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CANNED RESPONSES TAB */}
      {activeTab === "canned" && (
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={sectionTitleStyle}>Canned Responses ({filteredCanned.length})</div>
            <button style={primaryBtnStyle} onClick={() => openCannedModal()}>+ Create Response</button>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <input
              style={searchInputStyle}
              placeholder="Search by title or tags..."
              value={cannedSearch}
              onChange={(e) => setCannedSearch(e.target.value)}
            />
          </div>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Tags</th>
                  <th style={thStyle}>Preview</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCanned.length === 0 ? (
                  <tr><td style={{ ...tdBase, padding: "14px 10px", color: "#6b7280", cursor: "default" }} colSpan={4}>No responses found</td></tr>
                ) : (
                  filteredCanned.map((c, index) => (
                    <tr key={c.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      <td style={tdBase} onClick={() => openCannedModal(c)}>{c.title}</td>
                      <td style={tdBase} onClick={() => openCannedModal(c)}>{c.search_tags || "—"}</td>
                      <td style={tdBase} onClick={() => openCannedModal(c)}>{c.response_text.substring(0, 50)}...</td>
                      <td style={{ ...tdBase, cursor: "default" }}>
                        <button style={actionBtnStyle} onClick={() => openCannedModal(c)}>Edit</button>
                        <button style={deleteBtnStyle} onClick={() => confirmDelete("canned", c.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SLA SETTINGS TAB */}
      {activeTab === "sla" && (
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={sectionTitleStyle}>SLA Settings ({slaSettings.length})</div>
            <button style={primaryBtnStyle} onClick={() => openSLAModal()}>+ Add SLA Rule</button>
          </div>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Priority</th>
                  <th style={thStyle}>Response Time (minutes)</th>
                  <th style={thStyle}>Response Time (hours)</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slaSettings.length === 0 ? (
                  <tr><td style={{ ...tdBase, padding: "14px 10px", color: "#6b7280", cursor: "default" }} colSpan={4}>No SLA settings found</td></tr>
                ) : (
                  slaSettings.map((sla, index) => (
                    <tr key={sla.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      <td style={{ ...tdBase, cursor: "default" }}>{sla.priority_display}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>{sla.sla_time_minutes}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>{(sla.sla_time_minutes / 60).toFixed(1)}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>
                        <button style={actionBtnStyle} onClick={() => openSLAModal(sla)}>Edit</button>
                        <button style={deleteBtnStyle} onClick={() => confirmDelete("sla", sla.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQ TAB */}
      {activeTab === "faqs" && (
        <div style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={sectionTitleStyle}>Landing Page FAQs ({faqs.length})</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={outlineBtnStyle} onClick={() => exportData("faqs")}>Export CSV</button>
              <button style={primaryBtnStyle} onClick={() => openFAQModal()}>+ Add FAQ</button>
            </div>
          </div>

          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Order</th>
                  <th style={thStyle}>Question</th>
                  <th style={thStyle}>Answer</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.length === 0 ? (
                  <tr><td style={{ ...tdBase, padding: "14px 10px", color: "#6b7280", cursor: "default" }} colSpan={4}>No FAQs found</td></tr>
                ) : (
                  faqs.map((f, index) => (
                    <tr key={f.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      <td style={{ ...tdBase, cursor: "default" }}>{f.order}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>{f.question}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>{f.answer.length > 50 ? f.answer.substring(0, 50) + "..." : f.answer}</td>
                      <td style={{ ...tdBase, cursor: "default" }}>
                        <button style={actionBtnStyle} onClick={() => openFAQModal(f)}>Edit</button>
                        <button style={deleteBtnStyle} onClick={() => confirmDelete("faq", f.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showCreateUser && (
        <div style={modalBackdropStyle} onClick={() => setShowCreateUser(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={modalTitleStyle}>Create New User</div>
              <button style={outlineBtnStyle} onClick={() => setShowCreateUser(false)}>Close</button>
            </div>

            <form onSubmit={handleCreateUser}>
              <label style={fieldLabelStyle}>Username *</label>
              <input style={fieldInputStyle} value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Enter username" required />

              <label style={fieldLabelStyle}>Email *</label>
              <input type="email" style={fieldInputStyle} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@example.com" required />

              <label style={fieldLabelStyle}>Password *</label>
              <input type="password" style={fieldInputStyle} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter password" required />

              <label style={fieldLabelStyle}>Role *</label>
              <select style={fieldInputStyle} value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                {ROLE_OPTIONS.map((r) => (<option key={r.id} value={r.id}>{r.label}</option>))}
              </select>

              <div style={modalFooterStyle}>
                <button type="button" style={outlineBtnStyle} onClick={() => setShowCreateUser(false)}>Cancel</button>
                <button type="submit" style={{ ...primaryBtnStyle, opacity: creating ? 0.7 : 1 }} disabled={creating}>
                  {creating ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET EDIT MODAL */}
      {showTicketModal && selectedTicket && (
        <div style={modalBackdropStyle} onClick={() => setShowTicketModal(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={modalTitleStyle}>Ticket #{selectedTicket.id}</div>
              <button style={outlineBtnStyle} onClick={() => setShowTicketModal(false)}>Close</button>
            </div>

            <div style={{ fontSize: "13px", color: "#0f172a", marginBottom: "8px" }}>
              <strong>Subject:</strong> {selectedTicket.subject}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px", padding: "10px", background: "#f1f5f9", borderRadius: "8px" }}>
              {selectedTicket.description || "No description"}
            </div>

            <form onSubmit={handleUpdateTicket}>
              <label style={fieldLabelStyle}>Status</label>
              <select style={fieldInputStyle} value={ticketStatus} onChange={(e) => setTicketStatus(e.target.value)}>
                <option value="1">Open</option>
                <option value="2">Closed</option>
              </select>

              <label style={fieldLabelStyle}>Queue</label>
              <select style={fieldInputStyle} value={ticketQueue} onChange={(e) => setTicketQueue(e.target.value)}>
                <option value="1">HR</option>
                <option value="2">IT</option>
                <option value="3">Facilities</option>
                <option value="4">Other</option>
              </select>

              <label style={fieldLabelStyle}>Priority</label>
              <select style={fieldInputStyle} value={ticketPriority} onChange={(e) => setTicketPriority(e.target.value)}>
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="3">Low</option>
              </select>

              <label style={fieldLabelStyle}>Assign to Agent</label>
              <select style={fieldInputStyle} value={ticketAssignedTo} onChange={(e) => setTicketAssignedTo(e.target.value)}>
                <option value="">Unassigned</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.username}</option>
                ))}
              </select>

              <div style={modalFooterStyle}>
                <button type="button" style={outlineBtnStyle} onClick={() => setShowTicketModal(false)}>Cancel</button>
                {selectedTicket.status === 1 && (
                  <button type="button" style={successBtnStyle} onClick={() => handleResolveTicket(selectedTicket.id)}>Mark Resolved</button>
                )}
                <button type="submit" style={primaryBtnStyle}>Update Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KNOWLEDGE BASE MODAL */}
      {showKBModal && (
        <div style={modalBackdropStyle} onClick={() => setShowKBModal(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={modalTitleStyle}>{selectedKB ? "Edit" : "Create"} KB Article</div>
              <button style={outlineBtnStyle} onClick={() => setShowKBModal(false)}>Close</button>
            </div>

            <form onSubmit={handleSaveKB}>
              <label style={fieldLabelStyle}>Title *</label>
              <input style={fieldInputStyle} value={kbTitle} onChange={(e) => setKbTitle(e.target.value)} placeholder="Article title" required />

              <label style={fieldLabelStyle}>Content *</label>
              <textarea style={textAreaStyle} value={kbContent} onChange={(e) => setKbContent(e.target.value)} placeholder="Article content" required />

              <label style={fieldLabelStyle}>Tags (comma-separated)</label>
              <input style={fieldInputStyle} value={kbTags} onChange={(e) => setKbTags(e.target.value)} placeholder="password,reset,login" />

              <div style={modalFooterStyle}>
                <button type="button" style={outlineBtnStyle} onClick={() => setShowKBModal(false)}>Cancel</button>
                <button type="submit" style={{ ...primaryBtnStyle, opacity: creating ? 0.7 : 1 }} disabled={creating}>
                  {creating ? "Saving..." : "Save Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANNED RESPONSE MODAL */}
      {showCannedModal && (
        <div style={modalBackdropStyle} onClick={() => setShowCannedModal(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={modalTitleStyle}>{selectedCanned ? "Edit" : "Create"} Template</div>
              <button style={outlineBtnStyle} onClick={() => setShowCannedModal(false)}>Close</button>
            </div>

            <form onSubmit={handleSaveCanned}>
              <label style={fieldLabelStyle}>Title *</label>
              <input style={fieldInputStyle} value={cannedTitle} onChange={(e) => setCannedTitle(e.target.value)} placeholder="Template title" required />

              <label style={fieldLabelStyle}>Response Text *</label>
              <textarea style={textAreaStyle} value={cannedText} onChange={(e) => setCannedText(e.target.value)} placeholder="The full response text..." required />

              <label style={fieldLabelStyle}>Search Tags</label>
              <input style={fieldInputStyle} value={cannedTags} onChange={(e) => setCannedTags(e.target.value)} placeholder="keyword1,keyword2" />

              <div style={modalFooterStyle}>
                <button type="button" style={outlineBtnStyle} onClick={() => setShowCannedModal(false)}>Cancel</button>
                <button type="submit" style={{ ...primaryBtnStyle, opacity: creating ? 0.7 : 1 }} disabled={creating}>
                  {creating ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLA MODAL */}
      {showSLAModal && (
        <div style={modalBackdropStyle} onClick={() => setShowSLAModal(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={modalTitleStyle}>{selectedSLA ? "Edit" : "Add"} SLA Rule</div>
              <button style={outlineBtnStyle} onClick={() => setShowSLAModal(false)}>Close</button>
            </div>

            <form onSubmit={handleSaveSLA}>
              <label style={fieldLabelStyle}>Priority *</label>
              <select style={fieldInputStyle} value={slaPriority} onChange={(e) => setSlaPriority(e.target.value)}>
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="3">Low</option>
              </select>

              <label style={fieldLabelStyle}>Response Target (Minutes) *</label>
              <input type="number" style={fieldInputStyle} value={slaMinutes} onChange={(e) => setSlaMinutes(e.target.value)} placeholder="e.g. 60" required />

              <div style={modalFooterStyle}>
                <button type="button" style={outlineBtnStyle} onClick={() => setShowSLAModal(false)}>Cancel</button>
                <button type="submit" style={{ ...primaryBtnStyle, opacity: creating ? 0.7 : 1 }} disabled={creating}>
                  {creating ? "Saving..." : "Save Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {showFAQModal && (
        <div style={modalBackdropStyle} onClick={() => setShowFAQModal(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={modalTitleStyle}>{selectedFAQ ? "Edit" : "Create"} FAQ</div>
              <button style={outlineBtnStyle} onClick={() => setShowFAQModal(false)}>Close</button>
            </div>

            <form onSubmit={handleSaveFAQ}>
              <label style={fieldLabelStyle}>Question *</label>
              <input
                style={fieldInputStyle}
                value={faqQuestion}
                onChange={e => setFaqQuestion(e.target.value)}
                placeholder="e.g., How do I reset my password?"
                required
              />

              <label style={fieldLabelStyle}>Answer *</label>
              <textarea
                style={textAreaStyle}
                value={faqAnswer}
                onChange={e => setFaqAnswer(e.target.value)}
                placeholder="Detailed answer..."
                required
              />

              <label style={fieldLabelStyle}>Display Order</label>
              <input
                style={fieldInputStyle}
                type="number"
                value={faqOrder}
                onChange={e => setFaqOrder(e.target.value)}
              />

              <div style={modalFooterStyle}>
                <button type="button" style={outlineBtnStyle} onClick={() => setShowFAQModal(false)}>Cancel</button>
                <button type="submit" style={primaryBtnStyle} disabled={creating}>{creating ? "Saving..." : "Save FAQ"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CANNED RESPONSE MODAL */}
      {showCannedModal && (
        <div style={modalBackdropStyle} onClick={() => setShowCannedModal(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={modalTitleStyle}>{selectedCanned ? "Edit" : "Create"} Template</div>
              <button style={outlineBtnStyle} onClick={() => setShowCannedModal(false)}>Close</button>
            </div>

            <form onSubmit={handleSaveCanned}>
              <label style={fieldLabelStyle}>Title *</label>
              <input style={fieldInputStyle} value={cannedTitle} onChange={(e) => setCannedTitle(e.target.value)} placeholder="Template title" required />

              <label style={fieldLabelStyle}>Response Text *</label>
              <textarea style={textAreaStyle} value={cannedText} onChange={(e) => setCannedText(e.target.value)} placeholder="The full response text..." required />

              <label style={fieldLabelStyle}>Search Tags</label>
              <input style={fieldInputStyle} value={cannedTags} onChange={(e) => setCannedTags(e.target.value)} placeholder="keyword1,keyword2" />

              <div style={modalFooterStyle}>
                <button type="button" style={outlineBtnStyle} onClick={() => setShowCannedModal(false)}>Cancel</button>
                <button type="submit" style={{ ...primaryBtnStyle, opacity: creating ? 0.7 : 1 }} disabled={creating}>
                  {creating ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLA MODAL */}
      {showSLAModal && (
        <div style={modalBackdropStyle} onClick={() => setShowSLAModal(false)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={modalTitleStyle}>{selectedSLA ? "Edit" : "Add"} SLA Rule</div>
              <button style={outlineBtnStyle} onClick={() => setShowSLAModal(false)}>Close</button>
            </div>

            <form onSubmit={handleSaveSLA}>
              <label style={fieldLabelStyle}>Priority *</label>
              <select style={fieldInputStyle} value={slaPriority} onChange={(e) => setSlaPriority(e.target.value)}>
                <option value="1">High</option>
                <option value="2">Medium</option>
                <option value="3">Low</option>
              </select>

              <label style={fieldLabelStyle}>Response Target (Minutes) *</label>
              <input type="number" style={fieldInputStyle} value={slaMinutes} onChange={(e) => setSlaMinutes(e.target.value)} placeholder="e.g. 60" required />

              <div style={modalFooterStyle}>
                <button type="button" style={outlineBtnStyle} onClick={() => setShowSLAModal(false)}>Cancel</button>
                <button type="submit" style={{ ...primaryBtnStyle, opacity: creating ? 0.7 : 1 }} disabled={creating}>
                  {creating ? "Saving..." : "Save Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && deleteTarget && (
        <div style={modalBackdropStyle} onClick={() => setShowDeleteConfirm(false)}>
          <div style={{ ...modalCardStyle, width: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div style={modalTitleStyle}>Confirm Delete</div>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: "12px 0 20px" }}>
              Are you sure you want to delete this {deleteTarget.type}? This action cannot be undone.
            </p>
            <div style={modalFooterStyle}>
              <button style={outlineBtnStyle} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button style={dangerBtnStyle} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


