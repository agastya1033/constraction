import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface MaterialItem {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface Shop {
  id: string;
  name: string;
  category: "Cement" | "Bricks" | "Steel" | "Sand" | "Hardware";
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  rating: number;
  items: MaterialItem[];
  joinedAt: string;
}

interface Driver {
  id: string;
  name: string;
  vehicleType: "Auto" | "Tractor" | "Mini Truck" | "Pickup" | "Lorry";
  vehicleNumber: string;
  phone: string;
  rating: number;
  status: "Idle" | "Busy";
  latitude: number;
  longitude: number;
}

interface Order {
  id: string;
  materialName: string;
  quantity: number;
  shopId: string;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  deliveryAddress: string;
  deliveryNotes: string;
  transportRate: number;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  status: "Published" | "DriverAssigned" | "InTransit" | "Delivered" | "Completed" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  role: "Owner" | "Shop" | "Driver" | "Admin";
  timestamp: string;
  read: boolean;
}

// Initial mockup data
const INITIAL_SHOPS: Shop[] = [
  {
    id: "shop-1",
    name: "Apex Cement Traders",
    category: "Cement",
    address: "Plot 42, Industrial Area Phase II, Bypass Road",
    phone: "+91 98765 11111",
    latitude: 28.6139,
    longitude: 77.2090,
    rating: 4.8,
    joinedAt: "2025-01-10",
    items: [
      { id: "item-101", name: "Ultratech Cement (OPC 53)", price: 420, unit: "Bag" },
      { id: "item-102", name: "Ambuja Cement (PPC)", price: 410, unit: "Bag" },
      { id: "item-103", name: "ACC Gold Water Shield", price: 440, unit: "Bag" }
    ]
  },
  {
    id: "shop-2",
    name: "Red Earth Brick Kiln & Suppliers",
    category: "Bricks",
    address: "Village Kherki Daula, Sector 84, National Highway 8",
    phone: "+91 98765 22222",
    latitude: 28.6150,
    longitude: 77.2150,
    rating: 4.5,
    joinedAt: "2025-02-15",
    items: [
      { id: "item-201", name: "First Quality Red Clay Bricks", price: 7, unit: "Piece" },
      { id: "item-202", name: "Fly Ash eco-bricks", price: 9, unit: "Piece" },
      { id: "item-203", name: "Autoclaved Aerated Concrete (AAC) Blocks", price: 110, unit: "Piece" }
    ]
  },
  {
    id: "shop-3",
    name: "Shree Ji Iron & Steel Enterprises",
    category: "Steel",
    address: "Lohe Wali Gali, Sector 5, Industrial Sector",
    phone: "+91 98765 33333",
    latitude: 28.6080,
    longitude: 77.2060,
    rating: 4.9,
    joinedAt: "2025-03-01",
    items: [
      { id: "item-301", name: "Tata Tiscon TMT Steel Rebar FE 550D (12mm)", price: 62000, unit: "Tonne" },
      { id: "item-302", name: "Jindal Panther TMT Bars (8mm)", price: 64500, unit: "Tonne" },
      { id: "item-303", name: "Binding Wire GI (20 Gauge)", price: 90, unit: "Kg" }
    ]
  },
  {
    id: "shop-4",
    name: "Yamuna River Sand Suppliers",
    category: "Sand",
    address: "Yards near Wazirabad Bridge, Outer Ring Road",
    phone: "+91 98765 44444",
    latitude: 28.6210,
    longitude: 77.2250,
    rating: 4.2,
    joinedAt: "2025-03-12",
    items: [
      { id: "item-401", name: "Coarse River Sand (For RCC Casting)", price: 3200, unit: "Brass (100 CFT)" },
      { id: "item-402", name: "Fine Plastering Sand", price: 2900, unit: "Brass (100 CFT)" },
      { id: "item-403", name: "Crushed Stone Aggregates (20mm)", price: 3500, unit: "Brass (100 CFT)" }
    ]
  },
  {
    id: "shop-5",
    name: "Saraswati Hardware & Sanitary",
    category: "Hardware",
    address: "Shop No. 12, Main Market Market, Sector 23",
    phone: "+91 98765 55555",
    latitude: 28.6020,
    longitude: 77.1980,
    rating: 4.6,
    joinedAt: "2025-04-05",
    items: [
      { id: "item-501", name: "Asian Paints Apex Ultima White (20L)", price: 6800, unit: "Bucket" },
      { id: "item-502", name: "Screws & Fasteners Assorted Kit", price: 450, unit: "Box" },
      { id: "item-503", name: "Waterproof Tarp Sheet (15x15 ft)", price: 1200, unit: "Piece" }
    ]
  }
];

const INITIAL_DRIVERS: Driver[] = [
  {
    id: "driver-1",
    name: "Ramesh Kumar",
    vehicleType: "Tractor",
    vehicleNumber: "DL-1LM-4309",
    phone: "+91 99999 11111",
    rating: 4.7,
    status: "Idle",
    latitude: 28.6105,
    longitude: 77.2045
  },
  {
    id: "driver-2",
    name: "Sube Singh",
    vehicleType: "Mini Truck",
    vehicleNumber: "HR-55B-8832",
    phone: "+91 99999 22222",
    rating: 4.9,
    status: "Idle",
    latitude: 28.6180,
    longitude: 77.2120
  },
  {
    id: "driver-3",
    name: "Satnam Singh",
    vehicleType: "Lorry",
    vehicleNumber: "PB-11X-7761",
    phone: "+91 99999 33333",
    rating: 4.5,
    status: "Idle",
    latitude: 28.6280,
    longitude: 77.2280
  },
  {
    id: "driver-4",
    name: "Manpreet Sharma",
    vehicleType: "Auto",
    vehicleNumber: "DL-1RM-5604",
    phone: "+91 99999 44444",
    rating: 4.6,
    status: "Idle",
    latitude: 28.6050,
    longitude: 77.1950
  },
  {
    id: "driver-5",
    name: "Vikram Yadav",
    vehicleType: "Pickup",
    vehicleNumber: "UP-16T-9922",
    phone: "+91 99999 55555",
    rating: 4.8,
    status: "Idle",
    latitude: 28.6145,
    longitude: 77.2185
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "order-1001",
    materialName: "Ultratech Cement (OPC 53)",
    quantity: 50,
    shopId: "shop-1",
    shopName: "Apex Cement Traders",
    ownerName: "Devendra Verma (House Owner)",
    ownerPhone: "+91 98100 98100",
    deliveryAddress: "Villa 104, Green Meadows Society, Sector 45",
    deliveryNotes: "Deliver near back gate block-C. Standard weight count on unloading. Call before arrival.",
    transportRate: 750,
    status: "Completed",
    createdAt: "2026-06-02T14:30:00Z",
    updatedAt: "2026-06-02T16:15:00Z",
    driverId: "driver-1",
    driverName: "Ramesh Kumar",
    driverPhone: "+91 99999 11111",
    vehicleType: "Tractor",
    vehicleNumber: "DL-1LM-4309"
  },
  {
    id: "order-1002",
    materialName: "Tata Tiscon TMT Steel Rebar FE 550D (12mm)",
    quantity: 3,
    shopId: "shop-3",
    shopName: "Shree Ji Iron & Steel Enterprises",
    ownerName: "Devendra Verma (House Owner)",
    ownerPhone: "+91 98100 98100",
    deliveryAddress: "Construction Site, Sector 62, Opp Metro Pillar 194",
    deliveryNotes: "Need heavy pickup/mini truck as rebar is 12 meters folded. Pls coordinate driver helper.",
    transportRate: 1500,
    status: "Published",
    createdAt: "2026-06-03T01:50:00Z",
    updatedAt: "2026-06-03T01:50:00Z"
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "New Order Broadcast",
    body: "Order #1002 published: 3 Tonnes of Steel Rebar from Shree Ji Iron & Steel Enterprises. Fixed Transport Rate ₹1500.",
    role: "Driver",
    timestamp: "2026-06-03T01:51:00Z",
    read: false
  },
  {
    id: "notif-2",
    title: "Order Completed Successfully",
    body: "Order #1001 for 50 Bags of Cement has been marked completed by Devendra Verma. Ramesh Kumar paid ₹750 driver cash.",
    role: "Admin",
    timestamp: "2026-06-02T16:15:00Z",
    read: true
  }
];

// In-Memory Collections to act as real-time Mongo simulation
let shops: Shop[] = JSON.parse(JSON.stringify(INITIAL_SHOPS));
let drivers: Driver[] = JSON.parse(JSON.stringify(INITIAL_DRIVERS));
let orders: Order[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
let notifications: Notification[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware
  app.use(express.json());

  // Log incoming requests
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // REST API: Shops endpoints
  app.get("/api/shops", (req, res) => {
    res.json(shops);
  });

  app.post("/api/shops", (req, res) => {
    const { name, category, address, phone, priceList } = req.body;
    if (!name || !category || !address || !phone) {
      return res.status(400).json({ error: "Missing required shop parameters to register." });
    }
    const newShop: Shop = {
      id: `shop-${Date.now()}`,
      name,
      category,
      address,
      phone,
      latitude: 28.6100 + (Math.random() - 0.5) * 0.05,
      longitude: 77.2100 + (Math.random() - 0.5) * 0.05,
      rating: 4.5,
      joinedAt: new Date().toISOString().split('T')[0],
      items: priceList || [
        { id: `item-${Date.now()}-1`, name: `Standard Jointing ${category}`, price: 350, unit: "Bag" },
        { id: `item-${Date.now()}-2`, name: `Premium Heavy ${category}`, price: 480, unit: "Bag" }
      ]
    };
    shops.push(newShop);

    // Push notification to Admin
    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: "New Shop Registered",
      body: `"${newShop.name}" is now live as a verified ${newShop.category} Supplier.`,
      role: "Admin",
      timestamp: new Date().toISOString(),
      read: false
    });

    res.status(201).json(newShop);
  });

  // REST API: Drivers endpoints
  app.get("/api/drivers", (req, res) => {
    res.json(drivers);
  });

  app.post("/api/drivers", (req, res) => {
    const { name, vehicleType, vehicleNumber, phone } = req.body;
    if (!name || !vehicleType || !vehicleNumber || !phone) {
      return res.status(400).json({ error: "Missing driver or vehicle payload values." });
    }
    const newDriver: Driver = {
      id: `driver-${Date.now()}`,
      name,
      vehicleType,
      vehicleNumber,
      phone,
      rating: 5.0,
      status: "Idle",
      latitude: 28.6100 + (Math.random() - 0.5) * 0.04,
      longitude: 77.2100 + (Math.random() - 0.5) * 0.04
    };
    drivers.push(newDriver);

    // Notification to Admin
    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: "New Transporter Registered",
      body: `${newDriver.name} onboarded with vehicle ${newDriver.vehicleType} (${newDriver.vehicleNumber}).`,
      role: "Admin",
      timestamp: new Date().toISOString(),
      read: false
    });

    res.status(201).json(newDriver);
  });

  // REST API: Orders endpoints
  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  app.post("/api/orders", (req, res) => {
    const { materialName, quantity, shopId, deliveryAddress, deliveryNotes, transportRate, ownerName, ownerPhone } = req.body;
    
    if (!materialName || !quantity || !shopId || !deliveryAddress || !transportRate) {
      return res.status(400).json({ error: "Required fields missing for placing order." });
    }

    const selectedShop = shops.find(s => s.id === shopId);
    if (!selectedShop) {
      return res.status(404).json({ error: "Target material shop not found." });
    }

    const newOrder: Order = {
      id: `order-${Math.floor(1000 + Math.random() * 9000)}`,
      materialName,
      quantity,
      shopId,
      shopName: selectedShop.name,
      ownerName: ownerName || "Devendra Verma (House Owner)",
      ownerPhone: ownerPhone || "+91 98100 98100",
      deliveryAddress,
      deliveryNotes: deliveryNotes || "No specific instructions",
      transportRate: Number(transportRate),
      status: "Published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    // Broadcast push notifications
    notifications.unshift({
      id: `notif-${Date.now()}-owner`,
      title: "Order Broadcast Success",
      body: `Your order for ${quantity}x ${materialName} has been broadcasted to nearby transporters.`,
      role: "Owner",
      timestamp: new Date().toISOString(),
      read: false
    });

    notifications.unshift({
      id: `notif-${Date.now()}-driver`,
      title: "New Transport Job Nearby!",
      body: `New demand: ${quantity}x ${materialName} from ${selectedShop.name} to ${deliveryAddress}. Transport: ₹${transportRate} cash.`,
      role: "Driver",
      timestamp: new Date().toISOString(),
      read: false
    });

    notifications.unshift({
      id: `notif-${Date.now()}-shop`,
      title: "New Customer Assignment",
      body: `House Owner created a delivery order from your shop catalog. Ready for dispatching.`,
      role: "Shop",
      timestamp: new Date().toISOString(),
      read: false
    });

    notifications.unshift({
      id: `notif-${Date.now()}-admin`,
      title: "Demand Feed Activity",
      body: `Order #${newOrder.id} created by owner ${newOrder.ownerName}. Rate: ₹${transportRate}.`,
      role: "Admin",
      timestamp: new Date().toISOString(),
      read: false
    });

    res.status(201).json(newOrder);
  });

  // REST API: Order state mutation actions
  app.post("/api/orders/:id/accept", (req, res) => {
    const { id } = req.params;
    const { driverId } = req.body;

    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (order.status !== "Published") {
      return res.status(400).json({ error: "Order is already accepted/dispatched by another transporter." });
    }

    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return res.status(404).json({ error: "Selected driver not found." });

    order.status = "DriverAssigned";
    order.driverId = driver.id;
    order.driverName = driver.name;
    order.driverPhone = driver.phone;
    order.vehicleType = driver.vehicleType;
    order.vehicleNumber = driver.vehicleNumber;
    order.updatedAt = new Date().toISOString();

    driver.status = "Busy";

    // Create notifications for all related roles
    notifications.unshift({
      id: `notif-${Date.now()}-own`,
      title: "Transporter Assigned!",
      body: `${driver.name} accepted your delivery order #${order.id} with vehicle ${driver.vehicleType} (${driver.vehicleNumber}).`,
      role: "Owner",
      timestamp: new Date().toISOString(),
      read: false
    });

    notifications.unshift({
      id: `notif-${Date.now()}-sh`,
      title: "Transporter Dispatched to Shop",
      body: `Driver ${driver.name} is on the way to pick up materials for Order #${order.id}.`,
      role: "Shop",
      timestamp: new Date().toISOString(),
      read: false
    });

    res.json(order);
  });

  app.post("/api/orders/:id/pickup", (req, res) => {
    const { id } = req.params;
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (order.status !== "DriverAssigned") {
      return res.status(400).json({ error: "Cannot pickup. Order in invalid status." });
    }

    order.status = "InTransit";
    order.updatedAt = new Date().toISOString();

    notifications.unshift({
      id: `notif-${Date.now()}-own`,
      title: "Materials In Transit!",
      body: `Driver ${order.driverName} has loaded materials from the shop and is driving to your delivery address.`,
      role: "Owner",
      timestamp: new Date().toISOString(),
      read: false
    });

    res.json(order);
  });

  app.post("/api/orders/:id/deliver", (req, res) => {
    const { id } = req.params;
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (order.status !== "InTransit") {
      return res.status(400).json({ error: "Order not in transit." });
    }

    order.status = "Delivered";
    order.updatedAt = new Date().toISOString();

    notifications.unshift({
      id: `notif-${Date.now()}-own`,
      title: "Driver Has Arrived!",
      body: `Materials have reached your site! Please inspect, inspect quantities, pay driver ₹${order.transportRate} cash, and mark complete.`,
      role: "Owner",
      timestamp: new Date().toISOString(),
      read: false
    });

    res.json(order);
  });

  app.post("/api/orders/:id/complete", (req, res) => {
    const { id } = req.params;
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (order.status !== "Delivered" && order.status !== "InTransit") {
      return res.status(400).json({ error: "Order not delivered or in transit yet." });
    }

    order.status = "Completed";
    order.updatedAt = new Date().toISOString();

    if (order.driverId) {
      const driver = drivers.find(d => d.id === order.driverId);
      if (driver) driver.status = "Idle";
    }

    notifications.unshift({
      id: `notif-${Date.now()}-dr`,
      title: "Delivery Finished & Cash Received",
      body: `House Owner marked Order #${order.id} complete. You earned ₹${order.transportRate} cash!`,
      role: "Driver",
      timestamp: new Date().toISOString(),
      read: false
    });

    notifications.unshift({
      id: `notif-${Date.now()}-sh`,
      title: "Completed Order Sale",
      body: `Order #${order.id} material has been successfully settled with cash on delivery.`,
      role: "Shop",
      timestamp: new Date().toISOString(),
      read: false
    });

    notifications.unshift({
      id: `notif-${Date.now()}-adm`,
      title: "Order Settle Cycle Completed",
      body: `Order #${order.id} finished successfully. Paid Volume: ₹${order.transportRate} Cash.`,
      role: "Admin",
      timestamp: new Date().toISOString(),
      read: false
    });

    res.json(order);
  });

  // REST API: Notifications list
  app.get("/api/notifications", (req, res) => {
    res.json(notifications);
  });

  app.post("/api/notifications/clear", (req, res) => {
    notifications.forEach(n => n.read = true);
    res.json({ message: "Notifications cleared" });
  });

  // REST API: Aggregate system diagnostics for Admin Analytical Panel
  app.get("/api/analytics", (req, res) => {
    const activeDeliveries = orders.filter(o => ["DriverAssigned", "InTransit", "Delivered"].includes(o.status)).length;
    const totalTransactionsCash = orders
      .filter(o => o.status === "Completed")
      .reduce((sum, o) => sum + o.transportRate, 0);

    res.json({
      totalUsers: 14 + drivers.length + shops.length,
      totalDrivers: drivers.length,
      totalShops: shops.length,
      totalOrdersCount: orders.length,
      completedOrdersCount: orders.filter(o => o.status === "Completed").length,
      publishedOrdersCount: orders.filter(o => o.status === "Published").length,
      activeDeliveries,
      totalTransactionsCash,
      systemHealth: "Optimal",
      nodeClusterStatus: "Ready",
      mongoReplicaSet: "Primary (db.v2.atlas)"
    });
  });

  // Reset simulator state
  app.post("/api/reset", (req, res) => {
    shops = JSON.parse(JSON.stringify(INITIAL_SHOPS));
    drivers = JSON.parse(JSON.stringify(INITIAL_DRIVERS));
    orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    res.json({ status: "reset_done" });
  });

  // Vite development integration or static delivery
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running full-stack at http://0.0.0.0:${PORT}`);
  });
}

startServer();
