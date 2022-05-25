export class FileInfo {
    public exists: Boolean;
    public name?: string;
    public size?: string;
    public extension?: string;

    constructor(exists, name?, size?) {
        this.exists = exists;
        if (exists) {
            this.name = name;
            this.calculateSize(size);
            this.getExtension();
        }
    }

    /**
     * Devuelve la extension
     */
    public getExtension(): void {
        if (this.name) {
            this.extension = this.name.split('.')[this.name.split('.').length - 1]
        }
    }

    /**
     * Comprueba el tamaño
     * @param size number
     */
    public calculateSize(size: number): void {
        let counterLoop = 0;
        do {
            size /= 1024;
            size.toFixed(2);
            counterLoop++;
        } while (size > 1024);
        this.size = size.toFixed(2) + this.getUnitOfInformation(counterLoop);
    }

    /**
     * Devuleve el tamaño
     * @param counter number
     * @returns string
     */
    public getUnitOfInformation(counter: number): string {
        switch (counter) {
            case 0:
                return ' B';
            case 1:
                return ' KB';
            case 2:
                return ' MB';
            case 3:
                return ' GB';
            case 4:
                return ' TB';
            default:
                return ' KB'
        }
    }
}