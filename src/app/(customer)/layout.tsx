export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Mobile-first customer layout, extra padding at bottom for floating cart */}
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-sm">
        {children}
      </main>
    </div>
  );
}
