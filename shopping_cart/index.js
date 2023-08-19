import Product from "./product.js";
import ShoppingCart from "./shoppingcart.js";

const p1 = new Product("laptop", 4000);
const p2 = new Product("Television", 2000);


const cart = new ShoppingCart();
cart.addItem(p1, 2);
cart.addItem(p2, 1);
console.log(cart.getCartItems());
console.log(cart.getTotal());
cart.removeItem(p1);
console.log(cart.getCartItems());
