resource "aws_iam_role" "turn_on_server_role" {
  name               = "minecraft_lambda_turn_on_server"
  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "lambda.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}

resource "aws_iam_policy" "iam_policy_for_lambda_turn_on_server_role" {

  name        = "iam_policy_for_lambda_turn_on_server_role"
  path        = "/"
  description = "AWS IAM Policy for managing aws lambda role"
  policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetObject",
                "ec2:DescribeAccountAttributes",
                "s3:GetBucketPolicy",
                "s3:GetBucketAcl",
                "s3:GetBucketCORS",
                "s3:GetBucketWebsite",
                "s3:GetBucketVersioning",
                "s3:GetAccelerateConfiguration",
                "s3:GetBucketRequestPayment",
                "s3:GetBucketLogging",
                "s3:GetLifecycleConfiguration",
                "s3:GetReplicationConfiguration",
                "s3:GetEncryptionConfiguration",
                "s3:GetBucketObjectLockConfiguration",
                "s3:GetBucketTagging",
                "ec2:ImportKeyPair",
                "ec2:CreateTags",
                "ec2:DescribeKeyPairs",
                "s3:PutLifecycleConfiguration",
                "iam:CreateInstanceProfile",
                "iam:CreateRole",
                "iam:GetInstanceProfile",
                "iam:GetRole",
                "iam:AddRoleToInstanceProfile",
                "iam:PassRole",
                "iam:ListRolePolicies",
                "ec2:RequestSpotInstances",
                "iam:ListAttachedRolePolicies",
                "iam:PutRolePolicy",
                "iam:GetRolePolicy",
                "ec2:DescribeSpotInstanceRequests",
                "ec2:DescribeInstances",
                "ec2:DescribeVolumes",
                "ec2:DescribeVpcs",
                "ec2:CancelSpotInstanceRequests",
                "s3:PutObject",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "ec2:CreateNetworkInterface",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DeleteNetworkInterface"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
  role       = aws_iam_role.turn_on_server_role.name
  policy_arn = aws_iam_policy.iam_policy_for_lambda_turn_on_server_role.arn
}

resource "aws_lambda_function" "lambda_minecraft_turn_on_server" {
  image_uri     = "807845893567.dkr.ecr.eu-west-2.amazonaws.com/minecraft-repository@sha256:becdb353d11aaa7bf1e769e2c392b32cea1dff97856f3c47e68e8f2742250e7d"
  package_type  = "Image"
  function_name = "minecraft_turn_on_server"
  role          = aws_iam_role.turn_on_server_role.arn
  depends_on    = [aws_iam_role_policy_attachment.attach_iam_policy_to_iam_role]
  memory_size   = 3008
  architectures = ["x86_64"]
  timeout       = 600
  tags = {
    Name = "minecraft"
  }

  ephemeral_storage {
    size = 2048
  }

  image_config {
    command = ["index.onSwitch"]
  }

  environment {
    variables = {
      TF_VAR_privatekeyLocation = "/etc/infrastructure/minecraftserver.pem"
      TF_VAR_publickey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCiwoNG9TpCYGowdld4T78/+bj5skZBeX6n9X06iqE381vE5dXzZrrm1/ZQxsRvGErOK7SpULzOfcxJ1rwe/0mnneKg6BrlPq2u7UpigF7+Hk62hCQiXSbzH/bTRSNtUYiyx+oxcbjw42LO4j8O2CFtCC2294XUM/hMyUAqCTWCLiRDs034c1qG0rQvu+3aE2CE1swFmaLoZ4iQR1b5iOLm3HeFJ3kpUqQ6FZDTzEO7kFnumgvymZdI8oxtgXAVlnHTHf+xUiGlPDpdBYZbuGvPuOxELBzwvQ4k7LrhiaUTK4w2EqP1u0cz8HFAupWBVp+kSuk/1hYza/65LODJHwuz"
    }
  }
}