import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// In-Memory Fast Atomic Inventory Store for Peak Traffic
const inventoryMap: Record<string, number> = {
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
};

// In-Memory Order Storage & Queue
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
  estimatedMinutes: number;
}

const ordersDatabase: Map<string, ServerOrder> = new Map();
let orderSequence = 1001;

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

    // Simulate rapid progression through modern kitchen stages
    setTimeout(() => {
      const ord = ordersDatabase.get(orderId);
      if (ord && ord.status === 'queued') ord.status = 'preparing';
    }, 4000);

    setTimeout(() => {
      const ord = ordersDatabase.get(orderId);
      if (ord && ord.status === 'preparing') ord.status = 'plating';
    }, 9000);

    setTimeout(() => {
      const ord = ordersDatabase.get(orderId);
      if (ord && ord.status === 'plating') ord.status = 'in_transit';
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

  // GET Order Status
  app.get("/api/orders/:id", (req, res) => {
    const order = ordersDatabase.get(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ success: true, order });
  });

  // GET All Orders (History)
  app.get("/api/orders", (_req, res) => {
    const allOrders = Array.from(ordersDatabase.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({ success: true, orders: allOrders, totalCount: allOrders.length });
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
