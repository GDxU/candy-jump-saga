/**
 * @author: Karthik VJ
 **/

///<reference path="../../../definitions/pixi.d.ts"/>
///<reference path="../../../definitions/touch.d.ts"/>
///<reference path="BackgroundArea.ts"/>
///<reference path="Hero.ts"/>
///<reference path="platform/PlatformManager.ts"/>
///<reference path="utils/DeviceUtils.ts"/>
///<reference path="HudArea.ts"/>
///<reference path="screens/CloudsDisplay.ts"/>
///<reference path="screens/TitleScreen.ts"/>
///<reference path="screens/LevelSelectScreen.ts"/>
///<reference path="utils/DisplayObjectUtils.ts"/>
///<reference path="GameEventType.ts"/>
///<reference path="SoundManager.ts"/>
///<reference path="GamepadControl.ts"/>

module com.goldenratio
{
    export class GameMain
    {
        public static GAME_DIMENSION:PIXI.Rectangle = new PIXI.Rectangle(0, 0, 400, 575);
        private _stage:PIXI.Stage;
        private _renderer:PIXI.IPixiRenderer;

        private _assetLoader:PIXI.AssetLoader;
        private _container:PIXI.DisplayObjectContainer;
        private _cloudsContainer:PIXI.DisplayObjectContainer;
        private _titleContainer:PIXI.DisplayObjectContainer;
        private _levelScreenContainer:PIXI.DisplayObjectContainer;

        // game elements
        private _background:BackgroundArea;
        private _hero:Hero;
        private _platformManager:PlatformManager;
        private _hud:HudArea;
        private _cloud:CloudsDisplay;
        private _titleScreen:TitleScreen;
        private _levelSelectScreen:LevelSelectScreen;

        private _gameRect:PIXI.Rectangle = new PIXI.Rectangle(0, 0,
            GameMain.GAME_DIMENSION.width, GameMain.GAME_DIMENSION.height);

        private _isMobileDevice:boolean;

        private _isPaused:boolean = false;
        private _gameInitialized:boolean = false;
        //private _isGameOver:boolean = false;
        //private _isLevelComplete:boolean = false;
        private _currentLevel:number = 0;
        private _score:number = 0;

        private _divArea:HTMLElement;
        private _loaderArea:HTMLElement;

        private _gamePad:GamepadControl;

        constructor()
        {
            console.log("main");
            //DeviceUtils.lockScreenToPortrait();

            this._divArea = <HTMLElement> document.getElementById("container");
            this._loaderArea = <HTMLElement> document.getElementById("loader_area");
            var canvasElement:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game_area");

            this._stage = new PIXI.Stage(0xffffff, false);
            if(DeviceUtils.renderInWebGL())
            {
                console.log("trying to render using webgl..");
                this._renderer = PIXI.autoDetectRenderer(GameMain.GAME_DIMENSION.width, GameMain.GAME_DIMENSION.height, canvasElement, true);
            }
            else
            {
                console.log("render using canvas render..");
                this._renderer = new PIXI.CanvasRenderer(GameMain.GAME_DIMENSION.width, GameMain.GAME_DIMENSION.height, canvasElement, true);
            }

            if(this._renderer instanceof PIXI.WebGLRenderer)
            {
                console.log("rendered using webGL");
                //alert("webgl");
            }
            else
            {
                console.log("render using canvas!");
                //alert("canvas");
            }

            this._isMobileDevice = DeviceUtils.isMobileDevice();
            //this._isMobileDevice = true;
            this.mapBinds();

            if(this._isMobileDevice)
            {
                this.resizeGameForMobile();
                window.addEventListener("resize", this.onResizeWindowHandler, false);

                console.log('meow.. ' + window["orientation"]);
                window.addEventListener("orientationchange", this.onOrientationChangeHandler, false);

                /*if(window["orientation"] != null)
                {
                    window.addEventListener("orientationchange", this.onOrientationChangeHandler, false);
                }
                else
                {
                    // firefox. sighs!
                    console.log("adding ff media query listener.");
                    var mediaQuery:MediaQueryList = window.matchMedia("(orientation: landscape)");
                    mediaQuery.addListener(this.mozOrientationChange);

                } */

            }

            if(DeviceUtils.isGamepadSupported() && DeviceUtils.isMobileDevice() == false)
            {
                this._gamePad = new GamepadControl();
                this._gamePad.addEventListener(GameEventType.GAMEPAD_ACTION_KEY, this.onGamepadActionKeyHL);
                this._gamePad.addEventListener(GameEventType.GAMEPAD_RIGHT_KEY, this.onGamepadRightKeyHL);
                this._gamePad.addEventListener(GameEventType.GAMEPAD_LEFT_KEY, this.onGamepadLeftKeyHL);
                this._gamePad.addEventListener(GameEventType.GAMEPAD_CONNECTED, this.onGamepadConnectedHL);
                this._gamePad.addEventListener(GameEventType.GAMEPAD_DISCONNECTED, this.onGamepadDisconnectedHL);
                this._gamePad.addEventListener(GameEventType.GAMEPAD_MUTE_KEY, this.onGamepadMuteToggleHL);
                this._gamePad.addEventListener(GameEventType.GAMEPAD_MENU_KEY, this.onGamepadMenuHL);
            }

            document.addEventListener("mozfullscreenchange", this.onFullScreenChangeHL, false);

            this._assetLoader = new PIXI.AssetLoader(["assets/data.json"]);
            this._assetLoader.addEventListener("onComplete", this.onAssetsLoadComplete);
            this._assetLoader.load();

            requestAnimFrame(this.animate);
        }


