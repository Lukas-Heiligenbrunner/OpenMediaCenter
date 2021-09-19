export interface Token {
    Token: string;
    ExpiresAt: number;
}

export namespace cookie {
    const jwtcookiename = 'jwt';

    export function Store(data: Token): void {
        const d = new Date();
        d.setTime(data.ExpiresAt * 1000);
        const expires = 'expires=' + d.toUTCString();

        document.cookie = jwtcookiename + '=' + JSON.stringify(data) + ';' + expires + ';path=/';
    }

    export function Load(): Token | null {
        const datastr = decodeCookie(jwtcookiename);
        if (datastr === '') {
            return null;
        }

        try {
            return JSON.parse(datastr);
        } catch (e) {
            // if cookie not decodeable delete it and return null
            Delete();
            return null;
        }
    }

    export function Delete(): void {
        document.cookie = `${jwtcookiename}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    /**
     * decode a simple cookie with key specified
     * @param key cookie key
     */
    function decodeCookie(key: string): string {
        let name = key + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }
}
