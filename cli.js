#!/usr/bin/env node

'use strict';

const dns = require('dns');
const os = require('os');
const fs = require('fs');
const exec = require('child_process').exec;
const http = require('http');
const chalk = require('chalk');
const logUpdate = require('log-update');
const packstat = require('packstat');
const tr = require('total-release');
const whatiz = require('whatiz');
const curver = require('curver');
const pb = require('packages-by');
const got = require('got');

const arg = process.argv[2];
const getDir = os.homedir();
const addPath = '/node_modules/';
const joinPath = `${getDir}${addPath}`;

if (!arg || arg === '--help' || arg === '-h') {
	console.log(
		`
 Usage: nist -i <package-name>

  ${chalk.bold.cyan('Install:')}
  -i, --install : install packages
  -e, --exist   : Check wheather the package is installed or not
  -g, --global  : install package directly in ${joinPath}

  ${chalk.bold.cyan('Publish:')}
  -p, --publish : publish your module

  ${chalk.bold.cyan('Packages:')}
  -a, --avail   : check is package name is available
  -b, --by      : total packages published by a npmjs user
  -d, --diff    : compare the package version across node_modules and nmpjs
  -c, --current : check current package version from (node_modules)
  -l, --latest  : check latest version of a remote package

  ${chalk.bold.cyan('Infos:')}
  -s, --stat    : get monthy, weekly and daily download counts
  -t, --total   : total release of a node packge.
  -w, --what    : get package description from node_modules or npmjs

  ${chalk.bold.cyan('Version:')}
  -n, --node    : get current node version
  -z, --nolat   : get the latest node version from nodejs.org
  -nv, --npm    : get npm vesrion

  ${chalk.bold.cyan('Nist :')}
  -v, --version : display version
  -h, --help    : dispaly help
		`);
}

const nodeVersion = process.versions.node;
const pre = `${chalk.bold.cyan('›')} `;

if (arg === '--version' || arg === '-v') {
	console.log(chalk.bold.cyan(`\n${pre}Current nist version:`, require('./package.json').version, `\n`));
}

if (arg === '--node' || arg === '-n') {
	console.log(chalk.bold.cyan(`\n${pre}Current node version:`, nodeVersion, `\n`));
}

if (arg === '--nolat' || arg === '-z') {
	logUpdate(`\n${pre}${chalk.dim(`Fetching latest node version from ${chalk.bold(`nodejs.org`)}. Please Wait`)}\n`);
	const url = 'http://nodejs.org/dist/latest/SHASUMS256.txt';
	http.get(url, res => {
		let body = '';
		res.on('data', chunk => {
			body += chunk;
		});
		res.on('end', () => {
			let latestVersion = /node-v(\d+\.\d+\.\d+)/.exec(body);
			latestVersion = latestVersion && latestVersion[1];
			logUpdate(`\n${pre}${chalk.bold.cyan('Latest node version:', latestVersion)}\n`);
		});
	}).on('error', err => {
		logUpdate(`\n${pre}${chalk.bold.red('Please check your internet connection')}\n`);
		process.exit(1);
		console.error(err);
	});
}

function puts(error, stdout) {
	console.log(chalk.bold.cyan(`\n${pre}Current npm version:`, stdout));
}

if (arg === '-nv' || arg === '--npm') {
	exec('npm -v', puts);
}

if (arg === '--stat' || arg === '-s') {
	logUpdate(`\n${pre}${chalk.dim('Fetching download stats from npmjs')}\n`);
	packstat(process.argv[3]).then(user => {
		const inf = [];
		const packageRow = (prefix, key) => {
			if (user[key]) {
				inf.push(`${prefix}➠ ${user[key]}`);
			}
		};
		logUpdate();
		packageRow(`${pre}Last Day    `, 'lastDay');
		packageRow(`${pre}Last Week   `, 'lastWeek');
		packageRow(`${pre}Last Month  `, 'lastMonth');
		console.log(inf.join('\n'));
		console.log();
	});
	if (!process.argv[3]) {
		logUpdate(`\n${pre}${chalk.bold.red('Package name required')}\n`);
	}
}

