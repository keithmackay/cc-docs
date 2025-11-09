# Environment Variables

Claude Code supports the following environment variables to control its behavior.

> **Note:** All environment variables can also be configured in `settings.json`. This is useful as a way to automatically set environment variables for each session, or to roll out a set of environment variables for your whole team or organization.

---

## 🔐 Authentication and API

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `ANTHROPIC_API_KEY` | API key sent as `X-Api-Key` header, typically for the Claude SDK | - | `sk-ant-api03-...` |
| `ANTHROPIC_AUTH_TOKEN` | Custom value for the `Authorization` header (prefixed with `Bearer `) | - | `my-custom-token` |
| `ANTHROPIC_CUSTOM_HEADERS` | Custom headers to add to requests | - | `X-Custom-Header: value` |
| `AWS_BEARER_TOKEN_BEDROCK` | Bedrock API key for authentication | - | `bedrock-key-123...` |

---

## 🤖 Model Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `ANTHROPIC_MODEL` | Name of the model setting to use | - | `sonnet`, `opus`, `claude-3-5-sonnet-20241022` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Model to use for `haiku` alias and background tasks | - | `claude-3-5-haiku-20241022` |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Model to use for `opus` alias | - | `claude-opus-4-20250514` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Model to use for `sonnet` alias | - | `claude-sonnet-4-20250514` |
| `ANTHROPIC_SMALL_FAST_MODEL` | **[DEPRECATED]** Name of Haiku-class model for background tasks | - | Use `ANTHROPIC_DEFAULT_HAIKU_MODEL` instead |
| `ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION` | Override AWS region for Haiku-class model when using Bedrock | - | `us-west-2` |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Model to use for subagents | - | `claude-3-5-sonnet-20241022` |

---

## ⚙️ Bash and Command Execution

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `BASH_DEFAULT_TIMEOUT_MS` | Default timeout for long-running bash commands | 120000 (2 min) | `300000` (5 min) |
| `BASH_MAX_TIMEOUT_MS` | Maximum timeout the model can set for bash commands | 600000 (10 min) | `900000` (15 min) |
| `BASH_MAX_OUTPUT_LENGTH` | Maximum characters in bash outputs before middle-truncation | 30000 | `50000` |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | Return to original working directory after each Bash command | `false` | `1` or `true` |

---

## 🌐 Cloud Infrastructure (Bedrock/Vertex)

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CLAUDE_CODE_USE_BEDROCK` | Enable AWS Bedrock | `false` | `1` or `true` |
| `CLAUDE_CODE_USE_VERTEX` | Enable Google Vertex AI | `false` | `1` or `true` |
| `CLAUDE_CODE_SKIP_BEDROCK_AUTH` | Skip AWS authentication for Bedrock (e.g., when using LLM gateway) | `false` | `1` or `true` |
| `CLAUDE_CODE_SKIP_VERTEX_AUTH` | Skip Google authentication for Vertex (e.g., when using LLM gateway) | `false` | `1` or `true` |
| `VERTEX_REGION_CLAUDE_3_5_HAIKU` | Override region for Claude 3.5 Haiku on Vertex AI | - | `us-central1` |
| `VERTEX_REGION_CLAUDE_3_7_SONNET` | Override region for Claude 3.7 Sonnet on Vertex AI | - | `us-east5` |
| `VERTEX_REGION_CLAUDE_4_0_OPUS` | Override region for Claude 4.0 Opus on Vertex AI | - | `us-central1` |
| `VERTEX_REGION_CLAUDE_4_0_SONNET` | Override region for Claude 4.0 Sonnet on Vertex AI | - | `us-east5` |
| `VERTEX_REGION_CLAUDE_4_1_OPUS` | Override region for Claude 4.1 Opus on Vertex AI | - | `us-central1` |

---

## 🔌 MCP (Model Context Protocol)

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `MCP_TIMEOUT` | Timeout in milliseconds for MCP server startup | - | `30000` (30 sec) |
| `MCP_TOOL_TIMEOUT` | Timeout in milliseconds for MCP tool execution | - | `60000` (1 min) |
| `MAX_MCP_OUTPUT_TOKENS` | Maximum tokens allowed in MCP tool responses (warning at 10k) | 25000 | `50000` |

---

## 🔄 Proxy and Network

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `HTTP_PROXY` | HTTP proxy server for network connections | - | `http://proxy.company.com:8080` |
| `HTTPS_PROXY` | HTTPS proxy server for network connections | - | `https://proxy.company.com:8443` |
| `NO_PROXY` | Domains/IPs to bypass proxy | - | `localhost,127.0.0.1,.internal.com` |

---

## 🛡️ Security and Certificates

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CLAUDE_CODE_CLIENT_CERT` | Path to client certificate file for mTLS authentication | - | `/path/to/client-cert.pem` |
| `CLAUDE_CODE_CLIENT_KEY` | Path to client private key file for mTLS authentication | - | `/path/to/client-key.pem` |
| `CLAUDE_CODE_CLIENT_KEY_PASSPHRASE` | Passphrase for encrypted client key (optional) | - | `my-secure-passphrase` |

---

## 📊 Telemetry and Debugging

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DISABLE_TELEMETRY` | Opt out of Statsig telemetry (excludes user data) | `false` | `1` |
| `DISABLE_ERROR_REPORTING` | Opt out of Sentry error reporting | `false` | `1` |
| `DISABLE_BUG_COMMAND` | Disable the `/bug` command | `false` | `1` |
| `DISABLE_AUTOUPDATER` | Disable automatic updates (overrides `autoUpdates` setting) | `false` | `1` |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Equivalent to setting all DISABLE_* flags above | `false` | `1` |

---

## 💡 UX and Behavior

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CLAUDE_CODE_DISABLE_TERMINAL_TITLE` | Disable automatic terminal title updates | `false` | `1` |
| `DISABLE_COST_WARNINGS` | Disable cost warning messages | `false` | `1` |
| `DISABLE_NON_ESSENTIAL_MODEL_CALLS` | Disable model calls for non-critical paths (e.g., flavor text) | `false` | `1` |
| `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL` | Skip auto-installation of IDE extensions | `false` | `1` |

---

## ⚡ Optimization and Performance

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Maximum output tokens for most requests | - | `8192` |
| `MAX_THINKING_TOKENS` | Enable extended thinking and set token budget | Disabled | `10000` |
| `DISABLE_PROMPT_CACHING` | Disable prompt caching for all models | `false` | `1` |
| `DISABLE_PROMPT_CACHING_HAIKU` | Disable prompt caching for Haiku models | `false` | `1` |
| `DISABLE_PROMPT_CACHING_OPUS` | Disable prompt caching for Opus models | `false` | `1` |
| `DISABLE_PROMPT_CACHING_SONNET` | Disable prompt caching for Sonnet models | `false` | `1` |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET` | Max characters for slash command metadata | 15000 | `20000` |
| `USE_BUILTIN_RIPGREP` | Use built-in `rg` instead of system-installed | `true` | `0` to use system `rg` |

---

## 🔧 Advanced Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` | Interval for credential refresh (when using `apiKeyHelper`) | - | `3600000` (1 hour) |

---

## See Also

- [Settings Configuration](/en/docs/claude-code/settings) - Learn about configuring Claude Code with settings.json
- [Model Configuration](/en/docs/claude-code/model-config) - Detailed information about model configuration
- [Amazon Bedrock](/en/docs/claude-code/amazon-bedrock) - Using Claude Code with AWS Bedrock
- [Google Vertex AI](/en/docs/claude-code/google-vertex-ai) - Using Claude Code with Google Vertex AI
