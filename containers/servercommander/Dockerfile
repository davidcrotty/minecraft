FROM bitnami/git:2.37.1 as git
RUN mkdir -p /opt/infrastructure

RUN git clone https://github.com/davidcrotty/minecraft.git /opt/infrastructure

FROM hashicorp/terraform:1.2.6 as terraform
FROM public.ecr.aws/lambda/nodejs:16
COPY --from=terraform /bin/terraform /bin/terraform

RUN mkdir -p /etc/infrastructure
RUN mkdir -p /var/www/servercommander


ADD minecraftserver.pem /etc/infrastructure/minecraftserver.pem 
ENV TF_VAR_privatekeyLocation=/etc/infrastructure/minecraftserver.pem

COPY api/package*.json /var/www/servercommander

COPY --from=git /opt/infrastructure/aws ${LAMBDA_TASK_ROOT}
COPY api/dist/index.js api/package.json  ${LAMBDA_TASK_ROOT}
RUN npm install