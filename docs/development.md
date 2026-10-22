# Development

messaging-system-ui has no `package.json`, build or dev server of its own. Its sources are compiled as part of the host,
[observatory-ui](https://github.com/madgeek-arc/observatory-ui), so you develop it by running the host.

## Set up

1. Clone the host with its submodules (`git clone --recurse-submodules <repo-url>`, or `git submodule update --init --recursive`
   in an existing clone). This module is checked out at `src/messaging-system-ui`.
2. Provide an Observatory backend on `http://localhost:8280`. The host's `proxy.conf.js` forwards `/api/**` there, and
   `/api/websocket/**` with `ws: true` for the live sockets. Edit the proxy file to point at another backend.
3. Install and start from the host's root (Node.js version: see the host README):

   ```bash
   npm ci
   npm start        # http://localhost:4200
   ```

Environment keys the module reads (`MESSAGING_ENDPOINT`, `WS_ENDPOINT`, `RECAPTCHA_V3_KEY`) are in the host's
`src/environments/environment.ts`; see [configuration.md](configuration.md).

## Where to see each page

| Page | URL | Needs |
|---|---|---|
| Contact form | `/contact` | Nothing; public. Without a reCAPTCHA token the form is still posted, without the header |
| Inbox and outbox | `/contributions/<groupId>/messages` (`#sent` for the outbox) | A session, and a group the user belongs to |
| Thread | `/contributions/<groupId>/messages/<threadId>` | The same |

The `messages` routes also exist at the root (`/messages`, `/messages/:threadId`) but have no group id there and do nothing
useful; see [architecture.md](architecture.md). The dashboard's "Messages" entry links to the `contributions/...` form.

## Live sockets

The module does not start its sockets. The host's top menu does it once a user is known
(`src/app/shared/top-menu/topmenudashboard/top-menu-dashboard.component.ts`): it connects the unread socket, sends the join
message and connects the notification socket. To check them in the browser, open the developer tools, filter the Network
tab by `websocket`, and watch the console for `[inbox-unread] STOMP: Reconnecting...` and
`[inbox-notification] STOMP: Reconnecting...` (a growing number means the connection keeps failing).

## Working on the module

- The layout of pages and services is in [architecture.md](architecture.md); the endpoints in [integration.md](integration.md).
- The module imports `environments/environment` from the host and several files from survey-tool by relative path, and
  one import uses the host's `src/...` base path, so it cannot be compiled on its own. Check changes with the host's
  build (`npm run build:prod`) and tests (`npm test`, see [testing.md](testing.md)).
- This directory is its own Git repository mounted as a submodule. Commit and push inside `src/messaging-system-ui`
  first, then commit the new submodule pointer in observatory-ui, so that a fresh `--recurse-submodules` clone finds the commit.
- Styles are UIkit classes plus the component `.scss` files next to the pages; the rich text editor and the page layout
  components come from catalogue-ui and survey-tool.
