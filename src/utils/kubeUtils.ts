import { CoreV1Api, KubeConfig } from "@kubernetes/client-node";
const config = new KubeConfig();
config.loadFromDefault();

export const coreClient = config.makeApiClient(CoreV1Api);
