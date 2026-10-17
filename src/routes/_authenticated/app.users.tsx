import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Users, ShieldCheck, Plus, Pencil, Trash2, X, Search, Phone, Mail, Award,
  Check, Filter, ChevronRight, AlertCircle, Building2, Crown, UserCheck,
  UserX, ArrowUpDown, Lock, Key, RefreshCw, Sparkles, MessageCircle, ExternalLink,
  Briefcase, ToggleLeft, ToggleRight
} from "lucide-react";
import { toast } from "sonner";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/users")({
  head: () => workspaceHead("Manage Users & Team · Company Owner"),
  validateSearch: (s: Record<string, unknown>) => ({
    filter: typeof s["filter"] === "string" ? s["filter"] : undefined,
  }),
  component: ManageUsersPage,
});

export type AgencyRole =
  | "Company Owner"
  | "Sales Director"
  | "Senior Broker"
  | "Offplan Specialist"
  | "Executive Admin";

export type AgencyUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AgencyRole;
  reraBrn: string;
  reraExpiry: string;
  territory: string;
  monthlyTargetAed: number;
  active: boolean;
  receiveInboundLeads: boolean;
  canExportData: boolean;
  canReassignLeads: boolean;
  joinedDate: string;
  avatarColor: string;
};

const INITIAL_ROSTER: AgencyUser[] = [
  {
    id: "USR-001",
    name: "Adam Rahman",
    email: "adam.rahman@skylinerealty.ae",
    phone: "+971 50 447 2210",
    role: "Company Owner",
    reraBrn: "ORN-28941 / BRN-48920",
    reraExpiry: "12 Dec 2028",
    territory: "Executive · Agency-wide",
    monthlyTargetAed: 45000000,
    active: true,
    receiveInboundLeads: false,
    canExportData: true,
    canReassignLeads: true,
    joinedDate: "15 Jan 2021",
    avatarColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  },
  {
    id: "USR-002",
    name: "Aisha Al-Mansoor",
    email: "aisha.m@skylinerealty.ae",
    phone: "+971 50 892 4119",
    role: "Senior Broker",
    reraBrn: "BRN-48920",
    reraExpiry: "15 Nov 2027",
    territory: "Palm Jumeirah & Waterfront",
    monthlyTargetAed: 22000000,
    active: true,
    receiveInboundLeads: true,
    canExportData: false,
    canReassignLeads: false,
    joinedDate: "03 Feb 2022",
    avatarColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  },
  {
    id: "USR-003",
    name: "Tariq Mansoor",
    email: "tariq.m@skylinerealty.ae",
    phone: "+971 52 334 1902",
    role: "Senior Broker",
    reraBrn: "BRN-39104",
    reraExpiry: "14 Nov 2026", // Expiring soon warning
    territory: "Downtown & Business Bay Penthouses",
    monthlyTargetAed: 25000000,
    active: true,
    receiveInboundLeads: true,
    canExportData: false,
    canReassignLeads: false,
    joinedDate: "18 Jun 2022",
    avatarColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  },
  {
    id: "USR-004",
    name: "Zainab Al-Hashimi",
    email: "zainab.h@skylinerealty.ae",
    phone: "+971 54 812 7701",
    role: "Offplan Specialist",
    reraBrn: "BRN-51209",
    reraExpiry: "22 Mar 2028",
    territory: "Dubai Hills Estate & Emaar South",
    monthlyTargetAed: 16000000,
    active: true,
    receiveInboundLeads: true,
    canExportData: false,
    canReassignLeads: false,
    joinedDate: "10 Oct 2023",
    avatarColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  },
  {
    id: "USR-005",
    name: "Khalid Ebrahim",
    email: "khalid.e@skylinerealty.ae",
    phone: "+971 55 901 4482",
    role: "Senior Broker",
    reraBrn: "BRN-44211",
    reraExpiry: "08 Aug 2027",
    territory: "DIFC & Dubai Creek Harbour",
    monthlyTargetAed: 18000000,
    active: true,
    receiveInboundLeads: true,
    canExportData: false,
    canReassignLeads: false,
    joinedDate: "05 Jan 2023",
    avatarColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  },
  {
    id: "USR-006",
    name: "Omar Farooq",
    email: "omar.f@skylinerealty.ae",
    phone: "+971 58 120 9931",
    role: "Senior Broker",
    reraBrn: "BRN-38902",
    reraExpiry: "30 Sep 2027",
    territory: "Emirates Hills & Jumeirah Islands",
    monthlyTargetAed: 28000000,
    active: true,
    receiveInboundLeads: true,
    canExportData: false,
    canReassignLeads: false,
    joinedDate: "12 Apr 2022",
    avatarColor: "bg-rose-500/20 text-rose-400 border-rose-500/40",
  },
  {
    id: "USR-007",
    name: "Daniel Reyes",
    email: "daniel.reyes@skylinerealty.ae",
    phone: "+971 50 319 8812",
    role: "Sales Director",
    reraBrn: "BRN-28114",
    reraExpiry: "19 Jan 2028",
    territory: "Brokerage Sales & Offplan Allocations",
    monthlyTargetAed: 40000000,
    active: true,
    receiveInboundLeads: false,
    canExportData: true,
    canReassignLeads: true,
    joinedDate: "14 Feb 2021",
    avatarColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/40",
  },
  {
    id: "USR-008",
    name: "Elena Rostova",
    email: "elena.r@skylinerealty.ae",
    phone: "+971 56 771 0023",
    role: "Senior Broker",
    reraBrn: "BRN-47209",
    reraExpiry: "05 May 2028",
    territory: "International Ultra-HNWI Desk",
    monthlyTargetAed: 24000000,
    active: true,
    receiveInboundLeads: true,
    canExportData: false,
    canReassignLeads: false,
    joinedDate: "01 Nov 2023",
    avatarColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  },
  {
    id: "USR-009",
    name: "Vikram Malhotra",
    email: "vikram.m@skylinerealty.ae",
    phone: "+971 50 994 3321",
    role: "Offplan Specialist",
    reraBrn: "BRN-49102",
    reraExpiry: "11 Dec 2027",
    territory: "Dubai Marina & Bluewaters",
    monthlyTargetAed: 15000000,
    active: true,
    receiveInboundLeads: true,
    canExportData: false,
    canReassignLeads: false,
    joinedDate: "15 Jan 2024",
    avatarColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  },
  {
    id: "USR-010",
    name: "Fatima Al-Zahra",
    email: "fatima.z@skylinerealty.ae",
    phone: "+971 54 220 8819",
    role: "Offplan Specialist",
    reraBrn: "BRN-53102",
    reraExpiry: "28 Jul 2028",
    territory: "Meydan & Sobha Hartland II",
    monthlyTargetAed: 14000000,
    active: true,
    receiveInboundLeads: true,
    canExportData: false,
    canReassignLeads: false,
    joinedDate: "20 Mar 2024",
    avatarColor: "bg-pink-500/20 text-pink-400 border-pink-500/40",
  },
  {
    id: "USR-011",
    name: "Noura Al Blooshi",
    email: "noura.b@skylinerealty.ae",
    phone: "+971 50 119 7734",
    role: "Executive Admin",
    reraBrn: "DLD-ADM-092",
    reraExpiry: "01 Jan 2030",
    territory: "DLD Trakheesi & Legal Contracts",
    monthlyTargetAed: 0,
    active: true,
    receiveInboundLeads: false,
    canExportData: true,
    canReassignLeads: true,
    joinedDate: "05 May 2021",
    avatarColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
  },
  {
    id: "USR-012",
    name: "Tom Whitfield",
    email: "tom.w@skylinerealty.ae",
    phone: "+971 52 881 4490",
    role: "Senior Broker",
    reraBrn: "BRN-36019",
    reraExpiry: "02 Feb 2027",
    territory: "Jumeirah Golf Estates & Tilal Al Ghaf",
    monthlyTargetAed: 16000000,
    active: false, // On Leave
    receiveInboundLeads: false,
    canExportData: false,
    canReassignLeads: false,
    joinedDate: "17 May 2022",
    avatarColor: "bg-zinc-600/20 text-zinc-400 border-zinc-600/40",
  },
];

