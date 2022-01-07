export interface Parameter {
    name: string;
    data: string;
}

export class AppUrl {

    public url: string;
    public parameters: Parameter[];

    constructor(url, parameters?) {
        this.url = url;
        this.parameters = parameters;
    }

    getFinalUrl() {
        return this.url
    }
}