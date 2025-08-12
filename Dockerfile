# Dockerfile para o Frontend React/Vite
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com servidor HTTP simples
FROM node:18-alpine

# Instalar um servidor HTTP simples
RUN npm install -g serve

# Copiar arquivos buildados
COPY --from=builder /app/dist /app

WORKDIR /app

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar o servidor na porta 3000
CMD ["serve", "-s", ".", "-l", "3000"]
