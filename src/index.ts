import { Env } from "./types";

// This line is CRITICAL. Cloudflare needs the Durable Object exported from the main entry point.
export { RocketSession } from "./state"; 

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Cloudflare automatically serves the frontend from the 'public' folder.
    // We only need to intercept backend requests that start with /api/
    if (!url.pathname.startsWith("/api/")) {
       return new Response("Not found", { status: 404 });
    }

    // Connect to the specific flight's Durable Object memory bank
    const id = env.ROCKET_STATE.idFromName("flight-001");
    const stub = env.ROCKET_STATE.get(id);

    // Route 1: Ingesting Rocket Telemetry Data
    if (request.method === "POST" && url.pathname === "/api/ingest") {
      const data = await request.json();
      const result = await stub.ingestData(data as any); 
      return Response.json(result);
    }
    
    // Route 2: Asking Llama 3.3 a question about the data
    if (request.method === "POST" && url.pathname === "/api/analyze") {
      const { query } = (await request.json()) as any;
      const answer = await stub.analyzeData(query); 
      return Response.json({ answer });
    }
    
    // Route 3: Fetching the chat history
    if (request.method === "GET" && url.pathname === "/api/history") {
       const history = await stub.getHistory(); 
       return Response.json({ history });
    }

    return new Response("API route not found", { status: 404 });
  }
} satisfies ExportedHandler<Env>;