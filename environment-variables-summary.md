# Environment Variables Summary

## Variables by Category

| Category | Variables | Count |
|----------|-----------|-------|
| 🔐 **Authentication and API** | `ANTHROPIC_API_KEY`<br/>`ANTHROPIC_AUTH_TOKEN`<br/>`ANTHROPIC_CUSTOM_HEADERS`<br/>`AWS_BEARER_TOKEN_BEDROCK` | 4 |
| 🤖 **Model Configuration** | `ANTHROPIC_MODEL`<br/>`ANTHROPIC_DEFAULT_HAIKU_MODEL`<br/>`ANTHROPIC_DEFAULT_OPUS_MODEL`<br/>`ANTHROPIC_DEFAULT_SONNET_MODEL`<br/>`ANTHROPIC_SMALL_FAST_MODEL` (deprecated)<br/>`ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION`<br/>`CLAUDE_CODE_SUBAGENT_MODEL` | 7 |
| ⚙️ **Bash and Command Execution** | `BASH_DEFAULT_TIMEOUT_MS`<br/>`BASH_MAX_TIMEOUT_MS`<br/>`BASH_MAX_OUTPUT_LENGTH`<br/>`CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | 4 |
| 🌐 **Cloud Infrastructure** | `CLAUDE_CODE_USE_BEDROCK`<br/>`CLAUDE_CODE_USE_VERTEX`<br/>`CLAUDE_CODE_SKIP_BEDROCK_AUTH`<br/>`CLAUDE_CODE_SKIP_VERTEX_AUTH`<br/>`VERTEX_REGION_CLAUDE_3_5_HAIKU`<br/>`VERTEX_REGION_CLAUDE_3_7_SONNET`<br/>`VERTEX_REGION_CLAUDE_4_0_OPUS`<br/>`VERTEX_REGION_CLAUDE_4_0_SONNET`<br/>`VERTEX_REGION_CLAUDE_4_1_OPUS` | 9 |
| 🔌 **MCP (Model Context Protocol)** | `MCP_TIMEOUT`<br/>`MCP_TOOL_TIMEOUT`<br/>`MAX_MCP_OUTPUT_TOKENS` | 3 |
| 🔄 **Proxy and Network** | `HTTP_PROXY`<br/>`HTTPS_PROXY`<br/>`NO_PROXY` | 3 |
| 🛡️ **Security and Certificates** | `CLAUDE_CODE_CLIENT_CERT`<br/>`CLAUDE_CODE_CLIENT_KEY`<br/>`CLAUDE_CODE_CLIENT_KEY_PASSPHRASE` | 3 |
| 📊 **Telemetry and Debugging** | `DISABLE_TELEMETRY`<br/>`DISABLE_ERROR_REPORTING`<br/>`DISABLE_BUG_COMMAND`<br/>`DISABLE_AUTOUPDATER`<br/>`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 5 |
| 💡 **UX and Behavior** | `CLAUDE_CODE_DISABLE_TERMINAL_TITLE`<br/>`DISABLE_COST_WARNINGS`<br/>`DISABLE_NON_ESSENTIAL_MODEL_CALLS`<br/>`CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL` | 4 |
| ⚡ **Optimization and Performance** | `CLAUDE_CODE_MAX_OUTPUT_TOKENS`<br/>`MAX_THINKING_TOKENS`<br/>`DISABLE_PROMPT_CACHING`<br/>`DISABLE_PROMPT_CACHING_HAIKU`<br/>`DISABLE_PROMPT_CACHING_OPUS`<br/>`DISABLE_PROMPT_CACHING_SONNET`<br/>`SLASH_COMMAND_TOOL_CHAR_BUDGET`<br/>`USE_BUILTIN_RIPGREP` | 8 |
| 🔧 **Advanced Configuration** | `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` | 1 |

---

## Quick Reference Table

| Category | Count | Key Variables |
|----------|-------|---------------|
| 🔐 Authentication and API | 4 | API keys, auth tokens, custom headers |
| 🤖 Model Configuration | 7 | Model selection, aliases, and subagent models |
| ⚙️ Bash and Command Execution | 4 | Timeouts, output limits, working directory |
| 🌐 Cloud Infrastructure | 9 | Bedrock, Vertex AI, regional configuration |
| 🔌 MCP | 3 | Timeouts and output limits for MCP tools |
| 🔄 Proxy and Network | 3 | HTTP/HTTPS proxy configuration |
| 🛡️ Security and Certificates | 3 | mTLS client certificates and keys |
| 📊 Telemetry and Debugging | 5 | Disable telemetry, error reporting, updates |
| 💡 UX and Behavior | 4 | Terminal title, cost warnings, IDE behavior |
| ⚡ Optimization and Performance | 8 | Token limits, caching, thinking budget |
| 🔧 Advanced Configuration | 1 | API key helper refresh interval |

**Total: 51 environment variables**

---

## Distribution Chart

```mermaid
pie title Environment Variables by Category
    "🤖 Models" : 7
    "🌐 Cloud" : 9
    "⚡ Performance" : 8
    "📊 Telemetry" : 5
    "🔐 Auth" : 4
    "⚙️ Bash" : 4
    "💡 UX" : 4
    "🔌 MCP" : 3
    "🔄 Network" : 3
    "🛡️ Security" : 3
    "🔧 Advanced" : 1
```
