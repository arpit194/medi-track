import { useForm } from '@tanstack/react-form'
import { OctagonXIcon } from 'lucide-react'
import { toast } from 'sonner'
import { onboardingProfileSchema } from '#/lib/onboarding-schemas'
import { getErrorMessage } from '#/api/client'
import type { User } from '#/api/user'
import { useUpdateProfileMutation } from '#/hooks/user'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { NativeSelect, NativeSelectOption } from '#/components/ui/native-select'
import { DatePicker } from '#/components/shared/DatePicker'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function ProfileForm({ user }: { user: User }) {
  const updateProfile = useUpdateProfileMutation()

  const form = useForm({
    defaultValues: { dob: user.dob, bloodType: user.bloodType, gender: user.gender },
    validators: { onChange: onboardingProfileSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateProfile.mutateAsync(value)
        toast.success('Profile updated.')
      } catch {
        // error shown via updateProfile.isError
      }
    },
  })

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      noValidate
    >
      {updateProfile.isError && (
        <Alert variant="destructive">
          <OctagonXIcon className="size-4" />
          <AlertTitle>Couldn't save changes</AlertTitle>
          <AlertDescription>{getErrorMessage(updateProfile.error)}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <form.Field name="dob">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Date of birth</FieldLabel>
              <DatePicker
                id={field.name}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
                onBlur={field.handleBlur}
                placeholder="Select your date of birth"
                disableFuture
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                aria-describedby={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? 'dob-error'
                    : undefined
                }
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <FieldError
                  id="dob-error"
                  errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
                />
              )}
            </Field>
          )}
        </form.Field>

        <form.Field name="bloodType">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Blood type</FieldLabel>
              <NativeSelect
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full [&_select]:h-11"
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                aria-describedby={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? 'bloodType-error'
                    : undefined
                }
              >
                <NativeSelectOption value="" disabled>
                  Select blood type
                </NativeSelectOption>
                {BLOOD_TYPES.map((bt) => (
                  <NativeSelectOption key={bt} value={bt}>
                    {bt}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <FieldError
                  id="bloodType-error"
                  errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
                />
              )}
            </Field>
          )}
        </form.Field>

        <form.Field name="gender">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
              <NativeSelect
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="w-full [&_select]:h-11"
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                aria-describedby={
                  field.state.meta.isTouched && field.state.meta.errors.length > 0
                    ? 'gender-error'
                    : undefined
                }
              >
                <NativeSelectOption value="" disabled>
                  Select gender
                </NativeSelectOption>
                <NativeSelectOption value="male">Male</NativeSelectOption>
                <NativeSelectOption value="female">Female</NativeSelectOption>
                <NativeSelectOption value="other">Other</NativeSelectOption>
                <NativeSelectOption value="prefer_not_to_say">Prefer not to say</NativeSelectOption>
              </NativeSelect>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <FieldError
                  id="gender-error"
                  errors={field.state.meta.errors.map((e) => ({ message: e?.message }))}
                />
              )}
            </Field>
          )}
        </form.Field>
      </FieldGroup>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={!canSubmit || !!isSubmitting}
          >
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
