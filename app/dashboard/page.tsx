
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
        <div className="flex flex-col p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-neutral-200 dark:border-neutral-800">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-900">
                  <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">ID</th>
                  <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Name</th>
                  <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Status</th>
                  <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                    <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">{row}</td>
                    <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Sample Item {row}</td>
                    <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Active</td>
                    <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">2024-01-{row + 10}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

