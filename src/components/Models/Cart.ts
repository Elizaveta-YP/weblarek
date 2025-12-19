import { ProductCatalog } from '../../types';
import { IEvents } from '../base/Events';

export class Cart {
    private items: ProductCatalog[] = [];

    constructor(protected events: IEvents) {}

    // получение массива товаров в корзине.
    getItems(): ProductCatalog[] {
        return [...this.items]; 
    }

    // добавление товара в массив корзины.
    addItem(product: ProductCatalog): void {
        if (this.hasItem(product.id)) {
            return; 
        }
        
        this.items.push(product);
        this.events.emit('basket:changed', { 
            items: this.getItems(), 
            total: this.getTotal(),
            count: this.getCount()
        });
    }

    // удаление товара из массива корзины.
    remove(id: string): void {
        const removedItem = this.items.find(item => item.id === id);
        
        if (!removedItem) {
            return; 
        }
        
        this.items = this.items.filter(item => item.id !== id);
        
        this.events.emit('basket:changed', { 
            items: this.getItems(), 
            total: this.getTotal(),
            count: this.getCount()
        });
    }

    // очистка корзины.
    clear(): void {
        this.items = [];
        this.events.emit('basket:changed', { 
            items: [], 
            total: 0,
            count: 0
        });
    }

    // стоимость всех товаров в массиве.
    getTotal(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    // количество товаров в массиве.
    getCount(): number {
        return this.items.length;
    }

    // проверка наличия товара в корзине по его id.
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}

export default Cart;