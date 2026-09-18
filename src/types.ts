export type FoodCategory =
  | 'Burgers'
  | 'Pizza'
  | 'Chicken'
  | 'Pasta'
  | 'Desserts'
  | 'Drinks'
  | 'Healthy'
  | 'Fast Food';

export interface CustomizationOption {
  id: string;
  name: string;
  options: {
    label: string;
    extraPrice: number;
  }[];
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  fullStory: string;
  image: string;
  badge?: string;
  calories: number;
  prepTime: string;
  protein: string;
  chefSpecial?: boolean;
  inStock: number;
  ingredients: string[];
  customizations?: CustomizationOption[];
}

export interface CartItem {
  cartId: string;
  foodId: string;
  food: FoodItem;
  quantity: number;
  selectedCustomizations: Record<string, string>;
  itemTotal: number;
}

export interface Order {
  id: string;
  items: {
    foodId: string;
    name: string;
    price: number;
    quantity: number;
    selectedCustomizations: Record<string, string>;
  }[];
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

export interface ChefInfo {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  bio: string;
  awards: string[];
  signatureDish: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  dishName: string;
  dishImage: string;
  date: string;
}

export interface PromoOffer {
  code: string;
  title: string;
  badge: string;
  discountPercent?: number;
  freeDelivery?: boolean;
  description: string;
  expiry: string;
  color: string;
}
