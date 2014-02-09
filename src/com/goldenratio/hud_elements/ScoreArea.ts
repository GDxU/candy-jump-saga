/**
 * Created by bear on 1/27/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../utils/DisplayObjectUtils.ts"/>

module com.goldenratio
{
    export class ScoreArea
    {

        private static FRAME_PREFIX:string = "hud_";

        private _container:PIXI.DisplayObjectContainer;
        private _gfx:PIXI.DisplayObjectContainer;
        private _digit:PIXI.Sprite;

        public scoreValue:number = -1;

        constructor(container:PIXI.DisplayObjectContainer)
        {
            this._container = container;
            this._gfx = new PIXI.DisplayObjectContainer();
            this._gfx.position.x = 5;
            this._gfx.position.y = 5;
            this._gfx.scale = new PIXI.Point(0.5, 0.5);
            this._container.addChild(this._gfx);
        }

        public setScore(scoreData:number):void
        {
            if(this.scoreValue == scoreData)
            {
                return;
            }

            this.scoreValue = scoreData;


            DisplayObjectUtils.removeAllChildren(this._gfx);

            var str:string = this.scoreValue.toString();
            var tx:number = 0;
            for(var i:number = 0; i < str.length; i++)
            {
                this._digit = PIXI.Sprite.fromFrame(ScoreArea.FRAME_PREFIX + str.charAt(i).toString());
                this._digit.position.x = tx;
                this._gfx.addChild(this._digit);

                tx += this._digit.width;
            }
        }

        public clear():void
        {
            console.log("score area clear!");
            if(this._gfx)
            {
                DisplayObjectUtils.removeAllChildren(this._gfx);
            }
        }

        public dispose():void
        {
            if(this._gfx)
            {
                DisplayObjectUtils.removeAllChildren(this._gfx);
                this._gfx = null;
            }

            this._container = null;
            this._digit = null;

        }

    }
}