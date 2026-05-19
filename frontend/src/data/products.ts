export interface Product {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: 'men' | 'women' | 'kids';
  season: 'summer' | 'winter';
  subcategory?: string; // Made optional as per instruction
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  image?: string; // Backend uses image for main image
  stock?: number;
  countInStock?: number; // Backend uses countInStock
  rating: number;
  numReviews: number; // Backend uses numReviews
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  material?: string;
  brand?: string;
  wholesalePrice?: number;
  wholesaleEnabled?: boolean;
  minWholesaleQuantity?: number;
  pricingTiers?: { minQuantity: number; maxQuantity?: number; pricePerUnit: number }[];
  reviews?: {
    _id?: string;
    name: string;
    rating: number;
    comment: string;
    user: string;
    image?: string;
    verified?: boolean;
    createdAt?: string;
  }[];
}

export const products: Product[] = [
  // Summer Women
  {
    id: "sw-001",
    name: "Linen Maxi Dress",
    price: 4999,
    originalPrice: 6999,
    description: "Elegant flowing linen maxi dress perfect for summer days. Features a flattering A-line silhouette with adjustable straps.",
    category: "women",
    season: "summer",
    subcategory: "dresses",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Sage", hex: "#9CAF88" },
      { name: "Terracotta", hex: "#C9705D" }
    ],
    images: ["/placeholder.svg"],
    stock: 45,
    rating: 4.8,
    numReviews: 124,
    isFeatured: true,
    isNewArrival: true,
    material: "100% Linen"
  },
  {
    id: "sw-002",
    name: "Cotton Blouse",
    price: 2499,
    description: "Lightweight cotton blouse with delicate embroidery. Perfect for casual outings.",
    category: "women",
    season: "summer",
    subcategory: "tops",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Cream", hex: "#FFFDD0" },
      { name: "Sky Blue", hex: "#87CEEB" }
    ],
    images: ["/placeholder.svg"],
    stock: 60,
    rating: 4.6,
    numReviews: 89,
    isBestSeller: true,
    material: "100% Cotton"
  },
  {
    id: "sw-003",
    name: "Floral Midi Skirt",
    price: 3499,
    description: "Beautiful floral print midi skirt with elastic waistband for ultimate comfort.",
    category: "women",
    season: "summer",
    subcategory: "skirts",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Floral Blue", hex: "#6B8E9F" },
      { name: "Floral Pink", hex: "#FFB6C1" }
    ],
    images: ["/placeholder.svg"],
    stock: 35,
    rating: 4.7,
    numReviews: 56,
    isNewArrival: true,
    material: "Viscose"
  },
  // Summer Men
  {
    id: "sm-001",
    name: "Linen Shirt",
    price: 2999,
    originalPrice: 3999,
    description: "Classic linen shirt for warm summer days. Breathable and stylish.",
    category: "men",
    season: "summer",
    subcategory: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#1B2A4E" },
      { name: "Beige", hex: "#D4C4A8" }
    ],
    images: ["/placeholder.svg"],
    stock: 80,
    rating: 4.9,
    numReviews: 201,
    isFeatured: true,
    isBestSeller: true,
    material: "100% Linen"
  },
  {
    id: "sm-002",
    name: "Chino Shorts",
    price: 1999,
    description: "Comfortable chino shorts with a modern slim fit. Perfect for beach to bar.",
    category: "men",
    season: "summer",
    subcategory: "pants",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Khaki", hex: "#C3B091" },
      { name: "Navy", hex: "#1B2A4E" },
      { name: "Olive", hex: "#556B2F" }
    ],
    images: ["/placeholder.svg"],
    stock: 95,
    rating: 4.5,
    numReviews: 143,
    isBestSeller: true,
    material: "Cotton Blend"
  },
  {
    id: "sm-003",
    name: "Polo Shirt",
    price: 1799,
    description: "Premium cotton polo with a relaxed fit. Essential summer staple.",
    category: "men",
    season: "summer",
    subcategory: "shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Coral", hex: "#FF7F50" }
    ],
    images: ["/placeholder.svg"],
    stock: 120,
    rating: 4.4,
    numReviews: 178,
    isNewArrival: true,
    material: "100% Cotton"
  },
  // Winter Women
  {
    id: "ww-001",
    name: "Wool Blend Coat",
    price: 12999,
    originalPrice: 15999,
    description: "Luxurious wool blend coat with a timeless silhouette. Perfect for cold winter days.",
    category: "women",
    season: "winter",
    subcategory: "outerwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Camel", hex: "#C19A6B" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Burgundy", hex: "#800020" }
    ],
    images: ["/placeholder.svg"],
    stock: 25,
    rating: 4.9,
    numReviews: 87,
    isFeatured: true,
    isBestSeller: true,
    material: "80% Wool, 20% Polyester"
  },
  {
    id: "ww-002",
    name: "Cashmere Sweater",
    price: 7999,
    description: "Ultra-soft cashmere sweater with a relaxed fit. Luxuriously warm.",
    category: "women",
    season: "winter",
    subcategory: "knitwear",
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Oatmeal", hex: "#D2B48C" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Dusty Rose", hex: "#DCAE96" }
    ],
    images: ["/placeholder.svg"],
    stock: 40,
    rating: 4.8,
    numReviews: 112,
    isNewArrival: true,
    material: "100% Cashmere"
  },
  {
    id: "ww-003",
    name: "Leather Boots",
    price: 8999,
    description: "Genuine leather ankle boots with block heel. Elegant and durable.",
    category: "women",
    season: "winter",
    subcategory: "footwear",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Brown", hex: "#8B4513" }
    ],
    images: ["/placeholder.svg"],
    stock: 30,
    rating: 4.7,
    numReviews: 94,
    isFeatured: true,
    material: "Genuine Leather"
  },
  // Winter Men
  {
    id: "wm-001",
    name: "Down Parka",
    price: 14999,
    originalPrice: 18999,
    description: "Premium down-filled parka with water-resistant outer shell. Ultimate warmth.",
    category: "men",
    season: "winter",
    subcategory: "outerwear",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Navy", hex: "#1B2A4E" },
      { name: "Forest Green", hex: "#228B22" }
    ],
    images: ["/placeholder.svg"],
    stock: 35,
    rating: 4.9,
    numReviews: 156,
    isFeatured: true,
    isBestSeller: true,
    material: "Nylon Shell, 90% Duck Down"
  },
  {
    id: "wm-002",
    name: "Merino Wool Sweater",
    price: 4999,
    description: "Fine merino wool crewneck sweater. Soft, warm, and versatile.",
    category: "men",
    season: "winter",
    subcategory: "knitwear",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy", hex: "#1B2A4E" },
      { name: "Burgundy", hex: "#800020" },
      { name: "Gray", hex: "#808080" }
    ],
    images: ["/placeholder.svg"],
    stock: 55,
    rating: 4.6,
    numReviews: 89,
    isNewArrival: true,
    material: "100% Merino Wool"
  },
  {
    id: "wm-003",
    name: "Leather Jacket",
    price: 19999,
    description: "Classic leather jacket with quilted lining. Timeless style.",
    category: "men",
    season: "winter",
    subcategory: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "Brown", hex: "#5C4033" }
    ],
    images: ["/placeholder.svg"],
    stock: 20,
    rating: 4.8,
    numReviews: 67,
    isFeatured: true,
    material: "Genuine Leather"
  }
];

export const categories = [
  { id: "summer", name: "Summer Collection", icon: "☀️" },
  { id: "winter", name: "Winter Collection", icon: "❄️" },
  { id: "men", name: "Men", icon: "👔" },
  { id: "women", name: "Women", icon: "👗" },
  { id: "kids", name: "Kids", icon: "👶" }
];

export const subcategories = [
  "dresses",
  "tops",
  "skirts",
  "shirts",
  "pants",
  "outerwear",
  "knitwear",
  "footwear"
];

export const sizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "37", "38", "39", "40", "41"];

export const priceRanges = [
  { min: 0, max: 2000, label: "Under ₹2,000" },
  { min: 2000, max: 5000, label: "₹2,000 - ₹5,000" },
  { min: 5000, max: 10000, label: "₹5,000 - ₹10,000" },
  { min: 10000, max: 20000, label: "₹10,000 - ₹20,000" },
  { min: 20000, max: Infinity, label: "Above ₹20,000" }
];
