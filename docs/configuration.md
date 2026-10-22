# Configuration

messaging-system-ui has no configuration files of its own and is not deployed on its own. It is compiled into the host
application, so "configuration" means **what the host must provide**. The reference host is
[observatory-ui](https://github.com/madgeek-arc/observatory-ui); its `docs/configuration.md` documents the actual values
per environment and the container variables.

## 1. Environment keys read by this module

The code imports `environment` from `../../environments/environment` (relative to `src/messaging-system-ui/app`), which is
`src/environments/environment.ts` of the host, replaced per build configuration.

| Key | Required | Used by | Meaning |
|---|---|---|---|
| `MESSAGING_ENDPOINT` | Yes | `MessagingSystemService` | Base URL of the messaging REST API, no trailing slash (the host uses `/api`) |
| `WS_ENDPOINT` | Yes | `MessagingWebsocketService` | SockJS endpoint for the unread and notification sockets (the host uses `/api/websocket`) |
| `RECAPTCHA_V3_KEY` | Yes for the contact form | `MessagingSystemModule` (provides `RECAPTCHA_V3_SITE_KEY`) | reCAPTCHA v3 **site** key (public). In the production and beta builds of the host it is a placeholder substituted at container start from `RECAPTCHA_V3_SITE_KEY` |

## 2. Host build and providers

| Requirement | Detail |
|---|---|
| Global scripts | `SockJS` and `Stomp` must exist on `window` (`declare var SockJS; declare var Stomp;`). The host adds `src/survey-tool/assets/js/sockjs.min.js` and `stomp.min.js` as `scripts` in `angular.json`. Unlike catalogue-ui, this module does not load them lazily |
| UIkit | `UIkit` is imported for notifications and tabs; its styles and JS must be present |
| HTTP client with XSRF | `provideHttpClient(withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }))`. `HttpXsrfTokenExtractor` supplies the token for STOMP |
| Path alias | One import uses the base path `src/messaging-system-ui/...`; the host's `tsconfig.json` has `"baseUrl": "./"` |
| Router | Import the module in `AppModule` to expose `/contact` at the root, and lazy-load it under a parent route with an `id` parameter such as `contributions/:id`. The `messages` routes need that `id` (the group id); mounted at the root they have no group and do nothing useful |
| `UserService`, `StakeholdersService` | From survey-tool; `UserService` must be provided by the host module |
| Socket start-up | The host starts the live connections: `initializeWebSocketConnectionUnread(topic)`, `WsJoin(path, action)` and `initializeWebSocketConnectionNotification(topic)` on `MessagingWebsocketService` (observatory-ui does it in its top menu once the user is known) |
| Rich text editor | Message bodies use catalogue-ui's `RichTextEditorComponent`, which needs the Material Icons font and UIkit form styles |

## 3. STOMP topics (chosen by the host)

| Purpose | Subscribe | Join |
|---|---|---|
| Unread counter | `/topic/messages/inbox/unread/{email}` | `/app/messages/inbox/unread/{email}` |
| New-message notification | `/topic/messages/inbox/notification/{email}` | none |

These strings are built in the host's top menu, not in this module.

## 4. Peer packages

Angular (core, common, forms, router), `rxjs`, `uikit`, `@ng-select/ng-select`, `ng-recaptcha-2` (v16 in the host),
plus survey-tool and catalogue-ui. Versions are pinned in the host's `package.json`.

## Secrets

None. The reCAPTCHA **site** key is public by design; the secret key belongs to the backend. Do not add credentials to the
`environment` object.
