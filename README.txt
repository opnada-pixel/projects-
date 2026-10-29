EL ALFY HOLDING — Project page templates
=========================================
Five reusable layouts, each demonstrated with a real project. Everything sits in this one folder: the five pages, tpl.css, tpl.js, the fonts and the photos.

  template-a-editorial.html   Marriott Hotel Abu Dhabi   Default template for most projects (4–10 photos)
  template-b-material.html    Bvlgari Lighthouse         When the stone is the story: residential, hotels, bathrooms
  template-c-scale.html       Emiri Terminal             Large civic, transport and landmark projects
  template-d-journey.html     Sustainability Pavilion    Projects with a delivery story: site photos, mock-ups, phases
  template-e-immersive.html   Etihad Museum              Photo-led landmarks with 8+ strong photographs

How to make a new project page
1. Copy the template that fits. Rename it project-<slug>.html.
2. Add photos to this folder as <slug>-01.jpg, <slug>-02.jpg ... (01 is the hero).
3. Replace the text. Blocks marked <!-- repeat --> are duplicated per item; delete what a project does not have.
4. Update Related (three cards: same sector first, then same country) and the Next project link.

Animation attributes (handled by tpl.js, no libraries)
  data-split / data-split="lines"   heading rises word by word / line by line (split lines with <br>)
  data-r  (+ style="--d:n")          fade and rise, staggered by n
  data-wipe / "side" / "iris"        photo reveals from below / from the left / from the centre
  data-par="0.1"                     parallax on an image inside a cropped box
  data-count="315"                   number counts up
  data-line                          rule draws left to right
  data-pin + .track                  pinned horizontal gallery (swipe row on phones)
  data-progress / "stick"            sets --p from 0 to 1 while scrolling (drives Template C's opening hero and route line)
  data-lightbox="Caption"            click to enlarge
  data-compare + range input         before / after slider (Template D)
  data-steps / data-step / data-step-label   sticky step list that follows the photos (Template D)
  data-stack                         full-screen photos that stack over each other (Template E)

Behaviour
- Everything is visible without JavaScript. Add ?static to any URL to see the finished page without motion.
- Visitors with "reduce motion" switched on get no animation.
- The site navigation stays visible while scrolling. A switcher at the bottom moves between Templates A to E for review; it only appears on these five files.
- Fonts load from the .woff2 files in this folder; open the pages through a web server (or the live site) so they load.
