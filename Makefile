.DEFAULT_GOAL:=help

key.pem:  ## Generate certificates to be able to run `https` on `localhost`.
	openssl req -nodes -newkey rsa:2048 -x509  -days 365 -keyout key.pem -out cert.pem -subj "/C=FR/CN=localhost"

serve: build  ## Local HTTP server with auto rebuild (with LiveReload)
	python3 serve.py --watch

serve-ssl: key.pem build  ## Local HTTPS server with auto rebuild (without LiveReload)
	python3 serve.py --watch --ssl

install:  ## Install Python and JS dependencies.
	python3 -m pip install -U pip
	python3 -m pip install -r requirements.txt
	npm install

test:  ## Run JS unit tests + links checker.
	npm run-script test
	python3 test.py links

lint:  ## Run ESLint.
	npm run-script lint

build:  ## Build the index from `template.html` + contenus markdown files.
	python3 build.py all
	npm run-script build

.PHONY: serve serve-ssl install test build

help:  ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)