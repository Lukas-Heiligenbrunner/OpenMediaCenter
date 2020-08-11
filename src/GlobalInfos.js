import darktheme from "./AppDarkTheme.module.css";
import lighttheme from "./AppLightTheme.module.css";

/**
 * This class is available for all components in project
 * it contains general infos about app - like theme
 */
class StaticInfos {
    #darktheme = true;

    /**
     * check if the current theme is the dark theme
     * @returns {boolean} is dark theme?
     */
    isDarkTheme() {
        return this.#darktheme;
    };

    /**
     * setter to enable or disable the dark or light theme
     * @param enable enable the dark theme?
     */
    enableDarkTheme(enable = true) {
        this.#darktheme = enable;
    }

    /**
     * get the currently selected theme stylesheet
     * @returns {*} the style object of the current active theme
     */
    getThemeStyle() {
        return this.isDarkTheme() ? darktheme : lighttheme;
    }
}

const GlobalInfos = new StaticInfos();
export default GlobalInfos;