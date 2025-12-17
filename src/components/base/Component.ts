export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }

   protected setDisabled(element: HTMLElement, state: boolean) {
    console.log('=== setDisabled called ===');
    console.log('Element:', element?.tagName, element?.className);
    console.log('State:', state);
    console.log('Current disabled attribute:', element?.getAttribute('disabled'));
    
    if (element) {
        if (state) {
            element.setAttribute('disabled', 'disabled');
            console.log('Set disabled to true');
        } else {
            element.removeAttribute('disabled');
            console.log('Removed disabled attribute');
        }
        
        console.log('New disabled attribute:', element.getAttribute('disabled'));
        console.log('Element.disabled property:', (element as HTMLButtonElement).disabled);
    } else {
        console.error('setDisabled: element is null or undefined');
    }
}

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}