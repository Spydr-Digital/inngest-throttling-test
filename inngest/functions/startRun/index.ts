import { randomUUID } from "crypto";
import { inngest } from '@/inngest/client';

import { EventName as LogRunEventName } from '@/inngest/functions/logRunEvent/type';
import { EventName } from './type';

export default inngest.createFunction({
  id: "start-run",
}, {
  event: EventName,
}, async ({ step, event }) => {
  const {
    id: providedRunName,
    data: {
      count = 100
    }
  } = event

  console.log('providedRunName', providedRunName)

  const runName = await step.run('generate-run-name', async () => {
    return providedRunName || randomUUID()
  })


  const BATCH_SIZE = 500
  const runEvents = [...Array(count)].map(() => {
    return {
      name: LogRunEventName,
      data: {
        runName,
        count,
      }
    }
  })

  const batchedEvents = batchEvents(runEvents, BATCH_SIZE)

  for(const batch of batchedEvents) {
    await step.sendEvent('start-subruns', batch)
  }

  return runName
})

const batchEvents = <T>(events: T[], batchSize: number): T[][] => (
  events.reduce((acc, event, index) => {
    const batchIndex = Math.floor(index / batchSize)
    if (!acc[batchIndex]) {
      acc[batchIndex] = []
    }
    acc[batchIndex].push(event)
    return acc
  }, [] as T[][])
)
