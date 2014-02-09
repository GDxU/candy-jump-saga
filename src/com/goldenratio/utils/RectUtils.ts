/**
 * Created by bear on 1/25/14.
 */

module com.goldenratio
{
    export class RectUtils
    {

        public static isColliding(target1:PIXI.Rectangle, target2:PIXI.Rectangle):boolean
        {
            /*return (Math.abs(target1.x - target2.x) * 2 < (target1.width + target2.width)) &&
                (Math.abs(target1.y - target2.y) * 2 < (target1.height + target2.height));
             */
            return !((target2.x > (target1.x + target1.width)) ||
                     ((target2.x + target2.width) < target1.x) ||
                     (target2.y > (target1.y + target1.height)) ||
                     ((target2.y + target2.height) < target1.y)
                    );
        }

    }
}