export interface Player {
  id: number;
  name: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  team: string;
  price: number;
  points: number;
}
