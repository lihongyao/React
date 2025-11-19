// app/products/page.tsx
import Image from "next/image";
import Link from "next/link";

const fetchData = async () => {
  const res = await fetch("https://dummyjson.com/products");
  return res.json();
};

export default async function Page() {
  const data = await fetchData();
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data.products.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <Image
                alt={product.title}
                src={product.thumbnail}
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                width={400}
                height={800}
              />
              <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
              <p className="mt-1 text-lg font-medium text-gray-500">
                {product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
