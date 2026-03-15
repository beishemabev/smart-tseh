export default function BatchesSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden">
      <ul className="divide-y divide-gray-100 dark:divide-slate-700">
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i} className="p-4 sm:p-5 animate-pulse">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 w-full flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
                </div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-16 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
