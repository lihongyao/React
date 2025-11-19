export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        {analytics}
        {team}
      </div>
      {children}
    </div>
  );
}
