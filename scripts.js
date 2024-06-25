const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");
const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p span");
const expensesTotal = document.querySelector("aside header h2");

amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");
  value = Number(value) / 100;
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "Remover despesa");

    expenseInfo.append(expenseName, expenseCategory);

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    expenseList.append(expenseItem);

    formClear();
    updateTotals();
  } catch (error) {
    console.log(error);
    alert("Erro ao adicionar despesa");
  }
}

function updateTotals() {
  try {
    const items = expenseList.children;

    expensesQuantity.textContent =
      items.length > 1 ? `${items.length} despesas` : `${items.length} despesa`;

    let total = 0;

    for (let item = 0; item < items.length; item++) {
      const itemAmout = items[item].querySelector(".expense-amount");

      let value = itemAmout.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");
      value = parseFloat(value);

      if (isNaN(value)) {
        return alert("Erro ao calcular total");
      }

      total += value;
    }

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");
    expensesTotal.innerHTML = "";

    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    console.log(error);
    alert("Erro ao atualizar totais");
  }
}

expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense");
    item.remove();
  }

  updateTotals();
});

function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}
