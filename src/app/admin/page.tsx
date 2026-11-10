"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  Unlock,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Scissors,
  Search,
  Filter,
  RefreshCw,
  Printer,
  ExternalLink,
  MessageCircle,
  Phone,
  MapPin,
  IndianRupee,
  Calendar,
  AlertCircle,
  ChevronRight,
  X,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Users,
  UserCheck,
  Mail,
  FileSpreadsheet,
} from "lucide-react";

interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface AdminOrder {
  orderId: string;
  paymentId: string;
  paymentMethod: string;
  paymentStatus: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmountPaid: number;
  currency: string;
  status: "ORDER_CONFIRMED" | "IN_STITCHING" | "PACKED" | "DISPATCHED" | "DELIVERED";
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  confirmed: number;
  inStitching: number;
  packed: number;
  dispatched: number;
  delivered: number;
}

interface AdminCustomer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  lastLogin: string;
  loginCount: number;
  type: string;
  ordersCount: number;
  totalSpent: number;
  address?: string;
}

const STATUS_LABELS: Record<AdminOrder["status"], { label: string; color: string; icon: string }> = {
  ORDER_CONFIRMED: { label: "Order Confirmed", color: "bg-amber-100 text-amber-900 border-amber-300", icon: "🟡" },
  IN_STITCHING: { label: "In Stitching by Mom", color: "bg-purple-100 text-purple-900 border-purple-300", icon: "🧵" },
  PACKED: { label: "Packed & Ready", color: "bg-blue-100 text-blue-900 border-blue-300", icon: "📦" },
  DISPATCHED: { label: "Dispatched with Courier", color: "bg-indigo-100 text-indigo-900 border-indigo-300", icon: "🚚" },
  DELIVERED: { label: "Delivered to Customer", color: "bg-emerald-100 text-emerald-900 border-emerald-300", icon: "✅" },
};

