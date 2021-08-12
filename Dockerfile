FROM node:12.22.1

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY bin/ .
RUN npm install --production

EXPOSE 80 443
CMD ["node", "backend/main_bin"]
