function showWebView(url, title) {
    var webview_win = Ti.UI.createWindow({
        title:title,
        url:'webview.js'
    });
    webview_win.weburl = url;
    nav.open(webview_win,{animated:true});
}

function showIndication(text) {
    if (text == undefined) {
        toolActInd.message = 'Загрузка...';
    } else {
        toolActInd.message = text;
    }
    main_win.setToolbar([toolActInd],{animated:true});
	toolActInd.show();
	setTimeout(function()
	{
		toolActInd.hide();
		main_win.setToolbar(null,{animated:true});
	},3000);
}
