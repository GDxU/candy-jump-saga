/**
 * Created by bear on 1/25/14.
 */

module com.goldenratio
{
    export class DeviceUtils
    {

        public static supportsDeviceOrientation():boolean
        {
            if("ondeviceorientation" in window)
                return true;

            return false;
        }

        public static isTouchDevice():boolean
        {
            if("ontouchstart" in window)
                return true;

            return false;
        }

        public static isMobileDevice():boolean
        {
            if( navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)
                || navigator.userAgent.match(/Mobile/i)
                || navigator.userAgent.match(/Tablet/i)
                )
            {
                return true;
            }


            return  false;
        }

        public static isChrome():boolean
        {
            if(navigator.userAgent.match(/Chrome/i))
            {
                return true;
            }

            return false;
        }

        public static isFirefox():boolean
        {
            if(navigator.userAgent.match(/Firefox/i))
            {
                return true;
            }

            return false;
        }

        public static isOpera():boolean
        {
            if(navigator.userAgent.match(/Opera/i))
            {
                return true;
            }

            return false;
        }

        public static isIE11():boolean
        {
            if(navigator.userAgent.match(/Trident/i))
            {
                return true;
            }

            return false;
        }

        public static isAndroid():boolean
        {
            if(navigator.userAgent.match(/Android/i))
            {
                return true;
            }

            return false;
        }

        public static isLinux():boolean
        {
            if(navigator.userAgent.match(/Linux/i))
            {
                return true;
            }

            return false;
        }

        public static isWindows():boolean
        {
            if(navigator.userAgent.match(/Windows/i))
            {
                return true;
            }

            return false;
        }

        public static isMac():boolean
        {
            if(navigator.userAgent.match(/Mac/i))
            {
                return true;
            }

            return false;
        }


        /**
         *
         * @returns {boolean}
         */
        public static renderInWebGL():boolean
        {
            if(DeviceUtils.isChrome()
                || DeviceUtils.isOpera()
                || DeviceUtils.isIE11()
                || DeviceUtils.isFirefox())
            {
                return true;
            }
            return false;
        }

        public static lockScreenToPortrait():void
        {
            if(window.screen["mozLockOrientation"])
            {
                window.screen["mozLockOrientation"]("portrait-primary");
            }
            else if(window.screen["lockOrientation"])
            {
                window.screen["lockOrientation"]("portrait-primary");
            }
        }

        public static isLandscapeMode():boolean
        {
            if(window["orientation"] == null)
            {
                // ff for android
                return (window.innerWidth > window.innerHeight) && DeviceUtils.isMobileDevice();
            }

            if(window["orientation"] == 90 || window["orientation"] == -90)
            {
                return true && DeviceUtils.isMobileDevice();
            }

            return false;
        }

        public static isGamepadSupported():boolean
        {
            return !!navigator.webkitGetGamepads
                || !!navigator["webkitGamepads"] || (navigator.userAgent.indexOf('Firefox/') != -1);

        }

    }
}