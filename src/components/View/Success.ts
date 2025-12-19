import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events"; 

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container);
    
    this._description = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );
    
    this._closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );
    
    this._closeButton.addEventListener('click', () => {
      events.emit('success:close');
    });
  }

  set total(value: number) {
    const formattedTotal = `${value} синапсов`;
    this.setText(this._description, `Списано ${formattedTotal}`);
  }
  
  render(): HTMLElement {
    return this.container;
  }
}