// src/features/Tools/NumberValidator/useNumberValidator.ts
import useFile from '@/hooks/useFile'
import wa from '@/libs/wa'
import toast from '@/utils/toast'
import { delay as sleep } from '@/utils/util'
import _ from 'lodash'
import { useCallback, useMemo, useRef, useState } from 'react'

export interface ValidationResult {
  number: string
  status: 'Valid' | 'Invalid' | 'Checking'
}

/**
 * @hook useNumberValidator
 * @description Manages the state and logic for the WhatsApp number validation feature.
 */
export const useNumberValidator = () => {
  const [numbers, setNumbers] = useState<string[]>([])
  const [results, setResults] = useState<ValidationResult[]>([])
  const [delayMin, setDelayMin] = useState(2)
  const [delayMax, setDelayMax] = useState(5)
  const [isBatchingEnabled, setIsBatchingEnabled] = useState(false)
  const [batchSize, setBatchSize] = useState(50)
  const [batchPause, setBatchPause] = useState(1)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [isValidating, setIsValidating] = useState(false)
  const validationRef = useRef(false)
  const fileExporter = useFile()

  const addNumbers = (newNumbers: string[]) => {
    const combined = [...numbers, ...newNumbers]
    const unique = _.uniq(combined.map((n) => n.trim()).filter(Boolean))
    setNumbers(unique)
    toast.success(`${newNumbers.length} numbers added. Duplicates removed.`)
  }

  const handleStopValidation = useCallback(() => {
    validationRef.current = false
    setIsValidating(false)
    toast.info('Validation stopped by user.')
  }, [])

  const estimatedTime = useMemo(() => {
    const cleanedNumbers = _.uniq(numbers.map((n) => n.trim()).filter(Boolean))
    const numberCount = cleanedNumbers.length
    if (numberCount === 0) return ''
    const averageDelay = (delayMin + delayMax) / 2
    let totalSeconds = numberCount * averageDelay
    if (isBatchingEnabled && batchSize > 0 && batchPause > 0) {
      const numberOfPauses = Math.floor((numberCount - 1) / batchSize)
      if (numberOfPauses > 0) {
        totalSeconds += numberOfPauses * batchPause * 60
      }
    }
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.round(totalSeconds % 60)
    if (minutes > 0) {
      return `About ${minutes} minute(s) and ${seconds} second(s).`
    }
    return `About ${seconds} second(s).`
  }, [numbers, delayMin, delayMax, isBatchingEnabled, batchSize, batchPause])

  const handleStartValidation = useCallback(async () => {
    const cleanedNumbers = _.uniq(
      numbers.map((n) => n.replace(/\D/g, '')).filter(Boolean),
    )
    if (cleanedNumbers.length === 0) {
      toast.error('Please add numbers to validate.')
      return
    }
    if (delayMin > delayMax) {
      toast.error('Minimum delay cannot be greater than maximum delay.')
      return
    }

    validationRef.current = true
    setIsValidating(true)
    setResults(cleanedNumbers.map((number) => ({ number, status: 'Checking' })))
    setProgress({ current: 0, total: cleanedNumbers.length })

    for (let i = 0; i < cleanedNumbers.length; i++) {
      if (!validationRef.current) break
      const currentNumberIndex = i + 1

      if (
        isBatchingEnabled &&
        currentNumberIndex % batchSize === 0 &&
        currentNumberIndex < cleanedNumbers.length
      ) {
        toast.info(
          `Batch of ${batchSize} completed. Pausing for ${batchPause} minute(s).`,
        )
        await sleep(batchPause * 60 * 1000)
        if (!validationRef.current) break
      }

      const number = cleanedNumbers[i]
      try {
        const isExist = await wa.contact.isExist(`${number}@c.us`)
        setResults((prev) =>
          prev.map((res) =>
            res.number === number
              ? { ...res, status: isExist ? 'Valid' : 'Invalid' }
              : res,
          ),
        )
      } catch (error) {
        setResults((prev) =>
          prev.map((res) =>
            res.number === number ? { ...res, status: 'Invalid' } : res,
          ),
        )
      }

      setProgress({ current: currentNumberIndex, total: cleanedNumbers.length })
      const randomDelay = Math.random() * (delayMax - delayMin) + delayMin
      await sleep(1000 * randomDelay)
    }

    setIsValidating(false)
    if (validationRef.current) {
      toast.success('Validation complete!')
    }
  }, [numbers, delayMin, delayMax, isBatchingEnabled, batchSize, batchPause])

  const handleClear = () => {
    setNumbers([])
    setResults([])
    setProgress({ current: 0, total: 0 })
  }

  // Refactored to use the centralized hook
  const handleExport = (
    records: ValidationResult[],
    format: 'csv' | 'xlsx',
  ) => {
    if (records.length === 0) {
      toast.info('No results to export.')
      return
    }
    const dataToExport = records.map(({ number, status }) => ({
      Number: number,
      Status: status,
    }))
    const filename = `number-validator-results_${new Date()
      .toISOString()
      .slice(0, 10)}`
    fileExporter.saveAs(format, dataToExport, filename)
  }

  return {
    numbers,
    setNumbers,
    delayMin,
    setDelayMin,
    delayMax,
    setDelayMax,
    isBatchingEnabled,
    setIsBatchingEnabled,
    batchSize,
    setBatchSize,
    batchPause,
    setBatchPause,
    results,
    progress,
    isValidating,
    estimatedTime,
    handleStartValidation,
    handleStopValidation,
    handleClear,
    addNumbers,
    handleExport,
  }
}
