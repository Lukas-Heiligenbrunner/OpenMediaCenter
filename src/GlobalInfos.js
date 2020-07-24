class GlobalInfos {
    isDarkTheme() {
        return true;
    };
}

const StaticInfos = new GlobalInfos();
Object.freeze(StaticInfos);

export default StaticInfos;
