/**
 * Created by bear on 1/27/14.
 */

///<reference path="../../../../../definitions/pixi.d.ts"/>
///<reference path="BaseCandy.ts"/>

module com.goldenratio
{
    export class RedWrapped extends BaseCandy
    {

        constructor()
        {
            this.textureList= [
                PIXI.Texture.fromFrame("wrappedsolid_red"),
                PIXI.Texture.fromFrame("explosionred01"),
                PIXI.Texture.fromFrame("explosionred02"),
                PIXI.Texture.fromFrame("explosionred03"),
                PIXI.Texture.fromFrame("explosionred04"),
                PIXI.Texture.fromFrame("explosionred05")
            ];
            super();
        }

        public getScore():number
        {
            return 100;
        }


    }
}