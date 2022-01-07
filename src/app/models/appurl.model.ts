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

    print() {
        console.log(this.url, this.parameters)
    }

    addParameter(parameter: Parameter): void {
        this.parameters.push(parameter);
        this.print();
    }

    removeParameter(parameterName: string) {
        console.log('REMOVE', this.parameters.filter(parameter => parameterName != parameter.name))
        this.parameters = this.parameters.filter(parameter => parameterName != parameter.name);
        this.print();
    }

    getFinalUrl() {
        let finalUrl = this.url;
        this.parameters.forEach(parameter => {
            finalUrl = finalUrl + this.setParameterChar(finalUrl) + (parameter.name) + ('=' + parameter.data)
        })
        console.log(finalUrl)
        this.print();
    }

    setParameterChar(url): string {
        if (url.includes('?')) {
          return '&';
        } else {
          return '?';
        };
    };
}