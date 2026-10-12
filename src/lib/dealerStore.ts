// Dealer Store & Helper Services for DealHub DIP Phase 1
// Handles Wishlist Criteria, Watchlist, Bids, Purchases, Requests, and Vehicle Photo mappings

import { HEIWA_VEHICLES, HeiwaVehicle, calculateLandedCost, LANDED_COST_CONSTANTS } from './heiwaData';
import { DEALERS, Dealer } from './data';
import { addNotificationToSyncStore } from './syncStore';

export interface WishListCriteria {
  id: string;
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  maxKms: number;
  maxBudget: number; // NZD landed budget
}

export interface DealerBid {
  id: string;
  vehicleStockId: string;
  vehicleChassis: string;
  make: string;
  model: string;
  year: number;
  kms: number;
  color: string;
  bidFobJpy: number;
  landedCostNzd: number;
  status: 'leading' | 'under_reserve' | 'outbid' | 'won' | 'passed';
  auctionDate: string;
  auctionTimeLeft: string;
  auctionHouse?: string;
  createdAt: string;
  adminNotes?: string;
}

export type DealerRequestType = 'reserve' | 'inspection' | 'sourcing_inquiry' | 'quote';
export type DealerRequestStatus = 'pending' | 'reviewing' | 'approved' | 'declined' | 'completed';

