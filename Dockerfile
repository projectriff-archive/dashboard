FROM node:8.9.4-alpine
WORKDIR /var/dashboard
COPY package.json package-lock.json ./
RUN npm install --production
RUN npm install -g serve@6
COPY . ./
RUN PUBLIC_URL=. npm run build
CMD ["/usr/local/bin/serve", "--ssl", "build"]