import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'app-menu-handson': {
                        table: 'sys_app_application'
                        id: 'ce4a81aae5b549ca80106c7cbf871954'
                    }
                    'app-module-task-board': {
                        table: 'sys_app_module'
                        id: '03e36fd8592f491587d00878898e081a'
                    }
                    'app-module-task-list': {
                        table: 'sys_app_module'
                        id: '2010a8fdd5804f0c8d000fea6f7a32df'
                    }
                    'atf-completed-at-insert-done': {
                        table: 'sys_atf_test'
                        id: '65a0c57997da4485a45d1415a9b875a9'
                    }
                    'atf-completed-at-insert-done-check': {
                        table: 'sys_atf_step'
                        id: '21f0c6b5931f42bbb25d8b4f9ceb0806'
                    }
                    'atf-completed-at-insert-done-cleanup': {
                        table: 'sys_atf_step'
                        id: '40e33e00a1064cde8cc50807e9e3b63a'
                    }
                    'atf-completed-at-insert-done-insert': {
                        table: 'sys_atf_step'
                        id: 'c016d830bffd4dd48da5bd0ea8dcd66c'
                    }
                    'atf-completed-at-insert-open': {
                        table: 'sys_atf_test'
                        id: 'c86d363097b149a2a17db8e2e87568ac'
                    }
                    'atf-completed-at-insert-open-check': {
                        table: 'sys_atf_step'
                        id: 'cb560b903ace4e2a951757b1de071067'
                    }
                    'atf-completed-at-insert-open-cleanup': {
                        table: 'sys_atf_step'
                        id: 'fc18acafbe134c358a41bf1f5c7324d8'
                    }
                    'atf-completed-at-insert-open-insert': {
                        table: 'sys_atf_step'
                        id: 'cd307e8193e8444892300eb09be0e9b5'
                    }
                    'atf-completed-at-reopen': {
                        table: 'sys_atf_test'
                        id: '25d743908d3d4305bf31da592cfd3350'
                    }
                    'atf-completed-at-reopen-check': {
                        table: 'sys_atf_step'
                        id: 'e7ce3ec56aa2458aa130857293f1ed6f'
                    }
                    'atf-completed-at-reopen-cleanup': {
                        table: 'sys_atf_step'
                        id: '6d29a57c12a342bb8e82b89c88200300'
                    }
                    'atf-completed-at-reopen-insert': {
                        table: 'sys_atf_step'
                        id: '2b86f9f2fba04ebdb3de38e523212639'
                    }
                    'atf-completed-at-reopen-update': {
                        table: 'sys_atf_step'
                        id: 'fd52779a888d47bab80bc7db8481402c'
                    }
                    'atf-completed-at-update-done': {
                        table: 'sys_atf_test'
                        id: '3a8f5e340ed3439598438607851c2975'
                    }
                    'atf-completed-at-update-done-check': {
                        table: 'sys_atf_step'
                        id: 'd9ad718d94a74a7bb682b2c113e470bb'
                    }
                    'atf-completed-at-update-done-cleanup': {
                        table: 'sys_atf_step'
                        id: '04194770472641ee9a02fee8c50ee76b'
                    }
                    'atf-completed-at-update-done-insert': {
                        table: 'sys_atf_step'
                        id: 'e65ba3150234490e9677eb115bcf128d'
                    }
                    'atf-completed-at-update-done-update': {
                        table: 'sys_atf_step'
                        id: '68689d3ac1a9430da22c8eaac3c1403d'
                    }
                    'atf-create-step-delete': {
                        table: 'sys_atf_step'
                        id: '3fd0afa1cc7948ec9d4f103ba84659c2'
                    }
                    'atf-create-step-query': {
                        table: 'sys_atf_step'
                        id: '6893fc1979f2428b99fe2387228295d4'
                    }
                    'atf-create-step-ui': {
                        table: 'sys_atf_step'
                        id: '92b884f52b934df4ba1ecdf112caad75'
                    }
                    'atf-create-step-validate': {
                        table: 'sys_atf_step'
                        id: '4ddc8f42c21b456282756a0016118f0f'
                    }
                    'atf-create-test': {
                        table: 'sys_atf_test'
                        id: '374831b16f5d4de5a51053e0d6cca11b'
                    }
                    'atf-header-new-step-ui': {
                        table: 'sys_atf_step'
                        id: '73c81f3285d24003b0a37890499e3ba3'
                    }
                    'atf-header-new-test': {
                        table: 'sys_atf_test'
                        id: '215a3a36cd9f4aa8994626f751b74c0e'
                    }
                    'atf-kanban-delete': {
                        table: 'sys_atf_step'
                        id: 'd7416b49075d48f391b8f0232706ac57'
                    }
                    'atf-kanban-insert': {
                        table: 'sys_atf_step'
                        id: 'ffc411eea7a942d998e150848bc38800'
                    }
                    'atf-kanban-test': {
                        table: 'sys_atf_test'
                        id: '72337dbabf524eb493b33f146024d46b'
                    }
                    'atf-kanban-ui': {
                        table: 'sys_atf_step'
                        id: '424707df54a24ec094c9eaa4f990ab23'
                    }
                    'atf-kanban-validate': {
                        table: 'sys_atf_step'
                        id: 'c3740c884a6d49b2a58fc209407e4167'
                    }
                    'atf-list-delete-done': {
                        table: 'sys_atf_step'
                        id: '4d910685ec0c4e509294296a45bb878a'
                    }
                    'atf-list-delete-open': {
                        table: 'sys_atf_step'
                        id: '307a5d74967447779b849fb22ce47946'
                    }
                    'atf-list-filter-test': {
                        table: 'sys_atf_test'
                        id: '06919fb4397346f688522bd43a1577a3'
                    }
                    'atf-list-insert-done': {
                        table: 'sys_atf_step'
                        id: 'ebb0bb6863554c98a362e15a77a611bc'
                    }
                    'atf-list-insert-open': {
                        table: 'sys_atf_step'
                        id: 'b189ca51a0c54dc482fd33f9846e472f'
                    }
                    'atf-list-run-script': {
                        table: 'sys_atf_step'
                        id: '7040951b9fdb43b191bfc4ac0f981194'
                    }
                    'atf-navigator-modules': {
                        table: 'sys_atf_test'
                        id: 'f3e7968305e24ba79f5644905af257bd'
                    }
                    'atf-navigator-modules-visible': {
                        table: 'sys_atf_step'
                        id: 'dda3126ef936434fb5184cda719f0826'
                    }
                    'atf-open-card-delete': {
                        table: 'sys_atf_step'
                        id: '2126fda36bcc4a9fa5eb49a789f68ea4'
                    }
                    'atf-open-card-insert': {
                        table: 'sys_atf_step'
                        id: 'c1a5002e844e4441b3ae5847e9832447'
                    }
                    'atf-open-card-test': {
                        table: 'sys_atf_test'
                        id: 'e0da01068efe42c38389721f3e005581'
                    }
                    'atf-open-card-ui': {
                        table: 'sys_atf_step'
                        id: 'bcbdd73a13f74df780825cd7070f64e4'
                    }
                    'atf-suite-handson': {
                        table: 'sys_atf_test_suite'
                        id: '13abb880d135480488bf9b3653db9afa'
                    }
                    'atf-tabs-step-ui': {
                        table: 'sys_atf_step'
                        id: 'f48f3f403cd44e8cb7941e243bc319ab'
                    }
                    'atf-tabs-test': {
                        table: 'sys_atf_test'
                        id: 'fc4b2b636042447dac42bea6aa98040a'
                    }
                    'atf-tiles-delete-done': {
                        table: 'sys_atf_step'
                        id: '7096b53bd5ee48ef8a09cb9ab6bf17a7'
                    }
                    'atf-tiles-delete-open': {
                        table: 'sys_atf_step'
                        id: '56a080206b3744ce8cd5a27af920736e'
                    }
                    'atf-tiles-insert-done': {
                        table: 'sys_atf_step'
                        id: 'dcb817acd0084c86bc5b9641b47fc47f'
                    }
                    'atf-tiles-insert-open': {
                        table: 'sys_atf_step'
                        id: 'dfe71e00977a45f3872be664ddfea4d8'
                    }
                    'atf-tiles-step-ui': {
                        table: 'sys_atf_step'
                        id: '703994115a4c465bac7c3a161c02e50f'
                    }
                    'atf-tiles-test': {
                        table: 'sys_atf_test'
                        id: 'c48d3bab9c0a40d8a70fa1711a2f37f1'
                    }
                    'atf-unsaved-step-ui': {
                        table: 'sys_atf_step'
                        id: 'f17665f8186042c2849c109702664faf'
                    }
                    'atf-unsaved-test': {
                        table: 'sys_atf_test'
                        id: '04e34e9f57f644259cfa0f8bba3a6c0d'
                    }
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
                        table: 'sys_variable_value'
                        id: '00c41d32e7ff4318824bcf1427252f38'
                        key: {
                            document_key: 'c1a5002e844e4441b3ae5847e9832447'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '013506b4037e4b2ea1b1e301b770500e'
                        key: {
                            document_key: 'f17665f8186042c2849c109702664faf'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '01e563806bec4d86ae7339b703b3b053'
                        key: {
                            document_key: '04194770472641ee9a02fee8c50ee76b'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '03ef47b6cdf14a9191ec0d3e3aebf194'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: '374831b16f5d4de5a51053e0d6cca11b'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '07468d8421ca4d83a0c21be7d6ae7d1f'
                        key: {
                            document_key: '6d29a57c12a342bb8e82b89c88200300'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0757b1dfed394d3bb58739e9c519063c'
                        key: {
                            document_key: 'dcb817acd0084c86bc5b9641b47fc47f'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '098521293ffc4e00bd80e3e219fa3a0d'
                        key: {
                            document_key: '6d29a57c12a342bb8e82b89c88200300'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0b74785fb4dc41ed80809905f0c26b85'
                        key: {
                            name: 'x_2221398_handson_task'
                            element: 'due_date'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '0b9c73e9716d479c8ec8a0c0d7b66830'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: 'c86d363097b149a2a17db8e2e87568ac'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0d7f1df74c7e4be9b52ddcea92fd8b71'
                        key: {
                            document_key: 'dda3126ef936434fb5184cda719f0826'
                            variable: '4a3319d73702030064a52f3c8e41f1a9'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '0ed20feac0c04e2a9cf7113a9abead87'
                        key: {
                            document_key: 'dfe71e00977a45f3872be664ddfea4d8'
                            variable: 'e6e3c7535320220002c6435723dc3496'
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
                        table: 'sys_variable_value'
                        id: '113d2d8fd09a487a9ecda7387f188d35'
                        key: {
                            document_key: 'cb560b903ace4e2a951757b1de071067'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1164d586fd9d474aa2a70992f3f77343'
                        key: {
                            document_key: 'c3740c884a6d49b2a58fc209407e4167'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '122791e79b04439aaefb87b9fb4bc34d'
                        key: {
                            document_key: 'e65ba3150234490e9677eb115bcf128d'
                            variable: 'e6e3c7535320220002c6435723dc3496'
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
                        table: 'sys_variable_value'
                        id: '15093a8735964d4581366b086442078d'
                        key: {
                            document_key: 'ffc411eea7a942d998e150848bc38800'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '17c74492b2ab4154b89152009089f6ee'
                        key: {
                            document_key: '2b86f9f2fba04ebdb3de38e523212639'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1837dbe4362a42f1aba63ab0171d5130'
                        key: {
                            document_key: 'cb560b903ace4e2a951757b1de071067'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '196e6b397d1e476d871aabc5e1b46dbe'
                        key: {
                            document_key: 'dfe71e00977a45f3872be664ddfea4d8'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '19c05bd12f634f1f88e4470870118d61'
                        key: {
                            document_key: 'd9ad718d94a74a7bb682b2c113e470bb'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '19e3221166c048be9cd4ac0783d7a0e6'
                        key: {
                            document_key: 'd9ad718d94a74a7bb682b2c113e470bb'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '1c5247f743494d47a7dba9e74f196a8e'
                        key: {
                            name: 'x_2221398_handson_task_board.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1cfc2d7e970a4c13b3c5b4df8aaadae6'
                        key: {
                            document_key: 'e7ce3ec56aa2458aa130857293f1ed6f'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '209dfc7bba1d474e8ce69aa44e7efce1'
                        key: {
                            document_key: '21f0c6b5931f42bbb25d8b4f9ceb0806'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '21f04efd10c747b1b4125eb1cc7e3021'
                        key: {
                            name: 'x_2221398_handson/main'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '23a2e054824949f5a0b4952f5080dbc7'
                        key: {
                            document_key: 'ebb0bb6863554c98a362e15a77a611bc'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '2478a7b97b1b405086d5c9ad0e1d77ce'
                        key: {
                            id: '7096b53bd5ee48ef8a09cb9ab6bf17a7'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '26775def59de44a2b42b089f994f1c54'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: 'f3e7968305e24ba79f5644905af257bd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2684232efde24105b3f1d561ae301e93'
                        key: {
                            document_key: 'c3740c884a6d49b2a58fc209407e4167'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '272ab2a294464638b4becd04ac21dbb7'
                        key: {
                            document_key: '4d910685ec0c4e509294296a45bb878a'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '294c4d5a35e74e3fbdc1770f9802691b'
                        key: {
                            document_key: 'c3740c884a6d49b2a58fc209407e4167'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '29e145501f0e4fccaa2f0d9580fe4680'
                        key: {
                            id: '40e33e00a1064cde8cc50807e9e3b63a'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2a853d9f6a654af499bd2e602c1d89a6'
                        key: {
                            document_key: 'dda3126ef936434fb5184cda719f0826'
                            variable: 'b4e438ae73322010ac1560bdfaf6a7a2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2b96836d09294c85beb757aae6189adf'
                        key: {
                            document_key: '7096b53bd5ee48ef8a09cb9ab6bf17a7'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2c5f9a27ae9049178e86082d6e3e7db7'
                        key: {
                            document_key: 'cb560b903ace4e2a951757b1de071067'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '2d7409e0bc0444e4b3d8f82c4e130f4e'
                        key: {
                            endpoint: 'x_2221398_handson_task_board.do'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2e5a09b716fc46d79dde3e37f3368837'
                        key: {
                            document_key: 'e7ce3ec56aa2458aa130857293f1ed6f'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '2fe8c686182d4d33af94112eac43bf33'
                        key: {
                            document_key: 'cd307e8193e8444892300eb09be0e9b5'
                            variable: 'dd54cf535320220002c6435723dc34fd'
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
                        table: 'sys_variable_value'
                        id: '3590dbe416da4962b15a6d32c9e846f3'
                        key: {
                            document_key: '7096b53bd5ee48ef8a09cb9ab6bf17a7'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '359c50eaa80242c88a36a470567de98b'
                        key: {
                            document_key: 'dda3126ef936434fb5184cda719f0826'
                            variable: '8570e0e33756030064a52f3c8e41f16c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3681628dda6744a88d9169161d976dd5'
                        key: {
                            document_key: 'fd52779a888d47bab80bc7db8481402c'
                            variable: '501c8f535320220002c6435723dc34da'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '368eff8d58084b58bdbe1418a7b2e0c6'
                        key: {
                            document_key: '703994115a4c465bac7c3a161c02e50f'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '37d674761d3f4207b00b24c294cf4065'
                        key: {
                            document_key: '4ddc8f42c21b456282756a0016118f0f'
                            variable: '67400008676003007ba405225685efa4'
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
                        table: 'sys_variable_value'
                        id: '3bedf9b08c7140c5aedf1b9b0c9795f1'
                        key: {
                            document_key: 'c3740c884a6d49b2a58fc209407e4167'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3c9b40755a754cba8381bdb0fb8bbd5a'
                        key: {
                            document_key: '21f0c6b5931f42bbb25d8b4f9ceb0806'
                            variable: '6aad5a575360220002c6435723dc34b0'
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
                        table: 'sys_variable_value'
                        id: '3d9b2f625f1f46f98d6bbc59b349dffe'
                        key: {
                            document_key: '6d29a57c12a342bb8e82b89c88200300'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '40168c42be344d5d88b5688c245b1c26'
                        key: {
                            document_key: '68689d3ac1a9430da22c8eaac3c1403d'
                            variable: '501c8f535320220002c6435723dc34da'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4070a91e19314d14b5f96d723f51427e'
                        key: {
                            document_key: 'e65ba3150234490e9677eb115bcf128d'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '40a2b08177bc4979b3a1079782d8c9b1'
                        key: {
                            document_key: '4ddc8f42c21b456282756a0016118f0f'
                            variable: '52ed1e5b5360220002c6435723dc3421'
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
                        table: 'sys_atf_test_suite_test'
                        id: '416540516ce34a1cb8ec3676a4f5005c'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: 'c48d3bab9c0a40d8a70fa1711a2f37f1'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '424a76b2c6674780903e63b34f762ada'
                        key: {
                            document_key: 'd9ad718d94a74a7bb682b2c113e470bb'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '42524812d3724d529c5ef73365792b4c'
                        key: {
                            document_key: '40e33e00a1064cde8cc50807e9e3b63a'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '446a7eca7a49467e9e6ab8b70eaa7faa'
                        key: {
                            document_key: '6893fc1979f2428b99fe2387228295d4'
                            variable: '02fb0027531000109e02ddeeff7b120b'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '44a764f626164198a5f2ff00a085aee3'
                        key: {
                            document_key: '6893fc1979f2428b99fe2387228295d4'
                            variable: '78b8d86b531000109e02ddeeff7b12f3'
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
                        table: 'sys_variable_value'
                        id: '49a9954611b6471c8fd51899c25b8daa'
                        key: {
                            document_key: '3fd0afa1cc7948ec9d4f103ba84659c2'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4a9202a1403544e0a6d0d85dc2b070c7'
                        key: {
                            document_key: '307a5d74967447779b849fb22ce47946'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4c686ccfc9d14e40820ce1139d524eec'
                        key: {
                            document_key: 'c016d830bffd4dd48da5bd0ea8dcd66c'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4c7ddc553cb946a593fc33a5690e3772'
                        key: {
                            document_key: 'cd307e8193e8444892300eb09be0e9b5'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4d397d01fe474854b24e4858a388de5e'
                        key: {
                            document_key: 'c016d830bffd4dd48da5bd0ea8dcd66c'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '4ec9e40b5555476a9a54722c3c86e433'
                        key: {
                            id: '21f0c6b5931f42bbb25d8b4f9ceb0806'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5233d6d144e141bfa459b5f97dfabdd0'
                        key: {
                            document_key: 'bcbdd73a13f74df780825cd7070f64e4'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '54d5cbe6b1e3406b82343f1663d425f6'
                        key: {
                            id: '3fd0afa1cc7948ec9d4f103ba84659c2'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5781f14b94b74ebf93bb5dffd4821dde'
                        key: {
                            document_key: 'c3740c884a6d49b2a58fc209407e4167'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '578dfab618834b68ac5b037ee4be9e9f'
                        key: {
                            document_key: 'd9ad718d94a74a7bb682b2c113e470bb'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5950cca2ec1a427292d75a4509801ea1'
                        key: {
                            document_key: 'dcb817acd0084c86bc5b9641b47fc47f'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5a3919bc14cf45a3b20ff9af1c9e0125'
                        key: {
                            document_key: '68689d3ac1a9430da22c8eaac3c1403d'
                            variable: 'bc4c43935320220002c6435723dc34a2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5a5cc152a0564e57add584d13410b2c2'
                        key: {
                            document_key: '68689d3ac1a9430da22c8eaac3c1403d'
                            variable: '334b7bb7675003007ba405225685ef72'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5b47644ff5d940dfb131631a44a66f33'
                        key: {
                            document_key: '6893fc1979f2428b99fe2387228295d4'
                            variable: '915990ab531000109e02ddeeff7b12f8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5db2c322dc9843348c20a753d32328df'
                        key: {
                            document_key: 'fc18acafbe134c358a41bf1f5c7324d8'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5f1a22c765d041b799422a1b33651fc3'
                        key: {
                            document_key: 'd7416b49075d48f391b8f0232706ac57'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '6506ea2737a54e54badba41cadf06581'
                        key: {
                            name: 'x_2221398_handson/main.js.map'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '67af8cb4b26441eb96cc1e8fa247deb8'
                        key: {
                            document_key: '2126fda36bcc4a9fa5eb49a789f68ea4'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '68979d31daa54f818ce0b5e87e983362'
                        key: {
                            document_key: '56a080206b3744ce8cd5a27af920736e'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '6a35fd63d1434238af39c55ffece7000'
                        key: {
                            id: '68689d3ac1a9430da22c8eaac3c1403d'
                            table: 'var__m_atf_input_variable_17a72288df60220062fe6c7a4df26397'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '6f06c9ac6c6e425ea04f50bfd3a65051'
                        key: {
                            document_key: '3fd0afa1cc7948ec9d4f103ba84659c2'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '6fa7baf31f42456097b2a30070a1b95e'
                        key: {
                            id: 'd9ad718d94a74a7bb682b2c113e470bb'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '71565d5aea5f48688e9b9350c121639e'
                        key: {
                            id: 'fc18acafbe134c358a41bf1f5c7324d8'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7167d01cdcd647d89a9b454299dcb542'
                        key: {
                            document_key: '4ddc8f42c21b456282756a0016118f0f'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '720b1065823b4ebfb4bf1b3f54adef18'
                        key: {
                            document_key: '40e33e00a1064cde8cc50807e9e3b63a'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '73058673e3c8400cb9ae476befa4cd3b'
                        key: {
                            document_key: '56a080206b3744ce8cd5a27af920736e'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7397d2a2bb2a4ab59dcae54a5b082ac3'
                        key: {
                            document_key: '4ddc8f42c21b456282756a0016118f0f'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7413f2dae8a14cf0a4ed0c4f8c613d91'
                        key: {
                            document_key: '4d910685ec0c4e509294296a45bb878a'
                            variable: 'd13d0b935320220002c6435723dc34c8'
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
                        table: 'sys_variable_value'
                        id: '74fab6b7b26a4ccd96bcd3d46e34b0cf'
                        key: {
                            document_key: 'd9ad718d94a74a7bb682b2c113e470bb'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '7657cc2a99fe4fe5b361ce8642050630'
                        key: {
                            id: 'cb560b903ace4e2a951757b1de071067'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '7976b8647ccf4dd5900898074f396e3c'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: '65a0c57997da4485a45d1415a9b875a9'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7a7c694bb4c84bfaadb43d1f30f88488'
                        key: {
                            document_key: '21f0c6b5931f42bbb25d8b4f9ceb0806'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7f0e87049a2a471da01bec56b1ccb432'
                        key: {
                            document_key: 'fd52779a888d47bab80bc7db8481402c'
                            variable: 'bc4c43935320220002c6435723dc34a2'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7f7213fc676d4cf0bd957dc1b85ff175'
                        key: {
                            document_key: '92b884f52b934df4ba1ecdf112caad75'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7fa188e1e4574d27bc76041605e889b9'
                        key: {
                            document_key: 'c016d830bffd4dd48da5bd0ea8dcd66c'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '81540a724f024dbd9af2e2ee7625dfcd'
                        key: {
                            document_key: 'ffc411eea7a942d998e150848bc38800'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8359dde5b19c40f5b23292e353fc1576'
                        key: {
                            document_key: 'd7416b49075d48f391b8f0232706ac57'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '857458512a8c402484341c3532d774b5'
                        key: {
                            document_key: 'dda3126ef936434fb5184cda719f0826'
                            variable: '90749dd73702030064a52f3c8e41f12d'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '857ac68418974e518685ed1905c8a664'
                        key: {
                            document_key: 'dda3126ef936434fb5184cda719f0826'
                            variable: '932d14a33756030064a52f3c8e41f120'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '873eee1c40e24778bb5b7c26f4d72f10'
                        key: {
                            document_key: 'c1a5002e844e4441b3ae5847e9832447'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '8779031b83704c9b9740ae8ec9764042'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: '72337dbabf524eb493b33f146024d46b'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '87794ba39afd47fe8202211cb6edd896'
                        key: {
                            document_key: '6d29a57c12a342bb8e82b89c88200300'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '87cfacb91edf4a578373f5a7e95a761d'
                        key: {
                            document_key: 'b189ca51a0c54dc482fd33f9846e472f'
                            variable: 'dd54cf535320220002c6435723dc34fd'
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
                        table: 'sys_variable_value'
                        id: '8bb90693b5704b41934b4ca118dd9689'
                        key: {
                            document_key: 'b189ca51a0c54dc482fd33f9846e472f'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8bbd5f853caa4e37929771b0aa1a3b1f'
                        key: {
                            document_key: '2b86f9f2fba04ebdb3de38e523212639'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8cb918fcf9534af98ff950ab1c6405a9'
                        key: {
                            document_key: 'ebb0bb6863554c98a362e15a77a611bc'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8d6295eda81b43cdbec928f95bfcf70f'
                        key: {
                            document_key: '21f0c6b5931f42bbb25d8b4f9ceb0806'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '8fe5d8cf2a604c2b9d0d069c8d2e4234'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: '04e34e9f57f644259cfa0f8bba3a6c0d'
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
                        table: 'sys_variable_value'
                        id: '91132c7690114cfeb65b58f078609a3d'
                        key: {
                            document_key: '2126fda36bcc4a9fa5eb49a789f68ea4'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9185331e1eb446b39ebc348eb681c7e8'
                        key: {
                            document_key: 'c016d830bffd4dd48da5bd0ea8dcd66c'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '926ef02bff954547817f9d395d45074a'
                        key: {
                            document_key: 'ffc411eea7a942d998e150848bc38800'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '93bf001440c74640bdec0e50e4121afd'
                        key: {
                            document_key: 'dfe71e00977a45f3872be664ddfea4d8'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '940aca01acd44c53b11e01905f96cdc4'
                        key: {
                            document_key: 'cd307e8193e8444892300eb09be0e9b5'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '94b32a6484f04207b9da640389705d67'
                        key: {
                            document_key: '4d910685ec0c4e509294296a45bb878a'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '95bb404ab4cd4ed983322fa784bab50c'
                        key: {
                            document_key: '40e33e00a1064cde8cc50807e9e3b63a'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '962840f3e8e74840a7f4e3e28e731e33'
                        key: {
                            document_key: 'e7ce3ec56aa2458aa130857293f1ed6f'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '970a7c8923a1433f93c8f720891a2e1e'
                        key: {
                            id: '307a5d74967447779b849fb22ce47946'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '97248ec33e5142d3aaabe82390c848c9'
                        key: {
                            document_key: 'ebb0bb6863554c98a362e15a77a611bc'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '980656110d784e4e90917c0b30b72ea2'
                        key: {
                            document_key: 'cd307e8193e8444892300eb09be0e9b5'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '98fd9c0e89ce4778a6512bfe8d256b8e'
                        key: {
                            id: '4d910685ec0c4e509294296a45bb878a'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9a2eeac379604e5e947302b3d1163a93'
                        key: {
                            document_key: '21f0c6b5931f42bbb25d8b4f9ceb0806'
                            variable: '67400008676003007ba405225685efa4'
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
                        table: 'sys_variable_value'
                        id: '9b3e1098f1c543989932077d8a4904a7'
                        key: {
                            document_key: 'c1a5002e844e4441b3ae5847e9832447'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9b410910cbbc48b7a0da5a509b3e8525'
                        key: {
                            document_key: 'fc18acafbe134c358a41bf1f5c7324d8'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '9c2f5a5b9d54480c8b6365acde7bf3c3'
                        key: {
                            application_file: '21f04efd10c747b1b4125eb1cc7e3021'
                            source_artifact: '1c5247f743494d47a7dba9e74f196a8e'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9e4350a6a9de4a9383af061d24f3f8c2'
                        key: {
                            document_key: '68689d3ac1a9430da22c8eaac3c1403d'
                            variable: '46dbcb535320220002c6435723dc3409'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '9f97a9225e1c4b8e88a5d2814965b90c'
                        key: {
                            application_file: '6506ea2737a54e54badba41cadf06581'
                            source_artifact: '1c5247f743494d47a7dba9e74f196a8e'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a0ca15e29851474aa86de1d5527c043a'
                        key: {
                            document_key: '6893fc1979f2428b99fe2387228295d4'
                            variable: 'b86c0427531000109e02ddeeff7b1227'
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
                        table: 'sys_variable_value'
                        id: 'a1b4d8b33e02452981fdb1c6f8bae589'
                        key: {
                            document_key: '56a080206b3744ce8cd5a27af920736e'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'a2394722ba2c4cafa29c6d7823dc695f'
                        key: {
                            id: 'c3740c884a6d49b2a58fc209407e4167'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a29af9df92074134bb4705b61f095a2d'
                        key: {
                            document_key: 'e7ce3ec56aa2458aa130857293f1ed6f'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'a571b2a25bbf4017ace67a3dee4a67a5'
                        key: {
                            id: '56a080206b3744ce8cd5a27af920736e'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'a80524aebb7b40acbf4b11b7893f5cb6'
                        key: {
                            document_key: 'ebb0bb6863554c98a362e15a77a611bc'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'aa32bb5081d141dbbec7540d2d2bfe82'
                        key: {
                            document_key: '2126fda36bcc4a9fa5eb49a789f68ea4'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'acc7b064a2084619b9fac77086f84b19'
                        key: {
                            id: 'e7ce3ec56aa2458aa130857293f1ed6f'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'accd4d85d1694355a63594061756cb8e'
                        key: {
                            document_key: '04194770472641ee9a02fee8c50ee76b'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'ad67a536e11f4e71b086d7b469a060c7'
                        key: {
                            id: 'fd52779a888d47bab80bc7db8481402c'
                            table: 'var__m_atf_input_variable_17a72288df60220062fe6c7a4df26397'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ada317f6309e4f48bff88dea1e2397da'
                        key: {
                            document_key: '2b86f9f2fba04ebdb3de38e523212639'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'ae28c8e7d9704437b16ee8ea503b9407'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: '25d743908d3d4305bf31da592cfd3350'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ae5c512bfe484333a069c89b84c1ded4'
                        key: {
                            document_key: 'b189ca51a0c54dc482fd33f9846e472f'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'aebb75276fd44e6c82a684f534786dec'
                        key: {
                            document_key: 'dcb817acd0084c86bc5b9641b47fc47f'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'af1653cabba54d489cd9196459ade6c9'
                        key: {
                            document_key: '68689d3ac1a9430da22c8eaac3c1403d'
                            variable: '53fb0f535320220002c6435723dc34ec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'af42f1b6dd0043d6b39e165ddbf35e55'
                        key: {
                            document_key: '7040951b9fdb43b191bfc4ac0f981194'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b1bb3eaed13d4e63a3b8d5adc1e6ec22'
                        key: {
                            document_key: 'fd52779a888d47bab80bc7db8481402c'
                            variable: '53fb0f535320220002c6435723dc34ec'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b450ae8d75ae4ffa8e7eb8521cefc378'
                        key: {
                            document_key: 'fd52779a888d47bab80bc7db8481402c'
                            variable: '334b7bb7675003007ba405225685ef72'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b5fe7a92e8594da482460758da92fd56'
                        key: {
                            document_key: 'e65ba3150234490e9677eb115bcf128d'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b9acc54af45b4c0699102c28da845bb7'
                        key: {
                            document_key: '424707df54a24ec094c9eaa4f990ab23'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ba05fd1f3ae341d79694e45880887013'
                        key: {
                            document_key: '73c81f3285d24003b0a37890499e3ba3'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bacca7bbf6e840788358771b1a31d570'
                        key: {
                            document_key: 'fc18acafbe134c358a41bf1f5c7324d8'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bbc4ed24cbcf40c9b3a6c8a252172907'
                        key: {
                            document_key: '7096b53bd5ee48ef8a09cb9ab6bf17a7'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bc8c483addc9449f9c638aed115415f9'
                        key: {
                            document_key: '4d910685ec0c4e509294296a45bb878a'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bf0e99af44454a2ba33e68848c096785'
                        key: {
                            document_key: '7096b53bd5ee48ef8a09cb9ab6bf17a7'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bfd0ebd6c4bd4df39773723ce2b87ef9'
                        key: {
                            document_key: 'b189ca51a0c54dc482fd33f9846e472f'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c17172065d9f45d8a422c0561e5ec783'
                        key: {
                            document_key: '3fd0afa1cc7948ec9d4f103ba84659c2'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'c4246e14b3374e8b931c6325abaf1cd2'
                        key: {
                            id: '6d29a57c12a342bb8e82b89c88200300'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c69dbc6bac46488786c25dd49a22c3a9'
                        key: {
                            document_key: '04194770472641ee9a02fee8c50ee76b'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ce3df2116fd74d04865bf3e1b348ac95'
                        key: {
                            document_key: 'd7416b49075d48f391b8f0232706ac57'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ced9358c6c914048a30c5b1b45ee43fa'
                        key: {
                            document_key: 'dcb817acd0084c86bc5b9641b47fc47f'
                            variable: 'e6e3c7535320220002c6435723dc3496'
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
                        table: 'sys_variable_value'
                        id: 'd1fa9ec956ce4f069bd9c8ca46063c0f'
                        key: {
                            document_key: '40e33e00a1064cde8cc50807e9e3b63a'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd2601bc97dfe4c6b915c01139ddb5c3e'
                        key: {
                            document_key: '3fd0afa1cc7948ec9d4f103ba84659c2'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'd2e3079a52c74b4cb9177dc44a07e264'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: '3a8f5e340ed3439598438607851c2975'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd5e68e511ca045078c89b5368ace111d'
                        key: {
                            document_key: '307a5d74967447779b849fb22ce47946'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd7e47127f88749ecbdb0cece6dbd1fb6'
                        key: {
                            document_key: '56a080206b3744ce8cd5a27af920736e'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd9281f308d4a465499ed678d1ac263f4'
                        key: {
                            document_key: '2126fda36bcc4a9fa5eb49a789f68ea4'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dbf50b1263f24f478273d5dca10a0233'
                        key: {
                            document_key: 'c1a5002e844e4441b3ae5847e9832447'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'dd8a3ed3fb4046eb9a29faad5f8ef54b'
                        key: {
                            document_key: 'd7416b49075d48f391b8f0232706ac57'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'e083928ab85a4a6698fa8a6d2558a21c'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: '215a3a36cd9f4aa8994626f751b74c0e'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e679dcf9ada34a41b724172d442e19e6'
                        key: {
                            document_key: 'cb560b903ace4e2a951757b1de071067'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'e6f19f2d55cc4dc6ac21f88d85874511'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: 'fc4b2b636042447dac42bea6aa98040a'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'e7bb00e8be134f41bd9463d9ea17d2f8'
                        key: {
                            document_key: '307a5d74967447779b849fb22ce47946'
                            variable: 'c7e483f3671003007ba405225685effb'
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
                        table: 'sys_atf_test_suite_test'
                        id: 'e8e3d356aede4829bb2c6eb1cce9c0d7'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: '06919fb4397346f688522bd43a1577a3'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ebf0f847a6c240de953d45e3e4583c14'
                        key: {
                            document_key: '04194770472641ee9a02fee8c50ee76b'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'ed64f789ed7d4b07a0a1fa10d68bbb35'
                        key: {
                            id: '2126fda36bcc4a9fa5eb49a789f68ea4'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'ee9d709e647047b5974b0ff525ae5b0d'
                        key: {
                            id: '4ddc8f42c21b456282756a0016118f0f'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'ef54322af37642b5af8d3b1480a17f1a'
                        key: {
                            application_file: '2d7409e0bc0444e4b3d8f82c4e130f4e'
                            source_artifact: '1c5247f743494d47a7dba9e74f196a8e'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f12428e3f18144a6a94cf7efda775e93'
                        key: {
                            document_key: 'e65ba3150234490e9677eb115bcf128d'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f1bc752a941a4b99b7a4b58cd53d871f'
                        key: {
                            document_key: 'dfe71e00977a45f3872be664ddfea4d8'
                            variable: '9024a37f671003007ba405225685efe5'
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
                        table: 'sys_atf_test_suite_test'
                        id: 'f261a89f409647cfa55d4999712f090d'
                        key: {
                            test_suite: '13abb880d135480488bf9b3653db9afa'
                            test: 'e0da01068efe42c38389721f3e005581'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f31a660c8b004d59ae3dea17cb8c7817'
                        key: {
                            document_key: 'ffc411eea7a942d998e150848bc38800'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f3689492c4914881ba0ecc6929e2183a'
                        key: {
                            document_key: 'fd52779a888d47bab80bc7db8481402c'
                            variable: '46dbcb535320220002c6435723dc3409'
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
                    {
                        table: 'sys_variable_value'
                        id: 'fa041efa60fb49c484450e22867a95aa'
                        key: {
                            document_key: '307a5d74967447779b849fb22ce47946'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'fac02764715449cba08744df677cba23'
                        key: {
                            id: 'd7416b49075d48f391b8f0232706ac57'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fb10bc3648114ea9ab838752a5b72679'
                        key: {
                            document_key: 'fc18acafbe134c358a41bf1f5c7324d8'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fbf3cd85d3ff4571bf6b88b9b8c2829c'
                        key: {
                            document_key: 'cb560b903ace4e2a951757b1de071067'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fc2dc393787444f0b55cb9e99a6f3d11'
                        key: {
                            document_key: '2b86f9f2fba04ebdb3de38e523212639'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fd709c588bd84d97a2865d8a25a4bd06'
                        key: {
                            document_key: 'e7ce3ec56aa2458aa130857293f1ed6f'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fd89fea351fc46498ba33b3c962148fc'
                        key: {
                            document_key: '4ddc8f42c21b456282756a0016118f0f'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'fdfab5f2a3bd4150bde0caea0d85b23c'
                        key: {
                            id: '04194770472641ee9a02fee8c50ee76b'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ff8362bd32204ccab89544802fae0fc7'
                        key: {
                            document_key: 'f48f3f403cd44e8cb7941e243bc319ab'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                ]
            }
        }
    }
}