export interface DealerRequest {
  id: string;
  dealerId: number;
  dealerName: string;
  dealerContact: string;
  type: DealerRequestType;
  status: DealerRequestStatus;
  vehicleStockId?: string;
  vehicleChassis?: string;
  vehicleSummary?: string;
  vehiclePhoto?: string;
  notes: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DealerPurchase {
  id: string;
  vehicleStockId: string;
  vehicleChassis: string;
  make: string;
  model: string;
  year: number;
  kms: number;
  color: string;
  purchaseFobJpy: number;
  totalLandedNzd: number;
  vesselName: string;
  departurePort: string;
  destinationPort: string;
  etdDate: string;
  etaDate: string;
  currentStage: 1 | 2 | 3 | 4 | 5; // 1: Won, 2: De-reg/JEVIC, 3: Shipping, 4: Customs/MAF, 5: Yard Ready
  stageStatus: string;
  vinComplianceNumber?: string;
}

export const INITIAL_REQUESTS: DealerRequest[] = [
  {
    id: 'req-501',
    dealerId: 1,
    dealerName: 'Auckland Auto Group',
    dealerContact: 'David Miller (+64 21 582 9104)',
    type: 'reserve',
    status: 'pending',
    vehicleStockId: '1173386',
    vehicleChassis: 'ZYX10-2079113',
    vehicleSummary: '2017 Toyota C-HR G LED Hybrid (53,000 km)',
    vehiclePhoto: '/vehicles/c-hr.jpg',
    notes: 'Please hold 24-hr reserve for Auckland Auto Group. Customer ready to sign agreement.',
    createdAt: '2026-10-12T09:15:00Z',
  },
  {
    id: 'req-502',
    dealerId: 1,
    dealerName: 'Auckland Auto Group',
    dealerContact: 'David Miller (+64 21 582 9104)',
    type: 'inspection',
    status: 'reviewing',
    vehicleStockId: '1173019',
    vehicleChassis: 'MXPK11-2624436',
    vehicleSummary: '2021 Toyota Aqua Hybrid (112,000 km)',
    vehiclePhoto: '/vehicles/aqua.jpg',
    notes: 'Need translation of Japanese USS auction sheet remarks regarding A1/W2 marks on left door.',
    adminNotes: 'Heiwa Tokyo inspector dispatched to USS Tokyo today.',
    createdAt: '2026-10-12T08:30:00Z',
  },
  {
    id: 'req-503',
    dealerId: 2,
    dealerName: 'Hamilton Motors',
    dealerContact: 'Marcus Vance (+64 7 849 2200)',
    type: 'sourcing_inquiry',
    status: 'completed',
    vehicleSummary: '2020 Honda Vezel e:HEV Z Package (< 60,000 km)',
    vehiclePhoto: '/vehicles/aqua.jpg',
    notes: 'Looking for pearl white or dark blue Vezel under NZ$26,000 landed budget.',
    adminNotes: 'Located 2 matching units in CAA Chubu auction for Wednesday session. Notified Marcus.',
    createdAt: '2026-10-11T14:20:00Z',
  },
];

// Default initial wishlist criteria
export const DEFAULT_WISHLIST: WishListCriteria[] = [
  {
    id: 'crit-1',
    make: 'Toyota',
    model: 'Aqua / C-HR',
    yearFrom: 2014,
    yearTo: 2024,
    maxKms: 90000,
    maxBudget: 25000,
  },
];

// Initial demo bids
export const INITIAL_BIDS: DealerBid[] = [
  {
    id: 'bid-101',
    vehicleStockId: '1173019',
    vehicleChassis: 'MXPK11-2624436',
    make: 'Toyota',
    model: 'Aqua',
    year: 2021,
    kms: 112000,
    color: 'pearl',
    bidFobJpy: 890000,
    landedCostNzd: 15380,
    status: 'leading',
    auctionDate: 'Tomorrow, 14:00 JST',
    auctionTimeLeft: '18h 42m',
    auctionHouse: 'USS Tokyo',
    createdAt: '2026-09-29T14:30:00Z',
  },
  {
    id: 'bid-102',
    vehicleStockId: '1173386',
    vehicleChassis: 'ZYX10-2079113',
    make: 'Toyota',
    model: 'C-hr',
    year: 2017,
    kms: 53000,
    color: 'silver',
    bidFobJpy: 1250000,
    landedCostNzd: 19850,
    status: 'under_reserve',
    auctionDate: 'In 2 days, 11:30 JST',
    auctionTimeLeft: '1d 16h',
    auctionHouse: 'USS Yokohama',
    createdAt: '2026-09-28T09:15:00Z',
  },
  {
    id: 'bid-103',
    vehicleStockId: '322293',
    vehicleChassis: 'ZVW51-6108888',
    make: 'Toyota',
    model: 'Prius',
    year: 2019,
    kms: 24000,
    color: 'blue',
    bidFobJpy: 1350000,
    landedCostNzd: 21200,
    status: 'won',
    auctionDate: 'Yesterday',
    auctionTimeLeft: 'Completed',
    auctionHouse: 'HAA Kobe',
    createdAt: '2026-09-27T10:00:00Z',
  },
];

// Initial demo purchases
export const INITIAL_PURCHASES: DealerPurchase[] = [
  {
    id: 'po-78901',
    vehicleStockId: '321855',
    vehicleChassis: 'ZYX10-2188588',
    make: 'Toyota',
    model: 'C-hr',
    year: 2018,
    kms: 106000,
    color: 'pearl-white',
    purchaseFobJpy: 525000,
    totalLandedNzd: 10950,
    vesselName: 'Trans Future 7 (Voy 082)',
    departurePort: 'Nagoya, Japan',
    destinationPort: 'Ports of Auckland, NZ',
    etdDate: '2026-09-22',
    etaDate: '2026-10-14',
    currentStage: 3,
    stageStatus: 'At Sea (Tasman Route) · ETA 14 Oct',
    vinComplianceNumber: '7AT0H00X260901',
  },
  {
    id: 'po-78902',
    vehicleStockId: '321973',
    vehicleChassis: 'DJ3FS-142717',
    make: 'Mazda',
    model: 'Demio',
    year: 2018,
    kms: 38000,
    color: 'meteor grey',
    purchaseFobJpy: 325000,
    totalLandedNzd: 8250,
    vesselName: 'Dresden Highway (Voy 114)',
    departurePort: 'Yokohama, Japan',
    destinationPort: 'Ports of Auckland, NZ',
    etdDate: '2026-09-10',
    etaDate: '2026-09-28',
    currentStage: 4,
    stageStatus: 'Customs Cleared · MAF Bio-Security Inspection',
    vinComplianceNumber: '7AT0H00X260844',
  },
];

// Curated high quality authentic automotive photography for every model
export const MODEL_IMAGE_MAP: Record<string, string> = {
  // Toyota
  aqua: '/vehicles/aqua.jpg',
  'aqua crossover': '/vehicles/aqua.jpg',
  'c-hr': '/vehicles/c-hr.jpg',
  chr: '/vehicles/c-hr.jpg',
  'prius 5d': '/vehicles/prius-5d.jpg',
  prius: '/vehicles/prius-5d.jpg',
  'prius alpha': '/vehicles/prius-alpha.jpg',
  'prius 50': '/vehicles/prius-5d.jpg',
  rav4: '/vehicles/rav4.jpg',
  sienta: '/vehicles/sienta.jpg',
  corolla: '/vehicles/corolla-touring.jpg',
  'corolla cross': '/vehicles/corolla-cross.jpg',
  'corolla touring': '/vehicles/corolla-touring.jpg',
  'corolla sports': '/vehicles/corolla-touring.jpg',
  'avensis wagon': '/vehicles/corolla-touring.jpg',
  vitz: '/vehicles/vitz.jpg',
  yaris: '/vehicles/vitz.jpg',
  'yarithe hybrid': '/vehicles/corolla-cross.jpg',
  harrier: '/vehicles/rav4.jpg',
  'harrier hybrid': '/vehicles/rav4.jpg',
  'harrier hybrid 4wd': '/vehicles/rav4.jpg',
  alphard: '/vehicles/alphard.jpg',
  'alphard hybrid': '/vehicles/alphard.jpg',
  'hiace van': '/vehicles/hiace.jpg',
  hiace: '/vehicles/hiace.jpg',
  hilux: '/vehicles/rav4.jpg',

  // Honda
  accord: '/vehicles/accord.jpg',
  civic: '/vehicles/civic.jpg',
  jade: '/vehicles/jade.jpg',
  crv: '/vehicles/crv.jpg',
  'cr-v': '/vehicles/crv.jpg',
  fit: '/vehicles/aqua.jpg',

  // Nissan
  note: '/vehicles/note.jpg',
  'note 4d': '/vehicles/note.jpg',
  cube: '/vehicles/cube.jpg',
  march: '/vehicles/march.jpg',
  'nv350 caravan van': '/vehicles/hiace.jpg',
  'nv350 vanette van': '/vehicles/nv200.jpg',
  nv200: '/vehicles/nv200.jpg',
  'x-trail': '/vehicles/forester.jpg',
  xtrail: '/vehicles/forester.jpg',

  // Mazda
  demio: '/vehicles/demio.jpg',
  'cx-3': '/vehicles/cx3.jpg',
  cx3: '/vehicles/cx3.jpg',
  'cx-5': '/vehicles/cx3.jpg',
  cx5: '/vehicles/cx3.jpg',
  mazda3: '/vehicles/mazda3.jpg',

  // Subaru
  levorg: '/vehicles/levorg.jpg',
  'levorg 4wd': '/vehicles/levorg.jpg',
  xv: '/vehicles/xv.jpg',
  wrx: '/vehicles/levorg.jpg',
  forester: '/vehicles/forester.jpg',

  // Suzuki
  swift: '/vehicles/swift.jpg',
  ignis: '/vehicles/ignis.jpg',

  // Lexus
  rx: '/vehicles/lexus_rx.jpg',
  nx: '/vehicles/lexus_nx.jpg',

  // BMW
  '3 series': '/vehicles/bmw3.jpg',
  '5 series': '/vehicles/bmw5.jpg',

  // Tesla
  model3: '/vehicles/model3.jpg',
};

// Return a clean photo URL for any vehicle
export function getVehiclePhoto(vehicle: HeiwaVehicle): string {
  if (vehicle && vehicle.photoUrl && vehicle.photoUrl.trim().length > 0) {
    const customPhoto = vehicle.photoUrl.trim();
    // Discard any legacy mismatched stock photos (e.g. Camaro or McLaren)
    if (!customPhoto.includes('photo-1552519507-da3b142c6e3d') && !customPhoto.includes('photo-1542282088-72c9c27ed0cd')) {
      return customPhoto;
    }
  }
  const modelKey = (vehicle?.model || '').toLowerCase().trim();
  if (MODEL_IMAGE_MAP[modelKey]) {
    return MODEL_IMAGE_MAP[modelKey];
  }
  // Try partial match
  for (const [key, url] of Object.entries(MODEL_IMAGE_MAP)) {
    if (modelKey.includes(key) || key.includes(modelKey)) {
      return url;
    }
  }
  // Fallback by vehicle category
  if (vehicle.cc === 0 || vehicle.fuelType === 'E') {
    return '/vehicles/model3.jpg';
  }
  if (vehicle.cc > 2200) {
    return '/vehicles/rav4.jpg';
  }
  return '/vehicles/aqua.jpg';
}

// Check if a vehicle is a car (exclude bikes)
export function isCarVehicle(v: HeiwaVehicle): boolean {
  return !['CBR650R', 'CBR250R', 'REBEL 250', 'STREETFIGHTER', 'NINE T SCRAMBLER UNKNOWN'].includes(v.model);
}

// LocalStorage keys
const STORAGE_KEYS = {
  WISHLIST: 'autohub_wishlist_criteria_v2',
  WATCHLIST: 'autohub_dealer_watchlist_v2',
  BIDS: 'autohub_dealer_bids_v2',
  PURCHASES: 'autohub_dealer_purchases_v2',
  DEALERS: 'autohub_dealers_directory_v2',
  CUSTOM_VEHICLES: 'autohub_custom_vehicles_v2',
  REQUESTS: 'autohub_dealer_requests_v2',
};

// Retrieve combined list of base Heiwa vehicles and custom Admin-added vehicles
export function getAllVehicles(): HeiwaVehicle[] {
  const sanitize = (list: HeiwaVehicle[]) =>
    list.map(v => {
      let model = v.model;
      if (model === 'Prius 50') model = 'Prius 5d';
      let photoUrl = v.photoUrl;
      if (photoUrl && (photoUrl.includes('photo-1552519507-da3b142c6e3d') || photoUrl.includes('photo-1542282088-72c9c27ed0cd'))) {
        photoUrl = undefined;
      }
      return { ...v, model, photoUrl };
    });

  if (typeof window === 'undefined') return sanitize(HEIWA_VEHICLES);
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VEHICLES);
    const base = sanitize(HEIWA_VEHICLES);
    if (!raw) return base;
    const custom: HeiwaVehicle[] = JSON.parse(raw);
    if (!Array.isArray(custom) || custom.length === 0) return base;
    const customIds = new Set(custom.map(c => `${c.stockId}-${c.chassis}`));
    const remainingBase = base.filter(v => !customIds.has(`${v.stockId}-${v.chassis}`));
    return [...sanitize(custom), ...remainingBase];
  } catch {
    return sanitize(HEIWA_VEHICLES);
  }
}

