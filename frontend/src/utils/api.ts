// API client for LEDS-LIGHTS backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';


// Types


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

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface OrderCreate {
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  company_name?: string;
  inn?: string;
  source?: string;
  items: OrderItemCreate[];
}

export interface OrderItemCreate {
  product_id?: number;
  product_name: string;
  product_uid?: string;
  quantity?: number;
  price?: number;
  comment?: string;
}

export interface OrderResponse {
  id: number;
  order_number?: string;
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  status: string;
  source?: string;
  created_at: string;
  updated_at: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  order_id: number;
  product_id?: number;
  product_name: string;
  product_uid?: string;
  quantity: number;
  price?: number;
  comment?: string;
}

export interface ContactFormSubmit {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  subject?: string;
  form_type?: string;
}

export interface ContactFormResponse {
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

export interface QuizResultSubmit {
  name?: string;
  phone?: string;
  email?: string;
  answers: string;
  result_type?: string;
  recommended_products?: string;
}

export interface QuizResultResponse {
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

export interface AvailabilityRequest {
  email: string;
  phone: string;
  lamp_name: string;
  product_slug?: string;
  product_id?: number;
}

export interface HealthResponse {
  status: string;
  database?: string;
  timestamp: string;
}

// API Functions

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

// Health Check


export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse<HealthResponse>(response);
}

// Products API


export async function getProducts(params?: {
  page?: number;
  page_size?: number;
  category?: string;
  type?: string;
  brand?: string;
  search?: string;
  is_available?: boolean;
}): Promise<ProductListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.page_size) searchParams.set('page_size', params.page_size.toString());
  if (params?.category) searchParams.set('category', params.category);
  if (params?.type) searchParams.set('type', params.type);
  if (params?.brand) searchParams.set('brand', params.brand);
  if (params?.search) searchParams.set('search', params.search);
  if (params?.is_available !== undefined) searchParams.set('is_available', params.is_available.toString());

  const response = await fetch(`${API_BASE_URL}/products?${searchParams}`);
  return handleResponse<ProductListResponse>(response);
}

export async function getProduct(slug: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}`);
  return handleResponse<Product>(response);
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/id/${id}`);
  return handleResponse<Product>(response);
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  return handleResponse<string[]>(response);
}

export async function getBrands(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/products/brands`);
  return handleResponse<string[]>(response);
}

export async function getTypes(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/products/types`);
  return handleResponse<string[]>(response);
}


// Orders API


export async function createOrder(order: OrderCreate): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
  return handleResponse<OrderResponse>(response);
}

export async function getOrder(orderId: number): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
  return handleResponse<OrderResponse>(response);
}


// Contact Form API


export async function submitContactForm(data: ContactFormSubmit): Promise<ContactFormResponse> {
  const response = await fetch(`${API_BASE_URL}/contact/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<ContactFormResponse>(response);
}


// Availability Request API (uses Contact Form endpoint)


export async function submitAvailabilityRequest(data: AvailabilityRequest): Promise<ContactFormResponse> {
  const response = await fetch(`${API_BASE_URL}/contact/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.lamp_name,
      phone: data.phone,
      email: data.email,
      message: `Запрос наличия: ${data.lamp_name}${data.product_slug ? ` (slug: ${data.product_slug})` : ''}`,
      subject: 'Проверка наличия товара',
      form_type: 'availability_modal',
    }),
  });
  return handleResponse<ContactFormResponse>(response);
}


// Quiz API


export async function submitQuizResult(data: QuizResultSubmit): Promise<QuizResultResponse> {
  const response = await fetch(`${API_BASE_URL}/quiz/results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<QuizResultResponse>(response);
}


// Price Request API (uses Contact Form endpoint)


export async function submitPriceRequest(data: { email: string; phone: string }): Promise<ContactFormResponse> {
  const response = await fetch(`${API_BASE_URL}/contact/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Запрос прайса',
      email: data.email.trim(),
      phone: data.phone.replace(/\D/g, ''),
      message: 'Запрос оптового прайс-листа',
      subject: 'Запрос прайса',
      form_type: 'price_request',
    }),
  });
  return handleResponse<ContactFormResponse>(response);
}


// Calculation Request API (uses Contact Form endpoint)


export async function submitCalculationRequest(data: { phone: string; name?: string }): Promise<ContactFormResponse> {
  const response = await fetch(`${API_BASE_URL}/contact/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name?.trim() || 'Запрос расчёта',
      phone: data.phone.replace(/\D/g, ''),
      message: 'Запрос на расчёт освещения',
      subject: 'Запрос расчёта',
      form_type: 'calculation_request',
    }),
  });
  return handleResponse<ContactFormResponse>(response);
}
