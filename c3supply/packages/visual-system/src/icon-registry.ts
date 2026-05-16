import type { BoilerIconDescriptor, BoilerIconName } from "./types";

export const boilerIconRegistry: Record<BoilerIconName, BoilerIconDescriptor> = {
  gauge: {
    name: "gauge",
    label: "Pressure gauge",
    description: "A round mechanical pressure gauge."
  },
  valve: {
    name: "valve",
    label: "Valve",
    description: "A hand valve for flow control."
  },
  pipe: {
    name: "pipe",
    label: "Pipe",
    description: "Industrial pipework and fittings."
  },
  cartridge: {
    name: "cartridge",
    label: "Filter cartridge",
    description: "A replacement cartridge element."
  },
  softener: {
    name: "softener",
    label: "Softener vessel",
    description: "A resin tank / softener vessel visual."
  },
  ro: {
    name: "ro",
    label: "RO membrane",
    description: "Reverse osmosis membrane and flow path."
  },
  iron: {
    name: "iron",
    label: "Iron removal",
    description: "Iron and staining treatment indicator."
  },
  chloramine: {
    name: "chloramine",
    label: "Chloramine treatment",
    description: "Catalytic carbon / chloramine treatment icon."
  },
  service: {
    name: "service",
    label: "Service wrench",
    description: "Field service and technician workflow."
  },
  quote: {
    name: "quote",
    label: "Quote document",
    description: "Quote-first document review workflow."
  }
};

export function boilerIconLabel(name: BoilerIconName): string {
  return boilerIconRegistry[name].label;
}
