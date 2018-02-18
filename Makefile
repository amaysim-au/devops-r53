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

offline: $(DOTENV_TARGET)
	docker-compose run -p 3000:3000 --rm serverless sls offline start --host 0.0.0.0

test: $(DOTENV_TARGET)
	docker-compose run --rm serverless make _deps _testUnitWithCoverage _testIntegration
.PHONY: test

build: $(DOTENV_TARGET)
	docker-compose run --rm serverless make _deps _build

deploy: $(ENV_RM_REQUIRED) $(ARTIFACT_PATH) $(DOTENV_TARGET) $(ASSUME_REQUIRED)
	docker-compose run --rm serverless make _deploy

run: $(DOTENV_TARGET)
	docker-compose run --rm lambda src/greet.greet

testSystem: $(ENV_RM_REQUIRED) $(DOTENV_TARGET)
	docker-compose run --rm serverless make _deps _testSystem

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

_testUnitWithCoverage:
	./node_modules/nyc/bin/nyc.js --reporter=lcov --reporter=text-lcov ./node_modules/mocha/bin/mocha --compilers js:babel-register test/unit/**
	./node_modules/codeclimate-test-reporter/bin/codeclimate.js < ./coverage/lcov.info
	./node_modules/eslint/bin/eslint.js src

_testUnit:
	./node_modules/mocha/bin/mocha --compilers js:babel-register --recursive test/unit
	./node_modules/eslint/bin/eslint.js src

_testIntegration:
	./node_modules/mocha/bin/mocha --compilers js:babel-register --recursive test/integration

_testPact:
	./node_modules/mocha/bin/mocha --compilers js:babel-register --recursive test/pact

_testSystem:
	./node_modules/mocha/bin/mocha --compilers js:babel-register --recursive test/system
	./node_modules/eslint/bin/eslint.js src

# _build installs nodejs production modules, and creates a package ready for Serverless Framework.
_build:
	mkdir -p $(PACKAGE_DIR)/node_modules
	cp package.json $(PACKAGE_DIR)/
	echo $(PACKAGE_DIR)/src
	cp -r src $(PACKAGE_DIR)/src
	./node_modules/babel-cli/bin/babel.js src -d $(PACKAGE_DIR)/src
	cd $(PACKAGE_DIR) && yarn install --production --no-bin-links
	cd $(PACKAGE_DIR) && zip -rq ../package .

# _buildLite does a pack but does not do the yarn install.
# This speeds up the process if you you have already done _build before and the node_modules production hasn't changed.
_buildLite:
	rm -fr $(PACKAGE_DIR)/src
	babel src -d $(PACKAGE_DIR)/src
	cd $(PACKAGE_DIR) && zip -rq ../package .
.PHONY: _buildLite

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
