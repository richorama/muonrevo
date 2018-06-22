![](https://travis-ci.org/richorama/muonrevo.svg?branch=master)

![](screenshot.png)

# MuonRevo

Markdown based note taking software, backed by dropbox.

## How it works

The app is based entirely in the browser, and can be served from any static web host (although you'll have to set up your own dropbox app if you want to host it on your own domain).

When you first visit the site you will be asked to authenticate with dropbox. 

This will then create a folder under 'Apps' in your dropbox account.

The editor will then use this to store all the entries you write.

Try is here https://richorama.github.io/muonrevo/

## Building the UI

Please ensure a recent version of the node.js is installed.

The run these commands to install the dependencies, and build the UI.

```
$ npm install
$ npm run build
```

You can test the application by running it locally on port 8080.

I uses the npm module 'static' on the cli:

```
$ npm install -g node-static
$ static
```

## License

MIT
