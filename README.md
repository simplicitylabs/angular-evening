# angular-evening

[Eve](http://python-eve.org) compatibility layer for [angular-thickm](
http://github.com/simplicitylabs/angular-thickm/). This
library can be used as is for Eve APIs, or can be extended or used as
inspiration.

See also [angular-thickm](http://github.com/simplicitylabs/angular-thickm/).

## Features

 - Support for e-tags
 - `hasMore()` and `loadMore()` methods to fill in collections with the "next"
 page.
 - Proper formatting of nested objects as parameters
 - Free text search function using the Eve/MongoDB `$text` operator

## Adding to my project

 - Using bower: `bower install angular-evening --save`.
 - Manually using either raw or minified versions in the `dist` folder.

## Contributing

Install
```
npm install && bower install
```

Build
```
grunt
```

Test
```
npm test
```

## License

[MIT](http://opensource.org/licenses/MIT) © [Silicon Laboratories,
Inc.](http://www.silabs.com)
