# 1.0.1 - 2019-03-24

## Added

- Heroku deploy button
- Admin: add endpoint to download sqlite

## Fixed

- Mobile safari OOM
- Restrict comment length to 128

# 1.0.0 - 2019-02-09

## added

- Game
  - show vote history in rank page.
  - Allow multiple answers.
- Add docker support.
- Support deploy to heroku.

## changed

- Slideshow
  - Adjust bullet comments' speed
    - Each comment takes 10s to move from right to left. So the longer comments are running fast than short ones.
  - Improve image loading
    - Fix images' longest edges' dimension to 1280.
    - Download the current slide of images first.
- Game:
  - Normalize score in range of 0~1000.
- Merge frontend project and backend project into one project.
