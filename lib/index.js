var feed=require("./feed");
var lib={};
lib.new=function(url,callback)
{
	var tmpfeed=new feed(url);
	callback(null,tmpfeed);
}
lib.add=function(url,callback){}

module.exports=lib;