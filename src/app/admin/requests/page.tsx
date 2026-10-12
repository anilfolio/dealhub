"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import {
  Gavel,
  Clock,
  Car,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Ship,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Plus,
  Building2,
  FileText,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  DealerBid,
  DealerPurchase,
  DealerRequest,
  getStoredBids,
  saveStoredBids,
  updateBidStatus,
  getStoredPurchases,
  saveStoredPurchases,
  updatePurchaseStage,
  STAGE_TITLES,
  getStoredRequests,
  saveStoredRequests,
  updateDealerRequestStatus,
  getVehiclePhoto,
  findHeiwaVehicle,
} from "@/lib/dealerStore";
import { HEIWA_VEHICLES, calculateLandedCost } from "@/lib/heiwaData";

export default function AdminRequestsPage() {
  const [bids, setBids] = useState<DealerBid[]>([]);
  const [requests, setRequests] = useState<DealerRequest[]>([]);
  const [purchases, setPurchases] = useState<DealerPurchase[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "bids" | "reservations" | "inspections" | "logistics">("bids");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Ops notes modal
  const [activeBidForNotes, setActiveBidForNotes] = useState<DealerBid | null>(null);
  const [bidOpsNotes, setBidOpsNotes] = useState("");

  // Logistics edit modal
  const [editingPurchase, setEditingPurchase] = useState<DealerPurchase | null>(null);
  const [editVesselName, setEditVesselName] = useState("");
  const [editEtaDate, setEditEtaDate] = useState("");
  const [editVinNumber, setEditVinNumber] = useState("");

  const refreshData = () => {
    setBids(getStoredBids());
    setRequests(getStoredRequests());
    setPurchases(getStoredPurchases());
  };

  useEffect(() => {
    refreshData();
    const handleStoreChange = () => {
      refreshData();
    };

    window.addEventListener("autohub_dealer_store_change", handleStoreChange);
    window.addEventListener("autoheiwa_sync_change", handleStoreChange);
    return () => {
      window.removeEventListener("autohub_dealer_store_change", handleStoreChange);
      window.removeEventListener("autoheiwa_sync_change", handleStoreChange);
    };
  }, []);

  // Actions on Bids
  const handleMarkBidStatus = (bidId: string, newStatus: DealerBid["status"]) => {
    updateBidStatus(bidId, newStatus);
    refreshData();
  };

  const handleSaveBidOpsNotes = () => {
    if (!activeBidForNotes) return;
    updateBidStatus(activeBidForNotes.id, activeBidForNotes.status, bidOpsNotes);
    setActiveBidForNotes(null);
    setBidOpsNotes("");
    refreshData();
  };

  // Actions on Requests
  const handleUpdateRequestStatus = (requestId: string, status: DealerRequest["status"], notes?: string) => {
    updateDealerRequestStatus(requestId, status, notes);
    refreshData();
  };

  // Actions on Logistics
  const handleAdvanceStage = (purchase: DealerPurchase) => {
    if (purchase.currentStage >= 5) return;
    const nextStage = (purchase.currentStage + 1) as 1 | 2 | 3 | 4 | 5;
    updatePurchaseStage(purchase.id, nextStage);
    refreshData();
  };

  const handleSaveLogisticsDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPurchase) return;
    updatePurchaseStage(editingPurchase.id, editingPurchase.currentStage, {
      vesselName: editVesselName || editingPurchase.vesselName,
      etaDate: editEtaDate || editingPurchase.etaDate,
      vinComplianceNumber: editVinNumber || editingPurchase.vinComplianceNumber,
    });
    setEditingPurchase(null);
    refreshData();
  };

  // Counts
  const pendingRequestsCount = requests.filter((r) => r.status === "pending").length;
  const activeBidsCount = bids.filter((b) => b.status === "leading").length;
  const wonBidsCount = bids.filter((b) => b.status === "won").length;

  const reservations = requests.filter((r) => r.type === "reserve");
  const inspections = requests.filter((r) => r.type === "inspection" || r.type === "sourcing_inquiry");

  // Filtering
  const filteredBids = bids.filter((b) => {
    const matchesSearch =
      b.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleChassis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicleStockId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.dealerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.vehicleSummary && r.vehicleSummary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.vehicleChassis && r.vehicleChassis.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInspections = inspections.filter((r) => {
    const matchesSearch =
      r.dealerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.vehicleSummary && r.vehicleSummary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredPurchases = purchases.filter((p) => {
    return (
      p.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vehicleChassis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vesselName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-7 pb-16 font-sans">
        {/* ─── Top Header & Summary ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                Live Bid & Request Sync Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827] mt-1">
              Requests & Bids Operations
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Manage incoming dealer proxy bids, vehicle 24h reservations, and vehicle shipping fulfillment
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={refreshData}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Refresh Queue</span>
            </button>
            <Link
              href="/admin/vehicles"
              className="px-3.5 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold shadow-md shadow-rose-950/20 transition-all flex items-center gap-1.5"
            >
              <Car size={14} />
              <span>Browse Lots</span>
            </Link>
          </div>
        </div>

        {/* ─── KPI Metric Cards ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-soft">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Proxy Bids
            </span>
            <div className="text-2xl font-black text-[#111827] mt-1 font-mono">
              {bids.length}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {activeBidsCount} currently leading
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-soft">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="text-2xl font-black text-rose-600 mt-1 font-mono">
              {pendingRequestsCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Requires Ops Review
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-soft">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Auctions Won
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
              {wonBidsCount}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Converted to purchases
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-soft">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Shipments
            </span>
            <div className="text-2xl font-black text-blue-700 mt-1 font-mono">
              {purchases.length}
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-0.5">
              Japan ⇄ Ports of Auckland
            </div>
          </div>
        </div>

        {/* ─── Filter Tabs & Search Bar ─── */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-soft">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTab("bids")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "bids"
                    ? "bg-[#0F1B2E] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Gavel size={14} />
                <span>Proxy Bids ({bids.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("reservations")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "reservations"
                    ? "bg-[#0F1B2E] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Clock size={14} />
                <span>Reservations ({reservations.length})</span>
                {reservations.filter((r) => r.status === "pending").length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("inspections")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "inspections"
                    ? "bg-[#0F1B2E] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <FileText size={14} />
                <span>Inspections & Inquiries ({inspections.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("logistics")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "logistics"
                    ? "bg-[#0F1B2E] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Ship size={14} />
                <span>Logistics Pipeline ({purchases.length})</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search lots, chassis, dealers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#E11D48] text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* ─── TAB CONTENT 1: PROXY BIDS MANAGEMENT ─── */}
        {activeTab === "bids" && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">
                  Japanese Auction Proxy Bids
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dealer bids placed on Tokyo/Yokohama auction houses. Mark Won to auto-generate Purchase Orders.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {filteredBids.length} Bids Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Vehicle Lot</th>
                    <th className="py-3 px-4">Dealership</th>
                    <th className="py-3 px-4">FOB Bid (JPY)</th>
                    <th className="py-3 px-4">Landed (NZD)</th>
                    <th className="py-3 px-4">Auction Session</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ops Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBids.map((bid) => {
                    const matchingCar = findHeiwaVehicle(bid.vehicleChassis);
                    const photo = matchingCar ? getVehiclePhoto(matchingCar) : "/vehicles/aqua.jpg";

                    return (
                      <tr key={bid.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={photo}
                              alt=""
                              className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900">
                                {bid.year} {bid.make} {bid.model}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Stock #{bid.vehicleStockId} · {bid.vehicleChassis}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">Auckland Auto Group</span>
                          <span className="block text-[10px] text-slate-400">Penrose, NZ</span>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          ¥{bid.bidFobJpy.toLocaleString()}
                        </td>

                        <td className="py-3 px-4 font-mono font-extrabold text-emerald-700">
                          NZ${bid.landedCostNzd.toLocaleString()}
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-slate-800 font-medium">{bid.auctionHouse || "USS Tokyo"}</div>
                          <div className="text-[11px] text-slate-400">{bid.auctionDate}</div>
                        </td>

                        <td className="py-3 px-4">
                          {bid.status === "won" && (
                            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-100 text-emerald-800">
                              Won (Purchased)
                            </span>
                          )}
                          {bid.status === "leading" && (
                            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-blue-100 text-blue-800">
                              Leading Proxy
                            </span>
                          )}
                          {bid.status === "under_reserve" && (
                            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-amber-100 text-amber-800">
                              Under Reserve
                            </span>
                          )}
                          {bid.status === "outbid" && (
                            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-rose-100 text-rose-800">
                              Outbid
                            </span>
                          )}
                          {bid.status === "passed" && (
                            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-slate-100 text-slate-700">
                              Passed
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {bid.status !== "won" ? (
                              <>
                                <button
                                  onClick={() => handleMarkBidStatus(bid.id, "won")}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                  title="Mark as Won at auction (converts to Purchase Order)"
                                >
                                  <Check size={12} />
                                  <span>Mark Won</span>
                                </button>

                                <button
                                  onClick={() => handleMarkBidStatus(bid.id, "outbid")}
                                  className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] transition-all cursor-pointer"
                                  title="Alert dealer that proxy bid has been outbid"
                                >
                                  <span>Outbid</span>
                                </button>
                              </>
                            ) : (
                              <Link
                                href="/purchases"
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all flex items-center gap-1"
                              >
                                <span>View Purchase</span>
                                <ExternalLink size={11} />
                              </Link>
                            )}

                            <button
                              onClick={() => {
                                setActiveBidForNotes(bid);
                                setBidOpsNotes(bid.adminNotes || "");
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="Add ops remark / hammer price notes"
                            >
                              <MessageSquare size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB CONTENT 2: RESERVATIONS MANAGEMENT ─── */}
        {activeTab === "reservations" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5">
              <h3 className="text-base font-extrabold text-[#111827]">
                Dealer 24-Hour Fixed Price Reservations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dealers requesting 24-hour holds on Japanese inventory while closing retail buyer agreements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReservations.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-soft-md transition-shadow p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={req.vehiclePhoto || "/vehicles/aqua.jpg"}
                        alt=""
                        className="w-12 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {req.vehicleSummary || "Vehicle Lot"}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Stock #{req.vehicleStockId} · {req.vehicleChassis}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        req.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "declined"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {req.status === "approved" ? "Locked 24h" : req.status === "declined" ? "Declined" : "Pending"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Dealer:</span>
                      <strong className="text-slate-900">{req.dealerName}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Contact:</span>
                      <span className="font-mono text-slate-800">{req.dealerContact}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-200 text-slate-700 italic">
                      &quot;{req.notes}&quot;
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {req.status !== "approved" && (
                      <button
                        onClick={() => handleUpdateRequestStatus(req.id, "approved")}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check size={13} />
                        <span>Approve 24h Lock</span>
                      </button>
                    )}

                    {req.status !== "declined" && (
                      <button
                        onClick={() => handleUpdateRequestStatus(req.id, "declined")}
                        className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB CONTENT 3: INSPECTIONS & SOURCING INQUIRIES ─── */}
        {activeTab === "inspections" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5">
              <h3 className="text-base font-extrabold text-[#111827]">
                Inspection Translations & Custom Sourcing Inquiries
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Requests for Japanese auction sheet translations, physical inspector verifications, and custom vehicle sourcing.
              </p>
            </div>

            <div className="space-y-3">
              {filteredInspections.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={req.vehiclePhoto || "/vehicles/aqua.jpg"}
                      alt=""
                      className="w-14 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {req.vehicleSummary || "Sourcing Request"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                          {req.type === "inspection" ? "Sheet Translation" : "Custom Sourcing"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        From: <strong>{req.dealerName}</strong> ({req.dealerContact})
                      </div>
                      <div className="text-xs text-slate-700 italic mt-0.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        &quot;{req.notes}&quot;
                      </div>
                      {req.adminNotes && (
                        <div className="text-xs text-emerald-800 mt-1 font-medium flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span>Ops Note: {req.adminNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        handleUpdateRequestStatus(
                          req.id,
                          "completed",
                          "Japanese inspection report translated and sent to dealer email."
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check size={13} />
                      <span>Complete & Notify Dealer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB CONTENT 4: LOGISTICS FULFILLMENT PIPELINE ─── */}
        {activeTab === "logistics" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-5">
              <h3 className="text-base font-extrabold text-[#111827]">
                Logistics & RoRo Vessel Transit Operations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Advance vehicle shipping milestones from Japan export ports (Yokohama, Nagoya, Kobe) to Ports of Auckland.
              </p>
            </div>

            <div className="space-y-4">
              {filteredPurchases.map((purchase) => {
                const matchingCar = findHeiwaVehicle(purchase.vehicleChassis);
                const photo = matchingCar ? getVehiclePhoto(matchingCar) : "/vehicles/c-hr.jpg";

                return (
                  <div
                    key={purchase.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={photo}
                          alt=""
                          className="w-16 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-base">
                              {purchase.year} {purchase.make} {purchase.model}
                            </h4>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              Order #{purchase.id}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            Chassis: {purchase.vehicleChassis} · {purchase.kms.toLocaleString()} km · Landed: NZ${purchase.totalLandedNzd.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingPurchase(purchase);
                            setEditVesselName(purchase.vesselName);
                            setEditEtaDate(purchase.etaDate);
                            setEditVinNumber(purchase.vinComplianceNumber || "");
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Edit Vessel / ETA
                        </button>

                        {purchase.currentStage < 5 && (
                          <button
                            onClick={() => handleAdvanceStage(purchase)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Advance to Stage {purchase.currentStage + 1}</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar (5 Stages) */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-2 text-center text-xs">
                        {[1, 2, 3, 4, 5].map((stg) => {
                          const isDone = stg <= purchase.currentStage;
                          const isCurrent = stg === purchase.currentStage;
                          return (
                            <div
                              key={stg}
                              className={`p-2 rounded-xl border transition-all ${
                                isCurrent
                                  ? "bg-blue-50 border-blue-400 font-bold text-blue-900 shadow-2xs"
                                  : isDone
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                                  : "bg-slate-50 border-slate-200 text-slate-400"
                              }`}
                            >
                              <div className="text-[10px] uppercase tracking-wider">Stage {stg}</div>
                              <div className="text-[11px] truncate mt-0.5">
                                {stg === 1
                                  ? "Auction Won"
                                  : stg === 2
                                  ? "De-reg & JEVIC"
                                  : stg === 3
                                  ? "RoRo Vessel"
                                  : stg === 4
                                  ? "Customs & MAF"
                                  : "Yard Ready"}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                        <span>
                          <strong>Current Status:</strong> {purchase.stageStatus}
                        </span>
                        <span className="font-mono text-slate-500">
                          Vessel: <strong>{purchase.vesselName}</strong> · ETA: {purchase.etaDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Ops Notes Modal for Bids ─── */}
        {activeBidForNotes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Auction Ops Notes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeBidForNotes.year} {activeBidForNotes.make} {activeBidForNotes.model} (Stock #{activeBidForNotes.vehicleStockId})
                  </p>
                </div>
                <button
                  onClick={() => setActiveBidForNotes(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Internal Remarks / Hammer Price Feedback
                </label>
                <textarea
                  rows={3}
                  value={bidOpsNotes}
                  onChange={(e) => setBidOpsNotes(e.target.value)}
                  placeholder="e.g. Hammer price won at ¥880k (¥10k below dealer maximum). Transferred to Yokohama holding yard."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#E11D48] resize-none text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setActiveBidForNotes(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBidOpsNotes}
                  className="flex-1 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  Save Remarks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Logistics Edit Modal ─── */}
        {editingPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Logistics Schedule</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingPurchase.year} {editingPurchase.make} {editingPurchase.model} (Order #{editingPurchase.id})
                  </p>
                </div>
                <button
                  onClick={() => setEditingPurchase(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveLogisticsDetails} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">RoRo Vessel Name & Voyage</label>
                  <input
                    type="text"
                    value={editVesselName}
                    onChange={(e) => setEditVesselName(e.target.value)}
                    placeholder="e.g. Trans Future 7 (Voy 083)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Arrival (ETA Ports of Auckland)</label>
                  <input
                    type="date"
                    value={editEtaDate}
                    onChange={(e) => setEditEtaDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NZ VIN / MAF Compliance Number</label>
                  <input
                    type="text"
                    value={editVinNumber}
                    onChange={(e) => setEditVinNumber(e.target.value)}
                    placeholder="e.g. 7AT0H00X260999"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingPurchase(null)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Update Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
