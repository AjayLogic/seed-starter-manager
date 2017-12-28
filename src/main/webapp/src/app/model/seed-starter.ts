import { Entity } from './entity';
import { MaterialType } from './material-type';
import { Feature } from './feature';
import { Row } from './row';

export interface SeedStarter extends Entity {
  materialType: MaterialType;
  datePlanted: string;
  covered: boolean;
  features: Feature[];
  rows: Row[];
}
