# Documentação dos Campos dos Arquivos CSV e XLSX

## Visão Geral

Este documento descreve os campos utilizados nos arquivos CSV e XLSX que são processados pelo sistema ConectaDengue para importação de dados de notificações de arboviroses (Dengue, Zika e Chikungunya).

## Formatos de Arquivo Suportados

- **CSV**: Arquivos de texto separados por vírgula (`.csv`)
- **XLSX**: Planilhas do Microsoft Excel (`.xlsx`)

## Campos Obrigatórios

### Campos Principais da Notificação

| Campo | Tipo | Descrição | Exemplo | Observações |
|-------|------|-----------|---------|-------------|
| `NU_NOTIFIC` | Long | Número único da notificação | `500` | Campo obrigatório, usado como ID primário |
| `ID_AGRAVO` | String | Código CID-10 do agravo/doença | `A90`, `A92.0`, `A928` | **A90** = Dengue, **A92.0** = Chikungunya, **A928** = Zika |
| `DT_NOTIFIC` | Date | Data da notificação | `10/10/2006` | Formato: dd/MM/yyyy |
| `DT_NASC` | Date | Data de nascimento do paciente | `15/05/1980` | Formato: dd/MM/yyyy |
| `CLASSI_FIN` | String | Classificação final do caso | `100` | Código da classificação epidemiológica |
| `CS_SEXO` | String | Sexo do paciente | `M`, `F` | **M** = Masculino, **F** = Feminino |
| `NM_BAIRRO` | String | Nome do bairro de residência | `ABOLIÇÃO` | Nome será validado contra bairros de Mossoró |
| `ID_BAIRRO` | Integer | Código numérico do bairro | `1`, `27` | Pode ser vazio (0 se não informado) |
| `EVOLUCAO` | String | Evolução do caso | `1`, `2` | Código do desfecho do caso |
| `IDADE` | Integer | Idade do paciente | `27`, `42.5` | Pode conter decimais (ex: 27.5) |

## Processamento dos Campos

### 1. Data de Nascimento (`DT_NASC`) e Data de Notificação (`DT_NOTIFIC`)
- **Formato**: dd/MM/yyyy
- **Processamento**: Convertidas para objetos `Date` usando a classe `StringToDateCSV`
- **Uso**: Cálculo automático da idade quando o campo `IDADE` não está disponível

### 2. Idade (`IDADE`)
- **Processamento**: 
  - Se o campo contém ponto decimal (ex: `27.5`), apenas a parte inteira é considerada
  - Se o campo está vazio ou é 0, a idade é calculada automaticamente pela diferença entre `DT_NOTIFIC` e `DT_NASC`
- **Resultado**: Valor inteiro representando anos completos

### 3. Código do Agravo (`ID_AGRAVO`)
- **Códigos aceitos**:
  - `A90`: Dengue
  - `A92.0`: Chikungunya  
  - `A928`: Zika
- **Validação**: O sistema possui conversão automática de nomes para códigos:
  - "DENGUE" → "A90"
  - "CHIKUNGUNYA" → "A92.0"
  - "ZIKA" → "A928"

### 4. Bairro (`NM_BAIRRO`)
- **Validação**: O nome do bairro é validado contra uma lista de bairros de Mossoró
- **Processamento**: Usa a classe `NeighborhoodsMossoro` para buscar e normalizar nomes de bairros
- **Comportamento**: Apenas notificações com bairros válidos são processadas

### 5. Semana Epidemiológica
- **Campo**: Calculado automaticamente (não precisa estar no arquivo)
- **Cálculo**: Baseado na `DT_NOTIFIC`, calcula-se a semana epidemiológica seguindo o padrão:
  - Encontra o primeiro domingo do ano
  - Conta quantas semanas se passaram desde então
  - Adiciona 1 para obter o número da semana

## Exemplo de Estrutura de Arquivo

### CSV
```csv
NU_NOTIFIC,ID_AGRAVO,DT_NOTIFIC,DT_NASC,CLASSI_FIN,CS_SEXO,NM_BAIRRO,ID_BAIRRO,EVOLUCAO,IDADE
500,A90,10/10/2006,10/10/2006,100,M,ABOLIÇÃO,1,1,27
501,A92.0,15/03/2023,20/01/1985,200,F,CENTRO,5,2,38.5
```

### XLSX
A primeira linha deve conter os cabeçalhos (nomes dos campos) e as linhas subsequentes os dados.

## Tratamento de Erros

### Notificações com Erro
- Notificações que falham na validação são armazenadas na tabela `notifications_with_error`
- Campos que causam erros comuns:
  - Datas em formato inválido
  - Bairros não encontrados na base de Mossoró
  - Códigos de agravo inválidos
  - Campos obrigatórios vazios

### Log de Iterações
- Cada importação recebe um número de iteração único
- Permite rastreamento de quando cada dado foi importado
- Facilita identificação de erros por lote de importação

## Campos Calculados/Derivados

