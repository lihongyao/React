import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductByID, getProducts, type Product, type ListResponse } from "../api/products";

export default function SingleProduct() {
  // 获取所有产品
  const {
    data: allProductsData,
    error: allProductsError,
    isPending: isLoadingAll,
  } = useQuery<ListResponse>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const allProducts = allProductsData?.products ?? [];

  // 当前选中商品 ID
  const [id, setId] = useState<number | undefined>(undefined);
  const selectedId = id ?? allProducts?.[0]?.id;

  // 获取单个产品详情
  const {
    data: product,
    isPending,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", selectedId],
    queryFn: () => getProductByID(selectedId!),
    enabled: !!selectedId,
  });

  if (allProductsError instanceof Error) {
    return <div className="text-center text-red-500 py-6">加载产品列表失败：{allProductsError.message}</div>;
  }

  if (isLoadingAll) {
    return <div className="text-center text-gray-500 py-6">加载中...</div>;
  }

  if (!allProducts?.length) {
    return <div className="text-center py-6 text-gray-500">暂无产品</div>;
  }

  return (
    <main className="flex flex-col items-center w-full p-6 overscroll-none gap-4">
      {/* 缩略图横向滚动区域 */}
      <section className="flex flex-wrap gap-4 w-full">
        {allProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => setId(product.id)}
            className={`shrink-0 w-16 h-16 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex items-center justify-center ${
              product.id === selectedId ? "border-blue-500 ring-2 ring-blue-400" : "border-gray-200"
            }`}
          >
            <img src={product.thumbnail} alt={product.title} className="h-full w-full object-contain p-1" />
          </button>
        ))}
      </section>

      {/* 加载状态 */}
      {isPending && <div className="text-gray-500 animate-pulse">加载中...</div>}

      {/* 错误状态 */}
      {isError && <div className="text-red-500 py-2">加载产品详情失败</div>}

      {/* 商品详情卡片 */}
      {!isPending && product && (
        <article className="w-72 bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-center p-4 bg-gray-50">
            <img src={product.thumbnail} alt={product.title} className="h-48 w-48 object-contain transform transition-transform duration-300 hover:scale-105" />
          </div>

          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase line-clamp-1">{product.category}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{product.title}</p>

            <div className="mt-2 flex justify-between items-center text-sm font-semibold text-gray-800 uppercase">
              <span>Price: ${product.price}</span>
              <span>Rate: {product.rating ?? "N/A"}</span>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
