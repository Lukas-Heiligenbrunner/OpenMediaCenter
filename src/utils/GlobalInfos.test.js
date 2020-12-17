import React from 'react';
import GlobalInfos from './GlobalInfos';

describe('<GlobalInfos/>', function () {
    it('always same instance ', function () {
        GlobalInfos.enableDarkTheme(true);

        expect(GlobalInfos.isDarkTheme()).toBe(true);

        GlobalInfos.enableDarkTheme(false);

        expect(GlobalInfos.isDarkTheme()).toBe(false);
    });

    it('test default theme', function () {
        expect(GlobalInfos.isDarkTheme()).toBe(false);
    });

    it('test receive of stylesheet', function () {
        const style = GlobalInfos.getThemeStyle();

        expect(style.navitem).not.toBeNull();
    });
});
