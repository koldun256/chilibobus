import { render } from "@testing-library/react";
import React from "react";
import { Home } from "../../src/client/pages/Home";

test("Главная страница отображает нужную информацию", () => {
  const { container } = render(<Home />);
  expect(container).toMatchSnapshot("Главная страница");
});
