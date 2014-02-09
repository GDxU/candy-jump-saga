/**
 * Created by bear on 2/6/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../../../../definitions/touch.d.ts"/>
///<reference path="../utils/DisplayObjectUtils.ts"/>
///<reference path="../GameMain.ts"/>
///<reference path="../GameEventType.ts"/>
///<reference path="../SoundManager.ts"/>

module com.goldenratio
{
    export class TopControlsArea extends PIXI.EventTarget
    {

        private _menuGfx:PIXI.Sprite;
        private _soundOffGfx:PIXI.Sprite;
        private _soundOnGfx:PIXI.Sprite;
        private _pauseGfx:PIXI.Sprite;

        private _listRect:PIXI.Rectangle[] = [];
        private _hitRect:PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);
        private _ratioX:number = 1;
        private _ratioY:number = 1;
        private _soundFlag:boolean = true;


        private _container:PIXI.DisplayObjectContainer;
        private _divArea:HTMLElement;

        constructor(container:PIXI.DisplayObjectContainer)
        {
            super();
            this._container = container;

            this._menuGfx = PIXI.Sprite.fromFrame("menu_button");
            this._menuGfx.position.x = GameMain.GAME_DIMENSION.width - this._menuGfx.width;
            this._menuGfx.position.y = 2;

            this._pauseGfx = PIXI.Sprite.fromFrame("pause_icon");
            this._pauseGfx.position.x = this._menuGfx.position.x - this._pauseGfx.width;
            this._pauseGfx.position.y = 2;

            this._soundOnGfx = PIXI.Sprite.fromFrame("sound_on_icon");
            this._soundOnGfx.position.x = this._pauseGfx.position.x - this._soundOnGfx.width;
            this._soundOnGfx.position.y = 2;

            this._soundOffGfx = PIXI.Sprite.fromFrame("sound_off_icon");
            this._soundOffGfx.position.x = this._pauseGfx.position.x - this._soundOffGfx.width;
            this._soundOffGfx.position.y = 2;

            this._listRect.push(new PIXI.Rectangle(this._menuGfx.position.x , this._menuGfx.position.y,
                this._menuGfx.width, this._menuGfx.height));
            this._container.addChild(this._menuGfx);

            this._listRect.push(new PIXI.Rectangle(this._pauseGfx.position.x , this._pauseGfx.position.y,
                this._pauseGfx.width, this._pauseGfx.height));
            this._container.addChild(this._pauseGfx);

            this._listRect.push(new PIXI.Rectangle(this._soundOnGfx.position.x , this._soundOnGfx.position.y,
                this._soundOnGfx.width, this._soundOnGfx.height));
            this._container.addChild(this._soundOnGfx);
            this._container.addChild(this._soundOffGfx);

            this._soundOffGfx.visible = false;
            this._soundFlag = !SoundManager.muteState;
            if(this._soundFlag == true)
            {
                this._soundOnGfx.visible = true;
            }
            else
            {
                this._soundOffGfx.visible = true;
            }


            this.onWindowClickHL = this.onWindowClickHL.bind(this);
            this.onWindowTouchHL = this.onWindowTouchHL.bind(this);

            this._divArea = <HTMLElement> document.getElementById("container");
            this.enable(true);

        }

        public enable(state:boolean)
        {
            if(this._divArea)
            {
                this._divArea.removeEventListener("click", this.onWindowClickHL, false);
                this._divArea.removeEventListener("touchstart", this.onWindowTouchHL, false);
                if(state)
                {
                    this._divArea.addEventListener("click", this.onWindowClickHL, false);
                    this._divArea.addEventListener("touchstart", this.onWindowTouchHL, false);

                    this._menuGfx.alpha = 1;
                    this._soundOffGfx.alpha = 1;
                    this._soundOnGfx.alpha = 1;
                    this._pauseGfx.alpha = 1;
                }
                else
                {
                    this._menuGfx.alpha = 0.6;
                    this._soundOffGfx.alpha = 0.6;
                    this._soundOnGfx.alpha = 0.6;
                    this._pauseGfx.alpha = 0.6;
                }
            }
        }

        public resizeGameForMobile(gWidth:number, gHeight:number):void
        {
            //var ratio:number = gWidth / gHeight;

            this._ratioX = GameMain.GAME_DIMENSION.width / gWidth;
            this._ratioY = GameMain.GAME_DIMENSION.height / gHeight;

            console.log("top controls, ratio: " + this._ratioX);
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
        }

        private onWindowClickHL(event:any):void
        {
            //var target = event.target || event.srcElement;
           // console.log("target " + target);
            var rect:ClientRect = this._divArea.getBoundingClientRect();

            //console.log(rect);
            var mouseX:number = event.offsetX ? event.offsetX : event.clientX - rect.left;
            var mouseY:number = event.offsetY ? event.offsetY : event.clientY - rect.top;

            this.hitTestMousePosition(mouseX, mouseY);
            event.preventDefault();
        }

        private hitTestMousePosition(mouseX:number, mouseY:number):void
        {
            console.log("hitTestMousePosition " + mouseX + ", " + mouseY);
            mouseX = mouseX * this._ratioX;
            mouseY = mouseY * this._ratioY;
            console.log("top click.. " + mouseX + ", " + mouseY);
            for(var i:number = 0; i < this._listRect.length; i++)
            {

                this._hitRect = new PIXI.Rectangle(this._listRect[i].x, this._listRect[i].y,
                    this._listRect[i].width, this._listRect[i].height);

                if(this._hitRect.contains(mouseX, mouseY))
                {
                    console.log("hit id.. " + i);

                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    if(i == 0)
                    {
                        // menu
                        SoundManager.playClick();
                        data.type = GameEventType.SHOW_MENU_FROM_GAME;
                        this.dispatchEvent(data);
                        break;
                    }
                    else if(i == 1)
                    {
                        // pause
                        SoundManager.playClick();
                        console.log("pause game");
                        data.type = GameEventType.TOGGLE_PAUSE;
                        this.dispatchEvent(data);
                        break;
                    }
                    else if(i == 2)
                    {
                        // mute
                        SoundManager.playClick();
                        console.log("mute");
                        data.type = GameEventType.TOGGLE_MUTE;
                        this.dispatchEvent(data);
                        break;
                    }
                    /*var data:PIXI.IEvent = <PIXI.IEvent> {};
                     data.type = GameEventType.LEVEL_START;
                     data.content = i;
                     this.dispatchEvent(data);*/

                }
            }
        }

        public toggleMute():void
        {
            this._soundFlag = !this._soundFlag;
            console.log("sound flag " + this._soundFlag);
            this._soundOffGfx.visible = false;
            this._soundOnGfx.visible = false;

            if(this._soundFlag == true)
            {
                this._soundOnGfx.visible = true;
            }
            else
            {
                this._soundOffGfx.visible = true;
            }
            SoundManager.mute(!this._soundFlag);
        }

        public update():void
        {

        }


        public dispose():void
        {
            console.log("dispose controls!");
            if(this._divArea)
            {
                this._divArea.removeEventListener("click", this.onWindowClickHL, false);
                this._divArea.removeEventListener("touchstart", this.onWindowTouchHL, false);
                this._divArea = null;
            }

            this._listRect.length = 0;
            this._listRect = null;

            this._hitRect = null;
            this._menuGfx = null;
            this._pauseGfx = null;
            this._soundOffGfx = null;
            this._soundOnGfx = null;
            this._container = null;
        }
    }
}