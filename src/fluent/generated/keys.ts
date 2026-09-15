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
                    'br-set-completed-at': {
                        table: 'sys_script'
                        id: '95a96788ccc6479d9871d65f75cbff85'
                    }
                    br0: {
                        table: 'sys_script'
                        id: 'd93c4a1d833a4657bf38dc18d6dac534'
                    }
                    cs0: {
                        table: 'sys_script_client'
                        id: 'c57ee7492cb1490a87af9771e76df25e'
                    }
                    'handson-task-demo-1': {
                        table: 'x_2221398_handson_task'
                        id: '58f4353a490b4a149136c38620dcbe10'
                    }
                    'handson-task-demo-2': {
                        table: 'x_2221398_handson_task'
                        id: 'bc12d15db0c5418b94e016e51fd92e62'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: 'fb7af63467064366967a33eb2d2a1830'
                    }
                    'src_server_business-rules_set-completed-at_ts': {
                        table: 'sys_module'
                        id: '5e6b219d80f5429f9b68b51f0a837e19'
                    }
                    src_server_script_ts: {
                        table: 'sys_module'
                        id: 'd378dee6354547fdbc24ca726d4cdccf'
                    }
                }
                composite: [
                    {
                        table: 'sys_dictionary'
                        id: '0b74785fb4dc41ed80809905f0c26b85'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'due_date'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '100c50c7e9bb4a9d83b53d063ff02001'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'notes'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '149abb7ad9c54deeb3f5b0b956e4a647'
                        key: {
                            name: 'x_2221398_handson_task'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '345bbafb3c0043aaa273fd5fd3b7015b'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'state'
                            value: 'done'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3a2c753bb1f14e6cba3fac77e09cd3b2'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3d3ca8e3e64e48b9ac13eb8f9ae649d1'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'state'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '40d16d5ad9d347a38ef08f23fd863ef8'
                        key: {
                            name: 'x_2221398_handson_task'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '488d516430664dde9689317c23b2b9bb'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'state'
                            value: 'open'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '74c28aeac0634d59b705168126e8d3ef'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '8951a050d7a742f692d18f13960e82fa'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8fee3a4f048e4b329e8697263873cee8'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9a744559b05c411e93b5555a482b9291'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a113f0e96d324320879c0942ff9f4006'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'title'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cfc7fceb8ef44e3cb648deb27344b7bd'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e84ca085cdf94a5e8af65c547f4ac4cd'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f223bbb9560e4545824b1c8b1562ffaa'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f238542ce6694e59b67172cec910c4ca'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'due_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f7097fd1125b45778230a817fbc3e55b'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'completed_at'
                        }
                    },
                ]
            }
        }
    }
}
