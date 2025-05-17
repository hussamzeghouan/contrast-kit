#!/bin/bash

if [[ -n $(git status --porcelain) ]]; then
  echo "🔄 Found changes. Pushing to GitHub..."
  git add .
  git commit -m "Auto update at $(date '+%Y-%m-%d %H:%M:%S')"
  git push
else
  echo "✅ No changes to commit."
fi
