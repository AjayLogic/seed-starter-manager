import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appInputErrorLabel]'
})
export class InputErrorLabelDirective implements OnInit, OnChanges {

  @Input() labelText: string;

  // Note: by using the 'ValidationErrors' from @angular/forms as type, results on a warning message
  // being displayed on the console.
  @Input() inputErrors: any;

  // Use the format { 'error': 'message' }, where 'error' is the return of any validation on
  // the 'Validators' from @angular/forms. e.g: { 'required' : 'This field is required!',... }
  @Input() errorMessages: any;

  private label: any;
  private currentErrorMessage: string;

  constructor(private elementRef: ElementRef) {
    this.label = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.label.innerHTML = this.labelText;

    // Prevents the error message from being broken on the space character and displayed in multiple lines
    this.label.style.width = '100%';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentErrorMessage = '';

    // Search and sets the error message based on the current error of the input field
    if (this.inputErrors) {
      Object.keys(this.inputErrors).find((error: string) => {
        if (this.errorMessages[error]) {
          this.currentErrorMessage = this.errorMessages[error];
          return true;
        }
      });
    }

    this.label.setAttribute('data-error', this.currentErrorMessage);
  }

}
