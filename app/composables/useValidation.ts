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
    const names = data.criteria.map(criterion => criterion.name.toLowerCase())
    return new Set(names).size === names.length
  }, {
    error: t('validation.criteria.unique'),
    path: ['criteria']
  }).refine((data) => {
    const total = data.criteria.reduce((sum, criterion) => sum + (Number(criterion.weight) || 0), 0)
    return total === 100
  }, {
    error: t('validation.criteria.weight.sum'),
    path: ['criteria']
  })

  const createAlternativesFormSchema = () => z.object({
    alternatives: z.array(
      z.object({
        id: z.uuid().optional(),
        name: z.string()
          .trim()
          .min(1, { error: t('validation.alternatives.name.required') })
          .max(200, { error: t('validation.alternatives.name.max') })
      })
    ).min(1, { error: t('validation.alternatives.min') })
  }).refine((data) => {
    const names = data.alternatives.map(alternative => alternative.name.toLowerCase())
    return new Set(names).size === names.length
  }, {
    error: t('validation.alternatives.unique'),
    path: ['alternatives']
  })

  const createRatingsFormSchema = () => z.object({
    ratings: z.array(
      z.object({
        alternativeId: z.uuid(),
        criterionId: z.uuid(),
        value: z.number({ error: t('validation.ratings.value.required') })
          .int({ error: t('validation.ratings.value.integer') })
          .min(1, { error: t('validation.ratings.value.min') })
          .max(5, { error: t('validation.ratings.value.max') })
      })
    ).min(1, { error: t('validation.ratings.min') })
  }).refine((data) => {
    const keys = data.ratings.map(rating => `${rating.alternativeId}:${rating.criterionId}`)
    return new Set(keys).size === keys.length
  }, {
    error: t('validation.ratings.unique'),
    path: ['ratings']
  })

  return {
    createRegisterFormSchema,
    createLoginFormSchema,
    createAnalysisFormSchema,
    createCriteriaFormSchema,
    createAlternativesFormSchema,
    createRatingsFormSchema
  }
}

export type RegisterForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createRegisterFormSchema']>>
export type LoginForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createLoginFormSchema']>>
export type AnalysisForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createAnalysisFormSchema']>>
export type CriteriaForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createCriteriaFormSchema']>>
export type AlternativesForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createAlternativesFormSchema']>>
export type RatingsForm = z.infer<ReturnType<ReturnType<typeof useValidation>['createRatingsFormSchema']>>
