/**
 * Created by bear on 2/2/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="../../../../definitions/touch.d.ts"/>
///<reference path="../utils/DisplayObjectUtils.ts"/>
///<reference path="../utils/DeviceUtils.ts"/>
///<reference path="../GameMain.ts"/>
///<reference path="../GameEventType.ts"/>

module com.goldenratio
{
    export class TitleScreen extends PIXI.EventTarget
    {

        private static FRAME_INFO_MOBILE:string = "instruction_mobile";
        private static FRAME_INFO_DESKTOP:string = "instruction_desktop";
        private static FRAME_TAP:string = "tap_to_play";
        private static FRAME_CLICK:string = "click_to_play";

        private _playGfx:PIXI.Sprite;
        private _infoGfx:PIXI.Sprite;
        private _creditGfx:PIXI.Sprite;
        private _logo:PIXI.Sprite;
        private _gamepadConnected:PIXI.Sprite;
        private _gamepadDisconnected:PIXI.Sprite;
        private _container:PIXI.DisplayObjectContainer;

        private _creditsWidth:number = 0;

        private _divArea:HTMLElement;
        private _isClick:boolean = false;

        constructor(container:PIXI.DisplayObjectContainer)
        {
            super();
            this._container = container;

            if(DeviceUtils.isMobileDevice())
            {
                this._playGfx = PIXI.Sprite.fromFrame(TitleScreen.FRAME_TAP);
                this._infoGfx = PIXI.Sprite.fromFrame(TitleScreen.FRAME_INFO_MOBILE);
            }
            else
            {
                this._playGfx = PIXI.Sprite.fromFrame(TitleScreen.FRAME_CLICK);
                this._infoGfx = PIXI.Sprite.fromFrame(TitleScreen.FRAME_INFO_DESKTOP);

                this._gamepadConnected = PIXI.Sprite.fromFrame("gamepad_connected");
                this._gamepadDisconnected = PIXI.Sprite.fromFrame("gamepad_not_connected");
            }

            if(this._gamepadConnected)
            {
                this._gamepadConnected.position.x = 4;
                this._gamepadConnected.position.y = 4;
                this._container.addChild(this._gamepadConnected);

                this._gamepadConnected.visible = false;
            }

            if(this._gamepadDisconnected)
            {
                this._gamepadDisconnected.position.x = 4;
                this._gamepadDisconnected.position.y = 4;
                this._container.addChild(this._gamepadDisconnected);

                this._gamepadDisconnected.visible = false;
            }

            this._logo = PIXI.Sprite.fromFrame("title_logo");
            this._logo.position.y = 50;
            this._container.addChild(this._logo);

            this._infoGfx.scale = new PIXI.Point(0.8, 0.8);
            this._infoGfx.position.x = (GameMain.GAME_DIMENSION.width >> 1) - (this._infoGfx.width >> 1);
            this._infoGfx.position.y = 390;
            this._container.addChild(this._infoGfx);

            this._playGfx.scale = new PIXI.Point(0.8, 0.8);
            this._playGfx.position.x = (GameMain.GAME_DIMENSION.width >> 1) - (this._playGfx.width >> 1);
            this._playGfx.position.y = 450;
            this._container.addChild(this._playGfx);

            this._creditGfx = PIXI.Sprite.fromFrame("credits");
            this._creditGfx.position.x = 0;
            this._creditGfx.position.y = GameMain.GAME_DIMENSION.height - this._creditGfx.height;
            this._container.addChild(this._creditGfx);

            this._creditsWidth = this._creditGfx.width;

            this.onWindowClickHL = this.onWindowClickHL.bind(this);
            this.onWindowTouchStartHL = this.onWindowTouchStartHL.bind(this);
            this.onWindowTouchEndHL = this.onWindowTouchEndHL.bind(this);

            this._divArea = <HTMLElement> document.getElementById("container");
            this._divArea.addEventListener("click", this.onWindowClickHL, false);

            this.toggleWindowClick(true);
            this.showGamepadConnected(false);
        }

        private toggleWindowClick(state:boolean):void
        {
            this._divArea.removeEventListener("click", this.onWindowClickHL, false);
            this._divArea.removeEventListener("touchend", this.onWindowTouchEndHL, false);
            this._divArea.removeEventListener("touchstart", this.onWindowTouchStartHL, false);


            if(state)
            {
                this._divArea.addEventListener("click", this.onWindowClickHL, false);
                this._divArea.addEventListener("touchend", this.onWindowTouchEndHL, false);
                this._divArea.addEventListener("touchstart", this.onWindowTouchStartHL, false);
            }

        }

        private onWindowTouchStartHL(event:TouchEvent):void
        {
            this._isClick = true;
        }

        private onWindowTouchEndHL(event:TouchEvent):void
        {
            if(this._isClick == false)
            {
                return;
            }

            this.onWindowClickHL(null);

            event.preventDefault();
            event.stopPropagation();
        }

        public showGamepadConnected(state:boolean):void
        {
            console.log("showGamepadConnected " + state);
            if(!this._gamepadConnected)
                return;

            this._gamepadConnected.visible = false;
            this._gamepadDisconnected.visible = false;

            if(state)
            {
                this._gamepadConnected.visible = true;
            }
            else
            {
                this._gamepadDisconnected.visible = true;
            }
        }

        private onWindowClickHL(event:MouseEvent):void
        {
            console.log("start game!");
            this.toggleWindowClick(false);

            var data:PIXI.IEvent = <PIXI.IEvent> {};
            data.type = GameEventType.START_GAME;
            this.dispatchEvent(data);


            //this.disposeTitle();

            //this.initLevelSelectArea();
            if(event)
            {
                event.preventDefault();
                event.stopPropagation();
            }

        }


        public update():void
        {
            if(this._creditGfx)
            {
                this._creditGfx.position.x -= 0.5;

                if(this._creditGfx.position.x <= -this._creditsWidth)
                {
                    this._creditGfx.position.x = GameMain.GAME_DIMENSION.width;
                }
            }
        }

        public dispose():void
        {
            this.toggleWindowClick(false);
            this._playGfx = null;
            this._infoGfx = null;
            this._creditGfx = null;
            this._logo = null;
            this._divArea = null;
            this._container = null;
        }
    }

}