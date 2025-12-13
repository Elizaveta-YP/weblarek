import { ProductCard } from "./ProductCard";
import { IEvents } from "../base/Events";
import { ProductCatalog } from "../../types";

export class CatalogItem extends ProductCard<ProductCatalog> {
  private _productData: ProductCatalog | null = null;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container, {
      onClick: (event: MouseEvent) => {
        event.preventDefault();
        if (this._productData) {
          events.emit("product:select", { product: this._productData });
        }
      },
    });
  }

  render(data?: Partial<ProductCatalog>): HTMLElement {
    if (data) {
      this._productData = data as ProductCatalog;
    }
    return super.render(data);
  }
}