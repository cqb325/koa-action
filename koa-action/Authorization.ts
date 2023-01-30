export class Authorization {
    private data: any
    private permits: any
    private authorized: boolean;

    setData (data: any) {
        this.data = data;
    }

    getData () {
        return this.data;
    }

    setPermits (permits: any) {
        this.permits = permits;
    }

    setAuthorized (authorized: boolean) {
        this.authorized = authorized;
    }

    isAuthorized (): boolean {
        return this.authorized;
    }
}