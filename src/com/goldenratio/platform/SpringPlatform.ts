/**
 * Created by bear on 1/27/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../utils/DisplayObjectUtils.ts"/>

module com.goldenratio
{
    export class SpringPlatform
    {
        private static FRAME_DOWN:number = 0;
        private static FRAME_UP:number = 1;

        private _textureList:PIXI.Texture[] = [];
        private _springMC:PIXI.MovieClip;
        public gfx:PIXI.DisplayObjectContainer;
        public rect:PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);

        public isBounce:boolean = false;

        constructor()
        {
            this._textureList = [
                PIXI.Texture.fromFrame("springboardDown"),
                PIXI.Texture.fromFrame("springboardUp")
            ];

            this._springMC = new PIXI.MovieClip(this._textureList);
            this._springMC.loop = false;
            this._springMC.gotoAndStop(SpringPlatform.FRAME_UP);

            this._springMC.scale = new PIXI.Point(0.5, 0.5);
            this.gfx = new PIXI.DisplayObjectContainer();
            this.gfx.addChild(this._springMC);


            this.rect.width = this._springMC.width;
            this.rect.height = this._springMC.height;
        }



        public setPosition(xPos:number, yPos:number):void
        {
            this.rect.x = xPos;
            this.rect.y = yPos;

            this.gfx.position.x = xPos;
            this.gfx.position.y = yPos;
        }

        public bounce():void
        {
            this.isBounce = true;
            this._springMC.gotoAndStop(SpringPlatform.FRAME_DOWN);
        }

        public dispose():void
        {
            DisplayObjectUtils.removeAllChildren(this.gfx);
            if(this._textureList)
            {
                this._textureList.length = 0;
                this._textureList = null;
            }

            this._springMC = null;
            this.gfx = null;
        }

    }

}