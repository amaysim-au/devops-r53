PACKAGE_DIR=package/package
ARTIFACT_NAME=package.zip
ARTIFACT_PATH=package/$(ARTIFACT_NAME)
ifdef DOTENV
	DOTENV_TARGET=dotenv
else
	DOTENV_TARGET=.env
endif
ifdef AWS_ROLE
       ASSUME_REQUIRED?=assumeRole
endif
ifdef GO_PIPELINE_NAME
	ENV_RM_REQUIRED?=rm_env
endif

################
# Entry Points #
################

shell: $(DOTENV_TARGET)
	docker-compose run --rm serverless bash

build: $(DOTENV_TARGET)
	docker-compose run --rm serverless make _deps _build

deploy: $(ENV_RM_REQUIRED) $(ARTIFACT_PATH) $(DOTENV_TARGET) $(ASSUME_REQUIRED)
	docker-compose run --rm serverless make _deploy

remove: $(DOTENV_TARGET)
	docker-compose run --rm serverless make _remove

assumeRole: .env
	docker run --rm -e "AWS_ACCOUNT_ID" -e "AWS_ROLE" amaysim/aws:1.1.3 assume-role.sh >> .env
.PHONY: assumeRole

##########
# Others #
##########

# Create .env based on .env.template if .env does not exist
.env:
	@echo "Create .env with .env.template"
	cp .env.template .env

# Create/Overwrite .env with $(DOTENV)
dotenv:
	@echo "Overwrite .env with $(DOTENV)"
	cp $(DOTENV) .env

# Removes the .env file before each deploy to force regeneration without cleaning the whole environment
rm_env:
	rm -f .env

# _deps depends on node_modules.zip and THEN node_modules
_deps: node_modules.zip node_modules

# if there is no node_modules.zip artefact then fetch from npm and make node_modules.zip artefact
node_modules.zip:
	echo "//registry.npmjs.org/:_authToken=$(NPM_TOKEN)" >> .npmrc
	yarn config set registry http://registry.npmjs.org
	yarn install --no-bin-links
	zip -rq node_modules.zip node_modules/

# if there is no node_modules directory then unzip from node_modules.zip artefact
node_modules:
	mkdir -p node_modules
	unzip -qo -d . node_modules.zip

# _build installs nodejs production modules, and creates a package ready for Serverless Framework.
_build:
	mkdir -p $(PACKAGE_DIR)/node_modules
	cp package.json $(PACKAGE_DIR)/
	echo $(PACKAGE_DIR)/src
	cp -r src $(PACKAGE_DIR)/src
	./node_modules/babel-cli/bin/babel.js src -d $(PACKAGE_DIR)/src
	cd $(PACKAGE_DIR) && yarn install --production --no-bin-links
	cd $(PACKAGE_DIR) && zip -rq ../package .

_deploy:
	mkdir -p node_modules
	unzip -qo -d . node_modules.zip
	rm -fr .serverless
	sls deploy -v

_remove:
	sls remove -v
	rm -fr .serverless

_clean:
	rm -fr node_modules .serverless package
