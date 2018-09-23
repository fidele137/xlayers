#!/bin/bash

if [[ -z "${SHORT_SHA}" ]]; then
    b=`git rev-parse --abbrev-ref HEAD`
    v=`git rev-parse --short HEAD`
    version="$b+sha.$v"
else
    version="${BRANCH_NAME}+sha.${SHORT_SHA}"
fi

## replease _BUILD_HASH_ with the current build number
perl -i -pe "s/_BUILD_HASH_/$version/g" dist/*/main.*.js > /dev/null

status=$?
if [ $status -eq 0 ];then
   echo "Deploy was stamped: $version"
else
   echo "Could not stamp this eploy!"
fi