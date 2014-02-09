/**
 * Created by bear on 2/3/14.
 */

module com.goldenratio
{
    export class GameEventType
    {

        public static START_GAME:string = "start_game";
        public static LEVEL_START:string = "level_start";
        public static LEVEL_COMPLETE:string = "level_complete";
        public static PLAYER_DIE:string = "player_die";
        public static SOUND_LOADED:string = "sound_loaded";
        public static SOUND_ERROR:string = "sound_error";

        public static TOGGLE_PAUSE:string = "game_pause";
        public static TOGGLE_MUTE:string = "game_mute";
        public static SHOW_MENU_FROM_GAME:string = "SHOW_MENU_FROM_GAME";

        public static GAMEPAD_ACTION_KEY:string = "GAMEPAD_ACTION_KEY";
        public static GAMEPAD_MUTE_KEY:string = "GAMEPAD_MUTE_KEY";
        public static GAMEPAD_MENU_KEY:string = "GAMEPAD_MENU_KEY";
        public static GAMEPAD_RIGHT_KEY:string = "GAMEPAD_RIGHT_KEY";
        public static GAMEPAD_LEFT_KEY:string = "GAMEPAD_LEFT_KEY";
        public static GAMEPAD_CONNECTED:string = "GAMEPAD_CONNECTED";
        public static GAMEPAD_DISCONNECTED:string = "GAMEPAD_DISCONNECTED";
    }
}