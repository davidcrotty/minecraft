resource "aws_cloudwatch_log_group" "minecraft" {
  name = "minecraft"
  retention_in_days = 7

  tags = {
      Name = "minecraft"
  }
}

resource "aws_cloudwatch_log_group" "minecraft_on_switch" {
  name              = "/aws/lambda/minecraft_turn_on_server"
  retention_in_days = 7

  tags = {
      Name = "minecraft"
  }
}