# Exercise 4

## when submit a note

```mermaid
sequenceDiagram
	participant browser
	participant server

	autonumber

	browser ->> server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note
	Note over server: process the POST <br> save new note to the server

	server -->> browser: HTTP status code 302

	Note over browser: redirection

	browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
	server-->browser: HTML-code
	browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
	server-->browser: main.css
	browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
	server-->browser: main.js

	Note over browser:browser starts executing js-code <br>  that requests JSON data from server

	browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
	server-->browser: [{ content: "HTML is easy", date: "2019-05-23" }, ...]

	Note over server: browser executes the event handler <br> that renders notes to display
```
