import fs from "fs";
import path from "path";

export interface StoredCustomer {
  id: string;
  name: string;
  identifier: string;
  email?: string;
  phone?: string;
  lastLogin: string;
  type: "signup" | "signin";
  loginCount: number;
}

const CUSTOMERS_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "customers.json"
);

function readCustomersFromFile(): StoredCustomer[] {
  try {
    if (fs.existsSync(CUSTOMERS_FILE_PATH)) {
      const data = fs.readFileSync(CUSTOMERS_FILE_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Could not read customers.json:", err);
  }
  return [];
}

function writeCustomersToFile(customers: StoredCustomer[]): void {
  try {
    const dir = path.dirname(CUSTOMERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      CUSTOMERS_FILE_PATH,
      JSON.stringify(customers, null, 2),
      "utf8"
    );
  } catch (err) {
    console.warn("Could not write customers.json:", err);
  }
}

export function getAllCustomers(): StoredCustomer[] {
  return readCustomersFromFile();
}

export function recordCustomerActivity(
  name: string,
  identifier: string,
  type: "signup" | "signin" = "signin"
): StoredCustomer {
  const customers = readCustomersFromFile();
  const cleanId = identifier.trim().toLowerCase();
  const isEmail = cleanId.includes("@");
  const cleanPhone = cleanId.replace(/\D/g, "");

  const existingIndex = customers.findIndex(
    (c) =>
      c.identifier.toLowerCase() === cleanId ||
      (isEmail && c.email?.toLowerCase() === cleanId) ||
      (!isEmail && cleanPhone && c.phone?.replace(/\D/g, "").endsWith(cleanPhone.slice(-10)))
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const existing = customers[existingIndex];
    const updated: StoredCustomer = {
      ...existing,
      name: name && name.trim() ? name.trim() : existing.name,
      lastLogin: now,
      type,
      loginCount: (existing.loginCount || 1) + 1,
      email: isEmail ? cleanId : existing.email,
      phone: !isEmail && cleanPhone ? cleanPhone : existing.phone,
    };
    customers[existingIndex] = updated;
    writeCustomersToFile(customers);
    return updated;
  } else {
    const newCustomer: StoredCustomer = {
      id: `CUST-${Date.now().toString().slice(-6)}`,
      name: name && name.trim() ? name.trim() : (isEmail ? cleanId.split("@")[0] : `Customer ${cleanPhone.slice(-4)}`),
      identifier: cleanId,
      email: isEmail ? cleanId : undefined,
      phone: !isEmail && cleanPhone ? cleanPhone : undefined,
      lastLogin: now,
      type,
      loginCount: 1,
    };
    customers.unshift(newCustomer);
    writeCustomersToFile(customers);
    return newCustomer;
  }
}
