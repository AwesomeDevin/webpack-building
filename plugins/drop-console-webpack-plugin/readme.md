## drop-console-webpack-plugin
#### A webpack plugin for removing console and supporting webpack4
## Installation
```
npm install drop-console-webpack-plugin --save
```
## Usage
```
    const DropConsoleWebpackPlugin = require('./plugins/drop-console-webpack-plugin')

    plugins: [
        new DropConsoleWebpackPlugin(),
    ]
```
## Options
```
Name | default | Description
---- | ------- | -----------
drop_log | true | remove console.log(...)
drop_info | true | remove console.info(...)
drop_warn | true | remove console.warn(...)
drop_error | true | remove console.error(...)
```
## Code
```
new DropConsoleWebpackPlugin({
    drop_log    : false,
    drop_info   : false,
    drop_warn   : false,
    drop_error  : false,
})
```