import { app } from 'electron'
import { existsSync } from 'fs'
import { join } from 'path'

function candidateIconPaths(iconName: string): string[] {
  const candidates: string[] = []

  if (app.isPackaged) {
    candidates.push(join(process.resourcesPath, iconName))
  }

  candidates.push(
    join(__dirname, 'resources', iconName),
    join(__dirname, '../resources', iconName),
  )

  return candidates
}

export function resolveAppIconPath(iconName: string): string | undefined {
  return candidateIconPaths(iconName).find((candidate) => existsSync(candidate))
}

export function resolvePlatformAppIconPath(): string | undefined {
  const iconName = process.platform === 'darwin'
    ? 'icon.icns'
    : process.platform === 'win32'
      ? 'icon.ico'
      : 'icon.png'

  return resolveAppIconPath(iconName)
}

export function resolveDockIconPath(): string | undefined {
  if (process.platform === 'darwin') {
    return resolveAppIconPath('fork-icon.png')
      ?? resolveAppIconPath('icon.png')
      ?? resolveAppIconPath('icon.icns')
  }

  return resolvePlatformAppIconPath()
}
