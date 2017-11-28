class CloudProjectComputeLoadbalancerService {
    constructor ($q, OvhApiCloudProjectIplb, OvhApiIpLoadBalancing, OvhApiCloudProject) {
        this.$q = $q;
        this.OvhApiCloudProjectIplb = OvhApiCloudProjectIplb;
        this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
        this.OvhApiCloudProject = OvhApiCloudProject;
    }

    getLoadbalancer (id) {
        return this.OvhApiIpLoadBalancing.Lexi().get({ serviceName: id })
            .$promise.then(loadbalancer => {
                if (loadbalancer.state !== "ok") {
                    return loadbalancer;
                }
                // Find the frontend http 80 if exists as this page only display a view for HTTP.
                return this.OvhApiIpLoadBalancing.Frontend().Http().Lexi().query({
                    serviceName: id,
                    port: 80
                }).$promise.then(frontendIds =>
                // Get frontend details
                    frontendIds.length && this.OvhApiIpLoadBalancing.Frontend().Http().Lexi().get({
                        serviceName: id,
                        frontendId: frontendIds[0]
                    }).$promise || loadbalancer
                ).then(frontend => {
                    if (frontend.frontendId) {
                        loadbalancer.frontend = frontend;
                    }
                    return frontend.frontendId && frontend.defaultFarmId && this.OvhApiIpLoadBalancing.Farm().Http().Lexi().get({
                        serviceName: id,
                        farmId: frontend.defaultFarmId
                    }).$promise || loadbalancer;
                }).then(farm => {
                    if (farm.farmId) {
                        loadbalancer.farm = farm;
                    }
                    return loadbalancer;
                });
            })
            .then(loadbalancer => {
                if (loadbalancer.state !== "ok") {
                    loadbalancer.status = "unavailable";
                } else if (loadbalancer.frontend && loadbalancer.farm) {
                    loadbalancer.status = "deployed";
                } else if (!loadbalancer.frontend && !loadbalancer.farm) {
                    loadbalancer.status = "available";
                } else if (loadbalancer.state !== "ok") {
                    loadbalancer.status = "unavailable";
                } else {
                    loadbalancer.status = "custom";
                }
                return loadbalancer;
            });
    }

    getLoadbalancersImported (serviceName) {
        return this.OvhApiCloudProjectIplb.Lexi().query({
            serviceName
        }).$promise.then(ids => this.$q.all(
            _.map(ids, id =>
                this.OvhApiCloudProjectIplb.Lexi().get({
                    serviceName,
                    id
                }).$promise
            )
        )
        ).then(loadbalancers => {
            const result = {};
            _.forEach(loadbalancers, lb => {
                result[lb.iplb] = lb;
            });
            return result;
        });
    }

    // Get servers of the default farm of the frontend
    // loadbalancer must be generated from function this.getLoadbalancer(id)
    getAttachedServers (loadbalancer) {
        if (!loadbalancer.farm) {
            return Promise.resolve([]);
        }
        return this.OvhApiIpLoadBalancing.Farm().Http().Server().Lexi()
            .query({
                serviceName: loadbalancer.serviceName,
                farmId: loadbalancer.farm.farmId
            }).$promise
            .then(serverIds =>
                this.$q.all(
                    _.map(serverIds, serverId => this.OvhApiIpLoadBalancing.Farm().Http().Server().Lexi()
                        .get({
                            serviceName: loadbalancer.serviceName,
                            farmId: loadbalancer.farm.farmId,
                            serverId
                        }).$promise
                    )
                )
            );
    }

    getServerList ({ serviceName, loadbalancer }) {
        return this.$q.all({
            cloudServers: this.OvhApiCloudProject.Instance().Lexi().query({ serviceName }).$promise,
            attachedServers: this.getAttachedServers(loadbalancer)
        }).then(({ cloudServers, attachedServers }) => {
            const activeServers = {};
            _.forEach(attachedServers, attachedServer => {
                if (attachedServer.status === "active") {
                    activeServers[attachedServer.address] = attachedServer;
                }
            });

            // Generate array of object type as {ipv4, name}
            // Concat all public ip of public cloud and of the loadbalancer.
            const servers = [].concat(
                _.uniq(
                    _.union(
                        _.flatten(_.map(cloudServers, server =>
                            _.map(_.filter(server.ipAddresses, { type: "public", version: 4 }), adresse => ({ label: server.name, ip: adresse.ip }))
                        )),
                        _.map(this.attachedServers, server => ({ label: server.displayName, ip: server.address }))
                    ),
                    "ip"
                )
            );
            return { servers, attachedServers: activeServers };
        }).catch(err => {
            this.CloudMessage.error([this.$translate.instant("cpc_server_error"), err.data && err.data.message || ""].join(" "));
        });
    }

}

angular.module("managerApp").service("CloudProjectComputeLoadbalancerService", CloudProjectComputeLoadbalancerService);
