function globals() {
}
globals.banners = 2;
globals.servants = 2;

const servants = [];
const measures = new Set();
const searchMap = new Map();

const x = new DataMatrix(5, 4);
console.log(x);

const y = new Table("Test", ["row 0", "row 1"], [{"row 0": "00", "row 1": "10"}, {"row 0": "01", "row 1": "11"} ]);
console.log(y);

function setBanner(bannerID) {
	document.body.style.backgroundImage = "url(files/images/banners/banner" + bannerID + ".png)";
	document.body.style.backgroundRepeat = "no-repeat";
	document.body.style.backgroundAttachment = "fixed";
	document.body.style.backgroundPosition = "center";
	document.body.style.backgroundSize = "cover"
}

function statsOption(){
    const tableName = "StatsTable";
//    const table = createOrderedTable(tableName, measures, servants, "Table", 
//            "HeaderRow", "HeaderCell", "DataRowOdd", "DataRowEven", "DataCell");
    const table = new Table(tableName, measures, servants);
    
    table.setTableClass("Table");
    table.setHeaderRowClass("HeaderRow");
    table.setHeaderRowCellClass("HeaderCell");
    table.setDataRowOddClass("DataRowOdd");
    table.setDataRowEvenClass("DataRowEven");
    table.setDataCellClass("DataCell");
    
    const wrapper = $("<div>");
    wrapper.addClass("TableWrapper");
    wrapper.append(table.getElement());
    
    $("#CONTENT_SPACE").append(wrapper);
    
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