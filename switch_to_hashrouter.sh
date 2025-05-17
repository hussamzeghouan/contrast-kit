#!/bin/bash

echo "🔁 Switching to HashRouter in main.tsx ..."

# تغيير الاستيراد
sed -i 's|BrowserRouter|HashRouter|g' src/main.tsx
sed -i 's|from \"react-router-dom\"|from \"react-router-dom\"\n// NOTE: HashRouter used for GitHub Pages|' src/main.tsx

echo "🔧 Rebuilding project..."
npm run build

echo "🧹 Updating docs folder ..."
rm -rf docs
mkdir docs
cp -r dist/public/* docs/ 2>/dev/null || cp -r dist/* docs/
touch docs/.nojekyll

echo "🚀 Committing and pushing..."
git add docs src/main.tsx
git commit -m "Switch to HashRouter for GitHub Pages"
git push

echo "✅ Done. Your site is ready:"
echo "🔗 https://hussamzeghouan.github.io/contrast-kit/"
