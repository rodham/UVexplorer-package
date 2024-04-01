import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
    selector: '[dynValidation]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: DynSelectionDirective,
            multi: true
        }
    ],
    standalone: true
})
export class DynSelectionDirective implements Validator {
    @Input('dynValidation') dynValidation?: RegExp;

    validate(control: AbstractControl<string, string>): ValidationErrors | null {
        return this.dynValidation ? dynSelectionValidator(this.dynValidation)(control) : null;
    }
}

export function dynSelectionValidator(validation: RegExp): ValidatorFn {
    return (control: AbstractControl<string, string>): ValidationErrors | null => {
        const selectionInput = control.value;
        if (selectionInput === undefined || selectionInput === '') {
            return null;
        }
        const inputSplitNewlineComma = selectionInput.split(/[\s,\n]+/);
        for (const splitInput of inputSplitNewlineComma) {
            if (!validation.test(splitInput)) {
                return { selectionInvalid: { value: selectionInput } };
            }
        }
        return null;
    };
}
