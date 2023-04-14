import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

const OPENAI_API_HOST = "api.openai.com";

async function getLocalIP(): Promise<string> {
  try {
    const response = await fetch("https://ipinfo.io/ip");
    const ip = await response.text();
    return ip.trim();
  } catch (error) {
    return "Unknown IP";
  }
}

serve(async (request) => {
  const url = new URL(request.url);

  if (url.pathname === "/") {
    return fetch(new URL("./Readme.md", import.meta.url));
  }

  url.host = OPENAI_API_HOST;
  const response = await fetch(url, request);

  const ip = request.headers.get("X-Forwarded-For") || request.headers.get("X-Real-IP") || "Unknown IP";
  const localIp = await getLocalIP();
  const headers = JSON.stringify(Object.fromEntries(request.headers.entries()));
  const params = url.search;
  const logMessage = `
    Request -------------------------------------------
      Method: ${request.method}
      URL: ${request.url}
      Timestamp: ${new Date().toISOString()}
      Client IP: ${ip}
      Local IP: ${localIp}
      Headers: ${headers}
      Params: ${params}
    Response -------------------------------------------
      Status: ${response.status}
      Status Text: ${response.statusText}
      Timestamp: ${new Date().toISOString()}
  `;
  console.log(logMessage);
  
  return response;
});