        private mapBinds():void
        {
            this.animate = this.animate.bind(this);
            this.onAssetsLoadComplete = this.onAssetsLoadComplete.bind(this);
            this.onResizeWindowHandler = this.onResizeWindowHandler.bind(this);
            this.onWindowBlurHL = this.onWindowBlurHL.bind(this);

            this.onPauseWindowClickHL = this.onPauseWindowClickHL.bind(this);
            this.onGameOverWindowClickHL = this.onGameOverWindowClickHL.bind(this);
            this.onLevelCompleteWindowClickHL = this.onLevelCompleteWindowClickHL.bind(this);

            this.onOrientationChangeHandler = this.onOrientationChangeHandler.bind(this);
            //this.mozOrientationChange = this.mozOrientationChange.bind(this);
            //this.onKeyDownHL = this.onKeyDownHL.bind(this);

            this.onStartGameHL = this.onStartGameHL.bind(this);
            this.onLevelSelectHL = this.onLevelSelectHL.bind(this);
            this.onLevelCompleteHL = this.onLevelCompleteHL.bind(this);
            this.onGameOverHL = this.onGameOverHL.bind(this);
            this.onSoundLoadedHL = this.onSoundLoadedHL.bind(this);
            this.onSoundErrorHL = this.onSoundErrorHL.bind(this);
            this.onGamePauseHL = this.onGamePauseHL.bind(this);
            this.ShowMenuFromGame = this.ShowMenuFromGame.bind(this);
            this.onGamepadActionKeyHL = this.onGamepadActionKeyHL.bind(this);
            this.onGamepadConnectedHL = this.onGamepadConnectedHL.bind(this);
            this.onGamepadDisconnectedHL = this.onGamepadDisconnectedHL.bind(this);
            this.onGamepadRightKeyHL = this.onGamepadRightKeyHL.bind(this);
            this.onGamepadLeftKeyHL = this.onGamepadLeftKeyHL.bind(this);
            this.onGamepadMuteToggleHL = this.onGamepadMuteToggleHL.bind(this);
            this.onGamepadMenuHL = this.onGamepadMenuHL.bind(this);


            this.onFullScreenChangeHL = this.onFullScreenChangeHL.bind(this);

        }

        /*private mozOrientationChange(m:MediaQueryList):void
        {
            if(m.matches && DeviceUtils.isLandscapeMode() && this._gameInitialized)
            {
                // landscape
                this.pauseGame(true);
            }
        } */

