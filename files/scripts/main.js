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

function createOrderedTable(tableName, headers, data, tableClass, headerRowClass, 
        headerCellClass, DataRowOddClass, DataRowEvenClass, DataCellClass){
    
    const table = Util.createTable(tableName, headers, data, tableClass, headerRowClass,
            headerCellClass, DataRowOddClass, DataRowEvenClass, DataCellClass)
    
    const wrapper = $("<div>");
    const rows = table.find("tr");
    for(let r = 0; r < rows.length; r++){
        const row = rows[r];
        let cell = undefined;
        if(r === 0){
            const img = $("<img>");
            img.attr("src", "files/images/search.png");
            img.addClass("HeaderSearchImg");
            cell = $("<th>");
            cell.addClass(headerCellClass);
            cell.append(img);
        }else{
            cell = $("<td>");
            cell.text(r);
            cell.addClass(DataCellClass);
        }
        row.prepend(cell[0]);
    }
    
    return table;
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
		const table = createOrderedTable("STATS_TABLE", measures, servants, "Table", 
		        "HeaderRow", "HeaderCell", "DataRowOdd", "DataRowEven", "DataCell");
		
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