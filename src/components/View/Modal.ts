import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _contentElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this._closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
    this._contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );

    this._closeButton.addEventListener("click", () => this.close());
    
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  get isOpen(): boolean {
    return this.container.classList.contains("modal_active");
  }

  set content(value: HTMLElement) {
    this._contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this._contentElement.replaceChildren();
    this.events.emit("modal:close");
  }
}