// WooCommerce Product Types
export interface WCImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: WCImage | null;
  count: number;
}

export interface WCAttribute {
  id: number;
  name: string;
  slug: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  stock_quantity: number | null;
  categories: WCCategory[];
  images: WCImage[];
  attributes: WCAttribute[];
  variations: number[];
  related_ids: number[];
  meta_data: { key: string; value: string }[];
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
}

export interface WCProductVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  stock_quantity: number | null;
  image: WCImage;
  attributes: { id: number; name: string; option: string }[];
}

// Cart Types (client-side)
export interface CartItem {
  product: WCProduct;
  variation?: WCProductVariation;
  quantity: number;
  selectedAttributes?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Order Types
export interface WCOrder {
  id: number;
  status: string;
  total: string;
  line_items: {
    product_id: number;
    variation_id: number;
    quantity: number;
    name: string;
    total: string;
  }[];
  billing: WCAddress;
  shipping: WCAddress;
}

export interface WCAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}
