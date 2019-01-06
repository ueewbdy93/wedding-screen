![](screenshots/slideshow-demo.gif)

![](screenshots/game-demo.gif)

# Table of contents

- [TL;DR](#tldr)
- [TL;DR with Docker](#tldr-with-docker)
- [About](#about)
  - [Demo](#demo)
- [Prerequisite](#prerequisite)
- [Usage](#usage)
  - [Start](#start)
  - [Configuration](#configuration)
  - [Database](#database)
  - [Optimize](#optimize)
- [How To Develop](#how-to-develop)
  - [Back-end](#back-end)
  - [Front-end](#front-end)
- [Test](#test)
  - [Back-end](#back-end-1)
  - [Front-end](#front-end-1)

# TL;DR

1. `git clone https://github.com/ueewbdy93/wedding-screen.git && cd wedding-screen && git submodule update --init`
2. Build back-end: `cp src/config/config.sample.json src/config/config.json && npm install && npm run build`
3. Build front-end: `npm install --prefix frontend/ && npm run build --prefix frontend/`
4. Start server: `npm run start`
5. Now you can browse the service with your favorite browser at http://localhost:5566 as user and, http://localhost:5566/admin-index.html (password: happy) as admin.

# TL;DR with Docker

1. `docker pull dy93/wedding-screen:latest`
2. Prepare 3 folders:
  - `images`: put your images into it
  - `config`: put `config.json` into it. See [Configuration](#configuration) for detailed information.
  - `db`: empty folder which the db files will created in
3. `docker run -d -p 5566:5566 -v /PATH/TO/config:/usr/src/app/dist/config -v /PATH/TO/db:/usr/src/app/db -v /PATH/TO/images/:/usr/src/app/public/images dy93/wedding-screen`
4. Now you can browse the service with your favorite browser at http://localhost:5566 as user and, http://localhost:5566/admin-index.html as admin.

# About

A wedding activity web app implemented by a happy programmer couple [dy93](https://github.com/dy93) and [ueewbd](https://github.com/ueewbd) ❤️.

There are two modes and an admin page

1. _slideshow_ mode:

    Users can see wedding pictures and leave bullet comments.
2. _game_ mode:

    This mode was inspired by [Kahoot!](https://kahoot.com/welcomeback/). Since Kahoot does not show full description of options on users' phone and it's a requirement for us. We decided to implement this game service by ourselves.
3. _admin_ page:

    Admin can switch between modes and control the game state.

The whole web app consists of two projects: [wedding-screen](https://github.com/ueewbdy93/wedding-screen) and [wedding-screen-frontend](https://github.com/ueewbdy93/wedding-screen-frontend).
The former is responsible for back-end and the other is for front-end.
We manage *wedding-screen-frontend* as a git submodule of *wedding-screen*.

## Demo

- https://wedding-screen.herokuapp.com/
- Admin (password: happy): https://wedding-screen.herokuapp.com/admin-index.html

# Prerequisite

- Nodejs 10

# Usage

## Start

1. Clone the project from github.

    ```
    git clone https://github.com/ueewbdy93/wedding-screen.git
    ```

2. cd into project folder.

    ```
    cd wedding-screen
    ```

3. Install dependency.

    ```
    npm install
    ```

4. Set up configurations.

    ```
    cp src/config/config.sample.json src/config/config.json
    ```

5. Compile **typescript** to **javascript**.

    ```
    npm run build
    ```

Now, the back-end work is done.
Follow the steps below to prepare front-end.

6. Check out `wedding-screen-frontend`.

    ```
    git submodule update --init
    ```

7. cd into frontend folder.

    ```
    cd frontend
    ```

8. Install dependency of *wedding-screen-frontend*.

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

## Configuration

Put your images into `wedding-screen/public/images/`

Edit *wedding-screen/src/config/config.json*
(If not exists, copy from *wedding-screen/src/config/config.sample.json*)

Configuration options:
| property  | description  |
|---|---|
| admin.password | Admin login password |
| slide.intervalMs | Slideshow interval |
| game.intervalMs | Answer time |
| game.questions | List of question objects |
| game.questions[].text | Question text |
| game.questions[].options | List of option objects. Each question **must** have 4 options |
| game.questions[].options[].text | Option text |
| game.questions[].options[].isAnswer | (boolean) Indicate whether this option is correct. Allow multiple answers |

Following is the example of `config.json`:

```json
{
  "admin": {
    "password": "happy"
  },
  "slide": {
    "intervalMs": 3000
  },
  "game": {
    "intervalMs": 8000,
    "questions": [
      {
        "text": "Q1. Something is small, red, round and sweet?",
        "options": [
          { "text": "Orange", "isAnswer": false },
          { "text": "Apple", "isAnswer": true },
          { "text": "Lemon", "isAnswer": false },
          { "text": "Grape", "isAnswer": false }
        ]
      },
      {
        "text": "Q2. Something starts with an H and ends with an oof?",
        "options": [
          { "text": "Bokoblin", "isAnswer": false },
          { "text": "Moblin", "isAnswer": false },
          { "text": "Lynel Hoof", "isAnswer": true },
          { "text": "Lynel Hoof", "isAnswer": true }
        ]
      }
    ]
  }
}
```

## Database

Use sqlite.
DB file name is in the format of `db/db-<timestamp>.sqlite` which is created on server starting.
To view the data, download the file and open it with any sqlite viewer.

## Optimize

If you encounter performance issues. The tips below could help.

- Compress images to a reasonable size. There are lots of tools can do that (ex: https://tinypng.com/).
- Use the production build for front-end. See [React document](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build) for more detailed information.
- It's recommend to use 4G since the WiFi offered by the wedding venue may be slow.

# How to develop

## Back-end

1. Compile typescript in watch mode: `npm run build -- --watch`
2. Modify the code under *src*
3. Whenever you modify the code, restart the server

## Front-end

*wedding-screen-frontend* is a submodule of *wedding-screen* and link to *frontend/* folder.

The project is initiated by [create-react-app (CRA)](https://github.com/facebook/create-react-app).
Base on **CRA**, we integrated it with *redux*, *redux-thunk*, *websocket*, *css-module* and *storybook*(for test).

We [ejected CRA configurations](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject) and made some changes:
1. Allow multiple entry points. One for user page the other for admin page.
2. Enable css module.

Followings are the steps to develop.

1. Run the back-end server
    ```
    cd wedding-screen
    npm run start
    ```
    Although **CRA** will run webpack-dev-server to host static files in development mode. However, we need to connect to back-end server to deal with actions (ex: add comment).
    We proxy some uris (*/socket*, */images/* and */resources/*) to the back-end server.
    See [Proxy API Requests in Development](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development).
2. cd into *frontend/*
3. Modify code under *frontend/src/* to meet your need.
4. Runs the app in development mode.

    ```
    npm run start
    ```
    This command will open `http://localhost:3000` in browser.
    And page will automatically reload if you make changes to the code.

# Test

## Back-end

dy93: You barely have errors when you are writing **typescript**.

## Front-end

**To be fix.**

We use [storybook](https://storybook.js.org/basics/guide-react/) to have a quick demo of react components.

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
