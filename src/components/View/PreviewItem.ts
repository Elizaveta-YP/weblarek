import { ProductCard } from "./ProductCard";
import { IEvents } from "../base/Events";
import { ProductCatalog } from "../../types";

export class PreviewItem extends ProductCard<ProductCatalog> {
  constructor(events: IEvents, container: HTMLElement) {
    super(events, container, {
      onClick: (event: MouseEvent) => {
        event.preventDefault();
        if (this.data) {
          events.emit("product:toggle-basket", { product: this.data });
        }
      }
    });
  }
}