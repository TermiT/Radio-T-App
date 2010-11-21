/*
Radio-t App (iPhone)
Gennadii Potapov: <gennady@potapov.com>
General Arcade: http://www.generalarcade.com/
TitaniumDev RU: http://Tidev.ru/
*/

Ti.include('functions.js');

//background audio support
Ti.Media.defaultAudioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.UI.setBackgroundColor('#dbe2ed');

// Old hack
var view = Ti.UI.createView();

// Global window
var app_win = Ti.UI.createWindow();

// Main window init
var main_win = Ti.UI.createWindow({  
    title:'Радио-Т',
    navBarHidden: false,
    backgroundImage: 'stripe1.png',
    tabBarHidden: true    
});


// Navigation group
var nav = Ti.UI.iPhone.createNavigationGroup({
    window: main_win
});


// unca local player
var sound_unc = Ti.Media.createSound({url:'unc-unc.mp3',lopping:true});
sound_unc.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;
sound_unc.setLooping();

var stream_url = 'http://stream9.radio-t.com:8181/stream';

// player for online stream
var streamer = Ti.Media.createAudioPlayer({url:stream_url});
streamer.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;

var fired = '';

// twitter recomend url
var twitter_url = 'http://mobile.twitter.com/home?status=«Радио-Т» - еженедельные импровизации на Hi-Tech темы. Рекомендую! http://www.radio-t.com/';

// Email dialog init
var dEmailMessage = Ti.UI.createEmailDialog();
dEmailMessage.subject = 'Рекомендую послушать подкаст «Радио-Т»';
dEmailMessage.toRecipients = [''];
dEmailMessage.html = true;
dEmailMessage.messageBody = '<b>«Радио-Т» - еженедельные импровизации на Hi-Tech темы.</b><br />Рекомендую! <a href="http://www.radio-t.com/">Сайт подкаста</a>';


// Loading activity indificator 
var toolActInd = Ti.UI.createActivityIndicator({
	style : Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
	font : {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'},
	color : 'white',
	message : 'Загрузка...'
});


// Online stream alertbox
var attentionAlert = Ti.UI.createAlertDialog({
	title:'Внимание!',
	message:'Онлайн вещание проходит по субботам в 23:00',
    cancel:1,
    buttonNames:['OK','Отмена']
});

attentionAlert.addEventListener('click', function(e)
{
	if(e.index == 0) {
        showIndication();
        sound_unc.stop();
        streamer.url = stream_url;
        streamer.start();
        fired.rowData.hasCheck = true;
    }
});


// Connection alertbox
var networkAlert = Ti.UI.createAlertDialog({
	title:'Внимание!',
	message:'Для корректной работы приложения необходимо подключение к Интернет',
    cancel:0,
    buttonNames:['OK']
});

// Recomend option dialog
var recomendDialog = Ti.UI.createOptionDialog({
	options:['Отмена', 'e-mail', 'twitter'],
    title:'Рекомендовать другу:',
    cancel:0
});

recomendDialog.addEventListener('click', function(e) {
	var index = e.index;
    switch(index) {
    case 1: dEmailMessage.open(); break;
    case 2: showWebView(twitter_url, 'twitter'); break;
    }
});

// Main menu rows data
var data = [
	{title:'«Радио-Т»',           hasChild:true,  js:'podcasts.js', header:'Подкаcты' },
	{title:'«Пираты-РТ»',         hasChild:true,  js:'podcasts.js'},
	{title:'On-line трансляция',  hasCheck:false, header:'Слушать'},
    {title:'Унца-Унца',           hasCheck:false},
    {title:'Трансляция чата',     hasChild:true,  header:'Дополнительно'},
    {title:'Twitter',             hasChild:true,  js:'twitter.js'},
    {title:'Рекомендовать другу', hasChild:true},
    {title:'О подкасте',          hasChild:true,  js:'about_podcast.js', header:'Информация'},
    {title:'О программе',         hasChild:true,  js:'about.js'}
];


// Main menu/table
var menu = Ti.UI.createTableView({
		data:data,
		style:Ti.UI.iPhone.TableViewStyle.GROUPED,
		backgroundColor:'transparent',
        rowBackgroundColor:'white'
});

menu.addEventListener('click', function(e){
	var index = e.index;
    switch(index) {
    case 3:
        if(e.rowData.hasCheck) {
            sound_unc.stop();
            e.rowData.hasCheck = false;
        } else {
            showIndication();
            streamer.stop();
            sound_unc.play();
            e.rowData.hasCheck = true;
        }
        break;
    case 2:
        if(e.rowData.hasCheck) {
            streamer.stop();
            e.rowData.hasCheck = false;
        } else {
            attentionAlert.show(); 
            fired = e;  
        }
        break;
    case 4:
        showWebView('http://chat.radio-t.com/','Трансляция чата');
        break;
    case 6:
        recomendDialog.show();
        break;
    }        
    if (e.rowData.js) {
        var win = Ti.UI.createWindow({
			url:e.rowData.js,
            backgroundImage: 'stripe1.png',
            navBarHidden: false,
			title:e.rowData.title
		});
        win.main_win   = main_win;  
        win.toolActInd = toolActInd;
        win.streamer   = streamer;
        win.sound_unc  = sound_unc;
        win.nav        = nav;
        if(index == 0) {
            win.podcast_type = 'radiot';
        }
        nav.open(win,{animated:true});
	}    
});

main_win.add(menu);
app_win.add(nav);
app_win.open();

if (!Ti.Network.online) {
    networkAlert.show();
}
