import { Buyer as BuyerType } from '../../types';

type ValidationErrors = Partial<Record<keyof BuyerType, string>>;

export class Buyer {
    protected data: Partial<BuyerType> = {};

    // сохранение данных в модели.
    setBuyerNotis(data: Partial<BuyerType>): void {
        this.data = { ...this.data, ...data };
    }

    // получение всех данных покупателя.
    getBuyerNotis(): Partial<BuyerType> {
        return { ...this.data };
    }

    // очистка данных покупателя.
    clearBuyerNotis(): void {
        this.data = {};
    }

    // валидация данных.
    validateBuyerNotis(): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!this.data.payment) errors.payment = 'Укажите способ оплаты';
        if (!this.data.email) errors.email = 'Укажите емэйл';
        if (!this.data.phone) errors.phone = 'Укажите номер телефона';
        if (!this.data.address) errors.address = 'Укажите адрес доставки';
        
        return errors;
    }
}

export default Buyer;