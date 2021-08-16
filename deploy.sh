#!/bin/bash

set +x
echo "Starting deploy"
ssh deploy@sus.picio.us "bash -c 'rm -rf /var/sus.picio.us/html/*' && echo 'success deleted' " && echo "ssh deploy@sus.picio.us deleted /var/..."
echo $TRAVIS_BUILD_DIR
ls -la
rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/build deploy@sus.picio.us:/var/sus.picio.us/html/ && echo "rsync"