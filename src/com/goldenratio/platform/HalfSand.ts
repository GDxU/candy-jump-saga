/**
 * Created by bear on 1/27/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="BasePlatform.ts"/>

module com.goldenratio
{
    export class HalfSand extends BasePlatform
    {
        private static FRAME_SINGLE:string = "sandHalf";
        private static FRAME_MID:string = "sandHalfMid";
        private static FRAME_LEFT:string = "sandHalfLeft";
        private static FRAME_RIGHT:string = "sandHalfRight";

        constructor(size:number)
        {
            super(size);

            if(size == 1)
            {
                this.gfx = new PIXI.DisplayObjectContainer();
                var gfxLeft:PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(HalfSand.FRAME_SINGLE));
                gfxLeft.position.x = 0;
                gfxLeft.width = 90;
                gfxLeft.alpha = 0.8;
                this.gfx.addChild(gfxLeft);

                this.rect = new PIXI.Rectangle(this.gfx.position.x, this.gfx.position.y,
                    this.gfx.position.x + 90, 70);

            }
            else
            {
                var textureMid:PIXI.Texture = PIXI.Texture.fromFrame(HalfSand.FRAME_MID);
                var textureLeft:PIXI.Texture = PIXI.Texture.fromFrame(HalfSand.FRAME_LEFT);
                var textureRight:PIXI.Texture = PIXI.Texture.fromFrame(HalfSand.FRAME_RIGHT);

                this.prepare(textureRight, textureMid, textureLeft);
            }

        }

        public explode()
        {
            this.isAlive = false;
        }

        public update():void
        {
            super.update();
            //console.log("sand update");
            //this.gfx.tilePosition.x += 0.1;
            if(this.isAlive == false && this.canRemove == false)
            {
                this.gfx.position.y += 8;
                this.gfx.alpha -= 0.02;

                if(this.gfx.alpha <= 0)
                {
                    this.canRemove = true;
                }
            }
        }

        public dispose():void
        {

        }

    }
}