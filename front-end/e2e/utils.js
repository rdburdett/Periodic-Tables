async function selectOptionByText(page, name, optionText) {
  const optionWaned = (
    await page.$x(`//*[@name = "${name}"]/option[text() = "${optionText}"]`)
  )[0];
  const optionValue = await (
    await optionWaned.getProperty("value")
  ).jsonValue();

  return await page.select(`[name=${name}`, optionValue);
}

function containsText(page, selector, expected) {
  // console.log("Checking for contains text...")
  // return selector
  return page.evaluate(
    (selector, expected) => {
      // console.log("selector: ", selector, "expected: ", expected)
      return document
        .querySelector(selector)
        .innerText.toLowerCase()
        .includes(expected);
    },
    selector,
    expected
  );
}

module.exports = {
  containsText,
  selectOptionByText,
};
