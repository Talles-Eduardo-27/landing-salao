// Troque pelo número do cliente: 55 + DDD + número, só dígitos
const WHATSAPP = "5585900000000";
// Funcionamento: dias da semana (0 = domingo) e horas de abertura e fechamento
const DIAS = [2, 3, 4, 5, 6];
const ABRE = 9;
const FECHA = 19;
const SABADO = null; // [abre, fecha] no sábado, se for diferente
const HORARIOS = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

const servicos = [
  {"cat": "cabelo", "emoji": "✂️", "nome": "Corte feminino", "desc": "Corte com lavagem e finalização.", "preco": 70},
  {"cat": "cabelo", "emoji": "💇", "nome": "Escova modelada", "desc": "Escova lisa ou com movimento.", "preco": 55},
  {"cat": "cabelo", "emoji": "🎨", "nome": "Coloração", "desc": "Raiz ou global, com tinta profissional.", "preco": 140},
  {"cat": "cabelo", "emoji": "✨", "nome": "Hidratação profunda", "desc": "Tratamento com máscara e ampola.", "preco": 80},
  {"cat": "unhas", "emoji": "💅", "nome": "Mão", "desc": "Cutilagem e esmaltação.", "preco": 30},
  {"cat": "unhas", "emoji": "🦶", "nome": "Pé e mão", "desc": "O combo mais pedido da casa.", "preco": 55},
  {"cat": "estetica", "emoji": "🌸", "nome": "Design de sobrancelha", "desc": "Com henna opcional.", "preco": 40},
  {"cat": "estetica", "emoji": "🧖", "nome": "Limpeza de pele", "desc": "Higienização e hidratação.", "preco": 120}
];

const real = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const linkWhats = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

// Lista de serviços com filtro
const lista = document.getElementById("itens");
function mostrar(cat) {
  lista.innerHTML = servicos
    .filter((s) => cat === "todos" || s.cat === cat)
    .map((s) => `
      <article class="item">
        <span class="emoji">${s.emoji}</span>
        <h3>${s.nome}</h3>
        <p>${s.desc}</p>
        <div class="linha">
          <span class="preco">${s.preco ? real(s.preco) : "No plano"}</span>
          <button data-nome="${s.nome}">Agendar</button>
        </div>
      </article>`)
    .join("");
}
mostrar("todos");
document.querySelectorAll(".filtro").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelector(".filtro.ativo").classList.remove("ativo");
    b.classList.add("ativo");
    mostrar(b.dataset.cat);
  })
);

// Horário de Fortaleza
function agoraFortaleza() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/Fortaleza", weekday: "short", hour: "numeric", hour12: false, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date()).map((x) => [x.type, x.value]));
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  return { dia, hora: Number(p.hour) % 24, data: `${p.year}-${p.month}-${p.day}` };
}
function janela(dia) {
  if (dia === 6 && SABADO) return SABADO;
  return DIAS.includes(dia) ? [ABRE, FECHA] : null;
}

// Aberto agora?
const status = document.getElementById("status");
const ag = agoraFortaleza();
const hoje = janela(ag.dia);
const aberto = hoje && ag.hora >= hoje[0] && ag.hora < hoje[1];
status.textContent = aberto ? "● Aberto agora" : "● Fechado agora";
status.classList.add(aberto ? "aberto" : "fechado");

// Agendamento: próximos dias de funcionamento
const selServico = document.getElementById("f-servico");
const selDia = document.getElementById("f-dia");
const horas = document.getElementById("horas");
const resumo = document.getElementById("resumo");
let horaEscolhida = "";

selServico.innerHTML = servicos.map((s) => `<option>${s.nome}</option>`).join("");
const nomesDias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const base = new Date(ag.data + "T12:00:00");
const opcoes = [];
for (let i = 0; opcoes.length < 6 && i < 14; i++) {
  const d = new Date(base); d.setDate(base.getDate() + i);
  if (!janela(d.getDay())) continue;
  const rot = (i === 0 ? "hoje, " : i === 1 ? "amanhã, " : "") + nomesDias[d.getDay()] + " " + d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  opcoes.push({ rot, dia: d.getDay(), hoje: i === 0 });
}
selDia.innerHTML = opcoes.map((o, i) => `<option value="${i}">${o.rot}</option>`).join("");

function montaHoras() {
  const o = opcoes[Number(selDia.value) || 0];
  const j = janela(o.dia);
  const livres = HORARIOS.filter((h) => {
    const hh = Number(h.slice(0, 2));
    return hh >= j[0] && hh < j[1] && (!o.hoje || hh > ag.hora);
  });
  horaEscolhida = "";
  horas.innerHTML = livres.length
    ? livres.map((h) => `<button type="button" data-h="${h}">${h}</button>`).join("")
    : "<span class=\"resumo\">Sem horários livres neste dia.</span>";
  atualiza();
}
horas.addEventListener("click", (e) => {
  const h = e.target.dataset.h;
  if (!h) return;
  horas.querySelectorAll("button").forEach((b) => b.classList.toggle("ativo", b.dataset.h === h));
  horaEscolhida = h;
  atualiza();
});
function atualiza() {
  const o = opcoes[Number(selDia.value) || 0];
  resumo.textContent = horaEscolhida ? `${selServico.value} · ${o.rot} às ${horaEscolhida}` : "Escolha um horário.";
}
selDia.addEventListener("change", montaHoras);
selServico.addEventListener("change", atualiza);
montaHoras();

// Botão "Agendar" de cada serviço já escolhe o serviço no formulário
lista.addEventListener("click", (e) => {
  const nome = e.target.dataset.nome;
  if (!nome) return;
  selServico.value = nome;
  atualiza();
  document.getElementById("agenda").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("f-nome").value.trim();
  const extra = "";
  if (!horaEscolhida) { resumo.textContent = "Escolha um horário para continuar."; return; }
  if (!nome) { resumo.textContent = "Diga seu nome para a confirmação."; return; }
  const o = opcoes[Number(selDia.value) || 0];
  const msg = `Olá! Sou ${nome} e quero agendar: ${selServico.value}, ${o.rot} às ${horaEscolhida}.` + (extra ? ` : ${extra}.` : "");
  window.open(linkWhats(msg), "_blank", "noopener");
});

// Botões de WhatsApp da página
document.querySelectorAll(".js-whats").forEach((a) => {
  a.href = linkWhats("Olá! Vim pelo site e quero agendar um horário.");
  a.target = "_blank";
  a.rel = "noopener";
});

// Menu no celular
const btn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
btn.addEventListener("click", () => {
  const abriu = menu.classList.toggle("aberto");
  btn.setAttribute("aria-expanded", abriu);
});
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") menu.classList.remove("aberto");
});
