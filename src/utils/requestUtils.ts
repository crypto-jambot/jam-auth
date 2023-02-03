import { IncomingMessage } from "http";

type KubeResponse<T> = {
    response: IncomingMessage;
    body: T;
};

export async function makeRequest<T>(
    request: Promise<KubeResponse<T>>
): Promise<KubeResponse<T>> {
    return new Promise<KubeResponse<T>>(async (resolve, reject) => {
        try {
            const response = await request;
            resolve(response);
        } catch (err: any) {
            reject({
                statusCode: err?.statusCode || 403,
                message: err?.body ?? err,
            });
        }
    });
}
