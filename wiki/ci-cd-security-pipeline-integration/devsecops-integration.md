# DevSecOps Integration with Claude Code Action

## Overview

This guide demonstrates how to integrate Claude Code Action into DevSecOps pipelines, combining automated security scanning, code review, and deployment controls to create a comprehensive security-first CI/CD workflow.

## DevSecOps Principles

Claude Code Action supports key DevSecOps principles:

1. **Shift Left Security**: Detect vulnerabilities early in development
2. **Automated Security Testing**: Continuous security validation
3. **Policy as Code**: Codified security standards and gates
4. **Continuous Monitoring**: Ongoing security assessment
5. **Fast Feedback Loops**: Immediate security insights

## Complete DevSecOps Pipeline

### Architecture Overview

```
Pull Request → Security Scan → Code Review → Approval Gates → Merge → Deploy
                    ↓              ↓              ↓
              SAST Analysis    AI Review    Human Approval
              Vulnerability    Best         Security
              Detection        Practices    Validation
```

### Full Pipeline Implementation

```yaml
name: DevSecOps Pipeline
on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [main]

jobs:
  # Stage 1: Automated Security Scanning
  security-scan:
    name: Security Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: SAST Analysis with Claude
        uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            Perform comprehensive SAST (Static Application Security Testing):

            **Security Vulnerabilities:**
            1. SQL Injection risks
            2. XSS vulnerabilities
            3. Command injection
            4. Path traversal
            5. Insecure deserialization
            6. Authentication flaws
            7. Authorization bypasses
            8. Cryptographic issues
            9. Sensitive data exposure
            10. Security misconfigurations

            **Code Quality:**
            - Insecure dependencies
            - Hardcoded secrets
            - Weak encryption
            - Insufficient input validation
            - Insecure error handling

            Provide severity ratings (Critical/High/Medium/Low) for each finding.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

  # Stage 2: AI-Powered Code Review
  code-review:
    name: Intelligent Code Review
    runs-on: ubuntu-latest
    needs: security-scan
    steps:
      - uses: actions/checkout@v4

      - name: Claude Code Review
        uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            Review this PR for:

            **Security:**
            - OWASP Top 10 compliance
            - Secure coding practices
            - Input validation
            - Output encoding
            - Authentication/Authorization

            **Quality:**
            - Code maintainability
            - Performance implications
            - Error handling
            - Logging and monitoring
            - Test coverage

            **Best Practices:**
            - Design patterns
            - Documentation
            - API security
            - Configuration management
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

  # Stage 3: Dependency Security Scan
  dependency-scan:
    name: Dependency Security
    runs-on: ubuntu-latest
    needs: security-scan
    steps:
      - uses: actions/checkout@v4

      - name: Analyze Dependencies
        uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Analyze dependencies and package files:

            1. Identify outdated packages
            2. Check for known vulnerabilities
            3. Verify license compatibility
            4. Assess transitive dependencies
            5. Recommend secure alternatives

            Focus on:
            - package.json / package-lock.json
            - requirements.txt / Pipfile
            - go.mod / go.sum
            - pom.xml / build.gradle
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

  # Stage 4: Infrastructure as Code Security
  iac-security:
    name: IaC Security Review
    runs-on: ubuntu-latest
    if: contains(github.event.pull_request.changed_files, 'terraform') || contains(github.event.pull_request.changed_files, 'cloudformation')
    steps:
      - uses: actions/checkout@v4

      - name: IaC Security Analysis
        uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Review Infrastructure as Code for security issues:

            **Terraform/CloudFormation:**
            1. Overly permissive IAM policies
            2. Unencrypted storage
            3. Public network exposure
            4. Missing security groups
            5. Weak encryption settings
            6. Insecure defaults
            7. Compliance violations

            **Best Practices:**
            - Least privilege access
            - Encryption at rest/transit
            - Network segmentation
            - Logging and monitoring
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

  # Stage 5: Security Gate (Human Approval Required)
  security-approval:
    name: Security Team Approval
    runs-on: ubuntu-latest
    needs: [security-scan, code-review, dependency-scan]
    environment:
      name: security-review
    steps:
      - name: Request Security Approval
        run: echo "Security team review required before merge"

  # Stage 6: Automated Merge (Post-Approval)
  auto-merge:
    name: Automated Merge
    runs-on: ubuntu-latest
    needs: security-approval
    if: github.event.pull_request.draft == false
    steps:
      - name: Auto-merge PR
        uses: pascalgn/automerge-action@v0.15.6
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          MERGE_METHOD: squash
          MERGE_LABELS: "approved,security-cleared"

  # Stage 7: Post-Merge Deployment
  deploy:
    name: Deploy to Environment
    runs-on: ubuntu-latest
    needs: auto-merge
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy with Security Validation
        run: |
          echo "Deploying to production with security controls"
          # Add deployment steps here

      - name: Post-Deployment Security Check
        uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Verify deployment security:

            1. Check deployed configurations
            2. Validate security headers
            3. Verify TLS/SSL settings
            4. Confirm authentication is active
            5. Test security controls
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Security Gates and Approval Workflows

### Critical Change Detection

```yaml
name: Critical Change Gate
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  detect-critical-changes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Identify Critical Changes
        uses: anthropics/claude-code-action@v1
        id: critical-check
        with:
          prompt: |
            Analyze if this PR contains critical security changes:

            **Critical Paths:**
            - Authentication/Authorization code
            - Cryptographic implementations
            - Payment processing
            - PII/sensitive data handling
            - Security configuration
            - API authentication
            - Access control logic

            Output: CRITICAL or NON-CRITICAL

      - name: Require Security Team Review
        if: contains(steps.critical-check.outputs.result, 'CRITICAL')
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

