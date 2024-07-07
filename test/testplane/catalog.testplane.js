const products = [
  {
    id: 0,
    name: "Fantastic kogtetochk",
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
describe("каталог", () => {
  it("что приходит с сервера, то и рендерится", async ({ browser }) => {
    const mock = await browser.mock(
      "http://localhost:3000/hw/store/api/products",
      { method: "get" }
    );
    mock.respond(() => products);

    await browser.url("http://localhost:3000/hw/store/catalog");

    await browser.assertView("plain", "body");
  });
});
