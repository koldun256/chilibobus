import { render, screen } from "@testing-library/react";
import { CartApi, ExampleApi } from "../../src/client/api";
import { addToCart, initStore } from "../../src/client/store";
import { BrowserRouter } from "react-router-dom";
import React, { act } from "react";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";
const product1 = {
  id: 69,
  name: "bipki",
  price: 420,
  description: "lorem",
  material: "ipsum",
  color: "doret",
};
const product2 = {
  id: 70,
  name: "bipki",
  price: 420,
  description: "lorem",
  material: "ipsum",
  color: "doret",
};
function renderNavbar() {
  localStorage.clear();
  const api = new ExampleApi("/hw/store");
  const cart = new CartApi();
  const store = initStore(api, cart);
  const { container } = render(
    <BrowserRouter>
      <Provider store={store}>
        <Application />
      </Provider>
    </BrowserRouter>
  );

  return { store, container: container.querySelector(".navbar") };
}

describe("Навбар", () => {
  it("отображает ссылки на главную, контакты, корзину, доставку, каталог", () => {
    const { container } = renderNavbar();
    const links = [...container?.querySelectorAll("a")].map((a) =>
      a.getAttribute("href")
    );

    expect(links).toContain("/");
    expect(links).toContain("/catalog");
    expect(links).toContain("/delivery");
    expect(links).toContain("/contacts");
    expect(links).toContain("/cart");
  });

  it("отображает количество различных товаров в корзине", () => {
    const { store } = renderNavbar();

    act(() => store.dispatch(addToCart(product1)));
    act(() => store.dispatch(addToCart(product1)));
    act(() => store.dispatch(addToCart(product2)));

    expect(screen.getByText(/cart \(2\)/i)).toBeInTheDocument();
  });
});
