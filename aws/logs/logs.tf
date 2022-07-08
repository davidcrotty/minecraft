resource "aws_cloudwatch_log_group" "minecraft" {
  name = "minecraft"
  retention_in_days = 7

  tags = {
      Name = "minecraft"
  }

  lifecycle {
    prevent_destroy = true
  }
}