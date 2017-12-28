import { NamedEntity } from './named-entity';
import { SeedStarterFeature } from './seed-starter-feature';

export interface SeedVariety extends NamedEntity, SeedStarterFeature {
  imageName?: File;
}
