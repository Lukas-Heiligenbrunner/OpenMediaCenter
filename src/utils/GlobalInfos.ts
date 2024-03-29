import darktheme from '../AppDarkTheme.module.css';
import lighttheme from '../AppLightTheme.module.css';

/**
 * This class is available for all components in project
 * it contains general infos about app - like theme
 */
class StaticInfos {
    private darktheme: boolean = true;
    private videopath: string = '';
    private tvshowpath: string = '';
    private TVShowsEnabled: boolean = false;
    private fullDeleteable: boolean = false;

    /**
     * check if the current theme is the dark theme
     * @returns {boolean} is dark theme?
     */
    isDarkTheme(): boolean {
        return this.darktheme;
    }

    /**
     * setter to enable or disable the dark or light theme
     * @param enable enable the dark theme?
     */
    enableDarkTheme(enable = true): void {
        if (this.darktheme !== enable) {
            this.darktheme = enable;

            // trigger onThemeChange handlers
            this.handlers.map((func) => {
                func();
            });
        }
    }

    /**
     * get the currently selected theme stylesheet
     * @returns {*} the style object of the current active theme
     */
    getThemeStyle(): {[_: string]: string} {
        return this.isDarkTheme() ? darktheme : lighttheme;
    }

    handlers: (() => void)[] = [];
    onThemeChange(func: () => void): void {
        this.handlers.push(func);
    }

    /**
     * set the current videopath
     * @param vidpath videopath with beginning and ending slash
     * @param tvshowpath
     */
    setVideoPaths(vidpath: string, tvshowpath: string): void {
        this.videopath = vidpath;
        this.tvshowpath = tvshowpath;
    }

    /**
     * return the current videopath
     */
    getVideoPath(): string {
        return this.videopath;
    }

    /**
     * return the current tvshow path
     */
    getTVShowPath(): string {
        return this.tvshowpath;
    }
}

export default new StaticInfos();
