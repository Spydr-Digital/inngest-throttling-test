import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import startRun from "../../../inngest/functions/startRun";
import subRun from "../../../inngest/functions/logRunEvent";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    startRun,
    subRun,
  ],
});
