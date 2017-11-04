class Util {

    /**
	 * Returns a random integer between the minimum and maximum, inclusive. The
	 * default minimum is zero, maximum must be provided.
	 * 
	 * @param {number}
	 *            min - The minimum value. Default 0.
	 * @param {number}
	 *            max - The maximum value.
	 * 
	 * @return {number} A random integer between min and max
	 */
	static randomInt(min = 0, max) {
		return Math.round(Math.random() * (max - min)) + min;
	}
	
	static orderStrings(str1, str2, isAscending){
		const mult = isAscending ? 1 : -1;
		const numb1 = +str1;
		const numb2 = +str2;
		if(!isNaN(numb1) && !isNaN(numb2)){
			return str1 <= str2 ? mult : -mult;
		}else{
			return str1 <= str2 ? -mult : mult;
		}
	}
}


class DataMatrix {

	constructor(rows, columns){
		this.matrix = [];
		this.rows = rows;
		this.columns = columns;
		
		for(let r = 0; r < this.rows; r++){
			this.matrix[r] = [];
			for(let c = 0; c < this.columns; c++){
				this.matrix[r][c] = undefined;
			}
		}
	}
	
	sortByCol(col, measure){
		this.matrix.sort((a, b) => {
			return measure(a[col] , b[col]);
		});
	}
	
	findInRow(row, keyword){
		for(let col = 0; col < this.columns; col++){
			if(this.matrix[row][col] === keyword) return col;
		}
		return undefined;
	}
	
	findInCol(col, keyword){
		for(let row = 0; row < this.rows; row++){
			if(this.matrix[row][col] === keyword) return row;
		}
		return undefined;
	}
	
	find(keyword){
		for(let row = 0; row < this.rows; row++){
			const col = this.findInRow(row, keyword);
			if(col !== undefined) return [row, col];
		}
		return undefined;
	}
	
	get(row, column){
		return this.matrix[row][column];
	}
	
	getRow(row){
		const result = [];
		for(let column = 0; column < this.columns; column++){
			result.push(this.matrix[row][column]);
		}
		return result;
	}
	
	getRows(rowStart, rowEnd){
		const rmo = this.rows - 1;
		rowEnd = rowEnd === undefined ? rmo : (rowEnd > rmo ? rmo : rowEnd);
		
		const result = [];
		for(let row = rowStart; row <= rowEnd; row++){
			result.push(this.getRow(row));
		}
		return result;
	}
	
	getCol(column){
		const result = [];
		for(let row = 0; row < this.rows; row++){
			result.push(this.matrix[row][column]);
		}
		return result;
	}
	
	set(row, column, object){
		this.matrix[row][column] = object;
	}
	
	setRow(row, objects){
		let column = 0;
		for(const object of objects){
			if(column >= this.columns) break;
			this.matrix[row][column] = object;
			column++;
		}
	}
	
	setCol(column, objects){
		let row = 0;
		for(const object of objects){
			if(row >= this.rows) break;
			this.matrix[row][column] = object;
			row++;
		}
	}
}

class Table {

	constructor(name, headers, dataArray) {
		this._initBefore(...arguments);
		this._initConstruction(...arguments);
		this._initAfter(...arguments);
	}
	
	_initBefore(name, headers, dataArray){
		this.name = name;
		this.dataMatrix = new DataMatrix([...dataArray].length + 1, [...headers].length);
		this._setHeaders(headers);
		this._setDataArray(dataArray);
		this.table = {};
		this.appliedClasses = new Map();
		this.appliedClasses.set("tables", "CLASS_NOT_SET");
		this.appliedClasses.set("headerRow", "CLASS_NOT_SET");
		this.appliedClasses.set("headerCells", "CLASS_NOT_SET");
		this.appliedClasses.set("dataRowOdd", "CLASS_NOT_SET");
		this.appliedClasses.set("dataRowEven", "CLASS_NOT_SET");
		this.appliedClasses.set("dataCells", "CLASS_NOT_SET");
	}
	
	_initConstruction(){
		this.table = this._constructElement(this.name, this.dataMatrix);
	}
	
	_initAfter(){
		
	}
	
	reconstruct(){
		this.table = this._constructElement(this.name, this.dataMatrix);
		this._updateTable();
	}
	
	_constructTableElement(name){
		const table = $("<table>");
		table.attr("id", `${name}`);
		table.addClass(this.appliedClasses.get("tables"));
		
		return table;
	}
	
	_constructHeaderRowElement(){
		const headerRow = $("<tr>");
		headerRow.addClass(this.appliedClasses.get("headerRow"));
		
		return headerRow
	}
	
	_constructHeaderCellElement(text, id){
		const headerCell = $("<th>");
		headerCell.text(text);
		headerCell.attr("id", id);
		headerCell.addClass(this.appliedClasses.get("headerCells"));
		
		return headerCell;
	}
	
