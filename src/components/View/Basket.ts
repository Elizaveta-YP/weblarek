import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    
    this._list = this.container.querySelector('.basket__list') as HTMLElement;
    this._total = this.container.querySelector('.basket__price') as HTMLElement;
    this._button = this.container.querySelector('.basket__button') as HTMLButtonElement;
    
    if (!this._list || !this._total || !this._button) {
      throw new Error('Не все необходимые элементы найдены в шаблоне корзины');
    }

    this.items = [];
    this.total = 0;
    this.buttonDisabled = true;
    
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