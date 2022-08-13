FROM bitnami/git:2.37.1 as git
RUN mkdir -p /opt/infrastructure

RUN git clone https://github.com/davidcrotty/minecraft.git /opt/infrastructure

FROM hashicorp/terraform:1.2.6 as terraform
FROM ubuntu:bionic as ubuntu
RUN apt-get update -y && apt-get install expect -y

FROM public.ecr.aws/lambda/nodejs:16
COPY --from=terraform /bin/terraform /bin/terraform

RUN mkdir -p /etc/infrastructure
RUN mkdir -p /var/www/servercommander


ADD minecraftserver.pem /etc/infrastructure/minecraftserver.pem 
ENV TF_VAR_privatekeyLocation=/etc/infrastructure/minecraftserver.pem
# TODO pass as env variable via docker -e
ENV TF_VAR_publickey="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCiwoNG9TpCYGowdld4T78/+bj5skZBeX6n9X06iqE381vE5dXzZrrm1/ZQxsRvGErOK7SpULzOfcxJ1rwe/0mnneKg6BrlPq2u7UpigF7+Hk62hCQiXSbzH/bTRSNtUYiyx+oxcbjw42LO4j8O2CFtCC2294XUM/hMyUAqCTWCLiRDs034c1qG0rQvu+3aE2CE1swFmaLoZ4iQR1b5iOLm3HeFJ3kpUqQ6FZDTzEO7kFnumgvymZdI8oxtgXAVlnHTHf+xUiGlPDpdBYZbuGvPuOxELBzwvQ4k7LrhiaUTK4w2EqP1u0cz8HFAupWBVp+kSuk/1hYza/65LODJHwuz"

COPY api/package*.json /var/www/servercommander

COPY --from=ubuntu /usr/bin/unbuffer /bin/unbuffer
COPY --from=git /opt/infrastructure/aws ${LAMBDA_TASK_ROOT}
COPY api/dist/index.js api/package.json  ${LAMBDA_TASK_ROOT}
RUN npm install