/**
 * Created by bear on 1/25/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="BasePlatform.ts"/>

module com.goldenratio
{
    export class HalfGrass extends BasePlatform
    {
        private static FRAME_MID:string = "grassHalfMid";
        private static FRAME_LEFT:string = "grassHalfLeft";
        private static FRAME_RIGHT:string = "grassHalfRight";

        constructor(size:number)
        {
            super(size);

            var textureMid:PIXI.Texture = PIXI.Texture.fromFrame(HalfGrass.FRAME_MID);
            var textureLeft:PIXI.Texture = PIXI.Texture.fromFrame(HalfGrass.FRAME_LEFT);
            var textureRight:PIXI.Texture = PIXI.Texture.fromFrame(HalfGrass.FRAME_RIGHT);

            this.prepare(textureRight, textureMid, textureLeft);
        }

        public update():void
        {
            //this.gfx.tilePosition.x += 0.1;
            super.update();
        }

        public dispose():void
        {

        }

    }
}