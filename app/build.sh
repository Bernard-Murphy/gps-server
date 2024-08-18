export REACT_APP_SOCKET_SERVER="/"
npm run build
rm -rf ../public
mv build ../public