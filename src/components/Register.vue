<script setup lang="ts">
import { Form, Field, ErrorMessage, GenericObject } from 'vee-validate'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import * as yup from 'yup'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

const toast = useToast()
const auth = useAuthStore()
const router = useRouter()

// validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain letters')
    .matches(/\d/, 'Password must contain numbers'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
  plan: yup.string().oneOf(['free', 'basic', 'premium']).required('Choose a plan'),
  terms: yup
    .boolean()
    .required('Make sure to read the terms first')
    .oneOf([true], 'You must accept the terms and conditions'),
})

const onRegister = async (values: GenericObject) => {
  console.log('Register form submitted:', values)
  try {
    const response = await authService.register({
      username: values.username,
      email: values.email,
      password: values.password,
      tier: values.plan,
    })
    auth.setLoginResponse(response)
    toast.add({
      summary: 'Success',
      detail: 'Registration successful! Please log in.',
      severity: 'success',
      life: 3000,
    })
    router.push('/login')
  } catch (err: unknown) {
    toast.add({
      summary: 'Error',
      detail: 'Registration failed, please check your connection and try again.',
      severity: 'error',
      life: 3000,
    })
    console.error(err ?? 'Register failed')
  }
}

const goToLogin = (): void => {
  router.push('/login')
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-12"
  >
    <div class="max-w-md w-full mx-4">
      <div class="text-center mb-8">
        <div
          class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold text-2xl inline-block shadow-lg"
        >
          ShareSphere
        </div>
        <h1 class="text-white text-2xl font-bold mt-4">Create Account</h1>
        <p class="text-white/80 mt-2">Join our community of creators</p>
      </div>

      <div class="bg-white rounded-xl shadow-2xl p-8">
        <Form :validation-schema="schema" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(onRegister)">
            <!-- Plan Selection -->
            <div class="mb-6">
              <span class="block text-sm font-medium text-gray-700 mb-3">Choose Your Plan</span>

              <Field name="plan" v-slot="{ field }">
                <div class="grid grid-cols-3 gap-2">
                  <label
                    :for="`${plan}-select`"
                    v-for="plan in ['free', 'basic', 'premium']"
                    :key="plan"
                    class="cursor-pointer flex flex-col items-center border-2 rounded-lg p-3 text-center"
                    :class="{
                      'border-purple-500 bg-purple-50': field.value === plan,
                      'border-gray-200 hover:border-purple-300': field.value !== plan,
                    }"
                  >
                    <RadioButton
                      :inputId="plan"
                      :value="plan"
                      :modelValue="field.value"
                      @update:modelValue="field.onChange"
                      class="sr-only"
                    />
                    <span class="capitalize text-sm font-medium">{{ plan }}</span>
                    <span class="text-xs text-gray-500">{{
                      plan === 'free' ? '$0/mo' : plan === 'basic' ? '$9/mo' : '$29/mo'
                    }}</span>
                  </label>
                </div>
              </Field>
              <ErrorMessage name="plan" class="text-xs text-red-500 mt-1 block" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="text-sm font-medium text-gray-700 mb-1 block"
                  >First Name</label
                >
                <Field name="firstName" v-slot="{ field }">
                  <InputText v-bind="field" class="w-full" placeholder="John" />
                </Field>
                <ErrorMessage name="firstName" class="text-xs text-red-500" />
              </div>
              <div>
                <label for="lastName" class="text-sm font-medium text-gray-700 mb-1 block"
                  >Last Name</label
                >
                <Field name="lastName" v-slot="{ field }">
                  <InputText v-bind="field" class="w-full" placeholder="Doe" />
                </Field>
              </div>
            </div>

            <div class="mt-4">
              <label for="email" class="text-sm font-medium text-gray-700 mb-1 block"
                >Email Address</label
              >
              <Field name="email" v-slot="{ field }">
                <InputText v-bind="field" class="w-full" placeholder="john@example.com" />
              </Field>
              <ErrorMessage name="email" class="text-xs text-red-500" />
            </div>

            <!-- Username -->
            <div class="mt-4">
              <label for="username" class="text-sm font-medium text-gray-700 mb-1 block"
                >Username</label
              >
              <Field name="username" v-slot="{ field }">
                <InputText v-bind="field" class="w-full" placeholder="@johndoe" />
              </Field>
              <ErrorMessage name="username" class="text-xs text-red-500" />
            </div>

            <div class="mt-4">
              <label for="password" class="text-sm font-medium text-gray-700 mb-1 block"
                >Password</label
              >
              <Field name="password" v-slot="{ field }">
                <Password
                  v-bind="field"
                  toggleMask
                  inputClass="w-full"
                  class="w-full"
                  placeholder="Create strong password"
                />
              </Field>
              <ErrorMessage name="password" class="text-xs text-red-500" />
            </div>

            <div class="mt-4">
              <label for="confirmPassword" class="text-sm font-medium text-gray-700 mb-1 block"
                >Confirm Password</label
              >
              <Field name="confirmPassword" v-slot="{ field }">
                <Password
                  v-bind="field"
                  toggleMask
                  :feedback="false"
                  inputClass="w-full"
                  class="w-full"
                  placeholder="Confirm your password"
                />
              </Field>
              <ErrorMessage name="confirmPassword" class="text-xs text-red-500" />
            </div>

            <div class="flex items-center gap-2 mt-4">
              <Field name="terms" type="checkbox" v-slot="{ value, handleChange }">
                <Checkbox
                  :binary="true"
                  :modelValue="value"
                  @update:modelValue="(val) => handleChange(val)"
                  inputId="terms"
                  class="mt-1"
                />
                <label for="terms" class="text-sm text-gray-600">
                  I agree to the
                  <a href="#" class="text-purple-600 hover:text-purple-700">Terms of Service</a> and
                  <a href="#" class="text-purple-600 hover:text-purple-700">Privacy Policy</a>
                </label>
              </Field>
            </div>
            <ErrorMessage name="terms" class="text-xs text-red-500 mt-1 block" />

            <button
              type="submit"
              class="w-full mt-6 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:bg-purple-700 transition cursor-pointer"
            >
              Create Account
            </button>
          </form>
        </Form>

        <div class="mt-4 text-center text-sm">
          Already have an account?
          <Button size="small" @click="goToLogin" text class="!text-purple-600 !font-medium">
            Login here
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
