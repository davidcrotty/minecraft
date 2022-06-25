terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-west-2"
}

resource "aws_instance" "instance" {
  ami                         = "ami-0fb391cce7a602d1f"
  instance_type               = "t2.micro"
  associate_public_ip_address = true
  key_name                    = "ssh-key"

  tags = {
    Name = "Minecraft"
  }

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = file("rajesh.pem")
    host        = self.public_ip
  }
  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install ansible git -y",
      "git clone https://github.com/davidcrotty/minecraft.git /tmp/minecraft",
      "ansible-playbook /tmp/minecraft/playbooks/minecraft_aws.yml --extra-vars \"target=localhost mc_memory=1024\""
    ]
  }

}

output "instance_ip" {
  description = "The public ip for ssh access"
  value       = aws_instance.instance.public_ip
}

resource "aws_key_pair" "ssh-key" {
  key_name   = "ssh-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCUtVGOFAS2NuRC6YA95U0LlfrvbXYzNfqDEUd0SGfMK/GBCUDoWYUseiiwNUl/7BRErkAwruJVJbsp6QdCERps5qvX/EOqSv28GHDfYlG5bz8EdbF2TkILhiVNaoqOaXOCbWyZCYehCLXW2XgdVqI/SxgSqlegBfab7gm03VszKKQjpWlFYYlxNTHuk2FsEhykvdbmBfDANXlfS+ivNArEG2jRucme0DbdpsTX0+CJWQ3KMtPgHsemY+4VhFMLVfarAp4Fx9tWoW9mVXH6aG/9kJHYKVHnwynTNzrrmGatn/iFqAQQtjrYNPgq5N0p1So8TuhWOZN6pQSYzHO4dXVN"
}

# TODO factor in security group creation for ssh