### Multi-Stage Approval Gates

```yaml
name: Multi-Stage Approvals
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  development-approval:
    name: Dev Team Approval
    environment: development
    runs-on: ubuntu-latest
    steps:
      - name: Dev Review
        run: echo "Development team approval required"

  security-approval:
    name: Security Team Approval
    environment: security
    needs: development-approval
    runs-on: ubuntu-latest
    steps:
      - name: Security Review
        run: echo "Security team approval required"

  compliance-approval:
    name: Compliance Team Approval
    environment: compliance
    needs: security-approval
    if: contains(github.event.pull_request.labels.*.name, 'compliance-required')
    runs-on: ubuntu-latest
    steps:
      - name: Compliance Review
        run: echo "Compliance team approval required"
```

## Path-Based Security Policies

### Sensitive Path Protection

```yaml
name: Sensitive Path Security
on:
  pull_request:
    paths:
      - 'src/auth/**'
      - 'src/crypto/**'
      - 'src/payment/**'
      - 'config/security/**'

jobs:
  enhanced-security-review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            ENHANCED SECURITY REVIEW - Sensitive Path Modified

            This PR modifies security-critical code. Perform deep analysis:

            **Authentication/Authorization:**
            1. Session management security
            2. Token generation/validation
            3. Password handling
            4. Multi-factor authentication
            5. Role-based access control

            **Cryptography:**
            1. Algorithm selection
            2. Key management
            3. Random number generation
            4. Certificate validation
            5. Encryption strength

            **Payment Processing:**
            1. PCI DSS compliance
            2. Sensitive data handling
            3. Transaction security
            4. Audit logging

            Severity: CRITICAL - Manual security team review REQUIRED.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## SAST/DAST Integration

### Pre-Merge SAST Integration

```yaml
name: SAST Integration
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  sast-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Traditional SAST Tool
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: auto

      # AI-Enhanced Analysis
      - name: Claude SAST Review
        uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Review SAST findings and code changes:

            1. Validate SAST tool findings
            2. Identify false positives
            3. Find additional vulnerabilities
            4. Suggest remediation strategies
            5. Prioritize fixes by severity

            Provide actionable recommendations for each finding.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Post-Deploy DAST Integration

