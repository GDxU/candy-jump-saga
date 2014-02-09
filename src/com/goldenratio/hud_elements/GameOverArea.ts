/**
 * Created by bear on 1/29/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../utils/DeviceUtils.ts"/>
///<reference path="../utils/DisplayObjectUtils.ts"/>
///<reference path="../GameMain.ts"/>

module com.goldenratio
{
    export class GameOverArea
    {
        private static FRAME_NUMBERS:string = "hud_";

        private static FRAME_GAMEOVER:string = "gameover";
        private static FRAME_GAMECOMPLETE:string = "gamecomplete";
        private static FRAME_LEVELCOMPLETE:string = "level_complete";
        private static FRAME_TAP:string = "tap_to_play";
        private static FRAME_CLICK:string = "click_to_play";

        private _container:PIXI.DisplayObjectContainer;
        private _playGfx:PIXI.Sprite;
        private _gameOverGfx:PIXI.Sprite;
        private _gameCompleteGfx:PIXI.Sprite;
        private _levelCompleteGfx:PIXI.Sprite;

        private _totalScoreContainer:PIXI.DisplayObjectContainer;
        private _scoreDigits:PIXI.DisplayObjectContainer;

        public isVisible:boolean = false;

        constructor(container:PIXI.DisplayObjectContainer)
        {
            this._container = container;

            if(DeviceUtils.isMobileDevice())
            {
                this._playGfx = PIXI.Sprite.fromFrame(GameOverArea.FRAME_TAP);
            }
            else
            {
                this._playGfx = PIXI.Sprite.fromFrame(GameOverArea.FRAME_CLICK);
            }

            this._playGfx.scale = new PIXI.Point(0.8, 0.8);
            this._playGfx.position.x = (GameMain.GAME_DIMENSION.width >> 1) - (this._playGfx.width >> 1);
            this._playGfx.position.y = 400;

            this._playGfx.alpha = 0;

            this._gameOverGfx = PIXI.Sprite.fromFrame(GameOverArea.FRAME_GAMEOVER);
            this._gameOverGfx.position.x = (GameMain.GAME_DIMENSION.width >> 1) - (this._gameOverGfx.width >> 1);
            this._gameOverGfx.position.y = 200;
            this._gameOverGfx.alpha = 0;

            this._gameCompleteGfx = PIXI.Sprite.fromFrame(GameOverArea.FRAME_GAMECOMPLETE);
            this._gameCompleteGfx.position.x = (GameMain.GAME_DIMENSION.width >> 1) - (this._gameCompleteGfx.width >> 1);
            this._gameCompleteGfx.position.y = 100;
            this._gameCompleteGfx.alpha = 0;


            this._levelCompleteGfx = PIXI.Sprite.fromFrame(GameOverArea.FRAME_LEVELCOMPLETE);
            this._levelCompleteGfx.position.x = (GameMain.GAME_DIMENSION.width >> 1) - (this._levelCompleteGfx.width >> 1);
            this._levelCompleteGfx.position.y = 100;
            this._levelCompleteGfx.alpha = 0;


            this._totalScoreContainer = new PIXI.DisplayObjectContainer();
            var scoreGfx:PIXI.Sprite = PIXI.Sprite.fromFrame("score");
            this._totalScoreContainer.addChild(scoreGfx);


            this._scoreDigits = new PIXI.DisplayObjectContainer();
            this._scoreDigits.scale = new PIXI.Point(0.7, 0.7);
            this._scoreDigits.position.x = scoreGfx.width;
            this._scoreDigits.position.y = 5;

            this._totalScoreContainer.addChild(this._scoreDigits);

            this._totalScoreContainer.alpha = 0;

        }

        public update()
        {
            if(this._playGfx)
            {
                if(this._playGfx.alpha < 1)
                {
                    this._playGfx.alpha += 0.1;
                }

            }

            if(this._gameOverGfx)
            {
                if(this._gameOverGfx.alpha < 1)
                {
                    this._gameOverGfx.alpha += 0.1;
                }
            }

            if(this._gameCompleteGfx)
            {
                if(this._gameCompleteGfx.alpha < 1)
                {
                    this._gameCompleteGfx.alpha += 0.1;
                }
            }
            if(this._levelCompleteGfx)
            {
                if(this._levelCompleteGfx.alpha < 1)
                {
                    this._levelCompleteGfx.alpha += 0.1;
                }
            }

            if(this._totalScoreContainer)
            {
                if(this._totalScoreContainer.alpha < 1)
                {
                    this._totalScoreContainer.alpha += 0.1;
                }
            }
        }

        public setScores(bonus:number, totalScore:number):void
        {
            console.log("gameover setScores.. " + totalScore);

            //DisplayObjectUtils.removeAllChildren(this._bonusDigits);
            DisplayObjectUtils.removeAllChildren(this._scoreDigits);

            var i:number;
            var digit:PIXI.Sprite;
            var tx:number = 0;
            var str:string = totalScore.toString();
            for(i = 0; i < str.length; i++)
            {
                digit = PIXI.Sprite.fromFrame(GameOverArea.FRAME_NUMBERS + str.charAt(i).toString());
                digit.position.x = tx;
                this._scoreDigits.addChild(digit);

                tx += digit.width;
            }

            var tWidth:number = this._scoreDigits.position.x + tx;
            this._totalScoreContainer.position.y = this._gameOverGfx.position.y + this._gameOverGfx.height + 50;
            this._totalScoreContainer.position.x = 15 + (GameMain.GAME_DIMENSION.width >> 1) - (tWidth >> 1);

        }

        public showLevelComplete():void
        {
            if(this.isVisible == true)
            {
                return;
            }
            this.isVisible = true;

            console.log("show game complete gfx");

            this._container.addChild(this._levelCompleteGfx);
            this._container.addChild(this._playGfx);

            this._totalScoreContainer.alpha = 1;
            console.log(this._totalScoreContainer.alpha);
            console.log(this._totalScoreContainer.children.length);
            console.log(this._totalScoreContainer.position.x);
            console.log(this._totalScoreContainer.position.y);
            this._container.addChild(this._totalScoreContainer);
        }

        public showGameComplete():void
        {
            if(this.isVisible == true)
            {
                return;
            }
            this.isVisible = true;

            console.log("show game complete gfx");

            this._container.addChild(this._gameCompleteGfx);
            this._container.addChild(this._playGfx);

            this._totalScoreContainer.alpha = 1;
            console.log(this._totalScoreContainer.alpha);
            console.log(this._totalScoreContainer.children.length);
            console.log(this._totalScoreContainer.position.x);
            console.log(this._totalScoreContainer.position.y);
            this._container.addChild(this._totalScoreContainer);

        }

        public showGameOver():void
        {
            if(this.isVisible == true)
            {
                console.warn("cannot show gameover!");
                return;
            }
            this.isVisible = true;

            console.log("show gameover gfx");

            this._container.addChild(this._gameOverGfx);
            this._container.addChild(this._playGfx);

            //this._container.addChild(this._bonusScoreContainer);
            this._container.addChild(this._totalScoreContainer);
        }

        private clear():void
        {
            this._playGfx.alpha = 0;
            if(this._playGfx.parent)
            {
                this._container.removeChild(this._playGfx);
            }

            if(this._gameOverGfx.parent)
            {
                this._container.removeChild(this._gameOverGfx);
            }

            if(this._gameCompleteGfx.parent)
            {
                this._container.removeChild(this._gameCompleteGfx);
            }

            if(this._levelCompleteGfx.parent)
            {
                this._container.removeChild(this._levelCompleteGfx);
            }


            if(this._totalScoreContainer)
            {
                if(this._totalScoreContainer.parent)
                {
                    this._container.removeChild(this._totalScoreContainer);
                }
            }
            this._totalScoreContainer.alpha = 0;

        }

        public hide():void
        {
            this.isVisible = false;
            this.clear();

        }

        public dispose():void
        {
            this.clear();
            if(this._totalScoreContainer)
            {
                DisplayObjectUtils.removeAllChildren(this._totalScoreContainer);
            }
            this._playGfx = null;
            this._totalScoreContainer = null;
            this._gameCompleteGfx = null;
            this._gameOverGfx = null;
            this._totalScoreContainer = null;
            this._container = null;
        }

    }
}