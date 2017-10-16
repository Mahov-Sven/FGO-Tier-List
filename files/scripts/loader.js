class Loader{
	
	static loadIntoPage(id, html){
		document.getElementById(id).insertAdjacentHTML('afterbegin', html);
	}
	
	static loadFile(fileLocation, callback){
		$.get(fileLocation, function(file){
			callback(file);
		});
	}
	
	static loadHTML(fileLocation, callback){
		this.loadFile(fileLocation + htmlExt, function(html){
			callback(html);
		});
	}
}