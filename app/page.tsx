
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import InngestForm from './components/InngestForm'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const { data } = await supabase
    .rpc('get_distinct_runs')
    .order('ts', { ascending: false }) as { data: { run_name: string, comment: string, ts: string }[] }

  if(!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Run Logs</h1>
        <p className="text-gray-300">No data found</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Run Logs</h1>
      <InngestForm />
      {data.length > 0 ? (
        <ul className="space-y-3">
          {data.map((datum) => (
            <li key={datum.run_name}>
              <Link
                href={`/${datum.run_name}`}
                className="block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-foreground">{datum.comment || datum.run_name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {new Date(datum.ts).toLocaleString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-300">No runs found</p>
      )}
    </div>
  )
}