// Add or update a vehicle lot as an Admin
export function addAdminVehicle(vehicle: HeiwaVehicle) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VEHICLES);
    const custom: HeiwaVehicle[] = raw ? JSON.parse(raw) : [];
    // Remove if already exists, then prepend to top
    const filtered = custom.filter(v => v.stockId !== vehicle.stockId && v.chassis !== vehicle.chassis);
    const updated = [vehicle, ...filtered];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VEHICLES, JSON.stringify(updated));
    notifyStoreChange();
  } catch (err) {
    console.error('Failed to add admin vehicle:', err);
  }
}

// Delete a custom vehicle lot as an Admin
export function deleteAdminVehicle(stockId: string, chassis: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VEHICLES);
    if (!raw) return;
    const custom: HeiwaVehicle[] = JSON.parse(raw);
    const updated = custom.filter(v => v.stockId !== stockId && v.chassis !== chassis);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VEHICLES, JSON.stringify(updated));
    notifyStoreChange();
  } catch (err) {
    console.error('Failed to delete admin vehicle:', err);
  }
}

// Find vehicle by chassis, stockId or combination
export function findHeiwaVehicle(id: string): HeiwaVehicle | undefined {
  if (!id) return undefined;
  const decodedId = decodeURIComponent(id).trim().toLowerCase();
  const allVehicles = getAllVehicles();
  return allVehicles.find(v => {
    const chassis = v.chassis.toLowerCase();
    const stockId = v.stockId.toLowerCase();
    const combo = `${stockId}-${chassis}`;
    return chassis === decodedId || stockId === decodedId || combo === decodedId;
  });
}

