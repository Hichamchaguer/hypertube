#!/bin/sh

set -e

host="${DB_HOST:-mongodb}"
port="${DB_PORT:-27017}"

until nc -z "$host" "$port"; do
  >&2 echo "Mongodb is unavailable - sleeping"
  sleep 1
done

>&2 echo "Mongodb is up - executing command"
# Start your app
npm start