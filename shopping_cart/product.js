function Product(name, price){
    this.name = name;
    this.price = price;

    const getName = () => this.name;
    const getPrice = () => this.price;

    return {
        getName,
        getPrice
    };
}

export default Product;