// Calculate realistic estimated NZ market price for a Heiwa car
export function getEstimatedNZRetailPrice(v: HeiwaVehicle): {
  retailPrice: number;
  grossMargin: number;
  marginPercent: number;
  marketRangeMin: number;
  marketRangeMax: number;
} {
  const landed = calculateLandedCost(v.priceFob || 500000).totalLanded;
  // NZ retail averages 20% to 35% above landed cost
  // Better margins on cheaper cars or high demand hybrids
  const markupFactor = (v.kms || 0) < 60000 ? 1.28 : 1.22;
  const retailPrice = Math.round((landed * markupFactor) / 100) * 100;
  const grossMargin = retailPrice - landed;
  const marginPercent = Math.round((grossMargin / (retailPrice || 1)) * 100);
  const marketRangeMin = Math.round((retailPrice * 0.94) / 100) * 100;
  const marketRangeMax = Math.round((retailPrice * 1.08) / 100) * 100;
  return { retailPrice, grossMargin, marginPercent, marketRangeMin, marketRangeMax };
}

// Dispatch global event so all components react immediately
export function notifyStoreChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('autohub_dealer_store_change'));
    window.dispatchEvent(new Event('autoheiwa_sync_change'));
  }
}

// WISHLIST CRITERIA HELPERS
export function getStoredWishlistCriteria(): WishListCriteria[] {
  if (typeof window === 'undefined') return DEFAULT_WISHLIST;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST) || localStorage.getItem('autohub_wishlist');
    if (!raw) return DEFAULT_WISHLIST;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_WISHLIST;
    const sanitized = parsed.map((item, idx) => ({
      id: item?.id || `crit-${idx + 1}`,
      make: item?.make && item.make.trim() !== '' ? item.make : 'Toyota',
      model: typeof item?.model === 'string' && item.model.trim() !== '' ? item.model : 'Aqua / C-HR',
      yearFrom: typeof item?.yearFrom === 'number' && !isNaN(item.yearFrom) ? item.yearFrom : 2013,
      yearTo: typeof item?.yearTo === 'number' && !isNaN(item.yearTo) && item.yearTo > 0 ? item.yearTo : 2026,
      maxKms: typeof item?.maxKms === 'number' && !isNaN(item.maxKms) && item.maxKms > 0 ? item.maxKms : 100000,
      maxBudget: typeof item?.maxBudget === 'number' && !isNaN(item.maxBudget) && item.maxBudget > 0 ? item.maxBudget : 25000,
    }));
    return sanitized.length > 0 ? sanitized : DEFAULT_WISHLIST;
  } catch {
    return DEFAULT_WISHLIST;
  }
}

