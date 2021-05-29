FROM node:12.22.1
ARG ENVIRONMENT

WORKDIR /app
COPY . .
RUN npm install
RUN npx bundage bfn backend/main backend/main_bin -e environment_$ENVIRONMENT

EXPOSE 80 443
CMD ["node", "backend/main_bin"]
