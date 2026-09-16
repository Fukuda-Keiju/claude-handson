import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'app-menu-todo': {
                        table: 'sys_app_application'
                        id: '2cd6030ff79a4979967f985bd1da6647'
                    }
                    'app-module-todo-board': {
                        table: 'sys_app_module'
                        id: '3de53cf05f5246079697d97fe3fd522a'
                    }
                    'app-module-todo-list': {
                        table: 'sys_app_module'
                        id: '3454b2c5cb82488d8c8f6404be505ede'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'deae4db1acde4748990ddc87e32e7f5f'
                    }
                    'br-set-completed-at': {
                        table: 'sys_script'
                        id: 'e30c888ffc5345a99d01e456894e89ea'
                    }
                    'br-validate-title': {
                        table: 'sys_script'
                        id: 'f73689c335874e5091ace0ccbf7c5083'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '21e6c44229104554801959b6360d62fc'
                    }
                    'src_server_business-rules_set-completed-at_ts': {
                        table: 'sys_module'
                        id: 'cd422e081d494a169faae85c12e54765'
                    }
                    'src_server_business-rules_validate-title_ts': {
                        table: 'sys_module'
                        id: '43800fdf3fb047bfb1c47e4595e0e6d0'
                    }
                    'todo-item-demo-1': {
                        table: 'x_2221398_todo_item'
                        id: 'a87ac327b2b84af8b29c8889d644245f'
                    }
                    'todo-item-demo-2': {
                        table: 'x_2221398_todo_item'
                        id: '0b8740f7146e424d84a5e25fa2cc545c'
                    }
                }
                composite: [
                    {
                        table: 'sys_ux_lib_asset'
                        id: '0630f9d969c64bc4a87159b7db02347b'
                        key: {
                            name: 'x_2221398_todo/main.js.map'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0c98b8341bed4ee4be80b24c2a81386b'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '1b47e365622d4842918a9bdebf722dec'
                        key: {
                            application_file: 'ff7c4d5dfc3e406ebce2d7c43bf4e4dd'
                            source_artifact: 'd37c3256e8084f569dd6347ff8c09123'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1d139a7042ec4db3952030e496b45324'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'state'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '21698da320f147608a6473571c717c98'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'title'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '23d98c3a5a6a40f1b7f8bed14137ae4c'
                        key: {
                            application_file: 'c40c9d296e3b4fb89e29e92be390fe26'
                            source_artifact: 'd37c3256e8084f569dd6347ff8c09123'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '42858b91ad1c44a097b305b7a6836b00'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'completed_at'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '4444c55398d64df5b31ab9744d3bfd10'
                        key: {
                            name: 'x_2221398_todo_item'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '62d31c20e4c94c56a4cba669a1629369'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'due_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '671b466d0ac04d4798cb75c3bd44e4fc'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '94d28797a7f5442a8250283d90684cc6'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'state'
                            value: 'done'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a38b10b78ebb4c2eb4ea92ed3c45b56e'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'ae80e6e3c06043cf93a3a3007a601773'
                        key: {
                            application_file: '0630f9d969c64bc4a87159b7db02347b'
                            source_artifact: 'd37c3256e8084f569dd6347ff8c09123'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b06a64cb74544c73946058e31f1b98b2'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'b1da5fbeb771498aa4c54014ab9c02b2'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b89702c3a93e4ffd98c21523c5beab64'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bd18ee3670634d1fbed8f79a25cd6acd'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'c37e6a2cb39e432bb9463744945d50a3'
                        key: {
                            name: 'x_2221398_todo_item'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'c40c9d296e3b4fb89e29e92be390fe26'
                        key: {
                            endpoint: 'x_2221398_todo_board.do'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ca3b837c1f7a446bbd8ac8219746d371'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'due_date'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: 'd37c3256e8084f569dd6347ff8c09123'
                        key: {
                            name: 'x_2221398_todo_board.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ed5e8b91198c4911983c897daf1d2a65'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'state'
                            value: 'open'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fbcf20a62d304276937b7f6ada73fd08'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ff2c80304975488196548f73817f09cb'
                        key: {
                            name: 'x_2221398_todo_item'
                            element: 'notes'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'ff7c4d5dfc3e406ebce2d7c43bf4e4dd'
                        key: {
                            name: 'x_2221398_todo/main'
                        }
                    },
                ]
            }
        }
    }
}
