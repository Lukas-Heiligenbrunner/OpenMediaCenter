class GlobalInfos {
    #darktheme = false;

    isDarkTheme() {
        return this.#darktheme;
    };

    enableDarkTheme(enable = true){
        this.#darktheme = enable;
    }
}

const StaticInfos = new GlobalInfos();
Object.freeze(StaticInfos);

export default StaticInfos;
