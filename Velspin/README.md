# Velspin

Custom CSS project for Velspin.

## Footer replacement

The supplied footer is implemented as a Shadow DOM replacement for the live
`[data-mj="footer"]` element. Load the script after the platform page loads:

```html
<script src="https://cdn.jsdelivr.net/gh/ArturMakaryan/main@main/Velspin/footer.js" defer></script>
```

`footer.js` loads `footer.css` and the assets from this same Velspin folder.
The existing `styles.css` remains separate and can continue to be loaded for
the rest of the site.

CDN format:

https://cdn.jsdelivr.net/gh/ArturMakaryan/main@COMMIT/Velspin/styles.css
