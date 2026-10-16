
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let finished = false;

function updateDisplay(value) {
  display.value = value || "0";
}

buttons.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (action === "clear") {
    expression = "";
    finished = false;
    updateDisplay("0");
    return;
  }

  if (action === "delete") {
    expression = finished ? "" : expression.slice(0, -1);
    finished = false;
    updateDisplay(expression);
    return;
  }

  if (action === "calculate") {
    try {
      if (!expression || !/^[0-9+\-*/.() ]+$/.test(expression)) {
        throw new Error("Invalid expression");
      }

      const result = Function(
        '"use strict"; return (' + expression + ')'
      )();

      if (!Number.isFinite(result)) {
        throw new Error("Invalid result");
      }

      expression = String(
        Math.round((result + Number.EPSILON) * 1e10) / 1e10
      );
      finished = true;
      updateDisplay(expression);
    } catch {
      expression = "";
      finished = false;
      updateDisplay("Error");
    }
    return;
  }

  if (value !== undefined) {
    if (finished) {
      expression = "";
      finished = false;
    }

    if (expression === "0" && /[0-9]/.test(value)) {
      expression = value;
    } else {
      expression += value;
    }

    updateDisplay(expression);
  }
});
