/**
 * Created by bear on 2/7/14.
 */

///<reference path="../../../definitions/pixi.d.ts"/>
///<reference path="../../../definitions/gamepad.d.ts"/>
///<reference path="utils/DeviceUtils.ts"/>
///<reference path="GameEventType.ts"/>

module com.goldenratio
{
    export class GamepadControl extends PIXI.EventTarget
    {

        private BUTTONS:Object = {
                                            FACE_1: 0, // Face (main) buttons
                                            FACE_2: 1,
                                            FACE_3: 2,
                                            FACE_4: 3,
                                            LEFT_SHOULDER: 4, // Top shoulder buttons
                                            RIGHT_SHOULDER: 5,
                                            LEFT_SHOULDER_BOTTOM: 6, // Bottom shoulder buttons
                                            RIGHT_SHOULDER_BOTTOM: 7,
                                            SELECT: 8,
                                            START: 9,
                                            LEFT_ANALOGUE_STICK: 10, // Analogue sticks (if depressible)
                                            RIGHT_ANALOGUE_STICK: 11,
                                            PAD_TOP: 12, // Directional (discrete) pad
                                            PAD_BOTTOM: 13,
                                            PAD_LEFT: 14,
                                            PAD_RIGHT: 15
                                        };

        private AXES:Object = {
                                    LEFT_ANALOGUE_HOR: 0,
                                    LEFT_ANALOGUE_VERT: 1,
                                    RIGHT_ANALOGUE_HOR: 2,
                                    RIGHT_ANALOGUE_VERT: 3
                                };

        public isConencted:boolean = false;

        public isAction:boolean = false;
        public isLeft:boolean = false;
        public isRight:boolean = false;
        //public isUp:boolean = false;
        //public isDown:boolean = false;

        private _isMute:boolean = false;
        private _isMenu:boolean = false;

        private _isFirefox:boolean = false;

        private _canCheckButtonsAndAxes:boolean = false;


        constructor()
        {
            super();
            console.log("Gamepad Control ");

            //this.onGamepadConnected = this.onGamepadConnected.bind(this);
            //this.onGamepadDisconnected = this.onGamepadDisconnected.bind(this);
            this.setCanCheckButtonsAndAxes = this.setCanCheckButtonsAndAxes.bind(this);

            this._isFirefox = DeviceUtils.isFirefox();
            if(this._isFirefox)
            {
                //window.addEventListener("gamepadconnected", this.onGamepadConnected);
                //window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);
            }

        }



        private setCanCheckButtonsAndAxes():void
        {
            this._canCheckButtonsAndAxes = true;
        }

        public update():void
        {
            var gp:Gamepad = null;
            if(navigator["webkitGetGamepads"])
            {
                // chrome
                gp = navigator.webkitGetGamepads()[0];
            }
            else if(navigator["getGamepads"])
            {
                // firefox
                gp = navigator.getGamepads()[0];
            }

            //console.log(gp);
            if(gp == null)
            {
                //console.log("gp is null");
                if(this.isConencted == true)
                {
                    // disconnect
                    this.isConencted = false;
                    console.log("gamepad disconnected!");
                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.GAMEPAD_DISCONNECTED;
                    this.dispatchEvent(data);
                    return;
                }
                return;
            }


            if(this.isConencted == false)
            {
                this.isConencted = true;
                console.log("gamepad detected! " + gp.buttons.length + ", " + gp.axes.length);
                var data:PIXI.IEvent = <PIXI.IEvent> {};
                data.type = GameEventType.GAMEPAD_CONNECTED;
                this.dispatchEvent(data);

                setTimeout(this.setCanCheckButtonsAndAxes, 500);
                return;
            }

            if(this._canCheckButtonsAndAxes == false)
            {
                return;
            }

            var i:number;
            var actionFlag:boolean = false;
            var muteFlag:boolean = false;
            var menuFlag:boolean = false;

            for(i = 0; i < gp.buttons.length; i++)
            {
                if(i == this.BUTTONS["FACE_3"])
                {
                    // mute music
                    if(this.isButtonPress(gp.buttons[i]))
                    {
                        muteFlag = true;
                        break;
                    }

                }
                else if(i == this.BUTTONS["FACE_4"])
                {
                    // menu
                    if(this.isButtonPress(gp.buttons[i]))
                    {
                        menuFlag = true;
                        break;
                    }
                }
                else if(i == this.BUTTONS["FACE_1"] ||
                        i == this.BUTTONS["FACE_2"] ||
                        i == this.BUTTONS["SELECT"] ||
                        i == this.BUTTONS["START"])
                {
                    // select (action) button
                    //console.log("gp.buttons[" + i +"] " + gp.buttons[i]);
                    if(this.isButtonPress(gp.buttons[i]))
                    {
                        actionFlag = true;
                        break;
                    }

                }
            }

            this.setAction(actionFlag);
            this.setMute(muteFlag);
            this.setMenu(menuFlag);

            var rightFlag:boolean = false;
            var leftFlag:boolean = false;
            //var upFlag:boolean = false;
            //var downFlag:boolean = false;

            for(i = 0; i < gp.axes.length; i++)
            {
                if(i == this.AXES["LEFT_ANALOGUE_HOR"])
                {
                    //console.log("axes pressed, " + i + " >> " + gp.axes[i]);
                    if(gp.axes[i] == 0)
                    {
                        rightFlag = false;
                        leftFlag  = false;
                    }
                    else if(gp.axes[i] < 0)
                    {
                        leftFlag = true;
                        rightFlag = false;
                    }
                    else if(gp.axes[i] > 0)
                    {
                        rightFlag = true;
                        leftFlag = false;
                    }

                    if(rightFlag == true || leftFlag == true)
                        break;

                }

            }

            this.setLeft(leftFlag);
            this.setRight(rightFlag);

            //console.log("upFlag " + upFlag + ", down " + downFlag);
            //this.setUp(upFlag);
            //this.setDown(downFlag);

            //console.log(gp.id);
            //console.log(gp.buttons.length);



        }

