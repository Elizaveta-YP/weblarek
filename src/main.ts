import './scss/styles.scss';


import Cart from './components/Models/Cart';
import Buyer from './components/Models/Buyer';
import ProductModel from './components/Models/ProductModel';
import {IApi} from './types/index';
import {apiProducts} from './utils/data';
//*-*//
import { ProductCatalog } from './types/index';


// Создаем экземпляры всех трёх классов
const Cart = new Cart();
const Buyer = new Buyer();
const ProductModel = new ProductModel();
