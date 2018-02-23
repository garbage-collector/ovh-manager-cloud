angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.logs.detail.roles", {
            url: "/roles",
            views: {
                logsContent: {
                    templateUrl: "app/dbaas/logs/detail/roles/logs-roles.html",
                    controller: "LogsRolesCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "dbaas/logs", "dbaas/logs/detail/roles"]
        })
        .state("dbaas.logs.detail.members", {
            url: "/members/:roleId",
            views: {
                logsContent: {
                    templateUrl: "app/dbaas/logs/detail/roles/members/logs-roles-members.html",
                    controller: "LogsRolesMembersCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "dbaas/logs", "dbaas/logs/roles/members"]
        });
});
