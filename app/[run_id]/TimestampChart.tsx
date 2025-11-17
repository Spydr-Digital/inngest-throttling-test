'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type RunLog = {
  run_name: string
  ts: string
}

type TimestampChartProps = {
  data: RunLog[]
}

export default function TimestampChart({ data }: TimestampChartProps) {
  const chartData = useMemo(() => {
    // Group timestamps by time intervals (0.1 second bins)
    const timeMap = new Map<number, number>()

    data.forEach(log => {
      const date = new Date(log.ts)
      // Round to nearest 0.1 seconds (100ms)
      const roundedTime = Math.round(date.getTime() / 100) * 100
      timeMap.set(roundedTime, (timeMap.get(roundedTime) || 0) + 1)
    })

    // Convert to array and sort by time
    return Array.from(timeMap.entries())
      .map(([timestamp, count]) => {
        const date = new Date(timestamp)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        const milliseconds = date.getMilliseconds().toString().padStart(3, '0')
        return {
          time: `${hours}:${minutes}:${seconds}.${milliseconds}`,
          timestamp,
          count
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#666" />
          <XAxis
            dataKey="time"
            angle={-45}
            textAnchor="end"
            height={100}
            interval="preserveStartEnd"
            tick={{ fill: '#e5e7eb' }}
          />
          <YAxis tick={{ fill: '#e5e7eb' }} />
          <Tooltip
            formatter={(value, name) => [value, name]}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{ backgroundColor: '#fff', color: '#000', border: '1px solid #ccc' }}
            labelStyle={{ color: '#000' }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
  )
}
