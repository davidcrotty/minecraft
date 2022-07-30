FROM bitnami/git:2.37.1
FROM hashicorp/terraform:1.2.6
FROM node:lts
RUN mkdir -p /opt/infrastructure
RUN mkdir -p /etc/infrastructure
RUN git clone https://github.com/davidcrotty/minecraft.git /opt/infrastructure

ADD minecraftserver.pem /etc/infrastructure/minecraftserver.pem 
ENV TF_VAR_privatekeyLocation=/etc/infrastructure/minecraftserver.pem

WORKDIR /opt/infrastructure/aws/
# terraform init and run done on API endpoint hit launch