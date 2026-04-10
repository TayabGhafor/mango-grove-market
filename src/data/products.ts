export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  weights: { label: string; kg: number; price: number }[];
  category: string;
  rating: number;
  reviews: number;
  trending: boolean;
  deal?: { discount: number; label: string };
}

export interface CartItem {
  product: Product;
  weight: { label: string; kg: number; price: number };
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processed' | 'dispatched' | 'out-for-delivery' | 'delivered' | 'cancelled';
  customer: { name: string; address: string; phone: string };
  paymentMethod: string;
  date: string;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Sindhri Mango",
    description: "The king of mangoes — sweet, aromatic, and irresistibly juicy. Grown in the fertile lands of Sindh, Pakistan. Known for its elongated shape and golden-yellow skin.",
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600",
    ],
    price: 1200,
    weights: [
      { label: "3 KG", kg: 3, price: 1200 },
      { label: "5 KG", kg: 5, price: 1900 },
      { label: "8 KG", kg: 8, price: 2800 },
    ],
    category: "Premium",
    rating: 4.9,
    reviews: 234,
    trending: true,
    deal: { discount: 15, label: "Summer Sale" },
  },
  {
    id: "2",
    title: "Chaunsa Mango",
    description: "Sweetest mango variety with a rich, creamy texture and intoxicating fragrance. A true Pakistani delicacy loved worldwide.",
    images: [
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600",
      "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600",
    ],
    price: 1400,
    weights: [
      { label: "3 KG", kg: 3, price: 1400 },
      { label: "5 KG", kg: 5, price: 2200 },
      { label: "8 KG", kg: 8, price: 3200 },
    ],
    category: "Premium",
    rating: 4.8,
    reviews: 189,
    trending: true,
  },
  {
    id: "3",
    title: "Anwar Ratol",
    description: "Small but mighty — the Anwar Ratol is a flavor bomb. Compact size, intense sweetness, and a velvety smooth pulp.",
    images: [
      "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600",
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
    ],
    price: 1600,
    weights: [
      { label: "3 KG", kg: 3, price: 1600 },
      { label: "5 KG", kg: 5, price: 2500 },
      { label: "8 KG", kg: 8, price: 3800 },
    ],
    category: "Exotic",
    rating: 4.7,
    reviews: 156,
    trending: false,
    deal: { discount: 10, label: "New Arrival" },
  },
  {
    id: "4",
    title: "Langra Mango",
    description: "A heritage variety with a distinct tangy-sweet flavor. Green-skinned even when ripe, with fiber-free golden pulp.",
    images: [
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600",
      "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600",
    ],
    price: 1100,
    weights: [
      { label: "3 KG", kg: 3, price: 1100 },
      { label: "5 KG", kg: 5, price: 1700 },
      { label: "8 KG", kg: 8, price: 2500 },
    ],
    category: "Classic",
    rating: 4.6,
    reviews: 98,
    trending: false,
  },
  {
    id: "5",
    title: "Dusehri Mango",
    description: "Elegant and aromatic with a thin skin and fiber-free, sweet flesh. A connoisseur's choice for refined palates.",
    images: [
      "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=600",
      "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=600",
    ],
    price: 1300,
    weights: [
      { label: "3 KG", kg: 3, price: 1300 },
      { label: "5 KG", kg: 5, price: 2000 },
      { label: "8 KG", kg: 8, price: 3000 },
    ],
    category: "Premium",
    rating: 4.5,
    reviews: 67,
    trending: true,
  },
  {
    id: "6",
    title: "Mango Gift Box",
    description: "A curated selection of our finest mangoes — perfect for gifting. Includes Sindhri, Chaunsa, and Anwar Ratol.",
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600",
    ],
    price: 3500,
    weights: [
      { label: "3 KG", kg: 3, price: 3500 },
      { label: "5 KG", kg: 5, price: 5500 },
      { label: "8 KG", kg: 8, price: 8000 },
    ],
    category: "Gift",
    rating: 4.9,
    reviews: 312,
    trending: true,
    deal: { discount: 20, label: "Best Seller" },
  },
];

export const mockProducts = products;

export const reviews = [
  { id: "1", name: "Ahmed K.", rating: 5, text: "Best mangoes I've ever ordered online! Fresh, sweet, and delivered on time.", date: "2 days ago" },
  { id: "2", name: "Sara M.", rating: 5, text: "The Sindhri mangoes were absolutely divine. Will order again!", date: "1 week ago" },
  { id: "3", name: "Usman R.", rating: 4, text: "Great quality Chaunsa. Packaging was excellent too.", date: "2 weeks ago" },
  { id: "4", name: "Fatima Z.", rating: 5, text: "The gift box was perfect for Eid! Everyone loved it.", date: "3 weeks ago" },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    items: [{ product: products[0], weight: products[0].weights[1], quantity: 2 }],
    total: 3800,
    status: "dispatched",
    customer: { name: "Ahmed Khan", address: "123 Gulberg, Lahore", phone: "0300-1234567" },
    paymentMethod: "COD",
    date: "2026-04-07",
  },
  {
    id: "ORD-002",
    items: [{ product: products[1], weight: products[1].weights[0], quantity: 1 }],
    total: 1400,
    status: "pending",
    customer: { name: "Sara Malik", address: "45 DHA Phase 5, Karachi", phone: "0321-7654321" },
    paymentMethod: "Easypaisa",
    date: "2026-04-08",
  },
  {
    id: "ORD-003",
    items: [{ product: products[5], weight: products[5].weights[2], quantity: 1 }],
    total: 8000,
    status: "delivered",
    customer: { name: "Usman Raza", address: "78 F-8, Islamabad", phone: "0333-9876543" },
    paymentMethod: "Card",
    date: "2026-04-05",
  },
];
