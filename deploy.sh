#!/bin/bash

# 1. Run build (Vite/React/etc)
npm run build

# 2. Clean old docs
rm -rf docs

# 3. Create docs and copy dist into it
mkdir docs
cp -r dist/* docs/

# 4. Optional: create .nojekyll to prevent GitHub from ignoring folders starting with _
touch docs/.nojekyll

# 5. Push to GitHub
git add docs
git commit -m "Deploy latest build to GitHub Pages"
git push
