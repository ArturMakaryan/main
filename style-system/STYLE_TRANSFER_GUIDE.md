# Website Style Transfer Guide

Use this guide when applying the RoyalBets visual system to a new website with the same theme but different generated classes.

## Source Of Truth

The reference styling is in:

- `RoyalBets/styles.css`
- `RoyalBets/component-detector.js`

The website selector mappings are saved in:

- `site-style-selector-map.json`

## Inspection Flow

For every new website, inspect these states:

1. Desktop above `992px`, usually `1440px` wide.
2. Desktop collapsed sidebar after clicking `[data-mj="sidebar-collapse"]`.
3. `992px` wide.
4. Mobile below `992px`, usually `390px` wide.

Record the classes for header, sidebar, catalog inputs, selects, and category chips. Generated `app-ltr-*` classes can change between websites, so prefer stable attributes like `data-mj`, `aria-label`, and structural location when possible.

## Component Targets

Header:

- `[data-mj="header"]`
- `[data-mj="custom-header"]`
- `[data-mj="login-button"]`
- `[data-mj="logo"]`

Sidebar:

- `[data-mj="sidebar"]`
- `[data-mj="sidebar-content"]`
- `[data-mj="sidebar-nav"]`
- `[data-mj="sidebar-nav-list"]`
- `[data-mj="sidebar-section"]`
- `[data-mj="sidebar-group"]`
- `button[data-mj="sidebar-collapse"]`
- Section arrow buttons, usually `button[aria-label="arrow_down"]` and `button[aria-label="arrow_up"]`
- Shared wrapper/container classes that have been stable across sites: `.app-ltr-10a4mqi`, `.app-ltr-es55kh`, `.app-ltr-1q5mnmx`
- `.sl-navlink` inside the sidebar
- `.active-link` state
- hover state

Catalog:

- `input[data-mj="game-catalog-game-search"]`
- `input[data-mj="game-catalog-provider-search"]`
- `input[data-mj="game-catalog-mobile-provider-input"]`
- `button[data-mj="game-catalog-mobile-search-toggle"]`
- `.sl-select__control`
- `[aria-label="search"]`
- `[aria-label="filter"]`
- `[data-mj="game-catalog-category-slider-item"]`
- `[data-mj="game-catalog-mobile-category-chip"]`

Account/balance:

- `[data-mj="account-menu"]`
- `[data-mj="account-menu-item"]`
- Balance text only when it is not `[data-mj="footer-copyright"]`.

## Reusable Style Tokens

Dark background:

```css
#1e162f
```

Panel background:

```css
#2a213f
```

Muted text:

```css
#bfb6d8
```

Muted icon:

```css
#6a627b
```

Gold active text:

```css
rgb(236, 202, 101)
```

Default gradient border:

```css
border: 1px solid transparent !important;
border-radius: 12px !important;
box-shadow: none !important;
background:
  linear-gradient(#241d33, #2b243b) padding-box,
  linear-gradient(164deg, rgb(50 49 55) 0%, rgb(47 37 67) 100%) border-box !important;
```

Active category gradient:

```css
border: 1px solid transparent !important;
border-radius: 12px !important;
box-shadow: none !important;
background:
  linear-gradient(#241d33, #3a3056) padding-box,
  linear-gradient(177deg, rgb(233 215 148 / 16%) 30%, rgb(156 137 88) 100%) border-box !important;
```

Login button gradient:

```css
background: linear-gradient(138.42deg, rgba(240, 225, 160, 1.00) 0%, rgba(194, 163, 87, 1.00) 100%) !important;
color: #1e162f !important;
```

## Sidebar Rules To Preserve

Expanded sidebar:

```css
width: 260px !important;
padding: 0 !important;
border-radius: 0 !important;
```

Collapsed sidebar:

```css
width: 68px !important;
padding: 0 !important;
```

Sidebar content:

```css
border-right: 1px solid rgb(255 255 255 / 10%) !important;
border-radius: 0 !important;
padding: 0 12px 12px 0px !important;
```

Sidebar nav link:

```css
color: #bfb6d8 !important;
font-size: 14px !important;
font-weight: 300 !important;
padding: 4px 32px 4px 22px !important;
```

