let frota = JSON.parse(localStorage.getItem("frota")) || [];

function salvar() {
    localStorage.setItem("frota", JSON.stringify(frota));
}

function cadastrarVeiculo() {
    const placa = document.getElementById("placa").value;
    const modelo = document.getElementById("modelo").value;

    if (!placa || !modelo) return alert("Preencha todos os campos");

    frota.push({
        placa,
        modelo,
        registros: []
    });

    salvar();
    atualizarSelect();
    alert("Veículo cadastrado com sucesso!");
}

function atualizarSelect() {
    const select = document.getElementById("veiculoSelect");
    select.innerHTML = "";
    frota.forEach((v, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${v.placa} - ${v.modelo}`;
        select.appendChild(opt);
    });
}

function registrar() {
    const i = document.getElementById("veiculoSelect").value;
    const km = Number(document.getElementById("km").value);
    const custo = Number(document.getElementById("custo").value);
    const tipo = document.getElementById("tipo").value;

    if (!km || !custo) return alert("Preencha os dados corretamente");

    frota[i].registros.push({
        km,
        custo,
        tipo,
        data: new Date().toLocaleDateString()
    });

    salvar();
    calcularKPIs();
    gerarAlertas();
}

function calcularKPIs() {
    let totalKm = 0;
    let totalCusto = 0;
    let preventiva = 0;
    let corretiva = 0;

    frota.forEach(v => {
        v.registros.forEach(r => {
            totalKm += r.km;
            totalCusto += r.custo;
            if (r.tipo === "preventiva") preventiva++;
            if (r.tipo === "corretiva") corretiva++;
        });
    });

    const custoKm = totalKm ? (totalCusto / totalKm).toFixed(2) : 0;

    document.getElementById("kpis").innerHTML = `
    <p><b>Total de veículos:</b> ${frota.length}</p>
    <p><b>Custo total:</b> R$ ${totalCusto.toFixed(2)}</p>
    <p><b>Custo por km:</b> R$ ${custoKm}</p>
    <p><b>Manutenção preventiva:</b> ${preventiva}</p>
    <p><b>Manutenção corretiva:</b> ${corretiva}</p>
  `;
}

function gerarAlertas() {
    const lista = document.getElementById("alertas");
    lista.innerHTML = "";

    frota.forEach(v => {
        const corretivas = v.registros.filter(r => r.tipo === "corretiva").length;
        if (corretivas >= 3) {
            const li = document.createElement("li");
            li.textContent = `Veículo ${v.placa} tem muitas manutenções corretivas. Avaliar preventiva.`;
            lista.appendChild(li);
        }
    });
}

function gerarPDF() {
    window.print();
}

atualizarSelect();
calcularKPIs();
gerarAlertas();
