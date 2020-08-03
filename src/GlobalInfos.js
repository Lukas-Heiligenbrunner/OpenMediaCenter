import darktheme from "./AppDarkTheme.module.css";
import lighttheme from "./AppLightTheme.module.css";

class GlobalInfos {
    #darktheme = true;

    isDarkTheme() {
        return this.#darktheme;
    };

    enableDarkTheme(enable = true){
        this.#darktheme = enable;
    }

    getThemeStyle(){
        return this.isDarkTheme() ? darktheme : lighttheme;
    }
}

const StaticInfos = new GlobalInfos();
//Object.freeze(StaticInfos);

export default StaticInfos;
