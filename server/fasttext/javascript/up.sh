cp Dockerfile ./src
cp ../../basic-network/connection.json ./src
cd src
echo -e "\n\n------------ Bot logic docker build ------------\n"
# build nluinterface image
docker build -t nodeserver .
cd -

# docker swarm init
docker-compose -p nodeserver -f node.yml up