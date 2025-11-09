# Practical Workflow Examples

## Overview

This document provides ready-to-use workflow examples for integrating Claude Code Action into your CI/CD security pipeline. Each example is production-ready and can be customized for your specific needs.

## 1. Basic PR Security Review

**Use Case**: Automated security review for every pull request

```yaml
name: Basic Security Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  security-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Review this PR for common security issues:
            - SQL injection risks
            - XSS vulnerabilities
            - Authentication/authorization flaws
            - Sensitive data exposure
            - Insecure configurations
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## 2. First-Time Contributor Enhanced Review

**Use Case**: Extra scrutiny for new contributors

```yaml
name: New Contributor Review
on:
  pull_request:
    types: [opened]

jobs:
  enhanced-review:
    if: github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            This is a first-time contribution. Perform comprehensive review:

            **Security:**
            1. Verify no malicious patterns
            2. Check for security vulnerabilities
            3. Review for supply chain risks
            4. Validate input handling

            **Code Quality:**
            1. Adherence to project standards
            2. Code maintainability
            3. Test coverage
            4. Documentation quality

            **Onboarding:**
            1. Provide constructive feedback
            2. Suggest improvements kindly
            3. Reference documentation
            4. Welcome the contributor
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## 3. Path-Specific Security Reviews

**Use Case**: Intensive review for sensitive code paths

```yaml
name: Critical Path Review
on:
  pull_request:
    paths:
      - 'src/auth/**'
      - 'src/api/security/**'
      - 'lib/crypto/**'
      - 'config/production/**'

jobs:
  critical-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            ⚠️ CRITICAL PATH MODIFIED - Enhanced Security Review

            **Authentication/Authorization:**
            - Session management
            - Token validation
            - Password handling
            - Permission checks
            - Multi-factor authentication

            **Cryptography:**
            - Algorithm selection
            - Key management
            - Random number generation
            - Certificate handling

            **Configuration:**
            - Production settings
            - Environment variables
            - Secret management
            - API keys handling

            Severity: CRITICAL
            Human review REQUIRED before merge.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Request Security Team Review
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.pulls.requestReviewers({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number,
              team_reviewers: ['security-team']
            });
```

## 4. Automated Vulnerability Scanning

**Use Case**: Scan PRs for known vulnerability patterns

```yaml
name: Vulnerability Scan
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  vulnerability-scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v4

      - name: OWASP Top 10 Scan
        uses: anthropics/claude-code-action@v1
        id: vuln-scan
        with:
          track_progress: true
          prompt: |
            Scan for OWASP Top 10 vulnerabilities:

            1. **Injection** (SQL, NoSQL, Command, LDAP)
            2. **Broken Authentication**
            3. **Sensitive Data Exposure**
            4. **XML External Entities (XXE)**
            5. **Broken Access Control**
            6. **Security Misconfiguration**
            7. **Cross-Site Scripting (XSS)**
            8. **Insecure Deserialization**
            9. **Using Components with Known Vulnerabilities**
            10. **Insufficient Logging & Monitoring**

            For each finding:
            - Severity: Critical/High/Medium/Low
            - Location: File and line number
            - Description: What's vulnerable
            - Impact: Potential consequences
            - Remediation: How to fix

            Format as a checklist with severity tags.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Create Security Issue for Critical Findings
        if: contains(steps.vuln-scan.outputs.result, 'Critical')
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🚨 Critical Security Vulnerability Detected',
              body: 'Critical vulnerabilities found in PR #' + context.issue.number,
              labels: ['security', 'critical']
            });
```

## 5. Dependency Security Analysis

**Use Case**: Analyze dependencies for security issues

```yaml
name: Dependency Security
on:
  pull_request:
    paths:
      - 'package.json'
      - 'package-lock.json'
      - 'requirements.txt'
      - 'Pipfile'
      - 'go.mod'
      - 'pom.xml'
      - 'build.gradle'

jobs:
  dependency-analysis:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - name: Analyze Dependencies
        uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            Analyze dependency changes for security:

            **Security Checks:**
            1. Known vulnerabilities (CVEs)
            2. Outdated packages
            3. Deprecated dependencies
            4. License compatibility
            5. Transitive dependencies
            6. Supply chain risks

            **Recommendations:**
            1. Upgrade paths for vulnerable packages
            2. Secure alternatives
            3. Version pinning suggestions
            4. Removal of unused dependencies

            Provide a risk assessment for each dependency change.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## 6. Scheduled Security Audit

**Use Case**: Regular automated security audits

```yaml
name: Weekly Security Audit
on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight
  workflow_dispatch:  # Manual trigger option

