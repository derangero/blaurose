
export function formatDisplayTime(time? : number) : string {
    if (time != null) {
        const hour = Math.floor(time / 60);
        const minutes = time % 60;
        return ( '00' + hour ).slice( -2 ) + ":" + ( '00' + minutes ).slice( -2 );
    }

    return "";
}
