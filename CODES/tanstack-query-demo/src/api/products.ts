// api/products.ts
const BASE_URL = 'https://dummyjson.com/products'


export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  thumbnail: string 
  images?: string[]
  rating?: number
}

export interface ListResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CreateProduct {
  title: string
  price: number
  description: string
  thumbnail?: string
  category: string
}

/**
 * 延迟函数，用于模拟网络耗时
 */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * 通用 fetch JSON 工具函数
 */
async function fetchJSON<T>(
  url: string,
  options?: RequestInit,
  delay = 300 // 默认延迟 300ms
): Promise<T> {
  if (delay > 0) await sleep(delay)

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

/**
 * 获取所有商品（仅用于调试）
 */
export async function getProducts(): Promise<ListResponse> {
  return fetchJSON<ListResponse>(BASE_URL)
}

/**
 * 获取单个商品
 */
export async function getProductByID(id: number): Promise<Product> {
  return fetchJSON<Product>(`${BASE_URL}/${id}`)
}

/**
 * 分页获取商品（每页 5 条）
 * dummyjson 支持 limit & skip 参数
 */
export async function getProductsByPage(page: number): Promise<ListResponse> {
  const limit = 5
  const skip = (page - 1) * limit
  return fetchJSON<ListResponse>(`${BASE_URL}?limit=${limit}&skip=${skip}`)
}

/**
 * 创建商品
 */
export async function createProduct(product: CreateProduct): Promise<Product> {
  return fetchJSON<Product>(BASE_URL + '/add', {
    method: 'POST',
    body: JSON.stringify(product),
  })
}

/**
 * 更新商品
 */
export async function updateProduct(
  id: number,
  product: Partial<CreateProduct>
): Promise<Product> {
  return fetchJSON<Product>(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
}

/**
 * 删除商品
 */
export async function deleteProduct(id: number): Promise<{ isDeleted: boolean }> {
  return fetchJSON<{ isDeleted: boolean }>(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
}