<!---->
<template>
    <el-card>
        <el-page-header content="用户列表" icon="" title="用户管理" />
        <DataTable
            :table-data="listState.data"
            :columns="columns"
            :loading="listState.loading"
        >
            <template #avatar="{ row }">
                <div v-if="row.avatar">
                    <el-avatar :size="50" :src="avatarBaseUrl + row.avatar"></el-avatar>
                </div>
                <div v-else>
                    <el-avatar :size="50"
                        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                </div>
            </template>
            <template #role="{ row }">
                <el-tag type="danger" v-if="row.role === 1">管理员</el-tag>
                <el-tag type="success" v-else>编辑</el-tag>
            </template>
            <template #actions="{ row }">
                <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                <el-popconfirm title="确认删除嘛？" confirm-button-text="确认" cancel-button-text="取消"
                    @confirm="handleDelete(row)">
                    <template #reference>
                        <el-button size="small" type="danger">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </DataTable>
    </el-card>
    <el-dialog v-model="dialogVisible" title="编辑用户" width="50%">
        <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="120px" class="demo-ruleForm"
            status-icon>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userForm.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="userForm.password" type="password" />
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-select v-model="userForm.role" placeholder="Select" class="m-2" style="width:100%;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="个人简介" prop="introduction">
                <el-input type="textarea" v-model="userForm.introduction" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleEditConfim">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElForm, type FormInstance } from 'element-plus'
import { DataTable } from '../../components/DataTable'
import { useList } from '../../composables/useList'
import { getUserList, deleteUser, getUserDetail, editUser, type UserItem } from '../../api/user'

const userFormRef = ref<FormInstance | null>(null)
const dialogVisible = ref(false)
const avatarBaseUrl = import.meta.env.VITE_API_BASE_URL

let userForm = reactive({
    username: '',
    password: '',
    role: 2,
    introduction: '',
    _id: ''
})

const options = [
    { label: '管理员', value: 1 },
    { label: '编辑', value: 2 },
]

const userFormRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 12, message: 'Length should be 3 to 12', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    role: [
        { required: true, message: '请选择权限', trigger: 'blur' },
    ],
    introduction: [
        { required: true, message: '请输入个人简介', trigger: 'blur' },
    ],
})

// 表格列配置
const columns = reactive([
    { prop: 'username', label: '用户名' },
    { prop: 'avatar', label: '头像', slotName: 'avatar', width: 100 },
    { prop: 'role', label: '角色', slotName: 'role', width: 100 },
    { label: '操作', type: 'actions', width: 200, fixed: 'right' }
])

// 使用 useList composable
const { listState, refresh, removeItem } = useList<UserItem>({
    fetchFn: async (params) => {
        const res = await getUserList(params)
        return { data: res.data.data || [] }
    }
})

// 编辑回调
const handleEdit = async (data) => {
    const result = await getUserDetail(data._id)
    const userData = result.data.data?.[0] || result.data.data || {}
    Object.assign(userForm, {
        username: userData.username || '',
        password: '',
        role: userData.role || 2,
        introduction: userData.introduction || '',
        _id: userData._id || data._id
    })
    dialogVisible.value = true
}

// 编辑确认回调
const handleEditConfim = () => {
    if (!userFormRef.value) return
    userFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await editUser(userForm._id, userForm)
                dialogVisible.value = false
                ElMessage.success('更新成功')
                await refresh()
            } catch (error) {
                ElMessage.error('更新失败')
            }
        }
    })
}

// 删除回调
const handleDelete = async (data) => {
    const success = await removeItem(data._id, deleteUser)
    if (success) {
        ElMessage.success('删除成功')
    } else {
        ElMessage.error('删除失败')
    }
}
</script>

<style scoped lang="scss">
</style>
