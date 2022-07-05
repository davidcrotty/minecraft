#!/bin/bash
BACKUP_DIR='/opt/minecraft/backups/'

find $BACKUP_DIR -type f -mtime +4 -name 'server_backup*.tar.gz' -delete

BACKUP_NAME=server_backup_$(date +"%F_%H_%M_%S").tar.gz

tar cvf - /opt/minecraft/server | gzip -9 > $BACKUP_DIR/$BACKUP_NAME

echo "Backup up to aws"

aws s3 cp $BACKUP_DIR$BACKUP_NAME s3://minecraft-backups-ea33578e-183a-4888-8716-8c001c7144c9

TO_REMOVE="$BACKUP_DIR/$BACKUP_NAME.tar.gz"

echo "removing file $TO_REMOVE"

rm $TO_REMOVE