        private onGamepadConnectedHL(event:PIXI.IEvent):void
        {
            if(this._titleScreen)
            {
                this._titleScreen.showGamepadConnected(true);
            }
            else if(this._levelSelectScreen)
            {
                this._levelSelectScreen.showBorder();
            }
        }

        private onGamepadMenuHL(event:PIXI.IEvent):void
        {
            if(this._hero)
            {
                this.disposeGame();
                this.initTitleScreen();
            }
        }

        private onGamepadMuteToggleHL(event:PIXI.IEvent):void
        {
            if(this._hero)
            {
                if(this._hud)
                {
                    this._hud.onToggleMuteHL(null);
                }
            }
        }

        private onGamepadDisconnectedHL(event:PIXI.IEvent):void
        {
            if(this._titleScreen)
            {
                this._titleScreen.showGamepadConnected(false);
            }
            else if(this._levelSelectScreen)
            {
                this._levelSelectScreen.showBorder(false);
            }
        }

        private onOrientationChangeHandler(event:Event):void
        {
            this.resizeGameForMobile();
        }

        private onResizeWindowHandler(event:Event):void
        {
            this.resizeGameForMobile();
        }

        private onAssetsLoadComplete(event:PIXI.IEvent):void
        {
            this._assetLoader.removeEventListener("onComplete", this.onAssetsLoadComplete);
            console.log("assets loaded");

            //this.init();
            SoundManager.event.addEventListener(GameEventType.SOUND_LOADED, this.onSoundLoadedHL);
            SoundManager.event.addEventListener(GameEventType.SOUND_ERROR, this.onSoundErrorHL);
            SoundManager.init();

        }

        private onSoundErrorHL(event:PIXI.IEvent):void
        {
            console.log("sound error!");
            this.init();
        }

        private onSoundLoadedHL(event:PIXI.IEvent):void
        {
            console.log("all sounds loaded");
            this.init();
        }

        private init():void
        {
            SoundManager.event.removeEventListener(GameEventType.SOUND_LOADED, this.onSoundLoadedHL);
            SoundManager.event.removeEventListener(GameEventType.SOUND_ERROR, this.onSoundErrorHL);

            this._background = new BackgroundArea();
            this._background.resizeGameForMobile(this._gameRect.width, this._gameRect.height);

            this.hideLoader();
            this.initTitleScreen();
            //this.initLevelSelectArea();
            //this.initGameArea();
        }

        private initTitleScreen():void
        {
            this._titleContainer = new PIXI.DisplayObjectContainer();
            this._stage.addChild(this._titleContainer);

            this._titleScreen = new TitleScreen(this._titleContainer);
            this._titleScreen.addEventListener(GameEventType.START_GAME, this.onStartGameHL);

            if(this._gamePad)
            {
                this._titleScreen.showGamepadConnected(this._gamePad.isConencted);
            }
        }

        private onGamepadLeftKeyHL(event:PIXI.IEvent):void
        {
            if(this._levelSelectScreen)
            {
                SoundManager.playClick();
                this._levelSelectScreen.moveLeft();
            }
        }

        private onGamepadRightKeyHL(event:PIXI.IEvent):void
        {
            if(this._levelSelectScreen)
            {
                SoundManager.playClick();
                this._levelSelectScreen.moveRight();
            }
        }

        private onGamepadActionKeyHL(event:PIXI.IEvent):void
        {
            console.log("gamepad action!");
            if(this._titleScreen)
            {
                this.onStartGameHL(null);
            }
            else if(this._levelSelectScreen)
            {
                this.onLevelSelectHL(null);
            }
            else
            {
                if(this._hero)
                {
                    if(this._hero.isLevelComplete == true)
                    {
                        this.onLevelCompleteWindowClickHL(null);

                    }
                    else if(this._hero.isAlive == false)
                    {
                        this.onGameOverWindowClickHL(null);
                    }
                    else
                    {
                        SoundManager.playClick();
                        this.onGamePauseHL(null);
                    }
                }

            }
        }

