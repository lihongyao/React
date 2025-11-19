import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/products";

export default function All() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) return <div className="text-center py-10 text-gray-500">加载中...</div>;
  if (error instanceof Error) return <div className="text-center py-10 text-red-500">出错了：{error.message}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {data?.products.map((p) => (
        <div key={p.id} className="p-4 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
          <img src={p.thumbnail} alt={p.title} className="rounded-lg mb-2 w-full h-32 object-cover" />
          <div className="text-sm text-gray-800 font-medium line-clamp-2">{p.title}</div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</div>
          <div className="mt-2 font-semibold text-blue-600">${p.price}</div>
        </div>
      ))}
    </div>
  );
}
