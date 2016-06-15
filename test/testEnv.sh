npmts
docker-machine start default; eval \"$(docker-machine env default)\"
docker build -t dockersock-image .
docker-compose up