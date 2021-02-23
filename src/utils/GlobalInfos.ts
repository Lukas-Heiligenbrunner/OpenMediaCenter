import darktheme from '../AppDarkTheme.module.css';
import lighttheme from '../AppLightTheme.module.css';

/**
 * This class is available for all components in project
 * it contains general infos about app - like theme
 */
class StaticInfos {
    private darktheme: boolean = true;
    private videopath: string = ""

    /**
     * check if the current theme is the dark theme
     * @returns {boolean} is dark theme?
     */
    isDarkTheme(): boolean {
        return this.darktheme;
    };

    /**
     * setter to enable or disable the dark or light theme
     * @param enable enable the dark theme?
     */
    enableDarkTheme(enable = true): void {
        this.darktheme = enable;
    }

    /**
     * get the currently selected theme stylesheet
     * @returns {*} the style object of the current active theme
     */
    getThemeStyle(): { [_: string]: string } {
        return this.isDarkTheme() ? darktheme : lighttheme;
    }

    /**
     * set the current videopath
     * @param vidpath videopath with beginning and ending slash
     */
    setVideoPath(vidpath: string): void {
        this.videopath = vidpath;
    }

    /**
     * return the current videopath
     */
    getVideoPath(): string {
        return this.videopath;
    }
}

const GlobalInfos = new StaticInfos();
export default GlobalInfos;
