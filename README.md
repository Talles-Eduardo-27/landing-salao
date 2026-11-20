# Flor de Mandacaru · Landing page de salão de beleza

Site de uma página para um(a) salão de beleza fictício(a) no Bairro de Fátima, em Fortaleza. Serve de demonstração para negócios locais que ainda dependem só do Instagram ou do WhatsApp.

🔗 **Ver ao vivo:** https://talles-eduardo-27.github.io/landing-salao/

> Feito com IA (Claude) e revisado por mim. Uso este site como modelo para mostrar a clientes; o negócio, o endereço e os valores são fictícios.

## O problema

O cliente quer saber preço, horário e se tem vaga, e desiste quando precisa esperar resposta no direct.

## A solução

- **Lista de serviços com filtro** (corte feminino, escova modelada, coloração, hidratação profunda...) gerada a partir de um array em `script.js`, fácil de editar
- **Agendamento em 3 passos**: serviço, dia e horário; o pedido vai pronto para o WhatsApp do negócio
- **Só mostra dias e horários de funcionamento**, e esconde os horários que já passaram hoje
- **"Aberto agora / Fechado"** calculado pelo fuso de Fortaleza
- **Responsivo**, com menu próprio para celular, e ilustração feita só com CSS (carrega rápido)

## Tecnologias

HTML5 · CSS3 (Grid, Flexbox, variáveis, animações) · JavaScript puro (Intl, DOM, eventos)

## Como adaptar para um cliente

1. Em `script.js`: troque `WHATSAPP`, os dias e horários (`DIAS`, `ABRE`, `FECHA`, `HORARIOS`) e a lista `servicos`
2. Em `index.html`: troque nome, endereço e textos
3. Em `style.css`: troque as cores nas variáveis do `:root`

## O que este projeto pratica

- Gerar a página a partir de dados com `map` e `filter`
- Formulário com validação simples e link do WhatsApp com `encodeURIComponent`
- Datas e fuso horário com `Intl.DateTimeFormat`
- CSS organizado com variáveis e media queries

---

Projeto de portfólio de [Talles Eduardo](https://github.com/Talles-Eduardo-27).

## Prévia para um negócio de verdade

Acrescente `?n=Nome do negócio&b=Bairro` ao link (exemplo: `?n=Studio%20Exemplo&b=Messejana`). A página mostra o nome e o bairro, avisa no topo que é uma prévia e troca a história, os números e o endereço do exemplo por avisos; serviços, preços e fotos continuam sendo exemplos. O teste pelo WhatsApp chega no número do Talles, marcado como teste. Na versão de um cliente, troque `WHATSAPP` pelo número dele.
