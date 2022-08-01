FROM bitnami/git:2.37.1
FROM hashicorp/terraform:1.2.6
FROM node:lts
RUN mkdir -p /opt/infrastructure
RUN mkdir -p /etc/infrastructure
RUN mkdir -p /var/www/servercommander
RUN git clone https://github.com/davidcrotty/minecraft.git /opt/infrastructure

ADD minecraftserver.pem /etc/infrastructure/minecraftserver.pem 
ENV TF_VAR_privatekeyLocation=/etc/infrastructure/minecraftserver.pem

WORKDIR /opt/infrastructure/aws/
# terraform init and run done on API endpoint hit launch

EXPOSE 8080/tcp

COPY api/package*.json /var/www/servercommander
WORKDIR /var/www/servercommander/
RUN npm install
ADD api/dist /var/www/servercommander/api/dist
ENV PORT=8080
CMD ["node", "/var/www/servercommander/api/dist/index.js"]