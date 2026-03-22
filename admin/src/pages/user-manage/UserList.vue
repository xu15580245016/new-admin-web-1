<!---->
<template>
    <el-card>
        <el-page-header content="用户列表" icon="" title="用户管理" />
        <DataTable :data="tableData" :columns="columns">
            <template #avatar="{ row }">
                <div v-if="row.avatar">
                    <el-avatar :size="50" :src="'http://localhost:3000' + row.avatar"></el-avatar>
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
            <template #operation="{ row }">
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
import { reactive, ref, onMounted } from 'vue'
import DataTable from '../../components/DataTable/index.vue'
import { getUserList, getUserDetail, updateUser, deleteUser } from '../../api/user'

const tableData = ref([])
const dialogVisible = ref(false)
const userFormRef = ref()
const userForm = reactive({
    username: '',
    password: '',
    role: 2,
    introduction: '',
    _id: ''
})

const columns = [
    { prop: 'username', label: '用户名' },
    { prop: 'avatar', label: '头像', slot: 'avatar' },
    { prop: 'role', label: '角色', slot: 'role' }
]

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
    gender: [
        { required: true, message: '请选择性别', trigger: 'blur' },
    ],
    introduction: [
        { required: true, message: '请输入个人简介', trigger: 'blur' },
    ],
})

onMounted(() => {
    getTableData()
})

const getTableData = async () => {
    const res = await getUserList()
    tableData.value = res.data
}

const handleEdit = async (data) => {
    const result = await getUserDetail(data._id)
    Object.assign(userForm, result.data[0])
    dialogVisible.value = true
}

const handleEditConfim = () => {
    userFormRef.value.validate(async (valid) => {
        if (valid) {
            await updateUser(userForm)
            dialogVisible.value = false
            getTableData()
        }
    })
}

const handleDelete = async (data) => {
    await deleteUser(data._id)
    getTableData()
}
</script>

<style scoped lang="scss">
</style>