        private onStartGameHL(event:PIXI.IEvent):void
        {
            console.log("brr start game!");
            SoundManager.playClick();
            this.disposeTitle();

            // just incase if the sound was not loaded
            SoundManager.init();

            //this.initLevelSelectArea();
            this.initGameArea();

            //SoundManager.init();
            //this.initGameArea();
            /*if(DeviceUtils.isMobileDevice())
            {
                this.launchFullScreen();
            } */
        }

        private onFullScreenChangeHL(event:Event):void
        {
            //alert("boo");
            DeviceUtils.lockScreenToPortrait();
        }

        private launchFullScreen():void
        {
            document["fullscreenEnabled"] = document["fullscreenEnabled"] ||
                document["mozFullScreenEnabled"] || document.documentElement["webkitRequestFullScreen"]
                || document["msFullscreenEnabled"];

            if(document["fullscreenEnabled"] == false)
            {
                console.log("no fullscreen support!");
                return;
            }
            var element:FullScreenElement = <FullScreenElement> document.documentElement;

            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
        }

        /*private initLevelSelectArea():void
        {
            this._levelScreenContainer = new PIXI.DisplayObjectContainer();
            this._stage.addChild(this._levelScreenContainer);

            this._levelSelectScreen = new LevelSelectScreen(this._levelScreenContainer);
            this._levelSelectScreen.addEventListener(GameEventType.LEVEL_START, this.onLevelSelectHL);
            this._levelSelectScreen.resizeGameForMobile(this._gameRect.width, this._gameRect.height);

            if(this._gamePad)
            {
                if(this._gamePad.isConencted)
                {
                    this._levelSelectScreen.showBorder();
                }

            }
        } */

        private onLevelSelectHL(event:PIXI.IEvent):void
        {
            //console.log("brrr... " + event.content);

            SoundManager.playClick();
            var curLevel:number = 0;

            if(this._gamePad && this._levelSelectScreen)
            {
                if(this._gamePad.isConencted)
                {
                    curLevel = this._levelSelectScreen.currentSelectPosition;
                }
            }
            this.disposeLevelSelect();


            if(event && event.content)
            {
                this._currentLevel = <number> event.content;
            }
            else
            {
                this._currentLevel = curLevel;
            }

            this.initGameArea();
        }

        private initGameArea():void
        {
            console.log("init");


            // areas
            this._hud = new HudArea();
            this._hud.addEventListener(GameEventType.TOGGLE_PAUSE, this.onGamePauseHL);
            this._hud.addEventListener(GameEventType.SHOW_MENU_FROM_GAME, this.ShowMenuFromGame);
            this._hud.resizeGameForMobile(this._gameRect.width, this._gameRect.height);

            // game area
            this._cloudsContainer = new PIXI.DisplayObjectContainer();
            this._stage.addChild(this._cloudsContainer);

            this._container = new PIXI.DisplayObjectContainer();
            this._stage.addChild(this._container);
            this._container.position.y = GameMain.GAME_DIMENSION.height;

            this._cloud = new CloudsDisplay(this._cloudsContainer);


            this._platformManager = new PlatformManager(this._container);

            // pause game when window loses focus
            window.addEventListener("blur", this.onWindowBlurHL, false);
            //document.addEventListener("keydown", this.onKeyDownHL, false);

            this._gameInitialized = true;
            this._isPaused = false;

            this.nextLevel();
        }

        private ShowMenuFromGame(event:PIXI.IEvent):void
        {
            this.disposeGame();
            this.initTitleScreen();
        }

        private onGamePauseHL(event:PIXI.IEvent):void
        {
            console.log("GameMain pause!");
            this.pauseGame(!this._isPaused);
        }

        private nextLevel():void
        {
            console.log("next level!");
            this._container.position.y = GameMain.GAME_DIMENSION.height;

            this._platformManager.showLevel(this._currentLevel);

            this._hero = new Hero(this._container, this._renderer);
            this._hero.addEventListener(GameEventType.LEVEL_COMPLETE, this.onLevelCompleteHL);
            this._hero.addEventListener(GameEventType.PLAYER_DIE, this.onGameOverHL);
            this._hero.addEventListener(GameEventType.TOGGLE_PAUSE, this.onGamePauseHL);
            this._platformManager.init(this._hero);
            this._hero.onGameStart();

            console.log("next level score " + this._score);
            this._hero.updateScore(this._score);
            this._hud.setScore(this._score);


        }

