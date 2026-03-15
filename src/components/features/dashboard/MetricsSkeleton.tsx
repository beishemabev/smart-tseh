export default function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gray-200 rounded-xl h-12 w-12" />
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <dd className="flex items-baseline">
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
