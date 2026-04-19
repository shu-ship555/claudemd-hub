'use client'

import { useState, useMemo, useCallback } from 'react'
import { designTemplate, DesignConfig, FieldValue } from '@/lib/design-template'
import { generateDesignMarkdown } from '@/lib/generate-design'

export function buildInitialConfig(): DesignConfig {
  const initial: DesignConfig = {}
  for (const section of designTemplate) {
    initial[section.id] = { enabled: section.enabled }
    for (const field of section.fields) {
      if (field.type === 'multiselect') {
        initial[section.id][field.id] = field.default || []
      } else if (field.type === 'number') {
        initial[section.id][field.id] = field.toggle ? '' : field.default
      } else if (field.type === 'checkbox') {
        initial[section.id][field.id] = false
      } else {
        initial[section.id][field.id] = field.default || ''
      }
    }
  }
  return initial
}

export function useDesignConfig() {
  const [config, setConfig] = useState<DesignConfig>(() => buildInitialConfig())
  const [preview, setPreview] = useState(() =>
    generateDesignMarkdown(buildInitialConfig()),
  )

  const toggleSection = useCallback((sectionId: string) => {
    setConfig((prev) => {
      const next = {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          enabled: !prev[sectionId].enabled,
        },
      }
      setPreview(generateDesignMarkdown(next))
      return next
    })
  }, [])

  const updateField = useCallback(
    (sectionId: string, fieldId: string, value: FieldValue) => {
      setConfig((prev) => {
        const next = {
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            [fieldId]: value,
          },
        }
        setPreview(generateDesignMarkdown(next))
        return next
      })
    },
    [],
  )

  const batchUpdate = useCallback((updater: (prev: DesignConfig) => DesignConfig) => {
    setConfig((prev) => {
      const next = updater(prev)
      setPreview(generateDesignMarkdown(next))
      return next
    })
  }, [])

  return useMemo(
    () => ({ config, preview, toggleSection, updateField, batchUpdate }),
    [config, preview, toggleSection, updateField, batchUpdate],
  )
}
