/**
 * Created by bear on 1/25/14.
 */


///<reference path="../../../definitions/pixi.d.ts"/>
///<reference path="../../../definitions/touch.d.ts"/>
///<reference path="utils/DeviceUtils.ts"/>
///<reference path="GameEventType.ts"/>


module com.goldenratio
{

    export class Hero extends PIXI.EventTarget
    {
        private static NORMAL_JUMP_SPEED:number = 5;
        private static SPRING_JUMP_SPEED:number = 16;
        private static CANDY_JUMP_SPEED:number = 7;

        public gfx:PIXI.MovieClip;
        public rect:PIXI.Rectangle = new PIXI.Rectangle(0, 0, 0, 0);

        public isAlive:boolean = true;
        public isLevelComplete:boolean = false;

        private _score:number = 0;

        /**
         * 1 : jump up
         * -1 :down
         * 0 : dead
         */
        private _jumpDirection:number = 1;

        private _container:PIXI.DisplayObjectContainer;
        private _jumpCount:number = 0;

        // configurable
        private _jumpSpeed:number = Hero.NORMAL_JUMP_SPEED;
        private _dropSpeed:number = 7;
        private _maxJumpCount:number = 35;

        public allowHitTest:boolean = false;
        private _left:boolean = false;
        private _right:boolean = false;

        private _walkSpeed:number = 0.2;
        private _vx:number = 0;
        private _friction:number = 0.60;
        private _maxSpeed:number = 4;

        private _playerPosition:PIXI.Point = new PIXI.Point(150, -70);
        private _renderer:PIXI.IPixiRenderer;

        // frame numbers
        private static STAND:number = 0;
        private static JUMP:number = 1;
        private static HURT:number = 2;

        private _invertOrientation:boolean = false;

        private _dieTimer:number = 0;

        private _isGameStarted:boolean = false;

        constructor(container:PIXI.DisplayObjectContainer, renderer:PIXI.IPixiRenderer)
        {
            super();
            this._container = container;
            this._renderer = renderer;

            this.gfx = new PIXI.MovieClip([PIXI.Texture.fromFrame(HeroFrameName.STAND),
                                            PIXI.Texture.fromFrame(HeroFrameName.JUMP),
                                            PIXI.Texture.fromFrame(HeroFrameName.HURT)]);
            this.gfx.scale = new PIXI.Point(0.8, 0.8);
            this.gfx.anchor = new PIXI.Point(0.5, 1);
            this.gfx.loop = false;
            this._container.addChild(this.gfx);

            this.init();
        }

        public onGameStart():void
        {

            //this.init();
            this._isGameStarted = true;
            this.initListeners();
        }

        private init():void
        {
            // initial position
            this._playerPosition = new PIXI.Point(150, -70);
            this.gfx.position.x = this._playerPosition.x;
            this.gfx.position.y = this._playerPosition.y;
            this.gfx.rotation = 0;
            this._dieTimer = 0;
            this.isAlive = true;

            this._score = 0;
            this._jumpDirection = 1;
            this._jumpCount = 0;
            this._vx = 0;
            this._dieTimer = 0;
            this.allowHitTest = false;
            this._isGameStarted = false;
            this.updateRect();

        }

        private initListeners():void
        {
            this.onKeyDownHL = this.onKeyDownHL.bind(this);
            this.onKeyUpHL = this.onKeyUpHL.bind(this);
            this.onTouchStartHL = this.onTouchStartHL.bind(this);
            this.onTouchEndHL = this.onTouchEndHL.bind(this);
            this.onTouchMoveHL = this.onTouchMoveHL.bind(this);
            this.onDeviceMotionHandler = this.onDeviceMotionHandler.bind(this);

            document.addEventListener("keydown", this.onKeyDownHL, false);
            document.addEventListener("keyup", this.onKeyUpHL, false);


            document.addEventListener("touchstart", this.onTouchStartHL, false);
            document.addEventListener("touchend", this.onTouchEndHL, false);

            if(DeviceUtils.supportsDeviceOrientation())
            {
                if(DeviceUtils.isFirefox())
                {
                    this._invertOrientation = true;
                }

                window.addEventListener("deviceorientation", this.onDeviceMotionHandler, false);
                //document.addEventListener("touchmove", this.onTouchMoveHL, false);
            }
            else
            {
                document.addEventListener("touchmove", this.onTouchMoveHL, false);
            }
        }


