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
		  , path = ['.', options.folder, url.slice(url.lastIndexOf('/'))].join('/')
		  ;

		page.set('onLoadStarted', function() {

			interval = setInterval(function() {

				var time = options.interval * n
				  , file = path + '/' + time + '.png'
				  ;

				page.render(file, function (file) {

					console.log('rendered ' + file + '!');

				}.bind(null, file));

				console.log('snapping at ' + time + 'ms -> ' + file);

				++n;

			}, options.interval);

		});

		// open page
		page.open(url, function (status) {
			setTimeout(clearInterval.bind(null, interval), options.interval);
			ph.exit();
		});

	});
});