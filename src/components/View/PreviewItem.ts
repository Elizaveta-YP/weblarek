import { ProductCard } from "./ProductCard";
import { IEvents } from "../base/Events";

export class PreviewItem extends ProductCard {
    protected _button: HTMLButtonElement | null = null;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);
        this._button = container.querySelector(".card__button");
        
        if (this._button) {
            this._button.addEventListener("click", (event: Event) => {
                event.preventDefault();
                const productId = container.dataset.productId;
                if (productId) {
                    events.emit("product:toggle-basket", { productId });
                }
            });
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value; 
        }
    }

    set buttonDisabled(state: boolean) {
        if (this._button) {
            if (state) {
                this._button.setAttribute('disabled', 'true');
            } else {
                this._button.removeAttribute('disabled');
            }
        }
    }
}