/**
 * Created by bear on 1/26/14.
 */


///<reference path="../../../definitions/pixi.d.ts"/>
///<reference path="utils/DeviceUtils.ts"/>
///<reference path="GameMain.ts"/>
///<reference path="hud_elements/ScoreArea.ts"/>
///<reference path="hud_elements/PauseArea.ts"/>
///<reference path="hud_elements/GameOverArea.ts"/>
///<reference path="hud_elements/TopControlsArea.ts"/>
///<reference path="utils/DisplayObjectUtils.ts"/>
///<reference path="GameEventType.ts"/>

module com.goldenratio
{
    export class HudArea extends PIXI.EventTarget
    {
        private _stage:PIXI.Stage;
        private _renderer:PIXI.IPixiRenderer;

        private _container:PIXI.DisplayObjectContainer;
        private _scoreArea:ScoreArea;
        private _pauseArea:PauseArea;
        private _gameOverArea:GameOverArea;
        private _topControls:TopControlsArea;

        private _canAnimate:boolean = false;

        constructor()
        {
            super();
            var canvasElement:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("hud_area");
            this._stage = new PIXI.Stage(0xffffff, false);
            if(DeviceUtils.renderInWebGL())
            {
                this._renderer = PIXI.autoDetectRenderer(GameMain.GAME_DIMENSION.width, GameMain.GAME_DIMENSION.height, canvasElement, true);
            }
            else
            {
                this._renderer = new PIXI.CanvasRenderer(GameMain.GAME_DIMENSION.width, GameMain.GAME_DIMENSION.height, canvasElement, true);
            }

            this.init();

        }

        private init():void
        {
            this._container = new PIXI.DisplayObjectContainer();
            this._stage.addChild(this._container);

            this._scoreArea = new ScoreArea(this._container);
            this._scoreArea.setScore(0);

            this._pauseArea = new PauseArea(this._container);
            this._gameOverArea = new GameOverArea(this._container);
            this._topControls = new TopControlsArea(this._container);


            this.onGamePause = this.onGamePause.bind(this);
            this.onToggleMuteHL = this.onToggleMuteHL.bind(this);
            this.onShowMenuFromGame = this.onShowMenuFromGame.bind(this);

            this.update = this.update.bind(this);
            this.animate = this.animate.bind(this);

            if(this._topControls)
            {
                this._topControls.addEventListener(GameEventType.TOGGLE_PAUSE, this.onGamePause);
                this._topControls.addEventListener(GameEventType.TOGGLE_MUTE, this.onToggleMuteHL);
                this._topControls.addEventListener(GameEventType.SHOW_MENU_FROM_GAME, this.onShowMenuFromGame);

            }

            this.update();
        }

        private onShowMenuFromGame(event:PIXI.IEvent):void
        {
            var data:PIXI.IEvent = <PIXI.IEvent> {};
            data.type = GameEventType.SHOW_MENU_FROM_GAME;
            this.dispatchEvent(data);
        }

        private onGamePause(event:PIXI.IEvent):void
        {
            console.log("HUD game pause!");
            var data:PIXI.IEvent = <PIXI.IEvent> {};
            data.type = GameEventType.TOGGLE_PAUSE;
            this.dispatchEvent(data);
        }

        public onToggleMuteHL(event:PIXI.IEvent):void
        {
            console.log("HUD toggle mute!");
            if(this._topControls)
            {
                this._topControls.toggleMute();
            }

            this.update();
        }


        /**
         * Update score in HUD
         * @param value
         */
        public setScore(value:number)
        {
            //console.log("setScore " + value);
            if(this._scoreArea.scoreValue != value)
            {
                console.log("set score.. hud " + value);
                this._scoreArea.setScore(value);
                this.update();
            }
        }

        public showPause(state:boolean)
        {
            if(state)
            {
                this._pauseArea.show();
                this._topControls.enable(false);
            }
            else
            {
                this._pauseArea.hide();
                this._topControls.enable(true);
            }

            this.update();
        }


        public showGameOver(bonusScore:number, totalScore:number):void
        {
            if(this._gameOverArea.isVisible == false)
            {
                this._topControls.enable(false);
                this._scoreArea.clear();
                this._gameOverArea.setScores(bonusScore, totalScore);
                this._gameOverArea.showGameOver();
                this._canAnimate = true;
                this.animate();
            }
        }

        public showLevelComplete(bonusScore:number, totalScore:number):void
        {
            if(this._gameOverArea.isVisible == false)
            {
                this._scoreArea.clear();
                this._gameOverArea.setScores(bonusScore, totalScore);
                this._gameOverArea.showLevelComplete();
                this._canAnimate = true;
                this.animate();
            }
        }

        public showGameComplete(bonusScore:number, totalScore:number):void
        {
            if(this._gameOverArea.isVisible == false)
            {
                console.log("HUD >> show Game Complete!");

                this._topControls.enable(false);
                this._scoreArea.clear();
                this._gameOverArea.setScores(bonusScore, totalScore);
                this._gameOverArea.showGameComplete();
                this._canAnimate = true;
                this.animate();
            }
        }

        public hideGameOver():void
        {
            if(this._gameOverArea.isVisible == true)
            {
                this._topControls.enable(true);
                this._gameOverArea.hide();
                this._canAnimate = false;
                this.animate();
            }
        }

        /**
         * Resize HUD area for mobile devices
         * @param gameWidth
         * @param gameHeight
         */
        public resizeGameForMobile(gameWidth:number, gameHeight:number):void
        {
            this._renderer.view.style.height = gameHeight + "px";
            this._renderer.view.style.width = gameWidth + "px";

            if(this._topControls)
            {
                this._topControls.resizeGameForMobile(gameWidth, gameHeight);
            }
        }

        private animate():void
        {
            if(this._gameOverArea)
            {
                if(this._gameOverArea.isVisible)
                {
                    this._gameOverArea.update();
                }
            }

            this.update();

            if(this._canAnimate)
            {
                requestAnimFrame(this.animate);
            }
        }

        private update():void
        {
            // render
            if(this._renderer && this._stage)
            {
                this._renderer.render(this._stage);
            }

        }

        /**
         * Dispose
         */
        public dispose():void
        {
            console.log("hud dispose");
            if(this._container)
            {
                console.log("remove all children from hud container");
                DisplayObjectUtils.removeAllChildren(this._container);
            }

            if(this._scoreArea)
            {
                this._scoreArea.dispose();
                this._scoreArea = null;
            }

            if(this._pauseArea)
            {
                this._pauseArea.dispose();
                this._pauseArea = null;
            }

            if(this._gameOverArea)
            {
                this._gameOverArea.dispose();
                this._gameOverArea = null;
            }

            if(this._topControls)
            {
                this._topControls.removeEventListener(GameEventType.TOGGLE_PAUSE, this.onGamePause);
                this._topControls.removeEventListener(GameEventType.TOGGLE_MUTE, this.onToggleMuteHL);
                this._topControls.removeEventListener(GameEventType.SHOW_MENU_FROM_GAME, this.onToggleMuteHL);

                this._topControls.dispose();
                this._topControls = null;
            }


            this._container = null;
            this.update();
            this._stage = null;
            this._renderer = null;
        }

    }
}