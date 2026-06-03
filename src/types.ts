export interface MaterialItem {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface Shop {
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

export interface Driver {
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

export interface Order {
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
  vehicleType?: "Auto" | "Tractor" | "Mini Truck" | "Pickup" | "Lorry";
  vehicleNumber?: string;
  status: "Published" | "DriverAssigned" | "InTransit" | "Delivered" | "Completed" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  role: "Owner" | "Shop" | "Driver" | "Admin";
  timestamp: string;
  read: boolean;
}

export interface Analytics {
  totalUsers: number;
  totalDrivers: number;
  totalShops: number;
  totalOrdersCount: number;
  completedOrdersCount: number;
  publishedOrdersCount: number;
  activeDeliveries: number;
  totalTransactionsCash: number;
  systemHealth: string;
  nodeClusterStatus: string;
  mongoReplicaSet: string;
}
