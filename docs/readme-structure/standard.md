# CDIS Engineering Standards

> Version: 1.3


---

# Purpose

This document defines the engineering standards that every CDIS project must follow.

Its objective is to ensure:

- Consistency
- Scalability
- Maintainability
- Security
- Readability
- Production Readiness

Every project built using the CDIS Engineering Platform should follow these standards unless an Architecture Decision Record (ADR) explicitly approves an exception.

---

# Engineering Philosophy

We optimize for:

- Long-term maintainability
- Predictable architecture
- Low coupling
- High cohesion
- Type safety
- Security by default
- Convention over configuration

---

# Core Engineering Principles

## 1. Single Responsibility Principle

Every module should have one clear responsibility.

Example:

✓ authService → Authentication workflow

✗ authService → Authentication + Routing + Notifications

---

## 2. Separation of Concerns

UI

↓

Business Logic

↓

Application Services

↓

Infrastructure

Never mix these layers.

---

## 3. High Cohesion

Keep related code together.

Example

auth/

instead of

utils/auth.ts

services/auth.ts

hooks/auth.ts

spread throughout the project.

---

## 4. Low Coupling

Modules should depend on abstractions rather than implementations.

---

## 5. Dependency Direction

Dependencies always point downward.

Features

↓

Platforms

↓

Libraries

Platforms must never depend on Features.

---

# Project Architecture

The project is divided into two major categories.

## Platforms

Platforms provide reusable application capabilities.

Examples

api

auth

config

logging

notifications

state

Platforms may depend on other platforms.

Platforms never depend on Features.

---

## Features

Features implement business capabilities.

Examples

dashboard

users

feedback

attendance

reports

Features may depend on platforms.

Features must never depend on each other directly.

---

# Folder Standards

Each platform should contain only responsibilities belonging to that platform.

Example

auth/

api/

services/

storage/

hooks/

types/

components/

pages/

---

# File Naming

Components

PascalCase

LoginPage.tsx

Sidebar.tsx

Hooks

camelCase

useLogin.ts

useAuth.ts

Services

camelCase

authService.ts

notificationService.ts

API

camelCase

authApi.ts

userApi.ts

Constants

UPPER_SNAKE_CASE

AUTH_STORAGE_KEY

DEFAULT_LANGUAGE

Types

camelCase

auth.types.ts

user.types.ts

---

# Import Standards

Order

1 External libraries

2 Internal aliases

3 Relative imports

4 Types

Example

import { useState } from "react";

import { authService } from "@/auth";

import Button from "../components/Button";

import type { LoginRequest } from "../types";

---

# API Standards

Never call Axios directly inside components.

Component

↓

Hook

↓

Service

↓

API

↓

HTTP Client

↓

Axios

---

# Authentication Standards

Authentication is a Platform.

Never implement authentication inside business features.

All authentication responsibilities belong inside:

src/auth

---

# State Management Standards

Separate

Server State

Client State

UI State

Authentication State

Never mix them.

---

# Error Handling Standards

Never swallow exceptions.

Always propagate meaningful errors.

Provide centralized error handling.

---

# Security Standards

Never hardcode credentials.

Never expose secrets.

Validate environment variables.

Prefer httpOnly cookies for authentication.

Protect routes.

Sanitize user input.

---

# TypeScript Standards

Strict Mode enabled.

Avoid any.

Prefer unknown over any.

Always define API request/response types.

---

# Testing Standards

Every feature should include:

Unit Tests

Integration Tests

Critical user flow tests

---

# Git Standards

Small commits.

Meaningful commit messages.

One logical change per PR.

---

# Code Review Standards

Every PR should verify

Architecture

Security

Performance

Accessibility

Testing

Documentation

---

# Performance Standards

Lazy load routes.

Avoid unnecessary re-renders.

Memoize only when measurable.

Optimize bundle size.

---

# Documentation Standards

Every platform must include

README

ADR (if architectural)

Public API

Folder purpose

---

# Quality Gates

Every Pull Request must pass

Type Check

Lint

Tests

Build

---

# Architecture Decision Records

Any architectural change requires an ADR.

Examples

Authentication Strategy

Folder Structure

State Management

Caching

Deployment

---

# Definition of Done

A task is complete only if

✓ Code builds

✓ Types pass

✓ Tests pass

✓ Documentation updated

✓ Security reviewed

✓ PR approved

---

# Engineering Rule

Always optimize for the next engineer who will maintain the code.

Code is read far more often than it is written.