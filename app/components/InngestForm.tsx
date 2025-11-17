"use client";

import { EventName } from "@/inngest/functions/startRun/type";
import { useState } from "react";

export default function InngestForm() {
  const [count, setCount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const eventData: Record<string, unknown> = {};

      if (count !== "") {
        eventData.count = Number(count);
      }

      const response = await fetch("/api/inngest/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: EventName,
          data: eventData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send event");
      }

      setMessage({
        type: "success",
        text: "Event sent successfully! Redirecting...",
      });

      setTimeout(() => {
        window.location.href = `/${result.eventId}`;
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to send event",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4">Start a new run</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Configure throttle properties in the <code>log-run-event</code> function (<code>/inngest/functions/logRunEvent/index.ts</code>), then send an event to start a new run.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="count" className="block text-sm font-medium mb-1">
            Count (optional)
          </label>
          <input
            id="count"
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Default: 100"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-foreground"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
        >
          {loading ? "Sending..." : "Send Event"}
        </button>

        {message && (
          <div
            className={`p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
