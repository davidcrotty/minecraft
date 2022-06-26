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

resource "aws_iam_role" "web_iam_role" {
  name               = "web_iam_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_instance_profile" "web_instance_profile" {
  name = "web_instance_profile"
  role = "web_iam_role"
}

resource "aws_iam_role_policy" "web_iam_role_policy" {
  name   = "web_iam_role_policy"
  role   = aws_iam_role.web_iam_role.id
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::minecraft-backups-ea33578e-183a-4888-8716-8c001c7144c9"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::minecraft-backups-ea33578e-183a-4888-8716-8c001c7144c9/*"
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": [
                "s3:ListStorageLensConfigurations",
                "s3:ListAccessPointsForObjectLambda",
                "s3:ListBucketMultipartUploads",
                "s3:ListAllMyBuckets",
                "s3:ListAccessPoints",
                "s3:ListJobs",
                "s3:ListBucketVersions",
                "s3:ListBucket",
                "s3:ListMultiRegionAccessPoints",
                "s3:ListMultipartUploadParts"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_s3_bucket" "apps_bucket" {
  bucket = "minecraft-backups-ea33578e-183a-4888-8716-8c001c7144c9"
  acl    = "private"
}

resource "aws_s3_bucket_lifecycle_configuration" "example" {
  bucket = aws_s3_bucket.apps_bucket.id

  rule {
    id     = "expire_after_7_days"
    status = "Enabled"

    # ... other transition/expiration actions ...

    expiration {
      days = 7
    }
  }
}

resource "aws_spot_instance_request" "instance" {
  ami                         = "ami-0fb391cce7a602d1f"
  instance_type               = "m5.large"
  associate_public_ip_address = true
  key_name                    = "ssh-key"
  spot_price                  = "0.04"
  wait_for_fulfillment        = true
  iam_instance_profile        = aws_iam_instance_profile.web_instance_profile.id

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
  value       = aws_spot_instance_request.instance.public_ip
}

resource "aws_key_pair" "ssh-key" {
  key_name   = "ssh-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCUtVGOFAS2NuRC6YA95U0LlfrvbXYzNfqDEUd0SGfMK/GBCUDoWYUseiiwNUl/7BRErkAwruJVJbsp6QdCERps5qvX/EOqSv28GHDfYlG5bz8EdbF2TkILhiVNaoqOaXOCbWyZCYehCLXW2XgdVqI/SxgSqlegBfab7gm03VszKKQjpWlFYYlxNTHuk2FsEhykvdbmBfDANXlfS+ivNArEG2jRucme0DbdpsTX0+CJWQ3KMtPgHsemY+4VhFMLVfarAp4Fx9tWoW9mVXH6aG/9kJHYKVHnwynTNzrrmGatn/iFqAQQtjrYNPgq5N0p1So8TuhWOZN6pQSYzHO4dXVN"
}

# TODO factor in security group creation for ssh
