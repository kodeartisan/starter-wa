// src/utils/util.ts
import type { BroadcastContact } from '@/libs/db'
import _ from 'lodash'

/**
 * @description Processes Spintax recursively to handle nested variations.
 * It finds patterns like {option1|option2}, randomly selects one,
 * and repeats until no patterns are left.
 * @param {string} text The text containing Spintax format.
 * @returns {string} The processed text with one variation chosen.
 */
const processSpintax = (text: string): string => {
  const spintaxRegex = /{([^{}]*)}/
  let processedText = text
  let match = spintaxRegex.exec(processedText)

  while (match) {
    const options = match[1].split('|')
    const randomIndex = Math.floor(Math.random() * options.length)
    const chosenOption = options[randomIndex]
    processedText = processedText.replace(match[0], chosenOption)
    match = spintaxRegex.exec(processedText)
  }

  return processedText
}

/**
 * @description Parses a message string by first processing Spintax for variations,
 * and then replacing personalization placeholders like {name} and {number}.
 * @param {string} message The message template.
 * @param {BroadcastContact} contact The recipient's data, containing name and number.
 * @returns {string} The fully parsed and personalized message.
 */
const text = (message: string, contact: BroadcastContact): string => {
  const contactName = contact.name || 'there'
  const contactNumber = contact.number.split('@')[0]

  return _.chain(message)
    .replace(/{name}/g, contactName)
    .replace(/{number}/g, contactNumber)
    .value()
}

export default {
  text,
}