const ROLE_BADGES: Record<AgencyRole, { label: string; color: string }> = {
  "Company Owner": { label: "Owner & Principal", color: "bg-amber-500/15 text-amber-300 border-amber-500/40" },
  "Sales Director": { label: "Sales Director", color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/40" },
  "Senior Broker": { label: "Senior Broker", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  "Offplan Specialist": { label: "Offplan Specialist", color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40" },
  "Executive Admin": { label: "DLD & Operations", color: "bg-purple-500/15 text-purple-300 border-purple-500/40" },
};

export function ManageUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AgencyUser[]>(INITIAL_ROSTER);
  const [activeTab, setActiveTab] = useState<"all" | "brokers" | "inbound" | "management" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AgencyUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // Form Draft State
  const [draft, setDraft] = useState<Partial<AgencyUser>>({
    name: "",
    email: "",
    phone: "+971 50 ",
    role: "Senior Broker",
    reraBrn: "BRN-",
    reraExpiry: "01 Jan 2028",
    territory: "Downtown & Business Bay",
    monthlyTargetAed: 15000000,
    active: true,
    receiveInboundLeads: true,
    canExportData: false,
    canReassignLeads: false,
  });

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Tab Filtering
      if (activeTab === "brokers" && !(u.role === "Senior Broker" || u.role === "Offplan Specialist")) return false;
      if (activeTab === "inbound" && !u.receiveInboundLeads) return false;
      if (activeTab === "management" && !(u.role === "Company Owner" || u.role === "Sales Director" || u.role === "Executive Admin")) return false;
      if (activeTab === "inactive" && u.active) return false;

      // Text Search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.reraBrn.toLowerCase().includes(q) ||
        u.territory.toLowerCase().includes(q)
      );
    });
  }, [users, activeTab, searchQuery]);

  // KPIs
  const totalStaff = users.length;
  const activeInboundAgents = users.filter((u) => u.receiveInboundLeads && u.active).length;
  const compliantRera = users.filter((u) => u.reraBrn.startsWith("BRN-") || u.reraBrn.includes("ORN-")).length;
  const totalTargetVolume = users.reduce((sum, u) => sum + (u.active ? u.monthlyTargetAed : 0), 0);

  // Toggle Active Status
  const handleToggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextActive = !u.active;
          toast.success(`${u.name} is now ${nextActive ? "Active" : "Set to Inactive / Off-Duty"}`);
          return { ...u, active: nextActive, receiveInboundLeads: nextActive ? u.receiveInboundLeads : false };
        }
        return u;
      })
    );
  };

  // Toggle Inbound Lead Routing
  const handleToggleLeadRouting = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextState = !u.receiveInboundLeads;
          toast.info(`${u.name} ${nextState ? "added to" : "removed from"} live Round-Robin lead rotation`);
          return { ...u, receiveInboundLeads: nextState };
        }
        return u;
      })
    );
  };

  // Open Modal for Add
  const handleOpenAdd = () => {
    setDraft({
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: "",
      email: "",
      phone: "+971 50 ",
      role: "Senior Broker",
      reraBrn: "BRN-",
      reraExpiry: "01 Jan 2028",
      territory: "Downtown & Business Bay",
      monthlyTargetAed: 15000000,
      active: true,
      receiveInboundLeads: true,
      canExportData: false,
      canReassignLeads: false,
      joinedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      avatarColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    });
    setModalMode("add");
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (user: AgencyUser) => {
    setSelectedUser(user);
    setDraft({ ...user });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Save User (Add or Edit)
  const handleSaveDraft = () => {
    if (!draft.name?.trim() || !draft.email?.trim()) {
      toast.error("Please provide full name and corporate email.");
      return;
    }

    if (modalMode === "add") {
      const newUser: AgencyUser = {
        id: `USR-${String(users.length + 1).padStart(3, "0")}`,
        name: draft.name.trim(),
        email: draft.email.trim(),
        phone: draft.phone || "+971 50 000 0000",
        role: (draft.role as AgencyRole) || "Senior Broker",
        reraBrn: draft.reraBrn || "BRN-PENDING",
        reraExpiry: draft.reraExpiry || "01 Jan 2028",
        territory: draft.territory || "General Dubai Market",
        monthlyTargetAed: Number(draft.monthlyTargetAed) || 15000000,
        active: draft.active ?? true,
        receiveInboundLeads: draft.receiveInboundLeads ?? true,
        canExportData: draft.canExportData ?? false,
        canReassignLeads: draft.canReassignLeads ?? false,
        joinedDate: "Today",
        avatarColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      };
      setUsers([newUser, ...users]);
      toast.success(`Successfully invited broker: ${newUser.name}`);
    } else if (modalMode === "edit" && selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? ({ ...u, ...draft } as AgencyUser) : u))
      );
      toast.success(`Updated credentials for ${draft.name}`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-24 animate-in fade-in-50 duration-300">
      {/* ═══ 1. OWNER COMMAND HEADER ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card to-secondary/30 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-400">
                <Crown size={13} />
                <span>Company Owner Command</span>
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={13} /> ORN-28941 · Skyline Luxury Real Estate LLC
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Manage Users & Licensed Brokers
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Oversee your licensed agent roster, verify official Dubai Land Department (RERA) BRN cards, configure live round-robin inbound leadbox routing, and set broker sales targets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                toast.info("Generating official RERA Audit Roster PDF export...");
                setTimeout(() => toast.success("RERA Compliance Roster (ORN-28941) downloaded"), 900);
              }}
              className="h-10 px-4 rounded-2xl text-xs font-bold border-border/80 gap-1.5"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>RERA Compliance Audit</span>
            </Button>

            <Button
              onClick={handleOpenAdd}
              className="h-10 px-5 rounded-2xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm"
            >
              <Plus size={15} />
              <span>Add / Invite Broker</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ 2. OWNER EXECUTIVE KPI STRIP ═══ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Total Staff</span>
            <Users size={15} className="text-primary" />
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">{totalStaff}</span>
            <span className="text-xs font-bold text-muted-foreground">Accounts</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">1 Owner · 2 Directors · 8 Brokers · 1 Admin</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Inbound Lead Rotation</span>
            <RefreshCw size={15} className="text-emerald-400 animate-spin-slow" />
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{activeInboundAgents}</span>
            <span className="text-xs font-bold text-muted-foreground">Brokers Active</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-400/80">Receiving auto-dispatched web & ad leads</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>RERA Verification</span>
            <Award size={15} className="text-amber-400" />
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">100%</span>
            <span className="text-xs font-bold text-emerald-400">0 Expired</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">1 renewal due in &lt; 30 days (Tariq)</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Allocated Quota Target</span>
            <Building2 size={15} className="text-cyan-400" />
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-foreground font-mono">
              AED {(totalTargetVolume / 1000000).toFixed(0)}M
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Monthly agency cumulative gross target</p>
        </div>
      </section>

      {/* ═══ 3. SEARCH & FILTER TABS ═══ */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-secondary/60 rounded-2xl border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Staff ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("brokers")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "brokers" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Licensed Brokers ({users.filter((u) => u.role === "Senior Broker" || u.role === "Offplan Specialist").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inbound")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "inbound" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Inbound Queue ({activeInboundAgents})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("management")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "management" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Executive Leadership (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inactive")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "inactive" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Off-Duty / Leave ({users.filter((u) => !u.active).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, BRN, territory…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/80 bg-card text-xs font-semibold text-foreground focus:outline-none focus:border-primary shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </section>

      {/* ═══ 4. BROKER ROSTER TABLE ═══ */}
      <section className="rounded-3xl border border-border/80 bg-card shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <h2 className="text-base font-extrabold text-foreground font-display">
              Agency Brokerage Directory & Leadbox Allocations
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} members
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/30 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Broker / Employee</th>
                <th className="py-3 px-4">Role & Credentials</th>
                <th className="py-3 px-4">Focus Territory</th>
                <th className="py-3 px-4 text-center">Inbound Leadbox</th>
                <th className="py-3 px-4">Target Volume</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredUsers.map((u) => {
                const badge = ROLE_BADGES[u.role];
                const isExpiringSoon = u.id === "USR-003";

                return (
                  <tr key={u.id} className="hover:bg-secondary/20 transition-colors group">
                    {/* User Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-2xl flex items-center justify-center font-display font-extrabold text-sm border shadow-xs shrink-0 ${u.avatarColor}`}
                        >
                          {u.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground text-xs truncate flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.role === "Company Owner" && <Crown size={12} className="text-amber-400 shrink-0" />}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                          <p className="text-[10px] text-muted-foreground font-mono truncate">{u.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role & RERA */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-foreground font-semibold">{u.reraBrn}</span>
                          {isExpiringSoon && (
                            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1 rounded" title="Renewal in 28 days">
                              ⚠️ Renewal
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">Expires: {u.reraExpiry}</p>
                      </div>
                    </td>

                    {/* Territory */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-foreground text-[11px] block">{u.territory}</span>
                      <span className="text-[10px] text-muted-foreground">Joined: {u.joinedDate}</span>
                    </td>

                    {/* Inbound Leadbox Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleLeadRouting(u.id)}
                        disabled={!u.active || u.role === "Executive Admin"}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                          u.receiveInboundLeads
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                            : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                        title={u.receiveInboundLeads ? "Currently in Round-Robin Lead Rotation" : "Not receiving auto-dispatched leads"}
                      >
                        <span className={`size-2 rounded-full ${u.receiveInboundLeads ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"}`} />
                        <span>{u.receiveInboundLeads ? "Auto-Routing" : "Muted"}</span>
                      </button>
                    </td>

                    {/* Monthly Target */}
                    <td className="py-3.5 px-4">
                      {u.monthlyTargetAed > 0 ? (
                        <div>
                          <p className="font-mono font-bold text-foreground text-xs">
                            AED {(u.monthlyTargetAed / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-[10px] text-muted-foreground">Monthly sales goal</p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground font-mono">—</span>
                      )}
                    </td>

                    {/* Active Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(u.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                          u.active
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {u.active ? <Check size={11} /> : <X size={11} />}
                        <span>{u.active ? "Active" : "Off-Duty"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Coach on WhatsApp */}
                        <button
                          type="button"
                          onClick={() => {
                            const clean = u.phone.replace(/[^0-9]/g, "");
                            window.open(`https://wa.me/${clean}?text=${encodeURIComponent(`Hi ${u.name}, touching base regarding your current pipeline and leadbox pace on DealOS.`)}`, "_blank");
                          }}
                          className="size-8 rounded-xl border border-border/80 bg-secondary/40 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 flex items-center justify-center transition-all text-muted-foreground"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </button>

                        {/* View in Owner Overwatch */}
                        <button
                          type="button"
                          onClick={() => {
                            void navigate({ to: "/owner-dashboard" });
                            toast.info(`Switched to Owner Overwatch for ${u.name}`);
                          }}
                          className="size-8 rounded-xl border border-border/80 bg-secondary/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary flex items-center justify-center transition-all text-muted-foreground"
                          title="Inspect Leadbox & Deals in Owner Overwatch"
                        >
                          <ExternalLink size={14} />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="size-8 rounded-xl border border-border/80 bg-secondary/40 hover:bg-card hover:text-foreground flex items-center justify-center transition-all text-muted-foreground"
                          title="Edit User & Permissions"
                        >
                          <Pencil size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ 5. ADD / EDIT USER MODAL ═══ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="relative w-full max-w-xl rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary" />
                <h2 className="text-lg font-extrabold text-foreground font-display">
                  {modalMode === "add" ? "Add / Invite Licensed Broker" : `Edit Broker: ${draft.name}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Full Legal Name
                </label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Tariq Mansoor"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Corporate Email
                </label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  placeholder="name@skylinerealty.ae"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  WhatsApp Mobile (+971)
                </label>
                <input
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  placeholder="+971 50 123 4567"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Role in Brokerage
                </label>
                <select
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value as AgencyRole })}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Senior Broker">Senior Broker</option>
                  <option value="Offplan Specialist">Offplan Specialist</option>
                  <option value="Sales Director">Sales Director</option>
                  <option value="Executive Admin">Executive Admin / Compliance</option>
                  <option value="Company Owner">Company Owner / Managing Partner</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  RERA Broker Card (BRN)
                </label>
                <input
                  value={draft.reraBrn}
                  onChange={(e) => setDraft({ ...draft, reraBrn: e.target.value })}
                  placeholder="BRN-48920"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  RERA License Expiry
                </label>
                <input
                  value={draft.reraExpiry}
                  onChange={(e) => setDraft({ ...draft, reraExpiry: e.target.value })}
                  placeholder="15 Nov 2027"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Assigned Sub-Market / Territory
                </label>
                <input
                  value={draft.territory}
                  onChange={(e) => setDraft({ ...draft, territory: e.target.value })}
                  placeholder="Palm Jumeirah & Waterfront"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Monthly Sales Volume Target (AED)
                </label>
                <input
                  type="number"
                  value={draft.monthlyTargetAed}
                  onChange={(e) => setDraft({ ...draft, monthlyTargetAed: Number(e.target.value) })}
                  placeholder="15000000"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/30 text-xs font-semibold text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              {/* Permissions Checkboxes */}
              <div className="sm:col-span-2 pt-2 border-t border-border/60 space-y-2.5">
                <p className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Governance & Security Permissions
                </p>

                <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-secondary/20 hover:bg-secondary/40 border border-border/50">
                  <input
                    type="checkbox"
                    checked={draft.receiveInboundLeads}
                    onChange={(e) => setDraft({ ...draft, receiveInboundLeads: e.target.checked })}
                    className="size-4 rounded accent-primary"
                  />
                  <div>
                    <p className="font-bold text-foreground text-xs">Auto-Receive Inbound Round-Robin Leads</p>
                    <p className="text-[10px] text-muted-foreground">Lead engine automatically routes web, Meta, and portal leads to this broker.</p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-secondary/20 hover:bg-secondary/40 border border-border/50">
                  <input
                    type="checkbox"
                    checked={draft.canExportData}
                    onChange={(e) => setDraft({ ...draft, canExportData: e.target.checked })}
                    className="size-4 rounded accent-primary"
                  />
                  <div>
                    <p className="font-bold text-foreground text-xs">Allow Client Contact Database Export</p>
                    <p className="text-[10px] text-muted-foreground">Restricted to Executive Admins & Directors to prevent lead database exfiltration.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl text-xs font-bold">
                Cancel
              </Button>
              <Button onClick={handleSaveDraft} className="rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 shadow-sm">
                <Check size={14} />
                <span>{modalMode === "add" ? "Send Invitation & Create Account" : "Save Changes"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
