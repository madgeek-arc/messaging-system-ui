# Security

messaging-system-ui authenticates nobody and enforces no access control: the backend owns both. This page lists the
security-relevant behaviour of the module itself.

## Authentication and authorisation

- Requests rely on the host's session cookie. The module reads the user from survey-tool's `UserService` /
  `sessionStorage.userInfo`.
- `MessagingSystemService.setAuthorizationHeaders()` builds an `Authorization: Bearer <value of the AccessToken cookie>` header, which
  `getInbox`, `getOutbox` and `postMessage` send. The header is built from a module-level variable shared by those calls.
  If no `AccessToken` cookie exists, the literal value `Bearer null` is sent. The current login flow does not create an `AccessToken`
  cookie (survey-tool only deletes it on logout), so the backend should not depend on this header. TODO(maintainers): confirm and
  remove this legacy code path, or document where the cookie is set.
- Which threads and groups a user may read or write is decided by the backend using the `groupId` and the session; changing the
  route's `:id` in the browser must not widen access.

## CSRF and transport

- REST writes use Angular's XSRF support supplied by the host (`XSRF-TOKEN` cookie, `X-XSRF-TOKEN` header). A "csrf protection"
  change shipped in 0.3.0.
- Both STOMP connections send `X-XSRF-TOKEN` from `HttpXsrfTokenExtractor` in the CONNECT headers.
- Use HTTPS in production; the module has no transport settings.

## Public contact form

- The form is available without login and protected by reCAPTCHA v3: `ReCaptchaV3Service.execute(action)` returns a token that is sent
  as the `g-recaptcha-response` request header to `POST /threads/public`. Verifying the token, rate limiting and spam filtering are
  the backend's responsibility.
- The form also requires the terms-and-conditions checkbox before it can be submitted.
- If the token is missing the request is still sent without the header; the backend must reject such requests.
- Google reCAPTCHA sets `_GRECAPTCHA` and loads Google scripts; it is listed among the strictly necessary cookies in the host's cookie banner.

## HTML rendering

Message bodies are written with the TipTap rich text editor (HTML) and displayed with `[innerHtml]` in `thread.component.html` and
`messages.component.html` (message previews). Angular's default sanitizer applies, so scripts and unsafe attributes are removed.
Do not route these bindings through `bypassSecurityTrust*` or the `safeUrl` pipe. The editor limits what users can create but is not a
sanitizer; see catalogue-ui's [security notes](../../survey-tool/catalogue-ui/docs/security.md).

The notification toast uses a fixed HTML string (`'You have a new message <span uk-icon=...>'`) with no message content.

## Data in the browser

The module stores nothing itself. It reads `sessionStorage.userInfo` and the current group keys; the logout of survey-tool clears them.
The current thread is kept in memory in `MessagingSystemService`.

## Secrets and logging

- No secrets in this repository. The reCAPTCHA value in `environment` is the public **site** key.
- Socket reconnection attempts are logged to the console (`[inbox-unread] STOMP: Reconnecting...`); do not add message content or tokens to logs.
