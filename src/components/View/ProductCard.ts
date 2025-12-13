import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CDN_URL, categoryMap } from "../../utils/constants";

interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export class ProductCard<T> extends Component<T> {
  protected _category: HTMLElement | null = null;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement | null = null;
  protected _button: HTMLButtonElement | null = null;
  protected _price: HTMLElement;
  protected _data: T | null = null;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._category = container.querySelector(".card__category");
    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._image = container.querySelector(".card__image");
    this._button = container.querySelector(".card__button");
    this._price = ensureElement<HTMLElement>(".card__price", container);

    if (this._button && actions?.onClick) {
      this._button.addEventListener("click", (event) => {
        event.preventDefault();
        actions.onClick!(event);
      });
    }

    if (actions?.onClick && !this._button) {
      const clickHandler = (event: MouseEvent) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        if (!target.closest(".card__button")) {
          actions.onClick!(event);
        }
      };

      if (this._image) {
        this._image.addEventListener("click", clickHandler);
      } else {
        container.addEventListener("click", clickHandler);
      }
    }
  }

  get data(): T | null {
    return this._data;
  }

  set data(value: T | null) {
    this._data = value;
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value; 
      this._category.className = "card__category";

      const categoryClass = categoryMap[value as keyof typeof categoryMap];
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }

  set title(value: string) {
    this._title.textContent = value; 
  }

  set image(value: string) {
    if (this._image && value) {
      const fullImageUrl = value.startsWith("http")
        ? value
        : `${CDN_URL}/${value}`;
      this._image.src = fullImageUrl;
      this._image.alt = this._title.textContent || value;

      this._image.onerror = () => {
        this._image!.src = "src/images/placeholder.jpg";
      };
    }
  }

  set price(value: number | null) {
    const priceText = value !== null ? `${value} синапсов` : "Бесценно";
    this._price.textContent = priceText; 
  }

  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  set buttonDisabled(state: boolean) {
    if (this._button) {
      this._button.disabled = state;
    }
  }

  render(data?: Partial<T>): HTMLElement {
    if (data) {
      this._data = data as T;
    }
    return super.render(data);
  }
}