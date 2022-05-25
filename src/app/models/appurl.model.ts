export interface Parameter {
    name: string;
    data: string;
}

export class AppUrl {
    public url: string | any;
    public parameters: Parameter[];

    constructor(url, parameters?) {
        this.url = url;
        this.parameters = parameters;
    }

    /**
     * Devuelve la ruta URL a la que se quiere consumir
     * @param path string
     * @returns string
     */
    toPath(path: string): string {
        if (!path.includes('/')) path = '/' + path
        return this.url + path
    }

    /**
     * Añade un parametro para luego gettear la URL final
     * @param parameter Parameter
     */
    addParameter(parameter: Parameter): void {
        this.parameters.push(parameter);
    }

    /**
     * Elimina un parametro por nombre fuera de la URL final
     * @param parameterName 
     */
    removeParameter(parameterName: string) {
        this.parameters = this.parameters.filter(parameter => parameterName != parameter.name);
    }

    /**
     * Devuelve el parametro de la URL con todos los atributos en cuenta
     */
    getFinalUrl() {
        let finalUrl = this.url;
        this.parameters.forEach(parameter => {
            finalUrl = finalUrl + this.setParameterChar(finalUrl) + (parameter.name) + ('=' + parameter.data)
        });
    }

    /**
     * Comprueba si la URL incluye ? o & y devuelve uno u otro
     * @param url 
     * @returns 
     */
    setParameterChar(url): string {
        if (url.includes('?')) {
            return '&';
        } else {
            return '?';
        };
    };
}