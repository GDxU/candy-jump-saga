/**
 * Created by bear on 1/25/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../GameMain.ts"/>

module com.goldenratio
{
    export class BasePlatform
    {

        public gfx:PIXI.DisplayObjectContainer;
        public rect:PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);
        public canRemove:boolean = false;
        public isAlive:boolean = true;

        private _spriteWidth:number = 70;
        private _direction:number = 0;

        constructor(public size:number)
        {

        }

        public prepare(textureRight:PIXI.Texture, textureMid:PIXI.Texture, textureLeft:PIXI.Texture):void
        {
            this.gfx = new PIXI.DisplayObjectContainer();
            var gfxLeft:PIXI.Sprite = new PIXI.Sprite(textureLeft);
            gfxLeft.position.x = 0;
            this.gfx.addChild(gfxLeft);

            var tsep:number = gfxLeft.position.x + this._spriteWidth;
            for(var i:number = 0; i < this.size - 2; i++)
            {
                var gfxMid:PIXI.Sprite = new PIXI.Sprite(textureMid);
                gfxMid.position.x = (i + 1) * this._spriteWidth;
                this.gfx.addChild(gfxMid);

                tsep = gfxMid.position.x + this._spriteWidth;
            }

            var gfxRight:PIXI.Sprite = new PIXI.Sprite(textureRight);
            if(this.size == 1)
            {
                gfxRight.position.x = 22;
            }
            else
            {
                gfxRight.position.x = tsep;
            }

            this.gfx.addChild(gfxRight);

            this.rect = new PIXI.Rectangle(this.gfx.position.x, this.gfx.position.y,
                gfxRight.position.x + 70, 70);


        }

        public setPosition(xPos:number, yPos:number):void
        {
            this.rect.x = xPos;
            this.rect.y = yPos;

            this.gfx.position.x = xPos;
            this.gfx.position.y = yPos;
        }

        public setDirection(value:number)
        {
            this._direction = value;
        }

        public explode():void
        {

        }

        public update():void
        {
            if(this._direction == 0)
            {
                return;
            }

            this.gfx.position.x += 1 * this._direction;
            if((this.gfx.position.x + this.rect.width) >= GameMain.GAME_DIMENSION.width ||
                this.gfx.position.x <= 0)
            {
                this._direction *= -1;
            }

            this.rect.x = this.gfx.position.x;
            this.rect.y = this.gfx.position.y;
        }

        public dispose():void
        {
            this.gfx = null;
            this.rect = null
        }

    }
}