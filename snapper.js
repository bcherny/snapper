#!/usr/bin/env node

var fs = require('fs')
  , phantom = require('phantom')
  , options = JSON.parse(fs.readFileSync('./config.json'))
  , url = 'http://console.turn.com'
  ;


phantom.create(function (ph) {
	ph.createPage(function (page) {

		var n = 0
		  , interval
		  , path = ['.', options.folder, url.slice(url.lastIndexOf('/') + 1)].join('/')
		  , snaps = {}
		  ;

		page.set('onLoadStarted', function() {

			interval = setInterval(function() {

				var time = options.interval * n
				  , file = path + '/' + time + '.png'
				  ;

				page.renderBase64('png', function (data64) {

					snaps[file] = data64;

				});

				console.log('snapping at ' + time + 'ms -> ' + file);

				++n;

			}, options.interval);

		});

		// open page
		page.open(url, function (status) {

			// stop snapping
			clearInterval(interval);

			// save snaps to disk
			setTimeout(Object.keys(snaps).forEach(function (file) {

				fs.writeFile(file, new Buffer(snaps[file], 'base64'), function (err) {

					if (err) { throw new error (err); }
					
					else { console.log('saved ' + file); }

				});

			}), options.interval);

			ph.exit();
		});

	});
});