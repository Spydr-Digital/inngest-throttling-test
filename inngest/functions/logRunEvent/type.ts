
export const EventName = 'run/log-run-event' as const
type EventData = {
  runName: string
  count: number
}
export type LogRunEventFunction = { [EventName]: { data: EventData } }
