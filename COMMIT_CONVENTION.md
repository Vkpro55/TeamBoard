# Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) for a clear, searchable git history.

## Format

```
<type>(<scope>): <short summary>

[optional body — explain why, not just what]

[optional footer — breaking changes, issue refs]
```

- **Summary:** imperative mood, lowercase, no period, max ~72 characters
- **Body:** wrap at ~72 characters; separate from summary with a blank line
- **Scope:** optional area of change (`auth`, `client`, `server`, `tasks`, etc.)

## Types

| Type       | When to use                                      |
|------------|--------------------------------------------------|
| `feat`     | New feature or user-facing capability            |
| `fix`      | Bug fix                                          |
| `docs`     | README, comments, or documentation only          |
| `style`    | Formatting, whitespace — no logic change         |
| `refactor` | Code restructure without changing behavior       |
| `test`     | Adding or updating tests                         |
| `chore`    | Tooling, deps, config, scaffolding               |
| `build`    | Build system or bundler changes                  |
| `ci`       | CI/CD pipeline changes                           |
| `perf`     | Performance improvement                          |

## Examples

```
feat(auth): add JWT login and register endpoints
```

```
fix(tasks): prevent duplicate task creation on double submit
```

```
docs: update environment variables in README
```

```
chore(server): scaffold Express app with folder structure
```

```
feat(client): add dashboard with project and task stats

Wire dashboard to /api/dashboard and show loading, empty,
and error states per assignment requirements.
```

## Rules

1. One logical change per commit — avoid mixing unrelated changes
2. Prefer `feat` / `fix` over vague messages like "update code" or "wip"
3. Reference issues in the footer when applicable: `Closes #12`
4. Use `BREAKING CHANGE:` in the footer for incompatible API changes
5. Keep commits buildable when possible — don't commit broken main

## Scopes (suggested)

- `auth` — authentication & authorization
- `client` — React frontend (use sub-scope if helpful: `client/dashboard`)
- `server` — Express backend
- `db` — MongoDB models and migrations
- `api` — REST routes and controllers
- `ui` — shared UI components
- `deps` — dependency updates
