import { AbstractControl, ValidatorFn } from '@angular/forms';

import { NamedEntity } from '../model/named-entity';

export class CustomValidators {

  static uniqueName(entities: NamedEntity[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      // Checks if some entity has the property 'name' equals to the text in the control.
      const isDuplicated: boolean = entities.some((entity: NamedEntity) => {
        return control.dirty && control.value === entity.name;
      });

      return isDuplicated ? { conflict: true } : null;
    };
  }

}
