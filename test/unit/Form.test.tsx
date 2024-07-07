import { render, screen } from "@testing-library/react";
import { Form } from "../../src/client/components/Form";
import React from "react";
import userEvent from "@testing-library/user-event";
import { CheckoutFormData } from "../../src/common/types";

async function typeAndSubmit(data: CheckoutFormData) {
  const user = userEvent.setup();

  data.name && (await user.type(screen.getByLabelText("Name"), data.name));
  data.phone && (await user.type(screen.getByLabelText("Phone"), data.phone));
  data.address &&
    (await user.type(screen.getByLabelText("Address"), data.address));

  await user.click(screen.getByRole("button"));
}
const validData: CheckoutFormData = {
  name: "Владимир Путин",
  phone: "8002004040",
  address: "Московский Кремль, Манежная улица, 2-10, Москва",
};
describe("Форма заказа", () => {
  it("содержит поля для имени, номера телефона и адреса и кнопку checkout", () => {
    render(<Form onSubmit={jest.fn()} />);

    expect(screen.getByLabelText("Name").tagName).toBe("INPUT");
    expect(screen.getByLabelText("Phone").tagName).toBe("INPUT");
    expect(screen.getByLabelText("Address").tagName).toBe("TEXTAREA");
    expect(screen.getByRole("button")).toHaveTextContent("Checkout");
  });
  // тут баг в проекте, считывается только первая буква адреса, поэтому тест всегда падает
  it("если всё ввести и нажать кнопку, то вызовет колбэк с введенными данными", async () => {
    const onSubmit = jest.fn();
    render(<Form onSubmit={onSubmit} />);

    await typeAndSubmit(validData);

    expect(onSubmit).toHaveBeenLastCalledWith(validData);
  });
  it("если оставить пустое имя, то об этом сообщение при сабмите + колбэк не выполняется", async () => {
    const onSubmit = jest.fn();
    render(<Form onSubmit={onSubmit} />);

    await typeAndSubmit({ ...validData, name: "" });

    expect(screen.getByLabelText("Name")).toHaveClass("is-invalid");
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("если оставить неправильный телефон, то об этом сообщение при сабмите + колбэк не выполняется", async () => {
    const onSubmit = jest.fn();
    render(<Form onSubmit={onSubmit} />);

    await typeAndSubmit({ ...validData, phone: "bipki)" });

    expect(screen.getByLabelText("Phone")).toHaveClass("is-invalid");
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("если оставить пустой адрес, то об этом сообщение при сабмите + колбэк не выполняется", async () => {
    const onSubmit = jest.fn();
    render(<Form onSubmit={onSubmit} />);

    await typeAndSubmit({ ...validData, address: "" });

    expect(screen.getByLabelText("Address")).toHaveClass("is-invalid");
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