if (arg === '--total' || arg === '-t') {
	logUpdate(`\n${pre}${chalk.dim('Please wait')}\n`);
	dns.lookup('npmjs.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			logUpdate(`\n${pre}${chalk.bold.red('Please check your internet connection')}\n`);
			process.exit(1);
		}
	});
	tr(process.argv[3]).then(user => {
		const inf = [];
		const countRow = (prefix, key) => {
			if (user[key]) {
				inf.push(`${prefix}➠  ${user[key]}`);
			}
		};
		logUpdate();
		countRow(`${pre}Total Release  `, 'releases');
		console.log(inf.join('\n'));
		console.log();
	});
	if (!process.argv[3]) {
		logUpdate(`\n${pre}${chalk.bold.red('Package name required')}\n`);
	}
}

if (arg === '--what' || arg === '-w') {
	dns.lookup('npmjs.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			logUpdate(`\n${pre}${chalk.bold.red('Please check your internet connection')}\n`);
			process.exit(1);
		}
	});
	let fullPath = joinPath + process.argv[3];
	const getArg = process.argv[3];
	if (!fs.existsSync(fullPath)) {
		logUpdate(`\n${pre}${chalk.dim(`Pakcage ${chalk.bold(getArg)} is not installed. Fetching it's description from npmjs`)}\n`);
		whatiz(getArg).then(user => {
			const inf = [];
			const countRow = (prefix, key) => {
				if (user[key]) {
					inf.push(`${prefix}:  ${user[key]}`);
				}
			};
			logUpdate();
			countRow(`${pre}${getArg}  `, 'info');
			console.log(inf.join('\n'));
			console.log();
		});
	}

	if (fs.existsSync(fullPath)) {
		logUpdate(`\n${pre}${getArg}  :  `, require(fullPath + '/package.json').description, '\n');
	}

	if (!process.argv[3]) {
		logUpdate(`\n${pre}${chalk.bold.red('Package name required')}\n`);
	}
}

if (arg === '--latest' || arg === '-l') {
	dns.lookup('npmjs.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			logUpdate(`\n${pre}${chalk.bold.red('Please check your internet connection')}\n`);
			process.exit(1);
		}
	});
	const arg = process.argv[3];
	logUpdate(`\n${pre}${chalk.dim(`Fetching ${chalk.bold(arg)}\'s latest version from npmjs`)}\n`);
	curver(process.argv[3]).then(user => {
		const inf = [];
		const packageVersion = (prefix, key) => {
			if (user[key]) {
				inf.push(`${prefix} : ${chalk.bold(user[key])}`);
			}
		};
		logUpdate();
		packageVersion(`${pre}Latest vesrion of ${chalk.bold(arg)}`, 'version');
		console.log(inf.join('\n'));
		console.log();
	});

	if (!process.argv[3]) {
		logUpdate(`\n${pre}${chalk.bold.red('Package name required')}\n`);
	}
}

if (arg === '--current' || arg === '-c') {
	let fullPath = joinPath + process.argv[3];
	const comm = chalk.bold(process.argv[3]);
	const putMess = chalk.green(` Use ${chalk.bold.green('npm install')} ${comm} to install the package`);

	if (fs.existsSync(fullPath)) {
		console.log(`\n${pre}Installed version of ${chalk.bold(comm)}  : `, chalk.bold(require(fullPath + '/package.json').version, '\n'));
	} else {
		logUpdate(`\n${pre}${chalk.bold.cyan(`Package "${chalk.green.bold(comm)}" is not installed`)}\n\n ${putMess}\n`);
	}

	if (!process.argv[3]) {
		logUpdate(`\n${pre}${chalk.bold.red(`Package name required`)}\n`);
	}
}

