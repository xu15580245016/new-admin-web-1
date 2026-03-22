<!---->
<template>
    <el-card>
        <el-page-header content="用户列表" icon="" title="用户管理" />
        <DataTable :data="tableData" :columns="columns" :loading="loading">
            <template #cell="{ row, column }">
                <template v-if="column.prop === 'avatar'">
                    <div v-if="row.avatar">
                        <el-avatar :size="50" :src="'http://localhost:3000' + row.avatar"></el-avatar>
                    </div>
                    <div v-else>
                        <el-avatar :size="50"
                            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                    </div>
                </template>
                <template v-else-if="column.prop === 'role'">
                    <el-tag type="danger" v-if="row.role === 1">管理员</el-tag>
                    <el-tag type="success" v-else>编辑</el-tag>
                </template>
                <template v-else-if="column.prop === 'actions'">
                    <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                    <el-popconfirm title="确认删除嘛？" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(row)">
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
                <template v-else>
                    {{ row[column.prop] }}
                </template>
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
import { DataTable } from '../../components/DataTable'
import { getUserList, getUserDetail, updateUser, deleteUser } from '../../api'

const tableData = ref([])
const dialogVisible = ref(false)
const userFormRef = ref()
const loading = ref(false)

let userForm = reactive({
    _id: '',
    username: '',
    password: '',
    role: 2, //1是管理员，2编辑
    introduction: '',
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

const columns = [
    { prop: 'username', label: '用户名', minWidth: 150 },
    { prop: 'avatar', label: '头像', width: 100 },
    { prop: 'role', label: '角色', width: 100 },
    { prop: 'actions', label: '操作', width: 180, fixed: 'right' }
]

onMounted(() => {
    getTableData()
})

const getTableData = async () => {
    loading.value = true
    try {
        const res = await getUserList()
        tableData.value = res.data
    } finally {
        loading.value = false
    }
}

// 编辑回调
const handleEdit = async (data) => {
    const result = await getUserDetail(data._id)
    Object.assign(userForm, result.data.data[0])
    dialogVisible.value = true
}

// 编辑确认回调
const handleEditConfim = () => {
    userFormRef.value.validate(async (valid) => {
        if (valid) {
            await updateUser(userForm._id, userForm)
            dialogVisible.value = false
            getTableData()
        }
    })
}

// 删除回调
const handleDelete = async (data) => {
    await deleteUser(data._id)
    getTableData()
}
</script>

<style scoped lang="scss">
.el-table {
    margin-top: 20px;
}
</style>