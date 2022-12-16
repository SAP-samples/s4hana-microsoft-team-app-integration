# cf api <CF_API_ENDPOINT>
# cf login
# npm install
npm run build

cat <<EOF >./build/Staticfile
pushstate: enabled
EOF

cf push