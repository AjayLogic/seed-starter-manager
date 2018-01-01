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

  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const controlText = control.value;
      const isValid: boolean = controlText && controlText.trim().length > minLength && control.valid;
      return isValid ? null : { minLength: true };
    };
  }

}
