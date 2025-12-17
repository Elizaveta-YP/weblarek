import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketItem {
  index: number;
  title: string;
  price: number | null;
  productId: string;
}

export class BasketItem extends Component<IBasketItem> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
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
      const productId = this.container.dataset.productId;
      if (productId) {
        this.events.emit("basket:remove", { productId });
      }
    });
  }

  set index(value: number) {
    this.setText(this._index, String(value));
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    const priceText = value !== null ? `${value} синапсов` : "Бесценно";
    this.setText(this._price, priceText);
  }

  render(data?: Partial<IBasketItem>): HTMLElement {
    const element = super.render(data);
    if (data?.productId) {
      element.dataset.productId = data.productId;
    }
    return element;
  }
}