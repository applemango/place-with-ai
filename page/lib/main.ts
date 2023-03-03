export function getUrl(url: string, type:string = "http", domain:string = "127.0.0.1", port:number = 5000): string {
    if(!url) {
        return `${type}://${domain}:${port}`
    }
    return `${type}://${domain}:${port}/${url}`
}