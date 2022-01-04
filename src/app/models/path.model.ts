/* class PATH */
export class Path {
    /* ATTRIBUTES */
    private path: string;

    /* CONSTRUCTOR */
    constructor(path) {
        this.path = path;
    }
    
    /* GETTERs */
    public get _path() : string {
        return this.path
    }

    /* SETTERs */
    public set _path(path : string) {
        this.path = path;
    }
}