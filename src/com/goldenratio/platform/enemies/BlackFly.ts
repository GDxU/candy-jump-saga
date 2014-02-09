/**
 * Created by bear on 2/1/14.
 */

///<reference path="../../../../../definitions/pixi.d.ts"/>
///<reference path="../../utils/DisplayObjectUtils.ts"/>
///<reference path="../../GameMain.ts"/>

module com.goldenratio
{
    export class BlackFly
    {
        private _textureList:PIXI.Texture[] = [];

        public gfx:PIXI.MovieClip;
        public rect:PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);
        private _direction:number = 0;

        constructor()
        {
            this._textureList = [
                PIXI.Texture.fromFrame("flyFly1"),
                PIXI.Texture.fromFrame("flyFly2")
            ];

            this.gfx = new PIXI.MovieClip(this._textureList);
            this.gfx.loop = true;
            this.gfx.anchor.x = 0.5;
            this.gfx.anchor.y = 0.5;
            this.gfx.animationSpeed = 0.2;
            this.gfx.gotoAndPlay(0);

            this.rect.width = this.gfx.width - 25;
            this.rect.height = this.gfx.height - 10;
        }

        public update():void
        {
            if(this._direction == 0)
            {
                return;
            }

            this.gfx.position.x += this._direction;
            this.gfx.scale.x = this._direction * -1;

            if((this.gfx.position.x) >= GameMain.GAME_DIMENSION.width ||
                this.gfx.position.x <= 0)
            {
                this._direction *= -1;
            }

            this.rect.x = (this.gfx.position.x) - (this.rect.width >> 1);
            this.rect.y = (this.gfx.position.y) - (this.rect.height >> 1);

            //console.log("x: " + this.rect.x + ", y: " + this.rect.y + ", width: " + this.rect.width + ", height: " + this.rect.height);
        }

        public setDirection(value:number)
        {
            this._direction = value;
        }

        public setPosition(xPos:number, yPos:number):void
        {
            this.rect.x = xPos - (this.rect.width >> 1);
            this.rect.y = yPos - (this.rect.height >> 1);

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

            this.rect = null;
            this.gfx = null;
        }

    }

}