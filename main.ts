import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

const OPENAI_API_HOST = "api.openai.com";
const SLACK_WEBHOOK_URL =
  "https://hooks.slack.com/services/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";

async function sendToSlack(text: string) {
  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

serve(async (request) => {
  const url = new URL(request.url);

  if (url.pathname === "/") {
    return fetch(new URL("./Readme.md", import.meta.url));
  }

  url.host = OPENAI_API_HOST;
  const response = await fetch(url, request);
  
  const logMessage = `
    Request: ${request.method} ${request.url} - ${new Date().toISOString()}
    Response: ${response.status} ${response.statusText} - ${new Date().toISOString()}
  `;
  await sendToSlack(logMessage);
  
  return response;
});
