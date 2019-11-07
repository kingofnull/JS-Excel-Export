_self.$ExportBtn = $thisFragment.find('#excel-export-btn').click(function () {
        // console.log(_self.source.url,jdata);
		//var _self=fishGrid;
		$("#loading").fadeIn();
		var url=_self.source.url;
		var date=Object.assign({}, _self.finalFiltersData);;
		var title=_self.title;
		var fields=_self.fieldConfig.map(r=>r.FieldName);
		date.pagesize=100000;

		$.post(url,date).done(function(r){
			var workbook = XLSX.utils.book_new();
			sheet={};
			r.Rows.unshift(_self.fieldConfig.reduce((obj, item) => {obj[item.FieldName] = item.AliasName;return obj;}, {}));
			r.Rows=r.Rows.map((r)=>Object.fromEntries( Object.entries(r).filter(([key, val])=>fields.includes(key))));
			XLSX.utils.sheet_add_json(sheet,r.Rows,{header:fields,skipHeader:true});
			XLSX.utils.book_append_sheet(workbook, sheet, title);
			XLSX.writeFile(workbook ,  (title+'.xlsx'));
			$("#loading").fadeOut();
		})

        
    });