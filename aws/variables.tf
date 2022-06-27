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