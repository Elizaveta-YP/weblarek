import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { CDN_URL, categoryMap } from "../../utils/constants";

interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

interface IProductCardData {
  category?: string;
  title?: string;
  image?: string;
  price?: number | null;
  productId?: string;
}

export class ProductCard extends Component<IProductCardData> {
  protected _category: HTMLElement | null = null;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement | null = null;
  protected _price: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._category = container.querySelector(".card__category");
    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._image = container.querySelector(".card__image");
    this._price = ensureElement<HTMLElement>(".card__price", container);

    if (actions?.onClick) {
      const clickHandler = (event: MouseEvent) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        
        if (!target.closest(".card__button")) {
          actions.onClick!(event);
        }
      };
      
      container.addEventListener("click", clickHandler);
    }
  }

  set category(value: string) {
    if (this._category) {
      this.setText(this._category, value);

      this._category.className = "card__category";

      const categoryClass = categoryMap[value as keyof typeof categoryMap];
      if (categoryClass) {
        this._category.classList.add(categoryClass);
      }
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(value: string) {
  if (this._image && value) {
    this._image.src = value.startsWith("http") ? value : `${CDN_URL}/${value}`;
    this._image.alt = this._title.textContent || value;
    }
  }

  set price(value: number | null) {
    const priceText = value !== null ? `${value} синапсов` : "Бесценно";
    this.setText(this._price, priceText);
  }

  render(data?: Partial<IProductCardData>): HTMLElement {
    const element = super.render(data);
    if (data?.productId) {
      element.dataset.productId = data.productId;
    }
    return element;
  }
}