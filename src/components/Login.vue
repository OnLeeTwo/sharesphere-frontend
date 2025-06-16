<script setup lang="ts">
import { Form, Field, GenericObject } from 'vee-validate'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

import * as yup from 'yup'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import IconFacebook from './icons/IconFacebook.vue'
import IconGoogle from './icons/IconGoogle.vue'

const apiUrl = import.meta.env.VITE_API_URL

const router = useRouter()
const auth = useAuthStore()

const schema = yup.object({
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  remember: yup.boolean(),
})

const onSubmit = async (values: GenericObject) => {
  try {
    const response = await authService.login({
      email: values.email,
      password: values.password,
    })
    auth.setLoginResponse(response)
    router.push('/dashboard')
  } catch (err) {
    console.error('Login failed', err)
  }
}

const goToRegister = (): void => {
  router.push('/register')
}

const redirectToGoogle = () => {
  window.location.href = `${apiUrl}/auth/google`
}

const redirectToFacebook = () => {
  window.location.href = `${apiUrl}/auth/facebook`
}
</script>
<template>
  <div
    id="login-page"
    class="page active min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"
  >
    <div class="max-w-md w-full mx-4">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div
          class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold text-2xl inline-block shadow-lg"
        >
          ShareSphere
        </div>
        <h1 class="text-white text-2xl font-bold mt-4">Welcome Back</h1>
        <p class="text-white/80 mt-2">Sign in to your account to continue</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white flex-col rounded-xl shadow-2xl p-8">
        <Form @submit="onSubmit" :validation-schema="schema">
          <div class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Field name="email" v-slot="{ field, errors }">
                <InputText
                  v-bind="field"
                  class="w-full !bg-white !text-black"
                  placeholder="Enter your email"
                />
                <small class="text-red-500">{{ errors[0] }}</small>
              </Field>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Field name="password" v-slot="{ field, errors }">
                <Password
                  v-bind="field"
                  class="!w-full"
                  input-class="!w-full"
                  placeholder="Enter your password"
                  toggleMask
                  :feedback="false"
                />
                <small class="text-red-500">{{ errors[0] }}</small>
              </Field>
            </div>

            <!-- Remember me + forgot password -->
            <div class="flex items-center justify-between">
              <Field name="remember" type="checkbox" v-slot="{ field }">
                <div class="flex items-center">
                  <Checkbox v-bind="field" :binary="true" inputId="remember" />
                  <label for="remember" class="ml-2 text-sm text-gray-600">Remember me</label>
                </div>
              </Field>
              <a href="#" class="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >Forgot password?</a
              >
            </div>

            <!-- Sign in button -->
            <button
              type="submit"
              class="w-full mt-6 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:bg-purple-700 transition cursor-pointer"
            >
              Log In
            </button>
          </div>
        </Form>

        <!-- Divider -->
        <Divider class="my-6 bg-white">
          <span class="text-gray-500 text-sm">Or continue with</span>
        </Divider>

        <!-- Social Login Buttons -->
        <div class="flex flex-col space-y-3">
          <Button outlined label="Continue with Google" @click="redirectToGoogle">
            <template #icon>
              <IconGoogle />
            </template>
          </Button>

          <!-- Facebook Login -->
          <Button outlined label="Continue with Facebook" @click="redirectToFacebook">
            <template #icon>
              <IconFacebook />
            </template>
          </Button>
        </div>

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account?
            <Button size="small" @click="goToRegister" text class="!text-purple-600 !font-medium">
              Sign up here
            </Button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
