import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

/** 数据类型 */
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
}

/** 服务端分页返回结构（单页） */
interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/** pageParam 的形状 */
interface PageParam {
  skip: number;
  limit: number;
}

/** 获取分页数据函数 */
async function getProducts({ skip = 0, limit = 10, keyword = "" }: { skip?: number; limit?: number; keyword?: string }): Promise<ProductResponse> {
  const q = keyword ? `&q=${encodeURIComponent(keyword)}` : "";
  const res = await fetch(`https://dummyjson.com/products/search?limit=${limit}&skip=${skip}${q}`);
  if (!res.ok) throw new Error("加载失败");
  return res.json();
}

export default function ProductList() {
  const [keyword, setKeyword] = useState("");

  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["products", keyword],
    /**
     * 这里必须显式写明参数类型，否则 React Query 泛型无法对齐
     */
    queryFn: async ({ pageParam = { skip: 0, limit: 20 }, queryKey }: { pageParam?: PageParam; queryKey: [string, string] }): Promise<ProductResponse> => {
      const [, key] = queryKey;
      return getProducts({ ...pageParam, keyword: key });
    },
    /**
     * 返回下一个 pageParam，如果 undefined 则停止
     */
    getNextPageParam: (lastPage: ProductResponse, allPages: ProductResponse[]): PageParam | undefined => {
      console.log(allPages);
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip >= lastPage.total ? undefined : { skip: nextSkip, limit: lastPage.limit };
    },
  });

  // 平铺所有页
  const products: Product[] = data?.pages.flatMap((p) => p.products) ?? [];

  if (isLoading) return <div className="text-center py-10 text-gray-500">加载中...</div>;
  if (error) return <div className="text-center py-10 text-red-500">出错了：{error.message}</div>;

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* 搜索框 */}
      <div className="w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="搜索商品..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {products.map((p) => (
          <div key={p.id} className="p-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
            <img src={p.thumbnail} alt={p.title} className="rounded-lg mb-2 w-full h-32 object-cover" />
            <div className="text-sm text-gray-800 font-medium line-clamp-2">{p.title}</div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</div>
            <div className="mt-2 font-semibold text-blue-600">${p.price}</div>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      <div className="mt-8">
        {hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? "加载中..." : "加载更多"}
          </button>
        ) : (
          <div className="text-gray-400 text-sm mt-4">没有更多了~</div>
        )}
      </div>
    </div>
  );
}
