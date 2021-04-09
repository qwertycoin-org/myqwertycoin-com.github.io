echo "Increase Webwallet patch version"

npm --no-git-tag-version version patch

echo "Preparing Code for compile"

nodejs ./node_modules/typescript/bin/tsc --project tsconfig.json

echo "Compiling..."

nodejs build.js

echo "deploy Webwallet"

sudo cp -rf src/api.html src/config.ts src/lib/ src/service-worker-raw.js src/api.js src/d/ src/manifest.json src/service-worker-raw.ts src/api.ts src/index.html src/model/ src/translations/ src/assets/ src/index.js src/pages/ src/utils/ src/config.js src/index.ts src/providers/ src/workers/ /var/www/html
