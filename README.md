# PruebaAngGit
This Angular application consumes the public API [JSONPlaceholder](https://jsonplaceholder.typicode.com) to list, view, create, edit, and delete posts.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.9.


## Quick Installation

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

or 

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

>[!IMPORTANT]
> ### Note about the API
> - **_JSONPlaceholder does not persist changes_**: When you create, edit, or delete posts, the API responds correctly, but when you reload the list, the changes are not reflected because the API always returns the same test data.
> - **_You can see the correct API response_** in the browser's network console or using an interceptor, which demonstrates that the requests are being made correctly.
