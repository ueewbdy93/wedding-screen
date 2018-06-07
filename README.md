# About

A wedding activity website implemented by a happy programming couple `dy93` and `ueewbd` ❤️.

There are two modes: `slideshow` and `game`.

In `slideshow` mode, users can see wedding pictures and leave messages.
The messages would fly from right to left of the screen in every round of slideshow.

The `game` mode was inspired by [Kahoot!](https://kahoot.com/welcomeback/), but we implemented it to meet our need.

Also, there is an admin site which allow admin user to switch between slideshow and game modes and control game state.

The whole service consists of two projects: [wedding-screen](https://github.com/ueewbdy93/wedding-screen) and [wedding-screen-frontend](https://github.com/ueewbdy93/wedding-screen-frontend). 
The formmer is responsible for server side and another is for client side.
And we set `wedding-screen-frontend` a *git submodule* of `wedding-screen`

# Prerequisite

- Nodejs 8
- Knowlege of typescript
- Knowlege of create-react-app, react, redux, redux-thunk, redux-saga
- Knowlege of websocket

# Start

1. Clone the project from github.

    ```
    git clone https://github.com/ueewbdy93/wedding-screen.git
    ```

2. Cd into project folder.

    ```
    cd wedding-screen
    ```

3. Install dependency.

    ```
    npm install
    ```

4. Set configure.

    ```
    cp src/config.sample.ts src/config.ts
    ```

5. Compile `typescript` into `javascript`.

    ```
    npm run build
    ```

Now, the back-end work is done.
Follow the steps below to prepare front-end.

6. Check out `wedding-screen-frontend`

    ```
    git submodule update --init
    ```

7. Cd into frontend folder

    ```
    cd frontend
    ```

8. Install dependency of `wedding-screen-frontend`

    ```
    npm install
    ```

9. Build code.

    ```
    npm run build
    ```

10. Start server.

    ```
    cd ../
    npm run start
    ```

OK! Now you can visit http://localhost:5566 to watch slideshow or play game.

Visit http://localhost:5566/admin-index.html and login(default password:happy) to control the state.

# Config

Edit `wedding-screen/src/config.ts`
(If not exists, copy from `wedding-screen/src/config.sample.ts`)

| property  | description  |
|---|---|
| admin.password | Admin login password. |
| slide.intervalMs | Slideshow interval.  |
| slide.urls | Paths of slideshow pictures, auto generate by scaning `wedding-screen/public/images/*.jpg` |
| game.intervalMs | Answer time |
| game.questions | Array of questions.<br/> The shape of question:<br/> `{ text: <string>, options: [<string>], answer: <string>}` |

# How to develop

## Back-end

1. Modify the code under `src/` to meet your need. Notice that the code is written in `typescript`.

2. Compile `typescript` code into `javascript`. The compiled files would be placed into `dist/` folder respectively.

    ```
    npm run build
    ```
    Or take the `--watch` option to enable watch mode which will auto build on save
    ```
    npm run build -- --watch
    ```

3. Check the result of build. If fail then fix it.

4. Restart server
    ```
    npm run start
    ```

## Front-end

`wedding-screen-frontend` is a submodule of `wedding-screen` and link to `wedding-screen/frontend/` folder.

The project is initiated by [create-react-app (CRA)](https://github.com/facebook/create-react-app).
Base on `CRA`, we integrated it with `redux`, `redux-thunk`, `websocket`, `css-module` and `storybook`(for test).

And we [eject](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject) `CRA`'s configurations and made some changes:
1. Allow multi entry points. One for user page the other for admin page.
2. Enable css module.

Followings are the steps to develop.

1. Run the back-end server
    ```
    cd wedding-screen
    npm run start
    ```
    Although `CRA` will run webpack-dev-server to host static files in development mode. However, we need to connect to back-end server to deal with actions (ex: add comment).
    See [Proxying API Requests in Development](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development).
2. Cd into `frontend/`
3. Modify code under `frontend/src/` to meet your need.
4. Runs the app in development mode.

    ```
    npm run start
    ```
    This command will open `http://localhost:3000` in browser.
    And page will automatically reload if you make changes to the code.

# Test

## Back-end

dy93: You barely have errors when you write `typescript`.

## Front-end

We use [storybook](https://storybook.js.org/basics/guide-react/) to have a quick demo of our react components.

Just run `npm run storybook` and visit http://localhost:9009.

### Component coverage

```
[x] slideshow
[x] game/score
[ ] game/final
[ ] game/joinList
[ ] game/qa
[ ] game/nameInput
[ ] adm
```
