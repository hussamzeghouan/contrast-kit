#!/bin/bash

echo "🛠️ Running build..."
npm install
npm run build

echo "🔄 Switching to HashRouter (auto patch)..."
if grep -q "BrowserRouter" client/src/main.tsx; then
  sed -i '' 's/BrowserRouter/HashRouter/g' client/src/main.tsx
  sed -i '' '1i\
import { HashRouter as Router } from \"react-router-dom\";
' client/src/main.tsx
fi

echo "📁 Cleaning and copying build to docs/"
rm -rf docs
mkdir -p docs
cp -r dist/public/* docs/

echo "🔀 Pushing to GitHub Pages..."
git add .
git commit -m "🚀 Deploy latest build to GitHub Pages"
git push

echo "✅ Done! Your site is live:"
echo "🔗 https://<YOUR_USERNAME>.github.io/<REPO_NAME>/"
