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


  const runEvents = [...Array(count)].map(() => {
    return {
      name: LogRunEventName,
      data: {
        runName,
        count,
      }
    }
  })

  await step.sendEvent('start-subruns', runEvents)

  return runName
})
