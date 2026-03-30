// Типы данных для API

export interface Product {
  id: number;
  uid?: string;
  recid?: string;
  title: string;
  slug?: string;
  description?: string;
  text?: string;
  price?: number;
  currency: string;
  image_url?: string;
  gallery?: string;
  category?: string;
  type?: string;
  name_main?: string;
  name_spec?: string;
  article?: string;
  brand?: string;
  specs?: string;
  is_available: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id?: number;
  product_name: string;
  product_uid?: string;
  quantity: number;
  price?: number;
  comment?: string;
}

export interface Order {
  id: number;
  order_number?: string;
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  company_name?: string;
  inn?: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  source?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface QuizResult {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  answers: string;
  result_type?: string;
  recommended_products?: string;
  is_processed: boolean;
  manager_comment?: string;
  created_at: string;
}

export interface ContactFormSubmission {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  subject?: string;
  form_type?: string;
  is_processed: boolean;
  manager_comment?: string;
  created_at: string;
}

export interface SyncLog {
  id: number;
  sync_type: string;
  status: 'success' | 'error' | 'partial';
  items_processed: number;
  items_created: number;
  items_updated: number;
  items_failed: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface HealthResponse {
  status: string;
  database?: string;
  timestamp: string;
}