        private isButtonPress(button:any):boolean
        {
            if(this._isFirefox)
            {
                // firefox
                var gpb:GamepadButton = <GamepadButton> button;
                if(gpb.pressed == true)
                {
                    return true;
                }
            }
            else
            {
                // chrome
                if(button == 1)
                {
                    return true;
                }
            }

            return false;
        }

        private setMute(flag:boolean):void
        {
            if(this._isMute != flag && this.isConencted == true)
            {
                this._isMute = flag;
                if(this._isMute == true)
                {
                    console.log("isMute pressed" + this._isMute);
                }
                else
                {
                    console.log("mute released!");
                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.GAMEPAD_MUTE_KEY;
                    this.dispatchEvent(data);
                }

            }
        }


        private setMenu(flag:boolean):void
        {
            if(this._isMenu != flag && this.isConencted == true)
            {
                this._isMenu = flag;
                if(this._isMenu == true)
                {
                    console.log("_isMenu pressed" + this._isMenu);
                }
                else
                {
                    console.log("_isMenu released!");
                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.GAMEPAD_MENU_KEY;
                    this.dispatchEvent(data);
                }

            }
        }

        /*private setUp(flag:boolean):void
        {
            if(this.isUp != flag && this.isConencted == true)
            {
                this.isUp = flag;
                if(this.isUp == true)
                {
                    console.log("isUp ");
                }

            }
        }

        private setDown(flag:boolean):void
        {
            if(this.isDown != flag && this.isConencted == true)
            {
                this.isDown = flag;
                if(this.isDown == true)
                {
                    console.log("isDown ");
                }

            }
        } */

        private setLeft(flag:boolean):void
        {
            if(this.isLeft != flag && this.isConencted == true)
            {
                this.isLeft = flag;
                if(this.isLeft == true)
                {
                    console.log("left ");
                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.GAMEPAD_LEFT_KEY;
                    this.dispatchEvent(data);

                }

            }
        }

        private setRight(flag:boolean):void
        {
            if(this.isRight != flag && this.isConencted == true)
            {
                this.isRight = flag;
                if(this.isRight == true)
                {
                    console.log("right");
                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.GAMEPAD_RIGHT_KEY;
                    this.dispatchEvent(data);

                }

            }
        }

        private setAction(flag:boolean):void
        {
            if(this.isAction != flag && this.isConencted == true)
            {
                this.isAction = flag;
                if(this.isAction == true)
                {
                    console.log("action button pressed");
                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.GAMEPAD_ACTION_KEY;
                    this.dispatchEvent(data);

                }

            }
        }


        public dispose():void
        {

        }
    }
}