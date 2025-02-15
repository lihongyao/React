import Image from "next/image";
import React from "react";

export default function ProductItem() {
  const product = {
    id: 1,
    name: "Basic Tee",
    imageSrc: "https://tailwindui.com/plus/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "$35",
    color: "Black",
  };
  return (
    <div className="w-[200px]">
      <Image src={product.imageSrc} alt={product.imageSrc} width={280} height={380} />
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{product.color}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{product.price}</p>
      </div>
    </div>
  );
}
