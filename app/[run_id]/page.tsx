import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import TimestampChart from './TimestampChart'
import CopyButton from './CopyButton'

type RunLog = {
  run_name: string
  ts: string
  comment?: string
}

export default async function Page({ params }: { params: Promise<{ run_id: string }> }) {
  const { run_id } = await params
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const { data, error } = await supabase.from('run_logs').select().eq('run_name', run_id) as { data: RunLog[], error: null } | { data: null, error: Error }
  if(error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error: {error.message}</h1>
      </div>
    )
  }

  // Calculate metrics
  const totalEvents = data?.length || 0
  let formattedDuration = '0ms'
  let minTime = 0
  let maxTime = 0

  if (data && data.length > 0) {
    const timestamps = data.map(log => new Date(log.ts).getTime())
    minTime = Math.min(...timestamps)
    maxTime = Math.max(...timestamps)
    const totalDuration = maxTime - minTime

    // Format duration
    if (totalDuration < 1000) {
      formattedDuration = `${totalDuration}ms`
    } else if (totalDuration < 60000) {
      formattedDuration = `${(totalDuration / 1000).toFixed(2)}s`
    } else {
      const seconds = Math.floor(totalDuration / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      if (minutes < 60) {
        formattedDuration = `${minutes}m ${remainingSeconds}s`
      } else {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        formattedDuration = `${hours}h ${remainingMinutes}m ${remainingSeconds}s`
      }
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Run Log Distribution: {data[0]?.comment || run_id}</h1>
      {data && data.length > 0 ? (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-300 mb-2">Total events: {totalEvents} | Total duration: {formattedDuration} | Events per second: {(totalEvents / (maxTime - minTime) * 1000).toFixed(2)}</p>
            <TimestampChart data={data} />
          </div>
          <div className="mt-6 flex items-center gap-4 max-w-full">
            <details className="flex-1 flex flex-col">
              <summary className="cursor-pointer text-sm text-gray-600 flex items-center justify-between">
                <span>View raw data</span>
                <CopyButton data={data} />
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 text-black rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
            </details>
          </div>
        </>
      ) : (
        <p>No data found for this run.</p>
      )}
    </div>
  )
}