```yaml
name: DAST Integration
on:
  push:
    branches: [main]

jobs:
  dast-scanning:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: echo "Deploy application to staging environment"

      # Traditional DAST Tool
      - name: Run OWASP ZAP
        uses: zaproxy/action-full-scan@v0.7.0
        with:
          target: 'https://staging.example.com'

      # AI-Enhanced Analysis
      - name: Claude DAST Review
        uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Analyze DAST scan results:

            1. Review OWASP ZAP findings
            2. Correlate with code changes
            3. Identify root causes
            4. Suggest code-level fixes
            5. Recommend security controls

            Focus on:
            - Authentication bypasses
            - SQL injection
            - XSS vulnerabilities
            - CSRF issues
            - Security misconfigurations
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Compliance and Policy Enforcement

### Automated Compliance Checks

```yaml
name: Compliance Validation
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  compliance-check:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          prompt: |
            Verify compliance requirements:

            **GDPR Compliance:**
            1. Data minimization
            2. Consent management
            3. Right to erasure
            4. Data portability
            5. Privacy by design

            **PCI DSS (if applicable):**
            1. Cardholder data protection
            2. Encryption requirements
            3. Access controls
            4. Audit logging

            **HIPAA (if applicable):**
            1. PHI protection
            2. Access controls
            3. Audit trails
            4. Encryption standards

            **SOC 2:**
            1. Security controls
            2. Availability measures
            3. Confidentiality safeguards

            Report any compliance violations with severity and remediation steps.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Continuous Security Monitoring

### Scheduled Security Audits

```yaml
name: Continuous Security Monitoring
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  daily-security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Repository Security Audit
        uses: anthropics/claude-code-action@v1
        with:
          track_progress: true
          prompt: |
            Perform comprehensive repository security audit:

            **Code Security:**
            1. Scan for exposed secrets
            2. Check authentication implementations
            3. Review authorization logic
            4. Verify cryptographic usage
            5. Assess input validation

            **Dependencies:**
            1. Identify vulnerable packages
            2. Check for outdated dependencies
            3. Review license compliance
            4. Assess supply chain risks

            **Configuration:**
            1. Review security settings
            2. Check CI/CD security
            3. Validate environment configs
            4. Assess infrastructure security

            **Documentation:**
            1. Verify security docs are current
            2. Check runbooks are updated
            3. Validate incident response plans

            Create GitHub issue for any high/critical findings.
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Best Practices

### 1. Layered Security Approach
- Combine traditional SAST/DAST tools with AI analysis
- Use multiple validation stages
- Implement progressive approval gates

### 2. Clear Security Policies
- Define critical paths explicitly
- Document approval requirements
- Maintain security runbooks

### 3. Fast Feedback Loops
- Run security scans early and often
- Provide immediate, actionable feedback
- Track security metrics

### 4. Automated Remediation
- Generate fix suggestions
- Create automated patches
- Track remediation progress

### 5. Continuous Improvement
- Learn from security findings
- Update policies based on incidents
- Regularly audit security controls

### 6. Security Team Integration
- Require human approval for critical changes
- Enable security team notifications
- Maintain audit trails

### 7. Monitoring and Alerting
- Track security scan results
- Alert on critical findings
- Monitor deployment security

## Security Metrics to Track

1. **Vulnerability Detection Rate**: Issues found per PR
2. **Time to Remediation**: How quickly issues are fixed
3. **False Positive Rate**: Accuracy of security scans
4. **Coverage**: Percentage of code scanned
5. **Critical Path Protection**: Sensitive area review rate
6. **Compliance Rate**: Percentage meeting standards
7. **Approval Time**: Time for security reviews

## Conclusion

Integrating Claude Code Action into DevSecOps pipelines enables:
- Automated, intelligent security analysis
- Early vulnerability detection
- Policy-driven approval workflows
- Continuous security monitoring
- Fast, secure deployment cycles

This creates a security-first development culture while maintaining development velocity.
