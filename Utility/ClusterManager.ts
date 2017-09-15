import * as cluster from "cluster";
import * as os from "os";
import * as log4js from "log4js";

export default class ClusterManager {
    private static log: log4js.Logger = log4js.getLogger("ClusterManager");

    private static workers: cluster.Worker[];
    private static initialized: boolean;

    public static Initialize(): boolean {
        if (this.initialized) {
            return false;
        }

        this.workers = [];
        this.initialized = true;

        var self = this;
        cluster.on("fork", (worker: cluster.Worker) => {
            var index = self.workers.indexOf(worker);
            if (index != -1) {
                ClusterManager.log.info(`Worker ${worker.id} has been forked`);
            } else {
                ClusterManager.log.error(`Unknown worker ${worker.id} has been forked, terminating...`);
                worker.kill();
            }
        });
        cluster.on("online", (worker: cluster.Worker) => {
            ClusterManager.log.info(`Worker ${worker.id} is now online`);
        });
        cluster.on("listening", (worker: cluster.Worker) => {
            ClusterManager.log.info(`Worker ${worker.id} is now listening`);
        });
        cluster.on("disconnect", (worker: cluster.Worker) => {
            ClusterManager.log.warn(`Worker ${worker.id} has disconnected`);
        });
        cluster.on("exit", (worker: cluster.Worker, code: number, signal: string) => {
            var index = self.workers.indexOf(worker);
            if (signal != "end" && index != -1) {
                var newWorker = cluster.fork();
                this.workers[index] = newWorker;
                ClusterManager.log.warn(`Worker ${worker.id} stopped unexpectedly, created new worker ${newWorker.id}`);
            }
        });

        return true;
    }

    public static Shutdown(): boolean {
        if (!this.initialized) {
            return false;
        }

        // Stop nodes
        for (var i = 0; i < this.workers.length; i++) {
            var worker = this.workers[i];
            worker.kill("end");
        }
        ClusterManager.log.info("Killed all workers");

        this.initialized = false;

        return true;
    }

    public static CreateWorker(): cluster.Worker {
        // Fork a process and store the newly created process
        var worker = cluster.fork();
        this.workers.push(worker);
        ClusterManager.log.info(`Created worker ${worker.id}`);
        return worker;
    }

    public static DestroyWorker(worker?: cluster.Worker): boolean {
        if (worker != null) {
            var index = this.workers.indexOf(worker);
            if (index == -1) {
                return false;
            }
        } else {
            worker = cluster.worker;
        }
        this.workers.splice(index, 1);
        worker.kill("end");
        ClusterManager.log.info(`Killed worker ${worker.id}`);
        return true;
    }

    public static GetCurrentWorker(): cluster.Worker {
        return cluster.worker;
    }

    public static GetCPUThreads(): number {
        return os.cpus().length;
    }

    public static IsMasterWorker(): boolean {
        return cluster.isMaster;
    }
}