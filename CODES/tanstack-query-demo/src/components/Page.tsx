import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Product, ListResponse, getProductsByPage } from "../api/products";

interface PageParam {
  page: number;
}

export default function ProductList() {
  const [keyword, setKeyword] = useState("");
  const [searchKey, setSearchKey] = useState("");

  // debounce 搜索关键字
  useEffect(() => {
    const timer = setTimeout(() => setSearchKey(keyword), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<ListResponse, Error>({
    queryKey: ["products", searchKey],
    queryFn: async ({ pageParam = { page: 1 } }) => {
      // 调用 api/products.ts 中封装的分页函数
      return getProductsByPage(pageParam.page);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.skip / lastPage.limit + 2; // 下一页
      return nextPage > Math.ceil(lastPage.total / lastPage.limit) ? undefined : { page: nextPage };
    },
    keepPreviousData: true,
  });

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
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* 商品列表网格 */}
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

      {/* 加载更多按钮 */}
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
