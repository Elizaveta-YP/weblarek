import { getOrCreateElement } from "../../utils/utils";
import { Component } from "../base/Component";

export abstract class Form<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _errors: HTMLElement;
  protected _submitButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this._form = container as HTMLFormElement;
    
    this._errors = getOrCreateElement<HTMLElement>(
      ".form__errors",
      container,
      () => {
        const el = document.createElement('div');
        el.className = 'form__errors';
        return el;
      }
    );
    
    this._submitButton = getOrCreateElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
      () => {
  
        const el = document.createElement('button');
        el.type = 'submit';
        el.className = 'form__submit';
        el.textContent = 'Отправить';
        el.disabled = true; 
        return el;
      }
    );
  }

  set errors(value: string[]) {
    console.log('Form errors set to:', value);
    const errorText = value.length > 0 ? value.join(", ") : "";
    this.setText(this._errors, errorText);
  }

set valid(value: boolean) {
    console.log('Form class:', this.constructor.name);
    console.log('Value:', value);
    console.log('Submit button:', this._submitButton);
    this.setDisabled(this._submitButton, !value);
    
    console.log('After setDisabled - disabled:', this._submitButton?.disabled);
}

  render(): HTMLElement {
    return this.container;
  }
}