export function saveStoredWishlistCriteria(criteria: WishListCriteria[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(criteria));
  localStorage.setItem('autohub_wishlist', JSON.stringify(criteria)); // legacy compatibility
  notifyStoreChange();
}

// MATCHING ENGINE: Match vehicles against wishlist criteria
export function matchVehiclesAgainstWishlist(
  vehicles: HeiwaVehicle[],
  criteriaList: WishListCriteria[]
): HeiwaVehicle[] {
  const activeCriteria = (criteriaList && criteriaList.length > 0 ? criteriaList : DEFAULT_WISHLIST)
    .filter(c => c && c.make && c.make.trim() !== '');
  if (activeCriteria.length === 0) return [];

  const matchedSet = new Set<string>();
  const results: HeiwaVehicle[] = [];

  for (const v of vehicles) {
    if (!isCarVehicle(v)) continue;
    const vKey = `${v.stockId}-${v.chassis}`;
    if (matchedSet.has(vKey)) continue;

    for (const c of activeCriteria) {
      const makeMatch = !c.make || v.make.toLowerCase() === c.make.toLowerCase();
      let modelMatch = !c.model || c.model.trim() === '';
      if (c.model && c.model.trim() !== '') {
        const terms = c.model.split('/').map(t => t.trim().toLowerCase().replace(/[-\s]/g, ''));
        const vModel = v.model.toLowerCase().replace(/[-\s]/g, '');
        modelMatch = terms.some(t => t === '' || vModel.includes(t) || t.includes(vModel));
      }
      const yearFrom = typeof c.yearFrom === 'number' && !isNaN(c.yearFrom) ? c.yearFrom : 2012;
      const yearTo = typeof c.yearTo === 'number' && !isNaN(c.yearTo) && c.yearTo > 0 ? c.yearTo : 2030;
      const yearMatch = v.year >= yearFrom && v.year <= yearTo;

      const maxKms = typeof c.maxKms === 'number' && !isNaN(c.maxKms) && c.maxKms > 0 ? c.maxKms : 200000;
      const kmsMatch = v.kms <= maxKms;

      const landed = calculateLandedCost(v.priceFob).totalLanded;
      const maxBudget = typeof c.maxBudget === 'number' && !isNaN(c.maxBudget) && c.maxBudget > 0 ? c.maxBudget : 100000;
      const budgetMatch = landed <= maxBudget;

      if (makeMatch && modelMatch && yearMatch && kmsMatch && budgetMatch) {
        matchedSet.add(vKey);
        results.push(v);
        break;
      }
    }
  }

  return results;
}

// WATCHLIST HELPERS
export function getStoredWatchlist(): string[] {
  if (typeof window === 'undefined') return ['ZYX10-2079113', 'NHP10-6902363'];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    if (!raw) return ['ZYX10-2079113', 'NHP10-6902363'];
    return JSON.parse(raw);
  } catch {
    return ['ZYX10-2079113', 'NHP10-6902363'];
  }
}

export function toggleStoredWatchlist(chassis: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getStoredWatchlist();
  const exists = current.includes(chassis);
  const updated = exists ? current.filter(c => c !== chassis) : [...current, chassis];
  localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(updated));
  notifyStoreChange();
  return !exists;
}

export function isVehicleWatchlisted(chassis: string): boolean {
  const current = getStoredWatchlist();
  return current.includes(chassis);
}

// BIDS HELPERS
export function getStoredBids(): DealerBid[] {
  if (typeof window === 'undefined') return INITIAL_BIDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BIDS);
    if (!raw) return INITIAL_BIDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BIDS;
  } catch {
    return INITIAL_BIDS;
  }
}

