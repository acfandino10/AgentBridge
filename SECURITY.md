# Security

## Credentials

Do not commit API keys, database URLs, or private endpoints. Configuration belongs in environment variables. `.env.example` lists the names; `.env` is gitignored.

If a key was saved in `.env`, in a chat, or in a commit, revoke it at the provider and create a new one. Removing the file locally does not invalidate a key that already exists at the provider.

This repository had no git history when it was prepared for release, so there were no past commits to rewrite. If you later find a secret in history, rewrite that history with `git filter-repo` before the repository is public, then rotate the key.

## Reporting a vulnerability

Once the repository is public, use GitHub private vulnerability reporting instead of a public issue. Include the affected version and a short description. Do not include a live secret in the report.

There is no bug bounty.