| Campo Derivado | Origem | Descrição |
|----------------|--------|-----------|
| `semanaEpidemiologica` | `DT_NOTIFIC` | Semana epidemiológica baseada na data de notificação |
| `idadePaciente` | `IDADE` ou (`DT_NOTIFIC` - `DT_NASC`) | Idade em anos, calculada se não fornecida |

## Filtros e Consultas Disponíveis

O sistema permite filtrar dados por:
- **Ano**: Baseado na `DT_NOTIFIC`
- **Agravo**: Dengue, Zika ou Chikungunya
- **Bairro**: Nome específico do bairro
- **Sexo**: Masculino ou Feminino
- **Evolução**: Código de desfecho do caso
- **Faixa Etária**: Intervalos pré-definidos de idade

## Validações Importantes

1. **Formato de Data**: Deve seguir rigorosamente dd/MM/yyyy
2. **Bairros**: Devem existir na base de dados de Mossoró
3. **Códigos CID**: Apenas A90, A92.0 e A928 são aceitos
4. **Sexo**: Apenas 'M' ou 'F'
5. **Campos Numéricos**: NU_NOTIFIC, ID_BAIRRO, IDADE devem ser válidos

## Notas Técnicas

- **Codificação**: Arquivos devem estar em UTF-8
- **Separador CSV**: Vírgula (,)
- **Células Vazias**: Tratadas como strings vazias ou valores padrão (0 para numéricos)
- **Fórmulas XLSX**: São avaliadas e o resultado é usado como valor
- **Linhas de Cabeçalho**: A primeira linha é sempre considerada cabeçalho

## Endpoints da API

O sistema expõe diversos endpoints para consulta dos dados importados:

- `POST /api/savecsvdata`: Upload de arquivos CSV/XLSX
- `GET /api/notifications`: Listagem paginada de notificações
- `GET /api/notifications/count`: Contadores diversos (sexo, bairro, evolução, etc.)
- `GET /api/notifications/errors`: Notificações com erro de processamento

## Utilização dos Campos nos Gráficos e Visualizações

### 1. **Gráfico de Casos por Semana Epidemiológica** 
**Arquivo**: `EpidemiologicalWeek.tsx` | **Endpoint**: `/notifications/count/epidemiologicalWeek`

| Campo Utilizado | Uso no Gráfico | Processamento |
|----------------|-----------------|---------------|
| `DT_NOTIFIC` | Eixo X (semanas epidemiológicas) | Convertida para semana epidemiológica (1-53) |
| `ID_AGRAVO` | Séries de dados separadas | Filtra notificações por Dengue, Zika ou Chikungunya |
| `NM_BAIRRO` | Filtro opcional | Permite análise específica por bairro |

**Visualização**: Gráfico de linha/área mostrando evolução temporal dos casos por semana.

### 2. **Gráfico de Casos Acumulados por Semana Epidemiológica**
**Arquivo**: `EpidemiologicalWeekAccumulated.tsx` | **Endpoint**: `/notifications/count/epidemiologicalWeek/accumulated`

| Campo Utilizado | Uso no Gráfico | Processamento |
|----------------|-----------------|---------------|
| `DT_NOTIFIC` | Eixo X (semanas epidemiológicas) | Convertida para semana epidemiológica acumulativa |
| `ID_AGRAVO` | Séries de dados separadas | Soma acumulativa por tipo de agravo |
| `NM_BAIRRO` | Filtro opcional | Análise acumulativa por bairro específico |

**Visualização**: Gráfico de linha/área mostrando progressão acumulativa dos casos.

### 3. **Gráfico de Distribuição por Sexo (Donut Chart)**
**Arquivo**: `CountBySexo.tsx` | **Endpoint**: `/notifications/count/sexo`

| Campo Utilizado | Uso no Gráfico | Processamento |
|----------------|-----------------|---------------|
| `CS_SEXO` | Segmentos do gráfico | Conta notificações por 'M' (Masculino) e 'F' (Feminino) |
| `ID_AGRAVO` | Filtro de dados | Análise específica por tipo de agravo |
| `DT_NOTIFIC` | Filtro temporal | Filtra por ano selecionado |
| `NM_BAIRRO` | Filtro opcional | Análise por bairro específico |

**Visualização**: Gráfico de rosca mostrando proporção entre sexos.

### 4. **Gráfico de Distribuição por Faixa Etária (Gráfico de Barras)**
**Arquivo**: `CountByAgeRange.tsx` | **Endpoint**: `/notifications/count/ageRange`

| Campo Utilizado | Uso no Gráfico | Processamento |
|----------------|-----------------|---------------|
| `IDADE` | Categorização em faixas | Agrupada em intervalos: 0-1, 2-3, 4-5, 6-7, 8-9, 10-19, 20-29, 30-39, 40-49, 50-59, 60-69, 70-79, 80-89, 90-99 anos |
| `DT_NASC` + `DT_NOTIFIC` | Cálculo de idade (backup) | Usado quando campo `IDADE` está vazio |
| `ID_AGRAVO` | Filtro de dados | Análise específica por tipo de agravo |
| `NM_BAIRRO` | Filtro opcional | Análise por bairro específico |