jobs:
  security-audit:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write
    steps:
      - uses: actions/checkout@v4

      - name: Comprehensive Security Audit
        uses: anthropics/claude-code-action@v1
        id: audit
        with:
          track_progress: true
          prompt: |
            Perform comprehensive weekly security audit:

            **Code Security:**
            1. Scan for exposed secrets/API keys
            2. Review authentication implementations
            3. Check authorization logic
            4. Verify cryptographic usage
            5. Assess input validation

            **Dependencies:**
            1. Identify vulnerable packages
            2. Check for outdated dependencies
            3. Review license compliance
            4. Assess supply chain risks

            **Configuration:**
            1. Review security settings
            2. Check environment configurations
            3. Validate CI/CD security
            4. Assess infrastructure security

            **Best Practices:**
            1. OWASP compliance
            2. Security header usage
            3. Error handling patterns
            4. Logging practices

            Generate a detailed security report with actionable items.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Create Audit Report Issue
        uses: actions/github-script@v7
        with:
          script: |
            const date = new Date().toISOString().split('T')[0];
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Security Audit Report - ${date}`,
              body: 'Weekly security audit completed. Review findings above.',
              labels: ['security', 'audit']
            });
```

## 7. Pre-Production Deployment Gate

**Use Case**: Security validation before production deployment

```yaml
name: Pre-Production Security Gate
on:
  pull_request:
    branches: [main, production]
    types: [opened, synchronize, labeled]

jobs:
  pre-production-validation:
    runs-on: ubuntu-latest
    environment: production
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - name: Production Readiness Check
        uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            PRODUCTION DEPLOYMENT VALIDATION

            **Security Checklist:**
            - [ ] No hardcoded secrets or credentials
            - [ ] All API keys use environment variables
            - [ ] Authentication mechanisms secure
            - [ ] Authorization properly implemented
            - [ ] Input validation in place
            - [ ] Output encoding configured
            - [ ] Error handling doesn't leak information
            - [ ] Logging configured appropriately
            - [ ] Security headers configured
            - [ ] HTTPS enforced
            - [ ] CSRF protection enabled
            - [ ] XSS protection in place
            - [ ] SQL injection prevention verified
            - [ ] Dependencies up to date
            - [ ] No critical vulnerabilities

            **Compliance:**
            - [ ] GDPR compliance (if applicable)
            - [ ] PCI DSS compliance (if applicable)
            - [ ] HIPAA compliance (if applicable)
            - [ ] SOC 2 requirements met

            **Performance:**
            - [ ] No performance regressions
            - [ ] Resource limits configured
            - [ ] Rate limiting in place

            Report: APPROVED or BLOCKED with reasons
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## 8. Infrastructure as Code Security

**Use Case**: Security review for Terraform/CloudFormation changes

```yaml
name: IaC Security Review
on:
  pull_request:
    paths:
      - '**.tf'
      - 'terraform/**'
      - '**.yaml'
      - 'cloudformation/**'

jobs:
  iac-security:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - name: IaC Security Analysis
        uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            Review Infrastructure as Code for security issues:

            **IAM & Access Control:**
            1. Overly permissive IAM policies
            2. Wildcard permissions
            3. Missing MFA requirements
            4. Cross-account access risks
            5. Service role permissions

            **Network Security:**
            1. Public network exposure
            2. Insecure security groups
            3. Missing network segmentation
            4. Open ports
            5. VPC configuration

            **Data Security:**
            1. Unencrypted storage
            2. Missing encryption in transit
            3. Insecure key management
            4. Backup encryption
            5. Database security

            **Compliance:**
            1. Resource tagging
            2. Audit logging enabled
            3. Monitoring configured
            4. Compliance standards (CIS, NIST)

            **Best Practices:**
            1. Least privilege principle
            2. Defense in depth
            3. Secure defaults
            4. Infrastructure hardening

            Provide specific remediation steps for each finding.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## 9. API Security Review

**Use Case**: Focused security review for API changes

