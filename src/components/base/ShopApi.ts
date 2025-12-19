import { Api } from './Api';
import { IProductListResponse, IOrderRequest, IOrderResponse } from '../../types';

export class ShopApi {
    constructor(private api: Api) {}

    getProducts(): Promise<IProductListResponse> {
        return this.api.get('/product');
    }

    sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post('/order', order, 'POST');
    }
}