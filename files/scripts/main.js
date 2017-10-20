function globals() {
}
globals.banners = 2;
globals.servants = 2;

const servants = [];
const measures = new Set();
const searchMap = new Map();

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
            headerCellClass, DataRowOddClass, DataRowEvenClass, DataCellClass);
            
    const wrapper = $("<div>");
    wrapper.css("position", "absolute");
    
    const sideTable = $("<table>");
    sideTable.addClass(tableClass);
    
    for(let r = 0; r <= data.length; r++){
        let cell = undefined;
        const row = $("<tr>");
        
        if(r === 0){
            row.addClass(headerRowClass);
            
            const img = $("<img>");
            img.attr("src", "files/images/search.png");
            img.addClass("HeaderSearchImg");
            cell = $("<th>");
            cell.addClass(headerCellClass);
            cell.append(img);
        }else{
            row.addClass(DataRowOddClass);
            
            cell = $("<td>");
            cell.text(r);
            cell.addClass(DataCellClass);
        }
        row.append(cell);
        sideTable.append(row);
    }
    
    wrapper.append(sideTable);
    wrapper.append(table);
    
    return wrapper;
}

function statsOption(){
    const tableName = "StatsTable";
    const table = createOrderedTable(tableName, measures, servants, "Table", 
            "HeaderRow", "HeaderCell", "DataRowOdd", "DataRowEven", "DataCell");
    searchMap.clear();
    for(const measure of measures){
        searchMap.set(measure, `${tableName}.${measure}`);
    }
    for(const servant of servants){
        const value = servant["Name"];
        searchMap.set(value.toString(), `${tableName}.Name.${value}`);
    }
    $("#CONTENT_SPACE").append(table);
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