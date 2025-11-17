import { EventSchemas, Inngest } from "inngest";
import { StartRunFunction } from "./functions/startRun/type";
import { LogRunEventFunction } from "./functions/logRunEvent/type";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "test-app",
  schemas: new EventSchemas().fromRecord<StartRunFunction & LogRunEventFunction>()
 });
