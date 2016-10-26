if [ -z $PGUSER ]; then
  export PGUSER=postgres
fi
if [ -z $PGPASS ]; then
  export PGPASS=mysecretpassword
fi

BASEDIR=$(dirname "$0")
cd $BASEDIR

docker-compose up -d

until (cd ..; npm run migrate 2>/dev/null | grep 'pending\|applied' >/dev/null);
do
  sleep 2
  printf '.'
done
echo ''

if (cd ..; npm run migrate 2>/dev/null | grep 'applied' >/dev/null) then
  echo 'Up to date'
  exit 0
fi

(cd ..; npm run migrate:up)
(cd ..; npm run seed:up)
