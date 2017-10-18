function globals(){}
globals.banners = 2;
globals.servants = 1;

const servants = [];
const measures = new Set();

function setBanner(bannerID){
	document.body.style.backgroundImage = "url(files/images/banners/banner" + bannerID + ".png)";
	document.body.style.backgroundRepeat = "no-repeat";
	document.body.style.backgroundAttachment = "fixed";
	document.body.style.backgroundPosition = "center";
	document.body.style.backgroundSize = "cover"
}

function handleOptionClick(e){
	$(".Option").removeClass("OptionActive");
	$(this).addClass("OptionActive");
	
	const id = $(this).attr("id");
	
	switch(id){
	case "STATS":
		clearContentSpace();
		generateStatsTable();
		break;
	}
}

function clearContentSpace(){
	$("#CONTENT_SPACE").empty();
}

function generateStatsTable(){
	const tableBase = $("<table>");
	const div = $("<div>");
	div.attr("background-color", "black");
	div.attr("height", "10px");
	div.attr("width", "10px");
	$("#CONTENT_SPACE").append(div);
}

$(document).ready(() => {
	setBanner(randomInt(1, globals.banners));
	
	$(".Option").click(handleOptionClick);
	
	for(let id = 1; id <= globals.servants; id++){
		Loader.loadServantFile(id, (servant) => {
			servants.push(servant);
			for(const measure in servant){
				measures.add(measure);
			}
		});
	}
	console.log(servants);
	console.log(measures);
});
