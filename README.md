# CSV Contact Cleaner

Script em **Node.js** para analisar uma base de contatos em CSV, identificar inconsistências e remover contatos inválidos através de uma API.

O script valida automaticamente os contatos e remove aqueles que não atendem aos critérios definidos.

## Funcionalidades

O sistema analisa todos os contatos do CSV e aplica as seguintes regras de validação:

1. Contatos sem nome
2. Contatos sem número
3. Contatos com nome duplicado
4. Contatos com número duplicado

Todos os contatos que se enquadrarem nessas regras são adicionados a uma lista de exclusão e removidos utilizando a API configurada.

Também é possível executar o script em **modo simulação**, onde nenhuma exclusão é feita. Nesse modo o sistema apenas mostra quais contatos seriam removidos.

## Tecnologias utilizadas

* Node.js
* Axios
* csv-parser
* File System (fs)

## Estrutura do projeto

```
project
│
├─ index.js
├─ package.json
└─ addressbook.csv
```

## Instalação

1. Clone o repositório

```
git clone https://github.com/seuusuario/seurepositorio.git
```

2. Acesse a pasta do projeto

```
cd seurepositorio
```

3. Instale as dependências

```
npm install
```

## Dependências utilizadas

```
npm install axios csv-parser
```

## Configuração

No início do arquivo existem algumas configurações importantes:

```
const BASE_URL = "https://sua-api.com";
const QUEUE_ID = 20;
const API_KEY = "123";
const CSV_FILE_PATH = "addressbook.csv";

const SIMULATION_MODE = false;
const REQUEST_DELAY_MS = 1;
```

### Parâmetros

**BASE_URL**

URL base da API responsável por remover os contatos.

**QUEUE_ID**

Identificador da fila utilizada na API.

**API_KEY**

Chave de autenticação utilizada na requisição.

**CSV_FILE_PATH**

Caminho do arquivo CSV contendo os contatos.

**SIMULATION_MODE**

true → apenas simula as exclusões
false → remove os contatos de fato

**REQUEST_DELAY_MS**

Delay entre requisições para evitar sobrecarga na API.

## Estrutura esperada do CSV

O CSV deve utilizar **; como separador**.

Exemplo:

```
id;name;number
1;João Silva;5511999999999
2;Maria Souza;5511988888888
3;;5511977777777
```

O script também tenta reconhecer variações de cabeçalhos comuns:

* name / Nome / nome
* number / Número / Numero / Telefone

## Como executar

Execute o script com:

```
node index.js
```

## Exemplo de saída no terminal

```
Iniciando validação de contatos
Total de contatos carregados: 5000

REGRA: SEM NOME | ID: 102 | Número: 551199999999
REGRA: NOME DUPLICADO | ID: 245 | Nome: João Silva | Número: 551188888888

Contato 245 removido com sucesso
Contato 102 removido com sucesso
```

## Relatório final

Ao final da execução o sistema apresenta um resumo:

```
RELATÓRIO FINAL
Total de contatos analisados: 5000
Sem nome: 32
Sem número: 14
Nome duplicado: 21
Número duplicado: 9
Total de contatos removidos: 76
Erros ao remover: 2
Processo finalizado
```

## Modo simulação

Para executar apenas uma análise sem remover contatos:

```
const SIMULATION_MODE = true
```

Nesse modo o sistema apenas identifica os contatos problemáticos e gera o relatório.

## Boas práticas recomendadas

Antes de executar em produção:

1. Execute primeiro em modo simulação
2. Faça backup da base de contatos
3. Verifique o relatório gerado
4. Depois execute com remoção ativa

## Possíveis melhorias futuras

* Exportar relatório para JSON ou CSV
* Adicionar barra de progresso
* Permitir configuração via variáveis de ambiente
* Criar CLI com argumentos
* Log estruturado

## Licença

Este projeto é distribuído sob a licença MIT.
