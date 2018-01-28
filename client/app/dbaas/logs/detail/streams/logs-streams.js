angular.module("managerApp").config($stateProvider => {
    $stateProvider
        .state("dbaas.logs.detail.streams", {
            url: "/streams",
            redirectTo: "dbaas.logs.detail.streams.home",
            views: {
                logsContent: {
                    templateUrl: "app/dbaas/logs/detail/streams/logs-streams.html",
                    controller: "LogsStreamsCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "dbaas/logs", "dbaas/logs/streams"]
        })
        .state("dbaas.logs.detail.streams.home", {
            url: "/home",
            views: {
                logsStreams: {
                    templateUrl: "app/dbaas/logs/detail/streams/home/logs-streams-home.html",
                    controller: "LogsStreamsHomeCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "dbaas/logs", "dbaas/logs/streams"]
        })
        .state("dbaas.logs.detail.streams.detail", {
            url: "/:streamId",
            "abstract": true,
            views: {
                logsStreams: {
                    template: '<div ui-view="logsStreamsDetail"></div>'
                }
            },
            translations: ["common", "dbaas/logs", "dbaas/logs/streams"]
        })
        .state("dbaas.logs.detail.streams.add", {
            url: "/add",
            views: {
                logsStreams: {
                    templateUrl: "app/dbaas/logs/detail/streams/add/logs-streams-add.html",
                    controller: "LogsStreamsAddCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "dbaas/logs", "dbaas/logs/streams/add"]
        })
        .state("dbaas.logs.detail.streams.edit", {
            url: "/:streamId",
            views: {
                logsStreams: {
                    templateUrl: "app/dbaas/logs/detail/streams/add/logs-streams-add.html",
                    controller: "LogsStreamsAddCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "dbaas/logs", "dbaas/logs/streams/add"]
        })
        .state("dbaas.logs.detail.streams.detail.follow", {
            url: "/follow",
            views: {
                logsStreamsDetail: {
                    templateUrl: "app/dbaas/logs/detail/streams/follow/streams-follow.html",
                    controller: "LogsStreamsFollowCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "dbaas/logs", "dbaas/logs/streams/follow"]
        })
        .state("dbaas.logs.detail.streams.detail.archives", {
            url: "/archives",
            views: {
                logsStreamsDetail: {
                    templateUrl: "app/dbaas/logs/detail/streams/archives/streams-archives.html",
                    controller: "LogsStreamsArchivesCtrl",
                    controllerAs: "ctrl"
                }
            },
            translations: ["common", "dbaas/logs"]
        });
});
