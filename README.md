# Pocket Arcade

A neon arcade of 14 games in one page. Built with plain HTML, CSS and JavaScript: no frameworks, no libraries, no build step and no backend. It works on phones (touch) and computers (keyboard and mouse).

## 🚀 Live Demo
Play online now: **[https://hebafatima2490-gif.github.io/pocket-arcade/](https://hebafatima2490-gif.github.io/pocket-arcade/)**

## Features

- Animated intro page that scrolls into a game menu
- **14 games**, each with its own best score
- **🏆 Global Leaderboards** powered by Firebase: submit your high score and compete worldwide
- **🚀 LinkedIn Challenge Integration**: one-click challenge sharing to your LinkedIn feed
- Easy, Normal and Hard difficulty (best scores are kept separately for each)
- Touch controls on phones: swipes, taps and drags, with no on-screen buttons
- Keyboard controls on computers
- Chiptune music with a different track for every game
- Separate volume sliders for music and sound effects
- Vibration on hits and crashes (Android phones)
- Pause menu with Resume, Restart and Menu
- How-to-play popup the first time you open each game
- Best scores and settings are saved in the browser

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure: intro screen, game menu, play screen, pause, leaderboards, and popups |
| `style.css` | All styling: neon theme, menu cards, layout, popups |
| `script.js` | All game code, music, leaderboards, settings and screen switching |

Keep the three files in the same folder. `index.html` loads the other two by name.

## Run it

Open `index.html` in a browser. The fonts (Silkscreen and Orbitron) load from Google Fonts, so you need an internet connection the first time.

If the page looks tiny, your browser is zoomed out. Press Ctrl + 0 (Cmd + 0 on a Mac) to reset the zoom.

## The games

| Game | Keyboard | Touch | Score |
|---|---|---|---|
| Tetris | Left/Right move, Up rotate, Down drop, Space drop | Swipe move, swipe up rotate, tap or flick drop | 1 per cleared line |
| Pac-Man | Arrow keys | Swipe | 1 per dot/ghost; +50 level bonus (endless) |
| Flappy | Space or Up | Tap | 1 per pipe passed |
| Snake | Arrow keys | Swipe | 1 per dot eaten |
| 2048 | Arrow keys | Swipe | Value of merged tiles |
| Breakout | Left/Right or mouse | Drag | 10 per brick; +100 level bonus (endless) |
| Shooter | Arrow keys or mouse | Drag (ship fires on its own) | 1 per enemy |
| Racer | Left/Right or mouse | Drag | 1 per car passed |
| Memory | Click | Tap | 1 per pair (10 misses ends it) |
| Whack | Click | Tap | 1 per mole (3 escapes ends it) |
| Tic Tac Toe | Click | Tap | 1 per win against the computer |
| Stack | Space or Up | Tap | 1 per block placed |
| Inbox Zero | Left Archive, Down Reply, Right Spam | Tap bottom bins or swipe | 1 per sorted email + streak combos |
| Buzzwords | Left/Right arrows or mouse | Drag basket | 10 per real skill; dodge toxic clichés |

Other keys: P or Esc pauses. W, A, S, D also work as arrow keys.

## Difficulty

Pick Easy, Normal or Hard at the top of the menu. Easy is about 25% slower and Hard about 40% faster. This applies to the games that run on speed. Memory, 2048 and Tic Tac Toe are not affected. Tetris and Snake also speed up as you score.

## Customize

- **Tagline:** in `index.html`, edit the text inside `<p class="sub">`.
- **Colors:** the variables at the top of `style.css` (`--c`, `--b`, `--a` and so on).
- **Menu size on big screens:** the grid rules near `#grid` in `style.css`.
- **Game speed:** the `SPD` function in `script.js`.
- **Music:** `MEL` (melodies) and `TRK` (tempo, pitch and sound for each game) in `script.js`.

## Add your own game

1. In `script.js`, create a game object with `k` (a unique letter), `name`, `w`, `h`, `tip`, and the functions `init()`, `update(dt)`, `draw()` and `key(k)`. For tap games, also add `tap(e)`.
2. Add it to the `games` object, to the starting `hs` scores, and to `TRK` (its music) and `TT` (its touch hint).
3. In `index.html`, add a card to the grid with `data-g` set to your letter and an `id` of `b-` plus the letter.
4. In `style.css`, add an icon style such as `.ic.x::before` for the card.

Use `setScore(score+1)` to add points and `over()` to end the game.

## Notes

- Best scores and settings are stored in the browser's localStorage under the key `arc`. Clearing site data resets them.
- Vibration works on Android phones. iPhones do not allow vibration from web pages.
- Sound starts after your first tap or key press, because browsers block audio until then.
