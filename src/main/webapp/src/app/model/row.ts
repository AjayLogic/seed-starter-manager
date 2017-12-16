import { SeedVariety } from './seed-variety';

export interface Row {
  id: number;
  seedVariety: SeedVariety;
  seedsPerCell: number;
}
