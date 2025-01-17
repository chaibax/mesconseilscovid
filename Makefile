.DEFAULT_GOAL:=help

key.pem:  ## Generate certificates to be able to run `https` on `localhost`.
	openssl req -nodes -newkey rsa:2048 -x509  -days 365 -keyout key.pem -out cert.pem -subj "/C=FR/CN=localhost"

serve: build  ## Local HTTP server with auto rebuild (with LiveReload).
	python3 serve.py --watch

serve-ssl: key.pem build  ## Local HTTPS server with auto rebuild (without LiveReload).
	python3 serve.py --watch --ssl

install: install-python install-js

install-python:  ## Install Python dependencies.
	python3 -m pip install -U pip setuptools wheel
	python3 -m pip install -r requirements.txt

install-js:  ## Install JS dependencies.
	npm install

clean:  ## Clean up JS related stuff.
	rm -rf ./node_modules
	rm -rf ./.cache

##
## Run JS unit tests matching a given pattern/browser engine.
##
## Examples:
##    make test-unit grep=profil
##    make test-integration browser=webkit grep=suivi
##    make test browser=webkit

test: test-unit test-integration test-tools test-feedback

ifdef grep
script_flags = -- --grep $(grep)
else
script_flags =
endif

ifdef cover
	coverage = :coverage
else
	coverage =
endif

test-unit:  ## Run JS unit tests.
	npm run-script test$(coverage) $(script_flags)

test-integration: build  ## Run JS browser tests.
ifdef browser
	BROWSER=$(browser) npm run-script test-integration $(script_flags)
else
	BROWSER=chromium npm run-script test-integration $(script_flags)
	BROWSER=firefox npm run-script test-integration $(script_flags)
	BROWSER=webkit npm run-script test-integration $(script_flags)
endif

test-tools:
	pytest test_*.py

test-feedback:
	tox -c feedback/tox.ini

check: check-links check-versions check-orphelins check-diagrammes check-service-worker

check-links:  # Check that links to external pages are still valid.
	python3 check.py links --timeout 30 --delay 0.2

check-versions:  # Check that current version matches service-worker one.
	python3 check.py versions

check-orphelins:  # Check that all markdown files are in use in template.
	python3 check.py orphelins

check-diagrammes:  # Check that all files from diagrammes/matrice exist.
	python3 check.py diagrammes

check-service-worker:  # Check that all files in use are listed in service-worker.js.
	python3 check.py service_worker

lint:  ## Run ESLint + check code style.
	npm run-script lint
	./node_modules/.bin/prettier src/*.js src/**/*.js src/**/**/*.js src/**/**/**/*.js src/style.css --check

pretty:  ## Run PrettierJS.
	./node_modules/.bin/prettier src/*.js src/**/*.js src/**/**/*.js src/**/**/**/*.js src/style.css --write

build:  ## Build all files (markdown + statics).
	python3 build.py all
	npm run-script build

generate:  ## Auto-regenerate the `index.html` file from `template.html` + contenus.
	find . -type f \( -iname "*.md" ! -iname "README.md" ! -iname "CHANGELOG.md" -o -iname "template.html" ! -iname "CHANGELOG.md" \) -not -path "./node_modules/*" -not -path "./venv/*" | entr -r python3 build.py index

prefectures:  ## Generate data related to prefectures.
	python prefectures.py generate
	make pretty

dev:  ## Auto-rebuild and serve the static website with Parcel.
	npm run-script build-dev

pre-commit: pretty lint test-unit build check-versions check-orphelins check-diagrammes check-service-worker  ## Interesting prior to commit/push.

prod: clean install lint pretty test check  ## Make sure everything is clean prior to deploy.
	# Note: `test` dependency will actually generate the `build`.

.PHONY: serve serve-ssl install install-python install-js clean test test-unit test-integration test-feedback check-links check-versions check-documentation check-service-worker build generate dev pre-commit prod help

help:  ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
