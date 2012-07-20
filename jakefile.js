var events = require('events'),
	http = require('http'),
	xml2js = require('xml2js');

task('default', ['ci-connect']);

task('ci-connect', function() {
	var options = {
		host: 'go.laterooms.com',
		port: 8153,
		path: '/go/api/admin/config.xml',
		method: 'GET',
		auth: 'msmith:supak00lat9'
	};

	var req = http.get(options);

	req.on('response', function(res) {
		if (res.statusCode != '200') {
			fail('server returned status ' + res.statusCode);
			return;
		}

		var data = [];

		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			data.push(chunk);
		});

		res.on('end', function() {
			var parser = new xml2js.Parser();

			parser.parseString(data.join(''), function (err, result) {
				if (result.pipelines) {
					result.pipelines.forEach(function(pipeline) {
						console.log(pipeline['@'].group);
					});

					complete();
					return;
				}

				fail('no pipelines configured');
			});
		});
	});

	req.on('error', function(e) {
		fail('problem with request: ' + e.message);
	});

}, {async: true});

var Foo = function(initial_no) {
	this.count = initial_no;
};

Foo.prototype = new events.EventEmitter;

Foo.prototype.increment = function() {
	var self = this;
	setInterval(function() {
		if (self.count % 2 === 0) self.emit('even');
		self.count++;
	}, 300);
};

var bar = new Foo(1);

bar.on('even', function() {
	console.log('Number is even! :: ' + this.count);
}).increment();