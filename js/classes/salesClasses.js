export default class Sale {
    constructor(id, product, quantity, unitPrice, total, currentTimeStamp) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.total = total;
        this.currentTimeStamp = currentTimeStamp;
    }
}