export default function AdminPage() {
  // Authentication PIN Gate (Default PIN: 1234)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    confirmed: 0,
    inStitching: 0,
    packed: 0,
    dispatched: 0,
    delivered: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Editable drafts per order: Record<orderId, { status, courierName, trackingNumber, estimatedDelivery }>
  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        status: AdminOrder["status"];
        courierName: string;
        trackingNumber: string;
        estimatedDelivery: string;
      }
    >
  >({});

  // Printable Modal State
  const [printOrder, setPrintOrder] = useState<AdminOrder | null>(null);

  // Main Tab Navigation: "orders" | "customers"
  const [activeMainTab, setActiveMainTab] = useState<"orders" | "customers">("orders");
  const [customersList, setCustomersList] = useState<AdminCustomer[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  // Check saved authentication on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("scn_admin_pin_verified");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Fetch customers (Server + LocalStorage + Orders)
  const fetchCustomers = async (existingOrders?: AdminOrder[]) => {
    setIsCustomersLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      const serverCustomers = data.customers || [];

      let localAccounts: any[] = [];
      try {
        const raw = localStorage.getItem("scn_registered_accounts");
        if (raw) localAccounts = JSON.parse(raw);
      } catch {}

      const map = new Map<string, AdminCustomer>();

      // 1. Process server-recorded logins
      serverCustomers.forEach((c: any) => {
        const key = (c.identifier || c.phone || c.email || c.id).toLowerCase();
        map.set(key, {
          id: c.id,
          name: c.name || "Customer",
          phone: c.phone || "",
          email: c.email || "",
          lastLogin: c.lastLogin || new Date().toISOString(),
          loginCount: c.loginCount || 1,
          type: c.type || "signin",
          ordersCount: 0,
          totalSpent: 0,
        });
      });

      // 2. Process local registered accounts
      localAccounts.forEach((acc: any) => {
        const key = (acc.identifier || acc.phone || acc.email || acc.id).toLowerCase();
        if (map.has(key)) {
          const existing = map.get(key)!;
          map.set(key, {
            ...existing,
            name: existing.name !== "Customer" ? existing.name : (acc.name || "Customer"),
            phone: existing.phone || acc.phone || (!acc.identifier?.includes("@") ? acc.identifier : ""),
            email: existing.email || acc.email || (acc.identifier?.includes("@") ? acc.identifier : ""),
          });
        } else {
          map.set(key, {
            id: acc.id || `LOCAL-${Math.random().toString(36).slice(2, 7)}`,
            name: acc.name || "Customer",
            phone: acc.phone || (!acc.identifier?.includes("@") ? acc.identifier : ""),
            email: acc.email || (acc.identifier?.includes("@") ? acc.identifier : ""),
            lastLogin: acc.createdAt || new Date().toISOString(),
            loginCount: 1,
            type: "signup",
            ordersCount: 0,
            totalSpent: 0,
          });
        }
      });

      // 3. Process orders to add order count and address info
      const ordersToUse = existingOrders || orders;
      ordersToUse.forEach((o) => {
        const cleanPhone = o.customer.phone?.replace(/\D/g, "").slice(-10);
        const name = o.customer.fullName;
        const key = cleanPhone ? cleanPhone.toLowerCase() : name.toLowerCase();

        if (map.has(key)) {
          const item = map.get(key)!;
          item.ordersCount = (item.ordersCount || 0) + 1;
          item.totalSpent = (item.totalSpent || 0) + (o.totalAmountPaid || 0);
          item.address = `${o.customer.address}, ${o.customer.city} - ${o.customer.pincode}`;
          if (!item.phone && cleanPhone) item.phone = cleanPhone;
        } else {
          map.set(key, {
            id: `ORD-${cleanPhone || Math.random().toString(36).slice(2, 7)}`,
            name: name,
            phone: cleanPhone,
            email: "",
            lastLogin: o.createdAt,
            loginCount: 1,
            type: "order",
            ordersCount: 1,
            totalSpent: o.totalAmountPaid || 0,
            address: `${o.customer.address}, ${o.customer.city} - ${o.customer.pincode}`,
          });
        }
      });

      setCustomersList(Array.from(map.values()));
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setIsCustomersLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (data.stats) setStats(data.stats);

        // Also refresh customers list using latest orders
        fetchCustomers(data.orders || []);

        // Initialize drafts
        const newDrafts: Record<string, any> = {};
        (data.orders || []).forEach((o: AdminOrder) => {
          newDrafts[o.orderId] = {
            status: o.status,
            courierName: o.courierName || "Delhivery Express Surface",
            trackingNumber: o.trackingNumber || "",
            estimatedDelivery: o.estimatedDelivery || "2-3 Business Days",
          };
        });
        setDrafts(newDrafts);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // Handle PIN Submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "1234") {
      setIsAuthenticated(true);
      setPinError(false);
      if (rememberDevice) {
        try {
          localStorage.setItem("scn_admin_pin_verified", "true");
        } catch {}
      }
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  // Handle Logout / Lock
  const handleLock = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("scn_admin_pin_verified");
    } catch {}
  };

  // Update Draft Value
  const handleDraftChange = (orderId: string, field: string, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  // Save Order Updates to Backend
  const handleSaveOrder = async (orderId: string) => {
    const draft = drafts[orderId];
    if (!draft) return;

    setIsUpdating(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: draft.status,
          courierName: draft.courierName,
          trackingNumber: draft.trackingNumber,
          estimatedDelivery: draft.estimatedDelivery,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? data.order : o))
        );
        // Refresh stats
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setIsUpdating(null);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status filter
      if (statusFilter !== "ALL" && o.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = o.orderId.toLowerCase().includes(q);
        const matchName = o.customer.fullName.toLowerCase().includes(q);
        const matchPhone = o.customer.phone.includes(q);
        const matchCity = o.customer.city.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchCity) {
          return false;
        }
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customersList;
    const q = customerSearch.toLowerCase().trim();
    return customersList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
    );
  }, [customersList, customerSearch]);

  // =========================================================================
  // SCREEN 1: PIN AUTHENTICATION GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4 font-sans text-stone-800">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 mx-auto flex items-center justify-center text-amber-800 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full mb-2 border border-amber-300/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>Seller & Studio Portal</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Mom's Studio Admin
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Enter your Studio Access PIN to view and fulfill customer bag orders.
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Incorrect PIN. (Default Studio PIN is 1234)</span>
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError(false);
                }}
                placeholder="• • • •"
                autoFocus
                className="w-full h-14 text-center font-bold text-2xl tracking-[0.5em] bg-stone-50 text-stone-900 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Hint: Demo PIN is <strong className="text-amber-800">1234</strong>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-600">
              <input
                type="checkbox"
                id="remember"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded text-amber-800 focus:ring-amber-500"
              />
              <label htmlFor="remember" className="cursor-pointer">
                Remember on this device
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-800 hover:bg-amber-900 active:scale-95 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Seller Panel</span>
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: ADMIN SELLER DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 font-sans pb-16">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EDE6DD] px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-amber-300 bg-white shadow-xs">
              <Image src="/logo-emblem.png" alt="Shreya Craft Nest" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  Seller Orders Dashboard
                </h1>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  Mom's Studio Live
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Fulfill orders, assign Delhivery / Speed Post tracking, and print dispatch slips.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchOrders}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-950 flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Return to Customer Shop"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-800" />
              <span>Back to Shop</span>
            </Link>

            <button
              onClick={handleLock}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Lock Admin Panel"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Panel</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Navigation Mode Switcher: Orders vs Customers & Live Google Sheet */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMainTab("orders")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeMainTab === "orders"
                  ? "bg-amber-800 text-white shadow-2xs"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Customer Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveMainTab("customers");
                fetchCustomers();
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeMainTab === "customers"
                  ? "bg-amber-800 text-white shadow-2xs"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers & Logins ({customersList.length})</span>
            </button>
          </div>

          <a
            href="https://docs.google.com/spreadsheets/u/0/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Open your Google Sheet titled 'Shreya Craft Nest' in a new tab"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Open Google Sheet Live Sync ↗</span>
          </a>
        </div>

        {activeMainTab === "customers" ? (
          /* ========================================================
             CUSTOMERS & LOGINS SECTION
             ======================================================== */
          <div className="space-y-6">
            {/* Customer Stats Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Total Customer Contacts
                </span>
                <div className="font-serif text-2xl font-bold text-amber-950 flex items-center gap-2">
                  <Users className="w-6 h-6 text-amber-800" />
                  <span>{customersList.length}</span>
                </div>
                <p className="text-[10px] text-stone-500">Registered members & shoppers</p>
              </div>

              <div className="bg-white rounded-2xl border border-emerald-200/90 p-4 shadow-2xs space-y-1 bg-emerald-50/30">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  WhatsApp Direct Contacts
                </span>
                <div className="font-serif text-2xl font-bold text-emerald-950 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-emerald-700" />
                  <span>{customersList.filter((c) => c.phone).length}</span>
                </div>
                <p className="text-[10px] text-emerald-700">1-click WhatsApp ready</p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Registered Accounts
                </span>
                <div className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-stone-700" />
                  <span>{customersList.filter((c) => c.type === "signup").length}</span>
                </div>
                <p className="text-[10px] text-stone-500">Created Shreya Craft Nest accounts</p>
              </div>
            </section>

            {/* Customers Search & Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search by customer name, phone, email, or city..."
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
                />
                {customerSearch && (
                  <button
                    onClick={() => setCustomerSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="text-xs text-stone-500 font-medium">
                Showing <strong className="text-stone-900 font-bold">{filteredCustomers.length}</strong> of{" "}
                {customersList.length} customers
              </div>
            </div>

            {/* Customers List */}
            {isCustomersLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-stone-500 font-medium">Loading customer accounts...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
                <Users className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-stone-800">No Customers Found</h3>
                <p className="text-xs text-stone-500">
                  {customerSearch
                    ? "No customer matches your search query."
                    : "When customers log in or place orders, they will appear here automatically."}
                </p>
                {customerSearch && (
                  <button
                    onClick={() => setCustomerSearch("")}
                    className="text-xs text-amber-800 font-bold hover:underline"
                  >
                    Clear search query
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCustomers.map((cust) => {
                  const cleanPhone = cust.phone ? cust.phone.replace(/\D/g, "").slice(-10) : "";
                  const initials = cust.name
                    ? cust.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "SC";

                  const waChatUrl = cleanPhone
                    ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                        `Namaste ${cust.name}! This is Sudha Rani from Shreya Craft Nest. How can I help you today?`
                      )}`
                    : null;

                  return (
                    <article
                      key={cust.id}
                      className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-5 space-y-4 hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 font-serif font-bold text-sm flex items-center justify-center shadow-2xs flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                              {cust.name}
                            </h3>
                            <p className="text-[11px] text-stone-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              <span>
                                Last active:{" "}
                                {new Date(cust.lastLogin).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </span>
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            cust.type === "signup"
                              ? "bg-purple-100 text-purple-900 border-purple-300"
                              : cust.ordersCount > 0
                              ? "bg-amber-100 text-amber-900 border-amber-300"
                              : "bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                        >
                          {cust.type === "signup"
                            ? "✨ Member"
                            : cust.ordersCount > 0
                            ? `🛍️ ${cust.ordersCount} Order${cust.ordersCount > 1 ? "s" : ""}`
                            : "📱 Visitor"}
                        </span>
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-2 pt-1 border-t border-stone-100 text-xs">
                        {cust.phone && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-stone-500 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              <span className="font-mono font-semibold text-stone-800">
                                +91 {cust.phone}
                              </span>
                            </span>
                            {waChatUrl && (
                              <a
                                href={waChatUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                              >
                                <MessageCircle className="w-3 h-3 text-emerald-700" />
                                <span>Chat</span>
                              </a>
                            )}
                          </div>
                        )}

                        {cust.email && (
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            <a
                              href={`mailto:${cust.email}`}
                              className="hover:underline text-stone-800"
                            >
                              {cust.email}
                            </a>
                          </div>
                        )}

                        {cust.address && (
                          <div className="flex items-start gap-1.5 text-stone-600 pt-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                            <span className="text-[11px] leading-relaxed text-stone-700">
                              {cust.address}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer Badge / Summary */}
                      <div className="pt-2 border-t border-dashed border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                        <span>
                          Total visits / logins:{" "}
                          <strong className="text-stone-800">{cust.loginCount}</strong>
                        </span>
                        {cust.totalSpent > 0 && (
                          <span className="font-bold text-amber-950 font-serif">
                            Total: ₹{cust.totalSpent}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================
             ORDERS SECTION
             ======================================================== */
          <>
            {/* STATS OVERVIEW CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Revenue */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Total Revenue
            </span>
            <div className="font-serif text-xl sm:text-2xl font-bold text-amber-950 flex items-baseline gap-0.5">
              <span>₹{stats.totalRevenue.toLocaleString("en-IN")}</span>
            </div>
            <p className="text-[10px] text-stone-500">Collected + COD</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Total Orders
            </span>
            <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              {stats.totalOrders}
            </div>
            <p className="text-[10px] text-stone-500">All customer bags</p>
          </div>

          {/* New Confirmed */}
          <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-2xs space-y-1 bg-amber-50/40">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
              New Confirmed
            </span>
            <div className="font-serif text-xl sm:text-2xl font-bold text-amber-900">
              {stats.confirmed}
            </div>
            <p className="text-[10px] text-amber-700">Awaiting stitching</p>
          </div>

          {/* In Stitching */}
          <div className="bg-white rounded-2xl border border-purple-200/80 p-4 shadow-2xs space-y-1 bg-purple-50/40">
            <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider flex items-center gap-1">
              <span>🧵 In Stitching</span>
            </span>
            <div className="font-serif text-xl sm:text-2xl font-bold text-purple-900">
              {stats.inStitching}
            </div>
            <p className="text-[10px] text-purple-700">Mom crafting now</p>
          </div>

          {/* Dispatched */}
          <div className="bg-white rounded-2xl border border-indigo-200/80 p-4 shadow-2xs space-y-1 bg-indigo-50/40">
            <span className="text-[10px] uppercase font-bold text-indigo-800 tracking-wider">
              Dispatched
            </span>
            <div className="font-serif text-xl sm:text-2xl font-bold text-indigo-900">
              {stats.dispatched}
            </div>
            <p className="text-[10px] text-indigo-700">With courier</p>
          </div>

          {/* Delivered */}
          <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-2xs space-y-1 bg-emerald-50/40">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Delivered
            </span>
            <div className="font-serif text-xl sm:text-2xl font-bold text-emerald-900">
              {stats.delivered}
            </div>
            <p className="text-[10px] text-emerald-700">Delivered safely</p>
          </div>
        </section>

        {/* SEARCH & STATUS FILTER CONTROLS */}
        <section className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID (SCN-...), Customer Name, Phone, or City..."
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-stone-500 font-medium">
              Showing <strong className="text-stone-900 font-bold">{filteredOrders.length}</strong> of{" "}
              {orders.length} orders
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            {[
              { id: "ALL", label: `All Orders (${orders.length})` },
              { id: "ORDER_CONFIRMED", label: `🟡 New Confirmed (${stats.confirmed})` },
              { id: "IN_STITCHING", label: `🧵 In Stitching (${stats.inStitching})` },
              { id: "PACKED", label: `📦 Packed (${stats.packed})` },
              { id: "DISPATCHED", label: `🚚 Dispatched (${stats.dispatched})` },
              { id: "DELIVERED", label: `✅ Delivered (${stats.delivered})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-amber-800 text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* ORDERS LIST */}
        <section className="space-y-6">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">Loading customer orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
              <Package className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-800">No Orders Found</h3>
              <p className="text-xs text-stone-500">
                {searchQuery
                  ? "No customer orders matched your search criteria."
                  : "No orders in this status category right now."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-amber-800 font-bold hover:underline"
                >
                  Clear search query
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const draft = drafts[order.orderId] || {
                status: order.status,
                courierName: order.courierName || "Delhivery Express Surface",
                trackingNumber: order.trackingNumber || "",
                estimatedDelivery: order.estimatedDelivery || "2-3 Business Days",
              };
              const hasUnsavedChanges =
                draft.status !== order.status ||
                draft.courierName !== (order.courierName || "") ||
                draft.trackingNumber !== (order.trackingNumber || "") ||
                draft.estimatedDelivery !== (order.estimatedDelivery || "");

              const cleanPhone = order.customer.phone.replace(/\D/g, "").slice(-10);
              const waText = encodeURIComponent(
                `Namaste ${order.customer.fullName}! This is Shreya Crafts Nest regarding your handcrafted order #${order.orderId}. Status: ${STATUS_LABELS[order.status].label}.`
              );

              return (
                <article
                  key={order.orderId}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden divide-y divide-stone-100 hover:border-amber-300 transition-colors"
                >
                  {/* ORDER CARD HEADER */}
                  <div className="p-5 sm:p-6 bg-stone-50/60 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-bold text-stone-900 bg-white px-3 py-1 rounded-lg border border-stone-200 shadow-2xs">
                        #{order.orderId}
                      </span>
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          STATUS_LABELS[order.status].color
                        }`}
                      >
                        {STATUS_LABELS[order.status].icon} {STATUS_LABELS[order.status].label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPrintOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-800 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-800" />
                        <span>Print Shipping Slip</span>
                      </button>

                      <Link
                        href={`/track-order?query=${order.orderId}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors"
                        title="View customer tracking page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Track</span>
                      </Link>
                    </div>
                  </div>

                  {/* ORDER DETAILS GRID */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT: Customer Shipping Details (4 cols) */}
                    <div className="lg:col-span-4 space-y-3 bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                        <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">
                          Customer Information
                        </span>
                        <a
                          href={`https://wa.me/91${cleanPhone}?text=${waText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-md"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-700" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      <div className="space-y-1.5">
                        <p className="font-bold text-stone-900 text-sm">{order.customer.fullName}</p>
                        <p className="text-stone-600 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>+91 {cleanPhone}</span>
                        </p>
                        <p className="text-stone-600 leading-relaxed flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                          <span>
                            {order.customer.address}, {order.customer.city} -{" "}
                            <strong>{order.customer.pincode}</strong>
                          </span>
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">Payment:</span>
                        <span className="font-semibold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* MIDDLE: Ordered Bag Items (4 cols) */}
                    <div className="lg:col-span-4 space-y-3">
                      <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px] block pb-1">
                        Items in Package ({order.items.reduce((s, i) => s + i.quantity, 0)})
                      </span>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-stone-100 bg-stone-50/50 text-xs"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-stone-900 truncate">{item.name}</p>
                              <p className="text-stone-500 text-[11px]">
                                {item.category} • Qty: <strong>{item.quantity}</strong>
                              </p>
                            </div>
                            <span className="font-serif font-bold text-stone-900 flex-shrink-0">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total Amount */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-500">Total with ₹40 Courier:</span>
                        <span className="font-serif text-base font-bold text-amber-950">
                          ₹{order.totalAmountPaid}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT: Production Status & Courier Assignment (4 cols) */}
                    <div className="lg:col-span-4 space-y-3 bg-white p-4 rounded-2xl border border-amber-200/90 shadow-2xs">
                      <div className="flex items-center justify-between pb-1">
                        <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">
                          Update Status & Courier
                        </span>
                        {hasUnsavedChanges && (
                          <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.2 rounded animate-pulse">
                            Unsaved
                          </span>
                        )}
                      </div>

                      {/* Status Selector */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Current Stage:
                        </label>
                        <select
                          value={draft.status}
                          onChange={(e) =>
                            handleDraftChange(
                              order.orderId,
                              "status",
                              e.target.value as AdminOrder["status"]
                            )
                          }
                          className="w-full text-xs font-semibold p-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="ORDER_CONFIRMED">🟡 Order Confirmed</option>
                          <option value="IN_STITCHING">🧵 In Stitching by Mom</option>
                          <option value="PACKED">📦 Packed & Ready</option>
                          <option value="DISPATCHED">🚚 Dispatched with Courier</option>
                          <option value="DELIVERED">✅ Delivered to Customer</option>
                        </select>
                      </div>

                      {/* Courier Partner */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Courier Partner:
                        </label>
                        <input
                          type="text"
                          value={draft.courierName}
                          onChange={(e) =>
                            handleDraftChange(order.orderId, "courierName", e.target.value)
                          }
                          placeholder="e.g. Delhivery Surface Express / India Post"
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      {/* Tracking Number */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Courier Tracking / AWB No:
                        </label>
                        <input
                          type="text"
                          value={draft.trackingNumber}
                          onChange={(e) =>
                            handleDraftChange(order.orderId, "trackingNumber", e.target.value)
                          }
                          placeholder="e.g. DEL-8491028392"
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                        />
                      </div>

                      {/* Estimated Delivery */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Estimated Delivery:
                        </label>
                        <input
                          type="text"
                          value={draft.estimatedDelivery}
                          onChange={(e) =>
                            handleDraftChange(order.orderId, "estimatedDelivery", e.target.value)
                          }
                          placeholder="e.g. In 2-3 Business Days"
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => handleSaveOrder(order.orderId)}
                        disabled={isUpdating === order.orderId}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                          hasUnsavedChanges
                            ? "bg-amber-800 hover:bg-amber-900 text-white"
                            : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                        }`}
                      >
                        {isUpdating === order.orderId ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>{hasUnsavedChanges ? "Save Status & Tracking" : "Status Saved"}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
          </>
        )}
      </main>

      {/* =========================================================================
          SCREEN 3: PRINTABLE SHIPPING LABEL / PACKING SLIP MODAL
      ========================================================================= */}
      {printOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Dispatch Slip Preview
              </span>
              <button
                onClick={() => setPrintOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PRINTABLE AREA (Targeted by print CSS) */}
            <div id="printable-slip" className="border-2 border-stone-800 p-6 rounded-2xl space-y-5 text-stone-900">
              {/* Slip Header */}
              <div className="flex items-center justify-between border-b-2 border-stone-800 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-black tracking-tight">
                    SHREYA CRAFTS NEST
                  </h2>
                  <p className="text-xs text-stone-600 font-medium">
                    Handmade Cotton Bags & Pouches • Stitched With Love
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold block">
                    #{printOrder.orderId}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {new Date(printOrder.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Courier Barcode Line */}
              <div className="bg-stone-100 p-2.5 rounded-lg border border-stone-300 flex items-center justify-between text-xs font-mono font-bold">
                <span>COURIER: {printOrder.courierName || "Delhivery Surface"}</span>
                <span>AWB: {printOrder.trackingNumber || "PENDING-ASSIGN"}</span>
              </div>

              {/* Ship To & Ship From */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Ship To */}
                <div className="border border-stone-300 p-3 rounded-xl bg-stone-50/50 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500 block">
                    DELIVER TO:
                  </span>
                  <p className="font-bold text-sm text-stone-900">{printOrder.customer.fullName}</p>
                  <p className="text-stone-700 leading-relaxed">
                    {printOrder.customer.address}, {printOrder.customer.city}
                  </p>
                  <p className="font-bold text-stone-900">PINCODE: {printOrder.customer.pincode}</p>
                  <p className="text-stone-800">Phone: +91 {printOrder.customer.phone}</p>
                </div>

                {/* Ship From */}
                <div className="border border-stone-300 p-3 rounded-xl bg-stone-50/50 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500 block">
                    SHIPPED FROM:
                  </span>
                  <p className="font-bold text-sm text-stone-900">Shreya Crafts Nest Studio</p>
                  <p className="text-stone-700 leading-relaxed">
                    Yelahanka Campus, Bengaluru, Karnataka - 560064
                  </p>
                  <p className="text-stone-800">Support: +91 94917 10704 (Sudha Rani)</p>
                  <p className="text-[10px] text-stone-500">artisan@shreyacraftnest.in</p>
                </div>
              </div>

              {/* Package Contents Table */}
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500 block mb-1.5">
                  Package Manifest:
                </span>
                <table className="w-full text-xs border border-stone-300 rounded-lg overflow-hidden">
                  <thead className="bg-stone-100 border-b border-stone-300">
                    <tr>
                      <th className="p-2 text-left">Item Description</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {printOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right font-serif">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                    <tr className="bg-stone-50 font-bold">
                      <td colSpan={2} className="p-2 text-right">
                        Total Collectible Amount:
                      </td>
                      <td className="p-2 text-right font-serif text-sm">
                        ₹{printOrder.totalAmountPaid} ({printOrder.paymentMethod.includes("COD") ? "COD" : "PAID"})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Artisan Note Footer */}
              <div className="text-center pt-2 border-t border-dashed border-stone-300 text-[11px] text-stone-600 italic">
                🌿 Stitched by mom with sustainable cotton • Handle with love
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPrintOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Dispatch Label</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
