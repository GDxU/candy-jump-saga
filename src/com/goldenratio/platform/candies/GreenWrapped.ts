/**
 * Created by bear on 1/27/14.
 */

///<reference path="../../../../../definitions/pixi.d.ts"/>
///<reference path="BaseCandy.ts"/>

module com.goldenratio
{
    export class GreenWrapped extends BaseCandy
    {

        constructor()
        {
            this.textureList= [
                PIXI.Texture.fromFrame("wrappedsolid_green"),
                PIXI.Texture.fromFrame("explosiongreen01"),
                PIXI.Texture.fromFrame("explosiongreen02"),
                PIXI.Texture.fromFrame("explosiongreen03"),
                PIXI.Texture.fromFrame("explosiongreen04"),
                PIXI.Texture.fromFrame("explosiongreen05")
            ];
            super();
        }

        public getScore():number
        {
            return 50;
        }

    }
}