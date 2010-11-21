//Titanium bug with '#'
var url = Ti.UI.currentWindow.weburl;
var webview = Ti.UI.createWebView({url:url});


var safariButton = Ti.UI.createButton({
    title:'Safari',
    style:Ti.UI.iPhone.SystemButtonStyle.PLAIN
});

safariButton.addEventListener('click',function() {
    Ti.Platform.openURL(url);
});

Ti.UI.currentWindow.setRightNavButton(safariButton);
Ti.UI.currentWindow.add(webview);