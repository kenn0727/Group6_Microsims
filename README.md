# Micro Simulations for Education

Compiled by UMN Students.
Micro simulations created by generative AI tools.
Visit the site at https://kenn0727.github.io/Group6_Microsims/
---
## Procedure for adding a simulation:

```
Create the following directory, and the internal files:

 + /docs/sims/MySim
 +              .../MySim.html
 +              .../MySim.js
 +              .../index.md
 
 + /docs/sims/thumbnails/MySim.png
```
```
 cd src
```
and
```
 python make_main_gallery.py
 ```
The Python script will update the docs/index.md, adding the MySim to the gallery (index.md) page.
When you finish add your simulation. Check the preview website using a built-in dev-server:
```
 mkdocs serve
 ```
 Once, everything works okay and is ready to deploy. go to the master branch and type this:
```
 mkdocs gh-deploy
 ```
 Done!!

 The more detail information is here: https://www.mkdocs.org/getting-started/#getting-started-with-mkdocs

 
---

## Requested index.md format:

Please include a generation prompt in your index.md.  If multiple variations of a prompt were used, paraphrase into one. While this format is subject to change, the standarization of it eases the use automation to implement later changes.
 
````
## Prompt

```linenums="0"
Generation prompt text.
```
````

---
## Things to know
1. your simulation folder name has to be same as your .png file name.  such as Mysim.png in MySim folder.
2. If you see any of these two similar errors, follow this. 

Theme error:
```
ERROR   -  Config value: 'theme'. Error: Unrecognised theme 'material'. The available installed themesare
```
just install the mkdocs material using pip
```
pip install mkdocs-material
```

Extension error:
```
ERROR   -  Config value: 'markdown_extensions'. Error: Failed loading extension "pymdownx.tabbed".`
```
just install the extensions using pip
```
pip install pymdown-extensions --force
```


## Reference sources
Theme error: https://squidfunk.github.io/mkdocs-material/getting-started/#configuration

Extension error: https://stackoverflow.com/questions/69927989/using-mkdocs-failed-loading-extension-pymdownx-despite-it-being-installed