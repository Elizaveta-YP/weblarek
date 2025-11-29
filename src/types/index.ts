export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс товара
export interface ProductCatalog {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
} 

// Интерфейс покупателя
export interface Buyer {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

// Форматы объектов обмена с API
export interface IProductListResponse {
    total: number;
    items: ProductCatalog[];
}

export interface IOrderRequest extends Buyer {
    total: number;
    items: string[]; 
}

export interface IOrderResponse {
    id: string;
    total: number;
}