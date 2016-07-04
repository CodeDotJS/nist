<h1 align="center">
	<br>
	<img width="360" src="media/nist.png" alt="nist">
	<br>
	<br>
</h1>

> :snowflake: a package informer for npm modules

[![Build Status](https://travis-ci.org/CodeDotJS/nist.svg?branch=master)](https://travis-ci.org/CodeDotJS/nist)

## __`nist`__

- __`no useless package :`__

Prevents user from re-installing packages, if the package is available in `os.homedir()`/`node_modules`

- __`Less use of browser :`__

You can do most of the thing from __`nist`__ which you do by visiting `npmjs.com`


## Install

```
$ npm install --gloabl nist
```
__OR__
```
$ sudo npm install --global nist
```

## Usage

```
 Usage: nist <command> <package-name>

  Availabliity:
  -e, --exist   : Check wheather the package is installed in /home/{user}/node_modules/
  -f, --find    : Check wheather the package is present in current working directory
  -r, --remove  : Delete packages from /home/{user}/node_modules/

  Packages:
  -a, --avail   : check is package name is available
  -b, --by      : total packages published by a npmjs user
  -d, --diff    : compare the package version across node_modules and nmpjs
  -c, --current : check current package version from (node_modules)
  -l, --latest  : check latest version of a remote package

  Infos:
  -s, --stat    : get monthy, weekly and daily download counts
  -t, --total   : total release of a node packge.
  -w, --what    : get package description from node_modules or npmjs

  Version:
  -n, --node    : get current node version
  -z, --nolat   : get the latest node version from nodejs.org
  -nv, --npm    : get npm version

  Nist :
  -v, --version : display version
  -h, --help    : dispaly help
```

## Default __`npm`__  `or`  __`npm install`__

__Question :__ What npm don't cover?

__Answer :__ Some features which are missing in `npm` are :

&nbsp; - `Montlhy, weekly and daily download coverage.`

&nbsp; - `Local and remote package description.`

&nbsp; - `Compare version for a single module across remote and installed modules.`

&nbsp; - `Fetch node latest version`

&nbsp; - `Total release of a node package`


## Related

- [np](https://github.com/sindresorhus/np) : A better npm publish

## PS

- This is just my hobby project. I'm trying to do some experiments. That's all.

## Liecnse

MIT &copy; [Rishi Giri](http://rishigiri.com)
