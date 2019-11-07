_self.$ExportBtn = $thisFragment.find('#excel-export-btn').click(function () {
	//show spinner
	$("#loading").fadeIn();
	
	var url=_self.source.url;
	var requestData=Object.assign({}, _self.finalFiltersData);;
	var title=_self.title;
	var fields=_self.fieldConfig.map(r=>r.FieldName);
	requestData.pagesize=100000;
	
	//create new excel workbook
	var workbook = XLSX.utils.book_new();
	
	//make an empty sheet
	var sheet={};
	
	//generating title row from fields config
	var titlesRow=_self.fieldConfig.reduce((obj, item) => {obj[item.FieldName] = item.AliasName;return obj;}, {});
	
	$.post(url,requestData).done(function(r){
		
		//prepend titles row before all rows
		r.Rows.unshift(titlesRow);
		
		//filter row colums to fiels list
		r.Rows=r.Rows.map((r)=>Object.fromEntries( Object.entries(r).filter(([key, val])=>fields.includes(key))));
		
		//append json to sheet
		XLSX.utils.sheet_add_json(sheet,r.Rows,{header:fields,skipHeader:true});
		
		//append sheet to workbook. 
		//Note: sheet must be filled before adding to sheet. 
		XLSX.utils.book_append_sheet(workbook, sheet, title);
		
		//prepare excel file and send it to download
		XLSX.writeFile(workbook ,  (title+'.xlsx'));
		
		//hide spinner
		$("#loading").fadeOut();
	})

	
});