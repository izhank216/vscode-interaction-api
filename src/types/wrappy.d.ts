declare module "wrappy" {
    function wrappy<T extends (...args: any[]) => any>(fn: T): T;
    export = wrappy;
}
