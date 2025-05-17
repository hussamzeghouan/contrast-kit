#!/bin/bash

echo "🔎 Detecting router setup file..."

# البحث عن main.tsx أو main.jsx
FILE=""
if [ -f src/main.tsx ]; then
  FILE="src/main.tsx"
elif [ -f src/main.jsx ]; then
  FILE="src/main.jsx"
elif [ -f client/src/main.tsx ]; then
  FILE="client/src/main.tsx"
elif [ -f client/src/main.jsx ]; then
  FILE="client/src/main.jsx"
else
  echo "❌ Could not find main.tsx or main.jsx"
  exit 1
fi

echo "✅ Found: $FILE"
echo "🔁 Switching to HashRouter..."

# أضف الاستيراد إذا لم يكن موجودًا
if ! grep -q "HashRouter" "$FILE"; then
  sed -i '1s|^|import { HashRouter } from "react-router-dom";\n|' "$FILE"
fi

# لفّ عنصر <App /> داخل <HashRouter>
sed -i 's|createRoot(.*).render(<App />);|createRoot(document.getElementById("root")!).render(<HashRouter><App /></HashRouter>);|' "$FILE"

echo "🔧 Rebuilding..."
npm run build

echo "📂 Syncing docs folder..."
rm -rf docs
mkdir docs
cp -r dist/public/* docs/ 2>/dev/null || cp -r dist/* docs/
touch docs/.nojekyll

echo "🚀 Committing changes..."
git add "$FILE" vite.config.ts docs
git commit -m "Auto: apply HashRouter and deploy"
git push

echo "✅ All done. Visit:"
echo "🔗 https://hussamzeghouan.github.io/contrast-kit/"
