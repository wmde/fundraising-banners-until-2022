.PHONY: setup server lint lint-js lint-css test ci build help

build: clean setup ## Build all banners into dist directory
	docker-compose run js-build npm run build

setup: ## Install all npm dependencies
	docker-compose run js-build npm install

server: ## Start development server on http://localhost:9084/
	docker-compose up js-serve

lint-js:
	docker-compose run js-build npm run lint:js

lint-css:
	docker-compose run js-build npm run lint:css

lint: lint-js lint-css ## Check JavaScript and CSS code style

test: ## Run all unit tests
	docker-compose run js-build npm run test

ci: test lint ## Run continuous integration tasks (linting, testing)

clean: ## Clean up dist directory
	docker-compose run js-build npm run clean

update-content:
	docker-compose run js-build npm update fundraising-frontend-content

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'


