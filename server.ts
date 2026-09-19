import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Ensure persistent data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const INVENTORY_FILE = path.join(DATA_DIR, "inventory.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory Fast Atomic Inventory Store for Peak Traffic
const defaultInventoryMap: Record<string, number> = {
  'dish-1': 18,
  'dish-2': 25,
  'dish-3': 20,
  'dish-4': 12,
  'dish-5': 16,
  'dish-6': 30,
  'dish-7': 22,
  'dish-8': 35,
  'dish-9': 15,
  'dish-10': 19,
  'dish-11': 24,
  'dish-12': 18,
  'dish-13': 20,
  'dish-14': 16,
  'dish-15': 10,
  'dish-16': 22,
  'dish-17': 25,
  'dish-18': 18,
  'dish-19': 20,
  'dish-20': 25,
  'dish-21': 30,
  'dish-22': 22,
  'dish-23': 18,
  'dish-24': 14,
  'dish-25': 16,
  'dish-26': 24,
  'dish-27': 15,
  'dish-28': 35,
  'dish-29': 40,
  'dish-30': 30,
  'dish-31': 18,
  'dish-32': 22,
  'dish-33': 25,
  'dish-34': 45,
  'dish-35': 30,
  'dish-36': 28,
};

let inventoryMap: Record<string, number> = { ...defaultInventoryMap };

// Load persistent inventory if exists
try {
  if (fs.existsSync(INVENTORY_FILE)) {
    const raw = fs.readFileSync(INVENTORY_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      inventoryMap = { ...defaultInventoryMap, ...parsed };
    }
  } else {
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventoryMap, null, 2), "utf-8");
  }
} catch (e) {
  console.error("Error reading inventory file:", e);
}

function saveInventoryToDisk() {
  try {
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventoryMap, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed saving inventory to disk", e);
  }
}

