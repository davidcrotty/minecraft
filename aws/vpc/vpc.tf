resource "aws_vpc" "internal" {
  cidr_block = "10.0.0.0/24"
  enable_dns_hostnames = true
  enable_dns_support = true
}

resource "aws_internet_gateway" "IGW" {
  vpc_id = aws_vpc.internal.id
}

resource "aws_subnet" "publicsubnets" {
  vpc_id     = aws_vpc.internal.id
  cidr_block = "10.0.0.128/26"
}

resource "aws_eip" "nateIP" {
  vpc = true
}

resource "aws_route_table" "PublicRT" { # Creating RT for Public Subnet
  vpc_id = aws_vpc.internal.id
  route {
    cidr_block = "0.0.0.0/0" # Traffic from Public Subnet reaches Internet via Internet Gateway
    gateway_id = aws_internet_gateway.IGW.id
  }
}

resource "aws_route_table_association" "PublicRTassociation" {
  subnet_id      = aws_subnet.publicsubnets.id
  route_table_id = aws_route_table.PublicRT.id
}

resource "aws_network_interface" "network_interface" {
  subnet_id   = aws_subnet.publicsubnets.id

  tags = {
    Name = "minecraft"
  }
}