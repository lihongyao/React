// app/@modal/(.)products/[id]/page.tsx
"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [details, setDetails] = useState<any>();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch(`https://dummyjson.com/products/${params.id}`);
      setDetails(await res.json());
    })();
  }, [params]);

  if (!details) return null;

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-gray-500/80 "
      onClick={router.back}
    >
      <div className="w-[300px] h-[300px] bg-white rounded-md">
        <Image
          src={details.thumbnail}
          width={300}
          height={300}
          loading="eager"
          alt={details.title}
          className="rounded-lg object-cover "
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
