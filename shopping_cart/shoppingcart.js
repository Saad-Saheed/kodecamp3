function ShoppingCart(){
    //only accessible to this object
    let items = [];
    
   this.addItem = function(product, quantity = 1) {
        items.push({name: product.getName(), price: product.getPrice(), quantity: quantity});
    }

    this.removeItem = (product) => {
        items = items.filter((item) => {
            return item.name != product.getName();
        })
    }

    this.getTotal = () => {
        return items.reduce((prev, curr) =>{
            return (prev.price * prev.quantity) + (curr.price * curr.quantity)
        });
    }

    this.getCartItems = () => {
        return items;
    }
}

export default ShoppingCart;