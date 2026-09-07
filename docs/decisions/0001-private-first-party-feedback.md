# ADR 0001: Private first-party Cadence feedback

## Status

Accepted — 7 September 2026

## Decision

Collect beta research on the Brand Name Changes domain through a Supabase Edge Function. Store answers in RLS-protected Postgres tables and optional evidence in a private Storage bucket. Upload evidence directly with server-issued resumable tokens only after the written response has been stored.

## Why

The previous Google Form was closed when its owner storage filled, leaving delivery dependent on an external form state. A first-party route gives Brand Name Changes control of availability, retention, deletion and export. Storing text first prevents a large mobile upload from destroying an otherwise useful response.

## Consequences

- The static frontend contains no privileged key.
- The Edge Function and migration become production infrastructure that must be deployed before the form is published.
- Evidence is private research, not marketing permission.
- Operators own export security and must keep source/derived response files outside Git.
- A simple public dashboard is deliberately excluded; private exports are the initial review surface.