// Order Storage & Database
interface ServerOrder {
  id: string;
  items: Array<{
    foodId: string;
    name: string;
    price: number;
    quantity: number;
    selectedCustomizations?: Record<string, string>;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customerName: string;
  address: string;
  status: 'queued' | 'preparing' | 'plating' | 'in_transit' | 'delivered';
  createdAt: string;
  deliveredAt?: string;
  estimatedMinutes: number;
  phone?: string;
  paymentMethod?: string;
}

const ordersDatabase: Map<string, ServerOrder> = new Map();
let orderSequence = 1005;

// Generate realistic default database seed if empty
function generateSeedOrders(): ServerOrder[] {
  const now = Date.now();
  return [
    {
      id: "AURA-1002",
      items: [
        {
          foodId: "dish-1",
          name: "Cyber Truffle Wagyu Burger",
          price: 28.5,
          quantity: 2,
          selectedCustomizations: { doneness: "Medium Rare (Recommended)" },
        },
        {
          foodId: "dish-5",
          name: "Supernova Golden Dome Ganache",
          price: 18.0,
          quantity: 1,
        },
      ],
      subtotal: 75.0,
      deliveryFee: 0,
      discount: 0,
      total: 75.0,
      customerName: "Sophia Laurent",
      address: "88 Ocean Avenue, Penthouse 4B, Metro Center",
      phone: "+1 (555) 234-8901",
      paymentMethod: "Apple Pay",
      status: "queued",
      createdAt: new Date(now - 4 * 60 * 1000).toISOString(),
      estimatedMinutes: 18,
    },
    {
      id: "AURA-1003",
      items: [
        {
          foodId: "dish-2",
          name: "Solar Flare Neapolitan Pizza",
          price: 24.0,
          quantity: 1,
          selectedCustomizations: { crust: "Charred Leopard Sourdough" },
        },
        {
          foodId: "dish-6",
          name: "Liquid Lumina Botanical Elixir",
          price: 14.5,
          quantity: 1,
        },
      ],
      subtotal: 38.5,
      deliveryFee: 0,
      discount: 0,
      total: 38.5,
      customerName: "Alexander Vance",
      address: "412 High Street, Loft 12, Financial District",
      phone: "+1 (555) 345-6712",
      paymentMethod: "Visa Platinum",
      status: "preparing",
      createdAt: new Date(now - 12 * 60 * 1000).toISOString(),
      estimatedMinutes: 14,
    },
    {
      id: "AURA-1004",
      items: [
        {
          foodId: "dish-4",
          name: "Obsidian Squid Ink Tagliolini",
          price: 31.0,
          quantity: 1,
        },
        {
          foodId: "dish-9",
          name: "Tartufo Bianco Woodfired Pizza",
          price: 29.0,
          quantity: 1,
        },
      ],
      subtotal: 60.0,
      deliveryFee: 0,
      discount: 5.0,
      total: 55.0,
      customerName: "Elena Rostova",
      address: "15 Park Lane, Villa 3, Silicon Hills",
      phone: "+1 (555) 456-7890",
      paymentMethod: "Amex Centurion",
      status: "plating",
      createdAt: new Date(now - 18 * 60 * 1000).toISOString(),
      estimatedMinutes: 10,
    },
    {
      id: "AURA-1005",
      items: [
        {
          foodId: "dish-8",
          name: "Velocity Double Smashed Truffle",
          price: 19.5,
          quantity: 1,
        },
        {
          foodId: "dish-34",
          name: "Loaded Golden Truffle Fries",
          price: 12.5,
          quantity: 1,
        },
      ],
      subtotal: 32.0,
      deliveryFee: 4.5,
      discount: 0,
      total: 36.5,
      customerName: "Marcus Sterling",
      address: "742 Evergreen Terrace, Suite 8A",
      phone: "+1 (555) 987-6543",
      paymentMethod: "Mastercard",
      status: "in_transit",
      createdAt: new Date(now - 25 * 60 * 1000).toISOString(),
      estimatedMinutes: 5,
    },
    // Past Delivered Orders (for History tab)
    {
      id: "AURA-1001",
      items: [
        {
          foodId: "dish-3",
          name: "Neon Glaze Gold Chicken",
          price: 22.0,
          quantity: 1,
          selectedCustomizations: { spice: "Medium Glow" },
        },
        {
          foodId: "dish-12",
          name: "Matcha Jade Pistachio Mousse",
          price: 16.5,
          quantity: 1,
        },
      ],
      subtotal: 38.5,
      deliveryFee: 0,
      discount: 0,
      total: 38.5,
      customerName: "David K. Miller",
      address: "220 West End Ave, Apt 14C",
      phone: "+1 (555) 789-0123",
      paymentMethod: "Cash on Delivery",
      status: "delivered",
      createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
      deliveredAt: new Date(now - 20 * 60 * 1000).toISOString(),
      estimatedMinutes: 0,
    },
    {
      id: "AURA-998",
      items: [
        {
          foodId: "dish-11",
          name: "Tokyo Katsu Sando Supreme",
          price: 23.0,
          quantity: 2,
        },
        {
          foodId: "dish-6",
          name: "Liquid Lumina Botanical Elixir",
          price: 14.5,
          quantity: 2,
        },
      ],
      subtotal: 75.0,
      deliveryFee: 0,
      discount: 10.0,
      total: 65.0,
      customerName: "Chloe Bennett",
      address: "55 Marina Boulevard, Suite 902",
      phone: "+1 (555) 321-4567",
      paymentMethod: "Google Pay",
      status: "delivered",
      createdAt: new Date(now - 90 * 60 * 1000).toISOString(),
      deliveredAt: new Date(now - 55 * 60 * 1000).toISOString(),
      estimatedMinutes: 0,
    },
    {
      id: "AURA-995",
      items: [
        {
          foodId: "dish-7",
          name: "Zenith Hydroponic Garden Bowl",
          price: 21.0,
          quantity: 1,
        },
        {
          foodId: "dish-6",
          name: "Liquid Lumina Botanical Elixir",
          price: 14.5,
          quantity: 1,
        },
      ],
      subtotal: 35.5,
      deliveryFee: 0,
      discount: 0,
      total: 35.5,
      customerName: "Dr. Julian Thorne",
      address: "10 Innovation Way, Suite 400",
      phone: "+1 (555) 654-3210",
      paymentMethod: "Apple Pay",
      status: "delivered",
      createdAt: new Date(now - 140 * 60 * 1000).toISOString(),
      deliveredAt: new Date(now - 105 * 60 * 1000).toISOString(),
      estimatedMinutes: 0,
    },
  ];
}

function saveOrdersToDisk() {
  try {
    const list = Array.from(ordersDatabase.values());
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed saving orders to disk:", e);
  }
}

function loadOrdersFromDisk() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        ordersDatabase.clear();
        list.forEach((ord) => {
          ordersDatabase.set(ord.id, ord);
          // track highest sequence
          const match = ord.id.match(/\d+/);
          if (match) {
            const num = parseInt(match[0], 10);
            if (num >= orderSequence) orderSequence = num + 1;
          }
        });
        return;
      }
    }
  } catch (e) {
    console.error("Error loading orders from disk:", e);
  }

  // Seed default orders if file did not exist or was empty
  const seeds = generateSeedOrders();
  ordersDatabase.clear();
  seeds.forEach((s) => ordersDatabase.set(s.id, s));
  saveOrdersToDisk();
}

// Initial load
loadOrdersFromDisk();

