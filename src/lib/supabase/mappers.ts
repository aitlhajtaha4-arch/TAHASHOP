import type { Product, FlashDeal, Review, Brand, Accessory } from "@/data/products";
import { brandColorsByName } from "@/data/products";

type DbProduct = {
  id: number;
  name: string;
  brand: string;
  price: number;
  original_price: number | null;
  image: string;
  rating: number;
  review_count: number;
  badge: string | null;
  storage: string;
  ram: string;
  camera: string;
  battery: string;
  screen_size: string;
  processor: string;
  colors: string[];
  category: string;
  condition: "جديد" | "مستعمل" | "مجدد";
  free_shipping: boolean;
  available: boolean;
  monthly_payment: number | null;
  description: string;
};

type DbFlashDeal = {
  id: number;
  name: string;
  brand: string;
  price: number;
  original_price: number;
  image: string;
  discount: number;
  ends_at: string;
  start_date: string | null;
  badge: string | null;
  sort_order: number;
  is_active: boolean;
};

type DbReview = {
  id: string;
  product_id: number;
  name: string;
  rating: number;
  content: string;
  date: string;
};

type DbBrand = {
  id: number;
  name: string;
  logo: string;
};

export function mapProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    image: row.image,
    rating: row.rating,
    reviews: row.review_count,
    badge: row.badge ?? undefined,
    storage: row.storage,
    ram: row.ram,
    camera: row.camera,
    battery: row.battery,
    screenSize: row.screen_size,
    processor: row.processor,
    colors: row.colors,
    category: row.category,
    condition: row.condition,
    freeShipping: row.free_shipping,
    available: row.available,
    monthlyPayment: row.monthly_payment ?? undefined,
    description: row.description,
  };
}

export function mapFlashDeal(row: DbFlashDeal): FlashDeal {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    price: row.price,
    originalPrice: row.original_price,
    image: row.image,
    discount: row.discount,
    endsAt: new Date(row.ends_at).getTime(),
    startDate: row.start_date ? new Date(row.start_date).getTime() : undefined,
    badge: row.badge ?? undefined,
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active ?? true,
  };
}

export function mapReview(row: DbReview): Review {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    rating: row.rating,
    content: row.content,
    date: row.date,
  };
}

export function mapBrand(row: DbBrand): Brand {
  return {
    id: row.id,
    name: row.name,
    logo: row.logo,
    color: brandColorsByName[row.name] || "#0066cc",
  };
}

type DbAccessory = {
  id: number;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  original_price: number | null;
  stock: number;
  description: string;
  featured: boolean;
  available: boolean;
};

export function mapAccessory(row: DbAccessory): Accessory {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    image: row.image,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    stock: row.stock,
    description: row.description,
    featured: row.featured ?? false,
    available: row.available ?? true,
  };
}