**Visualização**: Gráfico de barras mostrando distribuição etária dos casos.

### 5. **Mapa de Calor (HeatMap)**
**Arquivo**: `DadosGeograficos.tsx` + `HeatMap.tsx` | **Endpoint**: `/notifications/count/neighborhood`

| Campo Utilizado | Uso no Mapa | Processamento |
|----------------|--------------|---------------|
| `NM_BAIRRO` | Localização geográfica | Mapeado para coordenadas lat/lng dos bairros de Mossoró |
| `NU_NOTIFIC` | Intensidade do calor | Contagem de notificações por bairro |
| `ID_AGRAVO` | Filtro de dados | Tipo específico de agravo para análise |
| `DT_NOTIFIC` | Filtro temporal | Filtra por ano selecionado |

**Visualização**: Mapa de calor sobreposto a Mossoró, com intensidade proporcional ao número de casos.

### 6. **Tabela de Informações por Bairro**
**Arquivo**: `NeighborhoodInfoTable.tsx` | **Endpoint**: `/notifications/count/neighborhood`

| Campo Utilizado | Uso na Tabela | Processamento |
|----------------|---------------|---------------|
| `NM_BAIRRO` | Coluna principal | Nome dos bairros afetados |
| `NU_NOTIFIC` | Contagem de casos | Total de notificações por bairro |
| `ID_AGRAVO` | Filtro e agrupamento | Análise específica por tipo de agravo |
| `DT_NOTIFIC` | Filtro temporal | Período de análise |

**Visualização**: Tabela listando bairros e quantidade de casos reportados.

### 7. **Gráfico de Previsão de Casos**
**Arquivo**: `GetPrevisionData.tsx` | **Endpoints**: `/notifications/count/byYears` + `/predict`

| Campo Utilizado | Uso no Gráfico | Processamento |
|----------------|-----------------|---------------|
| `DT_NOTIFIC` | Dados históricos (eixo X) | Agrupados por meses/anos para tendência |
| `NU_NOTIFIC` | Contagem histórica | Base para modelo preditivo |
| Dados meteorológicos | Variáveis preditivas | `rainfall_index`, `air_humidity`, `mean_temperature` |
| `ID_AGRAVO` | Foco em Dengue | Modelo específico para previsão de Dengue |

**Visualização**: Gráfico de linha temporal com dados históricos + ponto de previsão destacado.

### 8. **Cards de Estatísticas Gerais**
**Arquivo**: `notificationsCount.tsx` + `affectedNeighborhoodCount.tsx`

| Campo Utilizado | Uso nos Cards | Processamento |
|----------------|---------------|---------------|
| `NU_NOTIFIC` | Contagem total | Total de notificações no período |
| `NM_BAIRRO` | Bairros únicos | Contagem de bairros com pelo menos 1 caso |
| `ID_AGRAVO` | Filtro de contagem | Total específico por agravo |
| `DT_NOTIFIC` | Filtro temporal | Período de análise |

**Visualização**: Cards numéricos com estatísticas resumidas.

## Filtros Interativos Aplicados

### Filtros Globais (Todos os Gráficos)
- **Ano**: Baseado em `DT_NOTIFIC` (campo obrigatório)
- **Tipo de Agravo**: Baseado em `ID_AGRAVO` (Dengue, Zika, Chikungunya)
- **Bairro**: Baseado em `NM_BAIRRO` (opcional, usado em dashboards específicos)

### Campos Derivados para Visualizações
| Campo Derivado | Origem | Uso |
|----------------|---------|-----|
| `semanaEpidemiologica` | `DT_NOTIFIC` | Eixo temporal em gráficos semanais |
| `faixaEtaria` | `IDADE` ou (`DT_NOTIFIC` - `DT_NASC`) | Categorização para gráfico de barras |
| `coordenadasBairro` | `NM_BAIRRO` → lookup table | Posicionamento no mapa de calor |
| `intensidadeCalor` | Contagem de `NU_NOTIFIC` por bairro | Gradiente de cores no mapa |

## Páginas de Dashboard e seus Gráficos

### 1. **Dashboard Geral** (`/dashboard/dados-gerais`)
- Gráfico de casos por semana epidemiológica
- Gráfico de casos acumulados
- Distribuição por sexo (donut)
- Distribuição por faixa etária (barras)
- Tabela de bairros afetados
- Cards de estatísticas gerais

### 2. **Dashboard Geográfico** (`/dashboard/dados-geograficos`)
- Mapa de calor de Mossoró
- Filtros por ano e agravo

### 3. **Dashboard por Bairro** (`/dashboard/bairro/:nome`)
- Mesmos gráficos do dashboard geral, filtrados por bairro específico

### 4. **Dashboard de Previsão** (`/dashboard/previsao-casos`)
- Gráfico temporal com previsão baseada em variáveis meteorológicas
- Formulário de entrada de dados ambientais

---

*Para mais informações sobre a estrutura do banco de dados e entidades, consulte as classes `Notification` e `NotificationWithError` no código fonte.*
