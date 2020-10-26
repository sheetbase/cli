<section id="head" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

# @sheetbase/cli

**Official CLI for working with Sheetbase.**

</section>

<section id="tocx" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

- [Command overview](#cli-command-overview)
- [Command reference](#cli-command-reference)
  - [`backend`](#command-backend)
    - [`build`](#command-backend-build)
    - [`deploy`](#command-backend-deploy)
    - [`install`](#command-backend-install)
    - [`lint`](#command-backend-lint)
    - [`push`](#command-backend-push)
    - [`run`](#command-backend-run)
    - [`test`](#command-backend-test)
    - [`uninstall`](#command-backend-uninstall)
  - [`config`](#command-config)
    - [`export`](#command-config-export)
    - [`import`](#command-config-import)
    - [`list`](#command-config-list)
    - [`update`](#command-config-update)
  - [`database`](#command-database)
    - [`create`](#command-database-create)
    - [`export`](#command-database-export)
    - [`import`](#command-database-import)
    - [`list`](#command-database-list)
  - [`docs`](#command-docs)
  - [`frontend`](#command-frontend)
    - [`build`](#command-frontend-build)
    - [`deploy`](#command-frontend-deploy)
    - [`install`](#command-frontend-install)
    - [`lint`](#command-frontend-lint)
    - [`prerender`](#command-frontend-prerender)
    - [`run`](#command-frontend-run)
    - [`test`](#command-frontend-test)
    - [`uninstall`](#command-frontend-uninstall)
  - [`google`](#command-google)
    - [`active`](#command-google-active)
    - [`connect`](#command-google-connect)
    - [`disconnect`](#command-google-disconnect)
    - [`list`](#command-google-list)
  - [`new`](#command-new)
  - [`project`](#command-project)
    - [`build`](#command-project-build)
    - [`configs`](#command-project-configs)
    - [`deploy`](#command-project-deploy)
    - [`info`](#command-project-info)
    - [`lint`](#command-project-lint)
    - [`preview`](#command-project-preview)
    - [`setup`](#command-project-setup)
    - [`test`](#command-project-test)
    - [`url`](#command-project-url)
    - [`urls`](#command-project-urls)
  - [`update`](#command-update)
  - [`help`](#command-help)
  - [`*`](#command-*)
- [Detail API reference](https://sheetbase.github.io/cli)


</section>

<section id="cli" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

<h2><a name="cli-command-overview"><p>Command overview</p>
</a></h2>

Official CLI for working with Sheetbase.

- [`sheetbase backend|b [subCommand] [params...]`](#command-backend)
- [`sheetbase config|c [subCommand] [params...]`](#command-config)
- [`sheetbase database|db [subCommand] [params...] --id [value] --remote --data`](#command-database)
- [`sheetbase docs|d`](#command-docs)
- [`sheetbase frontend|f [subCommand] [params...]`](#command-frontend)
- [`sheetbase google|gg [subCommand] [params...] --yes --creds --full-drive`](#command-google)
- [`sheetbase new|start|n <name> [source] --skip-install --skip-setup`](#command-new)
- [`sheetbase project|p [subCommand] [params...] --fresh --open --message`](#command-project)
- [`sheetbase update|up --yes --self`](#command-update)
- [`sheetbase help|he --detail`](#command-help)
- [`sheetbase *`](#command-*)

<h2><a name="cli-command-reference"><p>Command reference</p>
</a></h2>

<h3><a name="command-backend"><p><code>backend</code></p>
</a></h3>

Backend related tasks.

**Usage:**

```sh
sheetbase backend [subCommand] [params...]
sheetbase b [subCommand] [params...]
```

**Sub-commands:**

<h4><a name="command-backend-build"><p><code>build</code></p>
</a></h4>

Build the backend.

**Usage:**

```sh
sheetbase backend build
```

**Proxy use:**

```sh
sheetbase backend-build
```

<h4><a name="command-backend-deploy"><p><code>deploy</code></p>
</a></h4>

Deploy the backend.

**Usage:**

```sh
sheetbase backend deploy
```

**Proxy use:**

```sh
sheetbase backend-deploy
```

<h4><a name="command-backend-install"><p><code>install</code></p>
</a></h4>

Install backend dependencies.

**Usage:**

```sh
sheetbase backend install
```

**Proxy use:**

```sh
sheetbase backend-install
```

<h4><a name="command-backend-lint"><p><code>lint</code></p>
</a></h4>

Lint the backend.

**Usage:**

```sh
sheetbase backend lint
```

**Proxy use:**

```sh
sheetbase backend-lint
```

<h4><a name="command-backend-push"><p><code>push</code></p>
</a></h4>

Push the backend.

**Usage:**

```sh
sheetbase backend push
```

**Proxy use:**

```sh
sheetbase backend-push
```

<h4><a name="command-backend-run"><p><code>run</code></p>
</a></h4>

Run backend scripts.

**Usage:**

```sh
sheetbase backend run
```

**Proxy use:**

```sh
sheetbase backend-run
```

<h4><a name="command-backend-test"><p><code>test</code></p>
</a></h4>

Test the backend.

**Usage:**

```sh
sheetbase backend test
```

**Proxy use:**

```sh
sheetbase backend-test
```

<h4><a name="command-backend-uninstall"><p><code>uninstall</code></p>
</a></h4>

Uninstall backend dependencies.

**Usage:**

```sh
sheetbase backend uninstall
```

**Proxy use:**

```sh
sheetbase backend-uninstall
```

<h3><a name="command-config"><p><code>config</code></p>
</a></h3>

Config the project.

**Usage:**

```sh
sheetbase config [subCommand] [params...]
sheetbase c [subCommand] [params...]
```

**Sub-commands:**

<h4><a name="command-config-export"><p><code>export</code></p>
</a></h4>

Export configurations.

**Usage:**

```sh
sheetbase config export
```

**Proxy use:**

```sh
sheetbase config-export
```

<h4><a name="command-config-import"><p><code>import</code></p>
</a></h4>

Import configurations.

**Usage:**

```sh
sheetbase config import
```

**Proxy use:**

```sh
sheetbase config-import
```

<h4><a name="command-config-list"><p><code>list</code></p>
</a></h4>

List configurations.

**Usage:**

```sh
sheetbase config list
```

**Proxy use:**

```sh
sheetbase config-list
```

<h4><a name="command-config-update"><p><code>update</code></p>
</a></h4>

Update configurations.

**Usage:**

```sh
sheetbase config update
```

**Proxy use:**

```sh
sheetbase config-update
```

<h3><a name="command-database"><p><code>database</code></p>
</a></h3>

Manage the database.

**Usage:**

```sh
sheetbase database [subCommand] [params...] --id [value] --remote --data
sheetbase db [subCommand] [params...] --id [value] --remote --data
```

**Sub-commands:**

<h4><a name="command-database-create"><p><code>create</code></p>
</a></h4>

Create tables in the database.

**Usage:**

```sh
sheetbase database create [inputs...] --id [value] --data
sheetbase database new [inputs...] --id [value] --data
```

**Proxy use:**

```sh
sheetbase database-create [inputs...] --id [value] --data
```

**Parameters:**

- `[inputs...]`: List of table names, ex.: categories posts ...

**Options:**

- `-i, --id [value]`: Custom database id.
- `-d, --data`: Create table with sample data.

<h4><a name="command-database-export"><p><code>export</code></p>
</a></h4>

Export data from the database.

**Usage:**

```sh
sheetbase database export <table> [dir] --id [value]
sheetbase database download <table> [dir] --id [value]
sheetbase database ex <table> [dir] --id [value]
```

**Proxy use:**

```sh
sheetbase database-export <table> [dir] --id [value]
```

**Parameters:**

- `<table>`: The table name.
- `[dir]`: Custom export folder.

**Options:**

- `-i, --id [value]`: Custom database id.

<h4><a name="command-database-import"><p><code>import</code></p>
</a></h4>

Import data to the database.

**Usage:**

```sh
sheetbase database import <table> [source] --id [value]
sheetbase database upload <table> [source] --id [value]
sheetbase database im <table> [source] --id [value]
```

**Proxy use:**

```sh
sheetbase database-import <table> [source] --id [value]
```

**Parameters:**

- `<table>`: The table name.
- `[source]`: Source to the data or default.

**Options:**

- `-i, --id [value]`: Custom database id.

<h4><a name="command-database-list"><p><code>list</code></p>
</a></h4>

List local or remote models.

**Usage:**

```sh
sheetbase database list --id [value] --remote
sheetbase database show --id [value] --remote
sheetbase database ls --id [value] --remote
```

**Proxy use:**

```sh
sheetbase database-list --id [value] --remote
```

**Options:**

- `-i, --id [value]`: Custom database id.
- `-r, --remote`: List remote tables.

<h3><a name="command-docs"><p><code>docs</code></p>
</a></h3>

Open documentation.

**Usage:**

```sh
sheetbase docs
sheetbase d
```

<h3><a name="command-frontend"><p><code>frontend</code></p>
</a></h3>

Frontend related tasks.

**Usage:**

```sh
sheetbase frontend [subCommand] [params...]
sheetbase f [subCommand] [params...]
```

**Sub-commands:**

<h4><a name="command-frontend-build"><p><code>build</code></p>
</a></h4>

Build the frontend.

**Usage:**

```sh
sheetbase frontend build
```

**Proxy use:**

```sh
sheetbase frontend-build
```

<h4><a name="command-frontend-deploy"><p><code>deploy</code></p>
</a></h4>

Deploy the frontend.

**Usage:**

```sh
sheetbase frontend deploy
```

**Proxy use:**

```sh
sheetbase frontend-deploy
```

<h4><a name="command-frontend-install"><p><code>install</code></p>
</a></h4>

Install frontend dependencies.

**Usage:**

```sh
sheetbase frontend install
```

**Proxy use:**

```sh
sheetbase frontend-install
```

<h4><a name="command-frontend-lint"><p><code>lint</code></p>
</a></h4>

Lint the frontend.

**Usage:**

```sh
sheetbase frontend lint
```

**Proxy use:**

```sh
sheetbase frontend-lint
```

<h4><a name="command-frontend-prerender"><p><code>prerender</code></p>
</a></h4>

Prerender the frontend.

**Usage:**

```sh
sheetbase frontend prerender
```

**Proxy use:**

```sh
sheetbase frontend-prerender
```

<h4><a name="command-frontend-run"><p><code>run</code></p>
</a></h4>

Run frontend scripts.

**Usage:**

```sh
sheetbase frontend run
```

**Proxy use:**

```sh
sheetbase frontend-run
```

<h4><a name="command-frontend-test"><p><code>test</code></p>
</a></h4>

Test the frontend.

**Usage:**

```sh
sheetbase frontend test
```

**Proxy use:**

```sh
sheetbase frontend-test
```

<h4><a name="command-frontend-uninstall"><p><code>uninstall</code></p>
</a></h4>

Uninstall frontend dependencies.

**Usage:**

```sh
sheetbase frontend uninstall
```

**Proxy use:**

```sh
sheetbase frontend-uninstall
```

<h3><a name="command-google"><p><code>google</code></p>
</a></h3>

Manage Google accounts.

**Usage:**

```sh
sheetbase google [subCommand] [params...] --yes --creds --full-drive
sheetbase gg [subCommand] [params...] --yes --creds --full-drive
```

**Sub-commands:**

<h4><a name="command-google-active"><p><code>active</code></p>
</a></h4>

Change the active account.

**Usage:**

```sh
sheetbase google active <id>
sheetbase google change <id>
sheetbase google at <id>
```

**Proxy use:**

```sh
sheetbase google-active <id>
```

**Parameters:**

- `<id>`: The Google account id.

<h4><a name="command-google-connect"><p><code>connect</code></p>
</a></h4>

Connect an account.

**Usage:**

```sh
sheetbase google connect --yes --creds --full-drive
sheetbase google login --yes --creds --full-drive
sheetbase google cn --yes --creds --full-drive
```

**Proxy use:**

```sh
sheetbase google-connect --yes --creds --full-drive
```

**Options:**

- `-y, --yes`: Agree on account connection.
- `-c, --creds`: Save credential to .googlerc.json.
- `-f, --full-drive`: Not recommended, full access to Drive.

<h4><a name="command-google-disconnect"><p><code>disconnect</code></p>
</a></h4>

Disconnect connected accounts.

**Usage:**

```sh
sheetbase google disconnect <input>
sheetbase google logout <input>
sheetbase google dc <input>
```

**Proxy use:**

```sh
sheetbase google-disconnect <input>
```

**Parameters:**

- `<input>`: Disconnection input: {id}, all, active, local.

<h4><a name="command-google-list"><p><code>list</code></p>
</a></h4>

List connected accounts.

**Usage:**

```sh
sheetbase google list
sheetbase google show
sheetbase google ls
```

**Proxy use:**

```sh
sheetbase google-list
```

<h3><a name="command-new"><p><code>new</code></p>
</a></h3>

Star a new project.

**Usage:**

```sh
sheetbase new <name> [source] --skip-install --skip-setup
sheetbase start <name> [source] --skip-install --skip-setup
sheetbase n <name> [source] --skip-install --skip-setup
```

**Parameters:**

- `<name>`: The project name.
- `[source]`: The custom source.

**Options:**

- `-i, --skip-install`: Skip installing npm packages.
- `-s, --skip-setup`: Skip project setup.

<h3><a name="command-project"><p><code>project</code></p>
</a></h3>

Project related tasks.

**Usage:**

```sh
sheetbase project [subCommand] [params...] --fresh --open --message
sheetbase p [subCommand] [params...] --fresh --open --message
```

**Sub-commands:**

<h4><a name="command-project-build"><p><code>build</code></p>
</a></h4>

Build the project.

**Usage:**

```sh
sheetbase project build
```

**Proxy use:**

```sh
sheetbase project-build
sheetbase build
```

<h4><a name="command-project-configs"><p><code>configs</code></p>
</a></h4>

View project configs.

**Usage:**

```sh
sheetbase project configs
```

**Proxy use:**

```sh
sheetbase project-configs
sheetbase configs
```

<h4><a name="command-project-deploy"><p><code>deploy</code></p>
</a></h4>

Deploy the project.

**Usage:**

```sh
sheetbase project deploy --message
```

**Proxy use:**

```sh
sheetbase project-deploy --message
sheetbase deploy --message
```

**Options:**

- `-m, --message`: Deployment message.

<h4><a name="command-project-info"><p><code>info</code></p>
</a></h4>

Output project info.

**Usage:**

```sh
sheetbase project info
```

**Proxy use:**

```sh
sheetbase project-info
sheetbase info
```

<h4><a name="command-project-lint"><p><code>lint</code></p>
</a></h4>

Lint the project.

**Usage:**

```sh
sheetbase project lint
```

**Proxy use:**

```sh
sheetbase project-lint
sheetbase lint
```

<h4><a name="command-project-preview"><p><code>preview</code></p>
</a></h4>

Preview the project.

**Usage:**

```sh
sheetbase project preview
```

**Proxy use:**

```sh
sheetbase project-preview
sheetbase preview
```

<h4><a name="command-project-setup"><p><code>setup</code></p>
</a></h4>

Setup the project.

**Usage:**

```sh
sheetbase project setup --fresh
```

**Proxy use:**

```sh
sheetbase project-setup --fresh
sheetbase setup --fresh
```

**Options:**

- `-r, --fresh`: Force re-setup.

<h4><a name="command-project-test"><p><code>test</code></p>
</a></h4>

Test the project.

**Usage:**

```sh
sheetbase project test
```

**Proxy use:**

```sh
sheetbase project-test
sheetbase test
```

<h4><a name="command-project-url"><p><code>url</code></p>
</a></h4>

View or open a project URL.

**Usage:**

```sh
sheetbase project url <name> --open
```

**Proxy use:**

```sh
sheetbase project-url <name> --open
sheetbase url <name> --open
```

**Parameters:**

- `<name>`: The url name.

**Options:**

- `-o, --open`: Open the url in browser.

<h4><a name="command-project-urls"><p><code>urls</code></p>
</a></h4>

View project URLs.

**Usage:**

```sh
sheetbase project urls
```

**Proxy use:**

```sh
sheetbase project-urls
```

<h3><a name="command-update"><p><code>update</code></p>
</a></h3>

Update the CLI to the latest version.

**Usage:**

```sh
sheetbase update --yes --self
sheetbase up --yes --self
```

**Options:**

- `-y, --yes`: Do update now.
- `-s, --self`: Update the CLI itself.

<h3><a name="command-help"><p><code>help</code></p>
</a></h3>

Display help.

**Usage:**

```sh
sheetbase help --detail
sheetbase he --detail
```

**Options:**

- `-d, --detail`: Show detail help.

<h3><a name="command-*"><p><code>*</code></p>
</a></h3>

Any other command will run: `npm run <cmd>`.

**Usage:**

```sh
sheetbase <cmd>
```

</section>

<section id="license" data-note="AUTO-GENERATED CONTENT, DO NOT EDIT DIRECTLY!">

## License

**@sheetbase/cli** is released under the [MIT](https://github.com/sheetbase/cli/blob/master/LICENSE) license.

</section>
