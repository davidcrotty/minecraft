FROM bitnami/git:2.37.1
FROM hashicorp/terraform:1.2.6
FROM node:lts
RUN mkdir -p /opt/infrastructure
RUN mkdir -p /etc/infrastructure
RUN git clone https://github.com/davidcrotty/minecraft.git /opt/infrastructure

# export TF_VAR_publickey=admin
# export TF_VAR_privatekeyLocation=adifferentpassword

ADD minecraftserver.pem /etc/infrastructure/minecraftserver.pem 

WORKDIR /opt/infrastructure/aws/
# terraform init and run done on launch