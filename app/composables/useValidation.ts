import * as z from 'zod'
import { useI18n } from '#imports'

export const useValidation = () => {
  const { t } = useI18n()

  const createRegisterFormSchema = () => z.object({
    email: z.string({ error: t('validation.email.required') })
      .trim()
      .toLowerCase()
      .pipe(z.email({ error: t('validation.email.invalid') })),
    password: z.string({ error: t('validation.password.required') })
      .min(12, { error: t('validation.password.min') })
      .max(256, { error: t('validation.password.max') })
      .regex(/[A-Z]/, { error: t('validation.passwordUppercase') })
      .regex(/[a-z]/, { error: t('validation.passwordLowercase') })
      .regex(/[0-9]/, { error: t('validation.passwordNumber') })
      .regex(/[^A-Za-z0-9]/, { error: t('validation.passwordSpecial') }),
    passwordConfirm: z.string({ error: t('validation.password.required') })
  }).refine(data => data.password === data.passwordConfirm, {
    error: t('validation.passwordsMatch'),
    path: ['passwordConfirm']
  })

  const createLoginFormSchema = () => z.object({
    email: z.string({ error: t('validation.email.required') })
      .trim()
      .toLowerCase()
      .pipe(z.email({ error: t('validation.email.invalid') })),
    password: z.string({ error: t('validation.password.required') })
      .max(256, { error: t('validation.password.max') })
  })

  const createAnalysisFormSchema = () => z.object({
    title: z.string({ error: t('validation.analysis.title.required') })
      .min(1, { error: t('validation.analysis.title.min') })
      .max(100, { error: t('validation.analysis.title.max') }),
    description: z.string()
      .max(500, { error: t('validation.analysis.description.max') })
      .optional()
  })

  const createCriteriaFormSchema = () => z.object({
    criteria: z.array(
      z.object({
        id: z.uuid().optional(),
        name: z.string()
          .trim()
          .min(1, { error: t('validation.criteria.name.required') })
          .max(100, { error: t('validation.criteria.name.max') }),
        weight: z.number({ error: t('validation.criteria.weight.required') })
          .int({ error: t('validation.criteria.weight.integer') })
          .min(1, { error: t('validation.criteria.weight.min') })
          .max(100, { error: t('validation.criteria.weight.max') })
      })
    ).min(1, { error: t('validation.criteria.min') })
  }).refine((data) => {
    const total = data.criteria.reduce((sum, criterion) => sum + (Number(criterion.weight) || 0), 0)
    return total === 100
  }, {
    error: t('validation.criteria.weight.sum'),
    path: ['criteria']
  })

  return {
    createRegisterFormSchema,
    createLoginFormSchema,
    createAnalysisFormSchema,
    createCriteriaFormSchema
  }
}

export type RegisterForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createRegisterFormSchema']>>
export type LoginForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createLoginFormSchema']>>
export type AnalysisForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createAnalysisFormSchema']>>
export type CriteriaForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createCriteriaFormSchema']>>
