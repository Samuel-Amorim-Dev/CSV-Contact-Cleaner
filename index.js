const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");

// CONFIGURAÇÕES
const BASE_URL = "https://rupesdtcomercial.atenderbem.com";
const QUEUE_ID = 20;
const API_KEY = "123";
const CSV_FILE_PATH = "addressbook (20).csv";

const SIMULATION_MODE = false; // true = não apaga | false = apaga
const REQUEST_DELAY_MS = 1;

// CONTADORES E LOGS
let totalContacts = 0;
let deletedContacts = 0;

const report = {
    semNome: [],
    semNumero: [],
    nomeDuplicado: [],
    numeroDuplicado: [],
    erros: []
};

// DELAY
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// NORMALIZAÇÃO
function normalizeName(name) {
    if (!name) return "";
    return name.toString().toLowerCase().trim();
}

function normalizeNumber(number) {
    if (!number) return "";
    return number.toString().replace(/\D/g, "").trim();
}

// REMOVE BOM
function removeBOM(value) {
    if (typeof value !== "string") return value;
    return value.replace(/^\uFEFF/, "");
}

// LEITURA DO CSV
function readCsv() {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(CSV_FILE_PATH)
            .pipe(
                csv({
                    separator: ";",
                    mapHeaders: ({ header }) => removeBOM(header)
                })
            )
            .on("data", (data) => {
                results.push({
                    id: Number(data.id || data.ID),
                    name: data.name || data.Nome || data.nome || "",
                    number: data.number || data.Número || data.Numero || data.Telefone || ""
                });
            })
            .on("end", () => resolve(results))
            .on("error", reject);
    });
}

// EXCLUIR CONTATO
async function deleteContact(contactId) {
    try {
        await axios.post(`${BASE_URL}/int/deleteContact`, {
            queueId: QUEUE_ID,
            apiKey: API_KEY,
            contactId
        });

        deletedContacts++;
        console.log(`Contato ${contactId} removido com sucesso`);
    } catch (error) {
        console.error(`Erro ao remover contato ${contactId}`);
        report.erros.push({
            contactId,
            error: error.message
        });
    }
}

// EXECUÇÃO PRINCIPAL
async function execute() {
    console.log("Iniciando validação de contatos");

    if (SIMULATION_MODE) {
        console.log("Modo simulação ativo. Nenhum contato será removido");
    }

    const contacts = await readCsv();
    totalContacts = contacts.length;

    console.log(`Total de contatos carregados: ${totalContacts}`);

    const nameMap = new Map();
    const numberMap = new Map();

    for (const contact of contacts) {
        if (!contact.id) continue;

        const nameKey = normalizeName(contact.name);
        const numberKey = normalizeNumber(contact.number);

        // REGRA 1: sem nome
        if (!nameKey) {
            report.semNome.push(contact);
            console.log(
                `REGRA: SEM NOME | ID: ${contact.id} | Número: ${contact.number || "SEM NÚMERO"}`
            );
            continue;
        }

        // REGRA 2: sem número
        if (!numberKey) {
            report.semNumero.push(contact);
            console.log(
                `REGRA: SEM NÚMERO | ID: ${contact.id} | Nome: ${contact.name}`
            );
            continue;
        }

        // REGRA 3: nome duplicado
        if (nameMap.has(nameKey)) {
            report.nomeDuplicado.push(contact);
            console.log(
                `REGRA: NOME DUPLICADO | ID: ${contact.id} | Nome: ${contact.name} | Número: ${contact.number}`
            );
            continue;
        }

        // REGRA 4: número duplicado
        if (numberMap.has(numberKey)) {
            report.numeroDuplicado.push(contact);
            console.log(
                `REGRA: NÚMERO DUPLICADO | ID: ${contact.id} | Nome: ${contact.name} | Número: ${contact.number}`
            );
            continue;
        }

        nameMap.set(nameKey, contact.id);
        numberMap.set(numberKey, contact.id);
    }

    const contatosParaExcluir = [
        ...report.semNome,
        ...report.semNumero,
        ...report.nomeDuplicado,
        ...report.numeroDuplicado
    ];

    for (const contact of contatosParaExcluir) {
        if (!SIMULATION_MODE) {
            await deleteContact(contact.id);
            await delay(REQUEST_DELAY_MS);
        }
    }

    // RELATÓRIO FINAL
    console.log("==================================");
    console.log("RELATÓRIO FINAL");
    console.log(`Total de contatos analisados: ${totalContacts}`);
    console.log(`Sem nome: ${report.semNome.length}`);
    console.log(`Sem número: ${report.semNumero.length}`);
    console.log(`Nome duplicado: ${report.nomeDuplicado.length}`);
    console.log(`Número duplicado: ${report.numeroDuplicado.length}`);

    if (SIMULATION_MODE) {
        console.log("Modo simulação ativo. Nenhum contato foi removido");
    } else {
        console.log(`Total de contatos removidos: ${deletedContacts}`);
    }

    console.log(`Erros ao remover: ${report.erros.length}`);
    console.log("Processo finalizado");
}

// INICIAR
execute();