	_constructDataRowElement(isEven){
		const dataRow = $("<tr>");
		if(isEven){
			dataRow.addClass(this.appliedClasses.get("dataRowEven"));
		}else{
			dataRow.addClass(this.appliedClasses.get("dataRowOdd"));
		}
		
		return dataRow;
	}
	
	_constructDataCell(name, header, data){
		const dataCell = $("<td>");
		dataCell.text(data);
		dataCell.attr("id", `${name}.${header}.${data}`);
		dataCell.addClass(this.appliedClasses.get("dataCells"));
		
		return dataCell;
	}
	
	_constructElement(name, dataMatrix){
		
		const tableElement = {
				element: undefined,
				tables: [],
				headerRow: [],
				headerCells: [],
				dataRowOdd: [],
				dataRowEven: [],
				dataCells: []
			}
		
		const table = this._constructTableElement(name);

		/* Header */
		const headerRow = this._constructHeaderRowElement();
		tableElement.headerRow = [headerRow];
		for (const header of dataMatrix.getRow(0)) {
			const headerCell = this._constructHeaderCellElement(header, `${name}.${header}`);
			headerRow.append(headerCell); 
			
			tableElement.headerCells.push(headerCell);
		}
		
		
		table.append(headerRow);

		/* Data */
		for (let row = 1; row < dataMatrix.rows; row++) {
			const dataR = dataMatrix.getRow(row);
			const isEven = (row % 2) === 0;
			const dataRow = this._constructDataRowElement(isEven);
			
			if(isEven) tableElement.dataRowEven.push(dataRow);
			if(!isEven) tableElement.dataRowOdd.push(dataRow);
			
			for (let col = 0; col < dataMatrix.columns; col++) {
				const dataC = dataR[col];
				const header = dataMatrix.get(0, col);
				const dataCell = this._constructDataCell(name, header, dataC);
				
				dataRow.append(dataCell);
				
				tableElement.dataCells.push(dataCell);
			}
			table.append(dataRow);
		}
		
		tableElement.tables.push(table);
		tableElement.element = table;
		
		return tableElement;
	}
	
	_updateTable(){
		const elemArr = $(`#${this.name}`);
		if(elemArr.length === 1) elemArr.replaceWith(this.getElement());
	}
	
	_setHeaders(headers){
		this.dataMatrix.setRow(0, headers);
	}
	
	setHeaders(headers){
		this._setHeaders(headers);
		this.table = this._constructElement(this.name, this.dataMatrix);
		this._updateTable();
	}
	
	
	_setDataArray(dataArray){
		for(let col = 0; col < this.dataMatrix.columns; col++){
			const header = this.dataMatrix.get(0, col);
			for(let row = 1; row < this.dataMatrix.rows; row++){
				this.dataMatrix.set(row, col, dataArray[row - 1][header]);
			}
		}
	}
	
	setDataArray(dataArray){
		this._setDataArray(dataArray);
		this.table = this._constructElement(this.name, this.dataMatrix);
		this._updateTable();
	}
	
	setTableClass(name){
		this.table.tables.forEach((elem, index, array) => {
			elem.addClass(name);
		});
		this.appliedClasses.set("tables", name);
	}
	
	setHeaderRowClass(name){
		this.table.headerRow.forEach((elem, index, array) => {
			elem.addClass(name);
		});
		this.appliedClasses.set("headerRow", name);
	}
	
	setHeaderRowCellClass(name){
		this.table.headerCells.forEach((elem, index, array) => {
			elem.addClass(name);
		});
		this.appliedClasses.set("headerCells", name);
	}
	
	setDataRowOddClass(name){
		this.table.dataRowOdd.forEach((elem, index, array) => {
			elem.addClass(name);
		});
		
		this.appliedClasses.set("dataRowOdd", name);
	}
	
	setDataRowEvenClass(name){
		this.table.dataRowEven.forEach((elem, index, array) => {
			elem.addClass(name);
		});
		this.appliedClasses.set("dataRowEven", name);
	}
	
	setDataRowClass(name){
		this.setDataRowOddClass(name);
		this.setDataRowEvenClass(name);
	}
	
	setDataCellClass(name){
		this.table.dataCells.forEach((elem, index, array) => {
			elem.addClass(name);
		});
		this.appliedClasses.set("dataCells", name);
	}
	
	getElement(){
		return this.table.element[0];
	}
}

class OrderedTable extends Table{
	
	constructor(name, headers, dataArray, primaryHeader = undefined, isAscending = true) {
		super(name, headers, dataArray, primaryHeader, isAscending);
	}
	
