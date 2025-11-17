import createClient from "@/utils/supabase/actionClient";
import { inngest } from '@/inngest/client';
import { EventName } from "./type";

const throttleConfig = {
  limit: 100,
  period: '10s' as const,
  burst: 1,
}

export default inngest.createFunction({
  id: "log-run-event",
  throttle: throttleConfig,
  retries: 0,
}, {
  event: EventName,
}, async ({ step, event }) => {
  const { runName, count } = event.data

  const supabase = await createClient()
  await step.run('log-run-event', async () => {
    await supabase.from('run_logs').insert({
      run_name: runName,
      ts: new Date().toISOString(),
      comment: `${count} events @ ${throttleConfig.limit}/${throttleConfig.period} w/ ${throttleConfig.burst} burst`,
    }).throwOnError()
  })
})
