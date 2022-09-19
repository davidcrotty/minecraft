terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"

  backend "s3" {
    bucket = "minecraft-terraform-state-e0bb508b-580d-4d22-a454-aa5d6b6d49c6"
    key    = "minecraft-infra/terraform.tfstate"
    region = "eu-west-2"
  }
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
            "Sid": "CloudWatchLogAgentPutForWebServerLogGroup",
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:eu-west-2:807845893567:log-group:minecraft",
                "arn:aws:logs:eu-west-2:807845893567:log-group:minecraft:*:*"
            ]
        },
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
    id     = "transition_to_archive"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 61
      storage_class = "GLACIER_IR"
    }
  }
}

resource "aws_spot_instance_request" "instance" {
  ami                         = "ami-0fb391cce7a602d1f"
  instance_type               = "m5.large"
  associate_public_ip_address = true
  key_name                    = "ssh-key"
  spot_price                  = "0.035"
  wait_for_fulfillment        = true
  iam_instance_profile        = aws_iam_instance_profile.web_instance_profile.id

  tags = {
    Name = "minecraft"
  }

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file(var.privatekeyLocation)
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
  public_key = var.publickey
}

# TODO factor in security group creation for ssh
