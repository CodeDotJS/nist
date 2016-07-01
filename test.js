import childProcess from 'child_process';

import test from 'ava';

test.cb(t => {
	childProcess.execFile('./cli.js', ['--help'], {
		cwd: __dirname
	}, (err, stdout) => {
		t.ifError(err);
		t.true(stdout === '\n Usage: nist -i <package-name>\n\n  Install:\n  -i, --install : install packages\n  -e, --exist   : Check wheather the package is installed or not\n  -g, --global  : install package directly in /home/rishi/node_modules/\n\n  Publish:\n  -p, --publish : publish your module\n\n  Packages:\n  -a, --avail   : check is package name is available\n  -b, --by      : total packages published by a npmjs user\n  -d, --diff    : compare the package version across node_modules and nmpjs\n  -c, --current : check current package version from (node_modules)\n  -l, --latest  : check latest version of a remote package\n\n  Infos:\n  -s, --stat    : get monthy, weekly and daily download counts\n  -t, --total   : total release of a node packge.\n  -w, --what    : get package description from node_modules or npmjs\n\n  Version:\n  -n, --node    : get current node version\n  -z, --nolat   : get the latest node version from nodejs.org\n  -nv, --npm    : get npm vesrion\n\n  Nist :\n  -v, --version : display version\n  -h, --help    : dispaly help\n\t\t\n');
		t.end();
	});
});

test.cb(t => {
	childProcess.execFile('./cli.js', ['-z'], {
		cwd: __dirname
	}, (err, stdout) => {
		t.ifError(err);
		t.true(stdout === '\u001b[?25l\n› Fetching latest node version from nodejs.org. Please Wait\n\n\u001b[?25l\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\u001b[1A\u001b[1000D\u001b[K\n› Latest node version: 6.2.2\n\n\u001b[?25h');
		t.end();
	});
});
