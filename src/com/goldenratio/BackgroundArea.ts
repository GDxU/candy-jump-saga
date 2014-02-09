/**
 * Created by bear on 1/25/14.
 */

///<reference path="../../../definitions/pixi.d.ts"/>
///<reference path="utils/DeviceUtils.ts"/>
///<reference path="utils/DisplayObjectUtils.ts"/>
///<reference path="GameMain.ts"/>

module com.goldenratio
{
    export class BackgroundArea
    {
        private static DEFAULT_FRAME:string = "bg_grassland";

        public gfx:PIXI.Sprite;
        private _stage:PIXI.Stage;
        private _renderer:PIXI.IPixiRenderer;

        constructor()
        {

            var canvasElement:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("background_area");
            this._stage = new PIXI.Stage(0x000000, false);
            if(DeviceUtils.renderInWebGL())
            {
                this._renderer = PIXI.autoDetectRenderer(GameMain.GAME_DIMENSION.width, GameMain.GAME_DIMENSION.height, canvasElement, false);
            }
            else
            {
                this._renderer = new PIXI.CanvasRenderer(GameMain.GAME_DIMENSION.width, GameMain.GAME_DIMENSION.height, canvasElement, false);
            }


            this.gfx = PIXI.Sprite.fromFrame(BackgroundArea.DEFAULT_FRAME);
            //console.log(this.gfx);
            this.gfx.position.x = 0;
            this.gfx.position.y = 0;
            this.gfx.scale = new PIXI.Point(1, 1.2);
            //this.gfx.anchor.x = 0.5;
            this._stage.addChild(this.gfx);


            this.update();
        }

        public resizeGameForMobile(gameWidth:number, gameHeight:number):void
        {
            console.log("bg resize");
            this._renderer.view.style.height = gameHeight + "px";
            this._renderer.view.style.width = gameWidth + "px";

            this.update();
        }

        private update():void
        {
            // render
            this._renderer.render(this._stage);
        }

        public dispose():void
        {
            if(this.gfx)
            {
                this._stage.removeChild(this.gfx);
                this.gfx = null;
            }
            this._stage = null;
            this._renderer = null;
        }

    }
}