# messaging-system-ui

Angular module of the EOSC Observatory frontend for **messaging**: the inbox and outbox of a stakeholder, coordinator or
administrator group, message threads with replies, composing messages, live unread counters and notifications, and the
public contact form.

```
Component:     messaging-system-ui
Type:          Frontend module (Angular source, consumed as a Git submodule)
Status:        Production (embedded in observatory-ui)
Technology:    Angular 20 / TypeScript / RxJS, UIkit, ng-select, ng-recaptcha-2, SockJS/STOMP
API:           Consumes the Observatory messaging API (/api); exposes none
Swagger:       n/a (frontend)
Deployment:    Not independently deployable; compiled into observatory-ui (see observatory-ui/docs/deployment.md)
Documentation: /docs
```

## Role in the platform

The messaging backend stores threads and messages; this module is its user interface. It is compiled into
[observatory-ui](https://github.com/madgeek-arc/observatory-ui), which also initialises the live unread/notification
sockets from its top menu. It reuses the session services of
[survey-tool](https://github.com/madgeek-arc/survey-tool) and the rich text editor of
[catalogue-ui](https://github.com/madgeek-arc/catalogue-ui).

Pages (`MessagingSystemModule`):

| Route | Component | Purpose |
|---|---|---|
| `contact` | `ContactComponent` | Public contact form protected by reCAPTCHA v3 |
| `messages` | `MessagesComponent` | Inbox and outbox of the active group |
| `messages/:threadId` | `ThreadComponent` | A thread with its messages and replies |
| (component) | `EmailComposeComponent` | Compose a new thread or reply |

## Dependencies on other Observatory components

| Dependency | Used for |
|---|---|
| Observatory backend (`MESSAGING_ENDPOINT`, `WS_ENDPOINT`) | Threads, messages, groups, unread counts, notifications |
| survey-tool | `UserService`, `StakeholdersService`, `UserInfo` and `URLParameter` models, page layout components |
| catalogue-ui | `RichTextEditorComponent` for message bodies |
| observatory-ui (host) | `environment`, router, top menu that starts the unread/notification sockets |
| Google reCAPTCHA v3 | Contact form token |

## Prerequisites and local start

There is no stand-alone start. Clone [observatory-ui](https://github.com/madgeek-arc/observatory-ui) with submodules
and follow its README (`npm ci`, `npm start`).

## Documentation

| Document | Contents |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Pages, services, routing, boundaries |
| [docs/configuration.md](docs/configuration.md) | What the host must provide: environment keys, scripts, providers |
| [docs/integration.md](docs/integration.md) | REST endpoints, STOMP topics, reCAPTCHA, host contract, failure behaviour |
| [docs/security.md](docs/security.md) | Authentication, XSRF, reCAPTCHA, HTML rendering |
| [docs/development.md](docs/development.md) | Running the module through the host, sockets, working with the submodule |
| [docs/testing.md](docs/testing.md) | The one existing spec, how to run it, where tests would help |
| [docs/user-flows.md](docs/user-flows.md) | Inbox, outbox, threads, replies, compose, public contact form |
| [docs/troubleshooting.md](docs/troubleshooting.md) | Stale counters, rejected contact form, empty selectors, empty pages |
| [CHANGELOG.md](CHANGELOG.md) | Release history |

Licence: Apache License 2.0, see [LICENSE](LICENSE). The npm packages used by the host application keep their own
licences; the host's production build lists them in `3rdpartylicenses.txt`.
