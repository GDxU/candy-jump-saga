/**
 * Created by bear on 1/25/14.
 */

///<reference path="../../../../../definitions/pixi.d.ts"/>

module com.goldenratio
{
    export class BaseCandy
    {
        public textureList:PIXI.Texture[];
        public gfx:PIXI.MovieClip;
        public rect:PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);
        public isAlive:boolean = true;
        public canRemove:boolean = false;

        constructor()
        {
            this.gfx = new PIXI.MovieClip(this.textureList);
            this.gfx.gotoAndStop(0);
            this.gfx.scale = new PIXI.Point(0.5, 0.5);
            this.gfx.anchor = new PIXI.Point(0.5, 0.5);
            this.gfx.animationSpeed = 0.5;
            this.gfx.loop = false;

            this.rect.width = this.gfx.width;
            this.rect.height = this.gfx.height;

            this.gfx.onComplete = function(){
                this.canRemove = true;
                //console.log("ani complete!");
            }.bind(this);

            //console.log(this.rect.width);
        }

        public getScore():number
        {
            return 0;
        }

        public explode():void
        {
            this.isAlive = false;
            this.gfx.gotoAndPlay(1);
        }

        public setPosition(xPos:number, yPos:number):void
        {
            this.rect.x = xPos - (this.gfx.width >> 1);
            this.rect.y = yPos - (this.gfx.height >> 1);

            this.gfx.position.x = xPos;
            this.gfx.position.y = yPos;
        }

        public update():void
        {

        }

        public dispose():void
        {
            if(this.textureList)
            {
                this.textureList.length = 0;
            }
            this.textureList = null;
            this.rect = null;
            this.gfx = null;
        }

    }
}