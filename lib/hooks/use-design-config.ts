'use client'

import { useState, useMemo, useCallback } from 'react'
import { designTemplate, DesignConfig, FieldValue } from '@/lib/design-template'
import { generateDesignMarkdown } from '@/lib/generate-design'

function buildInitialConfig(): DesignConfig {
  const initial: DesignConfig = {}
  for (const section of designTemplate) {
    initial[section.id] = { enabled: section.enabled }
    for (const field of section.fields) {
      if (field.type === 'multiselect') {
        initial[section.id][field.id] = field.default || []
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

  return useMemo(
    () => ({ config, preview, toggleSection, updateField }),
    [config, preview, toggleSection, updateField],
  )
}
