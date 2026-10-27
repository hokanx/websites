# UiPrompts MCP setup

This repository contains the server command only. Supply `UIPROMPTS_API_KEY` privately through the MCP host's runtime secret/environment settings. For a shell-launched host, set the variable in the launching shell and verify that the host forwards it to the server. Do not put the key in `.mcp.json`, source files, screenshots, logs or commits.

An earlier version of this configuration included a publicly exposed credential. The account owner must replace/revoke that key and review its usage. Removing it from this branch does not remove other branches or history, and does not invalidate the credential.

After configuring a replacement privately, verify the connection without printing the value. No environment-substitution syntax is assumed by this JSON configuration.
