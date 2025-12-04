export default function Loading() {
  return (
    <main className="container-app py-10">
      <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid gap-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-gray-200" />
      </div>
    </main>
  );
}
