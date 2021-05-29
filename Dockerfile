FROM node:12.22.1

WORKDIR /app
COPY . .
RUN npm install
RUN npx bundage bfn backend/main backend/main_bin -e environment_$ENVIRONMENT

EXPOSE 80 443
CMD ["npx", "selfage", "frun", "backend/main_bin"]
