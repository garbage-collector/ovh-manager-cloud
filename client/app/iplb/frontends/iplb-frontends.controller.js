class IpLoadBalancerFrontendsCtrl {
    constructor ($state, $stateParams, $translate, CloudMessage, ControllerHelper,
                 IpLoadBalancerActionService, IpLoadBalancerFrontendsService) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.CloudMessage = CloudMessage;
        this.ControllerHelper = ControllerHelper;
        this.IpLoadBalancerActionService = IpLoadBalancerActionService;
        this.IpLoadBalancerFrontendService = IpLoadBalancerFrontendsService;
    }

    $onInit () {
        this.init();
    }

    init () {
        this.loading = true;
        this.IpLoadBalancerFrontendService.getFrontends(this.$stateParams.serviceName)
            .then(results => {
                this.loading = false;
                this.frontends = results;
            });
    }

    loadFarm (frontend) {
        if (!frontend.defaultFarmId) {
            frontend.defaultFarm = null;
        }
        return this.IpLoadBalancerFrontendService.getFarm(frontend.protocol, this.$stateParams.serviceName, frontend.defaultFarmId)
            .then(farm => ({ defaultFarm: farm }));
    }

    update (frontend) {
        this.$state.go("network.iplb.detail.frontends.update", {
            serviceName: this.$stateParams.serviceName,
            frontendId: frontend.frontendId
        });
    }

    delete (frontend) {
        this.IpLoadBalancerActionService.deleteFrontend(
            this.$stateParams.serviceName,
            frontend
        ).then(() => this.init());
    }

    preview (frontend) {
        this.ControllerHelper.modal.showModal({
            modalConfig: {
                templateUrl: "app/iplb/frontends/preview/iplb-frontends-preview.html",
                controller: "IpLoadBalancerFrontendPreviewCtrl",
                controllerAs: "IpLoadBalancerFrontendPreviewCtrl",
                resolve: {
                    frontend: () => frontend
                }
            }
        });
    }

    toggle (frontend) {
        // frontend.disabled = !frontend.disabled;
        this.IpLoadBalancerFrontendService.toggleFrontend(
            frontend.protocol,
            this.$stateParams.serviceName,
            _.assign({}, frontend, {
                disabled: !frontend.disabled
            })
        ).then(() => {
            // Apply value on model
            frontend.disabled = !frontend.disabled;
        });
    }
}

angular.module("managerApp").controller("IpLoadBalancerFrontendsCtrl", IpLoadBalancerFrontendsCtrl);
