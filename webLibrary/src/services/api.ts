import { getAuthHeaders } from '@/lib/auth-utils';
import { ApiResponseError, Book, Category, Editorial, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FetchApiOptions extends RequestInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any; // Allow any type for body, will be stringified
}

async function fetchApi<T>(endpoint: string, options: FetchApiOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const authHeaders = getAuthHeaders();

  const config: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  };

  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        errorData = { message: response.statusText };
      }
      const error: ApiResponseError = {
        message: errorData?.message || 'API request failed',
        statusCode: response.status,
        details: errorData?.details || errorData,
      };
      throw error;
    }

    // Handle cases where response might be empty (e.g., DELETE, PUT with no content)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json() as T;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return undefined as any; // Or handle as Promise<void> if appropriate for no-content responses

  } catch (error) {
    console.error('API call failed:', error);
    // Re-throw custom error or handle as needed
    if (error instanceof Object && 'message' in error) throw error;
    throw new Error('An unexpected error occurred during API call.');
  }
}

// --- Auth ---
export const loginUser = async (credentials: { email: string; password: string }): Promise<{ token: string; usuario: User }> => {
  return fetchApi<{ token: string; usuario: User }>('/api/usuarios/login', {
    method: 'POST',
    body: credentials,
  });
};

// --- Sales ---
export const createSale = async (saleData: CreateSalePayload): Promise<Sale> => {
  return fetchApi<Sale>('/api/ventas', {
    method: 'POST',
    body: saleData,
  });
};

export const getUserSales = async (): Promise<Sale[]> => {
  return fetchApi<Sale[]>('/api/ventas');
};

export const getSaleById = async (saleId: string | number): Promise<Sale> => {
  return fetchApi<Sale>(`/api/ventas/${saleId}`);
};

// Admin specific sales endpoints
export const getAdminSales = async (): Promise<Sale[]> => {
  return fetchApi<Sale[]>('/api/ventas/admin');
};

export const getAdminSaleById = async (saleId: string | number): Promise<Sale> => {
  return fetchApi<Sale>(`/api/ventas/admin/${saleId}`);
};

// --- Cart ---
export const getCart = async (): Promise<Cart> => {
  return fetchApi<Cart>('/api/carrito');
};

export const addItemToCart = async (item: { libroId: string | number; cantidad: number }): Promise<Cart> => {
  return fetchApi<Cart>('/api/carrito/items', {
    method: 'POST',
    body: item,
  });
};

export const updateCartItem = async (itemId: string | number, updates: { cantidad: number }): Promise<Cart> => {
  return fetchApi<Cart>(`/api/carrito/items/${itemId}`, {
    method: 'PUT',
    body: updates,
  });
};

export const removeCartItem = async (itemId: string | number): Promise<void> => { // Or Promise<Cart> if API returns updated cart
  return fetchApi<void>(`/api/carrito/items/${itemId}`, { // Or Cart
    method: 'DELETE',
  });
};

export const registerUser = async (userData: Partial<User>): Promise<User> => {
  return fetchApi<User>('/api/usuarios/registro', {
    method: 'POST',
    body: userData,
  });
};

export const getUserProfile = async (userId: string | number): Promise<User> => {
  return fetchApi<User>(`/api/usuarios/${userId}`);
};

// --- Books ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBooks = async (params?: Record<string, any>): Promise<Book[]> => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchApi<Book[]>(`/api/libros${query}`);
};

export const getBookById = async (id: string | number): Promise<Book> => {
  return fetchApi<Book>(`/api/libros/${id}`);
};

export const createBook = async (bookData: Partial<Book>): Promise<Book> => {
  return fetchApi<Book>('/api/libros', {
    method: 'POST',
    body: bookData,
  });
};

export const updateBook = async (id: string | number, bookData: Partial<Book>): Promise<Book> => {
  return fetchApi<Book>(`/api/libros/${id}`, {
    method: 'PUT',
    body: bookData,
  });
};

export const deleteBook = async (id: string | number): Promise<void> => {
  return fetchApi<void>(`/api/libros/${id}`, {
    method: 'DELETE',
  });
};

// --- Categories ---
export const getCategories = async (): Promise<Category[]> => {
  return fetchApi<Category[]>('/api/categorias');
};

export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
  return fetchApi<Category>('/api/categorias', {
    method: 'POST',
    body: categoryData,
  });
};

export const updateCategory = async (id: string | number, categoryData: Partial<Category>): Promise<Category> => {
  return fetchApi<Category>(`/api/categorias/${id}`, {
    method: 'PUT',
    body: categoryData,
  });
};

export const deleteCategory = async (id: string | number): Promise<void> => {
  return fetchApi<void>(`/api/categorias/${id}`, {
    method: 'DELETE',
  });
};

// --- Editorials ---
export const getEditorials = async (): Promise<Editorial[]> => {
  return fetchApi<Editorial[]>('/api/editoriales');
};

export const createEditorial = async (editorialData: Partial<Editorial>): Promise<Editorial> => {
  return fetchApi<Editorial>('/api/editoriales', {
    method: 'POST',
    body: editorialData,
  });
};

export const updateEditorial = async (id: string | number, editorialData: Partial<Editorial>): Promise<Editorial> => {
  return fetchApi<Editorial>(`/api/editoriales/${id}`, {
    method: 'PUT',
    body: editorialData,
  });
};

export const deleteEditorial = async (id: string | number): Promise<void> => {
  return fetchApi<void>(`/api/editoriales/${id}`, {
    method: 'DELETE',
  });
};
