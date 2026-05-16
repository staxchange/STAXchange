export const dwgBoilerRoomTheme = {
  id: "dwg-boiler-room",
  name: "Steampunk Boiler Room",
  mood: "industrial, mechanical, warm, brass, copper, riveted, pressure-gauge inspired",
  colors: {
    soot: "#080604",
    coal: "#120f0b",
    iron: "#1f211f",
    boiler: "#2b2118",
    agedCopper: "#9b5f2b",
    hotCopper: "#d1843f",
    brass: "#c9a66b",
    oldGold: "#8f7240",
    steam: "#e7dcc8",
    gaugeGlass: "#c7d7ce",
    valveRed: "#a33d2d",
    patina: "#3d6f63"
  },
  texture: {
    rivets: true,
    pipeBorders: true,
    gaugeCards: true,
    smokeGradients: true
  }
} as const;

export type DwgBoilerRoomTheme = typeof dwgBoilerRoomTheme;
