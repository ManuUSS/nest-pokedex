<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Development set up

1. Clone git repository
2. Execute
```
yarn install
```

3. Install Nest CLI
```
npm i -g @nestjs/cli
```

4. Set up the database
```
docker-compose up -d
```

5. Rebuild database records using a   seed
```
http://localhost:3000/api/v2/seed
```

### Tech stack
* MongoDB
* Nest