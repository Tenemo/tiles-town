# hadron.design

## TODO
### now
- add site manifest, theme color etc 
- hamburger mobile after click border

### i18n
- i18next-react

### for later, maybe
- fontawesome-react BLOAT :c import only used icons they said, tree-shaking they said, it'll be okay they said
- reduce bundle.js size: import only parts of bootstrap? drop some polyfills? gzip? fontawesome, come on
- testing client/server, also jest gets mysteriously stuck on the few simple tests after latest update now
- add JSDoc wherever it's missing, client maybe too
- npm cache has it out for me, no amount of reinstalls fix EPERM error, find some other solution, I shouldnt rimraf .cache on every start (or should I)
- prevent users from losing their game and score if the first request fails
- make info panels pretty, hidden, dont display raw data
- clear out unused NPM packages
- client-side pretty form validation popups, also: disable zalgo
- add htmlFor's to labels, because accessibility
- if the site ever grows to have more scss, they should be imported separately for each section, redo themes, I think it also messes up map files when viewing in browser
- add FAQ? similar questions get asked all the time
- react-youtube throwing some console errors, it has no impact on anything, not sure if fixable
- flashing text only in dark mode, something to do with the colors, check different browsers
- componentWillUnmount() cancel requests?
- remember window position and scroll to it after theme change, to avoid jump on rerender, preferably loading overlay inbetween

### for much later and probably not
- how to play modal pop-up, GIF with example
- board max. height for wide display and big board sizes (not sure if it's a good change or having big tiles and scrolling down/up is actually better)
- option to show more high scores, show highlighted row with last game played to see where exactly the user placed
- pro mode with no animations, timer and whatnot
- tune down score size-based scaling at bigger sizes? or just split scores by board size and ditch the size-based algorithm altogether
- fancy loading icon, overlay elements during loading
- player table in DB, track individual progress tied to device + browser (instead of relying on localStorage, probably better to just implement login system at that point?), maybe achievements? unlock higher board sizes only after beating smaller ones?
- special tiles? like exploding or whatever? abilities, like to flip chosen tile?