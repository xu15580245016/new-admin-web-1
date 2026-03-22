<template>
    <div>
        <el-page-header content="编辑产品" icon="" title="产品管理" />
        <el-form ref="productFormRef" :model="productForm" :rules="productFormRules" label-width="120px"
            class="demo-ruleForm" status-icon>
            <el-form-item label="产品名称" prop="title">
                <el-input v-model="productForm.title" />
            </el-form-item>
            <el-form-item label="产品简要描述" prop="introduction">
                <el-input type="textarea" v-model="productForm.introduction" />
            </el-form-item>
            <el-form-item label="产品详细描述" prop="detail">
                <el-input type="textarea" v-model="productForm.detail" />
            </el-form-item>
            <el-form-item label="产品图片" prop="cover">
                <UploadAvatar :avatar="productForm.cover" @avatarChange="handleChange" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">更新产品</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import UploadAvatar from '../../components/UploadAvatar/UploadAvatar.vue';
import { useRouter, useRoute } from 'vue-router'
import { getProductDetail, updateProduct } from '../../api/product'

const productFormRef = ref()
const productForm = reactive({
    title: '',
    introduction: '',
    detail: '',
    cover: '',
    file: null,
    _id: ''
})

const productFormRules = reactive({
    title: [
        { required: true, message: '请输入产品名称', trigger: 'blur' },
        { min: 1, max: 12, message: 'Length should be 3 to 12', trigger: 'blur' },
    ],
    detail: [
        { required: true, message: '请输入详细描述', trigger: 'blur' },
    ],
    cover: [
        { required: true, message: '请上传产品图片', trigger: 'blur' },
    ],
    introduction: [
        { required: true, message: '请输入简要描述', trigger: 'blur' },
    ]
})

const handleChange = file => {
    productForm.cover = URL.createObjectURL(file)
    productForm.file = file
}

const router = useRouter()
const submitForm = () => {
    productFormRef.value.validate(async (valid) => {
        if (valid) {
            await updateProduct(productForm)
            router.push('/product-manage/productlist')
        }
    })
}

onMounted(() => {
    getData()
})

const route = useRoute()
const getData = async () => {
    const res = await getProductDetail(route.params.id)
    Object.assign(productForm, res.data[0])
}
</script>

<style lang="scss" scoped>
.el-form {
    margin-top: 30px;
}
</style>
