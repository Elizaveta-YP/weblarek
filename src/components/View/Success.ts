import { getOrCreateElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events"; 

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(events: IEvents, container?: HTMLElement | null) {
    const actualContainer = container instanceof HTMLElement 
      ? container 
      : Success.createContainer();
    
    super(actualContainer);
    
    if (!this.container.parentElement) {
      document.body.appendChild(this.container);
    }
    
    this._description = getOrCreateElement<HTMLElement>(
      '.order-success__description',
      this.container,
      () => {
        const el = document.createElement('p');
        el.className = 'order-success__description';
        return el;
      }
    );
    
    this._closeButton = getOrCreateElement<HTMLButtonElement>(
      '.order-success__close',
      this.container,
      () => {
        const el = document.createElement('button');
        el.className = 'order-success__close';
        el.textContent = 'Закрыть';
        return el;
      }
    );
    
    this._closeButton.addEventListener('click', () => {
      events.emit('success:close');
    });
  }

  private static createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'order-success';
    return container;
  }

  set total(value: number) {
    const formattedTotal = `${value} синапсов`;
    this.setText(this._description, `Списано ${formattedTotal}`);
  }
  
  render(): HTMLElement {
    return this.container;
  }
}