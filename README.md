# Micro Simulations for Education

Compiled by UMN Students.
Micro simulations created by generative AI tools.

### Procedure for adding a simulation:
```
Create the following directory, and the internal files:

 + /docs/sims/MySim
 +              .../MySim.html
 +              .../MySim.js
 +              .../index.md
 
 + /docs/sims/thumbnails/MySim.png

 cd src && python make_main_gallery.py
```
The python script will update the docs/index.md, adding the MySim to the gallery (index.md) page.

### index.md format:

Please include a generation prompt in your index.md.  If multiple variations of a prompt were used, paraphrase into one.
 
````
## Prompt

```linenums="0"
Generation prompt text.
```
````
While this format is subject to change, the standarization of it eases the use automation to implement later changes.