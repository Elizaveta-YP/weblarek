# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

##### Данные

# Каталог товаров

Хранит массив всех товаров.
Хранит товар, выбранный для подробного отображения.
Хранит следующие данные:
interface ProductCatalog {
id: string;
description: string;
image: string;
title: string;
category: string;
price: number | null;
}

- `id` - id каждого товара.
- `description` - описание товара при открытом модальном окне.
- `image` - картинка товара.
- `title` - название товара.
- `category` - категория товара.
- `price` - цена товара, значение может быть бесценное.

# Корзина

Хранит массив товаров, выбранных покупателем для покупки.

# Покупатель

Хранит следующие данные:
interface Buyer {
payment: string;
email: string;
phone: string;
address: string;
}

- `payment` - способ оплаты, может быть card | cash | ''.
- `email` - электронная почта покупателя.
- `phone` - номер телефона покупателя.
- `address` - адрес покупателя.

###### Модели данных

# Методы каталога товаров

методы:

- setProducts(products: ProductCatalog[]): void - сохранение массива товаров полученного в параметрах метода.
- getProducts(): ProductCatalog[] - получение массива товаров из модели.
- getSelected(): ProductCatalog | null - получение товара для подробного отображения.
- setSelected(product: ProductCatalog): void - сохранение товара для подробного отображения.
- getProductById(id: string): ProductCatalog | undefined - получение одного товара по его id.

# Методы корзины

методы:

- getItems(): ProductCatalog - получение массива товаров в корзине.
- addItem(product: ProductCatalog): void - добавление товара в массив корзины.
- remove(id: string): void - удаление товара из массива корзины.
- clear(): void - очистка корзины.
- getTotal(): number - стоимость всех товаров в массиве.
- getCount(): number - количество товаров в массиве.
- hasItem(id: string): boolean - проверка наличия товара в корзине по его id, полученного в параметр метода.

# Методы покупателя

методы:

- setBuyerNotis(data: Partial<BuyerType>): void - сохранение данных в модели.
- getBuyerNotis(): Partial<BuyerType> - получение всех данных покупателя.
- clearBuyerNotis(): void - очистка данных покупателя.
- validateBuyerNotis(): ValidationErrors - валидация данных.

# Слой коммуникации

# Класс ApiService

Использует композицию, чтобы выполнить запрос на сервер с помощью метода get класса Api и получает с сервера объект с массивом товаров.

# Методы ApiService

- fetchProducts():Promise<ProductCatalog> - делает get запрос на эндпоинт /product/ и возвращает массив товаров.
- sendOrder(orderData: IOrder)Promise - делает post запрос на эндпоинт /order/ и передаёт в него данные, полученные в параметрах метода.

###### Слой представления

### Класс FormComponent.

Абстрактный компонент для работы с формами.

# Конструктор:

- constructor(container: HTMLElement)

# FormComponent имеет поля:

- \_form: HTMLFormElement - элемент.
- \_errors: HTMLElement - ошибка валидации.
- \_submitButton: HTMLButtonElement - отправка формы.

# Свойства FormComponent:

- set valid(value: boolean) - состояние кнопки.
- set errors(value: string[]) - ошибка валидации.

# Методы FormComponent:

- render(): HTMLElement - возвращает корневой DOM-элемент.

## 1.Класс Header.

# Конструктор:

- constructor(events: IEvents, container: HTMLElement)

# Header имеет поля:

- counterElement: HTMLElement - счетчик товаров в корзине.
- basketButton: HTMLButtonElement - кнопка корзины.

# Методы Header:

- set counter(value: number) - значение счетчика товаров в корзине.

## 2.Класс Gallery.

# Конструктор:

- constructor(container: HTMLElement)

# Gallery имеет поля:

- catalogElement: HTMLElement - контейнер для товаров.

# Методы Gallery:

- set catalog(items: HTMLElement[]) - массив элементов карточек для отображения их в галерее.

## 3.Класс Modal.

# Конструктор:

- constructor(events: IEvents, container: HTMLElement)

# Modal имеет поля:

- \_closeButton: HTMLButtonElement - кнопка закрытия.
- \_content: HTMLElement - содержимое.

# Методы Modal:

- get isOpen(): boolean - состояние (открыто или закрыто).
- set content(value: HTMLElement) - содержимое.
- open(): void - открывает.
- close(): void - закрывает.

