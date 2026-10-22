# User flows

What a user sees and what the module sends to the backend. Endpoints are listed in [integration.md](integration.md); problems
are covered in [troubleshooting.md](troubleshooting.md).

## Inbox and outbox

Route: `/contributions/<groupId>/messages`, opened from the dashboard's "Messages" entry. The group is the one the user is
acting as.

- **Two tabs**, Inbox (`#inbox`, the default) and Sent (`#sent`). Switching tab clears the selection and the filters.
  Inbox lists threads addressed to the group (`GET /inbox/threads?groupId=`); Sent lists threads the user wrote
  (`GET /outbox/threads?groupId=&email=`).
- **Order by date:** the drop-down adds `sortBy=created` and `direction=ASC` or `DESC`.
- **Search:** typing in the search box waits 500 ms after the last key, then reloads the list from the first page with
  `regex=<text>`. It only starts while the list on screen has at least one thread (see
  [troubleshooting.md](troubleshooting.md)).
- **Paging:** the arrows request `page=<n>`; the label ("1 - 20 of 53") comes from the backend's page object. The page size is
  the backend's.
- **Select and mark:** each row has a checkbox, the header checkbox selects every row. Once something is selected, icons to mark
  the selection as read or unread appear; each row also has its own icon. Marking sends one
  `PATCH /threads/{id}/messages/{messageId}?read=` per message whose state differs (100 ms apart), then reloads the list and
  the unread counters (`GET /inbox/unread`).
- **Refresh:** the refresh icon reloads the list without the search and order parameters.
- **Live updates:** when the unread counters change over the socket, the open list reloads.
- Clicking a row opens the thread.

## Open a thread

Route: `/contributions/<groupId>/messages/<threadId>` (`GET /threads/{id}?groupId=`).

- Messages that were unread are marked read as the thread opens (one `PATCH` each), and the page scrolls to the message the
  list pointed at (the newest).
- Each message shows the sender, the date, "(as anonymous)" when it was sent anonymously, and the body (HTML, sanitised). A
  reply shows the message it answers.
- The back arrow returns to the tab (Inbox or Sent) the user came from.
- If the notification socket pushes a change to this thread, the page shows the updated thread.

## Reply

- The reply icon on a message opens the reply box at the bottom of the thread. The recipient is the sender of that message.
- The body is written in the rich text editor. The box "Don't show my name as sender" is ticked by default: the reply goes out
  as anonymous unless the user clears it.
- Send posts `POST /threads/{id}/messages?anonymous=`. On success the thread on screen is replaced by the response and the
  box closes. The close icon discards the draft.
- A failed send is only logged to the console; the box stays open.

## Compose a new thread

- The "New Message" button on the Messages page opens a dialog.
- **To:** a multi-select over all groups returned by `GET /groups`. Typing something else and choosing "Add recipient" adds a
  plain e-mail address. The selector is shown only after the group list has loaded.
- **Subject** and the body in the rich text editor.
- Send posts `POST /threads` with the user as sender and the active group as the sender's group. On success the dialog closes
  and the form is cleared. On failure the dialog shows "Something went wrong please try again later." for about five seconds.
- Send before any recipient has been chosen does nothing: the click throws a `TypeError` because the recipient list is still
  `null`.

## Public contact form

Route: `/contact`, no login. Linked from the host's top menu.

1. The visitor fills in name, surname, e-mail, an optional affiliation, subject, "Contact about", and a message, and ticks the
   terms and conditions (a link to a PDF in the host's assets). "Contact about" lists the categories returned by `GET /groups`
   (for example country data, survey improvements, other). Choosing "Country Data" adds a country selector; choosing
   "Survey Improvements" adds a coordinator selector.
2. Clicking a field asks reCAPTCHA v3 for a token (the field name is the action); the latest token is kept.
3. Send with an invalid form highlights the missing fields and sends nothing.
4. Otherwise `POST /threads/public` is sent with the token as the `g-recaptcha-response` header (no header if there is no
   token). The recipient group is the selected country or coordinator, or the first group of the chosen category.
5. On success the page shows a confirmation with a countdown and goes to `/home` after six seconds, or at once with "Back to
   home".
6. On failure a red message ("Something went wrong, please try again later.") appears above the Send button and the fields keep
   their values, so the visitor can send again.

The reCAPTCHA badge is shown on this page only.
