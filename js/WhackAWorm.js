/* Whack A Worm Game
 Developed by Carlos Yanez */
 
/* Define Canvas */

var canvas;
var stage;

/* Background */

var titleBg;

/* Title View */

var titleBgImg = new Image();
var titleBg;
var playBtnImg = new Image();
var playBtn;
var creditsBtnImg = new Image();
var creditsBtn;
var rateBtnImg = new Image();
var rateBtn;
var titleView = new Container();

/* Credits */

var creditsViewImg = new Image();
var creditsView;

/* Game Bg */

var gameBgImg = new Image();
var gameBg;

/* Alert */

var alertBgImg = new Image();
var alertBg;

/* Score */

var score;

/* Worms */

var wormImg = new Image();
var worm;

var wormsX = [410, 410, 410, 212, 212, 212, 24, 24, 24];
var wormsY = [825, 617, 439, 825, 627, 429, 825, 627, 429];
var lastWorm;

/* Variables */

var centerX = 320;
var centerY = 568;
var gfxLoaded = 0;

var timerSource;
var currentWorms = 0;
var wormsHit = 0;
var totalWorms = 10;
				 
function Main()
{
	/* Link Canvas */
	
	canvas = document.getElementById('WhackAWorm');
  	stage = new Stage(canvas);
  		
  	stage.mouseEventsEnabled = true;
  		
  	/* Load GFX */
  		
  	titleBgImg.src = 'images/titleBg.png';
  	titleBgImg.name = 'titleBg';
  	titleBgImg.onload = loadGfx;
  	
  	gameBgImg.src = 'images/gameBg.png';
  	gameBgImg.name = 'gameBg';
  	gameBgImg.onload = loadGfx;
	
	playBtnImg.src = 'images/playBtn.png';
	playBtnImg.name = 'playBtn';
	playBtnImg.onload = loadGfx;
	
	creditsBtnImg.src = 'images/creditsBtn.png';
	creditsBtnImg.name = 'creditsBtn';
	creditsBtnImg.onload = loadGfx;
	
	rateBtnImg.src = 'images/mainRate.png';
	rateBtnImg.name = 'rateBtn';
	rateBtnImg.onload = loadGfx;
	
	creditsViewImg.src = 'images/creditsView.png';
	creditsViewImg.name = 'credits';
	creditsViewImg.onload = loadGfx;
	
	alertBgImg.src = 'images/alertBg.png';
	alertBgImg.name = 'alertBg';
	alertBgImg.onload = loadGfx;
	
	wormImg.src = 'images/play-btn-on.png';
	wormImg.name = 'worm';
	wormImg.onload = loadGfx;
	
	/* Ticker */
	
	Ticker.setFPS(30);
	Ticker.addListener(stage);
}

function loadGfx(e)
{
	if(e.target.name = 'titleBg'){titleBg = new Bitmap(titleBgImg);}
	if(e.target.name = 'gameBg'){gameBg = new Bitmap(gameBgImg);}
	if(e.target.name = 'playBtn'){playBtn = new Bitmap(playBtnImg);}
	if(e.target.name = 'creditsBtn'){creditsBtn = new Bitmap(creditsBtnImg);}
	if(e.target.name = 'rateBtn'){rateBtn = new Bitmap(rateBtnImg);}
	if(e.target.name = 'alertBg'){alertBg = new Bitmap(alertBgImg);}
	/* --CreditsView
	   --Worms */
	
	gfxLoaded++;
	
	if(gfxLoaded == 7)
	{
		addTitleView();
	}
}

function addTitleView()
{	
	/* Add GameView BG */
	
	stage.addChild(gameBg);
	
	/* Title Screen */
	
	playBtn.x = centerX - 250;
	playBtn.y = centerY + 0;
	
	creditsBtn.x = centerX + 10;
	creditsBtn.y = centerY + 0;
	
	rateBtn.x = centerX - 110;
	rateBtn.y = centerY + 300;
				
	titleView.addChild(titleBg, playBtn, creditsBtn, rateBtn);
	
	stage.addChild(titleView);
	
	startButtonListeners('add');
	
	stage.update();
}

function startButtonListeners(action)
{
	if(action == 'add')
	{
		titleView.getChildAt(1).onPress = showGameView;
		titleView.getChildAt(2).onPress = showCredits;
	}
	else
	{
		titleView.getChildAt(1).onPress = null;
		titleView.getChildAt(2).onPress = null;
	}
}

function showCredits()
{
	playBtn.visible = false;
	creditsBtn.visible = false;
	creditsView = new Bitmap(creditsViewImg);
	stage.addChild(creditsView);
	creditsView.x = -203;
	
	Tween.get(creditsView).to({x:0}, 200).call(function(){creditsView.onPress = hideCredits;});
}

function hideCredits()
{
	playBtn.visible = true;
	creditsBtn.visible = true;
	Tween.get(creditsView).to({x:-203}, 200).call(function(){creditsView.onPress = null; stage.removeChild(creditsView); creditsView = null;});
}

function showGameView()
{
	Tween.get(titleView).to({x: -480}, 200).call(function(){startButtonListeners('rmv'); stage.removeChild(titleView); titleView = null; showWorm();});
	score = new Text('0' + '/' + totalWorms, 'bold 15px Arial', '#EEE');
	score.x = 58;
	score.y = 21;
	stage.addChild(score);
	
	var audio = new Audio('audio/bg-audio.mp3');
	audio.play();
}

function showWorm()
{
	if(currentWorms == totalWorms)
	{
		showAlert();
	}
	else
	{	
		if(lastWorm != null)
		{
			lastWorm.onPress = null;
			stage.removeChild(lastWorm);
			stage.update();
			lastWorm = null;
		}
		
		var randomPos = Math.floor(Math.random() * 8);
		var worm = new Bitmap(wormImg);
		
		worm.x = wormsX[randomPos];
		worm.y = wormsY[randomPos];
		stage.addChild(worm);
		worm.onPress = wormHit;
		
		lastWorm = worm;
		lastWorm.scaleY = 1;
		lastWorm.alpha = 0;
		stage.update();
		
		Tween.get(lastWorm).to({alpha: 1, y: wormsY[randomPos]}, 300).wait(1000).call(function(){currentWorms++; showWorm()});
	}
}

function wormHit()
{
	wormsHit++;
	score.text = wormsHit + '/' + totalWorms;
	var btnSound = new Audio('audio/tap-audio.mp3');
	btnSound.play();
	
	lastWorm.onPress = null;
	stage.removeChild(lastWorm);
	lastWorm = null;
	stage.update();
}

function showAlert()
{
	alertBg.x = centerX - 120;
	alertBg.y = -80;
	stage.addChild(alertBg);
	
	Tween.get(alertBg).to({y:centerY - 80}, 200).call(function()
	{
		Ticker.removeAllListeners();
		var score = new Text(wormsHit + '/' + totalWorms, 'bold 20px Arial', '#EEE');
		score.x = 220;
		score.y = 205;
		stage.addChild(score);
		stage.update();
	});
}