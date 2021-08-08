const fs = require('fs')
const os = require('os')
const { join } = require('path')
const d = require('date-fns')
const normalizePathSep = require('slash')

export const morethan2WeeksAgo = (date: string) => {
  const fortnightAgo = d.subDays(new Date(), 14)
  return d.isBefore(d.parse(date, 'yyyy-MM-dd', new Date()), fortnightAgo)
}

const getBudgetName = (filepath: string) => {
  const unixFilepath = normalizePathSep(filepath)

  // Most budgets are named like "Budget~51938D82.ynab4" but sometimes
  // they are only "Budget.ynab4". We only want to grab the name
  // before the ~ if it exists.
  let m = unixFilepath.match(/([^\/\~]*)\~.*\.ynab4$/)
  if (!m) {
    m = unixFilepath.match(/([^\/]*)\.ynab4$/)
  }
  if (!m) {
    return null
  }
  return m[1]
}

const findBudgetsInDir = (dir: string) => {
  if (fs.existsSync(dir)) {
    return fs
      .readdirSync(dir)
      .map((file: string) => {
        const name = getBudgetName(file)
        return name
          ? {
              name,
              filepath: join(dir, file),
            }
          : null
      })
      .filter((x: any) => x)
  }
  return []
}

export const findBudgets = (): { name: string; filepath: string }[] => {
  const budgets = findBudgetsInDir(join(os.homedir(), 'Documents', 'YNAB')).concat(
    findBudgetsInDir(join(os.homedir(), 'Dropbox', 'YNAB')),
  )
  return budgets
}

function sortByKey(arr: any[], key: string) {
  return [...arr].sort((item1, item2) => {
    if (item1[key] < item2[key]) {
      return -1
    } else if (item1[key] > item2[key]) {
      return 1
    }
    return 0
  })
}

const estimateRecentness = (str: string) => {
  // The "recentness" is the total amount of changes that this device
  // is aware of, which is estimated by summing up all of the version
  // numbers that its aware of. This works because version numbers are
  // increasing integers.
  return str.split(',').reduce((total, version) => {
    const [_, number] = version.split('-')
    return total + parseInt(number)
  }, 0)
}

const findLatestDevice = (files: string[]) => {
  let devices = files
    .map((deviceFile) => {
      const contents = fs.readFileSync(deviceFile, 'utf8')

      let data
      try {
        data = JSON.parse(contents)
      } catch (e) {
        return null
      }

      if (data.hasFullKnowledge) {
        return {
          deviceGUID: data.deviceGUID,
          shortName: data.shortDeviceId,
          recentness: estimateRecentness(data.knowledge),
        }
      }

      return null
    })
    .filter((x) => x)

  devices = sortByKey(devices, 'recentness')
  return devices[devices.length - 1]?.deviceGUID
}

export const getYNAB4Data = (filepath: string) => {
  const budgetName = getBudgetName(filepath)

  if (!budgetName) {
    throw new Error('Not a YNAB4 file: ' + filepath)
  }

  const metaStr = fs.readFileSync(join(filepath, 'Budget.ymeta'))
  const meta = JSON.parse(metaStr)
  const budgetPath = join(filepath, meta.relativeDataFolderName)

  const deviceFiles = fs.readdirSync(join(budgetPath, 'devices'))
  const deviceGUID = findLatestDevice(
    deviceFiles.map((f: string) => join(budgetPath, 'devices', f)),
  )

  const yfullPath = join(budgetPath, deviceGUID, 'Budget.yfull')
  let contents
  try {
    contents = fs.readFileSync(yfullPath, 'utf8')
  } catch (e) {
    throw new Error('Error reading Budget.yfull file')
  }

  let data
  try {
    data = JSON.parse(contents)
  } catch (e) {
    throw new Error('Error parsing Budget.yull file')
  }
  return data
}
