export function getUrl(url: string, type:string = "http", domain:string = "192.168.1.2", port:number = 5000): string {
    if(!url) {
        return `${type}://${domain}:${port}`
    }
    return `${type}://${domain}:${port}/${url}`
}