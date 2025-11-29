import './scss/styles.scss';
import { apiProducts } from './utils/data';
import Cart from './components/Models/Cart';
import Buyer from './components/Models/Buyer';
import ProductModel from './components/Models/ProductModel';

// создаю экземпляры всех трёх классов
const cart = new Cart();
const buyerModel = new Buyer();
const productsModel = new ProductModel();

// Cart
// 1.добавляю товары
apiProducts.items.forEach(product => {
    cart.addItem(product);
});

// 2.роверяю работу методов
console.log('Товары в корзине: ', cart.getItems());
console.log('Количество товаров: ', cart.getCount());
console.log('Общая стоимость: ', cart.getTotal());
console.log('Первый товар в наличии: ', cart.hasItem(apiProducts.items[0].id));

// 3.удаляю один товар и проверяю снова
cart.remove(apiProducts.items[0].id);
console.log('Количество товаров: ', cart.getCount());
console.log('Общая стоимость: ', cart.getTotal());

// 4.очищаю корзину
cart.clear();
console.log('Количество товаров: ', cart.getCount());
console.log('Общая стоимость: ', cart.getTotal());

// Buyer
// 1.создаю тестовые данные покупателя
const testBuyerData = {
    email: 'test@example.com',
    phone: '+79991234567',
    address: 'г. Москва, ул. Примерная, д. 1',
    payment: 'card'
};
// 2.сохраняю данные в модель
buyerModel.setBuyerNotis(testBuyerData);

// 3.проверяю работу методов
const results = buyerModel.getBuyerNotis();
console.log('Данные покупателя: ', results);

// 4.проверяю валидацию
const validationResult = buyerModel.validateBuyerNotis();
console.log('Результат валидации: ', validationResult);
console.log('Валидация пройдена: ', Object.keys(validationResult).length === 0);

// ProductModels
// 1.Сохраняю данные
productsModel.setProducts(apiProducts.items);

// 2.проверяю работу методов
const result = productsModel.getProducts();
console.log('Массив товаров из каталога: ', result);
console.log('Количество товаров: ', result.length);