# amaysim/devops-r53

A short description to add to Github

## Pre-requisites

* Docker
* Docker Compose
* Make

## Checkout

```bash
git clone https://github.com/amaysim-au/devops-r53.git
cd ./devices-api
```

## Configure

Generate a new .env file.

```bash
make .env
```

Copy and paste appropriate values from the secret store into your local .env file. See `.env.template` for details. **Warning: Never commit this file.**

## Develop

Build the solution:

```bash
make
```

Run the tests:

```bash
make test
```

Run serverless locally:

```bash
make offline
```

## Deploy & Run

```bash
make deploy
```

You should see something like:
```
   endpoints:
     GET - https://xyz.execute-api.ap-southeast-2.amazonaws.com/dev/greet
```

You can then run curl:

```bash
curl https://xyz.execute-api.ap-southeast-2.amazonaws.com/dev/greet
```

You should get output similar to:
```
 <html>
   <body>
     <h1>"Welcome to Amaysim Serverless"</h1>
   </body>
 </html>
```

## Remove

```bash
# remove the api gateway
make remove

# clean your folder
make _clean
```
