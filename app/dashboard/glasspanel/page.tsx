"use client"

import { FaDatabase, FaMemory, FaNetworkWired, FaServer } from "react-icons/fa"

interface ServerMetrics {
  id: string
  name: string
  status: "healthy" | "warning" | "critical"
  cpu: number
  memory: number
  storage: number
  network: number
}

const mockServers: ServerMetrics[] = [
  {
    id: "srv-001",
    name: "Production Web Server",
    status: "healthy",
    cpu: 45,
    memory: 62,
    storage: 78,
    network: 25
  },
  {
    id: "srv-002", 
    name: "Database Server",
    status: "warning",
    cpu: 82,
    memory: 90,
    storage: 65,
    network: 45
  },
  {
    id: "srv-003",
    name: "Cache Server",
    status: "healthy",
    cpu: 30,
    memory: 45,
    storage: 40,
    network: 15
  },
  {
    id: "srv-004",
    name: "Backup Server",
    status: "critical",
    cpu: 95,
    memory: 98,
    storage: 92,
    network: 5
  }
]

export default function GlassPanelPage() {
  return (
    <div className="flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-6">GlassPanel Server Monitoring</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockServers.map((server) => (
          <div 
            key={server.id}
            className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{server.name}</h3>
              <span 
                className={`px-2 py-1 rounded-full text-xs ${
                  server.status === "healthy" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : server.status === "warning"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {server.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaServer className="text-neutral-500" />
                  <span className="text-sm">CPU</span>
                </div>
                <span className="text-sm font-medium">{server.cpu}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaMemory className="text-neutral-500" />
                  <span className="text-sm">Memory</span>
                </div>
                <span className="text-sm font-medium">{server.memory}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaDatabase className="text-neutral-500" />
                  <span className="text-sm">Storage</span>
                </div>
                <span className="text-sm font-medium">{server.storage}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaNetworkWired className="text-neutral-500" />
                  <span className="text-sm">Network</span>
                </div>
                <span className="text-sm font-medium">{server.network}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-neutral-200 dark:border-neutral-800">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-900">
              <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Server ID</th>
              <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Name</th>
              <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Status</th>
              <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">CPU</th>
              <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Memory</th>
              <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Storage</th>
              <th className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">Network</th>
            </tr>
          </thead>
          <tbody>
            {mockServers.map((server) => (
              <tr key={server.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">{server.id}</td>
                <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">{server.name}</td>
                <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      server.status === "healthy" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : server.status === "warning"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {server.status}
                  </span>
                </td>
                <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">{server.cpu}%</td>
                <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">{server.memory}%</td>
                <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">{server.storage}%</td>
                <td className="border border-neutral-200 dark:border-neutral-800 px-4 py-2">{server.network}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
