variable publickey {
   description = "Public key for server ssh"
   type        = string
   default     = "secret.tfvars"
}

variable privatekeyLocation {
   description = "Private key file location for provisioning server by ansible"
   type        = string
   default     = "secret.tfvars"
}

variable awsaccesskey {
   description = "AWS Account access key"
   type        = string
   default     = "secret.tfvars"
}

variable awsaccesssecret {
   description = "AWS Account secret"
   type        = string
   default     = "secret.tfvars"
}