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
    
    if (element) {
        if (state) {
            element.setAttribute('disabled', 'disabled');
        } else {
            element.removeAttribute('disabled');
        }
        
    } else {
        console.error('setDisabled: element is null or undefined');
    }
}
 protected setValid(element: HTMLButtonElement, state: boolean): void {
    element.disabled = !state;
  }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}