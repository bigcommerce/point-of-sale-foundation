import { Injectable } from "../decorators/Injectable";
import { Injector } from "../decorators/Injector";
import CartAPI from "./bigcommerce/api/cart";
import CheckoutAPI from "./bigcommerce/api/checkout";
import CustomersAPI from "./bigcommerce/api/customers";
import OrdersAPI from "./bigcommerce/api/orders";
import ProductsGQL from "./bigcommerce/graphql/products";
import PaymentAPI from "./bigcommerce/api/payment";

@Injectable()
export class BigService {
  public customersAPI = Injector.resolve<CustomersAPI>(CustomersAPI);
  public cartAPI = Injector.resolve<CartAPI>(CartAPI);
  public checkoutAPI = Injector.resolve<CheckoutAPI>(CheckoutAPI);
  public ordersAPI = Injector.resolve<OrdersAPI>(OrdersAPI);
  public paymentAPI = Injector.resolve<PaymentAPI>(PaymentAPI);
  public productsGQL = Injector.resolve<ProductsGQL>(ProductsGQL);
}
