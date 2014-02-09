/**
 * Created by bear on 1/30/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../utils/DisplayObjectUtils.ts"/>

module com.goldenratio
{
    export class WinFlag
    {
        private static DEFUALT_FRAME:string = "flagBlueHanging";
        private _textureList:PIXI.Texture[] = [];
        private _flagWaving:PIXI.MovieClip;
        private _deadFlag:PIXI.Sprite;

        public gfx:PIXI.DisplayObjectContainer;
        public rect:PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);
        public isWave:boolean = false;

        constructor()
        {
            this._deadFlag = PIXI.Sprite.fromFrame(WinFlag.DEFUALT_FRAME);
            this._textureList = [
                PIXI.Texture.fromFrame("flagBlue"),
                PIXI.Texture.fromFrame("flagBlue2")
            ];

            this._flagWaving = new PIXI.MovieClip(this._textureList);
            this._flagWaving.loop = true;
            this._flagWaving.animationSpeed = 0.1;

            this.gfx = new PIXI.DisplayObjectContainer();
            this.gfx.addChild(this._deadFlag);

            this.rect.width = this._deadFlag.width;
            this.rect.height = this._deadFlag.height;
        }


        public waveFlag():void
        {
            this.isWave = true;
            DisplayObjectUtils.removeAllChildren(this.gfx);
            this.gfx.addChild(this._flagWaving);
            this._flagWaving.gotoAndPlay(1);
        }

        public setPosition(xPos:number, yPos:number):void
        {
            this.rect.x = xPos;
            this.rect.y = yPos;

            this.gfx.position.x = xPos;
            this.gfx.position.y = yPos;
        }

        public dispose():void
        {
            DisplayObjectUtils.removeAllChildren(this.gfx);
            if(this._textureList)
            {
                this._textureList.length = 0;
                this._textureList = null;
            }

            this._flagWaving = null;
            this._deadFlag = null;
            this.rect = null;
            this.gfx = null;
        }

    }

}