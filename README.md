# area b15

Link: https://brianchoi.net/b15/

## Overview

area b15 is the classic Fifteen puzzle game with a few bells and whistles:

  1. Each puzzle is made up of a photo that changes daily
  1. Everything is rendered in 3D (three.js). The background changes based on your local time
  
## Gifs

A scrambled photo drops from the sky

![start](https://raw.githubusercontent.com/bchoi12/b15/master/start.gif)

A personal fireworks show for a successful solve

![end](https://raw.githubusercontent.com/bchoi12/b15/master/end.gif)

Same as above, but at night

![night](https://raw.githubusercontent.com/bchoi12/b15/master/night.gif)

## Credits

I used [smartcrop.js](https://github.com/jwagner/smartcrop.js/) to automatically crop portrait and landscape photos to a square and I used [three.js](https://threejs.org/) for rendering basically everything. All other code is written using TypeScript and compiled with Webpack. The puzzle is hosted on github pages and can be accessed [here](https://brianchoi.net/b15/).

## Dev Notes

```
# install stuff
npm install

# compile javascript
tsc

# package javascript
npx webpack

# run local server
http-server dist
```