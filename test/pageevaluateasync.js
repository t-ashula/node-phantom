var http=require('http');
var phantom=require('../node-phantom');
var assert=require('assert');

var server=http.createServer(function(request,response){
	response.writeHead(200,{"Content-Type": "text/html"});
	response.end('<html><head></head><body><h1>Hello World</h1></body></html>');
}).listen();

describe('Phantom Page',function(){
	this.timeout(5000);
	it('should be able to evaluate async',function(done){
		phantom.create(function(error,ph){
			assert.ifError(error);
			ph.createPage(function(err,page){
				assert.ifError(err);
	            page.onCallback = function(result){
	                assert.equal(result,'Hello World');
	                server.close();
	                ph.exit();
					done();
	            };
				page.open('http://localhost:'+server.address().port,function(err,status){
					assert.ifError(err);
					assert.equal(status,'success');
					page.evaluateAsync(function(){
	                    window.callPhantom(document.getElementsByTagName('h1')[0].innerText);
					});
				});
			});
	    });
	});
});