FROM node:8.9.4-alpine
WORKDIR /var/dashboard
COPY package.json package-lock.json ./
RUN npm install --production
COPY . ./
RUN PUBLIC_URL=. npm run build
CMD ["/var/dashboard/node_modules/.bin/serve", "--ssl", "build"]
