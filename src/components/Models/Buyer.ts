import { Buyer as BuyerType } from '../../types';
import { IEvents } from '../base/Events';

type ValidationErrors = Partial<Record<keyof BuyerType, string>>;

export class Buyer {
    protected data: Partial<BuyerType> = {};

    constructor(protected events: IEvents) {}

    setBuyerNotis(data: Partial<BuyerType>): void {
        this.data = { ...this.data, ...data };
        this.events.emit('order:update');
    }

    getBuyerNotis(): Partial<BuyerType> {
        return { ...this.data };
    }

    getData(): Partial<BuyerType> {
        return this.getBuyerNotis();
    }

    clearBuyerNotis(): void {
        this.data = {};
        this.events.emit('order:update');
    }

    validateOrderForm(): ValidationErrors {
        const errors: ValidationErrors = {};
        if (!this.data.payment) errors.payment = 'Укажите способ оплаты';
        if (!this.data.address) errors.address = 'Укажите адрес доставки';
        return errors;
    }

    validateContactsForm(): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!this.data.email) {
        errors.email = 'Укажите email';
    } else if (!this.data.email.includes('@') || !this.data.email.includes('.')) {
        errors.email = 'Некорректный email адрес';
    }
    
    if (!this.data.phone) {
        errors.phone = 'Укажите телефон';
    } else {
        const phoneDigits = this.data.phone.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            errors.phone = 'Некорректный номер телефона';
        } else if (phoneDigits.length > 11) {
            errors.phone = 'Некорректный номер телефона';
        }
    }
    
    return errors;
}

    validateAll(): ValidationErrors {
        return {
            ...this.validateOrderForm(),
            ...this.validateContactsForm()
        };
    }

    validate(): ValidationErrors {
        return this.validateAll();
    }

    isOrderFormValid(): boolean {
        return Object.keys(this.validateOrderForm()).length === 0;
    }

    isContactsFormValid(): boolean {
        return Object.keys(this.validateContactsForm()).length === 0;
    }

    isAllValid(): boolean {
        return Object.keys(this.validateAll()).length === 0;
    }
}