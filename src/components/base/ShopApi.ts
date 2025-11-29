import { IApi, IOrderRequest, IOrderResponse, ProductCatalog } from "../../types";

export class ShopApi {
    constructor(private api: IApi) {
        this.api = api; 
    }

    async getProduct(): Promise<ProductCatalog[]> {
        const response = await this.api.get<{ total: number; items: ProductCatalog[] }>('/product/');
        return response.items; 
    }
    createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post('/order/', order);
    }
    }