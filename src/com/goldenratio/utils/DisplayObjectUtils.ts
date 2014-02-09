/**
 * Created by bear on 1/27/14.
 */

///<reference path="../../../../definitions/pixi.d.ts"/>

module com.goldenratio
{
    export class DisplayObjectUtils
    {

        public static removeAllChildren(target:PIXI.DisplayObjectContainer)
        {
            if(target == null)
            {
                return;
            }
            for(var i:number = target.children.length - 1; i >= 0; i--)
            {
                target.removeChild(target.children[i]);
            }
        }

    }
}