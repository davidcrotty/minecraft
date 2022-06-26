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

resource "aws_s3_bucket" "minecraft_backup" {
  bucket = "minecraft-backup-6883d30d-56e2-480d-9e47-6ec8b5446725"
  tags = {
    "project" = "minecraft"
  }
}

resource "aws_iam_role" "minecraft_backup_role" {
  name               = "minecraft_save_access"
  assume_role_policy = aws_iam_role_policy.policy
}

resource "aws_iam_role_policy" "policy" {
  name   = "policy"
  policy = data.aws_iam_policy_document.minecraft_backup_policy.json
}

data "aws_iam_policy_document" "minecraft_backup_policy" {
  statement {
    sid       = "VisualEditor0"
    effect    = "Allow"
    resources = ["*"]
    actions   = ["ec2:*"]
  }
}

resource "aws_iam_instance_profile" "minecraft_profile" {
  name = "minecraft_profile"
  role = aws_iam_role.minecraft_backup_role.name
}

resource "aws_instance" "instance" {
  ami                         = "ami-0fb391cce7a602d1f"
  instance_type               = "m5.large"
  associate_public_ip_address = true
  key_name                    = "ssh-key"
  iam_instance_profile        = aws_iam_instance_profile.minecraft_profile.name

  tags = {
    Name = "Minecraft"
  }

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("/Users/davidcrotty/.ssh/minecraft.pem")
    host        = self.public_ip
  }

  provisioner "file" {
    source      = "./scripts/install_ansible.sh"
    destination = "/tmp/install_ansible.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/install_ansible.sh",
      "sudo /tmp/install_ansible.sh",
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
