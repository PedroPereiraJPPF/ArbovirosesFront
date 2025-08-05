# Dockerfile para o Frontend React/Vite
FROM node:18-alpine as builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 3000 (em vez da 80 padrão)
EXPOSE 3000

# Comando para iniciar o nginx na porta 3000
CMD ["sh", "-c", "sed -i 's/listen 80/listen 3000/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
