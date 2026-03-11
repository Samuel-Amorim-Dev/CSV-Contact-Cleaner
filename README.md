CSV Contact Cleaner

Ferramenta em **Node.js** para validar listas de contatos em CSV, identificar inconsistências e remover automaticamente contatos inválidos através de uma API.

O script foi criado para limpar bases de contatos grandes de forma segura, com suporte a **modo de simulação**, validação de duplicidade e geração de relatório no terminal.

## Funcionalidades

A ferramenta analisa todos os contatos do CSV e aplica as seguintes regras:

* Contatos sem nome
* Contatos sem número
* Nomes duplicados
* Números duplicados

Todos os contatos que se encaixarem nessas condições são adicionados à lista de exclusão e enviados para remoção através da API configurada.

Também existe um **modo de simulação**, que permite validar os dados sem executar exclusões.

## Tecnologias utilizadas

* Node.js
* Axios
* csv-parser
* File System (fs)

## Estrutura do projeto

```
csv-contact-cleaner
│
├─ src
│  └─ index.js
│
├─ data
│  └─ addressbook.csv
├─ README.md
└─ LICENSE
```

## Instalação

Clone o repositório

```
git clone https://github.com/seu-usuario/csv-contact-cleaner.git
```

Entre na pasta do projeto

```
cd csv-contact-cleaner
```

Instale as dependências

```
npm install
```

## Dependências

```
npm install axios csv-parser
```

## Configuração

Crie um arquivo `.env` baseado no exemplo:

```
BASE_URL=https://sua-api.com
QUEUE_ID=20
API_KEY=123
CSV_FILE_PATH=data/addressbook.csv
SIMULATION_MODE=true
REQUEST_DELAY_MS=1
```

### Parâmetros

BASE_URL
URL da API utilizada para excluir contatos.

QUEUE_ID
Identificador da fila utilizada na requisição.

API_KEY
Chave de autenticação da API.

CSV_FILE_PATH
Caminho do arquivo CSV contendo os contatos.

SIMULATION_MODE
Define se o script apenas simula ou realmente remove contatos.

REQUEST_DELAY_MS
Intervalo entre requisições para evitar sobrecarga na API.

## Estrutura do CSV

O CSV deve usar **; como separador**.

Exemplo:

```
id;name;number
1;João Silva;5511999999999
2;Maria Souza;5511988888888
3;;5511977777777
```

O script aceita variações comuns de cabeçalho:

name / Nome / nome
number / Número / Numero / Telefone

## Como executar

Execute o script com:

```
node src/index.js
```

## Exemplo de saída

```
Iniciando validação de contatos
Total de contatos carregados: 5000

REGRA: SEM NOME | ID: 102 | Número: 551199999999
REGRA: NOME DUPLICADO | ID: 245 | Nome: João Silva | Número: 551188888888

Contato 245 removido com sucesso
Contato 102 removido com sucesso
```

## Relatório final

Ao finalizar, o sistema apresenta um resumo da execução:

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

Para rodar apenas a análise sem apagar contatos:

```
SIMULATION_MODE=true
```

Esse modo permite validar a base antes de executar alterações.

## Boas práticas antes de executar

* Faça backup da base de contatos
* Execute primeiro em modo de simulação
* Analise o relatório gerado
* Execute novamente com remoção ativa

## Melhorias futuras

* Exportar relatório para JSON
* Exportar relatório para CSV
* Adicionar barra de progresso
* Criar CLI com argumentos
* Logs estruturados

## Licença

Distribuído sob licença MIT.
