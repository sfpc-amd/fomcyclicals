var fs = require('fs')
		, request = require("request")
		, cheerio = require("cheerio")
		, mkdirp = require("mkdirp")
		, urlFOMC = "http://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"
		, urlEncyc = "http://www.gcatholic.org/documents/data/type-PEN.htm"
		, completedFomc = 0
		, completedEncyc = 0;
	

function start() {

	mkdirp.sync("data/fomc");
	mkdirp.sync("data/encyclicals");

	request(urlFOMC, reqFOMC);
	request(urlEncyc, reqEncyc);

}

function reqFOMC(error, response, body) {
	if(error) {
		console.log("Request error: "+error);
		return;
	}

	var $ = cheerio.load(body)
		, links = $('table tr td.statement2 > a');


	links.each(function(i, link) {
		var url = "http://www.federalreserve.gov/" + $(link).attr('href');
		request(url, function reqFOMCStatement(error, response, body) {
			if(error) {
				console.error("Request error: "+error);
				return;
			}

			var $ = cheerio.load(body)
				, content = $('#leftText').text().trim()
				, nameRegEx = /monetary\/(\d+\w)\.htm/
				, title
				, path;


			if(nameRegEx.test(response.req.path)) {
				title = nameRegEx.exec(response.req.path)[1];
			} else {
				console.error("Couldn't find title: " + response.req.path);
			}

			path = "data/fomc/"+title+".txt";

			fs.writeFile(path, content, function(err) {
				if(err) { 
					console.error(err);
				} else {
					console.log("Wrote file "+path);
				}

				completedFomc++;

				if(completedFomc >= links.length) {
					createCorpus("data/fomc/", "data/fomc_corpus.txt");
				}

			});

		});
	});
}



function reqEncyc(error, response, body) {

	if(error) {
		console.log("Request error: "+error);
		return;
	}

	var $ = cheerio.load(body)
		, links = $('a[title="English"]')

	links.each(function(i, link) {
		var url = $(link).attr('href');
		request(url, function reqEncyclDocument(error, response, body) {
			if(error) {
				console.log("Request error: "+error);
				return;
			}

			var $ = cheerio.load(body)
				, content = $('.documento').text().trim()
				, nameRegEx = /(?:documents|[A-z]+\d\d)\/(.+)\.html?/
				, title
				, path;	


			// this covers some of the older ones
			if(!content) {
				content = $('table[dir="ltr"]').text().trim();
			}

			if(nameRegEx.test(response.req.path)) {
				title = nameRegEx.exec(response.req.path)[1];
			} else {
				console.error("Couldn't find title: " + response.req.path);
			}


			path = "data/encyclicals/"+title+".txt";

			fs.writeFile(path, content, function(err) {
				if(err) { 
					console.error(err);
				} else {
					console.log("Wrote file "+path);
				}

				completedEncyc++;

				if(completedEncyc >= links.length) {
					createCorpus("data/encyclicals/", "data/encyclicals_corpus.txt");
				}

			});


		});
	});

}

function createCorpus(dirPath, output) {

	fs.readdir(dirPath, function(err, files) {
		if (err) console.error(err);

		var text = ''
			, i = 0;

		files.forEach(function(file) {
			i++;
			fs.readFile(dirPath+file, function(err, contents) {
				if(err) console.error(err);

				text += contents;

				if(0===--i) {
					fs.writeFile(output, text, function(err) { 
						if(err) console.log(err);

						console.log("Wrote file "+output);	
					});

				}

			});
		})
	})
}

start();