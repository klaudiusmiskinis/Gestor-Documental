export class Path {
    public wholePath: string;
    public simplePath: string;
    public parameters: string[];

    constructor(path: string, complex: boolean) {
        this.wholePath = path;
        this.simplePath = '';
        this.parameters = [];
        if (complex) {
            this.setupPath();
        }
    }

    
    public get wPath() : string {
        return this.wholePath;
    }

    
    public get sPath() : string {
        return this.simplePath;
    }

    public get params() : string[] {
        return this.parameters;
    }
    
    
    public set wPath(wholePath : string) {
        this.wholePath = wholePath;
    }

    
    public set sPath(simplePath : string) {
        this.simplePath = simplePath;
    }
    
    
    public set params(parameters: string[]) {
        this.parameters = parameters;
    }
    
    public addParameters(parameter: string) {
        this.parameters.push(parameter);
    }
    
    setupPath() {
        this.simplePath;
    }

}
