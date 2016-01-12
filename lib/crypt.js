"use strict";
var crypto = require('crypto');

class crypt{

	static encrypt(str, secret) {
		var cipher = crypto.createCipher('aes192', secret);
		var enc = cipher.update(str, 'utf8', 'hex');
		enc += cipher.final('hex');
		return enc;
	}

	static decrypt(str, secret) {
		var decipher = crypto.createDecipher('aes192', secret);
		var dec = decipher.update(str, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	}

	static base64encode(str, urlsafe) {
		if(!Buffer.isBuffer(str)) {
	    	str = new Buffer(str);
	  	}
	  	var encode = str.toString('base64');
	  	if(urlsafe){
	    	encode = encode.replace(/\+/g, '-').replace(/\//g, '_');
	  	}
	  	return encode;
	}


	static base64decode(encodeStr, urlsafe, encoding) {
		if(urlsafe){
	    	encodeStr = encodeStr.replace(/\-/g, '+').replace(/_/g, '/');
	  	}
	  	var buf = new Buffer(encodeStr, 'base64');
	  	if (encoding === 'buffer') {
	    	return buf;
	  	}
	  	return buf.toString(encoding || 'utf8');
	}

	static md5(str){
		var md5sum = crypto.createHash('md5');
		md5sum.update(str);
		str = md5sum.digest('hex');
		return str;
	}
}

module.exports = crypt;