import { render, screen } from "@testing-library/react";
import React from "react";
import { CartApi, ExampleApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { MemoryRouter, useParams } from "react-router-dom";
import { Provider } from "react-redux";
import { Application } from "../../src/client/Application";
import { Contacts } from "../../src/client/pages/Contacts";
import { Cart } from "../../src/client/pages/Cart";
import { Catalog } from "../../src/client/pages/Catalog";
import { Delivery } from "../../src/client/pages/Delivery";
import { Product } from "../../src/client/pages/Product";

jest.mock("../../src/client/pages/Cart");
jest.mock("../../src/client/pages/Catalog");
jest.mock("../../src/client/pages/Contacts");
jest.mock("../../src/client/pages/Delivery");
jest.mock("../../src/client/pages/Home");
jest.mock("../../src/client/pages/Product");

function renderUrl(url: string) {
  const api = new ExampleApi("/hw/store");
  const cart = new CartApi();
  const store = initStore(api, cart);
  render(
    <MemoryRouter basename={"/hw/store"} initialEntries={[url]}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );
}
describe("Роутинг", () => {
  it("url /cart содержит компонент Cart", () => {
    jest.mocked(Cart).mockImplementation(() => <div>Mocked Cart</div>);
    renderUrl("/hw/store/cart");
    expect(screen.getByText("Mocked Cart")).toBeInTheDocument();
  });
  it("url /catalog содержит компонент Catalog", () => {
    jest.mocked(Catalog).mockImplementation(() => <div>Mocked Catalog</div>);
    renderUrl("/hw/store/catalog");
    expect(screen.getByText("Mocked Catalog")).toBeInTheDocument();
  });
  it("url /contacts содержит компонент Contacts", () => {
    jest.mocked(Contacts).mockImplementation(() => <div>Mocked Contacts</div>);
    renderUrl("/hw/store/contacts");
    expect(screen.getByText("Mocked Contacts")).toBeInTheDocument();
  });
  it("url /delivery содержит компонент Delivery", () => {
    jest.mocked(Delivery).mockImplementation(() => <div>Mocked Delivery</div>);
    renderUrl("/hw/store/delivery");
    expect(screen.getByText("Mocked Delivery")).toBeInTheDocument();
  });
  it("url /catalog/:id содержит компонент Product с нужным id", () => {
    jest.mocked(Product).mockImplementation(() => {
      const params = useParams();
      return <div>Mocked Product {params.id}</div>;
    });

    renderUrl("/hw/store/catalog/69");

    expect(screen.getByText("Mocked Product 69")).toBeInTheDocument();
  });
});
