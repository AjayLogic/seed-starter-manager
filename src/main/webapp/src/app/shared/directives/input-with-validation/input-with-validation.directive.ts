import { AfterViewChecked, AfterViewInit, Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appInputWithValidation]'
})
export class InputWithValidationDirective implements OnInit, AfterViewInit, AfterViewChecked {

  @Input() control: AbstractControl;
  @Input() errorMessages: { [error: string]: string };

  private inputLabel: Element;

  constructor(private inputElement: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    if (!this.control) throw new Error(`Attribute 'control' is required!`);
    if (!this.errorMessages) throw new Error(`Attribute 'errorMessages' is required!`);
  }

  ngAfterViewInit(): void {
    this.inputLabel = this.findLabelForInput(this.inputElement);
  }

  ngAfterViewChecked(): void {
    this.updateInputClass();
    this.updateErrorLabel();
  }

  private updateInputClass(): void {
    const inputClass = this.control.valid ? 'valid' :
      this.control.invalid && (this.control.touched || this.control.dirty) ? 'invalid' : '';

    if (inputClass == 'valid') {
      this.changeClass('invalid', 'valid', this.inputElement);
    } else if (inputClass == 'invalid') {
      this.changeClass('valid', 'invalid', this.inputElement);
    }
  }

  private updateErrorLabel(): void {
    let errorMessage = '';
    const inputErrors = this.control.errors;

    if (inputErrors) {
      // Search the error message based on the current error of the input
      Object.keys(inputErrors).find((error: string) => {
        if (this.errorMessages[error]) {
          errorMessage = this.errorMessages[error];
          return true;
        }
      });
    }

    if (this.inputElement.nativeElement.classList.contains('invalid')) {
      this.renderer.setAttribute(this.inputLabel, 'data-error', errorMessage);
    } else {
      this.renderer.removeAttribute(this.inputLabel, 'data-error');
    }
  }

  private findLabelForInput(inputElement: ElementRef): Element {
    const elementId = inputElement.nativeElement.id;
    const label = inputElement.nativeElement.parentElement.querySelector(`label[for="${elementId}"]`);

    if (!label) {
      throw new Error(`The element with id '${elementId}' must have a ` +
        `correspondent label with the attribute 'for' specified!`);
    }

    return label;
  }

  private changeClass(from: string, to: string, element: ElementRef): void {
    this.renderer.removeClass(element.nativeElement, from);
    this.renderer.addClass(element.nativeElement, to);
  }

}