export function saveStoredBids(bids: DealerBid[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
  notifyStoreChange();
}

export function placeDealerBid(
  vehicle: HeiwaVehicle,
  bidFobJpy: number,
  auctionHouse?: string
): DealerBid {
  const bids = getStoredBids();
  const landed = calculateLandedCost(bidFobJpy).totalLanded;
  const newBid: DealerBid = {
    id: `bid-${Date.now()}`,
    vehicleStockId: vehicle.stockId,
    vehicleChassis: vehicle.chassis,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    kms: vehicle.kms,
    color: vehicle.colorDesc || vehicle.color,
    bidFobJpy,
    landedCostNzd: landed,
    status: 'leading',
    auctionDate: 'Upcoming Auction',
    auctionTimeLeft: '24h 00m',
    auctionHouse: auctionHouse || 'USS Tokyo',
    createdAt: new Date().toISOString(),
  };

  const updated = [newBid, ...bids.filter(b => b.vehicleChassis !== vehicle.chassis)];
  saveStoredBids(updated);

  addNotificationToSyncStore({
    title: `⚡ Proxy Bid Placed: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    body: `Auckland Auto Group placed FOB ¥${bidFobJpy.toLocaleString()} (NZ$${landed.toLocaleString()} landed). Bid submitted to Tokyo proxy auction desk.`,
    type: 'bid_alert',
    actionUrl: '/my-bids',
  });

  return newBid;
}

export function batchPlaceDealerBids(
  bidsList: { vehicle: HeiwaVehicle; bidFobJpy: number; auctionHouse?: string }[]
): DealerBid[] {
  const currentBids = getStoredBids();
  const newCreated: DealerBid[] = bidsList.map((item, idx) => {
    const landed = calculateLandedCost(item.bidFobJpy).totalLanded;
    return {
      id: `bid-${Date.now()}-${idx}`,
      vehicleStockId: item.vehicle.stockId,
      vehicleChassis: item.vehicle.chassis,
      make: item.vehicle.make,
      model: item.vehicle.model,
      year: item.vehicle.year,
      kms: item.vehicle.kms,
      color: item.vehicle.colorDesc || item.vehicle.color,
      bidFobJpy: item.bidFobJpy,
      landedCostNzd: landed,
      status: 'leading' as const,
      auctionDate: 'Upcoming Auction',
      auctionTimeLeft: '23h 50m',
      auctionHouse: item.auctionHouse || 'USS Tokyo / Yokohama',
      createdAt: new Date().toISOString(),
    };
  });

  const newChassisSet = new Set(newCreated.map(b => b.vehicleChassis));
  const remaining = currentBids.filter(b => !newChassisSet.has(b.vehicleChassis));
  const updated = [...newCreated, ...remaining];
  saveStoredBids(updated);

  addNotificationToSyncStore({
    title: `⚡ Batch Proxy Bids Submitted (${newCreated.length} Vehicles)`,
    body: `Batch bids recorded across Japanese auction houses. Monitoring live lots in Tokyo and Yokohama.`,
    type: 'bid_alert',
    actionUrl: '/my-bids',
  });

  return newCreated;
}

// Admin / Ops updates status of a Dealer's Proxy Bid
export function updateBidStatus(
  bidId: string,
  newStatus: DealerBid['status'],
  adminNotes?: string
): { bid: DealerBid | null; purchase?: DealerPurchase } {
  const bids = getStoredBids();
  const targetIndex = bids.findIndex(b => b.id === bidId);
  if (targetIndex === -1) return { bid: null };

  const prevBid = bids[targetIndex];
  const updatedBid: DealerBid = {
    ...prevBid,
    status: newStatus,
    adminNotes: adminNotes !== undefined ? adminNotes : prevBid.adminNotes,
  };

  const updatedBids = [...bids];
  updatedBids[targetIndex] = updatedBid;
  saveStoredBids(updatedBids);

  let createdPurchase: DealerPurchase | undefined = undefined;

  // When Admin marks a bid as WON, automatically convert into a Dealer Purchase!
  if (newStatus === 'won') {
    const purchases = getStoredPurchases();
    const existing = purchases.find(p => p.vehicleChassis === updatedBid.vehicleChassis);
    if (!existing) {
      createdPurchase = {
        id: `po-${Date.now().toString().slice(-5)}`,
        vehicleStockId: updatedBid.vehicleStockId,
        vehicleChassis: updatedBid.vehicleChassis,
        make: updatedBid.make,
        model: updatedBid.model,
        year: updatedBid.year,
        kms: updatedBid.kms,
        color: updatedBid.color,
        purchaseFobJpy: updatedBid.bidFobJpy,
        totalLandedNzd: updatedBid.landedCostNzd,
        vesselName: 'Trans Future 7 (Voy 083)',
        departurePort: 'Yokohama, Japan',
        destinationPort: 'Ports of Auckland, NZ',
        etdDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        etaDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
        currentStage: 1, // Auction Won
        stageStatus: 'Auction Won in Japan · Payment Cleared · Pre-Shipment Inspection',
        vinComplianceNumber: `7AT0H00X${Math.floor(100000 + Math.random() * 900000)}`,
      };
      saveStoredPurchases([createdPurchase, ...purchases]);
    }

    addNotificationToSyncStore({
      title: `🎉 Auction Proxy Bid Won: ${updatedBid.year} ${updatedBid.make} ${updatedBid.model}`,
      body: `Heiwa Japan won Stock #${updatedBid.vehicleStockId} at auction for ¥${updatedBid.bidFobJpy.toLocaleString()}. Order created in Purchases!`,
      type: 'bid_won',
      actionUrl: '/purchases',
    });
  } else if (newStatus === 'outbid') {
    addNotificationToSyncStore({
      title: `⚠️ Outbid Alert: ${updatedBid.year} ${updatedBid.make} ${updatedBid.model}`,
      body: `Another Japan auction bidder placed a higher proxy bid. Click to review and raise your maximum bid.`,
      type: 'bid_outbid',
      actionUrl: '/my-bids',
    });
  }

  notifyStoreChange();
  return { bid: updatedBid, purchase: createdPurchase };
}

