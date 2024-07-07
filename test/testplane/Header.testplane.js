describe("хэдер", () => {
  it("гамбургер на узких экранах(сворачивается и опять разворачивается)", async ({
    browser,
  }) => {
    await browser.url("http://localhost:3000/hw/store/");
    await browser.setWindowSize(500, 700);

    await browser.assertView("гамбургер)))", "nav");

    await browser.$(".navbar-toggler").click();
    await browser.assertView("гамбургер (развёрнутый)))", "nav");
  });
});
