// app/products/[id]/page.tsx
import Image from "next/image";

const fetchDetails = async (id: string) => {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  return await res.json();
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const details = await fetchDetails(id);
  return (
    <div className="container mx-auto mt-8">
      <Image
        className=" rounded-lg block mx-auto"
        src={details.thumbnail}
        alt={details.title}
        width={300}
        height={300}
        loading="eager"
      />
      <div className="border-2 border-dashed border-gray-500 rounded-lg p-3 mt-6 leading-8">
        <p>
          <strong>Title：</strong>
          {details.title}
        </p>
        <p>
          <strong>Price：</strong>
          {details.price}
        </p>
        <p>
          <strong>Desc：</strong>
          {details.description}
        </p>
      </div>
    </div>
  );
}
