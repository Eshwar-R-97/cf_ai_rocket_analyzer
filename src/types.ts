export interface Env {
  AI: any; 
  ROCKET_STATE: DurableObjectNamespace<import("./state").RocketSession>;
}

export interface TelemetryData {
  timestamp: number;
  roll_error: number;
  imu_variance: number;
  baro_alt: number;
  roll_rate: number;
  vert_vel: number;
  servo_cmd: number;
  servo_act: number;
}