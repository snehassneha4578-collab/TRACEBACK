export type OperatingRegion = "cutoff" | "forward-active" | "saturation";

export type BiasPreset = {
  id: string;
  name: string;
  baseVoltage: number;
  collectorCurrent: number;
  collectorVoltage: number;
  emitterVoltage: number;
  collectorEmitterVoltage: number;
  region: OperatingRegion;
  gainMagnitude: number | null;
};

export const biasPresets: BiasPreset[] = [
  { id: "cutoff", name: "Cutoff", baseVoltage: 0.6, collectorCurrent: 0, collectorVoltage: 10, emitterVoltage: 0, collectorEmitterVoltage: 10, region: "cutoff", gainMagnitude: null },
  { id: "gain-drop", name: "Gain-drop state", baseVoltage: 1.17, collectorCurrent: 0.47, collectorVoltage: 9.53, emitterVoltage: 0.47, collectorEmitterVoltage: 9.06, region: "forward-active", gainMagnitude: 18.1 },
  { id: "retest", name: "Re-test state", baseVoltage: 1.5, collectorCurrent: 0.8, collectorVoltage: 9.2, emitterVoltage: 0.8, collectorEmitterVoltage: 8.4, region: "forward-active", gainMagnitude: 30.8 },
  { id: "reference", name: "Original reference", baseVoltage: 2, collectorCurrent: 1.3, collectorVoltage: 8.7, emitterVoltage: 1.3, collectorEmitterVoltage: 7.4, region: "forward-active", gainMagnitude: 50 },
  { id: "saturation", name: "Saturation", baseVoltage: 5.7, collectorCurrent: 4.8, collectorVoltage: 5.2, emitterVoltage: 4.8, collectorEmitterVoltage: 0.4, region: "saturation", gainMagnitude: null },
];

export const ORIGINAL_PRESET = biasPresets.find((preset) => preset.id === "reference")!;

export function getBiasPreset(id: string): BiasPreset {
  return biasPresets.find((preset) => preset.id === id) ?? ORIGINAL_PRESET;
}
