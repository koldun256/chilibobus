import React, { act } from "react";
import { ProductItem } from "../../src/client/components/ProductItem";
import { render, screen } from "@testing-library/react";
import { addToCart, initStore } from "../../src/client/store";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { CartApi, ExampleApi } from "../../src/client/api";

const product = {
  id: 69,
  name: "bipki",
  price: 420,
  description: "lorem",
  material: "ipsum",
  color: "doret",
};
function renderProductItem() {
  localStorage.clear();
  const api = new ExampleApi("/hw/store");
  const cart = new CartApi();
  const store = initStore(api, cart);
  const { container } = render(
    <BrowserRouter>
      <Provider store={store}>
        <ProductItem product={product} />
      </Provider>
    </BrowserRouter>
  );
  return { store, container };
}
describe("Компонент ProductItem", () => {
  it("соответствует снапшоту без корзины", () => {
    const { container } = renderProductItem();

    expect(container).toMatchSnapshot("ProductItem без корзины");
  });
  it("соответствует снапшоту с корзиной", () => {
    const { container, store } = renderProductItem();

    act(() => store.dispatch(addToCart(product)));

    expect(container).toMatchSnapshot("ProductItem с корзиной");
  });
});
