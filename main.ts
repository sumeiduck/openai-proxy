import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

const OPENAI_API_HOST = "api.openai.com";

serve(async (request) => {
  const url = new URL(request.url);

  if (url.pathname === "/") {
    return fetch(new URL("./Readme.md", import.meta.url));
  }

  url.host = OPENAI_API_HOST;
  const response = await fetch(url, request);

  const ip = request.headers.get("X-Forwarded-For") || request.conn.remoteAddr.hostname;
  const headers = JSON.stringify(Object.fromEntries(request.headers.entries()));
  const params = url.search;
  const logMessage = `
    Request:
      Method: ${request.method}
      URL: ${request.url}
      Timestamp: ${new Date().toISOString()}
      IP: ${ip}
      Headers: ${headers}
      Params: ${params}
    Response:
      Status: ${response.status}
      Status Text: ${response.statusText}
      Timestamp: ${new Date().toISOString()}
  `;
  console.log(logMessage);
  
  return response;
});
