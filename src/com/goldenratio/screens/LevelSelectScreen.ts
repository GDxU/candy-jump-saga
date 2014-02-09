/**
 * Created by bear on 2/2/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../../../../definitions/touch.d.ts"/>
///<reference path="../utils/DisplayObjectUtils.ts"/>
///<reference path="../utils/DeviceUtils.ts"/>
///<reference path="../GameMain.ts"/>
///<reference path="../GameEventType.ts"/>
///<reference path="../platform/data/LevelData.ts"/>

module com.goldenratio
{
    export class LevelSelectScreen extends PIXI.EventTarget
    {
        private _selectGfx:PIXI.Sprite;
        private _container:PIXI.DisplayObjectContainer;
        //private _list:PIXI.Sprite[] = [];
        private _listRect:PIXI.Rectangle[] = [];

        private _hitRect:PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);
        private _ratioX:number = 1;
        private _ratioY:number = 1;

        private _divArea:HTMLElement;
        private _borderGfx:PIXI.Graphics;
        public currentSelectPosition:number = 0;

        constructor(container:PIXI.DisplayObjectContainer)
        {
            super();
            console.log("level select area");
            this._container = container;

            this._selectGfx = PIXI.Sprite.fromFrame("select_level");
            this._selectGfx.position.x = (GameMain.GAME_DIMENSION.width >> 1) - (this._selectGfx.width >> 1);
            this._selectGfx.position.y = 50;
            this._container.addChild(this._selectGfx);

            this.onWindowClickHL = this.onWindowClickHL.bind(this);
            this.onWindowTouchHL = this.onWindowTouchHL.bind(this);

            var tx:number = 30;
            var ty:number = 110;
            for(var i:number = 0; i < LevelData.LIST.length; i++)
            {
                var gfx:PIXI.Sprite = PIXI.Sprite.fromFrame("hud_levelblock_" + (i + 1).toString());
                gfx.anchor.x = 0.5;
                gfx.anchor.y = 0.5;

                gfx.position.x = tx + (gfx.width >> 1);
                gfx.position.y = ty + (gfx.height >> 1);

                var rect:PIXI.Rectangle = new PIXI.Rectangle(tx, ty, gfx.width, gfx.height);
                this._listRect.push(rect);

                this._container.addChild(gfx);
                //this._list.push(gfx);
                tx += gfx.width + 20;

                if((i + 1) % 4 == 0)
                {
                    tx = 30;
                    ty += gfx.height + 30;
                }


            }

            this._borderGfx = new PIXI.Graphics();
            this._borderGfx.lineStyle(2, 0x0000ff, 0.6);
            this._borderGfx.drawRect(0, 0, gfx.width + 4, gfx.height + 4);

            this._container.addChild(this._borderGfx);
            this._borderGfx.position.x = this._listRect[0].x - 2;
            this._borderGfx.position.y = this._listRect[0].y - 2;
            this._borderGfx.visible = false;

            this._divArea = <HTMLElement> document.getElementById("container");
            this._divArea.addEventListener("touchstart", this.onWindowTouchHL, false);
            this._divArea.addEventListener("click", this.onWindowClickHL, false);

        }

        public moveLeft():void
        {
            if(this.currentSelectPosition <= 0)
            {
                return;
            }
            this.currentSelectPosition --;
            this.showBorder();
        }

        public moveRight():void
        {
            if(this.currentSelectPosition >= this._listRect.length - 1)
            {
                return;
            }
            this.currentSelectPosition ++;
            this.showBorder();
        }

        public showBorder(flag:boolean = true):void
        {
            this._borderGfx.position.x = this._listRect[this.currentSelectPosition].x - 2;
            this._borderGfx.position.y = this._listRect[this.currentSelectPosition].y - 2;
            this._borderGfx.visible = flag;
        }

        public resizeGameForMobile(gWidth:number, gHeight:number):void
        {
            //var ratio:number = gWidth / gHeight;

            this._ratioX = GameMain.GAME_DIMENSION.width / gWidth;
            this._ratioY = GameMain.GAME_DIMENSION.height / gHeight;

            console.log("ratio: " + this._ratioX);
        }

        private onWindowTouchHL(event:TouchEvent):void
        {
            var touch:Touch = event.touches[0];
            //var target:any = touch.target;

            //console.log("touch target " + target + ", " + touch.clientX);
            var rect:ClientRect =  this._divArea.getBoundingClientRect();

            var mouseX:number = touch.clientX - rect.left;
            var mouseY:number = touch.clientY - rect.top;

            this.hitTestMousePosition(mouseX, mouseY);

            event.preventDefault();
            event.stopPropagation();
        }

        private onWindowClickHL(event:any):void
        {
            //var target = event.target || event.srcElement;
            var rect:ClientRect = this._divArea.getBoundingClientRect();

            //console.log(rect.left);
            var mouseX:number = event.offsetX ? event.offsetX : event.clientX - rect.left;
            var mouseY:number = event.offsetY ? event.offsetY : event.clientY - rect.top;

            this.hitTestMousePosition(mouseX, mouseY);

            event.preventDefault();
            event.stopPropagation();

        }

        private hitTestMousePosition(mouseX:number, mouseY:number):void
        {
            mouseX = mouseX * this._ratioX;
            mouseY = mouseY * this._ratioY;
            console.log("click.. " + mouseX + ", " + mouseY);
            for(var i:number = 0; i < this._listRect.length; i++)
            {

                this._hitRect = new PIXI.Rectangle(this._listRect[i].x, this._listRect[i].y,
                    this._listRect[i].width, this._listRect[i].height);

                if(this._hitRect.contains(mouseX, mouseY))
                {
                    console.log("level.. " + i);

                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.LEVEL_START;
                    data.content = i;
                    this.dispatchEvent(data);
                    break;
                }
            }
        }

        public update():void
        {

        }

        public dispose():void
        {
            if(this._divArea)
            {
                this._divArea.removeEventListener("touchstart", this.onWindowTouchHL, false);
                this._divArea.removeEventListener("click", this.onWindowClickHL, false);
            }
            this._divArea = null;
            this._selectGfx = null;
            this._borderGfx = null;
            this._listRect.length = 0;
            this._listRect = null;
            this._hitRect = null;
            this._container = null;
        }
    }
}