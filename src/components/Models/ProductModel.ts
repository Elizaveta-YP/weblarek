import { ProductCatalog } from '../../types';

export class ProductModel {
    private products: ProductCatalog[] = [];
    private selectedProduct: ProductCatalog | null = null;

//сохранение массива товаров полученного в параметрах метода.
setProducts(products: ProductCatalog[]): void{
    this.products = [...products];
} 

//получение массива товаров из модели.
getProducts(): ProductCatalog[] {
        return [...this.products];
  } 

//получение товара для подробного отображения.
getSelected(): ProductCatalog | null {
    return this.selectedProduct;
}

//сохранение товара для подробного отображения.
setSelected(product: ProductCatalog): void {
     this.selectedProduct = product;
}

//получение одного товара по его id.
getProductById(id:string): ProductCatalog | undefined {
     return this.products.find(product => product.id === id);
}
}

export default ProductModel;