
# [JeveL](https://github.com/3F/JeveL)

Comfy ***J***avaScript ***eve***nt ***L***isteners;

Opened for ❤️ **Open Source** as part of **[Jt](https://github.com/3F/Jt#why-jt-) project.** Under the [MIT License (MIT)](https://github.com/3F/JeveL/blob/master/License.txt)

[![License](https://img.shields.io/badge/License-MIT-74A5C2.svg)](https://github.com/3F/JeveL/blob/master/License.txt)


## Why JeveL ?

It was based on the same principles: ["... small, fast, and damn customizable"](https://github.com/3F/Jt#why-jt-).

* Various formats;
* Configurable Actions and Events. All delimiters are fully changeable in all possible formats;
* Configurable default event;

### Contract-based format

`~  name:type1;type2;type3`

For example, this can be interpreted:

```javascript
 `name` will equal to `name:click`
 `name:;keyup` will equal to `name:click;keyup`
```

### Event-type-based format

`~  name:type;name2:type2;...`

For example, this can be interpreted:

```javascript
 `name` will equal to `name:click`
 `name;name2:keyup` will equal to `name:click;name2:keyup`
```

### Configurable attribute

```html
<div class="btn-act" jvl="..." />
<div class="nice picture" at="..." />
...
```

## License

Licensed under the [MIT License (MIT)](https://github.com/3F/JeveL/blob/master/License.txt)

```
Copyright (c) 2020  Denis Kuzmin < x-3F@outlook.com > GitHub/3F
```

[ [ ☕ Donate ](https://3F.github.com/Donation/) ]

JeveL contributors: https://github.com/3F/JeveL/graphs/contributors

We're waiting for your awesome contributions!

## Status

First stage. Opening source code from my old closed things.

You can already use or contribute; or please wait the [Jt](https://github.com/3F/Jt#why-jt-) similar stage.