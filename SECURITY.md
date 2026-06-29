# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| :------ | :----------------- |
| 1.3.x   | ✅ Active support  |
| 1.2.x   | ⚠️ Security fixes  |
| < 1.2   | ❌ Not supported   |

**You are currently running:** v1.3.6

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in
MDX Hub, please follow the responsible disclosure process below.

### ✅ Do

- **Report privately** by emailing the project maintainer directly:
  **zapkhiell@gmail.com**
- Include as much detail as possible:
  - Type of vulnerability
  - Steps to reproduce
  - Affected versions
  - Potential impact
  - Suggested fix (if any)
- Expect an acknowledgment within **48 hours**
- Allow us up to **14 days** to investigate and address the issue before
  any public disclosure

### ❌ Don't

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before we've had a chance to address it
- Exploit the vulnerability beyond demonstrating it for the report

## What to Expect

1. **Acknowledgment** — We'll confirm receipt within 48 hours
2. **Investigation** — We'll assess the severity and impact
3. **Fix** — We'll develop and test a patch
4. **Release** — We'll publish a patched version and credit you in the
   release notes (unless you prefer to remain anonymous)

## Scope

This security policy covers:

- The MDX Hub application itself (source code at
  `https://github.com/snap-star/mdxhub`)
- Build scripts and deployment configurations

It does **not** cover:

- Third-party dependencies (report those to their respective maintainers)
- Your own deployment's configuration or hosting environment
- Content you publish using MDX Hub (you are responsible for your own content)

## Dependencies

MDX Hub uses automatically-updated dependencies. We recommend keeping
your local installation up to date:

```bash
pnpm update
```

For critical CVEs in our dependency tree, we aim to patch within **7 days**
of a fix becoming available.

## Thanks

Thank you for helping keep MDX Hub and its community safe! 🙏
