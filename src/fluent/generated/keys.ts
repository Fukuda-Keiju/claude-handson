import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'ad3bfc7057bb43ca9620da5487363fd5'
                    }
                    br0: {
                        table: 'sys_script'
                        id: 'd93c4a1d833a4657bf38dc18d6dac534'
                    }
                    cs0: {
                        table: 'sys_script_client'
                        id: 'c57ee7492cb1490a87af9771e76df25e'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'fb7af63467064366967a33eb2d2a1830'
                    }
                    src_server_script_ts: {
                        table: 'sys_module'
                        id: 'd378dee6354547fdbc24ca726d4cdccf'
                    }
                }
            }
        }
    }
}
