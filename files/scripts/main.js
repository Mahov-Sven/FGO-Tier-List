function globals() {
}
globals.banners = 0;
globals.servants = 3;

const servants = [];
const measures = new Set();
const searchMap = new Map();

function setBanner(bannerID) {
	document.body.style.backgroundImage = `url(files/images/banners/banner${bannerID}.png)`;
	document.body.style.backgroundRepeat = "no-repeat";
	document.body.style.backgroundAttachment = "fixed";
	document.body.style.backgroundPosition = "center";
	document.body.style.backgroundSize = "cover"
}

function statsOption(){
    const tableName = "StatsTable";
    const table = new OrderedTable(tableName, measures, servants);
    
    table.setMacroWrapperClass("MacroWrapper");
    table.setTableWrapperClass("TableWrapper");
    table.setTableClass("Table");
    table.setHeaderRowClass("HeaderRow");
    table.setHeaderRowCellClass("HeaderCell");
    table.setDataRowOddClass("DataRowOdd");
    table.setDataRowEvenClass("DataRowEven");
    table.setDataCellClass("DataCell");
    
    $("#CONTENT_SPACE").append(table.getElement());
    
    searchMap.clear();
    for(const measure of measures){
        searchMap.set(measure, `${tableName}.${measure}`);
    }
    for(const servant of servants){
        const value = servant["Name"];
        searchMap.set(value.toString(), `${tableName}.Name.${value}`);
    }
    console.log(searchMap);
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
	    statsOption();
		break;
	}
}

$(document).ready(() => {
	if(globals.banners > 0) setBanner(Util.randomInt(1, globals.banners));

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