/**
 * Created by bear on 1/25/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>
///<reference path="BasePlatform.ts"/>
///<reference path="../GameMain.ts"/>
///<reference path="FullGrass.ts"/>
///<reference path="HalfGrass.ts"/>
///<reference path="HalfSand.ts"/>
///<reference path="SpringPlatform.ts"/>
///<reference path="../Hero.ts"/>
///<reference path="data/LevelData.ts"/>
///<reference path="enemies/BlackFly.ts"/>
///<reference path="candies/RedJellyBean.ts"/>
///<reference path="candies/GreenWrapped.ts"/>
///<reference path="candies/RedWrapped.ts"/>
///<reference path="candies/BaseCandy.ts"/>
///<reference path="WinFlag.ts"/>
///<reference path="../utils/RectUtils.ts"/>
///<reference path="../utils/DisplayObjectUtils.ts"/>
///<reference path="../SoundManager.ts"/>

module com.goldenratio
{
    export class PlatformManager
    {
        private _container:PIXI.DisplayObjectContainer;

        private _list:any[] = [];
        private _hero:Hero;

        private _rectContainer:PIXI.DisplayObjectContainer;
        private _debugDraw:boolean = false;
        private _dieFlag:boolean = false;


        constructor(container:PIXI.DisplayObjectContainer)
        {
            console.log("platform manager");
            this._container = container;
            this._rectContainer = new PIXI.DisplayObjectContainer();
            this._container.addChild(this._rectContainer);
        }

        public showLevel(level:number):void
        {
            console.log("showLevel " + level);
            if(level >= LevelData.LIST.length)
            {
                console.log("no more levels");
                return;
            }
            //console.log(LevelData.LIST[0]);
            var currentLevelData:Object[] = LevelData.LIST[level]["data"];
            //console.log(currentLevelData);
            this._dieFlag = false;
            this.parseJSON(currentLevelData);
        }

        private parseJSON(currentLevelData:Object[]):void
        {

            console.log("data len, " + currentLevelData.length);

            for(var i:number = currentLevelData.length - 1; i >= 0; i--)
            {

                var json:Object = currentLevelData[i];
                var gfx:any;
                if(json["type"] == "full_grass")
                {
                    gfx = new FullGrass(json["size"]);
                }
                else if(json["type"] == "half_grass")
                {
                    gfx = new HalfGrass(json["size"]);
                }
                else if(json["type"] == "half_sand")
                {
                    gfx = new HalfSand(json["size"]);
                }
                else if(json["type"] == "red_jellybean")
                {
                    gfx = new RedJellyBean();
                }
                else if(json["type"] == "green_wrapped")
                {
                    gfx = new GreenWrapped();
                }
                else if(json["type"] == "red_wrapped")
                {
                    gfx = new RedWrapped();
                }
                else if(json["type"] == "win_flag")
                {
                    gfx = new WinFlag();
                }
                else if(json["type"] == "spring")
                {
                    gfx = new SpringPlatform();
                }
                else if(json["type"] == "black_fly")
                {
                    console.log("black fly...");
                    gfx = new BlackFly();
                }

                this._container.addChild(gfx.gfx);
                gfx.setPosition(json["x"], json["y"]);
                if(json["direction"])
                {
                    gfx.setDirection(json["direction"]);
                }
                this._list.push(gfx);
            }
        }

        public init(hero:Hero):void
        {
            this._hero = hero;
            console.log(this._list.length);
        }


        public update():void
        {
            if(this._hero)
            {
                DisplayObjectUtils.removeAllChildren(this._rectContainer);
                //console.log("len: " + this._list.length);
                for(var i:number = this._list.length - 1; i >= 0; i--)
                {
                    var data:any = this._list[i];

                    // when player falls off the platform, checks if player has to die
                    if(i == this._list.length - 1)
                    {
                        if(this._hero.allowHitTest && this._hero.isAlive == true && this._dieFlag == false)
                        {
                            if(this._hero.gfx.position.y > data.rect.y + 100)
                            {
                                console.log("dieeeeeeeeeeeeeeee");
                                this._dieFlag = true;
                                SoundManager.playLose();
                                this._hero.die();
                                break;
                            }
                        }
                    }

                    // draw hit area border
                    if(this._debugDraw == true)
                    {
                        if(data.rect)
                        {
                            var border:PIXI.Graphics = new PIXI.Graphics();
                            border.lineStyle(1, 0xFF0000);
                            border.drawRect(data.rect.x, data.rect.y, data.rect.width, data.rect.height);
                            this._rectContainer.addChild(border);
                        }

                        var border2:PIXI.Graphics = new PIXI.Graphics();
                        border2.lineStyle(1, 0xFF0000);
                        border2.drawRect(this._hero.rect.x, this._hero.rect.y, this._hero.rect.width, this._hero.rect.height);
                        this._rectContainer.addChild(border2);
                    }

                    // decides whether to remove the platform
                    if(data.gfx.position.y > (GameMain.GAME_DIMENSION.height - this._container.position.y + 200))
                    {
                        this._container.removeChild(data.gfx);
                        data.dispose();
                        data = null;
                        this._list.splice(i, 1);

                        continue;
                    }

                    if(data instanceof BaseCandy)
                    {
                        //console.log("candy");
                        if(data.isAlive)
                        {
                            if(RectUtils.isColliding(this._hero.rect, data.rect))
                            {
                                console.log("colliding!");
                                SoundManager.playPickup();
                                this._hero.updateScore(data.getScore());
                                this._hero.candyPickup();
                                data.explode();
                                this._hero.changeDirectionToJump();

                                break;
                            }

                        }
                        else if(data.canRemove)
                        {
                            this._container.removeChild(data.gfx);
                            data.dispose();
                            data = null;
                            this._list.splice(i, 1);

                            break;
                        }

                    }
                    else if(data instanceof BasePlatform)
                    {
                        data.update();

                        if( this._hero.allowHitTest
                            && this._hero.isAlive
                            && (this._hero.gfx.position.y >= data.rect.y && this._hero.gfx.position.y <= data.rect.y + 10)
                            && ((this._hero.gfx.position.x + 10) >= data.rect.x && (this._hero.gfx.position.x - 10) <= data.rect.x + data.rect.width)
                            )
                        {
                            //console.log("change direction");
                            if(data.isAlive)
                            {
                                if(this._hero.isLevelComplete == false)
                                {
                                    SoundManager.playDrop();
                                }

                                this._hero.changeDirectionToJump();
                            }


                            if(data instanceof HalfSand)
                            {
                                if(data.isAlive)
                                {
                                    data.explode();
                                }
                                else if(data.canRemove)
                                {
                                    //console.log("remove sand");
                                    data.dispose();
                                    data = null;
                                    this._list.splice(i, 1);
                                }

                            }
                            break;
                        }

                    }
                    else if(data instanceof WinFlag)
                    {
                        if( this._hero.allowHitTest
                            && this._hero.isAlive
                            && data.isWave == false
                            && (this._hero.gfx.position.y >= data.rect.y && this._hero.gfx.position.y <= data.rect.y + 10)
                            && ((this._hero.gfx.position.x + 10) >= data.rect.x && (this._hero.gfx.position.x - 10) <= data.rect.x + data.rect.width)
                            )
                        {
                            console.log("win flag");
                            SoundManager.playLevelComplete();
                            this._hero.levelComplete();
                            data.waveFlag();

                            break;
                        }
                    }
                    else if(data instanceof SpringPlatform)
                    {
                        if( this._hero.allowHitTest
                            && this._hero.isAlive
                            && data.isBounce == false
                            && (this._hero.gfx.position.y >= data.rect.y && this._hero.gfx.position.y <= data.rect.y + 10)
                            && ((this._hero.gfx.position.x + 10) >= data.rect.x && (this._hero.gfx.position.x - 10) <= data.rect.x + data.rect.width)
                            )
                        {
                            console.log("bounce");
                            SoundManager.playPickup();
                            data.bounce();
                            this._hero.bounce();
                            break;
                        }
                    }
                    else if(data instanceof BlackFly)
                    {
                        data.update();
                        if(this._hero.isAlive
                           && RectUtils.isColliding(this._hero.rect, data.rect)
                           && this._dieFlag == false
                          )
                        {
                            this._dieFlag = true;
                            SoundManager.playLose();
                            this._hero.die();
                            break;
                        }
                    }

                }

                //console.log("hy: " + this._hero.gfx.position.y);
                if((this._hero.gfx.position.y >= 100 || this._list.length == 0) && this._dieFlag == false)
                {
                    // hero die
                    this._dieFlag = true;
                    SoundManager.playLose();
                    this._hero.die();
                }

            }
        }

        public getTotalLevels():number
        {
            return LevelData.LIST.length;
        }

        public clearLevel():void
        {
            DisplayObjectUtils.removeAllChildren(this._rectContainer);
            // clear
            for(var i:number = this._list.length - 1; i >= 0; i--)
            {
                var data:any = this._list[i];
                this._container.removeChild(data.gfx);
                data.dispose();
                data = null;
                this._list.splice(i, 1);

            }
            this._list.length = 0;

            if(this._hero)
            {
                this._hero.dispose();
                this._hero = null;
            }


        }

        public dispose():void
        {
            this.clearLevel();

            this._rectContainer = null;
            this._container = null;
        }

    }
}