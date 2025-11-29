import './scss/styles.scss';
import { apiProducts } from './utils/data';
import Cart from './components/Models/Cart';
import Buyer from './components/Models/Buyer';
import ProductModel from './components/Models/ProductModel';
import { ShopApi } from './components/base/ShopApi'
import { Api } from './components/base/Api'
import { API_URL } from './utils/constants';

// создаю экземпляры всех трёх классов.
const cart = new Cart();
const buyerModel = new Buyer();
const productsModel = new ProductModel();

// Cart
// 1.добавляю товары.
apiProducts.items.forEach(product => {
    cart.addItem(product);
});

// 2.проверяю работу методов.
console.log('Товары в корзине: ', cart.getItems());
console.log('Количество товаров: ', cart.getCount());
console.log('Общая стоимость: ', cart.getTotal());
console.log('Первый товар в наличии: ', cart.hasItem(apiProducts.items[0].id));

// 3.удаляю один товар и проверяю снова.
cart.remove(apiProducts.items[0].id);
console.log('Количество товаров: ', cart.getCount());
console.log('Общая стоимость: ', cart.getTotal());

// 4.очищаю корзину.
cart.clear();
console.log('Количество товаров: ', cart.getCount());
console.log('Общая стоимость: ', cart.getTotal());

// Buyer
// 1.создаю тестовые данные покупателя.
const testBuyerData = {
    email: 'azil@example.com',
    phone: '+7945962385',
    address: 'г. Екатеринбург, ул. Бажова, д. 158',
    payment: 'card'
};
// 2.сохраняю данные в модель.
buyerModel.setBuyerNotis(testBuyerData);

// 3.проверяю работу методов.
const results = buyerModel.getBuyerNotis();
console.log('Данные покупателя: ', results);

// 4.проверяю валидацию.
const validationResult = buyerModel.validateBuyerNotis();
console.log('Результат валидации: ', validationResult);
console.log('Валидация пройдена: ', Object.keys(validationResult).length === 0);

// ProductModels
// 1.сохраняю данные.
productsModel.setProducts(apiProducts.items);

// 2.проверяю работу методов.
const result = productsModel.getProducts();
console.log('Массив товаров из каталога: ', result);
console.log('Количество товаров: ', result.length);

// загрузка товаров с сервера.
// создаю экземпляры API.
const api = new Api(API_URL);
const shopAPI = new ShopApi(api);

// функция для загрузки товаров с сервера.
async function loadCatalogFromServer() {
    try {    
        // получаю данные с сервера.
        const products = await shopAPI.getProduct(); 
        
        // сохраняю в модель.
        productsModel.setProducts(products);
        
        // проверяю результат.
        const savedProducts = productsModel.getProducts();
        
        // вывожу результат в консоль.
        console.log('Товары, загруженные с сервера:');
        savedProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.title} - ${product.price} руб.`);
        });
        
        console.log('Количество товаров с сервера:', savedProducts.length);
        console.log('Модель ProductModel работает корректно:', savedProducts.length === products.length);
        
    } catch (error) {
        console.error('Возникла ошибка при загрузке товаров с сервера:', error);
    }
}

// запуск загрузки.
loadCatalogFromServer();