// PURCHASES HELPERS
export function getStoredPurchases(): DealerPurchase[] {
  if (typeof window === 'undefined') return INITIAL_PURCHASES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    if (!raw) return INITIAL_PURCHASES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PURCHASES;
  } catch {
    return INITIAL_PURCHASES;
  }
}

export function saveStoredPurchases(purchases: DealerPurchase[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  notifyStoreChange();
}

export function addDealerPurchase(purchase: DealerPurchase) {
  const current = getStoredPurchases();
  const updated = [purchase, ...current.filter(p => p.id !== purchase.id)];
  saveStoredPurchases(updated);
}

export const STAGE_TITLES: Record<number, string> = {
  1: 'Auction Won (Japan payment cleared)',
  2: 'De-reg & JEVIC (Odometer & Bio-Security)',
  3: 'Ocean RoRo Shipping (At Sea)',
  4: 'Ports of Auckland (Customs & MAF Clearance)',
  5: 'Yard Ready (Entry Compliance Certified)',
};

export function updatePurchaseStage(
  purchaseId: string,
  stage: 1 | 2 | 3 | 4 | 5,
  updates?: Partial<DealerPurchase>
): DealerPurchase | null {
  const purchases = getStoredPurchases();
  const index = purchases.findIndex(p => p.id === purchaseId);
  if (index === -1) return null;

  const current = purchases[index];
  const updated: DealerPurchase = {
    ...current,
    currentStage: stage,
    stageStatus: updates?.stageStatus || STAGE_TITLES[stage] || current.stageStatus,
    vesselName: updates?.vesselName || current.vesselName,
    etdDate: updates?.etdDate || current.etdDate,
    etaDate: updates?.etaDate || current.etaDate,
    departurePort: updates?.departurePort || current.departurePort,
    destinationPort: updates?.destinationPort || current.destinationPort,
    vinComplianceNumber: updates?.vinComplianceNumber || current.vinComplianceNumber,
  };

  const updatedPurchases = [...purchases];
  updatedPurchases[index] = updated;
  saveStoredPurchases(updatedPurchases);

  addNotificationToSyncStore({
    title: `🚢 Logistics Milestone: ${updated.make} ${updated.model} (Order #${updated.id})`,
    body: `Vehicle advanced to Stage ${stage}: ${STAGE_TITLES[stage]}. Vessel: ${updated.vesselName}. ETA: ${updated.etaDate}`,
    type: 'logistics_update',
    actionUrl: '/purchases',
  });

  notifyStoreChange();
  return updated;
}

// REQUESTS & INQUIRIES HELPERS (Reservations, Inspections, Sourcing Inquiries)
export function getStoredRequests(): DealerRequest[] {
  if (typeof window === 'undefined') return INITIAL_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) return INITIAL_REQUESTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveStoredRequests(requests: DealerRequest[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  notifyStoreChange();
}

export function createDealerRequest(
  requestData: Omit<DealerRequest, 'id' | 'createdAt' | 'status'>
): DealerRequest {
  const current = getStoredRequests();
  const newRequest: DealerRequest = {
    ...requestData,
    id: `req-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const updated = [newRequest, ...current];
  saveStoredRequests(updated);

  addNotificationToSyncStore({
    title: `📋 New Dealer Request: ${requestData.dealerName}`,
    body: `${
      requestData.type === 'reserve'
        ? '24h Reservation Lock'
        : requestData.type === 'inspection'
        ? 'Japanese Auction Sheet Inspection'
        : 'Sourcing Inquiry'
    } requested for ${requestData.vehicleSummary || 'Stock Lot'}.`,
    type: 'request_alert',
    actionUrl: '/admin/requests',
  });

  notifyStoreChange();
  return newRequest;
}

export function updateDealerRequestStatus(
  requestId: string,
  newStatus: DealerRequestStatus,
  adminNotes?: string
): DealerRequest | null {
  const requests = getStoredRequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index === -1) return null;

  const current = requests[index];
  const updated: DealerRequest = {
    ...current,
    status: newStatus,
    adminNotes: adminNotes !== undefined ? adminNotes : current.adminNotes,
    updatedAt: new Date().toISOString(),
  };

  const updatedRequests = [...requests];
  updatedRequests[index] = updated;
  saveStoredRequests(updatedRequests);

  if (newStatus === 'approved') {
    addNotificationToSyncStore({
      title: `✅ 24h Reservation Approved: ${current.vehicleSummary || 'Vehicle'}`,
      body: `Heiwa Japan has locked this lot exclusively for ${current.dealerName} for 24 hours.`,
      type: 'reserve_approved',
      actionUrl: current.vehicleStockId ? `/vehicles/${current.vehicleStockId}` : '/browse-vehicles',
    });
  }

  notifyStoreChange();
  return updated;
}

// DEALERS DIRECTORY HELPERS
export function getStoredDealers(): Dealer[] {
  if (typeof window === 'undefined') return DEALERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEALERS);
    if (!raw) return DEALERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEALERS;
  } catch {
    return DEALERS;
  }
}

export function saveStoredDealers(dealers: Dealer[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.DEALERS, JSON.stringify(dealers));
  notifyStoreChange();
}

export function addStoredDealer(newDealerData: Partial<Dealer>): Dealer {
  const current = getStoredDealers();
  const nextId = Math.max(...current.map(d => d.id), 0) + 1;
  const newDealer: Dealer = {
    id: nextId,
    name: newDealerData.name || 'New Dealership',
    location: newDealerData.location || 'Auckland, NZ',
    tier: 'Gold Dealer',
    activeOpportunities: newDealerData.activeOpportunities || 16,
    priorityBuys: newDealerData.priorityBuys || 3,
    monthlyImportsTarget: newDealerData.monthlyImportsTarget || 12,
    avgMargin: newDealerData.avgMargin || 3500,
    contactName: newDealerData.contactName || 'Trade Manager',
    email: newDealerData.email || 'contact@dealership.co.nz',
    phone: newDealerData.phone || '+64 9 000 0000',
    preferences: {
      makes: newDealerData.preferences?.makes && newDealerData.preferences.makes.length > 0
        ? newDealerData.preferences.makes
        : ['Toyota', 'Honda'],
      models: newDealerData.preferences?.models && newDealerData.preferences.models.length > 0
        ? newDealerData.preferences.models
        : ['Aqua', 'Fit', 'C-HR'],
      yearRange: newDealerData.preferences?.yearRange || '2016 – 2024',
      maxKm: newDealerData.preferences?.maxKm || 90000,
      fuelTypes: newDealerData.preferences?.fuelTypes || ['Hybrid', 'Petrol'],
      targetRetail: newDealerData.preferences?.targetRetail || 'NZ$16,000 – NZ$32,000',
      targetMargin: newDealerData.preferences?.targetMargin || `NZ$${(newDealerData.avgMargin || 3500).toLocaleString()}+`,
    },
  };
  const updated = [newDealer, ...current];
  saveStoredDealers(updated);
  return newDealer;
}

// DEALERSHIP PROFILE & SECURITY SETTINGS
export interface DealerProfileSettings {
  dealerName: string;
  principalName: string;
  email: string;
  phone: string;
  yardAddress: string;
  registeredTraderNo: string;
  nzbn: string;
  role: string;
  lastPasswordChange?: string;
  twoFactorEnabled?: boolean;
  adminSyncEnabled?: boolean;
}

export const DEFAULT_DEALER_PROFILE: DealerProfileSettings = {
  dealerName: "Auckland Auto Group",
  principalName: "David Miller",
  email: "david.miller@aucklandautogroup.co.nz",
  phone: "+64 9 525 8899",
  yardAddress: "458 Great South Road, Penrose, Auckland 1061",
  registeredTraderNo: "M189402",
  nzbn: "9429041234567",
  role: "Dealer Principal (Admin Role)",
  lastPasswordChange: "30 Sep 2026, 17:00 NZST",
  twoFactorEnabled: true,
  adminSyncEnabled: true,
};

export function getStoredDealerProfile(): DealerProfileSettings {
  if (typeof window === 'undefined') return DEFAULT_DEALER_PROFILE;
  try {
    const raw = localStorage.getItem('autohub_dealer_profile_v2');
    if (!raw) return DEFAULT_DEALER_PROFILE;
    return { ...DEFAULT_DEALER_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DEALER_PROFILE;
  }
}

export function saveStoredDealerProfile(profile: Partial<DealerProfileSettings>) {
  if (typeof window === 'undefined') return;
  const current = getStoredDealerProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem('autohub_dealer_profile_v2', JSON.stringify(updated));
  notifyStoreChange();
}
