import { ProductCatalog } from '../../types';
import { IEvents } from '../base/Events'; 

export class ProductModel {
    private products: ProductCatalog[] = [];
    private selectedProduct: ProductCatalog | null = null;

    constructor(protected events: IEvents) {}

    setProducts(products: ProductCatalog[]): void {
        this.products = [...products];
        this.events.emit('catalog:changed', { products: this.products });
    } 

    getProducts(): ProductCatalog[] {
        return [...this.products];
    } 

    getSelected(): ProductCatalog | null {
        return this.selectedProduct;
    }

    setSelected(product: ProductCatalog): void {
        this.selectedProduct = product;

        this.events.emit('product:selected', { product });
    }

    getProductById(id: string): ProductCatalog | undefined {
        return this.products.find(product => product.id === id);
    }
}

export default ProductModel;