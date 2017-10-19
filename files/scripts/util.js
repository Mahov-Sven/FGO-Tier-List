class Util {

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
			headerCell.attr("id", `${tableName}_HEADER<${header}>`);
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
				dataRow.append(dataCell);
			}
			table.append(dataRow);
			row++;
		}

		return table;
	}
}