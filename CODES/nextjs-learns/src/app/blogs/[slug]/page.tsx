// blogs/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return (
    <div className="p-8 text-center">
      <h1>This is blog details of slug：{slug}</h1>
    </div>
  );
}
