import { ProductCard } from "./ProductCard";
import { IEvents } from "../base/Events";

export class CatalogItem extends ProductCard {
  constructor(events: IEvents, container: HTMLElement) {
    super(events, container, {
      onClick: (event: MouseEvent) => {
        event.preventDefault();
        const productId = container.dataset.productId;
        if (productId) {
          events.emit("product:select", { productId });
        }
      },
    });
  }
}