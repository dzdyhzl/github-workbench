# GitHub repository workbench

A left-sidebar global page for DeepSeek Harness built on the local GitHub CLI.

## What it does

- **Setup gate** — the page requires the GitHub CLI (`gh`). When it is missing or no account is signed in, the page shows install and login guidance with a **Re-check** button; once detection passes, the workbench opens automatically.
- **Account selector** — `gh auth status` enumerates every GitHub account signed in on this machine. Switching runs `gh auth switch -u <login> -h github.com`. The first switch asks for confirmation because it changes which account every other local `gh` flow uses; later switches do not ask again. With a single account the selector shows the account name only.
- **Area A — repository list** — the active account's personal, collaborator, and organization repositories (fetched through `gh api user/repos` with the `owner,collaborator,organization_member` affiliation, so collaborator and organization repos appear beside owned ones). Cards show the ownership category, visibility, and last update time, and carry a local-link badge computed by matching workspace `remote origin` URLs against `github.com/<owner>/<name>`. The first load reads 100 repositories; **Load more** appends the next 100. The list refreshes when the page opens and via the header refresh button. A search box filters the loaded cards.
  - Local matching follows the DSH workspace registry. A card with one match opens a conversation in that workspace. When several workspaces match, the card opens a candidate list ordered by most recent use. A card with no match opens its GitHub page after the local scan completes.
  - **Create repository for a workspace** — select a registered DSH workspace or enter its absolute path. The repository name defaults to the directory name, the description is optional, and visibility defaults to private. When a repository of the same name already exists under the account, the form offers renaming or linking the existing repository as `origin` instead. Nothing is pushed automatically; the form reports the exact next step.
- **Area B — declined workspaces** — a table per account (the current account is shown above the table) of workspaces whose repository creation was declined: workspace path, decline time, and a free-text remark that can be edited and saved. Each row offers **Create now** (opens the same creation form bound to that path) and **Remove** (asks for confirmation, then shows the one-click creation prompt template to paste into a new session in that workspace).

## Data

Declined-workspace records persist to the fixed JSON file `~/.dsh/github-workbench.json`, grouped by account key, so agent-side skills read and write the same data:

```json
{ "declined": { "<account>": [ { "path": "...", "declinedAt": "ISO", "remark": "" } ] } }
```

## Requirements

- GitHub CLI (`gh`) installed on the host; account(s) signed in with `gh auth login`.
- Repository creation and account switching run real `gh` commands on the host; no token is read or stored by this plugin.

## Environment robustness

`gh` and `git` find their configuration (`hosts.yml`, global gitconfig) through
`USERPROFILE`/`APPDATA` on Windows and `HOME` elsewhere. When the Harness host is
launched from a stripped environment, those variables can be missing, and the
failure mode is misleading: `gh auth status` silently answers "You are not
logged into any GitHub hosts" even though the user is signed in, and git fails
with `fatal: $HOME not set`.

Every `gh` and `git` child this plugin spawns therefore goes through
`withProfileEnv` (`index.js`), which restores the missing standard profile
variables from `os.homedir()` — the one call that keeps working in a stripped
environment — before inheriting the (sensitive-scrubbed) parent environment.
The detection gate can no longer report a false "not signed in" for this
reason, and `gh` no longer writes stray state (`.local/state/gh/`) into the
current working directory when it cannot resolve its real config home.

