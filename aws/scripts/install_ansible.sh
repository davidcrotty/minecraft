#!/bin/sh
until [[ -f /var/lib/cloud/instance/boot-finished ]]; do
  sleep 1
done


apt-get update
sudo apt install ansible git -y
git clone https://github.com/davidcrotty/minecraft.git /tmp/minecraft
ansible-playbook /tmp/minecraft/playbooks/minecraft_aws.yml --extra-vars "target=localhost mc_memory=7168"