	_initBefore(name, headers, dataArray, primaryHeader, isAscending){
		super._initBefore(name, headers, dataArray);
		this.appliedClasses.set("macroWrappers", "CLASS_NOT_SET");
		this.appliedClasses.set("tableWrappers", "CLASS_NOT_SET");
		this.currentOrder = [primaryHeader, isAscending];
		this._sortTableRows();
	}
	
	reconstruct(){
		/// GET THE SCROLL WORKING HERE
		const scroll = $(`#${this.name}.DataTableWrapper`).offset();
		this.table = this._constructElement(this.name, this.dataMatrix);
		this.table.element.find(`#${this.name}.DataTableWrapper`).scrollLeft(scroll);
		this._updateTable();
	}
	
	_constructHeaderCellElement(text, id){
		const headerCell = super._constructHeaderCellElement(text, id);
		
		headerCell.click((Event) => {
			const header = headerCell.text();
			if(header === this.currentOrder[0]){
				this.currentOrder[1] ^= true;
			}else{
				this.currentOrder[0] = header;
				this.currentOrder[1] = true;
			}
			this._sortTableRows();
			this.reconstruct();
		});
		
		return headerCell;
	}
	
	_constructElement(name, dataMatrix){
		
		const tableElement = {
				element: undefined,
				macroWrappers: [],
				tableWrappers: [],
				tables: [],
				headerRow: [],
				headerCells: [],
				dataRowOdd: [],
				dataRowEven: [],
				dataCells: []
			}
		
		const dataTable = super._constructElement(`${name}.DataTable`, dataMatrix);
		
		const PlaceHeader = "-";
		const column = [];
		column[0] = "-";
		for(let i = 1; i < dataMatrix.rows; i++){
			column[i] = i;
		}
		const placeMatrix = new DataMatrix(dataMatrix.rows, 1);
		placeMatrix.setCol(0, column);
		
		const placeTable = super._constructElement(`${name}.PlaceTable`, placeMatrix);
		
		tableElement.tables = [...dataTable.tables, ...placeTable.tables];
		tableElement.headerRow = [...dataTable.headerRow, ...placeTable.headerRow];
		tableElement.headerCells = [...dataTable.headerCells, ...placeTable.headerCells];
		tableElement.dataRowOdd = [...dataTable.dataRowOdd, ...placeTable.dataRowOdd];
		tableElement.dataRowEven = [...dataTable.dataRowEven, ...placeTable.dataRowEven];
		tableElement.dataCells = [...dataTable.dataCells, ...placeTable.dataCells];
		
		const dataTableWrapper = $("<div>");
		dataTableWrapper.css("flex", "1 1 auto");
		dataTableWrapper.css("overflow", "auto");
		dataTableWrapper.append(dataTable.element);
		dataTableWrapper.attr("id", `${name}.DataTableWrapper`);
		dataTableWrapper.addClass(this.appliedClasses.get("tableWrappers"));
		tableElement.tableWrappers.push(dataTableWrapper);
		
		const placeTableWrapper = $("<div>");
		placeTableWrapper.css("flex", "0 0 auto");
		placeTableWrapper.append(placeTable.element);
		placeTableWrapper.attr("id", `${name}.PlaceTableWrapper`);
		placeTableWrapper.addClass(this.appliedClasses.get("tableWrappers"));
		tableElement.tableWrappers.push(placeTableWrapper);
		
		const wrapper = $("<div>");
		wrapper.css("display", "inline-flex");
		wrapper.append(placeTableWrapper);
		wrapper.append(dataTableWrapper);
		wrapper.attr("id", `${name}`);
		wrapper.addClass(this.appliedClasses.get("macroWrappers"));
		tableElement.element = wrapper;
		tableElement.macroWrappers.push(wrapper);
		
		return tableElement;
	}
	
	_sortTableRows(){
		const keyword = this.currentOrder[0] === undefined ? this.dataMatrix.get(0, 0) : this.currentOrder[0];
		const col = this.dataMatrix.findInRow(0, keyword);
		this.dataMatrix.sortByCol(col, (a, b) => {
			if(a === keyword) return -Infinity;
			const aStr = a.toString().toLowerCase();
			const bStr = b.toString().toLowerCase();
			return Util.orderStrings(aStr, bStr, this.currentOrder[1]);
		});
	}
	
	_updateTable(){
		const elemArr = $(`#${this.name}`);
		if(elemArr.length === 1) elemArr.replaceWith(this.getElement());
	}
	
	setTableWrapperClass(name){
		this.table.tableWrappers.forEach((elem, index, array) => {
			elem.addClass(name);
		});
		
		this.appliedClasses.set("tableWrappers", name);
	}
	
	setMacroWrapperClass(name){
		this.table.macroWrappers.forEach((elem, index, array) => {
			elem.addClass(name);
		});
		
		this.appliedClasses.set("macroWrappers", name);
	}
}