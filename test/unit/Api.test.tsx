import axios from "axios";
import { ExampleApi } from "../../src/client/api"
import { count } from "console";

describe("серверное api", () => { // запускать со вклбченным серваком
    it("выдаёт список товаров с нужными полями", async () => {
        const api = new ExampleApi('/hw/store');

        const products = (await api.getProducts()).data;

        expect(products.length).toBeGreaterThan(0)

        expect(products[4].id).toBe(4)
        expect(products[4].name).toBeTruthy()
        expect(products[4].price).toBeGreaterThan(0)
    });
    it("выдаёт подробную информацию о товаре", async () => {
        const api = new ExampleApi('/hw/store');

        const products = (await api.getProducts()).data;
        const productDetails = (await api.getProductById(4)).data;

        expect(products[4].id).toBe(productDetails.id)
        expect(products[4].price).toBe(productDetails.price)
        expect(products[4].name).toBe(productDetails.name)
        expect(productDetails.description).toBeTruthy()
        expect(productDetails.color).toBeTruthy()
        expect(productDetails.material).toBeTruthy()
    });
    it("выдаёт последовательные id заказов при чекауте", async () => {
        const form = {name: 'Egor', address: 'Tokyo', phone: '8 800 555 3535'};
        const cart = { 3: { count: 2, name: 'bipki', price: 52} };

        const api = new ExampleApi('/hw/store');

        const id1 = (await api.checkout(form, cart)).data.id;
        const id2 = (await api.checkout(form, cart)).data.id;

        expect(id2 - id1).toBe(1);
    });
})