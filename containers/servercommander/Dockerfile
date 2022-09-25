FROM hashicorp/terraform:1.2.6 as terraform
RUN mkdir -p /opt/infrastructure

FROM public.ecr.aws/lambda/nodejs:16
COPY --from=terraform /bin/terraform /bin/terraform

RUN mkdir -p /etc/infrastructure
RUN mkdir -p /var/www/servercommander


ADD containers/servercommander/minecraftserver.pem /etc/infrastructure/minecraftserver.pem 

COPY containers/servercommander/api/package*.json /var/www/servercommander

ADD aws ${LAMBDA_TASK_ROOT}
COPY containers/servercommander/api/dist/index.js containers/servercommander/api/package.json  ${LAMBDA_TASK_ROOT}
RUN npm install