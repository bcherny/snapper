#!/usr/bin/env node

var fs = require('fs')
  , webdriver = require('selenium-webdriver')
  , options = JSON.parse(fs.readFileSync('./config.json'))
  , url = process.argv[2]
  , driver = new webdriver.Builder()
				 .withCapabilities(webdriver.Capabilities.chrome())
				 .build()
  , shots = {}
  ;

// phantom.create(function (ph) {
// 	ph.createPage(function (page) {

		var n = 0
		  , interval
		  , path = ['.', options.folder, url.slice(url.lastIndexOf('/') + 1)].join('/')
		  , snaps = {}
		  ;

		//page.set('onLoadStarted', function() {

			interval = setInterval(function() {

				var time = options.interval * n
				  , file = path + '/' + time + '.' + options.format
				  ;

				screenshot(driver, file, function (err) {

					if (err) {
						throw err;
					}

					console.log('snapping at ' + time + 'ms -> ' + file);

				});

				++n;

				console.log('state=' + driver.executeScript('return document.readyState'))

				driver.executeScript('return document.readyState').then(function (val){
					if (val === 'complete') {
						clearInterval(interval);
						driver.quit();

						for (var shot in shots) {
							fs.writeFile(shot, shots[shot].replace(/^data:image\/png;base64,/,''), 'base64', function (err) {
								if (cb) {
									cb(err);
								}
							});
						}
					}
				});

			}, options.interval);

		//});

		// open page
		driver.get(url);

		// page.open(url, setTimeout(function (status) {

		// 	// stop snapping
		// 	clearInterval(interval);

		// 	ph.exit();
		// }, 2000));

// 	});
// });

function screenshot (driver, filename, cb) {
	return driver.takeScreenshot().then(function (data) {
		shots[filename] = data;
	});
}