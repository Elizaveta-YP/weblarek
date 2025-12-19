import './scss/styles.scss';
import { Api } from './components/base/Api'; 
import { ShopApi } from './components/base/ShopApi';
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
import { cloneTemplate } from './utils/utils';
import { ProductCatalog, IOrderRequest} from './types/index';

// Инициализация событий
const events = new EventEmitter();

// Инициализация моделей с передачей events
const cart = new Cart(events);
const buyerModel = new BuyerClass(events);
const productsModel = new ProductModel(events);

// Инициализация API
const api = new Api(API_URL, {
    headers: {
        'Content-Type': 'application/json'
    }
});

const shopApi = new ShopApi(api);

// Инициализация представлений
const modal = new Modal(events, document.querySelector('#modal-container') as HTMLElement);
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const header = new Header(events, document.querySelector('.header') as HTMLElement);

const basket = new Basket(events, cloneTemplate('#basket'));
const orderForm = new OrderForm(events, cloneTemplate('#order'));
const contactsForm = new ContactsForm(events, cloneTemplate('#contacts'));
const success = new Success(events, cloneTemplate('#success'));

const previewItem = new PreviewItem(events, cloneTemplate('#card-preview'));

// Загрузка каталога товаров
async function loadCatalog() {
    try {
        const response = await shopApi.getProducts();
        const products = response.items || [];
        productsModel.setProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}

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
    const isInCart = cart.hasItem(data.product.id);
    
    const element = previewItem.render({
        title: data.product.title,
        price: data.product.price,
        category: data.product.category,
        image: data.product.image
    });
    
    previewItem.container.dataset.productId = data.product.id;
    previewItem.buttonText = isInCart ? 'Убрать из корзины' : 'В корзину';
    
    if (data.product.price === null && !isInCart) {
        previewItem.buttonDisabled = true;
    } else {
        previewItem.buttonDisabled = false;
    }
    
    modal.content = element;
    modal.open();
});

// 4. Обработка добавления/удаления товара из корзины
events.on('product:toggle-basket', (data: { productId: string }) => {
    const product = productsModel.getProductById(data.productId);
    
    if (product) {
        if (product.price === null) {
            console.log('Товар без цены не может быть добавлен в корзину');
            return; 
        }
        
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

    if (modal.isOpen && modal.content === previewItem.container) {
        const productId = previewItem.container.dataset.productId;
        if (productId) {
            const isInCart = cart.hasItem(productId);
            previewItem.buttonText = isInCart ? 'Убрать из корзины' : 'В корзину';
            
            const product = productsModel.getProductById(productId);
            if (product && product.price === null && !isInCart) {
                previewItem.buttonDisabled = true;
            } else {
                previewItem.buttonDisabled = false;
            }
        }
    }
    
    const basketItems = data.items.map((item, index) => {
        const basketItem = new BasketItem(events, cloneTemplate('#card-basket'));
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
    if (cart.getCount() > 0) {
        modal.content = orderForm.render();
        modal.open();
        events.emit('order:update');
    }
});

// 9. Централизованное обновление форм заказа
events.on('order:update', () => {
    const buyerData = buyerModel.getBuyerNotis();
    const orderErrors = buyerModel.validateOrderForm();
    const contactsErrors = buyerModel.validateContactsForm();

    orderForm.payment = buyerData.payment || '';
    orderForm.address = buyerData.address || '';
    orderForm.setErrors(orderErrors); 
    
    contactsForm.email = buyerData.email || '';
    contactsForm.phone = buyerData.phone || '';
    contactsForm.setErrors(contactsErrors);
});

// 10. Обработка изменения способа оплаты
events.on('order.payment:change', (data: { payment: string }) => {
    console.log('Payment changed:', data.payment);
    buyerModel.setBuyerNotis({ payment: data.payment });
});

// 11. Обработка изменения адреса
events.on('order.address:change', (data: { address: string }) => {
    buyerModel.setBuyerNotis({ address: data.address });
});

// 12. Обработка изменения email
events.on('contacts.email:change', (data: { email: string }) => {
    console.log('Email changed:', data.email);
    buyerModel.setBuyerNotis({ email: data.email });
});

// 13. Обработка изменения телефона
events.on('contacts.phone:change', (data: { phone: string }) => {
    console.log('Phone changed:', data.phone);
    buyerModel.setBuyerNotis({ phone: data.phone });
});

// 14. Обработка отправки формы заказа
events.on('order:submit', () => {
    const buyerData = buyerModel.getBuyerNotis();
    
    if (buyerModel.isOrderFormValid()) {
        modal.content = contactsForm.render();
        events.emit('order:update');
    } else {
        const errors = buyerModel.validateOrderForm();
        orderForm.setErrors(errors);
    }
});

// 15. Обработка отправки формы контактов
events.on('contacts:submit', async () => {
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
            const response = await shopApi.sendOrder(orderData);
            console.log('Order successful:', response);
            
            success.total = response.total;
            modal.content = success.render();
            
            cart.clear();
            buyerModel.clearBuyerNotis();
            
        } catch (error) {
            console.error('Order error:', error);
            contactsForm.setErrors(['Ошибка оформления заказа. Попробуйте еще раз.']);
        }
    } else {
        contactsForm.setErrors(Object.values(errors));
    }
});

// 16. Обработка закрытия окна успеха
events.on('success:close', () => {
    modal.close();
});

// 17. Принудительное закрытие модального окна
events.on("modal:force-close", () => {
  if (modal.isOpen) {
    modal.container.classList.remove("modal_active");
    events.emit('modal:close');
  }
});

// Создание шаблонов
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

// Инициализация приложения
loadCatalog();