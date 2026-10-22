# Testing

## Current state

The module has **two spec files**:

- `services/messaging-system.service.spec.ts` checks that `getInbox`, `getOutbox` and `postMessage` send no `Authorization`
  header (even when an `AccessToken` cookie exists) and keep their query parameters.
- `app/pages/emailCompose/email-compose.component.spec.ts` checks that Send without a recipient posts nothing and asks for one,
  and that Send with a recipient posts the thread.

Everything else is untested: the other page components, `MessagingWebsocketService`, the routing and the remaining form
logic. Behaviour is described in [architecture.md](architecture.md) and [user-flows.md](user-flows.md), not guarded by tests.

## Running the tests

There is no test runner in this directory. Specs run with the host's Karma/Jasmine setup, which picks up every
`src/**/*.spec.ts` (see the host's `tsconfig.spec.json`), including the one here. From the host's root:

```bash
npm test                                          # watch mode, opens Chrome
npx ng test --watch=false --browsers=ChromeHeadless   # one run, no window
```

Both need Chrome. A spec for this module runs together with the host's other specs.

## Writing specs here

- Put the spec next to the file it tests (`services/foo.spec.ts`).
- For REST calls use `provideHttpClient()` with `provideHttpClientTesting()` and `HttpTestingController`, as the existing specs do.
  The service reads `environment.MESSAGING_ENDPOINT` from the host's environment file.
- Pages read `sessionStorage.userInfo` and use survey-tool services, so a page spec has to provide stand-ins for them. The
  compose spec shows a page that needs only a `sessionStorage` entry; the components are declared in `MessagingSystemModule`, so
  a spec declares them itself (`declarations: [...]`).
- `MessagingWebsocketService` expects `SockJS` and `Stomp` as globals on `window` (the host loads them through
  `angular.json` scripts); a spec has to define fakes.

## Where tests would help most

1. **Reconnect logic in `MessagingWebsocketService`.** The two sockets share one retry counter (`count`): one second between
   attempts for about 120 attempts, then ten seconds, reset to zero when either socket connects. This is easy to break and is
   copied into catalogue-ui's services.
2. **`ContactComponent.sendMessage`.** Which group id is chosen for "Country Data", "Survey Improvements" and the other
   categories, and the error alert after a failed post.
3. **`MessagesComponent.updateUrlParams`.** A plain function over the parameter list (add, replace and remove a key) that
   drives search, sorting and paging.
