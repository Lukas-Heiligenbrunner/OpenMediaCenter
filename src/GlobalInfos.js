import darktheme from "./AppDarkTheme.module.css";
import lighttheme from "./AppLightTheme.module.css";

class StaticInfos {
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

const GlobalInfos = new StaticInfos();
//Object.freeze(StaticInfos);

export default GlobalInfos;
