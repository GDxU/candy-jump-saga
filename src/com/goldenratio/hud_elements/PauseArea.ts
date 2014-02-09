/**
 * Created by bear on 1/29/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../utils/DeviceUtils.ts"/>
///<reference path="../GameMain.ts"/>

module com.goldenratio
{
    export class PauseArea
    {

        private static FRAME_PAUSED:string = "paused";
        private static FRAME_TAP:string = "tap_to_resume";
        private static FRAME_CLICK:string = "click_to_resume";

        private _container:PIXI.DisplayObjectContainer;

        private _pausedGfx:PIXI.Sprite;
        private _resumeGfx:PIXI.Sprite;


        constructor(container:PIXI.DisplayObjectContainer)
        {
            this._container = container;

            this._pausedGfx = PIXI.Sprite.fromFrame(PauseArea.FRAME_PAUSED);
            var w:number = this._pausedGfx.width;

            this._pausedGfx.position.x = (GameMain.GAME_DIMENSION.width >> 1) - (w >> 1);
            this._pausedGfx.position.y = 200;

            if(DeviceUtils.isMobileDevice())
            {
                this._resumeGfx = PIXI.Sprite.fromFrame(PauseArea.FRAME_TAP);
            }
            else
            {
                this._resumeGfx = PIXI.Sprite.fromFrame(PauseArea.FRAME_CLICK);
            }

            this._resumeGfx.scale = new PIXI.Point(0.7, 0.7);
            w = this._resumeGfx.width;
            this._resumeGfx.position.x = ((GameMain.GAME_DIMENSION.width >> 1) - (w >> 1)) - 5;
            this._resumeGfx.position.y = this._pausedGfx.position.y + this._pausedGfx.height + 50;


        }

        public show():void
        {
            console.log("show pause!");
            this.hide();
            this._container.addChild(this._pausedGfx);
            this._container.addChild(this._resumeGfx);
        }

        public hide():void
        {
            if(this._pausedGfx.parent)
            {
                this._container.removeChild(this._pausedGfx);
            }

            if(this._resumeGfx.parent)
            {
                this._container.removeChild(this._resumeGfx);
            }
        }

        public dispose():void
        {
            this._resumeGfx = null;
            this._pausedGfx = null;

            this._container = null;
        }

    }
}