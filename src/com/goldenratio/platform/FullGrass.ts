/**
 * Created by bear on 1/25/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="BasePlatform.ts"/>

module com.goldenratio
{
    export class FullGrass extends BasePlatform
    {
        private static FRAME_MID:string = "grassMid";
        private static FRAME_LEFT:string = "grassLeft";
        private static FRAME_RIGHT:string = "grassRight";

        constructor(size:number)
        {
            super(size);
            if(size < 2)
            {
                console.log("min block size is 2");
                return;
            }

            var textureMid:PIXI.Texture = PIXI.Texture.fromFrame(FullGrass.FRAME_MID);
            var textureLeft:PIXI.Texture = PIXI.Texture.fromFrame(FullGrass.FRAME_LEFT);
            var textureRight:PIXI.Texture = PIXI.Texture.fromFrame(FullGrass.FRAME_RIGHT);

            this.prepare(textureRight, textureMid, textureLeft);
        }

        public update():void
        {
            //this.gfx.tilePosition.x += 0.1;
        }

        public dispose():void
        {
            super.dispose();
        }

    }
}