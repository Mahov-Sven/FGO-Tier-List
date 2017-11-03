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

	static createTable(tableName, headers, dataRows, tableClass = undefined, headerRowClass = undefined, 
	        headerCellClass = undefined, dataRowOddClass = undefined, dataRowEvenClass = undefined, 
	        dataCellClass = undefined) {
	    
		const table = $("<table>");
		if (tableClass !== undefined) table.addClass(tableClass);

		/* Header */
		const headerRow = $("<tr>");
		if (headerRowClass !== undefined) headerRow.addClass(headerRowClass);
		for (const header of headers) {
			const headerCell = $("<th>");
			if (headerCellClass !== undefined) headerCell.addClass(headerCellClass);

			headerCell.text(header);
			headerCell.attr("id", `${tableName}.${header}`);
			headerRow.append(headerCell); }
		table.append(headerRow);

		/* Data */
		let row = 1;
		for (const data of dataRows) {
			const dataRow = $("<tr>");
			if (row % 2 === 1 && dataRowOddClass !== undefined) dataRow.addClass(dataRowOddClass);
			if (row % 2 === 0 && dataRowEvenClass !== undefined) dataRow.addClass(dataRowEvenClass);

			for (const header of headers) {
				const dataCell = $("<td>");
				if (dataCellClass !== undefined) dataCell.addClass(dataCellClass);
				
				dataCell.text(data[header]);
				dataCell.attr("id", `${tableName}.${header}.${data[header]}`);
				dataRow.append(dataCell);
			}
			table.append(dataRow);
			row++;
		}

		return table;
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
	
	sortByCol(measure){
		this.matrix.sort(measure);
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
		this._initTable(name, headers, dataArray);
	}
	
	_initTable(name, headers, dataArray){
		this.name = name;
		this.dataMatrix = new DataMatrix([...dataArray].length + 1, [...headers].length);
		
		this._setHeaders(headers);
		this._setDataArray(dataArray);
		this.table = this._constructTableElement(this.name, this.dataMatrix);
		this._updateTable();
	}
	
	_constructHeaderCellElement(text, id){
		const headerCell = $("<th>");
		headerCell.text(text);
		headerCell.attr("id", id);
		return headerCell;
	}
	
	_constructTableElement(name, dataMatrix){
		
		const tableElement = {
				element: undefined,
				tables: [],
				headerRow: [],
				headerCells: [],
				dataRowOdd: [],
				dataRowEven: [],
				dataCells: []
			}
		
		const table = $("<table>");
		table.attr("id", `${name}`);

		/* Header */
		const headerRow = $("<tr>");
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
			const dataRow = $("<tr>");
			
			if(row % 2 == 0) tableElement.dataRowEven.push(dataRow);
			if(row % 2 == 1) tableElement.dataRowOdd.push(dataRow);
			
			for (let col = 0; col < dataMatrix.columns; col++) {
				const dataC = dataR[col];
				const header = dataMatrix.get(0, col);
				const dataCell = $("<td>");
				
				dataCell.text(dataC);
				dataCell.attr("id", `${name}.${header}.${dataC}`);
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
		this.table = this._constructTableElement(this.name, this.dataMatrix);
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
		this.table = this._constructTableElement(this.name, this.dataMatrix);
		this._updateTable();
	}
	
	setTableClass(name){
		this.table.tables.forEach((elem, index, array) => {
			elem.addClass(name);
		});
	}
	
	setHeaderRowClass(name){
		this.table.headerRow.forEach((elem, index, array) => {
			elem.addClass(name);
		});
	}
	
	setHeaderRowCellClass(name){
		this.table.headerCells.forEach((elem, index, array) => {
			elem.addClass(name);
		});
	}
	
	setDataRowOddClass(name){
		this.table.dataRowOdd.forEach((elem, index, array) => {
			elem.addClass(name);
		});
	}
	
	setDataRowEvenClass(name){
		this.table.dataRowEven.forEach((elem, index, array) => {
			elem.addClass(name);
		});
	}
	
	setDataRowClass(name){
		this.setDataRowOddClass(name);
		this.setDataRowEvenClass(name);
	}
	
	setDataCellClass(name){
		this.table.dataCells.forEach((elem, index, array) => {
			elem.addClass(name);
		});
	}
	
	getElement(){
		return this.table.element[0];
	}
}

class OrderedTable extends Table{
	
	constructor(name, headers, dataArray, primaryHeader, isAscending = true) {
		super(name, headers, dataArray);
		
		
	}
	
	_constructHeaderCellElement(text, id){
		const headerCell = super._constructHeaderCellElement(text, id);
		
		headerCell.click((Event) => {
			
		});
		
		return headerCell;
	}
	
	_constructTableElement(name, dataMatrix){
		
		const dataTable = super._constructTableElement(`DataTable.${name}`, dataMatrix);
		
		const PlaceHeader = "-";
		const column = [];
		column[0] = "-";
		for(let i = 1; i < dataMatrix.rows; i++){
			column[i] = i;
		}
		const placeMatrix = new DataMatrix(dataMatrix.rows, 1);
		placeMatrix.setCol(0, column);
		
		const placeTable = super._constructTableElement(`PlaceTable.${name}`, placeMatrix);
		
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
		tableElement.tableWrappers.push(dataTableWrapper);
		
		const placeTableWrapper = $("<div>");
		placeTableWrapper.css("flex", "0 0 auto");
		placeTableWrapper.append(placeTable.element);
		tableElement.tableWrappers.push(placeTableWrapper);
		
		const wrapper = $("<div>");
		wrapper.css("display", "inline-flex");
		wrapper.append(placeTableWrapper);
		wrapper.append(dataTableWrapper);
		wrapper.attr("id", `${name}`);
		tableElement.element = wrapper;
		tableElement.macroWrappers.push(wrapper);
		
		return tableElement;
	}
	
	_sortTableRows(primaryHeader, isAscending){
		const row = 0;
		this.dataMatrix.sortByCol((a, b) => {
			const result = -Infinity;
			if(row !== 0){
				const aStr = a.toString().toLowerCase();
				const bStr = b.toString().toLowerCase();
				
				const char = 0;
				while(true){
					const aChar = aStr.charCodeAt(char);
					const bChar = bStr.charCodeAt(char);
					
					if(aChar < bChar){
						result = -1;
						break;
					}
					if(aChar > bChar){
						result = 1;
						break;
					}
					if(aChar === undefined && bChar === undefined){
						result = 0;
						break;
					}
						
					char++;
				}
			}
			row++;
			return result;
		});
	}
	
	setTableWrapperClass(name){
		this.table.tableWrappers.forEach((elem, index, array) => {
			elem.addClass(name);
		});
	}
	
	setMacroWrapperClass(name){
		this.table.macroWrappers.forEach((elem, index, array) => {
			elem.addClass(name);
		});
	}
}