## 4.Класс ProductCard.

# Конструктор:

- constructor(events: IEvents, container: HTMLElement, actions?: ICardActions)

# ProductCard имеет поля:

- \_category: HTMLElement | null - категория.
- \_title: HTMLElement - заголовок.
- \_image: HTMLImageElement | null - изображение.
- \_price: HTMLElement - цена.

# Свойства ProductCard:

- set category(value: string) - категория.
- set title(value: string) - название.
- set image(value: string) - изображение.
- set price(value: number | null) - цена.

# Методы ProductCard:

- render (data?; Partial<IProductCardData>): HTMLElement - рендерит карточку и устанавливает атрибут.

## 5.Класс CatalogItem.

# Конструктор:

- constructor(events: IEvents, container: HTMLElement)

## 6.Класс PreviewItem.

# Конструктор:

- constructor(events: IEvents, container: HTMLElement)

# PreviewItem имеет поля:

- \_button: HTMLButtonElement | null - кнопка для добавления или удаления товара из корзины.

# Свойства PreviewItem:

- set buttonText(value: string) - текст кнопки.
- set buttonDisabled(state: boolean) - состояние кнопки.

## 7.Класс Basket.

# Конструктор:

- constructor(events: IEvents, container: HTMLElement | null)

# Basket имеет поля:

- \_list: HTMLElement - список товаров.
- \_total: HTMLElement - общая сумма.
- \_button: HTMLButtonElement - кнопка оформить заказ.

# Свойства Basket:

- set items(items: HTMLElement[]) - список товаров.
- set total(value: number) - общая сумма заказа.
- set buttonDisabled(state: boolean) - отключение кнопки.

## 8.Класс BasketItem.

# Конструктор:

- constructor(events: IEvents, container: HTMLElement)

# BasketItem имеет поля:

- \_index: HTMLElement - порядковый номер.
- \_title: HTMLElement - название.
- \_price: HTMLElement - цена.
- \_deleteButton: HTMLButtonElement - удаление товара.

# Свойства BasketItem:

- set index(value: number) - порядковый номер.
- set title(value: string) - название.
- set price(value: number | null) - цена.

# Методы BasketItem:

- render(data?: Partial<IBasketItem>): HTMLElement - рендерит элемент и устанавливает атрибут.

## 9.Класс OrderForm.

# Конструктор:

constructor(events: IEvents, container: HTMLElement)

# OrderForm имеет поля:

- \_paymentButtons: NodeListOf<HTMLButtonElement> - выбор оплаты.
- \_addressInput: HTMLInputElement - ввод адреса.

# Свойства OrderForm:

- set payment(value: string) - выбранный способ оплаты.
- set address(value: string) - адрес в поле ввода.

# Методы OrderForm:

- render(): HTMLElement - возврат формы.

## 10.Класс ContactsForm.

# Конструктор:

- constructor(events: IEvents, container: HTMLElement)

# ContactsForm имеет поля:

- \_emailInput: HTMLInputElement - почта.
- \_phoneInput: HTMLInputElement - телефон.

# Свойства ContactsForm:

- set errors(value: string[]) - вывод ошибки.
- set valid(value: boolean) - отправить.

## 11.Класс Success.

# Конструктор:

- constructor(events: IEvents, container?: HTMLElement | null)

# Success имеет поля:

- \_description: HTMLElement - текст с общей стоимостью.
- \_closeButton: HTMLButtonElement - закрыть.

# Свойства Success:

- set total(value: number) - общая стоимость.

# Методы Success:

- render(): HTMLElement - возвращает компонент.

#### Презентер

В моем коде main.ts является презентером. Он включает в себя:

# Модели:

- Cart - модель корзины.
- Buyer - модель покупателя.
- ProductModel - модель товаров.

# Представления:

- Modal - модальное окно.
- Gallery - галерея товаров.
- Header - заголовок с корзиной.
- Basket - корзина.
- OrderForm - форма заказа.
- ContactsForm - форма контактов.
- Success - Окно с успешным оформлением заказа.

# Презентер:

- main.ts - создает экземпляры моделей и представлений; настраивает связь между ними через обработчик событий EventEmmitter; обрабатывает бизнес-логику (валидацию данных, отправку на сервер, обновление интерфейса пользователя, очистку состояния).
