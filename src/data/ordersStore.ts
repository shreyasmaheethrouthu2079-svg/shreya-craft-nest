import fs from "fs";
import path from "path";

export interface StoredOrder {
  orderId: string;
  paymentId: string;
  paymentMethod: string;
  paymentStatus: string;
  customer: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
  totalAmountPaid: number;
  currency: string;
  status: "ORDER_CONFIRMED" | "IN_STITCHING" | "PACKED" | "DISPATCHED" | "DELIVERED";
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

const ORDERS_FILE_PATH = path.join(process.cwd(), "src", "data", "orders.json");

// Sample initial seed orders so users can test tracking right away!
const INITIAL_SEED_ORDERS: StoredOrder[] = [
  {
    orderId: "SCN-782190",
    paymentId: "COD-782190",
    paymentMethod: "Cash on Delivery (Pay upon delivery)",
    paymentStatus: "PENDING_CASH_ON_DELIVERY",
    customer: {
      fullName: "Ananya Deshmukh",
      phone: "9876543210",
      address: "B-402, Sunshine Meadows, Baner",
      city: "Pune",
      pincode: "411045",
    },
    items: [
      {
        id: "olive-bloom-wristlet-pouch",
        name: "Olive Floral Block-Print Wristlet Pouch",
        category: "Pouches",
        price: 100,
        quantity: 1,
      },
      {
        id: "indigo-fish-mini-tote",
        name: "Indigo Fish Quilted Mini Handbag",
        category: "Mini Bags",
        price: 140,
        quantity: 1,
      },
    ],
    totalAmountPaid: 240,
    currency: "INR",
    status: "DISPATCHED",
    courierName: "Delhivery Surface Express",
    trackingNumber: "DEL-8491028392",
    estimatedDelivery: "Tomorrow by 6:00 PM",
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
];

function readOrdersFromFile(): StoredOrder[] {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not read orders.json, using fallback:", err);
  }
  return INITIAL_SEED_ORDERS;
}

function writeOrdersToFile(orders: StoredOrder[]): void {
  try {
    const dir = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write orders.json:", err);
  }
}

export function saveOrder(order: StoredOrder): void {
  const orders = readOrdersFromFile();
  // Prepend new order
  const updated = [order, ...orders.filter((o) => o.orderId !== order.orderId)];
  writeOrdersToFile(updated);
}

export function findOrderByQuery(query: string): StoredOrder | undefined {
  const cleanQuery = query.trim().toUpperCase();
  const phoneClean = query.replace(/\D/g, "");
  const orders = readOrdersFromFile();

  return orders.find((o) => {
    const matchId =
      o.orderId.toUpperCase().includes(cleanQuery) ||
      cleanQuery.includes(o.orderId.toUpperCase());
    const matchPhone =
      phoneClean.length >= 6 && o.customer.phone.replace(/\D/g, "").includes(phoneClean);
    return matchId || matchPhone;
  });
}

export function getAllOrders(): StoredOrder[] {
  const orders = readOrdersFromFile();
  // Sort by createdAt descending (newest first)
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function updateOrderStatus(
  orderId: string,
  updates: {
    status?: StoredOrder["status"];
    courierName?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    paymentStatus?: string;
  }
): StoredOrder | null {
  const orders = readOrdersFromFile();
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index === -1) return null;

  const existing = orders[index];
  const updated: StoredOrder = {
    ...existing,
    status: updates.status || existing.status,
    courierName: updates.courierName !== undefined ? updates.courierName : existing.courierName,
    trackingNumber: updates.trackingNumber !== undefined ? updates.trackingNumber : existing.trackingNumber,
    estimatedDelivery: updates.estimatedDelivery !== undefined ? updates.estimatedDelivery : existing.estimatedDelivery,
    paymentStatus: updates.paymentStatus !== undefined ? updates.paymentStatus : existing.paymentStatus,
  };

  orders[index] = updated;
  writeOrdersToFile(orders);
  return updated;
}

export function deleteOrder(orderId: string): boolean {
  const orders = readOrdersFromFile();
  const filtered = orders.filter((o) => o.orderId !== orderId);
  if (filtered.length === orders.length) return false;
  writeOrdersToFile(filtered);
  return true;
}

