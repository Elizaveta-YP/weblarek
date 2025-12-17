import { getOrCreateElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    
    this._closeButton = getOrCreateElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
      () => {
        const button = document.createElement('button');
        button.className = 'modal__close';
        button.innerHTML = '&times;'; 
        return button;
      }
    );
    
    this._content = getOrCreateElement<HTMLElement>(
      ".modal__content",
      this.container,
      () => {
        const content = document.createElement('div');
        content.className = 'modal__content';
        return content;
      }
    );

    this._closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });

    events.on("modal:force-close", () => {
      if (this.isOpen) {
        this.container.classList.remove("modal_active");
        // this._content.innerHTML = "";//причина неактивной кнопки, нужно запомнить!!!!!!!!!!!!!//
        this.events.emit('modal:close');
      }
    });
  }

  get isOpen(): boolean {
    return this.container.classList.contains("modal_active");
  }

  set content(value: HTMLElement) {
    this._content.innerHTML = '';
    this._content.appendChild(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:close");
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    return this.container;
  }
}