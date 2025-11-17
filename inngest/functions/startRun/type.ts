export const EventName = 'run/run-event' as const
type EventData = {
  runName: string
  count?: number
}
export type StartRunFunction = { [EventName]: { data: EventData } }
