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
		this.loadFile(`${fileLocation}.html`, function(html){
			callback(html);
		});
	}
	
	static loadServantFile(id, callback){
		this.loadFile(`files/servants/servant${id}.svt`, (file) => {
			const content = file.replace(/\t+/g, "");
			const lines = content.split("\n");
			
			const servant = {};
			for(const line of lines){
				const parts = line.split(":");
				const property = parts[0];
				const value = parts[1];
				const valueIsEmpty = (value.replace(/\s/g, "") === "");
				const numValue = +value;
				if(isNaN(numValue) || valueIsEmpty){
					// Value is a string
					servant[property] = value;
				}else{
					servant[property] = numValue;
				}
			}
			
			callback(servant);
		})
	}
}