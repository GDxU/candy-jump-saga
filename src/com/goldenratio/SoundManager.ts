/**
 * Created by bear on 2/4/14.
 */


///<reference path="../../../definitions/howler.d.ts"/>
///<reference path="../../../definitions/pixi.d.ts"/>
///<reference path="GameEventType.ts"/>

module com.goldenratio
{
    export class SoundManager
    {
        public static event:PIXI.EventTarget = new PIXI.EventTarget();
        private static _sfx:Howl;
        public static isSFXPlaying:boolean = false;
        public static isSFXLoaded:boolean = false;
        public static isLoadError:boolean = false;
        public static canPlayPickup:boolean = true;

        public static muteState:boolean = false;


        public static init():void
        {
            if(SoundManager.isSFXLoaded == true)
            {
                console.warn("sfx already initialized!");
                return;
            }
            if(SoundManager.isLoadError == true)
            {
                return;
            }
            console.log("loading sound!");
            this._sfx = new Howl({
                urls: ['assets/audiosprite.ogg','assets/audiosprite.mp3'],

                sprite: {
                    click: [0, 261],
                    drop: [2000, 522],
                    level_complete: [4000, 3005],
                    lose: [9000, 1724],
                    pickup: [12000, 626]

                },

                onplay: function() {
                    //console.log("sfx playing");
                    SoundManager.isSFXPlaying = true;
                },

                onend: function() {
                    //console.log("sfx end");
                    SoundManager.isSFXPlaying = false;
                },

                onload: function() {
                    console.log("sfx loaded");
                    SoundManager.isSFXLoaded = true;
                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.SOUND_LOADED;
                    SoundManager.event.dispatchEvent(data);
                },

                onloaderror: function() {
                    console.log("sfx load error!");
                    SoundManager.isSFXLoaded = false;
                    SoundManager.isLoadError = true;
                    var data:PIXI.IEvent = <PIXI.IEvent> {};
                    data.type = GameEventType.SOUND_ERROR;
                    SoundManager.event.dispatchEvent(data);
                }
            });


        }

        private static canPlay():boolean
        {

            return SoundManager.isSFXLoaded && SoundManager.muteState == false;
        }

        public static playPickup():void
        {

            if(SoundManager.canPlay() == true && SoundManager.canPlayPickup == true)
            {

                this._sfx.play("pickup", function(id){
                    console.log("sound id " + id);
                });

                SoundManager.canPlayPickup = false;
                window.setTimeout(function(){
                    console.log("reset pickup..............");
                    SoundManager.canPlayPickup = true;

                }, 700);

            }

        }

        public static playClick():void
        {
            if(SoundManager.canPlay() == false)
            {
                return;
            }
            this._sfx.play("click");
        }

        public static playLose():void
        {
            if(SoundManager.canPlay() == false)
            {
                return;
            }
            this._sfx.play("lose");
        }

        public static playDrop():void
        {
            if(SoundManager.canPlay() == false)
            {
                return;
            }
            this._sfx.play("drop");
        }

        public static playLevelComplete():void
        {
            if(SoundManager.canPlay() == false)
            {
                return;
            }
            this._sfx.play("level_complete");
        }

        public static mute(state:boolean)
        {
            SoundManager.muteState = state;
            if(state)
            {
                Howler.mute();
            }
            else
            {
                Howler.unmute();
            }
        }



    }
}