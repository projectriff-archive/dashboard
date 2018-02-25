.PHONY: clean dockerize test

TAG := `jq --raw-output '.version' package.json`

clean:
	rm -rf build coverage node_modules

test:
	CI=true npm test

dockerize:
	docker build . -t projectriff/dashboard:$(TAG)

dockerize-dev: dockerize
	kubectl delete pod -l app=riff,component=dashboard
