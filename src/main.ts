import './scss/styles.scss';
import { Api } from './components/base/Api'; 
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import Cart from './components/Models/Cart';
import { Buyer as BuyerClass } from './components/Models/Buyer';
import ProductModel from './components/Models/ProductModel';
import { Modal } from './components/View/Modal';
import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { CatalogItem } from './components/View/CatalogItem';
import { PreviewItem } from './components/View/PreviewItem';
import { BasketItem } from './components/View/BasketItem';

interface ProductCatalog {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

interface Buyers {
    payment: string;
    email: string;
    phone: string;
    address: string;
}

interface IOrderRequest extends Buyers {
    total: number;
    items: string[];
}

interface IProductListResponse {
    total: number;
    items: ProductCatalog[];
}

interface IOrderResponse {
    id: string;
    total: number;
}

// Инициализация событий
const events = new EventEmitter();

// Инициализация моделей с передачей events
const cart = new Cart(events);
const buyerModel = new BuyerClass(events);
const productsModel = new ProductModel(events);

// Инициализация API - используем Api напрямую
const api = new Api(API_URL, {
    headers: {
        'Content-Type': 'application/json'
    }
});

function createFromTemplate(templateId: string): HTMLElement {
    const template = document.querySelector(templateId) as HTMLTemplateElement;
    if (!template) {
        console.error(`Template ${templateId} not found`);
        return createFallbackElement(templateId);
    }
    
    const fragment = template.content.cloneNode(true) as DocumentFragment;
    const element = fragment.firstElementChild as HTMLElement;
    
    if (!element) {
        console.error(`Template ${templateId} has no content`);
        return createFallbackElement(templateId);
    }
    
    console.log(`Created from template ${templateId}:`, element.tagName, element.className);
    return element;
}

function createFallbackElement(templateId: string): HTMLElement {
    const div = document.createElement('div');
    div.className = 'fallback-container';
    div.textContent = `Template ${templateId} failed to load`;
    div.style.cssText = 'border: 2px solid red; padding: 20px; background: #ffe6e6;';
    return div;
}

// Инициализация представлений
const modal = new Modal(events, document.querySelector('#modal-container') as HTMLElement);
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const header = new Header(events, document.querySelector('.header') as HTMLElement);

const basket = new Basket(events, createFromTemplate('#basket'));

const orderForm = new OrderForm(events, createFromTemplate('#order'));

console.log('=== ORDER FORM CREATION CHECK ===');
console.log('OrderForm instance:', orderForm);
console.log('Submit button found by selector:', 
    orderForm.container.querySelector('button[type="submit"]'));
console.log('Submit button from internal property:', 
    (orderForm as any)._submitButton);


const contactsForm = new ContactsForm(events, createFromTemplate('#contacts'));
const success = new Success(events, createFromTemplate('#success'));

// Загрузка каталога товаров с сервера через Api
async function loadCatalog() {
    try {
        console.log('Начинаю загрузку каталога...');
        const response: IProductListResponse = await api.get('/product');
        const products = response.items || [];
        console.log(`Загружено ${products.length} товаров`);
        productsModel.setProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

// 1. Обработка изменения каталога товаров
events.on('catalog:changed', (data: { products: ProductCatalog[] }) => {
    const catalogItems = data.products.map(product => {
        const item = new CatalogItem(events, createCardTemplate());
        const element = item.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: product.image
        });
        
        element.dataset.productId = product.id;
        return element;
    });
    
    gallery.catalog = catalogItems;
});

// 2. Обработка выбора товара для просмотра
events.on('product:select', (data: { productId: string }) => {
    const product = productsModel.getProductById(data.productId);
    if (product) {
        productsModel.setSelected(product);
    }
});

// 3. Обработка выбранного товара
events.on('product:selected', (data: { product: ProductCatalog }) => {
    const previewItem = new PreviewItem(events, createPreviewTemplate());
    
    const isInCart = cart.hasItem(data.product.id);
    const element = previewItem.render({
        title: data.product.title,
        price: data.product.price,
        category: data.product.category,
        image: data.product.image
    });
    
    element.dataset.productId = data.product.id;
    
    if ('buttonText' in previewItem) {
        (previewItem as any).buttonText = isInCart ? 'Убрать из корзины' : 'В корзину';
    }
    
    modal.content = element;
    modal.open();
});

// 4. Обработка добавления/удаления товара из корзины
events.on('product:toggle-basket', (data: { productId: string }) => {
    const product = productsModel.getProductById(data.productId);
    if (product) {
        if (cart.hasItem(product.id)) {
            cart.remove(product.id);
        } else {
            cart.addItem(product);
        }
    }
});

// 5. Обработка изменения содержимого корзины
events.on('basket:changed', (data: { items: ProductCatalog[], total: number, count: number }) => {
    header.counter = data.count;

    if (modal.isOpen && modal.content) {
        if (modal.content instanceof HTMLElement) {
            const currentContent = modal.content;
            const previewButton = currentContent.querySelector('.card__button');
            const productIdElement = currentContent.querySelector('[data-product-id]');
            const productId = productIdElement ? productIdElement.getAttribute('data-product-id') : null;

            if (previewButton && productId) {
                const isInCart = cart.hasItem(productId);
                const button = previewButton as HTMLButtonElement;
                button.textContent = isInCart ? 'Убрать из корзины' : 'В корзину';
            }
        } else {
            console.warn('modal.content is not an HTMLElement', modal.content);
        }
    }
    
    const basketItems = data.items.map((item, index) => {
        const basketItem = new BasketItem(events, createBasketItemTemplate());
        const element = basketItem.render({
            index: index + 1,
            title: item.title,
            price: item.price,
            productId: item.id
        });
        return element;
    });
    
    basket.items = basketItems;
    basket.total = data.total;
    basket.buttonDisabled = data.count === 0;
});

// 6. Обработка удаления товара из корзины
events.on('basket:remove', (data: { productId: string }) => {
    cart.remove(data.productId);
});

// 7. Обработка открытия корзины
events.on('basket:open', () => {
    modal.content = basket.render();
    modal.open();
});

// 8. Обработка открытия формы заказа
events.on('order:open', () => {
    console.log('=== ORDER FORM OPEN ===');
    console.log('Cart count:', cart.getCount());
    
    if (cart.getCount() > 0) {
        modal.content = orderForm.render();
        modal.open();
        
        setTimeout(() => {
            events.emit('order:validate');
        }, 50);
    }
});

// 9. Обработка изменения способа оплаты
events.on('order.payment:change', (data: { payment: string }) => {
    buyerModel.setBuyerNotis({ payment: data.payment });
    orderForm.payment = data.payment;
});

// 10. Обработка изменения адреса
events.on('order.address:change', (data: { address: string }) => {
    console.log('Address changed:', data.address);
    buyerModel.setBuyerNotis({ address: data.address });
    
    setTimeout(() => {
        events.emit('order:validate');
        
        const button = document.querySelector('.modal button[type="submit"]');
        if (button) {
            console.log('Direct button test - found:', button);
            console.log('Current disabled:', button.disabled);
            button.disabled = false;
            button.removeAttribute('disabled');
            console.log('After manual enable - disabled:', button.disabled);
        }
    }, 50);
});

// 11. Обработка отправки первой формы заказа
events.on('contacts:submit', async () => {
    console.log('=== CONTACTS FORM SUBMIT HANDLER CALLED ===');
    console.log('Buyer data:', buyerModel.getBuyerNotis());
    
    const errors = buyerModel.validateContactsForm();
    console.log('Contacts form errors:', errors);
    
    if (Object.keys(errors).length === 0) {
        try {
            const buyerData = buyerModel.getBuyerNotis();
            
            const orderData: IOrderRequest = {
                payment: buyerData.payment!,
                address: buyerData.address!,
                email: buyerData.email!,
                phone: buyerData.phone!,
                items: cart.getItems().map(item => item.id),
                total: cart.getTotal()
            };
            
            console.log('Sending order:', orderData);
            const response: IOrderResponse = await api.post('/order', orderData, 'POST');
            console.log('Order successful:', response);
            
            success.total = cart.getTotal();
            modal.content = success.render();
            
            cart.clear();
            buyerModel.clearBuyerNotis();
            
        } catch (error) {
            console.error('Order error:', error);
            if (contactsForm.errors !== undefined) {
                contactsForm.errors = ['Ошибка оформления заказа. Попробуйте еще раз.'];
            }
        }
    } else {
        console.log('Contacts form invalid on submit');
        if (contactsForm.errors !== undefined) {
            contactsForm.errors = Object.values(errors);
        }
    }
});

// 12. Обработка изменения email
events.on('contacts.email:change', (data: { email: string }) => {
    buyerModel.setBuyerNotis({ email: data.email });
});

// 13. Обработка изменения телефона
events.on('contacts.phone:change', (data: { phone: string }) => {
    buyerModel.setBuyerNotis({ phone: data.phone });
});

// 14. Обработка валидации покупателя
events.on('buyer:validation-changed', (data: { isValid: boolean, errors: any }) => {
    if (modal.isOpen && modal.content) {
        const currentContent = modal.content;
        
        if (currentContent instanceof HTMLElement) {
            const isOrderFormOpen = currentContent.querySelector('.order__buttons') !== null;
            const isContactsFormOpen = currentContent.querySelector('input[name="email"]') !== null;
            
            if (isOrderFormOpen) {
                if (orderForm.valid !== undefined) {
                    orderForm.valid = data.isValid;
                }
                if (!data.isValid && orderForm.errors !== undefined) {
                    orderForm.errors = Object.values(data.errors || {});
                }
            } else if (isContactsFormOpen) {
                if (contactsForm.valid !== undefined) {
                    contactsForm.valid = data.isValid;
                }
                if (!data.isValid && contactsForm.errors !== undefined) {
                    contactsForm.errors = Object.values(data.errors || {});
                }
            }
        }
    }
});

// 15. Обработка отправки формы контактов
events.on('order:submit', () => {
    const buyerData = buyerModel.getBuyerNotis();
    
    if (buyerData.payment && buyerData.address) {
        modal.content = contactsForm.render();
        if (buyerData.email) contactsForm.email = buyerData.email;
        if (buyerData.phone) contactsForm.phone = buyerData.phone;
        
        setTimeout(() => {
            events.emit('contacts:validate');
        }, 50);
    } else {
        const errorMessages = [];
        if (!buyerData.payment) errorMessages.push('Выберите способ оплаты');
        if (!buyerData.address) errorMessages.push('Введите адрес доставки');
        orderForm.errors = errorMessages;
    }
});

// 16. Обработка закрытия окна успеха
events.on('success:close', () => {
    modal.close();
});

// 17. Обработка закрытия модального окна
events.on('modal:close', () => {
});

// 18. Валидация формы заказа
events.on('order:validate', () => {
    console.log('=== ORDER FORM VALIDATION ===');
    const buyerData = buyerModel.getBuyerNotis();
    console.log('Buyer data:', buyerData);
    
    const errors = buyerModel.validateOrderForm();
    console.log('Order form errors:', errors);
    
    const isValid = Object.keys(errors).length === 0;
    console.log('Order form is valid:', isValid);
    
    if (orderForm.valid !== undefined) {
        console.log('Setting orderForm.valid to:', isValid);
        orderForm.valid = isValid;
        setTimeout(() => {
            console.log('Checking button state after set...');
            const button = orderForm.container.querySelector('button[type="submit"]');
            console.log('Button disabled:', button?.disabled);
            console.log('Button disabled attribute:', button?.hasAttribute('disabled'));
        }, 0);
    }
    
    if (!isValid && orderForm.errors !== undefined) {
        orderForm.errors = Object.values(errors);
    }
});

// 19. Валидация формы контактов  
events.on('contacts:validate', () => {
    console.log('=== CONTACTS FORM VALIDATION ===');
    const buyerData = buyerModel.getBuyerNotis();
    console.log('Buyer data:', buyerData);
    
    const errors = buyerModel.validateContactsForm();
    console.log('Contacts form errors:', errors);
    
    const isValid = Object.keys(errors).length === 0;
    console.log('Contacts form is valid:', isValid);

    console.log('Setting contactsForm.valid to:', isValid);
    contactsForm.valid = isValid;
    
    setTimeout(() => {
        const button = contactsForm.container.querySelector('button[type="submit"]');
        console.log('Submit button:', button);
        console.log('Button disabled:', button?.disabled);
        console.log('Button has disabled attribute:', 
            button?.hasAttribute('disabled'));
    }, 0);
    
    if (!isValid && contactsForm.errors !== undefined) {
        contactsForm.errors = Object.values(errors);
    }
});

// Вспомогательные функции для создания шаблонов
function createCardTemplate(): HTMLElement {
    const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const element = template.content.cloneNode(true) as DocumentFragment;
    return element.firstElementChild as HTMLElement;
}

function createPreviewTemplate(): HTMLElement {
    const template = document.querySelector('#card-preview') as HTMLTemplateElement;
    const element = template.content.cloneNode(true) as DocumentFragment;
    return element.firstElementChild as HTMLElement;
}

function createBasketItemTemplate(): HTMLElement {
    const template = document.querySelector('#card-basket') as HTMLTemplateElement;
    const element = template.content.cloneNode(true) as DocumentFragment;
    return element.firstElementChild as HTMLElement;
}

// 20. Обработка изменения полей формы для валидации
events.on('order.payment:change', (data: { payment: string }) => {
    console.log('Payment changed:', data.payment);
    buyerModel.setBuyerNotis({ payment: data.payment });
    
    if (orderForm.payment !== undefined) {
        orderForm.payment = data.payment;
    }
    
    setTimeout(() => {
        events.emit('order:validate');
    }, 50);
});

events.on('order.address:change', (data: { address: string }) => {
    console.log('Address changed:', data.address);
    buyerModel.setBuyerNotis({ address: data.address });
    
    setTimeout(() => {
        events.emit('order:validate');
    }, 50);
});

events.on('contacts.email:change', (data: { email: string }) => {
    console.log('Email changed:', data.email);
    buyerModel.setBuyerNotis({ email: data.email });
    
    setTimeout(() => {
        events.emit('contacts:validate');
    }, 50);
});

events.on('contacts.phone:change', (data: { phone: string }) => {
    console.log('Phone changed:', data.phone);
    buyerModel.setBuyerNotis({ phone: data.phone });
    
    setTimeout(() => {
        events.emit('contacts:validate');
    }, 50);
});

// Инициализация приложения
loadCatalog();

// Экспорт для тестирования
// export {
//     events,
//     cart,
//     buyerModel,
//     productsModel,
//     modal,
//     gallery,
//     header,
//     basket,
//     orderForm,
//     contactsForm,
//     success,
//     api
// };