#!/bin/bash

export PROJECT_ID="$GIT_REPOSITORY__URL"

git clone  "$GIT_REPOSITORY__URL" /home/app/output

exec node script.js