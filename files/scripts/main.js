function globals() {
}
globals.banners = 2;
globals.servants = 1;

const servants = [];
const measures = new Set();

function setBanner(bannerID) {
	document.body.style.backgroundImage = "url(files/images/banners/banner" + bannerID + ".png)";
	document.body.style.backgroundRepeat = "no-repeat";
	document.body.style.backgroundAttachment = "fixed";
	document.body.style.backgroundPosition = "center";
	document.body.style.backgroundSize = "cover"
}

function handleOptionClick(e) {
	$(".Option").removeClass("OptionActive");
	$(this).addClass("OptionActive");

	const id = $(this).attr("id");

	switch (id) {
	case "STATS":
		clearContentSpace();
		generateStatsTable();
		break;
	}
}

function clearContentSpace() {
	$("#CONTENT_SPACE").empty();
}

function generateStatsTable() {
	const table = Util.createTable(measures, servants, "Table", "HeaderRow");
	$("#CONTENT_SPACE").append(table);
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