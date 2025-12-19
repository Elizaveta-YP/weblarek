import { Component } from "../base/Component";
import { ensureElement, ensureAllElements } from "../../utils/utils";
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
    
    const categoryElements = ensureAllElements<HTMLElement>(".card__category", container);
    this._category = categoryElements[0] || null;
    
    const imageElements = ensureAllElements<HTMLImageElement>(".card__image", container);
    this._image = imageElements[0] || null;
    
    const buttonElements = ensureAllElements<HTMLButtonElement>(".card__button", container);
    this._button = buttonElements[0] || null;

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