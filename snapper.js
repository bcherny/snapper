#!/usr/bin/env node

var fs = require('fs')
  , phantom = require('phantom')
  , options = JSON.parse(fs.readFileSync('./config.json'))
  , url = process.argv[2]
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
				  , file = path + '/' + time + '.' + options.format
				  ;

				page.render(file, function () {

					console.log('snapping at ' + time + 'ms -> ' + file);

				});

				++n;

			}, options.interval);

		});

		// open page
		page.open(url, setTimeout(function (status) {

			// stop snapping
			clearInterval(interval);

			ph.exit();
		}, 2000));

	});
});