import { Entity } from './entity';
import { SeedVariety } from './seed-variety';

export interface Row extends Entity {
  seedVariety: SeedVariety;
  seedsPerCell: number;
}