        /*private onKeyDownHL(event:KeyboardEvent):void
        {
            if(event.keyCode == 38)
            {
                this._container.position.y += 10;
            }
            else if(event.keyCode == 40)
            {
                this._container.position.y -= 10;
            }
            else if(event.keyCode == 83)
            {
                this._platformManager.init(this._hero);
                this._hero.onGameStart();
            }
        } */

        private onPauseWindowClickHL(event:Event):void
        {
            console.log("click");
            SoundManager.playClick();
            this.toggleClickToResumeEvent(false);
            this.pauseGame(false);

            if(event)
            {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        private onWindowBlurHL(event:Event):void
        {
            this.pauseGame(true);
        }

        private pauseGame(state:boolean)
        {
            if(this._isPaused == state)
            {
                return;
            }

            if(this._hero == null)
            {
                return;
            }

            if(this._hero.isAlive == false || this._hero.isLevelComplete == true)
            {
                return;
            }
            if(state == true)
            {
                this._isPaused = true;
                this.toggleClickToResumeEvent(true);
                this._hud.showPause(true);
            }
            else
            {
                this.toggleClickToResumeEvent(false);
                this._isPaused = false;
                this._hud.showPause(false);
            }
        }

        private toggleClickToResumeEvent(state:boolean):void
        {
            this._divArea.removeEventListener("click", this.onPauseWindowClickHL, false);
            this._divArea.removeEventListener("touchstart", this.onPauseWindowClickHL, false);

            if(state)
            {
                this._divArea.addEventListener("click", this.onPauseWindowClickHL, false);
                this._divArea.addEventListener("touchstart", this.onPauseWindowClickHL, false);
            }

        }

        private onLevelCompleteHL(even:PIXI.IEvent):void
        {
            console.log("level complete!");
            //this._isLevelComplete = true;

            // bonus score
            var bonus:number = this._container.position.y;
            console.log("bonus: " + bonus);

            if(this._currentLevel < this._platformManager.getTotalLevels() - 1)
            {
                this._hud.showLevelComplete(bonus, bonus + this._hero.getScore());
                this._hero.updateScore(bonus);
                this.toggleLevelCompleteWindowClick(true);
            }
            else
            {
                this._hud.showGameComplete(bonus, bonus + this._hero.getScore());
                console.log("game complete!");
                this.toggleLevelCompleteWindowClick(true);

            }

        }

        private onGameOverHL(event:PIXI.IEvent):void
        {
            console.log("onGameOver");
            //this._isGameOver = true;

            // bonus score
            var bonus:number = this._container.position.y;
            console.log("bonus: " + bonus);
            this._hud.showGameOver(bonus, bonus + this._hero.getScore());

            this.toggleGameOverWindowClick(true);
        }

        private toggleGameOverWindowClick(state:boolean):void
        {
            this._divArea.removeEventListener("click", this.onGameOverWindowClickHL, false);
            this._divArea.removeEventListener("touchend", this.onGameOverWindowClickHL, false);

            if(state)
            {
                this._divArea.addEventListener("click", this.onGameOverWindowClickHL, false);
                this._divArea.addEventListener("touchend", this.onGameOverWindowClickHL, false);
            }

        }

        private onGameOverWindowClickHL(event:MouseEvent)
        {
            SoundManager.playClick();
            console.log("replay game..");
            this.toggleGameOverWindowClick(false);

            this._hud.hideGameOver();
            this.restartGame();

            if(event)
            {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        private toggleLevelCompleteWindowClick(state:boolean):void
        {
            this._divArea.removeEventListener("click", this.onLevelCompleteWindowClickHL, false);
            this._divArea.removeEventListener("touchend", this.onLevelCompleteWindowClickHL, false);

            if(state)
            {
                this._divArea.addEventListener("click", this.onLevelCompleteWindowClickHL, false);
                this._divArea.addEventListener("touchend", this.onLevelCompleteWindowClickHL, false);
            }

        }

        private onLevelCompleteWindowClickHL(event:MouseEvent):void
        {
            SoundManager.playClick();
            this.toggleLevelCompleteWindowClick(false);
            this._currentLevel ++;
            if(this._currentLevel >= this._platformManager.getTotalLevels())
            {
                console.log("no more levels");
                this._currentLevel = 0;
                this.disposeGame();
                this.initTitleScreen();
                return;
            }
            console.log("next level");

            this._hud.hideGameOver();

            this._score = this._hero.getScore();
            console.log("brrr.. " + this._score);

            this.disposeHero();

            if(this._platformManager)
            {
                this._platformManager.clearLevel();
            }

            // next level
            this.nextLevel();

            if(event)
            {
                event.preventDefault();
                event.stopPropagation();
            }

        }

        private restartGame():void
        {
            this.toggleGameOverWindowClick(false);
            this.disposeGame();

            this.initGameArea();
        }

        /**
         * Animate loop
         */
        private animate():void
        {
            //console.log("brr.. " + this._isPaused);
            if(this._gamePad)
            {
                this._gamePad.update();
                //console.log("left: " +this._gamePad.isLeft + ", right: " + this._gamePad.isRight);
            }
            if(this._isPaused == true)
            {
                requestAnimFrame(this.animate);
                return;
            }

            if(this._titleScreen)
            {
                this._titleScreen.update();
            }

            if(this._levelSelectScreen)
            {
                this._levelSelectScreen.update();
            }

            if(this._platformManager)
            {
                this._platformManager.update();
            }

            if(this._hero)
            {
                if(this._gamePad)
                {
                    if(this._gamePad.isConencted)
                    {
                        //console.log("left: " +this._gamePad.isLeft + ", right: " + this._gamePad.isRight);
                        this._hero.setLeft(this._gamePad.isLeft);
                        this._hero.setRight(this._gamePad.isRight);
                    }

                }
                this._hero.update();

                //console.log("score: " + this._hero.score);
                if(this._container && this._hero.isAlive)
                {
                    // camera
                    if(this._hero.gfx.position.y < -300)
                    {
                        this._container.position.y = GameMain.GAME_DIMENSION.height - this._hero.gfx.position.y - 300;
                    }

                }

                if(this._hud && this._hero.isLevelComplete == false && this._hero.isAlive == true)
                {
                    this._hud.setScore(this._hero.getScore());
                }

            }

            if(this._cloud)
            {
                this._cloud.update();
            }


            // render
            this._renderer.render(this._stage);

            requestAnimFrame(this.animate);
            //console.log("update");
        }


        private resizeGameForMobile():void
        {
            console.log("resizeGameForMobile");
            var gameWidth:number = window.innerWidth;
            var gameHeight = window.innerHeight;

            var originalRatio:number = GameMain.GAME_DIMENSION.width / GameMain.GAME_DIMENSION.height;
            var newRatio:number = gameWidth / gameHeight;

            if(newRatio > originalRatio)
            {
                gameWidth = Math.round(gameHeight * originalRatio);
            }
            else
            {
                gameHeight = Math.round(gameWidth / originalRatio);
            }

            /*console.log("gw: " + gameWidth + ", hg: " + gameHeight);
            var scaleX = gameWidth / GameMain.GAME_DIMENSION.width;
            var scaleY = gameHeight / GameMain.GAME_DIMENSION.height;

            var scaleToFit = Math.min(scaleX, scaleY);
            console.log("fit " + scaleToFit);
            var scaleToCover = Math.max(scaleX, scaleY);
            console.log("cover " + scaleToCover);
             */

            this._gameRect.width = gameWidth;
            this._gameRect.height = gameHeight;

            this._renderer.view.style.height = gameHeight + "px";
            this._renderer.view.style.width = gameWidth + "px";

            if(this._background)
            {
                this._background.resizeGameForMobile(gameWidth, gameHeight);
            }
            if(this._hud)
            {
                this._hud.resizeGameForMobile(gameWidth, gameHeight);
            }

            if(this._levelSelectScreen)
            {
                this._levelSelectScreen.resizeGameForMobile(gameWidth, gameHeight);
            }

            var gameArea:HTMLElement = <HTMLElement> document.getElementById("container");
            gameArea.style.width = gameWidth + "px";
            gameArea.style.height = gameHeight + "px";

            /*gameArea.style.transformOrigin = "0 0";
            gameArea.style.transform = "scale(" + scaleToFit + ")";
            gameArea.style["WebkitTransform"] = "scale(" + scaleToFit + ")";
            gameArea.style["MozTransform"] = "scale(" + scaleToFit + ")";
            */
            gameArea.style.padding = "0px";
            gameArea.style.borderRadius = "0px";
            var topPadding:number = (window.innerHeight - gameHeight) >> 1;
            gameArea.style.paddingTop =  topPadding.toString() + "px";

            document.body.style.backgroundImage = "none";

            this._loaderArea.style.width = gameWidth + "px";
            this._loaderArea.style.height = gameHeight + "px";

            var header:HTMLElement = <HTMLElement> document.getElementById("header");
            header.style.display = "none";
        }

        private hideLoader():void
        {
            this._loaderArea.style.display = "none";
        }

        public disposeTitle():void
        {
            if(this._titleContainer)
            {
                DisplayObjectUtils.removeAllChildren(this._titleContainer);

                if(this._titleContainer.parent)
                {
                    this._stage.removeChild(this._titleContainer);
                }

            }


            if(this._titleScreen)
            {
                this._titleScreen.removeEventListener(GameEventType.START_GAME, this.onStartGameHL);
                this._titleScreen.dispose();
                this._titleScreen = null;
            }

            this._titleContainer = null;
        }

        private disposeLevelSelect():void
        {
            if(this._levelSelectScreen)
            {
                this._levelSelectScreen.removeEventListener(GameEventType.LEVEL_START, this.onLevelSelectHL);
                this._levelSelectScreen.dispose();
                this._levelSelectScreen = null;
            }

            if(this._levelScreenContainer)
            {
                if(this._levelScreenContainer.parent)
                {
                    this._stage.removeChild(this._levelScreenContainer);
                }
            }
            this._levelScreenContainer = null;
        }

        private disposeHero():void
        {
            if(this._hero)
            {
                this._hero.removeEventListener(GameEventType.LEVEL_COMPLETE, this.onLevelCompleteHL);
                this._hero.removeEventListener(GameEventType.LEVEL_COMPLETE, this.onLevelCompleteHL);
                this._hero.removeEventListener(GameEventType.TOGGLE_PAUSE, this.onLevelCompleteHL);
                this._hero.dispose();
                this._hero = null;
            }

        }
        public disposeGame():void
        {

            window.removeEventListener("blur", this.onWindowBlurHL, false);
            //document.removeEventListener("keydown", this.onKeyDownHL, false);

            this.disposeHero();

            if(this._platformManager)
            {
                this._platformManager.dispose();
                this._platformManager = null;
            }

            if(this._hud)
            {
                this._hud.removeEventListener(GameEventType.TOGGLE_PAUSE, this.onGamePauseHL);
                this._hud.removeEventListener(GameEventType.SHOW_MENU_FROM_GAME, this.ShowMenuFromGame);
                this._hud.dispose();
                this._hud = null;
            }

            if(this._cloud)
            {
                this._cloud.dispose();
                this._cloud = null;
            }


            if(this._container)
            {
                console.log("remove all child from Game container");
                DisplayObjectUtils.removeAllChildren(this._container);
            }

            if(this._cloudsContainer)
            {
                console.log("remove all child from Game container");
                DisplayObjectUtils.removeAllChildren(this._cloudsContainer);
            }

            this._container = null;
            this._cloudsContainer = null;

        }
    }
}

/////////////////////////

window.addEventListener("load", onLoad, false);
function onLoad(event)
{
    console.log("loaded!");
    new com.goldenratio.GameMain();
}
