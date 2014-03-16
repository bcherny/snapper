#!/usr/bin/env node

var fs = require('fs')
  , phantom = require('phantom')
  , options = JSON.parse(fs.readFileSync('./config.json'))
  ;


phantom.create(function (ph) {
	ph.createPage(function (page) {

		var n = 0
		  , interval
		  ;

		page.clipRect = options.viewport;

		page.open('http://console.turn.com/', function (status) {
			clearInterval(interval);
			ph.exit();
		});

		interval = setInterval(function() {

			var time = options.interval * n
			  , file = './' + options.folder + '/' + time + '.png'
			  ;

			page.render(file);

			console.log('snapping at ' + time + 'ms -> ' + file)

			++n;

		}, options.interval);
	});
});