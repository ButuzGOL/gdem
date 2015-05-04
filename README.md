# Google Drive environments manager
[![Build Status](https://travis-ci.org/ButuzGOL/gdem.svg?branch=master)](https://travis-ci.org/ButuzGOL/gdem) [![Join the chat at https://gitter.im/ButuzGOL/gdem](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ButuzGOL/gdem?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  
Gives you ability to pull your projects from git and publish branch, tag or hash to Google Drive server and share.  
Inspired by [Google Drive pages](https://github.com/ButuzGOL/gd-pages) and [Host webpages with Drive](https://support.google.com/drive/answer/2881970?hl=en)
## Install

```sh
$ sudo npm install --save gdem
```

## Creating a Service Account using the Google Developers Console
Take a look [Tutorial](https://github.com/ButuzGOL/gd-pages#creating-a-service-account-using-the-google-developers-console)

## Usage

```
gdem <command> [<args>]


  Commands:

    list                     list of environments
    create                   create environment
    update [name]            update environment
    remove [name]            remove environment
    publish [name] [cursor]  publish based on cursor (branch, tag, hash)
```

## Typical workflow

```bash
7:30 gdem master* ❯ gdem create
? Name: project
? Service account email: 525918832864-j7@developer.gserviceaccount.com
? Path to key file: /Users/butuzgol/Playground/gdem/Test-3d9.p12
? Git path: git@github.com:DragonLegend/game.git
? Build command: sh build.sh
? Build directory: dist
Env created ✔

7:31 gdem master* ❯ gdem list
  project
# Publish master branch (instead it can be branch, tag or hash) at the end link
7:32 gdem master* ❯ gdem publish project master
Repo ready ✔
Pull...
Checkout...
Running build command
 
Publishing to Google Drive
Authorized ✔ +573ms
Folder exists final
Folder exists master
Folder deleted 0B7VauhZc5irtTThqTWdmTE9RZUE ✔ +1639ms
Folder created master 0B7VauhZc5irtR09oZ1lfc0tCZjg ✔ +796ms
Start uploading folder …
File uploaded index.html
Uploading done ✔ +1613ms
Shared ✔ +825ms
Your link: https://www.googledrive.com/host/0B7VauhZc5irtR09oZ1lfc0tCZjg
```

## License

MIT © [ButuzGOL](https://butuzgol.github.io)
