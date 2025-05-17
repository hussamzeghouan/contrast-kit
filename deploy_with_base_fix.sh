#!/bin/bash

echo "🛠️ Step 1: Setting base path in vite.config.ts ..."
# تعديل ملف vite.config.ts تلقائيًا لإضافة base path المناسب
sed -i 's|defineConfig({|defineConfig({\n  base: \"/contrast-kit/\",|' vite.config.ts

echo "🔧 Step 2: Building site with npm ..."
npm run build

echo "🧹 Step 3: Cleaning old docs and copying new build ..."
rm -rf docs
mkdir docs
cp -r dist/public/* docs/ 2>/dev/null || cp -r dist/* docs/
touch docs/.nojekyll

echo "🚀 Step 4: Committing and pushing to GitHub ..."
git add docs
git commit -m "Auto deploy: set base path and publish to GitHub Pages" || echo "✅ No changes to commit"
git push

echo "✅ All done. Visit your site at:"
echo "🔗 https://hussamzeghouan.github.io/contrast-kit/"
