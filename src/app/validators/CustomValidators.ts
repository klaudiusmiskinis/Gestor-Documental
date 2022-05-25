import { AbstractControl } from "@angular/forms";

export class CustomValidator {
    /**
     * Comprueba si es numerico
     * @param control AbstractControl
     * @returns object | null
     */
    static numeric(control: AbstractControl) {
        let val = control.value;
        if (val === null || val === '') return null;
        if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) return { 'invalidNumber': true };
        return null;
    }

    /**
     * Comprueba si la fecha es válida, ni futura ni antigua a 1900
     * @param control AbstractControl
     * @returns object | null
     */
    static dateValidator(control: AbstractControl) {
        let today: string | Date = new Date();
        today = today.toISOString().slice(0, -14);
        if (control.value < '1900-1-1') {
            return { preOld: true };
        } else if (control.value > today) {
            return { postToday: true };
        }
        return null;
    }

    /**
     * Comprueba si el nombre incluye extension
     * @param control AbstractControl
     * @returns object | null
     */
    static hasExtension(control: AbstractControl) {
        const value = control.value;
        if (value.includes('.')) {
            return { 'hasExtension': true }
        }
        return null;
    }

     /**
     * Comprueba si el ultimo valor del campo termina en /
     * @param control AbstractControl
     * @returns object | null
     */
    static lastSlash(control: AbstractControl) {
        const value = control.value;
        if (value.slice(-1) !== '/') {
            return { 'lastSlash': true }
        }
        return null;
    }
}