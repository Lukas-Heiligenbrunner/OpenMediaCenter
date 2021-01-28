/**
 * add a new keyhandler
 * @param handler function to be called onkeyup
 */
export const addKeyHandler = (handler: (event: KeyboardEvent) => void): void => {
    document.addEventListener('keyup', handler);
};

/**
 * delete keyhandler
 * @param handler handler to be removed
 */
export const removeKeyHandler = (handler: (event: KeyboardEvent) => void): void => {
    document.removeEventListener('keyup', handler);
}
