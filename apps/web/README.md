## Tiles Town

#### Deployment status

[![Netlify Status](https://api.netlify.com/api/v1/badges/e376a228-9575-47c8-bafa-1493adaee126/deploy-status)](https://app.netlify.com/sites/tiles-town/deploys)

[https://tiles.town](https://tiles.town)

#### TODO for later, maybe

-   reduce bundle.js size: import only parts of bootstrap? drop some polyfills? gzip? fontawesome, come on
-   prevent users from losing their game and score if the first request fails
-   make info panels pretty, hidden, don't display raw data
-   client-side pretty form validation popups
-   disable zalgo
-   flashing text only in dark mode, something to do with the colors, check different browsers
-   remember window position and scroll to it after theme change, to avoid jump on re-render, preferably loading overlay in-between
-   fontawesome-react BLOAT, import only used icons they said, tree-shaking they said, it'll be okay they said

#### TODO for much later and probably not

-   how to play modal pop-up, GIF with example
-   board max. height for wide display and big board sizes (not sure if it's a good change or having big tiles and scrolling down/up is actually better)
-   option to show more high scores, show highlighted row with last game played to see where exactly the user placed
-   tune down score size-based scaling at bigger sizes? or just split scores by board size and ditch the size-based algorithm altogether
-   fancy loading icon, overlay elements during loading
