function globals() {
}
globals.banners = 2;
globals.servants = 2;

const servants = [];
const measures = new Set();

function setBanner(bannerID) {
	document.body.style.backgroundImage = "url(files/images/banners/banner" + bannerID + ".png)";
	document.body.style.backgroundRepeat = "no-repeat";
	document.body.style.backgroundAttachment = "fixed";
	document.body.style.backgroundPosition = "center";
	document.body.style.backgroundSize = "cover"
}

function orderServantsBy(servants, measure, measures){
	
}

function createSearchWidget(table){
	
}

function createTableHeaderWidget(table, name){
	
}

function handleOptionClick(e) {
	$(".Option").removeClass("OptionActive");
	$(this).addClass("OptionActive");

	const id = $(this).attr("id");
	$("#CONTENT_SPACE").empty();
	switch (id) {
	case "JP":
		break;
	case "US":
		break;
	case "SORT_BY":
		break;
	case "STATS":
		const table = Util.createOrderedTable("STATS_TABLE", measures, servants, undefined, "Table", createSearchWidget, 
				createTableHeaderWidget, "HeaderRow", "HeaderCell", "DataRowOdd", 
				"DataRowEven", "DataCell");
		
		$("#CONTENT_SPACE").append(table);
		break;
	}
}

$(document).ready(() => {
	setBanner(Util.randomInt(1, globals.banners));

	$(".Option").click(handleOptionClick);

	for (let id = 1; id <= globals.servants; id++) {
		Loader.loadServantFile(id, (servant) => {
			servants.push(servant);
			for (const measure in servant) {
				measures.add(measure);
			}
		});
	}
});