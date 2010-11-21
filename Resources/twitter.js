Titanium.include('functions.js');

var main_win     = Titanium.UI.currentWindow;
var nav          = main_win.nav;


// Main menu rows data
var data = [
	{title:'#radiot',    hasChild:true},
	{title:'@radio_t',   hasChild:true},
    {title:'@bobuk',     hasChild:true},
    {title:'@umputun',   hasChild:true},
    {title:'@gray_ru',   hasChild:true},
    {title:'@marin_k_a', hasChild:true}
];

// Main menu/table
var menu = Titanium.UI.createTableView({
		data:data,
		style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
        rowBackgroundColor:'white'
});


menu.addEventListener('click', function(e){
	var index = e.index;
    switch(index) {
        case 0: showWebView('http://mobile.twitter.com/searches?q=#radiot', '#radiot'); break;
        case 1: showWebView('http://mobile.twitter.com/radio_t', '@radio_t'); break;
        case 2: showWebView('http://mobile.twitter.com/bobuk', '@bobuk'); break;
        case 3: showWebView('http://mobile.twitter.com/umputun', '@umputun'); break;
        case 4: showWebView('http://mobile.twitter.com/gray_ru', '@gray_ru'); break;
        case 5: showWebView('http://mobile.twitter.com/marin_k_a', '@marin_k_a'); break;
    }
});

main_win.add(menu);