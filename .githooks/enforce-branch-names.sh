#!/usr/bin/env bash
LC_ALL=C

local_branch="$(git rev-parse --abbrev-ref HEAD)"

valid_branch_regex="^[0-9]+-[a-z0-9._-]+$"

message="There is something wrong with your branch name $local_branch. Branch names in this project must adhere to this contract: $valid_branch_regex. Your commit will be rejected. You should rename your branch (git branch -m <newname>) to a valid name and try again."

echo "Checking if branch name is valid..."
if [[ ! $local_branch =~ $valid_branch_regex ]]; then
  echo ""
  echo "$message"
  echo ""
  echo ""
  echo "You can bypass this by using --no-verify however you should not generally do this!"
  echo ""
  echo ""
  exit 1
fi
echo "Branch name is fine."

exit 0