        private updateRect():void
        {
            this.rect.x = (this.gfx.position.x - (this.gfx.width >> 1));
            this.rect.y = (this.gfx.position.y - this.gfx.height);
            this.rect.width = this.gfx.width;
            this.rect.height = this.gfx.height;

            //console.log("x: " + this.rect.x + ", y: " + this.rect.y + ", width: " + this.rect.width + ", height: " + this.rect.height);

        }

        public updateScore(val:number):void
        {
            //console.log("updatescore.. " + val);
            this._score += val;
        }

        public candyPickup():void
        {

            if(this._jumpSpeed == Hero.SPRING_JUMP_SPEED)
            {
                return;
            }
            this._jumpCount = 0;
            this._jumpDirection = 1;
            this._jumpSpeed = Hero.CANDY_JUMP_SPEED;
        }

        public getScore():number
        {
            return this._score;
        }

        private onTouchStartHL(event:TouchEvent):void
        {
            event.preventDefault();
            event.stopPropagation();
        }

        private onTouchEndHL(event:TouchEvent):void
        {
            event.preventDefault();
            event.stopPropagation();
        }

        private onTouchMoveHL(event:TouchEvent):void
        {
            if(event.targetTouches.length >= 1)
            {
                var touch:Touch = event.targetTouches[0];
                //console.log("move >> " + touch.pageX + ", " + touch.pageX);

                var tx:number = ((touch.pageX - this._renderer.view.offsetLeft) / this._renderer.view.offsetWidth) * this._renderer.view.width;
                //console.log("tx: " + tx);

                this._playerPosition.x = tx;
            }

            event.preventDefault();
            event.stopPropagation();

        }

        private onDeviceMotionHandler(event:DeviceOrientationEvent):void
        {
            var tx:number = 0;
            var ty:number = 0;
            if(DeviceUtils.isLandscapeMode() == false)
            {
                tx = event.beta;
                ty = event.gamma;
            }
            else
            {
                ty = event.beta;
                tx = event.gamma;
            }

            //var angle:number = rad * (180 / Math.PI);
            //var tz:number = event.alpha;

            if(this._invertOrientation)
            {
                tx *= -1;
                ty *= -1;
            }
            //console.log("tx: " + tx + ", ty: " + ty);
            var angle:number = Math.round(Math.atan2(ty, tx) * 10) / 10;

            //console.log("angle, "  + angle);
            if(angle <= -0.2)
            {
                // move left
                this._left = true;
                this._right = false;
            }
            else if(angle >= 0.2)
            {
                // move right
                this._left = false;
                this._right = true;
            }
            else
            {
                this._left = false;
                this._right = false;
            }

        }

