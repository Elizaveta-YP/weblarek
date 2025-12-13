import { Component } from '../base/Component';

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected catalogElement: HTMLElement;
    private _catalog: HTMLElement[] = []; 
    
    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = this.container;
    }

    get catalog(): HTMLElement[] {
        return this._catalog;
    }

    set catalog(items: HTMLElement[]) {
        this._catalog = items;
        this.catalogElement.replaceChildren(...items);
    }
}
