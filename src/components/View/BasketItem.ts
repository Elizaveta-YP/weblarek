import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketItem {
  index: number;
  title: string;
  price: number | null;
}

export class BasketItem extends Component<IBasketItem> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);
    this._deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );

    this._deleteButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      events.emit("basket:remove", this);
    });
  }

  set index(value: number) {
    this._index.textContent = String(value); 
  }

  set title(value: string) {
    this._title.textContent = value; 
  }

  set price(value: number | null) {
    const priceText = value !== null ? `${value} синапсов` : "Бесценно";
    this._price.textContent = priceText; 
  }
}