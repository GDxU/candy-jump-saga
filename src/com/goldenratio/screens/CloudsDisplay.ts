/**
 * Created by bear on 1/27/14.
 */
///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../utils/DisplayObjectUtils.ts"/>
///<reference path="../GameMain.ts"/>

module com.goldenratio
{
    export class CloudsDisplay
    {
        private static FRAME_CLOUD:string[] = ["cloud1", "cloud2", "cloud3"];

        private _container:PIXI.DisplayObjectContainer;
        private _list:PIXI.Sprite[] = [];

        constructor(container:PIXI.DisplayObjectContainer)
        {
            this._container = container;

            for(var i:number = 0; i < 6; i++)
            {
                var gfx:PIXI.Sprite = PIXI.Sprite.fromFrame(CloudsDisplay.FRAME_CLOUD[Math.floor(Math.random() * 2)]);
                gfx.alpha = 0.9;

                var scale:number = this.getRandomScale();
                gfx.scale.x = scale;
                gfx.scale.y = scale;

                gfx.position.x = this.getRandomX(gfx.width, i);
                gfx.position.y = this.getRandomY();
                this._container.addChild(gfx);

                this._list.push(gfx);
            }
        }

        private getRandomScale():number
        {
            return (Math.floor((Math.random() * 1) * 10) / 10) + 0.5;
        }

        private getRandomX(width:number, i:number):number
        {
            //return (Math.floor(Math.random() * (200 + ())) + width) * -1;

            return (((i + 1) * 100) + width) * -1;
        }

        private getRandomY():number
        {
            return Math.floor(Math.random() * GameMain.GAME_DIMENSION.height);
        }

        public update()
        {
            for(var i:number = 0; i < this._list.length; i++)
            {
                this._list[i].position.x += 0.5;

                if(this._list[i].position.x > GameMain.GAME_DIMENSION.width + 50)
                {
                    this._list[i].position.x = this.getRandomX(this._list[i].width, i);
                    this._list[i].position.y = this.getRandomY();

                    var scale:number = this.getRandomScale();
                    this._list[i].scale.x = scale;
                    this._list[i].scale.y = scale;

                }
            }
        }

        public dispose():void
        {
            this._list.length = 0;
            this._list = null;
            this._container = null;
        }

    }
}