// Lazy GenAI initialization
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error("Failed to init GenAI client", e);
    }
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      service: "Aura Gastrolab High-Throughput Engine",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // GET Live Inventory
  app.get("/api/inventory", (_req, res) => {
    res.json({
      success: true,
      inventory: { ...inventoryMap },
      timestamp: Date.now(),
    });
  });

  // POST Quick Restock or Update Inventory
  app.post("/api/inventory/update", (req, res) => {
    const { foodId, delta, absoluteStock } = req.body;
    if (!foodId || typeof foodId !== 'string') {
      res.status(400).json({ error: "Missing valid foodId" });
      return;
    }

    if (typeof absoluteStock === 'number') {
      inventoryMap[foodId] = Math.max(0, absoluteStock);
    } else if (typeof delta === 'number') {
      inventoryMap[foodId] = Math.max(0, (inventoryMap[foodId] || 0) + delta);
    }

    res.json({
      success: true,
      foodId,
      newStock: inventoryMap[foodId] || 0,
      inventory: { ...inventoryMap },
    });
  });

  // POST Rapid Order Processing with Atomic Reservation
  app.post("/api/orders", (req, res) => {
    const { items, customerName, address, discount = 0, deliveryFee = 0 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Order must contain at least one item" });
      return;
    }

    // Atomic pre-validation: check all requested quantities against current inventory
    const outOfStockItems: Array<{ foodId: string; available: number; requested: number }> = [];
    for (const item of items) {
      const currentStock = inventoryMap[item.foodId] ?? 10;
      if (currentStock < item.quantity) {
        outOfStockItems.push({
          foodId: item.foodId,
          available: currentStock,
          requested: item.quantity,
        });
      }
    }

    if (outOfStockItems.length > 0) {
      res.status(409).json({
        error: "High-traffic inventory constraint: some items exceeded available stock.",
        outOfStockItems,
        currentInventory: { ...inventoryMap },
      });
      return;
    }

    // Atomic deduction
    for (const item of items) {
      if (inventoryMap[item.foodId] !== undefined) {
        inventoryMap[item.foodId] = Math.max(0, inventoryMap[item.foodId] - item.quantity);
      }
    }

    // Calculate subtotal
    const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const total = Math.max(0, subtotal - discount + deliveryFee);

    orderSequence += 1;
    const orderId = `AURA-${orderSequence}`;
    const estimatedMinutes = Math.floor(Math.random() * 6) + 14; // 14-20 mins precision delivery

    const newOrder: ServerOrder = {
      id: orderId,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      customerName: customerName || "Distinguished Guest",
      address: address || "742 Evergreen Terrace, Suite 8A",
      status: "queued",
      createdAt: new Date().toISOString(),
      estimatedMinutes,
    };

    ordersDatabase.set(orderId, newOrder);
    saveOrdersToDisk();
    saveInventoryToDisk();

    // Progress through modern kitchen stages up to in_transit
    setTimeout(() => {
      const ord = ordersDatabase.get(orderId);
      if (ord && ord.status === 'queued') {
        ord.status = 'preparing';
        saveOrdersToDisk();
      }
    }, 4000);

    setTimeout(() => {
      const ord = ordersDatabase.get(orderId);
      if (ord && ord.status === 'preparing') {
        ord.status = 'plating';
        saveOrdersToDisk();
      }
    }, 9000);

    setTimeout(() => {
      const ord = ordersDatabase.get(orderId);
      if (ord && ord.status === 'plating') {
        ord.status = 'in_transit';
        saveOrdersToDisk();
      }
    }, 15000);

    res.status(201).json({
      success: true,
      message: "Order successfully authorized and queued for rapid prep.",
      order: newOrder,
      queuePosition: Math.floor(Math.random() * 3) + 1,
      estimatedMinutes,
      updatedInventory: { ...inventoryMap },
    });
  });

  // POST Mark Order as Delivered (Prominent Admin Requirement)
  app.post("/api/orders/:id/deliver", (req, res) => {
    const orderId = req.params.id;
    const order = ordersDatabase.get(orderId);
    if (!order) {
      res.status(404).json({ success: false, error: `Order #${orderId} not found in database.` });
      return;
    }

    order.status = "delivered";
    order.deliveredAt = new Date().toISOString();
    ordersDatabase.set(orderId, order);
    saveOrdersToDisk();

    res.json({
      success: true,
      message: `Order #${orderId} has been successfully updated to 'Delivered' in the database.`,
      order,
    });
  });

  // PATCH Update Order Status or Attributes
  app.patch("/api/orders/:id", (req, res) => {
    const orderId = req.params.id;
    const order = ordersDatabase.get(orderId);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found in database" });
      return;
    }

    const { status, customerName, address } = req.body;
    if (status) {
      order.status = status;
      if (status === "delivered" && !order.deliveredAt) {
        order.deliveredAt = new Date().toISOString();
      }
    }
    if (customerName) order.customerName = customerName;
    if (address) order.address = address;

    ordersDatabase.set(orderId, order);
    saveOrdersToDisk();

    res.json({
      success: true,
      message: `Order #${orderId} updated in database.`,
      order,
    });
  });

  // DELETE Order
  app.delete("/api/orders/:id", (req, res) => {
    const orderId = req.params.id;
    if (!ordersDatabase.has(orderId)) {
      res.status(404).json({ success: false, error: "Order not found in database" });
      return;
    }
    ordersDatabase.delete(orderId);
    saveOrdersToDisk();
    res.json({ success: true, message: `Order #${orderId} deleted from database.` });
  });

  // POST Seed Demo Orders for testing
  app.post("/api/orders/seed", (_req, res) => {
    const seeds = generateSeedOrders();
    ordersDatabase.clear();
    seeds.forEach((s) => ordersDatabase.set(s.id, s));
    saveOrdersToDisk();
    const allOrders = Array.from(ordersDatabase.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({
      success: true,
      message: "Database orders successfully refreshed with fresh operational seed data.",
      orders: allOrders,
      totalCount: allOrders.length,
    });
  });

  // GET Admin Operational Analytics & Stats
  app.get("/api/admin/stats", (_req, res) => {
    const allOrders = Array.from(ordersDatabase.values());
    const activeOrders = allOrders.filter((o) => o.status !== "delivered");
    const deliveredOrders = allOrders.filter((o) => o.status === "delivered");
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
    const deliveredRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);

    res.json({
      success: true,
      stats: {
        totalOrdersCount: allOrders.length,
        activeOrdersCount: activeOrders.length,
        deliveredOrdersCount: deliveredOrders.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        deliveredRevenue: Math.round(deliveredRevenue * 100) / 100,
        avgDeliveryMinutes: 14,
      },
    });
  });

  // GET Order Status
  app.get("/api/orders/:id", (req, res) => {
    const order = ordersDatabase.get(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ success: true, order });
  });

  // GET All Orders (with optional filter ?status=active or ?status=delivered)
  app.get("/api/orders", (req, res) => {
    const { status } = req.query;
    let list = Array.from(ordersDatabase.values());

    if (status === "active") {
      list = list.filter((o) => o.status !== "delivered");
    } else if (status === "delivered") {
      list = list.filter((o) => o.status === "delivered");
    }

    const allOrders = list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({
      success: true,
      orders: allOrders,
      totalCount: allOrders.length,
      activeCount: allOrders.filter((o) => o.status !== "delivered").length,
      deliveredCount: allOrders.filter((o) => o.status === "delivered").length,
    });
  });

  // POST AI Gastronomy Sommelier & Pairing Assistant
  app.post("/api/ai-recommend", async (req, res) => {
    const { tastePreference, selectedDishName, dietary } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // High quality curated gastronomic fallback if no key
      res.json({
        success: true,
        recommendation: `Based on your preference for ${tastePreference || 'rich umami and modern contrast'}, we recommend pairing ${selectedDishName || 'Cyber Truffle Wagyu Burger'} with our Liquid Lumina Botanical Elixir. The crisp botanical effervescence cuts through the opulent Wagyu marbling while highlighting the earthy truffles. Finish with the Supernova Golden Dome for temperature contrast.`,
        suggestedDishId: 'dish-6',
        flavorNotes: ['Smoked Citrus Yuzu', 'Earthy Black Truffle', 'Umami Velvety Finish'],
      });
      return;
    }

    try {
      const prompt = `You are the lead AI Gastronomy Director at AURA GASTROLAB, a futuristic ultra-luxury restaurant.
The customer has provided:
- Preference: "${tastePreference || 'rich, luxurious, balanced'}"
- Selected Dish: "${selectedDishName || 'Signature Truffle Wagyu'}"
- Dietary Notes: "${dietary || 'None'}"

Provide a concise, poetic, and sophisticated 2-3 sentence pairing recommendation highlighting flavour contrast, molecular technique, and an ideal beverage or dessert companion. Return plain text only.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({
        success: true,
        recommendation: response.text || "A sublime union of textures awaits your palate.",
        suggestedDishId: 'dish-6',
        flavorNotes: ['Aromatic Yuzu Mist', 'Rich Black Autumn Truffle', 'Velvet Cocoa Core'],
      });
    } catch (err: any) {
      console.error("AI recommendation error", err);
      res.json({
        success: true,
        recommendation: `Chef Marcus recommends pairing your selection with our signature Liquid Lumina Botanical Elixir to cleanse the palate between rich bites of truffle and Wagyu.`,
        suggestedDishId: 'dish-6',
        flavorNotes: ['Botanical Citrus', 'Deep Umami', 'Pristine Finish'],
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aura Gastrolab Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to boot server:", err);
});
