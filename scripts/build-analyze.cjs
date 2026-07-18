process.env.ANALYZE = 'true'
require('child_process').execSync('pnpm build', { stdio: 'inherit', cwd: __dirname + '/..' })
