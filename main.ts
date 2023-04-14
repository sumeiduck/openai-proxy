import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

const OPENAI_API_HOST = "api.openai.com";

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
  console.log(logMessage);
  
  return response;
});
