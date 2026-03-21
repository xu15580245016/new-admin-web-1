<!---->
<template>
    <Particles id="tsparticles" :particlesInit="particlesInit" :options="options" />
    <div class="login">
        <h2>门户管理系统</h2>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
            <el-form-item label="用户名：" prop="username">
                <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login(ruleFormRef)">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { loadFull } from "tsparticles"
import type { Engine, ISourceOptions } from "tsparticles-engine"
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { userInfoStore } from '../../store/userInfo'
import { useMenuStore } from '../../store/menu'

const useMenu = useMenuStore()
const router = useRouter()
const userInfo = userInfoStore()

const particlesInit = async (engine: Engine): Promise<void> => {
    await loadFull(engine)
}

const options: ISourceOptions = {
    background: {
        color: {
            value: '#0d47a1'
        }
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: 'push'
            },
            onHover: {
                enable: true,
                mode: 'repulse'
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40
            },
            push: {
                quantity: 4
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        }
    },
    particles: {
        color: {
            value: '#ffffff'
        },
        links: {
            color: '#ffffff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1
        },
        collisions: {
            enable: true
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: {
                default: 'bounce'
            },
            random: false,
            speed: 6,
            straight: false
        },
        number: {
            density: {
                enable: true,
                area: 800
            },
            value: 80
        },
        opacity: {
            value: 0.5
        },
        shape: {
            type: 'circle'
        },
        size: {
            value: { min: 1, max: 5 },
        }
    },
    detectRetina: true
}

interface LoginForm {
    username: string
    password: string
}

interface LoginResponse {
    ActionType: string
    data: {
        _id: string
        username: string
        avatar?: string
        role: number
        gender?: number
        introduction?: string
    }
    error?: string
}

const ruleForm = reactive<LoginForm>({
    username: '',
    password: ''
})

const ruleFormRef = ref<FormInstance>()

const validatePwd = (rule: any, value: string, callback: (error?: Error) => void): void => {
    if (!value) {
        return callback(new Error('请输入密码'))
    } else {
        callback()
    }
}

const rules = reactive<FormRules<LoginForm>>({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, validator: validatePwd, trigger: 'blur' }],
})

const login = async (formEl: FormInstance | undefined): Promise<void> => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            axios.post<LoginResponse>('/adminapi/user/login', ruleForm).then(res => {
                if (res.data.ActionType === 'OK') {
                    userInfo.changeUserInfo(res.data.data)
                    useMenu.changeGetterRouter(false)
                    router.push('/home')
                } else {
                    ElMessage.error(res.data.error || '登录失败')
                }
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
</script>

<style lang="scss">
.login {
    position: relative;
    width: 420px;
    height: 320px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, .3);

    h2 {
        padding: 10px 0;
        text-align: center;
        color: #fff;
    }

    .el-form {
        .el-form-item {
            margin: 50px 20px;
        }

        .el-form-item__label {
            color: #fff;
        }
    }
}
</style>
