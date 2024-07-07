import axios from "axios";
import { CartApi, ExampleApi } from "../../src/client/api";
import { initStore, productsLoad } from "../../src/client/store";
import { Store } from "redux";
jest.mock("axios");
function setupStore() {
  const api = new ExampleApi("/hw/store");
  const cart = new CartApi();
  const store = initStore(api, cart);

  return store;
}
async function loadProducts(store: Store) {
  return new Promise<void>((resolve) => {
    const unsub = store.subscribe(() => {
      if (store.getState().products) {
        unsub();
        resolve();
      }
    });

    store.dispatch(productsLoad());
  });
}
const products = [
  {
    id: 0,
    name: "Fantastic kogtetochka",
    price: 4,
  },
  {
    id: 1,
    name: "Refined kogtetochka",
    price: 979,
  },
  {
    id: 2,
    name: "Generic kogtetochka",
    price: 487,
  },
];
describe("Слайс с покупками", () => {
  it("Подгружает приколы с сервера при рендере", async () => {
    jest.mocked(axios).get.mockResolvedValueOnce({ data: products });
    const store = setupStore();

    await loadProducts(store);

    expect(store.getState().products).toEqual(products);
    expect(jest.mocked(axios.get)).toHaveBeenCalledWith(
      "/hw/store/api/products"
    );
  });
});
