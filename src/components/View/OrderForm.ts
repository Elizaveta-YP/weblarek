import { ensureElement, ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./FormComponent";

interface IOrderForm {
  payment: string;
  address: string;
  valid: boolean;
  errors: string[];
}

export class OrderForm extends Form<IOrderForm> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;
  protected _errorElement: HTMLElement | null; 

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    const paymentButtons = ensureAllElements<HTMLButtonElement>(
      '.order__buttons .button_alt',
      container
    );
    
    this._paymentButtons = Array.from(paymentButtons);
    
    this._addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );
    
    this._errorElement = container.querySelector('.order__errors');

    if (this._paymentButtons.length === 0) {
      throw new Error('Кнопки оплаты не найдены в шаблоне OrderForm');
    }

    this._paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        events.emit("order.payment:change", { payment: button.name });
      });
    });

    this._addressInput.addEventListener("input", () => {
      events.emit("order.address:change", {
        address: this._addressInput.value,
      });
    });

    this._form.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      events.emit("order:submit");
    });
  }

  set payment(value: string) {
    this._paymentButtons.forEach((button) => {
      if (button.name === value) {
        button.classList.add("button_alt-active");
      } else {
        button.classList.remove("button_alt-active");
      }
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  set valid(state: boolean) {
    this.setDisabled(this._submitButton, !state);
  }

  set errors(errors: string[]) {
    if (this._errorElement) {
      this.setText(this._errorElement, errors.join(', ') || '');
    }
    this.setValid(this._submitButton, errors.length === 0);
  }

  setErrors(errors: Record<string, string>) {
    const errorMessages = Object.values(errors);
    this.errors = errorMessages;
  }

  render(): HTMLElement {
    console.log('OrderForm.render() called');
    return this.container;
  }
}