Sidebar active/hover link:

```css
border-radius: 0 12px 12px 0 !important;
background: #ffffff0d !important;
```

Sidebar active text:

```css
color: rgb(236, 202, 101) !important;
```

Shared sidebar wrapper reset:

```css
.app-ltr-1q5mnmx {
  scrollbar-gutter: unset !important;
  padding: 0 !important;
}
```

Shared collapsed/compact sidebar group containers:

```css
.app-ltr-es55kh {
  display: flex !important;
  flex-direction: column !important;
  background: #2a213f !important;
  border-radius: 12px !important;
  border: 1px solid rgb(53 46 68) !important;
  gap: 0px !important;
  margin-left: 13px !important;
  width: 42px !important;
  margin-top: 60px !important;
  transform-origin: top center !important;
  transition:
    margin 220ms ease,
    width 220ms ease,
    gap 220ms ease,
    transform 220ms ease,
    opacity 180ms ease !important;
  animation: rb-sidebar-group-vertical 220ms ease-out !important;
}

.app-ltr-10a4mqi {
  display: flex !important;
  flex-direction: row !important;
  background: #2a213f !important;
  border-radius: 12px !important;
  border: 1px solid rgb(53 46 68) !important;
  gap: 0px !important;
  margin: 12px 0px 12px 56px !important;
  padding: 12px 12px 0 12px !important;
  transform-origin: left center !important;
  transition:
    margin 220ms ease,
    padding 220ms ease,
    gap 220ms ease,
    transform 220ms ease,
    opacity 180ms ease !important;
  animation: rb-sidebar-group-horizontal 220ms ease-out !important;
}
```

Shared sidebar container animations:

```css
.app-ltr-es55kh > *,
.app-ltr-10a4mqi > * {
  transition:
    transform 220ms ease,
    opacity 180ms ease !important;
}

@keyframes rb-sidebar-group-horizontal {
  from {
    opacity: 0.86;
    transform: translateX(-8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes rb-sidebar-group-vertical {
  from {
    opacity: 0.86;
    transform: translateY(-8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

Sidebar section arrow buttons:

```css
button[aria-label="arrow_down"].SITE_ARROW_CLASS,
button[aria-label="arrow_up"].SITE_ARROW_CLASS {
  width: 32px !important;
  min-width: 32px !important;
  height: 32px !important;
  background-color: transparent !important;
  right: 6px !important;
}
```

Responsive sidebar patch:

```css
@media (max-width: 992px) {
  .app-ltr-10a4mqi {
    padding: 0px 0px 0px 0px !important;
    margin: 12px 0px 12px 12px !important;
  }

  [data-mj="sidebar-content"] {
    padding: 0 12px 12px 0px !important;
  }
}
```

Desktop sidebar footer/container reset:

```css
@media (min-width: 993px) {
  [data-mj="sidebar-footer"],
  .app-ltr-10a4mqi {
    padding: 0 !important;
  }
}
```

## Header Rules To Preserve

```css
[data-mj="header"] {
  background-color: #1e162f !important;
  border-bottom: 1px solid rgb(255 255 255 / 10%) !important;
  box-shadow: none !important;
}

[data-mj="custom-header"] {
  display: flex !important;
  background-color: #1e162f !important;
  border-bottom: 0 !important;
  box-shadow: none !important;
}
```

## Catalog Rules To Preserve

Inputs:

```css
font-size: 14px !important;
font-weight: 300 !important;
border-color: #34274e !important;
background-color: #1e162f !important;
```

Selects and mobile search buttons use the default gradient border.

Category inactive chips use the default gradient border.

Category active chips and category hover state use the active category gradient.

## Important Caveats

- Do not apply balance pseudo-element styles to `[data-mj="footer-copyright"]`.
- Do not globally hide `.app-ltr-6jrdpz`; hide exact images by `src` or by parent location.
- Generated classes should be copied per website, but stable `data-mj` selectors should be used where they are safe.
- At `992px` and below, many sites hide the desktop sidebar entirely. Verify before adding mobile-only sidebar styles.
