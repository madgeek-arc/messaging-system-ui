# Changelog

All notable changes to messaging-system-ui are documented here, newest first. Entries were compiled from the Git history
between release tags (`feat`, `fix`, `refactor`/`perf`/`build` commits); chores, style and submodule bumps are omitted.

## Unreleased

### Added

- **editor:** Use the shared rich text editor instead of CKEditor
- **contact:** Show an error message when sending the form fails

### Removed

- **security:** Stop sending an `Authorization: Bearer` header built from the `AccessToken` cookie (it was `Bearer null` without the cookie)

### Fixed

- **contact:** Send group id instead of label for Dashboard Improvement
- **websocket:** Remove polling delay and add reconnect backoff for inbox sockets

## 0.3.0 - 2026-03-20

### Added

- **security:** Introduces csrf protection

### Changed

- Angular upgrade to v20.
- Remove unused imports.
- **messages:** Use getUserObservable instead of direct API call to leverage state management

### Fixed

- Decouples upstream project import
- **messages:** Ensure sidebar loads on refresh and initialize group context
- **thread-component:** Add page-content and inner wrappers for correct alignment

## 0.2.0 - 2025-08-28

### Changed

- Replaced custom css class uk-display-none with uk-hidden
- Changes for recaptcha package change
- Stand alone migration for angular v19

### Fixed

- Uikit import

## v0.0.1 - 2024-02-23

First tagged release. Earlier history is not itemised.
