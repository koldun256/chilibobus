import { Provider } from "react-redux";
import { Cart } from "../../src/client/pages/Cart";
import { BrowserRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";
import React, { useEffect } from "react";
import { addToCart, checkoutComplete, initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";
import userEvent from "@testing-library/user-event";
import { Form } from "../../src/client/components/Form";
import axios from "axios";

jest.mock("../../src/client/components/Form.tsx");
jest.mock("axios");
const product = {
  id: 69,
  name: "bipki",
  price: 420,
  description: "lorem",
  material: "ipsum",
  color: "doret",
};
function renderCart(api = new ExampleApi("/hw/store")) {
  localStorage.clear();
  const cart = new CartApi();
  const store = initStore(api, cart);
  const { container } = render(
    <BrowserRouter>
      <Provider store={store}>
        <Cart />
      </Provider>
    </BrowserRouter>
  );

  return { store, container };
}
describe("Корзина", () => {
  it("когда коризна пустая, есть сообщение об этом", () => {
    renderCart();

    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });
  it("таблица с товарами отображается как надо", () => {
    const { store, container } = renderCart();

    act(() => store.dispatch(addToCart(product)));
    act(() => store.dispatch(addToCart(product)));

    expect(container.querySelector(".Cart-Table")).toMatchSnapshot();
  });
  it("кнопка 'отчистить корзину' отчищает корзину", async () => {
    const { store, container } = renderCart();
    const user = userEvent.setup();

    act(() => store.dispatch(addToCart(product)));
    act(() => store.dispatch(addToCart(product)));
    await user.click(container.querySelector(".Cart-Clear")!);

    expect(store.getState().cart).toEqual({});
  });
  // я сидел тут 2 часа и так и не понял, что я не обернул в act. Если в курсе как пофиксить, напиши в issue пж
  it("отправляет запрос и обновляет store.latestOrderId", async () => {
    const formData = {
      name: "Владимир Путин",
      phone: "8002004040",
      address: "Московский Кремль, Манежная улица, 2-10, Москва",
    };
    jest.mocked(Form).mockImplementation(({ onSubmit }) => {
      useEffect(() => {
        onSubmit(formData);
      }, []);
      return <div>Mocked Form</div>;
    });
    jest.mocked(axios).post.mockResolvedValue({ data: { id: 52 } });
    const { store } = renderCart();

    act(() => store.dispatch(addToCart(product)));

    await new Promise((r) => setTimeout(r, 200));
    expect(axios.post).toHaveBeenCalledWith("/hw/store/api/checkout", {
      cart: {
        [product.id]: { count: 1, name: product.name, price: product.price },
      },
      form: formData,
    });
    expect(store.getState().latestOrderId).toBe(52);
  });
  it("показывает плашку с последним заказом когда установлен state.latestOrderId", () => {
    const { store, container } = renderCart();

    act(() => store.dispatch(checkoutComplete(52)));

    expect(container.querySelector(".Cart-SuccessMessage")).toMatchSnapshot();
  });
});
