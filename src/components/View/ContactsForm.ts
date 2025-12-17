import { getOrCreateElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./FormComponent";

interface IContactsForm {
  email: string;
  phone: string;
  valid: boolean;
  errors: string[];
}

export class ContactsForm extends Form<IContactsForm> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
     this._form.setAttribute('novalidate', 'novalidate');

    this._emailInput = getOrCreateElement<HTMLInputElement>(
      'input[name="email"]',
      container,
      () => {
        const input = document.createElement('input');
        input.name = 'email';
        input.type = 'email';
        input.placeholder = 'Email';
        input.className = 'input';
        return input;
      }
    );

    this._phoneInput = getOrCreateElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
      () => {
        const input = document.createElement('input');
        input.name = 'phone';
        input.type = 'tel';
        input.placeholder = 'Телефон';
        input.className = 'input';
        return input;
      }
    );

    this._emailInput.addEventListener("input", () => {
      events.emit("contacts.email:change", {
        email: this._emailInput.value,
      });
    });

    this._phoneInput.addEventListener("input", () => {
      events.emit("contacts.phone:change", {
        phone: this._phoneInput.value,
      });
    });

     this._form.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      console.log('ContactsForm: submit event fired');
      events.emit("contacts:submit");
    });
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }
}