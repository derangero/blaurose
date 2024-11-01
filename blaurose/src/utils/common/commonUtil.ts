
export function formatDisplayTime(time? : number) : string {
    if (time != null) {
        const hour = Math.floor(time / 60);
        const minutes = time % 60;
        return ( '00' + hour ).slice( -2 ) + ":" + ( '00' + minutes ).slice( -2 );
    }

    return "";
}

/**
 * 値がNullまたは空白である場合、trueを返します。
 * @param {string|null} value - 値
 * @return {boolean} 値がNullまたは空白かどうか
 */
export function isNullOrEmpty(value: any) {
    if (value == null || value == "") {
        return true;
    }
    return false;
}