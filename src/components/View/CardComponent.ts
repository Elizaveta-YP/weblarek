import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { CDN_URL, categoryMap } from "../../utils/constants";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export abstract class Card<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement | null = null;
  protected _image: HTMLImageElement | null = null;
  protected _button: HTMLButtonElement | null = null;

  constructor(
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);
    this._category = container.querySelector(".card__category");
    this._image = container.querySelector(".card__image");
    this._button = container.querySelector(".card__button");

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    const priceText = value !== null ? `${value} синапсов` : "Бесценно";
    this.setText(this._price, priceText);
  }

  set category(value: string) {
    if (this._category) {
      this.setText(this._category, value);
      const categoryClass =
        categoryMap[value as keyof typeof categoryMap] ||
        "card__category_other";
      this._category.className = "card__category " + categoryClass;
    }
  }

  set image(value: string) {
    if (this._image) {
      this._image.src = `${CDN_URL}/${value}`;
    }
  }

  set buttonText(value: string) {
    if (this._button) {
      this.setText(this._button, value);
    }
  }

  set buttonDisabled(state: boolean) {
    if (this._button) {
      this.setDisabled(this._button, state);
    }
  }
}