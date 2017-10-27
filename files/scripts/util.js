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
		this.name = name;
		this.dataMatrix = new DataMatrix([...dataArray].length + 1, [...headers].length);
		
		this.setHeaders(headers);
		this.setDataArray(dataArray);
		this.table = {
			element: undefined,
			tables: [],
			headerRow: [],
			headerCells: [],
			dataRowOdd: [],
			dataRowEven: [],
			dataCells: []
		}
		this._constructTableElement();
	}
	
	_constructTableElement(){
		const table = $("<table>");

		/* Header */
		const headerRow = $("<tr>");
		this.table.headerRow = [headerRow];
		for (const header of this.dataMatrix.getRow(0)) {
			const headerCell = $("<th>");
			
			headerCell.text(header);
			headerCell.attr("id", `${this.name}.${header}`);
			headerRow.append(headerCell); 
			
			this.table.headerCells.push(headerCell);
		}
		
		
		table.append(headerRow);

		/* Data */
		for (let row = 1; row < this.dataMatrix.rows; row++) {
			const dataR = this.dataMatrix.getRow(row);
			const dataRow = $("<tr>");
			
			if(row % 2 == 0) this.table.dataRowEven.push(dataRow);
			if(row % 2 == 1) this.table.dataRowOdd.push(dataRow);
			
			for (let col = 0; col < this.dataMatrix.columns; col++) {
				const dataC = dataR[col];
				const header = this.dataMatrix.get(0, col);
				const dataCell = $("<td>");
				
				dataCell.text(dataC);
				dataCell.attr("id", `${this.name}.${header}.${dataC}`);
				dataRow.append(dataCell);
				
				this.table.dataCells.push(dataCell);
			}
			table.append(dataRow);
		}
		
		this.table.tables.push(table);
		this.table.element = table;
	}
	
	setHeaders(headers){
		this.dataMatrix.setRow(0, headers);
	}
	
	
	setDataArray(dataArray){
		for(let col = 0; col < this.dataMatrix.columns; col++){
			const header = this.dataMatrix.get(0, col);
			for(let row = 1; row < this.dataMatrix.rows; row++){
				this.dataMatrix.set(row, col, dataArray[row - 1][header]);
			}
		}
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

class OrderedTable extends Table {
	
	constructor(name, headers, dataArray, defaultOrderHeader, isAscending){
		super(name, headers, dataArray);
		this.name = name;
		this.dataMatrix = new DataMatrix([...dataArray].length + 1, [...headers].length);
		
		this.setHeaders(headers);
		this.setDataArray(dataArray);
		this.table = {
			element: undefined,
			tables: [],
			headerRow: [],
			headerCells: [],
			dataRowOdd: [],
			dataRowEven: [],
			dataCells: []
		}
		this.orderHeading = defaultOrderHeader;
		this.isAscending = isAscending;
		
		this._constructTableElement();
	}
	
	_constructTableElement(){
		const name = this.name;
		this.name = `${name}.dataTable`;
		super._constructTableElement();
		
		const wrapper = $("<div>");
		
		const header = [""];
		const height = this.dataMatrix.rows - 1;
		
		const places = [];
		for(let i = 0; i < height; i++){
			const value = i + 1;
			places.push({"" : value});
		}
		
		const placeTable = new Table(`${name}.PlacementTable`, header, places);
		
		placeTable.table.headerRow.every( (elem, index, array) => {this.table.headerRow.push(elem)});
		placeTable.table.headerCells.every( (elem, index, array) => {this.table.headerCells.push(elem)});
		placeTable.table.dataRowOdd.every( (elem, index, array) => {this.table.dataRowOdd.push(elem)});
		placeTable.table.dataRowEven.every( (elem, index, array) => {this.table.dataRowEven.push(elem)});
		placeTable.table.dataCells.every( (elem, index, array) => {this.table.dataCells.push(elem)});
		
		// Place all table (tag only, not content) into this.table.tables
		this.table.tables.push(placeTable.table.);
		this.table.dataTable = this.table.element;
		
		wrapper.append(this.table.placmentTable);
		wrapper.append(this.table.dataTable);
		
		this.table.element = wrapper;
	}
}