# amaysim-au/devops-r53

Create a DNS record which resolves with an IP address for each instance in an ASG.

## Credit

Largely taken from https://objectpartners.com/2015/07/07/aws-tricks-updating-route53-dns-for-autoscalinggroup-using-lambda/

## How to Use

Tag your ASG with `DomainMeta`: `$HostedZoneId:$RecordName` e.g. `DomainMeta`: `Z6SABCDEFGHIJ:myservice.foobar.com.`, then configure the Autoscaling Group Lifecycle Hooks to send a message to the SNS topic created by this service.

## Pre-requisites

  * Docker
  * Docker Compose
  * Make

## Checkout

```bash
git clone https://github.com/amaysim-au/devops-r53.git
cd ./devops-r53
```

## Configure

Generate a new .env file.

```bash
make .env
```

## Deploy

```bash
make build
make deploy
```

## Remove

```bash
make remove
```
