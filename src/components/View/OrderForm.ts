import { getOrCreateElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./FormComponent";

interface IOrderForm {
  payment: string;
  address: string;
  valid: boolean;
  errors: string[];
}

export class OrderForm extends Form<IOrderForm> {
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;
  protected _addressInput: HTMLInputElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    let buttonsContainer = container.querySelector('.order__buttons');
    if (!buttonsContainer) {
      buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'order__buttons';
      container.appendChild(buttonsContainer);
    }

    const buttons = buttonsContainer.querySelectorAll('.button');
    if (buttons.length === 0) {
      // Кнопка для оплаты картой
      const cardButton = document.createElement('button');
      cardButton.className = 'button button_alt';
      cardButton.name = 'card';
      cardButton.textContent = 'Картой';
      cardButton.type = 'button';
      buttonsContainer.appendChild(cardButton);

      // Кнопка для оплаты наличными
      const cashButton = document.createElement('button');
      cashButton.className = 'button button_alt';
      cashButton.name = 'cash';
      cashButton.textContent = 'Наличными';
      cashButton.type = 'button';
      buttonsContainer.appendChild(cashButton);
    }

    this._paymentButtons = buttonsContainer.querySelectorAll('.button');

    this._addressInput = getOrCreateElement<HTMLInputElement>(
      'input[name="address"]',
      container,
      () => {
        const input = document.createElement('input');
        input.name = 'address';
        input.type = 'text';
        input.placeholder = 'Адрес доставки';
        input.className = 'input';
        return input;
      }
    );

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
  render(): HTMLElement {
    console.log('OrderForm.render() called');
    console.log('Container:', this.container);
    console.log('Container is HTMLElement:', this.container instanceof HTMLElement);
    return this.container;
}
}
