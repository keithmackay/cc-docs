# Security Features and Best Practices

## Overview

Claude Code Action implements multiple layers of security controls to ensure safe integration into CI/CD pipelines. This document covers access control, secrets management, commit integrity, and security best practices.

## Access Control

### Write Access Requirements

By default, the action implements strict access controls:

- **Write Permissions Required**: Only repository contributors with write access can trigger the action
- **Bot Protection**: GitHub Apps and bots are blocked by default
- **Explicit Bot Allowlist**: Use `allowed_bots` parameter to enable specific bots

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    allowed_bots: "dependabot,renovate"
```

### Risk Mode (Not Recommended)

The `allowed_non_write_users` setting bypasses write requirements:

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    allowed_non_write_users: true  # ⚠️ SECURITY RISK
```

**Warning**: This represents a significant security risk and should only be used in workflows with severely constrained permissions.

## Secrets Management

### Best Practices

1. **Never Embed API Keys**: Always use GitHub secrets, never hardcode credentials

```yaml
# ❌ WRONG
env:
  ANTHROPIC_API_KEY: "sk-ant-..."

# ✅ CORRECT
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

2. **Repository-Scoped Tokens**: The action receives only short-lived tokens scoped to the triggering repository
3. **No Cross-Repository Access**: Credentials are isolated per repository by design

### Token Architecture

The GitHub App requests specific permissions:
- **Read/Write Access**:
  - Repository contents (files, branches)
  - Pull requests and issues
- **Reserved Permissions** (unused but requested):
  - Discussions
  - Actions
  - Workflows

Each invocation receives repository-specific credentials with no broader organizational access.

## Commit Integrity

### Automatic Commit Signing

All commits are automatically signed with commit signatures to:
- Establish authenticity
- Create an auditable change history
- Verify that changes came from the Claude Code Action

```yaml
# Commit signing is enabled by default
# No additional configuration required
```

## Output Security

### Full Output Exposure Risk

The `show_full_output` feature is **disabled by default** for security reasons:

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    show_full_output: false  # Default and recommended
```

**Why disabled?**: Enabled mode exposes:
- Tool execution results
- API responses
- File contents that may contain credentials
- Environment variables

**Particularly dangerous for**:
- Public repositories
- Repositories with sensitive data
- Workflows accessing external APIs

### When to Enable (Carefully)

Only enable `show_full_output` when:
- Working in a private repository
- Debugging workflow issues
- No sensitive data is present
- You understand the exposure risks

## Injection Attack Mitigation

### Content Sanitization

The system automatically sanitizes external content:
- Removes HTML comments
- Strips invisible characters
- Eliminates hidden attributes
- Prevents code injection attempts

### Emerging Threats

Documentation acknowledges that:
- Bypass techniques are constantly evolving
- Ongoing vigilance is required
- Regular updates address new attack vectors

## Security Analysis Capabilities

### OWASP Top 10 Scanning

Built-in security workflows can check for:

1. **Injection Vulnerabilities**
   - SQL injection
   - Command injection
   - LDAP injection

2. **Authentication Issues**
   - Broken authentication
   - Session management flaws
   - Credential exposure

3. **Cryptographic Weaknesses**
   - Weak encryption
   - Insecure random number generation
   - Certificate validation issues

4. **Sensitive Data Exposure**
   - Hardcoded credentials
   - PII leakage
   - Insufficient data protection

### Security-Focused Workflow Example

```yaml
name: Security Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Perform a comprehensive security analysis of this PR:

            1. Check for OWASP Top 10 vulnerabilities
            2. Identify potential injection attacks
            3. Review authentication and authorization
            4. Check for sensitive data exposure
            5. Verify cryptographic implementations
            6. Assess error handling and logging

            Focus on:
            - Authentication modules
            - API endpoints
            - Database queries
            - User input handling
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Path-Based Security Reviews

Target specific security-critical paths:

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    prompt: "Review authentication security in these changes"
  # Only triggers when auth-related files change
  paths:
    - "src/auth/**"
    - "src/api/auth/**"
    - "lib/security/**"
```

## First-Time Contributor Protection

Enhanced security for contributions from new contributors:

```yaml
name: New Contributor Review
on:
  pull_request:
    types: [opened]

jobs:
  enhanced-review:
    if: github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            This is a first-time contribution. Perform enhanced security review:

            1. Verify no malicious code patterns
            2. Check for security vulnerabilities
            3. Ensure compliance with project standards
            4. Review for potential supply chain risks
```

## Scheduled Security Audits

Regular automated security scanning:

```yaml
name: Weekly Security Audit
on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight
  workflow_dispatch:  # Manual trigger

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Perform comprehensive repository security audit:

            1. Scan dependencies for known vulnerabilities
            2. Check for outdated packages
            3. Review authentication implementations
            4. Audit API security
            5. Verify encryption practices
            6. Check for exposed secrets
```

## Security Checklist

Before deploying Claude Code Action:

- [ ] Store all credentials in GitHub secrets
- [ ] Enable write access requirements
- [ ] Keep `show_full_output` disabled
- [ ] Configure bot allowlist if needed
- [ ] Set up commit signing (enabled by default)
- [ ] Review token permissions
- [ ] Test with limited scope first
- [ ] Monitor action logs for anomalies
- [ ] Keep action version updated
- [ ] Document security configurations

## Best Practices Summary

1. **Principle of Least Privilege**: Grant only necessary permissions
2. **Defense in Depth**: Use multiple security layers
3. **Regular Audits**: Schedule periodic security reviews
4. **Monitoring**: Track action usage and outputs
5. **Updates**: Keep action and dependencies current
6. **Documentation**: Maintain security configuration records
7. **Testing**: Validate security controls regularly
8. **Incident Response**: Have a plan for security issues
