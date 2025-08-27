export abstract class ThirdPartStrategy {
    abstract support: (key: string) => boolean;

    abstract redirect: (code: string) => unknown;

    abstract fetchToken: (code: string) => unknown;

    abstract createUser: (correlation_id: number, user_uuid: string) => unknown;

    abstract login: (correlationId: number) => unknown;

    abstract queryUser: (correlation_id: number) => unknown;
}
