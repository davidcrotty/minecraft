# What
This docker image will be used for pulling terraform config from git and applying the plan

# How
To run this container you will need to set a couple of hidden variables when building the image:
* TF_VAR_publickey - public key of the server
* AWS_ACCESS_KEY_ID - AWS credentials to apply the terraform plan
* AWS_SECRET_ACCESS_KEY - AWS credentials to apply the terraform plan
