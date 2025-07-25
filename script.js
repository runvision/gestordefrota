const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const list = document.getElementById('transaction-list');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const balanceEl = document.getElementById('balance');
const salaryInput = document.getElementById('salary');
const essentialsEl = document.getElementById('essentials');
const wantsEl = document.getElementById('wants');
const savingsEl = document.getElementById('savings');

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let salary = 0;

function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const income = amounts.filter(v => v > 0).reduce((a, b) => a + b, 0);
    const expense = amounts.filter(v => v < 0).reduce((a, b) => a + b, 0);
    const total = income + expense;

    incomeEl.textContent = `+ R$ ${income.toFixed(2)}`;
    expenseEl.textContent = `- R$ ${Math.abs(expense).toFixed(2)}`;
    balanceEl.textContent = `R$ ${total.toFixed(2)}`;

    if (salary > 0) {
        const essentials = salary * 0.5;
        const wants = salary * 0.3;
        const savings = salary * 0.2;

        essentialsEl.textContent = `+ R$ ${essentials.toFixed(2)}`;
        wantsEl.textContent = `+ R$ ${wants.toFixed(2)}`;
        savingsEl.textContent = `+ R$ ${savings.toFixed(2)}`;
    }
}

function renderTransactions() {
    list.innerHTML = "";
    transactions.forEach((t, i) => {
        const li = document.createElement('li');
        li.classList.add(t.amount >= 0 ? 'positive' : 'negative');
        li.innerHTML = `
      ${t.desc} <span>R$ ${t.amount.toFixed(2)}</span>
      <button onclick="removeTransaction(${i})" title="Remover">❌</button>
    `;
        list.appendChild(li);
    });
    updateValues();
}

function removeTransaction(index) {
    transactions.splice(index, 1);
    saveData();
    renderTransactions();
}

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!desc || isNaN(amount)) return;

    transactions.push({ desc, amount });
    saveData();
    renderTransactions();

    descInput.value = "";
    amountInput.value = "";
});

salaryInput.addEventListener('input', () => {
    salary = parseFloat(salaryInput.value);
    updateValues();
});

function exportToCSV() {
    const rows = [
        ["Descrição", "Valor", "Categoria", "Data"],
        ...transactions.map(t => [
            t.desc,
            t.amount.toFixed(2),
            t.amount >= 0 ? "Receita" : "Despesa",
            new Date().toLocaleDateString(),
        ])
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(row => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transacoes.csv');
    link.click();
}

document.getElementById('export-btn').addEventListener('click', exportToCSV);

renderTransactions();
