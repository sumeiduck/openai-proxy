import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

const OPENAI_API_HOST = "api.openai.com";
const SLACK_WEBHOOK_URL =
  "https://hooks.slack.com/services/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";

async function postDataToString(request: Request): Promise<string> {
  if (request.method !== "POST" || !request.body) {
    return "";
  }
  const jsonData = await request.json();
  return JSON.stringify(jsonData);
}

async function sendToSlack(text: string) {
  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

serve(async (request) => {
  const requestData = await postDataToString(request);

  const url = new URL(request.url);

  if (url.pathname === "/") {
    return fetch(new URL("./Readme.md", import.meta.url));
  }

  url.host = OPENAI_API_HOST;
  return await fetch(url, request);
});
