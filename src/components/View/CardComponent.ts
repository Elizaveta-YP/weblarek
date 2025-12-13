import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CDN_URL, categoryMap } from "../../utils/constants";

export interface ICardData {
  id: string;
  title: string;
  price: number | null;
  category: string;
  image: string;
  description?: string;
}

export class Card extends Component<ICardData> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement | null = null;
  protected _image: HTMLImageElement | null = null;
  protected _button: HTMLButtonElement | null = null;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
    protected action: 'add' | 'remove' // Действие при клике на кнопку
  ) {
    super(container);
    
    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);
    this._category = container.querySelector(".card__category");
    this._image = container.querySelector(".card__image");
    this._button = container.querySelector(".card__button");

    // Установка обработчиков событий
    if (this._button) {
      this._button.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        this.events.emit(`${this.action}:card`, this._container.dataset.id);
      });
    }

    this._container.addEventListener('click', () => {
      this.events.emit('card:select', this._container.dataset.id);
    });
  }

  // Метод render для обновления отображения
  render(data?: Partial<ICardData>): HTMLElement {
    if (data) {
      this.setValues(data);
    }
    return this._container;
  }

  // Приватный метод для установки значений
  private setValues(data: Partial<ICardData>): void {
    if (data.title !== undefined) {
      this._title.textContent = data.title;
    }
    
    if (data.price !== undefined) {
      const priceText = data.price !== null ? `${data.price} синапсов` : "Бесценно";
      this._price.textContent = priceText;
    }
    
    if (data.category !== undefined && this._category) {
      this._category.textContent = data.category;
      const categoryClass = categoryMap[data.category as keyof typeof categoryMap] || "card__category_other";
      this._category.className = "card__category " + categoryClass;
    }
    
    if (data.image !== undefined && this._image) {
      this._image.src = `${CDN_URL}/${data.image}`;
      this._image.alt = data.title || '';
    }
    
    if (data.id !== undefined) {
      this._container.dataset.id = data.id;
    }
  }

  // Управление состоянием кнопки
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
}