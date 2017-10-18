class Util {

	static randomInt(min = 0, max) {
		return Math.round(Math.random() * (max - min)) + min;
	}

	static createTable(headers, dataRows, tableClass = undefined, headerRowClass = undefined, headerCellClass = undefined, dataRowClass = undefined, dataCellClass = undefined) {
		const table = $("<table>");
		if (tableClass !== undefined) table.addClass(tableClass);

		/* Header */
		const headerRow = $("<tr>");
		if (headerRowClass !== undefined) headerRow.addClass(headerRowClass);
		for (const header of headers) {
			const headerCell = $("<th>");
			if (headerCellClass !== undefined) headerCell.addClass(headerCellClass);

			headerCell.text(header);
			headerRow.append(headerCell); }
		table.append(headerRow);

		/* Data */
		for (const data of dataRows) {
			const dataRow = $("<tr>");
			if (dataRowClass !== undefined) dataRow.addClass(dataRowClass);

			for (const header of headers) {
				const dataCell = $("<td>");
				if (dataCellClass !== undefined) dataCell.addClass(dataCellClass);

				dataCell.text(data[header]);
				dataRow.append(dataCell);
			}
			table.append(dataRow);
		}

		return table;
	}
}