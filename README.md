[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white)](https://github.com/pre-commit/pre-commit)





## Initializing Nuxt for the app
At the root of the repo, run `pnpm dlx nuxi@latest init elifine_app`
Select "overwrite directory", `pnpm` and do not initialize git repository.
You can remove the extra .gitignore file `rm elifine_app/.gitignore`

## Infrastructure Deployments
Run a Pulumi Preview: `uv --directory=./infrastructure run python -m infrastructure.pulumi_deploy --stack=dev`


## Updating from the template
This repository uses a copier template. To pull in the latest updates from the template, use the command:
`copier update --trust --conflict rej --defaults`