if (arg === '--diff' || arg === '-d') {
	const arg = process.argv[3];
	let fullPath = joinPath + arg;
	dns.lookup('npmjs.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			logUpdate(`\n${pre}${chalk.bold.red('Please check your internet connection')}\n`);
			process.exit(1);
		}
	});

	if (!arg) {
		logUpdate(`\n${pre}${chalk.bold.red(`Package name required`)}\n`);
		process.exit(1);
	}

	if (!fs.existsSync(fullPath)) {
		logUpdate(`\n${pre}${chalk.bold.red(`Package ${chalk.bold.green(arg)} does not exists`)}\n`);
		process.exit(1);
	}

	if (fs.existsSync(fullPath)) {
		logUpdate(`\n${pre}${chalk.dim(`Comparing package version. Please wait`)}\n`);
		const homePackage = require(fullPath + '/package.json').version;
		curver(process.argv[3]).then(user => {
			const inf = [];
			const packageVersion = (prefix, key) => {
				if (user[key]) {
					inf.push(`${prefix} is ${chalk.bold(user[key])} and you using version ${chalk.bold(homePackage)}`);
				}
			};
			logUpdate();
			packageVersion(`${pre}Latest vesrion of ${chalk.bold(arg)}`, 'version');
			console.log(inf.join('\n'));
			console.log();
		});
	}
}

if (arg === '-a' || arg === '--avail') {
	dns.lookup('npmjs.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			logUpdate(`\n${pre}${chalk.bold.red('Please check your internet connection')}\n`);
			process.exit(1);
		}
	});
	const arg = process.argv[3];
	const url = 'https://npmjs.com/package/' + arg;
	logUpdate(`\n${pre}${chalk.dim(`Checking whether ${chalk.bold(arg)} is available or not. Please wait`)}\n`);

	if (!arg) {
		logUpdate(`\n${pre}${chalk.bold.red(`Package name required`)}\n`);
		process.exit(1);
	}

	got(url).then(res => {
		if (res.statusCode === 200) {
			logUpdate(`\n${pre}${chalk.dim(`Package name ${chalk.bold(arg)} is not available`)}\n`);
		}
	}).catch(err => {
		if (err) {
			logUpdate(`\n${pre}${chalk.dim(`Aha! package name ${chalk.bold(arg)} is available`)}\n`);
			process.exit(1);
		}
	});
}

if (arg === '-b' || arg === '--by') {
	const arg = process.argv[3];
	logUpdate(`\n${pre}${chalk.dim(`Fetching packages count. Please wait`)}\n`);
	dns.lookup('npmjs.com', err => {
		if (err && err.code === 'ENOTFOUND') {
			logUpdate(`\n${pre}${chalk.bold.red('Please check your internet connection')}\n`);
			process.exit(1);
		}
	});

	if (!arg) {
		logUpdate(`\n${pre}${chalk.bold.red(`Package name required`)}\n`);
		process.exit(1);
	}

	pb(process.argv[3]).then(user => {
		const inf = [];
		const packageVersion = (prefix, key) => {
			if (user[key]) {
				inf.push(`${prefix} has ${chalk.bold(user[key])}`);
			}
		};
		logUpdate();
		packageVersion(`${pre}NPM user ${chalk.bold(arg)}`, 'packages');
		console.log(inf.join('\n'));
		console.log();
	});
}

if (arg === '--exist' || arg === '-e') {
	const arg = process.argv[3];
	const fullPath = joinPath + arg;
	const putMess = `${pre}${chalk.bold.cyan('npm install')} ${chalk.bold.cyan(arg)}`;

	if (!arg) {
		logUpdate(`\n${pre}${chalk.bold.red(`Package name required`)}\n`);
		process.exit(1);
	}

	if (!fs.existsSync(fullPath)) {
		logUpdate(`\n${pre}${chalk.dim(`Sorry! could not find ${chalk.bold(arg)} in ${chalk.bold(joinPath)}\n\n${putMess}`)}\n`);
	}

	if (fs.existsSync(fullPath)) {
		logUpdate(`\n${pre}${chalk.dim(`Package ${chalk.bold(arg)} is available in ${chalk.bold(joinPath)}`)}\n`);
	}
}
