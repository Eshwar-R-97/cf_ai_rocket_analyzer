import { DurableObject } from "cloudflare:workers";
import { Env, TelemetryData } from "./types";

export class RocketSession extends DurableObject<Env> {
  
  async ingestData(data: TelemetryData[]) {
    await this.ctx.storage.put("telemetry", data);
    return { status: "Ingested", count: data.length };
  }

  async analyzeData(query: string) {
    const data = await this.ctx.storage.get<TelemetryData[]>("telemetry") || [];
    const contextStr = JSON.stringify(data); 
    
    const response = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        { 
          role: "system", 
          content: `You are a Lead GNC Engineer. Analyze the rocket telemetry provided.
          
          STRICT FORMATTING RULES:
          1. NEVER output raw telemetry JSON in your prose.
          2. Use Markdown for your analysis (bolding, bullet points).
          3. ROUND all numbers to 2 decimal places.
          
          ANOMALY DETECTION & LABELING:
          Scan the data for exactly 5 critical 'Points of Interest' (POIs).
          Look for:
          - 'STEP START': The exact moment a roll command changes.
          - 'SATURATION': When servo_act hits the 40-degree physical limit.
          - 'OVERSHOOT': The peak roll angle before settling.
          - 'AERO TORQUE': Deviations from command caused by fin-tab interference.
          - 'SETTLED': When actual_roll stays within 5% of cmd_roll.

          You MUST append a JSON block at the very end of your response inside <POI></POI> tags containing exactly 5 objects.
          
          Example POI Format:
          <POI>[
            {"t": 1.5, "label": "STEP START", "desc": "Commanded roll shifted to 90 degrees."},
            {"t": 1.65, "label": "SATURATION", "desc": "Servo reached 40deg limit; controller at maximum effort."},
            {"t": 2.1, "label": "OVERSHOOT", "desc": "Roll peaked at 94.2 degrees before PD damping took effect."},
            {"t": 3.0, "label": "STEP END", "desc": "Commanded roll returned to 0 degrees."},
            {"t": 4.5, "label": "SETTLED", "desc": "System reached steady state at 0.05 degrees error."}
          ]</POI>` 
        },
        { 
          role: "user", 
          content: `Context: ${contextStr}\n\nQuestion: ${query}` 
        }
      ]
    });
    
    const answer = (response as any).response;

    const history = await this.ctx.storage.get<string[]>("history") || [];
    history.push(`Q: ${query} \nA: ${answer}`);
    await this.ctx.storage.put("history", history);

    return answer;
  }
  
  async getHistory() {
     return await this.ctx.storage.get<string[]>("history") || [];
  }
}