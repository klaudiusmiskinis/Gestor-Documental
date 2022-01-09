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

    addParameter(parameter: Parameter): void {
        this.parameters.push(parameter);
    }

    removeParameter(parameterName: string) {
        this.parameters = this.parameters.filter(parameter => parameterName != parameter.name);
    }

    getFinalUrl() {
        let finalUrl = this.url;
        this.parameters.forEach(parameter => {
            finalUrl = finalUrl + this.setParameterChar(finalUrl) + (parameter.name) + ('=' + parameter.data)
        })
    }

    setParameterChar(url): string {
        if (url.includes('?')) {
          return '&';
        } else {
          return '?';
        };
    };
}