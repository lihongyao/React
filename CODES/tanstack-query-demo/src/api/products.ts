const BASE_URL = 'https://fakestoreapi.com/products';

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: Rating;
}

export interface CreateProduct {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
}



const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 通用 fetch JSON 工具函数
 */
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * 获取所有商品
 */
export async function getProducts(): Promise<Product[]> {
  await sleep(1000);
  return fetchJSON<Product[]>(BASE_URL);
}

/**
 * 获取单个商品
 */
export async function getProductByID(id: number): Promise<Product> {
  return fetchJSON<Product>(`${BASE_URL}/${id}`);
}

/**
 * 分页获取商品
 * 因为产品一共只有 20 条，为了达到多页获取的效果，所以每页最多显示 5 条
 */
export async function getProductByPage(page: number): Promise<Product[]> {
  const limit = 5;
  if (page > 4) return [];
  return fetchJSON<Product[]>(`${BASE_URL}?limit=${page * limit}`);
}

/**
 * 创建商品
 */
export async function createProduct(product: CreateProduct): Promise<Product> {
  return fetchJSON<Product>(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
}