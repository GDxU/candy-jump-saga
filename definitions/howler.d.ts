/**
 * Created by bear on 2/4/14.
 */

declare class Howler
{
    static mute():void;
    static unmute():void;
    static volume(v?:number);
}
declare class Howl
{
    constructor(properties?:any);

    // Set to true to automatically start playback when sound is loaded. (false by default)
    autoplay:boolean;

    //  (false by default) Set to true to force HTML5 Audio. This should be used for large audio files so that you don't have to wait for the full file to be downloaded and decoded before playing.
    buffer:boolean;

    //(null by default) howler.js automatically detects your file format from the URL, but you may also specify a format in situations where URL extraction won't work.
    format:string;

    //  (false by default) Set to true to automatically loop the sound forever.
    loop:boolean;

    // ({} by default) Define a sound sprite for the sound. The offset and duration are defined in milliseconds. A third (optional) parameter is available to set a sprite as looping.
    sprite:Object;

    // (1.0 by default) The volume of the specific track, from 0.0 to 1.0.
    volume:number;

    // ([] by default) The source URLs to the track(s) to be loaded for the sound. These should be in order of preference, howler.js will automatically load the first one that is compatible with the current browser. If your files have no extensions, you will need to explicitly specify the format using the format property.
    urls:string[];

    //  (function(){} by default) Fire when the sound finishes playing (if it is looping, it'll fire at the end of each loop).
    onend:Function;

    // (function(){} by default) Fires when the sound is loaded.
    onload:Function;

    //
    onloaderror:Function;

    onpause:Function;
    onplay:Function;


    /**
     * Begins playback of sound. Will continue from previous point if sound has been previously paused.s
     * @param spriteName  (optional) Plays from the defined sprite key.
     * @param callback   (optional) Fires when playback begins and returns the soundId, which is the unique identifier for this specific playback instance.
     */
    play(spriteKey?:string, callback?:Function):void;

    /**
     * Pauses playback of sound, saving the pos of playback.
     * @param id  (optional) The play instance ID.
     */
    pause(id?:number):void;

    /**
     * Stops playback of sound, resetting pos to 0.
     * @param id (optional) The play instance ID.
     */
    stop(id?:number):void;

    mute(id?:number):void;

    unmute(id?:number):void;

    //pos(position?:number, id?:number):void;

   // get pos():any;
    //set pos(position?:number):void;

    //get sprite():Object;
}

