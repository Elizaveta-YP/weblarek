import { ProductCatalog } from '../../types';

export class Cart {
    private items: ProductCatalog[] = [];

//получение массива товаров в корзине.
    getItems(): ProductCatalog[] {
        return [...this.items]; 
    }

//добавление товара в массив корзины.
    addItem(product: ProductCatalog): void {
        this.items.push(product);
    }

//удаление товара из массива корзины.
    remove(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

//очистка корзины.
    clear(): void {
        this.items = [];
    }

//стоимость всех товаров в массиве.
    getTotal(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

//количество товаров в массиве.
    getCount(): number {
        return this.items.length;
    }

//проверка наличия товара в корзине по его id, полученного в параметр метода.
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}

export default Cart;