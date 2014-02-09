/**
 * Author: bear
 * Date: 8/25/13
 */


interface Touch
{
    identifier:number;
    target:EventTarget;
    screenX:number;
    screenY:number;
    clientX:number;
    clientY:number;
    pageX:number;
    pageY:number;

    // events
    touchstart: () => any;
    touchmove: () => any;
    touchend: () => any;
}


interface TouchList
{
    length:number;
    item (index:number):Touch;
    identifiedTouch(identifier:number):Touch;
}


interface TouchEvent extends UIEvent
{
    touches:TouchList;
    targetTouches:TouchList;
    changedTouches:TouchList;
    altKey:boolean;
    metaKey:boolean;
    ctrlKey:boolean;
    shiftKey:boolean;
    //initTouchEvent (type:string, canBubble:bool, cancelable:bool, view:any, detail:number, ctrlKey:boolean, altKey:bool, shiftKey:bool, metaKey:bool, touches:TouchList, targetTouches:TouchList, changedTouches:TouchList);
}

interface FullScreenElement extends Element
{
    requestFullscreen():void;
    mozRequestFullScreen():void;
    webkitRequestFullscreen(option?:any):void;
}