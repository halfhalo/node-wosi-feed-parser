var request=require("request");
var _=require("underscore")
var lib=function(url){
	this.url={"url":url,"arch":null,"version":null}
	this.arch=[];
	this.versions=[];
	this.packages=[];
	this.raw="";
}
lib.prototype.parse=function(callback)
{
	if(this.raw.length>0)
	{
		var ia=[];
		var items=this.raw.split("\n\n");
		_.each(items,function(item){
			if(item.length>5)
			{
				var obj={};
				var lines=item.split("\n");
				_.each(lines,function(line){
					if(line.length>3)
					{
						var tmp=line.match(/([^:]*): (.*)/)
						try{
							obj[tmp[1]]=JSON.parse(tmp[2])
						}catch(e)
						{
							obj[tmp[1]]=tmp[2]
						}
					}
				})
				ia.push(obj)
			}
		})
		this.packages=ia
		callback(null,ia)
	}
	else
	{
		callback(new Error("No Feed Data"))
	}
}
lib.prototype.get=function(callback)
{
	var self=this;
	request(this.url.url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	   	self.raw=body
			callback(null,body)
	  }
	else
	{
		callback(error)
	}
	})
}
lib.prototype.matches=function(package,params,callback)
{
	var self=this;
	var matches=true;
	var hasStarted=false;
	_.each(params,function(val,key){
		if(typeof val=="string")
		{
			if(package[key]==val)
			{
				if(!hasStarted)
				{
					hasStarted=true;
				}
				else
				{
				}
			}
			else
			{
				if(!hasStarted)
				{
					hasStarted=true;
					matches=false;
				}
				else
				{
					matches=false
				}
			}
		}
		else if(typeof val=="object")
		{
			if(typeof package[key]=="object")
			{
				if(self.matches(package[key],val))
				{
					if(!hasStarted)
						hasStarted=true;
					else
					{
					}
				}
				else
				{
					if(!hasStarted)
					{
						hasStarted=true;
						matches=false;
					}
					else
					{
						matches=false;
					}
				}
			}
			else
			{

			}
		}
	})
	if(hasStarted)
		return matches;
	else
		return false;
}
lib.prototype.find=function(params,callback)
{
	var matching=[];
	var self=this;
	if(this.packages.length>0)
	{
		_.each(this.packages,function(package){
			if(self.matches(package,params))
			{
				matching.push(package)
			}
		})
		callback(null,matching)
	}
	else
	{
		callback(new Error("No Feed Data"))
	}
}
module.exports=lib;