        private onKeyUpHL(event:KeyboardEvent):void
        {
            var isValidKey:boolean = true;
            switch(event.keyCode)
            {
                case 39:
                    this._right = false;

                    break;

                case 37:
                    this._left = false;
                    break;

                default:
                    isValidKey = false;

            }

            if(isValidKey)
            {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        private onKeyDownHL(event:KeyboardEvent):void
        {
            //console.log(event.keyCode);
            var isValidKey:boolean = true;
            switch(event.keyCode)
            {
                case 39:
                    this._right = true;
                    this._left = false;
                    break;

                case 37:
                    this._left = true;
                    this._right = false;
                    break;

                case 80:
                    // P - key
                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.TOGGLE_PAUSE;
                    this.dispatchEvent(data);
                    break;

                default:
                    isValidKey = false;
            }

            if(isValidKey)
            {
                event.preventDefault();
                event.stopPropagation();
            }
        }

        private jump():void
        {
            //console.log("jump");
            this.allowHitTest = false;
            this.gfx.position.y -= this._jumpSpeed;

            if(this._jumpCount <= 5)
            {
                this.gfx.gotoAndStop(Hero.STAND);
            }
            else
            {
                this.gfx.gotoAndStop(Hero.JUMP);
            }

            //console.log(this._gfx.position);
            this._jumpCount ++;

            if(this._jumpCount >= this._maxJumpCount)
            {
                this._jumpCount = 0;
                this._jumpDirection *= -1;
            }

        }

        private drop():void
        {
            this._jumpSpeed = Hero.NORMAL_JUMP_SPEED;
            this.allowHitTest = true;
            this.gfx.position.y += this._dropSpeed;
            this.gfx.gotoAndStop(Hero.JUMP);
        }

        public changeDirectionToJump():void
        {

            this.gfx.gotoAndStop(Hero.STAND);
            this._jumpDirection = 1;
            this._jumpCount = 0;
        }

        public die():void
        {
            if(this._jumpDirection == 0)
            {
                return;
            }
            console.log("hero die");
            this._jumpDirection = 0;
            this._jumpCount = 0;
            this.gfx.gotoAndStop(Hero.HURT);
            this.gfx.anchor.y = 0.5;
        }

        private setPosition(x:number, y:number):void
        {
            var distance:Number = Math.sqrt(Math.pow((x - this.gfx.position.x), 2) + Math.pow((y - this.gfx.position.y), 2));
            var tx:number = this.gfx.position.x;

            if(distance > 5)
            {
                var deltaY:number = this.gfx.position.y - y;
                var deltaX:number = this.gfx.position.x - x;

                var rad:number = Math.atan2(deltaY, deltaX) * 180 / Math.PI; // in radians

                tx -= (Math.cos(rad / 180 * Math.PI) * 10) >> 0; // 10 - speed
            }
            else
            {
                tx = x;
            }


            this.gfx.position.x = tx;
            //this.gfx.position.y = ty;
        }

        public bounce():void
        {

            this._jumpCount = 0;
            this._jumpDirection = 1;
            this._jumpSpeed = Hero.SPRING_JUMP_SPEED;
        }

        public levelComplete():void
        {

            this.isLevelComplete = true;
            var data:PIXI.IEvent = <PIXI.IEvent> {};
            data.type = GameEventType.LEVEL_COMPLETE;
            this.dispatchEvent(data);

        }


        public update():void
        {

            if(this._isGameStarted == false)
            {
                return;
            }
            if(this._jumpDirection == 0)
            {
                // die
                if(this.gfx.position.y <= 100)
                {
                    this.gfx.position.y += this._dropSpeed;
                    this.gfx.rotation += 0.2;
                }

                if(this.isAlive == false)
                {
                    return;
                }

                this._dieTimer ++;

                if(this._dieTimer >= 10)
                {
                    // show game over
                    this.isAlive = false;
                    console.log("you are dead, game over");

                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.PLAYER_DIE;
                    this.dispatchEvent(data);

                }
                return;
            }

            if(this.isLevelComplete == false)
            {
                this.handleMovement();
            }
            else
            {
                this._vx = 0;
            }


            if(this._jumpDirection == 1 && this.isLevelComplete == false)
            {
                this.jump();
            }
            else if(this._jumpDirection == -1)
            {
                this.drop();
            }

            this._playerPosition.x += this._vx;
            this._playerPosition.y = this.gfx.position.y;
            this.setPosition(this._playerPosition.x, this._playerPosition.y);
            this.updateRect();
        }

        private handleMovement():void
        {
            if(this.gfx.position.x < 10)
            {
                this._vx = 0;
                this.gfx.position.x  = 10;
                //return;
            }

            if(this.gfx.position.x > 390)
            {
                this._vx = 0;
                this.gfx.position.x = 390;
                //return;
            }

            //console.log("this._left "+ this._left);
            if(this._right && this.gfx.position.x < 390)
            {
                //console.log("move right");
                this._vx += this._walkSpeed;
            }
            else if(this._left && this.gfx.position.x > 10)
            {
                this._vx -= this._walkSpeed;
            }
            else
            {
                this._vx *= this._friction;
            }

            //console.log(this._vx);

            if(this._vx > this._maxSpeed)
            {
                this._vx = this._maxSpeed;
            }
            else if(this._vx < -this._maxSpeed)
            {
                this._vx = -this._maxSpeed;
            }

        }

        public dispose():void
        {
            document.removeEventListener("keydown", this.onKeyDownHL, false);
            document.removeEventListener("keyup", this.onKeyUpHL, false);


            document.removeEventListener("touchstart", this.onTouchStartHL, false);
            document.removeEventListener("touchend", this.onTouchEndHL, false);

            window.removeEventListener("deviceorientation", this.onDeviceMotionHandler, false);
            document.removeEventListener("touchmove", this.onTouchMoveHL, false);

            if(this.gfx.parent)
            {
                this._container.removeChild(this.gfx);
            }
            this._playerPosition = null;
            this._renderer = null;
            this._container = null;
        }

        public setLeft(value:boolean):void
        {
            //console.log("setLeft "+ value);
            this._left = value;
        }

        public setRight(value:boolean):void
        {
            this._right = value;
        }

    }


    export class HeroFrameName
    {
        public static STAND:string = "alienYellow_stand";
        public static JUMP:string = "alienYellow_jump";
        public static HURT:string = "alienYellow_hurt";
    }
}