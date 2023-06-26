import { openDB } from "./config/db.js";
import { coinEmitter } from "./emitters/coin_emitter.js";
import { SELECT_AVG_PRICE } from "./config/queries.js";
import { CREATE_TABLE_BTC_VALUE, INSERT_BTC_READ } from "./config/queries.js";

console.log("Iniciando leituras...");

/**
 * Formatador capaz de formatar um número
 * no padrão de moeda brasileiro.
 */
const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "usd",
});

/**
 * Listener que é acionado toda vez que
 * o coin emitter emite o preço atual
 * do Bitcoin.
 */
coinEmitter.on("btc_read", (price) => {
  const time = new Date().toISOString();
  const formattedPrice = moneyFormatter.format(price);
  console.log(`Preço do Bitcoin em ${time} -> U$ ${formattedPrice}`);
});
/**
 * Abaixo, crie o código necessário para salvar
 * o novo preço lido do Bitcoin na tabela btc_value.
 * Após, crie o código necessário para executar uma
 * consulta na tabela btc_value que retorne o valor
 * médio do Bitcoin desde a primeira leitura.
 */
const btc_data = [
  {
    id: ``,
    read_time: `time`,
    price: `formattedPrice`,
  },
];

(async () => {
  const db = await openDB();
  await db.exec(CREATE_TABLE_BTC_VALUE);

  for (let i = 0; i < btc_data.length; i++) {
    const { id, read_time, price } = btc_data[i];

    await db.run(INSERT_BTC_READ, id, read_time, price, function (err) {
      if (err) {
        console.error("Erro ao inserir o novo preço:", err.message);
      } else {
        console.log("Novo preço do Bitcoin salvo com sucesso!");
      }

      console.log(`Valor registrado`);
    })
  }
})();

(async () => {
  const db = await openDB();

  let results = await db.all(SELECT_AVG_PRICE);
  console.log(results);

  db.get(results, [], function (err, row) {
    if (err) {
      console.error("Erro ao executar a consulta:", err.message);
    } else {
      console.log("Valor médio do Bitcoin:", row.average);
    }
  })
})();


/*
const sqlite3 = require("sqlite3").verbose();

// Criando uma conexão com o banco de dados
const db = new sqlite3.Database("bitcoin_prices.db");

// Lendo o novo preço do Bitcoin
const novoPrecoBitcoin = 10000; // Substitua pelo valor lido


/*
 * Observação final:
 *
 * Implemente este script de tal forma que,
 * caso ele seja interrompido e posteriormente
 * executado novamente, não haja problemas
 * de conflito de chaves primárias na tabela
 * btc_value.
 */