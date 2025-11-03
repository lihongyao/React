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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {data?.map((product) => (
        <div key={product.id} className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-t-2xl bg-gray-50">
            <img src={product.image} alt={product.title} className="h-full object-contain transform transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="w-full p-3 flex flex-col gap-1">
            <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{product.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>

            <div className="mt-2 text-blue-600 font-semibold text-sm">${product.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
