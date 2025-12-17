import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { getOrCreateElement } from "../../utils/utils";

interface IBasket {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export class Basket extends Component<IBasket> {
  protected _list!: HTMLElement;
  protected _total!: HTMLElement;
  protected _button!: HTMLButtonElement;

  constructor(protected events: IEvents, container?: HTMLElement | null) {
    super(container || Basket.createContainer());
    
    if (!this.container.parentElement) {
      document.body.appendChild(this.container);
    }
    
    this.initElements();
  }

  private static createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'basket';
    return container;
  }

   private initElements() {
    this._list = getOrCreateElement<HTMLElement>(
      '.basket__list',
      this.container,
      () => {
        const el = document.createElement('ul');
        el.className = 'basket__list';
        return el;
      }
    );

    this._total = getOrCreateElement<HTMLElement>(
      '.basket__price',
      this.container,
      () => {
        const el = document.createElement('span');
        el.className = 'basket__price';
        el.textContent = '0 синапсов';
        return el;
      }
    );

    this._button = getOrCreateElement<HTMLButtonElement>(
      '.basket__button',
      this.container,
      () => {
        const el = document.createElement('button');
        el.className = 'basket__button';
        el.textContent = 'Оформить';
        el.disabled = true;
        return el;
      }
    );
    
    this._button.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
  }

  set buttonDisabled(state: boolean) {
    this.setDisabled(this._button, state);
  }
}