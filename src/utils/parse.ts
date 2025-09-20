import wa from '@/libs/wa'
import _ from 'lodash'

/**
 * @description New function to process Spintax.
 * It finds patterns like {option1|option2|etc}, randomly selects one option,
 * and replaces the pattern with the chosen option.
 * This process repeats until no Spintax patterns are left, supporting nested spintax.
 * @param {string} text The text containing Spintax format.
 * @returns {string} The processed text with variations.
 */
const processSpintax = (text: string): string => {
  const spintaxRegex = /{([^{}]*)}/
  let processedText = text
  let match = spintaxRegex.exec(processedText)

  while (match) {
    // Split options by the '|' separator
    const options = match[1].split('|')

    // Select one option randomly from the array
    const randomIndex = Math.floor(Math.random() * options.length)
    const chosenOption = options[randomIndex]

    // Replace the spintax block with the chosen option
    processedText = processedText.replace(match[0], chosenOption)

    // Find the next spintax block (to handle nested patterns)
    match = spintaxRegex.exec(processedText)
  }

  return processedText
}

const text = async (message: string, number: string) => {
  const chat = (await wa.chat.find(number)).data

  // 1. Process Spintax first to generate the message variation
  const spintaxedMessage = processSpintax(message)

  // 2. Then, process variables like {name} and {number} on the varied message
  return _.chain(spintaxedMessage)
    .thru((str) =>
      _.includes(str, '{name}') ? _.replace(str, '{name}', chat.name) : str,
    )
    .thru((str) =>
      _.includes(str, '{number}')
        ? _.replace(str, '{number}', chat.number)
        : str,
    )
    .value()
}

export default {
  text,
}
