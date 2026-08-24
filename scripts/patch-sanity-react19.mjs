import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const targetDir = path.resolve(__dirname, '../node_modules/sanity/lib')

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  if (!content.includes('useEffectEvent')) return;

  // Remove useEffectEvent from React imports
  content = content.replace(/,\s*useEffectEvent\s*,/g, ',')
  content = content.replace(/,\s*useEffectEvent\s*\}/g, '}')
  content = content.replace(/\{\s*useEffectEvent\s*,/g, '{')

  // Remove useEffectEvent from use-effect-event package
  content = content.replace(/import\s*\{\s*useEffectEvent\s*\}\s*from\s*["']use-effect-event["'];?/g, '')

  // Inject polyfill if not already injected
  if (!content.includes('const useEffectEvent = ')) {
    const polyfill = `\nimport * as ReactPolyfill from "react";\nconst useEffectEvent = (fn) => { const ref = ReactPolyfill.useRef(fn); ReactPolyfill.useInsertionEffect(() => { ref.current = fn; }, [fn]); return ReactPolyfill.useCallback((...args) => (0, ref.current)(...args), []); };\n`
    content = polyfill + content
    fs.writeFileSync(filePath, content, 'utf8')
    console.log('Patched:', filePath)
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath)
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.cjs')) {
      patchFile(fullPath)
    }
  }
}

walkDir(targetDir)
console.log('Sanity patched successfully for React 19!')
