#!/bin/sh
BUCKET=minecraft-backups-ea33578e-183a-4888-8716-8c001c7144c9

OBJECT="$(aws s3 ls $BUCKET --recursive | sort | tail -n 1 | awk '{print $4}')"
aws s3 cp s3://$BUCKET/$OBJECT /tmp/minecraft_restore.tar.gz
tar -xvf  /tmp/minecraft_restore.tar.gz -C /