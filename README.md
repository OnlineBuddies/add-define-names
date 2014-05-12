add-define-names
================

Use:

If you have `modules/moduleA.js`, `modules/moduleB.js` and `modules/moduleC.js`, with AMD modules in them, then

```
add-define-names.js -p 1 modules/*.js
```

Will emit AMD defines like so:

```
define('moduleA', function () .... );
define('moduleB', function () .... );
define('moduleC', function () .... );
```

It will preserve existing requires and module contents, only adds the name to the define calls and concatenates.
