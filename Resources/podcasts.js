Ti.include('functions.js');

// get vars from main screen
var main_win     = Ti.UI.currentWindow;
var toolActInd   = main_win.toolActInd;
var streamer     = main_win.streamer;
var sound_unc    = main_win.sound_unc;
var nav          = main_win.nav;
var podcast_type = main_win.podcast_type;

// show loading bar
main_win.setToolbar([toolActInd],{animated:true});
toolActInd.show();

// handle clicked row id
var old_fired = false;
var Table, url, header, itunes_link, site_link, rss_feed;

// check 'Radio-T' or 'Pirates'
if (podcast_type == 'radiot') {
    header      = 'Последние подкасты Радио-Т';
    itunes_link = 'http://phobos.apple.com/WebObjects/MZStore.woa/wa/viewPodcast?id=256504435';
    site_link   = 'http://www.radio-t.com/';
    rss_feed    = 'http://pipes.yahoo.com/pipes/pipe.run?_id=3a4adebe929770d8561801e41212bfe8&_render=rss';
} else {
    header      = 'Последние подкасты Пираты РТ';
    itunes_link = 'http://phobos.apple.com/WebObjects/MZStore.woa/wa/viewPodcast?id=288705606';
    site_link   = 'http://pirate.radio-t.com/';
    rss_feed    = 'http://pipes.yahoo.com/pipes/pipe.run?_id=5e66a06b60102b4e42d6b62722e97a86&_render=rss';
}

// create table view data object
var data = [
	{title:'iTunes', header:header, hasChild: true, itunes_url:'http://phobos.apple.com/WebObjects/MZStore.woa/wa/viewPodcast?id=256504435'},
	{title:'Cайт подкаста', hasChild: true, safari_url:site_link}
];
if (podcast_type == 'radiot') {
    data.push({title:'Мобильная версия сайта', hasChild: true, safari_url:'http://i.radio-t.com/'});
}

//Get and parse rss feed
var xhr = Ti.Network.createHTTPClient();

xhr.open("GET",rss_feed);
xhr.onload = function() {
	try	{
		var doc = this.responseXML.documentElement;
		var items = doc.getElementsByTagName("item");
		var x = 0;
		var doctitle = doc.evaluate("//channel/title/text()").item(0).nodeValue;
		for (var c=0;c<items.length;c++) {
			var item = items.item(c);
            comments = item.getElementsByTagName("link").item(0).text;
	        header = item.getElementsByTagName("title").item(0).text;
            mp3_url = item.getElementsByTagName("enclosure").item(0).getAttribute("url");
            // if radio-t add shownotes row
            if (podcast_type == 'radiot') {
            
                description = item.getElementsByTagName("description").item(0).text;
                
                var row = Ti.UI.createTableViewRow();
                row.height = "auto";
                row.header = header;
                row.className = "datarow";
                row.touchEnabled = false;  
                row.selectionStyle = Ti.UI.iPhone.TableViewCellSelectionStyle.NONE; 
                var caption = Ti.UI.createLabel({
                    text:description,
                    font:{fontSize:16},
                    left:10,
                    right:10,
                    height:"auto"
                });	
                row.add(caption);
                data.push(row);
                data.push({title:'Слушать', hasCheck:false, mp3_url:mp3_url});
            } else {
                data.push({title:'Слушать', hasCheck:false, mp3_url:mp3_url, header:header});
            }
            
            data.push({title:'Комментарии', hasChild:true, safari_url:comments});
        }
        Table = Ti.UI.createTableView({
            data:data
        });
        
        Table.addEventListener('click', function(e){
            if (e.rowData.itunes_url)	{
                Ti.Platform.openURL(e.rowData.itunes_url);
            }
                    
            if (e.rowData.safari_url)	{
                showWebView(e.rowData.safari_url, e.rowData.title);
            }
            
            if (e.rowData.mp3_url) {
                if(e.rowData.hasCheck) {
                    streamer.stop();
                    e.rowData.hasCheck = false;
                } else {
                    showIndication();
                    if (old_fired) {
                        old_fired.rowData.hasCheck = false; 
                    }
                    old_fired = e;
                    streamer.stop();
                    sound_unc.stop();
                    streamer.url = e.rowData.mp3_url;
                    streamer.start();
                    e.rowData.hasCheck = true;
                }
            }
        });
        main_win.add(Table);
        toolActInd.hide();
        main_win.setToolbar(null,{animated:true});
    }
	catch(E) {
		alert(E);
	}
};
xhr.send();
