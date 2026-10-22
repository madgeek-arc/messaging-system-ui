# Troubleshooting

Use the browser's developer tools (Network and Console tabs). The pages and endpoints are described in
[user-flows.md](user-flows.md) and [integration.md](integration.md).

## Unread counter or "new message" notification does not update

The module does not start its sockets; the host's top menu does, once a user is known. Without a socket the counters and
notifications go stale while the REST-based pages keep working.

- In the Network tab, filter by `websocket` and look for the request to the `WS_ENDPOINT` path (`/api/websocket` in the host).
- A console line `[inbox-unread] STOMP: Reconnecting...<n>` or `[inbox-notification] STOMP: Reconnecting...<n>` that keeps
  repeating means the connection fails. The counter `n` is shared by the two sockets. The retry runs every second for about
  120 attempts, then every ten seconds.
- In local development check that `proxy.conf.js` forwards `/api/websocket/**` with `ws: true` to a running backend.
- Reloading the page starts the sockets again.

## Contact form shows "Something went wrong, please try again later."

The post to `/threads/public` failed; the error is also in the Console.

- Network tab, `POST .../threads/public`: a `4xx` response with a `g-recaptcha-response` request header usually means the
  backend refused the token. A token is valid for about two minutes and the form takes the one obtained at the last click on a
  field, so a slow form can end up with an expired token. Clicking any field and sending again requests a fresh one.
- No `g-recaptcha-response` header: no token could be obtained (for example the Google script is blocked by an ad blocker or
  a network rule). The form still posts without it and the backend decides.
- `5xx` or no response: the backend or the proxy is unavailable.

## The "Contact about" selector, or the compose "To:" field, is empty or missing

Both are filled from `GET /groups`. If that call fails, the contact selector stays empty and the compose dialog does not show
the "To:" field at all; Send then answers "Choose at least one recipient." and nothing can be sent until the list has loaded
(reload the page). Check the request in the Network tab (and the Console for the logged error).

## Compose: "Choose at least one recipient."

Send was clicked with nothing in the "To:" field, so nothing was sent. Choose a group, or type an address and pick "Add
recipient". If the "To:" field is not shown at all, see the previous section.

## Reply: "Something went wrong, please try again later."

The post to `/threads/{id}/messages` failed. The reply box stays open with the text, so Send can be repeated. Check
`POST .../threads/{id}/messages` in the Network tab.

## Inbox shows "No messages" or a thread page stays empty

- The `messages` routes need the group id from `contributions/<groupId>/...`. At the root (`/messages`, `/messages/<threadId>`)
  there is no group id: the inbox never loads, and the thread request goes out with `groupId=undefined`. Use the dashboard's
  "Messages" entry or a `/contributions/<groupId>/messages` URL.
- The group must belong to the signed-in user; the backend decides what is returned for a group id.

## The page suddenly clears the session or redirects to `/home`

The host's HTTP interceptor clears the user on a `401` and shows a notification and redirects to `/home` on a `403`. Look at
the failing request in the Network tab to see which call the backend refused.
