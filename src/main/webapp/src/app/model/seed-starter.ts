import { MaterialType } from './material-type';
import { Feature } from './feature';
import { Row } from './row';

export interface SeedStarter {
  id: number;
  materialType: MaterialType;
  datePlanted: Date;
  isCovered: boolean;
  features: Feature[];
  rows: Row[];
}
