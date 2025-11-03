import { useQuery } from "@tanstack/react-query";
import { getProductByID, getProducts, type Product } from "../api/products";

import { useState } from "react";

export default function SingleProduct() {
  // 获取所有产品
  const { data: allProducts, error: allProductsError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // 当前选中商品 ID
  const [id, setId] = useState<number | undefined>(undefined);

  // 自动选中第一个产品
  const selectedId = id ?? allProducts?.[0]?.id;

  // 获取单个产品详情
  const { data, isPending } = useQuery<Product>({
    queryKey: ["product", selectedId],
    queryFn: () => getProductByID(selectedId!),
    enabled: !!selectedId,
  });

  if (allProductsError instanceof Error) {
    return <div className="text-center text-red-500 py-6">加载产品列表失败：{allProductsError.message}</div>;
  }

  if (!allProducts?.length) {
    return <div className="text-center py-6 text-gray-500">暂无产品</div>;
  }

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* 小缩略图列表 */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {allProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => setId(product.id)}
            className={`w-16 h-16 rounded-lg border transition-all duration-200 overflow-hidden flex items-center justify-center bg-white shadow-sm hover:shadow-md ${
              product.id === selectedId ? "border-blue-500 ring-2 ring-blue-400" : "border-gray-200"
            }`}
          >
            <img src={product.image} alt={product.title} className="h-full w-full object-contain p-1" />
          </button>
        ))}
      </div>

      {/* 加载状态 */}
      {isPending && <div className="text-gray-500">加载中...</div>}

      {/* 商品详情卡片 */}
      {!isPending && data && (
        <div className="w-64 bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-center p-4 bg-gray-50">
            <img src={data.image} alt={data.title} className="h-48 w-48 object-contain transform transition-transform duration-300 hover:scale-105" />
          </div>

          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-700 line-clamp-1 uppercase">{data.category}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{data.title}</p>

            <div className="mt-2 flex justify-between items-center text-sm font-semibold text-gray-800 uppercase">
              <span>Price: ${data.price}</span>
              <span>Rate: {data.rating?.rate ?? "N/A"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