```yaml
name: API Security Review
on:
  pull_request:
    paths:
      - 'src/api/**'
      - 'routes/**'
      - 'controllers/**'
      - 'openapi.yaml'
      - 'swagger.json'

jobs:
  api-security:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - name: API Security Analysis
        uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            Review API changes for security:

            **Authentication:**
            1. API key management
            2. Token validation
            3. OAuth implementation
            4. Session handling
            5. Multi-factor authentication

            **Authorization:**
            1. Role-based access control
            2. Permission checks
            3. Resource ownership validation
            4. Scope restrictions

            **Input Validation:**
            1. Request validation
            2. Parameter sanitization
            3. Type checking
            4. Size limits
            5. Format validation

            **Output Security:**
            1. Response filtering
            2. Sensitive data exposure
            3. Error message leakage
            4. CORS configuration

            **API Security:**
            1. Rate limiting
            2. Request throttling
            3. API versioning
            4. Deprecation handling
            5. Documentation accuracy

            **OWASP API Security Top 10:**
            1. Broken Object Level Authorization
            2. Broken User Authentication
            3. Excessive Data Exposure
            4. Lack of Resources & Rate Limiting
            5. Broken Function Level Authorization
            6. Mass Assignment
            7. Security Misconfiguration
            8. Injection
            9. Improper Assets Management
            10. Insufficient Logging & Monitoring
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## 10. Multi-Stage Approval Workflow

**Use Case**: Progressive approval gates for critical changes

```yaml
name: Multi-Stage Approval
on:
  pull_request:
    types: [opened, synchronize, labeled]

jobs:
  security-analysis:
    name: Security Analysis
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: anthropics/claude-code-action@v1
        id: security
        with:
          prompt: "Perform security analysis and classify as LOW, MEDIUM, HIGH, or CRITICAL risk"
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

  dev-approval:
    name: Development Team
    needs: security-analysis
    environment: dev-approval
    runs-on: ubuntu-latest
    steps:
      - run: echo "Development team approval"

  security-approval:
    name: Security Team
    needs: dev-approval
    if: contains(needs.security-analysis.outputs.result, 'HIGH') || contains(needs.security-analysis.outputs.result, 'CRITICAL')
    environment: security-approval
    runs-on: ubuntu-latest
    steps:
      - run: echo "Security team approval required for high/critical risk changes"

  compliance-approval:
    name: Compliance Team
    needs: security-approval
    if: contains(github.event.pull_request.labels.*.name, 'compliance-required')
    environment: compliance-approval
    runs-on: ubuntu-latest
    steps:
      - run: echo "Compliance team approval required"

  auto-merge:
    name: Auto Merge
    needs: [dev-approval, security-approval, compliance-approval]
    if: always() && !contains(needs.*.result, 'failure')
    runs-on: ubuntu-latest
    steps:
      - name: Enable Auto-Merge
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.pulls.merge({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number,
              merge_method: 'squash'
            });
```

## Configuration Tips

### 1. Environment Variables

Store sensitive configuration in GitHub secrets:

```yaml
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 2. Permissions

Set minimal required permissions:

```yaml
permissions:
  contents: read
  pull-requests: write
  issues: write
```

### 3. Conditional Execution

Use conditions to optimize workflow runs:

```yaml
if: github.event.pull_request.draft == false
if: contains(github.event.pull_request.labels.*.name, 'needs-security-review')
if: github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'
```

### 4. Progress Tracking

Enable visual progress for long-running tasks:

```yaml
with:
  track_progress: true
```

## Best Practices

1. **Start Simple**: Begin with basic security reviews, then add complexity
2. **Path Filtering**: Only run intensive scans on relevant file changes
3. **Progressive Enhancement**: Add approval gates as security maturity grows
4. **Fast Feedback**: Provide quick, actionable feedback to developers
5. **Clear Requirements**: Document what's needed for approval
6. **Regular Audits**: Schedule periodic comprehensive reviews
7. **Metrics Tracking**: Monitor scan effectiveness and false positive rates
8. **Team Training**: Ensure teams understand security requirements

## Troubleshooting

### Workflow Not Triggering
- Check path filters match your file structure
- Verify event types in `on:` configuration
- Ensure permissions are correctly set

### API Rate Limits
- Use conditional execution to reduce runs
- Implement caching where possible
- Monitor API usage

### False Positives
- Refine prompts to be more specific
- Add context about your application
- Use allowlists for known safe patterns

## Next Steps

1. Choose workflows that match your security requirements
2. Customize prompts for your specific needs
3. Test in a non-production environment first
4. Gradually roll out to more repositories
5. Collect metrics and iterate on prompts
6. Train team on new security processes
