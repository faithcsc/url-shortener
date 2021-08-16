#!/bin/bash

echo "Starting deploy"
ssh deploy@sus.picio.us "bash -c 'rm -rf /var/sus.picio.us/html/*' && echo 'success deleted' " && echo "ssh deploy@sus.picio.us deleted /var/..."
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/build deploy@sus.picio.us:/var/sus.picio.us/html/ && echo "rsync"