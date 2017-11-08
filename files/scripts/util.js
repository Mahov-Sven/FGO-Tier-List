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
			return numb1 < numb2 ? -mult : mult;
		}else{
			return str1 < str2 ? -mult : mult;
		}
	}
}

Set.prototype.addAll = function(values){
	for(value of values){
		this.add(value);
	}
}

Set.prototype.setAll = function(values){
	this.clear();
	this.addAll(values);
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
	
	insertFrom(row1, row2){
		const elem = this.matrix[row1];
		this.matrix.splice(row1, 1);
		this.matrix.splice(row2, 0, elem);
	}
	
	swapRow(row1, row2){
		const temp = this.matrix[row1];
		this.matrix[row1] = this.matrix[row2];
		this.matrix[row2] = temp;
	}
	
	sortRows(col, measure){
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
		table.removeClass().addClass(this.appliedClasses.get("tables"));
		
		return table;
	}
	
	_constructHeaderRowElement(){
		const headerRow = $("<tr>");
		headerRow.removeClass().addClass(this.appliedClasses.get("headerRow"));
		
		return headerRow
	}
	
	_constructHeaderCellElement(text, id){
		const headerCell = $("<th>");
		headerCell.text(text);
		headerCell.attr("id", id);
		headerCell.removeClass().addClass(this.appliedClasses.get("headerCells"));
		
		return headerCell;
	}
	
	_constructDataRowElement(isEven){
		const dataRow = $("<tr>");
		if(isEven){
			dataRow.removeClass().addClass(this.appliedClasses.get("dataRowEven"));
		}else{
			dataRow.removeClass().addClass(this.appliedClasses.get("dataRowOdd"));
		}
		
		return dataRow;
	}
	
	_constructDataCell(name, header, data){
		const dataCell = $("<td>");
		dataCell.text(data);
		dataCell.attr("id", `${name}.${header}.${data}`);
		dataCell.removeClass().addClass(this.appliedClasses.get("dataCells"));
		
		return dataCell;
	}
	
	_constructElement(name, dataMatrix){
		
		const tableElement = {
				element: undefined,
				tables: new Set(),
				headerRow: new Set(),
				headerCells: new Set(),
				dataRowOdd: new Set(),
				dataRowEven: new Set(),
				dataCells: new Set()
			}
		
		const table = this._constructTableElement(name);

		/* Header */
		const headerRow = this._constructHeaderRowElement();
		tableElement.headerRow = [headerRow];
		for (const header of dataMatrix.getRow(0)) {
			const headerCell = this._constructHeaderCellElement(header, `${name}.${header}`);
			headerRow.append(headerCell); 
			
			tableElement.headerCells.add(headerCell);
		}
		
		
		table.append(headerRow);

		/* Data */
		for (let row = 1; row < dataMatrix.rows; row++) {
			const dataR = dataMatrix.getRow(row);
			const isEven = (row % 2) === 0;
			const dataRow = this._constructDataRowElement(isEven);
			
			if(isEven) tableElement.dataRowEven.add(dataRow);
			if(!isEven) tableElement.dataRowOdd.add(dataRow);
			
			for (let col = 0; col < dataMatrix.columns; col++) {
				const dataC = dataR[col];
				const header = dataMatrix.get(0, col);
				const dataCell = this._constructDataCell(name, header, dataC);
				
				dataRow.append(dataCell);
				
				tableElement.dataCells.add(dataCell);
			}
			table.append(dataRow);
		}
		
		tableElement.tables.add(table);
		tableElement.element = table;
		
		return tableElement;
	}
	
	_updateTable(){
		const elemArr = $(`#${this.name}`);
		if(elemArr.length === 1) elemArr.replaceWith(this.getElement());
	}
	
	getWidth(){
		return this.getElement();
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
			elem.removeClass().addClass(name);
		});
		this.appliedClasses.set("tables", name);
	}
	
	setHeaderRowClass(name){
		this.table.headerRow.forEach((elem, index, array) => {
			elem.removeClass().addClass(name);
		});
		this.appliedClasses.set("headerRow", name);
	}
	
	setHeaderRowCellClass(name){
		this.table.headerCells.forEach((elem, index, array) => {
			elem.removeClass().addClass(name);
		});
		this.appliedClasses.set("headerCells", name);
	}
	
	setDataRowOddClass(name){
		this.table.dataRowOdd.forEach((elem, index, array) => {
			elem.removeClass().addClass(name);
		});
		
		this.appliedClasses.set("dataRowOdd", name);
	}
	
	setDataRowEvenClass(name){
		this.table.dataRowEven.forEach((elem, index, array) => {
			elem.removeClass().addClass(name);
		});
		this.appliedClasses.set("dataRowEven", name);
	}
	
	setDataRowClass(name){
		this.setDataRowOddClass(name);
		this.setDataRowEvenClass(name);
	}
	
	setDataCellClass(name){
		this.table.dataCells.forEach((elem, index, array) => {
			elem.removeClass().addClass(name);
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
		this.scroll = 0;
		this.appliedClasses.set("macroWrappers", "CLASS_NOT_SET");
		this.appliedClasses.set("tableWrappers", "CLASS_NOT_SET");
		this.currentOrder = [primaryHeader, isAscending];
	}
	
	_initAfter(){
		this._sortTableRows();
	}
	
	_constructHeaderCellElement(text, id){
		const headerCell = super._constructHeaderCellElement(text, id);
		
		const arrowDecorator = $("<div>");
		headerCell.append(arrowDecorator);
		
		headerCell.click((Event) => {
			const header = headerCell.text();
			if(header === this.currentOrder[0]){
				this.currentOrder[1] = !this.currentOrder[1];
			}else{
				this.currentOrder[0] = header;
				this.currentOrder[1] = true;
			}
			this._sortTableRows();
		});
		
		return headerCell;
	}
	
	_constructDataTableWrapperElement(name){
		const dataTableWrapper = $("<div>");
		dataTableWrapper.css("flex", "1 1 auto");
		dataTableWrapper.css("overflow", "auto");
		dataTableWrapper.attr("id", name);
		dataTableWrapper.removeClass().addClass(this.appliedClasses.get("tableWrappers"));
		
		dataTableWrapper.scroll((event, table = this) => {
			table._setScroll(dataTableWrapper.scrollLeft());
		});
		
		return dataTableWrapper;
	}
	
	_constructElement(name, dataMatrix){
		
		const tableElement = {
				element: undefined,
				macroWrappers: new Set(),
				tableWrappers: new Set(),
				tables: new Set(),
				headerRow: new Set(),
				headerCells: new Set(),
				dataRowOdd: new Set(),
				dataRowEven: new Set(),
				dataCells: new Set()
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
		
		tableElement.tables.setAll([...dataTable.tables, ...placeTable.tables]);
		tableElement.headerRow.setAll([...dataTable.headerRow, ...placeTable.headerRow]);
		tableElement.headerCells.setAll([...dataTable.headerCells, ...placeTable.headerCells]);
		tableElement.dataRowOdd.setAll([...dataTable.dataRowOdd, ...placeTable.dataRowOdd]);
		tableElement.dataRowEven.setAll([...dataTable.dataRowEven, ...placeTable.dataRowEven]);
		tableElement.dataCells.setAll([...dataTable.dataCells, ...placeTable.dataCells]);
		
		const dataTableWrapper = this._constructDataTableWrapperElement(`${name}.DataTable.Wrapper`);
		dataTableWrapper.append(dataTable.element);
		tableElement.tableWrappers.add(dataTableWrapper);
		
		const placeTableWrapper = $("<div>");
		placeTableWrapper.css("flex", "0 0 auto");
		placeTableWrapper.append(placeTable.element);
		placeTableWrapper.attr("id", `${name}.PlaceTable.Wrapper`);
		placeTableWrapper.removeClass().addClass(this.appliedClasses.get("tableWrappers"));
		tableElement.tableWrappers.add(placeTableWrapper);
		
		const wrapper = $("<div>");
		wrapper.css("display", "inline-flex");
		wrapper.append(placeTableWrapper);
		wrapper.append(dataTableWrapper);
		wrapper.attr("id", `${name}`);
		wrapper.removeClass().addClass(this.appliedClasses.get("macroWrappers"));
		tableElement.element = wrapper;
		tableElement.macroWrappers.add(wrapper);
		
		return tableElement;
	}
	
	_sortTableRows(){
		const keyword = this.currentOrder[0] === undefined ? this.dataMatrix.get(0, 0) : this.currentOrder[0];
		const col = this.dataMatrix.findInRow(0, keyword);
		
		const table = $(`#${this.name}\\.DataTable.Table`);
		
		const width = this.dataMatrix.rows;
		let index = 1;
		for(let row = 1; row < width; row++){
			const elemStr = this.dataMatrix.get(row, col).toString().toLowerCase();
			
			let s = 1;
			let e = row;
			while(s !== e){
				const m = Math.floor((s + e) / 2);
				const mElem = this.dataMatrix.get(m, col).toString().toLowerCase();
				const order = Util.orderStrings(elemStr, mElem, this.currentOrder[1])
				if(order < 0){
					e = m;
				}else{
					s = m + 1;
				}
			}
			const elem = table.children().eq(row);
			const target = table.children().eq(s - 1);
			elem.insertAfter(target);
			this.dataMatrix.insertFrom(row, s);
		}
		
		for(let row = 1; row < width; row++){
			const elem = table.children().eq(row);
			if(row % 2 == 0){
				this.table.dataRowOdd.delete(elem);
				this.table.dataRowEven.add(elem);
				elem.removeClass().addClass(this.appliedClasses.get("dataRowEven"));
			}else{
				this.table.dataRowEven.delete(elem);
				this.table.dataRowOdd.add(elem);
				elem.removeClass().addClass(this.appliedClasses.get("dataRowOdd"));
			}
		}
	}
	
	_updateTable(){
		const elemArr = $(`#${this.name}`);
		if(elemArr.length === 1) elemArr.replaceWith(this.getElement());
	}
	
	_setScroll(scroll){
		this.scroll = scroll;
	}
	
	setTableWrapperClass(name){
		this.table.tableWrappers.forEach((elem, index, array) => {
			elem.removeClass().addClass(name);
		});
		
		this.appliedClasses.set("tableWrappers", name);
	}
	
	setMacroWrapperClass(name){
		this.table.macroWrappers.forEach((elem, index, array) => {
			elem.removeClass().addClass(name);
		});
		
		this.appliedClasses.set("macroWrappers", name);
	}
}