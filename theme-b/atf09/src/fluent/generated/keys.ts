import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'atf-suite-todo': {
                        table: 'sys_atf_test_suite'
                        id: '8b96fb9fe68e4f2293628e9cc58e8a53'
                    }
                    'atf-suite-todo-checkpoint': {
                        table: 'sys_atf_test_suite'
                        id: '43b333e12c614051834d434a9d532d52'
                    }
                    'atf-t1-insert-open': {
                        table: 'sys_atf_test'
                        id: '85eef36edac54541889480b26f5b76c7'
                    }
                    'atf-t1-step-cleanup': {
                        table: 'sys_atf_step'
                        id: '32294e313c1444a8b2743051a4484065'
                    }
                    'atf-t1-step-insert': {
                        table: 'sys_atf_step'
                        id: '95b0bad0f42947498a6e361af245a2a8'
                    }
                    'atf-t1-step-validate': {
                        table: 'sys_atf_step'
                        id: '4642c61d8f194ef696ec0e86bbae8bcd'
                    }
                    'atf-t2-step-cleanup': {
                        table: 'sys_atf_step'
                        id: 'cfd2626758be4ffaa850cf3950890fe6'
                    }
                    'atf-t2-step-query': {
                        table: 'sys_atf_step'
                        id: 'e60cd4fd44eb41f9852e7b28efc3603d'
                    }
                    'atf-t2-step-ui': {
                        table: 'sys_atf_step'
                        id: '2c790f89bd7843f582cdc1608a199871'
                    }
                    'atf-t2-step-validate': {
                        table: 'sys_atf_step'
                        id: '589b4a4d850f41259145070d25fe4072'
                    }
                    'atf-t2-ui-create': {
                        table: 'sys_atf_test'
                        id: '7e6039c21f1e43f29a03059e9717153c'
                    }
                    'atf-t3-done-sets-completed': {
                        table: 'sys_atf_test'
                        id: '7a303954ac594fc799cc17fa56fa3cb4'
                    }
                    'atf-t3-step-cleanup': {
                        table: 'sys_atf_step'
                        id: '972b63337d064a8a919a447b7543e1a0'
                    }
                    'atf-t3-step-insert': {
                        table: 'sys_atf_step'
                        id: 'dcc2367f089e41bc89d196408091a973'
                    }
                    'atf-t3-step-validate': {
                        table: 'sys_atf_step'
                        id: '8ef49d03baee453f91fb1aac0853b4af'
                    }
                    'atf-t4-empty-title-server': {
                        table: 'sys_atf_test'
                        id: 'adbfd3a7fc9048e8b4738bbb3450f767'
                    }
                    'atf-t4-step-insert': {
                        table: 'sys_atf_step'
                        id: '68ea303dd86f4745a432a79ab8e9cfc3'
                    }
                    'atf-t5-empty-title-ui': {
                        table: 'sys_atf_test'
                        id: '1ae0a2e87be04d549a4d225a0ca95017'
                    }
                    'atf-t5-step-query': {
                        table: 'sys_atf_step'
                        id: '0fe97e0f69fd481293c9e643fd4c2213'
                    }
                    'atf-t5-step-ui': {
                        table: 'sys_atf_step'
                        id: 'dfa5ef1a01dc4c7c88e787ff501e15f2'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'f15895d4012a4b578014f3de1f4112a1'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '3ddac30186f54027a3fd7838707ddac0'
                    }
                    src_server_index_ts: {
                        table: 'sys_module'
                        id: 'a684990527ae4c07a73d7d57b068ecef'
                    }
                }
                composite: [
                    {
                        table: 'sys_variable_value'
                        id: '0e0f138820804fea8469465459816953'
                        key: {
                            document_key: '32294e313c1444a8b2743051a4484065'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '181001d474904c0fbd8b582d9dc371ce'
                        key: {
                            document_key: '2c790f89bd7843f582cdc1608a199871'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '1ed93a8fa5734544820675a0cf781473'
                        key: {
                            document_key: '8ef49d03baee453f91fb1aac0853b4af'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '21df77d0cf2e4741a7dd2f87dce33ed9'
                        key: {
                            document_key: '32294e313c1444a8b2743051a4484065'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '29f32e7fac26409b8b75c0769e0691b5'
                        key: {
                            document_key: '95b0bad0f42947498a6e361af245a2a8'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '2ba5a5aa7f0e4446ba777542109b33b7'
                        key: {
                            test_suite: '43b333e12c614051834d434a9d532d52'
                            test: '7a303954ac594fc799cc17fa56fa3cb4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '30f2533af43e4e84a8965f104584bf10'
                        key: {
                            document_key: '972b63337d064a8a919a447b7543e1a0'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '312bd7a3d1d545fbaf96269aae5567d3'
                        key: {
                            id: '972b63337d064a8a919a447b7543e1a0'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '32d52a7c95fd486289451e7af588856d'
                        key: {
                            document_key: 'cfd2626758be4ffaa850cf3950890fe6'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '377beefe51014ee3ae7e4ca28b26c23f'
                        key: {
                            document_key: '0fe97e0f69fd481293c9e643fd4c2213'
                            variable: '915990ab531000109e02ddeeff7b12f8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3a2f939b540541cda986b27c71bd9327'
                        key: {
                            document_key: '589b4a4d850f41259145070d25fe4072'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '3d10f56444a744d2b632979c5d1f282d'
                        key: {
                            document_key: '972b63337d064a8a919a447b7543e1a0'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '414da40d8023484fb8238dba5be6b887'
                        key: {
                            document_key: '589b4a4d850f41259145070d25fe4072'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '48f4368ea87e438195771fe1f76e081d'
                        key: {
                            document_key: '8ef49d03baee453f91fb1aac0853b4af'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '4c45c1f8c13946438833ef54f1534644'
                        key: {
                            document_key: 'e60cd4fd44eb41f9852e7b28efc3603d'
                            variable: '915990ab531000109e02ddeeff7b12f8'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '4cdfa42651db495695e2d0198f4d37bf'
                        key: {
                            id: '589b4a4d850f41259145070d25fe4072'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '51b05af3385944aa8392d1d31322c57c'
                        key: {
                            document_key: 'dcc2367f089e41bc89d196408091a973'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5461f7ecb0c2462286d39b9f80e01700'
                        key: {
                            document_key: 'dfa5ef1a01dc4c7c88e787ff501e15f2'
                            variable: 'e216835dffdf3210f972ffffffffff53'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '5a0ba50a441c4febb656dcf14a781178'
                        key: {
                            test_suite: '8b96fb9fe68e4f2293628e9cc58e8a53'
                            test: '7e6039c21f1e43f29a03059e9717153c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '5d377ea2e65d49a1a0f81b5b6d9518d1'
                        key: {
                            document_key: '95b0bad0f42947498a6e361af245a2a8'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '600cb7caddff42b890cd61f636e45ddc'
                        key: {
                            document_key: 'e60cd4fd44eb41f9852e7b28efc3603d'
                            variable: '78b8d86b531000109e02ddeeff7b12f3'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '63a3917673994852a45961aa16674eea'
                        key: {
                            document_key: 'e60cd4fd44eb41f9852e7b28efc3603d'
                            variable: '02fb0027531000109e02ddeeff7b120b'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '64807fb8dffb40a08df6a664ce9425e2'
                        key: {
                            document_key: '32294e313c1444a8b2743051a4484065'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '699a598b33ab4280b2f34f52ad380403'
                        key: {
                            document_key: '68ea303dd86f4745a432a79ab8e9cfc3'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '69f9fda1ffb74a33b1c6ed4ecb7f5615'
                        key: {
                            document_key: '4642c61d8f194ef696ec0e86bbae8bcd'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '702900bb7b444c7d9ab5c1c3b1fcd3e8'
                        key: {
                            test_suite: '8b96fb9fe68e4f2293628e9cc58e8a53'
                            test: 'adbfd3a7fc9048e8b4738bbb3450f767'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '74447770e3364b2abd6ba2c458db610b'
                        key: {
                            test_suite: '43b333e12c614051834d434a9d532d52'
                            test: '7e6039c21f1e43f29a03059e9717153c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '78296c4e7a5946f086069472a642bfa7'
                        key: {
                            document_key: 'cfd2626758be4ffaa850cf3950890fe6'
                            variable: '8f7d0f935320220002c6435723dc3471'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '78a9b5cf337c46f9902db7739088bf48'
                        key: {
                            document_key: '95b0bad0f42947498a6e361af245a2a8'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '7914ca6c9847424593a7422a922eccd2'
                        key: {
                            id: 'cfd2626758be4ffaa850cf3950890fe6'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7c346f1f944c46de8cad6f99abdbca8e'
                        key: {
                            document_key: 'e60cd4fd44eb41f9852e7b28efc3603d'
                            variable: 'b86c0427531000109e02ddeeff7b1227'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '7d5a6f4dc8f44fa8b9ef9285b8e2c047'
                        key: {
                            document_key: '0fe97e0f69fd481293c9e643fd4c2213'
                            variable: '02fb0027531000109e02ddeeff7b120b'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8177941fe78d4496981d7bc44bee18f9'
                        key: {
                            document_key: '0fe97e0f69fd481293c9e643fd4c2213'
                            variable: 'b86c0427531000109e02ddeeff7b1227'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '82ff06d7ac1d462a8047390e8bc2e234'
                        key: {
                            document_key: 'cfd2626758be4ffaa850cf3950890fe6'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: '851ca63b31834066821a6dd959adc8fd'
                        key: {
                            test_suite: '43b333e12c614051834d434a9d532d52'
                            test: '85eef36edac54541889480b26f5b76c7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '89a24e32a8704bdbb4443c4c12bf9aa1'
                        key: {
                            document_key: '4642c61d8f194ef696ec0e86bbae8bcd'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '8e5bf41976264b0b9fefd71022e3532f'
                        key: {
                            document_key: '32294e313c1444a8b2743051a4484065'
                            variable: 'c7e483f3671003007ba405225685effb'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '92c5aa99915543c48f0aa528a211f419'
                        key: {
                            document_key: '589b4a4d850f41259145070d25fe4072'
                            variable: '67400008676003007ba405225685efa4'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: '9737a7cc7e8342199ba2339752608528'
                        key: {
                            document_key: '68ea303dd86f4745a432a79ab8e9cfc3'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: '9a668881c48243379e2a925e67151268'
                        key: {
                            id: '32294e313c1444a8b2743051a4484065'
                            table: 'var__m_atf_input_variable_8df72288df60220062fe6c7a4df2636d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'a254ea0517334e37808fc61b73bccc16'
                        key: {
                            id: '8ef49d03baee453f91fb1aac0853b4af'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ab0ec8a3aac3464da2862ed5c82cb63b'
                        key: {
                            document_key: '68ea303dd86f4745a432a79ab8e9cfc3'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ab1be6e4fbc54450b8b80e5476743eff'
                        key: {
                            document_key: 'dcc2367f089e41bc89d196408091a973'
                            variable: 'e6e3c7535320220002c6435723dc3496'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'b046fe90c3e14ad88a884a8ecae6d9bd'
                        key: {
                            test_suite: '8b96fb9fe68e4f2293628e9cc58e8a53'
                            test: '7a303954ac594fc799cc17fa56fa3cb4'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'b231bab047f84ddfb5dcfd862e61d1da'
                        key: {
                            test_suite: '8b96fb9fe68e4f2293628e9cc58e8a53'
                            test: '1ae0a2e87be04d549a4d225a0ca95017'
                        }
                    },
                    {
                        table: 'sys_atf_test_suite_test'
                        id: 'b516bc2ce9cf42d89a882b56fe79556e'
                        key: {
                            test_suite: '8b96fb9fe68e4f2293628e9cc58e8a53'
                            test: '85eef36edac54541889480b26f5b76c7'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'b64382daaf814848865594f68772fabc'
                        key: {
                            document_key: '4642c61d8f194ef696ec0e86bbae8bcd'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'bf089f86c90b4b7c98ae9c3af0f7bf4c'
                        key: {
                            document_key: '8ef49d03baee453f91fb1aac0853b4af'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'c0b988063bd5481dbf51677d4aae3adb'
                        key: {
                            document_key: '0fe97e0f69fd481293c9e643fd4c2213'
                            variable: '78b8d86b531000109e02ddeeff7b12f3'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ca60dda66ae942db9b0e98cb9e5553cb'
                        key: {
                            document_key: '589b4a4d850f41259145070d25fe4072'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cc98ecd6154e4495aecc76fdaf27c7eb'
                        key: {
                            document_key: '8ef49d03baee453f91fb1aac0853b4af'
                            variable: '52ed1e5b5360220002c6435723dc3421'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'cf246e14483d41e3ab5071455b3ac99e'
                        key: {
                            document_key: '589b4a4d850f41259145070d25fe4072'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'd82437cf376d4689b12d4225a83140f6'
                        key: {
                            document_key: '972b63337d064a8a919a447b7543e1a0'
                            variable: 'd13d0b935320220002c6435723dc34c8'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'db228f3825f64f178aa170123998f7d3'
                        key: {
                            document_key: '972b63337d064a8a919a447b7543e1a0'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'eb93d48bbfe54c0387eca4ca2eba9fc2'
                        key: {
                            document_key: '95b0bad0f42947498a6e361af245a2a8'
                            variable: 'dd54cf535320220002c6435723dc34fd'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'ec06f5f796554b7d94d9cbcae0796494'
                        key: {
                            document_key: 'cfd2626758be4ffaa850cf3950890fe6'
                            variable: '3d6d8b935320220002c6435723dc349c'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'eefcfafacd5c427480cf5dd40d03b59f'
                        key: {
                            document_key: '4642c61d8f194ef696ec0e86bbae8bcd'
                            variable: 'ff6e125353a0220002c6435723dc3442'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'f0869526219044999f94b60a5a93c97b'
                        key: {
                            document_key: '4642c61d8f194ef696ec0e86bbae8bcd'
                            variable: '6aad5a575360220002c6435723dc34b0'
                        }
                    },
                    {
                        table: 'sys_element_mapping'
                        id: 'f5aa1abcc16e4d1db2ccb4016a61586d'
                        key: {
                            id: '4642c61d8f194ef696ec0e86bbae8bcd'
                            table: 'var__m_atf_input_variable_1f39a288df60220062fe6c7a4df2639d'
                            field: 'record_id'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fd8ad6c96e98407eaae997e8bfb71f50'
                        key: {
                            document_key: 'dcc2367f089e41bc89d196408091a973'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fe2db94753094e0188cbcfc24a42bce9'
                        key: {
                            document_key: 'dcc2367f089e41bc89d196408091a973'
                            variable: '90144b535320220002c6435723dc3488'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'febfc3fc3ddb425eb0962cf9bb1471d1'
                        key: {
                            document_key: '68ea303dd86f4745a432a79ab8e9cfc3'
                            variable: '9024a37f671003007ba405225685efe5'
                        }
                    },
                    {
                        table: 'sys_variable_value'
                        id: 'fee6d25a1123489582d8e749f87c396f'
                        key: {
                            document_key: '8ef49d03baee453f91fb1aac0853b4af'
                            variable: 'cbddfa135320220002c6435723dc3415'
                        }
                    },
                ]
            }
        }
    }
}
