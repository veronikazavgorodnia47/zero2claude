---
Name: /code-reviewer
Description: Review code changes for quality, correctness, security, and style issues.
Instructions: Invoke this skill when you want a thorough review of changed files, a specific function, or an entire pull request.
---

# Code Reviewer Skill

## What it checks
- **Correctness** — logic errors, edge cases, off-by-one errors
- **Security** — XSS, injection, exposed secrets, unsafe inputs
- **Code quality** — readability, naming, unnecessary complexity
- **Consistency** — matches the style and patterns of the existing codebase
- **Performance** — obvious inefficiencies or unnecessary re-renders

## Output format
1. A short summary of the overall assessment
2. A list of issues grouped by severity: **Critical**, **Warning**, **Suggestion**
3. Each issue includes: file, line reference, problem description, and recommended fix

```
