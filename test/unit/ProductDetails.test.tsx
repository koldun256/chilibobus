import React, { act } from "react";
import { ProductDetails } from "../../src/client/components/ProductDetails";
import { render, screen } from "@testing-library/react";
import { addToCart, initStore } from "../../src/client/store";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { CartApi, ExampleApi } from "../../src/client/api";
import userEvent from "@testing-library/user-event";

const product = {
  id: 69,
  name: "bipki",
  price: 420,
  description: "lorem",
  material: "ipsum",
  color: "doret",
};
function renderProductDetails() {
  localStorage.clear();
  const api = new ExampleApi("/hw/store");
  const cart = new CartApi();
  const store = initStore(api, cart);
  const { container } = render(
    <BrowserRouter>
      <Provider store={store}>
        <ProductDetails product={product} />
      </Provider>
    </BrowserRouter>
  );
  return { store, container };
}
describe("Страница с подробностями о товаре", () => {
  it("показывает информацию о товаре", () => {
    const { container } = renderProductDetails();

    expect(container).toMatchSnapshot("ProductDetails без корзины");
  });
  it("при добавлении в корзину отображает соответствующий индикатор", () => {
    const { container, store } = renderProductDetails();

    act(() => store.dispatch(addToCart(product)));

    expect(container).toMatchSnapshot("ProductDetails с корзиной");
  });
  it("добавляет товар в корзину при клике на кнопку", async () => {
    const { store } = renderProductDetails();
    const user = userEvent.setup();

    await user.click(screen.getByText(/add to cart/i));
    await user.click(screen.getByText(/add to cart/i));

    expect(store.getState().cart).toEqual({
      [product.id]: { name: product.name, count: 2, price: product.price },
    });
  });
});
